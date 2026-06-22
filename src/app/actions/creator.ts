'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveCreatorProfileAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const stageName = formData.get('stageName') as string
  const niche = formData.get('niche') as string
  const style = formData.get('style') as string || 'NOFACE'
  const bio = formData.get('bio') as string
  const toneOfVoice = formData.get('toneOfVoice') as string
  const avatarType = formData.get('avatarType') as string
  const voiceType = formData.get('voiceType') as string
  const publishFrequency = formData.get('publishFrequency') as string
  const automationLevel = formData.get('automationLevel') as string || 'ASSISTED'
  const step = parseInt(formData.get('step') as string || '0', 10)

  if (!stageName && step >= 3) {
    return { error: 'Nom de scène requis' }
  }

  await prisma.creatorProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      stageName,
      niche,
      style: style as 'FACE' | 'NOFACE' | 'HYBRID',
      bio,
      toneOfVoice,
      avatarType,
      voiceType,
      publishFrequency,
      automationLevel: automationLevel as 'AUTO' | 'ASSISTED' | 'EXPERT',
      wizardCompleted: step >= 7,
    },
    update: {
      stageName: stageName || undefined,
      niche: niche || undefined,
      style: style as 'FACE' | 'NOFACE' | 'HYBRID',
      bio: bio || undefined,
      toneOfVoice: toneOfVoice || undefined,
      avatarType: avatarType || undefined,
      voiceType: voiceType || undefined,
      publishFrequency: publishFrequency || undefined,
      automationLevel: automationLevel as 'AUTO' | 'ASSISTED' | 'EXPERT',
      wizardCompleted: step >= 7 ? true : undefined,
    },
  })

  revalidatePath('/creator')
  return { success: true }
}

export async function generateVideoAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return { error: 'Profil créateur requis. Complétez le wizard.' }

  const title = formData.get('title') as string
  const script = formData.get('script') as string
  const platforms = formData.getAll('platforms') as string[]

  if (!title) return { error: 'Titre requis' }

  // Check token balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  const cost = 10 // TOKEN_COSTS.VIDEO_GEN_STANDARD
  if ((user?.lumenBalance || 0) < cost) {
    return { error: `Solde insuffisant. Coût : ${cost} tokens.` }
  }

  // Create video record (in GENERATING state — actual generation would be async)
  await prisma.generatedVideo.create({
    data: {
      profileId: profile.id,
      title,
      script,
      platforms,
      status: 'GENERATING',
      tokensSpent: cost,
    },
  })

  // Deduct tokens
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lumenBalance: { decrement: cost } },
  })

  await prisma.lumenTransaction.create({
    data: {
      userId: session.user.id,
      amount: -cost,
      type: 'VIDEO_GEN',
      description: `Génération vidéo : ${title}`,
    },
  })

  revalidatePath('/creator/videos')
  return { success: true }
}

export async function deleteVideoAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const videoId = formData.get('videoId') as string
  if (!videoId) return

  const video = await prisma.generatedVideo.findUnique({
    where: { id: videoId },
    include: { profile: { select: { userId: true } } },
  })

  if (!video || video.profile.userId !== session.user.id) return

  await prisma.generatedVideo.delete({ where: { id: videoId } })
  revalidatePath('/creator/videos')
}

export async function generateTrendingVideoAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return { error: 'Profil créateur requis. Complétez le wizard.' }

  const trendId = formData.get('trendId') as string
  const identityType = formData.get('identityType') as string
  const tone = formData.get('tone') as string
  const platforms = formData.getAll('platforms') as string[]
  const scheduleType = formData.get('scheduleType') as string

  if (!trendId) return { error: 'Sélectionnez une tendance' }
  if (!identityType) return { error: 'Sélectionnez votre identité' }
  if (platforms.length === 0) return { error: 'Sélectionnez au moins une plateforme' }

  // Map trend IDs to titles
  const trendTitles: Record<string, string> = {
    'face-movie': 'Mon visage dans un film IA',
    'pov-director': 'POV: Je suis réalisateur IA',
    'before-after': 'Before/After VFX IA',
    'storytime': 'Storytime: Comment j\'ai produit un film',
    'reaction': 'Réaction à mon film IA',
    '3-scenes': '3 scènes, 1 acteur (moi)',
    'film-60s': 'Film en 60 secondes',
    'casting-family': 'Casting ma famille dans un film',
    'future-cinema': 'Le futur du cinéma',
    'making-of': 'Making-of: De l\'idée au film',
  }

  const title = trendTitles[trendId] || 'Vidéo Tendance IA'

  // Token cost based on trend complexity
  const trendCosts: Record<string, number> = {
    'face-movie': 20,
    'pov-director': 15,
    'before-after': 15,
    'storytime': 10,
    'reaction': 10,
    '3-scenes': 25,
    'film-60s': 20,
    'casting-family': 25,
    'future-cinema': 10,
    'making-of': 15,
  }

  const cost = trendCosts[trendId] || 15

  // Check token balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if ((user?.lumenBalance || 0) < cost) {
    return { error: `Solde insuffisant. Coût : ${cost} tokens. Votre solde : ${user?.lumenBalance || 0} tokens.` }
  }

  // Create video record
  const video = await prisma.generatedVideo.create({
    data: {
      profileId: profile.id,
      title: `[Trend] ${title}`,
      script: `Trend: ${trendId} | Tone: ${tone || 'inspirant'} | Identity: ${identityType}`,
      platforms,
      status: 'GENERATING',
      tokensSpent: cost,
    },
  })

  // If scheduled, create publish schedule entries
  if (scheduleType === 'now') {
    for (const platform of platforms) {
      await prisma.publishSchedule.create({
        data: {
          videoId: video.id,
          platform: platform as never,
          scheduledAt: new Date(),
          status: 'SCHEDULED',
        },
      })
    }
  }

  // Deduct tokens
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lumenBalance: { decrement: cost } },
  })

  await prisma.lumenTransaction.create({
    data: {
      userId: session.user.id,
      amount: -cost,
      type: 'VIDEO_GEN',
      description: `Vidéo tendance : ${title}`,
    },
  })

  revalidatePath('/creator/trending')
  revalidatePath('/creator/videos')
  return { success: true }
}

export async function connectSocialAccountAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const platform = formData.get('platform') as string
  const handle = formData.get('handle') as string

  if (!platform || !handle) return { error: 'Plateforme et identifiant requis' }

  await prisma.socialAccount.upsert({
    where: { userId_platform: { userId: session.user.id, platform: platform as never } },
    create: {
      userId: session.user.id,
      platform: platform as never,
      handle,
    },
    update: { handle },
  })

  revalidatePath('/creator/accounts')
  return { success: true }
}
