'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { checkAndUpgradeLevel } from '@/lib/level'
import { checkTaskBadges } from '@/lib/achievements'
import { createNotification } from '@/lib/notifications'
import { runAiReview } from '@/lib/ai-review'
import { recordEvent } from '@/lib/blockchain'
import { calculateReputationScore, getBadgeForScore } from '@/lib/reputation'
import { sendTaskValidatedEmail, sendPaymentEmail } from '@/lib/email'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

// ─── Zod Schemas for Admin Input Validation ─────────────────────

const cuidSchema = z.string().min(1, 'ID requis').max(100)

const createFilmSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  genre: z.string().max(100).optional(),
  catalog: z.enum(['LUMIERE', 'CLIENT', 'COMMUNITY']).default('LUMIERE'),
  description: z.string().max(5000).optional(),
  synopsis: z.string().max(10000).optional(),
  coverImageUrl: z.string().url('URL invalide').max(2000).optional().or(z.literal('')),
  estimatedBudget: z.string().optional(),
  isPublic: z.boolean().default(false),
})

const updateFilmSchema = z.object({
  id: cuidSchema,
  title: z.string().min(1).max(300).optional(),
  genre: z.string().max(100).optional(),
  catalog: z.string().max(50).optional(),
  status: z.string().max(50).optional(),
  description: z.string().max(5000).optional(),
  synopsis: z.string().max(10000).optional(),
  coverImageUrl: z.string().url('URL invalide').max(2000).optional().or(z.literal('')),
  estimatedBudget: z.string().optional(),
  isPublic: z.boolean().default(false),
})

const createTaskSchema = z.object({
  filmId: cuidSchema,
  phaseId: cuidSchema,
  title: z.string().min(1, 'Titre requis').max(500),
  descriptionMd: z.string().max(10000).optional(),
  instructionsMd: z.string().max(10000).optional(),
  type: z.string().min(1).max(50),
  difficulty: z.string().min(1).max(50),
  priceEuros: z.number().min(0).max(1000000),
  status: z.string().max(50).default('AVAILABLE'),
  requiredLevel: z.string().max(50).default('ROOKIE'),
})

const updateTaskSchema = z.object({
  taskId: cuidSchema,
  title: z.string().min(1).max(500).optional(),
  descriptionMd: z.string().max(10000).optional(),
  instructionsMd: z.string().max(10000).nullable().optional(),
  type: z.string().max(50).optional(),
  difficulty: z.string().max(50).optional(),
  priceEuros: z.number().min(0).max(1000000).optional(),
  status: z.string().max(50).optional(),
  requiredLevel: z.string().max(50).optional(),
  inputFilesUrls: z.string().max(50000).optional(),
})

