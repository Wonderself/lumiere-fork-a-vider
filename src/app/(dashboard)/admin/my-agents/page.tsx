'use client'

import { useState } from 'react'
import { ALL_AGENTS, TIER_CONFIG, CATEGORY_CONFIG } from '@/data/agents'
import type { AgentDef, AgentCategory } from '@/data/agents'
import {
  Bot, Search, Send, Loader2, ArrowLeft,
  PenTool, Film, Briefcase, Users, Camera, Scissors,
  Music, Sparkles, Volume2, Megaphone, Eye, Crown,
  TrendingUp, Brain, GitBranch, Zap, Star, Shield, Store,
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

interface ChatMsg { role: 'user' | 'assistant'; content: string }

export default function MyAgentsPage() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('all')
  const [chatAgent, setChatAgent] = useState<AgentDef | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)

  const categories = Array.from(new Set(ALL_AGENTS.map(a => a.category)))
  const filtered = ALL_AGENTS
    .filter(a => filterCat === 'all' || a.category === filterCat)
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))

  async function sendMessage() {
    if (!input.trim() || streaming || !chatAgent) return
    setMessages(prev => [...prev, { role: 'user', content: input.trim() }])
    const msg = input.trim()
    setInput('')
    setStreaming(true)
    await new Promise(r => setTimeout(r, 1500))
    setMessages(prev => [...prev, { role: 'assistant', content: `[${chatAgent.name}] Réponse simulée pour "${msg.substring(0, 60)}..."\n\nEn production, réponse streaming via SSE.` }])
    setStreaming(false)
  }

  if (chatAgent) {
    const AIcon = ICON_MAP[chatAgent.icon] || Bot
    return (
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <button onClick={() => { setChatAgent(null); setMessages([]) }} className="text-white/50 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
          <AIcon className="h-5 w-5" style={{ color: chatAgent.color }} />
          <div>
            <p className="text-sm font-semibold text-white">{chatAgent.name}</p>
            <p className="text-[10px] text-white/50">{TIER_CONFIG[chatAgent.tier].label}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/90'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {streaming && <div className="flex gap-1 px-4"><div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" /><div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} /><div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} /></div>}
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendMessage() }} placeholder={`Parlez à ${chatAgent.name}...`} className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
          <button onClick={sendMessage} disabled={!input.trim() || streaming} className="h-10 w-10 rounded-xl bg-[#E50914] text-white disabled:opacity-30 flex items-center justify-center"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">My Agents</h1>
        <p className="text-sm text-white/50 mt-1">{ALL_AGENTS.length} agents · Chat direct</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
          <option value="all">Toutes catégories</option>
          {categories.map(c => (
            <option key={c} value={c}>{CATEGORY_CONFIG[c as AgentCategory]?.label || c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(agent => {
          const AIcon = ICON_MAP[agent.icon] || Bot
          return (
            <button key={agent.slug} onClick={() => setChatAgent(agent)} className="text-left bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-5 hover:border-white/15 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}15` }}>
                  <AIcon className="h-5 w-5" style={{ color: agent.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{agent.name}</p>
                  <p className="text-[10px] text-white/50">{TIER_CONFIG[agent.tier].label}</p>
                </div>
              </div>
              <p className="text-xs text-white/50 line-clamp-2">{agent.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
