import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public REST API — Top Contributors
 * GET /api/v1/contributors — Leaderboard of top contributors
 * Query params: page, limit
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '20')))

  const [contributors, total] = await Promise.all([
    prisma.user.findMany({
      where: { isVerified: true },
      orderBy: { lumenBalance: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        level: true,
        lumenBalance: true,
        reputationScore: true,
        skills: true,
        _count: {
          select: {
            claimedTasks: { where: { status: 'VALIDATED' as never } },
          },
        },
      },
    }),
    prisma.user.count({ where: { isVerified: true } }),
  ])

  return NextResponse.json({
    data: contributors.map((u) => ({
      id: u.id,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      role: u.role,
      level: u.level,
      lumens: u.lumenBalance,
      reputationScore: u.reputationScore,
      skills: u.skills,
      tasksCompleted: u._count.claimedTasks,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
