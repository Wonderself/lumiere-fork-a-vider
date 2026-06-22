import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const agentSlug = searchParams.get('agent') || undefined

  const executions = await agentService.getUserExecutions(
    session.user.id,
    Math.min(limit, 100),
    offset,
    agentSlug
  )

  return NextResponse.json({ executions })
}
