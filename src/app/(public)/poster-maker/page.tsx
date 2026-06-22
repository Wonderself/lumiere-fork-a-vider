'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PHOTO_STYLES, FILM_GENRES } from '@/data/studio-agents'
import {
  Image, Wand2, Loader2, Download, Share2, User,
  Sparkles, Shield, Star, RefreshCcw,
} from 'lucide-react'

interface PosterResult {
  title: string; genre: string; tagline: string; style: string
  url: string; withFace: boolean
}

const POSTER_RATIOS = [
  { id: '2:3', label: '2:3 Affiche', w: 800, h: 1200 },
  { id: '9:16', label: '9:16 Story', w: 720, h: 1280 },
  { id: '1:1', label: '1:1 Carré', w: 1024, h: 1024 },
]

export default function PosterMakerPage() {
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [tagline, setTagline] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [ratio, setRatio] = useState('2:3')
  const [faceMode, setFaceMode] = useState(false)
  const [faceUrl, setFaceUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [posters, setPosters] = useState<PosterResult[]>([])

  async function generate() {
    if (!title.trim() || !genre) { toast.error('Titre et genre requis'); return }
    setGenerating(true)
    await new Promise(r => setTimeout(r, 3000))

    const placeholders = [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=900&q=80',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&h=900&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&h=900&q=80',
    ]

    const poster: PosterResult = {
      title, genre, tagline: tagline || `Un film ${genre.toLowerCase()} qui va vous surprendre`,
      style, url: placeholders[Math.floor(Math.random() * placeholders.length)],
      withFace: faceMode && !!faceUrl,
    }
    setPosters(prev => [poster, ...prev])
    setGenerating(false)
    toast.success('Affiche générée par Affichiste IA !')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <Image className="h-4 w-4 text-[#E50914]" />
            <span className="text-sm font-medium text-[#E50914]">Poster Maker</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Créez votre <span className="text-[#E50914]">affiche de film</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Inventez un film et l&apos;IA crée l&apos;affiche professionnelle.
            Ajoutez votre visage pour devenir la star !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-5">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Titre du film *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Éclipse Fatale" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Genre *</label>
                <div className="flex flex-wrap gap-1.5">
                  {FILM_GENRES.slice(0, 12).map(g => (
                    <button key={g} onClick={() => setGenre(g)} className={`px-3 py-1 rounded-lg text-xs ${genre === g ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Tagline</label>
                <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Ex: La vérité a un prix..." className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
              </div>
            </div>

            {/* Style + Ratio */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-2 block">Style</label>
                <div className="flex flex-wrap gap-1.5">
                  {PHOTO_STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)} className={`px-3 py-1.5 rounded-lg text-xs ${style === s.id ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{s.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Format</label>
                <div className="flex gap-1.5">
                  {POSTER_RATIOS.map(r => (
                    <button key={r.id} onClick={() => setRatio(r.id)} className={`px-3 py-1.5 rounded-lg text-xs ${ratio === r.id ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{r.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Face Insert */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Votre visage sur l&apos;affiche</span>
                </div>
                <button onClick={() => setFaceMode(!faceMode)} className={`relative h-6 w-11 rounded-full ${faceMode ? 'bg-[#E50914]' : 'bg-gray-600'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${faceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {faceMode && (
                <input value={faceUrl} onChange={e => setFaceUrl(e.target.value)} placeholder="URL photo portrait..." className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
              )}
            </div>

            <button onClick={generate} disabled={generating || !title.trim() || !genre} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-40 transition-colors">
              {generating ? <><Loader2 className="h-5 w-5 animate-spin" />Génération...</> : <><Wand2 className="h-5 w-5" />Créer l&apos;affiche</>}
            </button>

            <p className="text-[10px] text-emerald-400 text-center">0% commission — ~1.5 crédits par affiche</p>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4">
              {posters.length > 0 ? `${posters.length} affiche(s) créée(s)` : 'Aperçu'}
            </h3>
            {posters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/30 aspect-[2/3] flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Votre affiche apparaîtra ici</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {posters.map((poster, i) => (
                  <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                    <div className="relative">
                      <img src={poster.url} alt={poster.title} className="w-full" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                        <p className="text-2xl font-black text-white tracking-tight">{poster.title}</p>
                        <p className="text-sm text-gray-300 italic mt-1">{poster.tagline}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E50914]/80 text-white">{poster.genre}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">{poster.style}</span>
                          {poster.withFace && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/80 text-white">Face</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 p-3">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(poster.url)
                            const blob = await response.blob()
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${poster.title.replace(/\s+/g, '-').toLowerCase()}-poster.jpg`
                            a.click()
                            URL.revokeObjectURL(url)
                            toast.success('Affiche téléchargée !')
                          } catch {
                            toast.error('Erreur lors du téléchargement')
                          }
                        }}
                        className="flex-1 py-2 text-xs bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700"
                      >
                        <Download className="inline h-3 w-3 mr-1" />Télécharger
                      </button>
                      <button
                        onClick={async () => {
                          const shareData = { title: poster.title, text: poster.tagline, url: poster.url }
                          if (navigator.share) {
                            try { await navigator.share(shareData) } catch { /* cancelled */ }
                          } else {
                            await navigator.clipboard.writeText(poster.url)
                            toast.success('Lien copié dans le presse-papiers !')
                          }
                        }}
                        className="flex-1 py-2 text-xs bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700"
                      >
                        <Share2 className="inline h-3 w-3 mr-1" />Partager
                      </button>
                      <button onClick={generate} className="py-2 px-3 text-xs bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700"><RefreshCcw className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
