'use client'

import { useEffect, useState } from 'react'
import { HeroManifesto } from './hero-manifesto'
import { FilmRow } from './film-row'
import { NetflixHeader } from './netflix-header'
import { SplashScreen } from './splash-screen'
import { Footer } from '@/components/layout/footer'
import { GENRE_ORDER, FILMS_BY_GENRE } from '@/data/films'
import Link from 'next/link'
import {
  ArrowRight,
  Vote, Star, Users, MessageSquare,
  Flame, Laugh, Drama, Microscope, BookOpen, Swords, Ghost, Heart, Wand2, Clock,
  Activity,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */

interface FilmCard {
  id: string
  title: string
  slug: string
  genre: string | null
  coverImageUrl: string | null
  status: string
  progressPct: number
  fundingPct?: number
  type: 'film' | 'catalog'
}

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

interface HomeData {
  heroFilms: HeroFilm[]
  allFilms: FilmCard[]
  catalogFilms: FilmCard[]
  genres: Record<string, FilmCard[]>
  inProduction: FilmCard[]
  inDevelopment: FilmCard[]
  released: FilmCard[]
}

/* ────────────────────────────────────────────────
   Data: Posters & Genre Films
   ──────────────────────────────────────────────── */

/* Fallback genre films — derived from the shared data module */
const FALLBACK_GENRE_FILMS: Record<string, FilmCard[]> = Object.fromEntries(
  GENRE_ORDER.map((genre) => [
    genre,
    (FILMS_BY_GENRE[genre] || []).map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      genre: f.genre,
      coverImageUrl: f.coverImageUrl,
      status: f.status,
      progressPct: f.progressPct,
      fundingPct: f.fundingPct,
      type: 'film' as const,
    })),
  ])
)

/* Deterministic shuffle: pick 1 film per genre in round-robin, then repeat — gives a good mix */
const TRENDING_FILMS: FilmCard[] = (() => {
  const mixed: FilmCard[] = []
  const maxPerRound = GENRE_ORDER.length
  for (let round = 0; round < 2; round++) {
    for (let gi = 0; gi < maxPerRound; gi++) {
      const genre = GENRE_ORDER[gi]
      const films = FALLBACK_GENRE_FILMS[genre] || []
      const pick = films[round + gi % films.length]
      if (pick) mixed.push({ ...pick, id: `trending-${round}-${gi}` })
    }
  }
  return mixed.slice(0, 20)
})()

/* ────────────────────────────────────────────────
   Genre config (icons + colors)
   ──────────────────────────────────────────────── */

