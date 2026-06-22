import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as autopilot from '@/lib/autopilot.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const proposal = await autopilot.getProposal(id)
  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(proposal)
}
