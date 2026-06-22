'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sparkles, Film, Palette, Music, Clock, Users, Wand2, ChevronRight,
} from 'lucide-react'
import { createTrailerProjectAction } from '@/app/actions/trailer'

const GENRES = [
  'Science-Fiction', 'Action', 'Drame', 'Horreur', 'Comédie',
  'Thriller', 'Romance', 'Animation', 'Documentaire', 'Musical',
  'Fantaisie', 'Historique', 'Biblique', 'Policier', 'Aventure',
]

const STYLES = [
  'Cinématique', 'Anime', 'Film Noir', 'Documentaire', 'Rétro/Vintage',
  'Futuriste', 'Réaliste', 'Expressionniste', 'Minimaliste', 'Épique',
]

const MOODS = [
  'Épique', 'Sombre', 'Drôle', 'Émotionnel', 'Mystérieux',
  'Suspense', 'Joyeux', 'Mélancolique', 'Intense', 'Poétique',
]

const DURATIONS = [
  { value: 'TEASER_15S', label: 'Teaser 15s', desc: 'Ultra-court, impact maximum' },
  { value: 'TEASER_30S', label: 'Teaser 30s', desc: 'Aperçu rapide et percutant' },
  { value: 'STANDARD_60S', label: 'Standard 60s', desc: 'Format classique' },
  { value: 'EXTENDED_90S', label: 'Étendu 90s', desc: 'Plus de détails narratifs' },
  { value: 'FULL_120S', label: 'Complet 2min', desc: 'Bande-annonce complète' },
]

export function NewTrailerForm() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(createTrailerProjectAction, null)
  const [genre, setGenre] = useState('')
  const [style, setStyle] = useState('')
  const [mood, setMood] = useState('')
  const [duration, setDuration] = useState('STANDARD_60S')
  const [communityVote, setCommunityVote] = useState(false)

  useEffect(() => {
    if (state?.success && state?.projectId) {
      router.push(`/trailer-studio/${state.projectId}`)
    }
  }, [state?.success, state?.projectId, router])

  return (
    <form action={action} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="genre" value={genre} />
      <input type="hidden" name="style" value={style} />
      <input type="hidden" name="mood" value={mood} />
      <input type="hidden" name="duration" value={duration} />
      <input type="hidden" name="communityVoteEnabled" value={communityVote ? 'true' : 'false'} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-[#E50914]/10 flex items-center justify-center">
            <Film className="h-4 w-4 text-[#E50914]" />
          </div>
          <h2 className="text-base font-semibold text-white">Identité du projet</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-white/80">Titre du projet *</Label>
          <Input
            id="title"
            name="title"
            required
            minLength={3}
            placeholder="Ex: Les Derniers Gardiens — Bande-Annonce"
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="concept" className="text-sm font-medium text-white/80">Concept / Logline</Label>
          <textarea
            id="concept"
            name="concept"
            rows={2}
            placeholder="En une phrase, de quoi parle votre film ?"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-[#E50914]/40 focus:ring-[#E50914]/20 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="synopsis" className="text-sm font-medium text-white/80">Synopsis détaillé</Label>
          <textarea
            id="synopsis"
            name="synopsis"
            rows={4}
            placeholder="Décrivez l'histoire, les personnages principaux, les enjeux..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-[#E50914]/40 focus:ring-[#E50914]/20 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Creative Direction */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Palette className="h-4 w-4 text-purple-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Direction créative</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Genre */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choisir un genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">Style visuel</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choisir un style" />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Music className="h-3.5 w-3.5 text-white/50" />
            Ambiance / Mood
          </Label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                  mood === m
                    ? 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914] scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-white/50 hover:border-white/15 hover:text-white/80'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label htmlFor="targetAudience" className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-white/50" />
            Public cible
          </Label>
          <Input
            id="targetAudience"
            name="targetAudience"
            placeholder="Ex: Jeunes adultes 18-35, fans de sci-fi"
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Duration */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Durée</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDuration(d.value)}
              className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                duration === d.value
                  ? 'border-[#E50914] bg-[#E50914]/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                  : 'border-white/10 hover:border-white/15'
              }`}
            >
              <p className={`text-sm font-semibold ${duration === d.value ? 'text-[#E50914]' : 'text-white'}`}>
                {d.label}
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Community Vote Option */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Vote communautaire</h2>
              <p className="text-xs text-white/50 mt-0.5">
                Laissez la communauté voter sur certains choix créatifs (acteurs, décors, musique...)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCommunityVote(!communityVote)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
              communityVote ? 'bg-[#E50914]' : 'bg-white/[0.08]'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-200 ${
              communityVote ? 'translate-x-5' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-white/50">
          L&apos;IA décomposera votre projet en ~30 micro-tâches après création
        </p>
        <Button
          type="submit"
          size="lg"
          className="bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-md px-8"
          loading={isPending}
        >
          {isPending ? 'Création...' : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Créer le projet
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
