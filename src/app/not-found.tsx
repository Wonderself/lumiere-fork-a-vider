import Link from 'next/link'
import { Film } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20">
          <Film className="h-10 w-10 text-[#E50914]" />
        </div>

        {/* 404 */}
        <div className="space-y-3">
          <h1
            className="text-7xl font-bold text-white"
          >
            404
          </h1>
          <p className="text-lg text-white/50">
            Cette scene n&apos;existe pas encore.
          </p>
          <p className="text-sm text-white/30">
            La page que vous recherchez est introuvable ou a ete deplacee.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Retour a l&apos;accueil
          </Link>
          <Link
            href="/films"
            className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
          >
            Voir nos films
          </Link>
        </div>
      </div>
    </div>
  )
}
