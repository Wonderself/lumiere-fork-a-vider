import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { VoteButton } from '@/components/community/vote-button'
import { SubmitEntryForm } from '@/components/community/submit-entry-form'
import Link from 'next/link'
import {
  Trophy, Film, Timer, Calendar, Gift, Crown,
  Clapperboard, Heart, Play, User, ArrowLeft,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  UPCOMING: { label: 'A venir', variant: 'warning' },
  OPEN: { label: 'Ouvert aux participations', variant: 'success' },
  VOTING: { label: 'Phase de Vote', variant: 'default' },
  CLOSED: { label: 'Termine', variant: 'secondary' },
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const contest = await prisma.trailerContest.findUnique({
    where: { id },
    select: { title: true, description: true },
  })
  if (!contest) return { title: 'Concours introuvable' }
  return {
    title: `${contest.title} — Concours CINEGENY`,
    description: contest.description || 'Concours de trailers CINEGENY — Participez et votez.',
    openGraph: {
      title: `${contest.title} — Concours CINEGENY`,
      description: contest.description || 'Concours de trailers CINEGENY — Participez et votez.',
    },
  }
}

export default async function ContestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const contest = await prisma.trailerContest.findUnique({
    where: { id },
    include: {
      film: { select: { title: true, slug: true } },
      entries: {
        include: {
          user: { select: { id: true, displayName: true, avatarUrl: true } },
          _count: { select: { votes: true } },
        },
        orderBy: { votesCount: 'desc' },
      },
    },
  })

  if (!contest) notFound()

  // Get current user session and their votes
  const session = await auth()
  const userId = session?.user?.id

  let userVotes: Set<string> = new Set()
  if (userId) {
    const votes = await prisma.trailerVote.findMany({
      where: { userId, entryId: { in: contest.entries.map((e) => e.id) } },
      select: { entryId: true },
    })
    userVotes = new Set(votes.map((v) => v.entryId))
  }

  const statusInfo = STATUS_CONFIG[contest.status] || STATUS_CONFIG.CLOSED
  const daysLeft = contest.endDate
    ? Math.max(0, Math.ceil((new Date(contest.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null
  const isOpen = contest.status === 'OPEN'
  const isVoting = contest.status === 'VOTING'
  const isClosed = contest.status === 'CLOSED'

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <Link
          href="/community/contests"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#E50914] transition-colors duration-300 mb-6 sm:mb-8 min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux concours
        </Link>

        {/* Contest Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
              {statusInfo.label}
            </Badge>
            {daysLeft !== null && !isClosed && (
              <div className={`flex items-center gap-1.5 text-sm ${daysLeft <= 3 ? 'text-red-400' : daysLeft <= 7 ? 'text-orange-400' : 'text-white/50'}`}>
                <Timer className="h-4 w-4" />
                {daysLeft === 0 ? 'Dernier jour !' : `${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}`}
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-playfair">
            {contest.title}
          </h1>

          {contest.description && (
            <p className="text-lg text-white/50 leading-relaxed max-w-3xl mb-6">
              {contest.description}
            </p>
          )}

          {/* Contest meta */}
          <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-white/40">
            {contest.film && (
              <div className="flex items-center gap-2">
                <Clapperboard className="h-4 w-4" />
                <span>Film : <span className="text-white/60">{contest.film.title}</span></span>
              </div>
            )}
            {contest.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(contest.startDate)} — {contest.endDate ? formatDate(contest.endDate) : 'In progress'}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              <span>{contest.entries.length} participation{contest.entries.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Prize banner */}
          {contest.prizeDescription && (
            <div className="mt-6 p-4 sm:rounded-2xl rounded-xl bg-[#E50914]/[0.05] border border-[#E50914]/20 flex items-center gap-3 backdrop-blur-sm">
              <Gift className="h-5 w-5 text-[#E50914] shrink-0" />
              <div>
                <span className="text-xs text-[#E50914]/60 uppercase tracking-wider font-medium">Prix</span>
                <p className="text-[#E50914] font-medium">{contest.prizeDescription}</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Entry Form (only if OPEN) */}
        {isOpen && userId && (
          <div className="mb-10">
            <SubmitEntryForm contestId={contest.id} />
          </div>
        )}

        {isOpen && !userId && (
          <div className="mb-10 p-5 sm:rounded-2xl rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.03] text-center backdrop-blur-sm">
            <p className="text-white/60 mb-3">Connectez-vous pour participer a ce concours</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E50914] text-white font-semibold hover:bg-[#FF2D2D] transition-colors duration-300 text-sm"
            >
              Se connecter
            </Link>
          </div>
        )}

        {/* Section separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent mb-6" />

        {/* Entries */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-playfair">
            {isVoting ? 'Votez pour votre favori' : isClosed ? 'Resultats' : 'Participations'}
          </h2>
          {isVoting && (
            <div className="flex items-center gap-1.5 text-xs text-[#E50914]/60">
              <Heart className="h-3.5 w-3.5" />
              Cliquez pour voter
            </div>
          )}
        </div>

        {contest.entries.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <Film className="h-14 w-14 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-lg">Aucune participation pour le moment</p>
              {isOpen && (
                <p className="text-sm text-white/20 mt-2">Soyez le premier a soumettre votre trailer !</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contest.entries.map((entry, idx) => {
              const isWinner = isClosed && contest.winnerId === entry.id
              const hasVoted = userVotes.has(entry.id)

              return (
                <Card
                  key={entry.id}
                  variant={isWinner ? 'gold' : 'default'}
                  className="relative overflow-hidden hover:shadow-lg hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500"
                >
                  {/* Winner crown */}
                  {isWinner && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                        <Crown className="h-4 w-4 text-black" />
                      </div>
                    </div>
                  )}

                  {/* Rank badge */}
                  {(isVoting || isClosed) && idx < 3 && (
                    <div className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-[#E50914] text-white' :
                      idx === 1 ? 'bg-gray-400 text-black' :
                      'bg-amber-700 text-white'
                    }`}>
                      {idx + 1}
                    </div>
                  )}

                  {/* Thumbnail placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-white/[0.05] to-white/[0.02] flex items-center justify-center relative">
                    {entry.thumbnailUrl ? (
                      <img
                        src={entry.thumbnailUrl}
                        alt={entry.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Play className="h-10 w-10 text-white/10 mx-auto mb-1" />
                        <span className="text-xs text-white/20">Trailer</span>
                      </div>
                    )}
                    {entry.videoUrl && (
                      <a
                        href={entry.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg">
                          <Play className="h-5 w-5 text-black ml-0.5" />
                        </div>
                      </a>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1.5 line-clamp-1">
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <User className="h-3 w-3" />
                      <span>{entry.user.displayName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {isVoting ? (
                        <VoteButton
                          entryId={entry.id}
                          currentVotes={entry.votesCount}
                          hasVoted={hasVoted}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 text-white/40">
                          <Heart className={`h-4 w-4 ${isWinner ? 'text-[#E50914] fill-[#E50914]/30' : ''}`} />
                          <span className={`text-sm font-bold tabular-nums ${isWinner ? 'text-[#E50914]' : ''}`}>
                            {entry.votesCount}
                          </span>
                          <span className="text-xs ml-0.5">vote{entry.votesCount !== 1 ? 's' : ''}</span>
                        </div>
                      )}

                      {isWinner && (
                        <Badge className="bg-[#E50914] text-white border-[#E50914]">Gagnant</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!userId && (isVoting || isOpen) && (
          <div className="mt-10 text-center p-8 sm:rounded-3xl rounded-2xl border border-[#E50914]/20 bg-[#E50914]/[0.03] backdrop-blur-sm">
            <Trophy className="h-8 w-8 text-[#E50914] mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2 font-playfair">
              {isVoting ? 'Connectez-vous pour voter' : 'Participez a ce concours'}
            </h3>
            <p className="text-white/40 text-sm mb-4">
              Rejoignez la communaute CINEGENY pour participer et voter.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-full bg-[#E50914] text-white font-semibold hover:bg-[#FF2D2D] transition-all duration-300 text-sm text-center min-h-[44px] inline-flex items-center justify-center"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-full border border-[#E50914]/30 text-[#E50914] font-semibold hover:bg-[#E50914]/10 transition-all duration-300 text-sm text-center min-h-[44px] inline-flex items-center justify-center"
              >
                Creer un compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
