'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Bot, Lightbulb, Shield, CheckCircle2, AlertTriangle,
  Loader2, MessageSquare, Zap, Send, Eye, XCircle,
} from 'lucide-react'
import { TASK_AGENTS } from '@/lib/task-ai.service'

interface AITaskAssistantProps {
  taskCategory: string
  taskDescription: string
  filmProjectId?: string
  content: string
}

export function AITaskAssistant({ taskCategory, taskDescription, filmProjectId, content }: AITaskAssistantProps) {
  const [activeTab, setActiveTab] = useState<'suggest' | 'review' | 'chat'>('suggest')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ type: string; title: string; content: string }>>([])
  const [review, setReview] = useState<{ score: number; feedback: string; improvements: string[]; passed: boolean } | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [chatInput, setChatInput] = useState('')

  const agent = TASK_AGENTS.find(a => a.taskCategory === taskCategory)

  async function getSuggestions() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSuggestions([
      { type: 'creative', title: 'Approche alternative', content: `Pour cette tâche de ${taskCategory}, explorez un angle différent. Pensez aux émotions que vous voulez transmettre.` },
      { type: 'technical', title: 'Format recommandé', content: 'Suivez les standards du projet pour cette catégorie de tâche. Vérifiez les guidelines dans la fiche du film.' },
      { type: 'improvement', title: 'Enrichissement', content: 'Ajoutez des détails sensoriels et des descriptions d\'ambiance pour renforcer l\'impact de votre contribution.' },
    ])
    setLoading(false)
    toast.success('Suggestions générées')
  }

  async function runReview() {
    if (!content.trim()) { toast.error('Ajoutez du contenu avant la review'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    const score = 65 + Math.floor(Math.random() * 30)
    setReview({
      score,
      passed: score >= 70,
      feedback: score >= 80 ? 'Excellent travail !' : score >= 60 ? 'Bonne soumission avec des améliorations possibles.' : 'Des améliorations sont nécessaires.',
      improvements: score < 80 ? ['Vérifiez la cohérence avec les scènes existantes', 'Enrichissez les descriptions visuelles'] : [],
    })
    setLoading(false)
  }

  async function sendChat() {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', content: msg }])
    setChatInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setChatMessages(prev => [...prev, { role: 'assistant', content: `[${agent?.name || 'Agent'}] Pour "${msg.substring(0, 50)}..." — En production, réponse streaming de l'agent ${agent?.agentSlug}.` }])
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
        <Bot className="h-5 w-5 text-[#E50914]" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1A1A2E]">{agent?.name || 'Assistant IA'}</p>
          <p className="text-[10px] text-gray-400">Agent {agent?.agentSlug} · {agent?.capabilities.join(', ')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { key: 'suggest' as const, label: 'Suggestions', icon: Lightbulb },
          { key: 'review' as const, label: 'Review IA', icon: Shield },
          { key: 'chat' as const, label: 'Chat', icon: MessageSquare },
        ].map(tab => {
          const TIcon = tab.icon
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-[#E50914] text-[#E50914]' : 'border-transparent text-gray-400 hover:text-white/60'}`}>
              <TIcon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === 'suggest' && (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="text-center py-6">
                <Lightbulb className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Vous bloquez ? L&apos;IA peut vous aider.</p>
                <button onClick={getSuggestions} disabled={loading} className="mt-3 px-4 py-2 bg-[#E50914] text-white text-sm rounded-lg disabled:opacity-50">
                  {loading ? <Loader2 className="inline h-4 w-4 animate-spin mr-1" /> : <Zap className="inline h-4 w-4 mr-1" />}
                  Obtenir des suggestions
                </button>
              </div>
            ) : (
              suggestions.map((s, i) => (
                <div key={i} className="rounded-lg border border-white/10 p-4">
                  <p className="text-xs font-medium text-[#1A1A2E] mb-1">{s.title}</p>
                  <p className="text-xs text-white/50">{s.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'review' && (
          <div className="space-y-4">
            {!review ? (
              <div className="text-center py-6">
                <Shield className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Vérifiez la cohérence avant de soumettre.</p>
                <button onClick={runReview} disabled={loading} className="mt-3 px-4 py-2 bg-[#E50914] text-white text-sm rounded-lg disabled:opacity-50">
                  {loading ? <Loader2 className="inline h-4 w-4 animate-spin mr-1" /> : <Eye className="inline h-4 w-4 mr-1" />}
                  Lancer la review IA
                </button>
              </div>
            ) : (
              <>
                <div className={`rounded-lg p-4 ${review.passed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {review.passed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    <span className="text-sm font-semibold text-[#1A1A2E]">Score: {review.score}/100</span>
                  </div>
                  <p className="text-xs text-white/60">{review.feedback}</p>
                </div>
                {review.improvements.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-white/50">Améliorations suggérées :</p>
                    {review.improvements.map((imp, i) => (
                      <p key={i} className="text-xs text-white/50 flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-orange-400 shrink-0" /> {imp}
                      </p>
                    ))}
                  </div>
                )}
                <button onClick={() => setReview(null)} className="text-xs text-[#E50914] hover:underline">Relancer la review</button>
              </>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-3">
            <div className="max-h-48 overflow-y-auto space-y-2">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${m.role === 'user' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/80'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" /><div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} /><div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} /></div>}
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat() }} placeholder={`Demandez à ${agent?.name || 'l\'agent'}...`} className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs focus:border-[#E50914] focus:outline-none" />
              <button onClick={sendChat} disabled={!chatInput.trim() || loading} className="h-8 w-8 rounded-lg bg-[#E50914] text-white disabled:opacity-30 flex items-center justify-center shrink-0">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
