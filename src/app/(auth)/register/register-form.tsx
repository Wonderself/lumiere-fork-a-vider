'use client'

import { useActionState, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { registerAction } from '@/app/actions/auth'
import { signIn as nextAuthSignIn } from 'next-auth/react'
import { SKILLS, LANGUAGES } from '@/lib/constants'
import { CheckCircle, UserPlus, User, Mail, Lock, Link2, Briefcase, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

const VALID_ROLES = ['CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'SCREENWRITER', 'VIEWER']

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const [state, action, isPending] = useActionState(registerAction, {})
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Français'])
  const [showPassword, setShowPassword] = useState(false)

  // Auto-select role from URL param (e.g. ?role=SCREENWRITER)
  const urlRole = searchParams.get('role')?.toUpperCase() || ''
  const [role, setRole] = useState(VALID_ROLES.includes(urlRole) ? urlRole : 'CONTRIBUTOR')

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

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
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
          <span className="text-shimmer">{role === 'SCREENWRITER' ? t('become_screenwriter') : t('join_cinegen')}</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          {role === 'SCREENWRITER'
            ? t('screenwriter_subtitle')
            : t('register_subtitle_default')}
        </p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/20">
          <form action={action} className="space-y-7">
            {/* Hidden fields for arrays */}
            {selectedSkills.map((skill) => (
              <input key={skill} type="hidden" name="skills" value={skill} />
            ))}
            {selectedLanguages.map((lang) => (
              <input key={lang} type="hidden" name="languages" value={lang} />
            ))}
            <input type="hidden" name="role" value={role} />

            {state.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                {state.error}
              </div>
            )}

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="displayName" className="text-white/70 text-sm font-medium">{t('name_pseudo')}</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="Jean Dupont"
                    required
                    minLength={2}
                    className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white/70 text-sm font-medium">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    required
                    className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                  />
                </div>
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

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Role */}
            <div className="space-y-3">
              <Label className="text-white/70 text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-[#E50914]/60" />
                {t('desired_role')}
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white focus:border-[#E50914]/40 focus:ring-[#E50914]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTRIBUTOR">Contributeur Créatif</SelectItem>
                  <SelectItem value="ARTIST">Artiste / Directeur Artistique</SelectItem>
                  <SelectItem value="STUNT_PERFORMER">Cascadeur / Performer</SelectItem>
                  <SelectItem value="SCREENWRITER">Scénariste</SelectItem>
                  <SelectItem value="VIEWER">Spectateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Portfolio URL */}
            <div className="space-y-3">
              <Label htmlFor="portfolioUrl" className="text-white/70 text-sm font-medium flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-[#E50914]/60" />
                Portfolio URL <span className="text-white/25">{t('portfolio_optional')}</span>
              </Label>
              <Input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                placeholder="https://votre-portfolio.com"
                className="h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
              />
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Skills */}
            <div className="space-y-3">
              <Label className="text-white/70 text-sm font-medium">
                {t('skills_count')} <span className="text-[#E50914]/60">({selectedSkills.length})</span>
              </Label>
              <div className="flex flex-wrap gap-2.5">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-300 ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#E50914]/15 border-[#E50914]/30 text-[#E50914] shadow-sm shadow-[#E50914]/10 scale-[1.02]'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <Label className="text-white/70 text-sm font-medium">{t('languages_mastered')}</Label>
              <div className="flex flex-wrap gap-2.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-300 ${
                      selectedLanguages.includes(lang)
                        ? 'bg-[#E50914]/15 border-[#E50914]/30 text-[#E50914] shadow-sm shadow-[#E50914]/10 scale-[1.02]'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
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
