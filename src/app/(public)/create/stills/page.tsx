'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Image as ImageIcon,
  Lock,
  Sparkles,
  Upload,
  Trash2,
  RefreshCw,
  Film,
  SlidersHorizontal,
  Camera,
  Layers,
  GripVertical,
  Filter,
  Plus,
  X,
  Check,
  Loader2,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const ASPECT_RATIOS = ['16:9', '4:3', '1:1', '9:16']
const STYLES = ['Cinematic', 'Noir', 'Fantasy', 'Sci-Fi', 'Period']
const CAMERA_ANGLES = ['Wide', 'Close-up', "Bird's eye", 'Low angle']
const SCENE_FILTERS = ['All Scenes', 'Scene 1', 'Scene 2', 'Scene 3', 'Scene 4']

const STILL_IMAGES = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=800&h=450&q=80',
]

/* ── Types ── */

interface GalleryItem {
  id: string
  imageUrl: string
  prompt: string
  style: string
  cameraAngle: string
  aspectRatio: string
  createdAt: string
  selected: boolean
}

interface ReferenceImage {
  url: string
  name: string
}

/* ── Helpers ── */

function LockOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-not-allowed">
      <Lock className="h-8 w-8 text-white/20" />
      <p className="text-sm text-white/30 font-medium">Complete previous steps to unlock</p>
    </div>
  )
}

