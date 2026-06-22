import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const favorites = await agentService.getUserFavorites(session.user.id)
  return NextResponse.json({ favorites })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentSlug } = await request.json()
  if (!agentSlug) {
    return NextResponse.json({ error: 'agentSlug required' }, { status: 400 })
  }

  try {
    const result = await agentService.toggleFavorite(session.user.id, agentSlug)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
