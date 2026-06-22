import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { Film, ArrowRight, Coins, Crown, Vote, TrendingUp, Bell, Clock, Users, Star, Calendar, Tag } from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'
import { FilmTimeline } from '@/components/film-timeline'
import { SocialShare } from '@/components/social-share'
import { FilmReviews } from '@/components/film-reviews'
import { FilmVoteButton } from '@/components/film-vote-button'
import { WatchlistButton } from '@/components/watchlist-button'
import { FILMS_BY_SLUG, FILMS_BY_GENRE } from '@/data/films'
import { getFilmCreditsAction } from '@/app/actions/credits'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = await prisma.film.findUnique({ where: { slug } })
  if (film) {
    return {
      title: `${film.title} — CINEGENY`,
      description: film.description || film.synopsis || `${film.title} on CINEGENY`,
      openGraph: {
        title: `${film.title} — CINEGENY`,
        description: film.description || film.synopsis || undefined,
        images: film.coverImageUrl ? [film.coverImageUrl] : undefined,
      },
    }
  }
  // Fallback to shared data
  const fake = FILMS_BY_SLUG[slug]
  if (fake) {
    return {
      title: `${fake.title} — CINEGENY`,
      description: fake.synopsis || `${fake.title} on CINEGENY`,
      openGraph: {
        title: `${fake.title} — CINEGENY`,
        description: fake.synopsis || undefined,
      },
    }
  }
  return { title: 'Film Not Found — CINEGENY' }
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params

  const film = await prisma.film.findUnique({
    where: { slug, isPublic: true },
    include: {
      phases: {
        orderBy: { phaseOrder: 'asc' },
        include: {
          tasks: {
            where: { status: { in: ['AVAILABLE', 'CLAIMED', 'VALIDATED'] } },
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { tasks: true } },
        },
      },
      tokenOffering: true,
      _count: { select: { tasks: true, votes: true, backers: true } },
    },
  })

  // If DB has the film, render the full DB-driven page
  if (film) {
    const { credits } = await getFilmCreditsAction(slug)
    return <DbFilmPage film={film} credits={credits} />
  }

  // Fallback: check shared catalog data
  const fakeFilm = FILMS_BY_SLUG[slug]
  if (!fakeFilm) notFound()

  return <CatalogFilmPage film={fakeFilm} />
}

/* ─────────────────────────────────────────────
   DB Film Page (full features)
   ───────────────────────────────────────────── */

