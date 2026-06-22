import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFilmAction } from '@/app/actions/admin'
import { GENRES, CATALOG_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Nouveau Film' }

export default async function NewFilmPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair">Nouveau Film</h1>
        <p className="text-white/50">Créez un nouveau projet de film sur la plateforme.</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <form action={createFilmAction} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" name="title" required placeholder="Ex : Exodus — La Traversée" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <select
              id="genre"
              name="genre"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-colors duration-300"
            >
              <option value="">Sélectionner un genre</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="catalog">Catalogue</Label>
            <select
              id="catalog"
              name="catalog"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-colors duration-300"
            >
              {Object.entries(CATALOG_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description courte</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Description affichée dans le catalogue..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="synopsis">Synopsis complet</Label>
          <textarea
            id="synopsis"
            name="synopsis"
            rows={5}
            placeholder="Synopsis détaillé du film..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical transition-colors duration-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">URL Image de Couverture</Label>
            <Input id="coverImageUrl" name="coverImageUrl" type="url" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Budget Estimé (€)</Label>
            <Input id="estimatedBudget" name="estimatedBudget" type="number" placeholder="10000" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="isPublic" name="isPublic" value="true" className="rounded" />
          <Label htmlFor="isPublic">Rendre ce film public</Label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg">Créer le Film</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => history.back()}>Annuler</Button>
        </div>
      </form>
    </div>
  )
}
