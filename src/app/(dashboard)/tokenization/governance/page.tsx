import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Coins, Film, Clock, Shield,
  Vote, Briefcase, Gavel, Plus,
  CheckCircle2, XCircle, MinusCircle,
  Users, AlertTriangle, ArrowRight,
  Scale, FileText, Timer
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  formatEur, getTokenBalance, PROPOSAL_TYPE_LABELS,
  getTimeRemaining,
} from '@/lib/tokenization'
import { voteOnProposalAction, createProposalAction } from '@/app/actions/tokenization'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gouvernance — Tokenization',
  description: 'Votez sur les décisions créatives des films dans lesquels vous avez investi.',
}

// Sub-navigation
function TokenizationNav({ active }: { active: string }) {
  const tabs = [
    { key: 'marketplace', label: 'Marketplace', href: '/tokenization', icon: Coins },
    { key: 'portfolio', label: 'Mon Portfolio', href: '/tokenization/portfolio', icon: Briefcase },
    { key: 'governance', label: 'Gouvernance', href: '/tokenization/governance', icon: Vote },
  ]
  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/5 w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
            active === tab.key
              ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/20 shadow-[0_0_12px_rgba(229,9,20,0.1)]'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

// Proposal status badge
function ProposalStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant="warning" className="text-xs"><Timer className="h-3 w-3 mr-1" />En cours</Badge>
    case 'PASSED':
      return <Badge variant="success" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Adoptée</Badge>
    case 'REJECTED':
      return <Badge variant="destructive" className="text-xs"><XCircle className="h-3 w-3 mr-1" />Rejetée</Badge>
    case 'EXECUTED':
      return <Badge className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-600"><Gavel className="h-3 w-3 mr-1" />Exécutée</Badge>
    case 'EXPIRED':
      return <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" />Expirée</Badge>
    default:
      return <Badge variant="secondary" className="text-xs">{status}</Badge>
  }
}