const changeUserRoleSchema = z.object({
  userId: cuidSchema,
  role: z.enum(['ADMIN', 'CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'VIEWER', 'SCREENWRITER', 'CREATOR']),
})

const grantLumensSchema = z.object({
  userId: cuidSchema,
  amount: z.number().int().min(1, 'Minimum 1 Lumen').max(100000, 'Montant trop élevé'),
  reason: z.string().max(500).optional(),
})

const updateSettingsSchema = z.object({
  aiConfidenceThreshold: z.number().min(0).max(100).default(70),
  maxConcurrentTasks: z.number().int().min(1).max(100).default(3),
  bitcoinEnabled: z.boolean().default(false),
  maintenanceMode: z.boolean().default(false),
  lumenPrice: z.number().min(0).max(10000).default(1.0),
  lumenRewardPerTask: z.number().int().min(0).max(10000).default(10),
  notifEmailEnabled: z.boolean().default(false),
})

const setPhaseDeadlineSchema = z.object({
  phaseId: cuidSchema,
  startsAt: z.string().max(100).optional(),
  endsAt: z.string().max(100).optional(),
  estimatedDays: z.number().int().min(1).max(3650).default(30),
})

const createAdminTodoSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(500),
  description: z.string().max(5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueAt: z.string().max(100).optional(),
})

// ─── Film Actions ──────────────────────────────────────────────

export async function createFilmAction(formData: FormData) {
  await requireAdmin()

  const parsed = createFilmSchema.safeParse({
    title: formData.get('title') as string,
    genre: (formData.get('genre') as string) || undefined,
    catalog: (formData.get('catalog') as string) || 'LUMIERE',
    description: (formData.get('description') as string) || undefined,
    synopsis: (formData.get('synopsis') as string) || undefined,
    coverImageUrl: (formData.get('coverImageUrl') as string) || '',
    estimatedBudget: (formData.get('estimatedBudget') as string) || undefined,
    isPublic: formData.get('isPublic') === 'true',
  })
  if (!parsed.success) return

  const { title, genre, catalog, description, synopsis, coverImageUrl, estimatedBudget, isPublic } = parsed.data

  const slug = slugify(title)
  const existingSlug = await prisma.film.findUnique({ where: { slug } })
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

  await prisma.film.create({
    data: {
      title,
      slug: finalSlug,
      genre: genre || null,
      catalog: catalog as any,
      description: description || null,
      synopsis: synopsis || null,
      coverImageUrl: coverImageUrl || null,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      isPublic,
      phases: {
        create: [
          { phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
          { phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
          { phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
          { phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
          { phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
          { phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
          { phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
          { phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
          { phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
          { phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
        ],
      },
    },
  })

  await recordEvent({
    type: 'FILM_CREATED',
    entityType: 'Film',
    entityId: finalSlug,
    data: { title, genre, catalog, estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : 0 },
  }).catch(() => {})

  revalidatePath('/admin/films')
  revalidatePath('/films')
  redirect('/admin/films')
}

export async function updateFilmAction(formData: FormData) {
  await requireAdmin()

  const parsed = updateFilmSchema.safeParse({
    id: formData.get('id') as string,
    title: (formData.get('title') as string) || undefined,
    genre: (formData.get('genre') as string) || undefined,
    catalog: (formData.get('catalog') as string) || undefined,
    status: (formData.get('status') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    synopsis: (formData.get('synopsis') as string) || undefined,
    coverImageUrl: (formData.get('coverImageUrl') as string) || '',
    estimatedBudget: (formData.get('estimatedBudget') as string) || undefined,
    isPublic: formData.get('isPublic') === 'true',
  })
  if (!parsed.success) return

  const { id, title, genre, catalog, status, description, synopsis, coverImageUrl, estimatedBudget, isPublic } = parsed.data

  await prisma.film.update({
    where: { id },
    data: {
      title,
      genre: genre || null,
      catalog: catalog as any,
      status: status as any,
      description: description || null,
      synopsis: synopsis || null,
      coverImageUrl: coverImageUrl || null,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      isPublic,
    },
  })

  revalidatePath('/admin/films')
  revalidatePath('/films')
  redirect('/admin/films')
}

export async function deleteFilmAction(formData: FormData) {
  await requireAdmin()
  const filmIdParsed = cuidSchema.safeParse(formData.get('filmId') as string)
  if (!filmIdParsed.success) return
  await prisma.film.delete({ where: { id: filmIdParsed.data } })
  revalidatePath('/admin/films')
  revalidatePath('/films')
}

// ─── Generate Tasks from Film Decomposer ──────────────────────

export async function generateTasksForFilmAction(formData: FormData) {
  await requireAdmin()
  const filmIdParsed = cuidSchema.safeParse(formData.get('filmId') as string)
  if (!filmIdParsed.success) throw new Error('filmId is required')
  const filmId = filmIdParsed.data

  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: { phases: { orderBy: { phaseOrder: 'asc' } } },
  })
  if (!film) throw new Error('Film not found')

  const { decomposeFilmToTasks } = await import('@/lib/film-decomposer')
  const tasks = decomposeFilmToTasks(film.genre, film.estimatedBudget ? film.estimatedBudget / 20 : 50)

  const phaseMap = new Map(film.phases.map(p => [p.phaseName, p.id]))

  let created = 0
  for (const task of tasks) {
    const phaseId = phaseMap.get(task.phase as never)
    if (!phaseId) continue

    await prisma.task.create({
      data: {
        filmId,
        phaseId,
        title: task.title,
        descriptionMd: task.description,
        instructionsMd: '',
        type: task.type as never,
        difficulty: task.difficulty as never,
        priceEuros: task.priceEuros,
        status: 'AVAILABLE' as never,
        requiredLevel: 'ROOKIE' as never,
      },
    })
    created++
  }

  await prisma.film.update({
    where: { id: filmId },
    data: { totalTasks: { increment: created } },
  })

  revalidatePath('/admin/films')
  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  revalidatePath(`/films/${film.slug}`)
  redirect(`/admin/films/${filmId}/edit`)
}

// ─── Task Actions ──────────────────────────────────────────────

export async function createTaskAction(formData: FormData) {
  await requireAdmin()

  const parsed = createTaskSchema.safeParse({
    filmId: formData.get('filmId') as string,
    phaseId: formData.get('phaseId') as string,
    title: formData.get('title') as string,
    descriptionMd: (formData.get('descriptionMd') as string) || undefined,
    instructionsMd: (formData.get('instructionsMd') as string) || undefined,
    type: formData.get('type') as string,
    difficulty: formData.get('difficulty') as string,
    priceEuros: parseFloat(formData.get('priceEuros') as string) || 50,
    status: (formData.get('status') as string) || 'AVAILABLE',
    requiredLevel: (formData.get('requiredLevel') as string) || 'ROOKIE',
  })
  if (!parsed.success) return

  const { filmId, phaseId, title, descriptionMd, instructionsMd, type, difficulty, priceEuros, status, requiredLevel } = parsed.data

  await prisma.$transaction([
    prisma.task.create({
      data: {
        filmId, phaseId, title,
        descriptionMd: descriptionMd || '',
        instructionsMd: instructionsMd || null,
        type: type as any, difficulty: difficulty as any,
        priceEuros, status: status as any, requiredLevel: requiredLevel as any,
      },
    }),
    prisma.film.update({ where: { id: filmId }, data: { totalTasks: { increment: 1 } } }),
  ])

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  redirect('/admin/tasks')
}

export async function updateTaskAction(formData: FormData) {
  await requireAdmin()

  const rawPriceEuros = formData.get('priceEuros') as string
  const parsed = updateTaskSchema.safeParse({
    taskId: formData.get('taskId') as string,
    title: (formData.get('title') as string) || undefined,
    descriptionMd: (formData.get('descriptionMd') as string) || undefined,
    instructionsMd: formData.get('instructionsMd') as string ?? undefined,
    type: (formData.get('type') as string) || undefined,
    difficulty: (formData.get('difficulty') as string) || undefined,
    priceEuros: rawPriceEuros ? parseFloat(rawPriceEuros) : undefined,
    status: (formData.get('status') as string) || undefined,
    requiredLevel: (formData.get('requiredLevel') as string) || undefined,
    inputFilesUrls: (formData.get('inputFilesUrls') as string) || undefined,
  })
  if (!parsed.success) return

  const { taskId, title, descriptionMd, instructionsMd, type, difficulty, priceEuros, status, requiredLevel, inputFilesUrls: inputFilesUrlsRaw } = parsed.data

  const inputFilesUrls = inputFilesUrlsRaw
    ? inputFilesUrlsRaw.split('\n').map(u => u.trim()).filter(Boolean)
    : undefined

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title && { title }),
      ...(descriptionMd && { descriptionMd }),
      ...(instructionsMd !== undefined && { instructionsMd: instructionsMd || null }),
      ...(type && { type: type as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(priceEuros && { priceEuros }),
      ...(status && { status: status as any }),
      ...(requiredLevel && { requiredLevel: requiredLevel as any }),
      ...(inputFilesUrls && { inputFilesUrls }),
    },
  })

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
}

export async function deleteTaskAction(formData: FormData) {
  await requireAdmin()
  const taskIdParsed = cuidSchema.safeParse(formData.get('taskId') as string)
  if (!taskIdParsed.success) return
  const taskId = taskIdParsed.data

  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { filmId: true } })
  if (!task) return

  await prisma.$transaction([
    prisma.task.delete({ where: { id: taskId } }),
    prisma.film.update({ where: { id: task.filmId }, data: { totalTasks: { decrement: 1 } } }),
  ])

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
}

export async function runAiReviewAction(formData: FormData) {
  await requireAdmin()
  const submissionIdParsed = cuidSchema.safeParse(formData.get('submissionId') as string)
  if (!submissionIdParsed.success) return
  const submissionId = submissionIdParsed.data

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, notes: true, fileUrl: true, taskId: true, userId: true },
  })
  if (!submission) return

  const taskInfo = await prisma.task.findUnique({
    where: { id: submission.taskId },
    select: { title: true, type: true, instructionsMd: true },
  })

  const aiResult = await runAiReview(submission.id, submission.notes, submission.fileUrl, taskInfo ? {
    title: taskInfo.title, type: taskInfo.type, instructions: taskInfo.instructionsMd,
  } : undefined)

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: { aiScore: aiResult.score, aiFeedback: aiResult.feedback, status: aiResult.verdict },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: { status: 'HUMAN_REVIEW', aiConfidenceScore: aiResult.score },
    }),
  ])

  await createNotification(submission.userId, 'SUBMISSION_REVIEWED', 'Revue IA terminée', {
    body: `Score IA : ${aiResult.score}/100 — ${aiResult.verdict === 'AI_APPROVED' ? 'Approuvé' : 'En attente de revue humaine'}`,
    href: `/tasks/${submission.taskId}`,
  })

  revalidatePath('/admin/reviews')
}

