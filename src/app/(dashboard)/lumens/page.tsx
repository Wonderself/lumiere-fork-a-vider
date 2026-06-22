import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sun, ArrowDownCircle, Gift, Sparkles, ShoppingCart, TrendingUp, TrendingDown, Coins } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'
import { PurchaseForm } from './purchase-form'
import { WithdrawForm } from './withdraw-form'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Mes Lumens' }

function getTxTypeBadge(type: string) {
  switch (type) {
    case 'PURCHASE':
      return <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-400">Achat</Badge>
    case 'BONUS':
      return <Badge className="border-purple-500/20 bg-purple-500/10 text-purple-400">Bonus</Badge>
    case 'TASK_REWARD':
      return <Badge className="border-green-500/20 bg-green-500/10 text-green-400">Reward</Badge>
    case 'SPENT':
      return <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400">Depense</Badge>
    case 'WITHDRAWAL':
      return <Badge className="border-red-500/20 bg-red-500/10 text-red-400">Retrait</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

export default async function LumensPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if (!user) redirect('/login')

  const transactions = await prisma.lumenTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const settings = await prisma.adminSettings.findUnique({
    where: { id: 'singleton' },
    select: { lumenPrice: true },
  })

  const lumenPrice = settings?.lumenPrice ?? 1.0

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          Mes Lumens
        </h1>
        <p className="text-white/50 mt-1">
          Gerez votre portefeuille de Lumens — la monnaie de la plateforme.
        </p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#E50914]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="p-6 sm:p-8 md:p-12 flex flex-col items-center text-center relative">
          <div className="w-16 h-16 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mb-6">
            <Sun className="h-8 w-8 text-[#E50914]" />
          </div>
          <h2
            className="text-lg font-semibold text-white/60 mb-2"
          >
            Mes Lumens
          </h2>
          <div className="text-6xl md:text-7xl font-bold text-[#E50914] mb-3 tracking-tight">
            {user.lumenBalance.toLocaleString('fr-FR')}
          </div>
          <p className="text-white/50 text-sm">
            1 Lumen = {lumenPrice}&#8364; — Votre porte-monnaie plateforme
          </p>
        </div>
      </div>

      {/* Lumen Analytics */}
      {transactions.length > 0 && (() => {
        const totalEarned = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
        const totalSpent = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
        const taskRewards = transactions.filter(t => t.type === 'TASK_REWARD').reduce((s, t) => s + t.amount, 0)
        const bonuses = transactions.filter(t => t.type === 'BONUS').reduce((s, t) => s + t.amount, 0)
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total gagne', value: `+${totalEarned}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
              { label: 'Total depense', value: `-${totalSpent}`, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
              { label: 'Rewards taches', value: `+${taskRewards}`, icon: Sparkles, color: 'text-[#E50914]', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Bonus', value: `+${bonuses}`, icon: Coins, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
            ].map((stat) => (
              <div key={stat.label} className={`p-4 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 mb-2 ${stat.color}`} />
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )
      })()}

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Purchase Section */}
      <div className="bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-[#E50914]" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-white"
              >
                Acheter des Lumens
              </h2>
              <p className="text-white/50 text-sm mt-0.5">
                Choisissez un pack — plus vous achetez, plus vous economisez.
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-6">
          <PurchaseForm />
        </div>
      </div>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Withdraw Section */}
      <div className="bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <ArrowDownCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-white"
              >
                Convertir en euros
              </h2>
              <p className="text-white/50 text-sm mt-0.5">
                Vos Lumens seront convertis en euros et vires sous 14 jours ouvres. 0 frais.
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-6">
          <WithdrawForm currentBalance={user.lumenBalance} />
        </div>
      </div>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Transaction History */}
      <div className="bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white/50" />
            </div>
            <h2
              className="text-xl font-bold text-white"
            >
              Historique
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-10 w-10 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">Aucune transaction pour le moment.</p>
              <p className="text-white/50 text-sm mt-1">
                Achetez vos premiers Lumens ou completez une tache pour commencer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-xs text-white/60 font-medium">Date</th>
                    <th className="pb-3 text-xs text-white/60 font-medium">Type</th>
                    <th className="pb-3 text-xs text-white/60 font-medium">Description</th>
                    <th className="pb-3 text-xs text-white/60 font-medium text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300"
                    >
                      <td className="py-3 pr-4 text-sm text-white/60 whitespace-nowrap">
                        {formatDateShort(tx.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        {getTxTypeBadge(tx.type)}
                      </td>
                      <td className="py-3 pr-4 text-sm text-white/80 max-w-xs truncate">
                        {tx.description || '—'}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
