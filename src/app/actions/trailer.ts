'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import {
  decomposeTrailerToTasks,
  TRAILER_PHASE_ORDER,
} from '@/lib/trailer-decomposer'
import type { TrailerDecomposeConfig } from '@/lib/trailer-decomposer'

// ============================================
// Zod Schemas
// ============================================

const createProjectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  concept: z.string().max(2000).optional(),
  synopsis: z.string().max(5000).optional(),
  genre: z.string().max(100).optional(),
  style: z.string().max(100).optional(),
  mood: z.string().max(100).optional(),
  duration: z.enum([
    'TEASER_15S',
    'TEASER_30S',
    'STANDARD_60S',
    'EXTENDED_90S',
    'FULL_120S',
  ]).optional(),
  targetAudience: z.string().max(500).optional(),
  communityVoteEnabled: z.coerce.boolean().optional(),
  contestId: z.string().optional(),
})

const createChoiceSchema = z.object({
  projectId: z.string().min(1),
  taskId: z.string().optional(),
  question: z.string().min(1, 'La question est requise').max(500),
  category: z.string().max(100).optional(),
  options: z.array(z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
  })).min(2, 'Au moins 2 options requises'),
  isOpenToVote: z.boolean().optional(),
})

// ============================================
// Helpers
// ============================================

/** Statuses that count as "done" for dependency resolution */
const DONE_STATUSES = ['COMPLETED', 'APPROVED', 'SKIPPED']

// ============================================
// 1. Create Trailer Project
// ============================================

