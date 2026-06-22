'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { voteFilmAction } from '@/app/actions/films'
import { cn } from '@/lib/utils'

interface FilmVoteButtonProps {
  filmId: string
  initialUpVotes?: number
  initialDownVotes?: number
  className?: string
}

export function FilmVoteButton({ filmId, initialUpVotes = 0, initialDownVotes = 0, className }: FilmVoteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [upVotes, setUpVotes] = useState(initialUpVotes)
  const [downVotes, setDownVotes] = useState(initialDownVotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

  function handleVote(voteType: 'up' | 'down') {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('filmId', filmId)
      formData.set('voteType', voteType)

      const result = await voteFilmAction(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      // Optimistic UI update
      if (voteType === 'up') {
        if (userVote === 'up') {
          // Toggle off
          setUpVotes(v => v - 1)
          setUserVote(null)
          toast.success('Vote retiré')
        } else {
          setUpVotes(v => v + 1)
          if (userVote === 'down') setDownVotes(v => v - 1)
          setUserVote('up')
          toast.success('Vote positif enregistré !')
        }
      } else {
        if (userVote === 'down') {
          // Toggle off
          setDownVotes(v => v - 1)
          setUserVote(null)
          toast.success('Vote retiré')
        } else {
          setDownVotes(v => v + 1)
          if (userVote === 'up') setUpVotes(v => v - 1)
          setUserVote('down')
          toast.success('Vote négatif enregistré')
        }
      }
    })
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => handleVote('up')}
        disabled={isPending}
        title="Voter positivement"
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed',
          userVote === 'up'
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            : 'bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/80 hover:border-white/20'
        )}
      >
        <ThumbsUp className={cn('h-4 w-4', isPending && 'animate-pulse')} />
        <span>{upVotes}</span>
      </button>

      <button
        onClick={() => handleVote('down')}
        disabled={isPending}
        title="Voter négativement"
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed',
          userVote === 'down'
            ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
            : 'bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/80 hover:border-white/20'
        )}
      >
        <ThumbsDown className={cn('h-4 w-4', isPending && 'animate-pulse')} />
        <span>{downVotes}</span>
      </button>
    </div>
  )
}
