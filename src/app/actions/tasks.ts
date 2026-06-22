'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { runAiReview } from '@/lib/ai-review'
import { registerContentHash } from '@/lib/content-hash'
import { createNotification } from '@/lib/notifications'
import { recordEvent } from '@/lib/blockchain'

export async function claimTaskAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const taskId = formData.get('taskId') as string
  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.status !== 'AVAILABLE') return

  // Check task dependencies (DAG): all dependent tasks must be VALIDATED
  if (task.dependsOnIds.length > 0) {
    const depTasks = await prisma.task.findMany({
      where: { id: { in: task.dependsOnIds } },
      select: { id: true, status: true },
    })
    const allDepsValidated = depTasks.every(d => d.status === 'VALIDATED')
    if (!allDepsValidated) return // Dependencies not yet completed
  }

  // Check that the phase is ACTIVE (not LOCKED)
  const phase = await prisma.filmPhase.findUnique({ where: { id: task.phaseId } })
  if (phase && phase.status === 'LOCKED') return // Phase not yet unlocked

  // Check concurrent task limit
  const settings = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } })
  const maxConcurrent = settings?.maxConcurrentTasks || 3

  const activeTasks = await prisma.task.count({
    where: {
      claimedById: session.user.id,
      status: { in: ['CLAIMED', 'SUBMITTED', 'AI_REVIEW', 'HUMAN_REVIEW'] },
    },
  })

  if (activeTasks >= maxConcurrent) return

  // Set deadline to 48h from now
  const deadline = new Date()
  deadline.setHours(deadline.getHours() + 48)

  // Atomic update: use updateMany with status+claimedById in WHERE to prevent race conditions.
  // If two users try to claim simultaneously, only one will succeed (the other gets count=0).
  let claimed = false
  try {
    const result = await prisma.task.updateMany({
      where: { id: taskId, status: 'AVAILABLE', claimedById: null },
      data: {
        status: 'CLAIMED',
        claimedById: session.user.id,
        claimedAt: new Date(),
        deadline,
      },
    })
    claimed = result.count > 0
  } catch {
    // DB error or concurrent modification — task was not claimed
    claimed = false
  }

  if (!claimed) {
    // Another user claimed the task between our read and write, or DB error
    revalidatePath(`/tasks/${taskId}`)
    revalidatePath('/tasks')
    redirect(`/tasks/${taskId}`)
  }

  // Record task claim on blockchain
  await recordEvent({
    type: 'TASK_CLAIMED',
    entityType: 'Task',
    entityId: taskId,
    data: { userId: session.user.id, filmId: task.filmId },
  }).catch((err) => console.error("[Blockchain] Failed to record TASK_CLAIMED:", err))

  revalidatePath(`/tasks/${taskId}`)
  redirect(`/tasks/${taskId}`)
}

export async function submitTaskAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const taskId = formData.get('taskId') as string
  const notes = formData.get('notes') as string
  const fileUrl = formData.get('fileUrl') as string

  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.claimedById !== session.user.id) return

  // Create submission
  const submission = await prisma.taskSubmission.create({
    data: {
      taskId,
      userId: session.user.id,
      notes: notes || null,
      fileUrl: fileUrl || null,
      status: 'PENDING_AI',
    },
  })

  // Update task
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'AI_REVIEW',
      submittedAt: new Date(),
      currentAttempt: { increment: 1 },
    },
  })

  // Register content hash for IP protection
  const contentToHash = `${notes || ''}|${fileUrl || ''}|${taskId}|${session.user.id}`
  await registerContentHash('submission', submission.id, contentToHash, session.user.id)

  // Run AI review (real Claude or mock fallback)
  const aiResult = await runAiReview(submission.id, notes, fileUrl, {
    title: task.title,
    type: task.type,
    instructions: task.instructionsMd,
  })

  // Update submission with AI results
  await prisma.taskSubmission.update({
    where: { id: submission.id },
    data: {
      aiScore: aiResult.score,
      aiFeedback: aiResult.feedback,
      status: aiResult.verdict,
    },
  })

  // Update task status based on AI verdict
  // AI_APPROVED → advance to HUMAN_REVIEW; AI_FLAGGED → revert to SUBMITTED for rework
  const newTaskStatus = aiResult.verdict === 'AI_APPROVED' ? 'HUMAN_REVIEW' : 'SUBMITTED'
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newTaskStatus,
      aiConfidenceScore: aiResult.score,
    },
  })

  // Record task submission on blockchain
  await recordEvent({
    type: 'TASK_SUBMITTED',
    entityType: 'Task',
    entityId: taskId,
    data: { userId: session.user.id, submissionId: submission.id, aiScore: aiResult.score },
  }).catch((err) => console.error("[Blockchain] Failed to record TASK_SUBMITTED:", err))

  // Notify user about AI review
  await createNotification(session.user.id, 'SUBMISSION_REVIEWED', `Revue IA terminée`, {
    body: `Score IA : ${aiResult.score}/100 — ${aiResult.verdict === 'AI_APPROVED' ? 'Approuvé' : 'En attente de revue humaine'}`,
    href: `/tasks/${taskId}`,
  })

  revalidatePath(`/tasks/${taskId}`)
  redirect(`/tasks/${taskId}`)
}

export async function abandonTaskAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const taskId = formData.get('taskId') as string
  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.claimedById !== session.user.id) return

  // Only allow abandoning if task is still CLAIMED (not submitted)
  if (task.status !== 'CLAIMED') return

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'AVAILABLE',
      claimedById: null,
      claimedAt: null,
      deadline: null,
    },
  })

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/tasks')
  redirect('/tasks')
}
