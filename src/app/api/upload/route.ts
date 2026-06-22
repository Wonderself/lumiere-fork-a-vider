import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

/**
 * POST /api/upload — Dev-only local file upload fallback
 * In production, clients upload directly to S3 via presigned URLs.
 * This endpoint exists for local development without S3.
 */
export async function POST(request: Request) {
  // Only allow in dev
  if (process.env.S3_ACCESS_KEY_ID) {
    return NextResponse.json({ error: 'Use presigned S3 URLs in production' }, { status: 400 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const key = formData.get('key') as string

  if (!file || !key) {
    return NextResponse.json({ error: 'file and key are required' }, { status: 400 })
  }

  // Max 500MB
  if (file.size > 500 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 500MB)' }, { status: 413 })
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', path.dirname(key))
    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(process.cwd(), 'public', 'uploads', key)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      ok: true,
      fileKey: key,
      publicUrl: `/uploads/${key}`,
      size: file.size,
    })
  } catch (err) {
    console.error('[Upload] Write failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
