'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Subtitle management for streaming catalog films.
 * Supports .vtt and .srt formats, multiple languages.
 */

const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' },
  { code: 'he', label: 'עברית' },
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export async function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES
}

/**
 * Parse and validate an SRT/VTT subtitle file.
 * Returns the number of cues found or an error.
 */
function validateSubtitleContent(content: string): { valid: boolean; cueCount: number; error?: string } {
  const lines = content.trim().split('\n')
  if (lines.length < 3) return { valid: false, cueCount: 0, error: 'Fichier trop court' }

  // Detect format
  const isVTT = lines[0].trim().startsWith('WEBVTT')
  const isSRT = /^\d+$/.test(lines[0].trim())

  if (!isVTT && !isSRT) {
    return { valid: false, cueCount: 0, error: 'Format non reconnu. Utilisez .vtt ou .srt' }
  }

  // Count timestamp lines (rough cue count)
  const timestampPattern = /\d{2}:\d{2}[:.]\d{2}/
  const cueCount = lines.filter(l => timestampPattern.test(l)).length

  if (cueCount === 0) {
    return { valid: false, cueCount: 0, error: 'Aucun sous-titre trouvé dans le fichier' }
  }

  return { valid: true, cueCount }
}

/**
 * Convert SRT content to WebVTT format (browsers require VTT).
 */
function srtToVtt(srt: string): string {
  let vtt = 'WEBVTT\n\n'
  // Replace SRT timecodes (comma → dot)
  vtt += srt
    .replace(/\r\n/g, '\n')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
  return vtt
}

/**
 * Add subtitle track to a catalog film.
 * Accepts raw subtitle content (VTT or SRT) + language code.
 */
export async function addSubtitleAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const filmId = formData.get('filmId') as string
  const language = formData.get('language') as string
  const subtitleContent = formData.get('content') as string
  const subtitleUrl = formData.get('subtitleUrl') as string

  if (!filmId || !language) return { error: 'Film et langue requis' }
  if (!subtitleContent && !subtitleUrl) return { error: 'Contenu ou URL du sous-titre requis' }

  // Validate language
  const isValidLang = SUPPORTED_LANGUAGES.some(l => l.code === language)
  if (!isValidLang) return { error: 'Langue non supportée' }

  // Check film exists and user is owner or admin
  const film = await prisma.catalogFilm.findUnique({
    where: { id: filmId },
    select: { submittedById: true, slug: true },
  })
  if (!film) return { error: 'Film introuvable' }

  const isOwner = film.submittedById === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) return { error: 'Non autorisé' }

  // If content provided, validate and convert
  let finalUrl = subtitleUrl
  if (subtitleContent) {
    const validation = validateSubtitleContent(subtitleContent)
    if (!validation.valid) return { error: validation.error }

    // Convert SRT to VTT if needed
    const isVTT = subtitleContent.trim().startsWith('WEBVTT')
    const vttContent = isVTT ? subtitleContent : srtToVtt(subtitleContent)

    // Store as data URL (for now — in production, upload to S3)
    finalUrl = `data:text/vtt;base64,${Buffer.from(vttContent).toString('base64')}`
  }

  // Store subtitle reference in film tags (pragmatic — no schema change needed)
  // Format: subtitle:lang:url
  const subtitleTag = `subtitle:${language}:${finalUrl}`
  const film2 = await prisma.catalogFilm.findUnique({
    where: { id: filmId },
    select: { tags: true },
  })

  // Remove existing subtitle for this language
  const existingTags = (film2?.tags || []).filter(t => !t.startsWith(`subtitle:${language}:`))
  existingTags.push(subtitleTag)

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { tags: existingTags },
  })

  revalidatePath(`/streaming/${film.slug}`)
  return { success: true }
}

/**
 * Extract subtitle tracks from a film's tags.
 * Returns array of { lang, label, src } for the video player.
 */
export async function extractSubtitleTracks(tags: string[]): Promise<{ srclang: string; label: string; src: string }[]> {
  return tags
    .filter(t => t.startsWith('subtitle:'))
    .map(t => {
      const [, lang, ...urlParts] = t.split(':')
      const src = urlParts.join(':') // rejoin URL colons
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang)
      return {
        srclang: lang,
        label: langInfo?.label || lang,
        src,
      }
    })
}