const GENRE_CONFIG: Record<string, { icon: typeof Flame; color: string; colorLight: string; pattern: string; image: string }> = {
  'Action':      { icon: Flame,      color: '#E50914', colorLight: '#FF4444', pattern: 'embers',    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=400&q=80' },
  'Comedy':      { icon: Laugh,      color: '#F59E0B', colorLight: '#FCD34D', pattern: 'confetti',  image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&h=400&q=80' },
  'Drama':       { icon: Drama,      color: '#8B5CF6', colorLight: '#C4B5FD', pattern: 'curtain',   image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=400&q=80' },
  'Sci-Fi':      { icon: Microscope, color: '#3B82F6', colorLight: '#93C5FD', pattern: 'scan',      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&h=400&q=80' },
  'Documentary': { icon: BookOpen,   color: '#10B981', colorLight: '#6EE7B7', pattern: 'lens',      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=400&q=80' },
  'Thriller':    { icon: Ghost,      color: '#6366F1', colorLight: '#A5B4FC', pattern: 'shadow',    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&h=400&q=80' },
  'Animation':   { icon: Wand2,      color: '#EC4899', colorLight: '#F9A8D4', pattern: 'sparkle',   image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&h=400&q=80' },
  'Historical':  { icon: Clock,      color: '#D97706', colorLight: '#FCD34D', pattern: 'parchment', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=400&q=80' },
  'Romance':     { icon: Heart,      color: '#F43F5E', colorLight: '#FDA4AF', pattern: 'hearts',    image: 'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=800&h=400&q=80' },
  'Fantasy':     { icon: Swords,     color: '#A855F7', colorLight: '#D8B4FE', pattern: 'stars',     image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=400&q=80' },
}

/* ────────────────────────────────────────────────
   Live counter hook (fake animated counter)
   ──────────────────────────────────────────────── */

function useLiveCounter(base: number) {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(base)
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3))
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])
  return mounted ? count : null
}

/* ────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────── */

export function NetflixHome({ data }: { data: HomeData }) {
  const hasDbData = data.allFilms.length > 0

  // Now showing — a single curated row of 10 films (keeps the homepage light)
  const afficheFilms: FilmCard[] = (hasDbData ? data.allFilms : TRENDING_FILMS)
    .slice(0, 10)
    .map((f, i) => ({ ...f, id: `affiche-${i}` }))

  const voteCount = useLiveCounter(2847)
  const contributorCount = useLiveCounter(1203)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SplashScreen />
      <NetflixHeader />

      {/* ── Hero ── */}
      <HeroManifesto />

      {/* ── 3 CTA Cards ── */}
      <section className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              emoji: '🎬',
              title: 'Create a Film',
              subtitle: '7 AI-assisted steps',
              href: '/create',
              accent: '#E50914',
            },
            {
              emoji: '💰',
              title: 'Invest',
              subtitle: 'Dès $0.05 — SAFE 50% discount',
              href: '/investors',
              accent: '#10B981',
            },
            {
              emoji: '🍿',
              title: 'Regarder',
              subtitle: '100+ films, free streaming',
              href: '/films',
              accent: '#3B82F6',
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex flex-col items-center justify-center gap-3 p-7 rounded-2xl transition-all duration-400 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${card.accent}25`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ boxShadow: `0 0 40px ${card.accent}20, inset 0 0 40px ${card.accent}05` }}
              />
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-b-2xl">
                <div
                  className="h-full w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
                />
              </div>
              <span className="text-4xl">{card.emoji}</span>
              <div className="text-center">
                <p className="text-base font-black text-white tracking-wide">{card.title}</p>
                <p className="text-[12px] text-white/40 mt-1 group-hover:text-white/60 transition-colors">{card.subtitle}</p>
              </div>
              <div
                className="flex items-center gap-1.5 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                style={{ color: card.accent }}
              >
                Discover <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="relative z-10">
        {/* ── Category Pills — Cinematic genre buttons with Unsplash backgrounds ── */}
        <section className="relative pt-1 pb-4 md:pt-2 md:pb-5">
          {/* Live activity bar */}
          <div className="flex items-center gap-4 px-4 sm:px-8 md:px-16 lg:px-20 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]" />
              </span>
              <span className="text-[10px] text-white/30 font-medium">{voteCount !== null ? voteCount.toLocaleString() : '—'} votes cast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-500/60" />
              <span className="text-[10px] text-white/30 font-medium">{contributorCount !== null ? contributorCount.toLocaleString() : '—'} contributors</span>
            </div>
          </div>

          <div
            className="flex items-stretch gap-2.5 md:gap-3 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory py-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {GENRE_ORDER.map((genre, gi) => {
              const cfg = GENRE_CONFIG[genre] || { icon: Star, color: '#888', colorLight: '#aaa', pattern: 'none', image: '' }
              const Icon = cfg.icon
              const filmCount = FALLBACK_GENRE_FILMS[genre]?.length || 10
              return (
                <Link
                  key={genre}
                  href={`/films?genre=${encodeURIComponent(genre)}`}
                  className="group/pill flex-shrink-0 snap-start relative w-[130px] md:w-[160px] h-[80px] md:h-[100px] rounded-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.04] overflow-hidden"
                  style={{
                    boxShadow: `0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
                    border: `1px solid ${cfg.color}25`,
                  }}
                >
                  {/* Full background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/pill:scale-110"
                    style={{ backgroundImage: `url(${cfg.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover/pill:bg-black/35 transition-all duration-500" />
                  <div
                    className="absolute inset-0 opacity-30 group-hover/pill:opacity-50 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${cfg.color}40, transparent 70%)` }}
                  />

                  {/* Flash sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute top-0 h-full w-[50%] opacity-15 group-hover/pill:opacity-40"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${cfg.color}30, rgba(255,255,255,0.12), ${cfg.color}30, transparent)`,
                        animation: `glintSweep ${2.5 + gi * 0.15}s ease-in-out infinite`,
                        animationDelay: `${gi * 0.3}s`,
                      }}
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
                    <div
                      className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-500 group-hover/pill:scale-110 group-hover/pill:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${cfg.color}60, ${cfg.color}30)`,
                        boxShadow: `0 2px 12px ${cfg.color}40`,
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" style={{ filter: `drop-shadow(0 0 4px ${cfg.color})` }} />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-bold text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{genre}</span>
                    <span className="text-[8px] text-white/40 font-medium">{filmCount} films</span>
                  </div>

                  {/* Film count badge — top right */}
                  <div
                    className="absolute top-1.5 right-1.5 text-[7px] font-black px-1 py-0.5 rounded backdrop-blur-sm"
                    style={{ background: `${cfg.color}BB`, color: '#fff' }}
                  >
                    {filmCount}
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                    <div
                      className="h-full w-0 group-hover/pill:w-full transition-all duration-700 ease-out"
                      style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.colorLight}, ${cfg.color}, transparent)` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Now showing (single curated row of 10 films) ── */}
        <FilmRow title="Now showing" films={afficheFilms} href="/films" />

        {/* ── Vote CTA Block ── */}
        <section className="relative my-10 md:my-14 mx-4 sm:mx-8 md:mx-16 lg:mx-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 via-[#0F0808] to-[#E50914]/5" />
          <div className="absolute inset-0 bg-[url('/images/cinema-clapperboard-clouds-hero.webp')] bg-cover bg-center opacity-[0.06]" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E50914]/[0.08] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/[0.05] rounded-full blur-[80px]" />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.08]" />

          <div className="relative z-10 px-8 sm:px-10 md:px-14 py-10 md:py-14">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 mb-5 animate-[subtlePulse_3s_ease-in-out_infinite]">
                <Vote className="h-3.5 w-3.5 text-[#E50914]" />
                <span className="text-[11px] font-bold text-[#E50914] uppercase tracking-wider">Community Governance</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight leading-[1.1] section-title-flash">
                Vote for the Next Film.
              </h2>
              <p className="text-sm md:text-base text-white/40 max-w-lg mb-8 leading-relaxed">
                Every film on CINEGENY is shaped by its community. Submit your stories, vote on scripts, and help decide what gets produced next.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: MessageSquare, title: 'Submit a Story', desc: 'Propose your screenplay idea', href: '/community/scenarios', accent: '#E50914' },
                  { icon: Vote, title: 'Vote on Scripts', desc: 'Read and vote for your favorites', href: '/community/scenarios', accent: '#F59E0B' },
                  { icon: Users, title: 'Join Community', desc: 'Collaborate and earn Lumens', href: '/community', accent: '#3B82F6' },
                ].map((cta) => (
                  <Link
                    key={cta.title}
                    href={cta.href}
                    className="group relative p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-500 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/0 group-hover:via-white/15 to-transparent transition-all duration-700" />
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110"
                      style={{ background: `${cta.accent}15` }}
                    >
                      <cta.icon className="h-4 w-4" style={{ color: cta.accent }} />
                    </div>
                    <p className="text-[13px] font-bold text-white mb-1 group-hover:text-white transition-colors">{cta.title}</p>
                    <p className="text-[11px] text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">{cta.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      </div>

      <Footer />
    </div>
  )
}
