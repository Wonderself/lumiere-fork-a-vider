'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export function NotificationBell() {
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/count')
      if (res.ok) {
        const data = await res.json()
        setCount(data.count ?? 0)
      }
    } catch {
      // silently ignore network errors
    }
  }, [])

  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [fetchCount])

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
      aria-label={`Notifications${count > 0 ? ` (${count} non lues)` : ''}`}
    >
      <Bell className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#E50914] rounded-full shadow-[0_0_8px_rgba(229,9,20,0.4)] animate-in fade-in zoom-in duration-200">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
