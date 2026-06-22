import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public REST API — Platform Stats
 * GET /api/v1/stats — Public platform statistics
 */
export async function GET() {
  const { getCached } = await import('@/lib/redis')

  const stats = await getCached('api:v1:stats', async () => {
    const [filmsCount, tasksCompleted, usersCount, scenariosCount] = await Promise.all([
      prisma.film.count({ where: { isPublic: true } }),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.scenarioProposal.count(),
    ])

    return {
      films: filmsCount,
      tasksCompleted,
      contributors: usersCount,
      scenarios: scenariosCount,
      timestamp: new Date().toISOString(),
    }
  }, 300)

  return NextResponse.json({ data: stats })
}
