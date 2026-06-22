'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import { z } from 'zod'

const taskCommentSchema = z.object({
  taskId: z.string().min(1),
  content: z.string().min(1, 'Le commentaire ne peut pas être vide').max(2000),
})

export async function addTaskCommentAction(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const parsed = taskCommentSchema.safeParse({
    taskId: formData.get('taskId'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Données invalides' }
  }

  const { taskId, content } = parsed.data

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { claimedById: true, title: true },
  })

  if (!task) return { error: 'Tâche introuvable' }

  await prisma.taskComment.create({
    data: {
      taskId,
      userId: session.user.id,
      content,
    },
  })

  if (task.claimedById && task.claimedById !== session.user.id) {
    await createNotification(task.claimedById, 'SYSTEM', 'Nouveau commentaire', {
      body: `Un commentaire a été ajouté sur la tâche "${task.title}"`,
      href: `/tasks/${taskId}`,
    })
  }

  revalidatePath(`/tasks/${taskId}`)
  return { success: true }
}

export async function deleteTaskCommentAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const commentId = formData.get('commentId') as string
  if (!commentId) return

  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    select: { userId: true, taskId: true },
  })

  if (!comment || comment.userId !== session.user.id) return

  await prisma.taskComment.delete({ where: { id: commentId } })
  revalidatePath(`/tasks/${comment.taskId}`)
}

const COMMENTS_PER_PAGE = 15
const MAX_REPLIES_PREVIEW = 3

/**
 * Add a comment (or reply) to a film. Auth required.
 * Validates content length (1–2000 chars).
 */
export async function addCommentAction(
  filmId: string,
  content: string,
  parentId?: string
): Promise<{ success?: boolean; comment?: object; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour commenter.' }

  if (!filmId) return { error: 'Film manquant.' }

  // Validate film exists before creating comment
  const film = await prisma.catalogFilm.findUnique({ where: { id: filmId }, select: { id: true } })
  if (!film) return { error: 'Film introuvable.' }

  const trimmed = content?.trim() ?? ''
  if (trimmed.length < 1 || trimmed.length > 2000) {
    return { error: 'Le commentaire doit contenir entre 1 et 2000 caractères.' }
  }

  if (parentId) {
    const parent = await prisma.filmComment.findUnique({
      where: { id: parentId },
      select: { id: true, filmId: true, isHidden: true },
    })
    if (!parent || parent.filmId !== filmId || parent.isHidden) {
      return { error: 'Commentaire parent introuvable.' }
    }
  }

  try {
    const comment = await prisma.filmComment.create({
      data: {
        filmId,
        userId: session.user.id,
        content: trimmed,
        parentId: parentId ?? null,
      },
      include: {
        user: { select: { displayName: true, avatarUrl: true } },
      },
    })

    return { success: true, comment }
  } catch (error) {
    console.error('[comments] addCommentAction error:', error)
    return { error: 'Erreur lors de l\'ajout du commentaire.' }
  }
}

/**
 * Get paginated top-level comments for a film with up to 3 replies each.
 * Public — no auth required.
 */
export async function getFilmCommentsAction(
  filmId: string,
  page: number = 1
): Promise<{ comments: object[]; total: number; page: number; totalPages: number }> {
  if (!filmId) return { comments: [], total: 0, page: 1, totalPages: 0 }

  const currentPage = Math.max(1, page)

  try {
    const [topLevel, total] = await Promise.all([
      prisma.filmComment.findMany({
        where: { filmId, parentId: null, isHidden: false },
        include: {
          user: { select: { displayName: true, avatarUrl: true } },
          replies: {
            where: { isHidden: false },
            include: {
              user: { select: { displayName: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'asc' },
            take: MAX_REPLIES_PREVIEW,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (currentPage - 1) * COMMENTS_PER_PAGE,
        take: COMMENTS_PER_PAGE,
      }),
      prisma.filmComment.count({ where: { filmId, parentId: null, isHidden: false } }),
    ])

    const totalPages = Math.ceil(total / COMMENTS_PER_PAGE)

    return { comments: topLevel, total, page: currentPage, totalPages }
  } catch (error) {
    console.error('[comments] getFilmCommentsAction error:', error)
    return { comments: [], total: 0, page: currentPage, totalPages: 0 }
  }
}

/**
 * Toggle a like on a comment. Auth required.
 * Uses CommentLike model with unique constraint [commentId, userId].
 */
export async function likeCommentAction(
  commentId: string
): Promise<{ liked?: boolean; likesCount?: number; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté pour aimer un commentaire.' }

  if (!commentId) return { error: 'Commentaire manquant.' }

  try {
    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId: session.user.id } },
    })

    let liked: boolean
    let updatedComment: { likes: number }

    if (existing) {
      await prisma.commentLike.delete({
        where: { commentId_userId: { commentId, userId: session.user.id } },
      })
      updatedComment = await prisma.filmComment.update({
        where: { id: commentId },
        data: { likes: { decrement: 1 } },
        select: { likes: true },
      })
      liked = false
    } else {
      await prisma.commentLike.create({
        data: { commentId, userId: session.user.id },
      })
      updatedComment = await prisma.filmComment.update({
        where: { id: commentId },
        data: { likes: { increment: 1 } },
        select: { likes: true },
      })
      liked = true
    }

    return { liked, likesCount: Math.max(0, updatedComment.likes) }
  } catch (error) {
    console.error('[comments] likeCommentAction error:', error)
    return { error: 'Erreur lors du like.' }
  }
}

/**
 * Soft-delete a comment by setting isHidden=true.
 * Only the comment owner or an ADMIN can delete.
 */
export async function deleteCommentAction(
  commentId: string
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté.' }

  if (!commentId) return { error: 'Commentaire manquant.' }

  try {
    const comment = await prisma.filmComment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!comment) return { error: 'Commentaire introuvable.' }

    const isOwner = comment.userId === session.user.id
    const isAdmin = (session.user as { role?: string }).role === 'ADMIN'

    if (!isOwner && !isAdmin) return { error: 'Non autorisé.' }

    await prisma.filmComment.update({
      where: { id: commentId },
      data: { isHidden: true },
    })

    return { success: true }
  } catch (error) {
    console.error('[comments] deleteCommentAction error:', error)
    return { error: 'Erreur lors de la suppression.' }
  }
}

/**
 * Edit a comment's content. Only the comment owner can edit.
 * Sets isEdited=true on success.
 */
export async function editCommentAction(
  commentId: string,
  content: string
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Vous devez être connecté.' }

  if (!commentId) return { error: 'Commentaire manquant.' }

  const trimmed = content?.trim() ?? ''
  if (trimmed.length < 1 || trimmed.length > 2000) {
    return { error: 'Le commentaire doit contenir entre 1 et 2000 caractères.' }
  }

  try {
    const comment = await prisma.filmComment.findUnique({
      where: { id: commentId },
      select: { userId: true, isHidden: true },
    })

    if (!comment) return { error: 'Commentaire introuvable.' }
    if (comment.isHidden) return { error: 'Ce commentaire a été supprimé.' }
    if (comment.userId !== session.user.id) return { error: 'Non autorisé.' }

    await prisma.filmComment.update({
      where: { id: commentId },
      data: { content: trimmed, isEdited: true },
    })

    return { success: true }
  } catch (error) {
    console.error('[comments] editCommentAction error:', error)
    return { error: 'Erreur lors de la modification.' }
  }
}
