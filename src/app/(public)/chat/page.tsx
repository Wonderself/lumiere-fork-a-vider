'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ALL_AGENTS, TIER_CONFIG, getAgentBySlug } from '@/data/agents'
import type { AgentDef, AgentTier } from '@/data/agents'
import {
  Bot, Send, Loader2, Plus, MessageSquare, Archive,
  Pin, ChevronDown, X, Zap, Brain, GitBranch,
  PenTool, Film, Briefcase, Users, Camera, Scissors,
  Music, Sparkles, Volume2, Megaphone, Eye, Crown,
  TrendingUp, Shield, Store, Star, Copy, Check,
  Settings, StopCircle,
} from 'lucide-react'
import {
  createConversationAction,
  getConversationsAction,
  archiveConversationAction,
} from '@/app/actions/chat'

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

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  agentSlug?: string
  model?: string
  cached?: boolean
  costCredits?: number
  createdAt: string
}

interface ConversationSummary {
  id: string
  agentSlug: string
  title: string | null
  isPinned: boolean
  messageCount: number
  lastMessageAt: string | Date | null
}

const NON_MARKETPLACE_AGENTS = ALL_AGENTS.filter(a => a.category !== 'MARKETPLACE')

export default function ChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDef>(NON_MARKETPLACE_AGENTS[0])
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showAgentPicker, setShowAgentPicker] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  // Load conversations on mount
  useEffect(() => {
    getConversationsAction()
      .then(data => setConversations(data.conversations || []))
      .catch(() => {})
  }, [])

  // Load conversation messages
  const loadConversation = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/chat/conversations/${convId}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages)
        setActiveConvId(convId)
        const agent = getAgentBySlug(data.agentSlug)
        if (agent) setSelectedAgent(agent)
      }
    } catch {}
  }, [])

  // Send message
  async function handleSend() {
    if (!input.trim() || streaming) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = input.trim()
    setInput('')
    setStreaming(true)
    setStreamingText('')

    // Create AbortController
    const abort = new AbortController()
    abortRef.current = abort

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          message: messageText,
          agentSlug: selectedAgent.slug,
        }),
        signal: abort.signal,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Chat failed')
      }

      const contentType = res.headers.get('content-type') || ''

      if (contentType.includes('text/event-stream')) {
        // SSE streaming
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === 'token') {
                  accumulated += data.content
                  setStreamingText(accumulated)
                } else if (data.type === 'done') {
                  // Add final assistant message
                  const assistantMsg: Message = {
                    id: data.messageId || `msg-${Date.now()}`,
                    role: 'ASSISTANT',
                    content: accumulated,
                    agentSlug: selectedAgent.slug,
                    model: data.model,
                    cached: data.cached,
                    costCredits: data.costCredits,
                    createdAt: new Date().toISOString(),
                  }
                  setMessages(prev => [...prev, assistantMsg])
                  setStreamingText('')

                  // Update conversation ID if new
                  if (data.conversationId && !activeConvId) {
                    setActiveConvId(data.conversationId)
                  }
                } else if (data.type === 'error') {
                  throw new Error(data.error)
                }
              } catch (parseErr) {
                // Skip malformed SSE lines
              }
            }
          }
        }
      } else {
        // Non-streaming (cached) response
        const data = await res.json()
        const assistantMsg: Message = {
          id: data.messageId || `msg-${Date.now()}`,
          role: 'ASSISTANT',
          content: data.content,
          agentSlug: selectedAgent.slug,
          model: data.model,
          cached: data.cached,
          createdAt: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMsg])
        if (data.conversationId && !activeConvId) {
          setActiveConvId(data.conversationId)
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          role: 'SYSTEM',
          content: `Erreur : ${err.message}`,
          createdAt: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMsg])
      }
    }

    setStreaming(false)
    setStreamingText('')
    abortRef.current = null
  }

  function handleAbort() {
    abortRef.current?.abort()
    setStreaming(false)
    setStreamingText('')
  }

  function handleNewChat() {
    setActiveConvId(null)
    setMessages([])
    setStreamingText('')
    inputRef.current?.focus()
  }

  async function handleArchiveConversation(e: React.MouseEvent, convId: string) {
    e.stopPropagation()
    await archiveConversationAction(convId)
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (activeConvId === convId) {
      setActiveConvId(null)
      setMessages([])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const AgentIcon = ICON_MAP[selectedAgent.icon] || Bot
  const tierConfig = TIER_CONFIG[selectedAgent.tier]

  return (
    <div className="h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-72 border-r border-gray-800 bg-gray-900/50 flex flex-col">
          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-800">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouveau chat
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-600">
                Aucune conversation
              </div>
            ) : (
              <div className="space-y-0.5 p-2">
                {conversations.map(conv => {
                  const convAgent = getAgentBySlug(conv.agentSlug)
                  const ConvIcon = ICON_MAP[convAgent?.icon || 'film'] || Bot
                  return (
                    <div
                      key={conv.id}
                      className={`group/conv w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        activeConvId === conv.id
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                      }`}
                      onClick={() => loadConversation(conv.id)}
                    >
                      <ConvIcon className="h-4 w-4 shrink-0" style={{ color: convAgent?.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{conv.title}</p>
                        <p className="text-[10px] text-gray-600">{conv.messageCount} messages</p>
                      </div>
                      {conv.isPinned && <Pin className="h-3 w-3 text-yellow-500 shrink-0" />}
                      <button
                        onClick={(e) => handleArchiveConversation(e, conv.id)}
                        className="hidden group-hover/conv:flex h-5 w-5 items-center justify-center rounded text-gray-600 hover:text-gray-400 transition-colors shrink-0"
                        title="Archiver"
                      >
                        <Archive className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Meeting Link */}
          <div className="p-4 border-t border-gray-800">
            <Link
              href="/chat/meeting"
              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Users className="h-4 w-4" />
              Réunion multi-agents
            </Link>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>

          {/* Agent Selector */}
          <div className="relative">
            <button
              onClick={() => setShowAgentPicker(!showAgentPicker)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-700 bg-gray-800/50 hover:border-gray-600 transition-colors"
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${selectedAgent.color}15` }}
              >
                <AgentIcon className="h-4 w-4" style={{ color: selectedAgent.color }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{selectedAgent.name}</p>
                <p className="text-[10px] text-gray-500">{tierConfig.label} · {tierConfig.model.split('-').slice(0,2).join(' ')}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {/* Agent Dropdown */}
            {showAgentPicker && (
              <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 shadow-2xl z-50">
                <div className="p-2">
                  {(['L1_EXECUTION', 'L2_MANAGEMENT', 'L3_STRATEGY'] as AgentTier[]).map(tier => {
                    const tConfig = TIER_CONFIG[tier]
                    const tierAgents = NON_MARKETPLACE_AGENTS.filter(a => a.tier === tier)
                    return (
                      <div key={tier} className="mb-2">
                        <p className="text-[10px] font-medium uppercase tracking-wider px-3 py-1.5" style={{ color: tConfig.color }}>
                          {tConfig.label} ({tierAgents.length})
                        </p>
                        {tierAgents.map(agent => {
                          const AIcon = ICON_MAP[agent.icon] || Bot
                          return (
                            <button
                              key={agent.slug}
                              onClick={() => { setSelectedAgent(agent); setShowAgentPicker(false) }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                selectedAgent.slug === agent.slug ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'
                              }`}
                            >
                              <AIcon className="h-4 w-4" style={{ color: agent.color }} />
                              <span className="text-sm">{agent.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1" />

          <Link href="/agents" className="text-xs text-gray-500 hover:text-white transition-colors">
            Voir tous les agents
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && !streaming ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="h-20 w-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${selectedAgent.color}10`, border: `2px solid ${selectedAgent.color}20` }}
              >
                <AgentIcon className="h-10 w-10" style={{ color: selectedAgent.color }} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{selectedAgent.name}</h2>
              <p className="text-sm text-gray-500 max-w-md">{selectedAgent.description}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {selectedAgent.capabilities.slice(0, 4).map(cap => (
                  <span key={cap} className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                    {cap.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'USER' && (
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1"
                      style={{ backgroundColor: msg.role === 'SYSTEM' ? '#EF4444' + '15' : `${selectedAgent.color}15` }}
                    >
                      {msg.role === 'SYSTEM' ? (
                        <X className="h-4 w-4 text-red-400" />
                      ) : (
                        <AgentIcon className="h-4 w-4" style={{ color: selectedAgent.color }} />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'USER'
                        ? 'bg-[#E50914] text-white'
                        : msg.role === 'SYSTEM'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.role === 'ASSISTANT' && (
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                        {msg.cached && <span className="text-green-400">⚡ Cache</span>}
                        {msg.model && <span>{msg.model.split('-').slice(0,2).join(' ')}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming indicator */}
              {streaming && streamingText && (
                <div className="flex gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1"
                    style={{ backgroundColor: `${selectedAgent.color}15` }}
                  >
                    <AgentIcon className="h-4 w-4 animate-pulse" style={{ color: selectedAgent.color }} />
                  </div>
                  <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-gray-800 text-gray-200">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{streamingText}</p>
                    <span className="inline-block w-2 h-4 bg-white/50 animate-pulse ml-0.5" />
                  </div>
                </div>
              )}

              {streaming && !streamingText && (
                <div className="flex gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${selectedAgent.color}15` }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: selectedAgent.color }} />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-gray-800">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 rounded-2xl border border-gray-700 bg-gray-800/50 p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Parlez à ${selectedAgent.name}...`}
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none focus:outline-none min-h-[40px] max-h-[120px]"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                }}
              />
              {streaming ? (
                <button
                  onClick={handleAbort}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors shrink-0"
                >
                  <StopCircle className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-600 mt-2 text-center">
              0% commission · Crédits déduits au coût réel · Entrée pour envoyer, Shift+Entrée pour retour à la ligne
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