// ─── User Actions ──────────────────────────────────────────────

export async function verifyUserAction(formData: FormData) {
  await requireAdmin()
  const userIdParsed = cuidSchema.safeParse(formData.get('userId') as string)
  if (!userIdParsed.success) return
  const userId = userIdParsed.data
  await prisma.user.update({ where: { id: userId }, data: { isVerified: true, verifiedAt: new Date() } })
  await createNotification(userId, 'SYSTEM', 'Compte vérifié', {
    body: 'Votre compte a été vérifié par un administrateur. Vous avez accès à toutes les fonctionnalités.',
    href: '/dashboard',
  })
  revalidatePath('/admin/users')
}

export async function changeUserRoleAction(formData: FormData) {
  await requireAdmin()
  const parsed = changeUserRoleSchema.safeParse({
    userId: formData.get('userId') as string,
    role: formData.get('role') as string,
  })
  if (!parsed.success) return
  const { userId, role } = parsed.data
  await prisma.user.update({ where: { id: userId }, data: { role: role as any } })
  await createNotification(userId, 'SYSTEM', 'Rôle mis à jour', {
    body: `Votre rôle a été changé en ${role}.`,
    href: '/profile',
  })
  revalidatePath('/admin/users')
}

export async function grantLumensAction(formData: FormData) {
  await requireAdmin()

  const parsed = grantLumensSchema.safeParse({
    userId: formData.get('userId') as string,
    amount: parseInt(formData.get('amount') as string, 10),
    reason: (formData.get('reason') as string) || undefined,
  })
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]
    return { error: firstError?.message || 'Données invalides' }
  }
  const { userId, amount, reason } = parsed.data

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { lumenBalance: { increment: amount } } }),
    prisma.lumenTransaction.create({
      data: { userId, amount, type: 'BONUS', description: reason || `Bonus de ${amount} Lumens attribué par un administrateur` },
    }),
  ])

  await createNotification(userId, 'PAYMENT_RECEIVED', `${amount} Lumens reçus`, {
    body: reason || `Un administrateur vous a attribué ${amount} Lumens bonus.`,
    href: '/lumens',
  })

  revalidatePath('/admin/users')
}

