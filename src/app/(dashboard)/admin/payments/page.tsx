import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { CreditCard, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react'
import Link from 'next/link'
import { markPaymentPaidAction } from '@/app/actions/admin'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Paiements' }

export default async function AdminPaymentsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [payments, stats] = await Promise.all([
    prisma.payment.findMany({
      include: {
        user: { select: { displayName: true, email: true } },
        task: { select: { title: true, film: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.payment.groupBy({
      by: ['status'],
      _sum: { amountEur: true },
      _count: true,
    }),
  ])

  const totalCompleted = stats.find(s => s.status === 'COMPLETED')?._sum.amountEur || 0
  const totalPending = stats.find(s => s.status === 'PENDING')?._sum.amountEur || 0
  const countCompleted = stats.find(s => s.status === 'COMPLETED')?._count || 0
  const countPending = stats.find(s => s.status === 'PENDING')?._count || 0

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-green-500/10 text-green-600 border-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-playfair">Paiements</h1>
          <p className="text-white/50">{payments.length} paiement{payments.length > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/api/admin/export-payments" target="_blank">
          <Button variant="outline" size="sm" className="rounded-xl border-[#E50914]/30 text-[#E50914] hover:bg-[#E50914]/5">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </Link>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle, label: 'Complétés', value: formatPrice(totalCompleted), sub: `${countCompleted} paiements`, color: 'text-green-600' },
          { icon: Clock, label: 'En attente', value: formatPrice(totalPending), sub: `${countPending} paiements`, color: 'text-yellow-600' },
          { icon: CreditCard, label: 'Total distribué', value: formatPrice(totalCompleted + totalPending), sub: 'toutes méthodes', color: 'text-[#E50914]' },
          { icon: AlertCircle, label: 'Moy. par paiement', value: formatPrice(countCompleted > 0 ? totalCompleted / countCompleted : 0), sub: 'paiements complétés', color: 'text-blue-600' },
        ].map((s) => (
          <Card key={s.label} className="sm:rounded-2xl hover:shadow-md hover:-translate-y-[1px]">
            <CardContent className="p-5">
              <s.icon className={`h-5 w-5 ${s.color} mb-3`} />
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Payments table */}
      {payments.length === 0 ? (
        <Card className="sm:rounded-2xl">
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Aucun paiement</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-white/30 font-medium">
            <div className="col-span-3">Utilisateur</div>
            <div className="col-span-3">Tâche / Film</div>
            <div className="col-span-2">Montant</div>
            <div className="col-span-1">Méthode</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Action</div>
          </div>

          {payments.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 sm:rounded-2xl rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]/50 hover:shadow-md hover:-translate-y-[1px] transition-all duration-500">
              <div className="col-span-3 min-w-0">
                <p className="text-sm font-medium truncate">{p.user.displayName}</p>
                <p className="text-xs text-white/30 truncate">{p.user.email}</p>
              </div>
              <div className="col-span-3 min-w-0">
                <p className="text-sm truncate">{p.task.title}</p>
                <p className="text-xs text-white/30 truncate">{p.task.film.title}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-bold text-[#E50914]">{formatPrice(p.amountEur)}</span>
              </div>
              <div className="col-span-1">
                <Badge variant="secondary" className="text-xs">{p.method}</Badge>
              </div>
              <div className="col-span-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[p.status] || ''}`}>
                  {p.status}
                </span>
              </div>
              <div className="col-span-1">
                <span className="text-xs text-white/30">{p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}</span>
              </div>
              <div className="col-span-1">
                {p.status === 'PENDING' && (
                  <form action={markPaymentPaidAction}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <Button type="submit" size="sm" variant="outline" className="text-xs h-7">Payer</Button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
