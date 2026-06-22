'use client'

import { useTransition, useState } from 'react'
import { voteScenarioAction } from '@/app/actions/community'
import { Heart, Lock, CheckCircle, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScenarioVoteButtonProps {
  proposalId: string
  currentVotes: number
  hasVoted: boolean
  isPremium: boolean
}

export function ScenarioVoteButton({
  proposalId,
  currentVotes,
  hasVoted: initialHasVoted,
  isPremium,
}: ScenarioVoteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [votes, setVotes] = useState(currentVotes)
  const [error, setError] = useState<string | null>(null)

  function handleVote() {
    if (hasVoted || isPending || !isPremium) return
    setError(null)

    const formData = new FormData()
    formData.append('proposalId', proposalId)

    startTransition(async () => {
      const result = await voteScenarioAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setHasVoted(true)
        setVotes((v) => v + 1)
      }
    })
  }

  // Not premium: locked state
  if (!isPremium) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative group">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-300 border border-gray-200 cursor-not-allowed"
          >
            <Lock className="h-3.5 w-3.5" />
            <span className="tabular-nums font-bold">{votes}</span>
          </button>
          {/* Premium tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-white border border-[#E50914]/20 shadow-lg text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            <div className="flex items-center gap-1.5">
              <Crown className="h-3 w-3 text-[#E50914]" />
              <span>Vote Premium (Starter+)</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#E50914]/20" />
          </div>
        </div>
        <a
          href="/dashboard/subscription"
          className="text-[10px] text-[#E50914]/60 hover:text-[#E50914] transition-colors"
        >
          Passer Premium
        </a>
      </div>
    )
  }

  // Already voted: gold checkmark
  if (hasVoted) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30">
          <CheckCircle className="h-4 w-4 fill-[#E50914]/30" />
          <span className="tabular-nums font-bold">{votes}</span>
        </div>
        <span className="text-[10px] text-[#E50914]/50">Vote enregistre</span>
      </div>
    )
  }

  // Premium + not voted: can vote
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleVote}
        disabled={isPending}
        className={cn(
          'group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer',
          'bg-gray-50 text-gray-500 border border-gray-200',
          'hover:border-[#E50914]/40 hover:text-[#E50914] hover:bg-[#E50914]/5',
          'hover:shadow-sm',
          isPending && 'opacity-60 pointer-events-none'
        )}
      >
        <Heart className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        <span className="tabular-nums font-bold">{votes}</span>
        {isPending && (
          <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