// ─── Review Actions ────────────────────────────────────────────

export async function approveSubmissionAction(formData: FormData) {
  const session = await requireAdmin()
  const submissionIdParsed = cuidSchema.safeParse(formData.get('submissionId') as string)
  if (!submissionIdParsed.success) return
  const submissionId = submissionIdParsed.data
  const feedback = (formData.get('feedback') as string)?.slice(0, 5000) || ''

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  })
  if (!submission) return

  const settings = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } })
  const lumenReward = settings?.lumenRewardPerTask || 10
  const points = submission.task.priceEuros >= 500 ? 500 : submission.task.priceEuros >= 100 ? 100 : 50

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: { status: 'HUMAN_APPROVED', humanReviewerId: session.user.id, humanFeedback: feedback || 'Approuvé par review humaine.' },
    }),
    prisma.task.update({ where: { id: submission.taskId }, data: { status: 'VALIDATED', validatedAt: new Date() } }),
    prisma.user.update({
      where: { id: submission.userId },
      data: { tasksCompleted: { increment: 1 }, tasksValidated: { increment: 1 }, points: { increment: points }, lumenBalance: { increment: lumenReward } },
    }),
    prisma.film.update({ where: { id: submission.task.filmId }, data: { completedTasks: { increment: 1 } } }),
    prisma.payment.upsert({
      where: { taskId: submission.taskId },
      create: { userId: submission.userId, taskId: submission.taskId, amountEur: submission.task.priceEuros, method: 'STRIPE', status: 'PENDING' },
      update: { status: 'PENDING' },
    }),
    prisma.lumenTransaction.create({
      data: { userId: submission.userId, amount: lumenReward, type: 'TASK_REWARD', description: `Récompense pour la tâche "${submission.task.title}"`, relatedId: submission.taskId },
    }),
  ])

  await createNotification(submission.userId, 'TASK_VALIDATED', 'Tâche validée', {
    body: `Votre soumission pour "${submission.task.title}" a été approuvée. +${points} points, +${lumenReward} Lumens.`,
    href: `/tasks/${submission.taskId}`,
  })

  const submitter = await prisma.user.findUnique({ where: { id: submission.userId }, select: { email: true, displayName: true } })
  if (submitter?.email) {
    const filmTitle = await prisma.film.findUnique({ where: { id: submission.task.filmId }, select: { title: true } })
    sendTaskValidatedEmail(submitter.email, submitter.displayName || 'Contributeur', submission.task.title, filmTitle?.title || 'Film', submission.task.priceEuros).catch(() => {})
  }

  await recordEvent({
    type: 'TASK_VALIDATED', entityType: 'Task', entityId: submission.taskId,
    data: { filmId: submission.task.filmId, userId: submission.userId, reviewerId: session.user.id, aiScore: submission.aiScore, priceEuros: submission.task.priceEuros },
  }).catch(() => {})

  const updatedUser = await prisma.user.findUnique({
    where: { id: submission.userId },
    select: { points: true, tasksCompleted: true, tasksValidated: true, createdAt: true },
  })
  if (updatedUser) {
    await checkAndUpgradeLevel(submission.userId, updatedUser.points)
    await checkTaskBadges(submission.userId).catch(() => {})

    const seniorityDays = Math.floor((Date.now() - updatedUser.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const acceptanceRate = updatedUser.tasksCompleted > 0
      ? Math.round((updatedUser.tasksValidated / updatedUser.tasksCompleted) * 100)
      : 0
    const score = calculateReputationScore({
      deadlineRate: 80, acceptanceRate, qualityScore: submission.aiScore ?? 70,
      collabReliability: 70, engagementScore: 50, seniorityDays, taskCount: updatedUser.tasksCompleted,
    })
    const badge = getBadgeForScore(score)
    await prisma.user.update({ where: { id: submission.userId }, data: { reputationScore: score, reputationBadge: badge.name } }).catch(() => {})
  }

  revalidatePath('/admin/reviews')
}

export async function rejectSubmissionAction(formData: FormData) {
  const session = await requireAdmin()
  const submissionIdParsed = cuidSchema.safeParse(formData.get('submissionId') as string)
  if (!submissionIdParsed.success) return
  const submissionId = submissionIdParsed.data
  const feedback = (formData.get('feedback') as string)?.slice(0, 5000) || ''

  const submission = await prisma.taskSubmission.findUnique({ where: { id: submissionId }, include: { task: true } })
  if (!submission) return

  const canRetry = submission.task.currentAttempt < submission.task.maxAttempts

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: { status: 'REJECTED', humanReviewerId: session.user.id, humanFeedback: feedback },
    }),
    prisma.task.update({ where: { id: submission.taskId }, data: { status: canRetry ? 'CLAIMED' : 'REJECTED' } }),
  ])

  await createNotification(submission.userId, 'TASK_REJECTED', 'Soumission refusée', {
    body: canRetry
      ? `Votre soumission pour "${submission.task.title}" a été refusée. Vous pouvez réessayer (tentative ${submission.task.currentAttempt}/${submission.task.maxAttempts}).`
      : `Votre soumission pour "${submission.task.title}" a été définitivement refusée.`,
    href: `/tasks/${submission.taskId}`,
  })

  revalidatePath('/admin/reviews')
}

