'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { KNOWLEDGE_AGENTS, KNOWLEDGE_TYPES, EMBEDDING_CONFIG, FILM_MEMORY_CATEGORIES } from '@/data/knowledge'
import {
  Brain, Database, Search, Bot, BarChart3, RefreshCcw,
  Trash2, Shield, Zap, Clock, CheckCircle2, AlertTriangle,
  BookOpen, Cpu, Layers, Activity,
} from 'lucide-react'

export default function KnowledgeAdminPage() {
  const [tab, setTab] = useState<'overview' | 'search' | 'config'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ content: string; score: number; type: string }>>([])
  const [searching, setSearching] = useState(false)

  async function performSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    await new Promise(r => setTimeout(r, 1000))
    setSearchResults([
      { content: 'Résultat sémantique simulé pour "' + searchQuery.substring(0, 40) + '..."', score: 0.92, type: 'film_bible' },
      { content: 'Second résultat avec similarité moindre', score: 0.81, type: 'character' },
      { content: 'Résultat textuel (fallback)', score: 0.50, type: 'general' },
    ])
    setSearching(false)
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Knowledge Management</h1>
        <p className="text-sm text-white/50 mt-1">Embeddings vectoriels · Recherche sémantique · Mémoire films</p>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {KNOWLEDGE_AGENTS.map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div><p className="text-[10px] font-medium text-white">{a.name}</p><p className="text-[9px] text-white/50">{a.role} ({a.tier})</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'overview' as const, label: 'Vue d\'ensemble', icon: BarChart3 },
          { key: 'search' as const, label: 'Recherche sémantique', icon: Search },
          { key: 'config' as const, label: 'Configuration', icon: Cpu },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium shrink-0 ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
        })}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Memories', value: '0', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-500/10' },
              { label: 'Films indexés', value: '0', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-500/10' },
              { label: 'Dimensions', value: EMBEDDING_CONFIG.dimensions, icon: Cpu, color: 'text-orange-600', bg: 'bg-orange-500/10' },
              { label: 'TTL défaut', value: `${EMBEDDING_CONFIG.ttlDays}j`, icon: Clock, color: 'text-green-600', bg: 'bg-green-500/10' },
            ].map(kpi => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className={`bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-5`}>
                  <Icon className={`h-5 w-5 ${kpi.color} mb-2`} />
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-[10px] text-white/50">{kpi.label}</p>
                </div>
              )
            })}
          </div>

          {/* Knowledge Types */}
          <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Types de connaissances</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(KNOWLEDGE_TYPES).map(([key, config]) => (
                <div key={key} className="rounded-lg border border-white/10 p-3 text-center">
                  <p className="text-sm font-medium" style={{ color: config.color }}>{config.label}</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              ))}
            </div>
          </div>

          {/* Film Memory Categories */}
          <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-white mb-4">8 Catégories de mémoire film</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FILM_MEMORY_CATEGORIES.map(cat => (
                <div key={cat.id} className="rounded-lg border border-white/10 p-3">
                  <p className="text-xs font-medium" style={{ color: cat.color }}>{cat.label}</p>
                  <p className="text-[10px] text-white/50 line-clamp-1 mt-0.5">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      {tab === 'search' && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Recherche sémantique (cosine similarity)</h3>
            <div className="flex gap-2">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Recherchez dans la base de connaissances..." className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" onKeyDown={e => { if (e.key === 'Enter') performSearch() }} />
              <button onClick={performSearch} disabled={searching} className="px-4 py-2 bg-[#E50914] text-white text-sm rounded-xl disabled:opacity-50">
                {searching ? '...' : 'Rechercher'}
              </button>
            </div>
            <p className="text-[10px] text-white/50 mt-2">Seuil similarité: {EMBEDDING_CONFIG.similarityThreshold} · Max résultats: {EMBEDDING_CONFIG.maxResults} · Fallback textuel si &lt;3 résultats</p>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((r, i) => {
                const typeConf = KNOWLEDGE_TYPES[r.type as keyof typeof KNOWLEDGE_TYPES] || KNOWLEDGE_TYPES.general
                return (
                  <div key={i} className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 flex items-center gap-4">
                    <div className="text-center w-12">
                      <p className="text-lg font-bold" style={{ color: r.score > 0.8 ? '#10B981' : r.score > 0.6 ? '#F59E0B' : '#6B7280' }}>{(r.score * 100).toFixed(0)}%</p>
                      <p className="text-[9px] text-white/50">score</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{r.content}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${typeConf.color}15`, color: typeConf.color }}>{typeConf.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* CONFIG */}
      {tab === 'config' && (
        <div className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Cpu className="h-4 w-4 text-orange-500" />Configuration Embeddings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(EMBEDDING_CONFIG).map(([key, val]) => (
              <div key={key} className="rounded-lg border border-white/10 p-3">
                <p className="text-[10px] text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-lg font-bold text-white">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
