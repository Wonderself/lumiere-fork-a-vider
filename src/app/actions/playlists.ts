'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Creates a new playlist for the authenticated user.
 * Maximum 50 playlists per user. Title must be 1-100 characters.
 */
export async function createPlaylistAction(
  title: string,
  description?: string,
  isPublic?: boolean
): Promise<{ success?: boolean; playlist?: { id: string; title: string; description: string | null; isPublic: boolean; coverUrl: string | null; createdAt: string }; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour créer une playlist.' }

  const trimmedTitle = title?.trim()
  if (!trimmedTitle || trimmedTitle.length < 1 || trimmedTitle.length > 100) {
    return { error: 'Le titre doit contenir entre 1 et 100 caractères.' }
  }

  try {
    const count = await prisma.playlist.count({ where: { userId: session.user.id } })
    if (count >= 50) {
      return { error: 'Vous avez atteint la limite de 50 playlists.' }
    }

    const playlist = await prisma.playlist.create({
      data: {
        userId: session.user.id,
        title: trimmedTitle,
        description: description?.trim() || null,
        isPublic: isPublic ?? false,
      },
    })

    return {
      success: true,
      playlist: {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        isPublic: playlist.isPublic,
        coverUrl: playlist.coverUrl,
        createdAt: playlist.createdAt.toISOString(),
      },
    }
  } catch (error) {
    console.error('[playlists] createPlaylistAction error:', error)
    return { error: 'Erreur lors de la création de la playlist.' }
  }
}

/**
 * Adds a film to a playlist. Owner only. Maximum 200 items per playlist.
 * Handles duplicate entries gracefully (P2002).
 */
export async function addToPlaylistAction(
  playlistId: string,
  filmId: string
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour modifier une playlist.' }

  if (!playlistId || !filmId) return { error: 'Données manquantes.' }

  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } })
    if (!playlist) return { error: 'Playlist introuvable.' }
    if (playlist.userId !== session.user.id) return { error: 'Non autorisé.' }

    const itemCount = await prisma.playlistItem.count({ where: { playlistId } })
    if (itemCount >= 200) {
      return { error: 'La playlist est pleine (200 films maximum).' }
    }

    const maxOrder = await prisma.playlistItem.aggregate({
      where: { playlistId },
      _max: { sortOrder: true },
    })
    const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1

    await prisma.playlistItem.create({
      data: { playlistId, filmId, sortOrder: nextOrder },
    })

    return { success: true }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: true }
    }
    console.error('[playlists] addToPlaylistAction error:', error)
    return { error: 'Erreur lors de l\'ajout du film à la playlist.' }
  }
}

/**
 * Removes a film from a playlist. Owner only.
 */
export async function removeFromPlaylistAction(
  playlistId: string,
  filmId: string
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour modifier une playlist.' }

  if (!playlistId || !filmId) return { error: 'Données manquantes.' }

  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } })
    if (!playlist) return { error: 'Playlist introuvable.' }
    if (playlist.userId !== session.user.id) return { error: 'Non autorisé.' }

    await prisma.playlistItem.deleteMany({ where: { playlistId, filmId } })

    return { success: true }
  } catch (error) {
    console.error('[playlists] removeFromPlaylistAction error:', error)
    return { error: 'Erreur lors de la suppression du film.' }
  }
}

/**
 * Retrieves a playlist with its items. Public playlists are accessible to all;
 * private playlists are restricted to their owner.
 */
