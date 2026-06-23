'use server'

import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Anonymous, IP-scoped film voting (greenlight poll).
 * One vote per IP per film. Voting again with the same type toggles it off;
 * voting the opposite type switches the vote.
 */

export interface FilmVoteState {
  up: number
  down: number
  total: number
  forPct: number // 0-100, share of "up" votes
  userVote: 'up' | 'down' | null
  error?: string
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers()
  return (
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    hdrs.get('x-real-ip') ||
    'unknown'
  )
}

async function tally(filmId: string, ip: string): Promise<FilmVoteState> {
  const [up, down, mine] = await Promise.all([
    prisma.filmIpVote.count({ where: { filmId, voteType: 'up' } }),
    prisma.filmIpVote.count({ where: { filmId, voteType: 'down' } }),
    prisma.filmIpVote.findUnique({ where: { filmId_ip: { filmId, ip } } }),
  ])
  const total = up + down
  return {
    up,
    down,
    total,
    forPct: total > 0 ? Math.round((up / total) * 100) : 50,
    userVote: (mine?.voteType as 'up' | 'down') ?? null,
  }
}

/** Read the current vote tally + this IP's vote. */
export async function getFilmVoteStateAction(filmId: string): Promise<FilmVoteState> {
  if (!filmId) return { up: 0, down: 0, total: 0, forPct: 50, userVote: null }
  try {
    const ip = await getClientIp()
    return await tally(filmId, ip)
  } catch {
    return { up: 0, down: 0, total: 0, forPct: 50, userVote: null }
  }
}

/** Cast / switch / toggle a vote for the current IP. */
export async function voteFilmByIpAction(filmId: string, voteType: 'up' | 'down'): Promise<FilmVoteState> {
  if (!filmId || !['up', 'down'].includes(voteType)) {
    return { up: 0, down: 0, total: 0, forPct: 50, userVote: null, error: 'Invalid data' }
  }

  try {
    const ip = await getClientIp()
    const film = await prisma.film.findUnique({ where: { id: filmId }, select: { slug: true } })
    if (!film) {
      return { up: 0, down: 0, total: 0, forPct: 50, userVote: null, error: 'Film not found' }
    }

    const existing = await prisma.filmIpVote.findUnique({ where: { filmId_ip: { filmId, ip } } })

    if (!existing) {
      await prisma.filmIpVote.create({ data: { filmId, ip, voteType } })
    } else if (existing.voteType === voteType) {
      // same vote → toggle off
      await prisma.filmIpVote.delete({ where: { id: existing.id } })
    } else {
      // switch side
      await prisma.filmIpVote.update({ where: { id: existing.id }, data: { voteType } })
    }

    const state = await tally(filmId, ip)
    revalidatePath(`/films/${film.slug}`)
    return state
  } catch {
    return { up: 0, down: 0, total: 0, forPct: 50, userVote: null, error: 'Erreur, réessayez' }
  }
}
