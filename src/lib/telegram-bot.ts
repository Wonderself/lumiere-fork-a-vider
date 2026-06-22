/**
 * CineGeny Telegram Admin Bot
 * Full platform control from Telegram.
 *
 * Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID
 */

import { prisma } from '@/lib/prisma'
import * as autopilot from '@/lib/autopilot.service'
import { microToCredits } from '@/lib/ai-pricing'
import * as walletService from '@/lib/wallet.service'

const BOT_TOKEN = () => process.env.TELEGRAM_BOT_TOKEN || ''
const ADMIN_CHAT = () => process.env.TELEGRAM_ADMIN_CHAT_ID || ''

// ─── Telegram API Helpers ───────────────────────────────────────────

async function sendMessage(chatId: string, text: string, parseMode: string = 'Markdown'): Promise<number | null> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.substring(0, 4096),
        parse_mode: parseMode,
      }),
    })
    const data = await res.json()
    return data.ok ? data.result.message_id : null
  } catch {
    return null
  }
}

async function sendLongMessage(chatId: string, text: string): Promise<void> {
  const chunks: string[] = []
  let current = ''
  for (const line of text.split('\n')) {
    if ((current + '\n' + line).length > 4000) {
      chunks.push(current)
      current = line
    } else {
      current += (current ? '\n' : '') + line
    }
  }
  if (current) chunks.push(current)
  for (const chunk of chunks) {
    await sendMessage(chatId, chunk)
  }
}

// ─── INFO COMMANDS ──────────────────────────────────────────────────

export async function handleStatus(chatId: string): Promise<void> {
  const uptime = process.uptime()
  const hours = Math.floor(uptime / 3600)
  const mins = Math.floor((uptime % 3600) / 60)
  const mem = process.memoryUsage()

  const [userCount, filmCount, convCount] = await Promise.all([
    prisma.user.count(),
    prisma.film.count(),
    prisma.conversation.count(),
  ])

  const text = [
    '📊 *Platform Status*',
    '',
    `⏱ Uptime: ${hours}h ${mins}m`,
    `💾 Memory: ${Math.round(mem.heapUsed / 1048576)}MB / ${Math.round(mem.heapTotal / 1048576)}MB`,
    `📦 RSS: ${Math.round(mem.rss / 1048576)}MB`,
    '',
    `👥 Users: ${userCount}`,
    `🎬 Films: ${filmCount}`,
    `💬 Conversations: ${convCount}`,
    '',
    `✅ Node: ${process.version}`,
    `✅ Database: Connected`,
    `✅ API: Running`,
  ].join('\n')

  await sendMessage(chatId, text)
}

export async function handleUsers(chatId: string): Promise<void> {
  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const monthAgo = new Date(Date.now() - 30 * 86400000)

  const [total, newToday, newWeek, newMonth, admins, verified] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { isVerified: true } }),
  ])

  const text = [
    '👥 *User Statistics*',
    '',
    `Total: *${total}*`,
    `Verified: ${verified}`,
    `Admins: ${admins}`,
    '',
    '📈 *New Users*',
    `Today: +${newToday}`,
    `This week: +${newWeek}`,
    `This month: +${newMonth}`,
  ].join('\n')

  await sendMessage(chatId, text)
}

export async function handleRevenue(chatId: string): Promise<void> {
  const stats = await walletService.getAdminStats()

  const text = [
    '💰 *Revenue & Billing*',
    '',
    `Revenue: *${microToCredits(stats.totalRevenue).toFixed(2)}* credits`,
    `Margin: ${microToCredits(stats.totalMargin).toFixed(2)} credits`,
    `AI Requests: ${stats.totalRequests}`,
    `Active Wallets: ${stats.activeWallets}`,
    `Total Balance: ${microToCredits(stats.totalBalance).toFixed(2)} credits`,
    '',
    '🏆 *Top Users*',
    ...stats.topUsers.slice(0, 5).map((u, i) =>
      `${i + 1}. ${u.displayName || 'Anonymous'} — ${microToCredits(u.totalSpent).toFixed(2)} cr (${u.requestCount} req)`
    ),
    '',
    '📊 *By Action*',
    ...stats.byAction.slice(0, 5).map(a =>
      `• ${a.action}: ${a.count} exec, ${microToCredits(a.totalBilled).toFixed(2)} cr`
    ),
  ].join('\n')

  await sendMessage(chatId, text)
}