function randomStillImage() {
  return STILL_IMAGES[Math.floor(Math.random() * STILL_IMAGES.length)]
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

let idCounter = 0

/* ── Page ── */

export default function StillsPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('Cinematic')
  const [cameraAngle, setCameraAngle] = useState('Wide')
  const [sceneFilter, setSceneFilter] = useState('All Scenes')

  // Gallery state
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [generating, setGenerating] = useState(false)
  const [generatingVariations, setGeneratingVariations] = useState(false)
  const [promptError, setPromptError] = useState('')

  // Reference images
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([])
  const refInputRef = useRef<HTMLInputElement>(null)

  // Style transfer
  const [styleTransferRef, setStyleTransferRef] = useState<ReferenceImage | null>(null)
  const [styleTransferring, setStyleTransferring] = useState(false)
  const styleTransferInputRef = useRef<HTMLInputElement>(null)

  if (!loaded) return null

  const unlocked = isStepUnlocked('stills', CREATE_STEPS)

  // --- Generate ---

  function createGalleryItem(): GalleryItem {
    return {
      id: `still-${++idCounter}-${Date.now()}`,
      imageUrl: randomStillImage(),
      prompt: prompt,
      style,
      cameraAngle,
      aspectRatio,
      createdAt: formatTime(new Date()),
      selected: false,
    }
  }

  async function handleGenerate() {
    setPromptError('')
    if (prompt.trim().length < 10) {
      setPromptError('Prompt must be at least 10 characters long.')
      return
    }
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2500))
    setGallery((prev) => [createGalleryItem(), ...prev])
    setGenerating(false)
  }

  async function handleGenerateVariations() {
    setPromptError('')
    if (prompt.trim().length < 10) {
      setPromptError('Prompt must be at least 10 characters long.')
      return
    }
    setGeneratingVariations(true)
    await new Promise((r) => setTimeout(r, 4000))
    const items = Array.from({ length: 4 }, () => createGalleryItem())
    setGallery((prev) => [...items, ...prev])
    setGeneratingVariations(false)
  }

  function toggleSelectGalleryItem(id: string) {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    )
  }

  function refreshGalleryItem(id: string) {
    setGallery((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, imageUrl: randomStillImage(), createdAt: formatTime(new Date()) } : item
      )
    )
  }

  function deleteGalleryItem(id: string) {
    setGallery((prev) => prev.filter((item) => item.id !== id))
  }

  // --- Reference images ---

  function handleRefUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      setReferenceImages((prev) => [...prev, { url, name: file.name }])
    })
    e.target.value = ''
  }

  function removeRefImage(index: number) {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index))
  }

  // --- Style transfer ---

  function handleStyleTransferSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || !files[0]) return
    const file = files[0]
    setStyleTransferRef({ url: URL.createObjectURL(file), name: file.name })
    e.target.value = ''
  }

  async function handleApplyStyleTransfer() {
    if (!styleTransferRef) return
    setStyleTransferring(true)
    await new Promise((r) => setTimeout(r, 2000))
    const item: GalleryItem = {
      id: `style-${++idCounter}-${Date.now()}`,
      imageUrl: randomStillImage(),
      prompt: `Style transfer from: ${styleTransferRef.name}`,
      style: 'Style Transfer',
      cameraAngle,
      aspectRatio,
      createdAt: formatTime(new Date()),
      selected: false,
    }
    setGallery((prev) => [item, ...prev])
    setStyleTransferring(false)
  }

  const isGenerating = generating || generatingVariations

  return (
    <CreateLayout
      currentStepId="stills"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('stills')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <ImageIcon className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Generate <span className="text-[#E50914]">Still Shots</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Create cinematic still images for every scene. Describe your vision and let AI bring it to life.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Camera, title: 'Describe Your Shot', desc: 'Write a detailed prompt describing the composition, mood and subject.' },
            { icon: Sparkles, title: 'AI Generation', desc: 'Our AI creates photorealistic stills matching your cinematic vision.' },
            { icon: Layers, title: 'Curate Gallery', desc: 'Select the best shots, regenerate or refine until perfect.' },
          ].map((item) => (
            <div
              key={item.title}
              className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 flex items-center justify-center mb-3 group-hover:bg-[#E50914]/20 transition-colors">
                <item.icon className="h-5 w-5 text-[#E50914]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ GENERATION STUDIO ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Generation Studio</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt area */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <textarea
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); setPromptError('') }}
                placeholder="Describe the shot... e.g. A lone figure standing on a rain-soaked rooftop at night, neon signs reflecting off wet surfaces, cinematic wide angle, moody blue and red lighting"
                rows={6}
                className={cn(
                  'w-full bg-white/[0.02] border rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 resize-none focus:outline-none transition-colors',
                  promptError ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/[0.08] focus:border-[#E50914]/40'
                )}
              />
              {promptError && (
                <p className="text-xs text-red-400 mt-1.5">{promptError}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? 'Generating...' : 'Generate'}
                {!generating && <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>}
              </button>
              <button
                onClick={handleGenerateVariations}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generatingVariations ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
                {generatingVariations ? 'Generating 4...' : 'Generate 4 Variations'}
                {!generatingVariations && <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>}
              </button>
            </div>
          </div>

          {/* Settings panel */}
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="h-4 w-4 text-white/40" />
                <h3 className="text-sm font-semibold text-white/70">Settings</h3>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Aspect Ratio</label>
                <div className="flex flex-wrap gap-1.5">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        aspectRatio === ar
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Style</label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        style === s
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Angle */}
              <div>
                <label className="text-xs text-white/40 mb-2 block">Camera Angle</label>
                <div className="flex flex-wrap gap-1.5">
                  {CAMERA_ANGLES.map((a) => (
                    <button
                      key={a}
                      onClick={() => setCameraAngle(a)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        cameraAngle === a
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white/80">Gallery</h2>
            {gallery.length > 0 && (
              <span className="text-xs text-white/40">{gallery.length} image{gallery.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/30" />
            <select
              value={sceneFilter}
              onChange={(e) => setSceneFilter(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white/60 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
            >
              {SCENE_FILTERS.map((f) => (
                <option key={f} value={f} className="bg-[#1a1a1a]">{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading state */}
        {isGenerating && (
          <div className="mb-6 p-8 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-[#E50914] animate-spin" />
            <p className="text-sm text-white/50">
              {generatingVariations ? 'Generating 4 variations...' : 'Generating your still...'}
            </p>
            <div className="w-48 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full bg-[#E50914] rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        )}

        {gallery.length === 0 && !isGenerating ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] overflow-hidden"
              >
                <div className="relative aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-10 w-10 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/20">Generate to fill gallery</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'group rounded-xl overflow-hidden border-2 transition-all duration-300',
                  item.selected
                    ? 'border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
                )}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {item.selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  {/* Hover overlay with settings */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-[10px] text-white/80 line-clamp-2 mb-1.5">{item.prompt}</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60">{item.style}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60">{item.cameraAngle}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60">{item.aspectRatio}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60">{item.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-white/[0.04] bg-white/[0.01]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSelectGalleryItem(item.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-colors',
                        item.selected
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-[#E50914]/80 text-white hover:bg-[#E50914]'
                      )}
                    >
                      {item.selected ? <Check className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                      {item.selected ? 'Selected' : 'Use in Film'}
                    </button>
                    <button
                      onClick={() => refreshGalleryItem(item.id)}
                      className="py-1.5 px-2 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      className="py-1.5 px-2 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ REFERENCE IMAGES ═══ */}
      <section className="relative mb-8">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Reference Images</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload area */}
          <div
            className="min-h-[200px] rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] transition-colors cursor-pointer"
            onClick={() => refInputRef.current?.click()}
          >
            <input
              ref={refInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleRefUpload}
            />
            {referenceImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                <Upload className="h-10 w-10 text-white/15 mb-3" />
                <p className="text-sm text-white/30 mb-1">Click to upload reference images</p>
                <p className="text-xs text-white/20">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {referenceImages.map((img, i) => (
                    <div key={i} className="relative group/ref aspect-square rounded-lg overflow-hidden">
                      <Image src={img.url} alt={img.name} fill className="object-cover" sizes="150px" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeRefImage(i) }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white/80 flex items-center justify-center opacity-0 group-hover/ref:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white/60 px-1.5 py-0.5 truncate">{img.name}</p>
                    </div>
                  ))}
                  <div
                    className="aspect-square rounded-lg border border-dashed border-white/[0.1] flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 text-white/20" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Style transfer */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#E50914]" />
              <h3 className="text-sm font-semibold text-white/80">Style Transfer</h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Upload a reference image and apply its visual style to your AI-generated stills. Match the color grading, composition and mood of any reference.
            </p>

            {/* Style transfer reference preview */}
            {styleTransferRef && (
              <div className="mb-4 relative inline-block">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/[0.1]">
                  <Image src={styleTransferRef.url} alt={styleTransferRef.name} fill className="object-cover" sizes="128px" />
                </div>
                <button
                  onClick={() => setStyleTransferRef(null)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/80 border border-white/[0.1] text-white/80 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-[10px] text-white/40 mt-1 truncate max-w-[128px]">{styleTransferRef.name}</p>
              </div>
            )}

            <input
              ref={styleTransferInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleStyleTransferSelect}
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => styleTransferInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                {styleTransferRef ? 'Change Reference' : 'Select Reference for Style Transfer'}
              </button>

              {styleTransferRef && (
                <button
                  onClick={handleApplyStyleTransfer}
                  disabled={styleTransferring}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E50914] text-white text-xs font-semibold hover:bg-[#B20710] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {styleTransferring ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {styleTransferring ? 'Applying...' : 'Apply Style Transfer'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
