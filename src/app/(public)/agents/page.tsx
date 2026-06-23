import Link from 'next/link'
import { ALL_AGENTS, L1_AGENTS, L2_AGENTS, L3_AGENTS, MARKETPLACE_AGENTS, TIER_CONFIG, CATEGORY_CONFIG } from '@/data/agents'
import type { AgentTier } from '@/data/agents'
import {
  Bot, Zap, Brain, Sparkles, Star, ArrowRight,
  Users, Film, Music, Camera, Scissors, Briefcase,
  PenTool, Volume2, Megaphone, Eye, Crown, TrendingUp,
  GitBranch, Store, ChevronRight, Shield,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agents IA Cinéma — CINEGENY',
  description: 'Découvrez nos agents IA spécialisés cinéma : scénariste, réalisateur, producteur, et plus encore.',
}

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

const TIER_ICON: Record<AgentTier, typeof Bot> = {
  L1_EXECUTION: Zap,
  L2_MANAGEMENT: GitBranch,
  L3_STRATEGY: Brain,
}

function AgentCard({ agent }: { agent: typeof ALL_AGENTS[0] }) {
  const Icon = ICON_MAP[agent.icon] || Bot
  const tierColor = TIER_CONFIG[agent.tier].color

  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
        >
          <Icon className="h-6 w-6" style={{ color: agent.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">
              {agent.name}
            </h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${tierColor}15`, color: tierColor, border: `1px solid ${tierColor}30` }}
            >
              {agent.tier.split('_')[0]}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {agent.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {agent.capabilities.slice(0, 3).map(cap => (
              <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                {cap.replace(/_/g, ' ')}
              </span>
            ))}
            {agent.capabilities.length > 3 && (
              <span className="text-[10px] text-gray-600">+{agent.capabilities.length - 3}</span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-[#E50914] transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  )
}

function TierSection({ tier, agents, icon: TierIcon }: { tier: AgentTier; agents: typeof ALL_AGENTS; icon: typeof Bot }) {
  const config = TIER_CONFIG[tier]

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
        >
          <TierIcon className="h-5 w-5" style={{ color: config.color }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{config.label}</h2>
          <p className="text-xs text-gray-500">{config.description}</p>
        </div>
        <span
          className="ml-auto text-xs px-3 py-1 rounded-full font-medium"
          style={{ backgroundColor: `${config.color}10`, color: config.color, border: `1px solid ${config.color}20` }}
        >
          {agents.length} agents · {config.model.split('-').slice(0, 2).join(' ')}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map(agent => (
          <AgentCard key={agent.slug} agent={agent} />
        ))}
      </div>
    </section>
  )
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <Bot className="h-4 w-4 text-[#E50914]" />
            <span className="text-sm font-medium text-[#E50914]">{ALL_AGENTS.length} agents spécialisés</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Agents IA <span className="text-[#E50914]">Cinema</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Une équipe complète d&apos;experts IA spécialisés dans chaque métier du cinéma.
            Du scénario à la distribution, chaque agent maîtrise son domaine.
          </p>

          {/* Tier summary */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {(Object.entries(TIER_CONFIG) as [AgentTier, typeof TIER_CONFIG[AgentTier]][]).map(([tier, config]) => {
              const Icon = TIER_ICON[tier]
              const count = ALL_AGENTS.filter(a => a.tier === tier).length
              return (
                <div
                  key={tier}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border"
                  style={{ borderColor: `${config.color}30`, backgroundColor: `${config.color}05` }}
                >
                  <Icon className="h-4 w-4" style={{ color: config.color }} />
                  <span className="text-sm text-white font-medium">{config.label}</span>
                  <span className="text-xs text-gray-500">({count})</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Agent Tiers */}
        <TierSection tier="L1_EXECUTION" agents={L1_AGENTS} icon={Zap} />
        <TierSection tier="L2_MANAGEMENT" agents={L2_AGENTS} icon={GitBranch} />
        <TierSection tier="L3_STRATEGY" agents={L3_AGENTS} icon={Brain} />

        {/* Marketplace */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Store className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Marketplace</h2>
              <p className="text-xs text-gray-500">Templates pré-configurés pour des besoins spécifiques</p>
            </div>
            <Link
              href="/agents/marketplace"
              className="ml-auto flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MARKETPLACE_AGENTS.map(agent => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        </section>

        {/* 0% Commission Banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">0% de commission sur les tokens IA</h3>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Chaque agent consomme des crédits basés sur le coût réel des tokens IA.
            Aucune marge ajoutée. Consultez nos{' '}
            <Link href="/pricing-ia" className="text-emerald-400 hover:underline">tarifs transparents</Link>.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/agents/marketplace"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl transition-colors"
          >
            <Store className="h-5 w-5" />
            Explorer la Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}
