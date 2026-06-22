import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()

  const checks: Record<string, { status: string; latency?: number }> = {}

  // Check database
  try {
    const dbStart = Date.now()
    const { prisma } = await import('@/lib/prisma')
    await (prisma as any).$queryRaw`SELECT 1`
    checks.database = { status: 'ok', latency: Date.now() - dbStart }
  } catch {
    checks.database = { status: 'error' }
  }

  // Check Redis
  try {
    const redisStart = Date.now()
    // redis.ts exports getRedisClient() which is not exported — use getCached as a proxy check
    // Instead, dynamically import and use the internal getRedisClient pattern
    const redisModule = await import('@/lib/redis')
    // getCached with a simple fetcher to test Redis connectivity
    // We'll use a lightweight approach: try to cache a health check key
    let redisWorking = false
    await redisModule.getCached(
      'health:ping',
      async () => {
        // This fetcher runs if cache miss — Redis may or may not be available
        return 'pong'
      },
      5 // 5 second TTL
    )
    // If getCached succeeded without throwing, at minimum the fetcher path works
    // To truly test Redis, we check if the value was cached by calling again
    checks.redis = { status: 'unavailable', latency: Date.now() - redisStart }

    // More direct approach: try importing ioredis and pinging
    try {
      const { default: IoRedis } = await import('ioredis')
      if (process.env.REDIS_URL) {
        const testClient = new IoRedis(process.env.REDIS_URL, {
          maxRetriesPerRequest: 1,
          retryStrategy: () => null,
          lazyConnect: true,
          connectTimeout: 3000,
        })
        await testClient.connect()
        await testClient.ping()
        checks.redis = { status: 'ok', latency: Date.now() - redisStart }
        await testClient.disconnect()
      }
    } catch {
      // Redis not available — already set to 'unavailable'
    }
  } catch {
    checks.redis = { status: 'error' }
  }

  const allOk = Object.values(checks).every(
    (c) => c.status === 'ok' || c.status === 'unavailable'
  )

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      latency: Date.now() - start,
      checks,
    },
    { status: allOk ? 200 : 503 }
  )
}
