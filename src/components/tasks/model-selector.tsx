'use client'

import { useState } from 'react'
import { ALL_AI_MODELS, getModelsByCategory, getTaskModelMapping, estimateModelCost } from '@/lib/ai-providers'
import type { AIModel, ProviderCategory } from '@/lib/ai-providers'
import { microToCredits } from '@/lib/ai-pricing'
import { Lock, Check, AlertTriangle, Info } from 'lucide-react'

interface ModelSelectorProps {
  taskType: string
  category: ProviderCategory
  onSelect: (modelId: string) => void
  selectedModel?: string
}

export function ModelSelector({ taskType, category, onSelect, selectedModel }: ModelSelectorProps) {
  const mapping = getTaskModelMapping(taskType)
  const isUserChoice = mapping?.userChoice ?? true
  const defaultModel = mapping?.defaultModel || ''
  const allowedIds = mapping?.allowedModels || []

  const models = isUserChoice
    ? getModelsByCategory(category).filter(m => allowedIds.length === 0 || allowedIds.includes(m.id))
    : getModelsByCategory(category).filter(m => m.id === defaultModel)

  const [selected, setSelected] = useState(selectedModel || defaultModel)

  function handleSelect(modelId: string) {
    if (!isUserChoice) return
    setSelected(modelId)
    onSelect(modelId)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/50 font-medium">
          {isUserChoice ? 'Choisissez votre modèle IA' : 'Modèle IA imposé (cohérence film)'}
        </label>
        {!isUserChoice && (
          <span className="flex items-center gap-1 text-[10px] text-orange-500">
            <Lock className="h-3 w-3" />
            Imposé pour la cohérence
          </span>
        )}
      </div>

      {/* Reason */}
      {mapping?.reason && (
        <div className="flex items-start gap-2 text-[10px] text-gray-400 bg-white/[0.03] rounded-lg px-3 py-2">
          <Info className="h-3 w-3 mt-0.5 shrink-0" />
          {mapping.reason}
        </div>
      )}

      {/* Model Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {models.map(model => {
          const isSelected = selected === model.id
          const cost = estimateModelCost(model.id, { tokens: 2000, seconds: 5 })
          const isAvailable = model.status === 'available'

          return (
            <button
              key={model.id}
              onClick={() => handleSelect(model.id)}
              disabled={!isUserChoice && !isSelected}
              className={`text-left rounded-xl border p-4 transition-colors ${
                isSelected
                  ? 'border-[#E50914] bg-red-50'
                  : 'border-white/10 hover:border-gray-300'
              } ${!isUserChoice && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{model.icon}</span>
                <span className="text-sm font-medium text-[#1A1A2E]">{model.name}</span>
                {isSelected && <Check className="h-4 w-4 text-[#E50914] ml-auto" />}
              </div>
              <p className="text-[10px] text-gray-400 mb-2">{model.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">{model.provider}</span>
                <span className="text-xs font-semibold text-[#E50914]">
                  ~{microToCredits(cost).toFixed(2)} cr
                </span>
              </div>
              {!isAvailable && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-orange-500">
                  <AlertTriangle className="h-3 w-3" /> Bientôt disponible
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 0% Commission */}
      <p className="text-[10px] text-emerald-500 text-center">
        0% commission — vous ne payez que les tokens IA consommés
      </p>
    </div>
  )
}
