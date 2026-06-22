import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/admin/charts/line-chart'
import { BarChart } from '@/components/admin/charts/bar-chart'
import { DonutChart } from '@/components/admin/charts/donut-chart'
import { AreaChart } from '@/components/admin/charts/area-chart'
import { Sparkline } from '@/components/admin/charts/sparkline'
import { getAnalyticsOverview } from '@/app/actions/analytics'
import {
  Users, Film, ListChecks, FileText, CreditCard, TrendingUp, Trophy,
  ArrowUpRight, ArrowDownRight, Activity, Eye,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Analytics Avancees' }

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  // Fetch comprehensive analytics + existing chart data in parallel
  const [overview, tasksByType, tasksByDifficulty, usersByLevel, successByDifficulty, totalByDifficulty] = await Promise.all([
    getAnalyticsOverview(),
    prisma.task.groupBy({ by: ['type'], _count: true }),
    prisma.task.groupBy({ by: ['difficulty'], _count: true }),
    prisma.user.groupBy({ by: ['level'], _count: true }),
    prisma.task.groupBy({ by: ['difficulty'], where: { status: 'VALIDATED' }, _count: true }),
    prisma.task.groupBy({ by: ['difficulty'], _count: true }),
  ])

  const hasData = 'data' in overview
  const data = hasData ? overview.data : null

  // Type labels & colors
  const typeLabels: Record<string, string> = {
    PROMPT_WRITING: 'Prompt IA', IMAGE_GEN: 'Image', VIDEO_REVIEW: 'Review Video',
    STUNT_CAPTURE: 'Capture Stunts', DANCE_CAPTURE: 'Capture Danse', DIALOGUE_EDIT: 'Dialogues',
    COLOR_GRADE: 'Etalonnage', SOUND_DESIGN: 'Sound Design', CONTINUITY_CHECK: 'Continuité',
    QA_REVIEW: 'QA Review', CHARACTER_DESIGN: 'Design Perso', ENV_DESIGN: 'Design Décor',
    MOTION_REF: 'Motion Ref', COMPOSITING: 'Compositing', TRANSLATION: 'Traduction', SUBTITLE: 'Sous-titres',
  }
  const difficultyColors: Record<string, string> = {
    EASY: '#22c55e', MEDIUM: '#E50914', HARD: '#f97316', EXPERT: '#ef4444',
  }
  const levelColors: Record<string, string> = {
    ROOKIE: '#9ca3af', PRO: '#3b82f6', EXPERT: '#E50914', VIP: '#a855f7',
  }
  const roleColors: Record<string, string> = {
    ADMIN: '#ef4444', USER: '#9ca3af', CONTRIBUTOR: '#22c55e', CREATOR: '#E50914', INVESTOR: '#a855f7',
  }

  const successRateData = totalByDifficulty.map(t => {
    const validated = successByDifficulty.find(s => s.difficulty === t.difficulty)?._count || 0
    return {
      label: t.difficulty,
      value: t._count > 0 ? Math.round((validated / t._count) * 100) : 0,
      color: difficultyColors[t.difficulty] || '#E50914',
    }
  })

  // KPI cards data
  const kpis = data ? [
    {
      label: 'Utilisateurs',
      value: data.users.total,
      sub: `+${data.users.new7d} cette semaine`,
      trend: data.users.new7d > 0 ? 'up' : 'neutral',
      icon: Users,
      color: '#3b82f6',
      sparkData: data.users.dailyGrowth.map(d => d.count),
    },
    {
      label: 'Films',
      value: data.films.total,
      sub: `${data.films.inProduction} en production`,
      trend: data.films.inProduction > 0 ? 'up' : 'neutral',
      icon: Film,
      color: '#E50914',
      sparkData: [],
    },
    {
      label: 'Taches',
      value: data.tasks.total,
      sub: `${data.tasks.completionRate}% completees`,
      trend: data.tasks.completionRate > 50 ? 'up' : 'down',
      icon: ListChecks,
      color: '#22c55e',
      sparkData: [],
    },
    {
      label: 'Scenarios',
      value: data.scenarios.total,
      sub: `${data.scenarios.approvalRate}% approuves`,
      trend: data.scenarios.approvalRate > 30 ? 'up' : 'neutral',
      icon: FileText,
      color: '#f97316',
      sparkData: [],
    },
    {
      label: 'Revenus',
      value: `${Math.round(data.revenue.total)}€`,
      sub: 'Total distribue',
      trend: data.revenue.total > 0 ? 'up' : 'neutral',
      icon: CreditCard,
      color: '#a855f7',
      sparkData: data.revenue.dailyRevenue.map(d => d.amount),
    },
    {
      label: 'Engagement',
      value: data.engagement.totalNotifications,
      sub: 'Notifications envoyees',
      trend: 'neutral' as const,
      icon: Activity,
      color: '#06b6d4',
      sparkData: [],
    },
  ] : []

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-playfair">
          Analytics{' '}
          <span className="text-shimmer">Avancees</span>
        </h1>
        <p className="text-white/60">Vue complete des donnees et tendances de la plateforme</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />

      {/* KPI Grid */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:border-white/15 hover:shadow-md hover:-translate-y-[1px] transition-all duration-300">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl" style={{ background: `${kpi.color}15` }}>
                    <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                  </div>
                  {kpi.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-400" />}
                </div>
                <div className="text-2xl font-bold text-white mb-0.5 font-playfair">
                  {kpi.value}
                </div>
                <div className="text-xs text-white/50 mb-2">{kpi.label}</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/50 truncate">{kpi.sub}</span>
                  {kpi.sparkData.length > 2 && (
                    <Sparkline data={kpi.sparkData} color={kpi.color} width={48} height={16} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* User Verification Banner */}
      {data && data.users.verified < data.users.total && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <Eye className="h-4 w-4 text-amber-600 shrink-0" />
          <span className="text-sm text-amber-300/80">
            {data.users.total - data.users.verified} utilisateur{data.users.total - data.users.verified > 1 ? 's' : ''} non verifie{data.users.total - data.users.verified > 1 ? 's' : ''} ({data.users.verificationRate}% verification rate)
          </span>
        </div>
      )}

      {/* Charts Row 1: Growth + Revenue */}
      {data && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Croissance utilisateurs (30 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.users.dailyGrowth.some(d => d.count > 0) ? (
                <LineChart
                  data={data.users.dailyGrowth.map(d => ({
                    label: d.date.slice(5),
                    value: d.count,
                  }))}
                  color="#3b82f6"
                />
              ) : (
                <p className="text-sm text-white/50 text-center py-8">Pas encore de donnees</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-600" />
                Revenus quotidiens (30 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.revenue.dailyRevenue.some(d => d.amount > 0) ? (
                <AreaChart
                  data={data.revenue.dailyRevenue.map(d => ({
                    label: d.date.slice(5),
                    value: Math.round(d.amount * 100) / 100,
                  }))}
                  color="#a855f7"
                />
              ) : (
                <p className="text-sm text-white/50 text-center py-8">Pas encore de revenus</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Row 2: Distribution */}
      {data && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
            <CardHeader>
              <CardTitle className="text-sm">Distribution des roles</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={data.users.roleDistribution.map(r => ({
                label: r.role,
                value: r.count,
                color: roleColors[r.role] || '#9ca3af',
              }))} />
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
            <CardHeader>
              <CardTitle className="text-sm">Distribution des niveaux</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={usersByLevel.map(u => ({
                label: u.level,
                value: u._count,
                color: levelColors[u.level] || '#9ca3af',
              }))} />
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
            <CardHeader>
              <CardTitle className="text-sm">Taches par difficulte</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={tasksByDifficulty.map(t => ({
                label: t.difficulty,
                value: t._count,
                color: difficultyColors[t.difficulty] || '#E50914',
              }))} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Row 3: Tasks + Success Rate */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
          <CardHeader>
            <CardTitle className="text-sm">Taches par type</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={tasksByType.map(t => ({
              label: typeLabels[t.type] || t.type,
              value: t._count,
            }))} />
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] hover:shadow-md hover:-translate-y-[1px] transition-all">
          <CardHeader>
            <CardTitle className="text-sm">Taux de succes par difficulte</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={successRateData} />
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      {data && data.engagement.topContributors.length > 0 && (
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#E50914]" />
              Top 10 Contributeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.engagement.topContributors.map((user, i) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/[0.08] transition-all"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 ? 'bg-[#E50914]/20 text-[#E50914]' :
                    i === 1 ? 'bg-white/10 text-white/50' :
                    i === 2 ? 'bg-amber-700/20 text-amber-600' :
                    'bg-white/5 text-white/50'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white/80 truncate">{user.name}</div>
                    <div className="text-xs text-white/50">{user.role}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-[#E50914]">{user.lumens} LUM</div>
                    <div className="text-xs text-white/50">{user.tasksCompleted} taches</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Pipeline Summary */}
      {data && (
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-green-600" />
              Pipeline des taches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Disponibles', value: data.tasks.available, color: '#3b82f6' },
                { label: 'En cours', value: data.tasks.inProgress, color: '#E50914' },
                { label: 'Completees', value: data.tasks.completed, color: '#22c55e' },
                { label: 'Total', value: data.tasks.total, color: '#9ca3af' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-2xl font-bold mb-1 font-playfair" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-xs text-white/50">{item.label}</div>
                </div>
              ))}
            </div>
            {/* Completion progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>Taux de completion</span>
                <span className="font-medium text-[#E50914]">{data.tasks.completionRate}%</span>
              </div>
              <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all"
                  style={{ width: `${data.tasks.completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
