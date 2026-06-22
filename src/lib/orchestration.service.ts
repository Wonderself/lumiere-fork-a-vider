/**
 * CineGeny Orchestration Service
 * Event bus, SSE manager, orchestrator loop, reporting.
 */

import { prisma } from '@/lib/prisma'
import { microToCredits } from '@/lib/ai-pricing'
import { SSE_CONFIG, ORCHESTRATOR_CONFIG } from '@/data/orchestration'

// ─── Event Bus ──────────────────────────────────────────────────────

interface EventHandler {
  type: string
  handler: (event: BusEvent) => Promise<void> | void
}

export interface BusEvent {
  id: string
  type: string
  correlationId: string
  payload: Record<string, unknown>
  timestamp: Date
  source: string
}

const handlers: EventHandler[] = []
const eventLog: BusEvent[] = []
const MAX_LOG = 500
let correlationCounter = 0

export function subscribe(type: string, handler: (event: BusEvent) => Promise<void> | void): void {
  handlers.push({ type, handler })
}

export async function publish(type: string, payload: Record<string, unknown>, source: string = 'system'): Promise<BusEvent> {
  const event: BusEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    type,
    correlationId: `cor-${++correlationCounter}`,
    payload,
    timestamp: new Date(),
    source,
  }

  eventLog.push(event)
  if (eventLog.length > MAX_LOG) eventLog.shift()

  // Dispatch to handlers
  const matching = handlers.filter(h => h.type === type || h.type === '*')
  for (const h of matching) {
    try { await h.handler(event) } catch (err) { console.error(`Event handler error for ${type}:`, err) }
  }

  // Broadcast to SSE clients
  broadcastSSE(event)

  return event
}

export function getEventLog(limit = 50, type?: string): BusEvent[] {
  let filtered = [...eventLog]
  if (type) filtered = filtered.filter(e => e.type === type)
  return filtered.slice(-limit).reverse()
}

// ─── SSE Manager ────────────────────────────────────────────────────

interface SSEClient {
  id: string
  controller: ReadableStreamDefaultController
  lastActivity: number
  queue: BusEvent[]
  userId?: string
}

const sseClients = new Map<string, SSEClient>()
let cleanupInterval: ReturnType<typeof setInterval> | null = null

export function getSSEStats(): {
  connected: number; max: number; warningThreshold: number; criticalThreshold: number
  capacityPercent: number; status: 'ok' | 'warning' | 'critical'
} {
  const connected = sseClients.size
  const capacityPercent = Math.round((connected / SSE_CONFIG.maxClients) * 100)
  const status = connected >= SSE_CONFIG.criticalThreshold ? 'critical' :
    connected >= SSE_CONFIG.warningThreshold ? 'warning' : 'ok'

  return {
    connected, max: SSE_CONFIG.maxClients,
    warningThreshold: SSE_CONFIG.warningThreshold,
    criticalThreshold: SSE_CONFIG.criticalThreshold,
    capacityPercent, status,
  }
}

export function registerSSEClient(controller: ReadableStreamDefaultController, userId?: string): string {
  const clientId = `sse-${Date.now()}-${Math.random().toString(36).substring(7)}`
  const stats = getSSEStats()

  // Capacity check
  if (sseClients.size >= SSE_CONFIG.maxClients) {
    throw new Error('SSE capacity reached (500 clients max)')
  }

  // Warning at 300
  if (sseClients.size >= SSE_CONFIG.warningThreshold && sseClients.size < SSE_CONFIG.criticalThreshold) {
    publish('sse.capacity_warning', {
      connected: sseClients.size + 1,
      max: SSE_CONFIG.maxClients,
      message: `⚠️ SSE à ${Math.round(((sseClients.size + 1) / SSE_CONFIG.maxClients) * 100)}% capacité (${sseClients.size + 1}/${SSE_CONFIG.maxClients}). Envisagez d'augmenter la limite.`,
    }, 'sse-manager')
  }

  // Critical at 400
  if (sseClients.size >= SSE_CONFIG.criticalThreshold) {
    publish('sse.capacity_critical', {
      connected: sseClients.size + 1,
      max: SSE_CONFIG.maxClients,
      message: `🚨 SSE à ${Math.round(((sseClients.size + 1) / SSE_CONFIG.maxClients) * 100)}% capacité! Augmentez maxClients IMMÉDIATEMENT.`,
    }, 'sse-manager')
  }

  sseClients.set(clientId, { id: clientId, controller, lastActivity: Date.now(), queue: [], userId })

  // Start cleanup if not running
  if (!cleanupInterval) {
    cleanupInterval = setInterval(cleanupDeadClients, SSE_CONFIG.cleanupIntervalMs)
  }

  return clientId
}

