'use client'

import Link from 'next/link'
import { Film, Tv, Users, Award, Pen, BarChart3, MapPin, Code2, Tag, Star, Clapperboard, Briefcase, Coins } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="relative border-t border-white/[0.04] bg-[#060606] pt-20 md:pt-24 pb-12 md:pb-16 mt-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-[0.15em] text-white">
                CINE<span className="text-[#E50914]">GENY</span>
              </span>
            </Link>
            <p className="text-[13px] text-white/30 leading-[1.8] max-w-sm">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Paris</span>
              <div className="h-1 w-1 rounded-full bg-[#E50914]/30" />
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Jerusalem</span>
            </div>
          </div>

          {/* Platform */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t('section_platform')}</h4>
            <ul className="space-y-3.5">
              <li><Link href="/films" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Film className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_films')}</Link></li>
              <li><Link href="/streaming" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Tv className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_streaming')}</Link></li>
              <li><Link href="/community" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Users className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_community')}</Link></li>
              <li><Link href="/leaderboard" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><BarChart3 className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_leaderboard')}</Link></li>
              <li><Link href="/roadmap" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><MapPin className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_roadmap')}</Link></li>
              <li><Link href="/pricing" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Tag className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_pricing')}</Link></li>
              <li><Link href="/developers" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Code2 className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_developer_api')}</Link></li>
            </ul>
          </div>

          {/* Create */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t('section_create')}</h4>
            <ul className="space-y-3.5">
              <li><Link href="/register" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Users className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_create_account')}</Link></li>
              <li><Link href="/register?role=SCREENWRITER" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Pen className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_submit_screenplay')}</Link></li>
              <li><Link href="/tasks" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Award className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_tasks')}</Link></li>
              <li><Link href="/actors" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Users className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_actors')}</Link></li>
              <li><Link href="/act" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Star className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_act')}</Link></li>
              <li><Link href="/produce" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Clapperboard className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_produce')}</Link></li>
              <li><Link href="/work" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#E50914] transition-colors"><Briefcase className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_work')}</Link></li>
              <li><Link href="/points" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-amber-400 transition-colors"><Coins className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />{t('link_points')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t('section_legal')}</h4>
            <ul className="space-y-3.5">
              <li><Link href="/legal/terms" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{t('link_terms')}</Link></li>
              <li><Link href="/legal/privacy" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{t('link_privacy')}</Link></li>
              <li><Link href="/legal/cookies" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{t('link_cookies')}</Link></li>
              <li><Link href="/about" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{t('link_about')}</Link></li>
              <li><Link href="/invest" className="text-[13px] text-white/25 hover:text-[#E50914] transition-colors font-medium">{t('link_investors')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-10 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/10 tracking-wider">{t('powered_by')}</span>
            <span className="text-[10px] text-white/20 font-medium">Next.js</span>
            <span className="text-[10px] text-white/10">&middot;</span>
            <span className="text-[10px] text-white/20 font-medium">Claude AI</span>
            <span className="text-[10px] text-white/10">&middot;</span>
            <span className="text-[10px] text-white/20 font-medium">Blockchain</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
