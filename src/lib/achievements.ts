/**
 * Achievement / Badge System
 *
 * 13 badges that can be earned through platform actions.
 * Each badge has trigger conditions checked after relevant actions.
 */

import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// ============================================
// BADGE DEFINITIONS
// ============================================

export interface BadgeDefinition {
  type: string
  name: string
  description: string
  icon: string // emoji
  category: 'contribution' | 'community' | 'quality' | 'special'
}

export const BADGES: BadgeDefinition[] = [
  // Contribution badges
  {
    type: 'PREMIERE_LUMIERE',
    name: 'Premiere CINEGENY',
    description: 'Completer sa premiere tache',
    icon: '💡',
    category: 'contribution',
  },
  {
    type: 'MARATHONIEN',
    name: 'Marathonien',
    description: 'Completer 10 taches',
    icon: '🏃',
    category: 'contribution',
  },
  {
    type: 'CENTURION',
    name: 'Centurion',
    description: 'Completer 100 taches',
    icon: '⚔️',
    category: 'contribution',
  },
  {
    type: 'POLYVALENT',
    name: 'Polyvalent',
    description: 'Completer des taches de 5 types differents',
    icon: '🎭',
    category: 'contribution',
  },
  // Quality badges
  {
    type: 'PERFECTIONNISTE',
    name: 'Perfectionniste',
    description: 'Obtenir un score IA de 95%+ sur 3 taches',
    icon: '✨',
    category: 'quality',
  },
  {
    type: 'REGULIER',
    name: 'Regulier',
    description: 'Soumettre dans les delais 10 fois de suite',
    icon: '⏰',
    category: 'quality',
  },
  {
    type: 'ZERO_REJET',
    name: 'Zero Rejet',
    description: '20 taches validees sans aucun rejet',
    icon: '🎯',
    category: 'quality',
  },
  // Community badges
  {
    type: 'SCENARISTE',
    name: 'Scenariste',
    description: 'Soumettre son premier scenario',
    icon: '📝',
    category: 'community',
  },
  {
    type: 'SCENARISTE_STAR',
    name: 'Scenariste Star',
    description: 'Avoir un scenario gagnant',
    icon: '⭐',
    category: 'community',
  },
  {
    type: 'VOTANT',
    name: 'Votant Actif',
    description: 'Voter dans 5 concours differents',
    icon: '🗳️',
    category: 'community',
  },
  {
    type: 'PARRAIN',
    name: 'Parrain',
    description: 'Parrainer 3 nouveaux membres',
    icon: '🤝',
    category: 'community',
  },
  // Special badges
  {
    type: 'EARLY_ADOPTER',
    name: 'Early Adopter',
    description: 'Etre parmi les 100 premiers inscrits',
    icon: '🚀',
    category: 'special',
  },
  {
    type: 'INVESTISSEUR',
    name: 'Investisseur',
    description: 'Acheter des tokens de co-production',
    icon: '💎',
    category: 'special',
  },
]

export const BADGE_MAP = new Map(BADGES.map(b => [b.type, b]))

// ============================================
// CHECK & AWARD FUNCTIONS
// ============================================

async function hasAchievement(userId: string, type: string): Promise<boolean> {
  const existing = await prisma.userAchievement.findFirst({
    where: { userId, achievementType: type },
  })
  return !!existing
}

async function awardBadge(userId: string, type: string): Promise<boolean> {
  if (await hasAchievement(userId, type)) return false

  const badge = BADGE_MAP.get(type)
  if (!badge) return false

  await prisma.userAchievement.create({
    data: {
      userId,
      achievementType: type,
      metadata: { name: badge.name, icon: badge.icon },
    },
  })

  await createNotification(userId, 'SYSTEM', `${badge.icon} Badge debloque : ${badge.name}`, {
    body: badge.description,
    href: '/profile',
  })

  return true
}

/**
 * Check and award badges after a task is validated.
 * Call this after approveSubmissionAction.
 */
