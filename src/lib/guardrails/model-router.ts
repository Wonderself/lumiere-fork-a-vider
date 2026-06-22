/**
 * Model Router
 * Intelligent selection of Haiku/Sonnet/Opus based on request complexity.
 */

export interface RoutingDecision {
  model: string
  reason: string
  tier: 'fast' | 'standard' | 'advanced'
  maxTokens: number
  temperature: number
}

interface RoutingInput {
  prompt: string
  agentTier?: string          // L1, L2, L3
  contextLength?: number      // Number of context messages
  requestedModel?: string     // User override
  taskComplexity?: 'simple' | 'moderate' | 'complex'
  requiresReasoning?: boolean
}

const MODELS = {
  fast: { model: 'claude-haiku-4-5', maxTokens: 2048, temperature: 0.5 },
  standard: { model: 'claude-sonnet-4-6', maxTokens: 4096, temperature: 0.7 },
  advanced: { model: 'claude-opus-4-6', maxTokens: 8192, temperature: 0.7 },
}

// Patterns that suggest complex reasoning needed
const COMPLEX_PATTERNS = [
  /analy[sz]e/i, /compar[ei]/i, /évalue/i, /stratég/i,
  /pourquoi/i, /why/i, /explain.*detail/i,
  /budget.*detail/i, /roi/i, /financ/i,
  /arbit/i, /décision/i, /trade.?off/i,
]

// Patterns that suggest simple/fast response OK
const SIMPLE_PATTERNS = [
  /list[ez]/i, /énumère/i, /résume/i, /tradui/i,
  /format[ez]/i, /convert/i, /corrige/i,
  /oui ou non/i, /yes or no/i,
]

/** Estimate complexity from prompt text */
function estimateComplexity(prompt: string): 'simple' | 'moderate' | 'complex' {
  const promptLength = prompt.length

  // Short prompts are usually simple
  if (promptLength < 100) return 'simple'

  // Check for complex patterns
  const complexMatches = COMPLEX_PATTERNS.filter(p => p.test(prompt)).length
  const simpleMatches = SIMPLE_PATTERNS.filter(p => p.test(prompt)).length

  if (complexMatches >= 2 || promptLength > 2000) return 'complex'
  if (simpleMatches >= 2 || promptLength < 300) return 'simple'
  return 'moderate'
}

/** Route to the best model for this request */
export function route(input: RoutingInput): RoutingDecision {
  // User override takes priority
  if (input.requestedModel) {
    const tier = input.requestedModel.includes('haiku') ? 'fast'
      : input.requestedModel.includes('opus') ? 'advanced'
      : 'standard'
    const config = MODELS[tier]
    return { ...config, tier, reason: 'User requested model' }
  }

  // Agent tier override
  if (input.agentTier === 'L3_STRATEGY') {
    return { ...MODELS.advanced, tier: 'advanced', reason: 'L3 Strategy agent requires Opus' }
  }
  if (input.agentTier === 'L2_MANAGEMENT') {
    return { ...MODELS.advanced, tier: 'advanced', reason: 'L2 Management agent uses Opus' }
  }

  // Explicit complexity
  if (input.taskComplexity === 'complex' || input.requiresReasoning) {
    return { ...MODELS.advanced, tier: 'advanced', reason: 'Complex task / reasoning required' }
  }
  if (input.taskComplexity === 'simple') {
    return { ...MODELS.fast, tier: 'fast', reason: 'Simple task — Haiku for speed' }
  }

  // Auto-detect complexity
  const complexity = estimateComplexity(input.prompt)

  // Long context → need smarter model
  if ((input.contextLength ?? 0) > 15) {
    return { ...MODELS.standard, tier: 'standard', reason: `Long context (${input.contextLength} messages)` }
  }

  switch (complexity) {
    case 'simple':
      return { ...MODELS.fast, tier: 'fast', reason: 'Auto-detected simple task' }
    case 'complex':
      return { ...MODELS.advanced, tier: 'advanced', reason: 'Auto-detected complex task' }
    default:
      return { ...MODELS.standard, tier: 'standard', reason: 'Standard complexity' }
  }
}

/** Get model distribution stats */
export function getModelDistribution(routingHistory: RoutingDecision[]): Record<string, { count: number; percent: number }> {
  const total = routingHistory.length || 1
  const counts: Record<string, number> = {}

  for (const r of routingHistory) {
    counts[r.model] = (counts[r.model] || 0) + 1
  }

  const result: Record<string, { count: number; percent: number }> = {}
  for (const [model, count] of Object.entries(counts)) {
    result[model] = { count, percent: Math.round((count / total) * 100) }
  }
  return result
}

// Track routing decisions in memory for stats
const routingLog: RoutingDecision[] = []
const MAX_LOG = 1000

export function logRouting(decision: RoutingDecision): void {
  routingLog.push(decision)
  if (routingLog.length > MAX_LOG) routingLog.shift()
}

export function getDistribution(): Record<string, { count: number; percent: number }> {
  return getModelDistribution(routingLog)
}

export function getRecentDecisions(limit = 20): RoutingDecision[] {
  return routingLog.slice(-limit)
}
