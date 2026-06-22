'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AGENT_BUILDER_FIELDS, COMMUNITY_AGENTS } from '@/data/community-enhanced'
import {
  Bot, Wrench, Save, Loader2, Zap, Play, Eye,
  Brain, PenTool, Film, Star, Shield, Target,
} from 'lucide-react'

const ICON_MAP: Record<string, typeof Bot> = {
  bot: Bot, brain: Brain, 'pen-tool': PenTool, film: Film,
  star: Star, zap: Zap, shield: Shield, target: Target,
}

interface CustomAgent { id: string; name: string; role: string; model: string; category: string; icon: string; createdAt: Date }

export default function AgentBuilderPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [building, setBuilding] = useState(false)
  const [myAgents, setMyAgents] = useState<CustomAgent[]>([])
  const [testMode, setTestMode] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')

  function updateField(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  async function buildAgent() {
    const required = AGENT_BUILDER_FIELDS.filter(f => f.required)
    const missing = required.filter(f => !values[f.key]?.trim())
    if (missing.length > 0) { toast.error(`Champs manquants: ${missing.map(f => f.label).join(', ')}`); return }

    setBuilding(true)
    await new Promise(r => setTimeout(r, 2000))
    const agent: CustomAgent = {
      id: `custom-${Date.now()}`, name: values.name || 'Mon Agent',
      role: values.role || '', model: values.model || 'claude-sonnet-4-6',
      category: values.category || 'Autre', icon: values.icon || 'bot',
      createdAt: new Date(),
    }
    setMyAgents(prev => [agent, ...prev])
    setValues({})
    setBuilding(false)
    toast.success(`Agent "${agent.name}" créé !`)
  }

  async function testAgent() {
    if (!testInput.trim()) return
    setTestOutput('')
    await new Promise(r => setTimeout(r, 1500))
    setTestOutput(`[${values.name || 'Agent'}] Réponse simulée pour "${testInput.substring(0, 50)}..."\n\nEn production, le system prompt sera utilisé avec le modèle ${values.model || 'Sonnet'}.`)
  }

  const SelectedIcon = ICON_MAP[values.icon || 'bot'] || Bot

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <Wrench className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Agent Builder</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Créez votre <span className="text-[#E50914]">Agent IA</span>
          </h1>
          <p className="text-gray-400">Configurez un agent personnalisé pour vos projets cinéma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Builder Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
              {AGENT_BUILDER_FIELDS.map(field => (
                <div key={field.key}>
                  <label className="text-xs text-gray-400 mb-1.5 block">{field.label} {field.required && <span className="text-[#E50914]">*</span>}</label>
                  {field.type === 'textarea' ? (
                    <textarea value={values[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} rows={field.key === 'systemPrompt' ? 6 : 3} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
                  ) : field.type === 'select' ? (
                    <select value={values[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-[#E50914] focus:outline-none">
                      <option value="">Choisir...</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'slider' ? (
                    <div className="flex items-center gap-3">
                      <input type="range" min={field.min || 0} max={field.max || 100} value={parseInt(values[field.key] || '50')} onChange={e => updateField(field.key, e.target.value)} className="flex-1 accent-[#E50914]" />
                      <span className="text-xs text-gray-400 w-8">{values[field.key] || '50'}%</span>
                    </div>
                  ) : (
                    <input value={values[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                <button onClick={buildAgent} disabled={building} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
                  {building ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {building ? 'Création...' : 'Créer l\'agent'}
                </button>
                <button onClick={() => setTestMode(!testMode)} className={`px-4 py-3 rounded-xl text-sm font-medium ${testMode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  <Play className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Test Mode */}
            {testMode && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-3">
                <h3 className="text-sm font-semibold text-blue-400">Test de l&apos;agent</h3>
                <input value={testInput} onChange={e => setTestInput(e.target.value)} placeholder="Testez votre agent..." className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none" onKeyDown={e => { if (e.key === 'Enter') testAgent() }} />
                <button onClick={testAgent} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">Tester</button>
                {testOutput && <pre className="text-xs text-gray-300 bg-gray-900 rounded-xl p-4 whitespace-pre-wrap">{testOutput}</pre>}
              </div>
            )}
          </div>

          {/* Preview + My Agents */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Aperçu</h3>
              <div className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mx-auto mb-3">
                  <SelectedIcon className="h-8 w-8 text-[#E50914]" />
                </div>
                <p className="text-sm font-bold text-white">{values.name || 'Mon Agent'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{values.role || 'Rôle à définir'}</p>
                <p className="text-[10px] text-gray-600 mt-1">{values.model || 'claude-sonnet-4-6'} · {values.category || 'Autre'}</p>
              </div>
            </div>

            {/* My Agents */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Mes agents ({myAgents.length})</h3>
              {myAgents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 p-6 text-center">
                  <Bot className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Aucun agent créé</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myAgents.map(agent => {
                    const AIcon = ICON_MAP[agent.icon] || Bot
                    return (
                      <div key={agent.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50">
                        <AIcon className="h-4 w-4 text-[#E50914]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{agent.name}</p>
                          <p className="text-[10px] text-gray-500">{agent.category} · {agent.model.split('-').slice(0, 2).join(' ')}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
