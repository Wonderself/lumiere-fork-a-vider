'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'

// Lumen economy: 1 Lumen = 1 USD. On-ramp/off-ramp run through pluggable payment
// providers (Stripe fiat now; USDC/Bitcoin later). Until provider keys are set,
// deposits are credited in a clearly-labeled simulated mode.

export async function purchaseLumensAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const amountStr = formData.get('amount') as string
  const amount = parseInt(amountStr, 10)

  if (!amount || amount < 1) return { error: 'Invalid amount' }

  // Volume bonuses (more value when buying more)
  const bonusLumens = amount >= 100 ? 10 : amount >= 25 ? 2 : 0
  const totalLumens = amount + bonusLumens
  const totalPrice = amount // 1 Lumen = 1 USD

  // In production this creates a Stripe checkout session and credits on webhook.
  // For now, credit directly (simulated payment).
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { lumenBalance: { increment: totalLumens } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId: session.user.id,
        amount: totalLumens,
        type: 'PURCHASE',
        description: `Bought ${amount} Lumens${bonusLumens > 0 ? ` (+${bonusLumens} bonus)` : ''} — $${totalPrice.toFixed(2)}`,
      },
    }),
  ])

  await createNotification(session.user.id, 'SYSTEM', `${totalLumens} Lumens added`, {
    body: `Your purchase of ${amount} Lumens has been credited${bonusLumens > 0 ? ` with ${bonusLumens} bonus Lumens` : ''}.`,
    href: '/lumens',
  })

  revalidatePath('/lumens')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function withdrawLumensAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const amountStr = formData.get('amount') as string
  const amount = parseInt(amountStr, 10)

  if (!amount || amount < 10) return { error: 'Minimum 10 Lumens to withdraw' }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true, kycStatus: true },
  })

  if (!user) return { error: 'User not found' }

  // Identity verification is required once before any cash-out (anti-money-laundering).
  if (user.kycStatus !== 'VERIFIED') {
    return { error: 'NEEDS_KYC' }
  }

  if (user.lumenBalance < amount) {
    return { error: 'Insufficient balance' }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { lumenBalance: { decrement: amount } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId: session.user.id,
        amount: -amount,
        type: 'WITHDRAWAL',
        description: `Withdrew ${amount} Lumens → $${amount.toFixed(2)} (bank transfer within 14 days)`,
      },
    }),
  ])

  await createNotification(session.user.id, 'SYSTEM', 'Withdrawal requested', {
    body: `Your withdrawal of ${amount} Lumens ($${amount.toFixed(2)}) is being processed.`,
    href: '/lumens',
  })

  revalidatePath('/lumens')
  return { success: true }
}

// One-time identity verification before cash-out. In simulated mode this approves
// immediately; once a KYC provider (e.g. Stripe Identity) is wired, it submits for
// real verification and stays PENDING until approved.
export async function startKycAction(): Promise<{ error?: string; status?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const provider = process.env.KYC_PROVIDER // unset ⇒ simulated
  const newStatus = provider ? 'PENDING' : 'VERIFIED'

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      kycStatus: newStatus as never,
      kycVerifiedAt: newStatus === 'VERIFIED' ? new Date() : null,
    },
  })

  revalidatePath('/dashboard/kyc')
  revalidatePath('/lumens')
  return { status: newStatus }
}
