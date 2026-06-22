'use client'

import { useTransition, useState } from 'react'
import { voteTrailerAction } from '@/app/actions/community'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoteButtonProps {
  entryId: string
  currentVotes: number
  hasVoted: boolean
}

export function VoteButton({ entryId, currentVotes, hasVoted: initialHasVoted }: VoteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [votes, setVotes] = useState(currentVotes)
  const [error, setError] = useState<string | null>(null)

  function handleVote() {
    if (hasVoted || isPending) return
    setError(null)

    const formData = new FormData()
    formData.append('entryId', entryId)

    startTransition(async () => {
      const result = await voteTrailerAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setHasVoted(true)
        setVotes((v) => v + 1)
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleVote}
        disabled={hasVoted || isPending}
        className={cn(
          'group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
          hasVoted
            ? 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30 cursor-default'
            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-[#E50914]/40 hover:text-[#E50914] hover:bg-[#E50914]/5 cursor-pointer',
          isPending && 'opacity-60 pointer-events-none'
        )}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-all duration-300',
            hasVoted && 'fill-[#E50914] text-[#E50914] scale-110',
            !hasVoted && 'group-hover:scale-110'
          )}
        />
        <span className={cn(
          'tabular-nums font-bold transition-all duration-300',
          hasVoted && 'text-[#E50914]'
        )}>
          {votes}
        </span>
        {isPending && (
          <svg className="animate-spin h-3.5 w-3.5 text-[#E50914]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1 text-center max-w-[200px]">{error}</p>
      )}
    </div>
  )
}
