import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { createBonusContentAction, deleteBonusContentAction } from '@/app/actions/bonus'
import { Badge } from '@/components/ui/badge'
import {
  Film,
  Mic2,
  Scissors,
  Laugh,
  Camera,
  Music,
  Video,
  Star,
  ImageIcon,
  Eye,
  Trash2,
  Plus,
  Sparkles,
  Crown,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const BONUS_TYPES = [
  'INTERVIEW',
  'DELETED_SCENE',
  'BLOOPER',
  'BTS',
  'DIRECTORS_COMMENTARY',
  'CONCEPT_ART',
  'SOUNDTRACK',
  'MAKING_OF',
  'AUDITION_TAPE',
] as const

const TYPE_LABELS: Record<string, string> = {
  INTERVIEW: 'Interview',
  DELETED_SCENE: 'Scene coupee',
  BLOOPER: 'Betisier',
  BTS: 'Coulisses',
  DIRECTORS_COMMENTARY: 'Commentaire',
  CONCEPT_ART: 'Concept Art',
  SOUNDTRACK: 'Bande-son',
  MAKING_OF: 'Making-of',
  AUDITION_TAPE: 'Audition',
}

const TYPE_COLORS: Record<string, string> = {
  INTERVIEW: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  DELETED_SCENE: 'bg-red-500/20 text-red-400 border-red-500/30',
  BLOOPER: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  BTS: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
  DIRECTORS_COMMENTARY: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  CONCEPT_ART: 'bg-pink-500/20 text-pink-600 border-pink-500/30',
  SOUNDTRACK: 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30',
  MAKING_OF: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  AUDITION_TAPE: 'bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30',
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  INTERVIEW: Mic2,
  DELETED_SCENE: Scissors,
  BLOOPER: Laugh,
  BTS: Camera,
  DIRECTORS_COMMENTARY: Film,
  CONCEPT_ART: ImageIcon,
  SOUNDTRACK: Music,
  MAKING_OF: Video,
  AUDITION_TAPE: Star,
}

export default async function AdminBonusContentPage(props: { searchParams: Promise<{ type?: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const searchParams = await props.searchParams
  const filterType = searchParams.type

  // Fetch bonus content
  const bonusItems = await prisma.bonusContent.findMany({
    where: filterType ? { type: filterType as never } : undefined,
    include: {
      film: { select: { id: true, title: true } },
      catalogFilm: { select: { id: true, title: true } },
      actor: { select: { id: true, name: true } },
    },
    orderBy: [{ createdAt: 'desc' }],
  })

  // Stats
  const totalItems = await prisma.bonusContent.count()
  const premiumCount = await prisma.bonusContent.count({ where: { isPremium: true } })
  const totalViews = await prisma.bonusContent.aggregate({ _sum: { viewCount: true } })

  // Data for the create form
  const films = await prisma.film.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })
  const catalogFilms = await prisma.catalogFilm.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })
  const actors = await prisma.aIActor.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Bonus Content
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Gerez le contenu bonus associe aux films et acteurs IA.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E50914]/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#E50914]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalItems}</p>
              <p className="text-white/50 text-xs">Total bonus</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{premiumCount}</p>
              <p className="text-white/50 text-xs">Premium</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{(totalViews._sum.viewCount || 0).toLocaleString()}</p>
              <p className="text-white/50 text-xs">Vues totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-[#E50914]" />
          Ajouter un bonus
        </h2>
        <form action={createBonusContentAction} className="space-y-4">
          {/* Target Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Film Studio</label>
              <select
                name="filmId"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              >
                <option value="">-- Aucun --</option>
                {films.map((f) => (
                  <option key={f.id} value={f.id}>{f.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Film Catalogue</label>
              <select
                name="catalogFilmId"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              >
                <option value="">-- Aucun --</option>
                {catalogFilms.map((f) => (
                  <option key={f.id} value={f.id}>{f.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Acteur IA</label>
              <select
                name="actorId"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              >
                <option value="">-- Aucun --</option>
                {actors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Type *</label>
              <select
                name="type"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              >
                {BONUS_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Titre *</label>
              <input
                name="title"
                required
                placeholder="Titre du contenu bonus"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Description optionnelle..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 resize-none"
            />
          </div>

          {/* URLs + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">URL Contenu</label>
              <input
                name="contentUrl"
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">URL Miniature</label>
              <input
                name="thumbnailUrl"
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Duree (sec)</label>
              <input
                name="duration"
                type="number"
                min="0"
                placeholder="300"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              />
            </div>
          </div>

          {/* Premium + Sort Order + Submit */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="isPremium"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#E50914] focus:ring-[#E50914]/50"
              />
              <span className="text-sm text-white/60">Premium</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-white/50">Ordre :</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]/50"
              />
            </div>
            <button
              type="submit"
              className="ml-auto px-5 py-2 bg-[#E50914] text-white rounded-lg text-sm font-medium hover:bg-[#E50914]/90 transition-colors"
            >
              Creer
            </button>
          </div>
        </form>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 flex-wrap">
        <a
          href="/admin/bonus-content"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !filterType
              ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
              : 'bg-white/5 text-white/40 hover:text-white/60 border border-white/10'
          }`}
        >
          Tous ({totalItems})
        </a>
        {BONUS_TYPES.map((t) => (
          <a
            key={t}
            href={`/admin/bonus-content?type=${t}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === t
                ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                : 'bg-white/5 text-white/40 hover:text-white/60 border border-white/10'
            }`}
          >
            {TYPE_LABELS[t]}
          </a>
        ))}
      </div>

      {/* Bonus List */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        {bonusItems.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Aucun contenu bonus{filterType ? ` de type "${TYPE_LABELS[filterType]}"` : ''}.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {bonusItems.map((item) => {
              const TypeIcon = TYPE_ICONS[item.type] || Film
              const typeColor = TYPE_COLORS[item.type] || 'bg-white/10 text-white/50 border-white/20'

              // Determine linked entity
              let linkedEntity = ''
              if (item.film) linkedEntity = `Film: ${item.film.title}`
              else if (item.catalogFilm) linkedEntity = `Catalogue: ${item.catalogFilm.title}`
              else if (item.actor) linkedEntity = `Acteur: ${item.actor.name}`

              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  {/* Icon */}
                  <div className="shrink-0 h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <TypeIcon className="h-5 w-5 text-white/40" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
                      {item.isPremium && (
                        <Badge className="text-[9px] bg-[#E50914] text-white border-none px-1.5 py-0 shrink-0">
                          PREMIUM
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                      <Badge className={`text-[9px] px-1.5 py-0 h-4 border ${typeColor}`}>
                        {TYPE_LABELS[item.type] || item.type}
                      </Badge>
                      {linkedEntity && <span>{linkedEntity}</span>}
                      {item.duration && (
                        <span>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="shrink-0 flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white/60 flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> {item.viewCount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-white/40">Ordre: {item.sortOrder}</p>
                    </div>

                    {/* Delete */}
                    <form action={deleteBonusContentAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="h-8 w-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
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
