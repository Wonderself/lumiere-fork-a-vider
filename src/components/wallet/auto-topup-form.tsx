'use client'

import { useState } from 'react'
import { updateAutoTopupAction } from '@/app/actions/wallet'
import { microToCredits, creditsToMicro } from '@/lib/ai-pricing'
import { toast } from 'sonner'
import { Bell, BellOff, Save } from 'lucide-react'

interface AutoTopupFormProps {
  enabled: boolean
  threshold: number
  amount: number
}

export function AutoTopupForm({ enabled, threshold, amount }: AutoTopupFormProps) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [thresholdCredits, setThresholdCredits] = useState(microToCredits(threshold))
  const [amountCredits, setAmountCredits] = useState(microToCredits(amount))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const result = await updateAutoTopupAction({
        autoTopupEnabled: isEnabled,
        autoTopupThreshold: creditsToMicro(thresholdCredits),
        autoTopupAmount: creditsToMicro(amountCredits),
      })
      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Paramètres de rechargement mis à jour')
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    }
    setSaving(false)
  }

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Bell className="h-5 w-5 text-blue-400" />
          ) : (
            <BellOff className="h-5 w-5 text-white/50" />
          )}
          <div>
            <p className="text-sm font-medium text-white">Alertes de solde bas</p>
            <p className="text-xs text-white/50">
              Recevez une alerte quand votre solde est trop bas
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-[#E50914]' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white/5 transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Seuil d&apos;alerte (en crédits)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={thresholdCredits}
              onChange={(e) => setThresholdCredits(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none"
              placeholder="Ex: 10"
            />
            <p className="text-[10px] text-white/60 mt-1">
              Vous serez alerté quand votre solde passe en dessous de ce montant
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Montant de rechargement souhaité (en crédits)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={amountCredits}
              onChange={(e) => setAmountCredits(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none"
              placeholder="Ex: 100"
            />
            <p className="text-[10px] text-white/60 mt-1">
              L&apos;admin sera notifié du montant à recharger
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      )}
    </div>
  )
}
