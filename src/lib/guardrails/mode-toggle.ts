/**
 * Mode Toggle
 * Switch between production and maintenance mode.
 */

import { prisma } from '@/lib/prisma'

export type PlatformMode = 'production' | 'maintenance'

// In-memory cache with DB persistence
let currentMode: PlatformMode = 'production'
let lastCheck = 0
const CHECK_INTERVAL = 30_000 // 30s

/** Get current platform mode */
export async function getMode(): Promise<PlatformMode> {
  const now = Date.now()
  if (now - lastCheck < CHECK_INTERVAL) return currentMode

  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: 'maintenance_mode' },
    })
    currentMode = flag?.value ? 'maintenance' : 'production'
    lastCheck = now
  } catch {
    // DB unavailable — stay in current mode
  }

  return currentMode
}

/** Set platform mode */
export async function setMode(mode: PlatformMode, changedBy?: string): Promise<void> {
  const value = mode === 'maintenance'

  await prisma.featureFlag.upsert({
    where: { key: 'maintenance_mode' },
    create: {
      key: 'maintenance_mode',
      value,
      description: `Platform is in ${mode} mode`,
      changedBy,
      changedAt: new Date(),
    },
    update: {
      value,
      description: `Platform is in ${mode} mode`,
      changedBy,
      changedAt: new Date(),
    },
  })

  currentMode = mode
  lastCheck = Date.now()
}

/** Check if a request should be blocked in maintenance mode */
export async function shouldBlock(path: string): Promise<{ blocked: boolean; reason?: string }> {
  const mode = await getMode()

  if (mode === 'production') return { blocked: false }

  // Allow admin and health check routes in maintenance
  const allowedPaths = [
    '/api/health',
    '/api/auth',
    '/login',
    '/admin',
    '/api/autopilot',
    '/api/cron',
    '/maintenance',
  ]

  const isAllowed = allowedPaths.some(p => path.startsWith(p))
  if (isAllowed) return { blocked: false }

  return { blocked: true, reason: 'Platform is in maintenance mode' }
}

/** Get mode info */
export async function getModeInfo(): Promise<{
  mode: PlatformMode
  since?: Date
  changedBy?: string
}> {
  const flag = await prisma.featureFlag.findUnique({
    where: { key: 'maintenance_mode' },
  })

  return {
    mode: flag?.value ? 'maintenance' : 'production',
    since: flag?.changedAt ?? undefined,
    changedBy: flag?.changedBy ?? undefined,
  }
}
