'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
          <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2 font-playfair">
          Erreur inattendue
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Un problème est survenu. Veuillez réessayer ou retourner au tableau de bord.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-[#E50914] text-white font-medium text-sm hover:bg-[#FF2D2D] transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl border border-white/10 text-white/60 font-medium text-sm hover:bg-white/[0.03] transition-colors"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  )
}
