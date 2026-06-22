'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Returns all contributors who worked on a film, grouped by phase.
 * Only includes VALIDATED tasks. Also includes the scenario author if applicable.
 * Public — no auth required.
 */
export async function getFilmCreditsAction(filmSlug: string) {
  const film = await prisma.film.findUnique({
    where: { slug: filmSlug },
    select: {
      id: true,
      title: true,
      phases: {
        select: {
          id: true,
          phaseName: true,
          phaseOrder: true,
          tasks: {
            where: { status: 'VALIDATED', claimedById: { not: null } },
            select: {
              id: true,
              title: true,
              type: true,
              claimedBy: {
                select: {
                  id: true,
                  displayName: true,
                  avatarUrl: true,
                  role: true,
                },
              },
            },
          },
        },
        orderBy: { phaseOrder: 'asc' },
      },
    },
  })

  if (!film) return { filmTitle: null, credits: [] }

  const scenario = await prisma.scenarioProposal.findFirst({
    where: { filmId: film.id, status: 'WINNER' },
    select: {
      id: true,
      title: true,
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
  })

  const credits = film.phases
    .filter((phase) => phase.tasks.length > 0)
    .map((phase) => ({
      phase: phase.phaseName,
      tasks: phase.tasks.map((task) => ({
        title: task.title,
        type: task.type,
        contributor: task.claimedBy
          ? {
              id: task.claimedBy.id,
              displayName: task.claimedBy.displayName,
              avatarUrl: task.claimedBy.avatarUrl,
              role: task.claimedBy.role,
            }
          : null,
      })),
    }))

  if (scenario) {
    credits.unshift({
      phase: 'SCRIPT' as const,
      tasks: [
        {
          title: `Scénario : ${scenario.title}`,
          type: 'PROMPT_WRITING' as const,
          contributor: {
            id: scenario.author.id,
            displayName: scenario.author.displayName,
            avatarUrl: scenario.author.avatarUrl,
            role: scenario.author.role,
          },
        },
      ],
    })
  }

  return {
    filmTitle: film.title,
    credits,
  }
}
