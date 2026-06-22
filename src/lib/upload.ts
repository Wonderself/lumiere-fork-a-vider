'use server'

/**
 * File upload service — S3-compatible (works with AWS S3, Cloudflare R2, Supabase Storage, MinIO)
 *
 * Supports presigned URL generation for direct client-to-bucket uploads.
 * Falls back to local /tmp storage in dev mode (no S3 needed).
 */

import { auth } from '@/lib/auth'
import { randomBytes } from 'crypto'
import path from 'path'

// ─── Configuration ──────────────────────────────────────────
const BUCKET = process.env.S3_BUCKET || 'cinegen-uploads'
const REGION = process.env.S3_REGION || 'eu-west-3'
const ENDPOINT = process.env.S3_ENDPOINT // Custom endpoint for R2/MinIO/Supabase
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB max

const ALLOWED_TYPES: Record<string, string[]> = {
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'text/plain', 'text/markdown'],
  subtitle: ['text/vtt', 'text/srt', 'application/x-subrip', 'text/plain'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'],
}

type UploadCategory = keyof typeof ALLOWED_TYPES

// ─── Generate unique file key ───────────────────────────────
function generateFileKey(category: string, originalName: string): string {
  const ext = path.extname(originalName) || '.bin'
  const rand = randomBytes(8).toString('hex')
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '/')
  return `${category}/${date}/${rand}${ext}`
}

// ─── Presigned URL generation ───────────────────────────────

type PresignedResult = {
  uploadUrl: string
  fileKey: string
  publicUrl: string
  expiresIn: number
}

/**
 * Generate a presigned PUT URL for direct client upload to S3.
 * The client uploads directly to the bucket, bypassing our server.
 */
export async function getPresignedUploadUrl(
  category: UploadCategory,
  fileName: string,
  contentType: string,
  fileSize: number
): Promise<{ error?: string; data?: PresignedResult }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Validate file type
  const allowedMimes = ALLOWED_TYPES[category]
  if (!allowedMimes) return { error: `Catégorie invalide: ${category}` }
  if (!allowedMimes.includes(contentType)) {
    return { error: `Type de fichier non autorisé. Acceptés: ${allowedMimes.join(', ')}` }
  }

  // Validate file size
  if (fileSize > MAX_FILE_SIZE) {
    return { error: `Fichier trop volumineux. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` }
  }

  const fileKey = generateFileKey(category, fileName)

  // If S3 is configured, generate real presigned URL
  if (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
    try {
      // @ts-expect-error — S3 SDK installed only in production
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
      // @ts-expect-error — S3 SDK installed only in production
      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')

      const s3 = new S3Client({
        region: REGION,
        ...(ENDPOINT ? { endpoint: ENDPOINT, forcePathStyle: true } : {}),
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      })

      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: fileKey,
        ContentType: contentType,
        ContentLength: fileSize,
        Metadata: {
          userId: session.user.id,
          category,
          originalName: fileName,
        },
      })

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
      const publicUrl = ENDPOINT
        ? `${ENDPOINT}/${BUCKET}/${fileKey}`
        : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`

      return {
        data: { uploadUrl, fileKey, publicUrl, expiresIn: 3600 },
      }
    } catch (err) {
      console.error('[Upload] S3 presign failed:', err)
      return { error: 'Erreur lors de la génération du lien d\'upload' }
    }
  }

  // Dev fallback: generate a mock URL (file will be uploaded via API route instead)
  const publicUrl = `/api/upload/${fileKey}`
  return {
    data: {
      uploadUrl: `/api/upload?key=${encodeURIComponent(fileKey)}&type=${encodeURIComponent(contentType)}`,
      fileKey,
      publicUrl,
      expiresIn: 3600,
    },
  }
}

// ─── Upload metadata ────────────────────────────────────────

export type UploadMeta = {
  fileKey: string
  publicUrl: string
  category: UploadCategory
  fileName: string
  contentType: string
  fileSize: number
  userId: string
}

/**
 * Returns info about allowed upload types and limits.
 * Used by the client to show proper UI hints.
 */
export function getUploadLimits() {
  return {
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
    allowedTypes: ALLOWED_TYPES,
    categories: Object.keys(ALLOWED_TYPES) as UploadCategory[],
  }
}
