import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/redis'
import Link from 'next/link'
import Image from 'next/image'
import { Film, ChevronRight, Star, Users, CheckCircle, Clapperboard } from 'lucide-react'
import { FILM_STATUS_LABELS, CATALOG_LABELS } from '@/lib/constants'
import FilmCategories from '@/components/films/film-categories'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Films in Production — CINEGENY',
  description:
    'Discover all films in production on CINEGENY. Join the team, contribute to micro-tasks and get credited.',
  openGraph: {
    title: 'Films in Production — CINEGENY',
    description: 'Discover all films in production on CINEGENY.',
  },
}

async function getFilms(searchParams: { [key: string]: string | undefined }) {
  const { genre, catalog, status } = searchParams
  try {
    return await prisma.film.findMany({
      where: {
        isPublic: true,
        ...(genre ? { genre } : {}),
        ...(catalog ? { catalog: catalog as never } : {}),
        ...(status ? { status: status as never } : {}),
      },
      include: {
        _count: { select: { tasks: true, votes: true } },
      },
      orderBy: [{ status: 'asc' }, { progressPct: 'desc' }],
    })
  } catch {
    return []
  }
}

async function getHeroStats() {
  return getCached('films:hero-stats', async () => {
    try {
      const [filmsCount, tasksCount, contributorsCount] = await Promise.all([
        prisma.film.count({ where: { isPublic: true } }),
        prisma.task.count(),
        prisma.user.count({ where: { isVerified: true } }),
      ])
      return { filmsCount, tasksCount, contributorsCount }
    } catch {
      return { filmsCount: 0, tasksCount: 0, contributorsCount: 0 }
    }
  }, 300) // 5 min cache
}

const STATUS_ORDER = ['IN_PRODUCTION', 'PRE_PRODUCTION', 'POST_PRODUCTION', 'RELEASED', 'DRAFT']

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'text-white/40',
  PRE_PRODUCTION: 'text-yellow-500',
  IN_PRODUCTION: 'text-green-400',
  POST_PRODUCTION: 'text-blue-400',
  RELEASED: 'text-purple-400',
}

export default async function FilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const [films, heroStats] = await Promise.all([getFilms(params), getHeroStats()])

  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative pt-28 pb-20 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
        {/* Ambient blur circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E50914]/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#E50914]/[0.04] rounded-full blur-[100px]" />
          {/* Gold particles */}
          <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-[#E50914]/40 animate-pulse" />
          <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#E50914]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-[#E50914]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[40%] right-[20%] w-1 h-1 rounded-full bg-[#E50914]/30 animate-pulse [animation-delay:1.5s]" />
        </div>

        <div className="relative container mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-sm mb-8">
            <Clapperboard className="h-4 w-4" />
            <span className="font-medium">Nos Productions</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-white"
          >
            Films &{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Productions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
            Decouvrez nos productions cinematographiques creees collaborativement par notre communaute de co-producteurs
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-10 max-w-2xl mx-auto">
            {[
              { label: 'Films', value: heroStats.filmsCount, icon: Film },
              { label: 'Taches', value: heroStats.tasksCount, icon: CheckCircle },
              { label: 'Contributeurs', value: heroStats.contributorsCount, icon: Users },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5 sm:p-6 text-center transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 mx-auto mb-2">
                  <stat.icon className="h-4 w-4 text-[#E50914]" />
                </div>
                <div
                  className="text-2xl sm:text-3xl font-bold text-[#E50914]"
                >
                  {stat.value > 0 ? stat.value.toLocaleString('fr-FR') : '--'}
                </div>
                <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade separator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* FILTERS & GRID                                                   */}
      {/* ================================================================ */}
      <div className="relative px-6 sm:px-10 md:px-16 lg:px-20 pb-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="container mx-auto max-w-7xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['Tous', 'IN_PRODUCTION', 'PRE_PRODUCTION', 'POST_PRODUCTION', 'RELEASED'].map((s) => {
              const isActive = (!params.status && s === 'Tous') || params.status === s
              return (
                <Link
                  key={s}
                  href={s === 'Tous' ? '/films' : `/films?status=${s}`}
                  className={`px-4 py-2 rounded-full text-sm border transition-all duration-500 ${
                    isActive
                      ? 'bg-[#E50914] border-[#E50914] text-white'
                      : 'bg-white/[0.06] border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {s === 'Tous' ? 'Tous les films' : FILM_STATUS_LABELS[s as keyof typeof FILM_STATUS_LABELS]}
                </Link>
              )
            })}
          </div>

          {/* Films Grid */}
          {films.length === 0 ? (
            <div className="text-center py-24 text-white/40">
              <Film className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl text-white/50">Aucun film trouve</p>
              <p className="text-sm mt-2 text-white/40">Les films seront bientot disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.slug}`}>
                  <div className="group rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.03] overflow-hidden hover:border-[#E50914]/30 transition-all duration-500 h-full flex flex-col hover-lift">
                    {/* Cover */}
                    <div className="relative h-44 sm:h-52 bg-gradient-to-br from-[#E50914]/[0.06] to-white/[0.03] shrink-0">
                      {film.coverImageUrl ? (
                        <Image
                          src={film.coverImageUrl}
                          alt={film.title}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-16 w-16 text-[#E50914]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-medium ${STATUS_COLORS[film.status]}`}>
                          &#9679; {FILM_STATUS_LABELS[film.status]}
                        </span>
                      </div>
                      {film.catalog && film.catalog !== 'CINEGENY' && (
                        <div className="absolute top-3 left-3">
                          <span className="text-xs bg-white/10 text-white/60 rounded px-2 py-0.5 border border-white/10">
                            {CATALOG_LABELS[film.catalog]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1">
                      <h3 className="font-semibold text-base mb-2 text-white group-hover:text-[#E50914] transition-colors line-clamp-2">
                        {film.title}
                      </h3>

                      {film.genre && (
                        <span className="text-xs text-white/40 mb-3">{film.genre}</span>
                      )}

                      {film.description && (
                        <p className="text-xs text-white/50 mb-4 line-clamp-3 flex-1">{film.description}</p>
                      )}

                      {/* Progress */}
                      <div className="space-y-2.5 mt-auto">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Progression</span>
                          <span className="text-[#E50914] font-medium">{Math.round(film.progressPct)}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full"
                            style={{ width: `${film.progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span>{film._count.tasks} taches</span>
                          {film._count.votes > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" /> {film._count.votes}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#E50914]/50 group-hover:text-[#E50914] transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* CATALOG FILMS (client-side data)                                 */}
      {/* ================================================================ */}
      <FilmCategories />
    </div>
  )
}
