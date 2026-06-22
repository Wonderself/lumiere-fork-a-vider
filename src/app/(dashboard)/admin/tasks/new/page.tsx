import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTaskAction } from '@/app/actions/admin'
import { TASK_TYPE_LABELS, DIFFICULTY_LABELS, PHASE_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Nouvelle Tâche' }

export default async function NewTaskPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const films = await prisma.film.findMany({
    orderBy: { title: 'asc' },
    include: { phases: { orderBy: { phaseOrder: 'asc' } } },
  })

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair">Nouvelle Tâche</h1>
        <p className="text-white/50">Créer une nouvelle tâche pour un film.</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <form action={createTaskAction} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" name="title" required placeholder="Ex : Storyboard Scène 3 — La Révélation" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filmId">Film *</Label>
            <select
              id="filmId"
              name="filmId"
              required
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-colors duration-300"
            >
              <option value="">Sélectionner un film</option>
              {films.map((film) => (
                <option key={film.id} value={film.id}>{film.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phaseId">Phase *</Label>
            <select
              id="phaseId"
              name="phaseId"
              required
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-colors duration-300"
            >
              <option value="">Sélectionner une phase</option>
              {films.flatMap((film) =>
                film.phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {film.title} — {PHASE_LABELS[phase.phaseName]}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <select
              id="type"
              name="type"
              required
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-colors duration-300"
            >
              {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulté</Label>
            <select
              id="difficulty"
              name="difficulty"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-colors duration-300"
            >
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceEuros">Prix (€)</Label>
            <select
              id="priceEuros"
              name="priceEuros"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
            >
              <option value="50">50 €</option>
              <option value="100">100 €</option>
              <option value="500">500 €</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut initial</Label>
            <select
              id="status"
              name="status"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
            >
              <option value="AVAILABLE">Disponible</option>
              <option value="LOCKED">Verrouillée</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredLevel">Niveau requis</Label>
            <select
              id="requiredLevel"
              name="requiredLevel"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
            >
              <option value="ROOKIE">Rookie</option>
              <option value="PRO">Pro</option>
              <option value="EXPERT">Expert</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionMd">Description *</Label>
          <textarea
            id="descriptionMd"
            name="descriptionMd"
            required
            rows={4}
            placeholder="Description de la tâche (markdown supporté)..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructionsMd">Instructions détaillées</Label>
          <textarea
            id="instructionsMd"
            name="instructionsMd"
            rows={5}
            placeholder="Instructions pas-à-pas pour le contributeur..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical transition-colors duration-300"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg">Créer la Tâche</Button>
          <Link href="/admin/tasks">
            <Button type="button" variant="outline" size="lg">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
