'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type Notification = {
  id: string
  type: string
  title: string
  message: string
  link?: string
  createdAt: string
}

type UseNotificationsOptions = {
  enabled?: boolean
  onNotification?: (notification: Notification) => void
}

/**
 * Hook for real-time notifications via SSE.
 *
 * Falls back to polling if SSE is not available.
 *
 * Usage:
 *   const { unreadCount, notifications, connected } = useNotifications({
 *     onNotification: (n) => toast(n.title)
 *   })
 */
export function useNotifications({ enabled = true, onNotification }: UseNotificationsOptions = {}) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [connected, setConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 5

  const connect = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      const es = new EventSource('/api/notifications/stream')
      eventSourceRef.current = es

      es.addEventListener('connected', () => {
        setConnected(true)
        retryCountRef.current = 0
      })

      es.addEventListener('notification', (e) => {
        try {
          const notif: Notification = JSON.parse(e.data)
          setNotifications(prev => [notif, ...prev].slice(0, 50))
          onNotification?.(notif)
        } catch {
          // Ignore parse errors
        }
      })

      es.addEventListener('count', (e) => {
        try {
          const { unread } = JSON.parse(e.data)
          setUnreadCount(unread)
        } catch {
          // Ignore
        }
      })

      es.onerror = () => {
        setConnected(false)
        es.close()
        eventSourceRef.current = null

        // Retry with exponential backoff
        if (retryCountRef.current < maxRetries) {
          const delay = Math.min(1000 * 2 ** retryCountRef.current, 30000)
          retryCountRef.current++
          setTimeout(connect, delay)
        }
      }
    } catch {
      // SSE not supported — fall back to polling
      setConnected(false)
    }
  }, [enabled, onNotification])

  useEffect(() => {
    connect()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [connect])

  // Initial unread count fetch
  useEffect(() => {
    if (!enabled) return
    fetch('/api/notifications/count')
      .then(r => r.json())
      .then(d => setUnreadCount(d.count || 0))
      .catch((err) => console.error("[Notifications] Failed to fetch unread count:", err))
  }, [enabled])

  return { unreadCount, notifications, connected }
}
