'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Auth Error]', error)
  }, [error])

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
          <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2 font-playfair">
          Une erreur est survenue
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Un probl&egrave;me est survenu lors de l&apos;authentification. Veuillez r&eacute;essayer.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-[#E50914] text-white font-medium text-sm hover:bg-[#FF2D2D] transition-colors"
          >
            R&eacute;essayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl border border-white/20 text-white/70 font-medium text-sm hover:bg-white/5 transition-colors"
          >
            Retour &agrave; l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
