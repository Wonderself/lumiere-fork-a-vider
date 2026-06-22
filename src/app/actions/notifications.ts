'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function markNotificationReadAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { read: true },
  })

  revalidatePath('/notifications')
}

export async function markAllNotificationsReadAction() {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  })

  revalidatePath('/notifications')
}

export async function getUnreadNotificationCount(): Promise<number> {
  const session = await auth()
  if (!session?.user?.id) return 0

  return prisma.notification.count({
    where: { userId: session.user.id, read: false },
  })
}