export async function checkTaskBadges(userId: string): Promise<string[]> {
  const awarded: string[] = []

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tasksCompleted: true, tasksValidated: true, createdAt: true },
  })
  if (!user) return awarded

  // PREMIERE_LUMIERE — first task completed
  if (user.tasksCompleted >= 1) {
    if (await awardBadge(userId, 'PREMIERE_LUMIERE')) awarded.push('PREMIERE_LUMIERE')
  }

  // MARATHONIEN — 10 tasks
  if (user.tasksCompleted >= 10) {
    if (await awardBadge(userId, 'MARATHONIEN')) awarded.push('MARATHONIEN')
  }

  // CENTURION — 100 tasks
  if (user.tasksCompleted >= 100) {
    if (await awardBadge(userId, 'CENTURION')) awarded.push('CENTURION')
  }

  // POLYVALENT — 5 different task types
  const distinctTypes = await prisma.task.groupBy({
    by: ['type'],
    where: { claimedById: userId, status: 'VALIDATED' },
  })
  if (distinctTypes.length >= 5) {
    if (await awardBadge(userId, 'POLYVALENT')) awarded.push('POLYVALENT')
  }

  // PERFECTIONNISTE — 3 tasks with AI score >= 95
  const highScoreTasks = await prisma.taskSubmission.count({
    where: { userId, aiScore: { gte: 95 }, status: 'HUMAN_APPROVED' as never },
  })
  if (highScoreTasks >= 3) {
    if (await awardBadge(userId, 'PERFECTIONNISTE')) awarded.push('PERFECTIONNISTE')
  }

  // ZERO_REJET — 20 validated with no rejections
  const rejections = await prisma.taskSubmission.count({
    where: { userId, status: 'REJECTED' as never },
  })
  if (user.tasksValidated >= 20 && rejections === 0) {
    if (await awardBadge(userId, 'ZERO_REJET')) awarded.push('ZERO_REJET')
  }

  return awarded
}

/**
 * Check and award community-related badges.
 * Call after scenario submission, vote, or referral.
 */
export async function checkCommunityBadges(userId: string, event: 'scenario_submit' | 'scenario_win' | 'vote' | 'referral'): Promise<string[]> {
  const awarded: string[] = []

  if (event === 'scenario_submit') {
    if (await awardBadge(userId, 'SCENARISTE')) awarded.push('SCENARISTE')
  }

  if (event === 'scenario_win') {
    if (await awardBadge(userId, 'SCENARISTE_STAR')) awarded.push('SCENARISTE_STAR')
  }

  if (event === 'vote') {
    // Count distinct contests/scenarios voted in
    const scenarioVoteCount = await prisma.scenarioVote.count({
      where: { userId },
    })
    const trailerVoteCount = await prisma.trailerVote.count({
      where: { userId },
    })
    if (scenarioVoteCount + trailerVoteCount >= 5) {
      if (await awardBadge(userId, 'VOTANT')) awarded.push('VOTANT')
    }
  }

  if (event === 'referral') {
    const completedReferrals = await prisma.referral.count({
      where: { referrerId: userId, status: 'COMPLETED' },
    })
    if (completedReferrals >= 3) {
      if (await awardBadge(userId, 'PARRAIN')) awarded.push('PARRAIN')
    }
  }

  return awarded
}

/**
 * Check special one-time badges.
 */
export async function checkSpecialBadges(userId: string, event: 'register' | 'token_purchase'): Promise<string[]> {
  const awarded: string[] = []

  if (event === 'register') {
    const totalUsers = await prisma.user.count()
    if (totalUsers <= 100) {
      if (await awardBadge(userId, 'EARLY_ADOPTER')) awarded.push('EARLY_ADOPTER')
    }
  }

  if (event === 'token_purchase') {
    if (await awardBadge(userId, 'INVESTISSEUR')) awarded.push('INVESTISSEUR')
  }

  return awarded
}

/**
 * Get all badges for a user.
 */
export async function getUserBadges(userId: string) {
  const achievements = await prisma.userAchievement.findMany({
    where: { userId },
    orderBy: { earnedAt: 'desc' },
  })

  return achievements.map(a => ({
    ...a,
    badge: BADGE_MAP.get(a.achievementType),
  }))
}
