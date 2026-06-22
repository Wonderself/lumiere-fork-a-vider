'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3 font-playfair">
          Une erreur est survenue
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#E50914] text-white font-medium text-sm hover:bg-[#FF2D2D] transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
