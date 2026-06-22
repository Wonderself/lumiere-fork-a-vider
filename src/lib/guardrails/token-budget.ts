/**
 * Token Budget Manager
 * Dynamic budgets per user tier, rate limiting per minute/hour/day/request.
 */

import { getCached } from '@/lib/redis'

// ─── Tier Budgets (micro-credits) ───────────────────────────────────

export interface TierBudget {
  perRequest: number    // Max micro-credits per single request
  perMinute: number     // Max micro-credits per minute
  perHour: number       // Max micro-credits per hour
  perDay: number        // Max micro-credits per day
  maxTokensPerRequest: number  // Max output tokens
}

export const TIER_BUDGETS: Record<string, TierBudget> = {
  FREE: {
    perRequest: 2_000_000,     // 2 credits
    perMinute: 5_000_000,      // 5 credits
    perHour: 20_000_000,       // 20 credits
    perDay: 50_000_000,        // 50 credits
    maxTokensPerRequest: 2048,
  },
  PREMIUM: {
    perRequest: 10_000_000,    // 10 credits
    perMinute: 25_000_000,     // 25 credits
    perHour: 100_000_000,      // 100 credits
    perDay: 300_000_000,       // 300 credits
    maxTokensPerRequest: 4096,
  },
  PREMIUM_PLUS: {
    perRequest: 50_000_000,    // 50 credits
    perMinute: 100_000_000,    // 100 credits
    perHour: 500_000_000,      // 500 credits
    perDay: 1_000_000_000,     // 1000 credits
    maxTokensPerRequest: 8192,
  },
  ADMIN: {
    perRequest: 100_000_000,
    perMinute: 500_000_000,
    perHour: 2_000_000_000,
    perDay: 10_000_000_000,
    maxTokensPerRequest: 16384,
  },
}

// ─── In-Memory Rate Counters ────────────────────────────────────────

interface RateWindow {
  count: number
  cost: number
  windowStart: number
}

const minuteWindows = new Map<string, RateWindow>()
const hourWindows = new Map<string, RateWindow>()
const dayWindows = new Map<string, RateWindow>()

function getWindow(map: Map<string, RateWindow>, userId: string, windowMs: number): RateWindow {
  const now = Date.now()
  const existing = map.get(userId)
  if (existing && (now - existing.windowStart) < windowMs) {
    return existing
  }
  const fresh = { count: 0, cost: 0, windowStart: now }
  map.set(userId, fresh)
  return fresh
}

export interface BudgetCheckResult {
  allowed: boolean
  reason?: string
  limit?: number
  used?: number
  remaining?: number
}

/** Check if a request is within budget */
export function checkBudget(userId: string, tier: string, estimatedCost: number): BudgetCheckResult {
  const budget = TIER_BUDGETS[tier] || TIER_BUDGETS.FREE

  // Per-request check
  if (estimatedCost > budget.perRequest) {
    return { allowed: false, reason: 'EXCEEDS_REQUEST_LIMIT', limit: budget.perRequest, used: estimatedCost }
  }

  // Per-minute check
  const minute = getWindow(minuteWindows, userId, 60_000)
  if (minute.cost + estimatedCost > budget.perMinute) {
    return { allowed: false, reason: 'MINUTE_LIMIT', limit: budget.perMinute, used: minute.cost, remaining: budget.perMinute - minute.cost }
  }

  // Per-hour check
  const hour = getWindow(hourWindows, userId, 3_600_000)
  if (hour.cost + estimatedCost > budget.perHour) {
    return { allowed: false, reason: 'HOUR_LIMIT', limit: budget.perHour, used: hour.cost, remaining: budget.perHour - hour.cost }
  }

  // Per-day check
  const day = getWindow(dayWindows, userId, 86_400_000)
  if (day.cost + estimatedCost > budget.perDay) {
    return { allowed: false, reason: 'DAY_LIMIT', limit: budget.perDay, used: day.cost, remaining: budget.perDay - day.cost }
  }

  return { allowed: true, remaining: budget.perDay - day.cost - estimatedCost }
}

/** Record usage after a successful request */
export function recordUsage(userId: string, actualCost: number): void {
  const minute = getWindow(minuteWindows, userId, 60_000)
  minute.count++
  minute.cost += actualCost

  const hour = getWindow(hourWindows, userId, 3_600_000)
  hour.count++
  hour.cost += actualCost

  const day = getWindow(dayWindows, userId, 86_400_000)
  day.count++
  day.cost += actualCost
}

/** Get current usage for a user */
export function getUsage(userId: string): { minute: RateWindow; hour: RateWindow; day: RateWindow } {
  return {
    minute: getWindow(minuteWindows, userId, 60_000),
    hour: getWindow(hourWindows, userId, 3_600_000),
    day: getWindow(dayWindows, userId, 86_400_000),
  }
}

/** Get max tokens allowed for this tier */
export function getMaxTokens(tier: string): number {
  return (TIER_BUDGETS[tier] || TIER_BUDGETS.FREE).maxTokensPerRequest
}
