'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordAction } from '@/app/actions/auth'
import { Lock, CheckCircle, AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function ResetPasswordForm({ token }: { token?: string }) {
  const [state, action, isPending] = useActionState(resetPasswordAction, null)

  if (!token) {
    return (
      <div className="space-y-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
            Lien invalide
          </h1>
          <p className="text-white/50 text-sm sm:text-base">
            Ce lien de reinitialisation est invalide ou a expire.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-red-500/10 via-transparent to-red-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/20 text-center space-y-5">
            <p className="text-white/50 text-sm leading-relaxed">
              Veuillez demander un nouveau lien de reinitialisation.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full h-12 leading-[3rem] rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-white/40">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour a la connexion
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-4">
          <ShieldCheck className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          <span className="text-shimmer">Nouveau mot de passe</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/20">
          {state?.success ? (
            <div className="text-center space-y-5 py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white font-playfair">
                Mot de passe reinitialise !
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <Link
                href="/login"
                className="inline-block w-full h-12 leading-[3rem] rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-6">
              <input type="hidden" name="token" value={token} />

              {state?.error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                  {state.error}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white/70 text-sm font-medium">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimum 8 caracteres"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-white/70 text-sm font-medium">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Retapez le mot de passe"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                size="lg"
                loading={isPending}
              >
                {isPending ? 'Reinitialisation...' : 'Reinitialiser le mot de passe'}
              </Button>
            </form>
          )}
        </div>
      </div>

      {!state?.success && (
        <p className="text-center text-sm text-white/40">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour a la connexion
          </Link>
        </p>
      )}
    </div>
  )
}
