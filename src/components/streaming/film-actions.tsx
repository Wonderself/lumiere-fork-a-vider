'use client'

import { useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface FilmActionsProps {
  filmTitle: string
  filmSlug: string
}

export function FilmActions({ filmTitle, filmSlug }: FilmActionsProps) {
  const [liked, setLiked] = useState(false)

  function handleLike() {
    setLiked((prev) => {
      const next = !prev
      toast.success(next ? `Vous aimez "${filmTitle}"` : `"${filmTitle}" retiré des favoris`)
      return next
    })
  }

  async function handleShare() {
    const url = `${window.location.origin}/streaming/${filmSlug}`
    if (navigator.share) {
      try {
        await navigator.share({ title: filmTitle, url })
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Lien copié dans le presse-papiers !')
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-colors ${
          liked
            ? 'bg-[#E50914]/20 text-[#E50914] hover:bg-[#E50914]/30'
            : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-[#E50914]' : ''}`} />
        J&apos;aime
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
      >
        <Share2 className="h-4 w-4" /> Partager
      </button>
    </div>
  )
}
