'use client'

import { useTransition, useState } from 'react'
import {
  updateContestStatusAction,
  shortlistScenariosAction,
  pickScenarioWinnerAction,
  createContestAction,
} from '@/app/actions/community'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Play, Vote, XCircle, CheckCircle, Crown,
  Plus, ArrowRight, Sparkles, Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// Contest Status Button
// ============================================

const STATUS_TRANSITIONS: Record<string, { label: string; next: string; icon: React.ReactNode; variant: 'default' | 'outline' | 'secondary' }[]> = {
  UPCOMING: [
    { label: 'Ouvrir', next: 'OPEN', icon: <Play className="h-3.5 w-3.5" />, variant: 'default' },
  ],
  OPEN: [
    { label: 'Lancer le vote', next: 'VOTING', icon: <Vote className="h-3.5 w-3.5" />, variant: 'default' },
  ],
  VOTING: [
    { label: 'Cloturer', next: 'CLOSED', icon: <CheckCircle className="h-3.5 w-3.5" />, variant: 'outline' },
  ],
}

export function ContestStatusActions({ contestId, currentStatus }: { contestId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const transitions = STATUS_TRANSITIONS[currentStatus] || []

  if (transitions.length === 0) return null

  function handleAction(newStatus: string) {
    setError(null)
    const formData = new FormData()
    formData.append('contestId', contestId)
    formData.append('newStatus', newStatus)

    startTransition(async () => {
      const result = await updateContestStatusAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex items-center gap-2">
      {transitions.map((t) => (
        <Button
          key={t.next}
          size="sm"
          variant={t.variant}
          disabled={isPending}
          loading={isPending}
          onClick={() => handleAction(t.next)}
          className="gap-1.5"
        >
          {t.icon}
          {t.label}
        </Button>
      ))}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

// ============================================
// Shortlist Scenarios Button
// ============================================

export function ShortlistButton({ proposalIds }: { proposalIds: string[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleShortlist() {
    setError(null)
    const formData = new FormData()
    formData.append('proposalIds', proposalIds.join(','))

    startTransition(async () => {
      const result = await shortlistScenariosAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending || proposalIds.length === 0}
        loading={isPending}
        onClick={handleShortlist}
        className="gap-1.5"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Mettre en vote ({proposalIds.length})
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

// ============================================
// Pick Winner Button
// ============================================

export function PickWinnerButton({ proposalId }: { proposalId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handlePick() {
    setError(null)
    const formData = new FormData()
    formData.append('proposalId', proposalId)

    startTransition(async () => {
      const result = await pickScenarioWinnerAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="default"
        disabled={isPending}
        loading={isPending}
        onClick={handlePick}
        className="gap-1.5"
      >
        <Crown className="h-3.5 w-3.5" />
        Gagnant
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

// ============================================
// Create Contest Form
// ============================================

export function CreateContestForm({ films }: { films: { id: string; title: string }[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await createContestAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setIsOpen(false)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <div>
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Concours cree avec succes !
        </div>
      )}

      {!isOpen ? (
        <Button size="sm" onClick={() => setIsOpen(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Nouveau concours
        </Button>
      ) : (
        <div className="p-5 rounded-xl border border-gray-200 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#E50914]" />
            Creer un concours
          </h3>

          {error && (
            <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-3">
            <Input name="title" required placeholder="Titre du concours" className="text-sm" />
            <Textarea name="description" rows={2} placeholder="Description (optionnel)" className="text-sm" />
            <select
              name="filmId"
              className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
            >
              <option value="">Film associe (optionnel)</option>
              {films.map((f) => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Date debut</label>
                <Input name="startDate" type="date" className="text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Date fin</label>
                <Input name="endDate" type="date" className="text-sm" />
              </div>
            </div>
            <Input name="prizeDescription" placeholder="Description du prix (optionnel)" className="text-sm" />
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" size="sm" disabled={isPending} loading={isPending} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Creer
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
