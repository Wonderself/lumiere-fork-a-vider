/**
 * Fallback Manager
 * Multi-provider fallbacks: Anthropic → OpenAI, fal.ai → Replicate, etc.
 */

export interface Provider {
  name: string
  type: 'llm' | 'image' | 'video' | 'audio'
  healthy: boolean
  latencyMs: number
  lastCheck: number
  errorCount: number
  priority: number  // Lower = preferred
}

export interface FallbackChain {
  type: string
  providers: Provider[]
}

// ─── Provider Registry ──────────────────────────────────────────────

const providers = new Map<string, Provider>()

function initProviders(): void {
  if (providers.size > 0) return

  const defaults: Provider[] = [
    // LLM providers
    { name: 'anthropic', type: 'llm', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 1 },
    { name: 'openai', type: 'llm', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 2 },

    // Image providers
    { name: 'fal-ai', type: 'image', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 1 },
    { name: 'replicate', type: 'image', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 2 },
    { name: 'stability', type: 'image', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 3 },

    // Video providers
    { name: 'runway', type: 'video', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 1 },
    { name: 'replicate-video', type: 'video', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 2 },

    // Audio providers
    { name: 'elevenlabs', type: 'audio', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 1 },
    { name: 'openai-tts', type: 'audio', healthy: true, latencyMs: 0, lastCheck: 0, errorCount: 0, priority: 2 },
  ]

  for (const p of defaults) {
    providers.set(p.name, p)
  }
}

/** Get the best available provider for a type */
export function getBestProvider(type: 'llm' | 'image' | 'video' | 'audio'): Provider | null {
  initProviders()
  const candidates = Array.from(providers.values())
    .filter(p => p.type === type && p.healthy)
    .sort((a, b) => a.priority - b.priority)

  return candidates[0] || null
}

/** Get fallback chain for a type */
export function getFallbackChain(type: 'llm' | 'image' | 'video' | 'audio'): FallbackChain {
  initProviders()
  const chain = Array.from(providers.values())
    .filter(p => p.type === type)
    .sort((a, b) => a.priority - b.priority)

  return { type, providers: chain }
}

/** Record provider success */
export function recordProviderSuccess(name: string, latencyMs: number): void {
  initProviders()
  const p = providers.get(name)
  if (!p) return
  p.healthy = true
  p.latencyMs = latencyMs
  p.lastCheck = Date.now()
  p.errorCount = 0
}

/** Record provider failure */
export function recordProviderFailure(name: string): void {
  initProviders()
  const p = providers.get(name)
  if (!p) return
  p.errorCount++
  p.lastCheck = Date.now()
  if (p.errorCount >= 3) {
    p.healthy = false
  }
}

/** Mark provider as healthy again */
export function markHealthy(name: string): void {
  initProviders()
  const p = providers.get(name)
  if (!p) return
  p.healthy = true
  p.errorCount = 0
}

/** Get all providers status */
export function getAllProviders(): Provider[] {
  initProviders()
  return Array.from(providers.values())
}

/** Get provider health summary */
export function getHealthSummary(): { total: number; healthy: number; degraded: number; down: number } {
  initProviders()
  const all = Array.from(providers.values())
  return {
    total: all.length,
    healthy: all.filter(p => p.healthy && p.errorCount === 0).length,
    degraded: all.filter(p => p.healthy && p.errorCount > 0).length,
    down: all.filter(p => !p.healthy).length,
  }
}
