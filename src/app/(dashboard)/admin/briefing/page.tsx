'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { SAMPLE_IMPROVEMENTS, SAMPLE_ATTACK_PLAN, IMPROVEMENT_CATEGORIES, BRIEFING_AGENTS } from '@/data/briefing'
import type { ImprovementProposal } from '@/data/briefing'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Sun, Lightbulb, Target, Send, Loader2, Bot,
  TrendingUp, BarChart3, Zap, Clock, CheckCircle2,
  XCircle, AlertTriangle, RefreshCcw, Filter, Eye,
  Plug, Link, Smile, Activity,
} from 'lucide-react'

const CAT_ICONS: Record<string, typeof Plug> = {
  'plug': Plug, 'bar-chart': BarChart3, 'link': Link,
  'trending-up': TrendingUp, 'zap': Zap, 'smile': Smile,
}

export default function BriefingPage() {
  const [tab, setTab] = useState<'briefing' | 'improvements' | 'plan'>('briefing')
  const [loading, setLoading] = useState(false)
  const [briefingData, setBriefingData] = useState<any>(null)
  const [improvements, setImprovements] = useState<ImprovementProposal[]>(SAMPLE_IMPROVEMENTS)
  const [filterCat, setFilterCat] = useState('all')
  const [filterImpact, setFilterImpact] = useState('all')

  useEffect(() => {
    // Simulate loading briefing
    setBriefingData({
      date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      newUsers: 3, totalUsers: 47, aiRequests: 156, revenue: 12_500_000,
      pendingProposals: 2, errors: 1, conversations: 23, tasksCompleted: 5,
    })
  }, [])

  async function sendToTelegram(type: string) {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast.success(`${type} envoyé sur Telegram`)
  }

  function updateStatus(id: string, status: 'accepted' | 'rejected') {
    setImprovements(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    toast.success(status === 'accepted' ? 'Amélioration acceptée' : 'Amélioration rejetée')
  }

  const filteredImprovements = improvements
    .filter(i => filterCat === 'all' || i.category === filterCat)
    .filter(i => filterImpact === 'all' || i.impact === filterImpact)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Briefing & Intelligence</h1>
        <p className="text-sm text-white/50 mt-1">Briefing matinal · Améliorations IA · Plan d&apos;attaque quotidien</p>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {BRIEFING_AGENTS.map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div><p className="text-[10px] font-medium text-white">{a.name}</p><p className="text-[9px] text-white/50">{a.role}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'briefing' as const, label: 'Briefing Matinal', icon: Sun },
          { key: 'improvements' as const, label: `Améliorations (${improvements.filter(i => i.status === 'proposed').length})`, icon: Lightbulb },
          { key: 'plan' as const, label: 'Plan d\'Attaque', icon: Target },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
        })}
      </div>

      {/* BRIEFING */}
      {tab === 'briefing' && briefingData && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sun className="h-6 w-6 text-yellow-500" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Briefing Matinal</h2>
                  <p className="text-xs text-white/50">{briefingData.date}</p>
                </div>
              </div>
              <button onClick={() => sendToTelegram('Briefing')} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 disabled:opacity-50 self-start sm:self-auto">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Envoyer Telegram
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Nouveaux users', value: `+${briefingData.newUsers}`, total: briefingData.totalUsers, icon: TrendingUp, color: 'text-blue-600' },
                { label: 'Requêtes IA', value: briefingData.aiRequests, icon: Zap, color: 'text-orange-600' },
                { label: 'Revenue', value: `${microToCredits(briefingData.revenue).toFixed(1)} cr`, icon: BarChart3, color: 'text-green-600' },
                { label: 'Conversations', value: briefingData.conversations, icon: Activity, color: 'text-purple-600' },
                { label: 'Tâches validées', value: briefingData.tasksCompleted, icon: CheckCircle2, color: 'text-emerald-600' },
                { label: 'Erreurs', value: briefingData.errors, icon: AlertTriangle, color: briefingData.errors > 3 ? 'text-red-600' : 'text-white/50' },
                { label: 'Propositions', value: briefingData.pendingProposals, icon: Clock, color: 'text-yellow-600' },
              ].map(stat => {
                const SIcon = stat.icon
                return (
                  <div key={stat.label} className="rounded-xl bg-white/5 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <SIcon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-[10px] text-white/50">{stat.label}</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* IMPROVEMENTS */}
      {tab === 'improvements' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">
                <option value="all">Toutes catégories</option>
                {IMPROVEMENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select value={filterImpact} onChange={e => setFilterImpact(e.target.value)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">
                <option value="all">Tout impact</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button onClick={() => sendToTelegram('Review améliorations')} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 disabled:opacity-50">
              <Send className="h-3.5 w-3.5" />Envoyer Telegram
            </button>
          </div>

          {filteredImprovements.map((imp, i) => {
            const catConf = IMPROVEMENT_CATEGORIES.find(c => c.id === imp.category)
            const CIcon = CAT_ICONS[catConf?.icon || 'plug'] || Lightbulb
            const impactColor = imp.impact === 'high' ? 'text-red-400 bg-red-500/10' : imp.impact === 'medium' ? 'text-yellow-400 bg-yellow-500/10' : 'text-green-400 bg-green-500/10'
            const effortColor = imp.effort === 'low' ? 'text-green-600' : imp.effort === 'medium' ? 'text-yellow-600' : 'text-red-600'

            return (
              <div key={imp.id} className={`rounded-xl border bg-white/5 p-5 ${imp.status === 'accepted' ? 'border-green-500/30' : imp.status === 'rejected' ? 'border-white/10 opacity-50' : 'border-white/10'}`}>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: `${catConf?.color}15`, color: catConf?.color }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{imp.title}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${impactColor}`}>Impact: {imp.impact}</span>
                      <span className={`text-[9px] ${effortColor}`}>Effort: {imp.effort}</span>
                    </div>
                    <p className="text-xs text-white/50 mb-2">{imp.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/50">
                      <CIcon className="h-3 w-3" style={{ color: catConf?.color }} />
                      <span>{catConf?.label}</span>
                      <span>·</span>
                      <span>🤖 {imp.source}</span>
                    </div>
                  </div>
                  {imp.status === 'proposed' && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => updateStatus(imp.id, 'accepted')} className="px-2 py-1 rounded text-xs bg-green-500/15 text-green-400 hover:bg-green-500/25">✓</button>
                      <button onClick={() => updateStatus(imp.id, 'rejected')} className="px-2 py-1 rounded text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25">✗</button>
                    </div>
                  )}
                  {imp.status === 'accepted' && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
                  {imp.status === 'rejected' && <XCircle className="h-5 w-5 text-white/50 shrink-0" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ATTACK PLAN */}
      {tab === 'plan' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Target className="h-5 w-5 text-[#E50914]" />Plan d&apos;Attaque — Aujourd&apos;hui</h2>
            <button onClick={() => sendToTelegram('Plan d\'attaque')} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-50 self-start sm:self-auto">
              <Send className="h-3.5 w-3.5" />Envoyer Telegram
            </button>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/[0.08]" />
            {SAMPLE_ATTACK_PLAN.map((item, i) => {
              const prioColor = item.priority === 'must' ? 'border-red-500/30 bg-red-500/10' : item.priority === 'should' ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-green-500/30 bg-green-500/10'
              const dotColor = item.priority === 'must' ? 'bg-red-500' : item.priority === 'should' ? 'bg-yellow-500' : 'bg-green-500'
              return (
                <div key={i} className="relative mb-4">
                  <div className={`absolute -left-5 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center z-10 ${dotColor}`}>
                    <span className="text-[8px] text-white font-bold">{item.time.split(':')[0]}</span>
                  </div>
                  <div className={`rounded-xl border-l-4 bg-white/5 p-4 ml-4 ${prioColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-white/50" />
                      <span className="text-[10px] text-white/50">{item.time}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.priority === 'must' ? 'bg-red-500/15 text-red-400' : item.priority === 'should' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'}`}>{item.priority}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-white/50">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
