import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import {
  DollarSign, TrendingUp, TrendingDown, Wallet,
  CreditCard, ArrowUpRight, Activity, BarChart3,
  Users, Percent, Zap,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Financial — Admin CINEGENY' }

export default async function FinancialPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const monthAgo = new Date(Date.now() - 30 * 86400000)

  const [
    totalRevenue, revenueToday, revenueWeek, revenueMonth,
    totalCost, totalMargin,
    totalDeposits, totalRefunds,
    avgPerUser,
    requestsToday, requestsWeek,
    activeWallets, totalBalance,
  ] = await Promise.all([
    prisma.aIUsageLog.aggregate({ _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: today } }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: weekAgo } }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: monthAgo } }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ _sum: { costCredits: true } }),
    prisma.aIUsageLog.aggregate({ _sum: { marginCredits: true } }),
    prisma.creditTransaction.aggregate({ where: { amount: { gt: 0 } }, _sum: { amount: true } }),
    prisma.creditTransaction.aggregate({ where: { type: 'REFUND' as any }, _sum: { amount: true } }),
    prisma.aIUsageLog.groupBy({
      by: ['userId'],
      _sum: { billedCredits: true },
    }).then(groups => {
      if (groups.length === 0) return 0
      const total = groups.reduce((sum: number, g: any) => sum + (g._sum.billedCredits ?? 0), 0)
      return total / groups.length
    }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: today } } }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.creditAccount.count({ where: { balance: { gt: 0 } } }),
    prisma.creditAccount.aggregate({ _sum: { balance: true } }),
  ])

  const rev = totalRevenue._sum.billedCredits ?? 0
  const cost = totalCost._sum.costCredits ?? 0
  const margin = totalMargin._sum.marginCredits ?? 0
  const marginRate = rev > 0 ? ((margin / rev) * 100).toFixed(1) : '0'

  const kpis = [
    { label: 'Revenue totale', value: microToCredits(rev).toFixed(2), unit: 'cr', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: "Aujourd'hui", value: microToCredits(revenueToday._sum.billedCredits ?? 0).toFixed(2), unit: 'cr', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Cette semaine', value: microToCredits(revenueWeek._sum.billedCredits ?? 0).toFixed(2), unit: 'cr', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Ce mois', value: microToCredits(revenueMonth._sum.billedCredits ?? 0).toFixed(2), unit: 'cr', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Coût total', value: microToCredits(cost).toFixed(2), unit: 'cr', icon: TrendingDown, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { label: 'Marge', value: `${marginRate}%`, unit: '', icon: Percent, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'Total déposé', value: microToCredits(totalDeposits._sum.amount ?? 0).toFixed(2), unit: 'cr', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Total remboursé', value: microToCredits(totalRefunds._sum.amount ?? 0).toFixed(2), unit: 'cr', icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Moy/utilisateur', value: microToCredits(avgPerUser).toFixed(2), unit: 'cr', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { label: 'Wallets actifs', value: activeWallets, unit: '', icon: Wallet, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Req today', value: requestsToday, unit: '', icon: Zap, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { label: 'Req semaine', value: requestsWeek, unit: '', icon: Activity, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Financial Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">Detailed financial KPIs and cost breakdown</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-white">
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                {kpi.unit && <span className="text-xs text-white/50 ml-1">{kpi.unit}</span>}
              </p>
            </div>
          )
        })}
      </div>

      {/* Balance détaillée */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-orange-500" /> Solde plateforme
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Total en circulation</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{microToCredits(totalBalance._sum.balance ?? 0).toFixed(2)} <span className="text-sm text-white/50">cr</span></p>
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Wallets actifs</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{activeWallets}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Revenue nette</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{microToCredits(margin).toFixed(2)} <span className="text-sm text-white/50">cr</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
