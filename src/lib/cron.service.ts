/**
 * CineGeny Cron Service
 * 7 scheduled tasks for platform maintenance and monitoring.
 *
 * In production, these would be triggered by:
 * - Vercel Cron / Coolify scheduled tasks
 * - External cron service hitting /api/cron endpoints
 */

import { prisma } from '@/lib/prisma'
import * as autopilot from '@/lib/autopilot.service'
import { sendDailyBriefing, sendCriticalAlert } from '@/lib/telegram-bot'

// ─── Cron Job Definitions ──────────────────────────────────────────

export interface CronJob {
  name: string
  schedule: string // cron expression
  description: string
  handler: () => Promise<CronResult>
}

export interface CronResult {
  success: boolean
  message: string
  details?: Record<string, unknown>
}

// ─── 1. Health Check (every 5 minutes) ──────────────────────────────

export async function cronHealthCheck(): Promise<CronResult> {
  try {
    // Check DB
    const userCount = await prisma.user.count()

    // Check for critical errors in last 5 min
    const recentErrors = await prisma.aIUsageLog.count({
      where: {
        success: false,
        createdAt: { gte: new Date(Date.now() - 5 * 60000) },
      },
    })

    if (recentErrors > 10) {
      await sendCriticalAlert({
        title: 'High Error Rate',
        message: `${recentErrors} AI errors in last 5 minutes. Circuit breaker may activate.`,
        severity: 'CRITICAL',
      })
    }

    return {
      success: true,
      message: `Health OK. ${userCount} users, ${recentErrors} recent errors`,
      details: { userCount, recentErrors },
    }
  } catch (err: any) {
    await sendCriticalAlert({
      title: 'Health Check Failed',
      message: err.message,
      severity: 'CRITICAL',
    })
    return { success: false, message: err.message }
  }
}

// ─── 2. User Reports (daily at 2am) ────────────────────────────────

export async function cronUserReports(): Promise<CronResult> {
  const yesterday = new Date(Date.now() - 86400000)

  const [newUsers, activeUsers, topCreators] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.user.count({ where: { updatedAt: { gte: yesterday } } }),
    prisma.user.findMany({
      where: { updatedAt: { gte: yesterday } },
      orderBy: { tasksCompleted: 'desc' },
      take: 5,
      select: { displayName: true, email: true, tasksCompleted: true },
    }),
  ])

  return {
    success: true,
    message: `Daily user report: +${newUsers} new, ${activeUsers} active`,
    details: { newUsers, activeUsers, topCreators },
  }
}

// ─── 3. DB Backup Reminder (daily at 3am) ───────────────────────────

export async function cronDbBackup(): Promise<CronResult> {
  // In production, this would trigger pg_dump on the PostgreSQL container
  // For now, just log and alert
  const tableCount = 30 // approximate
  const dbSize = 'N/A' // would query pg_database_size

  return {
    success: true,
    message: `DB backup reminder. Tables: ~${tableCount}, Size: ${dbSize}`,
    details: { tableCount, note: 'Configure pg_dump cron on server for actual backups' },
  }
}

// ─── 4. Disk Monitor (every 30 minutes) ─────────────────────────────

export async function cronDiskMonitor(): Promise<CronResult> {
  // In production, would check actual disk usage
  const memUsage = process.memoryUsage()
  const heapPercent = ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(1)

  if (parseFloat(heapPercent) > 85) {
    await sendCriticalAlert({
      title: 'High Memory Usage',
      message: `Heap usage at ${heapPercent}%. Consider restarting the application.`,
      severity: 'WARNING',
    })
  }

  return {
    success: true,
    message: `Memory: ${heapPercent}% heap used (${Math.round(memUsage.heapUsed / 1048576)}MB)`,
    details: {
      heapUsedMB: Math.round(memUsage.heapUsed / 1048576),
      heapTotalMB: Math.round(memUsage.heapTotal / 1048576),
      rssMB: Math.round(memUsage.rss / 1048576),
    },
  }
}

// ─── 5. Telegram Notify (every 15 minutes for pending) ──────────────

