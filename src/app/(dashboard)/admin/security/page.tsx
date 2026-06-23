import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Shield, Activity, Clock, User, BarChart3, TrendingUp } from 'lucide-react'
import { getAuditLogAction, getAuditStatsAction } from '@/app/actions/audit'
import { TwoFactorSetup } from './two-factor-setup'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Security — CINEGENY Admin' }

export default async function SecurityPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [auditResult, statsResult] = await Promise.all([
    getAuditLogAction(1),
    getAuditStatsAction(),
  ])

  const logs = 'logs' in auditResult ? auditResult.logs as {
    id: string
    action: string
    entity: string
    entityId: string | null
    ip: string
    createdAt: Date
    userId: string
    displayName: string | null
  }[] : []

  const stats = 'totalToday' in statsResult ? statsResult : null
  const totalPages = 'totalPages' in auditResult ? auditResult.totalPages : 0
  const total = 'total' in auditResult ? auditResult.total : 0

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Sécurité & 2FA
        </h1>
        <p className="text-sm text-white/50 mt-1">Authentification 2 facteurs et journal d&apos;audit</p>
      </div>

      {/* 2FA Setup (client component) */}
      <TwoFactorSetup />

      {/* Audit Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Aujourd&apos;hui</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalToday}</p>
            <p className="text-[10px] text-white/40 mt-0.5">events</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="text-[10px] text-white/50 uppercase tracking-wider">7 derniers jours</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalThisWeek}</p>
            <p className="text-[10px] text-white/40 mt-0.5">events</p>
          </div>
          {stats.topActors.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-green-400" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Top acteur</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{stats.topActors[0].displayName || 'Anonyme'}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{stats.topActors[0].count} actions</p>
            </div>
          )}
          {stats.topActions.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-400" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Frequent action</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{stats.topActions[0].action}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{stats.topActions[0].count} fois</p>
            </div>
          )}
        </div>
      )}

      {/* Audit Logs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Journal d&apos;audit
          </h2>
          {total > 0 && (
            <span className="text-xs text-white/30">{total} entrées · page 1/{totalPages}</span>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {'error' in auditResult ? (
            <div className="p-8 text-center text-sm text-red-400">
              Erreur : {auditResult.error}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/40">
              Aucune entrée dans le journal d&apos;audit.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0 bg-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {log.action}
                        {log.entity && (
                          <span className="ml-2 text-[10px] text-white/40 font-normal">[{log.entity}{log.entityId ? ` #${log.entityId.slice(0, 8)}` : ''}]</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-white/50">
                        <User className="h-3 w-3" />
                        {log.displayName || log.userId.slice(0, 12) + '…'}
                        <span>·</span>
                        <span>{log.ip}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0 pl-5 sm:pl-0">
                    <p className="text-[10px] text-white/50 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Top Actors breakdown */}
        {stats && stats.topActors.length > 1 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-white/70 mb-3">Top 5 acteurs (7 jours)</h3>
            <div className="space-y-2">
              {stats.topActors.map((actor, i) => (
                <div key={actor.userId} className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02]">
                  <span className="text-[10px] text-white/30 w-4 text-center">{i + 1}</span>
                  <span className="text-sm text-white flex-1">{actor.displayName || actor.userId.slice(0, 12) + '…'}</span>
                  <span className="text-xs text-white/50">{actor.count} actions</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
