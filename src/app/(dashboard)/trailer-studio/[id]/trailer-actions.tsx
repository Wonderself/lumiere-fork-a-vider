'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Wand2, Play, Trash2, CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react'
import {
  decomposeTrailerAction,
  startTrailerGenerationAction,
  deleteTrailerProjectAction,
  updateTrailerChoiceAction,
} from '@/app/actions/trailer'

interface PendingChoice {
  id: string
  question: string
  category: string | null
  isOpenToVote: boolean
  options: Array<{ id: string; label: string; description?: string }>
}

interface TrailerActionsProps {
  projectId: string
  projectStatus: string
  hasTasks: boolean
  pendingChoices: PendingChoice[]
}

export function TrailerActions({
  projectId,
  projectStatus,
  hasTasks,
  pendingChoices,
}: TrailerActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [votingChoiceId, setVotingChoiceId] = useState<string | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleDecompose = () => {
    clearMessages()
    startTransition(async () => {
      const res = await decomposeTrailerAction(projectId)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(`Projet décomposé en ${res.tasksCount} micro-tâches`)
        router.refresh()
      }
    })
  }

  const handleStart = () => {
    clearMessages()
    startTransition(async () => {
      const res = await startTrailerGenerationAction(projectId)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess('Génération lancée !')
        router.refresh()
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Supprimer ce projet ? Cette action est irréversible.')) return
    clearMessages()
    startTransition(async () => {
      const res = await deleteTrailerProjectAction(projectId)
      if (res.error) {
        setError(res.error)
      } else {
        router.push('/trailer-studio')
      }
    })
  }

  const handleChoice = (choiceId: string, optionId: string) => {
    clearMessages()
    setVotingChoiceId(choiceId)
    startTransition(async () => {
      const res = await updateTrailerChoiceAction(choiceId, optionId)
      setVotingChoiceId(null)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess('Choix enregistré')
        router.refresh()
      }
    })
  }

  const showDecompose = !hasTasks && (projectStatus === 'DRAFT' || projectStatus === 'AWAITING_INPUT')
  const showStart = hasTasks && (projectStatus === 'AWAITING_INPUT')
  const showDelete = projectStatus === 'DRAFT' || projectStatus === 'CANCELLED'

  return (
    <div className="space-y-4">
      {/* Error / Success Messages */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 flex items-center gap-2 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Action Buttons */}
      {(showDecompose || showStart || showDelete) && (
        <div className="flex flex-wrap gap-3">
          {showDecompose && (
            <Button
              onClick={handleDecompose}
              disabled={isPending}
              className="bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Décomposer en micro-tâches
            </Button>
          )}
          {showStart && (
            <Button
              onClick={handleStart}
              disabled={isPending}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Lancer la génération
            </Button>
          )}
          {showDelete && (
            <Button
              onClick={handleDelete}
              disabled={isPending}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer
            </Button>
          )}
        </div>
      )}

      {/* Pending Choices */}
      {pendingChoices.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Choix en attente</h3>
          {pendingChoices.map((choice) => (
            <div
              key={choice.id}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5"
            >
              <p className="text-sm font-medium text-white mb-3">{choice.question}</p>
              {choice.category && (
                <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2">
                  {choice.category}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {choice.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(choice.id, option.id)}
                    disabled={isPending || votingChoiceId === choice.id}
                    className="text-left rounded-xl border border-white/10 bg-white/5 p-3 hover:border-[#E50914] hover:bg-[#E50914]/5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <p className="text-xs font-medium text-white">{option.label}</p>
                    {option.description && (
                      <p className="text-[10px] text-white/50 mt-0.5">{option.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
