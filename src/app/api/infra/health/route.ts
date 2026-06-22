import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Array<{ name: string; status: string; latencyMs: number; detail: string }> = []

  // DB
  try {
    const start = Date.now()
    const count = await prisma.user.count()
    checks.push({ name: 'postgresql', status: 'ok', latencyMs: Date.now() - start, detail: `${count} users` })
  } catch (e: any) {
    checks.push({ name: 'postgresql', status: 'error', latencyMs: 0, detail: e.message })
  }

  // Memory
  const mem = process.memoryUsage()
  const heapPct = (mem.heapUsed / mem.heapTotal) * 100
  checks.push({
    name: 'memory',
    status: heapPct > 90 ? 'error' : heapPct > 75 ? 'warning' : 'ok',
    latencyMs: 0,
    detail: `${Math.round(mem.heapUsed / 1048576)}MB/${Math.round(mem.heapTotal / 1048576)}MB (${heapPct.toFixed(1)}%)`,
  })

  // Uptime
  const uptime = process.uptime()
  checks.push({ name: 'uptime', status: 'ok', latencyMs: 0, detail: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m` })

  // Node
  checks.push({ name: 'runtime', status: 'ok', latencyMs: 0, detail: `Node ${process.version}` })

  const hasError = checks.some(c => c.status === 'error')
  const overall = hasError ? 'unhealthy' : checks.some(c => c.status === 'warning') ? 'degraded' : 'healthy'

  return NextResponse.json({
    status: overall,
    timestamp: new Date().toISOString(),
    checks,
  }, { status: hasError ? 503 : 200 })
}
