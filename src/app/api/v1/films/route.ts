import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public REST API — Films
 * GET /api/v1/films — List all public films
 * Query params: page, limit, genre, status, sort
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '20')))
  const genre = searchParams.get('genre')
  const status = searchParams.get('status')
  const sort = searchParams.get('sort') || 'recent'

  const where: Record<string, unknown> = { isPublic: true }
  if (genre) where.genre = genre
  if (status) where.status = status

  const orderBy = sort === 'title'
    ? { title: 'asc' as const }
    : sort === 'progress'
      ? { progressPct: 'desc' as const }
      : { createdAt: 'desc' as const }

  const [films, total] = await Promise.all([
    prisma.film.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        genre: true,
        status: true,
        synopsis: true,
        coverImageUrl: true,
        progressPct: true,
        createdAt: true,
        _count: { select: { phases: true, tasks: true } },
      },
    }),
    prisma.film.count({ where }),
  ])

  return NextResponse.json({
    data: films.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      genre: f.genre,
      status: f.status,
      synopsis: f.synopsis,
      coverImageUrl: f.coverImageUrl,
      progressPct: f.progressPct,
      phasesCount: f._count.phases,
      tasksCount: f._count.tasks,
      createdAt: f.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
