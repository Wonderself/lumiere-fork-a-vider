'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

// ─── Create Bonus Content ──────────────────────────────────────

export async function createBonusContentAction(formData: FormData) {
  await requireAdmin()

  const filmId = formData.get('filmId') as string
  const catalogFilmId = formData.get('catalogFilmId') as string
  const actorId = formData.get('actorId') as string
  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const contentUrl = formData.get('contentUrl') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  const durationRaw = formData.get('duration') as string
  const isPremium = formData.get('isPremium') === 'on'
  const sortOrderRaw = formData.get('sortOrder') as string

  if (!title || !type) return

  const duration = durationRaw ? parseInt(durationRaw, 10) : null
  const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0

  await prisma.bonusContent.create({
    data: {
      filmId: filmId || null,
      catalogFilmId: catalogFilmId || null,
      actorId: actorId || null,
      type: type as never,
      title,
      description: description || null,
      contentUrl: contentUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      duration,
      isPremium,
      sortOrder,
    },
  })

  revalidatePath('/admin/bonus-content')
  revalidatePath('/streaming')
  revalidatePath('/actors')
}

// ─── Delete Bonus Content ──────────────────────────────────────

export async function deleteBonusContentAction(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  if (!id) return

  await prisma.bonusContent.delete({ where: { id } })

  revalidatePath('/admin/bonus-content')
  revalidatePath('/streaming')
  revalidatePath('/actors')
}

// ─── Increment Bonus View Count ────────────────────────────────

export async function incrementBonusViewAction(bonusId: string) {
  if (!bonusId) return

  await prisma.bonusContent.update({
    where: { id: bonusId },
    data: { viewCount: { increment: 1 } },
  })
}
