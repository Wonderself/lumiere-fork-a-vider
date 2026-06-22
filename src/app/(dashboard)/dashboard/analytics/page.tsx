import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import {
  BarChart3, Bot, MessageSquare, CreditCard, Star,
  Zap, Film, TrendingUp, Activity, Clock, Target,
  Award, Heart,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Analytics — CINEGENY' }

export default async function PersonalAnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const userId = session.user.id

  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const monthAgo = new Date(Date.now() - 30 * 86400000)

  const [
    user,
    totalExecutions, execThisWeek, execThisMonth,
    totalConversations, totalMessages,
    totalAIUsage, aiCostTotal, aiUsageWeek,
    totalVotes, tasksCompleted,
    creditAccount,
    topAgents,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true, level: true, rating: true, points: true, tasksCompleted: true, lumenBalance: true } }),
    prisma.agentExecution.count({ where: { userId } }),
    prisma.agentExecution.count({ where: { userId, createdAt: { gte: weekAgo } } }),
    prisma.agentExecution.count({ where: { userId, createdAt: { gte: monthAgo } } }),
    prisma.conversation.count({ where: { userId } }),
    prisma.chatMessage.count({ where: { userId } }),
    prisma.aIUsageLog.count({ where: { userId } }),
    prisma.aIUsageLog.aggregate({ where: { userId }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.count({ where: { userId, createdAt: { gte: weekAgo } } }),
    prisma.filmVote.count({ where: { userId } }),
    prisma.task.count({ where: { claimedById: userId, status: 'VALIDATED' } }),
    prisma.creditAccount.findUnique({ where: { userId }, select: { balance: true, totalUsed: true, totalPurchased: true } }),
    prisma.agentExecution.groupBy({
      by: ['agentId'],
      where: { userId },
      _count: true,
      orderBy: { _count: { agentId: 'desc' } },
      take: 5,
    }).then(async (groups: any[]) => {
      const ids = groups.map((g: any) => g.agentId)
      const agents = await prisma.agentDefinition.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, color: true },
      })
      const agentMap = new Map(agents.map(a => [a.id, a]))
      return groups.map((g: any) => ({ agent: agentMap.get(g.agentId), count: g._count }))
    }),
  ])

  const daysActive = user ? Math.ceil((Date.now() - user.createdAt.getTime()) / 86400000) : 1

  const stats = [
    { label: 'Exécutions agents', value: totalExecutions, sub: `${execThisWeek} cette semaine`, icon: Bot, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Conversations', value: totalConversations, sub: `${totalMessages} messages`, icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Requêtes IA', value: totalAIUsage, sub: `${aiUsageWeek} cette semaine`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { label: 'Crédits consommés', value: microToCredits(aiCostTotal._sum.billedCredits ?? 0).toFixed(1), sub: 'credits total', icon: CreditCard, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Votes films', value: totalVotes, sub: 'Films votés', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { label: 'Tâches validées', value: tasksCompleted, sub: `en ${daysActive} jours`, icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Points', value: user?.points ?? 0, sub: `Level: ${user?.level || 'ROOKIE'}`, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Rating', value: (user?.rating ?? 0).toFixed(1), sub: '/5.0', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Mes Analytics</h1>
        <p className="text-sm text-white/50 mt-1">Statistiques d&apos;utilisation et impact — Membre depuis {daysActive} jours</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border ${stat.border} ${stat.bg} p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/50 mt-1">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Agents */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" /> Agents les plus utilisés
          </h2>
          <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/5 overflow-hidden">
            {topAgents.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/50">Pas encore d&apos;utilisation</div>
            ) : (
              <div className="divide-y divide-white/10">
                {topAgents.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <span className="text-xs font-bold text-white/50 w-6">#{i + 1}</span>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.agent?.color || '#8B5CF6'}15` }}>
                      <Bot className="h-4 w-4" style={{ color: item.agent?.color || '#8B5CF6' }} />
                    </div>
                    <span className="text-sm font-medium text-white flex-1">{item.agent?.name || 'Unknown'}</span>
                    <span className="text-sm font-semibold text-[#E50914]">{item.count}x</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Summary */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" /> Résumé Wallet
          </h2>
          <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/5 p-6">
            {creditAccount ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Solde actuel</p>
                  <p className="text-3xl font-bold text-[#E50914]">{microToCredits(creditAccount.balance).toFixed(2)} <span className="text-sm text-white/50">crédits</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50">Total acheté</p>
                    <p className="text-lg font-bold text-white">{microToCredits(creditAccount.totalPurchased).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Total utilisé</p>
                    <p className="text-lg font-bold text-white">{microToCredits(creditAccount.totalUsed).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/50 text-center py-4">Aucun compte crédit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
