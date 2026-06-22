import { prisma } from '@/lib/prisma'
import { LEVEL_POINTS } from '@/lib/constants'
import { createNotification } from '@/lib/notifications'
import type { Level } from '@prisma/client'

const LEVEL_ORDER: Level[] = ['ROOKIE', 'PRO', 'EXPERT', 'VIP']

export async function checkAndUpgradeLevel(userId: string, currentPoints: number): Promise<Level | null> {
  let targetLevel: Level = 'ROOKIE'

  if (currentPoints >= LEVEL_POINTS.VIP) targetLevel = 'VIP'
  else if (currentPoints >= LEVEL_POINTS.EXPERT) targetLevel = 'EXPERT'
  else if (currentPoints >= LEVEL_POINTS.PRO) targetLevel = 'PRO'

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  })

  if (!user) return null

  const currentLevelIndex = LEVEL_ORDER.indexOf(user.level)
  const targetLevelIndex = LEVEL_ORDER.indexOf(targetLevel)

  if (targetLevelIndex > currentLevelIndex) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: targetLevel },
    })

    const levelLabels: Record<Level, string> = {
      ROOKIE: 'Rookie',
      PRO: 'Pro',
      EXPERT: 'Expert',
      VIP: 'VIP',
    }

    await createNotification(userId, 'LEVEL_UP', `Niveau ${levelLabels[targetLevel]} atteint !`, {
      body: `Félicitations ! Vous êtes maintenant niveau ${levelLabels[targetLevel]}. De nouvelles tâches sont disponibles.`,
      href: '/dashboard',
    })

    return targetLevel
  }

  return null
}