export async function createTrailerProjectAction(
  prevState: { success?: boolean; projectId?: string; error?: string } | null,
  formData: FormData
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const raw = {
      title: formData.get('title') as string,
      concept: (formData.get('concept') as string) || undefined,
      synopsis: (formData.get('synopsis') as string) || undefined,
      genre: (formData.get('genre') as string) || undefined,
      style: (formData.get('style') as string) || undefined,
      mood: (formData.get('mood') as string) || undefined,
      duration: (formData.get('duration') as string) || undefined,
      targetAudience: (formData.get('targetAudience') as string) || undefined,
      communityVoteEnabled: formData.get('communityVoteEnabled') as string | null,
      contestId: (formData.get('contestId') as string) || undefined,
    }

    const parsed = createProjectSchema.safeParse(raw)
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]
      return { error: firstError?.message || 'Données invalides' }
    }

    const data = parsed.data

    // If contestId is provided, verify the contest exists and is open
    if (data.contestId) {
      const contest = await prisma.trailerContest.findUnique({
        where: { id: data.contestId },
        select: { status: true },
      })
      if (!contest) return { error: 'Concours introuvable' }
      if (contest.status !== 'OPEN') return { error: 'Ce concours n\'est pas ouvert' }
    }

    const project = await prisma.trailerProject.create({
      data: {
        userId: session.user.id,
        title: data.title,
        concept: data.concept || null,
        synopsis: data.synopsis || null,
        genre: data.genre || null,
        style: data.style || null,
        mood: data.mood || null,
        duration: (data.duration || 'STANDARD_60S') as never,
        targetAudience: data.targetAudience || null,
        communityVoteEnabled: data.communityVoteEnabled ?? false,
        contestId: data.contestId || null,
        status: 'DRAFT' as never,
        currentPhase: 'CONCEPT' as never,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/trailer-studio')

    return { success: true, projectId: project.id }
  } catch (err) {
    console.error('[trailer] createTrailerProjectAction error:', err)
    return { error: 'Erreur lors de la création du projet' }
  }
}

// ============================================
// 2. Decompose Trailer into Micro-Tasks
// ============================================

export async function decomposeTrailerAction(projectId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const project = await prisma.trailerProject.findUnique({
      where: { id: projectId },
    })

    if (!project) return { error: 'Projet introuvable' }
    if (project.userId !== session.user.id) return { error: 'Non autorisé' }
    if (project.status !== 'DRAFT' && project.status !== 'AWAITING_INPUT') {
      return { error: 'Le projet ne peut pas être décomposé dans cet état' }
    }

    // Set status to DECOMPOSING
    await prisma.trailerProject.update({
      where: { id: projectId },
      data: { status: 'DECOMPOSING' as never },
    })

    // Build the config the decomposer expects
    const config: TrailerDecomposeConfig = {
      genre: project.genre || 'Drama',
      duration: (project.duration || 'STANDARD_60S') as TrailerDecomposeConfig['duration'],
      style: project.style || 'Cinématique',
      isInternal: false,
      hasVoiceover: true,
      hasDialogue: false,
      communityVoteEnabled: project.communityVoteEnabled,
    }

    let taskDefs: ReturnType<typeof decomposeTrailerToTasks>
    try {
      taskDefs = decomposeTrailerToTasks(config)
    } catch (decomposeErr) {
      console.error('[trailer] decomposeTrailerToTasks error:', decomposeErr)
      await prisma.trailerProject.update({
        where: { id: projectId },
        data: { status: 'DRAFT' as never },
      })
      return { error: 'Erreur lors de la décomposition du trailer' }
    }

    // Delete any existing tasks (in case of re-decomposition)
    await prisma.trailerMicroTask.deleteMany({ where: { projectId } })

    // Phase 1: Create all tasks WITHOUT dependsOnIds (we need real IDs first)
    let totalEstimatedCredits = 0
    const taskTypeToId = new Map<string, string>()

    for (const def of taskDefs) {
      totalEstimatedCredits += def.estimatedCredits

      const created = await prisma.trailerMicroTask.create({
        data: {
          projectId,
          taskType: def.taskType as never,
          phase: def.phase as never,
          title: def.title,
          description: def.description || null,
          instructions: def.instructions || null,
          order: def.order,
          dependsOnIds: [], // Will be populated in phase 2
          estimatedCredits: def.estimatedCredits,
          status: 'PENDING' as never,
        },
      })

      // Map taskType → created DB ID (first one wins for duplicates)
      if (!taskTypeToId.has(def.taskType)) {
        taskTypeToId.set(def.taskType, created.id)
      }
    }

    // Phase 2: Resolve dependsOnTypes → dependsOnIds and set correct initial status
    for (const def of taskDefs) {
      const taskId = taskTypeToId.get(def.taskType)
      if (!taskId) continue

      // Resolve type references to actual IDs
      const resolvedIds: string[] = []
      for (const depType of def.dependsOnTypes) {
        const depId = taskTypeToId.get(depType)
        if (depId) resolvedIds.push(depId)
      }

      // Update with resolved dependency IDs and correct initial status
      const initialStatus = resolvedIds.length === 0 ? 'READY' : 'BLOCKED'
      await prisma.trailerMicroTask.update({
        where: { id: taskId },
        data: {
          dependsOnIds: resolvedIds,
          status: initialStatus as never,
        },
      })
    }

    // Update project with task counts and estimated credits
    await prisma.trailerProject.update({
      where: { id: projectId },
      data: {
        totalTasks: taskDefs.length,
        estimatedCredits: totalEstimatedCredits,
        status: 'AWAITING_INPUT' as never,
      },
    })

    revalidatePath(`/trailer-studio/${projectId}`)
    revalidatePath('/dashboard')

    return { success: true, tasksCount: taskDefs.length }
  } catch (err) {
    console.error('[trailer] decomposeTrailerAction error:', err)
    return { error: 'Erreur lors de la décomposition' }
  }
}

// ============================================
// 3. Update Trailer Choice
// ============================================

