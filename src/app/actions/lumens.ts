'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'

export async function purchaseLumensAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const amountStr = formData.get('amount') as string
  const amount = parseInt(amountStr, 10)

  if (!amount || amount < 1) return { error: 'Montant invalide' }

  // Calculate price with volume discounts
  let pricePerLumen = 1.0
  if (amount >= 100) pricePerLumen = 0.8
  else if (amount >= 25) pricePerLumen = 0.9

  const bonusLumens = amount >= 100 ? 10 : amount >= 25 ? 2 : 0
  const totalLumens = amount + bonusLumens
  const totalPrice = amount * pricePerLumen

  // In production, this would create a Stripe checkout session
  // For now, directly credit the lumens (mock payment)
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
        description: `Achat de ${amount} Lumens${bonusLumens > 0 ? ` (+${bonusLumens} bonus)` : ''} — ${totalPrice.toFixed(2)}€`,
      },
    }),
  ])

  await createNotification(session.user.id, 'SYSTEM', `${totalLumens} Lumens ajoutés`, {
    body: `Votre achat de ${amount} Lumens a été crédité${bonusLumens > 0 ? ` avec ${bonusLumens} Lumens bonus` : ''}.`,
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
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const amountStr = formData.get('amount') as string
  const amount = parseInt(amountStr, 10)

  if (!amount || amount < 10) return { error: 'Minimum 10 Lumens pour un retrait' }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if (!user || user.lumenBalance < amount) {
    return { error: 'Solde insuffisant' }
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
        description: `Retrait de ${amount} Lumens → ${amount.toFixed(2)}€ (virement sous 14 jours)`,
      },
    }),
  ])

  revalidatePath('/lumens')
  return { success: true }
}
