'use server'

/**
 * Server Actions pour le transcodage vidéo.
 * Réservées aux administrateurs — gestion de la queue de transcodage.
 */

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildFFmpegArgs, QUALITY_PROFILES } from '@/lib/transcoding'
import {
  createTranscodeJob,
  getTranscodeJob,
  updateTranscodeJob,
  listTranscodeJobs,
  cancelTranscodeJob,
  getQueueStats,
  type TranscodeJobStatus,
} from '@/lib/transcoding-queue'

// ─── Helper: vérifier le rôle admin ─────────────────────────

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Accès refusé — administrateur requis' }
  }
  return { session }
}

// ─── Actions ─────────────────────────────────────────────────

/**
 * Démarre le transcodage d'un film.
 * Crée un job dans la queue avec les profils demandés.
 */
export async function startTranscodeAction(
  filmId: string,
  profiles?: string[]
) {
  const result = await requireAdmin()
  if ('error' in result) return { error: result.error }

  // Vérifier que le film existe
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    select: { id: true, title: true, slug: true, trailerUrl: true },
  })
  if (!film) return { error: 'Film introuvable' }

  // L'URL source du film (trailerUrl ou placeholder)
  const inputUrl = film.trailerUrl || `/uploads/films/${film.slug}/source.mp4`
  const outputDir = `/media/transcode/${film.slug}`

  // Valider les profils
  const requestedProfiles = profiles?.length
    ? profiles.filter(p => p in QUALITY_PROFILES)
    : ['360p', '720p', '1080p']

  if (requestedProfiles.length === 0) {
    return { error: 'Aucun profil de qualité valide' }
  }

  try {
    // Créer le job dans la queue
    const job = createTranscodeJob({
      filmId: film.id,
      filmTitle: film.title,
      inputUrl,
      outputDir,
      profiles: requestedProfiles,
    })

    // Générer la commande FFmpeg pour référence
    const ffmpegArgs = buildFFmpegArgs(inputUrl, outputDir, requestedProfiles)

    return {
      data: {
        jobId: job.id,
        filmId: film.id,
        filmTitle: film.title,
        profiles: requestedProfiles.map(p => ({
          key: p,
          label: QUALITY_PROFILES[p].label,
          resolution: QUALITY_PROFILES[p].resolution,
        })),
        ffmpegCommand: `ffmpeg ${ffmpegArgs.join(' ')}`,
        status: job.status,
        message: `Job de transcodage créé pour "${film.title}" avec ${requestedProfiles.length} profil(s).`,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return { error: `Échec de création du job: ${message}` }
  }
}

/**
 * Récupère le statut d'un job de transcodage.
 */
export async function getTranscodeStatusAction(jobId: string) {
  const result = await requireAdmin()
  if ('error' in result) return { error: result.error }

  const job = getTranscodeJob(jobId)
  if (!job) return { error: 'Job introuvable' }

  return {
    data: {
      id: job.id,
      filmId: job.filmId,
      filmTitle: job.filmTitle,
      status: job.status,
      progress: job.progress,
      profiles: job.profiles,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    },
  }
}

/**
 * Liste tous les jobs de transcodage avec filtrage optionnel.
 */
export async function listTranscodeJobsAction(status?: string) {
  const result = await requireAdmin()
  if ('error' in result) return { error: result.error }

  const validStatuses: TranscodeJobStatus[] = [
    'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED',
  ]

  const filterStatus = status && validStatuses.includes(status as TranscodeJobStatus)
    ? (status as TranscodeJobStatus)
    : undefined

  const jobs = listTranscodeJobs({
    status: filterStatus,
    limit: 100,
  })

  return {
    data: jobs.map(job => ({
      id: job.id,
      filmId: job.filmId,
      filmTitle: job.filmTitle,
      status: job.status,
      progress: job.progress,
      profiles: job.profiles,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    })),
  }
}

/**
 * Annule un job de transcodage (seulement si PENDING ou PROCESSING).
 */
export async function cancelTranscodeAction(jobId: string) {
  const result = await requireAdmin()
  if ('error' in result) return { error: result.error }

  const job = getTranscodeJob(jobId)
  if (!job) return { error: 'Job introuvable' }

  const cancelled = cancelTranscodeJob(jobId)
  if (!cancelled) {
    return {
      error: `Impossible d'annuler le job — statut actuel: ${job.status}. Seuls les jobs PENDING ou PROCESSING peuvent être annulés.`,
    }
  }

  return {
    data: {
      jobId,
      status: 'CANCELLED' as const,
      message: `Job de transcodage pour "${job.filmTitle}" annulé.`,
    },
  }
}

/**
 * Retourne les statistiques globales de la queue de transcodage.
 */
export async function getTranscodeQueueStatsAction() {
  const result = await requireAdmin()
  if ('error' in result) return { error: result.error }

  const stats = getQueueStats()

  return {
    data: {
      ...stats,
      availableProfiles: Object.entries(QUALITY_PROFILES).map(([key, p]) => ({
        key,
        label: p.label,
        resolution: p.resolution,
        bitrate: p.videoBitrate,
      })),
    },
  }
}

/**
 * Met à jour manuellement le statut/progrès d'un job.
 * Utile pour les webhooks ou la mise à jour manuelle par un admin.
 */
export async function updateTranscodeJobAction(
  jobId: string,
  updates: { status?: TranscodeJobStatus; progress?: number; error?: string }
) {
  const result = await requireAdmin()
  if ('error' in result) return { error: result.error }

  const job = getTranscodeJob(jobId)
  if (!job) return { error: 'Job introuvable' }

  const updated = updateTranscodeJob(jobId, updates)
  if (!updated) return { error: 'Échec de la mise à jour' }

  return {
    data: {
      id: updated.id,
      status: updated.status,
      progress: updated.progress,
      message: `Job mis à jour — statut: ${updated.status}, progrès: ${updated.progress}%`,
    },
  }
}
