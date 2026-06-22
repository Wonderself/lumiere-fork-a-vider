/**
 * Transcoding Job Queue Manager
 *
 * File d'attente en mémoire + compatible DB pour les jobs de transcodage.
 * En production, on utiliserait Redis ou une table DB dédiée.
 * Pour l'instant: Map en mémoire avec les fonctions CRUD nécessaires.
 */

import { QUALITY_PROFILES } from '@/lib/transcoding'

// ─── Types ───────────────────────────────────────────────────

export type TranscodeJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface TranscodeJob {
  id: string
  filmId: string
  filmTitle: string
  inputUrl: string
  outputDir: string
  profiles: string[]      // e.g. ['360p', '720p', '1080p', '4k']
  status: TranscodeJobStatus
  progress: number        // 0-100
  error?: string
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  webhookUrl?: string
}

// ─── In-Memory Store ─────────────────────────────────────────
// En production, ceci serait Redis ou une table PostgreSQL.

const jobStore = new Map<string, TranscodeJob>()

// ─── Job Management Functions ────────────────────────────────

/**
 * Crée un nouveau job de transcodage et l'ajoute au store.
 * Valide les profils demandés contre QUALITY_PROFILES.
 */
export function createTranscodeJob(params: {
  filmId: string
  filmTitle: string
  inputUrl: string
  outputDir: string
  profiles?: string[]
  webhookUrl?: string
}): TranscodeJob {
  const {
    filmId,
    filmTitle,
    inputUrl,
    outputDir,
    profiles = ['360p', '720p', '1080p'],
    webhookUrl,
  } = params

  // Filtrer les profils valides
  const validProfiles = profiles.filter(p => p in QUALITY_PROFILES)
  if (validProfiles.length === 0) {
    throw new Error('Aucun profil de qualité valide fourni')
  }

  const job: TranscodeJob = {
    id: crypto.randomUUID(),
    filmId,
    filmTitle,
    inputUrl,
    outputDir,
    profiles: validProfiles,
    status: 'PENDING',
    progress: 0,
    createdAt: new Date(),
    webhookUrl,
  }

  jobStore.set(job.id, job)
  return job
}

/**
 * Récupère un job par son ID.
 */
export function getTranscodeJob(jobId: string): TranscodeJob | null {
  return jobStore.get(jobId) ?? null
}

/**
 * Met à jour le statut/progrès d'un job.
 * Gère automatiquement les timestamps startedAt et completedAt.
 */
export function updateTranscodeJob(
  jobId: string,
  updates: Partial<TranscodeJob>
): TranscodeJob | null {
  const job = jobStore.get(jobId)
  if (!job) return null

  // Auto-set startedAt when transitioning to PROCESSING
  if (updates.status === 'PROCESSING' && !job.startedAt) {
    updates.startedAt = new Date()
  }

  // Auto-set completedAt when transitioning to terminal states
  if (
    updates.status &&
    ['COMPLETED', 'FAILED', 'CANCELLED'].includes(updates.status) &&
    !job.completedAt
  ) {
    updates.completedAt = new Date()
  }

  // Auto-set progress to 100 when completed
  if (updates.status === 'COMPLETED') {
    updates.progress = 100
  }

  const updatedJob: TranscodeJob = { ...job, ...updates }
  jobStore.set(jobId, updatedJob)
  return updatedJob
}

/**
 * Liste tous les jobs, avec filtrage optionnel.
 * Triés par date de création décroissante (plus récent en premier).
 */
export function listTranscodeJobs(options?: {
  status?: TranscodeJobStatus
  filmId?: string
  limit?: number
}): TranscodeJob[] {
  let jobs = Array.from(jobStore.values())

  // Filtrer par statut
  if (options?.status) {
    jobs = jobs.filter(j => j.status === options.status)
  }

  // Filtrer par filmId
  if (options?.filmId) {
    jobs = jobs.filter(j => j.filmId === options.filmId)
  }

  // Tri décroissant par date de création
  jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Limiter le nombre de résultats
  if (options?.limit && options.limit > 0) {
    jobs = jobs.slice(0, options.limit)
  }

  return jobs
}

/**
 * Annule un job (seulement si PENDING ou PROCESSING).
 * Retourne true si annulé, false sinon.
 */
export function cancelTranscodeJob(jobId: string): boolean {
  const job = jobStore.get(jobId)
  if (!job) return false

  // On ne peut annuler que les jobs en cours ou en attente
  if (job.status !== 'PENDING' && job.status !== 'PROCESSING') {
    return false
  }

  const updated = updateTranscodeJob(jobId, {
    status: 'CANCELLED',
    error: 'Job annulé par un administrateur',
  })

  return updated !== null
}

/**
 * Retourne les statistiques globales de la queue.
 */
export function getQueueStats(): {
  pending: number
  processing: number
  completed: number
  failed: number
  cancelled: number
  total: number
} {
  const jobs = Array.from(jobStore.values())

  return {
    pending: jobs.filter(j => j.status === 'PENDING').length,
    processing: jobs.filter(j => j.status === 'PROCESSING').length,
    completed: jobs.filter(j => j.status === 'COMPLETED').length,
    failed: jobs.filter(j => j.status === 'FAILED').length,
    cancelled: jobs.filter(j => j.status === 'CANCELLED').length,
    total: jobs.length,
  }
}

/**
 * Supprime les jobs terminés vieux de plus de N jours.
 * Utile pour éviter une croissance infinie du store en mémoire.
 */
export function purgeOldJobs(olderThanDays: number = 7): number {
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
  let purged = 0

  for (const [id, job] of jobStore.entries()) {
    if (
      ['COMPLETED', 'FAILED', 'CANCELLED'].includes(job.status) &&
      job.createdAt < cutoff
    ) {
      jobStore.delete(id)
      purged++
    }
  }

  return purged
}
