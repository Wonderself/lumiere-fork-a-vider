import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import * as autopilot from '@/lib/autopilot.service'
import { AutopilotActions } from '@/components/autopilot/autopilot-actions'
import {
  Bot, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  Clock, Activity, TrendingUp, RotateCcw, Zap,
  FileText, Shield, Briefcase, Heart,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Autopilot & Gouvernance — Admin CINEGENY',
  description: 'Tableau de bord de gouvernance autonome avec validation Telegram',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  DRAFT: { label: 'Draft', color: 'text-white/50', icon: FileText },
  PENDING_REVIEW: { label: 'En attente', color: 'text-yellow-600', icon: Clock },
  APPROVED: { label: 'Approved', color: 'text-blue-600', icon: CheckCircle2 },
  DENIED: { label: 'Rejected', color: 'text-red-400', icon: XCircle },
  EXECUTING: { label: 'Exécution', color: 'text-purple-600', icon: Zap },
  COMPLETED: { label: 'Completed', color: 'text-green-600', icon: CheckCircle2 },
  FAILED: { label: 'Failed', color: 'text-red-500', icon: AlertTriangle },
  ROLLED_BACK: { label: 'Cancelled', color: 'text-orange-600', icon: RotateCcw },
}

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  INFO: { label: 'Info', color: 'text-blue-600', bg: 'bg-blue-400/10' },
  WARNING: { label: 'Warning', color: 'text-yellow-600', bg: 'bg-yellow-400/10' },
  CRITICAL: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10' },
  URGENT: { label: 'Urgent', color: 'text-red-500', bg: 'bg-red-500/10' },
}

export default async function AutopilotPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const [stats, pending, recent, audits] = await Promise.all([
    autopilot.getProposalStats(),
    autopilot.getPendingProposals(10),
    autopilot.getProposals({ limit: 15 }),
    autopilot.getLatestAudits(),
  ])

  const kpis = [
    { label: 'Total proposals', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'En attente', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Approuvées', value: stats.approved + stats.completed, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Refusées', value: stats.denied, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: "Aujourd'hui", value: `${stats.todayCount}/50`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Urgentes (1h)', value: `${stats.urgentThisHour}/5`, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ]

  const auditCards = [
    { type: 'Health', data: audits.health, icon: Heart, color: 'text-emerald-600' },
    { type: 'Business', data: audits.business, icon: Briefcase, color: 'text-blue-600' },
    { type: 'Security', data: audits.security, icon: Shield, color: 'text-red-400' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Autopilot & Gouvernance
          </h1>
          <p className="text-sm text-white/50 mt-2">
            Propositions autonomes · Validation Telegram · Rollback possible
          </p>
        </div>
        <AutopilotActions />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border ${kpi.border} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
            </div>
          )
        })}
      </div>

      {/* Pending Queue */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          File d&apos;attente ({stats.pending})
        </h2>
        <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/5 overflow-hidden">
          {pending.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/50">
              Aucune proposition en attente
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {pending.map(p => {
                const sev = SEVERITY_CONFIG[p.severity] || SEVERITY_CONFIG.INFO
                return (
                  <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors">
                    {p.isUrgent && <span className="text-red-500 text-lg">🚨</span>}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{p.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${sev.bg} ${sev.color} font-medium`}>
                          {sev.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 truncate mt-0.5">{p.description.substring(0, 100)}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-white/50">
                        <span>{p.actionType.replace(/_/g, ' ')}</span>
                        <span>Risk: {p.riskScore}/100</span>
                        {p.agentSlug && <span>Agent: {p.agentSlug}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <form action={`/api/autopilot/proposals/${p.id}/approve`} method="POST">
                        <button className="px-3 py-1.5 text-xs bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors font-medium">
                          Approuver
                        </button>
                      </form>
                      <form action={`/api/autopilot/proposals/${p.id}/deny`} method="POST">
                        <button className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium">
                          Refuser
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Audit Reports */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          Derniers audits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {auditCards.map(audit => {
            const Icon = audit.icon
            return (
              <div key={audit.type} className="bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 ${audit.color}`} />
                  <h3 className="text-sm font-semibold text-white">{audit.type}</h3>
                  {audit.data && (
                    <span className={`ml-auto text-lg font-bold ${
                      (audit.data.score ?? 0) >= 80 ? 'text-green-500' :
                      (audit.data.score ?? 0) >= 50 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {audit.data.score ?? '—'}/100
                    </span>
                  )}
                </div>
                {audit.data ? (
                  <>
                    <p className="text-xs text-white/50 mb-2">{audit.data.summary}</p>
                    <div className="flex gap-3 text-[10px] text-white/50">
                      <span>{audit.data.checksRun} checks</span>
                      <span>{audit.data.issuesFound} issues</span>
                      <span>{audit.data.durationMs}ms</span>
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">
                      {audit.data.completedAt ? new Date(audit.data.completedAt).toLocaleString('fr-FR') : '—'}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-white/50">Aucun audit lancé</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Execution Journal */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Journal d&apos;exécution
        </h2>
        <div className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 bg-white/5 overflow-hidden">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/50">
              Aucune proposition enregistrée
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {recent.map(p => {
                const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.DRAFT
                const StIcon = st.icon
                const sev = SEVERITY_CONFIG[p.severity] || SEVERITY_CONFIG.INFO
                return (
                  <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${p.status === 'COMPLETED' ? 'bg-green-500/10' : p.status === 'FAILED' ? 'bg-red-500/10' : 'bg-white/[0.03]'}`}>
                      <StIcon className={`h-4 w-4 ${st.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{p.title}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${st.color} bg-white/[0.03]`}>{st.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${sev.color} ${sev.bg}`}>{sev.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[10px] text-white/50">
                        <span>{p.actionType.replace(/_/g, ' ')}</span>
                        {p.reviewedBy && <span>par {p.reviewedBy.displayName}</span>}
                        <span>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-white/50">Risk {p.riskScore}/100</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
