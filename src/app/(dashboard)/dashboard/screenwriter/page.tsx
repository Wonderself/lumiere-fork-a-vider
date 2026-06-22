import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText, PenTool, Trophy, TrendingUp, Clock, CheckCircle,
  Plus, ChevronRight, Sparkles, Star, BarChart3,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Dashboard Scenariste' }

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  SUBMITTED: { label: 'Soumis', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Clock },
  SHORTLISTED: { label: 'Preselectione', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Star },
  VOTING: { label: 'En Vote', color: 'bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20', icon: TrendingUp },
  WINNER: { label: 'Gagnant', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: Trophy },
  ARCHIVED: { label: 'Archive', color: 'bg-white/5 text-white/30 border-white/10', icon: FileText },
}

export default async function ScreenwriterDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userId = session.user.id as string

  const [scenarios, stats] = await Promise.all([
    prisma.scenarioProposal.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        genre: true,
        logline: true,
        status: true,
        votesCount: true,
        aiScore: true,
        createdAt: true,
      },
    }),
    prisma.scenarioProposal.aggregate({
      where: { authorId: userId },
      _count: true,
      _sum: { votesCount: true },
      _avg: { aiScore: true },
    }),
  ])

  const winners = scenarios.filter(s => s.status === 'WINNER').length
  const inVoting = scenarios.filter(s => s.status === 'VOTING').length

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-playfair">
            Espace Scenariste
          </h1>
          <p className="text-white/50">Gerez vos scenarios et suivez leur progression.</p>
        </div>
        <Link href="/community">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Scenario
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Scenarios', value: stats._count, icon: FileText, color: 'text-blue-600' },
          { label: 'Total Votes', value: stats._sum.votesCount || 0, icon: TrendingUp, color: 'text-purple-600' },
          { label: 'Score IA Moyen', value: stats._avg.aiScore ? `${Math.round(stats._avg.aiScore)}%` : '—', icon: Sparkles, color: 'text-[#E50914]' },
          { label: 'Gagnants', value: winners, icon: Trophy, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <stat.icon className={`h-5 w-5 mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold font-playfair">{stat.value}</div>
            <div className="text-xs text-white/30 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active scenarios (in voting) */}
      {inVoting > 0 && (
        <div className="p-5 rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.03]">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-[#E50914]" />
            <span className="text-sm font-semibold text-[#E50914]">
              {inVoting} scenario{inVoting > 1 ? 's' : ''} en cours de vote
            </span>
          </div>
          <p className="text-xs text-white/40">
            Vos scenarios sont en phase de vote communautaire. Partagez-les pour maximiser vos chances !
          </p>
        </div>
      )}

      {/* Scenarios list */}
      <div>
        <h2 className="text-xl font-bold mb-4 font-playfair">
          Mes Scenarios
        </h2>

        {scenarios.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <PenTool className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 mb-4">Vous n&apos;avez pas encore soumis de scenario.</p>
            <Link href="/community">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Soumettre un Scenario
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scenarios.map((s) => {
              const config = STATUS_CONFIG[s.status] || STATUS_CONFIG.ARCHIVED
              return (
                <Link key={s.id} href={`/community/scenarios/${s.id}`}>
                  <div className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/15 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <config.icon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{s.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        {s.genre && <span>{s.genre}</span>}
                        <span>{s.votesCount} vote{s.votesCount !== 1 ? 's' : ''}</span>
                        {s.aiScore !== null && (
                          <span className={s.aiScore >= 75 ? 'text-green-600' : s.aiScore >= 50 ? 'text-[#E50914]' : 'text-red-400'}>
                            IA: {s.aiScore}%
                          </span>
                        )}
                        <span>{new Intl.DateTimeFormat('fr-FR').format(s.createdAt)}</span>
                      </div>
                      {s.logline && (
                        <p className="text-xs text-white/20 mt-1 line-clamp-1">{s.logline}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-white/30 transition-colors shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-white/60 mb-3">Conseils pour un bon scenario</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-white/40">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
            <span>Logline claire et accrocheuse (1-2 phrases)</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
            <span>Synopsis detaille avec debut, milieu et fin</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
            <span>Genre bien defini pour le ciblage IA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
