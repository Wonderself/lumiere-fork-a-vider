import { auth } from '@/lib/auth'
import { getAdminStats } from '@/lib/wallet.service'
import { microToCredits, TOKEN_MARGIN_PERCENT } from '@/lib/ai-pricing'
import { redirect } from 'next/navigation'
import {
  DollarSign, TrendingUp, Users, Wallet,
  Activity, BarChart3, ArrowUpRight, Shield,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Billing & Revenus — Admin CINEGENY',
  description: 'Dashboard administrateur des revenus et de la facturation IA',
}

export default async function AdminBillingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  let stats
  try {
    stats = await getAdminStats()
  } catch {
    stats = {
      totalRevenue: 0,
      totalMargin: 0,
      totalRequests: 0,
      activeWallets: 0,
      totalBalance: 0,
      topUsers: [],
      byAction: [],
    }
  }

  const cards = [
    {
      label: 'Revenus totaux',
      value: `${microToCredits(stats.totalRevenue).toFixed(2)} cr`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Marge plateforme',
      value: `${microToCredits(stats.totalMargin).toFixed(2)} cr`,
      subtitle: `Taux: ${TOKEN_MARGIN_PERCENT}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'AI requests',
      value: stats.totalRequests.toLocaleString(),
      icon: Activity,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Wallets actifs',
      value: stats.activeWallets.toLocaleString(),
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Solde total (tous users)',
      value: `${microToCredits(stats.totalBalance).toFixed(2)} cr`,
      icon: Wallet,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair">
          Billing & Revenus
        </h1>
        <p className="text-sm text-white/50 mt-2">
          Suivi des revenus, marges et consommation IA de la plateforme
        </p>
      </div>

      {/* Margin Info */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Marge actuelle : {TOKEN_MARGIN_PERCENT}%
            </p>
            <p className="text-xs text-emerald-400/70">
              Configurable via la variable d&apos;environnement TOKEN_MARGIN_PERCENT
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`rounded-2xl border ${card.border} bg-white/5 p-6`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">{card.label}</p>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-[10px] text-white/50">{card.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two columns: Top Users + By Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Users */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Top utilisateurs
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-x-auto">
            {stats.topUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/50">
                Aucune donnée de consommation pour le moment
              </div>
            ) : (
              <div className="divide-y divide-white/10 min-w-[320px]">
                {stats.topUsers.map((user, i) => (
                  <div key={user.userId} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors">
                    <div className="h-8 w-8 rounded-full bg-white/[0.05] flex items-center justify-center text-xs font-bold text-white/50">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.displayName || 'Utilisateur anonyme'}
                      </p>
                      <p className="text-xs text-white/50">
                        {user.requestCount} requêtes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#E50914]">
                        {microToCredits(user.totalSpent).toFixed(2)} cr
                      </p>
                      <p className="text-[10px] text-white/50 flex items-center gap-0.5 justify-end">
                        <ArrowUpRight className="h-3 w-3" />
                        dépensés
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* By Action */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Ventilation par action
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-x-auto">
            {stats.byAction.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/50">
                Aucune donnée de consommation pour le moment
              </div>
            ) : (
              <div className="divide-y divide-white/10 min-w-[320px]">
                {stats.byAction.map((action) => (
                  <div key={action.action} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {action.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-white/50">
                        {action.count} exécutions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {microToCredits(action.totalBilled).toFixed(2)} cr
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
