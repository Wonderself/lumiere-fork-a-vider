'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setLocaleAction } from '@/app/actions/locale'
import { locales, localeFlags, localeNames, type Locale } from '@/i18n/config'
import { Globe } from 'lucide-react'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleChange(newLocale: Locale) {
    startTransition(async () => {
      await setLocaleAction(newLocale)
      router.refresh()
    })
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-xs font-medium uppercase">{locale}</span>
      </button>
      <div className="absolute right-0 top-full mt-1 py-1 min-w-[140px] rounded-xl bg-[#111] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => handleChange(l)}
            disabled={isPending || l === locale}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all ${
              l === locale
                ? 'text-[#E50914] bg-[#E50914]/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base">{localeFlags[l]}</span>
            <span>{localeNames[l]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
