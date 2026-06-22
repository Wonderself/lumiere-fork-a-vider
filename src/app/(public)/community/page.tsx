import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/redis'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Users, Trophy, Film, Heart, Sparkles, ArrowRight,
  Crown, Clapperboard, PenTool, Vote, Timer, Star,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Communaute — Votez et Creez Ensemble',
  description:
    'Participez a la creation collective de films IA. Votez pour les meilleurs scenarios, bandes-annonces et propositions creatives.',
  openGraph: {
    title: 'Communaute — Votez et Creez Ensemble | CINEGENY',
    description: 'Participez a la creation collective de films IA. Votez pour les meilleurs scenarios.',
  },
}

async function getCommunityStats() {
  return getCached('community:stats', async () => {
    try {
      const [totalVotes, totalScenarios, totalContests, totalEntries] = await Promise.all([
        prisma.scenarioVote.count().then((sv) =>
          prisma.trailerVote.count().then((tv) => sv + tv)
        ),
        prisma.scenarioProposal.count(),
        prisma.trailerContest.count({ where: { status: 'CLOSED' } }),
        prisma.trailerEntry.count(),
      ])
      return { totalVotes, totalScenarios, totalContests, totalEntries }
    } catch {
      return { totalVotes: 0, totalScenarios: 0, totalContests: 0, totalEntries: 0 }
    }
  }, 180) // 3 min cache
}

