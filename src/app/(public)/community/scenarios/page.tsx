import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScenarioVoteButton } from '@/components/community/scenario-vote-button'
import { SubmitScenarioForm } from '@/components/community/submit-scenario-form'
import Link from 'next/link'
import {
  PenTool, Crown, Heart, Vote, Sparkles, BookOpen,
  ArrowRight, User, Clock, Star, ArrowLeft,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Propositions de Scenarios — Communaute CINEGENY',
  description: 'Proposez et votez pour les meilleurs scenarios de la communaute CINEGENY.',
}

async function getScenarios() {
  try {
    const [voting, submitted, shortlisted, winners] = await Promise.all([
      prisma.scenarioProposal.findMany({
        where: { status: 'VOTING' },
        include: { author: { select: { id: true, displayName: true } } },
        orderBy: { votesCount: 'desc' },
      }),
      prisma.scenarioProposal.findMany({
        where: { status: 'SUBMITTED' },
        include: { author: { select: { id: true, displayName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.scenarioProposal.findMany({
        where: { status: 'SHORTLISTED' },
        include: { author: { select: { id: true, displayName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.scenarioProposal.findMany({
        where: { status: 'WINNER' },
        include: { author: { select: { id: true, displayName: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 6,
      }),
    ])
    return { voting, submitted, shortlisted, winners }
  } catch {
    return { voting: [], submitted: [], shortlisted: [], winners: [] }
  }
}

export default async function ScenariosPage() {
  const session = await auth()
  const userId = session?.user?.id

  const { voting, submitted, shortlisted, winners } = await getScenarios()

  // Check if user is premium
  let isPremium = false
  if (userId) {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { plan: true },
    })
    isPremium = !!sub && sub.plan !== 'FREE'
  }

  // Get user's existing votes
  let userVotes: Set<string> = new Set()
  if (userId) {
    const allProposalIds = voting.map((s) => s.id)
    if (allProposalIds.length > 0) {
      const votes = await prisma.scenarioVote.findMany({
        where: { userId, proposalId: { in: allProposalIds } },
        select: { proposalId: true },
      })
      userVotes = new Set(votes.map((v) => v.proposalId))
    }
  }

  const allProposals = [...submitted, ...shortlisted]

  return (
    <div className="min-h-screen py-16 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PenTool className="h-10 w-10 text-[#E50914]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-playfair">
              Scenarios
            </h1>
          </div>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Proposez vos idees de films, votez pour les meilleurs scenarios. Les gagnants deviennent des productions CINEGENY.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-sm text-[#E50914] mt-4 hover:text-[#C4A030] transition-colors duration-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour a la communaute
          </Link>
        </div>

        <div className="space-y-16">

          {/* === VOTING SECTION === */}
          {voting.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Vote className="h-6 w-6 text-[#E50914]" />
                <h2 className="text-2xl font-bold text-white font-playfair">
                  En Vote
                </h2>
                <Badge>{voting.length}</Badge>
              </div>

              {/* Premium notice */}
              {!isPremium && userId && (
                <div className="mb-6 p-4 sm:rounded-2xl rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.03] flex items-center gap-3 backdrop-blur-sm">
                  <Crown className="h-5 w-5 text-[#E50914] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/60">
                      Le vote est reserve aux membres <span className="text-[#E50914] font-semibold">Premium (Starter+)</span>
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">Passez a un abonnement superieur pour influencer les productions.</p>
                  </div>
                  <Link
                    href="/dashboard/subscription"
                    className="shrink-0 px-4 py-2 rounded-full bg-[#E50914] text-white text-xs font-semibold hover:bg-[#C4A030] transition-colors duration-300"
                  >
                    Devenir Premium
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                {voting.map((scenario, idx) => (
                  <div key={scenario.id} className="group">
                    <Card variant={idx === 0 ? 'gold' : 'default'} className="relative overflow-hidden border-white/[0.06] bg-[#0A0A0A] hover:shadow-[#E50914]/5 transition-all duration-500">
                      {/* Top rank indicator */}
                      {idx < 3 && (
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                          idx === 0 ? 'bg-[#E50914]' : idx === 1 ? 'bg-white/[0.08]' : 'bg-amber-600'
                        }`} />
                      )}

                      <CardContent className="p-5 pl-7">
                        <div className="flex items-start gap-4">
                          {/* Rank */}
                          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            idx === 0 ? 'bg-[#E50914]/10 text-[#E50914]' :
                            idx === 1 ? 'bg-white/[0.06] text-white/50' :
                            idx === 2 ? 'bg-amber-100 text-amber-600' :
                            'bg-white/[0.04] text-white/40'
                          }`}>
                            #{idx + 1}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/community/scenarios/${scenario.id}`}>
                              <h3 className="text-lg font-semibold text-white hover:text-[#E50914] transition-colors duration-300">
                                {scenario.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-white/40 line-clamp-2 mt-1 italic">
                              &ldquo;{scenario.logline}&rdquo;
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-white/40 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {scenario.author.displayName}
                              </span>
                              {scenario.genre && (
                                <Badge variant="secondary" className="text-[10px]">{scenario.genre}</Badge>
                              )}
                            </div>
                          </div>

                          {/* Vote button */}
                          <div className="shrink-0">
                            <ScenarioVoteButton
                              proposalId={scenario.id}
                              currentVotes={scenario.votesCount}
                              hasVoted={userVotes.has(scenario.id)}
                              isPremium={isPremium}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

          {/* === PROPOSALS SECTION === */}
          {allProposals.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-white font-playfair">
                  Propositions
                </h2>
                <Badge variant="secondary">{allProposals.length}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {allProposals.map((scenario) => (
                  <Link key={scenario.id} href={`/community/scenarios/${scenario.id}`}>
                    <Card className="h-full group cursor-pointer border-white/[0.06] bg-[#0A0A0A] hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={scenario.status === 'SHORTLISTED' ? 'warning' : 'secondary'}>
                            {scenario.status === 'SHORTLISTED' ? 'Pre-selectionne' : 'Submitted'}
                          </Badge>
                          <span className="text-xs text-white/30">
                            {formatDate(scenario.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-white group-hover:text-[#E50914] transition-colors duration-300 mb-1.5">
                          {scenario.title}
                        </h3>
                        <p className="text-xs text-white/40 line-clamp-2 italic mb-3">
                          {scenario.logline}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {scenario.author.displayName}
                          </span>
                          {scenario.genre && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{scenario.genre}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

          {/* === WINNERS SECTION === */}
          {winners.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-6 w-6 text-[#E50914]" />
                <h2 className="text-2xl font-bold text-white font-playfair">
                  Gagnants
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {winners.map((scenario) => (
                  <Link key={scenario.id} href={`/community/scenarios/${scenario.id}`}>
                    <Card variant="gold" className="h-full group cursor-pointer border-[#E50914]/20 bg-[#0A0A0A] hover:shadow-[#E50914]/5 hover:-translate-y-[1px] transition-all duration-500">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Crown className="h-4 w-4 text-[#E50914]" />
                          <Badge>Gagnant</Badge>
                          <Badge variant="secondary" className="text-[10px]">Round {scenario.round}</Badge>
                        </div>
                        <h3 className="font-semibold text-sm text-white group-hover:text-[#E50914] transition-colors duration-300 mb-1.5">
                          {scenario.title}
                        </h3>
                        <p className="text-xs text-white/40 line-clamp-2 italic mb-3">
                          {scenario.logline}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/40 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {scenario.author.displayName}
                          </span>
                          <div className="flex items-center gap-1 text-[#E50914]">
                            <Heart className="h-3.5 w-3.5" />
                            <span className="text-xs font-bold">{scenario.votesCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

          {/* === SUBMIT FORM === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-[#E50914]" />
              <h2 className="text-2xl font-bold text-white font-playfair">
                Votre Idee
              </h2>
            </div>

            {userId ? (
              <SubmitScenarioForm />
            ) : (
              <Card className="border-white/[0.06] bg-[#0A0A0A]">
                <CardContent className="p-8 text-center">
                  <PenTool className="h-10 w-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 mb-4">Connectez-vous pour proposer un scenario</p>
                  <div className="flex justify-center gap-3">
                    <Link
                      href="/login"
                      className="px-5 py-2.5 rounded-full bg-[#E50914] text-white font-semibold hover:bg-[#C4A030] transition-colors duration-300 text-sm"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/register"
                      className="px-5 py-2.5 rounded-full border border-[#E50914]/30 text-[#E50914] font-semibold hover:bg-[#E50914]/10 transition-colors duration-300 text-sm"
                    >
                      Creer un compte
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Empty state if nothing at all */}
          {voting.length === 0 && allProposals.length === 0 && winners.length === 0 && (
            <div className="text-center py-16 text-white/40">
              <PenTool className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl text-white/50 mb-2">Aucun scenario pour le moment</p>
              <p className="text-sm">Soyez le premier a proposer une idee de film !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
