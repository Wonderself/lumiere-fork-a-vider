import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as chatService from '@/lib/chat.service'

/** GET /api/chat/conversations/:id — Get conversation with messages */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const conversation = await chatService.getConversation(id, session.user.id)
  if (!conversation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(conversation)
}

/** DELETE /api/chat/conversations/:id — Archive conversation */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await chatService.archiveConversation(id, session.user.id)
  return NextResponse.json({ success: true })
}
