'use client'

import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay for a smooth slide-up animation after mount
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all')
    setVisible(false)
  }

  const handleEssentialOnly = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[60]
        border-t border-white/10
        bg-[#141414]/95 backdrop-blur-md
        transition-all duration-500 ease-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className="container mx-auto max-w-4xl px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* Message */}
          <p className="flex-1 text-xs sm:text-sm text-white/60 leading-relaxed text-center sm:text-left">
            Ce site utilise des cookies pour am&eacute;liorer votre exp&eacute;rience.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleEssentialOnly}
              className="
                px-4 py-1.5 rounded-md text-xs font-medium
                text-white/60 border border-white/10
                hover:bg-white/5 hover:text-white/80
                transition-all duration-200
                cursor-pointer
              "
            >
              Essentiels uniquement
            </button>
            <button
              onClick={handleAcceptAll}
              className="
                px-4 py-1.5 rounded-md text-xs font-medium
                bg-[#E50914] text-white
                hover:bg-[#FF2D2D]
                transition-all duration-200
                cursor-pointer
              "
            >
              Accepter tout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
