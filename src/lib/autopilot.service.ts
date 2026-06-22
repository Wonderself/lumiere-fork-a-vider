import { prisma } from '@/lib/prisma'

// ─── Types ──────────────────────────────────────────────────────────

type ActionType = 'TOGGLE_FEATURE_FLAG' | 'UPDATE_AGENT_CONFIG' | 'APPROVE_CAMPAIGN' | 'UPDATE_USER_TIER' | 'SEND_NOTIFICATION' | 'CREATE_PROMO_CODE' | 'TRIGGER_CRON' | 'MODIFY_BILLING_PARAM' | 'PUBLISH_CONTENT' | 'PROMOTE_FILM'
type Severity = 'INFO' | 'WARNING' | 'CRITICAL' | 'URGENT'
type Status = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'DENIED' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK'

export interface CreateProposalInput {
  createdById?: string
  agentSlug?: string
  actionType: ActionType
  title: string
  description: string
  payload: Record<string, unknown>
  severity?: Severity
  riskScore?: number
  riskAnalysis?: string
  snapshotBefore?: Record<string, unknown>
  rollbackPayload?: Record<string, unknown>
  isUrgent?: boolean
  expiresAt?: Date
}

export interface ProposalStats {
  total: number
  pending: number
  approved: number
  denied: number
  completed: number
  failed: number
  rolledBack: number
  todayCount: number
  urgentThisHour: number
}

// ─── Rate Limiting ──────────────────────────────────────────────────

const DAILY_LIMIT = 50
const URGENT_HOURLY_LIMIT = 5

export async function checkRateLimit(createdById?: string): Promise<{ allowed: boolean; reason?: string }> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayCount = await prisma.autopilotProposal.count({
    where: {
      createdAt: { gte: today, lt: tomorrow },
      ...(createdById && { createdById }),
    },
  })

  if (todayCount >= DAILY_LIMIT) {
    return { allowed: false, reason: `Daily limit reached (${DAILY_LIMIT}/day)` }
  }

  return { allowed: true }
}

export async function checkUrgentRateLimit(): Promise<{ allowed: boolean; reason?: string }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const urgentCount = await prisma.autopilotProposal.count({
    where: {
      isUrgent: true,
      createdAt: { gte: oneHourAgo },
    },
  })

  if (urgentCount >= URGENT_HOURLY_LIMIT) {
    return { allowed: false, reason: `Urgent limit reached (${URGENT_HOURLY_LIMIT}/hour)` }
  }

  return { allowed: true }
}

// ─── Risk Estimation ────────────────────────────────────────────────

const ACTION_RISK_BASE: Record<ActionType, number> = {
  TOGGLE_FEATURE_FLAG: 30,
  UPDATE_AGENT_CONFIG: 20,
  APPROVE_CAMPAIGN: 15,
  UPDATE_USER_TIER: 25,
  SEND_NOTIFICATION: 10,
  CREATE_PROMO_CODE: 15,
  TRIGGER_CRON: 35,
  MODIFY_BILLING_PARAM: 60,
  PUBLISH_CONTENT: 20,
  PROMOTE_FILM: 10,
}

export function estimateRisk(actionType: ActionType, severity: Severity, payload: Record<string, unknown>): { score: number; analysis: string } {
  let score = ACTION_RISK_BASE[actionType] || 20

  // Adjust by severity
  if (severity === 'CRITICAL') score += 20
  if (severity === 'URGENT') score += 30
  if (severity === 'WARNING') score += 10

  // Adjust by payload scope
  if (payload.affectsAllUsers) score += 25
  if (payload.involvesPayment) score += 15
  if (payload.irreversible) score += 30

  score = Math.min(100, Math.max(0, score))

  const analysis = score >= 70
    ? 'HIGH RISK — Requires careful review. May affect billing, users, or system stability.'
    : score >= 40
    ? 'MEDIUM RISK — Standard review recommended. Limited blast radius.'
    : 'LOW RISK — Routine action. Minimal impact expected.'

  return { score, analysis }
}