export async function cronTelegramNotify(): Promise<CronResult> {
  const pending = await prisma.autopilotProposal.count({
    where: { status: 'PENDING_REVIEW' as any },
  })

  const urgent = await prisma.autopilotProposal.count({
    where: { status: 'PENDING_REVIEW' as any, isUrgent: true },
  })

  if (urgent > 0) {
    await sendCriticalAlert({
      title: `${urgent} Urgent Proposal(s) Pending`,
      message: `There are ${urgent} urgent proposals awaiting your review.\nUse /pending to see them.`,
      severity: 'URGENT',
    })
  }

  return {
    success: true,
    message: `${pending} pending proposals (${urgent} urgent)`,
    details: { pending, urgent },
  }
}

// ─── 6. Morning Briefing (daily at 8am) ─────────────────────────────

export async function cronMorningBriefing(): Promise<CronResult> {
  await sendDailyBriefing()
  return {
    success: true,
    message: 'Morning briefing sent to Telegram',
  }
}

// ─── 7. Purge Old Data (weekly, 90 days) ────────────────────────────

export async function cronPurge90Days(): Promise<CronResult> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000)

  // Purge old audit logs
  const deletedAudits = await prisma.autopilotAudit.deleteMany({
    where: { createdAt: { lt: ninetyDaysAgo } },
  })

  // Purge old daily budgets
  const deletedBudgets = await prisma.dailyBudget.deleteMany({
    where: { date: { lt: ninetyDaysAgo } },
  })

  // Purge expired wallet holds
  const deletedHolds = await prisma.walletHold.deleteMany({
    where: {
      status: { in: ['RELEASED', 'EXPIRED', 'FAILED'] },
      createdAt: { lt: ninetyDaysAgo },
    },
  })

  return {
    success: true,
    message: `Purged: ${deletedAudits.count} audits, ${deletedBudgets.count} budgets, ${deletedHolds.count} holds`,
    details: {
      audits: deletedAudits.count,
      budgets: deletedBudgets.count,
      holds: deletedHolds.count,
    },
  }
}

// ─── Cron Registry ──────────────────────────────────────────────────

export const CRON_JOBS: CronJob[] = [
  {
    name: 'health-check',
    schedule: '*/5 * * * *',
    description: 'Check platform health every 5 minutes',
    handler: cronHealthCheck,
  },
  {
    name: 'user-reports',
    schedule: '0 2 * * *',
    description: 'Generate daily user reports at 2am',
    handler: cronUserReports,
  },
  {
    name: 'db-backup',
    schedule: '0 3 * * *',
    description: 'Database backup reminder at 3am',
    handler: cronDbBackup,
  },
  {
    name: 'disk-monitor',
    schedule: '*/30 * * * *',
    description: 'Monitor disk/memory every 30 minutes',
    handler: cronDiskMonitor,
  },
  {
    name: 'telegram-notify',
    schedule: '*/15 * * * *',
    description: 'Notify about pending proposals every 15 minutes',
    handler: cronTelegramNotify,
  },
  {
    name: 'morning-briefing',
    schedule: '0 8 * * *',
    description: 'Send daily briefing to Telegram at 8am',
    handler: cronMorningBriefing,
  },
  {
    name: 'purge-90days',
    schedule: '0 4 * * 0',
    description: 'Purge data older than 90 days (Sundays 4am)',
    handler: cronPurge90Days,
  },
]

/** Run a cron job by name */
export async function runCronJob(name: string): Promise<CronResult> {
  const job = CRON_JOBS.find(j => j.name === name)
  if (!job) return { success: false, message: `Unknown cron job: ${name}` }

  try {
    return await job.handler()
  } catch (err: any) {
    return { success: false, message: err.message }
  }
}

/** Run all cron jobs */
export async function runAllCrons(): Promise<Record<string, CronResult>> {
  const results: Record<string, CronResult> = {}
  for (const job of CRON_JOBS) {
    results[job.name] = await runCronJob(job.name)
  }
  return results
}
