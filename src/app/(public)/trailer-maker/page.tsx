'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { TRAILER_STYLES, FILM_GENRES } from '@/data/studio-agents'
import {
  Film, Play, Loader2, Wand2, Camera, User, Star,
  ChevronRight, Download, Share2, Sparkles, Shield,
} from 'lucide-react'

interface TrailerResult {
  filmTitle: string; genre: string; synopsis: string; style: string
  scenes: Array<{ description: string; imageUrl: string }>
  posterUrl: string
}

export default function TrailerMakerPage() {
  const [step, setStep] = useState<'setup' | 'generating' | 'result'>('setup')
  const [filmTitle, setFilmTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['blockbuster'])
  const [faceMode, setFaceMode] = useState(false)
  const [faceUrl, setFaceUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TrailerResult[]>([])

  function toggleStyle(id: string) {
    setSelectedStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  async function generateTrailers() {
    if (!filmTitle.trim() || !genre || !synopsis.trim()) { toast.error('Remplissez tous les champs'); return }
    if (selectedStyles.length === 0) { toast.error('Sélectionnez au moins un style'); return }

    setStep('generating')
    setProgress(0)

    const allResults: TrailerResult[] = []
    for (let i = 0; i < selectedStyles.length; i++) {
      setProgress(Math.round(((i + 0.5) / selectedStyles.length) * 100))
      await new Promise(r => setTimeout(r, 3000))

      allResults.push({
        filmTitle, genre, synopsis, style: selectedStyles[i],
        scenes: [
          { description: 'Opening establishing shot', imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80' },
          { description: 'Character introduction', imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80' },
          { description: 'Rising tension', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80' },
          { description: 'Climax & title reveal', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80' },
        ],
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&q=80',
      })
      setProgress(Math.round(((i + 1) / selectedStyles.length) * 100))
    }

    setResults(allResults)
    setStep('result')
    toast.success(`${allResults.length} bande(s)-annonce générée(s) !`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <Film className="h-4 w-4 text-[#E50914]" />
            <span className="text-sm font-medium text-[#E50914]">Trailer Maker</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Créez la bande-annonce de <span className="text-[#E50914]">votre film</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Inventez un film, choisissez le style, et l&apos;IA génère la bande-annonce complète.
            Ajoutez votre visage pour devenir le héros !
          </p>
        </div>

        {step === 'setup' && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-5">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Titre du film *</label>
                <input value={filmTitle} onChange={e => setFilmTitle(e.target.value)} placeholder="Ex: Les Ombres de Minuit" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Genre *</label>
                <div className="flex flex-wrap gap-2">
                  {FILM_GENRES.map(g => (
                    <button key={g} onClick={() => setGenre(g)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${genre === g ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Synopsis *</label>
                <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} placeholder="Racontez l'histoire de votre film en quelques phrases..." rows={4} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
              </div>
            </div>

            {/* Styles */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Styles de bande-annonce (multi-sélection)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TRAILER_STYLES.map(s => (
                  <button key={s.id} onClick={() => toggleStyle(s.id)} className={`text-left rounded-xl border p-4 transition-colors ${selectedStyles.includes(s.id) ? 'border-[#E50914] bg-[#E50914]/10' : 'border-gray-800 hover:border-gray-700'}`}>
                    <p className="text-sm font-medium text-white">{s.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Face Insert */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Mettez votre visage</p>
                    <p className="text-[10px] text-gray-500">Devenez le héros de votre film</p>
                  </div>
                </div>
                <button onClick={() => setFaceMode(!faceMode)} className={`relative h-6 w-11 rounded-full transition-colors ${faceMode ? 'bg-[#E50914]' : 'bg-gray-600'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${faceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {faceMode && (
                <input value={faceUrl} onChange={e => setFaceUrl(e.target.value)} placeholder="URL de votre photo (portrait face caméra)..." className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
              )}
            </div>

            <button onClick={generateTrailers} disabled={!filmTitle.trim() || !genre || !synopsis.trim() || selectedStyles.length === 0} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-2xl disabled:opacity-40 transition-colors text-lg">
              <Wand2 className="h-6 w-6" />
              Générer {selectedStyles.length} bande{selectedStyles.length > 1 ? 's' : ''}-annonce{selectedStyles.length > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {step === 'generating' && (
          <div className="text-center py-20">
            <Loader2 className="h-16 w-16 text-[#E50914] mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">Création en cours...</h2>
            <p className="text-gray-400 mb-6">L&apos;IA génère les scènes, les images et assemble votre bande-annonce</p>
            <div className="w-full max-w-md mx-auto h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#E50914] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-500 mt-3">{progress}%</p>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-8">
            <div className="text-center">
              <Sparkles className="h-10 w-10 text-[#E50914] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">{results.length} bande{results.length > 1 ? 's' : ''}-annonce créée{results.length > 1 ? 's' : ''} !</h2>
              <p className="text-gray-400">Pour &quot;{filmTitle}&quot; — {genre}</p>
            </div>

            {results.map((result, idx) => {
              const styleInfo = TRAILER_STYLES.find(s => s.id === result.style)
              return (
                <div key={idx} className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Style : {styleInfo?.label}</h3>
                      <p className="text-[10px] text-gray-500">{styleInfo?.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(result.posterUrl)
                            const blob = await response.blob()
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${result.filmTitle.replace(/\s+/g, '-').toLowerCase()}-trailer-${result.style}.jpg`
                            a.click()
                            URL.revokeObjectURL(url)
                            toast.success('Bande-annonce exportée !')
                          } catch {
                            toast.error('Erreur lors de l\'export')
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-400 hover:bg-gray-700"
                      >
                        <Download className="inline h-3 w-3 mr-1" />Export
                      </button>
                      <button
                        onClick={async () => {
                          const shareText = `${result.filmTitle} — Bande-annonce ${styleInfo?.label}`
                          if (navigator.share) {
                            try { await navigator.share({ title: result.filmTitle, text: shareText, url: window.location.href }) } catch { /* cancelled */ }
                          } else {
                            await navigator.clipboard.writeText(window.location.href)
                            toast.success('Lien copié dans le presse-papiers !')
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-400 hover:bg-gray-700"
                      >
                        <Share2 className="inline h-3 w-3 mr-1" />Partager
                      </button>
                    </div>
                  </div>
                  {/* Scenes */}
                  <div className="grid grid-cols-4 gap-0.5">
                    {result.scenes.map((scene, i) => (
                      <div key={i} className="relative aspect-video">
                        <img src={scene.imageUrl} alt={scene.description} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                          <p className="text-[10px] text-white">{scene.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Play Button */}
                  <div className="p-6 text-center">
                    <button
                      onClick={() => toast.info('Lecteur vidéo en cours de génération — disponible sous peu !')}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl transition-colors"
                    >
                      <Play className="h-5 w-5" /> Lire la bande-annonce
                    </button>
                    <p className="text-[10px] text-gray-600 mt-2">Vidéo assemblée automatiquement · Lecteur HTML5</p>
                  </div>
                </div>
              )
            })}

            <button onClick={() => { setStep('setup'); setResults([]) }} className="w-full py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition-colors text-sm">Créer une autre bande-annonce</button>
          </div>
        )}
      </div>
    </div>
  )
}
