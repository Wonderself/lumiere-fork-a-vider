'use client'

import { useState } from 'react'
import {
  Bot, Shield, Zap, CheckCircle2, XCircle, AlertTriangle,
  Search, Settings, Eye, Power, PowerOff,
} from 'lucide-react'
import { toast } from 'sonner'

interface CustomAgent {
  id: string
  name: string
  creator: string
  domain: string
  autonomyLevel: 'low' | 'medium' | 'high'
  status: 'active' | 'paused' | 'error' | 'disabled'
  executionCount: number
  lastActive: Date
  createdAt: Date
}

const MOCK_AGENTS: CustomAgent[] = [
  { id: '1', name: 'My Script Analyzer', creator: 'user@example.com', domain: 'writing', autonomyLevel: 'medium', status: 'active', executionCount: 47, lastActive: new Date(), createdAt: new Date(Date.now() - 7 * 86400000) },
  { id: '2', name: 'Budget Optimizer Pro', creator: 'producer@film.com', domain: 'production', autonomyLevel: 'high', status: 'active', executionCount: 23, lastActive: new Date(Date.now() - 3600000), createdAt: new Date(Date.now() - 14 * 86400000) },
  { id: '3', name: 'Festival Tracker', creator: 'director@indie.com', domain: 'distribution', autonomyLevel: 'low', status: 'paused', executionCount: 8, lastActive: new Date(Date.now() - 86400000), createdAt: new Date(Date.now() - 30 * 86400000) },
  { id: '4', name: 'Mood Board Generator', creator: 'dop@studio.com', domain: 'cinematography', autonomyLevel: 'medium', status: 'error', executionCount: 156, lastActive: new Date(Date.now() - 7200000), createdAt: new Date(Date.now() - 60 * 86400000) },
]

const AUTONOMY_CONFIG = {
  low: { label: 'Bas', color: 'text-green-600', bg: 'bg-green-500/10' },
  medium: { label: 'Moyen', color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
  high: { label: 'Élevé', color: 'text-red-600', bg: 'bg-red-500/10' },
}

const STATUS_CONFIG = {
  active: { label: 'Actif', color: 'text-green-600', dot: 'bg-green-500' },
  paused: { label: 'Pause', color: 'text-yellow-600', dot: 'bg-yellow-500' },
  error: { label: 'Erreur', color: 'text-red-600', dot: 'bg-red-500' },
  disabled: { label: 'Désactivé', color: 'text-white/50', dot: 'bg-white/30' },
}

export default function CustomAgentsPage() {
  const [agents] = useState<CustomAgent[]>(MOCK_AGENTS)
  const [search, setSearch] = useState('')

  const filtered = search
    ? agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.creator.toLowerCase().includes(search.toLowerCase()))
    : agents

  function toggleAgent(id: string) {
    toast.success('Agent status toggled')
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Custom Agents Monitor</h1>
        <p className="text-sm text-white/50 mt-1">Suivi des agents créés par les utilisateurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{agents.filter(a => a.status === 'active').length}</p>
          <p className="text-[10px] text-white/50">Actifs</p>
        </div>
        <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{agents.filter(a => a.status === 'paused').length}</p>
          <p className="text-[10px] text-white/50">En pause</p>
        </div>
        <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{agents.filter(a => a.status === 'error').length}</p>
          <p className="text-[10px] text-white/50">En erreur</p>
        </div>
        <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 text-center">
          <p className="text-2xl font-bold text-white/60">{agents.reduce((s, a) => s + a.executionCount, 0)}</p>
          <p className="text-[10px] text-white/50">Total exécutions</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un agent..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
      </div>

      {/* Agents Table */}
      <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/5 overflow-hidden">
        <div className="divide-y divide-white/10">
          {filtered.map(agent => {
            const auto = AUTONOMY_CONFIG[agent.autonomyLevel]
            const st = STATUS_CONFIG[agent.status]
            return (
              <div key={agent.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                <div className={`h-3 w-3 rounded-full ${st.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  <p className="text-[10px] text-white/50">{agent.creator} · {agent.domain}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${auto.bg} ${auto.color} font-medium`}>
                  Autonomy: {auto.label}
                </span>
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{agent.executionCount} exec</p>
                  <p className="text-[10px] text-white/50">{agent.lastActive.toLocaleDateString('fr-FR')}</p>
                </div>
                <button onClick={() => toggleAgent(agent.id)} className="p-1.5 rounded-lg hover:bg-white/[0.05]" title={agent.status === 'active' ? 'Désactiver' : 'Activer'}>
                  {agent.status === 'active' ? <PowerOff className="h-4 w-4 text-red-400" /> : <Power className="h-4 w-4 text-green-600" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
