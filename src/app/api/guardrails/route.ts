import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as circuitBreaker from '@/lib/guardrails/circuit-breaker'
import * as loopDetector from '@/lib/guardrails/loop-detector'
import * as modelRouter from '@/lib/guardrails/model-router'
import * as fallbackManager from '@/lib/guardrails/fallback-manager'
import * as alertSystem from '@/lib/guardrails/alert-system'
import * as modeToggle from '@/lib/guardrails/mode-toggle'

/** GET — Full guardrails status (admin) */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const [mode, circuits, loops, distribution, providers, alerts] = await Promise.all([
    modeToggle.getModeInfo(),
    Promise.resolve(circuitBreaker.getSummary()),
    Promise.resolve(loopDetector.getStats()),
    Promise.resolve(modelRouter.getDistribution()),
    Promise.resolve(fallbackManager.getHealthSummary()),
    Promise.resolve(alertSystem.getSummary()),
  ])

  return NextResponse.json({
    mode,
    circuits,
    loops,
    modelDistribution: distribution,
    providers,
    alerts,
    activeChains: loopDetector.getActiveChains(),
    recentAlerts: alertSystem.getAlerts({ limit: 10 }),
    allProviders: fallbackManager.getAllProviders(),
    recentRoutings: modelRouter.getRecentDecisions(10),
  })
}

/** POST — Execute guardrail actions */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { action, params } = await request.json()

  switch (action) {
    case 'set_mode': {
      await modeToggle.setMode(params.mode, session.user.id)
      return NextResponse.json({ success: true, mode: params.mode })
    }
    case 'reset_circuit': {
      circuitBreaker.reset(params.provider)
      return NextResponse.json({ success: true })
    }
    case 'mark_healthy': {
      fallbackManager.markHealthy(params.provider)
      return NextResponse.json({ success: true })
    }
    case 'acknowledge_alert': {
      const result = alertSystem.acknowledgeAlert(params.id)
      return NextResponse.json({ success: result })
    }
    case 'acknowledge_all': {
      const count = alertSystem.acknowledgeAll()
      return NextResponse.json({ success: true, count })
    }
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}
