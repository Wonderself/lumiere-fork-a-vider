'use client'

import { useState } from 'react'
import { SlideOver } from '@/components/ui/slide-over'
import { ALL_AGENTS, TIER_CONFIG } from '@/data/agents'
import type { AgentDef } from '@/data/agents'
import { toast } from 'sonner'
import { Bot, Save, Settings, Zap, Brain, GitBranch } from 'lucide-react'

interface AgentConfigSlideOverProps {
  open: boolean
  onClose: () => void
  agentSlug?: string
}

export function AgentConfigSlideOver({ open, onClose, agentSlug }: AgentConfigSlideOverProps) {
  const agent = agentSlug ? ALL_AGENTS.find(a => a.slug === agentSlug) : null
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(agent || null)
  const [maxTokens, setMaxTokens] = useState(selectedAgent?.maxTokens || 4096)
  const [temperature, setTemperature] = useState(selectedAgent?.temperature || 0.7)
  const [isActive, setIsActive] = useState(true)

  function handleSave() {
    toast.success(`Configuration de ${selectedAgent?.name || 'agent'} sauvegardée`)
    onClose()
  }

  return (
    <SlideOver open={open} onClose={onClose} title="Configuration Agent" description="Modifier les paramètres d'un agent IA" width="lg">
      <div className="space-y-6">
        {/* Agent Selector */}
        {!agentSlug && (
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Sélectionner un agent</label>
            <select
              value={selectedAgent?.slug || ''}
              onChange={e => {
                const a = ALL_AGENTS.find(a => a.slug === e.target.value)
                setSelectedAgent(a || null)
                if (a) { setMaxTokens(a.maxTokens); setTemperature(a.temperature) }
              }}
              className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none"
            >
              <option value="">Choisir un agent...</option>
              {ALL_AGENTS.map(a => (
                <option key={a.slug} value={a.slug}>{a.name} ({TIER_CONFIG[a.tier].label})</option>
              ))}
            </select>
          </div>
        )}

        {selectedAgent && (
          <>
            {/* Agent Info */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-5 w-5" style={{ color: selectedAgent.color }} />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{selectedAgent.name}</p>
                  <p className="text-[10px] text-white/50">{TIER_CONFIG[selectedAgent.tier].label} · {selectedAgent.defaultModel}</p>
                </div>
              </div>
              <p className="text-xs text-white/50">{selectedAgent.description}</p>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Max Tokens: {maxTokens}</label>
              <input
                type="range" min={1024} max={16384} step={1024} value={maxTokens}
                onChange={e => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-[#E50914]"
              />
              <div className="flex justify-between text-[10px] text-white/50">
                <span>1024</span><span>16384</span>
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Temperature: {temperature.toFixed(1)}</label>
              <input
                type="range" min={0} max={1} step={0.1} value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#E50914]"
              />
              <div className="flex justify-between text-[10px] text-white/50">
                <span>0 (déterministe)</span><span>1 (créatif)</span>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Agent actif</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-[#E50914]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white/5 transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Capabilities */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Capabilities</label>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.capabilities.map(cap => (
                  <span key={cap} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/60 border border-white/10">
                    {cap.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" /> Sauvegarder
            </button>
          </>
        )}
      </div>
    </SlideOver>
  )
}
