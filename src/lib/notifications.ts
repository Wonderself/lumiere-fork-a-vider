import { prisma } from '@/lib/prisma'
import type { NotifType } from '@prisma/client'

export async function createNotification(
  userId: string,
  type: NotifType,
  title: string,
  options?: { body?: string; href?: string }
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body: options?.body,
        href: options?.href,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function createBulkNotifications(
  userIds: string[],
  type: NotifType,
  title: string,
  options?: { body?: string; href?: string }
) {
  try {
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type,
        title,
        body: options?.body,
        href: options?.href,
      })),
    })
  } catch (error) {
    console.error('Failed to create bulk notifications:', error)
  }
}