export async function handleErrors(chatId: string): Promise<void> {
  const oneHourAgo = new Date(Date.now() - 3600000)
  const oneDayAgo = new Date(Date.now() - 86400000)

  const [failedHour, failedDay, failedProposals, failedExecs] = await Promise.all([
    prisma.aIUsageLog.count({ where: { success: false, createdAt: { gte: oneHourAgo } } }),
    prisma.aIUsageLog.count({ where: { success: false, createdAt: { gte: oneDayAgo } } }),
    prisma.autopilotProposal.count({ where: { status: 'FAILED' as any, executedAt: { gte: oneDayAgo } } }),
    prisma.agentExecution.count({ where: { status: 'FAILED', createdAt: { gte: oneDayAgo } } }),
  ])

  const totalHour = await prisma.aIUsageLog.count({ where: { createdAt: { gte: oneHourAgo } } })
  const errorRate = totalHour > 0 ? ((failedHour / totalHour) * 100).toFixed(1) : '0'

  const recentErrors = await prisma.aIUsageLog.findMany({
    where: { success: false, createdAt: { gte: oneDayAgo } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { errorMessage: true, action: true, model: true, createdAt: true },
  })

  const text = [
    '❌ *Error Report*',
    '',
    `Error rate (1h): *${errorRate}%* (${failedHour}/${totalHour})`,
    `Failed AI calls (24h): ${failedDay}`,
    `Failed proposals (24h): ${failedProposals}`,
    `Failed agent executions (24h): ${failedExecs}`,
    '',
    '🔍 *Recent Errors*',
    ...recentErrors.map(e =>
      `• [${e.action}] ${e.model}: ${(e.errorMessage || 'Unknown').substring(0, 80)}`
    ),
    recentErrors.length === 0 ? '✅ No errors in the last 24h' : '',
  ].join('\n')

  await sendMessage(chatId, text)
}

export async function handleFilms(chatId: string): Promise<void> {
  const [total, byStatus, topVoted] = await Promise.all([
    prisma.film.count(),
    prisma.film.groupBy({
      by: ['status'],
      _count: true,
      orderBy: { _count: { status: 'desc' } },
    }),
    prisma.film.findMany({
      orderBy: { votes: { _count: 'desc' } },
      take: 5,
      select: { title: true, status: true, genre: true, _count: { select: { votes: true } } },
    }),
  ])

  const text = [
    '🎬 *Film Statistics*',
    '',
    `Total: *${total}*`,
    '',
    '📊 *By Status*',
    ...byStatus.map(s => `• ${s.status}: ${s._count}`),
    '',
    '🏆 *Top Voted*',
    ...topVoted.map((f, i) => `${i + 1}. ${f.title} (${f.genre || '?'}) — ${f._count.votes} votes`),
  ].join('\n')

  await sendMessage(chatId, text)
}

// ─── VALIDATION COMMANDS ────────────────────────────────────────────

export async function handlePending(chatId: string): Promise<void> {
  const pending = await autopilot.getPendingProposals(10)

  if (pending.length === 0) {
    await sendMessage(chatId, '✅ *No pending proposals*\nAll clear!')
    return
  }

  const text = [
    `⏳ *Pending Proposals* (${pending.length})`,
    '',
    ...pending.map(p => {
      const sev = p.severity === 'URGENT' ? '🚨' : p.severity === 'CRITICAL' ? '🔴' : p.severity === 'WARNING' ? '⚠️' : 'ℹ️'
      return [
        `${sev} *${p.title}*`,
        `ID: \`${p.id}\``,
        `Type: ${p.actionType.replace(/_/g, ' ')} | Risk: ${p.riskScore}/100`,
        `→ /approve ${p.id}`,
        `→ /reject ${p.id} [reason]`,
        '',
      ].join('\n')
    }),
  ].join('\n')

  await sendLongMessage(chatId, text)
}

export async function handleApprove(chatId: string, proposalId: string): Promise<void> {
  if (!proposalId) {
    await sendMessage(chatId, '⚠️ Usage: `/approve {id}`')
    return
  }

  try {
    await autopilot.approveProposal(proposalId, 'telegram-admin', 'Approved via Telegram')
    const result = await autopilot.executeProposal(proposalId)

    if (result.success) {
      await sendMessage(chatId, `✅ *Approved & Executed*\nID: \`${proposalId}\``)
    } else {
      await sendMessage(chatId, `✅ Approved but ❌ execution failed:\n${result.error}`)
    }
  } catch (err: any) {
    await sendMessage(chatId, `❌ Error: ${err.message}`)
  }
}

export async function handleReject(chatId: string, proposalId: string, reason: string): Promise<void> {
  if (!proposalId) {
    await sendMessage(chatId, '⚠️ Usage: `/reject {id} {reason}`')
    return
  }

  try {
    await autopilot.denyProposal(proposalId, 'telegram-admin', reason || 'Rejected via Telegram')
    await sendMessage(chatId, `❌ *Rejected*\nID: \`${proposalId}\`\nReason: ${reason || 'No reason given'}`)
  } catch (err: any) {
    await sendMessage(chatId, `❌ Error: ${err.message}`)
  }
}

export async function handleBacklog(chatId: string): Promise<void> {
  const recent = await autopilot.getProposals({ limit: 10 })

  const statusEmoji: Record<string, string> = {
    COMPLETED: '✅', FAILED: '❌', DENIED: '🚫', APPROVED: '👍',
    PENDING_REVIEW: '⏳', ROLLED_BACK: '⏪', EXECUTING: '⚙️', DRAFT: '📝',
  }

  const text = [
    '📋 *Decision Backlog* (last 10)',
    '',
    ...recent.map(p => {
      const emoji = statusEmoji[p.status] || '📋'
      return `${emoji} *${p.title}*\n   ${p.status} | ${p.actionType.replace(/_/g, ' ')} | ${new Date(p.createdAt).toLocaleDateString('fr-FR')}`
    }),
  ].join('\n')

  await sendLongMessage(chatId, text)
}

// ─── SYSTEM COMMANDS ────────────────────────────────────────────────

export async function handleDeploy(chatId: string): Promise<void> {
  await sendMessage(chatId, '🚀 *Deploy triggered*\n\n⚠️ Auto-deploy via Telegram requires CI/CD webhook configuration.\nSet `DEPLOY_WEBHOOK_URL` env var to enable.')
  // TODO: In production, trigger Coolify redeploy via API
}

export async function handleBackup(chatId: string): Promise<void> {
  await sendMessage(chatId, '💾 *Backup initiated*\n\n⚠️ Auto-backup requires server SSH access.\nBackup command: `pg_dump` on PostgreSQL container.\nStatus: Manual backup recommended.')
}

export async function handleReport(chatId: string, period: string = 'daily'): Promise<void> {
  const isWeekly = period === 'weekly'
  const since = new Date(Date.now() - (isWeekly ? 7 : 1) * 86400000)

  const [newUsers, aiRequests, revenue, proposals, conversations] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: since } } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: since } }, _sum: { billedCredits: true } }),
    prisma.autopilotProposal.count({ where: { createdAt: { gte: since } } }),
    prisma.conversation.count({ where: { createdAt: { gte: since } } }),
  ])

  const text = [
    `📊 *${isWeekly ? 'Weekly' : 'Daily'} Report*`,
    `Period: ${since.toLocaleDateString('fr-FR')} → now`,
    '',
    `👥 New users: +${newUsers}`,
    `🤖 AI requests: ${aiRequests}`,
    `💰 Revenue: ${microToCredits(revenue._sum.billedCredits ?? 0).toFixed(2)} credits`,
    `📋 Proposals: ${proposals}`,
    `💬 Conversations: ${conversations}`,
  ].join('\n')

  await sendMessage(chatId, text)
}

