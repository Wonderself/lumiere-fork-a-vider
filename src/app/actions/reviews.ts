'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface FilmReview {
  id: string
  filmId: string
  userId: string
  userName: string
  rating: number
  comment: string | null
  createdAt: string
}

export interface FilmRating {
  average: number
  count: number
  distribution: Record<number, number> // star -> count
}

/**
 * Submit a review for a film (1-5 stars + optional text).
 * One review per user per film; submitting again updates the existing review.
 */
export async function submitReviewAction(
  filmId: string,
  rating: number,
  comment?: string
): Promise<{ success?: boolean; error?: string; review?: FilmReview }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  if (!filmId) return { error: 'Film manquant' }
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return { error: 'La note doit etre entre 1 et 5 etoiles' }
  }

  const userId = session.user.id
  const userName = session.user.name || 'Utilisateur'

  try {
    const dbReview = await prisma.review.upsert({
      where: { filmId_userId: { filmId, userId } },
      update: { rating, comment: comment || null },
      create: { filmId, userId, rating, comment: comment || null },
    })

    const review: FilmReview = {
      id: dbReview.id,
      filmId: dbReview.filmId,
      userId: dbReview.userId,
      userName,
      rating: dbReview.rating,
      comment: dbReview.comment,
      createdAt: dbReview.createdAt.toISOString(),
    }

    return { success: true, review }
  } catch (error) {
    console.error('[reviews] submitReviewAction error:', error)
    return { error: 'Erreur lors de la soumission de l\'avis.' }
  }
}

/**
 * Get reviews for a film, paginated (10 per page).
 */
export async function getFilmReviewsAction(
  filmId: string,
  page: number = 1
): Promise<{ reviews: FilmReview[]; total: number; page: number; totalPages: number }> {
  if (!filmId) return { reviews: [], total: 0, page: 1, totalPages: 0 }

  const perPage = 10

  try {
    const [dbReviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { filmId },
        include: { user: { select: { displayName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.review.count({ where: { filmId } }),
    ])

    const totalPages = Math.ceil(total / perPage)

    const reviews: FilmReview[] = dbReviews.map((r) => ({
      id: r.id,
      filmId: r.filmId,
      userId: r.userId,
      userName: r.user.displayName || 'Utilisateur',
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }))

    return { reviews, total, page, totalPages }
  } catch (error) {
    console.error('[reviews] getFilmReviewsAction error:', error)
    return { reviews: [], total: 0, page, totalPages: 0 }
  }
}

/**
 * Get average rating and distribution for a film.
 */
export async function getFilmRatingAction(
  filmId: string
): Promise<FilmRating> {
  if (!filmId) return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }

  try {
    const reviews = await prisma.review.findMany({
      where: { filmId },
      select: { rating: true },
    })

    const count = reviews.length
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    if (count === 0) {
      return { average: 0, count: 0, distribution }
    }

    let sum = 0
    for (const review of reviews) {
      sum += review.rating
      distribution[review.rating] = (distribution[review.rating] || 0) + 1
    }

    return {
      average: Math.round((sum / count) * 10) / 10,
      count,
      distribution,
    }
  } catch (error) {
    console.error('[reviews] getFilmRatingAction error:', error)
    return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  }
}

/**
 * Delete own review.
 */
export async function deleteReviewAction(
  reviewId: string
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  if (!reviewId) return { error: 'Avis manquant' }

  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) return { error: 'Avis introuvable' }
    if (review.userId !== session.user.id) return { error: 'Non autorise' }

    await prisma.review.delete({ where: { id: reviewId } })
    return { success: true }
  } catch (error) {
    console.error('[reviews] deleteReviewAction error:', error)
    return { error: 'Erreur lors de la suppression.' }
  }
}
