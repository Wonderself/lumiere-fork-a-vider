'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThumbsUp, ThumbsDown, CheckCircle, Coins } from 'lucide-react'

interface VotePanelProps {
  filmTitle: string
  filmSlug: string
  initialVotesFor?: number
  initialVotesAgainst?: number
  compact?: boolean
}

interface StoredVote {
  vote: 'approve' | 'reject'
  staked: number
  timestamp: number
}

const STAKE_OPTIONS = [1, 5, 10, 25, 50]

function getStoredVote(slug: string): StoredVote | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`cinegeny-votes-${slug}`)
    return raw ? (JSON.parse(raw) as StoredVote) : null
  } catch {
    return null
  }
}

function storeVote(slug: string, vote: StoredVote) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`cinegeny-votes-${slug}`, JSON.stringify(vote))
}

function deductPoints(amount: number) {
  if (typeof window === 'undefined') return
  const current = Number(localStorage.getItem('cinegeny-user-points') ?? '500')
  localStorage.setItem('cinegeny-user-points', String(Math.max(0, current - amount)))
}

function getUserPoints(): number {
  if (typeof window === 'undefined') return 500
  return Number(localStorage.getItem('cinegeny-user-points') ?? '500')
}

export function VotePanel({
  filmTitle,
  filmSlug,
  initialVotesFor = 187,
  initialVotesAgainst = 47,
  compact = false,
}: VotePanelProps) {
  const [votesFor, setVotesFor] = useState(initialVotesFor)
  const [votesAgainst, setVotesAgainst] = useState(initialVotesAgainst)
  const [selectedStake, setSelectedStake] = useState(10)
  const [existingVote, setExistingVote] = useState<StoredVote | null>(null)
  const [justVoted, setJustVoted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = getStoredVote(filmSlug)
    if (stored) {
      setExistingVote(stored)
    }
  }, [filmSlug])

  const handleVote = useCallback(
    (direction: 'approve' | 'reject') => {
      if (existingVote) return
      const points = getUserPoints()
      if (points < selectedStake) return

      const vote: StoredVote = {
        vote: direction,
        staked: selectedStake,
        timestamp: Date.now(),
      }

      storeVote(filmSlug, vote)
      deductPoints(selectedStake)
      setExistingVote(vote)
      setJustVoted(true)

      if (direction === 'approve') {
        setVotesFor((v) => v + 1)
      } else {
        setVotesAgainst((v) => v + 1)
      }
    },
    [existingVote, selectedStake, filmSlug],
  )

  const totalVotes = votesFor + votesAgainst
  const totalStaked = totalVotes * 8 // simulated average
  const forPct = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 50

  if (!mounted) return null

  /* ------------------------------------------------------------------ */
  /* COMPACT MODE                                                       */
  /* ------------------------------------------------------------------ */
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleVote('approve')
          }}
          disabled={!!existingVote}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
            existingVote?.vote === 'approve'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : existingVote
                ? 'bg-white/[0.04] text-white/30 border border-white/[0.06] cursor-not-allowed'
                : 'bg-white/[0.06] text-white/60 border border-white/[0.08] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
          }`}
        >
          <ThumbsUp className="h-3 w-3" />
          <span>{votesFor}</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleVote('reject')
          }}
          disabled={!!existingVote}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
            existingVote?.vote === 'reject'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : existingVote
                ? 'bg-white/[0.04] text-white/30 border border-white/[0.06] cursor-not-allowed'
                : 'bg-white/[0.06] text-white/60 border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
          }`}
        >
          <ThumbsDown className="h-3 w-3" />
          <span>{votesAgainst}</span>
        </button>

        {existingVote && (
          <span className="text-[10px] text-amber-400/60">{existingVote.staked} pts</span>
        )}
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /* FULL MODE                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Voter pour ce film</h3>
        <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
          <Coins className="h-3.5 w-3.5" />
          <span>{getUserPoints()} pts</span>
        </div>
      </div>

      <p className="text-sm text-white/50 mb-6">
        Pensez-vous que <span className="text-white/80 font-medium">{filmTitle}</span> devrait
        etre produit par CINEGENY ?
      </p>

      {/* Vote buttons */}
      {!existingVote ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleVote('approve')}
              className="flex flex-col items-center gap-2 py-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 hover:bg-emerald-500/[0.12] hover:border-emerald-500/40 transition-all duration-300"
            >
              <ThumbsUp className="h-6 w-6" />
              <span className="text-sm font-semibold">Approuver</span>
            </button>

            <button
              onClick={() => handleVote('reject')}
              className="flex flex-col items-center gap-2 py-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] text-red-400 hover:bg-red-500/[0.12] hover:border-red-500/40 transition-all duration-300"
            >
              <ThumbsDown className="h-6 w-6" />
              <span className="text-sm font-semibold">Rejeter</span>
            </button>
          </div>

          {/* Stake selector */}
          <div className="mb-6">
            <p className="text-xs text-white/40 mb-3">Points a miser :</p>
            <div className="flex flex-wrap gap-2">
              {STAKE_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedStake(amount)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                    selectedStake === amount
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
                  }`}
                >
                  {amount} pts
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Confirmation */
        <div
          className={`flex flex-col items-center gap-3 py-6 mb-6 rounded-xl border ${
            existingVote.vote === 'approve'
              ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
              : 'border-red-500/20 bg-red-500/[0.06]'
          } ${justVoted ? 'animate-pulse' : ''}`}
        >
          <CheckCircle
            className={`h-8 w-8 ${
              existingVote.vote === 'approve' ? 'text-emerald-400' : 'text-red-400'
            }`}
          />
          <p className="text-sm font-medium text-white/80">
            Vous avez {existingVote.vote === 'approve' ? 'approuve' : 'rejete'} ce film
          </p>
          <p className="text-xs text-amber-400/70">
            {existingVote.staked} points mises
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-emerald-400">
            {Math.round(forPct)}% Approuve
          </span>
          <span className="text-red-400">
            {Math.round(100 - forPct)}% Rejete
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden bg-white/[0.06] flex">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${forPct}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
            style={{ width: `${100 - forPct}%` }}
          />
        </div>
        <p className="text-xs text-white/40 text-center">
          {totalVotes.toLocaleString('fr-FR')} votes &middot;{' '}
          {totalStaked.toLocaleString('fr-FR')} points mises
        </p>
      </div>

      {/* Info */}
      {!existingVote && (
        <p className="text-[11px] text-white/30 text-center mt-5 leading-relaxed">
          Vos points seront retournes + bonus si votre vote correspond au resultat final.
        </p>
      )}
    </div>
  )
}