export async function getPlaylistAction(
  playlistId: string
): Promise<{
  playlist?: {
    id: string
    userId: string
    title: string
    description: string | null
    isPublic: boolean
    coverUrl: string | null
    createdAt: string
    updatedAt: string
    items: Array<{
      id: string
      filmId: string
      sortOrder: number
      addedAt: string
      film: { title: string; slug: string; genre: string | null; thumbnailUrl: string | null }
    }>
  }
  error?: string
}> {
  if (!playlistId) return { error: 'Identifiant de playlist manquant.' }

  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
          include: {
            film: {
              select: { title: true, slug: true, genre: true, thumbnailUrl: true },
            },
          },
        },
      },
    })

    if (!playlist) return { error: 'Playlist introuvable.' }

    if (!playlist.isPublic) {
      const session = await auth()
      if (!session?.user?.id || session.user.id !== playlist.userId) {
        return { error: 'Cette playlist est privée.' }
      }
    }

    return {
      playlist: {
        id: playlist.id,
        userId: playlist.userId,
        title: playlist.title,
        description: playlist.description,
        isPublic: playlist.isPublic,
        coverUrl: playlist.coverUrl,
        createdAt: playlist.createdAt.toISOString(),
        updatedAt: playlist.updatedAt.toISOString(),
        items: playlist.items.map((item) => ({
          id: item.id,
          filmId: item.filmId,
          sortOrder: item.sortOrder,
          addedAt: item.addedAt.toISOString(),
          film: {
            title: item.film.title,
            slug: item.film.slug,
            genre: item.film.genre,
            thumbnailUrl: item.film.thumbnailUrl,
          },
        })),
      },
    }
  } catch (error) {
    console.error('[playlists] getPlaylistAction error:', error)
    return { error: 'Erreur lors de la récupération de la playlist.' }
  }
}

/**
 * Returns playlists for a user. If userId is provided, returns that user's public
 * playlists. Otherwise returns the authenticated user's own playlists (all visibility).
 */
export async function getUserPlaylistsAction(
  userId?: string
): Promise<{
  playlists: Array<{
    id: string
    userId: string
    title: string
    description: string | null
    isPublic: boolean
    coverUrl: string | null
    createdAt: string
    updatedAt: string
    _count: { items: number }
  }>
  error?: string
}> {
  try {
    if (userId) {
      const playlists = await prisma.playlist.findMany({
        where: { userId, isPublic: true },
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { items: true } } },
      })

      return {
        playlists: playlists.map((p) => ({
          id: p.id,
          userId: p.userId,
          title: p.title,
          description: p.description,
          isPublic: p.isPublic,
          coverUrl: p.coverUrl,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
          _count: { items: p._count.items },
        })),
      }
    }

    const session = await auth()
    if (!session?.user?.id) return { playlists: [], error: 'Vous devez être connecté.' }

    const playlists = await prisma.playlist.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { items: true } } },
    })

    return {
      playlists: playlists.map((p) => ({
        id: p.id,
        userId: p.userId,
        title: p.title,
        description: p.description,
        isPublic: p.isPublic,
        coverUrl: p.coverUrl,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        _count: { items: p._count.items },
      })),
    }
  } catch (error) {
    console.error('[playlists] getUserPlaylistsAction error:', error)
    return { playlists: [], error: 'Erreur lors de la récupération des playlists.' }
  }
}

/**
 * Deletes a playlist and all its items (cascade). Owner only.
 */
export async function deletePlaylistAction(
  playlistId: string
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour supprimer une playlist.' }

  if (!playlistId) return { error: 'Identifiant de playlist manquant.' }

  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } })
    if (!playlist) return { error: 'Playlist introuvable.' }
    if (playlist.userId !== session.user.id) return { error: 'Non autorisé.' }

    await prisma.playlist.delete({ where: { id: playlistId } })

    return { success: true }
  } catch (error) {
    console.error('[playlists] deletePlaylistAction error:', error)
    return { error: 'Erreur lors de la suppression de la playlist.' }
  }
}

/**
 * Updates a playlist's metadata (title, description, visibility). Owner only.
 */
export async function updatePlaylistAction(
  playlistId: string,
  data: { title?: string; description?: string; isPublic?: boolean }
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour modifier une playlist.' }

  if (!playlistId) return { error: 'Identifiant de playlist manquant.' }
  if (!data || Object.keys(data).length === 0) return { error: 'Aucune donnée à mettre à jour.' }

  const trimmedTitle = data.title?.trim()
  if (trimmedTitle !== undefined && (trimmedTitle.length < 1 || trimmedTitle.length > 100)) {
    return { error: 'Le titre doit contenir entre 1 et 100 caractères.' }
  }

  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } })
    if (!playlist) return { error: 'Playlist introuvable.' }
    if (playlist.userId !== session.user.id) return { error: 'Non autorisé.' }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        ...(trimmedTitle !== undefined && { title: trimmedTitle }),
        ...(data.description !== undefined && { description: data.description.trim() || null }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[playlists] updatePlaylistAction error:', error)
    return { error: 'Erreur lors de la mise à jour de la playlist.' }
  }
}
