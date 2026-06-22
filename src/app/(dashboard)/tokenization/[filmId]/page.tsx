import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Coins, TrendingUp, Film, Users, Clock, Shield,
  ArrowRight, ArrowLeft, Vote, Briefcase, Lock,
  CheckCircle2, AlertTriangle, BarChart3, Calendar,
  CircleDollarSign, Wallet, Scale, Percent,
  ShoppingCart, Gavel, PiggyBank, FileText
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  formatEur, getOfferingProgress, getTimeRemaining,
  RISK_LABELS, OFFERING_STATUS_LABELS, PROPOSAL_TYPE_LABELS,
  PLATFORM_FEE_PCT, getTokenBalance,
} from '@/lib/tokenization'
import { BUDGET_CATEGORY_COLORS } from '@/lib/film-decomposer'
import { buyTokensAction, voteOnProposalAction } from '@/app/actions/tokenization'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ filmId: string }> }): Promise<Metadata> {
  const { filmId } = await params
  const film = await prisma.film.findUnique({ where: { id: filmId } })
  return {
    title: film ? `${film.title} — Tokenization` : 'Film introuvable',
  }
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

export default async function FilmTokenDetailPage({ params }: { params: Promise<{ filmId: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { filmId } = await params

  // Fetch film with offering and budget lines
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: {
      tokenOffering: {
        include: {
          purchases: {
            where: { status: 'CONFIRMED' },
            orderBy: { createdAt: 'desc' },
          },
          transfers: {
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
          },
          proposals: {
            where: { status: 'ACTIVE' },
            include: {
              _count: { select: { votes: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          revenues: {
            orderBy: { period: 'desc' },
            take: 6,
          },
          dividends: {
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      budgetLines: {
        orderBy: { percentage: 'desc' },
      },
    },
  })

  if (!film || !film.tokenOffering) notFound()

  const offering = film.tokenOffering
  const progress = getOfferingProgress(offering)
  const risk = RISK_LABELS[offering.riskLevel] || RISK_LABELS.MEDIUM
  const timeLeft = getTimeRemaining(offering.closesAt)
  const remaining = offering.totalTokens - offering.tokensSold

  // User's token balance
  const userBalance = await getTokenBalance(offering.id, session.user.id)

  // Token holders count
  const holdersCount = await prisma.filmTokenPurchase.groupBy({
    by: ['userId'],
    where: { offeringId: offering.id, status: 'CONFIRMED' },
  })

  // Pending dividends
  const pendingDividends = offering.dividends.filter(d => d.status === 'PENDING' || d.status === 'CALCULATED')

  // Total revenue
  const totalRevenue = offering.revenues.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sub-Nav */}
      <TokenizationNav active="marketplace" />

      {/* Back link */}
      <Link href="/tokenization" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors min-h-[44px]">
        <ArrowLeft className="h-4 w-4" />
        Retour au Marketplace
      </Link>

      {/* Film Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
        <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
          {/* Cover */}
          <div className="w-full lg:w-64 h-48 lg:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-[#E50914]/10 to-purple-500/10 shrink-0">
            {film.coverImageUrl ? (
              <img
                src={film.coverImageUrl}
                alt={film.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="h-16 w-16 text-white/10" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${risk.bgColor} text-xs`}>{risk.label}</Badge>
              <Badge variant="secondary">{offering.legalStructure === 'IL_EXEMPT' ? 'ISA Exemptée' : offering.legalStructure}</Badge>
              <Badge variant="outline" className="text-xs">{OFFERING_STATUS_LABELS[offering.status] || offering.status}</Badge>
              {film.genre && <Badge variant="outline" className="text-xs">{film.genre}</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
              {film.title}
            </h1>

            {film.synopsis && (
              <p className="text-white/50 text-sm leading-relaxed max-w-2xl">{film.synopsis}</p>
            )}

            {/* Offering Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { label: 'Prix / Token', value: formatEur(offering.tokenPrice), icon: Coins, color: 'text-[#E50914]' },
                { label: 'Vendus / Total', value: `${offering.tokensSold.toLocaleString('fr-FR')} / ${offering.totalTokens.toLocaleString('fr-FR')}`, icon: BarChart3, color: 'text-blue-600' },
                { label: 'Levée', value: `${formatEur(offering.raised)} / ${formatEur(offering.hardCap)}`, icon: CircleDollarSign, color: 'text-green-600' },
                { label: 'Temps restant', value: timeLeft, icon: Clock, color: 'text-orange-600' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                    <span className="text-white/30 text-[10px]">{stat.label}</span>
                  </div>
                  <p className="text-white text-sm font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/50 text-xs">Progression de la levée</span>
                <span className="text-[#E50914] text-sm font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Breakdown */}
          {film.budgetLines.length > 0 && (
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#E50914]" />
                  Répartition du Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {film.budgetLines.map((line) => {
                  const color = BUDGET_CATEGORY_COLORS[line.category] || '#6B7280'
                  return (
                    <div key={line.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-white/70 text-sm">{line.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/30 text-xs">{line.percentage}%</span>
                          <span className="text-white text-sm font-medium">{formatEur(line.amount)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${line.percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Governance — Active Proposals */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-purple-600" />
                  Gouvernance
                </CardTitle>
                <Link href="/tokenization/governance">
                  <Badge variant="outline" className="cursor-pointer hover:border-white/30">
                    Voir tout
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {offering.proposals.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">Aucune proposition active.</p>
              ) : (
                <div className="space-y-3">
                  {offering.proposals.map((proposal) => {
                    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.abstentions
                    const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0
                    const againstPct = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0

                    return (
                      <div key={proposal.id} className="rounded-lg bg-white/[0.02] border border-white/5 p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-white text-sm font-medium">{proposal.title}</h4>
                            <p className="text-white/30 text-xs mt-1 line-clamp-2">{proposal.description}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {PROPOSAL_TYPE_LABELS[proposal.type] || proposal.type}
                          </Badge>
                        </div>

                        {/* Vote Bar */}
                        <div className="space-y-1">
                          <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
                            <div
                              className="bg-green-500 transition-all"
                              style={{ width: `${forPct}%` }}
                            />
                            <div
                              className="bg-red-500 transition-all"
                              style={{ width: `${againstPct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-green-600">Pour: {forPct}%</span>
                            <span className="text-white/20">{proposal._count.votes} vote(s)</span>
                            <span className="text-red-400">Contre: {againstPct}%</span>
                          </div>
                        </div>

                        {/* Vote Buttons */}
                        {userBalance > 0 && (
                          <div className="flex gap-2">
                            <form action={async (fd: FormData) => { 'use server'; await voteOnProposalAction(fd) }} className="flex-1">
                              <input type="hidden" name="proposalId" value={proposal.id} />
                              <input type="hidden" name="vote" value="FOR" />
                              <Button variant="outline" size="sm" className="w-full min-h-[44px] border-green-500/20 text-green-600 hover:bg-green-500/10" type="submit">
                                Pour
                              </Button>
                            </form>
                            <form action={async (fd: FormData) => { 'use server'; await voteOnProposalAction(fd) }} className="flex-1">
                              <input type="hidden" name="proposalId" value={proposal.id} />
                              <input type="hidden" name="vote" value="AGAINST" />
                              <Button variant="outline" size="sm" className="w-full min-h-[44px] border-red-500/20 text-red-400 hover:bg-red-500/10" type="submit">
                                Contre
                              </Button>
                            </form>
                            <form action={async (fd: FormData) => { 'use server'; await voteOnProposalAction(fd) }}>
                              <input type="hidden" name="proposalId" value={proposal.id} />
                              <input type="hidden" name="vote" value="ABSTAIN" />
                              <Button variant="ghost" size="sm" className="min-h-[44px] text-white/30" type="submit">
                                Abstention
                              </Button>
                            </form>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue & Dividends */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-green-600" />
                Revenus & Dividendes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offering.revenues.length === 0 ? (
                <div className="text-center py-6">
                  <PiggyBank className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">Aucun revenu enregistré pour le moment.</p>
                  <p className="text-white/20 text-xs mt-1">Les revenus seront distribués une fois le film financé et exploité.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Revenue Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-green-500/5 border border-green-500/10 p-3">
                      <p className="text-white/30 text-xs">Revenu total</p>
                      <p className="text-green-600 text-lg font-bold">{formatEur(totalRevenue)}</p>
                    </div>
                    <div className="rounded-lg bg-[#E50914]/5 border border-[#E50914]/10 p-3">
                      <p className="text-white/30 text-xs">Part distributable</p>
                      <p className="text-[#E50914] text-lg font-bold">{formatEur(totalRevenue * offering.distributionPct / 100)}</p>
                    </div>
                  </div>

                  {/* Revenue Lines */}
                  <div className="space-y-2">
                    {offering.revenues.map((rev) => (
                      <div key={rev.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{rev.source}</Badge>
                          <span className="text-white/30 text-xs">{rev.period}</span>
                        </div>
                        <span className="text-white text-sm font-medium">{formatEur(rev.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Secondary Market */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Marché Secondaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offering.transfers.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingCart className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">Aucune offre de vente pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {offering.transfers.map((transfer) => (
                    <div key={transfer.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 p-3">
                      <div>
                        <p className="text-white text-sm">{transfer.tokenCount} token(s)</p>
                        <p className="text-white/30 text-xs">{formatEur(transfer.pricePerToken)} / token</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#E50914] text-sm font-semibold">{formatEur(transfer.totalAmount)}</p>
                        <p className="text-white/20 text-[10px]">Frais: {formatEur(transfer.fee)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) — Sidebar */}
        <div className="space-y-6">
          {/* Buy Tokens Form */}
          {offering.status === 'OPEN' && (
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-[#E50914]" />
                  Acheter des Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={async (fd: FormData) => { 'use server'; await buyTokensAction(null, fd) }} className="space-y-4">
                  <input type="hidden" name="offeringId" value={offering.id} />

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">Nombre de tokens</label>
                    <input
                      type="number"
                      name="tokenCount"
                      min={offering.minInvestment}
                      max={remaining}
                      defaultValue={offering.minInvestment}
                      className="flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-lg text-white font-semibold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200"
                    />
                  </div>

                  <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">Prix unitaire</span>
                      <span className="text-white text-sm">{formatEur(offering.tokenPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">Tokens disponibles</span>
                      <span className="text-white text-sm">{remaining.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">Verrouillage</span>
                      <span className="text-white text-sm flex items-center gap-1">
                        <Lock className="h-3 w-3 text-white/30" />
                        {offering.lockupDays} jours
                      </span>
                    </div>
                    {offering.maxPerUser && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">Max / investisseur</span>
                        <span className="text-white text-sm">{offering.maxPerUser}</span>
                      </div>
                    )}
                  </div>

                  {offering.kycRequired && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <Shield className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="text-white/40 text-[10px]">
                        Vérification KYC requise. Votre profil doit être vérifié pour investir.
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full min-h-[48px] text-base">
                    <Coins className="h-5 w-5 mr-2" />
                    Investir
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* User Holdings */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#E50914]" />
                Vos Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-3">
                <p className="text-3xl font-bold text-[#E50914]">{userBalance}</p>
                <p className="text-white/30 text-xs mt-1">token(s) détenus</p>
                {offering.totalTokens > 0 && (
                  <p className="text-white/20 text-[10px] mt-0.5">
                    {Math.round((userBalance / offering.totalTokens) * 10000) / 100}% du total
                  </p>
                )}
              </div>

              {/* Pending dividends */}
              {pendingDividends.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-white/50 text-xs mb-2">Dividendes en attente</p>
                  {pendingDividends.map((div) => (
                    <div key={div.id} className="flex items-center justify-between py-1.5">
                      <span className="text-white/30 text-xs">{div.period}</span>
                      <span className="text-green-600 text-sm font-medium">{formatEur(div.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              {userBalance > 0 && (
                <Link href="/tokenization/portfolio" className="block mt-3">
                  <Button variant="outline" size="sm" className="w-full min-h-[44px]">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Voir mon portfolio
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Token Holders Distribution */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <p className="text-white text-xl font-bold">{holdersCount.length}</p>
                  <p className="text-white/30 text-[10px]">Investisseurs</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <p className="text-white text-xl font-bold">{offering.distributionPct}%</p>
                  <p className="text-white/30 text-[10px]">Part distribuée</p>
                </div>
              </div>
              {offering.projectedROI && (
                <div className="rounded-lg bg-green-500/5 border border-green-500/10 p-3 text-center">
                  <p className="text-green-600 text-lg font-bold flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    ~{offering.projectedROI}%
                  </p>
                  <p className="text-white/30 text-[10px]">ROI projeté</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Offering Info */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-white/40" />
                Informations Clés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Structure légale', value: offering.legalStructure === 'IL_EXEMPT' ? 'ISA Exemptée (<5M ILS)' : offering.legalStructure },
                { label: 'Modèle de revenus', value: offering.revenueModel === 'REVENUE_SHARE' ? 'Partage de revenus' : offering.revenueModel },
                { label: 'Droits de vote', value: offering.votingRights ? 'Oui' : 'Non' },
                { label: 'KYC requis', value: offering.kycRequired ? 'Oui' : 'Non' },
                { label: 'Investisseurs accrédités', value: offering.accreditedOnly ? 'Uniquement' : 'Non requis' },
                { label: 'Frais plateforme', value: `${PLATFORM_FEE_PCT}%` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-white/30 text-xs">{item.label}</span>
                  <span className="text-white text-xs font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Disclaimer */}
          <Card className="bg-red-500/[0.03] border-red-500/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 text-xs font-medium mb-1">Avertissement Risques</p>
                  <p className="text-white/30 text-[10px] leading-relaxed">
                    L&apos;investissement dans des tokens de co-production cinématographique comporte des risques significatifs,
                    incluant la perte totale du capital. Les performances passées ne garantissent pas les résultats futurs.
                    Investissez uniquement des sommes que vous pouvez vous permettre de perdre.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
