'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { USER_TIERS, DEMO_CONFIG, SIGNUP_BONUS, ONBOARDING_STEPS, GROWTH_AGENTS } from '@/data/growth'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Layers, Clock, Gift, CheckCircle2, Users, Bot,
  Crown, Eye, User, Zap, Shield, Settings,
  Star, Film, Share2, Compass, Activity,
} from 'lucide-react'

const STEP_ICONS: Record<string, typeof User> = {
  'user-plus': Users, user: User, star: Star, bot: Bot,
  film: Film, 'share-2': Share2, users: Users,
}

export default function OnboardingConfigPage() {
  const [tab, setTab] = useState<'tiers' | 'demo' | 'bonus' | 'steps'>('tiers')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Onboarding & Tiers</h1>
        <p className="text-sm text-white/50 mt-1">4 tiers · Comptes démo · Signup bonus · Étapes onboarding</p>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {GROWTH_AGENTS.slice(2, 6).map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} /><div><p className="text-[10px] font-medium text-white">{a.name}</p><p className="text-[9px] text-white/50">{a.role}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'tiers' as const, label: '4 Tiers', icon: Layers },
          { key: 'demo' as const, label: 'Comptes Démo', icon: Clock },
          { key: 'bonus' as const, label: 'Signup Bonus', icon: Gift },
          { key: 'steps' as const, label: 'Étapes Onboarding', icon: Compass },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
        })}
      </div>

      {/* TIERS */}
      {tab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {USER_TIERS.map(tier => {
            const TIER_ICONS: Record<string, typeof User> = { eye: Eye, clock: Clock, user: User, crown: Crown }
            const TIcon = TIER_ICONS[tier.icon] || User
            return (
              <div key={tier.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TIcon className="h-5 w-5" style={{ color: tier.color }} />
                  <h3 className="text-sm font-bold text-white">{tier.label}</h3>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] text-white/50 font-semibold uppercase">Limites quotidiennes</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <span className="text-white/50">IA: <span className="font-medium text-white">{tier.dailyLimits.aiRequests}/j</span></span>
                    <span className="text-white/50">Votes: <span className="font-medium text-white">{tier.dailyLimits.votes}/j</span></span>
                    <span className="text-white/50">Projets: <span className="font-medium text-white">{tier.dailyLimits.projects}</span></span>
                    <span className="text-white/50">Agents: <span className="font-medium text-white">{tier.dailyLimits.agents}</span></span>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {tier.features.map(f => (<p key={f} className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 shrink-0" />{f}</p>))}
                </div>
                {tier.restrictions.length > 0 && (
                  <div className="space-y-1">
                    {tier.restrictions.map(r => (<p key={r} className="text-[10px] text-red-400 flex items-center gap-1"><Shield className="h-3 w-3 shrink-0" />{r}</p>))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* DEMO */}
      {tab === 'demo' && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-lg space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" />Configuration comptes démo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[10px] text-white/50">Durée par défaut</p><p className="text-lg font-bold text-white">{DEMO_CONFIG.defaultDuration} jours</p></div>
            <div><p className="text-[10px] text-white/50">Durée max</p><p className="text-lg font-bold text-white">{DEMO_CONFIG.maxDuration} jours</p></div>
            <div><p className="text-[10px] text-white/50">Auto-désactivation</p><p className="text-lg font-bold text-green-600">{DEMO_CONFIG.autoDisableEnabled ? 'Oui (cron)' : 'Non'}</p></div>
            <div><p className="text-[10px] text-white/50">Rappel conversion</p><p className="text-lg font-bold text-white">J-{DEMO_CONFIG.conversionReminder}</p></div>
            <div><p className="text-[10px] text-white/50">Crédits initiaux</p><p className="text-lg font-bold text-[#E50914]">{microToCredits(DEMO_CONFIG.initialCredits).toFixed(0)} cr</p></div>
          </div>
        </div>
      )}

      {/* BONUS */}
      {tab === 'bonus' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 max-w-lg text-center">
          <Gift className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Signup Bonus</h2>
          <p className="text-3xl font-bold text-emerald-600 mb-2">{SIGNUP_BONUS.label}</p>
          <p className="text-sm text-white/50">{SIGNUP_BONUS.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-4"><p className="text-2xl font-bold text-[#E50914]">{microToCredits(SIGNUP_BONUS.credits).toFixed(0)}</p><p className="text-[10px] text-white/50">crédits IA</p></div>
            <div className="rounded-xl bg-white/5 p-4"><p className="text-2xl font-bold text-yellow-500">{SIGNUP_BONUS.xp}</p><p className="text-[10px] text-white/50">XP bonus</p></div>
          </div>
        </div>
      )}

      {/* STEPS */}
      {tab === 'steps' && (
        <div className="space-y-3 max-w-lg">
          <h2 className="text-sm font-semibold text-white mb-3">7 étapes d&apos;onboarding</h2>
          {ONBOARDING_STEPS.map((step, i) => {
            const SIcon = STEP_ICONS[step.icon] || Zap
            return (
              <div key={step.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="h-8 w-8 rounded-lg bg-[#E50914]/10 flex items-center justify-center text-sm font-bold text-[#E50914]">{i + 1}</div>
                <SIcon className="h-4 w-4 text-white/50" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{step.label}</p>
                  <p className="text-[10px] text-white/50">{step.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-yellow-500">+{step.xpReward} XP</p>
                  {step.creditReward > 0 && <p className="text-[10px] text-emerald-500">+{microToCredits(step.creditReward).toFixed(1)} cr</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
