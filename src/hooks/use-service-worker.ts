'use client'

import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    // Register service worker after page load
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {
          // SW registration failed — not critical
        })
    })
  }, [])
}