export async function handleBroadcast(chatId: string, message: string): Promise<void> {
  if (!message) {
    await sendMessage(chatId, '⚠️ Usage: `/broadcast {message}`')
    return
  }

  // Create notifications for all users
  const users = await prisma.user.findMany({ select: { id: true } })
  let count = 0

  for (const user of users) {
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          title: 'Message de la plateforme',
          body: message,
          read: false,
        },
      })
      count++
    } catch {
      // Skip failed notifications
    }
  }

  await sendMessage(chatId, `📢 *Broadcast sent*\nDelivered to ${count}/${users.length} users`)
}

export async function handleCredits(chatId: string, email: string, amount: string): Promise<void> {
  if (!email || !amount) {
    await sendMessage(chatId, '⚠️ Usage: `/credits {email} {amount}`')
    return
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, displayName: true } })
  if (!user) {
    await sendMessage(chatId, `❌ User not found: ${email}`)
    return
  }

  const creditAmount = parseInt(amount) * 1_000_000 // Convert credits to micro-credits
  if (isNaN(creditAmount) || creditAmount <= 0) {
    await sendMessage(chatId, '❌ Invalid amount')
    return
  }

  try {
    const result = await walletService.deposit({
      userId: user.id,
      amount: creditAmount,
      description: `Telegram admin credit: ${amount} credits`,
      type: 'ADMIN_GRANT',
      metadata: { via: 'telegram' },
    })

    await sendMessage(chatId, `✅ *Credits granted*\nUser: ${user.displayName || email}\nAmount: +${amount} credits\nNew balance: ${microToCredits(result.account.balance).toFixed(2)} credits`)
  } catch (err: any) {
    await sendMessage(chatId, `❌ Error: ${err.message}`)
  }
}

