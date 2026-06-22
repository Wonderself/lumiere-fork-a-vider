import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Activity, Bot, MessageSquare, CreditCard, Star,
  Zap, Film, Clock, ArrowUpRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Activity Log — CINEGENY' }

export default async function ActivityPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const userId = session.user.id

  const [executions, transactions, votes] = await Promise.all([
    prisma.agentExecution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { agent: { select: { name: true, color: true } } },
    }),
    prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.filmVote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { film: { select: { title: true } } },
    }),
  ])

  // Merge all activities into a timeline
  type TimelineItem = { type: string; title: string; detail: string; date: Date; color: string; icon: string }

  const timeline: TimelineItem[] = [
    ...executions.map(e => ({
      type: 'agent', title: `Agent: ${e.agent?.name || 'Unknown'}`, detail: e.prompt.substring(0, 80),
      date: e.createdAt, color: e.agent?.color || '#8B5CF6', icon: 'bot',
    })),
    ...transactions.map(t => ({
      type: 'credit', title: t.type.replace(/_/g, ' '),
      detail: `${t.amount > 0 ? '+' : ''}${microToCredits(t.amount).toFixed(2)} crédits${t.description ? ` — ${t.description}` : ''}`,
      date: t.createdAt, color: t.amount > 0 ? '#10B981' : '#EF4444', icon: 'credit',
    })),
    ...votes.map(v => ({
      type: 'vote', title: `Vote: ${v.film.title}`, detail: 'Film voté',
      date: v.createdAt, color: '#F59E0B', icon: 'star',
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50)

  const ICON_MAP: Record<string, typeof Bot> = { bot: Bot, credit: CreditCard, star: Star, task: Zap }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Activity Log</h1>
        <p className="text-sm text-white/50 mt-1">Journal complet de votre activité sur la plateforme</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {timeline.length === 0 ? (
          <div className="p-12 text-center text-sm text-white/50">Aucune activité enregistrée</div>
        ) : (
          <div className="divide-y divide-white/10">
            {timeline.map((item, i) => {
              const Icon = ICON_MAP[item.icon] || Activity
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-white/50 truncate">{item.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-white/50 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
