'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutGrid,
  Sparkles,
  Upload,
  Wand2,
  Plus,
  Trash2,
  Move,
  ZoomIn,
  ChevronRight,
  Lock,
  Check,
  Image as ImageIcon,
  ArrowRight,
  Lightbulb,
  Grid3x3,
  Camera,
  Pencil,
  Loader2,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Types ── */

interface StoryboardFrame {
  id: number
  label: string
  imageUrl: string | null
  notes: string
  cameraAngle: string
  lighting: string
  shotType: string
  description: string
}

const STYLE_OPTIONS = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'noir', label: 'Noir' },
  { value: 'anime', label: 'Anime' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'sketch', label: 'Sketch' },
]

const SHOT_TYPES = [
  'Wide Shot',
  'Medium Shot',
  'Close-Up',
  'Extreme Close-Up',
  'Over-the-Shoulder',
  "Bird's Eye",
  'Low Angle',
  'Dutch Angle',
  'POV',
  'Tracking Shot',
]

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9 Widescreen', cls: 'aspect-video' },
  { value: '2.39:1', label: '2.39:1 Cinematic', cls: 'aspect-[2.39/1]' },
  { value: '4:3', label: '4:3 Classic', cls: 'aspect-[4/3]' },
  { value: '1:1', label: '1:1 Square', cls: 'aspect-square' },
  { value: '9:16', label: '9:16 Vertical', cls: 'aspect-[9/16]' },
]

const UNSPLASH_STORYBOARD = [
  'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&h=360&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=640&h=360&q=80',
]

const GENERATION_STEPS = ['Composing scene...', 'Applying style...', 'Rendering...']

const TIPS = [
  {
    title: 'Use Varied Shot Types',
    description:
      'Alternate between wide shots, medium shots, and close-ups to create visual rhythm and keep the audience engaged.',
  },
  {
    title: 'Follow the Rule of Thirds',
    description:
      'Place key subjects along the intersection points of a 3x3 grid for more dynamic and balanced compositions.',
  },
  {
    title: 'Maintain Visual Continuity',
    description:
      'Ensure characters and objects maintain consistent positioning between consecutive frames to avoid disorienting jump cuts.',
  },
  {
    title: 'Show, Don\'t Tell',
    description:
      'Use visual storytelling to convey emotions and narrative beats. A well-composed frame can replace pages of dialogue.',
  },
  {
    title: 'Plan Camera Movement',
    description:
      'Annotate pans, tilts, and tracking shots in your notes. Movement adds energy and guides the viewer\'s attention.',
  },
]

const WORKFLOW_STEPS = [
  {
    number: 1,
    title: 'Break Down Your Script',
    description: 'Divide your script into scenes and sequences. Identify key moments that need visual representation.',
    icon: Grid3x3,
  },
  {
    number: 2,
    title: 'Generate Frames',
    description: 'Use AI to generate storyboard images for each scene. Included with your subscription.',
    icon: Wand2,
  },
  {
    number: 3,
    title: 'Arrange & Refine',
    description: 'Drag and drop to reorder frames, add director notes, and refine compositions until your vision is clear.',
    icon: Move,
  },
]

/* ── Default frames ── */

function createEmptyFrames(): StoryboardFrame[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    label: `Scene ${i + 1}`,
    imageUrl: null,
    notes: '',
    cameraAngle: '',
    lighting: '',
    shotType: '',
    description: '',
  }))
}

/* ── Page Component ── */

