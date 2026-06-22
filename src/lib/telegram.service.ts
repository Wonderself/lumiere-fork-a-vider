/**
 * Telegram Service for CineGeny Autopilot
 *
 * Sends proposals to admin via Telegram with inline keyboard buttons.
 * Requires env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID
 */

const SEVERITY_EMOJI: Record<string, string> = {
  INFO: 'ℹ️',
  WARNING: '⚠️',
  CRITICAL: '🔴',
  URGENT: '🚨',
}

const ACTION_LABELS: Record<string, string> = {
  TOGGLE_FEATURE_FLAG: '🔧 Feature Flag',
  UPDATE_AGENT_CONFIG: '🤖 Agent Config',
  APPROVE_CAMPAIGN: '📣 Campaign',
  UPDATE_USER_TIER: '👤 User Tier',
  SEND_NOTIFICATION: '🔔 Notification',
  CREATE_PROMO_CODE: '🎟️ Promo Code',
  TRIGGER_CRON: '⏰ Cron Job',
  MODIFY_BILLING_PARAM: '💰 Billing',
  PUBLISH_CONTENT: '📝 Content',
  PROMOTE_FILM: '🎬 Film Promo',
}

interface TelegramSendResult {
  success: boolean
  messageId?: number
  error?: string
}

/**
 * Send a proposal notification to the admin Telegram chat
 * with inline keyboard buttons for Approve/Deny/Details
 */
export async function sendProposalNotification(proposal: {
  id: string
  title: string
  description: string
  actionType: string
  severity: string
  riskScore: number
  agentSlug?: string | null
  isUrgent: boolean
}): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  if (!token || !chatId) {
    if (process.env.NODE_ENV !== "production") console.log('[Telegram] Bot token or chat ID not configured, skipping notification')
    return { success: false, error: 'Telegram not configured' }
  }

  const emoji = SEVERITY_EMOJI[proposal.severity] || 'ℹ️'
  const actionLabel = ACTION_LABELS[proposal.actionType] || proposal.actionType
  const urgentTag = proposal.isUrgent ? '\n🚨 **URGENT** — Requires immediate attention' : ''

  const text = [
    `${emoji} **New Autopilot Proposal**`,
    ``,
    `📋 **${proposal.title}**`,
    `${actionLabel}`,
    ``,
    `${proposal.description.substring(0, 300)}${proposal.description.length > 300 ? '...' : ''}`,
    ``,
    `⚖️ Risk: ${proposal.riskScore}/100`,
    proposal.agentSlug ? `🤖 Agent: ${proposal.agentSlug}` : '',
    urgentTag,
    ``,
    `ID: \`${proposal.id}\``,
  ].filter(Boolean).join('\n')

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '✅ Approve', callback_data: `approve:${proposal.id}` },
        { text: '❌ Deny', callback_data: `deny:${proposal.id}` },
      ],
      [
        { text: '📄 Details', callback_data: `details:${proposal.id}` },
      ],
    ],
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard,
      }),
    })

    const data = await res.json()

    if (data.ok) {
      return { success: true, messageId: data.result.message_id }
    }

    return { success: false, error: data.description || 'Telegram API error' }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Send a status update for a proposal (approved/denied/executed/failed)
 */
export async function sendStatusUpdate(data: {
  chatId: string
  messageId: number
  proposalTitle: string
  newStatus: string
  reviewerName?: string
  note?: string
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return

  const statusEmoji: Record<string, string> = {
    APPROVED: '✅',
    DENIED: '❌',
    COMPLETED: '🎉',
    FAILED: '💥',
    ROLLED_BACK: '⏪',
  }

  const emoji = statusEmoji[data.newStatus] || '📋'
  const text = [
    `${emoji} **Proposal Updated**`,
    ``,
    `📋 ${data.proposalTitle}`,
    `Status: **${data.newStatus}**`,
    data.reviewerName ? `By: ${data.reviewerName}` : '',
    data.note ? `Note: ${data.note}` : '',
  ].filter(Boolean).join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: data.chatId,
        message_id: data.messageId,
        text,
        parse_mode: 'Markdown',
      }),
    })
  } catch {
    // Silent failure — Telegram notification is best-effort
  }
}

/**
 * Parse a Telegram callback query from inline button press
 */
export function parseCallbackData(data: string): { action: string; proposalId: string } | null {
  const parts = data.split(':')
  if (parts.length !== 2) return null
  return { action: parts[0], proposalId: parts[1] }
}

/**
 * Answer a Telegram callback query (acknowledge button press)
 */
export async function answerCallback(callbackQueryId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return

  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    })
  } catch {
    // Silent
  }
}