// ─── Payment Actions ───────────────────────────────────────────

export async function markPaymentPaidAction(formData: FormData) {
  await requireAdmin()
  const paymentIdParsed = cuidSchema.safeParse(formData.get('paymentId') as string)
  if (!paymentIdParsed.success) return
  const paymentId = paymentIdParsed.data

  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, select: { userId: true, amountEur: true, status: true } })
  if (!payment) return
  if (payment.status !== 'PENDING') return

  await prisma.payment.update({ where: { id: paymentId }, data: { status: 'COMPLETED', paidAt: new Date() } })

  await createNotification(payment.userId, 'PAYMENT_RECEIVED', 'Paiement effectué', {
    body: `Votre paiement de ${payment.amountEur.toFixed(2)}€ a été traité. Facture disponible.`,
    href: `/dashboard/earnings`,
  })

  const payee = await prisma.user.findUnique({ where: { id: payment.userId }, select: { email: true, displayName: true } })
  if (payee?.email) {
    sendPaymentEmail(payee.email, payee.displayName || 'Contributeur', payment.amountEur, 'Virement').catch(() => {})
  }

  await recordEvent({
    type: 'PAYMENT_COMPLETED', entityType: 'Payment', entityId: paymentId,
    data: { userId: payment.userId, amountEur: payment.amountEur },
  }).catch(() => {})

  revalidatePath('/admin/payments')
}

