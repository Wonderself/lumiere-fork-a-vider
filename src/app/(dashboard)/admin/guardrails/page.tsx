'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield, Activity, AlertTriangle, CheckCircle2, XCircle,
  Cpu, GitBranch, Zap, Eye, Lock, Unlock, RefreshCcw,
  BarChart3, Radio, Bell, BellOff, Server, Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

interface GuardrailsData {
  mode: { mode: string; since?: string; changedBy?: string }
  circuits: { total: number; open: number; suspended: number; healthy: number }
  loops: { activeChains: number; maxDepthSeen: number }
  modelDistribution: Record<string, { count: number; percent: number }>
  providers: { total: number; healthy: number; degraded: number; down: number }
  alerts: { total: number; unacknowledged: number; bySeverity: Record<string, number>; byModule: Record<string, number> }
  activeChains: Array<{ id: string; userId: string; depth: number; agents: string[]; durationMs: number }>
  recentAlerts: Array<{ id: string; module: string; severity: string; title: string; message: string; timestamp: number; acknowledged: boolean }>
  allProviders: Array<{ name: string; type: string; healthy: boolean; latencyMs: number; errorCount: number }>
  recentRoutings: Array<{ model: string; reason: string; tier: string }>
}

export default function GuardrailsPage() {
  const [data, setData] = useState<GuardrailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/guardrails')
      if (res.ok) setData(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    if (!autoRefresh) return
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData, autoRefresh])

  async function performAction(action: string, params: Record<string, unknown> = {}) {
    try {
      const res = await fetch('/api/guardrails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params }),
      })
      if (res.ok) {
        toast.success('Action exécutée')
        fetchData()
      } else {
        toast.error('Action échouée')
      }
    } catch { toast.error('Erreur') }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    )
  }

  const isProduction = data.mode.mode === 'production'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Guardrails Monitor
          </h1>
          <p className="text-sm text-white/50 mt-1">10 modules de protection · Auto-refresh {autoRefresh ? '5s' : 'off'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${autoRefresh ? 'bg-green-500/10 text-green-500' : 'bg-white/[0.05] text-white/50'}`}
          >
            {autoRefresh ? <Radio className="h-3.5 w-3.5 animate-pulse" /> : <Radio className="h-3.5 w-3.5" />}
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] text-white/60 hover:bg-white/[0.08]">
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className={`rounded-2xl border p-4 sm:p-5 ${isProduction ? 'border-green-500/20 bg-green-500/10' : 'border-orange-500/20 bg-orange-500/10'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isProduction ? <Unlock className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-orange-600" />}
            <div>
              <p className={`text-sm font-semibold ${isProduction ? 'text-green-500' : 'text-orange-500'}`}>
                Mode: {data.mode.mode.toUpperCase()}
              </p>
              {data.mode.changedBy && (
                <p className="text-[10px] text-white/50">Par {data.mode.changedBy} {data.mode.since ? `le ${new Date(data.mode.since).toLocaleString('fr-FR')}` : ''}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => performAction('set_mode', { mode: isProduction ? 'maintenance' : 'production' })}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium ${isProduction ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
          >
            Basculer en {isProduction ? 'Maintenance' : 'Production'}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Circuits', value: `${data.circuits.healthy}/${data.circuits.total}`, icon: GitBranch, color: data.circuits.open > 0 ? 'text-red-500' : 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Providers', value: `${data.providers.healthy}/${data.providers.total}`, icon: Server, color: data.providers.down > 0 ? 'text-red-500' : 'text-green-500', bg: 'bg-blue-500/10' },
          { label: 'Chaînes actives', value: data.loops.activeChains, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Alertes', value: data.alerts.unacknowledged, icon: AlertTriangle, color: data.alerts.unacknowledged > 0 ? 'text-red-500' : 'text-green-500', bg: 'bg-yellow-500/10' },
          { label: 'Critical', value: data.alerts.bySeverity.critical || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
          { label: 'Suspended', value: data.circuits.suspended, icon: Shield, color: data.circuits.suspended > 0 ? 'text-orange-500' : 'text-green-500', bg: 'bg-orange-500/10' },
        ].map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-xl border border-white/10 ${kpi.bg} p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Model Distribution */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Distribution modèles
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            {Object.keys(data.modelDistribution).length === 0 ? (
              <p className="text-sm text-white/50 text-center py-4">Pas encore de données</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(data.modelDistribution).map(([model, stats]) => {
                  const color = model.includes('haiku') ? 'bg-green-500' : model.includes('opus') ? 'bg-purple-500' : 'bg-blue-500'
                  return (
                    <div key={model}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">{model}</span>
                        <span className="text-white/50">{stats.count} ({stats.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${stats.percent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Providers Health */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-emerald-500" />
            APIs externes
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="divide-y divide-white/10">
              {data.allProviders.map(p => (
                <div key={p.name} className="flex items-center gap-3 p-3 hover:bg-white/[0.03]">
                  <div className={`h-2.5 w-2.5 rounded-full ${p.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{p.name}</p>
                    <p className="text-[10px] text-white/50">{p.type}</p>
                  </div>
                  <div className="text-right">
                    {p.latencyMs > 0 && <p className="text-[10px] text-white/50">{p.latencyMs}ms</p>}
                    {p.errorCount > 0 && <p className="text-[10px] text-red-600">{p.errorCount} errors</p>}
                  </div>
                  {!p.healthy && (
                    <button onClick={() => performAction('mark_healthy', { provider: p.name })} className="text-[10px] text-blue-500 hover:underline">
                      Reset
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            Alertes récentes
          </h2>
          {data.alerts.unacknowledged > 0 && (
            <button onClick={() => performAction('acknowledge_all')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              <BellOff className="h-3.5 w-3.5" /> Tout acquitter
            </button>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {data.recentAlerts.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/50">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              Aucune alerte
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {data.recentAlerts.map(alert => {
                const sevColor = alert.severity === 'critical' ? 'text-red-400 bg-red-500/10' : alert.severity === 'high' ? 'text-orange-400 bg-orange-500/10' : alert.severity === 'medium' ? 'text-yellow-400 bg-yellow-500/10' : 'text-blue-400 bg-blue-500/10'
                return (
                  <div key={alert.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 ${alert.acknowledged ? 'opacity-50' : ''}`}>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium self-start ${sevColor}`}>{alert.severity}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{alert.title}</p>
                      <p className="text-xs text-white/50 truncate">{alert.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-white/50">{alert.module}</span>
                      {!alert.acknowledged && (
                        <button onClick={() => performAction('acknowledge_alert', { id: alert.id })} className="text-[10px] text-blue-500 hover:underline">
                          Ack
                        </button>
                      )}
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
