'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { autoSelectFeaturedCreatorAction, setFeaturedCreatorAction } from '@/app/actions/featured-creator'
import { Star, Loader2, RefreshCw, UserCheck } from 'lucide-react'

interface FeaturedCreator {
  id: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  role: string
  level: string
  points: number
  tasksCompleted: number
  headline: string | null
  achievement: string | null
}

interface Props {
  initialCreator: FeaturedCreator | null
}

export function FeaturedCreatorPanel({ initialCreator }: Props) {
  const [creator, setCreator] = useState<FeaturedCreator | null>(initialCreator)
  const [isPending, startTransition] = useTransition()

  // Manual set form state
  const [manualUserId, setManualUserId] = useState('')
  const [manualHeadline, setManualHeadline] = useState('')
  const [manualAchievement, setManualAchievement] = useState('')
  const [showManualForm, setShowManualForm] = useState(false)

  function handleAutoSelect() {
    startTransition(async () => {
      const result = await autoSelectFeaturedCreatorAction()
      if (result.success && result.creator) {
        setCreator(result.creator as FeaturedCreator)
        toast.success(`Créateur en vedette : ${result.creator.displayName}`)
      } else {
        toast.error(result.error || 'Échec de la sélection automatique')
      }
    })
  }

  function handleManualSet(e: React.FormEvent) {
    e.preventDefault()
    if (!manualUserId.trim()) return toast.error('ID utilisateur requis')
    startTransition(async () => {
      const result = await setFeaturedCreatorAction(manualUserId.trim(), manualHeadline, manualAchievement)
      if (result.success) {
        toast.success('Créateur en vedette mis à jour')
        setShowManualForm(false)
        setManualUserId('')
        setManualHeadline('')
        setManualAchievement('')
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Current featured creator */}
      {creator ? (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          {creator.avatarUrl ? (
            <img src={creator.avatarUrl} alt={creator.displayName || ''} className="h-12 w-12 rounded-full object-cover border border-yellow-500/30 shrink-0" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{creator.displayName || 'Anonyme'}</p>
            <p className="text-xs text-yellow-400">{creator.headline}</p>
            {creator.achievement && <p className="text-[10px] text-white/50 mt-0.5">{creator.achievement}</p>}
            <div className="flex items-center gap-3 mt-1 text-[10px] text-white/40">
              <span>Level: {creator.level}</span>
              <span>·</span>
              <span>{creator.points} pts</span>
              <span>·</span>
              <span>{creator.tasksCompleted} tâches</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-white/40 py-2">Aucun créateur en vedette cette semaine.</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleAutoSelect}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg border border-yellow-500/20 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Sélection automatique
        </button>
        <button
          type="button"
          onClick={() => setShowManualForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 text-xs font-medium rounded-lg border border-white/10 transition-colors"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Définir manuellement
        </button>
      </div>

      {/* Manual set form */}
      {showManualForm && (
        <form onSubmit={handleManualSet} className="space-y-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div>
            <label className="text-[10px] text-white/50 mb-1 block">ID Utilisateur</label>
            <input
              value={manualUserId}
              onChange={e => setManualUserId(e.target.value)}
              placeholder="cuid de l'utilisateur..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-yellow-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-white/50 mb-1 block">Titre / Accroche</label>
            <input
              value={manualHeadline}
              onChange={e => setManualHeadline(e.target.value)}
              placeholder="Créateur de la semaine..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-yellow-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-white/50 mb-1 block">Accomplissement</label>
            <input
              value={manualAchievement}
              onChange={e => setManualAchievement(e.target.value)}
              placeholder="A validé 12 tâches cette semaine..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-yellow-500/50 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Confirmer
            </button>
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="px-3 py-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
