import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ContestStatusActions,
  ShortlistButton,
  PickWinnerButton,
  CreateContestForm,
} from '@/components/community/admin-contest-actions'
import Link from 'next/link'
import {
  Trophy, PenTool, Film, Users, Heart, Crown,
  Calendar, ArrowRight, User, Vote, Sparkles,
  BarChart3, Eye,
} from 'lucide-react'
import { formatDate, formatDateShort } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Concours & Scenarios' }

const CONTEST_STATUS: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  UPCOMING: { label: 'A venir', variant: 'warning' },
  OPEN: { label: 'Ouvert', variant: 'success' },
  VOTING: { label: 'En Vote', variant: 'default' },
  CLOSED: { label: 'Termine', variant: 'secondary' },
}

const SCENARIO_STATUS: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' | 'destructive' }> = {
  SUBMITTED: { label: 'Soumis', variant: 'secondary' },
  SHORTLISTED: { label: 'Pre-selectionne', variant: 'warning' },
  VOTING: { label: 'En Vote', variant: 'default' },
  WINNER: { label: 'Gagnant', variant: 'success' },
  ARCHIVED: { label: 'Archive', variant: 'secondary' },
}

export default async function AdminContestsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [contests, proposals, films, contestStats, scenarioStats] = await Promise.all([
    prisma.trailerContest.findMany({
      include: {
        film: { select: { title: true } },
        _count: { select: { entries: true } },
        entries: {
          orderBy: { votesCount: 'desc' },
          take: 1,
          include: { user: { select: { displayName: true } } },
        },
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    }),
    prisma.scenarioProposal.findMany({
      include: {
        author: { select: { displayName: true } },
      },
      orderBy: [{ status: 'asc' }, { votesCount: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.film.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    }),
    Promise.all([
      prisma.trailerContest.count(),
      prisma.trailerContest.count({ where: { status: { in: ['OPEN', 'VOTING'] } } }),
      prisma.trailerEntry.count(),
    ]).then(([total, active, entries]) => ({ total, active, entries })),
    Promise.all([
      prisma.scenarioProposal.count(),
      prisma.scenarioProposal.count({ where: { status: 'VOTING' } }),
      prisma.scenarioProposal.count({ where: { status: 'WINNER' } }),
    ]).then(([total, voting, winners]) => ({ total, voting, winners })),
  ])

  // Group submitted proposals for shortlist selection
  const submittedIds = proposals.filter((p) => p.status === 'SUBMITTED').map((p) => p.id)

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 font-playfair">
            Concours & Scenarios
          </h1>
          <p className="text-white/50 text-sm">Gerez les concours de trailers et les propositions de scenarios</p>
        </div>
        <Link
          href="/community"
          className="text-sm text-[#E50914] hover:text-[#FF2D2D] transition-colors flex items-center gap-1"
        >
          Voir la page publique <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ============================================ */}
      {/* TRAILER CONTESTS TAB */}
      {/* ============================================ */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-6 w-6 text-[#E50914]" />
          <h2 className="text-xl font-bold">Concours de Trailers</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#E50914]">{contestStats.total}</div>
              <div className="text-xs text-white/50">Total concours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{contestStats.active}</div>
              <div className="text-xs text-white/50">Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{contestStats.entries}</div>
              <div className="text-xs text-white/50">Participations</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Contest */}
        <div className="mb-6">
          <CreateContestForm films={films} />
        </div>

        {/* Contest List */}
        {contests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-white/40">
              <Trophy className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Aucun concours cree</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {contests.map((contest) => {
              const statusInfo = CONTEST_STATUS[contest.status] || CONTEST_STATUS.CLOSED
              const winner = contest.entries[0]

              return (
                <Card key={contest.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          {contest.film && (
                            <span className="text-xs text-white/40 flex items-center gap-1">
                              <Film className="h-3 w-3" />
                              {contest.film.title}
                            </span>
                          )}
                        </div>
                        <Link href={`/community/contests/${contest.id}`}>
                          <h3 className="font-semibold hover:text-[#E50914] transition-colors">
                            {contest.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {contest._count.entries} participation{contest._count.entries !== 1 ? 's' : ''}
                          </span>
                          {contest.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateShort(contest.startDate)}
                              {contest.endDate && ` — ${formatDateShort(contest.endDate)}`}
                            </span>
                          )}
                          {contest.status === 'CLOSED' && winner && (
                            <span className="flex items-center gap-1 text-[#E50914]">
                              <Crown className="h-3 w-3" />
                              {winner.user.displayName} — {winner.title}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0">
                        <ContestStatusActions contestId={contest.id} currentStatus={contest.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Separator */}
      <div className="border-t border-white/5" />

      {/* ============================================ */}
      {/* SCENARIO PROPOSALS TAB */}
      {/* ============================================ */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <PenTool className="h-6 w-6 text-[#E50914]" />
          <h2 className="text-xl font-bold">Propositions de Scenarios</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{scenarioStats.total}</div>
              <div className="text-xs text-white/50">Total propositions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#E50914]">{scenarioStats.voting}</div>
              <div className="text-xs text-white/50">En vote</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{scenarioStats.winners}</div>
              <div className="text-xs text-white/50">Gagnants</div>
            </CardContent>
          </Card>
        </div>

        {/* Shortlist action for SUBMITTED */}
        {submittedIds.length > 0 && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <Sparkles className="h-5 w-5 text-[#E50914] shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{submittedIds.length} proposition{submittedIds.length > 1 ? 's' : ''} en attente</p>
              <p className="text-xs text-white/40">Mettez les propositions soumises en vote.</p>
            </div>
            <ShortlistButton proposalIds={submittedIds} />
          </div>
        )}

        {/* Proposal List */}
        {proposals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-white/40">
              <PenTool className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Aucune proposition de scenario</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {proposals.map((proposal) => {
              const statusInfo = SCENARIO_STATUS[proposal.status] || SCENARIO_STATUS.SUBMITTED
              const isVoting = proposal.status === 'VOTING'

              return (
                <Card key={proposal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Status badge */}
                      <Badge variant={statusInfo.variant} className="shrink-0">
                        {statusInfo.label}
                      </Badge>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/community/scenarios/${proposal.id}`}>
                          <h4 className="font-semibold text-sm hover:text-[#E50914] transition-colors truncate">
                            {proposal.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {proposal.author.displayName}
                          </span>
                          {proposal.genre && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{proposal.genre}</Badge>
                          )}
                        </div>
                      </div>

                      {/* Votes */}
                      <div className="flex items-center gap-1 text-white/40 shrink-0">
                        <Heart className={`h-3.5 w-3.5 ${isVoting ? 'text-[#E50914]' : ''}`} />
                        <span className={`text-sm font-bold tabular-nums ${isVoting ? 'text-[#E50914]' : ''}`}>
                          {proposal.votesCount}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0">
                        {isVoting && <PickWinnerButton proposalId={proposal.id} />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