// ─── Proposals CRUD ─────────────────────────────────────────────────

export async function createProposal(input: CreateProposalInput) {
  // Rate limit check
  const rateCheck = await checkRateLimit(input.createdById)
  if (!rateCheck.allowed) throw new Error(rateCheck.reason)

  if (input.isUrgent) {
    const urgentCheck = await checkUrgentRateLimit()
    if (!urgentCheck.allowed) throw new Error(urgentCheck.reason)
  }

  // Auto-estimate risk if not provided
  const risk = input.riskScore !== undefined
    ? { score: input.riskScore, analysis: input.riskAnalysis || '' }
    : estimateRisk(input.actionType, input.severity || 'INFO', input.payload)

  return prisma.autopilotProposal.create({
    data: {
      createdById: input.createdById,
      agentSlug: input.agentSlug,
      actionType: input.actionType as any,
      title: input.title,
      description: input.description,
      payload: input.payload as any,
      severity: (input.severity || 'INFO') as any,
      riskScore: risk.score,
      riskAnalysis: risk.analysis,
      snapshotBefore: input.snapshotBefore as any,
      rollbackPayload: input.rollbackPayload as any,
      isUrgent: input.isUrgent ?? false,
      expiresAt: input.expiresAt,
      status: 'PENDING_REVIEW' as any,
    },
  })
}

export async function getProposal(id: string) {
  return prisma.autopilotProposal.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, displayName: true, email: true } },
      reviewedBy: { select: { id: true, displayName: true, email: true } },
    },
  })
}

export async function getPendingProposals(limit = 20) {
  return prisma.autopilotProposal.findMany({
    where: { status: 'PENDING_REVIEW' as any },
    orderBy: [
      { isUrgent: 'desc' },
      { severity: 'desc' },
      { createdAt: 'asc' },
    ],
    take: limit,
    include: {
      createdBy: { select: { id: true, displayName: true } },
    },
  })
}

