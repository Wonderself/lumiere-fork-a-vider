import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Film, Trash2, Plus } from 'lucide-react'
import { updateActorAction, assignCastRoleAction, removeCastRoleAction } from '@/app/actions/actors'
import { ACTOR_STYLE_LABELS, CAST_ROLE_LABELS } from '@/lib/constants'
import { NATIONALITIES, PERSONALITY_TRAITS } from '@/lib/actors'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Editer Acteur IA' }

type Props = { params: Promise<{ id: string }> }

const ROLE_COLORS: Record<string, string> = {
  LEAD: 'border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]',
  SUPPORTING: 'border-blue-400/30 bg-blue-400/10 text-blue-600',
  CAMEO: 'border-purple-400/30 bg-purple-400/10 text-purple-600',
  VOICE: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-600',
  NARRATOR: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-600',
}

export default async function EditActorPage({ params }: Props) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const { id } = await params

  const actor = await prisma.aIActor.findUnique({
    where: { id },
    include: {
      castRoles: {
        include: {
          film: { select: { id: true, title: true, slug: true } },
          catalogFilm: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!actor) notFound()

  // Get all films and catalog films for the cast role assignment
  const [films, catalogFilms] = await Promise.all([
    prisma.film.findMany({
      select: { id: true, title: true, slug: true },
      orderBy: { title: 'asc' },
    }),
    prisma.catalogFilm.findMany({
      select: { id: true, title: true, slug: true },
      orderBy: { title: 'asc' },
    }),
  ])

  return (
    <div className="p-8 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/actors" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour aux acteurs
        </Link>
        <h1 className="text-3xl font-bold font-playfair">
          Editer : {actor.name}
        </h1>
        <p className="text-white/50">Modifiez les informations de cet acteur IA.</p>
      </div>

      {/* Edit Form */}
      <form action={updateActorAction} className="space-y-8">
        <input type="hidden" name="id" value={actor.id} />

        {/* Identity Section */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#E50914] font-playfair">
            Identite
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" name="name" required defaultValue={actor.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationalite</Label>
              <select
                id="nationality"
                name="nationality"
                defaultValue={actor.nationality || ''}
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
                defaultValue={actor.style}
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
              >
                {Object.entries(ACTOR_STYLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthYear">Annee de naissance</Label>
              <Input id="birthYear" name="birthYear" type="number" defaultValue={actor.birthYear || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debutYear">Annee de debut</Label>
              <Input id="debutYear" name="debutYear" type="number" defaultValue={actor.debutYear || ''} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked={actor.isActive}
              className="rounded"
            />
            <Label htmlFor="isActive">Acteur actif (visible publiquement)</Label>
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
              defaultValue={actor.bio || ''}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Citation signature</Label>
            <Input id="quote" name="quote" defaultValue={actor.quote || ''} />
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
              defaultValue={actor.personalityTraits.join(', ')}
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
              defaultValue={actor.funFacts.join('\n')}
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
              <Input id="avatarUrl" name="avatarUrl" type="url" defaultValue={actor.avatarUrl || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverUrl">URL Couverture</Label>
              <Input id="coverUrl" name="coverUrl" type="url" defaultValue={actor.coverUrl || ''} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="socialFollowers">Nombre de fans</Label>
              <Input id="socialFollowers" name="socialFollowers" type="number" defaultValue={actor.socialFollowers} />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg">
            Sauvegarder
          </Button>
          <Link href="/admin/actors">
            <Button type="button" variant="outline" size="lg">
              Annuler
            </Button>
          </Link>
        </div>
      </form>

      {/* ─── Cast Roles Section ─────────────────────────────────── */}
      <section className="rounded-2xl border border-[#E50914]/10 bg-white/[0.02] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#E50914] flex items-center gap-2 font-playfair">
            <Film className="h-5 w-5" />
            Roles dans les films ({actor.castRoles.length})
          </h2>
        </div>

        {/* Current Cast Roles */}
        {actor.castRoles.length > 0 ? (
          <div className="space-y-2">
            {actor.castRoles.map((role: any) => {
              const filmTitle = role.film?.title || role.catalogFilm?.title || 'Film inconnu'
              const filmType = role.film ? 'Production' : 'Catalogue'
              return (
                <div
                  key={role.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-white/10 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm text-white truncate">{filmTitle}</span>
                      <Badge variant="secondary" className="text-[10px]">{filmType}</Badge>
                      <Badge className={`text-[10px] ${ROLE_COLORS[role.role] || ROLE_COLORS.SUPPORTING}`}>
                        {CAST_ROLE_LABELS[role.role as keyof typeof CAST_ROLE_LABELS]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>Personnage : <span className="text-white/60">{role.characterName}</span></span>
                      {role.description && <span>| {role.description}</span>}
                    </div>
                  </div>
                  <form action={removeCastRoleAction}>
                    <input type="hidden" name="castRoleId" value={role.id} />
                    <input type="hidden" name="actorId" value={actor.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-white/20">
            <Film className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun role attribue</p>
          </div>
        )}

        {/* Add New Cast Role */}
        <div className="border-t border-white/[0.06] pt-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un role
          </h3>
          <form action={assignCastRoleAction} className="space-y-4">
            <input type="hidden" name="actorId" value={actor.id} />

            <div className="grid grid-cols-2 gap-4">
              {/* Film (production) */}
              <div className="space-y-2">
                <Label htmlFor="filmId">Film (production)</Label>
                <select
                  id="filmId"
                  name="filmId"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                >
                  <option value="">-- Aucun --</option>
                  {films.map((f) => (
                    <option key={f.id} value={f.id}>{f.title}</option>
                  ))}
                </select>
              </div>

              {/* CatalogFilm */}
              <div className="space-y-2">
                <Label htmlFor="catalogFilmId">Film (catalogue)</Label>
                <select
                  id="catalogFilmId"
                  name="catalogFilmId"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                >
                  <option value="">-- Aucun --</option>
                  {catalogFilms.map((f) => (
                    <option key={f.id} value={f.id}>{f.title}</option>
                  ))}
                </select>
              </div>

              {/* Character Name */}
              <div className="space-y-2">
                <Label htmlFor="characterName">Nom du personnage *</Label>
                <Input id="characterName" name="characterName" required placeholder="Ex : Marcus Vale" />
              </div>

              {/* Role Type */}
              <div className="space-y-2">
                <Label htmlFor="role">Type de role</Label>
                <select
                  id="role"
                  name="role"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                >
                  {Object.entries(CAST_ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description du role</Label>
                <Input id="description" name="description" placeholder="Un detective au passe trouble..." />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter le role
              </Button>
            </div>

            <p className="text-xs text-white/25">
              Selectionnez soit un film de production, soit un film du catalogue (pas les deux).
              Le nom du personnage est obligatoire.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
