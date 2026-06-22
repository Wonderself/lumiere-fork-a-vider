'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordAction } from '@/app/actions/auth'
import { Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react'

export function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, null)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-4">
          <KeyRound className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          Mot de passe oublié
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/20">
          {state?.success ? (
            <div className="text-center space-y-5 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E50914]/10 border border-[#E50914]/20">
                <CheckCircle className="h-8 w-8 text-[#E50914]" />
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Un email de réinitialisation a été envoyé à votre adresse.
              </p>
              <p className="text-white/30 text-xs">
                Vérifiez votre boîte de réception et vos spams.
              </p>
            </div>
          ) : (
            <form action={action} className="space-y-6">
              {state?.error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                  {state.error}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-white/70 text-sm font-medium">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    required
                    autoComplete="email"
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
                {isPending ? 'Envoi en cours...' : 'Envoyer le lien'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-white/40">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
