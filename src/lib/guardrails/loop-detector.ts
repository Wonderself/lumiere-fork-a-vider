/**
 * Loop Detector
 * Detects and prevents infinite loops in inter-agent chains.
 */

interface ChainEntry {
  agentSlug: string
  timestamp: number
  depth: number
}

interface ActiveChain {
  id: string
  userId: string
  entries: ChainEntry[]
  startedAt: number
}

const activeChains = new Map<string, ActiveChain>()

const CONFIG = {
  maxDepth: 10,              // Max chain depth
  maxRepeats: 3,             // Max times same agent in a chain
  maxDurationMs: 300_000,    // 5 min max chain duration
  cleanupIntervalMs: 60_000, // Clean stale chains every minute
}

let lastCleanup = Date.now()

function cleanup(): void {
  const now = Date.now()
  if (now - lastCleanup < CONFIG.cleanupIntervalMs) return
  lastCleanup = now

  activeChains.forEach((chain, id) => {
    if (now - chain.startedAt > CONFIG.maxDurationMs * 2) {
      activeChains.delete(id)
    }
  })
}

/** Start tracking a new chain */
export function startChain(chainId: string, userId: string, agentSlug: string): void {
  cleanup()
  activeChains.set(chainId, {
    id: chainId,
    userId,
    entries: [{ agentSlug, timestamp: Date.now(), depth: 0 }],
    startedAt: Date.now(),
  })
}

/** Check if adding an agent to the chain would create a loop */
export function checkLoop(chainId: string, agentSlug: string): { allowed: boolean; reason?: string } {
  const chain = activeChains.get(chainId)
  if (!chain) return { allowed: true } // No chain = no loop

  // Check max depth
  const depth = chain.entries.length
  if (depth >= CONFIG.maxDepth) {
    return { allowed: false, reason: `MAX_DEPTH: Chain depth ${depth} exceeds limit ${CONFIG.maxDepth}` }
  }

  // Check max duration
  if (Date.now() - chain.startedAt > CONFIG.maxDurationMs) {
    return { allowed: false, reason: `MAX_DURATION: Chain running for ${Math.round((Date.now() - chain.startedAt) / 1000)}s` }
  }

  // Check repeat count
  const repeatCount = chain.entries.filter(e => e.agentSlug === agentSlug).length
  if (repeatCount >= CONFIG.maxRepeats) {
    return { allowed: false, reason: `LOOP_DETECTED: Agent ${agentSlug} called ${repeatCount} times in chain` }
  }

  // Check A→B→A pattern (direct loop)
  if (chain.entries.length >= 2) {
    const last = chain.entries[chain.entries.length - 1]
    const prev = chain.entries[chain.entries.length - 2]
    if (last.agentSlug === agentSlug && prev.agentSlug !== agentSlug) {
      // A→B→A is OK once, but A→B→A→B→A is a loop
      const pattern = chain.entries.slice(-4).map(e => e.agentSlug)
      if (pattern.length >= 4 && pattern[0] === pattern[2] && pattern[1] === pattern[3]) {
        return { allowed: false, reason: `PING_PONG: Detected A↔B loop between ${pattern[0]} and ${pattern[1]}` }
      }
    }
  }

  return { allowed: true }
}

/** Record an agent step in the chain */
export function recordStep(chainId: string, agentSlug: string): void {
  const chain = activeChains.get(chainId)
  if (!chain) return
  chain.entries.push({
    agentSlug,
    timestamp: Date.now(),
    depth: chain.entries.length,
  })
}

/** End a chain */
export function endChain(chainId: string): void {
  activeChains.delete(chainId)
}

/** Get active chains info */
export function getActiveChains(): Array<{ id: string; userId: string; depth: number; agents: string[]; durationMs: number }> {
  return Array.from(activeChains.values()).map(chain => ({
    id: chain.id,
    userId: chain.userId,
    depth: chain.entries.length,
    agents: chain.entries.map(e => e.agentSlug),
    durationMs: Date.now() - chain.startedAt,
  }))
}

export function getStats(): { activeChains: number; maxDepthSeen: number } {
  let maxDepth = 0
  activeChains.forEach(chain => {
    if (chain.entries.length > maxDepth) maxDepth = chain.entries.length
  })
  return { activeChains: activeChains.size, maxDepthSeen: maxDepth }
}
