/**
 * CineGeny Infrastructure Service
 * Health, metrics, events, state management.
 */

import { prisma } from '@/lib/prisma'
import { calculateAutonomyScore, EXTENDED_CRON_JOBS } from '@/data/infrastructure'
import type { SystemEvent } from '@/data/infrastructure'

// ─── Health Check ───────────────────────────────────────────────────

export interface HealthReport {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  checks: Array<{ name: string; status: 'ok' | 'warning' | 'error'; latencyMs: number; detail: string }>
  timestamp: Date
}

export async function getHealthReport(): Promise<HealthReport> {
  const checks: HealthReport['checks'] = []
  const startTotal = Date.now()

  // DB check
  try {
    const dbStart = Date.now()
    await prisma.user.count()
    checks.push({ name: 'PostgreSQL', status: 'ok', latencyMs: Date.now() - dbStart, detail: 'Connected' })
  } catch {
    checks.push({ name: 'PostgreSQL', status: 'error', latencyMs: 0, detail: 'Connection failed' })
  }

  // Memory
  const mem = process.memoryUsage()
  const heapPct = (mem.heapUsed / mem.heapTotal) * 100
  checks.push({
    name: 'Memory',
    status: heapPct > 90 ? 'error' : heapPct > 75 ? 'warning' : 'ok',
    latencyMs: 0,
    detail: `${Math.round(mem.heapUsed / 1048576)}MB / ${Math.round(mem.heapTotal / 1048576)}MB (${heapPct.toFixed(1)}%)`,
  })

  // App
  checks.push({ name: 'Next.js', status: 'ok', latencyMs: 0, detail: `Node ${process.version}` })
  checks.push({ name: 'Uptime', status: 'ok', latencyMs: 0, detail: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m` })

  const hasError = checks.some(c => c.status === 'error')
  const hasWarning = checks.some(c => c.status === 'warning')

  return {
    status: hasError ? 'unhealthy' : hasWarning ? 'degraded' : 'healthy',
    uptime: process.uptime(),
    checks,
    timestamp: new Date(),
  }
}

// ─── Metrics ────────────────────────────────────────────────────────

export interface SystemMetrics {
  memory: { heapUsedMB: number; heapTotalMB: number; rssMB: number; heapPercent: number }
  uptime: { seconds: number; formatted: string }
  database: { users: number; films: number; conversations: number; executions: number; transactions: number }
  ai: { totalRequests: number; todayRequests: number; totalCost: number; avgLatency: number }
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const mem = process.memoryUsage()
  const uptime = process.uptime()
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const [users, films, conversations, executions, transactions, totalAI, todayAI, aiCost] = await Promise.all([
    prisma.user.count(),
    prisma.film.count(),
    prisma.conversation.count(),
    prisma.agentExecution.count(),
    prisma.creditTransaction.count(),
    prisma.aIUsageLog.count(),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: today } } }),
    prisma.aIUsageLog.aggregate({ _sum: { billedCredits: true }, _avg: { durationMs: true } }),
  ])

  return {
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1048576),
      heapTotalMB: Math.round(mem.heapTotal / 1048576),
      rssMB: Math.round(mem.rss / 1048576),
      heapPercent: parseFloat(((mem.heapUsed / mem.heapTotal) * 100).toFixed(1)),
    },
    uptime: {
      seconds: uptime,
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    },
    database: { users, films, conversations, executions, transactions },
    ai: {
      totalRequests: totalAI,
      todayRequests: todayAI,
      totalCost: aiCost._sum.billedCredits ?? 0,
      avgLatency: Math.round(aiCost._avg.durationMs ?? 0),
    },
  }
}

// ─── Event Log (in-memory) ──────────────────────────────────────────

const eventLog: SystemEvent[] = []
const MAX_EVENTS = 1000

export function logEvent(event: Omit<SystemEvent, 'id' | 'timestamp'>): SystemEvent {
  const entry: SystemEvent = { ...event, id: `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`, timestamp: new Date() }
  eventLog.push(entry)
  if (eventLog.length > MAX_EVENTS) eventLog.shift()
  return entry
}

export function getEvents(filters?: { category?: string; severity?: string; limit?: number }): SystemEvent[] {
  let filtered = [...eventLog]
  if (filters?.category) filtered = filtered.filter(e => e.category === filters.category)
  if (filters?.severity) filtered = filtered.filter(e => e.severity === filters.severity)
  return filtered.slice(-(filters?.limit ?? 50)).reverse()
}

export function getEventStats(): Record<string, number> {
  const stats: Record<string, number> = { total: eventLog.length, info: 0, warning: 0, error: 0, critical: 0 }
  for (const e of eventLog) stats[e.severity] = (stats[e.severity] || 0) + 1
  return stats
}
