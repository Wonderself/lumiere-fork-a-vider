import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prefs = await agentService.getUserPreferences(session.user.id)
  return NextResponse.json(prefs)
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const prefs = await agentService.updateUserPreferences(session.user.id, body)
  return NextResponse.json(prefs)
}
