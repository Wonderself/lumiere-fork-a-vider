'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { STUDIO_AGENTS, PHOTO_STYLES, PHOTO_RATIOS, CINEMA_CATEGORIES } from '@/data/studio-agents'
import {
  Camera, Video, Image, Grid3X3, Bot, Loader2, Download,
  Trash2, Eye, Wand2, Play, Film, Sparkles, Palette,
  Building, Shirt, LayoutGrid, Clock, Zap, Shield, X,
} from 'lucide-react'

interface MediaItem {
  id: string; type: 'photo' | 'video'; prompt: string; url: string
  style: string; category: string; agent: string; createdAt: Date
}

const ICON_MAP: Record<string, typeof Camera> = {
  image: Image, 'layout-grid': LayoutGrid, palette: Palette,
  building: Building, sparkles: Sparkles, film: Film, shirt: Shirt,
}

export default function StudioPage() {
  const [tab, setTab] = useState<'photo' | 'video' | 'gallery' | 'queue'>('photo')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [ratio, setRatio] = useState('16:9')
  const [hdMode, setHdMode] = useState(false)
  const [category, setCategory] = useState('posters')
  const [duration, setDuration] = useState<5 | 10 | 15>(5)
  const [generating, setGenerating] = useState(false)
  const [gallery, setGallery] = useState<MediaItem[]>([])
  const [preview, setPreview] = useState<MediaItem | null>(null)

  async function genPhoto() {
    if (!prompt.trim()) { toast.error('Décrivez l\'image'); return }
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    const placeholders = [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    ]
    const item: MediaItem = {
      id: `p-${Date.now()}`, type: 'photo', prompt: prompt.trim(),
      url: placeholders[Math.floor(Math.random() * placeholders.length)],
      style, category, agent: CINEMA_CATEGORIES.find(c => c.id === category)?.agent || 'cg-studio-poster',
      createdAt: new Date(),
    }
    setGallery(prev => [item, ...prev])
    setGenerating(false)
    toast.success('Photo générée par ' + (STUDIO_AGENTS.find(a => a.slug === item.agent)?.name || 'Agent'))
  }

  async function genVideo() {
    if (!prompt.trim()) { toast.error('Décrivez la vidéo'); return }
    setGenerating(true)
    toast.info(`Vidéo ${duration}s en cours (polling async)...`)
    await new Promise(r => setTimeout(r, duration * 600))
    const item: MediaItem = {
      id: `v-${Date.now()}`, type: 'video', prompt: prompt.trim(),
      url: '#video', style, category: 'video', agent: 'cg-studio-trailer',
      createdAt: new Date(),
    }
    setGallery(prev => [item, ...prev])
    setGenerating(false)
    toast.success(`Vidéo ${duration}s générée`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <Camera className="h-4 w-4 text-[#E50914]" />
            <span className="text-sm font-medium text-[#E50914]">Creative Studio</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Studio <span className="text-[#E50914]">Créatif IA</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Générez affiches, storyboards, concept art, VFX et vidéos avec 7 agents spécialisés cinéma.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">0% commission — vous ne payez que les tokens IA</span>
          </div>

          {/* Mode Selector */}
          <div className="mt-6 flex gap-3 justify-center">
            <a href="/studio/guided" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors">
              <Wand2 className="h-4 w-4" /> Mode Guidé
            </a>
            <a href="/studio/pro" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-sm text-purple-400 hover:bg-purple-500/10 transition-colors">
              <Zap className="h-4 w-4" /> Mode Pro
            </a>
          </div>
        </div>

        {/* Agents Row */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {STUDIO_AGENTS.map(agent => {
            const AIcon = ICON_MAP[agent.icon] || Bot
            return (
              <div key={agent.slug} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 shrink-0">
                <AIcon className="h-4 w-4" style={{ color: agent.color }} />
                <div>
                  <p className="text-xs font-medium text-white">{agent.name}</p>
                  <p className="text-[10px] text-gray-500">{agent.role}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'photo' as const, label: 'Photos', icon: Camera },
            { key: 'video' as const, label: 'Vidéos', icon: Video },
            { key: 'gallery' as const, label: `Galerie (${gallery.length})`, icon: Grid3X3 },
            { key: 'queue' as const, label: 'File agents', icon: Clock },
          ].map(t => {
            const TIcon = t.icon
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <TIcon className="h-4 w-4" /> {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'photo' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <label className="text-xs text-gray-400 mb-2 block">Prompt</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez l'image cinéma à générer..." rows={3} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Catégorie cinéma</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {CINEMA_CATEGORIES.map(cat => {
                  const CIcon = ICON_MAP[cat.icon] || Image
                  return (
                    <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors ${category === cat.id ? 'border-[#E50914] bg-[#E50914]/10' : 'border-gray-800 hover:border-gray-700'}`}>
                      <CIcon className="h-5 w-5" style={{ color: category === cat.id ? '#E50914' : cat.color }} />
                      <span className="text-[10px] text-gray-400">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Style</label>
              <div className="flex gap-2 flex-wrap">
                {PHOTO_STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={`px-4 py-2 rounded-xl text-xs font-medium ${style === s.id ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Ratio + HD */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-2 block">Ratio</label>
                <div className="flex gap-2">
                  {PHOTO_RATIOS.map(r => (
                    <button key={r.id} onClick={() => setRatio(r.id)} className={`px-4 py-2 rounded-lg text-xs font-medium ${ratio === r.id ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{r.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Qualité</label>
                <button onClick={() => setHdMode(!hdMode)} className={`px-4 py-2 rounded-lg text-xs font-medium ${hdMode ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{hdMode ? 'HD ✓' : 'Standard'}</button>
              </div>
            </div>

            <button onClick={genPhoto} disabled={generating || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
              {generating ? <><Loader2 className="h-5 w-5 animate-spin" />Génération...</> : <><Wand2 className="h-5 w-5" />Générer</>}
            </button>
          </div>
        )}

        {tab === 'video' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez la séquence vidéo..." rows={3} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Durée</label>
              <div className="flex gap-2">
                {([5, 10, 15] as const).map(d => (
                  <button key={d} onClick={() => setDuration(d)} className={`px-4 py-2 rounded-lg text-xs font-medium ${duration === d ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{d}s</button>
                ))}
              </div>
            </div>
            <button onClick={genVideo} disabled={generating || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
              {generating ? <><Loader2 className="h-5 w-5 animate-spin" />Génération async...</> : <><Play className="h-5 w-5" />Générer la vidéo</>}
            </button>
          </div>
        )}

        {tab === 'gallery' && (
          <div>
            {gallery.length === 0 ? (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-12 text-center">
                <Grid3X3 className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Galerie vide</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map(item => (
                  <div key={item.id} className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden group">
                    <div className="aspect-video bg-gray-800 relative">
                      {item.type === 'photo' ? (
                        <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Video className="h-8 w-8 text-gray-600" /></div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => setPreview(item)} className="p-2 rounded-lg bg-white/20"><Eye className="h-4 w-4 text-white" /></button>
                        <button onClick={() => setGallery(prev => prev.filter(g => g.id !== item.id))} className="p-2 rounded-lg bg-white/20"><Trash2 className="h-4 w-4 text-white" /></button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-white truncate">{item.prompt}</p>
                      <p className="text-[10px] text-gray-500">{item.style} · {item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'queue' && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center">
            <Clock className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">File d&apos;attente des agents</p>
            <p className="text-xs text-gray-600 mt-1">Les demandes de création des agents apparaîtront ici</p>
          </div>
        )}

        {/* Preview Modal */}
        {preview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreview(null)}>
            <div className="max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="rounded-2xl bg-gray-900 overflow-hidden">
                {preview.type === 'photo' ? (
                  <img src={preview.url} alt={preview.prompt} className="w-full" />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-800"><Video className="h-16 w-16 text-gray-600" /></div>
                )}
                <div className="p-4">
                  <p className="text-sm text-white">{preview.prompt}</p>
                  <p className="text-xs text-gray-500 mt-1">{preview.style} · {preview.category} · {preview.agent}</p>
                </div>
              </div>
              <button onClick={() => setPreview(null)} className="mt-4 w-full py-2 bg-gray-800 text-gray-400 rounded-xl text-sm">Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
