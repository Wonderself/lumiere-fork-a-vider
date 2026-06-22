'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

/**
 * Get personalized task recommendations based on user skills, past performance, and level.
 */
export async function getRecommendedTasks() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      skills: true,
      level: true,
      languages: true,
    },
  })
  if (!user) return []

  // Get types of tasks the user has completed successfully
  const completedTypes = await prisma.task.groupBy({
    by: ['type'],
    where: { claimedById: user.id, status: 'VALIDATED' as never },
  })
  const successfulTypes = completedTypes.map(t => t.type)

  // Skill-to-task-type mapping
  const SKILL_TYPE_MAP: Record<string, string[]> = {
    'Prompt Engineering': ['PROMPT_WRITING'],
    'Image Generation': ['IMAGE_GEN', 'CHARACTER_DESIGN', 'ENV_DESIGN'],
    'Video Editing': ['VIDEO_REVIEW', 'COMPOSITING'],
    'Stunt Performance': ['STUNT_CAPTURE', 'MOTION_REF'],
    'Dance': ['DANCE_CAPTURE', 'MOTION_REF'],
    'Motion Capture': ['STUNT_CAPTURE', 'DANCE_CAPTURE', 'MOTION_REF'],
    'Sound Design': ['SOUND_DESIGN'],
    'Color Grading': ['COLOR_GRADE'],
    'VFX / Compositing': ['COMPOSITING', 'IMAGE_GEN'],
    'Character Design': ['CHARACTER_DESIGN'],
    'Environment Design': ['ENV_DESIGN'],
    'Translation': ['TRANSLATION'],
    'Subtitling': ['SUBTITLE', 'TRANSLATION'],
    'QA / Review': ['QA_REVIEW', 'CONTINUITY_CHECK', 'VIDEO_REVIEW'],
    'Screenwriting': ['PROMPT_WRITING', 'DIALOGUE_EDIT'],
    'Direction Artistique': ['CHARACTER_DESIGN', 'ENV_DESIGN', 'COLOR_GRADE'],
  }

  // Build preferred task types from skills
  const preferredTypes = new Set<string>()
  for (const skill of user.skills) {
    const types = SKILL_TYPE_MAP[skill]
    if (types) types.forEach(t => preferredTypes.add(t))
  }
  // Also add types they've successfully completed
  for (const t of successfulTypes) preferredTypes.add(t)

  // Difficulty mapping by level
  const LEVEL_DIFFICULTIES: Record<string, string[]> = {
    ROOKIE: ['EASY', 'MEDIUM'],
    PRO: ['EASY', 'MEDIUM', 'HARD'],
    EXPERT: ['MEDIUM', 'HARD', 'EXPERT'],
    VIP: ['MEDIUM', 'HARD', 'EXPERT'],
  }
  const allowedDifficulties = LEVEL_DIFFICULTIES[user.level] || ['EASY', 'MEDIUM']

  // Fetch available tasks, prioritizing matching skills
  const tasks = await prisma.task.findMany({
    where: {
      status: 'AVAILABLE' as never,
      claimedById: null,
      difficulty: { in: allowedDifficulties as never[] },
    },
    include: {
      film: { select: { title: true, slug: true, genre: true } },
      phase: { select: { phaseName: true } },
    },
    orderBy: { priceEuros: 'desc' },
    take: 30,
  })

  // Score and sort by relevance
  const scored = tasks.map(task => {
    let score = 0
    // Type matches user skills: +10
    if (preferredTypes.has(task.type)) score += 10
    // Type was previously completed successfully: +5
    if (successfulTypes.includes(task.type)) score += 5
    // Higher pay: +1 per 50€
    score += Math.floor(task.priceEuros / 50)
    return { task, score }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 6).map(({ task, score }) => ({
    id: task.id,
    title: task.title,
    type: task.type,
    difficulty: task.difficulty,
    priceEuros: task.priceEuros,
    filmTitle: task.film.title,
    filmSlug: task.film.slug,
    phaseName: task.phase.phaseName,
    matchScore: score,
    isSkillMatch: preferredTypes.has(task.type),
  }))
}