export async function bulkMarkPaidAction(formData: FormData) {
  await requireAdmin()
  const paymentIdsRaw = z.string().min(1).max(10000).safeParse(formData.get('paymentIds') as string)
  if (!paymentIdsRaw.success) return

  const paymentIds = paymentIdsRaw.data.split(',').filter(Boolean).slice(0, 100)
  if (paymentIds.length === 0) return

  const payments = await prisma.payment.findMany({
    where: { id: { in: paymentIds }, status: 'PENDING' },
    select: { id: true, userId: true, amountEur: true },
  })

  await prisma.payment.updateMany({
    where: { id: { in: payments.map(p => p.id) } },
    data: { status: 'COMPLETED', paidAt: new Date() },
  })

  for (const payment of payments) {
    await createNotification(payment.userId, 'PAYMENT_RECEIVED', 'Paiement effectué', {
      body: `Votre paiement de ${payment.amountEur.toFixed(2)}€ a été traité.`,
      href: '/profile/payments',
    })
  }

  revalidatePath('/admin/payments')
}

// ─── Admin TODO Actions ────────────────────────────────────────

export async function createAdminTodoAction(formData: FormData) {
  await requireAdmin()

  const parsed = createAdminTodoSchema.safeParse({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    priority: (formData.get('priority') as string) || 'MEDIUM',
    dueAt: (formData.get('dueAt') as string) || undefined,
  })
  if (!parsed.success) return
  const { title, description, priority, dueAt } = parsed.data

  await prisma.adminTodo.create({
    data: { title, description: description || null, priority: priority as any, dueAt: dueAt ? new Date(dueAt) : null },
  })

  revalidatePath('/admin')
}

