'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  MessageSquare, TrendingUp, DollarSign, Megaphone, Cpu,
  Users, Scale, Eye, Radio, Send, Loader2, Bot,
  ArrowLeft, Zap,
} from 'lucide-react'

interface DiscussionTemplate {
  id: string
  name: string
  icon: typeof TrendingUp
  color: string
  agent: string
  systemPrompt: string
  starters: string[]
}

const TEMPLATES: DiscussionTemplate[] = [
  { id: 'market', name: 'Analyse Marché', icon: TrendingUp, color: '#3B82F6', agent: 'cg-investment-strategist', systemPrompt: 'Tu es un analyste marché expert en cinéma participatif.', starters: ['Quelles tendances de marché surveiller?', 'Analyse la concurrence', 'Opportunités de croissance'] },
  { id: 'finance', name: 'Stratégie Financière', icon: DollarSign, color: '#10B981', agent: 'cg-producteur', systemPrompt: 'Tu es un CFO expert en modèles économiques cinéma.', starters: ['Optimiser le modèle de revenus', 'Réduire le coût par user', 'Stratégie de pricing'] },
  { id: 'marketing', name: 'Marketing & Growth', icon: Megaphone, color: '#EF4444', agent: 'cg-marketing-film', systemPrompt: 'Tu es un CMO expert en growth hacking cinéma.', starters: ['Plan d\'acquisition users', 'Stratégie de contenu', 'Campagne de lancement'] },
  { id: 'tech', name: 'Architecture Tech', icon: Cpu, color: '#8B5CF6', agent: 'cg-production-manager', systemPrompt: 'Tu es un CTO expert en scalabilité.', starters: ['Priorités techniques Q2', 'Optimisation performance', 'Stack technique idéale'] },
  { id: 'hr', name: 'Équipe & RH', icon: Users, color: '#F59E0B', agent: 'cg-community-manager', systemPrompt: 'Tu es un DRH expert en recrutement créatif.', starters: ['Premiers recrutements', 'Culture d\'entreprise', 'Plan de rémunération'] },
  { id: 'legal', name: 'Juridique & Conformité', icon: Scale, color: '#6366F1', agent: 'cg-studio-head', systemPrompt: 'Tu es un directeur juridique cinéma.', starters: ['Compliance RGPD', 'Droits d\'auteur IA', 'Structure juridique'] },
  { id: 'vision', name: 'Vision & Produit', icon: Eye, color: '#EC4899', agent: 'cg-creative-director', systemPrompt: 'Tu es un CPO visionnaire.', starters: ['Roadmap 6 mois', 'Différenciation produit', 'Vision long terme'] },
  { id: 'comms', name: 'Communication', icon: Radio, color: '#14B8A6', agent: 'cg-distribution-manager', systemPrompt: 'Tu es un directeur de communication.', starters: ['Stratégie presse', 'Relations investisseurs', 'Messaging produit'] },
]

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export default function MyDiscussionsPage() {
  const [activeTemplate, setActiveTemplate] = useState<DiscussionTemplate | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMessage(text?: string) {
    const msg = text || input.trim()
    if (!msg || streaming) return

    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setStreaming(true)

    // Simulate streaming response
    await new Promise(r => setTimeout(r, 1500))
    const response = `[${activeTemplate?.agent}] Réponse stratégique simulée pour "${msg.substring(0, 60)}..."\n\nEn production, cette réponse sera générée par le modèle IA approprié avec streaming SSE token par token.\n\nPoints clés :\n• Analyse contextuelle de votre question\n• Recommandations basées sur le domaine ${activeTemplate?.name}\n• Actions concrètes à entreprendre`

    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setStreaming(false)
  }

  if (!activeTemplate) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">My Discussions</h1>
          <p className="text-sm text-white/50 mt-1">8 templates stratégiques · Chat streaming avec agents experts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map(t => {
            const TIcon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTemplate(t); setMessages([]) }}
                className="text-left rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/15 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${t.color}15` }}>
                  <TIcon className="h-6 w-6" style={{ color: t.color }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t.name}</h3>
                <p className="text-[10px] text-white/50 mb-3">Agent: {t.agent}</p>
                <div className="space-y-1">
                  {t.starters.map(s => (
                    <p key={s} className="text-[10px] text-white/50 truncate">• {s}</p>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const TIcon = activeTemplate.icon

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10">
        <button onClick={() => setActiveTemplate(null)} className="text-white/50 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <TIcon className="h-5 w-5" style={{ color: activeTemplate.color }} />
        <div>
          <p className="text-sm font-semibold text-white">{activeTemplate.name}</p>
          <p className="text-[10px] text-white/50">{activeTemplate.agent}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <TIcon className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: activeTemplate.color }} />
            <p className="text-sm text-white/50 mb-4">Commencez la discussion</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {activeTemplate.starters.map(s => (
                <button key={s} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:bg-white/[0.03]">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="h-7 w-7 rounded-lg flex items-center justify-center mr-2 mt-1 shrink-0" style={{ backgroundColor: `${activeTemplate.color}15` }}>
                <Bot className="h-3.5 w-3.5" style={{ color: activeTemplate.color }} />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/90'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${activeTemplate.color}15` }}>
              <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: activeTemplate.color }} />
            </div>
            <div className="bg-white/[0.05] rounded-2xl px-4 py-2.5">
              <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" /><div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} /><div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} /></div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 items-end">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder={`Parlez à ${activeTemplate.name}...`} rows={1} className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
          <button onClick={() => sendMessage()} disabled={!input.trim() || streaming} className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#E50914] text-white disabled:opacity-30 shrink-0">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
