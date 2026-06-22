import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, CheckCircle2, Clock, Loader2, Wand2,
  Film, Palette, Music, Clapperboard, Scissors, Sparkles,
  Play, Heart, Coins, AlertCircle, Lock,
} from 'lucide-react'
import type { Metadata } from 'next'
import { TrailerActions } from './trailer-actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Projet Bande-Annonce' }

const PHASE_CONFIG: Record<string, { label: string; icon: typeof Film; color: string }> = {
  CONCEPT: { label: 'Concept', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' },
  SCRIPT: { label: 'Script', icon: Film, color: 'text-blue-400 bg-blue-500/10' },
  VISUAL_DESIGN: { label: 'Design Visuel', icon: Palette, color: 'text-purple-400 bg-purple-500/10' },
  STORYBOARD: { label: 'Storyboard', icon: Clapperboard, color: 'text-pink-400 bg-pink-500/10' },
  PRODUCTION: { label: 'Production IA', icon: Wand2, color: 'text-indigo-400 bg-indigo-500/10' },
  AUDIO: { label: 'Audio', icon: Music, color: 'text-green-400 bg-green-500/10' },
  POST_PRODUCTION: { label: 'Post-Production', icon: Scissors, color: 'text-orange-400 bg-orange-500/10' },
  ASSEMBLY: { label: 'Assemblage Final', icon: Play, color: 'text-red-400 bg-red-500/10' },
}

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-white/[0.05] text-white/50' },
  BLOCKED: { label: 'Bloqué', color: 'bg-white/[0.05] text-white/50' },
  READY: { label: 'Prêt', color: 'bg-blue-500/15 text-blue-400' },
  GENERATING: { label: 'Génération...', color: 'bg-purple-500/15 text-purple-400' },
  AWAITING_CHOICE: { label: 'Choix requis', color: 'bg-amber-500/15 text-amber-400' },
  IN_REVIEW: { label: 'En revue', color: 'bg-orange-500/15 text-orange-400' },
  APPROVED: { label: 'Approuvé', color: 'bg-emerald-500/15 text-emerald-400' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-500/15 text-red-400' },
  COMPLETED: { label: 'Terminé', color: 'bg-green-500/15 text-green-400' },
  SKIPPED: { label: 'Ignoré', color: 'bg-white/[0.05] text-white/50' },
}

export default async function TrailerProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const project = await prisma.trailerProject.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ order: 'asc' }] },
      choices: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!project) notFound()
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/trailer-studio')
  }

  // Group tasks by phase (using PHASE_CONFIG key order)
  const tasksByPhase = new Map<string, typeof project.tasks>()
  for (const task of project.tasks) {
    const phase = task.phase
    if (!tasksByPhase.has(phase)) tasksByPhase.set(phase, [])
    tasksByPhase.get(phase)!.push(task)
  }

  const phases = Object.keys(PHASE_CONFIG)
  const pendingChoices = project.choices.filter(c => !c.resolvedAt)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link href="/trailer-studio" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[#E50914] transition-colors mb-3">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au studio
          </Link>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            {project.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {project.genre && <Badge variant="outline" className="text-xs">{project.genre}</Badge>}
            {project.style && <Badge variant="outline" className="text-xs">{project.style}</Badge>}
            {project.mood && <Badge variant="outline" className="text-xs">{project.mood}</Badge>}
            {project.duration && (
              <Badge variant="outline" className="text-xs">
                {project.duration.replace('_', ' ').replace('TEASER', 'Teaser').replace('STANDARD', 'Standard').replace('EXTENDED', 'Étendu').replace('FULL', 'Complet')}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1.5 border-[#E50914]/20 text-[#E50914]">
            <Coins className="h-3.5 w-3.5 mr-1.5" />
            {project.creditsUsed}/{project.estimatedCredits} crédits
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">Progression globale</h2>
          <span className="text-sm font-bold text-[#E50914]">{Math.round(project.progressPct)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-500"
            style={{ width: `${project.progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-white/50">
          <span>{project.completedTasks}/{project.totalTasks} tâches terminées</span>
          <span>Phase: {PHASE_CONFIG[project.currentPhase]?.label || project.currentPhase}</span>
        </div>
      </div>

      {/* Concept & Synopsis */}
      {(project.concept || project.synopsis) && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 space-y-4">
          {project.concept && (
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Concept</p>
              <p className="text-sm text-white mt-1">{project.concept}</p>
            </div>
          )}
          {project.synopsis && (
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Synopsis</p>
              <p className="text-sm text-white/60 mt-1 whitespace-pre-wrap">{project.synopsis}</p>
            </div>
          )}
        </div>
      )}

      {/* Client-side action buttons (decompose, start, delete, choices) */}
      <TrailerActions
        projectId={project.id}
        projectStatus={project.status}
        hasTasks={project.tasks.length > 0}
        pendingChoices={pendingChoices.map(c => ({
          id: c.id,
          question: c.question,
          category: c.category,
          isOpenToVote: c.isOpenToVote,
          options: c.options as Array<{ id: string; label: string; description?: string }>,
        }))}
      />

      {/* Tasks by Phase */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-white">Micro-tâches par phase</h2>

        {project.tasks.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Wand2 className="h-10 w-10 text-white/50 mx-auto mb-3" />
            <p className="text-sm text-white/50">Le projet n&apos;a pas encore été décomposé en micro-tâches</p>
            <p className="text-xs text-white/50 mt-1">Utilisez le bouton ci-dessus pour décomposer le projet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {phases.map((phase) => {
              const phaseTasks = tasksByPhase.get(phase)
              if (!phaseTasks || phaseTasks.length === 0) return null
              const phaseConfig = PHASE_CONFIG[phase]
              const PhaseIcon = phaseConfig.icon
              const completedInPhase = phaseTasks.filter(t => t.status === 'COMPLETED' || t.status === 'APPROVED' || t.status === 'SKIPPED').length
              const phaseProgress = (completedInPhase / phaseTasks.length) * 100

              return (
                <div key={phase} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  {/* Phase header */}
                  <div className="flex items-center gap-3 p-5 border-b border-white/10">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${phaseConfig.color}`}>
                      <PhaseIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">{phaseConfig.label}</h3>
                        <span className="text-xs text-white/50">{completedInPhase}/{phaseTasks.length}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-500"
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phase tasks */}
                  <div className="divide-y divide-white/10">
                    {phaseTasks.map((task) => {
                      const statusConfig = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.PENDING
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-4 px-5 hover:bg-white/[0.03]/50 transition-colors">
                          {task.status === 'COMPLETED' || task.status === 'APPROVED' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          ) : task.status === 'GENERATING' ? (
                            <Loader2 className="h-4 w-4 text-purple-500 animate-spin shrink-0" />
                          ) : task.status === 'BLOCKED' ? (
                            <Lock className="h-4 w-4 text-white/50 shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 text-white/50 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${
                              task.status === 'BLOCKED' ? 'text-white/50' : 'text-white'
                            }`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[10px] text-white/50 truncate mt-0.5">{task.description}</p>
                            )}
                          </div>
                          <Badge className={`text-[10px] px-1.5 py-0.5 border-0 ${statusConfig.color}`}>
                            {statusConfig.label}
                          </Badge>
                          {task.estimatedCredits > 0 && (
                            <span className="text-[10px] text-white/50 shrink-0">{task.estimatedCredits}cr</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
