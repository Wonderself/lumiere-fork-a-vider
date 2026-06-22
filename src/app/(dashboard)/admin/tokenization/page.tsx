import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import {
  Coins, TrendingUp, Users, AlertTriangle, Play, Pause, Ban,
  DollarSign, ArrowRightLeft, PieChart, Plus, CheckCircle,
  Clock, BarChart3, Banknote, ShieldCheck,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Gestion des Tokens' }

// ============================================
// Server Actions
// ============================================

async function openOfferingAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const offeringId = formData.get('offeringId') as string
  await prisma.filmTokenOffering.update({
    where: { id: offeringId },
    data: { status: 'OPEN', opensAt: new Date() },
  })
  revalidatePath('/admin/tokenization')
}

async function closeOfferingAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const offeringId = formData.get('offeringId') as string
  await prisma.filmTokenOffering.update({
    where: { id: offeringId },
    data: { status: 'CLOSED', closesAt: new Date() },
  })
  revalidatePath('/admin/tokenization')
}

async function suspendOfferingAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const offeringId = formData.get('offeringId') as string
  await prisma.filmTokenOffering.update({
    where: { id: offeringId },
    data: { status: 'SUSPENDED' },
  })
  revalidatePath('/admin/tokenization')
}

async function distributeRevenueAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const offeringId = formData.get('offeringId') as string
  const period = formData.get('period') as string

  // Get undistributed revenues for this offering + period
  const revenues = await prisma.filmRevenue.findMany({
    where: { offeringId, period, distributed: false },
  })

  if (revenues.length === 0) return

  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0)

  // Get the offering to find distribution percentage
  const offering = await prisma.filmTokenOffering.findUnique({
    where: { id: offeringId },
  })
  if (!offering) return

  const distributablePool = totalRevenue * (offering.distributionPct / 100)

  // Get all purchases to calculate proportional shares
  const purchases = await prisma.filmTokenPurchase.findMany({
    where: { offeringId, status: 'CONFIRMED' },
  })

  const totalTokensSold = purchases.reduce((s, p) => s + p.tokenCount, 0)
  if (totalTokensSold === 0) return

  // Group by user for dividend calculation
  const userTokens: Record<string, number> = {}
  for (const p of purchases) {
    userTokens[p.userId] = (userTokens[p.userId] || 0) + p.tokenCount
  }

  // Create dividends for each user
  for (const [userId, tokenCount] of Object.entries(userTokens)) {
    const share = tokenCount / totalTokensSold
    const amount = Math.round(distributablePool * share * 100) / 100

    await prisma.tokenDividend.create({
      data: {
        offeringId,
        userId,
        amount,
        period,
        tokenCount,
        totalPool: distributablePool,
        status: 'CALCULATED',
      },
    })
  }

  // Mark revenues as distributed
  await prisma.filmRevenue.updateMany({
    where: { offeringId, period, distributed: false },
    data: { distributed: true },
  })

  revalidatePath('/admin/tokenization')
}

async function addRevenueAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const offeringId = formData.get('offeringId') as string
  const source = formData.get('source') as string
  const amount = parseFloat(formData.get('amount') as string)
  const period = formData.get('period') as string

  if (!offeringId || !source || isNaN(amount) || !period) return

  await prisma.filmRevenue.create({
    data: { offeringId, source, amount, period },
  })
  revalidatePath('/admin/tokenization')
}

// ============================================
// Status helpers
// ============================================

const statusColors: Record<string, string> = {
  DRAFT: 'bg-white/[0.03]0/10 text-white/50 border-gray-500/20',
  PENDING_LEGAL: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  OPEN: 'bg-green-500/10 text-green-600 border-green-500/20',
  FUNDED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  CLOSED: 'bg-white/10 text-white/50 border-white/10',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  SUSPENDED: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Brouillon',
  PENDING_LEGAL: 'En attente juridique',
  OPEN: 'Ouvert',
  FUNDED: 'Financé',
  CLOSED: 'Clôturé',
  CANCELLED: 'Annulé',
  SUSPENDED: 'Suspendu',
}

