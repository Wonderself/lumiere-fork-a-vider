import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTaskAction, deleteTaskAction } from '@/app/actions/admin'
import { ArrowLeft, Trash2, Save } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Modifier Tâche' }

const TASK_TYPES = [
  'PROMPT_WRITING', 'IMAGE_GEN', 'VIDEO_REVIEW', 'STUNT_CAPTURE',
  'DANCE_CAPTURE', 'DIALOGUE_EDIT', 'COLOR_GRADE', 'SOUND_DESIGN',
  'CONTINUITY_CHECK', 'QA_REVIEW', 'CHARACTER_DESIGN', 'ENV_DESIGN',
  'MOTION_REF', 'COMPOSITING', 'TRANSLATION', 'SUBTITLE',
]

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT']
const LEVELS = ['ROOKIE', 'PRO', 'EXPERT', 'VIP']
const STATUSES = ['LOCKED', 'AVAILABLE', 'CLAIMED', 'SUBMITTED', 'AI_REVIEW', 'HUMAN_REVIEW', 'VALIDATED', 'REJECTED']

const typeLabels: Record<string, string> = {
  PROMPT_WRITING: 'Rédaction de Prompts',
  IMAGE_GEN: 'Génération d\'Images',
  VIDEO_REVIEW: 'Revue Vidéo',
  STUNT_CAPTURE: 'Capture Stunt',
  DANCE_CAPTURE: 'Capture Danse',
  DIALOGUE_EDIT: 'Édition Dialogues',
  COLOR_GRADE: 'Étalonnage',
  SOUND_DESIGN: 'Sound Design',
  CONTINUITY_CHECK: 'Vérification Continuité',
  QA_REVIEW: 'QA Review',
  CHARACTER_DESIGN: 'Design Personnage',
  ENV_DESIGN: 'Design Environnement',
  MOTION_REF: 'Référence Motion',
  COMPOSITING: 'Compositing',
  TRANSLATION: 'Traduction',
  SUBTITLE: 'Sous-titrage',
}

export default async function AdminTaskEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const { id } = await params

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      film: { select: { title: true } },
      phase: { select: { phaseName: true } },
      claimedBy: { select: { displayName: true, email: true } },
    },
  })

  if (!task) notFound()

  return (
    <div className="p-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tasks" className="text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-playfair">Modifier la Tâche</h1>
          <p className="text-sm text-white/40">
            {task.film.title} · Phase {task.phase.phaseName}
          </p>
        </div>
      </div>

      {/* Claimed by info */}
      {task.claimedBy && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 text-sm text-blue-600">
            Assignée à <strong>{task.claimedBy.displayName || task.claimedBy.email}</strong>
            {task.claimedAt && ` depuis le ${new Intl.DateTimeFormat('fr-FR').format(task.claimedAt)}`}
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <form action={updateTaskAction}>
        <input type="hidden" name="taskId" value={task.id} />

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" defaultValue={task.title} required />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="descriptionMd">Description (Markdown)</Label>
              <textarea
                id="descriptionMd"
                name="descriptionMd"
                defaultValue={task.descriptionMd}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 resize-y"
                required
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructionsMd">Instructions (Markdown)</Label>
              <textarea
                id="instructionsMd"
                name="instructionsMd"
                defaultValue={task.instructionsMd || ''}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 resize-y"
              />
            </div>

            {/* Grid: Type, Difficulty, Level, Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue={task.type}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {TASK_TYPES.map(t => (
                    <option key={t} value={t}>{typeLabels[t] || t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulté</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  defaultValue={task.difficulty}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {DIFFICULTIES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredLevel">Niveau requis</Label>
                <select
                  id="requiredLevel"
                  name="requiredLevel"
                  defaultValue={task.requiredLevel}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceEuros">Prix (€)</Label>
                <Input
                  id="priceEuros"
                  name="priceEuros"
                  type="number"
                  min="0"
                  step="10"
                  defaultValue={task.priceEuros}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                name="status"
                defaultValue={task.status}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Input Files URLs */}
            <div className="space-y-2">
              <Label htmlFor="inputFilesUrls">URLs fichiers d&apos;entrée (une par ligne)</Label>
              <textarea
                id="inputFilesUrls"
                name="inputFilesUrls"
                defaultValue={task.inputFilesUrls.join('\n')}
                rows={3}
                placeholder="https://example.com/file1.png&#10;https://example.com/file2.pdf"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 resize-y"
              />
            </div>

            {/* Info badges */}
            <div className="flex flex-wrap gap-3 text-xs text-white/40">
              <span>Tentative : {task.currentAttempt}/{task.maxAttempts}</span>
              {task.aiConfidenceScore !== null && (
                <span>Score IA : {task.aiConfidenceScore}%</span>
              )}
              {task.deadline && (
                <span>Deadline : {new Intl.DateTimeFormat('fr-FR').format(task.deadline)}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" /> Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-red-400 mb-3">Zone Dangereuse</h3>
          <form action={deleteTaskAction} className="flex items-center justify-between">
            <input type="hidden" name="taskId" value={task.id} />
            <p className="text-xs text-white/40">Supprimer définitivement cette tâche et toutes ses soumissions.</p>
            <Button type="submit" variant="outline" size="sm" className="text-red-400 border-red-500/20 hover:bg-red-500/10 gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
