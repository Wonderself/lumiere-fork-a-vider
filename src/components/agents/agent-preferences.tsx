'use client'

import { useState } from 'react'
import { updatePreferencesAction } from '@/app/actions/agents'
import { toast } from 'sonner'
import { Save, Settings, RotateCcw } from 'lucide-react'

interface PreferencesSlider {
  key: string
  label: string
  labelLeft: string
  labelRight: string
  icon: string
  defaultValue: number
}

const SLIDERS: PreferencesSlider[] = [
  { key: 'formality', label: 'Formalité', labelLeft: 'Casual', labelRight: 'Formel', icon: '🎭', defaultValue: 50 },
  { key: 'length', label: 'Longueur', labelLeft: 'Concis', labelRight: 'Détaillé', icon: '📏', defaultValue: 50 },
  { key: 'creativity', label: 'Créativité', labelLeft: 'Conservateur', labelRight: 'Audacieux', icon: '🎨', defaultValue: 60 },
  { key: 'proactivity', label: 'Proactivité', labelLeft: 'Réactif', labelRight: 'Proactif', icon: '🚀', defaultValue: 50 },
  { key: 'expertise', label: 'Expertise', labelLeft: 'Débutant', labelRight: 'Expert', icon: '🎓', defaultValue: 50 },
  { key: 'humor', label: 'Humour', labelLeft: 'Sérieux', labelRight: 'Humoristique', icon: '😄', defaultValue: 20 },
]

interface AgentPreferencesProps {
  initialValues?: Record<string, number>
}

export function AgentPreferences({ initialValues }: AgentPreferencesProps) {
  const [values, setValues] = useState<Record<string, number>>(
    initialValues || Object.fromEntries(SLIDERS.map(s => [s.key, s.defaultValue]))
  )
  const [saving, setSaving] = useState(false)

  function handleChange(key: string, value: number) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setValues(Object.fromEntries(SLIDERS.map(s => [s.key, s.defaultValue])))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const result = await updatePreferencesAction(values)
      if (result && 'error' in result) {
        toast.error((result as any).error)
      } else {
        toast.success('Préférences sauvegardées')
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    }
    setSaving(false)
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-400" />
          Personnalisation
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </button>
      </div>

      <div className="space-y-6">
        {SLIDERS.map(slider => (
          <div key={slider.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <span>{slider.icon}</span>
                {slider.label}
              </label>
              <span className="text-xs text-white/50 tabular-nums">{values[slider.key]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/60 w-20 text-right shrink-0">{slider.labelLeft}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={values[slider.key]}
                onChange={(e) => handleChange(slider.key, parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-gray-700 accent-[#E50914] cursor-pointer"
              />
              <span className="text-[10px] text-white/60 w-20 shrink-0">{slider.labelRight}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 w-full justify-center"
      >
        <Save className="h-4 w-4" />
        {saving ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
      </button>
    </div>
  )
}
