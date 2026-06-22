import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as creditGuard from '@/lib/guardrails/credit-guard'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const [discrepancies, anomalies] = await Promise.all([
    creditGuard.auditCoherence(),
    creditGuard.detectAnomalies(),
  ])

  return NextResponse.json({
    discrepancies,
    anomalies,
    discrepancyCount: discrepancies.length,
    anomalyCount: anomalies.length,
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { action } = await request.json()

  if (action === 'fix_negatives') {
    const fixed = await creditGuard.fixNegativeBalances()
    return NextResponse.json({ success: true, fixed })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
