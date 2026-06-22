'use client'

import { useState, useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { addToWatchlistAction, removeFromWatchlistAction } from '@/app/actions/watchlist'

interface WatchlistButtonProps {
  filmId: string
  initialInWatchlist?: boolean
  /** Optional extra classes for the button element */
  className?: string
}

export function WatchlistButton({
  filmId,
  initialInWatchlist = false,
  className = '',
}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      if (inWatchlist) {
        const result = await removeFromWatchlistAction(filmId)
        if ('error' in result && result.error) {
          toast.error(result.error)
        } else {
          setInWatchlist(false)
          toast.success('Retiré de votre liste')
        }
      } else {
        const result = await addToWatchlistAction(filmId)
        if ('error' in result && result.error) {
          toast.error(result.error)
        } else {
          setInWatchlist(true)
          toast.success('Ajouté à votre liste')
        }
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={inWatchlist ? 'Retirer de la liste' : 'Ajouter à la liste'}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        inWatchlist
          ? 'bg-white/10 text-white hover:bg-white/15'
          : 'bg-white/5 text-white/60 hover:bg-white/10'
      } ${className}`}
    >
      <Bookmark
        className={`h-4 w-4 transition-colors ${inWatchlist ? 'fill-white text-white' : ''}`}
      />
      {inWatchlist ? 'Ma liste' : '+ Ma liste'}
    </button>
  )
}
