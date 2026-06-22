import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { DonutChart } from '@/components/admin/charts/donut-chart'
import { BarChart } from '@/components/admin/charts/bar-chart'
import { formatDate } from '@/lib/utils'
import {
  Shield, Star, Users, Award, TrendingUp,
  TrendingDown, Search, ChevronDown, ChevronUp,
  AlertCircle,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Reputation' }

async function adjustReputationAction(formData: FormData) {
  'use server'
  const { auth: getAuth } = await import('@/lib/auth')
  const { prisma: db } = await import('@/lib/prisma')
  const { revalidatePath: revalidate } = await import('next/cache')

  const session = await getAuth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const userId = formData.get('userId') as string
  const scoreChange = parseFloat(formData.get('scoreChange') as string || '0')
  const reason = formData.get('reason') as string || 'Ajustement admin'

  if (!userId || scoreChange === 0) return

  // Get current user
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { reputationScore: true },
  })
  if (!user) return

  const newScore = Math.max(0, Math.min(100, user.reputationScore + scoreChange))

  // Determine new badge
  let newBadge = 'bronze'
  if (newScore >= 90) newBadge = 'diamond'
  else if (newScore >= 75) newBadge = 'gold'
  else if (newScore >= 60) newBadge = 'silver'

  // Update user
  await db.user.update({
    where: { id: userId },
    data: {
      reputationScore: newScore,
      reputationBadge: newBadge,
    },
  })

  // Record event
  await db.reputationEvent.create({
    data: {
      userId,
      type: 'admin_adjustment',
      score: scoreChange,
      weight: 1.0,
      source: 'SYSTEM',
      metadata: { reason, adjustedBy: session.user.id },
    },
  })

  revalidate('/admin/reputation')
}

