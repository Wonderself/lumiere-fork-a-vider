'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Camera, Video, Image, Loader2, Download, Trash2,
  Maximize2, Film, Wand2, Grid3X3, Clock, Eye,
} from 'lucide-react'

interface GeneratedMedia {
  id: string
  type: 'photo' | 'video'
  prompt: string
  style: string
  url: string
  ratio: string
  createdAt: Date
}

const PHOTO_STYLES = [
  { id: 'cinematic', label: 'Cinématique', desc: 'Éclairage cinéma, profondeur de champ' },
  { id: 'noir', label: 'Film Noir', desc: 'Noir et blanc, contrastes forts' },
  { id: 'scifi', label: 'Sci-Fi', desc: 'Futuriste, néons, atmosphérique' },
  { id: 'documentary', label: 'Documentaire', desc: 'Réaliste, naturel, authenticité' },
  { id: 'animated', label: 'Animation', desc: 'Style animé, couleurs vives' },
]

const RATIOS = [
  { id: '1:1', label: '1:1', desc: 'Carré', w: 1024, h: 1024 },
  { id: '16:9', label: '16:9', desc: 'Cinéma', w: 1280, h: 720 },
  { id: '9:16', label: '9:16', desc: 'Portrait', w: 720, h: 1280 },
  { id: '4:3', label: '4:3', desc: 'Classique', w: 1024, h: 768 },
]

const VIDEO_DURATIONS = [
  { id: '3s', label: '3 secondes', desc: 'Clip rapide' },
  { id: '5s', label: '5 secondes', desc: 'Standard' },
  { id: '10s', label: '10 secondes', desc: 'Étendu' },
]

export default function MyStudioPage() {
  const [tab, setTab] = useState<'photo' | 'video' | 'gallery'>('photo')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [ratio, setRatio] = useState('16:9')
  const [hdMode, setHdMode] = useState(false)
  const [duration, setDuration] = useState('5s')
  const [generating, setGenerating] = useState(false)
  const [gallery, setGallery] = useState<GeneratedMedia[]>([])
  const [previewItem, setPreviewItem] = useState<GeneratedMedia | null>(null)

  async function generatePhoto() {
    if (!prompt.trim()) { toast.error('Décrivez l\'image à générer'); return }
    setGenerating(true)

    await new Promise(r => setTimeout(r, 3000))

    const item: GeneratedMedia = {
      id: `img-${Date.now()}`,
      type: 'photo',
      prompt: prompt.trim(),
      style,
      url: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80`,
      ratio,
      createdAt: new Date(),
    }
    setGallery(prev => [item, ...prev])
    setGenerating(false)
    toast.success('Image générée')
  }

  async function generateVideo() {
    if (!prompt.trim()) { toast.error('Décrivez la vidéo à générer'); return }
    setGenerating(true)

    // Simulate async polling
    toast.info('Vidéo en cours de génération... (polling async)')
    await new Promise(r => setTimeout(r, 5000))

    const item: GeneratedMedia = {
      id: `vid-${Date.now()}`,
      type: 'video',
      prompt: prompt.trim(),
      style,
      url: '#video-placeholder',
      ratio,
      createdAt: new Date(),
    }
    setGallery(prev => [item, ...prev])
    setGenerating(false)
    toast.success('Vidéo générée')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">My Studio</h1>
        <p className="text-sm text-white/50 mt-1">Génération photos & vidéos IA · Galerie personnelle</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'photo' as const, label: 'Photos', icon: Camera },
          { key: 'video' as const, label: 'Vidéos', icon: Video },
          { key: 'gallery' as const, label: `Galerie (${gallery.length})`, icon: Grid3X3 },
        ].map(t => {
          const TIcon = t.icon
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>
              <TIcon className="h-4 w-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'photo' && (
        <div className="space-y-6">
          {/* Prompt */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <label className="text-xs text-white/50 mb-1.5 block">Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez l'image que vous souhaitez générer..." rows={3} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
          </div>

          {/* Style */}
          <div>
            <label className="text-xs text-white/50 mb-2 block">Style ({PHOTO_STYLES.length})</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {PHOTO_STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)} className={`rounded-xl border p-3 text-left transition-colors ${style === s.id ? 'border-[#E50914] bg-[#E50914]/10' : 'border-white/10 hover:border-white/15'}`}>
                  <p className="text-xs font-medium text-white">{s.label}</p>
                  <p className="text-[10px] text-white/40">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ratio + HD */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-2 block">Ratio</label>
              <div className="flex gap-2">
                {RATIOS.map(r => (
                  <button key={r.id} onClick={() => setRatio(r.id)} className={`px-4 py-2 rounded-lg text-xs font-medium ${ratio === r.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-2 block">Qualité</label>
              <button onClick={() => setHdMode(!hdMode)} className={`px-4 py-2 rounded-lg text-xs font-medium ${hdMode ? 'bg-purple-600 text-white' : 'bg-white/[0.05] text-white/60'}`}>
                {hdMode ? 'HD ✓' : 'Standard'}
              </button>
            </div>
          </div>

          {/* Generate */}
          <button onClick={generatePhoto} disabled={generating || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
            {generating ? <><Loader2 className="h-5 w-5 animate-spin" /> Génération...</> : <><Wand2 className="h-5 w-5" /> Générer l&apos;image</>}
          </button>
        </div>
      )}

      {tab === 'video' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <label className="text-xs text-white/50 mb-1.5 block">Prompt vidéo</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez la séquence vidéo..." rows={3} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-2 block">Durée</label>
            <div className="flex gap-2">
              {VIDEO_DURATIONS.map(d => (
                <button key={d.id} onClick={() => setDuration(d.id)} className={`px-4 py-2 rounded-lg text-xs font-medium ${duration === d.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generateVideo} disabled={generating || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
            {generating ? <><Loader2 className="h-5 w-5 animate-spin" /> Génération async...</> : <><Film className="h-5 w-5" /> Générer la vidéo</>}
          </button>
        </div>
      )}

      {tab === 'gallery' && (
        <div>
          {gallery.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <Image className="h-10 w-10 text-white/40 mx-auto mb-3" />
              <p className="text-sm text-white/50">Galerie vide</p>
              <p className="text-xs text-white/40 mt-1">Générez des photos ou vidéos pour les voir ici</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden group">
                  <div className="aspect-video bg-white/[0.05] relative">
                    {item.type === 'photo' ? (
                      <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/[0.05]">
                        <Video className="h-8 w-8 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => setPreviewItem(item)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><Eye className="h-4 w-4 text-white" /></button>
                      <button onClick={() => setGallery(prev => prev.filter(g => g.id !== item.id))} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><Trash2 className="h-4 w-4 text-white" /></button>
                    </div>
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white">
                      {item.type === 'photo' ? '📷' : '🎬'} {item.style}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-white truncate">{item.prompt}</p>
                    <p className="text-[10px] text-white/40">{item.ratio} · {item.createdAt.toLocaleTimeString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
