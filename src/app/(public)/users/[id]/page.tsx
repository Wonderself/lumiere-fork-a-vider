import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { User, Star, CheckCircle, Trophy, Film, Sparkles, ExternalLink, ArrowLeft } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { getUserBadges, BADGES } from '@/lib/achievements'
import { BadgeShowcase } from '@/components/badge-showcase'
import { LevelProgress } from '@/components/level-progress'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id }, select: { displayName: true, email: true } })
  if (!user) return { title: 'Utilisateur introuvable' }
  return { title: `${user.displayName || user.email} — Profil Createur` }
}

const LEVEL_COLORS: Record<string, string> = {
  ROOKIE: 'bg-gray-500/20 text-gray-300',
  PRO: 'bg-blue-500/20 text-blue-400',
  EXPERT: 'bg-purple-500/20 text-purple-400',
  VIP: 'bg-[#E50914]/20 text-[#E50914]',
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  CONTRIBUTOR: 'Contributeur',
  ARTIST: 'Artiste',
  STUNT_PERFORMER: 'Cascadeur',
  VIEWER: 'Spectateur',
  SCREENWRITER: 'Scenariste',
  CREATOR: 'Createur',
}

export default async function PublicUserProfilePage({ params }: Props) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      email: true,
      avatarUrl: true,
      bio: true,
      role: true,
      level: true,
      points: true,
      tasksCompleted: true,
      tasksValidated: true,
      reputationScore: true,
      reputationBadge: true,
      skills: true,
      languages: true,
      portfolioUrl: true,
      createdAt: true,
      isVerified: true,
    },
  })

  if (!user) notFound()

  // Get user badges
  const userBadges = await getUserBadges(user.id)
  const earnedTypes = new Set(userBadges.map(b => b.achievementType))
  const allBadgesWithStatus = BADGES.map(b => ({
    ...b,
    earned: earnedTypes.has(b.type),
    earnedAt: userBadges.find(ub => ub.achievementType === b.type)?.earnedAt || null,
  }))

  // Get recent completed tasks
  const recentTasks = await prisma.task.findMany({
    where: { claimedById: user.id, status: 'VALIDATED' },
    select: {
      id: true,
      title: true,
      type: true,
      film: { select: { title: true, slug: true } },
    },
    orderBy: { validatedAt: 'desc' },
    take: 6,
  })

  // Get scenario proposals
  const scenarios = await prisma.scenarioProposal.findMany({
    where: { authorId: user.id },
    select: {
      id: true,
      title: true,
      genre: true,
      status: true,
      votesCount: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const name = user.displayName || user.email?.split('@')[0] || 'Utilisateur'

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back */}
        <Link href="/leaderboard" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Retour au classement
        </Link>

        {/* Profile Header */}
        <div className="relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 rounded-2xl border-2 border-[#E50914]/30">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={name} />}
              <AvatarFallback className="text-2xl rounded-2xl bg-[#E50914]/15 text-[#E50914]">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-playfair">
                  {name}
                </h1>
                {user.isVerified && (
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[user.level] || LEVEL_COLORS.ROOKIE}`}>
                  {user.level}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
                {user.reputationBadge && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E50914]/10 text-[#E50914]">
                    {user.reputationBadge}
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-sm text-white/50 leading-relaxed max-w-xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/30">
                <span>Membre depuis {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(user.createdAt)}</span>
                {user.portfolioUrl && (
                  <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#E50914] hover:underline">
                    <ExternalLink className="h-3 w-3" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Points', value: user.points, icon: Star, color: 'text-purple-400' },
            { label: 'Taches Validees', value: user.tasksValidated, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Reputation', value: user.reputationScore, icon: Trophy, color: 'text-[#E50914]' },
            { label: 'Taches Faites', value: user.tasksCompleted, icon: Sparkles, color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold font-playfair">{stat.value}</div>
              <div className="text-xs text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="mb-8">
          <LevelProgress level={user.level} points={user.points} />
        </div>

        {/* Badges */}
        {allBadgesWithStatus.some(b => b.earned) && (
          <div className="mb-8 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <BadgeShowcase badges={allBadgesWithStatus} compact />
          </div>
        )}

        {/* Skills & Languages */}
        {(user.skills.length > 0 || user.languages.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {user.skills.length > 0 && (
              <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Competences</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-xs bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user.languages.length > 0 && (
              <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Langues</h3>
                <div className="flex flex-wrap gap-2">
                  {user.languages.map((lang) => (
                    <span key={lang} className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/50 border border-white/10">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Validated Tasks */}
        {recentTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 font-playfair">
              Contributions Recentes
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {recentTasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all">
                    <p className="text-sm font-medium text-white/80 mb-1 line-clamp-1">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <Film className="h-3 w-3" />
                      <span>{task.film.title}</span>
                      <span className="text-white/10">·</span>
                      <span>{task.type}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Scenarios */}
        {scenarios.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 font-playfair">
              Scenarios Proposes
            </h2>
            <div className="space-y-3">
              {scenarios.map((s) => (
                <Link key={s.id} href={`/community/scenarios/${s.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all">
                    <div>
                      <p className="text-sm font-medium text-white/80">{s.title}</p>
                      <div className="flex items-center gap-2 text-xs text-white/30 mt-1">
                        {s.genre && <Badge variant="secondary">{s.genre}</Badge>}
                        <span>{s.votesCount} vote{s.votesCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <Badge variant={s.status === 'WINNER' ? 'default' : 'secondary'}>
                      {s.status === 'WINNER' ? 'Gagnant' : s.status === 'VOTING' ? 'En vote' : s.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
