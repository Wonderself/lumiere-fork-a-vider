import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as autopilot from '@/lib/autopilot.service'
import { sendProposalNotification } from '@/lib/telegram.service'

/** GET — List proposals (admin only) */
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const actionType = searchParams.get('actionType') || undefined
  const limit = parseInt(searchParams.get('limit') || '50')

  const proposals = await autopilot.getProposals({
    status: status as any,
    actionType: actionType as any,
    limit,
  })

  return NextResponse.json({ proposals })
}

/** POST — Create a new proposal */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const proposal = await autopilot.createProposal({
      ...body,
      createdById: session.user.id,
    })

    // Send Telegram notification
    const telegramResult = await sendProposalNotification({
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      actionType: proposal.actionType,
      severity: proposal.severity,
      riskScore: proposal.riskScore,
      agentSlug: proposal.agentSlug,
      isUrgent: proposal.isUrgent,
    })

    if (telegramResult.success && telegramResult.messageId) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.autopilotProposal.update({
        where: { id: proposal.id },
        data: {
          telegramMessageId: telegramResult.messageId,
          telegramChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
        },
      })
    }

    return NextResponse.json({ success: true, proposal })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
