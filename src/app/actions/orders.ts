'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'

// ============================================
// CREATE VIDEO ORDER
// ============================================

export async function createOrderAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const style = formData.get('style') as string
  const durationStr = formData.get('duration') as string
  const priceTokensStr = formData.get('priceTokens') as string
  const deadlineStr = formData.get('deadline') as string
  const maxRevisionsStr = formData.get('maxRevisions') as string

  if (!title) return { error: 'Titre requis' }
  if (!description) return { error: 'Description requise' }

  const priceTokens = parseInt(priceTokensStr || '0', 10)
  const duration = durationStr ? parseInt(durationStr, 10) : null
  const maxRevisions = parseInt(maxRevisionsStr || '2', 10)
  const deadline = deadlineStr ? new Date(deadlineStr) : null

  if (priceTokens < 1) return { error: 'Le prix doit etre d\'au moins 1 token' }

  // Check client balance
  const client = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if (!client || client.lumenBalance < priceTokens) {
    return { error: `Solde insuffisant. Vous avez ${client?.lumenBalance || 0} tokens, il en faut ${priceTokens}.` }
  }

  // Create order and deduct tokens (escrow)
  await prisma.$transaction([
    prisma.videoOrder.create({
      data: {
        clientUserId: session.user.id,
        title,
        description,
        style: style || null,
        duration,
        deadline,
        priceTokens,
        maxRevisions,
        status: 'OPEN',
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { lumenBalance: { decrement: priceTokens } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId: session.user.id,
        amount: -priceTokens,
        type: 'SPENT',
        description: `Escrow commande video : ${title}`,
      },
    }),
  ])

  revalidatePath('/collabs/orders')
  return { success: true }
}

// ============================================
// CLAIM ORDER (CREATOR)
// ============================================

export async function claimOrderAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const orderId = formData.get('orderId') as string
  if (!orderId) return

  // Verify creator has a profile
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return

  const order = await prisma.videoOrder.findUnique({
    where: { id: orderId },
  })

  if (!order) return
  if (order.status !== 'OPEN') return
  if (order.clientUserId === session.user.id) return // Can't claim own order

  await prisma.videoOrder.update({
    where: { id: orderId },
    data: {
      creatorUserId: session.user.id,
      status: 'CLAIMED',
    },
  })

  // Notify client
  await createNotification(order.clientUserId, 'SYSTEM', 'Commande acceptee', {
    body: `Un createur a accepte votre commande "${order.title}".`,
    href: `/collabs/orders/${orderId}`,
  })

  revalidatePath('/collabs/orders')
  revalidatePath(`/collabs/orders/${orderId}`)
}

// ============================================
// DELIVER ORDER
// ============================================

export async function deliverOrderAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const orderId = formData.get('orderId') as string
  const deliveryUrl = formData.get('deliveryUrl') as string

  if (!orderId) return

  const order = await prisma.videoOrder.findUnique({
    where: { id: orderId },
  })

  if (!order) return
  if (order.creatorUserId !== session.user.id) return
  if (!['CLAIMED', 'IN_PROGRESS', 'REVISION'].includes(order.status)) return

  await prisma.videoOrder.update({
    where: { id: orderId },
    data: {
      status: 'DELIVERED',
      deliveryUrl: deliveryUrl || order.deliveryUrl,
    },
  })

  // Notify client
  await createNotification(order.clientUserId, 'SYSTEM', 'Livraison recue', {
    body: `Le createur a livre votre commande "${order.title}". Verifiez et validez !`,
    href: `/collabs/orders/${orderId}`,
  })

  revalidatePath('/collabs/orders')
  revalidatePath(`/collabs/orders/${orderId}`)
}

// ============================================
// REQUEST REVISION
// ============================================

export async function requestRevisionAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const orderId = formData.get('orderId') as string
  const reason = formData.get('reason') as string

  if (!orderId) return

  const order = await prisma.videoOrder.findUnique({
    where: { id: orderId },
  })

  if (!order) return
  if (order.clientUserId !== session.user.id) return
  if (order.status !== 'DELIVERED') return
  if (order.revisionCount >= order.maxRevisions) return

  await prisma.videoOrder.update({
    where: { id: orderId },
    data: {
      status: 'REVISION',
      revisionCount: { increment: 1 },
    },
  })

  // Notify creator
  if (order.creatorUserId) {
    await createNotification(order.creatorUserId, 'SYSTEM', 'Revision demandee', {
      body: `Le client demande une revision pour "${order.title}".${reason ? ` Raison : ${reason}` : ''}`,
      href: `/collabs/orders/${orderId}`,
    })
  }

  revalidatePath('/collabs/orders')
  revalidatePath(`/collabs/orders/${orderId}`)
}

// ============================================
// COMPLETE ORDER (RELEASE ESCROW)
// ============================================

export async function completeOrderAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const orderId = formData.get('orderId') as string
  const clientRatingStr = formData.get('clientRating') as string

  if (!orderId) return

  const order = await prisma.videoOrder.findUnique({
    where: { id: orderId },
  })

  if (!order) return
  if (order.clientUserId !== session.user.id) return
  if (order.status !== 'DELIVERED') return
  if (!order.creatorUserId) return

  const clientRating = clientRatingStr ? parseFloat(clientRatingStr) : null

  // Complete order and release escrow to creator
  await prisma.$transaction([
    prisma.videoOrder.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        clientRating,
      },
    }),
    // Release escrow tokens to creator
    prisma.user.update({
      where: { id: order.creatorUserId },
      data: { lumenBalance: { increment: order.priceTokens } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId: order.creatorUserId,
        amount: order.priceTokens,
        type: 'BONUS',
        description: `Paiement commande completee : ${order.title}`,
      },
    }),
  ])

  // Create reputation event for creator
  if (clientRating) {
    const reputationDelta = (clientRating - 3) * 2
    await prisma.reputationEvent.create({
      data: {
        userId: order.creatorUserId,
        type: 'order_completed',
        score: reputationDelta,
        weight: 1.0,
        source: 'COLLABS',
        metadata: { orderId, clientRating },
      },
    })
  }

  // Notify creator
  await createNotification(order.creatorUserId, 'SYSTEM', 'Commande completee !', {
    body: `La commande "${order.title}" est terminee. ${order.priceTokens} tokens ont ete credites.${clientRating ? ` Note: ${clientRating}/5` : ''}`,
    href: `/collabs/orders/${orderId}`,
  })

  revalidatePath('/collabs/orders')
  revalidatePath(`/collabs/orders/${orderId}`)
}
