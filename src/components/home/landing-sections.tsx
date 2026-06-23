'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FAQ_CATEGORIES, TRUST_BADGES, DEMO_SCENARIOS } from '@/data/landing-content'
import {
  Camera, Shield, Lock, EyeOff, FileCheck, ShieldCheck,
  Bot, ChevronDown, Play, ArrowRight, Sparkles,
  PenTool, Image, TrendingUp, Zap, HelpCircle,
  Film, Video, Star,
} from 'lucide-react'

const BADGE_ICONS: Record<string, typeof Shield> = {
  shield: Shield, lock: Lock, 'eye-off': EyeOff,
  'file-check': FileCheck, 'shield-check': ShieldCheck, bot: Bot,
}

// ─── Studio Showcase Section ────────────────────────────────────────

export function StudioShowcaseSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Camera className="h-3.5 w-3.5 text-[#E50914]" />
            Studio Créatif IA
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Créez avec l&apos;<span className="text-[#E50914]">IA</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Photos, vidéos, affiches, bandes-annonces — tout est généré par nos agents IA cinéma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Photos & Storyboards', desc: '5 styles, 4 ratios, HD quality', icon: Image, color: '#3B82F6', href: '/studio' },
            { title: 'AI Videos', desc: '7 providers, up to 15s, async', icon: Video, color: '#E50914', href: '/studio' },
            { title: 'Affiches & Trailers', desc: 'Inventez un film, l\'IA fait le reste', icon: Film, color: '#8B5CF6', href: '/trailer-maker' },
          ].map(item => {
            const Icon = item.icon
            return (
              <Link key={item.title} href={item.href} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-[#E50914]/30 transition-all">
                <Icon className="h-10 w-10 mb-4" style={{ color: item.color }} />
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E50914] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                <span className="text-xs text-[#E50914] flex items-center gap-1 group-hover:gap-2 transition-all">Discover <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Why CineGeny Section ────────────────────────────────────────────

export function WhyCineGenySection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pourquoi <span className="text-[#E50914]">CineGeny</span> ?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            La plateforme de cinéma participatif la plus complète, propulsée par 113 agents IA.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {TRUST_BADGES.map(badge => {
            const Icon = BADGE_ICONS[badge.icon] || Shield
            return (
              <div key={badge.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: badge.color }} />
                <p className="text-xs font-semibold text-white">{badge.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{badge.detail}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '200+ Pages', detail: 'Complete ready-to-use app', icon: '📱' },
            { title: '113 Agents IA', detail: 'Every film craft covered', icon: '🤖' },
            { title: '0% Commission', detail: 'Real AI token cost only', icon: '💚' },
          ].map(stat => (
            <div key={stat.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <span className="text-3xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-white mt-3">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Demo Section ───────────────────────────────────────────────────

export function DemoSection() {
  const DEMO_ICONS: Record<string, typeof PenTool> = { 'pen-tool': PenTool, image: Image, 'trending-up': TrendingUp }

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Play className="h-3.5 w-3.5 text-[#E50914]" />
            Essayez maintenant
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Démo <span className="text-[#E50914]">Interactive</span>
          </h2>
          <p className="text-gray-400">Testez CineGeny sans inscription</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_SCENARIOS.map(demo => {
            const DIcon = DEMO_ICONS[demo.icon] || Zap
            return (
              <div key={demo.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-[#E50914]/20 transition-all">
                <DIcon className="h-8 w-8 mb-4" style={{ color: demo.color }} />
                <h3 className="text-lg font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{demo.description}</p>
                <ol className="space-y-2 mb-6">
                  {demo.steps.map((step, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="h-5 w-5 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <Link href={demo.id === 'poster-generate' ? '/poster-maker' : demo.id === 'investment-analysis' ? '/agents/cg-investment-strategist' : '/chat'} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-semibold rounded-xl transition-colors">
                  <Play className="h-4 w-4" /> Essayer
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ────────────────────────────────────────────────────

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].id)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const CAT_ICONS: Record<string, typeof HelpCircle> = {
    'help-circle': HelpCircle, 'trending-up': TrendingUp, film: Film, zap: Zap, shield: Shield,
  }

  function toggleItem(q: string) {
    setOpenItems(prev => { const next = new Set(prev); next.has(q) ? next.delete(q) : next.add(q); return next })
  }

  const activeCat = FAQ_CATEGORIES.find(c => c.id === activeCategory)!

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Questions <span className="text-[#E50914]">Frequent</span></h2>
          <p className="text-gray-400">5 catégories · {FAQ_CATEGORIES.reduce((s, c) => s + c.items.length, 0)} questions</p>
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {FAQ_CATEGORIES.map(cat => {
            const CIcon = CAT_ICONS[cat.icon] || HelpCircle
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${activeCategory === cat.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1]'}`}>
                <CIcon className="h-3.5 w-3.5" />{cat.label}
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          {activeCat.items.map(item => (
            <div key={item.q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button onClick={() => toggleItem(item.q)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="text-sm font-medium text-white">{item.q}</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${openItems.has(item.q) ? 'rotate-180' : ''}`} />
              </button>
              {openItems.has(item.q) && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
