import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Server-Sent Events (SSE) for real-time notifications.
 *
 * Client connects → receives notification updates in real-time.
 * Falls back to polling if SSE is not supported.
 *
 * Usage:
 *   const eventSource = new EventSource('/api/notifications/stream')
 *   eventSource.onmessage = (e) => { const data = JSON.parse(e.data); ... }
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ userId, timestamp: Date.now() })}\n\n`)
      )

      let lastCheckTime = new Date()
      let isActive = true

      // Poll for new notifications every 5 seconds
      const interval = setInterval(async () => {
        if (!isActive) {
          clearInterval(interval)
          return
        }

        try {
          const newNotifications = await prisma.notification.findMany({
            where: {
              userId,
              createdAt: { gt: lastCheckTime },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          })

          if (newNotifications.length > 0) {
            lastCheckTime = new Date()

            for (const notif of newNotifications) {
              const data = JSON.stringify({
                id: notif.id,
                type: notif.type,
                title: notif.title,
                body: notif.body,
                href: notif.href,
                createdAt: notif.createdAt,
              })
              controller.enqueue(encoder.encode(`event: notification\ndata: ${data}\n\n`))
            }

            // Also send updated unread count
            const unreadCount = await prisma.notification.count({
              where: { userId, read: false },
            })
            controller.enqueue(
              encoder.encode(`event: count\ndata: ${JSON.stringify({ unread: unreadCount })}\n\n`)
            )
          }

          // Heartbeat every cycle to keep connection alive
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch (err) {
          console.error('[SSE] Error checking notifications:', err)
          // Don't close the stream on transient errors
        }
      }, 5000)

      // Clean up when client disconnects
      req.signal.addEventListener('abort', () => {
        isActive = false
        clearInterval(interval)
        try {
          controller.close()
        } catch {
          // Already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Nginx: disable buffering
    },
  })
}