export async function updateTrailerChoiceAction(
  choiceId: string,
  selectedOption: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const choice = await prisma.trailerChoice.findUnique({
      where: { id: choiceId },
      include: {
        project: { select: { id: true, userId: true, currentPhase: true } },
      },
    })

    if (!choice) return { error: 'Choix introuvable' }
    if (choice.project.userId !== session.user.id) return { error: 'Non autorisé' }

    // Validate that selectedOption is one of the option IDs
    const options = choice.options as Array<{ id: string }>
    const validOption = options.find(opt => opt.id === selectedOption)
    if (!validOption) return { error: 'Option invalide' }

    await prisma.trailerChoice.update({
      where: { id: choiceId },
      data: {
        selectedOption,
        resolvedAt: new Date(),
      },
    })

    // Check if all choices for this project are resolved (not just current phase)
    const unresolvedChoices = await prisma.trailerChoice.count({
      where: {
        projectId: choice.project.id,
        resolvedAt: null,
      },
    })

    // If all choices are resolved, advance tasks that were awaiting choices
    if (unresolvedChoices === 0) {
      await prisma.trailerMicroTask.updateMany({
        where: {
          projectId: choice.project.id,
          status: 'AWAITING_CHOICE' as never,
        },
        data: {
          status: 'READY' as never,
        },
      })
    }

    revalidatePath(`/trailer-studio/${choice.project.id}`)

    return { success: true }
  } catch (err) {
    console.error('[trailer] updateTrailerChoiceAction error:', err)
    return { error: 'Erreur lors de la mise à jour du choix' }
  }
}

// ============================================
// 4. Start Trailer Generation
// ============================================

