'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  ThumbsUp,
  ThumbsDown,
  Film,
  ChevronRight,
  Users,
  DollarSign,
  Briefcase,
  CheckSquare,
} from 'lucide-react'
import { ALL_FILMS, NAMED_POSTERS, type FilmData } from '@/data/films'

/* ── Helpers ── */

function getPoster(film: FilmData): string | null {
  if (NAMED_POSTERS[film.title]) return NAMED_POSTERS[film.title]
  return film.coverImageUrl
}

function isUnsplash(url: string | null): boolean {
  return !!url && url.includes('unsplash.com')
}

function seededRandom(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h % 451) + 50 // 50-500
}

/* ── Categories ── */

type CategoryKey = 'all' | 'released' | 'inProduction' | 'trailers' | 'submittedToVote'

const CATEGORY_TABS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Films' },
  { key: 'released', label: 'Released' },
  { key: 'inProduction', label: 'In Production' },
  { key: 'trailers', label: 'Trailers' },
  { key: 'submittedToVote', label: 'Submitted to Vote' },
]

function categorizeFilms(films: FilmData[]) {
  const released: FilmData[] = []
  const inProduction: FilmData[] = []
  const trailers: FilmData[] = []
  const submittedToVote: FilmData[] = []

  for (const f of films) {
    if (f.fundingPct < 30) submittedToVote.push(f)
    if (f.status === 'POST_PRODUCTION') released.push(f)
    else if (f.status === 'IN_PRODUCTION') inProduction.push(f)
    else if (f.status === 'PRE_PRODUCTION' || f.status === 'DRAFT') trailers.push(f)
  }

  return { released, inProduction, trailers, submittedToVote }
}

/* ── Sub-components ── */

function GenreBadge({ genre }: { genre: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30">
      {genre}
    </span>
  )
}

function FundingBar({ pct }: { pct: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/40">Funding</span>
        <span className="text-[#E50914] font-medium">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  )
}

function ProgressBar({ pct, label }: { pct: number; label?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/40">{label ?? 'Progress'}</span>
        <span className="text-[#E50914] font-medium">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  )
}

/* ── Standard Film Card (Released / In Production) ── */

