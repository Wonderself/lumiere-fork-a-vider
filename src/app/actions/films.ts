'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function voteFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const filmId = formData.get('filmId') as string
  const voteType = formData.get('voteType') as string // 'up' or 'down'

  if (!filmId || !voteType) return { error: 'Données manquantes' }
  if (!['up', 'down'].includes(voteType)) return { error: 'Type de vote invalide' }

  const film = await prisma.film.findUnique({ where: { id: filmId }, select: { slug: true } })
  if (!film) return { error: 'Film introuvable' }

  // Check if user already voted this type
  const existingVote = await prisma.filmVote.findUnique({
    where: {
      filmId_userId_voteType: { filmId, userId: session.user.id, voteType },
    },
  })

  if (existingVote) {
    // Remove vote (toggle)
    await prisma.filmVote.delete({ where: { id: existingVote.id } })
  } else {
    // Remove opposite vote if exists, then add new vote
    const oppositeType = voteType === 'up' ? 'down' : 'up'
    await prisma.filmVote.deleteMany({
      where: { filmId, userId: session.user.id, voteType: oppositeType },
    })
    await prisma.filmVote.create({
      data: { filmId, userId: session.user.id, voteType },
    })
  }

  revalidatePath(`/films/${film.slug}`)
  revalidatePath('/films')
  return { success: true }
}

export async function backFilmAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const filmId = formData.get('filmId') as string
  const amountStr = formData.get('amount') as string
  const amount = parseFloat(amountStr)

  if (!filmId) return { error: 'Film manquant' }
  if (!amount || amount < 50) return { error: 'Montant minimum : 50€' }

  const film = await prisma.film.findUnique({ where: { id: filmId }, select: { slug: true, estimatedBudget: true } })
  if (!film) return { error: 'Film introuvable' }

  // Calculate revenue share in basis points (100 bps = 1%)
  // Simple formula: 1% per 500€ invested, max 10%
  const revenueShareBps = Math.min(Math.floor((amount / 500) * 100), 1000)

  // Determine perks based on amount
  const perks: string[] = ['Accès avant-première']
  if (amount >= 100) perks.push('Nom au générique')
  if (amount >= 500) perks.push('Invitation événement', 'Revenue share', 'Making-of exclusif')

  // Check if already a backer
  const existing = await prisma.filmBacker.findUnique({
    where: { filmId_userId: { filmId, userId: session.user.id } },
  })

  if (existing) {
    // Increment investment
    await prisma.filmBacker.update({
      where: { id: existing.id },
      data: {
        amountInvested: { increment: amount },
        revenueShareBps: existing.revenueShareBps + revenueShareBps,
        perks,
      },
    })
  } else {
    await prisma.filmBacker.create({
      data: {
        filmId,
        userId: session.user.id,
        amountInvested: amount,
        revenueShareBps,
        perks,
      },
    })
  }

  revalidatePath(`/films/${film.slug}`)
  return { success: true }
}
