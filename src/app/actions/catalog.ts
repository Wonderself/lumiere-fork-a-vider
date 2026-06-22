'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateFilmContract } from '@/lib/contracts'

export async function submitFilmAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const title = formData.get('title') as string
  const synopsis = formData.get('synopsis') as string
  const genre = formData.get('genre') as string
  const videoUrl = formData.get('videoUrl') as string
  const trailerUrl = formData.get('trailerUrl') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  const duration = parseInt(formData.get('duration') as string || '0', 10)
  const language = formData.get('language') as string || 'fr'
  const year = parseInt(formData.get('year') as string || '0', 10)
  const isContest = formData.get('isContest') === 'true'
  const exclusivity = formData.get('exclusivity') === 'true'
  const acceptTerms = formData.get('acceptTerms') === 'true'

  if (!title || !synopsis || !videoUrl) {
    return { error: 'Titre, synopsis et URL de la vidéo sont requis' }
  }
  if (!acceptTerms) {
    return { error: 'Vous devez accepter les conditions du contrat' }
  }

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true, email: true },
  })

  const revenueSharePct = 50
  const exclusivityBonus = exclusivity ? 10 : 0

  const film = await prisma.catalogFilm.create({
    data: {
      title,
      slug,
      synopsis,
      genre,
      videoUrl,
      trailerUrl: trailerUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      duration: duration || null,
      language,
      year: year || null,
      isContest,
      revenueSharePct: revenueSharePct + exclusivityBonus,
      submittedById: session.user.id,
    },
  })

  // Auto-generate contract
  const contractTerms = generateFilmContract({
    creatorName: user?.displayName || user?.email || 'Créateur',
    filmTitle: title,
    revenueSharePct,
    exclusivity,
    exclusivityBonus,
    signDate: new Date().toLocaleDateString('fr-FR'),
  })

  await prisma.catalogContract.create({
    data: {
      filmId: film.id,
      userId: session.user.id,
      terms: contractTerms,
      revenueSharePct: revenueSharePct + exclusivityBonus,
      promotionClause: true,
      exclusivity,
      exclusivityBonus,
      status: 'SIGNED',
      signedAt: new Date(),
    },
  })

  revalidatePath('/streaming')
  return { success: true }
}

export async function approveFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { status: 'LIVE' },
  })

  revalidatePath('/admin/catalog')
  revalidatePath('/streaming')
}

export async function rejectFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { status: 'REJECTED' },
  })

  revalidatePath('/admin/catalog')
}

export async function recordFilmViewAction(filmId: string) {
  const session = await auth()

  await prisma.filmView.create({
    data: {
      filmId,
      userId: session?.user?.id || null,
      watchDuration: 0,
      completionPct: 0,
    },
  })

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { viewCount: { increment: 1 }, monthlyViews: { increment: 1 } },
  })
}
