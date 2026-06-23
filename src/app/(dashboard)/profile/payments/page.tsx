import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CreditCard, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mes Paiements',
  description: 'Historique de vos paiements et gains sur CINEGENY.',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  PROCESSING: { label: 'In progress', color: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20' },
  COMPLETED: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-500/10 border-green-500/20' },
  FAILED: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
}

const METHOD_LABELS: Record<string, string> = {
  STRIPE: 'Stripe',
  LIGHTNING: 'Lightning',
  ONCHAIN: 'On-chain',
  LUMEN: 'Lumens',
}

export default async function PaymentsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    include: { task: { select: { title: true, film: { select: { title: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  const stats = await prisma.payment.aggregate({
    where: { userId: session.user.id, status: 'COMPLETED' },
    _sum: { amountEur: true },
    _count: true,
  })

  const pendingCount = await prisma.payment.count({
    where: { userId: session.user.id, status: 'PENDING' },
  })

  const totalEarned = stats._sum.amountEur ?? 0
  const completedCount = stats._count ?? 0

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2"
        >
          Mes Paiements
        </h1>
        <p className="text-white/40">
          Historique complet de vos gains et paiements sur la plateforme.
        </p>
      </div>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] backdrop-blur border border-white/10 sm:rounded-3xl rounded-2xl p-6 hover:shadow-md transition-all duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-[#E50914]" />
            </div>
            <span className="text-sm text-white/40">Total earned</span>
          </div>
          <p className="text-2xl font-bold text-[#E50914]">
            {totalEarned.toFixed(2)} &euro;
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur border border-white/10 sm:rounded-3xl rounded-2xl p-6 hover:shadow-md transition-all duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm text-white/40">En attente</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur border border-white/10 sm:rounded-3xl rounded-2xl p-6 hover:shadow-md transition-all duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-white/40">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur border border-white/10 sm:rounded-3xl rounded-2xl p-16 text-center">
          <div className="h-16 w-16 sm:rounded-3xl rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-2">Aucun paiement</h3>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            You don't have any payments yet. Start by completing tasks
            pour gagner vos premiers Lumens et euros.
          </p>
        </div>
      ) : (
        <div className="bg-white/[0.03] backdrop-blur border border-white/10 sm:rounded-3xl rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-4">
                    Task
                  </th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-4">
                    Film
                  </th>
                  <th className="text-right text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-4">
                    Montant
                  </th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-4">
                    Method
                  </th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-4">
                    Statut
                  </th>
                  <th className="text-right text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => {
                  const statusConfig = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING
                  return (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="px-6 py-4">
                        <span className="text-sm text-white font-medium truncate block max-w-[200px]">
                          {payment.task.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/50">
                          {payment.task.film?.title ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-[#E50914]">
                          {payment.amountEur.toFixed(2)} &euro;
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/50">
                          {METHOD_LABELS[payment.method] ?? payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-white/40">
                          {payment.createdAt.toLocaleDateString('en-US')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-white/5">
            {payments.map((payment) => {
              const statusConfig = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING
              return (
                <div key={payment.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {payment.task.title}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {payment.task.film?.title ?? '—'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#E50914] shrink-0">
                      {payment.amountEur.toFixed(2)} &euro;
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-white/30">
                        {METHOD_LABELS[payment.method] ?? payment.method}
                      </span>
                    </div>
                    <span className="text-xs text-white/30">
                      {payment.createdAt.toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
