'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { QUALITY_PROFILES } from '@/lib/transcoding'

const VALID_PROFILES = Object.keys(QUALITY_PROFILES)
const BITRATE_TAG_PREFIX = 'bitrate:'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) return null
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== 'ADMIN') return null
  return session
}

/**
 * Returns the 4 standard transcoding quality profiles.
 * Admin only.
 */
export async function getBitrateProfilesAction() {
  const session = await requireAdmin()
  if (!session) return { error: 'Accès refusé', profiles: null }

  const profiles = Object.entries(QUALITY_PROFILES).map(([key, profile]) => ({
    key,
    name: profile.name,
    label: profile.label,
    resolution: profile.resolution,
    videoBitrate: profile.videoBitrate,
    audioBitrate: profile.audioBitrate,
    maxFramerate: profile.maxFramerate,
  }))

  return { profiles }
}

/**
 * Returns the film's custom bitrate config stored in CatalogFilm.tags.
 * Falls back to all default profiles if no custom config is set.
 * Admin only.
 */
export async function getFilmBitrateConfigAction(filmId: string) {
  const session = await requireAdmin()
  if (!session) return { error: 'Accès refusé', config: null, filmTitle: null }

  const film = await prisma.catalogFilm.findUnique({
    where: { id: filmId },
    select: { title: true, tags: true },
  })
  if (!film) return { error: 'Film introuvable', config: null, filmTitle: null }

  const bitrateTag = film.tags.find((tag) => tag.startsWith(BITRATE_TAG_PREFIX))

  let enabledProfiles: string[]
  if (bitrateTag) {
    const raw = bitrateTag.slice(BITRATE_TAG_PREFIX.length)
    enabledProfiles = raw.split(',').filter((p) => VALID_PROFILES.includes(p))
  } else {
    enabledProfiles = [...VALID_PROFILES]
  }

  const config = {
    enabledProfiles,
    profiles: enabledProfiles.map((key) => ({
      key,
      ...QUALITY_PROFILES[key],
    })),
    isDefault: !bitrateTag,
  }

  return { config, filmTitle: film.title }
}

/**
 * Stores the enabled bitrate profiles in CatalogFilm.tags (as "bitrate:360p,720p,1080p").
 * Validates all profile names before saving.
 * Admin only.
 */
export async function setFilmBitrateConfigAction(filmId: string, enabledProfiles: string[]) {
  const session = await requireAdmin()
  if (!session) return { success: false, error: 'Accès refusé' }

  if (!enabledProfiles || enabledProfiles.length === 0) {
    return { success: false, error: 'Au moins un profil doit être activé' }
  }

  const invalidProfiles = enabledProfiles.filter((p) => !VALID_PROFILES.includes(p))
  if (invalidProfiles.length > 0) {
    return {
      success: false,
      error: `Profils invalides : ${invalidProfiles.join(', ')}. Profils acceptés : ${VALID_PROFILES.join(', ')}`,
    }
  }

  const film = await prisma.catalogFilm.findUnique({
    where: { id: filmId },
    select: { tags: true },
  })
  if (!film) return { success: false, error: 'Film introuvable' }

  const filteredTags = film.tags.filter((tag) => !tag.startsWith(BITRATE_TAG_PREFIX))
  const newBitrateTag = `${BITRATE_TAG_PREFIX}${enabledProfiles.join(',')}`
  const updatedTags = [...filteredTags, newBitrateTag]

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { tags: updatedTags },
  })

  return { success: true }
}
