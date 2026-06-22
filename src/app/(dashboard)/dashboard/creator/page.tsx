import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import Link from 'next/link'
import {
  Zap, Film, MessageSquare, CreditCard, Star, Trophy,
  ArrowUpRight, ChevronRight, Clock, Bell, Bot,
  TrendingUp, Target, Sparkles, Activity, Heart, Video,
} from 'lucide-react'
import type { Metadata } from 'next'
import { GenerateVideoForm } from './generate-video-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Espace Cr\u00e9ateur \u2014 CINEGENY' }

export default async function CreatorDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const userId = session.user.id

  const [
    user, creditAccount, subscription,
    tasksInProgress, tasksCompleted,
    filmVotes, conversations, agentExecutions,
    unreadNotifs, recentNotifs,
    aiUsageToday, aiUsageTotal,
    recentActivity,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { displayName: true, level: true, rating: true, lumenBalance: true, points: true, tasksCompleted: true } }),
    prisma.creditAccount.findUnique({ where: { userId }, select: { balance: true, totalUsed: true } }),
    prisma.subscription.findUnique({ where: { userId }, select: { plan: true } }),
    prisma.task.count({ where: { claimedById: userId, status: 'CLAIMED' } }),
    prisma.task.count({ where: { claimedById: userId, status: 'VALIDATED' } }),
    prisma.filmVote.count({ where: { userId } }),
    prisma.conversation.count({ where: { userId } }),
    prisma.agentExecution.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, type: true, read: true, createdAt: true } }),
    prisma.aIUsageLog.count({ where: { userId, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.aIUsageLog.count({ where: { userId } }),
    prisma.agentExecution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { agent: { select: { name: true, icon: true, color: true } } },
    }),
  ])

  const balance = creditAccount?.balance ?? 0
  const plan = subscription?.plan || 'FREE'

  const kpis = [
    { label: 'Cr\u00e9dits IA', value: microToCredits(balance).toFixed(1), sub: 'Solde actuel', icon: CreditCard, color: 'text-[#E50914]', bg: 'bg-[#E50914]/10', border: 'border-[#E50914]/20', href: '/credits' },
    { label: 'T\u00e2ches', value: `${tasksInProgress}`, sub: `${tasksCompleted} compl\u00e9t\u00e9es`, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', href: '/tasks' },
    { label: 'Votes', value: filmVotes, sub: 'Films vot\u00e9s', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', href: '/films' },
    { label: 'Conversations', value: conversations, sub: 'Chats IA', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', href: '/chat' },
    { label: 'Agents utilis\u00e9s', value: agentExecutions, sub: `${aiUsageToday} today`, icon: Bot, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', href: '/agents' },
    { label: 'Lumens', value: user?.lumenBalance ?? 0, sub: `Level: ${user?.level || 'ROOKIE'}`, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', href: '/lumens' },
  ]

  const quickLinks = [
    { href: '/create', label: 'Cr\u00e9er un film', icon: Film, color: 'text-[#E50914]' },
    { href: '/chat', label: 'Chat IA', icon: MessageSquare, color: 'text-emerald-600' },
    { href: '/agents', label: 'Agents cin\u00e9ma', icon: Bot, color: 'text-purple-600' },
    { href: '/credits', label: 'Recharger cr\u00e9dits', icon: CreditCard, color: 'text-blue-600' },
    { href: '/tasks', label: 'Mes t\u00e2ches', icon: Zap, color: 'text-orange-600' },
    { href: '/pricing-ia', label: 'Tarifs IA', icon: Target, color: 'text-indigo-600' },
  ]

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Bienvenue, {user?.displayName || 'Cr\u00e9ateur'} &#x1f44b;
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Plan {plan} &middot; {user?.level || 'ROOKIE'} &middot; {user?.tasksCompleted || 0} t\u00e2ches valid\u00e9es
          </p>
        </div>
        {unreadNotifs > 0 && (
          <Link href="/notifications" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20">
            <Bell className="h-3.5 w-3.5" />
            {unreadNotifs} notification{unreadNotifs > 1 ? 's' : ''}
          </Link>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <Link key={kpi.label} href={kpi.href} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-[10px] text-white/50 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> {kpi.sub}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#E50914]" /> Acc\u00e8s rapide
          </h2>
          <div className="space-y-2">
            {quickLinks.map(link => {
              const LIcon = link.icon
              return (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.03] transition-colors">
                  <LIcon className={`h-4 w-4 ${link.color}`} />
                  <span className="text-sm text-white flex-1">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" /> Activit\u00e9 r\u00e9cente
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/50">
                Pas encore d&apos;activit\u00e9 &mdash; commencez par explorer les agents IA !
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {recentActivity.map(exec => (
                  <div key={exec.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${exec.agent?.color || '#E50914'}15` }}>
                      <Bot className="h-4 w-4" style={{ color: exec.agent?.color || '#E50914' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{exec.agent?.name || 'Agent'}</p>
                      <p className="text-xs text-white/50 truncate">{exec.prompt.substring(0, 60)}...</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${exec.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : exec.status === 'FAILED' ? 'bg-red-500/10 text-red-400' : 'bg-white/[0.03] text-white/50'}`}>
                        {exec.status}
                      </span>
                      <p className="text-[10px] text-white/50 mt-0.5">{new Date(exec.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" /> Notifications r\u00e9centes
          </h2>
          <Link href="/notifications" className="text-xs text-[#E50914] hover:underline">Tout voir</Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {recentNotifs.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/50">Aucune notification</div>
          ) : (
            <div className="divide-y divide-white/10">
              {recentNotifs.map(notif => (
                <div key={notif.id} className={`flex items-center gap-3 px-5 py-3 ${!notif.read ? 'bg-white/[0.03]' : ''}`}>
                  <div className={`h-2 w-2 rounded-full shrink-0 ${!notif.read ? 'bg-[#E50914]' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{notif.title}</p>
                  </div>
                  <p className="text-[10px] text-white/50 shrink-0">{new Date(notif.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Video Generation */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-[#E50914]" /> G\u00e9n\u00e9rer une vid\u00e9o rapidement
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs text-white/50 mb-5">
            Cr\u00e9ez une vid\u00e9o pour vos r\u00e9seaux sociaux en quelques secondes. Co\u00fbt&nbsp;: 10 tokens par g\u00e9n\u00e9ration.
          </p>
          <GenerateVideoForm />
        </div>
      </div>
    </div>
  )
}
