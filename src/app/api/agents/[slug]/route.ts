import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const agent = await agentService.getAgent(slug)
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  return NextResponse.json(agent)
}
