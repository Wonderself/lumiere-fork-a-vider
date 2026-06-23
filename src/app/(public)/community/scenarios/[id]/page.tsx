import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScenarioVoteButton } from '@/components/community/scenario-vote-button'
import Link from 'next/link'
import {
  PenTool, Crown, Heart, User, ArrowLeft, BookOpen,
  Film, Calendar, Award, Sparkles, Lock,
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' | 'destructive' }> = {
  SUBMITTED: { label: 'Submitted', variant: 'secondary' },
  SHORTLISTED: { label: 'Pre-selectionne', variant: 'warning' },
  VOTING: { label: 'En Vote', variant: 'default' },
  WINNER: { label: 'Gagnant', variant: 'success' },
  ARCHIVED: { label: 'Archive', variant: 'secondary' },
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const scenario = await prisma.scenarioProposal.findUnique({
    where: { id },
    select: { title: true, logline: true },
  })
  if (!scenario) return { title: 'Screenplay not found' }
  return {
    title: `${scenario.title} — Scénarios CINEGENY`,
    description: scenario.logline || 'Screenplay proposal on the CINEGENY platform.',
    openGraph: {
      title: `${scenario.title} — Scénarios CINEGENY`,
      description: scenario.logline || 'Screenplay proposal on the CINEGENY platform.',
    },
  }
}

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const scenario = await prisma.scenarioProposal.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, displayName: true, avatarUrl: true, level: true } },
      film: { select: { title: true, slug: true } },
      catalog: { select: { title: true, slug: true } },
    },
  })

  if (!scenario) notFound()

  // Session & premium check
  const session = await auth()
  const userId = session?.user?.id

  let isPremium = false
  let hasVoted = false
  if (userId) {
    const [sub, vote] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId },
        select: { plan: true },
      }),
      scenario.status === 'VOTING'
        ? prisma.scenarioVote.findUnique({
            where: { proposalId_userId: { proposalId: scenario.id, userId } },
          })
        : null,
    ])
    isPremium = !!sub && sub.plan !== 'FREE'
    hasVoted = !!vote
  }

  // Related scenarios (same genre or film, excluding current)
  const related = await prisma.scenarioProposal.findMany({
    where: {
      id: { not: scenario.id },
      OR: [
        ...(scenario.genre ? [{ genre: scenario.genre }] : []),
        ...(scenario.filmId ? [{ filmId: scenario.filmId }] : []),
      ],
      status: { in: ['VOTING', 'WINNER', 'SUBMITTED'] },
    },
    include: { author: { select: { displayName: true } } },
    orderBy: { votesCount: 'desc' },
    take: 4,
  })

  const statusInfo = STATUS_CONFIG[scenario.status] || STATUS_CONFIG.SUBMITTED
  const isVoting = scenario.status === 'VOTING'
  const isWinner = scenario.status === 'WINNER'

  const LEVEL_LABELS: Record<string, string> = {
    ROOKIE: 'Rookie',
    PRO: 'Pro',
    EXPERT: 'Expert',
    VIP: 'VIP',
  }
  const LEVEL_COLORS: Record<string, string> = {
    ROOKIE: 'text-gray-400',
    PRO: 'text-blue-400',
    EXPERT: 'text-purple-400',
    VIP: 'text-[#E50914]',
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Breadcrumb */}
        <Link
          href="/community/scenarios"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#E50914] transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux scenarios
        </Link>

        {/* Main content area */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* Left: Scenario content */}
          <div>
            {/* Status & Genre */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isWinner && <Crown className="h-5 w-5 text-[#E50914]" />}
              <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
                {statusInfo.label}
              </Badge>
              {scenario.genre && (
                <Badge variant="secondary">{scenario.genre}</Badge>
              )}
              <Badge variant="outline">Round {scenario.round}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-playfair">
              {isWinner && <span className="text-[#E50914]">&#9733; </span>}
              {scenario.title}
            </h1>

            {/* Logline */}
            <div className="mb-8 p-6 sm:rounded-2xl rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <p className="text-lg text-white/70 italic leading-relaxed font-playfair">
                &ldquo;{scenario.logline}&rdquo;
              </p>
            </div>

            {/* Synopsis */}
            {scenario.synopsis && (
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <BookOpen className="h-5 w-5 text-[#E50914]" />
                  Synopsis
                </h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {scenario.synopsis.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-white/60 leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Film reference */}
            {(scenario.film || scenario.catalog) && (
              <div className="mb-8 p-4 sm:rounded-2xl rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex items-center gap-3">
                <Film className="h-5 w-5 text-[#E50914] shrink-0" />
                <div>
                  <span className="text-xs text-white/40">Film associe</span>
                  <p className="text-sm font-medium text-white/70">
                    {scenario.film?.title || scenario.catalog?.title}
                  </p>
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {scenario.aiScore !== null && scenario.aiAnalysis && (
              <div className="mb-8 sm:rounded-2xl rounded-xl border border-[#E50914]/10 bg-[#E50914]/[0.03] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E50914]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#E50914]" />
                    <span className="text-sm font-semibold text-[#E50914]">Analyse IA</span>
                  </div>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold',
                    scenario.aiScore >= 75 ? 'bg-green-500/15 text-green-400' :
                    scenario.aiScore >= 50 ? 'bg-yellow-500/15 text-yellow-400' :
                    'bg-red-500/15 text-red-400'
                  )}>
                    {scenario.aiScore}/100
                  </div>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <p className="text-sm text-white/60 leading-relaxed">{scenario.aiAnalysis}</p>
                  {scenario.aiSuggestions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-white/40 mb-2">Suggestions</p>
                      <ul className="space-y-1.5">
                        {scenario.aiSuggestions.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                            <span className="text-[#E50914] mt-0.5">&#8226;</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
              <Calendar className="h-3.5 w-3.5" />
              <span>Propose le {formatDate(scenario.createdAt)}</span>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Vote Card */}
            <Card variant={isVoting ? 'gold' : isWinner ? 'gold' : 'default'}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className={`text-4xl font-bold tabular-nums ${isWinner || isVoting ? 'text-[#E50914]' : 'text-white'}`}>
                    {scenario.votesCount}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    vote{scenario.votesCount !== 1 ? 's' : ''}
                  </div>
                </div>

                {isVoting && userId && (
                  <ScenarioVoteButton
                    proposalId={scenario.id}
                    currentVotes={scenario.votesCount}
                    hasVoted={hasVoted}
                    isPremium={isPremium}
                  />
                )}

                {isVoting && !userId && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40">Connectez-vous pour voter</p>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300"
                    >
                      Se connecter
                    </Link>
                  </div>
                )}

                {isWinner && (
                  <div className="flex items-center justify-center gap-2 text-[#E50914]">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold text-sm">Scenario Gagnant</span>
                  </div>
                )}

                {!isVoting && !isWinner && (
                  <div className="flex items-center justify-center gap-2 text-white/30">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">Vote non ouvert</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-xs text-white/40 uppercase tracking-wider font-medium mb-3">Auteur</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E50914]/20 to-white/5 flex items-center justify-center text-sm font-bold text-[#E50914]">
                    {scenario.author.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{scenario.author.displayName}</p>
                    <p className={`text-xs ${LEVEL_COLORS[scenario.author.level] || 'text-gray-400'}`}>
                      {LEVEL_LABELS[scenario.author.level] || scenario.author.level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA (if not premium and voting) */}
            {isVoting && userId && !isPremium && (
              <Card variant="gold">
                <CardContent className="p-5 text-center">
                  <Lock className="h-6 w-6 text-[#E50914] mx-auto mb-2" />
                  <h3 className="text-sm font-semibold mb-1">Debloquez le vote</h3>
                  <p className="text-xs text-white/40 mb-3">
                    Passez a Premium pour voter et influencer les futures productions.
                  </p>
                  <Link
                    href="/dashboard/subscription"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E50914] text-white text-xs font-semibold hover:bg-[#FF2D2D] transition-colors duration-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Passer Premium
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Section separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent mt-16" />

        {/* Related Scenarios */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-6 font-playfair">
              <Sparkles className="h-5 w-5 text-[#E50914]" />
              Scenarios similaires
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((s) => {
                const sStatus = STATUS_CONFIG[s.status] || STATUS_CONFIG.SUBMITTED
                return (
                  <Link key={s.id} href={`/community/scenarios/${s.id}`}>
                    <Card className="h-full group cursor-pointer hover:shadow-lg hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                      <CardContent className="p-5">
                        <Badge variant={sStatus.variant} className="mb-2">{sStatus.label}</Badge>
                        <h3 className="font-semibold text-sm group-hover:text-[#E50914] transition-colors duration-300 mb-1.5">
                          {s.title}
                        </h3>
                        <p className="text-xs text-white/40 line-clamp-2 italic mb-2">{s.logline}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/30">{s.author.displayName}</span>
                          <div className="flex items-center gap-1 text-white/30">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs tabular-nums">{s.votesCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
