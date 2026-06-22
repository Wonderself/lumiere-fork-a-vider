'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

// ─── Create AI Actor ──────────────────────────────────────────

export async function createActorAction(formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const nationality = formData.get('nationality') as string
  const birthYear = formData.get('birthYear') as string
  const debutYear = formData.get('debutYear') as string
  const style = (formData.get('style') as string) || 'VERSATILE'
  const personalityTraitsRaw = formData.get('personalityTraits') as string
  const funFactsRaw = formData.get('funFacts') as string
  const quote = formData.get('quote') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const coverUrl = formData.get('coverUrl') as string
  const socialFollowers = formData.get('socialFollowers') as string

  if (!name) return

  const baseSlug = slugify(name)
  const existing = await prisma.aIActor.findUnique({ where: { slug: baseSlug } })
  const finalSlug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

  const personalityTraits = personalityTraitsRaw
    ? personalityTraitsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const funFacts = funFactsRaw
    ? funFactsRaw.split('\n').map((f) => f.trim()).filter(Boolean)
    : []

  await prisma.aIActor.create({
    data: {
      name,
      slug: finalSlug,
      bio: bio || null,
      nationality: nationality || null,
      birthYear: birthYear ? parseInt(birthYear, 10) : null,
      debutYear: debutYear ? parseInt(debutYear, 10) : null,
      style: style as never,
      personalityTraits,
      funFacts,
      quote: quote || null,
      avatarUrl: avatarUrl || null,
      coverUrl: coverUrl || null,
      socialFollowers: socialFollowers ? parseInt(socialFollowers, 10) : 0,
    },
  })

  revalidatePath('/admin/actors')
  revalidatePath('/actors')
  redirect('/admin/actors')
}

// ─── Update AI Actor ──────────────────────────────────────────

export async function updateActorAction(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const nationality = formData.get('nationality') as string
  const birthYear = formData.get('birthYear') as string
  const debutYear = formData.get('debutYear') as string
  const style = (formData.get('style') as string) || 'VERSATILE'
  const personalityTraitsRaw = formData.get('personalityTraits') as string
  const funFactsRaw = formData.get('funFacts') as string
  const quote = formData.get('quote') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const coverUrl = formData.get('coverUrl') as string
  const socialFollowers = formData.get('socialFollowers') as string
  const isActive = formData.get('isActive') === 'true'

  if (!id) return

  const personalityTraits = personalityTraitsRaw
    ? personalityTraitsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const funFacts = funFactsRaw
    ? funFactsRaw.split('\n').map((f) => f.trim()).filter(Boolean)
    : []

  await prisma.aIActor.update({
    where: { id },
    data: {
      name: name || undefined,
      bio: bio || null,
      nationality: nationality || null,
      birthYear: birthYear ? parseInt(birthYear, 10) : null,
      debutYear: debutYear ? parseInt(debutYear, 10) : null,
      style: style as never,
      personalityTraits,
      funFacts,
      quote: quote || null,
      avatarUrl: avatarUrl || null,
      coverUrl: coverUrl || null,
      socialFollowers: socialFollowers ? parseInt(socialFollowers, 10) : 0,
      isActive,
    },
  })

  revalidatePath('/admin/actors')
  revalidatePath('/actors')
  redirect('/admin/actors')
}

// ─── Delete AI Actor ──────────────────────────────────────────

export async function deleteActorAction(formData: FormData) {
  await requireAdmin()

  const actorId = formData.get('actorId') as string
  if (!actorId) return

  await prisma.aIActor.delete({ where: { id: actorId } })

  revalidatePath('/admin/actors')
  revalidatePath('/actors')
}

// ─── Assign Cast Role ─────────────────────────────────────────

export async function assignCastRoleAction(formData: FormData) {
  await requireAdmin()

  const actorId = formData.get('actorId') as string
  const filmId = formData.get('filmId') as string
  const catalogFilmId = formData.get('catalogFilmId') as string
  const characterName = formData.get('characterName') as string
  const role = (formData.get('role') as string) || 'SUPPORTING'
  const description = formData.get('description') as string

  if (!actorId || !characterName) return
  if (!filmId && !catalogFilmId) return

  await prisma.filmCastRole.create({
    data: {
      actorId,
      filmId: filmId || null,
      catalogFilmId: catalogFilmId || null,
      characterName,
      role: role as never,
      description: description || null,
    },
  })

  // Increment filmCount on the actor
  await prisma.aIActor.update({
    where: { id: actorId },
    data: { filmCount: { increment: 1 } },
  })

  revalidatePath(`/admin/actors/${actorId}/edit`)
  revalidatePath('/actors')
}

// ─── Remove Cast Role ─────────────────────────────────────────

export async function removeCastRoleAction(formData: FormData) {
  await requireAdmin()

  const castRoleId = formData.get('castRoleId') as string
  const actorId = formData.get('actorId') as string
  if (!castRoleId) return

  await prisma.filmCastRole.delete({ where: { id: castRoleId } })

  // Decrement filmCount on the actor
  if (actorId) {
    const actor = await prisma.aIActor.findUnique({
      where: { id: actorId },
      select: { filmCount: true },
    })
    if (actor && actor.filmCount > 0) {
      await prisma.aIActor.update({
        where: { id: actorId },
        data: { filmCount: { decrement: 1 } },
      })
    }
  }

  revalidatePath(`/admin/actors/${actorId}/edit`)
  revalidatePath('/actors')
}
