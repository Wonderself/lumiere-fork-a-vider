'use client'

import { useActionState, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerAction } from '@/app/actions/auth'
import { CheckCircle, UserPlus, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

const VALID_ROLES = ['CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'SCREENWRITER', 'VIEWER']

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const [state, action, isPending] = useActionState(registerAction, {})
  const [showPassword, setShowPassword] = useState(false)

  // Optional deep-link role (e.g. ?role=SCREENWRITER) — kept hidden, not a required choice.
  const urlRole = searchParams.get('role')?.toUpperCase() || ''
  const role = VALID_ROLES.includes(urlRole) ? urlRole : 'CONTRIBUTOR'

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push('/login?registered=1'), 2000)
    }
  }, [state.success, router])

  if (state.success) {
    return (
      <div className="text-center space-y-5 sm:rounded-3xl rounded-2xl border border-green-500/20 bg-green-500/[0.05] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-green-500/5">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-playfair">{t('account_created')}</h2>
        <p className="text-white/50 leading-relaxed">
          {t('check_email')}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-white/30">
          <div className="w-4 h-4 border-2 border-white/20 border-t-[#E50914] rounded-full animate-spin" />
          {t('redirecting')}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-4">
          <UserPlus className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          <span className="text-shimmer">{role === 'SCREENWRITER' ? t('become_screenwriter') : t('join_cinegeny')}</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          Create your free account. Watch, vote, and unlock everything else whenever you want.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/20">
          <form action={action} className="space-y-7">
            <input type="hidden" name="role" value={role} />

            {state.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                {state.error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-3">
              <Label htmlFor="displayName" className="text-white/70 text-sm font-medium">{t('name_pseudo')}</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="Jane Doe"
                  required
                  minLength={2}
                  className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-white/70 text-sm font-medium">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password_min')}
                  required
                  minLength={8}
                  className="pl-11 pr-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                  aria-label={showPassword ? t('hide_password') : t('show_password')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="golden-border-btn golden-border-always w-full h-12 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                size="lg"
                loading={isPending}
              >
                {isPending ? t('creating_account') : t('sign_up')}
              </Button>
            </div>

            <p className="text-xs text-white/25 text-center leading-relaxed">
              {t('terms_agree')}{' '}
              <Link href="/legal/terms" className="text-[#E50914]/50 hover:text-[#E50914] transition-colors duration-300">{t('terms_link')}</Link>
              {' '}{t('terms_and')}{' '}
              <Link href="/legal/privacy" className="text-[#E50914]/50 hover:text-[#E50914] transition-colors duration-300">{t('privacy_link')}</Link>.
            </p>
          </form>
        </div>
      </div>

      <p className="text-center text-sm text-white/40">
        {t('already_account')}{' '}
        <Link href="/login" className="text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300 font-medium">
          {t('sign_in')}
        </Link>
      </p>
    </div>
  )
}
