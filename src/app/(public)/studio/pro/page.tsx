'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PHOTO_STYLES, PHOTO_RATIOS, CINEMA_CATEGORIES, STUDIO_AGENTS } from '@/data/studio-agents'
import { VIDEO_MODELS, IMAGE_MODELS } from '@/lib/ai-providers'
import { microToCredits } from '@/lib/ai-pricing'
import Link from 'next/link'
import {
  Wand2, Camera, Video, Image, Layers, Grid3X3, Settings,
  Loader2, Download, RefreshCcw, Copy, Check, ArrowLeft,
  Maximize2, Upload, History, Columns, FolderOpen, Zap,
  Shield, Bot, Sparkles, PaintBucket, Minus, Plus,
  ChevronDown, Eye, Trash2, Film, Save, Star, Keyboard,
} from 'lucide-react'

interface GeneratedItem {
  id: string; url: string; prompt: string; style: string; ratio: string; seed: number; createdAt: Date
}

export default function ProStudioPage() {
  const [tab, setTab] = useState<'photo' | 'video' | 'batch' | 'history' | 'projects'>('photo')
  // Photo settings
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [style2, setStyle2] = useState('')
  const [ratio, setRatio] = useState('16:9')
  const [hdMode, setHdMode] = useState(true)
  const [guidanceScale, setGuidanceScale] = useState(7.5)
  const [steps, setSteps] = useState(30)
  const [seed, setSeed] = useState(-1)
  const [category, setCategory] = useState('posters')
  const [provider, setProvider] = useState('flux-pro')
  // img2img
  const [referenceUrl, setReferenceUrl] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  // Generation
  const [generating, setGenerating] = useState(false)
  const [batchCount, setBatchCount] = useState(4)
  const [gallery, setGallery] = useState<GeneratedItem[]>([])
  const [compareMode, setCompareMode] = useState(false)
  const [compareItems, setCompareItems] = useState<string[]>([])
  const [promptHistory, setPromptHistory] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  // Video
  const [videoDuration, setVideoDuration] = useState<5 | 10 | 15>(5)
  const [videoProvider, setVideoProvider] = useState('kling-v2')

  const placeholders = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
  ]

  async function generate(count = 1) {
    if (!prompt.trim()) { toast.error('Prompt requis'); return }
    setGenerating(true)
    if (!promptHistory.includes(prompt)) setPromptHistory(prev => [prompt, ...prev].slice(0, 20))

    await new Promise(r => setTimeout(r, count > 1 ? 4000 : 2500))

    const items: GeneratedItem[] = Array.from({ length: count }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: placeholders[Math.floor(Math.random() * placeholders.length)],
      prompt, style: style2 ? `${style}+${style2}` : style,
      ratio, seed: seed === -1 ? Math.floor(Math.random() * 999999) : seed + i,
      createdAt: new Date(),
    }))

    setGallery(prev => [...items, ...prev])
    setGenerating(false)
    toast.success(`${count} image${count > 1 ? 's' : ''} générée${count > 1 ? 's' : ''}`)
  }

  const selectedImageModel = IMAGE_MODELS.find(m => m.id === provider)
  const selectedVideoModel = VIDEO_MODELS.find(m => m.id === videoProvider)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/studio" className="text-gray-500 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#E50914]" /> Studio Pro
              </h1>
              <p className="text-[10px] text-gray-500">Mode avancé · Toutes les fonctionnalités · {IMAGE_MODELS.length + VIDEO_MODELS.length} modèles</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/studio/guided" className="text-[10px] text-gray-500 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800">Mode Guidé</Link>
            <button onClick={() => setCompareMode(!compareMode)} className={`text-[10px] px-3 py-1.5 rounded-lg ${compareMode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
              <Columns className="inline h-3 w-3 mr-1" />Comparer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6">
          {[
            { key: 'photo' as const, label: 'Photo', icon: Camera },
            { key: 'video' as const, label: 'Vidéo', icon: Video },
            { key: 'batch' as const, label: `Batch (×${batchCount})`, icon: Grid3X3 },
            { key: 'history' as const, label: `Historique (${promptHistory.length})`, icon: History },
            { key: 'projects' as const, label: `Galerie (${gallery.length})`, icon: FolderOpen },
          ].map(t => {
            const TIcon = t.icon
            return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-1 space-y-4">
            {(tab === 'photo' || tab === 'batch') && (
              <>
                {/* Prompt */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <label className="text-[10px] text-gray-400 mb-1 block">Prompt</label>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez l'image..." rows={4} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
                  {/* Negative prompt */}
                  <details className="mt-2">
                    <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-400">Negative prompt</summary>
                    <textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="Ce que vous ne voulez PAS voir..." rows={2} className="w-full mt-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none resize-none" />
                  </details>
                </div>

                {/* Provider */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <label className="text-[10px] text-gray-400 mb-2 block">Provider ({IMAGE_MODELS.length})</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {IMAGE_MODELS.map(m => (
                      <button key={m.id} onClick={() => setProvider(m.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${provider === m.id ? 'bg-[#E50914]/10 border border-[#E50914]/30 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'}`}>
                        <span>{m.icon}</span>
                        <span className="flex-1">{m.name}</span>
                        <span className="text-[10px] text-[#E50914]">~{microToCredits(m.costPerRequest || 0).toFixed(1)}cr</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <label className="text-[10px] text-gray-400 mb-2 block">Style (mix 2 max)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_STYLES.map(s => (
                      <button key={s.id} onClick={() => {
                        if (style === s.id) return
                        if (style2 === s.id) { setStyle2(''); return }
                        if (!style2) setStyle2(s.id)
                        else { setStyle(style2); setStyle2(s.id) }
                      }} className={`px-2.5 py-1 rounded-lg text-[10px] ${style === s.id ? 'bg-[#E50914] text-white' : style2 === s.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {style2 && <p className="text-[10px] text-purple-400 mt-1">Mix: {style} + {style2}</p>}
                </div>

                {/* Ratio + Category */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-400 mb-1.5 block">Format</label>
                    <div className="flex gap-1.5">{PHOTO_RATIOS.map(r => (
                      <button key={r.id} onClick={() => setRatio(r.id)} className={`flex-1 py-1.5 rounded-lg text-[10px] ${ratio === r.id ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{r.label}</button>
                    ))}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 mb-1.5 block">Catégorie</label>
                    <div className="flex flex-wrap gap-1">{CINEMA_CATEGORIES.map(c => (
                      <button key={c.id} onClick={() => setCategory(c.id)} className={`px-2 py-1 rounded text-[10px] ${category === c.id ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{c.label}</button>
                    ))}</div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <details>
                  <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-400 flex items-center gap-1"><Settings className="h-3 w-3" />Paramètres avancés</summary>
                  <div className="mt-2 rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-3">
                    <div><label className="text-[10px] text-gray-400">Guidance Scale: {guidanceScale}</label><input type="range" min={1} max={20} step={0.5} value={guidanceScale} onChange={e => setGuidanceScale(parseFloat(e.target.value))} className="w-full accent-[#E50914]" /></div>
                    <div><label className="text-[10px] text-gray-400">Steps: {steps}</label><input type="range" min={10} max={50} step={5} value={steps} onChange={e => setSteps(parseInt(e.target.value))} className="w-full accent-[#E50914]" /></div>
                    <div><label className="text-[10px] text-gray-400">Seed (-1 = random)</label><input type="number" value={seed} onChange={e => setSeed(parseInt(e.target.value))} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white focus:outline-none" /></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-400">HD Mode</span>
                      <button onClick={() => setHdMode(!hdMode)} className={`h-5 w-9 rounded-full ${hdMode ? 'bg-[#E50914]' : 'bg-gray-600'}`}><span className={`block h-3 w-3 rounded-full bg-white transition-transform ${hdMode ? 'translate-x-5' : 'translate-x-1'}`} /></button>
                    </div>
                    <div><label className="text-[10px] text-gray-400">Image référence (img2img)</label><input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="URL image..." className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white focus:outline-none" /></div>
                  </div>
                </details>

                {/* Generate Buttons */}
                <button onClick={() => generate(tab === 'batch' ? batchCount : 1)} disabled={generating || !prompt.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
                  {generating ? <><Loader2 className="h-5 w-5 animate-spin" />{tab === 'batch' ? `Batch ×${batchCount}...` : 'Génération...'}</> :
                    <><Wand2 className="h-5 w-5" />{tab === 'batch' ? `Batch ×${batchCount}` : 'Générer'}</>}
                </button>

                {tab === 'batch' && (
                  <div className="flex items-center gap-3 justify-center">
                    <button onClick={() => setBatchCount(Math.max(2, batchCount - 1))} className="h-8 w-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                    <span className="text-sm text-white font-bold">{batchCount} variations</span>
                    <button onClick={() => setBatchCount(Math.min(8, batchCount + 1))} className="h-8 w-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                  </div>
                )}

                <p className="text-[10px] text-emerald-400 text-center flex items-center justify-center gap-1"><Shield className="h-3 w-3" />0% commission</p>
              </>
            )}

            {tab === 'video' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Décrivez la séquence vidéo..." rows={4} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <label className="text-[10px] text-gray-400 mb-2 block">Provider vidéo ({VIDEO_MODELS.length})</label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {VIDEO_MODELS.map(m => (
                      <button key={m.id} onClick={() => setVideoProvider(m.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${videoProvider === m.id ? 'bg-[#E50914]/10 border border-[#E50914]/30 text-white' : 'bg-gray-800/50 text-gray-400'}`}>
                        <span>{m.icon}</span><span className="flex-1">{m.name}</span>
                        <span className="text-[10px]">{m.maxDuration}</span>
                        <span className="text-[10px] text-[#E50914]">~{microToCredits(m.costPerRequest || 0).toFixed(0)}cr</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">{([5, 10, 15] as const).map(d => (
                  <button key={d} onClick={() => setVideoDuration(d)} className={`flex-1 py-2 rounded-lg text-xs ${videoDuration === d ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>{d}s</button>
                ))}</div>
                <button onClick={() => { toast.info('Vidéo en génération async...'); generate() }} disabled={generating || !prompt.trim()} className="w-full py-3 bg-[#E50914] text-white font-semibold rounded-xl disabled:opacity-50">
                  {generating ? <Loader2 className="inline h-5 w-5 animate-spin" /> : <Film className="inline h-5 w-5 mr-2" />}Générer la vidéo
                </button>
              </div>
            )}

            {tab === 'history' && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-2">Prompts récents (cliquez pour réutiliser)</p>
                {promptHistory.length === 0 ? <p className="text-xs text-gray-600">Aucun historique</p> : promptHistory.map((p, i) => (
                  <button key={i} onClick={() => { setPrompt(p); setTab('photo') }} className="w-full text-left rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-xs text-gray-400 hover:border-gray-600 truncate">
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Gallery */}
          <div className="lg:col-span-2">
            {gallery.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/20 flex items-center justify-center h-96">
                <div className="text-center">
                  <Image className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Vos créations apparaîtront ici</p>
                  <p className="text-[10px] text-gray-600 mt-1">Mode Pro : batch, variations, comparaison, historique</p>
                </div>
              </div>
            ) : (
              <div className={`grid gap-3 ${compareMode ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                {gallery.slice(0, tab === 'projects' ? 50 : 12).map(item => (
                  <div key={item.id} className={`rounded-xl border overflow-hidden group ${compareItems.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-800'}`}>
                    <div className="aspect-square relative bg-gray-800">
                      <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button onClick={() => toast.success('Téléchargé')} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Download className="h-4 w-4 text-white" /></button>
                        <button onClick={() => { setPrompt(item.prompt); setStyle(item.style.split('+')[0]); toast.success('Prompt chargé') }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><RefreshCcw className="h-4 w-4 text-white" /></button>
                        <button onClick={() => setGallery(prev => prev.filter(g => g.id !== item.id))} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Trash2 className="h-4 w-4 text-white" /></button>
                        {compareMode && (
                          <button onClick={() => setCompareItems(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id].slice(-2))} className="p-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/50">
                            <Columns className="h-4 w-4 text-white" />
                          </button>
                        )}
                      </div>
                      <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-white">{item.style}</span>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-gray-400 truncate">{item.prompt}</p>
                      <p className="text-[9px] text-gray-600">seed:{item.seed} · {item.ratio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Keyboard Shortcuts */}
            <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/30 p-4">
              <div className="flex items-center gap-2 mb-2"><Keyboard className="h-3.5 w-3.5 text-gray-500" /><span className="text-[10px] text-gray-500">Raccourcis</span></div>
              <div className="flex gap-4 text-[10px] text-gray-600">
                <span><kbd className="px-1 py-0.5 bg-gray-800 rounded text-[9px]">⌘+Enter</kbd> Générer</span>
                <span><kbd className="px-1 py-0.5 bg-gray-800 rounded text-[9px]">⌘+B</kbd> Batch</span>
                <span><kbd className="px-1 py-0.5 bg-gray-800 rounded text-[9px]">⌘+C</kbd> Comparer</span>
                <span><kbd className="px-1 py-0.5 bg-gray-800 rounded text-[9px]">⌘+H</kbd> Historique</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
