import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as chatService from '@/lib/chat.service'

/** GET /api/chat/conversations — List user's conversations */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversations = await chatService.getUserConversations(session.user.id)
  return NextResponse.json({ conversations })
}

/** POST /api/chat/conversations — Create a new conversation */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentSlug, title, filmProjectId } = await request.json()
  if (!agentSlug) {
    return NextResponse.json({ error: 'agentSlug is required' }, { status: 400 })
  }

  const conversation = await chatService.createConversation(
    session.user.id, agentSlug, title, filmProjectId
  )

  return NextResponse.json(conversation)
}
