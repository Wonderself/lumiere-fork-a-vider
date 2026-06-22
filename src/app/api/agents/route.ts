import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'
import type { AgentTier } from '@/data/agents'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tier = searchParams.get('tier') as AgentTier | null
  const category = searchParams.get('category') || undefined
  const marketplace = searchParams.get('marketplace')

  const agents = await agentService.getAgents({
    ...(tier && { tier }),
    ...(category && { category }),
    ...(marketplace !== null && { isMarketplace: marketplace === 'true' }),
  })

  return NextResponse.json({ agents })
}
