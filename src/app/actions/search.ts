'use server'

import { prisma } from '@/lib/prisma'

export async function searchAction(query: string) {
  if (!query || query.length < 2) return { films: [], users: [], tasks: [] }

  const q = query.trim()

  const [films, users, tasks] = await Promise.all([
    prisma.film.findMany({
      where: {
        isPublic: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { genre: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, slug: true, genre: true, coverImageUrl: true, status: true },
      take: 5,
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { displayName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, displayName: true, avatarUrl: true, role: true, level: true },
      take: 5,
    }),
    prisma.task.findMany({
      where: {
        status: 'AVAILABLE',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { descriptionMd: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, type: true, difficulty: true, priceEuros: true },
      take: 5,
    }),
  ])

  return { films, users, tasks }
}
