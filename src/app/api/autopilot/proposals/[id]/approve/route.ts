import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as autopilot from '@/lib/autopilot.service'
import { sendStatusUpdate } from '@/lib/telegram.service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { id } = await params
  const body = await request.json().catch(() => ({}))

  const proposal = await autopilot.approveProposal(id, session.user.id, body.note)

  // Notify via Telegram
  if (proposal.telegramMessageId && proposal.telegramChatId) {
    await sendStatusUpdate({
      chatId: proposal.telegramChatId,
      messageId: proposal.telegramMessageId,
      proposalTitle: proposal.title,
      newStatus: 'APPROVED',
      reviewerName: (session.user as any).name || session.user.email,
      note: body.note,
    })
  }

  // Auto-execute after approval
  const execResult = await autopilot.executeProposal(id)

  return NextResponse.json({ success: true, executed: execResult.success, executionError: execResult.error })
}
