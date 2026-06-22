import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  TrendingUp,
  Clock,
  CheckCircle,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Mes Revenus — CINEGENY' }

export default async function EarningsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [payments, user] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: session.user.id },
      include: {
        task: { select: { title: true, type: true, film: { select: { title: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lumenBalance: true, tasksCompleted: true, tasksValidated: true },
    }),
  ])

  const totalEarned = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + p.amountEur, 0)
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amountEur, 0)
  const completedCount = payments.filter(p => p.status === 'COMPLETED').length
  const pendingCount = payments.filter(p => p.status === 'PENDING').length

  // Monthly breakdown (last 6 months)
  const monthlyData: { month: string; amount: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
    const monthTotal = payments
      .filter(p => p.status === 'COMPLETED' && p.paidAt)
      .filter(p => {
        const pd = new Date(p.paidAt!)
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
      })
      .reduce((s, p) => s + p.amountEur, 0)
    monthlyData.push({ month: monthLabel, amount: monthTotal })
  }
  const maxMonthly = Math.max(...monthlyData.map(m => m.amount), 1)

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const statusLabels: Record<string, string> = {
    COMPLETED: 'Paye',
    PENDING: 'En attente',
    PROCESSING: 'En cours',
    FAILED: 'Echoue',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Mes Revenus
        </h1>
        <p className="text-white/50 mt-1">
          Historique de vos gains, previsions et demandes de retrait.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total gagne', value: formatPrice(totalEarned), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'En attente', value: formatPrice(totalPending), icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Paiements recus', value: String(completedCount), icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Lumens', value: String(user?.lumenBalance || 0), icon: Wallet, color: 'text-[#E50914]', bg: 'bg-[#E50914]/10 border-[#E50914]/20' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border ${stat.bg}`}>
            <stat.icon className={`h-4 w-4 mb-2 ${stat.color}`} />
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Chart (simple bar chart) */}
      <div className="bg-white/5 rounded-2xl border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-[#E50914]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-playfair">
              Revenus mensuels
            </h2>
            <p className="text-white/50 text-sm">6 derniers mois</p>
          </div>
        </div>
        <div className="flex items-end gap-3 h-32">
          {monthlyData.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-white/50 font-medium">
                {m.amount > 0 ? formatPrice(m.amount) : ''}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#E50914] to-[#FF2D2D] transition-all duration-500"
                style={{ height: `${Math.max((m.amount / maxMonthly) * 100, 4)}%` }}
              />
              <span className="text-xs text-white/50">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Payment History */}
      <div className="bg-white/5 rounded-2xl border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-white/50" />
            </div>
            <h2
              className="text-lg font-bold text-white"
            >
              Historique des paiements
            </h2>
          </div>
        </div>

        <div className="px-6 pb-6">
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">Aucun paiement pour le moment.</p>
              <p className="text-white/50 text-sm mt-1">
                Completez des taches pour recevoir vos premiers paiements.
              </p>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium"
              >
                Trouver des taches <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.08] hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.task.title}</p>
                    <p className="text-xs text-white/50 truncate">{p.task.film.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-green-500">+{formatPrice(p.amountEur)}</div>
                    <div className="text-xs text-white/50 mt-0.5">{formatDate(p.createdAt)}</div>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${statusColors[p.status] || ''}`}>
                    {statusLabels[p.status] || p.status}
                  </Badge>
                  {p.status === 'COMPLETED' && (
                    <Link
                      href={`/api/invoices?paymentId=${p.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors shrink-0"
                      title="Telecharger la facture"
                    >
                      <FileText className="h-3.5 w-3.5 text-white/50" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
