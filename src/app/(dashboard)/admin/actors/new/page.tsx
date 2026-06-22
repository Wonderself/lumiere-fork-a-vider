import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { createActorAction } from '@/app/actions/actors'
import { ACTOR_STYLE_LABELS } from '@/lib/constants'
import { NATIONALITIES, PERSONALITY_TRAITS } from '@/lib/actors'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Nouvel Acteur IA' }

export default async function NewActorPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="p-8 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/actors" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour aux acteurs
        </Link>
        <h1 className="text-3xl font-bold font-playfair">
          Nouvel Acteur IA
        </h1>
        <p className="text-white/50">Creez un nouveau talent virtuel pour la plateforme.</p>
      </div>

      <form action={createActorAction} className="space-y-8">
        {/* Identity Section */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#E50914] font-playfair">
            Identite
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" name="name" required placeholder="Ex : Elara Nova" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationalite</Label>
              <select
                id="nationality"
                name="nationality"
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
              >
                <option value="">Selectionner</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <select
                id="style"
                name="style"
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
              >
                {Object.entries(ACTOR_STYLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthYear">Annee de naissance</Label>
              <Input id="birthYear" name="birthYear" type="number" placeholder="2024" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debutYear">Annee de debut</Label>
              <Input id="debutYear" name="debutYear" type="number" placeholder="2025" />
            </div>
          </div>
        </section>

        {/* Bio & Quote Section */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#E50914] font-playfair">
            Biographie
          </h2>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              placeholder="L'histoire de cet acteur IA..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Citation signature</Label>
            <Input
              id="quote"
              name="quote"
              placeholder="Ex : Le cinema IA n'imite pas la realite, il en cree une nouvelle."
            />
          </div>
        </section>

        {/* Personality Section */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#E50914] font-playfair">
            Personnalite
          </h2>

          <div className="space-y-2">
            <Label htmlFor="personalityTraits">
              Traits de personnalite
              <span className="text-white/30 font-normal ml-2">(separes par des virgules)</span>
            </Label>
            <Input
              id="personalityTraits"
              name="personalityTraits"
              placeholder="Ex : Charismatique, Mysterieux, Passionne"
            />
            <p className="text-xs text-white/30">
              Suggestions : {PERSONALITY_TRAITS.slice(0, 8).join(', ')}...
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funFacts">
              Anecdotes
              <span className="text-white/30 font-normal ml-2">(une par ligne)</span>
            </Label>
            <textarea
              id="funFacts"
              name="funFacts"
              rows={4}
              placeholder="A refuse 3 roles avant d'accepter celui-ci&#10;Son regard a ete calibre sur 200 peintures"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical"
            />
          </div>
        </section>

        {/* Media Section */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#E50914] font-playfair">
            Media & Social
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">URL Avatar</Label>
              <Input id="avatarUrl" name="avatarUrl" type="url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverUrl">URL Couverture</Label>
              <Input id="coverUrl" name="coverUrl" type="url" placeholder="https://..." />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="socialFollowers">Nombre de fans</Label>
              <Input id="socialFollowers" name="socialFollowers" type="number" placeholder="10000" />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" size="lg">
            Creer l'Acteur
          </Button>
          <Link href="/admin/actors">
            <Button type="button" variant="outline" size="lg">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
