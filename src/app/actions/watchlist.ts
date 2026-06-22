'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Server actions file — only async functions can be exported

/**
 * Watchlist ("Ma Liste") Server Actions
 *
 * Uses the dedicated Watchlist model with proper foreign keys to CatalogFilm.
 */

/**
 * Add a film to the user's watchlist.
 */
export async function addToWatchlistAction(filmId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  // Verify the film exists
  const film = await prisma.catalogFilm.findUnique({
    where: { id: filmId },
    select: { id: true },
  })

  if (!film) {
    return { error: 'Film introuvable.' }
  }

  try {
    await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        filmId,
      },
    })
    return { success: true }
  } catch (error: unknown) {
    // Unique constraint violation = already in watchlist
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { error: 'Ce film est deja dans votre liste.' }
    }
    console.error('[watchlist] addToWatchlistAction error:', error)
    return { error: 'Erreur lors de l\'ajout.' }
  }
}

/**
 * Remove a film from the user's watchlist.
 */
export async function removeFromWatchlistAction(filmId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  try {
    await prisma.watchlist.delete({
      where: {
        userId_filmId: {
          userId: session.user.id,
          filmId,
        },
      },
    })
    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return { error: 'Ce film n\'est pas dans votre liste.' }
    }
    console.error('[watchlist] removeFromWatchlistAction error:', error)
    return { error: 'Erreur lors de la suppression.' }
  }
}

/**
 * Get the user's full watchlist with film details.
 */
export async function getWatchlistAction() {
  const session = await auth()
  if (!session?.user?.id) return []

  try {
    const entries = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
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
            synopsis: true,
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    })

    return entries.map((entry) => ({
      id: entry.id,
      filmId: entry.filmId,
      film: entry.film,
      addedAt: entry.addedAt,
    }))
  } catch (error) {
    console.error('[watchlist] getWatchlistAction error:', error)
    return []
  }
}

/**
 * Check if a specific film is in the user's watchlist.
 */
export async function isInWatchlistAction(filmId: string) {
  const session = await auth()
  if (!session?.user?.id) return false

  try {
    const entry = await prisma.watchlist.findUnique({
      where: {
        userId_filmId: {
          userId: session.user.id,
          filmId,
        },
      },
    })
    return !!entry
  } catch {
    return false
  }
}
