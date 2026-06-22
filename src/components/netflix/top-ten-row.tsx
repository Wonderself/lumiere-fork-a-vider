'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface FilmCard {
  id: string
  title: string
  slug: string
  genre: string | null
  coverImageUrl: string | null
  status: string
  progressPct: number
  type: 'film' | 'catalog'
}

const FALLBACK_IMAGES = [
  '/posters/keter.jpg',
  '/posters/miracle-protocol.jpg',
  '/posters/esther-code.jpg',
  '/posters/last-train.jpg',
  '/posters/ortists.jpg',
  '/posters/the-rebbe.jpg',
  '/posters/secret-menorah.jpg',
  '/posters/meam-loez.jpg',
]

export function TopTenRow({ films }: { films: FilmCard[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const updateArrows = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 20)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (films.length === 0) return null

  const topFilms = films.slice(0, 10)

  return (
    <section className="relative group/row mb-20 md:mb-24">
      {/* Section title */}
      <div className="px-6 sm:px-10 md:px-16 lg:px-20 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-[#E50914] to-[#9B0000]" />
          <h2
            className="text-lg md:text-xl lg:text-2xl font-bold text-white/90 tracking-tight"
          >
            Top 10 Projects
          </h2>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E50914]/50 ml-1">CINEGENY</span>
        </div>
      </div>

      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 md:w-20 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex items-center justify-start pl-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <ChevronLeft className="h-5 w-5 text-white/80" />
            </div>
          </button>
        )}

        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 md:w-20 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex items-center justify-end pr-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-white/80" />
            </div>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-1 md:gap-1 overflow-x-auto scrollbar-hide px-6 sm:px-10 md:px-16 lg:px-20 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topFilms.map((film, idx) => (
            <Link
              key={film.id}
              href={film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`}
              className="group/card flex-shrink-0 flex items-end relative"
            >
              {/* Big number — positioned behind poster */}
              <div
                className="text-[70px] sm:text-[90px] md:text-[130px] lg:text-[150px] font-black leading-none select-none z-10 transition-all duration-500 group-hover/card:scale-105 font-playfair"
                style={{
                  WebkitTextStroke: '2px rgba(229, 9, 20, 0.25)',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(229, 9, 20, 0.06))',
                  marginRight: '-12px',
                }}
              >
                {idx + 1}
              </div>

              {/* Poster */}
              <div className="relative w-[105px] sm:w-[125px] md:w-[145px] lg:w-[158px] aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300 group-hover/card:scale-105 ring-1 ring-white/5 group-hover/card:ring-[#E50914]/30 group-hover/card:shadow-[0_8px_40px_rgba(229,9,20,0.15)]">
                <Image
                  src={film.coverImageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                  alt={film.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  {/* Play icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 scale-75 group-hover/card:scale-100">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(229,9,20,0.4)]" style={{ background: 'linear-gradient(135deg, #E50914, #FF2D2D)' }}>
                      <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3">
                    <p className="text-[10px] sm:text-[11px] font-bold text-white truncate">{film.title}</p>
                    {film.genre && (
                      <p className="text-[8px] sm:text-[9px] text-white/50 mt-0.5">{film.genre}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