type FilmCredit = Awaited<ReturnType<typeof getFilmCreditsAction>>['credits'][number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DbFilmPage({ film, credits }: { film: any; credits: FilmCredit[] }) {
  const availableTasks = 0 // Already counted in the main function for DB films

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis || film.description || undefined,
    genre: film.genre || undefined,
    image: film.coverImageUrl || undefined,
    url: `https://cinegen.studio/films/${film.slug}`,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGENY Studio',
      url: 'https://cinegen.studio',
    },
    dateCreated: film.createdAt.toISOString(),
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Banner */}
      <div className="relative h-72 md:h-96">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E50914]/10 via-purple-900/20 to-black flex items-center justify-center">
            <Film className="h-24 w-24 text-[#E50914]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 container mx-auto max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default">{film.genre || 'Film IA'}</Badge>
                <Badge variant="secondary">{FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status}</Badge>
                {availableTasks > 0 && (
                  <Badge variant="success">{availableTasks} tâches disponibles</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair">
                {film.title}
              </h1>
              <div className="mt-3">
                <SocialShare
                  url={`https://cinegen.studio/films/${film.slug}`}
                  title={`${film.title} — Film en Production | CINEGENY`}
                  description={film.synopsis || film.description || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 md:py-20 space-y-14 md:space-y-16">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            {film.synopsis && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#E50914]">Synopsis</h2>
                <p className="text-white/60 leading-relaxed">{film.synopsis}</p>
              </div>
            )}
            {film.description && !film.synopsis && (
              <p className="text-white/60 leading-relaxed">{film.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Progression globale</h3>
              <div className="text-5xl font-bold text-[#E50914] mb-3 font-playfair">
                {Math.round(film.progressPct)}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
                  style={{ width: `${film.progressPct}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-5 text-center">
                <div>
                  <div className="text-xl font-bold">{film.completedTasks}</div>
                  <div className="text-xs text-white/30">Validées</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{film.totalTasks}</div>
                  <div className="text-xs text-white/30">Total</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tâches dispo', value: availableTasks },
                { label: 'Votes', value: film._count.votes },
                { label: 'Backers', value: film._count.backers },
                { label: 'Phases', value: film.phases.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/30 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Community voting */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Votre avis</p>
              <FilmVoteButton
                filmId={film.id}
                initialUpVotes={film._count.votes}
                className="justify-center"
              />
            </div>

            <WatchlistButton filmId={film.id} className="w-full justify-center" />

            <Link href={`/tasks?film=${film.id}`}>
              <Button className="w-full" size="lg">
                Voir les Tâches Disponibles
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Production Timeline */}
        <FilmTimeline phases={film.phases as never} />

        {/* Film Credits */}
        {credits.length > 0 && (
          <div>
            <h2 className="text-xl font-bold font-playfair text-white mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#E50914]" />
              Générique
            </h2>
            <div className="space-y-8">
              {credits.map((group) => (
                <div key={group.phase}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                    {group.phase}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {group.tasks.map((task) =>
                      task.contributor ? (
                        <div
                          key={task.title}
                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                        >
                          {task.contributor.avatarUrl ? (
                            <Image
                              src={task.contributor.avatarUrl}
                              alt={task.contributor.displayName || ''}
                              width={36}
                              height={36}
                              className="rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-[#E50914]/10 flex items-center justify-center shrink-0">
                              <Users className="h-4 w-4 text-[#E50914]/60" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {task.contributor.displayName || 'Contributeur'}
                            </p>
                            <p className="text-xs text-white/40 truncate">{task.title}</p>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Co-Producer Section */}
        <CoProducerSection film={film} />

        {/* Community Reviews */}
        <FilmReviews filmId={film.id} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Catalog Film Page (fake film from shared data)
   ───────────────────────────────────────────── */

import type { FilmData } from '@/data/films'

const GENRE_COLORS: Record<string, string> = {
  'Action': '#E50914',
  'Comedy': '#F59E0B',
  'Drama': '#8B5CF6',
  'Sci-Fi': '#3B82F6',
  'Documentary': '#10B981',
  'Thriller': '#6366F1',
  'Animation': '#EC4899',
  'Historical': '#D97706',
  'Romance': '#F43F5E',
  'Fantasy': '#A855F7',
}

function deterministicNumber(slug: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash) + slug.charCodeAt(i)
  return min + Math.abs(hash) % (max - min)
}

function CatalogFilmPage({ film }: { film: FilmData }) {
  const accentColor = GENRE_COLORS[film.genre] || '#E50914'
  const statusLabel = FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status
  const similarFilms = Object.values(FILMS_BY_GENRE[film.genre] || []).filter(f => f.slug !== film.slug).slice(0, 5)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis,
    genre: film.genre,
    image: film.coverImageUrl || undefined,
    url: `https://cinegen.studio/films/${film.slug}`,
    director: { '@type': 'Person', name: film.director },
    duration: film.duration,
    dateCreated: `${film.year}-01-01`,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGENY Studio',
      url: 'https://cinegen.studio',
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner */}
      <div className="relative h-72 md:h-96">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentColor}15, #0A0A0A 50%, ${accentColor}08)` }}>
            <Film className="h-24 w-24" style={{ color: `${accentColor}30` }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 container mx-auto max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default" style={{ backgroundColor: accentColor }}>{film.genre}</Badge>
                <Badge variant="secondary">{statusLabel}</Badge>
                <Badge variant="outline" className="text-white/50 border-white/10">{film.rating}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair section-title-flash">
                {film.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {film.year}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {film.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {film.director}</span>
              </div>
              <div className="mt-3">
                <SocialShare
                  url={`https://cinegen.studio/films/${film.slug}`}
                  title={`${film.title} — ${film.genre} | CINEGENY`}
                  description={film.synopsis}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 md:py-20 space-y-14 md:space-y-16">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>Synopsis</h2>
              <p className="text-white/60 leading-relaxed text-base">{film.synopsis}</p>
            </div>

            {/* Cast & Crew */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>Cast & Crew</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs text-white/30 uppercase tracking-wider w-20 shrink-0 pt-0.5">Director</span>
                  <span className="text-white/70">{film.director}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs text-white/30 uppercase tracking-wider w-20 shrink-0 pt-0.5">Cast</span>
                  <span className="text-white/70">{film.cast.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {film.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3.5 w-3.5 text-white/30" />
                {film.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Status-specific sections ── */}

            {/* DRAFT: Vote to greenlight */}
            {film.status === 'DRAFT' && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-6 space-y-4">
                <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <Vote className="h-4 w-4" /> This film is in development phase
                </h3>
                <p className="text-white/50 text-sm">Vote to greenlight it! Community votes determine which projects move into pre-production.</p>
                <div className="flex items-center gap-4">
                  <Link href="/community/scenarios" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/30 transition-colors border border-amber-500/30 hover:border-amber-500/50">
                    <Vote className="h-4 w-4" /> Vote for this film
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-semibold text-amber-400">{deterministicNumber(film.slug, 120, 520)}</span> votes so far
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 animate-pulse" style={{ width: `${deterministicNumber(film.slug, 30, 70)}%` }} />
                </div>
                <p className="text-xs text-white/25">500 votes needed to greenlight</p>
              </div>
            )}

            {/* PRE_PRODUCTION: Phase timeline */}
            {film.status === 'PRE_PRODUCTION' && (() => {
              const phases = [
                { name: 'Script', icon: '01' },
                { name: 'Storyboard', icon: '02' },
                { name: 'Previz', icon: '03' },
                { name: 'Casting', icon: '04' },
                { name: 'Locations', icon: '05' },
              ]
              const currentPhaseIdx = Math.floor(film.progressPct / 20)
              return (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-6 space-y-5">
                  <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Pre-production Timeline
                  </h3>
                  <p className="text-white/50 text-sm">This film is being prepared for production. The team is working through each preparatory phase.</p>
                  <div className="relative">
                    {/* Timeline connector line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/[0.06]" />
                    <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000" style={{ width: `${Math.min(100, (currentPhaseIdx / (phases.length - 1)) * 100)}%` }} />
                    <div className="relative flex justify-between">
                      {phases.map((phase, i) => {
                        const isDone = i < currentPhaseIdx
                        const isCurrent = i === currentPhaseIdx
                        return (
                          <div key={phase.name} className="flex flex-col items-center gap-2 w-16">
                            <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                              isDone ? 'border-blue-400 bg-blue-500/20 text-blue-400' :
                              isCurrent ? 'border-blue-400 bg-blue-500/30 text-blue-300 ring-4 ring-blue-500/20 animate-pulse' :
                              'border-white/10 bg-white/[0.03] text-white/20'
                            }`}>
                              {isDone ? '\u2713' : phase.icon}
                            </div>
                            <span className={`text-[10px] text-center leading-tight ${isCurrent ? 'text-blue-400 font-semibold' : isDone ? 'text-blue-400/60' : 'text-white/25'}`}>
                              {phase.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* IN_PRODUCTION: Progress bar + task list */}
            {film.status === 'IN_PRODUCTION' && (() => {
              const tasks = [
                { name: 'Scene lighting setup', status: 'Done', color: 'emerald' },
                { name: 'Character animation pass', status: 'In Progress', color: 'amber' },
                { name: 'Sound design - Act II', status: 'In Progress', color: 'amber' },
                { name: 'VFX compositing', status: 'Pending', color: 'white' },
              ]
              return (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 space-y-5">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                    <Film className="h-4 w-4" /> In Production
                  </h3>
                  <p className="text-white/50 text-sm">This film is actively being produced. Join the team by contributing to micro-tasks!</p>
                  {/* Animated progress bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40">Production progress</span>
                      <span className="text-emerald-400 font-semibold">{film.progressPct}%</span>
                    </div>
                    <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 relative" style={{ width: `${film.progressPct}%` }}>
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                  {/* Task list */}
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div key={task.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-sm text-white/60">{task.name}</span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          task.status === 'Done' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          task.status === 'In Progress' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          'bg-white/[0.04] text-white/30 border border-white/[0.06]'
                        }`}>{task.status}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/tasks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                    <ArrowRight className="h-3.5 w-3.5" /> Contribute to tasks
                  </Link>
                </div>
              )
            })()}

            {/* POST_PRODUCTION: Trailer coming soon + film strip animation */}
            {film.status === 'POST_PRODUCTION' && (
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-6 space-y-5">
                <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                  <Film className="h-4 w-4" /> Post-production
                </h3>
                <p className="text-white/50 text-sm">Final editing, VFX, and sound mixing are underway. The trailer is being prepared.</p>
                <div className="aspect-video rounded-lg bg-black/40 border border-purple-500/10 flex items-center justify-center relative overflow-hidden">
                  {/* Film strip top & bottom borders */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-[#111] flex items-center gap-1.5 px-2 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`t${i}`} className="w-3 h-3 rounded-[1px] bg-white/[0.06] shrink-0 animate-[filmstrip_8s_linear_infinite]" style={{ animationDelay: `${i * -0.4}s` }} />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#111] flex items-center gap-1.5 px-2 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`b${i}`} className="w-3 h-3 rounded-[1px] bg-white/[0.06] shrink-0 animate-[filmstrip_8s_linear_infinite]" style={{ animationDelay: `${i * -0.4}s` }} />
                    ))}
                  </div>
                  <div className="text-center z-10">
                    <div className="relative">
                      <Film className="h-12 w-12 text-purple-400/50 mx-auto mb-3 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-purple-300/80">Trailer Coming Soon</p>
                    <p className="text-xs text-white/25 mt-1">Stay tuned for the official reveal</p>
                  </div>
                </div>
              </div>
            )}

            {/* RELEASED: Watch Now + Community rating */}
            {film.status === 'RELEASED' && (() => {
              const communityRating = (3.5 + (deterministicNumber(film.slug, 0, 15) / 10)).toFixed(1)
              const fullStars = Math.floor(Number(communityRating))
              const hasHalf = Number(communityRating) - fullStars >= 0.5
              return (
                <div className="rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.04] p-6 space-y-5">
                  <h3 className="text-base font-bold text-[#E50914] flex items-center gap-2">
                    <Star className="h-4 w-4" /> Released
                  </h3>
                  <p className="text-white/50 text-sm">This film is now available for streaming. Watch it and share your rating!</p>
                  {/* Community rating */}
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-3xl font-bold text-white font-playfair">{communityRating}</div>
                    <div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < fullStars ? 'text-amber-400 fill-amber-400' :
                              i === fullStars && hasHalf ? 'text-amber-400 fill-amber-400/50' :
                              'text-white/15'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/30 mt-1">{deterministicNumber(film.slug, 200, 1000)} community ratings</p>
                    </div>
                  </div>
                  <Link href="/streaming" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E50914] text-white text-sm font-bold hover:bg-[#E50914]/90 transition-colors shadow-lg shadow-[#E50914]/20">
                    <ArrowRight className="h-4 w-4" /> Watch Now
                  </Link>
                </div>
              )
            })()}
          </div>

          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Production Progress</h3>
              <div className="text-5xl font-bold mb-3 font-playfair" style={{ color: accentColor }}>
                {film.progressPct}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${film.progressPct}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)` }}
                />
              </div>
            </div>

            {/* Funding card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Funding</h3>
              <div className="text-5xl font-bold text-emerald-400 mb-3 font-playfair">
                {film.fundingPct}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(film.fundingPct, 100)}%`, background: 'linear-gradient(90deg, #059669, #10B981)' }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Genre', value: film.genre, icon: Star },
                { label: 'Year', value: film.year, icon: Calendar },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <s.icon className="h-4 w-4 mx-auto mb-1.5 text-white/30" />
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/30 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/tasks">
              <Button className="w-full" size="lg">
                Contribute to this Film
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Co-Producer Section — Golden animated border */}
        <div className="relative rounded-2xl p-[2px] overflow-hidden">
          {/* Animated golden border */}
          <div className="absolute inset-0 rounded-2xl animate-[borderGlow_3s_ease-in-out_infinite] bg-[conic-gradient(from_var(--angle,0deg),#B8860B,#FFD700,#DAA520,#B8860B,#FFD700)] opacity-60" style={{ ['--angle' as string]: '0deg' }} />
          <div className="absolute inset-[2px] rounded-2xl bg-[#0A0A0A]" />

          <div className="relative rounded-2xl bg-gradient-to-br from-amber-900/[0.12] via-[#0A0A0A] to-amber-800/[0.06] p-8 md:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E50914]/[0.04] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-playfair bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                    Become a Co-Producer
                  </h2>
                  <p className="text-xs text-amber-500/50 uppercase tracking-wider font-medium mt-0.5">Exclusive Investment Opportunity</p>
                </div>
              </div>

              <p className="text-white/50 max-w-2xl text-lg leading-relaxed">
                Invest in this film and receive a share of the revenue. Each token gives you a vote on creative decisions and your name in the credits.
              </p>

              {/* Funding progress bar (if fundingPct exists) */}
              {film.fundingPct != null && (
                <div className="rounded-xl border border-amber-500/15 bg-white/[0.02] p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/40">Funding Progress</span>
                    <span className="text-sm font-bold text-amber-400">{film.fundingPct}%</span>
                  </div>
                  <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 transition-all duration-1000 relative"
                      style={{ width: `${Math.min(film.fundingPct, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white/25 mt-2">
                    <span>{film.fundingPct}% funded</span>
                    <span>Goal: 100%</span>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Coins, title: 'Invest from 10\u20AC', desc: 'Co-production tokens accessible to all' },
                  { icon: Vote, title: 'Vote on Decisions', desc: 'Participate in creative choices' },
                  { icon: Crown, title: 'Credits & Revenue', desc: 'Your name in credits + revenue share' },
                ].map((b) => (
                  <div key={b.title} className="rounded-xl border border-amber-500/10 bg-white/[0.02] p-4 text-center hover:border-amber-500/25 transition-colors">
                    <b.icon className="h-6 w-6 text-amber-400/60 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>
                    <p className="text-xs text-white/30">{b.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/tokenization">
                  <button className="golden-border-btn golden-border-always relative group px-8 py-4 rounded-xl font-bold text-base text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:via-amber-200 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]">
                    <span className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Become Co-Producer
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
                <Link href="/tokenization" className="text-sm text-amber-400/60 hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5" /> View all offerings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Films — Horizontal scroll row */}
        {similarFilms.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold font-playfair" style={{ color: accentColor }}>
                Similar Films
              </h2>
              <span className="text-xs text-white/25 uppercase tracking-wider">{film.genre}</span>
            </div>
            <div className="relative group/row">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

              <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                {similarFilms.map((sf) => (
                  <Link key={sf.slug} href={`/films/${sf.slug}`} className="flex-shrink-0 w-[140px] md:w-[160px] group/card snap-start">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#141414] ring-1 ring-white/[0.06] mb-2.5 transition-all duration-300 group-hover/card:ring-2 group-hover/card:shadow-lg group-hover/card:shadow-black/40" style={{ ['--tw-ring-color' as string]: `${accentColor}40` }}>
                      {sf.coverImageUrl ? (
                        <Image src={sf.coverImageUrl} alt={sf.title} fill className="object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out" sizes="160px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent">
                          <Film className="h-8 w-8 text-white/10" />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" /> View
                        </span>
                      </div>
                      {/* Progress indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5">
                        <div className="h-full rounded-full" style={{ width: `${sf.progressPct}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-white/60 truncate group-hover/card:text-white transition-colors duration-200">{sf.title}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{sf.year} &middot; {sf.progressPct}% complete</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Co-Producer Section (shared between DB films)
   ───────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CoProducerSection({ film }: { film: any }) {
  return (
    <div className="rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/[0.06] to-transparent p-8 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/[0.05] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center">
            <Crown className="h-5 w-5 text-[#E50914]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">
            Devenez Co-Producteur
          </h2>
        </div>

        <p className="text-white/50 mb-8 max-w-2xl text-lg leading-relaxed">
          Investissez dans ce film et recevez une part des revenus.
          Chaque token vous donne un droit de vote sur les decisions creatives.
        </p>

        {film.tokenOffering && film.tokenOffering.status === 'OPEN' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="rounded-xl border border-[#E50914]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-[#E50914] font-playfair">
                  {film.tokenOffering.tokenPrice}&#8364;
                </div>
                <div className="text-xs text-white/30 mt-1">Prix / token</div>
              </div>
              <div className="rounded-xl border border-[#E50914]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-white font-playfair">
                  {Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364;
                </div>
                <div className="text-xs text-white/30 mt-1">Leves</div>
              </div>
              <div className="rounded-xl border border-[#E50914]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-white font-playfair">
                  {film.tokenOffering.tokensSold}
                </div>
                <div className="text-xs text-white/30 mt-1">Tokens vendus</div>
              </div>
              {film.tokenOffering.projectedROI && (
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-playfair">
                    ~{film.tokenOffering.projectedROI}%
                  </div>
                  <div className="text-xs text-white/30 mt-1">ROI estime</div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-white/50">Progression de la levee</span>
                <span className="text-[#E50914] font-semibold">
                  {film.tokenOffering.hardCap > 0 ? Math.round((film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
                  style={{ width: `${film.tokenOffering.hardCap > 0 ? Math.min(100, (film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-white/30">
                <span>{Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364; leves</span>
                <span>Objectif : {Math.round(film.tokenOffering.hardCap).toLocaleString('fr-FR')}&#8364;</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, label: 'Revenus partages' },
                { icon: Vote, label: 'Droit de vote' },
                { icon: Crown, label: 'Nom au generique' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs text-white/40">
                  <b.icon className="h-3.5 w-3.5 text-[#E50914]" />
                  {b.label}
                </div>
              ))}
            </div>

            <Link href={`/tokenization/${film.id}`}>
              <Button size="lg" className="w-full sm:w-auto group">
                <Coins className="h-5 w-5" />
                Investir dans ce Film
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Coins, title: 'Investissez des 10\u20AC', desc: 'Tokens de co-production accessibles a tous' },
                { icon: Vote, title: 'Votez', desc: 'Participez aux decisions creatives du film' },
                { icon: Crown, title: 'Au Generique', desc: 'Votre nom credite comme co-producteur' },
              ].map((b) => (
                <div key={b.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <b.icon className="h-6 w-6 text-[#E50914]/60 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>
                  <p className="text-xs text-white/30">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/40 mb-4">
                L&apos;offre de co-production sera bientot disponible.
                Suivez ce film pour etre notifie des son ouverture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/tokenization">
                  <Button variant="outline" className="group">
                    <Bell className="h-4 w-4" />
                    Voir les Offres Disponibles
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
