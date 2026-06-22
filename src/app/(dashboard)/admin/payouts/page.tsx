import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { calculateMonthlyPayoutsAction, markPayoutPaidAction } from '@/app/actions/payouts'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  Wallet, CheckCircle, Clock, Calculator, DollarSign,
  Film, Users, TrendingUp, AlertCircle,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Payouts' }

export default async function AdminPayoutsPage(
  props: { searchParams: Promise<{ month?: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/dashboard')

  const searchParams = await props.searchParams
  const filterMonth = searchParams.month || ''

  // Build where clause
  const where: Record<string, unknown> = {}
  if (filterMonth) {
    where.month = filterMonth
  }

  const payouts = await prisma.creatorPayout.findMany({
    where,
    include: {
      user: { select: { displayName: true, email: true, avatarUrl: true } },
      film: { select: { title: true, slug: true } },
    },
    orderBy: [{ month: 'desc' }, { amountEur: 'desc' }],
  })

  // Stats
  const [totalPayouts, pendingPayouts, paidPayouts, totalAmountPaid] = await Promise.all([
    prisma.creatorPayout.count(),
    prisma.creatorPayout.count({ where: { status: { in: ['CALCULATED', 'PENDING'] } } }),
    prisma.creatorPayout.count({ where: { status: 'PAID' } }),
    prisma.creatorPayout.aggregate({ where: { status: 'PAID' }, _sum: { amountEur: true } }),
  ])

  const totalPaid = totalAmountPaid._sum.amountEur || 0
  const totalPending = payouts
    .filter(p => p.status === 'CALCULATED' || p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amountEur, 0)

  // Get available months for filter
  const months = [...new Set(payouts.map(p => p.month))].sort().reverse()

  // Current month default for the calculation form
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const statusColors: Record<string, string> = {
    PENDING: 'border-blue-500/30 bg-blue-500/10 text-blue-600',
    CALCULATED: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600',
    PAID: 'border-green-500/30 bg-green-500/10 text-green-600',
    FAILED: 'border-red-500/30 bg-red-500/10 text-red-400',
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
          Payouts Createurs
        </h1>
        <p className="text-white/50">Calcul et gestion des paiements mensuels</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calculator, label: 'Total Payouts', value: totalPayouts, color: '#E50914' },
          { icon: Clock, label: 'En attente', value: pendingPayouts, color: '#f59e0b' },
          { icon: CheckCircle, label: 'Payes', value: paidPayouts, color: '#22c55e' },
          { icon: DollarSign, label: 'Total Verse', value: formatPrice(totalPaid), color: '#22c55e' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <kpi.icon className="h-5 w-5 mb-2" style={{ color: kpi.color }} />
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Amount Alert */}
      {totalPending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-yellow-600">{formatPrice(totalPending)} en attente de paiement</p>
            <p className="text-xs text-white/40 mt-0.5">{pendingPayouts} paiements calcules non encore verses</p>
          </div>
        </div>
      )}

      {/* Calculation Form */}
      <div className="rounded-xl border border-[#E50914]/20 bg-[#E50914]/5 p-6">
        <h2 className="text-sm font-semibold text-[#E50914] mb-4 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Calculer les Payouts Mensuels
        </h2>
        <form action={calculateMonthlyPayoutsAction} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-white/40 mb-1.5">Mois</label>
            <input
              type="month"
              name="month"
              defaultValue={currentMonth}
              required
              className="w-full h-10 rounded-lg border border-[#E50914]/30 bg-black/30 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-white/40 mb-1.5">Pool Total (EUR)</label>
            <input
              type="number"
              name="poolAmount"
              step="0.01"
              min="0"
              placeholder="ex: 5000"
              required
              className="w-full h-10 rounded-lg border border-[#E50914]/30 bg-black/30 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-6 rounded-lg bg-[#E50914] text-white font-semibold text-sm hover:bg-[#FF2D2D] transition-colors flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Calculer
          </button>
        </form>
        <p className="text-[10px] text-white/30 mt-3">
          Formule : (vues film mensuelles / vues totales plateforme) x pool x revenueSharePct du createur.
          Les vues mensuelles sont reinitialises apres calcul.
        </p>
      </div>

      {/* Month Filter */}
      {months.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Filtrer par mois :</span>
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
            <a
              href="/admin/payouts"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !filterMonth
                  ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}
            >
              Tous
            </a>
            {months.map((m) => (
              <a
                key={m}
                href={`/admin/payouts?month=${m}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterMonth === m
                    ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                    : 'text-white/40 hover:text-white/60 border border-transparent'
                }`}
              >
                {m}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Payouts Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {payouts.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Wallet className="h-14 w-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Aucun payout</p>
            <p className="text-sm mt-1">Utilisez le formulaire ci-dessus pour calculer les payouts du mois</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium p-4">Createur</th>
                  <th className="text-left text-xs text-white/40 font-medium p-4">Film</th>
                  <th className="text-center text-xs text-white/40 font-medium p-4">Mois</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Vues</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Ratio</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Montant</th>
                  <th className="text-center text-xs text-white/40 font-medium p-4">Statut</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {payout.user.avatarUrl ? (
                          <img src={payout.user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#E50914]/10 flex items-center justify-center">
                            <Users className="h-3.5 w-3.5 text-[#E50914]" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{payout.user.displayName || payout.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Film className="h-3.5 w-3.5 text-white/30" />
                        <span className="text-sm text-white/60 truncate max-w-[180px]">
                          {payout.film?.title || '--'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm text-white/60">
                      {payout.month}
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm text-white/60">{payout.totalViews.toLocaleString('fr-FR')}</div>
                      <div className="text-[10px] text-white/30">/ {payout.platformViews.toLocaleString('fr-FR')}</div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm text-[#E50914] font-medium">
                        {(payout.ratio * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-bold text-green-600">{formatPrice(payout.amountEur)}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[payout.status] || ''}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {(payout.status === 'CALCULATED' || payout.status === 'PENDING') ? (
                        <form action={markPayoutPaidAction} className="inline">
                          <input type="hidden" name="payoutId" value={payout.id} />
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-green-500/30 bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors ml-auto"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Marquer Paye
                          </button>
                        </form>
                      ) : payout.status === 'PAID' ? (
                        <div className="flex items-center justify-end gap-1.5 text-xs text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          {payout.paidAt ? formatDate(payout.paidAt) : 'Paye'}
                        </div>
                      ) : (
                        <span className="text-xs text-white/30">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
