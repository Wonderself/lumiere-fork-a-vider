'use client'

import { useState, useRef, useEffect } from 'react'
import { ALL_AGENTS, TIER_CONFIG } from '@/data/agents'
import type { AgentDef } from '@/data/agents'
import {
  Bot, Send, Loader2, Plus, MessageSquare,
  PenTool, Film, Briefcase, Users, Camera, Scissors,
  Music, Sparkles, Volume2, Megaphone, Eye, Crown,
  TrendingUp, Brain, GitBranch, Zap, Star, Shield, Store,
} from 'lucide-react'

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

interface Msg { role: 'user' | 'assistant'; content: string; agent?: string; color?: string }

const CORE_AGENTS = ALL_AGENTS.filter(a => a.category !== 'MARKETPLACE')

export default function AdminChatPage() {
  const [agent, setAgent] = useState<AgentDef>(CORE_AGENTS[0])
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || streaming) return
    setMessages(prev => [...prev, { role: 'user', content: input.trim() }])
    const msg = input.trim()
    setInput('')
    setStreaming(true)
    await new Promise(r => setTimeout(r, 1500))
    setMessages(prev => [...prev, { role: 'assistant', content: `[${agent.name}] Réponse admin pour "${msg.substring(0, 80)}..."\n\nStreaming SSE sera connecté en production.`, agent: agent.name, color: agent.color }])
    setStreaming(false)
  }

  const AIcon = ICON_MAP[agent.icon] || Bot

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/10 bg-white/[0.03] overflow-y-auto">
        <div className="p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2">Agents</p>
          {CORE_AGENTS.map(a => {
            const AIc = ICON_MAP[a.icon] || Bot
            return (
              <button key={a.slug} onClick={() => setAgent(a)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors mb-0.5 ${agent.slug === a.slug ? 'bg-white/5 border border-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/10'}`}>
                <AIc className="h-3.5 w-3.5 shrink-0" style={{ color: a.color }} />
                <span className="truncate">{a.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
          <AIcon className="h-5 w-5" style={{ color: agent.color }} />
          <div>
            <p className="text-sm font-semibold text-white">{agent.name}</p>
            <p className="text-[10px] text-white/50">{TIER_CONFIG[agent.tier].label} · Admin Chat</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <AIcon className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: agent.color }} />
              <p className="text-sm text-white/50">Chat admin avec {agent.name}</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/90'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {streaming && <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" /><div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} /><div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} /></div>}
          <div ref={endRef} />
        </div>

        <div className="px-5 pb-4 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder={`Message ${agent.name}...`} className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
          <button onClick={send} disabled={!input.trim() || streaming} className="h-10 w-10 rounded-xl bg-[#E50914] text-white disabled:opacity-30 flex items-center justify-center shrink-0"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}
