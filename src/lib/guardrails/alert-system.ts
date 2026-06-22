/**
 * Alert System
 * System alerts for guardrail violations with severity levels.
 */

import { sendCriticalAlert } from '@/lib/telegram-bot'

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface GuardrailAlert {
  id: string
  module: string
  severity: AlertSeverity
  title: string
  message: string
  metadata?: Record<string, unknown>
  timestamp: number
  acknowledged: boolean
}

// In-memory alert store
const alerts: GuardrailAlert[] = []
const MAX_ALERTS = 500
let alertCounter = 0

/** Raise a new alert */
export async function raiseAlert(
  module: string,
  severity: AlertSeverity,
  title: string,
  message: string,
  metadata?: Record<string, unknown>
): Promise<GuardrailAlert> {
  const alert: GuardrailAlert = {
    id: `alert-${++alertCounter}-${Date.now()}`,
    module,
    severity,
    title,
    message,
    metadata,
    timestamp: Date.now(),
    acknowledged: false,
  }

  alerts.push(alert)
  if (alerts.length > MAX_ALERTS) alerts.shift()

  // Send critical/high alerts to Telegram
  if (severity === 'critical' || severity === 'high') {
    await sendCriticalAlert({
      title: `[${module.toUpperCase()}] ${title}`,
      message: `${message}\n\nSeverity: ${severity}\nModule: ${module}`,
      severity: severity === 'critical' ? 'CRITICAL' : 'WARNING',
    }).catch(() => {}) // Don't let Telegram failure block the alert
  }

  return alert
}

/** Get recent alerts */
export function getAlerts(filters?: {
  severity?: AlertSeverity
  module?: string
  acknowledged?: boolean
  limit?: number
}): GuardrailAlert[] {
  let filtered = [...alerts]

  if (filters?.severity) filtered = filtered.filter(a => a.severity === filters.severity)
  if (filters?.module) filtered = filtered.filter(a => a.module === filters.module)
  if (filters?.acknowledged !== undefined) filtered = filtered.filter(a => a.acknowledged === filters.acknowledged)

  return filtered.slice(-(filters?.limit ?? 50)).reverse()
}

/** Acknowledge an alert */
export function acknowledgeAlert(id: string): boolean {
  const alert = alerts.find(a => a.id === id)
  if (!alert) return false
  alert.acknowledged = true
  return true
}

/** Acknowledge all alerts */
export function acknowledgeAll(): number {
  let count = 0
  for (const alert of alerts) {
    if (!alert.acknowledged) {
      alert.acknowledged = true
      count++
    }
  }
  return count
}

/** Get alert summary */
export function getSummary(): {
  total: number
  unacknowledged: number
  bySeverity: Record<AlertSeverity, number>
  byModule: Record<string, number>
} {
  const bySeverity: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 }
  const byModule: Record<string, number> = {}
  let unacknowledged = 0

  for (const alert of alerts) {
    bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1
    byModule[alert.module] = (byModule[alert.module] || 0) + 1
    if (!alert.acknowledged) unacknowledged++
  }

  return {
    total: alerts.length,
    unacknowledged,
    bySeverity: bySeverity as Record<AlertSeverity, number>,
    byModule,
  }
}