// ============================================
// Page
// ============================================

export default async function AdminTokenizationPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [offerings, allPurchases, allTransfers, allDividends, allRevenues] = await Promise.all([
    prisma.filmTokenOffering.findMany({
      include: {
        film: { select: { title: true, slug: true, genre: true } },
        purchases: { where: { status: 'CONFIRMED' } },
        revenues: true,
        dividends: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.filmTokenPurchase.count({ where: { status: 'CONFIRMED' } }),
    prisma.filmTokenTransfer.findMany({ where: { status: 'COMPLETED' } }),
    prisma.tokenDividend.findMany(),
    prisma.filmRevenue.findMany(),
  ])

  // Aggregate stats
  const totalRaised = offerings.reduce((s, o) => s + o.raised, 0)
  const activeOfferings = offerings.filter((o) => o.status === 'OPEN').length
  const uniqueInvestors = new Set(
    offerings.flatMap((o) => o.purchases.map((p) => p.userId))
  ).size
  const pendingKyc = await prisma.filmTokenPurchase.count({
    where: { status: 'KYC_REQUIRED' },
  })

  // Secondary market stats
  const secondaryVolume = allTransfers.reduce((s, t) => s + t.totalAmount, 0)
  const secondaryFees = allTransfers.reduce((s, t) => s + t.fee, 0)

  // Revenue stats
  const totalRevenue = allRevenues.reduce((s, r) => s + r.amount, 0)
  const distributedRevenue = allRevenues
    .filter((r) => r.distributed)
    .reduce((s, r) => s + r.amount, 0)
  const pendingRevenue = totalRevenue - distributedRevenue

  const stats = [
    { icon: Coins, label: 'Total levé', value: formatPrice(totalRaised), color: 'text-[#E50914]' },
    { icon: Play, label: 'Offres actives', value: activeOfferings.toString(), color: 'text-green-600' },
    { icon: Users, label: 'Investisseurs', value: uniqueInvestors.toString(), color: 'text-blue-600' },
    { icon: ShieldCheck, label: 'KYC en attente', value: pendingKyc.toString(), color: pendingKyc > 0 ? 'text-orange-600' : 'text-green-600' },
    { icon: ArrowRightLeft, label: 'Volume secondaire', value: formatPrice(secondaryVolume), color: 'text-purple-600' },
    { icon: Banknote, label: 'Revenus totaux', value: formatPrice(totalRevenue), color: 'text-cyan-600' },
  ]

  // Current period for forms
  const now = new Date()
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">
            <Coins className="inline h-7 w-7 text-[#E50914] mr-2 -mt-1" />
            Gestion des Tokens
          </h1>
          <p className="text-white/50 mt-1">
            Offres de tokenisation, distribution de dividendes et marché secondaire.
          </p>
        </div>
        <a href="/admin/film-tokenizer">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nouvelle Offre
          </Button>
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Offerings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="h-4 w-4 text-[#E50914]" />
            Offres de Tokenisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {offerings.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="h-12 w-12 mx-auto text-white/10 mb-3" />
              <p className="text-white/30">Aucune offre de tokenisation</p>
              <p className="text-xs text-white/20 mt-1">
                Créez votre première offre via le Film Tokenizer.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Table header - desktop */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-white/30 uppercase tracking-wider">
                <div className="col-span-3">Film</div>
                <div className="col-span-1">Statut</div>
                <div className="col-span-2">Levée / Cap</div>
                <div className="col-span-1">Prix token</div>
                <div className="col-span-1">Investisseurs</div>
                <div className="col-span-1">Risque</div>
                <div className="col-span-3">Actions</div>
              </div>

              {offerings.map((offering) => {
                const progress = offering.hardCap > 0
                  ? Math.round((offering.raised / offering.hardCap) * 100)
                  : 0
                const investorCount = new Set(offering.purchases.map((p) => p.userId)).size

                return (
                  <div
                    key={offering.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all p-4"
                  >
                    {/* Mobile layout */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{offering.film.title}</p>
                          <p className="text-xs text-white/40">{offering.film.genre || 'N/A'}</p>
                        </div>
                        <Badge className={statusColors[offering.status]}>
                          {statusLabels[offering.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#E50914] font-bold">
                          {formatPrice(offering.raised)} / {formatPrice(offering.hardCap)}
                        </span>
                        <span className="text-white/40">{investorCount} investisseurs</span>
                      </div>
                      {/* Progress */}
                      <div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-white/30 mt-1">{progress}% financé</p>
                      </div>
                      {/* Mobile actions */}
                      <div className="flex gap-2">
                        {offering.status !== 'OPEN' && offering.status !== 'CLOSED' && (
                          <form action={openOfferingAction}>
                            <input type="hidden" name="offeringId" value={offering.id} />
                            <Button type="submit" size="sm" className="min-h-[44px]">
                              <Play className="h-3 w-3 mr-1" /> Ouvrir
                            </Button>
                          </form>
                        )}
                        {offering.status === 'OPEN' && (
                          <>
                            <form action={closeOfferingAction}>
                              <input type="hidden" name="offeringId" value={offering.id} />
                              <Button type="submit" size="sm" variant="secondary" className="min-h-[44px]">
                                <Pause className="h-3 w-3 mr-1" /> Clôturer
                              </Button>
                            </form>
                            <form action={suspendOfferingAction}>
                              <input type="hidden" name="offeringId" value={offering.id} />
                              <Button type="submit" size="sm" variant="destructive" className="min-h-[44px]">
                                <Ban className="h-3 w-3 mr-1" /> Suspendre
                              </Button>
                            </form>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <p className="font-semibold truncate">{offering.film.title}</p>
                        <p className="text-xs text-white/40">{offering.film.genre || 'N/A'}</p>
                      </div>
                      <div className="col-span-1">
                        <Badge className={statusColors[offering.status]}>
                          {statusLabels[offering.status]}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-[#E50914]">
                          {formatPrice(offering.raised)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D]"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/30">{progress}%</span>
                        </div>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          Cap: {formatPrice(offering.hardCap)}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-sm">{formatPrice(offering.tokenPrice)}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-sm">{investorCount}</p>
                      </div>
                      <div className="col-span-1">
                        <Badge
                          className={
                            offering.riskLevel === 'LOW'
                              ? 'bg-green-500/10 text-green-600 border-green-500/20'
                              : offering.riskLevel === 'HIGH' || offering.riskLevel === 'VERY_HIGH'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                          }
                        >
                          {offering.riskLevel}
                        </Badge>
                      </div>
                      <div className="col-span-3 flex gap-2">
                        {offering.status !== 'OPEN' && offering.status !== 'CLOSED' && (
                          <form action={openOfferingAction}>
                            <input type="hidden" name="offeringId" value={offering.id} />
                            <Button type="submit" size="sm" className="min-h-[44px]">
                              <Play className="h-3 w-3 mr-1" /> Ouvrir
                            </Button>
                          </form>
                        )}
                        {offering.status === 'OPEN' && (
                          <>
                            <form action={closeOfferingAction}>
                              <input type="hidden" name="offeringId" value={offering.id} />
                              <Button type="submit" size="sm" variant="secondary" className="min-h-[44px]">
                                <Pause className="h-3 w-3 mr-1" /> Clôturer
                              </Button>
                            </form>
                            <form action={suspendOfferingAction}>
                              <input type="hidden" name="offeringId" value={offering.id} />
                              <Button type="submit" size="sm" variant="destructive" className="min-h-[44px]">
                                <Ban className="h-3 w-3 mr-1" /> Suspendre
                              </Button>
                            </form>
                          </>
                        )}
                        {(offering.status === 'SUSPENDED' || offering.status === 'CLOSED') && (
                          <form action={openOfferingAction}>
                            <input type="hidden" name="offeringId" value={offering.id} />
                            <Button type="submit" size="sm" variant="outline" className="min-h-[44px]">
                              <Play className="h-3 w-3 mr-1" /> Réouvrir
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Dividend Distribution Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#E50914]" />
              Distribution de Dividendes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offerings.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">
                Aucune offre disponible
              </p>
            ) : (
              <form action={distributeRevenueAction} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Offre</label>
                  <select
                    name="offeringId"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                  >
                    <option value="">Sélectionner une offre...</option>
                    {offerings.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.film.title} — {formatPrice(o.raised)} levés
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Période</label>
                  <input
                    type="month"
                    name="period"
                    defaultValue={currentPeriod}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                  />
                </div>

                {/* Distribution info */}
                <div className="bg-white/[0.02] rounded-lg p-3 space-y-1.5">
                  <p className="text-xs text-white/40">Calcul de la distribution :</p>
                  <p className="text-xs text-white/50">
                    1. Somme des revenus non distribués pour la période
                  </p>
                  <p className="text-xs text-white/50">
                    2. Application du % de distribution (70% par défaut)
                  </p>
                  <p className="text-xs text-white/50">
                    3. Répartition proportionnelle aux tokens détenus
                  </p>
                </div>

                <Button type="submit" className="w-full min-h-[44px]">
                  <Banknote className="h-4 w-4 mr-2" />
                  Distribuer les Dividendes
                </Button>
              </form>
            )}

            {/* Recent dividends */}
            {allDividends.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-white/40 mb-3">Dernières distributions</p>
                <div className="space-y-2">
                  {allDividends.slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-white/60">{d.period}</span>
                      </div>
                      <span className="text-[#E50914] font-medium">{formatPrice(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Logging Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#E50914]" />
              Ajouter un Revenu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offerings.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">
                Aucune offre disponible
              </p>
            ) : (
              <form action={addRevenueAction} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Offre</label>
                  <select
                    name="offeringId"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                  >
                    <option value="">Sélectionner une offre...</option>
                    {offerings.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.film.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Source de revenu</label>
                  <select
                    name="source"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="STREAMING">Streaming</option>
                    <option value="THEATRICAL">Salle de cinéma</option>
                    <option value="MERCH">Merchandising</option>
                    <option value="LICENSING">Licences</option>
                    <option value="SPONSORSHIP">Sponsoring</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Montant (EUR)</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Période</label>
                  <input
                    type="month"
                    name="period"
                    defaultValue={currentPeriod}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                  />
                </div>

                <Button type="submit" variant="outline" className="w-full min-h-[44px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Enregistrer le Revenu
                </Button>
              </form>
            )}

            {/* Revenue summary */}
            <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Revenus totaux</span>
                <span className="text-sm font-bold text-[#E50914]">{formatPrice(totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Distribués</span>
                <span className="text-sm text-green-600">{formatPrice(distributedRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">En attente</span>
                <span className="text-sm text-orange-600">{formatPrice(pendingRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Market Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-[#E50914]" />
            Marché Secondaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{formatPrice(secondaryVolume)}</p>
              <p className="text-xs text-white/40 mt-1">Volume total</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{formatPrice(secondaryFees)}</p>
              <p className="text-xs text-white/40 mt-1">Commissions collectées</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <ArrowRightLeft className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{allTransfers.length}</p>
              <p className="text-xs text-white/40 mt-1">Transactions complétées</p>
            </div>
          </div>

          {allTransfers.length === 0 && (
            <div className="text-center py-8 mt-4">
              <ArrowRightLeft className="h-10 w-10 mx-auto text-white/10 mb-2" />
              <p className="text-sm text-white/30">Aucune transaction secondaire pour l&apos;instant</p>
              <p className="text-xs text-white/20 mt-1">
                Les transferts de tokens apparaîtront ici une fois le marché secondaire actif.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warnings */}
      {pendingKyc > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-orange-600">
              {pendingKyc} achat{pendingKyc > 1 ? 's' : ''} en attente de vérification KYC
            </p>
            <p className="text-xs text-orange-600/60 mt-0.5">
              Ces investisseurs doivent compléter leur vérification d&apos;identité avant confirmation.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
