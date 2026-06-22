'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import { checkCommunityBadges } from '@/lib/achievements'

const REFERRAL_BONUS_LUMENS = 30 // Bonus for referrer when referral completes
const REFERRAL_WELCOME_LUMENS = 10 // Bonus for new user

/**
 * Generate or get the user's referral code.
 */
export async function getReferralCode() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true },
  })

  if (user?.referralCode) return { code: user.referralCode }

  // Generate unique code
  const code = `LUM-${session.user.id.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

  await prisma.user.update({
    where: { id: session.user.id },
    data: { referralCode: code },
  })

  return { code }
}

/**
 * Apply a referral code during registration.
 * Called after user creation with the referralCode from the registration form.
 */
export async function applyReferralCode(newUserId: string, referralCode: string) {
  if (!referralCode) return

  const referrer = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true, displayName: true },
  })

  if (!referrer || referrer.id === newUserId) return

  // Check if referral already exists
  const existing = await prisma.referral.findUnique({
    where: { referredId: newUserId },
  })
  if (existing) return

  // Create referral record
  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredId: newUserId,
      status: 'PENDING',
      tokensEarned: 0,
    },
  })
}

/**
 * Complete a referral when the new user completes their first task.
 * Called from task approval flow.
 */
export async function completeReferral(userId: string) {
  const referral = await prisma.referral.findUnique({
    where: { referredId: userId },
  })

  if (!referral || referral.status !== 'PENDING') return

  // Complete the referral
  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      tokensEarned: REFERRAL_BONUS_LUMENS,
    },
  })

  // Award lumens to referrer
  await prisma.user.update({
    where: { id: referral.referrerId },
    data: { lumenBalance: { increment: REFERRAL_BONUS_LUMENS } },
  })

  // Award welcome lumens to new user
  await prisma.user.update({
    where: { id: userId },
    data: { lumenBalance: { increment: REFERRAL_WELCOME_LUMENS } },
  })

  // Create lumen transactions
  await prisma.lumenTransaction.createMany({
    data: [
      {
        userId: referral.referrerId,
        amount: REFERRAL_BONUS_LUMENS,
        type: 'TASK_REWARD' as never,
        description: 'Bonus parrainage — filleul a complete sa premiere tache',
      },
      {
        userId,
        amount: REFERRAL_WELCOME_LUMENS,
        type: 'TASK_REWARD' as never,
        description: 'Bonus bienvenue — parraine par un membre',
      },
    ],
  })

  // Notify both
  await createNotification(referral.referrerId, 'SYSTEM', `🤝 +${REFERRAL_BONUS_LUMENS} Lumens — Votre filleul a complete sa premiere tache !`, {
    href: '/lumens',
  })
  await createNotification(userId, 'SYSTEM', `🎁 +${REFERRAL_WELCOME_LUMENS} Lumens — Bonus de bienvenue parrainage !`, {
    href: '/lumens',
  })

  // Check referral badge
  await checkCommunityBadges(referral.referrerId, 'referral').catch((err) => console.error("[Badges] Failed to check referral badges:", err))
}

/**
 * Get referral stats for the current user.
 */
export async function getReferralStats() {
  const session = await auth()
  if (!session?.user) return null

  const [referrals, user] = await Promise.all([
    prisma.referral.findMany({
      where: { referrerId: session.user.id },
      include: {
        referred: { select: { displayName: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true },
    }),
  ])

  const completed = referrals.filter(r => r.status === 'COMPLETED')
  const totalEarned = completed.reduce((sum, r) => sum + r.tokensEarned, 0)

  return {
    code: user?.referralCode || null,
    referrals,
    total: referrals.length,
    completed: completed.length,
    totalEarned,
  }
}
