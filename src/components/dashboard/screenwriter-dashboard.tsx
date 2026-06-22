import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  PenTool,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ScreenwriterDashboardProps {
  user: {
    id: string
    displayName: string | null
    points: number
    level: string
  }
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof CheckCircle; color: string }
> = {
  SUBMITTED: { label: 'Soumis', icon: Clock, color: 'text-blue-400' },
  EVALUATING: { label: 'En evaluation', icon: Clock, color: 'text-yellow-400' },
  ACCEPTED: { label: 'Accepte', icon: CheckCircle, color: 'text-green-400' },
  REJECTED: { label: 'Refuse', icon: XCircle, color: 'text-red-400' },
}

export async function ScreenwriterDashboard({ user }: ScreenwriterDashboardProps) {
  const screenplays = await prisma.screenplay.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  const submitted = screenplays.length
  const inReview = screenplays.filter((s) => s.status === 'SUBMITTED' || s.status === 'EVALUATING').length
  const accepted = screenplays.filter((s) => s.status === 'ACCEPTED').length
  const latestScores = screenplays
    .filter((s) => s.aiScore !== null)
    .slice(0, 3)

  const avgScore =
    latestScores.length > 0
      ? latestScores.reduce((sum, s) => sum + (s.aiScore ?? 0), 0) / latestScores.length
      : 0

  return (
    <div className="p-8 space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-3xl font-bold mb-1"
          >
            Mes Scenarios
          </h1>
          <p className="text-white/50">
            Bienvenue, {user.displayName || 'Scenariste'}
          </p>
        </div>
        <Link href="/screenplays/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Soumettre un scenario
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="p-6">
            <FileText className="h-5 w-5 text-[#E50914] mb-3" />
            <div className="text-2xl font-bold text-[#E50914]">{submitted}</div>
            <div className="text-xs text-white/40">Scripts soumis</div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <Clock className="h-5 w-5 text-yellow-400 mb-3" />
            <div className="text-2xl font-bold text-yellow-400">{inReview}</div>
            <div className="text-xs text-white/40">En review</div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <CheckCircle className="h-5 w-5 text-green-400 mb-3" />
            <div className="text-2xl font-bold text-green-400">{accepted}</div>
            <div className="text-xs text-white/40">Approuves</div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <Sparkles className="h-5 w-5 text-purple-400 mb-3" />
            <div className="text-2xl font-bold text-purple-400">
              {avgScore > 0 ? `${avgScore.toFixed(0)}` : 'N/A'}
            </div>
            <div className="text-xs text-white/40">Score moyen IA</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Screenplays */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Scenarios recents</h2>
          <Link href="/screenplays" className="text-sm text-[#E50914] hover:text-[#FF2D2D]">
            Voir tout &rarr;
          </Link>
        </div>

        {screenplays.length === 0 ? (
          <Card variant="glass">
            <CardContent className="p-8 text-center">
              <PenTool className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/40 mb-4">Aucun scenario soumis</p>
              <Link href="/screenplays/new">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Soumettre votre premier scenario
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {screenplays.slice(0, 5).map((screenplay) => {
              const config = STATUS_CONFIG[screenplay.status] || STATUS_CONFIG.SUBMITTED
              const StatusIcon = config.icon

              return (
                <Card key={screenplay.id} variant="glass" className="hover:border-[#E50914]/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg bg-white/[0.05] ${config.color}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{screenplay.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {screenplay.genre && (
                              <span className="text-xs text-white/30">{screenplay.genre}</span>
                            )}
                            <span className="text-xs text-white/20">
                              {formatDate(screenplay.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {screenplay.aiScore !== null && screenplay.aiScore !== undefined && (
                          <div className="text-right">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3 text-[#E50914]" />
                              <span
                                className={`text-sm font-bold ${
                                  screenplay.aiScore >= 80
                                    ? 'text-green-400'
                                    : screenplay.aiScore >= 65
                                    ? 'text-yellow-400'
                                    : 'text-red-400'
                                }`}
                              >
                                {screenplay.aiScore}
                              </span>
                            </div>
                          </div>
                        )}
                        <Badge
                          variant={
                            screenplay.status === 'ACCEPTED'
                              ? 'success'
                              : screenplay.status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <Card variant="gold">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PenTool className="h-5 w-5 text-[#E50914]" />
              <div>
                <h3 className="font-semibold">Soumettez un nouveau scenario</h3>
                <p className="text-sm text-white/40">
                  Notre IA evaluera votre scenario et vous donnera un feedback instantane.
                </p>
              </div>
            </div>
            <Link href="/screenplays/new">
              <Button size="sm">
                Commencer <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
