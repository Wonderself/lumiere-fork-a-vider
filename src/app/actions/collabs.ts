'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'

// ============================================
// SEND COLLAB REQUEST
// ============================================

export async function sendCollabRequestAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  const toUserId = formData.get('toUserId') as string
  const type = formData.get('type') as string
  const message = formData.get('message') as string
  const escrowTokens = parseInt(formData.get('escrowTokens') as string || '0', 10)

  if (!toUserId) return { error: 'Destinataire requis' }
  if (!type) return { error: 'Type de collaboration requis' }
  if (toUserId === session.user.id) return { error: 'Vous ne pouvez pas vous envoyer une demande' }

  // Validate type
  const validTypes = ['SHOUTOUT', 'CO_CREATE', 'GUEST', 'AD_EXCHANGE']
  if (!validTypes.includes(type)) return { error: 'Type de collaboration invalide' }

  // Check target user exists and has a creator profile
  const targetUser = await prisma.user.findUnique({
    where: { id: toUserId },
    include: { creatorProfile: true },
  })
  if (!targetUser) return { error: 'Utilisateur introuvable' }
  if (!targetUser.creatorProfile) return { error: 'Cet utilisateur n\'a pas de profil createur' }

  // Check sender balance for escrow
  if (escrowTokens > 0) {
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lumenBalance: true },
    })
    if (!sender || sender.lumenBalance < escrowTokens) {
      return { error: `Solde insuffisant. Vous avez ${sender?.lumenBalance || 0} tokens, il en faut ${escrowTokens}.` }
    }
  }

  // Check for existing pending request
  const existing = await prisma.collabRequest.findFirst({
    where: {
      fromUserId: session.user.id,
      toUserId,
      status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
    },
  })
  if (existing) return { error: 'Vous avez deja une demande en cours avec ce createur' }

  // Create collab request and deduct escrow in a transaction
  await prisma.$transaction([
    prisma.collabRequest.create({
      data: {
        fromUserId: session.user.id,
        toUserId,
        type: type as 'SHOUTOUT' | 'CO_CREATE' | 'GUEST' | 'AD_EXCHANGE',
        escrowTokens,
        message: message || null,
        status: 'PENDING',
      },
    }),
    // Deduct escrow tokens from sender
    ...(escrowTokens > 0
      ? [
          prisma.user.update({
            where: { id: session.user.id },
            data: { lumenBalance: { decrement: escrowTokens } },
          }),
          prisma.lumenTransaction.create({
            data: {
              userId: session.user.id,
              amount: -escrowTokens,
              type: 'SPENT',
              description: `Escrow collab avec ${targetUser.displayName || targetUser.email}`,
            },
          }),
        ]
      : []),
  ])

  // Notify target user
  await createNotification(toUserId, 'SYSTEM', 'Nouvelle demande de collab', {
    body: `Vous avez recu une demande de collaboration de type ${type.toLowerCase().replace('_', ' ')}.`,
    href: '/collabs',
  })

  revalidatePath('/collabs')
  return { success: true }
}

// ============================================
// RESPOND TO COLLAB
// ============================================