export async function toggleTodoAction(formData: FormData) {
  await requireAdmin()
  const todoIdParsed = cuidSchema.safeParse(formData.get('todoId') as string)
  if (!todoIdParsed.success) return
  const todoId = todoIdParsed.data

  const todo = await prisma.adminTodo.findUnique({ where: { id: todoId } })
  if (!todo) return

  await prisma.adminTodo.update({ where: { id: todoId }, data: { completed: !todo.completed } })
  revalidatePath('/admin')
}

export async function deleteTodoAction(formData: FormData) {
  await requireAdmin()
  const todoIdParsed = cuidSchema.safeParse(formData.get('todoId') as string)
  if (!todoIdParsed.success) return
  await prisma.adminTodo.delete({ where: { id: todoIdParsed.data } })
  revalidatePath('/admin')
}

// ─── Settings Action ───────────────────────────────────────────

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin()

  const parsed = updateSettingsSchema.safeParse({
    aiConfidenceThreshold: parseFloat(formData.get('aiConfidenceThreshold') as string) || 70,
    maxConcurrentTasks: parseInt(formData.get('maxConcurrentTasks') as string) || 3,
    bitcoinEnabled: formData.get('bitcoinEnabled') === 'true',
    maintenanceMode: formData.get('maintenanceMode') === 'true',
    lumenPrice: parseFloat(formData.get('lumenPrice') as string) || 1.0,
    lumenRewardPerTask: parseInt(formData.get('lumenRewardPerTask') as string) || 10,
    notifEmailEnabled: formData.get('notifEmailEnabled') === 'true',
  })
  if (!parsed.success) return
  const { aiConfidenceThreshold, maxConcurrentTasks, bitcoinEnabled, maintenanceMode, lumenPrice, lumenRewardPerTask, notifEmailEnabled } = parsed.data

  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', aiConfidenceThreshold, maxConcurrentTasks, bitcoinEnabled, maintenanceMode, lumenPrice, lumenRewardPerTask, notifEmailEnabled },
    update: { aiConfidenceThreshold, maxConcurrentTasks, bitcoinEnabled, maintenanceMode, lumenPrice, lumenRewardPerTask, notifEmailEnabled },
  })

  revalidatePath('/admin/settings')
}

// ─── Phase Timer Actions ──────────────────────────────────────────

export async function setPhaseDeadlineAction(formData: FormData) {
  await requireAdmin()

  const parsed = setPhaseDeadlineSchema.safeParse({
    phaseId: formData.get('phaseId') as string,
    startsAt: (formData.get('startsAt') as string) || undefined,
    endsAt: (formData.get('endsAt') as string) || undefined,
    estimatedDays: parseInt(formData.get('estimatedDays') as string) || 30,
  })
  if (!parsed.success) return { error: 'Phase invalide.' }
  const { phaseId, startsAt, endsAt, estimatedDays } = parsed.data

  await prisma.filmPhase.update({
    where: { id: phaseId },
    data: { startsAt: startsAt ? new Date(startsAt) : null, endsAt: endsAt ? new Date(endsAt) : null, estimatedDays },
  })

  revalidatePath('/admin/films')
  return { success: true }
}

export async function unlockPhaseAction(formData: FormData) {
  await requireAdmin()
  const phaseIdParsed = cuidSchema.safeParse(formData.get('phaseId') as string)
  if (!phaseIdParsed.success) return { error: 'Phase invalide.' }
  const phaseId = phaseIdParsed.data

  const phase = await prisma.filmPhase.findUnique({ where: { id: phaseId }, include: { film: true } })
  if (!phase) return { error: 'Phase introuvable.' }

  await prisma.filmPhase.update({
    where: { id: phaseId },
    data: { status: 'ACTIVE', startsAt: new Date(), endsAt: new Date(Date.now() + phase.estimatedDays * 24 * 60 * 60 * 1000) },
  })

  await recordEvent({ type: 'PHASE_UNLOCKED', entityType: 'FilmPhase', entityId: phaseId, data: { filmId: phase.filmId, phaseName: phase.phaseName } }).catch(() => {})

  revalidatePath('/admin/films')
  revalidatePath(`/admin/films/${phase.filmId}/edit`)
  return { success: true }
}

