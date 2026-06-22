import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  DIFFICULTY_LABELS,
  PHASE_LABELS,
} from '@/lib/constants'
import { formatPrice, formatDate, getStatusColor, getDifficultyColor, getInitials } from '@/lib/utils'
import { Star, Lock, Clock, CheckCircle, Download, AlertCircle, Trash2, MessageCircle } from 'lucide-react'
import { claimTaskAction, submitTaskAction } from '@/app/actions/tasks'
import { deleteTaskCommentAction } from '@/app/actions/comments'
import { CommentForm } from './comment-form'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const task = await prisma.task.findUnique({ where: { id }, select: { title: true } })
  return { title: task?.title || 'Tache' }
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      film: { select: { id: true, title: true, slug: true } },
      phase: { select: { phaseName: true } },
      claimedBy: { select: { id: true, displayName: true } },
      submissions: {
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!task) notFound()

  // Fetch comments separately
  const comments = await prisma.taskComment.findMany({
    where: { taskId: task.id },
    include: {
      user: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const isClaimedByMe = task.claimedById === session.user.id
  const canClaim =
    task.status === 'AVAILABLE' &&
    !task.claimedById

  const canSubmit =
    task.status === 'CLAIMED' &&
    isClaimedByMe

  const getDifficultyStars = (difficulty: string) => {
    const count = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 }[difficulty] || 1
    return Array.from({ length: 4 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? 'text-[#E50914] fill-[#E50914]' : 'text-white/20'}`}
      />
    ))
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/tasks" className="hover:text-white transition-colors">Taches</Link>
        <span>/</span>
        <Link href={`/films/${task.film.slug}`} className="hover:text-white transition-colors">
          {task.film.title}
        </Link>
        <span>/</span>
        <span className="text-white/70 truncate">{task.title}</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 flex-wrap">
          <Badge variant="secondary">{TASK_TYPE_LABELS[task.type]}</Badge>
          <Badge variant="secondary">{PHASE_LABELS[task.phase.phaseName]}</Badge>
          <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </div>

        <h1 className="text-3xl font-bold font-playfair">
          {task.title}
        </h1>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-1">
            {getDifficultyStars(task.difficulty)}
            <span className={`text-sm ml-1 ${getDifficultyColor(task.difficulty)}`}>
              {DIFFICULTY_LABELS[task.difficulty]}
            </span>
          </div>
          <div className="text-3xl font-bold text-[#E50914] font-playfair">
            {formatPrice(task.priceEuros)}
          </div>
          {task.claimedAt && isClaimedByMe && (
            <div className="flex items-center gap-1 text-sm text-white/40">
              <Clock className="h-4 w-4" />
              Acceptee le {formatDate(task.claimedAt)}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                {task.descriptionMd}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          {task.instructionsMd && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instructions Detaillees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                  {task.instructionsMd}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Files */}
          {task.inputFilesUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fichiers d&apos;Entree</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {task.inputFilesUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-white/10 hover:border-[#E50914]/30 transition-colors text-sm text-white/70 hover:text-white"
                  >
                    <Download className="h-4 w-4 text-[#E50914]" />
                    Fichier {i + 1}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Submit Form */}
          {canSubmit && (
            <Card className="border-[#E50914]/20">
              <CardHeader>
                <CardTitle className="text-base text-[#E50914]">Soumettre votre Travail</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={submitTaskAction} className="space-y-4">
                  <input type="hidden" name="taskId" value={task.id} />
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Notes / Commentaires</label>
                    <textarea
                      name="notes"
                      rows={4}
                      placeholder="Decrivez votre travail, les choix que vous avez faits..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">URL du fichier livrable (si applicable)</label>
                    <input
                      type="url"
                      name="fileUrl"
                      placeholder="https://drive.google.com/... ou URL directe"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Soumettre pour Evaluation IA
                  </Button>
                  <p className="text-xs text-white/30 text-center">
                    Votre soumission sera evaluee automatiquement par notre IA. Score &gt;70% = validation et paiement.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}

          {/* My Submissions */}
          {task.submissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mes Soumissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.submissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                      <span className="text-xs text-white/30">{formatDate(sub.createdAt)}</span>
                    </div>
                    {sub.aiScore !== null && (
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-[#E50914]">Score IA : {sub.aiScore}/100</div>
                      </div>
                    )}
                    {sub.aiFeedback && (
                      <p className="text-xs text-white/40 mt-2">{sub.aiFeedback}</p>
                    )}
                    {sub.humanFeedback && (
                      <p className="text-xs text-blue-600 mt-2">Review humaine : {sub.humanFeedback}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Comments Section ── */}
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#E50914]" />
                <span className="font-playfair">Commentaires</span>
                {comments.length > 0 && (
                  <span className="text-xs font-normal text-white/40 ml-1">
                    ({comments.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">
                  Aucun commentaire pour le moment. Soyez le premier !
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Comment Avatar */}
                        <Avatar className="h-8 w-8 shrink-0">
                          {comment.user.avatarUrl && (
                            <AvatarImage
                              src={comment.user.avatarUrl}
                              alt={comment.user.displayName || 'User'}
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.user.displayName || '??')}
                          </AvatarFallback>
                        </Avatar>

                        {/* Comment Body */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#E50914]">
                              {comment.user.displayName || 'Anonyme'}
                            </span>
                            <span className="text-xs text-[#E50914]/50">
                              {comment.createdAt.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                            {comment.content}
                          </p>
                        </div>

                        {/* Delete button (only for own comments) */}
                        {comment.userId === session.user.id && (
                          <form action={deleteTaskCommentAction} className="shrink-0">
                            <input type="hidden" name="commentId" value={comment.id} />
                            <button
                              type="submit"
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Supprimer ce commentaire"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Separator */}
              <div className="border-t border-white/5 pt-4">
                <CommentForm taskId={task.id} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Claim / Status Card */}
          <Card className={task.status === 'AVAILABLE' ? 'border-green-500/20' : ''}>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Recompense</span>
                  <span className="font-bold text-[#E50914]">{formatPrice(task.priceEuros)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Difficulte</span>
                  <span className={getDifficultyColor(task.difficulty)}>{DIFFICULTY_LABELS[task.difficulty]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Tentatives max</span>
                  <span>{task.maxAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Tentative actuelle</span>
                  <span>{task.currentAttempt} / {task.maxAttempts}</span>
                </div>
              </div>

              {task.status === 'LOCKED' ? (
                <div className="flex items-center gap-2 text-sm text-white/40 p-3 rounded-lg bg-white/5">
                  <Lock className="h-4 w-4" />
                  Tache verrouillee -- dependances non completees
                </div>
              ) : canClaim ? (
                <form action={claimTaskAction}>
                  <input type="hidden" name="taskId" value={task.id} />
                  <Button type="submit" className="w-full" size="lg">
                    Accepter cette Tache
                  </Button>
                  <p className="text-xs text-white/30 text-center mt-2">
                    Vous aurez 48h pour soumettre votre travail.
                  </p>
                </form>
              ) : isClaimedByMe && task.status === 'CLAIMED' ? (
                <div className="flex items-center gap-2 text-sm text-blue-600 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Clock className="h-4 w-4" />
                  Tache en cours -- soumettez votre travail ci-contre.
                </div>
              ) : task.status === 'VALIDATED' ? (
                <div className="flex items-center gap-2 text-sm text-green-600 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  Tache validee !
                </div>
              ) : task.status === 'CLAIMED' && !isClaimedByMe ? (
                <div className="flex items-center gap-2 text-sm text-white/40 p-3 rounded-lg bg-white/5">
                  <AlertCircle className="h-4 w-4" />
                  Cette tache est deja prise par {task.claimedBy?.displayName}.
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Film link */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-white/40 mb-2">Film associe</p>
              <Link href={`/films/${task.film.slug}`} className="text-sm font-medium hover:text-[#E50914] transition-colors">
                {task.film.title} →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
