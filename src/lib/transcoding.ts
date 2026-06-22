/**
 * Video Transcoding Service — FFmpeg pipeline
 *
 * Generates HLS (HTTP Live Streaming) variants for adaptive streaming.
 * Supports 360p / 720p / 1080p / 4K output profiles.
 *
 * In production: uses FFmpeg on the server (or a dedicated worker).
 * In dev: mock transcoding with progress tracking.
 */

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ─── Quality Profiles ────────────────────────────────────────

export type QualityProfile = {
  name: string
  resolution: string
  width: number
  height: number
  videoBitrate: string
  audioBitrate: string
  maxFramerate: number
  label: string
}

export const QUALITY_PROFILES: Record<string, QualityProfile> = {
  '360p': {
    name: '360p',
    resolution: '640x360',
    width: 640,
    height: 360,
    videoBitrate: '800k',
    audioBitrate: '96k',
    maxFramerate: 30,
    label: 'SD',
  },
  '720p': {
    name: '720p',
    resolution: '1280x720',
    width: 1280,
    height: 720,
    videoBitrate: '2500k',
    audioBitrate: '128k',
    maxFramerate: 30,
    label: 'HD',
  },
  '1080p': {
    name: '1080p',
    resolution: '1920x1080',
    width: 1920,
    height: 1080,
    videoBitrate: '5000k',
    audioBitrate: '192k',
    maxFramerate: 60,
    label: 'Full HD',
  },
  '4k': {
    name: '4K',
    resolution: '3840x2160',
    width: 3840,
    height: 2160,
    videoBitrate: '15000k',
    audioBitrate: '256k',
    maxFramerate: 60,
    label: 'Ultra HD',
  },
}

// ─── Transcoding Job ─────────────────────────────────────────

export type TranscodingJob = {
  id: string
  filmId: string
  inputUrl: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  profiles: string[]
  outputs: TranscodingOutput[]
  progress: number
  startedAt?: Date
  completedAt?: Date
  error?: string
}

export type TranscodingOutput = {
  profile: string
  hlsUrl: string
  fileSize: number
  duration: number
}

// ─── FFmpeg Command Builder ──────────────────────────────────

/**
 * Generates the FFmpeg command arguments for HLS transcoding.
 * Creates multi-quality adaptive streaming with master playlist.
 */
export function buildFFmpegArgs(
  inputPath: string,
  outputDir: string,
  profiles: string[] = ['360p', '720p', '1080p']
): string[] {
  const args: string[] = [
    '-i', inputPath,
    '-hide_banner',
    '-loglevel', 'warning',
    '-stats',
  ]

  // Video streams for each quality level
  profiles.forEach((profileName, i) => {
    const profile = QUALITY_PROFILES[profileName]
    if (!profile) return

    args.push(
      // Video encoding
      `-map`, `0:v:0`,
      `-c:v:${i}`, 'libx264',
      `-b:v:${i}`, profile.videoBitrate,
      `-maxrate:v:${i}`, profile.videoBitrate,
      `-bufsize:v:${i}`, `${parseInt(profile.videoBitrate) * 2}k`,
      `-vf:${i}`, `scale=${profile.width}:${profile.height}:force_original_aspect_ratio=decrease,pad=${profile.width}:${profile.height}:(ow-iw)/2:(oh-ih)/2`,
      `-r:${i}`, String(profile.maxFramerate),
      `-preset`, 'medium',
      `-profile:v:${i}`, 'high',
      `-level:v:${i}`, '4.1',

      // Audio encoding
      `-map`, `0:a:0?`,
      `-c:a:${i}`, 'aac',
      `-b:a:${i}`, profile.audioBitrate,
      `-ac:${i}`, '2',
    )
  })

  // HLS output settings
  args.push(
    '-f', 'hls',
    '-hls_time', '6',
    '-hls_list_size', '0',
    '-hls_segment_type', 'mpegts',
    '-hls_flags', 'independent_segments',
    '-master_pl_name', 'master.m3u8',
    '-var_stream_map', profiles.map((_, i) => `v:${i},a:${i}`).join(' '),
    `${outputDir}/stream_%v/playlist.m3u8`,
  )

  return args
}

/**
 * Generate the HLS master playlist content.
 * This is the entry point for adaptive bitrate streaming.
 */
export function generateMasterPlaylist(profiles: string[]): string {
  let playlist = '#EXTM3U\n#EXT-X-VERSION:3\n\n'

  profiles.forEach((profileName) => {
    const profile = QUALITY_PROFILES[profileName]
    if (!profile) return

    const bandwidth = parseInt(profile.videoBitrate) * 1000 + parseInt(profile.audioBitrate) * 1000
    playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${profile.resolution},NAME="${profile.label}"\n`
    playlist += `${profileName}/playlist.m3u8\n\n`
  })

  return playlist
}

// ─── Server Actions ──────────────────────────────────────────

/**
 * Start a transcoding job for a film's video.
 * Admin only — kicks off the FFmpeg pipeline.
 */
export async function startTranscodingAction(
  filmId: string,
  inputUrl: string,
  requestedProfiles: string[] = ['360p', '720p', '1080p']
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Verify admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== 'ADMIN') return { error: 'Accès refusé' }

  // Verify film exists
  const film = await prisma.film.findUnique({ where: { id: filmId }, select: { id: true, title: true, slug: true } })
  if (!film) return { error: 'Film introuvable' }

  // Validate profiles
  const validProfiles = requestedProfiles.filter(p => p in QUALITY_PROFILES)
  if (validProfiles.length === 0) return { error: 'Aucun profil de qualité valide' }

  // In production: spawn FFmpeg process or send to job queue
  // For now: generate the transcoding command and return it
  const ffmpegArgs = buildFFmpegArgs(inputUrl, `/tmp/transcode/${film.slug}`, validProfiles)
  const masterPlaylist = generateMasterPlaylist(validProfiles)

  return {
    data: {
      filmId,
      profiles: validProfiles.map(p => ({
        key: p,
        label: QUALITY_PROFILES[p].label,
        resolution: QUALITY_PROFILES[p].resolution,
        bitrate: QUALITY_PROFILES[p].videoBitrate,
      })),
      ffmpegCommand: `ffmpeg ${ffmpegArgs.join(' ')}`,
      masterPlaylist,
      message: `Transcoding configuré pour ${validProfiles.length} profils. Lancez la commande FFmpeg sur votre serveur.`,
    },
  }
}

/**
 * Get the available transcoding quality profiles.
 */
export function getAvailableProfiles() {
  return Object.entries(QUALITY_PROFILES).map(([key, p]) => ({
    key,
    label: p.label,
    resolution: p.resolution,
    bitrate: p.videoBitrate,
  }))
}

/**
 * Update film trailerUrl with HLS master playlist URL after transcoding.
 * Called by the transcoding worker or webhook after FFmpeg completes.
 */
export async function setFilmHlsUrl(filmId: string, hlsUrl: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== 'ADMIN') return { error: 'Accès refusé' }

  await prisma.film.update({
    where: { id: filmId },
    data: { trailerUrl: hlsUrl },
  })

  return { data: { filmId, hlsUrl } }
}