export default async function GovernancePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userId = session.user.id

  // Get all offerings where user holds tokens
  const purchases = await prisma.filmTokenPurchase.findMany({
    where: { userId, status: 'CONFIRMED' },
    select: { offeringId: true },
    distinct: ['offeringId'],
  })
  const myOfferingIds = purchases.map((p) => p.offeringId)

  // Fetch active proposals for user's offerings
  const activeProposals = await prisma.governanceProposal.findMany({
    where: {
      offeringId: { in: myOfferingIds },
      status: 'ACTIVE',
    },
    include: {
      offering: {
        include: { film: true },
      },
      proposer: {
        select: { displayName: true },
      },
      votes: {
        where: { userId },
      },
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch past proposals
  const pastProposals = await prisma.governanceProposal.findMany({
    where: {
      offeringId: { in: myOfferingIds },
      status: { in: ['PASSED', 'REJECTED', 'EXECUTED', 'EXPIRED'] },
    },
    include: {
      offering: {
        include: { film: true },
      },
      proposer: {
        select: { displayName: true },
      },
      _count: { select: { votes: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  })

  // Get user's token balances per offering for voting power display
  const balances = new Map<string, number>()
  for (const id of myOfferingIds) {
    const balance = await getTokenBalance(id, userId)
    balances.set(id, balance)
  }

  // Get offerings for create proposal section
  const userOfferings = await prisma.filmTokenOffering.findMany({
    where: {
      id: { in: myOfferingIds },
      votingRights: true,
    },
    include: { film: true },
  })

  // Total voting power
  const totalVotingPower = Array.from(balances.values()).reduce((sum, b) => sum + b, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sub-Nav */}
      <TokenizationNav active="governance" />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Gouvernance
          </h1>
          <p className="text-white/40 mt-1 text-sm">Votez sur les décisions créatives des films dans lesquels vous avez investi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
            <Scale className="h-4 w-4 text-[#E50914]" />
            <span className="text-white text-sm font-semibold">{totalVotingPower}</span>
            <span className="text-white/30 text-xs">pouvoir de vote</span>
          </div>
        </div>
      </div>

      {myOfferingIds.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-8 text-center">
            <Vote className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/50 text-sm">Vous ne détenez aucun token pour le moment.</p>
            <p className="text-white/30 text-xs mt-1">Investissez dans un film pour participer à la gouvernance.</p>
            <Link href="/tokenization" className="mt-4 inline-block">
              <Button variant="outline" className="min-h-[44px]">
                <Coins className="h-4 w-4 mr-2" />
                Explorer les offres
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Proposals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)]">
                Propositions Actives
              </h2>
              <Badge variant="warning">{activeProposals.length} en cours</Badge>
            </div>

            {activeProposals.length === 0 ? (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-6 text-center">
                  <Gavel className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">Aucune proposition active pour vos films.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeProposals.map((proposal) => {
                  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.abstentions
                  const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0
                  const againstPct = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0
                  const abstainPct = totalVotes > 0 ? Math.round((proposal.abstentions / totalVotes) * 100) : 0
                  const hasVoted = proposal.votes.length > 0
                  const userVote = hasVoted ? proposal.votes[0].vote : null
                  const userTokenWeight = balances.get(proposal.offeringId) || 0
                  const timeLeft = getTimeRemaining(proposal.deadline)

                  // Quorum calculation
                  const quorumRequired = Math.ceil(proposal.offering.totalTokens * proposal.quorumPct / 100)
                  const quorumReached = totalVotes >= quorumRequired
                  const quorumPct = quorumRequired > 0 ? Math.min(100, Math.round((totalVotes / quorumRequired) * 100)) : 0

                  return (
                    <Card key={proposal.id} className="bg-white/[0.03] border-white/10">
                      <CardContent className="p-5 sm:p-6 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link href={`/tokenization/${proposal.offering.filmId}`} className="text-[#E50914] text-xs hover:underline flex items-center gap-1">
                                <Film className="h-3 w-3" />
                                {proposal.offering.film.title}
                              </Link>
                              <Badge variant="outline" className="text-[10px]">
                                {PROPOSAL_TYPE_LABELS[proposal.type] || proposal.type}
                              </Badge>
                              <ProposalStatusBadge status={proposal.status} />
                            </div>
                            <h3 className="text-white text-base sm:text-lg font-semibold">{proposal.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{proposal.description}</p>
                            <div className="flex items-center gap-3 text-[10px] text-white/20 pt-1">
                              <span>Par {proposal.proposer.displayName || 'Anonyme'}</span>
                              <span>{formatDate(proposal.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/30 text-xs shrink-0">
                            <Clock className="h-3.5 w-3.5" />
                            {timeLeft}
                          </div>
                        </div>

                        {/* Vote Bar */}
                        <div className="space-y-2">
                          <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
                            <div
                              className="bg-green-500 transition-all duration-500"
                              style={{ width: `${forPct}%` }}
                            />
                            <div
                              className="bg-white/10 transition-all duration-500"
                              style={{ width: `${abstainPct}%` }}
                            />
                            <div
                              className="bg-red-500 transition-all duration-500"
                              style={{ width: `${againstPct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Pour: {forPct}% ({proposal.votesFor})
                              </span>
                              <span className="text-white/30 flex items-center gap-1">
                                <MinusCircle className="h-3 w-3" />
                                Abstention: {abstainPct}%
                              </span>
                              <span className="text-red-400 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Contre: {againstPct}% ({proposal.votesAgainst})
                              </span>
                            </div>
                            <span className="text-white/20 text-[10px]">{proposal._count.votes} vote(s)</span>
                          </div>
                        </div>

                        {/* Quorum */}
                        <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/30">Quorum ({proposal.quorumPct}%)</span>
                            <span className={quorumReached ? 'text-green-600' : 'text-white/50'}>
                              {quorumReached ? 'Atteint' : `${quorumPct}% — ${totalVotes}/${quorumRequired} tokens`}
                            </span>
                          </div>
                          <Progress
                            value={quorumPct}
                            className="h-1.5"
                            indicatorClassName={quorumReached ? 'bg-green-500' : undefined}
                          />
                        </div>

                        {/* Vote Buttons */}
                        {hasVoted ? (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <CheckCircle2 className="h-4 w-4 text-[#E50914]" />
                            <span className="text-white/50 text-sm">
                              Vous avez voté : <strong className={
                                userVote === 'FOR' ? 'text-green-600' :
                                userVote === 'AGAINST' ? 'text-red-400' : 'text-white/50'
                              }>
                                {userVote === 'FOR' ? 'Pour' : userVote === 'AGAINST' ? 'Contre' : 'Abstention'}
                              </strong>
                              {' '}({proposal.votes[0].tokenWeight} tokens)
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-white/30 text-xs">
                              Votre pouvoir de vote : <strong className="text-[#E50914]">{userTokenWeight} token(s)</strong>
                            </p>
                            <div className="flex gap-2">
                              <form action={async (fd: FormData) => { 'use server'; await voteOnProposalAction(fd) }} className="flex-1">
                                <input type="hidden" name="proposalId" value={proposal.id} />
                                <input type="hidden" name="vote" value="FOR" />
                                <Button
                                  variant="outline"
                                  className="w-full min-h-[44px] border-green-500/20 text-green-600 hover:bg-green-500/10"
                                  type="submit"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Pour
                                </Button>
                              </form>
                              <form action={async (fd: FormData) => { 'use server'; await voteOnProposalAction(fd) }} className="flex-1">
                                <input type="hidden" name="proposalId" value={proposal.id} />
                                <input type="hidden" name="vote" value="AGAINST" />
                                <Button
                                  variant="outline"
                                  className="w-full min-h-[44px] border-red-500/20 text-red-400 hover:bg-red-500/10"
                                  type="submit"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Contre
                                </Button>
                              </form>
                              <form action={async (fd: FormData) => { 'use server'; await voteOnProposalAction(fd) }}>
                                <input type="hidden" name="proposalId" value={proposal.id} />
                                <input type="hidden" name="vote" value="ABSTAIN" />
                                <Button
                                  variant="ghost"
                                  className="min-h-[44px] text-white/30"
                                  type="submit"
                                >
                                  <MinusCircle className="h-4 w-4 mr-1" />
                                  Abstention
                                </Button>
                              </form>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          {/* Past Proposals */}
          {pastProposals.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
                Propositions Passées
              </h2>
              <div className="space-y-2">
                {pastProposals.map((proposal) => {
                  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.abstentions
                  const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0

                  return (
                    <Card key={proposal.id} className="bg-white/[0.02] border-white/5">
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <ProposalStatusBadge status={proposal.status} />
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{proposal.title}</p>
                            <div className="flex items-center gap-2 text-[10px] text-white/20 mt-0.5">
                              <span>{proposal.offering.film.title}</span>
                              <span>|</span>
                              <span>{proposal._count.votes} votes</span>
                              <span>|</span>
                              <span>Pour: {forPct}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Mini progress bar */}
                          <div className="w-20 h-2 rounded-full overflow-hidden bg-white/5 hidden sm:block">
                            <div
                              className={`h-full ${proposal.status === 'PASSED' || proposal.status === 'EXECUTED' ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${forPct}%` }}
                            />
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {PROPOSAL_TYPE_LABELS[proposal.type] || proposal.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          {/* Create Proposal */}
          {userOfferings.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
                Créer une Proposition
              </h2>
              <Card variant="glass">
                <CardContent className="p-5 sm:p-6">
                  <form action={async (fd: FormData) => { 'use server'; await createProposalAction(null, fd) }} className="space-y-4">
                    {/* Offering select */}
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Film concerné</label>
                      <select
                        name="offeringId"
                        required
                        className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200"
                      >
                        <option value="" className="bg-[#111]">Sélectionner un film</option>
                        {userOfferings.map((o) => (
                          <option key={o.id} value={o.id} className="bg-[#111]">
                            {o.film.title} ({balances.get(o.id) || 0} tokens)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Type de proposition</label>
                      <select
                        name="type"
                        required
                        className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200"
                      >
                        <option value="" className="bg-[#111]">Sélectionner un type</option>
                        {Object.entries(PROPOSAL_TYPE_LABELS).map(([key, label]) => (
                          <option key={key} value={key} className="bg-[#111]">{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Titre</label>
                      <input
                        type="text"
                        name="title"
                        required
                        minLength={5}
                        maxLength={200}
                        placeholder="Titre de votre proposition..."
                        className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Description</label>
                      <textarea
                        name="description"
                        required
                        minLength={20}
                        rows={4}
                        placeholder="Décrivez votre proposition en détail..."
                        className="flex min-h-[100px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200 resize-vertical"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Durée du vote (jours)</label>
                      <input
                        type="number"
                        name="deadlineDays"
                        min={1}
                        max={30}
                        defaultValue={7}
                        className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200"
                      />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto min-h-[44px]">
                      <Plus className="h-4 w-4 mr-2" />
                      Soumettre la proposition
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          )}
        </>
      )}

      {/* Governance Info */}
      <Card className="bg-white/[0.02] border-white/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-white/20 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-white/50 text-sm font-medium">Comment fonctionne la gouvernance ?</h3>
              <ul className="text-white/30 text-xs leading-relaxed space-y-1">
                <li>Chaque token détenu représente une voix. Plus vous détenez de tokens, plus votre vote a de poids.</li>
                <li>Les propositions doivent atteindre le quorum (généralement 30% des tokens) pour être valides.</li>
                <li>Les décisions adoptées sont exécutées par l&apos;équipe de production dans un délai raisonnable.</li>
                <li>Vous recevez 5 Lumens de récompense pour chaque vote effectué.</li>
                <li>Tout détenteur de tokens peut soumettre une proposition.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
