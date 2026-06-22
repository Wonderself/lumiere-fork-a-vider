import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, getLevelColor, getInitials } from '@/lib/utils'
import {
  Star,
  Trophy,
  CheckCircle,
  Coins,
  Globe,
  Wallet,
  Calendar,
  ShieldCheck,
  Clapperboard,
} from 'lucide-react'
import { ProfileEditDialog } from './profile-edit-dialog'
import { getUserBadges, BADGES } from '@/lib/achievements'
import { BadgeShowcase } from '@/components/badge-showcase'
import { LevelProgress } from '@/components/level-progress'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Mon Profil' }

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  CONTRIBUTOR: 'Contributeur',
  ARTIST: 'Artiste',
  STUNT_PERFORMER: 'Cascadeur',
  VIEWER: 'Spectateur',
  SCREENWRITER: 'Scenariste',
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      portfolioUrl: true,
      walletAddress: true,
      role: true,
      level: true,
      skills: true,
      languages: true,
      points: true,
      tasksCompleted: true,
      tasksValidated: true,
      lumenBalance: true,
      isVerified: true,
      createdAt: true,
    },
  })

  if (!user) redirect('/login')

  // Get user badges
  const userBadges = await getUserBadges(user.id)
  const earnedTypes = new Set(userBadges.map(b => b.achievementType))
  const allBadgesWithStatus = BADGES.map(b => ({
    ...b,
    earned: earnedTypes.has(b.type),
    earnedAt: userBadges.find(ub => ub.achievementType === b.type)?.earnedAt || null,
  }))

  const stats = [
    {
      icon: Star,
      label: 'Points',
      value: user.points.toLocaleString('fr-FR'),
      color: 'text-[#E50914]',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: CheckCircle,
      label: 'Taches Completees',
      value: user.tasksCompleted.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10 border-green-500/20',
    },
    {
      icon: Trophy,
      label: 'Taches Validees',
      value: user.tasksValidated.toString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Coins,
      label: 'Solde Lumens',
      value: user.lumenBalance.toLocaleString('fr-FR'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* ── User Info Card ── */}
      <div className="relative overflow-hidden bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-md transition-shadow duration-500">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-2 border-[#E50914]/20 shadow-lg ring-4 ring-[#E50914]/5">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.displayName || 'Avatar'} />
              )}
              <AvatarFallback className="text-lg bg-[#E50914]/10 text-[#E50914]">
                {getInitials(user.displayName || user.email)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1
                  className="text-3xl font-bold text-white"
                >
                  {user.displayName || 'Createur'}
                </h1>
                <Badge
                  variant="secondary"
                  className={`${getLevelColor(user.level)} border-current/20`}
                >
                  {user.level}
                </Badge>
                <Badge variant="outline" className="text-[#E50914] border-[#E50914]/30">
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
                {user.isVerified && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verifie
                  </Badge>
                )}
              </div>

              <p className="text-white/50 text-sm mb-1">{user.email}</p>

              <div className="flex items-center gap-4 text-xs text-white/50 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Membre depuis {formatDate(user.createdAt)}
                </span>
                {user.walletAddress && (
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5" />
                    Wallet connecte
                  </span>
                )}
              </div>
            </div>

            {/* Edit button */}
            <div className="shrink-0 self-start">
              <ProfileEditDialog
                user={{
                  displayName: user.displayName,
                  bio: user.bio,
                  avatarUrl: user.avatarUrl,
                  portfolioUrl: user.portfolioUrl,
                  skills: user.skills,
                  languages: user.languages,
                  walletAddress: user.walletAddress,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`border bg-white/5 sm:rounded-2xl rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 ${stat.bgColor}`}
          >
            <div className="p-4 sm:p-6 text-center">
              <div className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${stat.bgColor} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-white/60 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Level Progress ── */}
      <div className="bg-white/5 sm:rounded-2xl rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-7 hover:shadow-md transition-shadow duration-500">
        <h2
          className="text-lg font-semibold text-white mb-5"
        >
          Progression
        </h2>
        <div className="relative">
          {/* Level bar (light theme adaptation) */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-[#E50914]">{user.level}</span>
            <span className="text-xs text-white/60">{user.points.toLocaleString('fr-FR')} points</span>
          </div>
          <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
              style={{ width: `${(() => {
                const thresholds: Record<string, number> = { ROOKIE: 0, PRO: 500, EXPERT: 2500, VIP: 10000 }
                const order = ['ROOKIE', 'PRO', 'EXPERT', 'VIP']
                const idx = order.indexOf(user.level)
                if (idx >= order.length - 1) return 100
                const curr = thresholds[user.level] || 0
                const next = thresholds[order[idx + 1]] || curr
                return Math.min(100, Math.round(((user.points - curr) / (next - curr)) * 100))
              })()}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {['ROOKIE', 'PRO', 'EXPERT', 'VIP'].map((lvl) => (
              <span key={lvl} className={`text-[10px] ${lvl === user.level ? 'text-[#E50914] font-bold' : 'text-white/60'}`}>
                {lvl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Badges ── */}
      {allBadgesWithStatus.some(b => b.earned) && (
        <div className="bg-white/5 sm:rounded-2xl rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-7 hover:shadow-md transition-shadow duration-500">
          <h2
            className="text-lg font-semibold text-white mb-5"
          >
            Badges ({allBadgesWithStatus.filter(b => b.earned).length}/{allBadgesWithStatus.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            {allBadgesWithStatus.filter(b => b.earned).map((badge) => (
              <span
                key={badge.type}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20"
                title={badge.description}
              >
                <span>{badge.icon}</span>
                {badge.name}
              </span>
            ))}
          </div>
          {allBadgesWithStatus.some(b => !b.earned) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {allBadgesWithStatus.filter(b => !b.earned).map((badge) => (
                <span
                  key={badge.type}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] bg-white/[0.03] text-white/60 border border-white/10"
                  title={badge.description}
                >
                  <span className="grayscale">{badge.icon}</span>
                  {badge.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Profile Completion CTA ── */}
      {!user.bio && user.skills.length === 0 && user.languages.length === 0 && (
        <div className="relative overflow-hidden bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#E50914]/20 hover:shadow-md transition-shadow duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5">
              <Clapperboard className="h-8 w-8 text-[#E50914]" />
            </div>
            <h2
              className="text-xl font-bold text-white mb-3"
            >
              Complétez votre profil
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Un profil complet augmente votre visibilité dans la communauté et vous donne accès à plus de missions.
            </p>
            <ProfileEditDialog
              user={{
                displayName: user.displayName,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
                portfolioUrl: user.portfolioUrl,
                skills: user.skills,
                languages: user.languages,
                walletAddress: user.walletAddress,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Bio Section ── */}
      {user.bio && (
        <div className="bg-white/5 sm:rounded-2xl rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-6 hover:shadow-md transition-shadow duration-500">
          <h2
            className="text-lg font-semibold text-white mb-3"
          >
            À propos
          </h2>
          <p className="text-white/60 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
        </div>
      )}

      {/* ── Skills & Languages ── */}
      <div className="grid md:grid-cols-2 gap-7">
        {/* Skills */}
        {user.skills.length > 0 && (
          <div className="bg-white/5 sm:rounded-2xl rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-7 hover:shadow-md transition-shadow duration-500">
            <h2
              className="text-lg font-semibold text-white mb-5"
            >
              Competences
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20 hover:bg-[#E50914]/15 transition-colors duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {user.languages.length > 0 && (
          <div className="bg-white/5 sm:rounded-2xl rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-7 hover:shadow-md transition-shadow duration-500">
            <h2
              className="text-lg font-semibold text-white mb-5"
            >
              Langues
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.03] text-white/60 border border-white/10 hover:bg-white/[0.05] transition-colors duration-300"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Portfolio Link ── */}
      {user.portfolioUrl && (
        <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-7">
          <h2
            className="text-lg font-semibold text-white mb-4"
          >
            Portfolio
          </h2>
          <a
            href={user.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#E50914] hover:text-[#FF2D2D] transition-colors text-sm"
          >
            <Globe className="h-4 w-4" />
            {user.portfolioUrl}
          </a>
        </div>
      )}
    </div>
  )
}