function StandardCard({ film }: { film: FilmData }) {
  const poster = getPoster(film)
  return (
    <Link href={`/films/${film.slug}`}>
      <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-[#E50914]/30 transition-all duration-500 h-full flex flex-col">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-[#E50914]/[0.06] to-white/[0.03] shrink-0">
          {poster ? (
            <Image
              src={poster}
              alt={film.title}
              fill
              unoptimized={isUnsplash(poster)}
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="h-14 w-14 text-[#E50914]/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <GenreBadge genre={film.genre} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-sm mb-2 text-white group-hover:text-[#E50914] transition-colors line-clamp-2">
            {film.title}
          </h3>
          <p className="text-[11px] text-white/50 mb-4 line-clamp-2 flex-1">{film.synopsis}</p>
          <ProgressBar pct={film.progressPct} />
          {film.fundingPct < 100 && <div className="mt-2"><FundingBar pct={film.fundingPct} /></div>}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
            <span className="text-[11px] text-white/40">{film.director}</span>
            <ChevronRight className="h-4 w-4 text-[#E50914]/50 group-hover:text-[#E50914] transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Trailer Card (wide 16:9) ── */

function TrailerCard({ film }: { film: FilmData }) {
  const poster = getPoster(film)
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-[#E50914]/30 transition-all duration-500">
      <div className="relative aspect-video bg-gradient-to-br from-[#E50914]/[0.06] to-white/[0.03]">
        {poster ? (
          <Image
            src={poster}
            alt={film.title}
            fill
            unoptimized={isUnsplash(poster)}
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="h-16 w-16 text-[#E50914]/20" />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#E50914]/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#E50914]/30">
            <Play className="h-7 w-7 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <GenreBadge genre={film.genre} />
          </div>
          <h3 className="font-semibold text-base text-white mb-3 line-clamp-1">{film.title}</h3>

          {film.fundingPct < 100 && <FundingBar pct={film.fundingPct} />}

          {/* Needs tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { icon: CheckSquare, label: 'Votes' },
              { icon: DollarSign, label: 'Funding' },
              { icon: Briefcase, label: 'Workers' },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/60 border border-white/10"
              >
                <tag.icon className="h-3 w-3" />
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Watch Trailer button */}
      <div className="p-4">
        <button className="w-full py-2.5 rounded-xl bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] text-sm font-medium hover:bg-[#E50914]/20 transition-colors flex items-center justify-center gap-2">
          <Play className="h-4 w-4" />
          Watch Trailer
        </button>
      </div>
    </div>
  )
}

/* ── Vote Card (Submitted to Vote) ── */

function VoteCard({ film }: { film: FilmData }) {
  const poster = getPoster(film)
  const voteCount = seededRandom(film.id)
  const approvalPct = 40 + seededRandom(film.slug + 'a') % 45 // 40-84%

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-[#E50914]/30 transition-all duration-500">
      {/* Poster */}
      <div className="relative aspect-[3/2] bg-gradient-to-br from-[#E50914]/[0.06] to-white/[0.03] shrink-0">
        {poster ? (
          <Image
            src={poster}
            alt={film.title}
            fill
            unoptimized={isUnsplash(poster)}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="h-12 w-12 text-[#E50914]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <GenreBadge genre={film.genre} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h3 className="font-semibold text-sm text-white line-clamp-1">{film.title}</h3>

        {/* Vote count */}
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          <Users className="h-3.5 w-3.5" />
          <span>{voteCount} votes</span>
        </div>

        {/* Approval bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-green-400">Approve {approvalPct}%</span>
            <span className="text-red-400">Reject {100 - approvalPct}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-green-500 rounded-l-full"
              style={{ width: `${approvalPct}%` }}
            />
            <div
              className="h-full bg-red-500 rounded-r-full"
              style={{ width: `${100 - approvalPct}%` }}
            />
          </div>
        </div>

        {/* Stake info */}
        <div className="text-center text-[11px] text-white/40 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          Stake <span className="text-[#E50914] font-medium">5 points</span> to vote
        </div>

        {/* Vote buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
            <ThumbsUp className="h-3.5 w-3.5" />
            Approve
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
            <ThumbsDown className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Section Header ── */

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 border border-white/[0.06]">
        {count}
      </span>
    </div>
  )
}

/* ── Main Component ── */

export default function FilmCategories() {
  const [activeTab, setActiveTab] = useState<CategoryKey>('all')

  const categories = useMemo(() => categorizeFilms(ALL_FILMS), [])

  const showSection = (key: CategoryKey) => activeTab === 'all' || activeTab === key

  return (
    <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-20">
      {/* Top separator */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="container mx-auto max-w-7xl">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Catalogue{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CINEGENY
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            Explorez notre catalogue complet de films par categorie
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="sticky top-16 z-30 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-20 px-4 sm:px-8 md:px-16 lg:px-20 py-4 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06] mb-12">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#E50914] rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Released ── */}
        {showSection('released') && categories.released.length > 0 && (
          <div className="mb-16">
            <SectionHeader title="Released" count={categories.released.length} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {categories.released.map((film) => (
                <StandardCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        )}

        {/* ── In Production ── */}
        {showSection('inProduction') && categories.inProduction.length > 0 && (
          <div className="mb-16">
            <SectionHeader title="In Production" count={categories.inProduction.length} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {categories.inProduction.map((film) => (
                <StandardCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        )}

        {/* ── Trailers (Bandes-Annonces) ── */}
        {showSection('trailers') && categories.trailers.length > 0 && (
          <div className="mb-16">
            <SectionHeader title="Bandes-Annonces" count={categories.trailers.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.trailers.map((film) => (
                <TrailerCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        )}

        {/* ── Submitted to Vote ── */}
        {showSection('submittedToVote') && categories.submittedToVote.length > 0 && (
          <div className="mb-16">
            <SectionHeader title="Submitted to Vote" count={categories.submittedToVote.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.submittedToVote.map((film) => (
                <VoteCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
