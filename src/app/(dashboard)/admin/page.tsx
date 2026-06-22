import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Sparkline } from '@/components/admin/charts/sparkline'
import {
  Users, Film, Star, CreditCard, ClipboardCheck,
  ChevronRight, AlertCircle, Plus, CheckCircle, Clock, BarChart3,
  Target, Eye, ArrowUpRight,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'
import { getFeaturedCreatorAction } from '@/app/actions/featured-creator'
import { FeaturedCreatorPanel } from './featured-creator-panel'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Command Center' }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [
    usersCount, pendingUsers, filmsCount, tasksCount, availableTasks,
    totalPayments, pendingReviews, validatedTasks, submissionsTotal,
    recentSubmissions, todos, recentNotifications,
    featuredCreatorResult,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isVerified: false } }),
    prisma.film.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'AVAILABLE' } }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amountEur: true } }),
    prisma.taskSubmission.count({ where: { status: 'AI_FLAGGED' } }),
    prisma.task.count({ where: { status: 'VALIDATED' } }),
    prisma.taskSubmission.count(),
    prisma.taskSubmission.findMany({
      include: {
        task: { select: { title: true, priceEuros: true } },
        user: { select: { displayName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.adminTodo.findMany({ orderBy: [{ completed: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }], take: 8 }),
    prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { displayName: true } } } }),
    getFeaturedCreatorAction(),
  ])

  const completionRate = tasksCount > 0 ? Math.round((validatedTasks / tasksCount) * 100) : 0
  const revenue = totalPayments._sum.amountEur || 0

  // Mock sparkline data (in real app, aggregate from last 7 days)
  const userSparkline = [2, 3, 5, 4, 7, 6, usersCount > 8 ? 8 : usersCount]
  const taskSparkline = [1, 2, 4, 3, 5, 6, validatedTasks > 7 ? 7 : validatedTasks]
  const revenueSparkline = [0, 50, 100, 80, 150, 200, revenue > 0 ? revenue / 10 : 0]

  const kpis = [
    { icon: Users, label: 'Utilisateurs', value: usersCount, sub: `${pendingUsers} non vérifiés`, href: '/admin/users', color: 'text-blue-400', sparkline: userSparkline, trend: pendingUsers > 0 ? 'up' : 'stable' },
    { icon: Film, label: 'Films', value: filmsCount, sub: 'projets actifs', href: '/admin/films', color: 'text-purple-400', sparkline: [1, 1, 2, 2, 3, 3, filmsCount], trend: 'up' },
    { icon: Star, label: 'Tâches', value: tasksCount, sub: `${availableTasks} disponibles`, href: '/admin/tasks', color: 'text-[#E50914]', sparkline: taskSparkline, trend: 'up' },
    { icon: CreditCard, label: 'Revenus', value: formatPrice(revenue), sub: 'total distribué', href: '/admin/payments', color: 'text-green-400', sparkline: revenueSparkline, trend: revenue > 0 ? 'up' : 'stable' },
    { icon: ClipboardCheck, label: 'Soumissions', value: submissionsTotal, sub: `${pendingReviews} à reviewer`, href: '/admin/reviews', color: 'text-orange-400', sparkline: [0, 1, 2, 3, 2, 4, submissionsTotal], trend: pendingReviews > 0 ? 'alert' : 'stable' },
    { icon: Target, label: 'Taux Complétion', value: `${completionRate}%`, sub: `${validatedTasks}/${tasksCount}`, href: '/admin/analytics', color: 'text-cyan-400', sparkline: [10, 20, 30, 40, 50, 60, completionRate], trend: 'up' },
  ]

  const priorityColors: Record<string, string> = {
    URGENT: 'text-red-400 bg-red-500/10 border-red-500/20',
    HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-3 font-playfair">
            Command Center
          </h1>
          <p className="text-white/50">Vue globale de la plateforme CINEGENY</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/films/new"><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Film</Button></Link>
          <Link href="/admin/tasks/new"><Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Tâche</Button></Link>
        </div>
      </div>

      {/* Alert */}
      {pendingReviews > 0 && (
        <Link href="/admin/reviews">
          <div className="flex items-center gap-3 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15 transition-colors">
            <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0" />
            <p className="font-medium text-yellow-400 flex-1">{pendingReviews} soumission{pendingReviews > 1 ? 's' : ''} en attente de review humaine</p>
            <ChevronRight className="h-5 w-5 text-yellow-400" />
          </div>
        </Link>
      )}

      {/* KPIs with sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className="hover:border-white/10 transition-all cursor-pointer h-full">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <Sparkline data={kpi.sparkline} color={kpi.color === 'text-[#E50914]' ? '#E50914' : undefined} />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-xs text-white/40 mt-1">{kpi.sub}</div>
                  </div>
                  {kpi.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-400" />}
                  {kpi.trend === 'alert' && <AlertCircle className="h-4 w-4 text-yellow-400" />}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* TODO List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">TODO List Admin</CardTitle>
              <Link href="/admin/todo-fondateur" className="text-xs text-[#E50914]">Voir tout →</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">Aucune tâche admin</p>
            ) : (
              todos.map((todo) => (
                <div key={todo.id} className={`flex items-center gap-3.5 p-4 rounded-lg border ${todo.completed ? 'border-white/5 opacity-50' : 'border-white/10'}`}>
                  {todo.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-white/30 shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${todo.completed ? 'line-through text-white/30' : ''}`}>
                    {todo.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[todo.priority] || priorityColors.LOW}`}>
                    {todo.priority}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Activité Récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotifications.length === 0 && recentSubmissions.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">Aucune activité</p>
            ) : (
              [...recentSubmissions.slice(0, 5)].map((sub) => (
                <div key={sub.id} className="flex items-center gap-3.5 p-4 rounded-lg border border-white/5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    sub.status === 'AI_APPROVED' ? 'bg-green-400' :
                    sub.status === 'AI_FLAGGED' ? 'bg-yellow-400' :
                    sub.status === 'HUMAN_APPROVED' ? 'bg-[#E50914]' :
                    'bg-white/30'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{sub.user.displayName} → {sub.task.title}</p>
                    <p className="text-xs text-white/30">{sub.status}{sub.aiScore ? ` (${sub.aiScore}/100)` : ''}</p>
                  </div>
                  <span className="text-xs text-[#E50914] shrink-0">{formatPrice(sub.task.priceEuros)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Créateur en vedette */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" /> Créateur en vedette
            </CardTitle>
            <span className="text-xs text-white/30">Semaine courante</span>
          </div>
        </CardHeader>
        <CardContent>
          <FeaturedCreatorPanel initialCreator={featuredCreatorResult.creator ?? null} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Film, label: 'Nouveau Film', href: '/admin/films/new' },
          { icon: Star, label: 'Nouvelle Tâche', href: '/admin/tasks/new' },
          { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
          { icon: Eye, label: 'Reviews', href: '/admin/reviews' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="group p-7 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#E50914]/20 transition-all text-center">
              <action.icon className="h-5 w-5 text-[#E50914] mx-auto mb-5" />
              <p className="text-sm font-medium">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
