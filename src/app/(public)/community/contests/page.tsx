import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Trophy, Film, Timer, Calendar, Gift, Clapperboard,
  ArrowRight, Users, Sparkles,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Concours — Communaute CINEGENY',
  description: 'Participez aux concours de trailers de la communaute CINEGENY.',
}

async function getContests() {
  try {
    return await prisma.trailerContest.findMany({
      include: {
        film: { select: { title: true, slug: true } },
        _count: { select: { entries: true } },
        entries: {
          include: { user: { select: { displayName: true } } },
          orderBy: { votesCount: 'desc' },
          take: 1,
        },
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    })
  } catch {
    return []
  }
}

const STATUS_ORDER: Record<string, number> = {
  VOTING: 0,
  OPEN: 1,
  UPCOMING: 2,
  CLOSED: 3,
}

const STATUS_CONFIG: Record<string, {
  label: string
  variant: 'default' | 'success' | 'warning' | 'secondary'
  sectionTitle: string
  sectionIcon: React.ReactNode
  cardVariant: 'gold' | 'default'
}> = {
  VOTING: {
    label: 'En Vote',
    variant: 'default',
    sectionTitle: 'En Vote',
    sectionIcon: <Sparkles className="h-5 w-5 text-[#E50914]" />,
    cardVariant: 'gold',
  },
  OPEN: {
    label: 'Ouvert',
    variant: 'success',
    sectionTitle: 'Ouverts',
    sectionIcon: <Trophy className="h-5 w-5 text-green-500" />,
    cardVariant: 'default',
  },
  UPCOMING: {
    label: 'A venir',
    variant: 'warning',
    sectionTitle: 'A Venir',
    sectionIcon: <Calendar className="h-5 w-5 text-yellow-500" />,
    cardVariant: 'default',
  },
  CLOSED: {
    label: 'Termine',
    variant: 'secondary',
    sectionTitle: 'Termines',
    sectionIcon: <Film className="h-5 w-5 text-white/40" />,
    cardVariant: 'default',
  },
}

export default async function ContestsPage() {
  const allContests = await getContests()

  // Group by status
  const grouped = allContests.reduce(
    (acc, contest) => {
      const status = contest.status
      if (!acc[status]) acc[status] = []
      acc[status].push(contest)
      return acc
    },
    {} as Record<string, typeof allContests>
  )

  const orderedStatuses = Object.keys(grouped).sort(
    (a, b) => (STATUS_ORDER[a] ?? 99) - (STATUS_ORDER[b] ?? 99)
  )

  return (
    <div className="min-h-screen py-16 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-[#E50914]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-playfair">
              Concours
            </h1>
          </div>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Creez des trailers, participez aux competitions et montrez votre talent a la communaute.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-sm text-[#E50914] mt-4 hover:text-[#C4A030] transition-colors duration-300"
          >
            &larr; Retour a la communaute
          </Link>
        </div>

        {allContests.length === 0 ? (
          <div className="text-center py-24 text-white/40">
            <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl text-white/50">Aucun concours disponible</p>
            <p className="text-sm mt-2">Les premiers concours arrivent bientot !</p>
          </div>
        ) : (
          <div className="space-y-16">
            {orderedStatuses.map((status) => {
              const contests = grouped[status]
              const config = STATUS_CONFIG[status] || STATUS_CONFIG.CLOSED

              return (
                <section key={status}>
                  <div className="flex items-center gap-3 mb-6">
                    {config.sectionIcon}
                    <h2 className="text-xl font-bold text-white">{config.sectionTitle}</h2>
                    <Badge variant={config.variant}>{contests.length}</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {contests.map((contest) => {
                      const daysLeft = contest.endDate
                        ? Math.max(0, Math.ceil((new Date(contest.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                        : null

                      return (
                        <Link key={contest.id} href={`/community/contests/${contest.id}`}>
                          <Card variant={config.cardVariant} className="h-full group cursor-pointer border-white/[0.06] bg-[#0A0A0A] hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                            <CardContent className="p-6">
                              {/* Top row */}
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant={config.variant}>{config.label}</Badge>
                                {daysLeft !== null && status !== 'CLOSED' && (
                                  <div className={`flex items-center gap-1 text-xs ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-orange-500' : 'text-white/40'}`}>
                                    <Timer className="h-3 w-3" />
                                    {daysLeft === 0 ? 'Dernier jour !' : `${daysLeft}j`}
                                  </div>
                                )}
                              </div>

                              {/* Title & description */}
                              <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-[#E50914] transition-colors duration-300">
                                {contest.title}
                              </h3>
                              {contest.description && (
                                <p className="text-sm text-white/50 line-clamp-2 mb-4">
                                  {contest.description}
                                </p>
                              )}

                              {/* Prize */}
                              {contest.prizeDescription && (
                                <div className="flex items-center gap-2 text-xs text-[#E50914] mb-3 p-2 rounded-lg bg-[#E50914]/[0.04] border border-[#E50914]/10">
                                  <Gift className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{contest.prizeDescription}</span>
                                </div>
                              )}

                              {/* Meta */}
                              <div className="flex items-center gap-4 text-xs text-white/40 border-t border-white/[0.06] pt-3 mt-3">
                                {contest.film && (
                                  <span className="flex items-center gap-1">
                                    <Clapperboard className="h-3 w-3" />
                                    {contest.film.title}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {contest._count.entries} participation{contest._count.entries !== 1 ? 's' : ''}
                                </span>
                                {contest.startDate && contest.endDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(contest.startDate).split(' ').slice(0, 2).join(' ')} — {formatDate(contest.endDate).split(' ').slice(0, 2).join(' ')}
                                  </span>
                                )}
                              </div>

                              {/* Winner badge for closed contests */}
                              {status === 'CLOSED' && contest.entries[0] && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-[#E50914] p-2 rounded-lg bg-[#E50914]/[0.04] border border-[#E50914]/10">
                                  <Trophy className="h-3.5 w-3.5 shrink-0" />
                                  <span>Gagnant : <strong>{contest.entries[0].user.displayName}</strong> — {contest.entries[0].title}</span>
                                </div>
                              )}

                              {/* CTA arrow */}
                              <div className="flex justify-end mt-3">
                                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#E50914] transition-colors duration-300" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
