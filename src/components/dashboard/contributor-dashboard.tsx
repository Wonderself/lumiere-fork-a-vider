import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  Trophy,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Sun,
  Zap,
  User,
  CreditCard,
  Briefcase,
  BarChart3,
} from 'lucide-react'
import {
  TASK_STATUS_LABELS,
  LEVEL_POINTS,
} from '@/lib/constants'
import { formatPrice, getStatusColor, getLevelColor } from '@/lib/utils'

interface ContributorDashboardProps {
  user: {
    id: string
    displayName: string | null
    points: number
    level: string
    tasksCompleted: number
    tasksValidated: number
    lumenBalance: number
    rating: number
    role: string
  }
}

export async function ContributorDashboard({ user }: ContributorDashboardProps) {
  // Active tasks
  const activeTasks = await prisma.task.findMany({
    where: {
      claimedById: user.id,
      status: { in: ['CLAIMED', 'SUBMITTED', 'AI_REVIEW', 'HUMAN_REVIEW'] },
    },
    include: {
      film: { select: { title: true, slug: true } },
      phase: { select: { phaseName: true } },
    },
    orderBy: { claimedAt: 'desc' },
    take: 5,
  })

  // Total earnings
  const totalEarnings = await prisma.payment.aggregate({
    where: { userId: user.id, status: 'COMPLETED' },
    _sum: { amountEur: true },
  })

  // Level progress
  const nextLevelKey =
    user.level === 'ROOKIE'
      ? 'PRO'
      : user.level === 'PRO'
      ? 'EXPERT'
      : user.level === 'EXPERT'
      ? 'VIP'
      : null

  const nextLevelPoints = nextLevelKey
    ? LEVEL_POINTS[nextLevelKey as keyof typeof LEVEL_POINTS]
    : null
  const currentLevelPoints = LEVEL_POINTS[user.level as keyof typeof LEVEL_POINTS] || 0
  const levelProgress = nextLevelPoints
    ? Math.min(100, ((user.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100)
    : 100

  return (
    <div className="p-8 space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-3xl font-bold mb-1"
          >
            Bonjour, {user.displayName || 'Createur'}
          </h1>
          <p className="text-white/50">
            Niveau{' '}
            <span className={`font-semibold ${getLevelColor(user.level)}`}>{user.level}</span>
            {' '}&middot; {user.points} points
          </p>
        </div>
        <Link href="/tasks">
          <Button>
            Trouver une Tache <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            icon: CheckCircle,
            label: 'Taches Completees',
            value: user.tasksCompleted,
            color: 'text-green-400',
          },
          {
            icon: Trophy,
            label: 'Points Gagnes',
            value: user.points.toLocaleString('fr-FR'),
            color: 'text-[#E50914]',
          },
          {
            icon: TrendingUp,
            label: 'Gains Totaux',
            value: formatPrice(totalEarnings._sum.amountEur || 0),
            color: 'text-blue-400',
          },
          {
            icon: Star,
            label: 'Note Moyenne',
            value: user.rating > 0 ? `${user.rating.toFixed(1)}/5` : 'N/A',
            color: 'text-yellow-400',
          },
          {
            icon: Sun,
            label: 'Solde Lumens',
            value: user.lumenBalance.toLocaleString('fr-FR'),
            color: 'text-amber-400',
          },
        ].map((stat) => (
          <Card key={stat.label} variant="glass">
            <CardContent className="p-5">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
              <div className={`text-xl font-bold mb-0.5 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Level Progress */}
      {nextLevelKey && (
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#E50914]" />
                <span className="text-sm font-medium">Progression vers {nextLevelKey}</span>
              </div>
              <span className="text-sm text-white/40">
                {user.points} / {nextLevelPoints} pts
              </span>
            </div>
            <Progress value={levelProgress} />
            <p className="text-xs text-white/30 mt-2">
              {nextLevelPoints! - user.points} points restants pour atteindre le niveau {nextLevelKey}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Taches en cours</h2>
            <Link href="/tasks" className="text-sm text-[#E50914] hover:text-[#FF2D2D]">
              Voir tout &rarr;
            </Link>
          </div>

          {activeTasks.length === 0 ? (
            <Card variant="glass">
              <CardContent className="p-8 text-center">
                <Clock className="h-10 w-10 text-white/15 mx-auto mb-3" />
                <p className="text-white/40 mb-4">Aucune tache en cours</p>
                <Link href="/tasks">
                  <Button variant="outline" size="sm">Trouver une tache</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <Card variant="glass" className="hover:border-[#E50914]/20 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm mb-1 truncate">{task.title}</p>
                          <p className="text-xs text-white/40">{task.film.title}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
                            {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                          </span>
                          <span className="text-sm font-medium text-[#E50914]">
                            {formatPrice(task.priceEuros)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Activity + Quick Links */}
        <div className="space-y-6">
          {/* Weekly Activity Placeholder */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Activite de la semaine</h2>
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-[#E50914]" />
                  <span className="text-sm text-white/50">Apercu de votre activite</span>
                </div>
                {/* Placeholder bars */}
                <div className="flex items-end gap-2 h-24">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
                    const heights = [40, 65, 30, 80, 55, 20, 10]
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-[#E50914]/40 to-[#E50914]/10 transition-all"
                          style={{ height: `${heights[i]}%` }}
                        />
                        <span className="text-[10px] text-white/25">{day}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Acces rapide</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/tasks">
                <Card variant="glass" className="hover:border-[#E50914]/20 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-[#E50914]" />
                    <span className="text-sm font-medium">Taches disponibles</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile">
                <Card variant="glass" className="hover:border-[#E50914]/20 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium">Mon profil</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile/payments">
                <Card variant="glass" className="hover:border-[#E50914]/20 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium">Mes paiements</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/leaderboard">
                <Card variant="glass" className="hover:border-[#E50914]/20 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium">Classement</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Link (shown only for admin role) */}
      {user.role === 'ADMIN' && (
        <Card variant="gold">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-[#E50914]" />
                <span className="font-medium">Administration</span>
              </div>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Panneau Admin <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
