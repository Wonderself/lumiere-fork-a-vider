'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

const PAGE_SIZE = 20

async function getClientIP(): Promise<string> {
  const hdrs = await headers()
  return hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    hdrs.get('x-real-ip') ||
    'unknown'
}

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== 'ADMIN') return { error: 'Accès refusé' }
  return { session, error: null }
}

/**
 * Logs an admin/system action to the AuditLog table.
 * Not admin-only — intended to be called internally by other server actions.
 */
export async function logAuditEvent(
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) return

  const ip = await getClientIP()

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action,
      entity,
      entityId: entityId ?? null,
      details: details ? (details as Record<string, unknown> as never) : undefined,
      ip,
    },
  })
}

/**
 * Returns a paginated audit log. Admin-only.
 * Supports filtering by entity type and/or userId.
 */
export async function getAuditLogAction(
  page: number = 1,
  entity?: string,
  userId?: string
): Promise<
  | { error: string }
  | { logs: unknown[]; total: number; page: number; totalPages: number }
> {
  const check = await requireAdmin()
  if (check.error) return { error: check.error }

  const where: Record<string, unknown> = {}
  if (entity) where.entity = entity
  if (userId) where.userId = userId

  const [total, rawLogs] = await Promise.all([
    prisma.auditLog.count({ where: where as never }),
    prisma.auditLog.findMany({
      where: where as never,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        details: true,
        ip: true,
        createdAt: true,
        userId: true,
      },
    }),
  ])

  const userIds = [...new Set(rawLogs.map((l) => l.userId))]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, displayName: true },
  })
  const userMap = new Map(users.map((u) => [u.id, u.displayName]))

  const logs = rawLogs.map((log) => ({
    ...log,
    displayName: userMap.get(log.userId) ?? null,
  }))

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}

/**
 * Returns aggregate audit stats. Admin-only.
 * Includes totals for today/this week plus top actors and action types.
 */
export async function getAuditStatsAction(): Promise<
  | { error: string }
  | {
      totalToday: number
      totalThisWeek: number
      topActors: { userId: string; displayName: string | null; count: number }[]
      topActions: { action: string; count: number }[]
    }
> {
  const check = await requireAdmin()
  if (check.error) return { error: check.error }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [totalToday, totalThisWeek, actorGroups, actionGroups] = await Promise.all([
    prisma.auditLog.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.auditLog.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.auditLog.groupBy({
      by: ['userId'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 5,
    }),
    prisma.auditLog.groupBy({
      by: ['action'],
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 5,
    }),
  ])

  const actorUserIds = actorGroups.map((g) => g.userId)
  const actorUsers = await prisma.user.findMany({
    where: { id: { in: actorUserIds } },
    select: { id: true, displayName: true },
  })
  const actorUserMap = new Map(actorUsers.map((u) => [u.id, u.displayName]))

  const topActors = actorGroups.map((g) => ({
    userId: g.userId,
    displayName: actorUserMap.get(g.userId) ?? null,
    count: g._count.userId,
  }))

  const topActions = actionGroups.map((g) => ({
    action: g.action,
    count: g._count.action,
  }))

  return { totalToday, totalThisWeek, topActors, topActions }
}
