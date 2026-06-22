'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  let device = 'Desktop'
  let browser = 'Unknown'
  let os = 'Unknown'

  if (/tablet|ipad/i.test(ua)) {
    device = 'Tablet'
  } else if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    device = 'Mobile'
  }

  if (/edg\//i.test(ua)) {
    browser = 'Edge'
  } else if (/opr\//i.test(ua) || /opera/i.test(ua)) {
    browser = 'Opera'
  } else if (/firefox\//i.test(ua)) {
    browser = 'Firefox'
  } else if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) {
    browser = 'Chrome'
  } else if (/safari\//i.test(ua) && !/chrome/i.test(ua)) {
    browser = 'Safari'
  } else if (/msie|trident/i.test(ua)) {
    browser = 'Internet Explorer'
  }

  if (/windows nt/i.test(ua)) {
    os = 'Windows'
  } else if (/mac os x/i.test(ua) && !/iphone|ipad/i.test(ua)) {
    os = 'macOS'
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = 'iOS'
  } else if (/android/i.test(ua)) {
    os = 'Android'
  } else if (/linux/i.test(ua)) {
    os = 'Linux'
  } else if (/cros/i.test(ua)) {
    os = 'ChromeOS'
  }

  return { device, browser, os }
}

/**
 * Creates a UserSession record for the authenticated user.
 * Parses userAgent to extract device, browser and OS.
 */
export async function recordSessionAction(ip?: string, userAgent?: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non authentifié' }

  const parsed = userAgent ? parseUserAgent(userAgent) : { device: 'Unknown', browser: 'Unknown', os: 'Unknown' }

  await prisma.userSession.create({
    data: {
      userId: session.user.id,
      ip: ip || null,
      userAgent: userAgent || null,
      device: parsed.device,
      browser: parsed.browser,
      os: parsed.os,
      lastActive: new Date(),
    },
  })

  return { success: true }
}

/**
 * Returns all non-revoked sessions for the authenticated user, ordered by lastActive descending.
 */
export async function getActiveSessionsAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié', sessions: null }

  const sessions = await prisma.userSession.findMany({
    where: {
      userId: session.user.id,
      revokedAt: null,
    },
    orderBy: { lastActive: 'desc' },
    select: {
      id: true,
      ip: true,
      userAgent: true,
      device: true,
      browser: true,
      os: true,
      country: true,
      lastActive: true,
      createdAt: true,
    },
  })

  return { sessions }
}

/**
 * Revokes a specific session by setting revokedAt to now.
 * Only the session owner can revoke their own sessions.
 */
export async function revokeSessionAction(sessionId: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non authentifié' }

  const userSession = await prisma.userSession.findUnique({
    where: { id: sessionId },
    select: { userId: true, revokedAt: true },
  })

  if (!userSession) return { success: false, error: 'Session introuvable' }
  if (userSession.userId !== session.user.id) return { success: false, error: 'Accès refusé' }
  if (userSession.revokedAt) return { success: false, error: 'Session déjà révoquée' }

  await prisma.userSession.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  })

  return { success: true }
}

/**
 * Revokes all active sessions for the authenticated user.
 */
export async function revokeAllSessionsAction() {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non authentifié', count: 0 }

  const result = await prisma.userSession.updateMany({
    where: {
      userId: session.user.id,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  })

  return { success: true, count: result.count }
}
