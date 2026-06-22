import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Coins, TrendingUp, TrendingDown, Film, Clock, Lock,
  Briefcase, Vote, CheckCircle2, ArrowRight,
  CircleDollarSign, Wallet, PiggyBank, ShoppingCart,
  ArrowUpRight, ArrowDownRight, Unlock, BarChart3
} from 'lucide-react'
import type { Metadata } from 'next'
import { formatEur, getTokenBalance, OFFERING_STATUS_LABELS } from '@/lib/tokenization'
import { claimDividendAction, listTokensForSaleAction } from '@/app/actions/tokenization'
import { formatDate, formatDateShort } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mon Portfolio — Tokenization',
  description: 'Suivez vos investissements en tokens de films IA.',
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

export default async function PortfolioPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userId = session.user.id

  // Fetch all user purchases
  const purchases = await prisma.filmTokenPurchase.findMany({
    where: { userId, status: 'CONFIRMED' },
    include: {
      offering: {
        include: {
          film: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group by offering
  const offeringMap = new Map<string, {
    offering: typeof purchases[0]['offering']
    totalTokens: number
    totalInvested: number
    purchases: typeof purchases
  }>()

  for (const p of purchases) {
    const existing = offeringMap.get(p.offeringId)
    if (existing) {
      existing.totalTokens += p.tokenCount
      existing.totalInvested += p.amountPaid
      existing.purchases.push(p)
    } else {
      offeringMap.set(p.offeringId, {
        offering: p.offering,
        totalTokens: p.tokenCount,
        totalInvested: p.amountPaid,
        purchases: [p],
      })
    }
  }

  // Get actual balances (accounting for secondary market)
  const holdings = await Promise.all(
    Array.from(offeringMap.entries()).map(async ([offeringId, data]) => {
      const balance = await getTokenBalance(offeringId, userId)
      const avgPurchasePrice = data.totalInvested / data.totalTokens
      const currentValue = balance * data.offering.tokenPrice
      const pnl = currentValue - (balance * avgPurchasePrice)
      const pnlPct = avgPurchasePrice > 0 ? ((data.offering.tokenPrice / avgPurchasePrice) - 1) * 100 : 0

      // Check lockup status
      const now = new Date()
      const latestPurchase = data.purchases[0]
      const isLocked = latestPurchase.lockedUntil ? now < latestPurchase.lockedUntil : false
      const lockupEnd = latestPurchase.lockedUntil

      return {
        ...data,
        balance,
        avgPurchasePrice,
        currentValue,
        pnl,
        pnlPct,
        isLocked,
        lockupEnd,
      }
    })
  )

  // Portfolio totals
  const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0)
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalPnl = totalCurrentValue - totalInvested
  const totalPnlPct = totalInvested > 0 ? ((totalCurrentValue / totalInvested) - 1) * 100 : 0

  // Pending dividends
  const pendingDividends = await prisma.tokenDividend.findMany({
    where: {
      userId,
      status: { in: ['PENDING', 'CALCULATED'] },
    },
    include: {
      offering: {
        include: { film: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  const totalPendingDividends = pendingDividends.reduce((sum, d) => sum + d.amount, 0)

  // Paid dividends
  const paidDividends = await prisma.tokenDividend.findMany({
    where: { userId, status: 'PAID' },
    include: {
      offering: {
        include: { film: true },
      },
    },
    orderBy: { paidAt: 'desc' },
    take: 10,
  })
  const totalPaidDividends = paidDividends.reduce((sum, d) => sum + d.amount, 0)

  // Transaction history (lumen transactions related to tokens)
  const transactions = await prisma.lumenTransaction.findMany({
    where: {
      userId,
      type: { in: ['TOKEN_PURCHASE', 'TOKEN_SALE', 'TOKEN_DIVIDEND'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  // User's secondary market listings
  const myListings = await prisma.filmTokenTransfer.findMany({
    where: { fromUserId: userId, status: 'PENDING' },
    include: {
      offering: {
        include: { film: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sub-Nav */}
      <TokenizationNav active="portfolio" />

      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Mon Portfolio
        </h1>
        <p className="text-white/40 mt-1 text-sm">Suivez vos investissements en tokens de films IA.</p>
      </div>

      {/* Portfolio Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: 'Total investi',
            value: formatEur(totalInvested),
            icon: CircleDollarSign,
            color: 'text-[#E50914]',
          },
          {
            label: 'Valeur actuelle',
            value: formatEur(totalCurrentValue),
            icon: Wallet,
            color: 'text-blue-600',
          },
          {
            label: 'Dividendes totaux',
            value: formatEur(totalPaidDividends),
            icon: PiggyBank,
            color: 'text-green-600',
          },
          {
            label: 'P&L',
            value: `${totalPnl >= 0 ? '+' : ''}${formatEur(totalPnl)}`,
            subValue: `${totalPnlPct >= 0 ? '+' : ''}${Math.round(totalPnlPct * 10) / 10}%`,
            icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
            color: totalPnl >= 0 ? 'text-green-600' : 'text-red-400',
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-white/30 text-xs">{kpi.label}</span>
              </div>
              <p className={`text-xl font-bold ${kpi.color === 'text-[#E50914]' ? 'text-white' : kpi.color}`}>{kpi.value}</p>
              {kpi.subValue && (
                <p className={`text-xs mt-0.5 ${kpi.color}`}>{kpi.subValue}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Holdings Table */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#E50914]" />
            Mes Participations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Aucun investissement pour le moment.</p>
              <Link href="/tokenization" className="mt-3 inline-block">
                <Button variant="outline" size="sm" className="min-h-[44px]">
                  <Coins className="h-4 w-4 mr-2" />
                  Explorer les offres
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/30 text-xs font-medium py-3 px-2">Film</th>
                    <th className="text-right text-white/30 text-xs font-medium py-3 px-2">Tokens</th>
                    <th className="text-right text-white/30 text-xs font-medium py-3 px-2 hidden sm:table-cell">Prix achat</th>
                    <th className="text-right text-white/30 text-xs font-medium py-3 px-2 hidden sm:table-cell">Prix actuel</th>
                    <th className="text-right text-white/30 text-xs font-medium py-3 px-2">P&L</th>
                    <th className="text-right text-white/30 text-xs font-medium py-3 px-2 hidden md:table-cell">Lockup</th>
                    <th className="text-right text-white/30 text-xs font-medium py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr key={holding.offering.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2">
                        <Link href={`/tokenization/${holding.offering.filmId}`} className="flex items-center gap-2 hover:text-[#E50914] transition-colors">
                          <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                            <Film className="h-4 w-4 text-white/20" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{holding.offering.film.title}</p>
                            <p className="text-white/20 text-[10px]">{holding.offering.film.genre || 'Film'}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right py-3 px-2">
                        <span className="text-white font-medium">{holding.balance}</span>
                      </td>
                      <td className="text-right py-3 px-2 hidden sm:table-cell">
                        <span className="text-white/50">{formatEur(holding.avgPurchasePrice)}</span>
                      </td>
                      <td className="text-right py-3 px-2 hidden sm:table-cell">
                        <span className="text-white">{formatEur(holding.offering.tokenPrice)}</span>
                      </td>
                      <td className="text-right py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          {holding.pnl >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-400" />
                          )}
                          <span className={holding.pnl >= 0 ? 'text-green-600' : 'text-red-400'}>
                            {holding.pnl >= 0 ? '+' : ''}{Math.round(holding.pnlPct * 10) / 10}%
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 hidden md:table-cell">
                        {holding.isLocked ? (
                          <Badge variant="warning" className="text-[10px]">
                            <Lock className="h-2.5 w-2.5 mr-0.5" />
                            {holding.lockupEnd ? formatDateShort(holding.lockupEnd) : 'Verrouillé'}
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">
                            <Unlock className="h-2.5 w-2.5 mr-0.5" />
                            Libre
                          </Badge>
                        )}
                      </td>
                      <td className="text-right py-3 px-2">
                        <Link href={`/tokenization/${holding.offering.filmId}`}>
                          <Button variant="ghost" size="sm" className="min-h-[36px] text-white/30 hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Dividends */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-green-600" />
                Dividendes en Attente
              </CardTitle>
              {totalPendingDividends > 0 && (
                <Badge variant="success">{formatEur(totalPendingDividends)}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {pendingDividends.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">Aucun dividende en attente.</p>
            ) : (
              <div className="space-y-2">
                {pendingDividends.map((div) => (
                  <div key={div.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{div.offering.film.title}</p>
                      <p className="text-white/30 text-xs">Période: {div.period} | {div.tokenCount} tokens</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 font-semibold">{formatEur(div.amount)}</span>
                      <form action={async (fd: FormData) => { 'use server'; await claimDividendAction(fd) }}>
                        <input type="hidden" name="dividendId" value={div.id} />
                        <Button size="sm" className="min-h-[36px]" type="submit">
                          Réclamer
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Secondary Market Listings */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Mes Ventes en Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myListings.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">Aucune vente en cours.</p>
            ) : (
              <div className="space-y-2">
                {myListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{listing.offering.film.title}</p>
                      <p className="text-white/30 text-xs">
                        {listing.tokenCount} token(s) a {formatEur(listing.pricePerToken)}/token
                      </p>
                    </div>
                    <span className="text-[#E50914] font-semibold">{formatEur(listing.totalAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/40" />
            Historique des Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">Aucune transaction pour le moment.</p>
          ) : (
            <div className="space-y-1">
              {transactions.map((tx) => {
                const isDebit = tx.type === 'TOKEN_PURCHASE'
                const isDividend = tx.type === 'TOKEN_DIVIDEND'
                const isSale = tx.type === 'TOKEN_SALE'

                return (
                  <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        isDividend ? 'bg-green-500/10' : isSale ? 'bg-blue-500/10' : 'bg-[#E50914]/10'
                      }`}>
                        {isDividend ? (
                          <PiggyBank className="h-4 w-4 text-green-600" />
                        ) : isSale ? (
                          <ArrowUpRight className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Coins className="h-4 w-4 text-[#E50914]" />
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm">{tx.description}</p>
                        <p className="text-white/20 text-[10px]">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <Badge
                      variant={isDividend || isSale ? 'success' : 'outline'}
                      className="text-xs"
                    >
                      {tx.type === 'TOKEN_PURCHASE' ? 'Achat' : tx.type === 'TOKEN_SALE' ? 'Vente' : 'Dividende'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
