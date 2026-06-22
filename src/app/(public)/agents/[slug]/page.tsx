import { ALL_AGENTS, TIER_CONFIG, CATEGORY_CONFIG } from '@/data/agents'
import type { AgentDef } from '@/data/agents'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AgentExecutePanel } from '@/components/agents/agent-execute-panel'
import {
  Bot, ArrowLeft, Zap, Brain, GitBranch, Star,
  PenTool, Film, Briefcase, Users, Camera, Scissors,
  Music, Sparkles, Volume2, Megaphone, Eye, Crown,
  TrendingUp, Shield, Store, ChevronRight,
} from 'lucide-react'
import type { Metadata } from 'next'

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

export async function generateStaticParams() {
  return ALL_AGENTS.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const agent = ALL_AGENTS.find(a => a.slug === slug)
  return {
    title: agent ? `${agent.name} — Agent IA CINEGENY` : 'Agent IA — CINEGENY',
    description: agent?.description || 'Agent IA spécialisé cinéma',
  }
}

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agent = ALL_AGENTS.find(a => a.slug === slug)
  if (!agent) notFound()

  const tierConfig = TIER_CONFIG[agent.tier]
  const catConfig = CATEGORY_CONFIG[agent.category]
  const Icon = ICON_MAP[agent.icon] || Bot

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les agents
        </Link>

        {/* Agent Header */}
        <div className="flex items-start gap-6 mb-10">
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${agent.color}15`, border: `2px solid ${agent.color}30` }}
          >
            <Icon className="h-10 w-10" style={{ color: agent.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: `${tierConfig.color}15`, color: tierConfig.color, border: `1px solid ${tierConfig.color}30` }}
              >
                {tierConfig.label}
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color }}
              >
                {catConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{agent.description}</p>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map(cap => (
                <span key={cap} className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  {cap.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Modèle IA</p>
            <p className="text-sm font-semibold text-white">{agent.defaultModel.split('-').slice(0, 2).join(' ')}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Max Tokens</p>
            <p className="text-sm font-semibold text-white">{agent.maxTokens.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Température</p>
            <p className="text-sm font-semibold text-white">{agent.temperature}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Entrées</p>
            <p className="text-sm font-semibold text-white">{agent.inputTypes.join(', ')}</p>
          </div>
        </div>

        {/* Execute Panel (client component) */}
        <AgentExecutePanel
          agentSlug={agent.slug}
          agentName={agent.name}
          agentColor={agent.color}
          tier={agent.tier}
        />

        {/* Tags */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {agent.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-gray-900 text-gray-400 border border-gray-800">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