export async function startTrailerGenerationAction(projectId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const project = await prisma.trailerProject.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        userId: true,
        status: true,
        estimatedCredits: true,
      },
    })

    if (!project) return { error: 'Projet introuvable' }
    if (project.userId !== session.user.id) return { error: 'Non autorisé' }
    if (project.status !== 'AWAITING_INPUT' && project.status !== 'IN_PROGRESS') {
      return { error: 'Le projet n\'est pas prêt pour la génération' }
    }

    // Check credit balance
    const creditAccount = await prisma.creditAccount.findUnique({
      where: { userId: session.user.id },
      select: { balance: true },
    })

    const balance = creditAccount?.balance ?? 0
    if (balance < project.estimatedCredits) {
      return {
        error: `Crédits insuffisants. Requis : ${project.estimatedCredits}, disponibles : ${balance}`,
      }
    }

    // Set project status to IN_PROGRESS
    await prisma.trailerProject.update({
      where: { id: projectId },
      data: { status: 'IN_PROGRESS' as never },
    })

    // Mark all READY tasks as GENERATING
    await prisma.trailerMicroTask.updateMany({
      where: {
        projectId,
        status: 'READY' as never,
      },
      data: {
        status: 'GENERATING' as never,
        startedAt: new Date(),
      },
    })

    revalidatePath(`/trailer-studio/${projectId}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err) {
    console.error('[trailer] startTrailerGenerationAction error:', err)
    return { error: 'Erreur lors du démarrage de la génération' }
  }
}

// ============================================
// 5. Complete Trailer Task
// ============================================

export async function completeTrailerTaskAction(
  taskId: string,
  result: {
    aiResult?: string | null
    aiScore?: number | null
    creditsUsed?: number
    rawCost?: number
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const task = await prisma.trailerMicroTask.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            id: true,
            userId: true,
            totalTasks: true,
            completedTasks: true,
            currentPhase: true,
          },
        },
      },
    })

    if (!task) return { error: 'Tâche introuvable' }

    // Verify ownership or admin
    if (task.project.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { error: 'Non autorisé' }
    }

    // Update task to COMPLETED
    await prisma.trailerMicroTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED' as never,
        aiResult: result.aiResult || null,
        aiScore: result.aiScore ?? null,
        creditsUsed: result.creditsUsed ?? 0,
        rawCost: result.rawCost ?? 0,
        commission: (result.rawCost ?? 0) * 0.2,
        completedAt: new Date(),
      },
    })

    // Record credit usage atomically
    if (result.creditsUsed && result.creditsUsed > 0) {
      try {
        await prisma.$transaction(async (tx) => {
          const creditAccount = await tx.creditAccount.findUnique({
            where: { userId: task.project.userId },
          })
          if (!creditAccount) return

          const balanceBefore = creditAccount.balance
          const balanceAfter = balanceBefore - result.creditsUsed!

          await tx.creditAccount.update({
            where: { userId: task.project.userId },
            data: {
              balance: { decrement: result.creditsUsed! },
              totalUsed: { increment: result.creditsUsed! },
            },
          })

          await tx.creditTransaction.create({
            data: {
              userId: task.project.userId,
              accountId: creditAccount.id,
              amount: -result.creditsUsed!,
              type: 'AI_USAGE' as never,
              description: `Trailer: ${task.title}`,
              rawCostEur: result.rawCost ?? 0,
              commissionEur: (result.rawCost ?? 0) * 0.2,
              totalChargedEur: (result.rawCost ?? 0) * 1.2,
              trailerProjectId: task.projectId,
              trailerTaskId: task.id,
              balanceBefore,
              balanceAfter,
            },
          })
        })
      } catch (creditErr) {
        console.error('[trailer] Credit recording error:', creditErr)
      }
    }

    // Advance dependent tasks: find BLOCKED tasks that depend on this one
    const dependentTasks = await prisma.trailerMicroTask.findMany({
      where: {
        projectId: task.projectId,
        status: 'BLOCKED' as never,
        dependsOnIds: { has: task.id },
      },
    })

    for (const depTask of dependentTasks) {
      if (depTask.dependsOnIds.length > 0) {
        // Check if ALL dependencies are done (COMPLETED, APPROVED, or SKIPPED)
        const doneDeps = await prisma.trailerMicroTask.count({
          where: {
            id: { in: depTask.dependsOnIds },
            status: { in: DONE_STATUSES.map(s => s as never) },
          },
        })

        if (doneDeps === depTask.dependsOnIds.length) {
          await prisma.trailerMicroTask.update({
            where: { id: depTask.id },
            data: { status: 'READY' as never },
          })
        }
      }
    }

    // Update project progress and currentPhase
    const newCompletedCount = task.project.completedTasks + 1
    const progressPct = task.project.totalTasks > 0
      ? Math.round((newCompletedCount / task.project.totalTasks) * 100)
      : 0

    // Determine current phase: first phase that has non-done tasks
    const allTasks = await prisma.trailerMicroTask.findMany({
      where: { projectId: task.projectId },
      select: { phase: true, status: true },
    })

    let currentPhase = task.project.currentPhase
    for (const phase of TRAILER_PHASE_ORDER) {
      const phaseTasks = allTasks.filter(t => t.phase === phase)
      if (phaseTasks.length === 0) continue
      const allDoneInPhase = phaseTasks.every(t => DONE_STATUSES.includes(t.status))
      if (!allDoneInPhase) {
        currentPhase = phase
        break
      }
    }

    const allDone = newCompletedCount >= task.project.totalTasks
    const newStatus = allDone ? 'ASSEMBLING' : undefined

    await prisma.trailerProject.update({
      where: { id: task.projectId },
      data: {
        completedTasks: newCompletedCount,
        progressPct,
        creditsUsed: { increment: result.creditsUsed ?? 0 },
        currentPhase: currentPhase as never,
        ...(newStatus ? { status: newStatus as never } : {}),
      },
    })

    revalidatePath(`/trailer-studio/${task.projectId}`)

    return { success: true, progressPct, allDone }
  } catch (err) {
    console.error('[trailer] completeTrailerTaskAction error:', err)
    return { error: 'Erreur lors de la complétion de la tâche' }
  }
}

// ============================================
// 6. Submit Trailer to Contest
// ============================================

export async function submitTrailerToContestAction(
  projectId: string,
  contestId: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const project = await prisma.trailerProject.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        userId: true,
        status: true,
        title: true,
        finalVideoUrl: true,
        finalThumbnail: true,
      },
    })

    if (!project) return { error: 'Projet introuvable' }
    if (project.userId !== session.user.id) return { error: 'Non autorisé' }
    if (project.status !== 'COMPLETED') {
      return { error: 'Le projet doit être terminé avant de le soumettre' }
    }

    const contest = await prisma.trailerContest.findUnique({
      where: { id: contestId },
      select: { id: true, status: true },
    })

    if (!contest) return { error: 'Concours introuvable' }
    if (contest.status !== 'OPEN') {
      return { error: 'Ce concours n\'est pas ouvert aux soumissions' }
    }

    // Check duplicate
    const existingEntry = await prisma.trailerEntry.findFirst({
      where: { contestId, userId: session.user.id },
    })
    if (existingEntry) {
      return { error: 'Vous avez déjà soumis un trailer à ce concours' }
    }

    await prisma.trailerEntry.create({
      data: {
        contestId,
        userId: session.user.id,
        title: project.title,
        videoUrl: project.finalVideoUrl,
        thumbnailUrl: project.finalThumbnail,
      },
    })

    await prisma.trailerProject.update({
      where: { id: projectId },
      data: {
        status: 'SUBMITTED' as never,
        contestId,
      },
    })

    revalidatePath(`/trailer-studio/${projectId}`)
    revalidatePath('/trailer-studio')

    return { success: true }
  } catch (err) {
    console.error('[trailer] submitTrailerToContestAction error:', err)
    return { error: 'Erreur lors de la soumission' }
  }
}

// ============================================
// 7. Get Trailer Project (with all relations)
// ============================================

export async function getTrailerProjectAction(projectId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const project = await prisma.trailerProject.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          orderBy: [{ order: 'asc' }],
        },
        choices: {
          orderBy: { createdAt: 'asc' },
          include: {
            votes: {
              select: { id: true, userId: true, optionId: true },
            },
          },
        },
        contest: {
          select: { id: true, title: true, status: true, endDate: true },
        },
        user: {
          select: { id: true, displayName: true, avatarUrl: true },
        },
      },
    })

    if (!project) return { error: 'Projet introuvable' }
    if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { error: 'Non autorisé' }
    }

    return { success: true, project }
  } catch (err) {
    console.error('[trailer] getTrailerProjectAction error:', err)
    return { error: 'Erreur lors de la récupération du projet' }
  }
}

// ============================================
// 8. Get My Trailer Projects
// ============================================

export async function getMyTrailerProjectsAction() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const projects = await prisma.trailerProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        concept: true,
        genre: true,
        style: true,
        duration: true,
        status: true,
        currentPhase: true,
        totalTasks: true,
        completedTasks: true,
        progressPct: true,
        estimatedCredits: true,
        creditsUsed: true,
        finalThumbnail: true,
        communityVoteEnabled: true,
        contestId: true,
        createdAt: true,
        updatedAt: true,
        contest: {
          select: { id: true, title: true, status: true },
        },
      },
    })

    return { success: true, projects }
  } catch (err) {
    console.error('[trailer] getMyTrailerProjectsAction error:', err)
    return { error: 'Erreur lors de la récupération des projets' }
  }
}

// ============================================
// 9. Delete Trailer Project
// ============================================

export async function deleteTrailerProjectAction(projectId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const project = await prisma.trailerProject.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true, status: true },
    })

    if (!project) return { error: 'Projet introuvable' }
    if (project.userId !== session.user.id) return { error: 'Non autorisé' }

    if (project.status !== 'DRAFT' && project.status !== 'CANCELLED') {
      return { error: 'Seuls les projets en brouillon ou annulés peuvent être supprimés' }
    }

    await prisma.trailerProject.delete({
      where: { id: projectId },
    })

    revalidatePath('/trailer-studio')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err) {
    console.error('[trailer] deleteTrailerProjectAction error:', err)
    return { error: 'Erreur lors de la suppression du projet' }
  }
}

// ============================================
// 10. Create Trailer Choice
// ============================================

export async function createTrailerChoiceAction(params: {
  projectId: string
  taskId?: string
  question: string
  category?: string
  options: Array<{ id: string; label: string; description?: string; imageUrl?: string }>
  isOpenToVote?: boolean
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const parsed = createChoiceSchema.safeParse(params)
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]
      return { error: firstError?.message || 'Données invalides' }
    }

    const data = parsed.data

    const project = await prisma.trailerProject.findUnique({
      where: { id: data.projectId },
      select: { id: true, userId: true },
    })

    if (!project) return { error: 'Projet introuvable' }
    if (project.userId !== session.user.id) return { error: 'Non autorisé' }

    if (data.taskId) {
      const task = await prisma.trailerMicroTask.findUnique({
        where: { id: data.taskId },
        select: { projectId: true },
      })
      if (!task || task.projectId !== data.projectId) {
        return { error: 'La tâche n\'appartient pas à ce projet' }
      }
    }

    const votesData: Record<string, number> = {}
    for (const opt of data.options) {
      votesData[opt.id] = 0
    }

    const choice = await prisma.trailerChoice.create({
      data: {
        projectId: data.projectId,
        taskId: data.taskId || null,
        question: data.question,
        category: data.category || null,
        options: data.options,
        isOpenToVote: data.isOpenToVote ?? false,
        votesData,
      },
    })

    revalidatePath(`/trailer-studio/${data.projectId}`)

    return { success: true, choiceId: choice.id }
  } catch (err) {
    console.error('[trailer] createTrailerChoiceAction error:', err)
    return { error: 'Erreur lors de la création du choix' }
  }
}

// ============================================
// 11. Vote on Trailer Choice
// ============================================

export async function voteOnTrailerChoiceAction(
  choiceId: string,
  optionId: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Non authentifié' }

    const choice = await prisma.trailerChoice.findUnique({
      where: { id: choiceId },
      select: {
        id: true,
        projectId: true,
        isOpenToVote: true,
        voteDeadline: true,
        resolvedAt: true,
        options: true,
        votesData: true,
      },
    })

    if (!choice) return { error: 'Choix introuvable' }
    if (!choice.isOpenToVote) return { error: 'Ce choix n\'est pas ouvert au vote' }
    if (choice.resolvedAt) return { error: 'Ce choix a déjà été résolu' }

    if (choice.voteDeadline && new Date() > choice.voteDeadline) {
      return { error: 'La période de vote est terminée' }
    }

    const options = choice.options as Array<{ id: string }>
    const validOption = options.find(opt => opt.id === optionId)
    if (!validOption) return { error: 'Option invalide' }

    const existingVote = await prisma.trailerChoiceVote.findUnique({
      where: {
        choiceId_userId: { choiceId, userId: session.user.id },
      },
    })
    if (existingVote) {
      return { error: 'Vous avez déjà voté pour ce choix' }
    }

    await prisma.trailerChoiceVote.create({
      data: {
        choiceId,
        userId: session.user.id,
        optionId,
      },
    })

    const votesData = (choice.votesData as Record<string, number>) || {}
    votesData[optionId] = (votesData[optionId] || 0) + 1

    await prisma.trailerChoice.update({
      where: { id: choiceId },
      data: { votesData },
    })

    revalidatePath(`/trailer-studio/${choice.projectId}`)

    return { success: true }
  } catch (err) {
    console.error('[trailer] voteOnTrailerChoiceAction error:', err)
    return { error: 'Erreur lors du vote' }
  }
}

// ============================================
// 12. Get Open Contests
// ============================================

export async function getOpenContestsAction() {
  try {
    const contests = await prisma.trailerContest.findMany({
      where: { status: 'OPEN' as never },
      orderBy: { endDate: 'asc' },
      select: {
        id: true,
        filmId: true,
        title: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        prizeDescription: true,
        prizePoolEur: true,
        prizeDistribution: true,
        autoClose: true,
        createdAt: true,
        film: {
          select: { id: true, title: true, slug: true, coverImageUrl: true },
        },
        _count: { select: { entries: true } },
      },
    })

    return { success: true, contests }
  } catch (err) {
    console.error('[trailer] getOpenContestsAction error:', err)
    return { error: 'Erreur lors de la récupération des concours' }
  }
}
