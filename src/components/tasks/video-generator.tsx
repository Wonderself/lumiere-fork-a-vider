'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { getVideoGenerationConfigs } from '@/lib/task-ai.service'
import { getModelById } from '@/lib/ai-providers'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Video, Play, Loader2, Clock, Zap, Check,
  Image, FileText, Settings, AlertTriangle,
} from 'lucide-react'

interface VideoGeneratorProps {
  filmProjectId?: string
  onGenerated?: (result: { provider: string; url: string }) => void
}

export function VideoGenerator({ filmProjectId, onGenerated }: VideoGeneratorProps) {
  const configs = getVideoGenerationConfigs()
  const [selectedProvider, setSelectedProvider] = useState(configs[0].modelId)
  const [prompt, setPrompt] = useState('')
  const [inputType, setInputType] = useState<'text' | 'image'>('text')
  const [imageUrl, setImageUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  const activeConfig = configs.find(c => c.modelId === selectedProvider) || configs[0]
  const model = getModelById(selectedProvider)

  async function generate() {
    if (!prompt.trim()) { toast.error('Décrivez la scène vidéo'); return }
    setGenerating(true)
    setProgress(0)
    setResult(null)

    // Simulate async polling (in production: submit job → poll status → get result)
    const steps = ['Envoi au provider...', 'Génération en cours...', 'Rendu final...', 'Téléchargement...']
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, activeConfig.estimatedTime * 10))
      setProgress(i)
    }

    setResult('#video-placeholder-url')
    setGenerating(false)
    toast.success(`Vidéo générée via ${model?.name || selectedProvider}`)
    onGenerated?.({ provider: selectedProvider, url: '#video-placeholder-url' })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Video className="h-5 w-5 text-[#E50914]" />
        <h3 className="text-sm font-semibold text-[#1A1A2E]">Génération Vidéo IA</h3>
      </div>

      {/* Provider Selection */}
      <div>
        <label className="text-xs text-white/50 mb-2 block">Provider vidéo ({configs.length} disponibles)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {configs.map(config => {
            const m = getModelById(config.modelId)
            const isSelected = selectedProvider === config.modelId
            return (
              <button
                key={config.modelId}
                onClick={() => setSelectedProvider(config.modelId)}
                className={`text-left rounded-xl border p-3 transition-colors ${isSelected ? 'border-[#E50914] bg-red-50' : 'border-white/10 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{m?.icon || '🎬'}</span>
                  <span className="text-xs font-medium text-[#1A1A2E] truncate">{m?.name || config.provider}</span>
                  {isSelected && <Check className="h-3 w-3 text-[#E50914] ml-auto shrink-0" />}
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>≤{config.maxDuration}s</span>
                  <span className="font-medium text-[#E50914]">~{microToCredits(config.estimatedCost).toFixed(0)} cr</span>
                </div>
                <span className="text-[10px] text-orange-500 flex items-center gap-0.5 mt-0.5">
                  <AlertTriangle className="h-2.5 w-2.5" /> Bientôt
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Input Type */}
      <div className="flex gap-2">
        <button onClick={() => setInputType('text')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${inputType === 'text' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
          <FileText className="h-3.5 w-3.5" /> Texte → Vidéo
        </button>
        <button onClick={() => setInputType('image')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${inputType === 'image' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
          <Image className="h-3.5 w-3.5" /> Image → Vidéo
        </button>
      </div>

      {/* Prompt */}
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez la scène vidéo en détail (mouvement caméra, action, ambiance)..." rows={3} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none" />

      {inputType === 'image' && (
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL de l'image source..." className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
      )}

      {/* Info */}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>Max {activeConfig.maxDuration}s · {activeConfig.maxResolution}</span>
        <span>~{activeConfig.estimatedTime}s de génération</span>
        <span className="font-medium text-[#E50914]">~{microToCredits(activeConfig.estimatedCost).toFixed(1)} crédits</span>
      </div>

      {/* Generate */}
      <button onClick={generate} disabled={generating || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Génération... {progress}%
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            Générer la vidéo ({model?.name || 'IA'})
          </>
        )}
      </button>

      {/* Progress Bar */}
      {generating && (
        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div className="h-full bg-[#E50914] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <Video className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-green-700 font-medium">Vidéo générée !</p>
          <p className="text-[10px] text-green-500">Provider: {model?.name} · {activeConfig.maxResolution}</p>
        </div>
      )}

      {/* 0% Commission */}
      <p className="text-[10px] text-emerald-500 text-center">
        0% commission — vous ne payez que les tokens IA consommés
      </p>
    </div>
  )
}