async function getActiveContests() {
  try {
    return await prisma.trailerContest.findMany({
      where: { status: { in: ['OPEN', 'VOTING'] } },
      include: {
        film: { select: { title: true, slug: true } },
        _count: { select: { entries: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    })
  } catch {
    return []
  }
}

async function getVotingScenarios() {
  try {
    return await prisma.scenarioProposal.findMany({
      where: { status: 'VOTING' },
      include: {
        author: { select: { displayName: true } },
      },
      orderBy: { votesCount: 'desc' },
      take: 5,
    })
  } catch {
    return []
  }
}

async function getRecentWinners() {
  try {
    const [scenarioWinners, contestWinners] = await Promise.all([
      prisma.scenarioProposal.findMany({
        where: { status: 'WINNER' },
        include: { author: { select: { displayName: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 3,
      }),
      prisma.trailerContest.findMany({
        where: { status: 'CLOSED', winnerId: { not: null } },
        include: {
          entries: {
            include: { user: { select: { displayName: true } } },
            orderBy: { votesCount: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 3,
      }),
    ])
    return { scenarioWinners, contestWinners }
  } catch {
    return { scenarioWinners: [], contestWinners: [] }
  }
}

const CONTEST_STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  UPCOMING: { label: 'A venir', variant: 'secondary' },
  OPEN: { label: 'Ouvert', variant: 'success' },
  VOTING: { label: 'En Vote', variant: 'default' },
  CLOSED: { label: 'Termine', variant: 'secondary' },
}

export default async function CommunityPage() {
  const [stats, contests, votingScenarios, winners] = await Promise.all([
    getCommunityStats(),
    getActiveContests(),
    getVotingScenarios(),
    getRecentWinners(),
  ])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E50914]/[0.03] via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 sm:rounded-3xl rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 text-[#E50914]" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 text-white font-playfair">
            Communaute <span className="text-[#E50914]">Creative</span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-4">
            Le cinema se fait ensemble. Proposez des scenarios, votez pour vos favoris,
            participez aux concours de trailers. La communaute decide, le film se cree.
          </p>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 sm:mt-10">
            <Link
              href="/community/scenarios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:border-[#E50914]/30 hover:text-[#E50914] hover:bg-[#E50914]/[0.04] transition-all duration-300 min-h-[44px]"
            >
              <PenTool className="h-4 w-4" />
              Scenarios
            </Link>
            <Link
              href="/community/contests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-all duration-300 min-h-[44px]"
            >
              <Trophy className="h-4 w-4" />
              Concours
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:border-[#E50914]/30 hover:text-[#E50914] hover:bg-[#E50914]/[0.04] transition-all duration-300 min-h-[44px]"
            >
              <Crown className="h-4 w-4" />
              Classement
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 lg:px-20 pb-20 sm:pb-24 space-y-12 sm:space-y-16">

        {/* Section separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {[
            { label: 'Votes exprimes', value: stats.totalVotes, icon: Heart, color: 'text-red-500' },
            { label: 'Scenarios proposes', value: stats.totalScenarios, icon: PenTool, color: 'text-blue-500' },
            { label: 'Concours termines', value: stats.totalContests, icon: Trophy, color: 'text-[#E50914]' },
            { label: 'Participations', value: stats.totalEntries, icon: Film, color: 'text-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 sm:p-7 sm:rounded-3xl rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

        {/* Active Contests */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[#E50914]" />
              <h2 className="text-2xl font-bold text-white font-playfair">
                Concours Actifs
              </h2>
            </div>
            <Link
              href="/community/contests"
              className="text-sm text-[#E50914] hover:text-[#C4A030] transition-colors duration-300 flex items-center gap-1"
            >
              Tous les concours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {contests.length === 0 ? (
            <Card className="border-white/[0.06] bg-white/[0.02]">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">Aucun concours actif pour le moment</p>
                <p className="text-xs text-white/30 mt-1">Revenez bientot !</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contests.map((contest) => {
                const statusInfo = CONTEST_STATUS_BADGE[contest.status] || CONTEST_STATUS_BADGE.UPCOMING
                const daysLeft = contest.endDate
                  ? Math.max(0, Math.ceil((new Date(contest.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : null

                return (
                  <Link key={contest.id} href={`/community/contests/${contest.id}`}>
                    <Card variant={contest.status === 'VOTING' ? 'gold' : 'default'} className="h-full group cursor-pointer border-white/[0.06] bg-white/[0.02] hover:shadow-lg hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          {daysLeft !== null && daysLeft <= 7 && (
                            <div className="flex items-center gap-1 text-xs text-orange-500">
                              <Timer className="h-3 w-3" />
                              {daysLeft === 0 ? 'Dernier jour !' : `${daysLeft}j restant${daysLeft > 1 ? 's' : ''}`}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-[#E50914] transition-colors duration-300">
                          {contest.title}
                        </h3>
                        {contest.description && (
                          <p className="text-sm text-white/50 line-clamp-2 mb-3">
                            {contest.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          {contest.film && (
                            <span className="flex items-center gap-1">
                              <Clapperboard className="h-3 w-3" />
                              {contest.film.title}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            {contest._count.entries} participation{contest._count.entries !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

        {/* Scenarios in Vote */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Vote className="h-6 w-6 text-[#E50914]" />
              <h2 className="text-2xl font-bold text-white font-playfair">
                Scenarios en Vote
              </h2>
            </div>
            <Link
              href="/community/scenarios"
              className="text-sm text-[#E50914] hover:text-[#C4A030] transition-colors duration-300 flex items-center gap-1"
            >
              Tous les scenarios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {votingScenarios.length === 0 ? (
            <Card className="border-white/[0.06] bg-white/[0.02]">
              <CardContent className="p-12 text-center">
                <PenTool className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">Aucun scenario en vote actuellement</p>
                <p className="text-xs text-white/30 mt-1">Proposez le votre !</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {votingScenarios.map((scenario, idx) => (
                <Link key={scenario.id} href={`/community/scenarios/${scenario.id}`}>
                  <div className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 sm:rounded-2xl rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/30 hover:shadow-lg hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500 min-h-[56px] backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#E50914]/10 flex items-center justify-center text-sm font-bold text-[#E50914] shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white group-hover:text-[#E50914] transition-colors duration-300 truncate">
                        {scenario.title}
                      </h4>
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {scenario.logline}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-white/40">{scenario.author.displayName}</span>
                        {scenario.genre && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/[0.04] text-white/50 border-white/[0.08]">{scenario.genre}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#E50914] shrink-0">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-bold tabular-nums">{scenario.votesCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

        {/* Recent Winners */}
        {(winners.scenarioWinners.length > 0 || winners.contestWinners.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-[#E50914]" />
              <h2 className="text-2xl font-bold text-white font-playfair">
                Palmares Recent
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {winners.scenarioWinners.map((w) => (
                <Link key={w.id} href={`/community/scenarios/${w.id}`}>
                  <Card variant="gold" className="h-full group cursor-pointer border-[#E50914]/20 bg-[#E50914]/[0.03] hover:shadow-lg hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="h-4 w-4 text-[#E50914]" />
                        <Badge>Scenario Gagnant</Badge>
                      </div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-[#E50914] transition-colors duration-300 mb-1">
                        {w.title}
                      </h4>
                      <p className="text-xs text-white/50 line-clamp-2 mb-2">{w.logline}</p>
                      <p className="text-xs text-white/40">par {w.author.displayName}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {winners.contestWinners.map((c) => {
                const winner = c.entries[0]
                return (
                  <Link key={c.id} href={`/community/contests/${c.id}`}>
                    <Card variant="gold" className="h-full group cursor-pointer border-[#E50914]/20 bg-[#E50914]/[0.03] hover:shadow-lg hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy className="h-4 w-4 text-[#E50914]" />
                          <Badge>Concours Gagnant</Badge>
                        </div>
                        <h4 className="font-semibold text-sm text-white group-hover:text-[#E50914] transition-colors duration-300 mb-1">
                          {c.title}
                        </h4>
                        {winner && (
                          <p className="text-xs text-white/40">
                            Gagnant : {winner.user.displayName} — {winner.title}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

        {/* CTA */}
        <div className="text-center p-6 sm:p-10 sm:rounded-3xl rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/[0.04] to-[#0A0A0A] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#E50914]/[0.05] rounded-full blur-[60px] pointer-events-none" />
          <Sparkles className="h-8 w-8 text-[#E50914] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white font-playfair">
            La communaute decide, le cinema se cree
          </h2>
          <p className="text-white/50 mb-6 text-sm max-w-md mx-auto">
            Chaque vote compte. Chaque idee peut devenir un film. Rejoignez la revolution du cinema collaboratif.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              href="/community/scenarios"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E50914] text-white font-semibold hover:bg-[#B20710] transition-all duration-300 min-h-[44px]"
            >
              <PenTool className="h-4 w-4" />
              Proposer un scenario
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#E50914]/30 text-[#E50914] font-semibold hover:bg-[#E50914]/[0.06] transition-all duration-300 min-h-[44px]"
            >
              <Star className="h-4 w-4" />
              Rejoindre CINEGENY
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
