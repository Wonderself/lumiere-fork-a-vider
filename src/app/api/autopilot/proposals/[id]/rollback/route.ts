import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as autopilot from '@/lib/autopilot.service'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { id } = await params
  const result = await autopilot.rollbackProposal(id)

  return NextResponse.json(result)
}
