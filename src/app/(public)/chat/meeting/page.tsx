'use client'

import { useState } from 'react'
import { ALL_AGENTS, TIER_CONFIG, getAgentBySlug } from '@/data/agents'
import type { AgentDef } from '@/data/agents'
import Link from 'next/link'
import {
  Users, ArrowLeft, Play, Loader2, CheckCircle2,
  Bot, PenTool, Film, Briefcase, Camera, Scissors,
  Music, Sparkles, Volume2, Megaphone, Eye, Crown,
  TrendingUp, Brain, GitBranch, Zap, Star, Shield, Store,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

const ICON_MAP: Record<string, typeof Bot> = {
  'pen-tool': PenTool, 'clapperboard': Film, 'briefcase': Briefcase,
  'users': Users, 'camera': Camera, 'scissors': Scissors,
  'music': Music, 'sparkles': Sparkles, 'volume-2': Volume2,
  'megaphone': Megaphone, 'git-branch': GitBranch, 'check-circle': Zap,
  'globe': TrendingUp, 'heart': Star, 'eye': Eye, 'crown': Crown,
  'trending-up': TrendingUp, 'target': Brain, 'award': Star,
  'bar-chart-3': TrendingUp, 'presentation': Briefcase,
  'stethoscope': Zap, 'scale': Shield, 'store': Store, 'film': Film,
}

const CORE_AGENTS = ALL_AGENTS.filter(a => a.category !== 'MARKETPLACE')

const MEETING_PRESETS = [
  {
    name: 'Script Review',
    description: 'Scénariste, Réalisateur et Producteur analysent un scénario',
    agents: ['cg-scenariste', 'cg-realisateur', 'cg-producteur'],
  },
  {
    name: 'Pre-Production',
    description: 'Casting, Dir Photo et Producteur planifient le tournage',
    agents: ['cg-casting', 'cg-directeur-photo', 'cg-producteur'],
  },
  {
    name: 'Post-Production',
    description: 'Monteur, VFX, Sound Design et Compositeur finalisent le film',
    agents: ['cg-monteur', 'cg-vfx', 'cg-sound-design', 'cg-compositeur'],
  },
  {
    name: 'Strategic Review',
    description: 'Creative Director, Studio Head et Investment Strategist évaluent un projet',
    agents: ['cg-creative-director', 'cg-studio-head', 'cg-investment-strategist'],
  },
  {
    name: 'Launch Planning',
    description: 'Marketing, Distribution et Community Manager préparent le lancement',
    agents: ['cg-marketing-film', 'cg-distribution-manager', 'cg-community-manager'],
  },
]

export default function MeetingPage() {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [rounds, setRounds] = useState(3)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{
    transcript: string
    summary: string
    durationMs: number
  } | null>(null)

  function toggleAgent(slug: string) {
    setSelectedAgents(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  function applyPreset(preset: typeof MEETING_PRESETS[0]) {
    setSelectedAgents(preset.agents)
    if (!title) setTitle(preset.name)
  }

  async function startMeeting() {
    if (!title.trim() || !topic.trim() || selectedAgents.length < 2) {
      toast.error('Remplissez le titre, le sujet et sélectionnez au moins 2 agents')
      return
    }

    setRunning(true)
    setResult(null)

    try {
      const res = await fetch('/api/chat/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          topic: topic.trim(),
          agentSlugs: selectedAgents,
          rounds,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Meeting failed')
      }

      setResult({
        transcript: data.transcript,
        summary: data.summary,
        durationMs: data.durationMs,
      })
      toast.success('Réunion terminée !')
    } catch (err: any) {
      toast.error(err.message)
    }

    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au chat
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Réunion Multi-Agents</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Réunion d&apos;équipe <span className="text-[#E50914]">IA</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Faites discuter plusieurs agents cinéma ensemble sur un sujet.
            Chaque agent apporte son expertise. Compte-rendu structuré à la fin.
          </p>
        </div>

        {!result ? (
          <div className="space-y-8">
            {/* Meeting Setup */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-5">
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Titre de la réunion</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Revue du scénario Act 2"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Sujet de discussion</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Décrivez le sujet que les agents doivent discuter..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Nombre de rounds : {rounds}</label>
                <input
                  type="range"
                  min={2}
                  max={5}
                  value={rounds}
                  onChange={e => setRounds(parseInt(e.target.value))}
                  className="w-full accent-[#E50914]"
                />
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>2 (rapide)</span>
                  <span>5 (approfondi)</span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Configurations pré-définies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MEETING_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="text-left rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-purple-500/30 transition-colors"
                  >
                    <p className="text-sm font-medium text-white">{preset.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{preset.description}</p>
                    <div className="flex gap-1 mt-2">
                      {preset.agents.map(slug => {
                        const a = getAgentBySlug(slug)
                        const AIcon = ICON_MAP[a?.icon || 'film'] || Bot
                        return (
                          <div key={slug} className="h-6 w-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${a?.color}15` }}>
                            <AIcon className="h-3 w-3" style={{ color: a?.color }} />
                          </div>
                        )
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Participants ({selectedAgents.length} sélectionnés, min 2)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {CORE_AGENTS.map(agent => {
                  const AIcon = ICON_MAP[agent.icon] || Bot
                  const selected = selectedAgents.includes(agent.slug)
                  return (
                    <button
                      key={agent.slug}
                      onClick={() => toggleAgent(agent.slug)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left ${
                        selected
                          ? 'border-[#E50914] bg-[#E50914]/10 text-white'
                          : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <AIcon className="h-4 w-4 shrink-0" style={{ color: agent.color }} />
                      <span className="text-xs truncate">{agent.name}</span>
                      {selected && <CheckCircle2 className="h-3.5 w-3.5 text-[#E50914] ml-auto shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startMeeting}
              disabled={running || selectedAgents.length < 2 || !title.trim() || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {running ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Réunion en cours...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Lancer la réunion ({selectedAgents.length} agents, {rounds} rounds)
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Meeting Result */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Réunion terminée</h2>
                <span className="text-xs text-gray-500 ml-auto">{result.durationMs}ms</span>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2">Compte-rendu</h3>
                <div className="rounded-xl bg-gray-900/80 p-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {result.summary}
                </div>
              </div>

              {/* Full Transcript */}
              <details>
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  Voir le transcript complet
                </summary>
                <div className="mt-3 rounded-xl bg-gray-900/80 p-4 text-xs text-gray-400 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {result.transcript}
                </div>
              </details>
            </div>

            {/* New Meeting Button */}
            <button
              onClick={() => { setResult(null); setTitle(''); setTopic(''); setSelectedAgents([]) }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nouvelle réunion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
