'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Trash2, Loader2 } from 'lucide-react'
import {
  submitReviewAction,
  getFilmReviewsAction,
  getFilmRatingAction,
  deleteReviewAction,
} from '@/app/actions/reviews'
import type { FilmReview, FilmRating } from '@/app/actions/reviews'

// ─── Star Rating Display ─────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={star <= rating ? 'text-[#E50914] fill-[#E50914]' : 'text-white/20'}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}

// ─── Interactive Star Selector ───────────────────────────────────
function StarSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (rating: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-0.5 transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} etoile${star > 1 ? 's' : ''}`}
        >
          <Star
            className={
              star <= (hover || value)
                ? 'text-[#E50914] fill-[#E50914]'
                : 'text-white/20'
            }
            style={{ width: 28, height: 28 }}
          />
        </button>
      ))}
      {(hover || value) > 0 && (
        <span className="text-sm text-white/40 ml-2">
          {hover || value}/5
        </span>
      )}
    </div>
  )
}

// ─── Single Review Card ──────────────────────────────────────────
function ReviewCard({
  review,
  isOwn,
  onDelete,
}: {
  review: FilmReview
  isOwn: boolean
  onDelete: (id: string) => void
}) {
  const date = new Date(review.createdAt)
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white/80">
              {review.userName}
            </span>
            <StarRating rating={review.rating} size={14} />
          </div>
          <p className="text-xs text-white/30">{formattedDate}</p>
        </div>
        {isOwn && (
          <button
            onClick={() => onDelete(review.id)}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
            title="Supprimer mon avis"
          >
            <Trash2 style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>
      {review.comment && (
        <p className="text-sm text-white/50 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  )
}

// ─── Main Film Reviews Component ─────────────────────────────────
export function FilmReviews({ filmId }: { filmId: string }) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<FilmReview[]>([])
  const [rating, setRating] = useState<FilmRating | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formRating, setFormRating] = useState(0)
  const [formComment, setFormComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const loadReviews = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const [reviewsData, ratingData] = await Promise.all([
        getFilmReviewsAction(filmId, p),
        getFilmRatingAction(filmId),
      ])
      setReviews(reviewsData.reviews)
      setTotal(reviewsData.total)
      setPage(reviewsData.page)
      setTotalPages(reviewsData.totalPages)
      setRating(ratingData)
    } catch {
      // Silently handle errors
    } finally {
      setLoading(false)
    }
  }, [filmId])

  useEffect(() => {
    loadReviews(1)
  }, [loadReviews])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (formRating === 0) {
      setFormError('Veuillez selectionner une note')
      return
    }

    setSubmitting(true)
    try {
      const result = await submitReviewAction(
        filmId,
        formRating,
        formComment.trim() || undefined
      )
      if (result.error) {
        setFormError(result.error)
      } else {
        setFormSuccess('Avis publie !')
        setFormRating(0)
        setFormComment('')
        await loadReviews(1)
        setTimeout(() => setFormSuccess(''), 3000)
      }
    } catch {
      setFormError('Erreur lors de la soumission')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(reviewId: string) {
    try {
      const result = await deleteReviewAction(reviewId)
      if (result.error) {
        setFormError(result.error)
      } else {
        await loadReviews(page)
      }
    } catch {
      setFormError('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2
          className="text-2xl font-bold text-white"
        >
          Avis et Notes
        </h2>
        {rating && rating.count > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-[#E50914] font-playfair">
              {rating.average}
            </div>
            <div>
              <StarRating rating={Math.round(rating.average)} size={16} />
              <p className="text-xs text-white/30 mt-0.5">
                {rating.count} avis
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Form (only for logged-in users) */}
      {session?.user ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
            Ecrire un avis
          </h3>

          <div>
            <label className="text-sm text-white/40 block mb-2">
              Votre note
            </label>
            <StarSelector value={formRating} onChange={setFormRating} />
          </div>

          <div>
            <label className="text-sm text-white/40 block mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Partagez votre opinion sur ce film..."
              rows={3}
              maxLength={1000}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/50 resize-none transition-colors"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-sm text-emerald-400">{formSuccess}</p>
          )}

          <button
            type="submit"
            disabled={submitting || formRating === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E50914] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#FF2D2D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Publier mon avis
          </button>
        </form>
      ) : (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/40">
            <a href="/login" className="text-[#E50914] hover:underline">
              Connectez-vous
            </a>{' '}
            pour laisser un avis.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#E50914]/50" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={review.userId === session?.user?.id}
              onDelete={handleDelete}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => loadReviews(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Precedent
              </button>
              <span className="text-xs text-white/30">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => loadReviews(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Star className="h-10 w-10 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/30">
            Aucun avis pour le moment. Soyez le premier !
          </p>
        </div>
      )}
    </div>
  )
}
