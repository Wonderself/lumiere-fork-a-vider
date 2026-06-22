import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import {
  Calendar, Film, Zap, Star, MessageSquare, Bot,
  CreditCard, Award, Users, Clock, ArrowRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Timeline — CINEGENY' }

export default async function TimelinePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const userId = session.user.id

  const [user, executions, transactions, votes, tasks] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true, displayName: true } }),
    prisma.agentExecution.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' }, take: 15,
      include: { agent: { select: { name: true, color: true } } },
    }),
    prisma.creditTransaction.findMany({
      where: { userId, type: { in: ['PACK_PURCHASE', 'ADMIN_GRANT'] as any[] } },
      orderBy: { createdAt: 'desc' }, take: 5,
    }),
    prisma.filmVote.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' }, take: 5,
      include: { film: { select: { title: true } } },
    }),
    prisma.task.findMany({
      where: { claimedById: userId, status: 'VALIDATED' },
      orderBy: { updatedAt: 'desc' }, take: 5,
      select: { title: true, type: true, updatedAt: true },
    }),
  ])

  interface TimelineEntry {
    date: Date
    type: string
    title: string
    detail: string
    icon: typeof Bot
    color: string
  }

  const entries: TimelineEntry[] = [
    // Account creation
    ...(user ? [{ date: user.createdAt, type: 'milestone', title: 'Inscription', detail: `Bienvenue ${user.displayName || ''}!`, icon: Users, color: '#E50914' }] : []),
    // Agent executions
    ...executions.map(e => ({ date: e.createdAt, type: 'agent', title: `Agent: ${e.agent?.name}`, detail: e.prompt.substring(0, 60), icon: Bot, color: e.agent?.color || '#8B5CF6' })),
    // Deposits
    ...transactions.map(t => ({ date: t.createdAt, type: 'deposit', title: 'Dépôt crédits', detail: t.description || t.type, icon: CreditCard, color: '#10B981' })),
    // Votes
    ...votes.map(v => ({ date: v.createdAt, type: 'vote', title: `Vote: ${v.film.title}`, detail: 'Film voté', icon: Star, color: '#F59E0B' })),
    // Tasks
    ...tasks.map(t => ({ date: t.updatedAt, type: 'task', title: `Tâche validée`, detail: t.title, icon: Zap, color: '#3B82F6' })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Group by month
  const grouped = new Map<string, TimelineEntry[]>()
  for (const entry of entries) {
    const key = entry.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(entry)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Timeline</h1>
        <p className="text-sm text-white/50 mt-1">Frise chronologique de vos contributions</p>
      </div>

      <div className="space-y-10">
        {Array.from(grouped.entries()).map(([month, items]) => (
          <div key={month}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {month}
            </h2>
            <div className="relative pl-8 space-y-4">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/[0.08]" />

              {items.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="relative flex items-start gap-4">
                    {/* Dot */}
                    <div className="absolute -left-5 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center z-10" style={{ backgroundColor: `${item.color}20` }}>
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-shadow">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" style={{ color: item.color }} />
                        <p className="text-sm font-medium text-white">{item.title}</p>
                      </div>
                      <p className="text-xs text-white/50">{item.detail}</p>
                      <p className="text-[10px] text-white/50 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <Calendar className="h-10 w-10 text-white/50 mx-auto mb-3" />
            <p className="text-sm text-white/50">Votre timeline est vide</p>
            <p className="text-xs text-white/50 mt-1">Commencez à utiliser la plateforme pour voir votre frise</p>
          </div>
        )}
      </div>
    </div>
  )
}
