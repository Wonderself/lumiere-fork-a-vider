import { describe, it, expect, beforeEach } from 'vitest'
import { createRateLimiter } from '@/lib/rate-limit'

describe('createRateLimiter', () => {
  let limiter: ReturnType<typeof createRateLimiter>

  beforeEach(() => {
    limiter = createRateLimiter({ maxAttempts: 3, windowMs: 60_000 })
  })

  it('allows first request', async () => {
    const result = await limiter.check('test-user')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('allows up to maxAttempts', async () => {
    await limiter.check('user-a')
    await limiter.check('user-a')
    const third = await limiter.check('user-a')
    expect(third.allowed).toBe(true)
    expect(third.remaining).toBe(0)
  })

  it('blocks after maxAttempts exceeded', async () => {
    await limiter.check('user-b')
    await limiter.check('user-b')
    await limiter.check('user-b')
    const fourth = await limiter.check('user-b')
    expect(fourth.allowed).toBe(false)
    expect(fourth.remaining).toBe(0)
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks different identifiers separately', async () => {
    await limiter.check('user-c')
    await limiter.check('user-c')
    await limiter.check('user-c')

    const resultOther = await limiter.check('user-d')
    expect(resultOther.allowed).toBe(true)
    expect(resultOther.remaining).toBe(2)
  })

  it('reset clears the identifier', async () => {
    await limiter.check('user-e')
    await limiter.check('user-e')
    await limiter.check('user-e')

    limiter.reset('user-e')

    const result = await limiter.check('user-e')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('retryAfterSeconds is positive when blocked', async () => {
    const fast = createRateLimiter({ maxAttempts: 1, windowMs: 10_000 })
    await fast.check('user-f')
    const blocked = await fast.check('user-f')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(10)
  })
})
