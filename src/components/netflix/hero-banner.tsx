'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeroFilm {
  id: string
  title: string
  slug: string
  synopsis: string | null
  genre: string | null
  coverImageUrl: string | null
  status: string
  type: 'film' | 'catalog'
}

export function HeroBanner({ films }: { films: HeroFilm[] }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const film = films[current]

  const goTo = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
    setProgress(0)
  }, [current])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % films.length)
    setProgress(0)
  }, [films.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + films.length) % films.length)
    setProgress(0)
  }, [films.length])

  // Auto-rotate every 8 seconds with progress bar
  useEffect(() => {
    if (films.length <= 1 || isPaused) return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next()
          return 0
        }
        return p + (100 / 80) // 80 ticks over 8s = 100ms interval
      })
    }, 100)
    return () => clearInterval(interval)
  }, [films.length, isPaused, next])

  if (!film) return null

  const href = film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`

  return (
    <div
      className="relative w-full h-[65vh] sm:h-[72vh] md:h-[82vh] lg:h-[92vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image with crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={film.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={film.coverImageUrl || '/posters/keter.jpg'}
            alt={film.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic gradient overlays — layered for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
      {/* Top vignette for header blending */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A0A0A]/60 to-transparent" />

      {/* Subtle film grain texture */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}
      />

      {/* Cinematic letterbox bars (subtle) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-32 sm:pb-36 md:pb-44 px-6 sm:px-10 md:px-16 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={film.id}
            initial={{ opacity: 0, y: 40, x: direction * 30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            {/* Genre badge with line */}
            <div className="flex items-center gap-3 mb-7">
              <div className="h-[2px] w-10 bg-gradient-to-r from-[#E50914] to-[#E50914]/0" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#E50914]">
                {film.genre || 'Film'}
              </span>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-[11px] font-medium tracking-wide text-white/40">
                {film.status === 'RELEASED' || film.status === 'LIVE' ? 'Disponible maintenant' : 'En production'}
              </span>
            </div>

            {/* Title — strong cinema typography */}
            <h1
              className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5rem] font-black mb-8 md:mb-10 text-white leading-[0.92] tracking-[-0.02em]"
            >
              {film.title}
            </h1>

            {/* Synopsis with frosted glass background */}
            <div className="mb-10 md:mb-12">
              <p className="text-sm md:text-[15px] lg:text-base text-white/55 line-clamp-3 leading-[1.7] max-w-lg">
                {film.synopsis || 'Decouvrez ce projet sur CINEGENY.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-5 sm:gap-6">
              <Link
                href={href}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 md:px-10 py-3.5 md:py-4 rounded-xl text-sm md:text-[15px] font-bold text-black transition-all duration-300 hover:shadow-[0_0_50px_rgba(229,9,20,0.45)] hover:scale-[1.03] active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)' }}
              >
                <Play className="h-5 w-5 fill-black" />
                {film.status === 'RELEASED' || film.status === 'LIVE' ? 'Regarder' : 'Decouvrir'}
              </Link>
              <Link
                href={href}
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 md:py-4 rounded-xl text-sm md:text-[15px] font-semibold text-white/90 bg-white/8 hover:bg-white/15 backdrop-blur-xl border border-white/10 hover:border-white/25 transition-all duration-300"
              >
                <Info className="h-5 w-5" />
                Plus d&apos;infos
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows — always subtly visible */}
      {films.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-3 md:left-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-black/30 backdrop-blur-md border border-white/8 flex items-center justify-center opacity-40 sm:opacity-0 hover:opacity-100 focus:opacity-100 transition-all duration-300 hover:bg-black/50 hover:border-[#E50914]/30 hover:scale-110 group"
          >
            <ChevronLeft className="h-5 w-5 text-white/70 group-hover:text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-3 md:right-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-black/30 backdrop-blur-md border border-white/8 flex items-center justify-center opacity-40 sm:opacity-0 hover:opacity-100 focus:opacity-100 transition-all duration-300 hover:bg-black/50 hover:border-[#E50914]/30 hover:scale-110 group"
          >
            <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white" />
          </button>
        </>
      )}

      {/* Bottom progress bar + navigation dots */}
      {films.length > 1 && (
        <div className="absolute bottom-14 left-6 sm:left-10 md:left-16 lg:left-20 flex items-center gap-3.5">
          {films.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => goTo(idx)}
              className="group relative h-8 flex items-center"
            >
              <div className="relative h-[3px] rounded-full overflow-hidden transition-all duration-500"
                style={{ width: idx === current ? '48px' : '16px' }}
              >
                {/* Background track */}
                <div className={`absolute inset-0 rounded-full ${
                  idx === current ? 'bg-white/15' : 'bg-white/15 group-hover:bg-white/30'
                } transition-colors`} />
                {/* Active fill with animation */}
                {idx === current && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D]"
                    style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
                  />
                )}
                {/* Completed segments */}
                {idx < current && (
                  <div className="absolute inset-0 rounded-full bg-[#E50914]/50" />
                )}
              </div>
            </button>
          ))}
          <span className="text-[11px] text-white/25 ml-3 tabular-nums font-medium tracking-wider">
            {String(current + 1).padStart(2, '0')} / {String(films.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  )
}