export async function handleUserLookup(chatId: string, email: string): Promise<void> {
  if (!email) {
    await sendMessage(chatId, '⚠️ Usage: `/user {email}`')
    return
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      creditAccount: true,
      subscription: true,
      _count: {
        select: {
          claimedTasks: true,
          filmVotes: true,
          conversations: true,
          agentExecutions: true,
        },
      },
    },
  })

  if (!user) {
    await sendMessage(chatId, `❌ User not found: ${email}`)
    return
  }

  const text = [
    `👤 *User: ${user.displayName || 'No name'}*`,
    '',
    `📧 ${user.email}`,
    `🎭 Role: ${user.role}`,
    `📊 Level: ${user.level}`,
    `✅ Verified: ${user.isVerified ? 'Yes' : 'No'}`,
    `📅 Joined: ${new Date(user.createdAt).toLocaleDateString('fr-FR')}`,
    '',
    '💰 *Wallet*',
    `Balance: ${user.creditAccount ? microToCredits(user.creditAccount.balance).toFixed(2) : '0'} credits`,
    `Total purchased: ${user.creditAccount ? microToCredits(user.creditAccount.totalPurchased).toFixed(2) : '0'}`,
    `Total used: ${user.creditAccount ? microToCredits(user.creditAccount.totalUsed).toFixed(2) : '0'}`,
    '',
    '📊 *Activity*',
    `Tasks claimed: ${user._count.claimedTasks}`,
    `Votes: ${user._count.filmVotes}`,
    `Conversations: ${user._count.conversations}`,
    `Agent executions: ${user._count.agentExecutions}`,
    '',
    `🎫 Subscription: ${user.subscription?.plan || 'FREE'}`,
    `⭐ Lumens: ${user.lumenBalance}`,
    `🏅 Rating: ${user.rating}`,
  ].join('\n')

  await sendMessage(chatId, text)
}

// ─── AI COMMANDS ────────────────────────────────────────────────────

export async function handleClaude(chatId: string, instruction: string): Promise<void> {
  if (!instruction) {
    await sendMessage(chatId, '⚠️ Usage: `/claude {instruction}`')
    return
  }
  await sendMessage(chatId, `🤖 *Claude CLI*\n\n⚠️ Direct Claude Code CLI execution requires server-side process spawning.\nInstruction received: "${instruction.substring(0, 200)}"\n\nThis will be available when the AI API is connected.`)
}

export async function handleThink(chatId: string, question: string): Promise<void> {
  if (!question) {
    await sendMessage(chatId, '⚠️ Usage: `/think {question}`')
    return
  }
  await sendMessage(chatId, `🧠 *Extended Thinking*\n\nQuestion: "${question.substring(0, 200)}"\n\n⚠️ Opus Extended Thinking will be connected when the AI API is integrated.\nThis will use the highest-tier model for deep strategic analysis.`)
}

export async function handleChat(chatId: string, message: string): Promise<void> {
  if (!message) {
    await sendMessage(chatId, '💬 *Chat Mode*\n\nSend any message to start a conversation.\nI remember context within this session.')
    return
  }
  await sendMessage(chatId, `💬 You said: "${message.substring(0, 200)}"\n\n⚠️ Free-form chat will be available when the AI API is connected.`)
}

export async function handlePhoto(chatId: string): Promise<void> {
  await sendMessage(chatId, '📸 *Photo received*\n\n⚠️ AI image analysis will be available when the vision API is connected.\nThis will use Claude\'s multimodal capabilities for automatic analysis.')
}

// ─── DAILY BRIEFING ─────────────────────────────────────────────────

