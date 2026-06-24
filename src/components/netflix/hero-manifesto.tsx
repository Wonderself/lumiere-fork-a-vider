'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Vote } from 'lucide-react'

export function HeroManifesto() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative min-h-[48vh] md:min-h-[52vh]">
        {/* Full-bleed bg */}
        <div className="absolute inset-0">
          <Image
            src="/images/cinegeny-studio-hero.jpg"
            alt="CINEGENY Studio"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        {/* Content at bottom */}
        <div className="relative z-10 flex flex-col justify-end min-h-[48vh] md:min-h-[52vh] max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-20 pb-10 md:pb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-4 animate-[fadeSlideUp_0.8s_ease-out_0.1s_both] section-title-flash">
            Watch. <span className="text-[#E50914] italic" style={{ animation: 'logoGlowPulse 4s ease-in-out infinite', animationDelay: '1s' }}>Vote.</span>{' '}
            <br className="hidden sm:block" />
            Shape the films.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/55 font-light max-w-lg mb-6 leading-relaxed animate-[fadeSlideUp_0.7s_ease-out_0.4s_both]">
            Stream AI films for free, vote for the ones that get made next — and submit your own idea.
          </p>
          <div className="flex flex-wrap items-center gap-3 animate-[fadeSlideUp_0.7s_ease-out_0.6s_both]">
            <Link href="/vote" className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold text-sm shadow-lg shadow-[#E50914]/25 transition-all hover:-translate-y-0.5">
              <Vote className="h-4 w-4" /> Vote on films <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/films" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium text-sm transition-colors">
              <Play className="h-4 w-4" /> Watch free
            </Link>
          </div>
          <Link href="/participate" className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-white/45 hover:text-white/75 transition-colors animate-[fadeSlideUp_0.7s_ease-out_0.8s_both]">
            Got a story, or want to produce? Participate <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