export default function StoryboardPage() {
  const { completedSteps, markComplete, loaded } = useCreateProgress()

  /* Canvas state */
  const [frames, setFrames] = useState<StoryboardFrame[]>(createEmptyFrames)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedNotes, setExpandedNotes] = useState<number | null>(null)

  /* AI generation panel state */
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStyle, setAiStyle] = useState('cinematic')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [generatingFrameId, setGeneratingFrameId] = useState<number | null>(null)
  const [generationStep, setGenerationStep] = useState(0)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  /* Batch generation state */
  const [batchGenerating, setBatchGenerating] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })

  /* Drag and drop state */
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  /* Editable label state */
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null)
  const [editingLabelValue, setEditingLabelValue] = useState('')
  const labelInputRef = useRef<HTMLInputElement>(null)

  /* Image index counter for cycling through Unsplash images */
  const imageIndexRef = useRef(0)

  /* Locked state */
  const isUnlocked = loaded
    ? (() => {
        const stepIndex = CREATE_STEPS.findIndex((s) => s.id === 'storyboard')
        for (let i = 0; i < stepIndex; i++) {
          if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
        }
        return true
      })()
    : false

  /* Focus label input on edit */
  useEffect(() => {
    if (editingLabelId !== null && labelInputRef.current) {
      labelInputRef.current.focus()
      labelInputRef.current.select()
    }
  }, [editingLabelId])

  if (!loaded) return null

  /* ── Helpers ── */

  function getNextImage(): string {
    const url = UNSPLASH_STORYBOARD[imageIndexRef.current % UNSPLASH_STORYBOARD.length]
    imageIndexRef.current++
    return url
  }

  function getAspectClass(): string {
    return ASPECT_RATIOS.find((ar) => ar.value === aspectRatio)?.cls ?? 'aspect-video'
  }

  /* ── Handlers ── */

  function addScene() {
    const nextId = frames.length > 0 ? Math.max(...frames.map((f) => f.id)) + 1 : 1
    setFrames((prev) => [
      ...prev,
      { id: nextId, label: `Scene ${nextId}`, imageUrl: null, notes: '', cameraAngle: '', lighting: '', shotType: '', description: '' },
    ])
  }

  function removeFrame(id: number) {
    setFrames((prev) => prev.filter((f) => f.id !== id))
  }

  function simulateGeneration(resolve: (url: string) => void) {
    let step = 0
    setGenerationStep(0)
    const interval = setInterval(() => {
      step++
      if (step < GENERATION_STEPS.length) {
        setGenerationStep(step)
      } else {
        clearInterval(interval)
        const url = getNextImage()
        resolve(url)
      }
    }, 800)
  }

  function handleGenerateFrame(frameId: number) {
    setGeneratingFrameId(frameId)
    setGenerationStep(0)
    new Promise<string>((resolve) => simulateGeneration(resolve)).then((url) => {
      setFrames((prev) =>
        prev.map((f) => (f.id === frameId ? { ...f, imageUrl: url } : f))
      )
      setLastGenerated(url)
      setGeneratingFrameId(null)
    })
  }

  function handleGenerateFromPrompt() {
    if (!aiPrompt.trim()) return
    const nextId = frames.length > 0 ? Math.max(...frames.map((f) => f.id)) + 1 : 1
    const newFrame: StoryboardFrame = {
      id: nextId,
      label: `Scene ${nextId}`,
      imageUrl: null,
      notes: '',
      cameraAngle: '',
      lighting: '',
      shotType: '',
      description: aiPrompt.trim(),
    }
    setFrames((prev) => [...prev, newFrame])
    setGeneratingFrameId(nextId)
    setGenerationStep(0)
    new Promise<string>((resolve) => simulateGeneration(resolve)).then((url) => {
      setFrames((prev) =>
        prev.map((f) => (f.id === nextId ? { ...f, imageUrl: url } : f))
      )
      setLastGenerated(url)
      setGeneratingFrameId(null)
    })
    setAiPrompt('')
  }

  async function handleBatchGenerate() {
    const emptyFrames = frames.filter((f) => !f.imageUrl)
    if (emptyFrames.length === 0) return
    setBatchGenerating(true)
    setBatchProgress({ current: 0, total: emptyFrames.length })

    for (let i = 0; i < emptyFrames.length; i++) {
      const frame = emptyFrames[i]
      setBatchProgress({ current: i + 1, total: emptyFrames.length })
      setGeneratingFrameId(frame.id)
      setGenerationStep(0)
      const url = await new Promise<string>((resolve) => simulateGeneration(resolve))
      setFrames((prev) =>
        prev.map((f) => (f.id === frame.id ? { ...f, imageUrl: url } : f))
      )
      setLastGenerated(url)
    }

    setGeneratingFrameId(null)
    setBatchGenerating(false)
    setBatchProgress({ current: 0, total: 0 })
  }

  function updateFrameField(id: number, field: keyof StoryboardFrame, value: string) {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  function setShotType(id: number, shotType: string) {
    setFrames((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, shotType, cameraAngle: shotType } : f
      )
    )
  }

  /* ── Label editing ── */

  function startEditingLabel(frame: StoryboardFrame) {
    setEditingLabelId(frame.id)
    setEditingLabelValue(frame.label)
  }

  function commitLabel() {
    if (editingLabelId !== null && editingLabelValue.trim()) {
      updateFrameField(editingLabelId, 'label', editingLabelValue.trim())
    }
    setEditingLabelId(null)
    setEditingLabelValue('')
  }

  /* ── Drag & Drop ── */

  function handleDragStart(index: number) {
    setDragIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropIndex(index)
  }

  function handleDragLeave() {
    setDropIndex(null)
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDropIndex(null)
      return
    }
    setFrames((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(dragIndex, 1)
      updated.splice(index, 0, moved)
      return updated
    })
    setDragIndex(null)
    setDropIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <CreateLayout
      currentStepId="storyboard"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('storyboard')}
    >
      {/* ── Hero Section ── */}
      <section className="relative mb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/[0.04] blur-[100px]" />
        </div>

        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <LayoutGrid className="h-7 w-7 text-[#E50914]" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Create Your <span className="text-[#E50914]">Storyboard</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Visualize every scene of your film. Break down your script into frames,
            generate AI-powered storyboard images, and arrange your visual narrative.
          </p>
        </div>
      </section>

      {/* ── Guided Workflow ── */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          Guided Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.number}
              className="relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E50914]/60 mb-1">
                    Step {step.number}
                  </div>
                  <h3 className="text-sm font-semibold text-white/90 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Storyboard Canvas ── */}
      <section className="relative mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Storyboard Canvas
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30">
              {frames.length} scene{frames.length !== 1 ? 's' : ''}
            </span>

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-white/[0.06] overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/50'
                )}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/50'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add scene */}
            <button
              onClick={addScene}
              disabled={!isUnlocked}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                isUnlocked
                  ? 'bg-[#E50914] text-white hover:bg-[#B20710] active:scale-[0.97]'
                  : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Scene
            </button>
          </div>
        </div>

        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-30 rounded-xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <Lock className="h-10 w-10 text-white/20 mb-4" />
            <p className="text-sm font-medium text-white/40 mb-1">Storyboard Locked</p>
            <p className="text-xs text-white/25 max-w-xs text-center">
              Complete the previous steps to unlock the storyboard canvas.
            </p>
          </div>
        )}

        {/* Frame grid */}
        <div
          className={cn(
            'gap-4',
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col'
          )}
        >
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              draggable={isUnlocked}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'group relative rounded-xl bg-white/[0.02] border transition-all duration-300 overflow-hidden',
                dragIndex === index
                  ? 'opacity-40 border-[#E50914]/40'
                  : dropIndex === index
                    ? 'border-[#E50914]/60 ring-2 ring-[#E50914]/20'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
              )}
            >
              {/* Drop indicator line */}
              {dropIndex === index && dragIndex !== null && dragIndex !== index && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#E50914] z-20 shadow-[0_0_8px_rgba(229,9,20,0.5)]" />
              )}

              {/* Frame area with dynamic aspect ratio */}
              <div className={cn('relative bg-black/30', getAspectClass())}>
                {frame.imageUrl ? (
                  <>
                    <Image
                      src={frame.imageUrl}
                      alt={frame.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Shot type badge */}
                    {frame.shotType && (
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/70 border border-[#E50914]/30 text-[10px] font-semibold text-[#E50914] backdrop-blur-sm">
                        <Camera className="inline h-2.5 w-2.5 mr-1" />
                        {frame.shotType}
                      </div>
                    )}
                    {/* Frame actions overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors cursor-grab active:cursor-grabbing">
                        <Move className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors">
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeFrame(frame.id)}
                        className="w-8 h-8 rounded-lg bg-black/60 border border-red-500/20 flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] rounded-lg m-2">
                    {generatingFrameId === frame.id ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin" />
                        <span className="text-xs text-white/40">
                          {GENERATION_STEPS[generationStep] ?? 'Generating...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Shot type badge even when empty */}
                        {frame.shotType && (
                          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/70 border border-[#E50914]/30 text-[10px] font-semibold text-[#E50914]">
                            <Camera className="inline h-2.5 w-2.5 mr-1" />
                            {frame.shotType}
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                          <Plus className="h-5 w-5 text-white/20" />
                        </div>
                        <button
                          onClick={() => handleGenerateFrame(frame.id)}
                          disabled={!isUnlocked}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
                            isUnlocked
                              ? 'bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] hover:bg-[#E50914]/20'
                              : 'bg-white/[0.03] border border-white/[0.06] text-white/20 cursor-not-allowed'
                          )}
                        >
                          <Wand2 className="h-3 w-3" />
                          Generate with AI
                        </button>
                        <span className="text-[10px] text-white/20 mt-1.5">Included with subscription</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Frame label and actions */}
              <div className="flex items-center justify-between px-4 py-3">
                {editingLabelId === frame.id ? (
                  <input
                    ref={labelInputRef}
                    type="text"
                    value={editingLabelValue}
                    onChange={(e) => setEditingLabelValue(e.target.value)}
                    onBlur={commitLabel}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitLabel()
                      if (e.key === 'Escape') {
                        setEditingLabelId(null)
                        setEditingLabelValue('')
                      }
                    }}
                    className="text-xs font-medium text-white/90 bg-black/40 border border-[#E50914]/40 rounded px-2 py-0.5 outline-none w-28"
                  />
                ) : (
                  <button
                    onClick={() => startEditingLabel(frame)}
                    className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white/90 transition-colors"
                    title="Click to rename"
                  >
                    {frame.label}
                    <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                )}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded text-white/30 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing">
                    <Move className="h-3 w-3" />
                  </button>
                  <button className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
                    <ZoomIn className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="p-1 rounded text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Shot type selector */}
              <div className="px-4 pb-2">
                <select
                  value={frame.shotType}
                  onChange={(e) => setShotType(frame.id, e.target.value)}
                  disabled={!isUnlocked}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/[0.06] text-[11px] text-white/60 focus:outline-none focus:border-[#E50914]/30 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#111] text-white/40">Shot type...</option>
                  {SHOT_TYPES.map((st) => (
                    <option key={st} value={st} className="bg-[#111] text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scene description */}
              <div className="px-4 pb-3">
                <div className="relative">
                  <textarea
                    value={frame.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        updateFrameField(frame.id, 'description', e.target.value)
                      }
                    }}
                    placeholder="What happens in this scene?"
                    rows={2}
                    disabled={!isUnlocked}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/[0.06] text-[11px] text-white/70 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                  />
                  <span className="absolute bottom-2 right-2 text-[9px] text-white/20">
                    {frame.description.length}/200
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Generation Panel ── */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          AI Frame Generator
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-3 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            {/* Prompt input */}
            <label className="block text-xs font-medium text-white/50 mb-2">Scene Description</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the scene to generate... e.g. 'A dimly lit alleyway at night, rain-soaked cobblestones reflecting neon signs, a lone figure in a trench coat walking away from camera'"
              rows={4}
              disabled={!isUnlocked}
              className={cn(
                'w-full px-4 py-3 rounded-lg bg-black/30 border text-sm text-white/90 placeholder:text-white/20 resize-none focus:outline-none transition-colors',
                isUnlocked
                  ? 'border-white/[0.08] focus:border-[#E50914]/40'
                  : 'border-white/[0.04] text-white/20 cursor-not-allowed'
              )}
            />

            {/* Style + Aspect Ratio selectors */}
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-white/50 mb-2">Visual Style</label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  disabled={!isUnlocked}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg bg-black/30 border text-sm text-white/80 focus:outline-none transition-colors appearance-none cursor-pointer',
                    isUnlocked
                      ? 'border-white/[0.08] focus:border-[#E50914]/40'
                      : 'border-white/[0.04] text-white/20 cursor-not-allowed'
                  )}
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#111] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-white/50 mb-2">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  disabled={!isUnlocked}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg bg-black/30 border text-sm text-white/80 focus:outline-none transition-colors appearance-none cursor-pointer',
                    isUnlocked
                      ? 'border-white/[0.08] focus:border-[#E50914]/40'
                      : 'border-white/[0.04] text-white/20 cursor-not-allowed'
                  )}
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar.value} value={ar.value} className="bg-[#111] text-white">
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateFromPrompt}
                  disabled={!isUnlocked || !aiPrompt.trim() || batchGenerating}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                    isUnlocked && aiPrompt.trim() && !batchGenerating
                      ? 'bg-[#E50914] text-white hover:bg-[#B20710] active:scale-[0.97]'
                      : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Frame
                  <span className="text-[10px] opacity-60 ml-1">Included</span>
                </button>
              </div>
            </div>

            {/* Batch generate */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleBatchGenerate}
                disabled={!isUnlocked || batchGenerating || frames.filter((f) => !f.imageUrl).length === 0}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 w-full justify-center',
                  isUnlocked && !batchGenerating && frames.filter((f) => !f.imageUrl).length > 0
                    ? 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white'
                    : 'bg-white/[0.02] border border-white/[0.04] text-white/15 cursor-not-allowed'
                )}
              >
                {batchGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating {batchProgress.current} of {batchProgress.total}...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5" />
                    Generate All Empty Frames
                    {frames.filter((f) => !f.imageUrl).length > 0 && (
                      <span className="text-[10px] opacity-50 ml-1">
                        ({frames.filter((f) => !f.imageUrl).length} frame{frames.filter((f) => !f.imageUrl).length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <span className="text-xs font-medium text-white/40">Preview</span>
            </div>
            <div className={cn('relative bg-black/20', getAspectClass())}>
              {lastGenerated ? (
                <Image
                  src={lastGenerated}
                  alt="Last generated frame"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white/10 mb-2" />
                  <span className="text-xs text-white/20">No frame generated yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Scene Notes Section ── */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          Scene Notes
        </h2>

        <div className="space-y-2">
          {frames.map((frame) => {
            const isExpanded = expandedNotes === frame.id

            return (
              <div
                key={frame.id}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-300"
              >
                {/* Collapse header */}
                <button
                  onClick={() => setExpandedNotes(isExpanded ? null : frame.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[10px] font-bold text-white/30">
                      {frame.id}
                    </div>
                    <span className="text-sm font-medium text-white/70">{frame.label}</span>
                    {frame.shotType && (
                      <span className="px-1.5 py-0.5 rounded bg-[#E50914]/10 text-[10px] font-medium text-[#E50914]/80">
                        {frame.shotType}
                      </span>
                    )}
                    {(frame.notes || frame.cameraAngle || frame.lighting) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 text-white/20 transition-transform duration-200',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>

                {/* Expandable content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/[0.04]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-2">
                          Director Notes
                        </label>
                        <textarea
                          value={frame.notes}
                          onChange={(e) => updateFrameField(frame.id, 'notes', e.target.value)}
                          placeholder="Action, emotion, pacing..."
                          rows={3}
                          disabled={!isUnlocked}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-2">
                          Camera Angle
                        </label>
                        <textarea
                          value={frame.cameraAngle}
                          onChange={(e) => updateFrameField(frame.id, 'cameraAngle', e.target.value)}
                          placeholder="Wide shot, close-up, over-the-shoulder..."
                          rows={3}
                          disabled={!isUnlocked}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-2">
                          Lighting
                        </label>
                        <textarea
                          value={frame.lighting}
                          onChange={(e) => updateFrameField(frame.id, 'lighting', e.target.value)}
                          placeholder="Natural, low-key, neon, golden hour..."
                          rows={3}
                          disabled={!isUnlocked}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Tips Panel ── */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="h-4 w-4 text-amber-400/60" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Storyboarding Tips
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map((tip, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-[10px] font-bold text-amber-400/60 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-1.5 group-hover:text-amber-400/80 transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CreateLayout>
  )
}
