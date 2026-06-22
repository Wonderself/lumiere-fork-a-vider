/**
 * Circuit Breaker Enhanced
 * Per-agent monitoring with auto-suspension and cooldown recovery.
 */

export interface CircuitState {
  failures: number
  successes: number
  lastFailure: number
  lastSuccess: number
  isOpen: boolean
  totalRequests: number
  tokensPerMinute: number[]  // Rolling window of token counts
  suspended: boolean
  suspendedAt?: number
  suspendReason?: string
}

const circuits = new Map<string, CircuitState>()

const CONFIG = {
  maxFailures: 5,            // Open circuit after N consecutive failures
  resetTimeMs: 60_000,       // Try again after 60s
  maxTokensPerMinute: 500_000, // Auto-suspend if exceeds
  suspendCooldownMs: 300_000,  // 5 min suspension
  halfOpenMaxRequests: 2,      // Allow 2 test requests in half-open
}

function getState(agentOrProvider: string): CircuitState {
  if (!circuits.has(agentOrProvider)) {
    circuits.set(agentOrProvider, {
      failures: 0, successes: 0, lastFailure: 0, lastSuccess: 0,
      isOpen: false, totalRequests: 0, tokensPerMinute: [],
      suspended: false,
    })
  }
  return circuits.get(agentOrProvider)!
}

/** Check if requests are allowed */
export function isAllowed(agentOrProvider: string): { allowed: boolean; reason?: string } {
  const state = getState(agentOrProvider)

  // Check suspension
  if (state.suspended) {
    if (state.suspendedAt && Date.now() - state.suspendedAt > CONFIG.suspendCooldownMs) {
      state.suspended = false
      state.tokensPerMinute = []
    } else {
      return { allowed: false, reason: `SUSPENDED: ${state.suspendReason || 'Token budget exceeded'}` }
    }
  }

  // Check open circuit
  if (state.isOpen) {
    if (Date.now() - state.lastFailure > CONFIG.resetTimeMs) {
      // Half-open: allow limited requests
      return { allowed: true, reason: 'HALF_OPEN' }
    }
    return { allowed: false, reason: 'CIRCUIT_OPEN' }
  }

  return { allowed: true }
}

/** Record a successful request */
export function recordSuccess(agentOrProvider: string, tokensUsed: number = 0): void {
  const state = getState(agentOrProvider)
  state.successes++
  state.totalRequests++
  state.lastSuccess = Date.now()
  state.failures = 0 // Reset consecutive failures
  if (state.isOpen) state.isOpen = false // Close circuit on success

  // Track tokens per minute
  state.tokensPerMinute.push(tokensUsed)
  // Keep only last 60 entries (rough minute window)
  if (state.tokensPerMinute.length > 60) state.tokensPerMinute.shift()

  // Check token rate
  const totalTokens = state.tokensPerMinute.reduce((a, b) => a + b, 0)
  if (totalTokens > CONFIG.maxTokensPerMinute) {
    state.suspended = true
    state.suspendedAt = Date.now()
    state.suspendReason = `Token rate exceeded: ${totalTokens} tokens/min (limit: ${CONFIG.maxTokensPerMinute})`
  }
}

/** Record a failure */
export function recordFailure(agentOrProvider: string, error?: string): void {
  const state = getState(agentOrProvider)
  state.failures++
  state.totalRequests++
  state.lastFailure = Date.now()

  if (state.failures >= CONFIG.maxFailures) {
    state.isOpen = true
  }
}

/** Get all circuit states */
export function getAllStates(): Record<string, CircuitState> {
  const result: Record<string, CircuitState> = {}
  circuits.forEach((state, key) => { result[key] = { ...state } })
  return result
}

/** Force reset a circuit */
export function reset(agentOrProvider: string): void {
  circuits.delete(agentOrProvider)
}

/** Get summary stats */
export function getSummary(): { total: number; open: number; suspended: number; healthy: number } {
  let open = 0, suspended = 0, healthy = 0
  circuits.forEach(state => {
    if (state.suspended) suspended++
    else if (state.isOpen) open++
    else healthy++
  })
  return { total: circuits.size, open, suspended, healthy }
}
