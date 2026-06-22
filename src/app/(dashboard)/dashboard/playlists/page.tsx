'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import {
  ListVideo, Plus, Trash2, X, Film, Globe, Lock,
  ArrowRight, Loader2, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  createPlaylistAction,
  deletePlaylistAction,
  getUserPlaylistsAction,
  getPlaylistAction,
  removeFromPlaylistAction,
  updatePlaylistAction,
} from '@/app/actions/playlists'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlaylistSummary = {
  id: string
  userId: string
  title: string
  description: string | null
  isPublic: boolean
  coverUrl: string | null
  createdAt: string
  updatedAt: string
  _count: { items: number }
}

type PlaylistItem = {
  id: string
  filmId: string
  sortOrder: number
  addedAt: string
  film: { title: string; slug: string; genre: string | null; thumbnailUrl: string | null }
}

type PlaylistDetail = {
  id: string
  userId: string
  title: string
  description: string | null
  isPublic: boolean
  coverUrl: string | null
  createdAt: string
  updatedAt: string
  items: PlaylistItem[]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilmThumbnail({ item, onRemove, removing }: {
  item: PlaylistItem
  onRemove: (filmId: string) => void
  removing: boolean
}) {
  return (
    <div className="relative group aspect-[2/3] rounded-lg overflow-hidden border border-white/10 bg-white/5">
      {item.film.thumbnailUrl ? (
        <img
          src={item.film.thumbnailUrl}
          alt={item.film.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Film className="h-6 w-6 text-white/20" />
        </div>
      )}
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
        <p className="text-white text-[10px] font-medium text-center line-clamp-2 leading-tight">
          {item.film.title}
        </p>
        {item.film.genre && (
          <span className="text-white/50 text-[9px]">{item.film.genre}</span>
        )}
        <button
          onClick={() => onRemove(item.filmId)}
          disabled={removing}
          className="mt-1 p-1.5 rounded-full bg-[#E50914]/80 hover:bg-[#E50914] transition-colors disabled:opacity-50"
          title="Retirer de la playlist"
        >
          {removing ? (
            <Loader2 className="h-3 w-3 text-white animate-spin" />
          ) : (
            <X className="h-3 w-3 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}

function PlaylistCard({ playlist, onDelete, onToggleExpand, expanded }: {
  playlist: PlaylistSummary
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  expanded: boolean
}) {
  const [detail, setDetail] = useState<PlaylistDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [removingFilmId, setRemovingFilmId] = useState<string | null>(null)
  const [deleting, startDelete] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(playlist.isPublic)
  const [togglingVisibility, startToggle] = useTransition()

  useEffect(() => {
    if (expanded && !detail) {
      setLoadingDetail(true)
      getPlaylistAction(playlist.id)
        .then((res) => {
          if (res.playlist) setDetail(res.playlist)
          else setError(res.error ?? 'Erreur inconnue')
        })
        .finally(() => setLoadingDetail(false))
    }
  }, [expanded, playlist.id, detail])

  function handleDelete() {
    startDelete(async () => {
      const res = await deletePlaylistAction(playlist.id)
      if (res.error) setError(res.error)
      else onDelete(playlist.id)
    })
  }

  function handleRemoveFilm(filmId: string) {
    setRemovingFilmId(filmId)
    removeFromPlaylistAction(playlist.id, filmId).then((res) => {
      if (res.error) {
        setError(res.error)
      } else {
        setDetail((prev) =>
          prev ? { ...prev, items: prev.items.filter((i) => i.filmId !== filmId) } : prev
        )
      }
      setRemovingFilmId(null)
    })
  }

  function handleToggleVisibility() {
    startToggle(async () => {
      const next = !isPublic
      const res = await updatePlaylistAction(playlist.id, { isPublic: next })
      if (res.error) setError(res.error)
      else setIsPublic(next)
    })
  }

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base truncate">{playlist.title}</CardTitle>
              <Badge
                variant={isPublic ? 'success' : 'secondary'}
                className="text-[10px] shrink-0"
              >
                {isPublic ? (
                  <><Globe className="h-2.5 w-2.5 mr-1" />Public</>
                ) : (
                  <><Lock className="h-2.5 w-2.5 mr-1" />Privé</>
                )}
              </Badge>
            </div>
            {playlist.description && (
              <p className="text-white/50 text-xs mt-1 line-clamp-2">{playlist.description}</p>
            )}
            <p className="text-white/30 text-[10px] mt-1">
              {playlist._count.items} film{playlist._count.items !== 1 ? 's' : ''} ·{' '}
              Modifié le {new Date(playlist.updatedAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggleVisibility}
              disabled={togglingVisibility}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
              title={isPublic ? 'Rendre privé' : 'Rendre public'}
            >
              {togglingVisibility ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isPublic ? (
                <Globe className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-white/40 hover:text-[#E50914] hover:bg-[#E50914]/10 transition-colors"
              title="Supprimer la playlist"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => onToggleExpand(playlist.id)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
              title={expanded ? 'Réduire' : 'Voir les films'}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-2 text-[#E50914] text-xs">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto hover:text-white/70">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </CardHeader>

      {/* Expanded films grid */}
      {expanded && (
        <CardContent className="pt-0">
          <div className="border-t border-white/5 pt-4">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 text-[#E50914] animate-spin" />
              </div>
            ) : detail && detail.items.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {detail.items.map((item) => (
                  <FilmThumbnail
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFilm}
                    removing={removingFilmId === item.filmId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Film className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">Aucun film dans cette playlist.</p>
                <Link
                  href="/films"
                  className="inline-flex items-center gap-1 text-[#E50914] text-xs mt-2 hover:underline"
                >
                  Parcourir les films <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// ─── Create Playlist Form ────────────────────────────────────────────────────

function CreatePlaylistForm({ onCreated }: { onCreated: (p: PlaylistSummary) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await createPlaylistAction(title, description || undefined, isPublic)
      if (res.error) {
        setError(res.error)
        return
      }
      if (res.playlist) {
        onCreated({
          id: res.playlist.id,
          userId: '',
          title: res.playlist.title,
          description: res.playlist.description,
          isPublic: res.playlist.isPublic,
          coverUrl: res.playlist.coverUrl,
          createdAt: res.playlist.createdAt,
          updatedAt: res.playlist.createdAt,
          _count: { items: 0 },
        })
        setTitle('')
        setDescription('')
        setIsPublic(false)
        setOpen(false)
      }
    })
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Nouvelle playlist
      </Button>
    )
  }

  return (
    <div className="rounded-xl border border-[#E50914]/20 bg-[#E50914]/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Créer une playlist</h3>
        <button
          onClick={() => { setOpen(false); setError(null) }}
          className="text-white/40 hover:text-white/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-white/60 text-xs mb-1.5 block">
            Titre <span className="text-[#E50914]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ma playlist..."
            maxLength={100}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E50914]/50 focus:ring-1 focus:ring-[#E50914]/30 transition-colors"
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1.5 block">Description (optionnel)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Une courte description..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E50914]/50 focus:ring-1 focus:ring-[#E50914]/30 transition-colors resize-none"
          />
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={() => setIsPublic((v) => !v)}
            className={`w-9 h-5 rounded-full transition-colors relative ${isPublic ? 'bg-[#E50914]' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPublic ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </div>
          <span className="text-white/60 text-xs">
            {isPublic ? 'Playlist publique' : 'Playlist privée'}
          </span>
        </label>
        {error && (
          <div className="flex items-center gap-2 text-[#E50914] text-xs">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="submit"
            size="sm"
            loading={pending}
            disabled={!title.trim()}
          >
            Créer
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => { setOpen(false); setError(null) }}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    getUserPlaylistsAction()
      .then((res) => {
        if (res.error) setFetchError(res.error)
        else setPlaylists(res.playlists)
      })
      .finally(() => setLoading(false))
  }, [])

  function handleCreated(p: PlaylistSummary) {
    setPlaylists((prev) => [p, ...prev])
  }

  function handleDeleted(id: string) {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  function handleToggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 flex items-center justify-center">
              <ListVideo className="h-5 w-5 text-[#E50914]" />
            </div>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Mes Playlists
            </h1>
          </div>
          <p className="text-white/50 text-sm">
            Organisez vos films favoris en collections personnalisées.
          </p>
        </div>
        <CreatePlaylistForm onCreated={handleCreated} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-[#E50914] animate-spin" />
        </div>
      ) : fetchError ? (
        <div className="flex items-center gap-3 p-5 rounded-xl border border-[#E50914]/20 bg-[#E50914]/5">
          <AlertCircle className="h-5 w-5 text-[#E50914] shrink-0" />
          <p className="text-[#E50914] text-sm">{fetchError}</p>
        </div>
      ) : playlists.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <ListVideo className="h-9 w-9 text-white/20" />
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">Aucune playlist</h2>
          <p className="text-white/50 text-sm max-w-sm mb-8">
            Vous n'avez pas encore créé de playlist. Commencez par explorer les films
            et ajoutez vos préférés à une collection.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/films">
              <Button variant="outline" className="gap-2">
                <Film className="h-4 w-4" />
                Parcourir les films
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Playlist grid */
        <div className="space-y-4">
          <p className="text-white/40 text-xs">
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} ·{' '}
            {playlists.reduce((sum, p) => sum + p._count.items, 0)} film{playlists.reduce((s, p) => s + p._count.items, 0) !== 1 ? 's' : ''} au total
          </p>
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDeleted}
              onToggleExpand={handleToggleExpand}
              expanded={expandedId === playlist.id}
            />
          ))}

          {/* Browse CTA */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-white/40 text-sm">Envie d'ajouter des films ?</p>
            <Link href="/films">
              <Button variant="ghost" size="sm" className="gap-1.5 text-[#E50914] hover:text-[#E50914]">
                Parcourir le catalogue
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
