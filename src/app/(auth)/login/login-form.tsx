'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

function sanitizeCallbackUrl(url: string | null): string {
  if (!url) return '/dashboard'
  if (url.startsWith('/') && !url.startsWith('//') && !url.includes('\\')) return url
  return '/dashboard'
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const callbackUrl = sanitizeCallbackUrl(searchParams.get('callbackUrl'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(loginEmail: string, loginPassword: string) {
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect.')
        setLoading(false)
      } else {
        // Success — full page navigation (no flash)
        window.location.href = callbackUrl
      }
    } catch {
      setError('Erreur de connexion. Réessayez.')
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Email et mot de passe requis.')
      return
    }
    handleLogin(email, password)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-4">
          <Sparkles className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          <span className="text-shimmer">{t('welcome')}</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">{t('studio_subtitle')}</p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-400 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="email" className="text-white/70 text-sm font-medium block">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com ou admin123"
                  required
                  autoComplete="username"
                  className="w-full pl-11 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-white/70 text-sm font-medium">{t('password')}</label>
                <Link href="/forgot-password" className="text-xs text-white/30 hover:text-[#E50914] transition-colors duration-300">
                  {t('forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : t('sign_in')}
              </button>
            </div>
          </form>

          {/* OAuth */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-xs text-white/20 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="mt-5 w-full h-12 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.39 14.97.4 12 .4A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 4.75 12 4.75Z" />
            </svg>
            Continue with Google
          </button>

          {/* Demo accounts */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-xs text-white/20 uppercase tracking-widest">{t('demo_accounts')}</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <div className="mt-5 space-y-3.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleLogin('admin123', 'admin123')}
              className="w-full rounded-xl bg-[#E50914]/[0.06] border border-[#E50914]/15 hover:border-[#E50914]/30 hover:bg-[#E50914]/10 p-3.5 text-left transition-all duration-300 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#E50914]/80 group-hover:text-[#E50914]">Admin</p>
                  <p className="text-[11px] text-white/35 mt-0.5">admin123 / admin123</p>
                </div>
                <span className="text-[10px] text-[#E50914]/40 group-hover:text-[#E50914]/70 uppercase tracking-wider font-medium">
                  {loading ? 'Signing in...' : t('quick_login')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-white/40">
        {t('no_account_yet')}{' '}
        <Link href="/register" className="text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300 font-medium">
          {t('create_account')}
        </Link>
      </p>
    </div>
  )
}
