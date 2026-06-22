'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { voteFilmByIpAction, type FilmVoteState } from '@/app/actions/film-vote'
import { cn } from '@/lib/utils'

interface FilmVoteButtonProps {
  filmId: string
  initialUp?: number
  initialDown?: number
  initialUserVote?: 'up' | 'down' | null
  className?: string
}

export function FilmVoteButton({
  filmId,
  initialUp = 0,
  initialDown = 0,
  initialUserVote = null,
  className,
}: FilmVoteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [up, setUp] = useState(initialUp)
  const [down, setDown] = useState(initialDown)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote)

  const total = up + down
  const forPct = total > 0 ? Math.round((up / total) * 100) : 50

  function handleVote(voteType: 'up' | 'down') {
    if (isPending) return
    startTransition(async () => {
      const res: FilmVoteState = await voteFilmByIpAction(filmId, voteType)
      if (res.error) {
        toast.error(res.error)
        return
      }
      setUp(res.up)
      setDown(res.down)
      setUserVote(res.userVote)
      if (res.userVote === null) toast.success('Vote retiré')
      else if (res.userVote === 'up') toast.success('Vote pour — merci !')
      else toast.success('Vote contre enregistré')
    })
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-center gap-2.5">
        <button
          onClick={() => handleVote('up')}
          disabled={isPending}
          aria-pressed={userVote === 'up'}
          title="Voter pour"
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed',
            userVote === 'up'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-white/[0.04] border-white/10 text-white/55 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/25',
          )}
        >
          <ThumbsUp className={cn('h-4 w-4', isPending && 'animate-pulse')} />
          <span className="tabular-nums">{up}</span>
        </button>

        <button
          onClick={() => handleVote('down')}
          disabled={isPending}
          aria-pressed={userVote === 'down'}
          title="Voter contre"
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed',
            userVote === 'down'
              ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
              : 'bg-white/[0.04] border-white/10 text-white/55 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/25',
          )}
        >
          <ThumbsDown className={cn('h-4 w-4', isPending && 'animate-pulse')} />
          <span className="tabular-nums">{down}</span>
        </button>
      </div>

      {/* Logical results bar */}
      <div className="space-y-1.5">
        <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.06]">
          <div
            className="h-full bg-emerald-500/70 transition-all duration-500"
            style={{ width: `${forPct}%` }}
          />
          <div
            className="h-full bg-red-500/50 transition-all duration-500"
            style={{ width: `${100 - forPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/35 tabular-nums">
          <span className="text-emerald-400/70">{forPct}% pour</span>
          <span>{total} vote{total > 1 ? 's' : ''}</span>
          <span className="text-red-400/60">{100 - forPct}% contre</span>
        </div>
      </div>
    </div>
  )
}