export function unregisterSSEClient(clientId: string): void {
  sseClients.delete(clientId)
  if (sseClients.size === 0 && cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}

function broadcastSSE(event: BusEvent): void {
  const encoder = new TextEncoder()
  const data = JSON.stringify({ type: event.type, payload: event.payload, timestamp: event.timestamp.toISOString(), correlationId: event.correlationId })

  for (const [clientId, client] of sseClients) {
    try {
      // Backpressure: if queue too large, skip
      if (client.queue.length >= SSE_CONFIG.backpressureMaxQueue) continue

      client.controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      client.lastActivity = Date.now()
    } catch {
      // Dead client — will be cleaned up
      sseClients.delete(clientId)
    }
  }
}

function cleanupDeadClients(): void {
  const now = Date.now()
  for (const [clientId, client] of sseClients) {
    if (now - client.lastActivity > SSE_CONFIG.deadClientTimeoutMs) {
      try { client.controller.close() } catch {}
      sseClients.delete(clientId)
    }
  }
}

export function sendHeartbeat(): void {
  const encoder = new TextEncoder()
  for (const [, client] of sseClients) {
    try {
      client.controller.enqueue(encoder.encode(`: heartbeat\n\n`))
      client.lastActivity = Date.now()
    } catch {}
  }
}

// ─── Orchestrator ───────────────────────────────────────────────────

let orchestratorRunning = false

export function startOrchestrator(): void {
  if (orchestratorRunning) return
  orchestratorRunning = true

  // Main loop (conceptual — in production: actual setInterval)
  // setInterval(orchestratorTick, ORCHESTRATOR_CONFIG.mainLoopIntervalMs)
}

export async function orchestratorTick(): Promise<{
  tasksProcessed: number; eventsHandled: number; errors: number
}> {
  let tasksProcessed = 0
  let eventsHandled = 0
  let errors = 0

  // 1. Check expired approvals
  try {
    const expired = await prisma.autopilotProposal.updateMany({
      where: {
        status: 'PENDING_REVIEW' as any,
        expiresAt: { lt: new Date() },
      },
      data: { status: 'DENIED' as any, reviewNote: 'Auto-expired' },
    })
    if (expired.count > 0) {
      publish('proposal.auto_expired', { count: expired.count }, 'orchestrator')
      tasksProcessed += expired.count
    }
  } catch { errors++ }

  // 2. Send heartbeat to SSE clients
  sendHeartbeat()

  // 3. Log tick
  publish('orchestrator.tick', { tasksProcessed, eventsHandled, errors, sseClients: sseClients.size }, 'orchestrator')

  return { tasksProcessed, eventsHandled, errors }
}

// ─── Reporting ──────────────────────────────────────────────────────

export async function generateWeeklyReport(): Promise<string> {
  const weekAgo = new Date(Date.now() - 7 * 86400000)

  const [newUsers, aiRequests, revenue, proposals, tasks, conversations] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: weekAgo } }, _sum: { billedCredits: true } }),
    prisma.autopilotProposal.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.task.count({ where: { status: 'VALIDATED', updatedAt: { gte: weekAgo } } }),
    prisma.conversation.count({ where: { createdAt: { gte: weekAgo } } }),
  ])

  return [
    '📊 *Rapport Hebdomadaire CineGeny*',
    `📅 Semaine du ${weekAgo.toLocaleDateString('fr-FR')} au ${new Date().toLocaleDateString('fr-FR')}`,
    '',
    '📈 *KPIs*',
    `👥 Nouveaux users: +${newUsers}`,
    `🤖 Requêtes IA: ${aiRequests}`,
    `💰 Revenue: ${microToCredits(revenue._sum.billedCredits ?? 0).toFixed(2)} cr`,
    `📋 Propositions: ${proposals}`,
    `✅ Tâches validées: ${tasks}`,
    `💬 Conversations: ${conversations}`,
    '',
    `📡 SSE: ${sseClients.size}/${SSE_CONFIG.maxClients} clients`,
    '',
    '🔧 /status pour détails',
  ].join('\n')
}

export async function generateMonthlyReport(): Promise<string> {
  const monthAgo = new Date(Date.now() - 30 * 86400000)

  const [totalUsers, newUsers, totalAI, revenue, totalFilms] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: monthAgo } }, _sum: { billedCredits: true } }),
    prisma.film.count(),
  ])

  return [
    '📊 *Rapport Mensuel CineGeny*',
    `📅 ${monthAgo.toLocaleDateString('fr-FR')} → ${new Date().toLocaleDateString('fr-FR')}`,
    '',
    '📈 *Vue d\'ensemble*',
    `👥 Total users: ${totalUsers} (+${newUsers} ce mois)`,
    `🤖 Requêtes IA: ${totalAI}`,
    `💰 Revenue: ${microToCredits(revenue._sum.billedCredits ?? 0).toFixed(2)} cr`,
    `🎬 Films: ${totalFilms}`,
    '',
    `📡 SSE capacité: ${Math.round((sseClients.size / SSE_CONFIG.maxClients) * 100)}%`,
    '',
    '🔧 Plan du mois prochain à définir',
  ].join('\n')
}
