import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as autopilot from '@/lib/autopilot.service'

/** POST — Run an audit */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { type } = await request.json()

  let result
  switch (type) {
    case 'health': result = await autopilot.runHealthAudit(); break
    case 'business': result = await autopilot.runBusinessAudit(); break
    case 'security': result = await autopilot.runSecurityAudit(); break
    default: return NextResponse.json({ error: 'Invalid audit type' }, { status: 400 })
  }

  return NextResponse.json(result)
}

/** GET — Get latest audit results */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const audits = await autopilot.getLatestAudits()
  return NextResponse.json(audits)
}
