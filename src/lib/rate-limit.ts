/**
 * In-memory rate limiter with sliding window.
 * Uses Redis when available, falls back to in-memory Map.
 *
 * Usage:
 *   const limiter = createRateLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 })
 *   const result = await limiter.check(identifier)
 *   if (!result.allowed) return { error: `Trop de tentatives. Réessayez dans ${result.retryAfterSeconds}s.` }
 */

type RateLimitEntry = {
  attempts: number
  firstAttempt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now - entry.firstAttempt > 30 * 60 * 1000) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function createRateLimiter(opts: {
  maxAttempts: number
  windowMs: number
}) {
  return {
    async check(identifier: string): Promise<{
      allowed: boolean
      remaining: number
      retryAfterSeconds: number
    }> {
      const now = Date.now()
      const key = `rl:${identifier}`
      const entry = store.get(key)

      // No previous attempts or window expired
      if (!entry || now - entry.firstAttempt > opts.windowMs) {
        store.set(key, { attempts: 1, firstAttempt: now })
        return { allowed: true, remaining: opts.maxAttempts - 1, retryAfterSeconds: 0 }
      }

      // Within window
      if (entry.attempts >= opts.maxAttempts) {
        const elapsed = now - entry.firstAttempt
        const retryAfter = Math.ceil((opts.windowMs - elapsed) / 1000)
        return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter }
      }

      entry.attempts++
      return { allowed: true, remaining: opts.maxAttempts - entry.attempts, retryAfterSeconds: 0 }
    },

    reset(identifier: string) {
      store.delete(`rl:${identifier}`)
    },
  }
}

// Pre-configured limiters for auth endpoints
// More generous in development to avoid blocking during testing
const isDev = process.env.NODE_ENV !== 'production'

export const loginLimiter = createRateLimiter({
  maxAttempts: isDev ? 50 : 5,
  windowMs: isDev ? 60 * 1000 : 15 * 60 * 1000,
})

export const registerLimiter = createRateLimiter({
  maxAttempts: isDev ? 50 : 3,
  windowMs: isDev ? 60 * 1000 : 60 * 60 * 1000,
})

export const passwordResetLimiter = createRateLimiter({
  maxAttempts: isDev ? 50 : 3,
  windowMs: isDev ? 60 * 1000 : 15 * 60 * 1000,
})
