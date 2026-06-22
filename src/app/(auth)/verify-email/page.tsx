import { verifyEmailAction } from '@/app/actions/auth'
import Link from 'next/link'
import { CheckCircle, XCircle, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Verification Email — CINEGENY' }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <div className="text-center space-y-6 sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-black/20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Mail className="h-10 w-10 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-playfair">
          Lien manquant
        </h2>
        <p className="text-white/50 leading-relaxed">
          Aucun token de verification fourni. Verifiez votre email ou demandez un nouveau lien.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#E50914] text-white font-semibold hover:bg-[#FF2D2D] transition-all"
        >
          Se connecter
        </Link>
      </div>
    )
  }

  const result = await verifyEmailAction(token)

  if (result.success) {
    return (
      <div className="text-center space-y-6 sm:rounded-3xl rounded-2xl border border-green-500/20 bg-green-500/[0.05] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-green-500/5">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-playfair">
          Email verifie !
        </h2>
        <p className="text-white/50 leading-relaxed">
          Votre adresse email a ete verifiee avec succes. Vous pouvez maintenant acceder a toutes les fonctionnalites de CINEGENY.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#E50914] text-white font-semibold hover:bg-[#FF2D2D] transition-all"
        >
          Se connecter
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6 sm:rounded-3xl rounded-2xl border border-red-500/20 bg-red-500/[0.05] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-red-500/5">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20">
        <XCircle className="h-10 w-10 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-white font-playfair">
        Verification echouee
      </h2>
      <p className="text-white/50 leading-relaxed">
        {result.error || 'Une erreur est survenue lors de la verification.'}
      </p>
      <Link
        href="/login"
        className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#E50914] text-white font-semibold hover:bg-[#FF2D2D] transition-all"
      >
        Se connecter
      </Link>
    </div>
  )
}
