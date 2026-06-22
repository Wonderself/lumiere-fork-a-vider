'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getMondayOfCurrentWeek(): Date {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

/**
 * Returns the current week's featured creator with user info, headline and achievement.
 * Public — no auth required.
 */
export async function getFeaturedCreatorAction() {
  const weekStart = getMondayOfCurrentWeek()

  const featured = await prisma.featuredCreator.findUnique({
    where: { weekStart },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          role: true,
          level: true,
          points: true,
          tasksCompleted: true,
        },
      },
    },
  })

  if (!featured || !featured.isActive) {
    return { creator: null }
  }

  return {
    creator: {
      id: featured.user.id,
      displayName: featured.user.displayName,
      avatarUrl: featured.user.avatarUrl,
      bio: featured.user.bio,
      role: featured.user.role,
      level: featured.user.level,
      points: featured.user.points,
      tasksCompleted: featured.user.tasksCompleted,
      headline: featured.headline,
      achievement: featured.achievement,
    },
  }
}

/**
 * Creates or updates the FeaturedCreator for the current week.
 * Deactivates any previously active featured creator.
 * Admin only.
 */
export async function setFeaturedCreatorAction(
  userId: string,
  headline: string,
  achievement: string
) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non authentifié' }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (admin?.role !== 'ADMIN') return { success: false, error: 'Accès refusé' }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })
  if (!targetUser) return { success: false, error: 'Utilisateur introuvable' }

  const weekStart = getMondayOfCurrentWeek()

  await prisma.featuredCreator.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  })

  await prisma.featuredCreator.upsert({
    where: { weekStart },
    create: {
      userId,
      weekStart,
      headline,
      achievement,
      isActive: true,
    },
    update: {
      userId,
      headline,
      achievement,
      isActive: true,
    },
  })

  return { success: true }
}

/**
 * Auto-selects the top contributor of the last 7 days (most validated tasks)
 * and creates a FeaturedCreator entry with an auto-generated headline.
 * Admin only.
 */
export async function autoSelectFeaturedCreatorAction() {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non authentifié', creator: null }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (admin?.role !== 'ADMIN') return { success: false, error: 'Accès refusé', creator: null }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const topContributors = await prisma.task.groupBy({
    by: ['claimedById'],
    where: {
      status: 'VALIDATED',
      validatedAt: { gte: sevenDaysAgo },
      claimedById: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 1,
  })

  if (topContributors.length === 0 || !topContributors[0].claimedById) {
    return { success: false, error: 'Aucun contributeur actif cette semaine', creator: null }
  }

  const topUserId = topContributors[0].claimedById
  const taskCount = topContributors[0]._count.id

  const topUser = await prisma.user.findUnique({
    where: { id: topUserId },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      role: true,
      level: true,
      points: true,
      tasksCompleted: true,
    },
  })
  if (!topUser) return { success: false, error: 'Utilisateur introuvable', creator: null }

  const weekStart = getMondayOfCurrentWeek()
  const name = topUser.displayName || 'Contributeur'
  const headline = `Créateur de la semaine — ${taskCount} tâche${taskCount > 1 ? 's' : ''} validée${taskCount > 1 ? 's' : ''}`
  const achievement = `Top contributeur de la semaine avec ${taskCount} tâche${taskCount > 1 ? 's' : ''} validée${taskCount > 1 ? 's' : ''} en 7 jours`

  await prisma.featuredCreator.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  })

  await prisma.featuredCreator.upsert({
    where: { weekStart },
    create: {
      userId: topUserId,
      weekStart,
      headline,
      achievement,
      isActive: true,
    },
    update: {
      userId: topUserId,
      headline,
      achievement,
      isActive: true,
    },
  })

  return {
    success: true,
    creator: {
      id: topUser.id,
      displayName: topUser.displayName,
      avatarUrl: topUser.avatarUrl,
      bio: topUser.bio,
      role: topUser.role,
      level: topUser.level,
      points: topUser.points,
      tasksCompleted: topUser.tasksCompleted,
      headline,
      achievement,
    },
  }
}
