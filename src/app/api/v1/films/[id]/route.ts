import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public REST API — Single Film Detail
 * GET /api/v1/films/:id — Get film by ID or slug
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const film = await prisma.film.findFirst({
    where: {
      isPublic: true,
      OR: [{ id }, { slug: id }],
    },
    include: {
      phases: {
        select: {
          id: true,
          phaseName: true,
          status: true,
          phaseOrder: true,
          _count: { select: { tasks: true } },
        },
        orderBy: { phaseOrder: 'asc' },
      },
      _count: {
        select: {
          tasks: true,
          scenarios: true,
        },
      },
    },
  })

  if (!film) {
    return NextResponse.json({ error: 'Film not found' }, { status: 404 })
  }

  return NextResponse.json({
    data: {
      id: film.id,
      title: film.title,
      slug: film.slug,
      genre: film.genre,
      catalog: film.catalog,
      status: film.status,
      synopsis: film.synopsis,
      coverImageUrl: film.coverImageUrl,
      trailerUrl: film.trailerUrl,
      progressPct: film.progressPct,
      estimatedBudget: film.estimatedBudget,
      createdAt: film.createdAt.toISOString(),
      phases: film.phases.map((p) => ({
        id: p.id,
        phaseName: p.phaseName,
        status: p.status,
        order: p.phaseOrder,
        tasksCount: p._count.tasks,
      })),
      counts: {
        tasks: film._count.tasks,
        scenarios: film._count.scenarios,
      },
    },
  })
}
