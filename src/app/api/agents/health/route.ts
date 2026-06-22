import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const health = await agentService.getAgentHealth()
  return NextResponse.json({ health })
}
