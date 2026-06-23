import { ALL_AGENTS, TIER_CONFIG } from '@/data/agents'
import Link from 'next/link'
import { Bot, Zap, Brain, GitBranch, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Agents IA Cinéma — CineGeny', description: 'Découvrez nos 113 agents IA spécialisés cinéma' }

export default function AgentsFeaturePage() {
  const tiers = [
    { tier: 'L1_EXECUTION' as const, icon: Zap, agents: ALL_AGENTS.filter(a => a.tier === 'L1_EXECUTION') },
    { tier: 'L2_MANAGEMENT' as const, icon: GitBranch, agents: ALL_AGENTS.filter(a => a.tier === 'L2_MANAGEMENT') },
    { tier: 'L3_STRATEGY' as const, icon: Brain, agents: ALL_AGENTS.filter(a => a.tier === 'L3_STRATEGY') },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6"><Bot className="h-4 w-4 text-[#E50914]" /><span className="text-sm font-medium text-[#E50914]">113 Agents</span></div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">Agents IA <span className="text-[#E50914]">Cinema</span></h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Une équipe complète d&apos;experts IA couvrant chaque métier du cinéma. Du scénario à la distribution.</p>
        </div>
        {tiers.map(({ tier, icon: TIcon, agents }) => {
          const config = TIER_CONFIG[tier]
          return (
            <div key={tier} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <TIcon className="h-6 w-6" style={{ color: config.color }} />
                <h2 className="text-xl font-bold text-white">{config.label}</h2>
                <span className="text-xs text-gray-500">{agents.length} agents · {config.model}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {agents.map(a => (
                  <Link key={a.slug} href={`/agents/${a.slug}`} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-colors">
                    <p className="text-sm font-medium text-white">{a.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{a.description.substring(0, 60)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
        <div className="text-center mt-12">
          <Link href="/agents" className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl transition-colors"><Bot className="h-5 w-5" />Explorer tous les agents</Link>
        </div>
      </div>
    </div>
  )
}
