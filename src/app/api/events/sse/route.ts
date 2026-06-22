import { auth } from '@/lib/auth'
import { registerSSEClient, unregisterSSEClient } from '@/lib/orchestration.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let clientId: string

      try {
        clientId = registerSSEClient(controller, session.user?.id)

        // Send welcome event
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`))
      } catch (err: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`))
        controller.close()
        return
      }

      // Cleanup on close (best effort — browser may not trigger this)
      // In production, the dead client detection handles cleanup
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
