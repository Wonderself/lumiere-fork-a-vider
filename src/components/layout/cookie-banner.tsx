'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay so the banner animates in after mount
      const timer = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    setVisible(false)
  }

  // Don't render anything if consent already given or not yet ready to show
  if (!visible) return null

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        border-t border-white/10
        bg-black/80 backdrop-blur-xl
        transition-all duration-500 ease-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className="container mx-auto max-w-5xl px-4 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Text */}
          <p className="flex-1 text-sm text-white/70 leading-relaxed">
            Ce site utilise des cookies pour améliorer votre expérience.
            Consultez notre{' '}
            <Link
              href="/legal/cookies"
              className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors"
            >
              politique cookies
            </Link>{' '}
            pour en savoir plus.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="
                px-5 py-2 rounded-lg text-sm font-medium
                text-white/70 border border-white/10
                hover:bg-white/5 hover:text-white
                transition-all duration-200
                cursor-pointer
              "
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="
                px-5 py-2 rounded-lg text-sm font-medium
                bg-[#E50914] text-white
                hover:bg-[#FF2D2D]
                transition-all duration-200
                cursor-pointer
              "
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
