'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Server actions file — only async functions can be exported

/**
 * Watch History Server Actions
 *
 * Uses the FilmView model (CatalogFilm streaming views) to track watch progress.
 * FilmView has: filmId (CatalogFilm), userId, watchDuration (seconds), completionPct (0-100).
 *
 * Strategy:
 * - Each user+film pair gets a single FilmView record (upserted on each progress update).
 * - "Continue watching" = FilmView where 0 < completionPct < 95.
 * - "Watched" = FilmView where completionPct >= 95.
 */

/**
 * Record that a user watched a film (or update progress).
 * Creates or updates a FilmView entry for the user+film combination.
 */
export async function recordWatchProgressAction(
  filmId: string,
  progressPercent: number,
  durationSeconds: number
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progressPercent))

  // Find existing view for this user+film (most recent)
  const existingView = await prisma.filmView.findFirst({
    where: {
      filmId,
      userId: session.user.id,
    },
    orderBy: { createdAt: 'desc' },
  })

  if (existingView) {
    // Update existing view — only increase progress, never decrease
    await prisma.filmView.update({
      where: { id: existingView.id },
      data: {
        watchDuration: Math.max(existingView.watchDuration, durationSeconds),
        completionPct: Math.max(existingView.completionPct, clampedProgress),
      },
    })
  } else {
    // Create new view entry
    await prisma.filmView.create({
      data: {
        filmId,
        userId: session.user.id,
        watchDuration: durationSeconds,
        completionPct: clampedProgress,
      },
    })

    // Increment view count on the CatalogFilm
    await prisma.catalogFilm.update({
      where: { id: filmId },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {
      // Film might not exist, ignore
    })
  }

  return { success: true, progress: clampedProgress }
}

/**
 * Get user's watch history (recent films watched), sorted by most recent.
 */
export async function getWatchHistoryAction(limit: number = 20) {
  const session = await auth()
  if (!session?.user?.id) return []

  const views = await prisma.filmView.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      film: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          posterUrl: true,
          genre: true,
          duration: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return views.map((v) => ({
    id: v.id,
    filmId: v.filmId,
    film: v.film,
    watchDuration: v.watchDuration,
    completionPct: v.completionPct,
    watchedAt: v.createdAt,
  }))
}

/**
 * Get "continue watching" films — those with progress between 0% and 95%.
 * These are films the user started but hasn't finished.
 */
export async function getContinueWatchingAction() {
  const session = await auth()
  if (!session?.user?.id) return []

  const views = await prisma.filmView.findMany({
    where: {
      userId: session.user.id,
      completionPct: {
        gt: 0,
        lt: 95,
      },
    },
    include: {
      film: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          posterUrl: true,
          genre: true,
          duration: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return views.map((v) => ({
    id: v.id,
    filmId: v.filmId,
    film: v.film,
    watchDuration: v.watchDuration,
    completionPct: v.completionPct,
    watchedAt: v.createdAt,
  }))
}

/**
 * Mark a film as fully watched (set completionPct to 100).
 */
export async function markAsWatchedAction(filmId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Find existing view
  const existingView = await prisma.filmView.findFirst({
    where: {
      filmId,
      userId: session.user.id,
    },
    orderBy: { createdAt: 'desc' },
  })

  if (existingView) {
    await prisma.filmView.update({
      where: { id: existingView.id },
      data: { completionPct: 100 },
    })
  } else {
    // Create a new fully-watched entry
    await prisma.filmView.create({
      data: {
        filmId,
        userId: session.user.id,
        watchDuration: 0,
        completionPct: 100,
      },
    })

    // Increment view count
    await prisma.catalogFilm.update({
      where: { id: filmId },
      data: { viewCount: { increment: 1 } },
    }).catch((err) => console.error("[WatchHistory] Failed to increment view count:", err))
  }

  return { success: true }
}