export async function getProposals(filters?: {
  status?: Status
  actionType?: ActionType
  severity?: Severity
  limit?: number
  offset?: number
}) {
  return prisma.autopilotProposal.findMany({
    where: {
      ...(filters?.status && { status: filters.status as any }),
      ...(filters?.actionType && { actionType: filters.actionType as any }),
      ...(filters?.severity && { severity: filters.severity as any }),
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit ?? 50,
    skip: filters?.offset ?? 0,
    include: {
      createdBy: { select: { id: true, displayName: true } },
      reviewedBy: { select: { id: true, displayName: true } },
    },
  })
}

// ─── Approval / Denial ──────────────────────────────────────────────

export async function approveProposal(id: string, reviewerId: string, note?: string) {
  return prisma.autopilotProposal.update({
    where: { id },
    data: {
      status: 'APPROVED' as any,
      reviewedById: reviewerId,
      reviewNote: note,
      reviewedAt: new Date(),
    },
  })
}

export async function denyProposal(id: string, reviewerId: string, note?: string) {
  return prisma.autopilotProposal.update({
    where: { id },
    data: {
      status: 'DENIED' as any,
      reviewedById: reviewerId,
      reviewNote: note,
      reviewedAt: new Date(),
    },
  })
}

// ─── Execution ──────────────────────────────────────────────────────

export async function executeProposal(id: string): Promise<{ success: boolean; error?: string }> {
  const proposal = await prisma.autopilotProposal.findUnique({ where: { id } })
  if (!proposal) return { success: false, error: 'Proposal not found' }
  if (proposal.status !== 'APPROVED') return { success: false, error: 'Proposal not approved' }

  // Mark as executing
  await prisma.autopilotProposal.update({
    where: { id },
    data: { status: 'EXECUTING' as any },
  })

  try {
    const payload = proposal.payload as Record<string, unknown>
    let result: Record<string, unknown> = {}

    switch (proposal.actionType) {
      case 'TOGGLE_FEATURE_FLAG': {
        const key = payload.flagKey as string
        const value = payload.value as boolean
        await prisma.featureFlag.upsert({
          where: { key },
          create: { key, value, description: payload.description as string, changedBy: proposal.reviewedById, changedAt: new Date() },
          update: { value, changedBy: proposal.reviewedById, changedAt: new Date() },
        })
        result = { flagKey: key, newValue: value }
        break
      }

      case 'UPDATE_USER_TIER': {
        const userId = payload.userId as string
        const newLevel = payload.level as string
        await prisma.user.update({
          where: { id: userId },
          data: { level: newLevel as any },
        })
        result = { userId, newLevel }
        break
      }

      case 'CREATE_PROMO_CODE': {
        // Store promo code in feature flags as a simple implementation
        const code = payload.code as string
        const credits = payload.credits as number
        await prisma.featureFlag.upsert({
          where: { key: `promo_${code}` },
          create: { key: `promo_${code}`, value: true, description: `Promo: ${credits} credits`, changedBy: proposal.reviewedById, changedAt: new Date() },
          update: { value: true, changedAt: new Date() },
        })
        result = { code, credits }
        break
      }

      case 'MODIFY_BILLING_PARAM': {
        const paramKey = payload.paramKey as string
        const paramValue = payload.paramValue
        // Store billing param change as feature flag
        await prisma.featureFlag.upsert({
          where: { key: `billing_${paramKey}` },
          create: { key: `billing_${paramKey}`, value: true, description: JSON.stringify(paramValue), changedBy: proposal.reviewedById, changedAt: new Date() },
          update: { value: true, description: JSON.stringify(paramValue), changedAt: new Date() },
        })
        result = { paramKey, paramValue }
        break
      }

      default:
        // For other action types, just log completion
        result = { action: proposal.actionType, payload, note: 'Execution logged — full implementation pending' }
    }

    await prisma.autopilotProposal.update({
      where: { id },
      data: {
        status: 'COMPLETED' as any,
        executionResult: result as any,
        executedAt: new Date(),
      },
    })

    return { success: true }
  } catch (err: any) {
    await prisma.autopilotProposal.update({
      where: { id },
      data: {
        status: 'FAILED' as any,
        executionError: err.message,
        executedAt: new Date(),
      },
    })
    return { success: false, error: err.message }
  }
}

// ─── Rollback ───────────────────────────────────────────────────────

export async function rollbackProposal(id: string): Promise<{ success: boolean; error?: string }> {
  const proposal = await prisma.autopilotProposal.findUnique({ where: { id } })
  if (!proposal) return { success: false, error: 'Proposal not found' }
  if (proposal.status !== 'COMPLETED' && proposal.status !== 'FAILED') {
    return { success: false, error: 'Can only rollback completed or failed proposals' }
  }

  try {
    const rollback = proposal.rollbackPayload as Record<string, unknown> | null

    if (proposal.actionType === 'TOGGLE_FEATURE_FLAG' && proposal.snapshotBefore) {
      const snapshot = proposal.snapshotBefore as Record<string, unknown>
      const key = (proposal.payload as Record<string, unknown>).flagKey as string
      await prisma.featureFlag.update({
        where: { key },
        data: { value: snapshot.value as boolean, changedBy: 'rollback', changedAt: new Date() },
      })
    }

    await prisma.autopilotProposal.update({
      where: { id },
      data: {
        status: 'ROLLED_BACK' as any,
        rolledBackAt: new Date(),
      },
    })

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ─── Stats ──────────────────────────────────────────────────────────

export async function getProposalStats(): Promise<ProposalStats> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const [total, pending, approved, denied, completed, failed, rolledBack, todayCount, urgentThisHour] = await Promise.all([
    prisma.autopilotProposal.count(),
    prisma.autopilotProposal.count({ where: { status: 'PENDING_REVIEW' as any } }),
    prisma.autopilotProposal.count({ where: { status: 'APPROVED' as any } }),
    prisma.autopilotProposal.count({ where: { status: 'DENIED' as any } }),
    prisma.autopilotProposal.count({ where: { status: 'COMPLETED' as any } }),
    prisma.autopilotProposal.count({ where: { status: 'FAILED' as any } }),
    prisma.autopilotProposal.count({ where: { status: 'ROLLED_BACK' as any } }),
    prisma.autopilotProposal.count({ where: { createdAt: { gte: today } } }),
    prisma.autopilotProposal.count({ where: { isUrgent: true, createdAt: { gte: oneHourAgo } } }),
  ])

  return { total, pending, approved, denied, completed, failed, rolledBack, todayCount, urgentThisHour }
}

// ─── Auditors ───────────────────────────────────────────────────────

export async function runHealthAudit() {
  const audit = await prisma.autopilotAudit.create({
    data: { auditorType: 'HEALTH' as any, status: 'RUNNING' as any },
  })

  const startTime = Date.now()
  const findings: Array<{ check: string; status: string; detail: string }> = []
  let issues = 0
  let critical = 0
  let warnings = 0

  // Check 1: Database connectivity
  try {
    await prisma.user.count()
    findings.push({ check: 'Database', status: 'OK', detail: 'Connected and responsive' })
  } catch {
    findings.push({ check: 'Database', status: 'CRITICAL', detail: 'Connection failed' })
    critical++
    issues++
  }

  // Check 2: Failed proposals in last hour
  const recentFails = await prisma.autopilotProposal.count({
    where: { status: 'FAILED' as any, executedAt: { gte: new Date(Date.now() - 3600000) } },
  })
  if (recentFails > 3) {
    findings.push({ check: 'Proposal failures', status: 'WARNING', detail: `${recentFails} failures in last hour` })
    warnings++
    issues++
  } else {
    findings.push({ check: 'Proposal failures', status: 'OK', detail: `${recentFails} failures in last hour` })
  }

  // Check 3: Pending proposals backlog
  const pendingCount = await prisma.autopilotProposal.count({ where: { status: 'PENDING_REVIEW' as any } })
  if (pendingCount > 20) {
    findings.push({ check: 'Pending backlog', status: 'WARNING', detail: `${pendingCount} proposals awaiting review` })
    warnings++
    issues++
  } else {
    findings.push({ check: 'Pending backlog', status: 'OK', detail: `${pendingCount} pending` })
  }

  // Check 4: Daily budget usage
  const todayBudgets = await prisma.dailyBudget.findMany({
    where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
  })
  const overBudget = todayBudgets.filter(b => b.used > b.limit * 0.9).length
  if (overBudget > 0) {
    findings.push({ check: 'Budget alerts', status: 'WARNING', detail: `${overBudget} users near/over daily budget` })
    warnings++
    issues++
  } else {
    findings.push({ check: 'Budget alerts', status: 'OK', detail: 'All users within budget' })
  }

  const score = Math.max(0, 100 - critical * 30 - warnings * 10)
  const durationMs = Date.now() - startTime

  return prisma.autopilotAudit.update({
    where: { id: audit.id },
    data: {
      status: 'COMPLETED' as any,
      findings: findings as any,
      score,
      summary: `Health audit: ${score}/100 — ${issues} issues (${critical} critical, ${warnings} warnings)`,
      checksRun: findings.length,
      issuesFound: issues,
      criticalCount: critical,
      warningCount: warnings,
      durationMs,
      completedAt: new Date(),
    },
  })
}

export async function runBusinessAudit() {
  const audit = await prisma.autopilotAudit.create({
    data: { auditorType: 'BUSINESS' as any, status: 'RUNNING' as any },
  })

  const startTime = Date.now()
  const findings: Array<{ check: string; status: string; detail: string }> = []
  let issues = 0

  // Check: Active users
  const activeUsers = await prisma.user.count({ where: { updatedAt: { gte: new Date(Date.now() - 7 * 86400000) } } })
  findings.push({ check: 'Active users (7d)', status: 'OK', detail: `${activeUsers} users active` })

  // Check: Credit accounts with balance
  const funded = await prisma.creditAccount.count({ where: { balance: { gt: 0 } } })
  findings.push({ check: 'Funded wallets', status: funded > 0 ? 'OK' : 'WARNING', detail: `${funded} wallets with balance` })
  if (funded === 0) issues++

  // Check: Recent AI usage
  const recentUsage = await prisma.aIUsageLog.count({
    where: { createdAt: { gte: new Date(Date.now() - 86400000) } },
  })
  findings.push({ check: 'AI usage (24h)', status: 'OK', detail: `${recentUsage} requests` })

  const score = Math.max(0, 100 - issues * 15)
  const durationMs = Date.now() - startTime

  return prisma.autopilotAudit.update({
    where: { id: audit.id },
    data: {
      status: 'COMPLETED' as any,
      findings: findings as any,
      score,
      summary: `Business audit: ${score}/100 — ${issues} issues found`,
      checksRun: findings.length,
      issuesFound: issues,
      durationMs,
      completedAt: new Date(),
    },
  })
}

export async function runSecurityAudit() {
  const audit = await prisma.autopilotAudit.create({
    data: { auditorType: 'SECURITY' as any, status: 'RUNNING' as any },
  })

  const startTime = Date.now()
  const findings: Array<{ check: string; status: string; detail: string }> = []
  let issues = 0
  let critical = 0

  // Check: Admin bypass active
  findings.push({ check: 'Auth bypass', status: 'CRITICAL', detail: 'admin@admin.com bypass is ACTIVE — disable before production' })
  critical++
  issues++

  // Check: Expired proposals still pending
  const expired = await prisma.autopilotProposal.count({
    where: { status: 'PENDING_REVIEW' as any, expiresAt: { lt: new Date() } },
  })
  if (expired > 0) {
    findings.push({ check: 'Expired proposals', status: 'WARNING', detail: `${expired} proposals past expiration date` })
    issues++
  } else {
    findings.push({ check: 'Expired proposals', status: 'OK', detail: 'No expired pending proposals' })
  }

  // Check: High-risk proposals approved without note
  const noNoteApprovals = await prisma.autopilotProposal.count({
    where: { status: 'COMPLETED' as any, riskScore: { gte: 60 }, reviewNote: null },
  })
  if (noNoteApprovals > 0) {
    findings.push({ check: 'Undocumented approvals', status: 'WARNING', detail: `${noNoteApprovals} high-risk approvals without review note` })
    issues++
  } else {
    findings.push({ check: 'Undocumented approvals', status: 'OK', detail: 'All high-risk approvals documented' })
  }

  const score = Math.max(0, 100 - critical * 30 - (issues - critical) * 10)
  const durationMs = Date.now() - startTime

  return prisma.autopilotAudit.update({
    where: { id: audit.id },
    data: {
      status: 'COMPLETED' as any,
      findings: findings as any,
      score,
      summary: `Security audit: ${score}/100 — ${issues} issues (${critical} critical)`,
      checksRun: findings.length,
      issuesFound: issues,
      criticalCount: critical,
      durationMs,
      completedAt: new Date(),
    },
  })
}

export async function getLatestAudits() {
  const [health, business, security] = await Promise.all([
    prisma.autopilotAudit.findFirst({ where: { auditorType: 'HEALTH' as any }, orderBy: { createdAt: 'desc' } }),
    prisma.autopilotAudit.findFirst({ where: { auditorType: 'BUSINESS' as any }, orderBy: { createdAt: 'desc' } }),
    prisma.autopilotAudit.findFirst({ where: { auditorType: 'SECURITY' as any }, orderBy: { createdAt: 'desc' } }),
  ])
  return { health, business, security }
}