export async function sendDailyBriefing(): Promise<void> {
  const chatId = ADMIN_CHAT()
  if (!chatId) return

  const yesterday = new Date(Date.now() - 86400000)

  const [newUsers, aiRequests, revenue, pending, errors, topFilm] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: yesterday } }, _sum: { billedCredits: true } }),
    prisma.autopilotProposal.count({ where: { status: 'PENDING_REVIEW' as any } }),
    prisma.aIUsageLog.count({ where: { success: false, createdAt: { gte: yesterday } } }),
    prisma.film.findFirst({ orderBy: { updatedAt: 'desc' } , select: { title: true, status: true } }),
  ])

  const text = [
    '☀️ *Bonjour ! Daily Briefing CineGeny*',
    `📅 ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`,
    '',
    '📊 *24h Summary*',
    `👥 New users: +${newUsers}`,
    `🤖 AI requests: ${aiRequests}`,
    `💰 Revenue: ${microToCredits(revenue._sum.billedCredits ?? 0).toFixed(2)} credits`,
    `❌ Errors: ${errors}`,
    '',
    `⏳ Pending proposals: ${pending}`,
    topFilm ? `🎬 Latest film activity: ${topFilm.title} (${topFilm.status})` : '',
    '',
    '🔧 *Quick Actions*',
    '/status — Platform health',
    '/pending — Review proposals',
    '/report — Full report',
  ].join('\n')

  await sendMessage(chatId, text)
}

// ─── PROACTIVE NOTIFICATIONS ────────────────────────────────────────

export async function sendCriticalAlert(alert: { title: string; message: string; severity: string }): Promise<void> {
  const chatId = ADMIN_CHAT()
  if (!chatId) return

  const emoji = alert.severity === 'CRITICAL' ? '🔴' : alert.severity === 'URGENT' ? '🚨' : '⚠️'
  await sendMessage(chatId, `${emoji} *ALERT: ${alert.title}*\n\n${alert.message}`)
}

// ─── COMMAND ROUTER ─────────────────────────────────────────────────

export async function routeCommand(chatId: string, text: string): Promise<void> {
  const parts = text.trim().split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)
  const argString = args.join(' ')

  switch (command) {
    // Info
    case '/status': return handleStatus(chatId)
    case '/users': return handleUsers(chatId)
    case '/revenue': return handleRevenue(chatId)
    case '/errors': return handleErrors(chatId)
    case '/films': return handleFilms(chatId)

    // Validation
    case '/pending': return handlePending(chatId)
    case '/approve': return handleApprove(chatId, args[0])
    case '/reject': return handleReject(chatId, args[0], args.slice(1).join(' '))
    case '/backlog': return handleBacklog(chatId)

    // System
    case '/deploy': return handleDeploy(chatId)
    case '/backup': return handleBackup(chatId)
    case '/report': return handleReport(chatId, args[0] || 'daily')
    case '/broadcast': return handleBroadcast(chatId, argString)
    case '/credits': return handleCredits(chatId, args[0], args[1])
    case '/user': return handleUserLookup(chatId, args[0])

    // AI
    case '/claude': return handleClaude(chatId, argString)
    case '/think': return handleThink(chatId, argString)
    case '/chat': return handleChat(chatId, argString)

    // Help
    case '/help':
    case '/start':
      await sendMessage(chatId, [
        '🎬 *CineGeny Admin Bot*',
        '',
        '📊 *Info*',
        '/status — Platform health',
        '/users — User statistics',
        '/revenue — Revenue & billing',
        '/errors — Error report',
        '/films — Film statistics',
        '',
        '✅ *Validation*',
        '/pending — Pending proposals',
        '/approve {id} — Approve',
        '/reject {id} {reason} — Reject',
        '/backlog — Decision history',
        '',
        '⚙️ *System*',
        '/deploy — Trigger deploy',
        '/backup — Database backup',
        '/report [daily|weekly] — Report',
        '/broadcast {msg} — Message all users',
        '/credits {email} {amount} — Credit user',
        '/user {email} — User lookup',
        '',
        '🤖 *AI*',
        '/claude {instruction} — Claude CLI',
        '/think {question} — Extended Thinking',
        '/chat — Free conversation',
        '📸 Send photo for AI analysis',
      ].join('\n'))
      return

    default:
      // Treat as chat message if not a command
      if (!text.startsWith('/')) {
        return handleChat(chatId, text)
      }
      await sendMessage(chatId, `❓ Unknown command: ${command}\nType /help for available commands.`)
  }
}