export async function respondToCollabAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const collabId = formData.get('collabId') as string
  const action = formData.get('action') as string // 'accept' | 'reject'
  const response = formData.get('response') as string

  if (!collabId || !action) return

  const collab = await prisma.collabRequest.findUnique({
    where: { id: collabId },
    include: {
      fromUser: { select: { displayName: true, email: true } },
    },
  })

  if (!collab) return
  if (collab.toUserId !== session.user.id) return
  if (collab.status !== 'PENDING') return

  if (action === 'accept') {
    await prisma.collabRequest.update({
      where: { id: collabId },
      data: {
        status: 'ACCEPTED',
        response: response || null,
      },
    })

    // Notify requester
    await createNotification(collab.fromUserId, 'SYSTEM', 'Collab acceptee !', {
      body: `Votre demande de collaboration a ete acceptee.`,
      href: '/collabs',
    })
  } else if (action === 'reject') {
    // Refund escrow tokens to sender
    if (collab.escrowTokens > 0) {
      await prisma.$transaction([
        prisma.collabRequest.update({
          where: { id: collabId },
          data: {
            status: 'REJECTED',
            response: response || null,
          },
        }),
        prisma.user.update({
          where: { id: collab.fromUserId },
          data: { lumenBalance: { increment: collab.escrowTokens } },
        }),
        prisma.lumenTransaction.create({
          data: {
            userId: collab.fromUserId,
            amount: collab.escrowTokens,
            type: 'BONUS',
            description: 'Remboursement escrow — collab refusee',
          },
        }),
      ])
    } else {
      await prisma.collabRequest.update({
        where: { id: collabId },
        data: {
          status: 'REJECTED',
          response: response || null,
        },
      })
    }

    await createNotification(collab.fromUserId, 'SYSTEM', 'Collab refusee', {
      body: `Votre demande de collaboration a ete refusee.${collab.escrowTokens > 0 ? ` ${collab.escrowTokens} tokens ont ete rembourses.` : ''}`,
      href: '/collabs',
    })
  }

  revalidatePath('/collabs')
}

// ============================================
// RATE A COMPLETED COLLAB
// ============================================

export async function rateCollabAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const collabId = formData.get('collabId') as string
  const ratingStr = formData.get('rating') as string
  const rating = parseFloat(ratingStr)

  if (!collabId || isNaN(rating) || rating < 1 || rating > 5) return

  const collab = await prisma.collabRequest.findUnique({
    where: { id: collabId },
  })

  if (!collab) return
  // Only participants can rate
  if (collab.fromUserId !== session.user.id && collab.toUserId !== session.user.id) return
  // Only completed or accepted collabs can be rated
  if (!['COMPLETED', 'ACCEPTED', 'IN_PROGRESS'].includes(collab.status)) return
  // Don't allow re-rating
  if (collab.rating !== null) return

  // Update collab with rating and mark as completed
  await prisma.collabRequest.update({
    where: { id: collabId },
    data: {
      rating,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  })

  // Create a reputation event for the rated user
  const ratedUserId = collab.fromUserId === session.user.id ? collab.toUserId : collab.fromUserId
  const reputationDelta = (rating - 3) * 2 // -4 to +4 based on 1-5 rating

  await prisma.reputationEvent.create({
    data: {
      userId: ratedUserId,
      type: 'collab_completed',
      score: reputationDelta,
      weight: 1.0,
      source: 'COLLABS',
      metadata: { collabId, rating },
    },
  })

  // Release escrow tokens to the recipient
  if (collab.escrowTokens > 0) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: collab.toUserId },
        data: { lumenBalance: { increment: collab.escrowTokens } },
      }),
      prisma.lumenTransaction.create({
        data: {
          userId: collab.toUserId,
          amount: collab.escrowTokens,
          type: 'BONUS',
          description: `Paiement collab completee (note: ${rating}/5)`,
        },
      }),
    ])
  }

  // Notify the rated user
  await createNotification(ratedUserId, 'SYSTEM', 'Collab notee', {
    body: `Votre collaboration a ete notee ${rating}/5.`,
    href: '/collabs',
  })

  revalidatePath('/collabs')
}

// ============================================
// OUTREACH CONTACT (AUTOMATED)
// ============================================

export async function outreachContactAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  const suggestionName = formData.get('suggestionName') as string
  const costStr = formData.get('cost') as string
  const cost = parseInt(costStr || '3', 10)

  if (!suggestionName) return { error: 'Contact invalide' }
  if (cost < 1) return { error: 'Cout invalide' }

  // Check balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if (!user || user.lumenBalance < cost) {
    return { error: `Solde insuffisant. Vous avez ${user?.lumenBalance || 0} tokens, il en faut ${cost}.` }
  }

  // Deduct tokens and log outreach
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { lumenBalance: { decrement: cost } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId: session.user.id,
        amount: -cost,
        type: 'OUTREACH',
        description: `Contact outreach : ${suggestionName}`,
      },
    }),
  ])

  revalidatePath('/collabs/outreach')
  return { success: true }
}
