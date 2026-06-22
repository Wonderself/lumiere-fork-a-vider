import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle, Shield, Server, Clock, Gavel,
  Zap, CheckCircle, XCircle, AlertCircle,
  ChevronRight, Activity, Users, Eye, RefreshCcw,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Interventions Requises' }

type SeverityLevel = 'critical' | 'warning' | 'ok'

function SeverityBadge({ level, count }: { level: SeverityLevel; count: number }) {
  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    ok: 'bg-green-500/20 text-green-600 border-green-500/30',
  }
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colors[level]}`}>
      {count}
    </span>
  )
}

function StatusDot({ status }: { status: 'up' | 'down' | 'degraded' }) {
  const colors = {
    up: 'bg-green-400',
    down: 'bg-red-400 animate-pulse',
    degraded: 'bg-yellow-400 animate-pulse',
  }
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />
}

export default async function InterventionsPage() {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/dashboard')

  // ============================
  // DATA FETCHING
  // ============================

  const [
    lowScoreSubmissions,
    claimedTasks,
    disputedOrders,
    rejectedSubmissions,
    disputedSubmissions,
    pendingAiSubmissions,
  ] = await Promise.all([
    // Validation Queue: submissions with aiScore < 80
    prisma.taskSubmission.count({
      where: {
        OR: [
          { aiScore: { lt: 80 }, status: 'AI_FLAGGED' },
          { status: 'PENDING_AI' },
        ],
      },
    }),
    // Race conditions: tasks claimed by users (find potential conflicts)
    prisma.task.findMany({
      where: { status: 'CLAIMED', claimedById: { not: null } },
      select: {
        id: true,
        title: true,
        claimedById: true,
        claimedAt: true,
        submissions: {
          select: { userId: true, status: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    // Disputed orders
    prisma.videoOrder.count({ where: { status: 'DISPUTED' } }),
    // Rejected submissions (recent, last 7 days)
    prisma.taskSubmission.count({
      where: {
        status: 'REJECTED',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    // Disputed-like submissions (AI_FLAGGED that need manual review)
    prisma.taskSubmission.findMany({
      where: { status: 'AI_FLAGGED' },
      include: {
        task: { select: { title: true, priceEuros: true } },
        user: { select: { displayName: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }),
    // Pending AI
    prisma.taskSubmission.count({ where: { status: 'PENDING_AI' } }),
  ])

  // Race conditions: tasks with multiple distinct submitters
  const raceConditions = claimedTasks.filter(task => {
    const uniqueSubmitters = new Set(task.submissions.map(s => s.userId))
    return uniqueSubmitters.size > 1
  })

  const totalDisputes = disputedOrders + rejectedSubmissions

  // ============================
  // API STATUS (MOCKED)
  // ============================

  const apiStatuses: {
    name: string
    status: 'up' | 'down' | 'degraded'
    latency: string
    quota: number
    icon: typeof Server
  }[] = [
    { name: 'Claude API', status: 'up', latency: '120ms', quota: 72, icon: Zap },
    { name: 'ElevenLabs', status: 'up', latency: '340ms', quota: 45, icon: Activity },
    { name: 'Runway', status: 'degraded', latency: '890ms', quota: 23, icon: RefreshCcw },
    { name: 'Stripe', status: 'up', latency: '95ms', quota: 100, icon: Shield },
  ]

  // ============================
  // RATE LIMITS (MOCKED)
  // ============================

  const rateLimits = [
    { name: 'Claude API (Opus)', used: 72, max: 100, color: '#E50914' },
    { name: 'ElevenLabs TTS', used: 45, max: 100, color: '#3b82f6' },
    { name: 'Runway Gen-3', used: 23, max: 100, color: '#a855f7' },
    { name: 'Stripe Payouts', used: 8, max: 100, color: '#22c55e' },
    { name: 'Email (Resend)', used: 67, max: 100, color: '#f59e0b' },
  ]

  // ============================
  // SEVERITY CALCULATIONS
  // ============================

  const validationSeverity: SeverityLevel = lowScoreSubmissions > 10 ? 'critical' : lowScoreSubmissions > 3 ? 'warning' : 'ok'
  const raceSeverity: SeverityLevel = raceConditions.length > 0 ? 'critical' : 'ok'
  const disputeSeverity: SeverityLevel = totalDisputes > 5 ? 'critical' : totalDisputes > 0 ? 'warning' : 'ok'
  const apiSeverity: SeverityLevel = apiStatuses.some(a => a.status === 'down') ? 'critical' : apiStatuses.some(a => a.status === 'degraded') ? 'warning' : 'ok'
  const rateSeverity: SeverityLevel = rateLimits.some(r => r.used > 90) ? 'critical' : rateLimits.some(r => r.used > 70) ? 'warning' : 'ok'

  const totalCritical = [validationSeverity, raceSeverity, disputeSeverity, apiSeverity, rateSeverity].filter(s => s === 'critical').length
  const totalWarning = [validationSeverity, raceSeverity, disputeSeverity, apiSeverity, rateSeverity].filter(s => s === 'warning').length

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
            Interventions Requises
          </h1>
          <p className="text-white/50">Tableau de bord operationnel — actions prioritaires</p>
        </div>
        <div className="flex items-center gap-3">
          {totalCritical > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">{totalCritical} critique{totalCritical > 1 ? 's' : ''}</span>
            </div>
          )}
          {totalWarning > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-600">{totalWarning} avertissement{totalWarning > 1 ? 's' : ''}</span>
            </div>
          )}
          {totalCritical === 0 && totalWarning === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-green-600">Tout est OK</span>
            </div>
          )}
        </div>
      </div>

      {/* ============================
          SECTION A: API Status
          ============================ */}
      <div className={`rounded-xl border p-6 ${
        apiSeverity === 'critical' ? 'border-red-500/30 bg-red-500/5'
        : apiSeverity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5'
        : 'border-green-500/20 bg-green-500/5'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Server className={`h-5 w-5 ${
              apiSeverity === 'critical' ? 'text-red-400' : apiSeverity === 'warning' ? 'text-yellow-600' : 'text-green-600'
            }`} />
            <h2 className="text-lg font-semibold">Statut des APIs</h2>
          </div>
          <SeverityBadge
            level={apiSeverity}
            count={apiStatuses.filter(a => a.status !== 'up').length}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {apiStatuses.map((api) => (
            <div key={api.name} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <api.icon className="h-4 w-4 text-white/40" />
                <StatusDot status={api.status} />
              </div>
              <div className="text-sm font-medium mb-1">{api.name}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Latence</span>
                <span className={`font-medium ${
                  api.status === 'down' ? 'text-red-400' : api.status === 'degraded' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {api.status === 'down' ? 'HORS LIGNE' : api.latency}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-white/30 mb-1">
                  <span>Quota</span>
                  <span>{api.quota}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      api.quota > 80 ? 'bg-red-500' : api.quota > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${api.quota}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================
          SECTION B: Validation Queue
          ============================ */}
      <div className={`rounded-xl border p-6 ${
        validationSeverity === 'critical' ? 'border-red-500/30 bg-red-500/5'
        : validationSeverity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5'
        : 'border-white/10 bg-white/[0.02]'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Eye className={`h-5 w-5 ${
              validationSeverity === 'critical' ? 'text-red-400' : validationSeverity === 'warning' ? 'text-yellow-600' : 'text-green-600'
            }`} />
            <h2 className="text-lg font-semibold">Queue de Validation</h2>
            <span className="text-xs text-white/40">Soumissions avec aiScore &lt; 80%</span>
          </div>
          <div className="flex items-center gap-3">
            <SeverityBadge level={validationSeverity} count={lowScoreSubmissions} />
            <Link href="/admin/reviews">
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914]/20 transition-colors">
                Reviewer <ChevronRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-xs text-white/40 mb-1">Flaggees IA</div>
            <div className="text-2xl font-bold text-yellow-600">{lowScoreSubmissions - pendingAiSubmissions}</div>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-xs text-white/40 mb-1">En attente IA</div>
            <div className="text-2xl font-bold text-blue-600">{pendingAiSubmissions}</div>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-xs text-white/40 mb-1">Total a traiter</div>
            <div className="text-2xl font-bold text-white">{lowScoreSubmissions}</div>
          </div>
        </div>

        {disputedSubmissions.length > 0 && (
          <div className="space-y-2">
            {disputedSubmissions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/10">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  (sub.aiScore ?? 0) < 40 ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{sub.user.displayName} &rarr; {sub.task.title}</p>
                  <p className="text-[10px] text-white/30">Score IA: {sub.aiScore ?? 'N/A'}/100</p>
                </div>
                <span className="text-xs text-[#E50914] shrink-0">{sub.task.priceEuros}EUR</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================
          SECTION C: Race Conditions
          ============================ */}
      <div className={`rounded-xl border p-6 ${
        raceSeverity === 'critical' ? 'border-red-500/30 bg-red-500/5'
        : 'border-white/10 bg-white/[0.02]'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Users className={`h-5 w-5 ${raceSeverity === 'critical' ? 'text-red-400' : 'text-green-600'}`} />
            <h2 className="text-lg font-semibold">Race Conditions</h2>
            <span className="text-xs text-white/40">Conflits de reclamation de taches</span>
          </div>
          <SeverityBadge level={raceSeverity} count={raceConditions.length} />
        </div>

        {raceConditions.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Aucun conflit detecte</p>
              <p className="text-xs text-white/30">Toutes les taches reclamees ont un seul contributeur</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {raceConditions.map((task) => {
              const uniqueSubmitters = [...new Set(task.submissions.map(s => s.userId))]
              return (
                <div key={task.id} className="flex items-center gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-white/40">
                      {uniqueSubmitters.length} utilisateurs differents ont soumis pour cette tache
                    </p>
                  </div>
                  <Link href={`/admin/tasks/${task.id}/edit`}>
                    <button className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      Resoudre
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ============================
          SECTION D: Disputes
          ============================ */}
      <div className={`rounded-xl border p-6 ${
        disputeSeverity === 'critical' ? 'border-red-500/30 bg-red-500/5'
        : disputeSeverity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5'
        : 'border-white/10 bg-white/[0.02]'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Gavel className={`h-5 w-5 ${
              disputeSeverity === 'critical' ? 'text-red-400' : disputeSeverity === 'warning' ? 'text-yellow-600' : 'text-green-600'
            }`} />
            <h2 className="text-lg font-semibold">Disputes</h2>
            <span className="text-xs text-white/40">Commandes et soumissions contestees</span>
          </div>
          <SeverityBadge level={disputeSeverity} count={totalDisputes} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 border ${
            disputedOrders > 0 ? 'border-red-500/20 bg-red-500/5' : 'border-white/10 bg-black/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Commandes Video Disputees</span>
              {disputedOrders > 0 ? (
                <XCircle className="h-4 w-4 text-red-400" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
            <div className={`text-3xl font-bold ${disputedOrders > 0 ? 'text-red-400' : 'text-green-600'}`}>
              {disputedOrders}
            </div>
            <p className="text-[10px] text-white/30 mt-1">VideoOrders en statut DISPUTED</p>
          </div>

          <div className={`rounded-lg p-4 border ${
            rejectedSubmissions > 0 ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/10 bg-black/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Soumissions Rejetees (7j)</span>
              {rejectedSubmissions > 0 ? (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
            <div className={`text-3xl font-bold ${rejectedSubmissions > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {rejectedSubmissions}
            </div>
            <p className="text-[10px] text-white/30 mt-1">TaskSubmissions rejetees cette semaine</p>
          </div>
        </div>

        {totalDisputes > 0 && (
          <div className="mt-4 flex gap-3">
            <Link href="/admin/reviews" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors">
                <Eye className="h-3.5 w-3.5" /> Voir les Reviews
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* ============================
          SECTION E: Rate Limits
          ============================ */}
      <div className={`rounded-xl border p-6 ${
        rateSeverity === 'critical' ? 'border-red-500/30 bg-red-500/5'
        : rateSeverity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5'
        : 'border-white/10 bg-white/[0.02]'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Zap className={`h-5 w-5 ${
              rateSeverity === 'critical' ? 'text-red-400' : rateSeverity === 'warning' ? 'text-yellow-600' : 'text-green-600'
            }`} />
            <h2 className="text-lg font-semibold">Quotas API</h2>
            <span className="text-xs text-white/40">Utilisation des quotas</span>
          </div>
          <SeverityBadge
            level={rateSeverity}
            count={rateLimits.filter(r => r.used > 70).length}
          />
        </div>

        <div className="space-y-4">
          {rateLimits.map((limit) => {
            const percentage = limit.used
            const isHigh = percentage > 80
            const isMedium = percentage > 60
            return (
              <div key={limit.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{limit.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      isHigh ? 'text-red-400' : isMedium ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {percentage}%
                    </span>
                    {isHigh && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                      background: isHigh
                        ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                        : isMedium
                        ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                        : `linear-gradient(90deg, ${limit.color}, ${limit.color}cc)`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Eye, label: 'Queue Reviews', href: '/admin/reviews', color: 'text-yellow-600' },
          { icon: Users, label: 'Utilisateurs', href: '/admin/users', color: 'text-blue-600' },
          { icon: Activity, label: 'Analytics', href: '/admin/analytics', color: 'text-purple-600' },
          { icon: Shield, label: 'Parametres', href: '/admin/settings', color: 'text-green-600' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#E50914]/20 transition-all text-center">
              <action.icon className={`h-5 w-5 ${action.color} mx-auto mb-2`} />
              <p className="text-sm font-medium">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
