'use client'

import Image from 'next/image'

export function HeroManifesto() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative min-h-[48vh] md:min-h-[52vh]">
        {/* Full-bleed bg */}
        <div className="absolute inset-0">
          <Image
            src="/images/cinegen-studio-hero.jpg"
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
            Create. <span className="text-[#E50914] italic" style={{ animation: 'logoGlowPulse 4s ease-in-out infinite', animationDelay: '1s' }}>Fund.</span>{' '}
            <br className="hidden sm:block" />
            Stream Your Films.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/45 font-light max-w-md mb-0 leading-relaxed animate-[fadeSlideUp_0.7s_ease-out_0.4s_both]">
            The collaborative cinema platform powered by AI.
          </p>
          {/* Subtle animated accent line under subtitle */}
          <div className="mt-2 h-[1.5px] w-0 animate-[accentLineGrow_1.5s_ease-out_0.8s_forwards] rounded-full" style={{ background: 'linear-gradient(90deg, #E50914, #FF2D2D, transparent)' }} />
        </div>
      </div>
    </section>
  )
}
