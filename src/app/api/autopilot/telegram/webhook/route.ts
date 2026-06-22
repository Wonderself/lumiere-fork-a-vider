import { NextResponse } from 'next/server'
import { routeCommand, handlePhoto } from '@/lib/telegram-bot'
import { parseCallbackData, answerCallback } from '@/lib/telegram.service'
import * as autopilot from '@/lib/autopilot.service'

/**
 * Telegram Webhook — handles all incoming messages, commands, and callbacks.
 * Configure webhook URL: https://api.telegram.org/bot{TOKEN}/setWebhook?url={YOUR_URL}/api/autopilot/telegram/webhook
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Handle callback queries (inline button presses)
    if (body.callback_query) {
      const query = body.callback_query
      const parsed = parseCallbackData(query.data)
      const chatId = String(query.message?.chat?.id || '')

      if (!parsed) {
        await answerCallback(query.id, 'Invalid action')
        return NextResponse.json({ ok: true })
      }

      const { action, proposalId } = parsed

      switch (action) {
        case 'approve': {
          await autopilot.approveProposal(proposalId, 'telegram-admin', 'Approved via Telegram button')
          const result = await autopilot.executeProposal(proposalId)
          await answerCallback(query.id, result.success ? '✅ Approved & executed' : `✅ Approved, ❌ exec: ${result.error}`)
          break
        }
        case 'deny': {
          await autopilot.denyProposal(proposalId, 'telegram-admin', 'Denied via Telegram button')
          await answerCallback(query.id, '❌ Denied')
          break
        }
        case 'details': {
          const proposal = await autopilot.getProposal(proposalId)
          const detail = proposal
            ? `Risk: ${proposal.riskScore}/100\nType: ${proposal.actionType}\n${proposal.riskAnalysis || 'No analysis'}`
            : 'Proposal not found'
          await answerCallback(query.id, detail.substring(0, 200))
          break
        }
      }

      return NextResponse.json({ ok: true })
    }

    // Handle regular messages
    if (body.message) {
      const chatId = String(body.message.chat.id)

      // Photo messages
      if (body.message.photo) {
        await handlePhoto(chatId)
        return NextResponse.json({ ok: true })
      }

      // Text messages and commands
      const text = body.message.text
      if (text) {
        await routeCommand(chatId, text)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // Always 200 for Telegram
  }
}
