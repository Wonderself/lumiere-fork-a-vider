'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') {
    throw new Error('Accès refusé')
  }
  return session
}

/**
 * Calculate monthly payouts for all creators with films in the catalog
 * Ratio = (film monthly views / total platform monthly views) × pool
 */
export async function calculateMonthlyPayoutsAction(formData: FormData) {
  await requireAdmin()

  const month = formData.get('month') as string // "2026-02"
  const poolAmount = parseFloat(formData.get('poolAmount') as string || '0')

  if (!month || poolAmount <= 0) return

  // Get all LIVE films with their monthly views
  const films = await prisma.catalogFilm.findMany({
    where: { status: 'LIVE', monthlyViews: { gt: 0 } },
    include: { submittedBy: { select: { id: true } } },
  })

  const totalViews = films.reduce((sum, f) => sum + f.monthlyViews, 0)
  if (totalViews === 0) return

  // Create payout records
  for (const film of films) {
    const ratio = film.monthlyViews / totalViews
    const grossAmount = poolAmount * ratio
    const creatorShare = grossAmount * (film.revenueSharePct / 100)

    await prisma.creatorPayout.create({
      data: {
        userId: film.submittedById,
        filmId: film.id,
        month,
        totalViews: film.monthlyViews,
        platformViews: totalViews,
        ratio,
        amountEur: Math.round(creatorShare * 100) / 100,
        status: 'CALCULATED',
      },
    })
  }

  // Reset monthly views for next period
  await prisma.catalogFilm.updateMany({
    where: { status: 'LIVE' },
    data: { monthlyViews: 0 },
  })

  revalidatePath('/admin/payouts')
}

export async function markPayoutPaidAction(formData: FormData) {
  await requireAdmin()

  const payoutId = formData.get('payoutId') as string
  if (!payoutId) return

  await prisma.creatorPayout.update({
    where: { id: payoutId },
    data: { status: 'PAID', paidAt: new Date() },
  })

  revalidatePath('/admin/payouts')
}