export async function completePhaseAction(formData: FormData) {
  await requireAdmin()
  const phaseIdParsed = cuidSchema.safeParse(formData.get('phaseId') as string)
  if (!phaseIdParsed.success) return { error: 'Phase invalide.' }
  const phaseId = phaseIdParsed.data

  const phase = await prisma.filmPhase.findUnique({
    where: { id: phaseId },
    include: { film: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } } },
  })
  if (!phase) return { error: 'Phase introuvable.' }

  await prisma.filmPhase.update({ where: { id: phaseId }, data: { status: 'COMPLETED', completedAt: new Date() } })

  const nextPhase = phase.film.phases.find((p) => p.phaseOrder === phase.phaseOrder + 1)
  if (nextPhase && nextPhase.status === 'LOCKED') {
    await prisma.filmPhase.update({
      where: { id: nextPhase.id },
      data: { status: 'ACTIVE', startsAt: new Date(), endsAt: new Date(Date.now() + nextPhase.estimatedDays * 24 * 60 * 60 * 1000) },
    })
  }

  const completedCount = phase.film.phases.filter((p) => p.status === 'COMPLETED').length + 1
  const totalPhases = phase.film.phases.length
  const newProgressPct = Math.round((completedCount / totalPhases) * 100)
  await prisma.film.update({ where: { id: phase.filmId }, data: { progressPct: newProgressPct } })

  await recordEvent({
    type: 'PHASE_COMPLETED', entityType: 'FilmPhase', entityId: phaseId,
    data: { filmId: phase.filmId, phaseName: phase.phaseName, progressPct: newProgressPct },
  }).catch(() => {})

  if (newProgressPct >= 100) {
    await recordEvent({
      type: 'FILM_COMPLETED', entityType: 'Film', entityId: phase.filmId,
      data: { title: phase.film.title, totalPhases },
    }).catch(() => {})
  }

  revalidatePath('/admin/films')
  revalidatePath(`/admin/films/${phase.filmId}/edit`)
  revalidatePath(`/films/${phase.film.slug}`)
  return { success: true }
}

// ─── Task Reassignment (Admin) ────────────────────────────────

export async function reassignTaskAction(formData: FormData) {
  await requireAdmin()
  const taskIdParsed = cuidSchema.safeParse(formData.get('taskId') as string)
  if (!taskIdParsed.success) return { error: 'Tâche invalide.' }
  const taskId = taskIdParsed.data

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return { error: 'Tâche introuvable.' }

  await prisma.task.update({
    where: { id: taskId },
    data: { status: 'AVAILABLE', claimedById: null, claimedAt: null, deadline: null },
  })

  if (task.claimedById) {
    await createNotification(task.claimedById, 'SYSTEM', 'Tâche réattribuée', {
      body: `La tâche "${task.title}" vous a été retirée par un administrateur.`,
      href: '/tasks',
    })
  }

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
  return { success: true }
}

// ─── Expired Task Cleanup ─────────────────────────────────────

export async function cleanupExpiredTasksAction() {
  await requireAdmin()

  const expiredTasks = await prisma.task.findMany({
    where: { status: 'CLAIMED', deadline: { lt: new Date() } },
    select: { id: true, title: true, claimedById: true },
  })

  for (const task of expiredTasks) {
    await prisma.task.update({
      where: { id: task.id },
      data: { status: 'AVAILABLE', claimedById: null, claimedAt: null, deadline: null },
    })

    if (task.claimedById) {
      await createNotification(task.claimedById, 'SYSTEM', 'Tâche expirée', {
        body: `La tâche "${task.title}" a expiré et est de nouveau disponible.`,
        href: '/tasks',
      })
    }
  }

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  return { count: expiredTasks.length }
}