export default async function AdminReputationPage(
  props: { searchParams: Promise<{ user?: string; search?: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/dashboard')

  const searchParams = await props.searchParams
  const selectedUserId = searchParams.user || ''
  const searchQuery = searchParams.search || ''

  // Build where clause for users
  const userWhere: Record<string, unknown> = {}
  if (searchQuery) {
    userWhere.OR = [
      { displayName: { contains: searchQuery, mode: 'insensitive' } },
      { email: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  // Fetch users with reputation data
  const users = await prisma.user.findMany({
    where: userWhere,
    select: {
      id: true,
      displayName: true,
      email: true,
      avatarUrl: true,
      reputationScore: true,
      reputationBadge: true,
      role: true,
      level: true,
      tasksCompleted: true,
      _count: { select: { reputationEvents: true } },
    },
    orderBy: { reputationScore: 'desc' },
    take: 50,
  })

  // Badge distribution
  const badgeCounts = await Promise.all([
    prisma.user.count({ where: { reputationBadge: 'diamond' } }),
    prisma.user.count({ where: { reputationBadge: 'gold' } }),
    prisma.user.count({ where: { reputationBadge: 'silver' } }),
    prisma.user.count({ where: { reputationBadge: 'bronze' } }),
  ])

  const badgeDistribution = [
    { label: 'Diamond', value: badgeCounts[0], color: '#06b6d4' },
    { label: 'Gold', value: badgeCounts[1], color: '#E50914' },
    { label: 'Silver', value: badgeCounts[2], color: '#94a3b8' },
    { label: 'Bronze', value: badgeCounts[3], color: '#cd7f32' },
  ].filter(b => b.value > 0)

  // Score distribution for BarChart
  const scoreRanges = [
    { label: '0-20', min: 0, max: 20 },
    { label: '21-40', min: 21, max: 40 },
    { label: '41-60', min: 41, max: 60 },
    { label: '61-80', min: 61, max: 80 },
    { label: '81-100', min: 81, max: 100 },
  ]

  const scoreDistribution = await Promise.all(
    scoreRanges.map(async (range) => ({
      label: range.label,
      value: await prisma.user.count({
        where: {
          reputationScore: { gte: range.min, lte: range.max },
        },
      }),
      color: range.min >= 80 ? '#22c55e'
        : range.min >= 60 ? '#E50914'
        : range.min >= 40 ? '#f59e0b'
        : range.min >= 20 ? '#ef4444'
        : '#991b1b',
    }))
  )

  // If a user is selected, get their reputation history
  let selectedUserEvents: {
    id: string
    type: string
    score: number
    weight: number
    source: string
    metadata: unknown
    createdAt: Date
  }[] = []
  let selectedUser: typeof users[0] | null = null

  if (selectedUserId) {
    selectedUser = users.find(u => u.id === selectedUserId) || null
    selectedUserEvents = await prisma.reputationEvent.findMany({
      where: { userId: selectedUserId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
  }

  const badgeColors: Record<string, string> = {
    diamond: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600',
    gold: 'border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]',
    silver: 'border-gray-400/30 bg-gray-400/10 text-white/50',
    bronze: 'border-orange-600/30 bg-orange-600/10 text-orange-600',
  }

  const badgeIcons: Record<string, string> = {
    diamond: '💎',
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉',
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
          Reputation
        </h1>
        <p className="text-white/60">Scores, badges et historique de reputation</p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Badge Distribution */}
        <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-[#E50914]" />
            Distribution des Badges
          </h2>
          {badgeDistribution.length > 0 ? (
            <DonutChart data={badgeDistribution} size={180} />
          ) : (
            <div className="text-white/50 text-sm text-center py-12">Aucun badge attribue</div>
          )}
        </div>

        {/* Score Distribution */}
        <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#E50914]" />
            Distribution des Scores
          </h2>
          <BarChart data={scoreDistribution} height={200} />
        </div>
      </div>

      {/* Search */}
      <form action="/admin/reputation" method="GET" className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          placeholder="Rechercher un utilisateur..."
          className="w-full h-9 pl-9 pr-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
        />
      </form>

      <div className={`grid ${selectedUserId ? 'grid-cols-1 lg:grid-cols-5' : ''} gap-4 sm:gap-6`}>
        {/* Users Table */}
        <div className={`rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] overflow-hidden ${selectedUserId ? 'lg:col-span-3' : ''}`}>
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <Users className="h-4 w-4 text-white/50" />
            <h2 className="text-sm font-semibold text-white/80">Utilisateurs</h2>
            <span className="text-xs text-white/50 ml-auto">{users.length} resultats</span>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-16 text-white/50">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Aucun utilisateur trouve</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-white/50 font-medium p-4">Utilisateur</th>
                    <th className="text-center text-xs text-white/50 font-medium p-4">Score</th>
                    <th className="text-center text-xs text-white/50 font-medium p-4">Badge</th>
                    <th className="text-center text-xs text-white/50 font-medium p-4">Events</th>
                    <th className="text-right text-xs text-white/50 font-medium p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isSelected = user.id === selectedUserId
                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                          isSelected ? 'bg-[#E50914]/5 border-l-2 border-l-[#E50914]' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">
                                {(user.displayName || user.email)?.[0]?.toUpperCase() || '?'}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">{user.displayName || user.email}</p>
                              <p className="text-xs text-white/50">{user.role} / {user.level}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${user.reputationScore}%`,
                                  background: user.reputationScore >= 80 ? '#22c55e'
                                    : user.reputationScore >= 60 ? '#E50914'
                                    : user.reputationScore >= 40 ? '#f59e0b'
                                    : '#ef4444',
                                }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${
                              user.reputationScore >= 80 ? 'text-green-600'
                              : user.reputationScore >= 60 ? 'text-[#E50914]'
                              : user.reputationScore >= 40 ? 'text-yellow-600'
                              : 'text-red-400'
                            }`}>
                              {user.reputationScore.toFixed(0)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColors[user.reputationBadge] || badgeColors.bronze}`}>
                            {user.reputationBadge}
                          </span>
                        </td>
                        <td className="p-4 text-center text-xs text-white/50">
                          {user._count.reputationEvents}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`/admin/reputation?user=${user.id}${searchQuery ? `&search=${searchQuery}` : ''}`}
                            className={`text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                                : 'border border-white/10 text-white/50 hover:text-white/60 hover:border-white/20'
                            }`}
                          >
                            {isSelected ? 'Selectionne' : 'Voir'}
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Detail Panel */}
        {selectedUserId && selectedUser && (
          <div className="lg:col-span-2 space-y-4">
            {/* User Summary */}
            <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#E50914]/20 bg-[#E50914]/5 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                {selectedUser.avatarUrl ? (
                  <img src={selectedUser.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#E50914]/10 flex items-center justify-center text-lg font-bold text-[#E50914]">
                    {(selectedUser.displayName || selectedUser.email)?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{selectedUser.displayName || selectedUser.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColors[selectedUser.reputationBadge] || badgeColors.bronze}`}>
                      {selectedUser.reputationBadge}
                    </span>
                    <span className="text-xs text-white/50">{selectedUser.role}</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-3xl font-bold ${
                    selectedUser.reputationScore >= 80 ? 'text-green-600'
                    : selectedUser.reputationScore >= 60 ? 'text-[#E50914]'
                    : selectedUser.reputationScore >= 40 ? 'text-yellow-600'
                    : 'text-red-400'
                  }`}>
                    {selectedUser.reputationScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-white/50">/ 100</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-white/50">Taches</div>
                  <div className="text-sm font-bold text-white">{selectedUser.tasksCompleted}</div>
                </div>
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-white/50">Events</div>
                  <div className="text-sm font-bold text-white">{selectedUser._count.reputationEvents}</div>
                </div>
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-white/50">Niveau</div>
                  <div className="text-sm font-bold text-white">{selectedUser.level}</div>
                </div>
              </div>
            </div>

            {/* Manual Adjustment Form */}
            <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#E50914]" />
                Ajustement Manuel
              </h3>
              <form action={adjustReputationAction} className="space-y-3">
                <input type="hidden" name="userId" value={selectedUserId} />
                <div>
                  <label className="block text-xs text-white/50 mb-1">Variation de score</label>
                  <input
                    type="number"
                    name="scoreChange"
                    step="0.1"
                    placeholder="ex: +5 ou -10"
                    required
                    className="w-full h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Raison</label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="Raison de l'ajustement..."
                    required
                    className="w-full h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 rounded-lg bg-[#E50914] text-white font-semibold text-sm hover:bg-[#FF2D2D] transition-colors"
                >
                  Appliquer l&apos;ajustement
                </button>
              </form>
            </div>

            {/* Reputation Events History */}
            <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Star className="h-4 w-4 text-white/50" />
                  Historique Events
                </h3>
              </div>
              {selectedUserEvents.length === 0 ? (
                <div className="text-center py-8 text-white/50 text-sm">Aucun evenement</div>
              ) : (
                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                  {selectedUserEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        event.score > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {event.score > 0 ? (
                          <ChevronUp className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{event.type}</p>
                        <p className="text-xs text-white/50">
                          {event.source} — {formatDate(event.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-sm font-bold ${event.score > 0 ? 'text-green-600' : 'text-red-400'}`}>
                          {event.score > 0 ? '+' : ''}{event.score.toFixed(1)}
                        </span>
                        {event.weight !== 1 && (
                          <div className="text-xs text-white/50">x{event.weight}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
