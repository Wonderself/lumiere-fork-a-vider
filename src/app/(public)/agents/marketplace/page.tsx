import Link from 'next/link'
import { MARKETPLACE_AGENTS, ALL_AGENTS, TIER_CONFIG } from '@/data/agents'
import {
  Store, ArrowLeft, Star, Bot, ChevronRight, Zap,
  PenTool, Film, Briefcase, Users, Camera, Scissors,
  Music, Sparkles, Volume2, Megaphone, Eye, Crown,
  TrendingUp, Brain, GitBranch, Shield,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketplace Agents IA — CINEGENY',
  description: 'Templates d\'agents IA pré-configurés pour le cinéma : festivals, box-office, pitch deck et plus.',
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

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Back */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les agents
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Store className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-400">Marketplace</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Templates d&apos;Agents <span className="text-indigo-400">Spécialisés</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Des agents pré-configurés pour des besoins spécifiques : soumission festivals,
            analyse box-office, pitch deck et plus encore.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {MARKETPLACE_AGENTS.map(agent => {
            const Icon = ICON_MAP[agent.icon] || Bot
            return (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className="group rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-900/30 p-8 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Icon className="h-7 w-7 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {agent.name}
                      </h3>
                      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {agent.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map(cap => (
                        <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          {cap.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-4 text-[10px] text-gray-600">
                      <span>Modèle: Sonnet</span>
                      <span>·</span>
                      <span>{agent.tags.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coming Soon */}
        <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/30 p-12 text-center">
          <Store className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Plus d&apos;agents à venir</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            La marketplace s&apos;enrichira de nouveaux templates créés par la communauté.
            Bientôt, vous pourrez aussi créer et partager vos propres agents.
          </p>
        </div>
      </div>
    </div>
  )
}
