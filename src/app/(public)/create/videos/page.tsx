'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Video,
  Lock,
  Sparkles,
  Play,
  Pause,
  Square,
  Trash2,
  RefreshCw,
  Film,
  Clock,
  Monitor,
  Gauge,
  ChevronDown,
  GripHorizontal,
  ArrowRight,
  Clapperboard,
  Loader2,
  Plus,
  X,
  Check,
  Eye,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const DURATIONS = ['5s', '10s', '15s', '30s']
const RESOLUTIONS = ['720p', '1080p', '4K']
const FRAME_RATES = ['24fps', '30fps', '60fps']
const TRANSITIONS = ['Cut', 'Fade', 'Dissolve', 'Wipe']

const SCENES = [
  'Scene 1 - Opening',
  'Scene 2 - Discovery',
  'Scene 3 - Confrontation',
  'Scene 4 - Climax',
]

const VIDEO_THUMBNAILS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=225&q=80',
]

const GENERATION_STEPS = [
  'Analyzing scene description...',
  'Composing visual frames...',
  'Rendering motion data...',
  'Applying cinematic effects...',
  'Finalizing video clip...',
]

interface Clip {
  id: number
  scene: string
  duration: string
  label: string
  thumbnail: string
  timestamp: string
}

interface TimelineClip extends Clip {
  timelineId: string
}

const DEFAULT_CLIPS: Clip[] = [
  { id: 1, scene: 'Scene 1', duration: '10s', label: 'Opening wide shot', thumbnail: VIDEO_THUMBNAILS[0], timestamp: new Date().toISOString() },
  { id: 2, scene: 'Scene 1', duration: '5s', label: 'Character close-up', thumbnail: VIDEO_THUMBNAILS[1], timestamp: new Date().toISOString() },
  { id: 3, scene: 'Scene 2', duration: '15s', label: 'Forest tracking shot', thumbnail: VIDEO_THUMBNAILS[2], timestamp: new Date().toISOString() },
  { id: 4, scene: 'Scene 3', duration: '10s', label: 'Interior confrontation', thumbnail: VIDEO_THUMBNAILS[3], timestamp: new Date().toISOString() },
]

/* ── Helpers ── */

function parseDuration(d: string): number {
  return parseInt(d.replace('s', ''), 10)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function randomThumbnail(): string {
  return VIDEO_THUMBNAILS[Math.floor(Math.random() * VIDEO_THUMBNAILS.length)]
}

function LockOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-not-allowed">
      <Lock className="h-8 w-8 text-white/20" />
      <p className="text-sm text-white/30 font-medium">Complete previous steps to unlock</p>
    </div>
  )
}

/* ── Page ── */

export default function VideosPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()
  const [selectedScene, setSelectedScene] = useState(SCENES[0])
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState('10s')
  const [resolution, setResolution] = useState('1080p')
  const [frameRate, setFrameRate] = useState('24fps')

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(-1)
  const [generationError, setGenerationError] = useState('')

  // Clips library
  const [clips, setClips] = useState<Clip[]>(DEFAULT_CLIPS)
  const [playingClipId, setPlayingClipId] = useState<number | null>(null)
  const [clipPlaybackProgress, setClipPlaybackProgress] = useState(0)

  // Timeline
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([])
  const [selectedTransitions, setSelectedTransitions] = useState<Record<number, string>>({})
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [tooltipClip, setTooltipClip] = useState<string | null>(null)
  const [showAddFromLibrary, setShowAddFromLibrary] = useState(false)

  // Preview
  const [previewPlaying, setPreviewPlaying] = useState(false)
  const [previewPaused, setPreviewPaused] = useState(false)
  const [previewTime, setPreviewTime] = useState(0)
  const previewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nextClipId = useRef(5)

  if (!loaded) return null

  const unlocked = isStepUnlocked('videos', CREATE_STEPS)

  const totalTimelineDuration = timelineClips.reduce((sum, c) => sum + parseDuration(c.duration), 0)

  /* ── Generation ── */
  function handleGenerate() {
    if (prompt.length < 10) {
      setGenerationError('Prompt must be at least 10 characters.')
      return
    }
    setGenerationError('')
    setIsGenerating(true)
    setGenerationStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= GENERATION_STEPS.length) {
        clearInterval(interval)
        // Add new clip
        const newClip: Clip = {
          id: nextClipId.current++,
          scene: selectedScene.split(' - ')[0],
          duration: duration,
          label: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          thumbnail: randomThumbnail(),
          timestamp: new Date().toISOString(),
        }
        setClips(prev => [...prev, newClip])
        setIsGenerating(false)
        setGenerationStep(-1)
        setPrompt('')
      } else {
        setGenerationStep(step)
      }
    }, 700)
  }

  /* ── Clip Playback Simulation ── */
  function handlePlayClip(clip: Clip) {
    if (playingClipId === clip.id) {
      setPlayingClipId(null)
      setClipPlaybackProgress(0)
      return
    }
    setPlayingClipId(clip.id)
    setClipPlaybackProgress(0)
    const dur = parseDuration(clip.duration) * 1000
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / dur, 1)
      setClipPlaybackProgress(progress)
      if (progress >= 1) {
        clearInterval(interval)
        setTimeout(() => {
          setPlayingClipId(null)
          setClipPlaybackProgress(0)
        }, 300)
      }
    }, 50)
  }

  /* ── Clip Actions ── */
  function handleRefreshClip(id: number) {
    setClips(prev => prev.map(c => c.id === id ? { ...c, thumbnail: randomThumbnail() } : c))
  }

  function handleDeleteClip(id: number) {
    setClips(prev => prev.filter(c => c.id !== id))
  }

  function handleUseClip(clip: Clip) {
    const tc: TimelineClip = { ...clip, timelineId: `tl-${Date.now()}-${Math.random()}` }
    setTimelineClips(prev => [...prev, tc])
  }

  /* ── Timeline DnD ── */
  function handleDragStart(index: number) {
    setDragIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    setDragOverIndex(index)
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    setTimelineClips(prev => {
      const updated = [...prev]
      const [moved] = updated.splice(dragIndex, 1)
      updated.splice(index, 0, moved)
      return updated
    })
    setDragIndex(null)
    setDragOverIndex(null)
  }

  function handleRemoveFromTimeline(timelineId: string) {
    setTimelineClips(prev => prev.filter(c => c.timelineId !== timelineId))
  }

  /* ── Preview Playback ── */
  function getCurrentPreviewClip(): { clip: TimelineClip; clipStart: number; clipIndex: number } | null {
    let accum = 0
    for (let i = 0; i < timelineClips.length; i++) {
      const dur = parseDuration(timelineClips[i].duration)
      if (previewTime < accum + dur) {
        return { clip: timelineClips[i], clipStart: accum, clipIndex: i }
      }
      accum += dur
    }
    return null
  }

  function startPreview() {
    if (timelineClips.length === 0) return
    setPreviewPlaying(true)
    setPreviewPaused(false)
    if (previewTime >= totalTimelineDuration) setPreviewTime(0)

    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current)
    const startedAt = Date.now()
    const startOffset = previewTime >= totalTimelineDuration ? 0 : previewTime
    previewIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000
      const newTime = startOffset + elapsed
      if (newTime >= totalTimelineDuration) {
        setPreviewTime(totalTimelineDuration)
        setPreviewPlaying(false)
        setPreviewPaused(false)
        if (previewIntervalRef.current) clearInterval(previewIntervalRef.current)
      } else {
        setPreviewTime(newTime)
      }
    }, 50)
  }

  function pausePreview() {
    setPreviewPaused(true)
    setPreviewPlaying(false)
    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current)
  }

  function stopPreview() {
    setPreviewPlaying(false)
    setPreviewPaused(false)
    setPreviewTime(0)
    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current)
  }

  const currentPreview = getCurrentPreviewClip()

  return (
    <CreateLayout
      currentStepId="videos"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('videos')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <Video className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Produce Your <span className="text-[#E50914]">Videos</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Generate cinematic video clips, assemble them on a timeline, and craft seamless transitions between scenes.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Clapperboard, title: 'Select Scenes', desc: 'Pick scenes from your storyboard and describe the motion you envision.' },
            { icon: Sparkles, title: 'Generate Clips', desc: 'AI produces video clips matching your cinematic descriptions and settings.' },
            { icon: Film, title: 'Assemble Sequence', desc: 'Arrange clips on the timeline with transitions to build your final cut.' },
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

      {/* ═══ VIDEO GENERATION ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Video Generation</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: prompt + generate */}
          <div className="lg:col-span-2 space-y-4">
            {/* Scene selector */}
            <div>
              <label className="text-xs text-white/40 mb-2 block">Scene</label>
              <select
                value={selectedScene}
                onChange={(e) => setSelectedScene(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
              >
                {SCENES.map((s) => (
                  <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <div>
              <textarea
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); setGenerationError('') }}
                placeholder="Describe the video clip... e.g. Camera slowly dollies forward through a foggy forest, morning light breaking through the canopy, particles floating in the air"
                rows={5}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 resize-none focus:outline-none focus:border-[#E50914]/40 transition-colors"
              />
              {generationError && (
                <p className="text-xs text-red-400 mt-1">{generationError}</p>
              )}
              <p className="text-[10px] text-white/20 mt-1">{prompt.length} characters (minimum 10)</p>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-colors',
                isGenerating
                  ? 'bg-[#E50914]/50 cursor-not-allowed'
                  : 'bg-[#E50914] hover:bg-[#B20710]'
              )}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Video Clip'}
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>
            </button>

            {/* Progress indicator */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-3 font-medium">Generation Progress</p>
              <div className="space-y-2">
                {GENERATION_STEPS.map((step, i) => {
                  const isActive = isGenerating && i === generationStep
                  const isComplete = isGenerating && i < generationStep
                  const isIdle = !isGenerating && generationStep === -1
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                        isComplete
                          ? 'bg-green-500/20 border border-green-500/40'
                          : isActive
                          ? 'bg-[#E50914]/20 border border-[#E50914]/40'
                          : 'bg-white/[0.04] border border-white/[0.06]'
                      )}>
                        {isComplete ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : isActive ? (
                          <Loader2 className="h-3 w-3 text-[#E50914] animate-spin" />
                        ) : (
                          <span className="text-[8px] text-white/20">{i + 1}</span>
                        )}
                      </div>
                      <span className={cn(
                        'text-xs transition-all duration-300',
                        isComplete ? 'text-green-400/70' : isActive ? 'text-white/60' : 'text-white/20'
                      )}>
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#E50914] transition-all duration-500"
                  style={{
                    width: isGenerating
                      ? `${((generationStep + 1) / GENERATION_STEPS.length) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: settings */}
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              {/* Duration */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 text-white/40" />
                  <label className="text-xs text-white/40">Duration</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        duration === d
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-3.5 w-3.5 text-white/40" />
                  <label className="text-xs text-white/40">Resolution</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {RESOLUTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        resolution === r
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Rate */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="h-3.5 w-3.5 text-white/40" />
                  <label className="text-xs text-white/40">Frame Rate</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FRAME_RATES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrameRate(f)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        frameRate === f
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLIPS LIBRARY ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white/80">Clips Library</h2>
          <span className="text-xs text-white/30">{clips.length} clips</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clips.map((clip) => {
            const isPlayingThis = playingClipId === clip.id
            return (
              <div
                key={clip.id}
                className="group rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-white/[0.01] overflow-hidden">
                  <img
                    src={clip.thumbnail}
                    alt={clip.label}
                    className="w-full h-full object-cover"
                  />

                  {/* Playback overlay */}
                  {isPlayingThis && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                      <Play className="h-6 w-6 text-white/60 mb-2" />
                      <p className="text-[10px] text-white/50 mb-2">Playing...</p>
                      <div className="w-3/4 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-[#E50914] rounded-full transition-all duration-100"
                          style={{ width: `${clipPlaybackProgress * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Play button */}
                  {!isPlayingThis && (
                    <button
                      onClick={() => handlePlayClip(clip)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E50914]/90 flex items-center justify-center backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      </div>
                    </button>
                  )}

                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white/80 font-medium backdrop-blur-sm z-20">
                    {clip.duration}
                  </span>
                  {/* Scene label */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#E50914]/80 text-[10px] text-white font-medium z-20">
                    {clip.scene}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-white/60 mb-3 font-medium truncate">{clip.label}</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleUseClip(clip)}
                      className="flex-1 py-1.5 rounded-md text-[10px] font-medium bg-[#E50914]/80 text-white hover:bg-[#E50914] transition-colors"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleRefreshClip(clip.id)}
                      className="py-1.5 px-2 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteClip(clip.id)}
                      className="py-1.5 px-2 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ PREVIEW SECTION ═══ */}
      {timelineClips.length > 0 && (
        <section className="relative mb-8">
          {!unlocked && <LockOverlay />}
          <h2 className="text-lg font-bold text-white/80 mb-6">Preview</h2>

          <div className="rounded-xl bg-black border border-white/[0.06] overflow-hidden">
            {/* Player viewport */}
            <div className="relative aspect-video max-h-[360px] bg-black flex items-center justify-center overflow-hidden">
              {currentPreview && (previewPlaying || previewPaused) ? (
                <>
                  <img
                    src={currentPreview.clip.thumbnail}
                    alt={currentPreview.clip.label}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs text-white/70 font-medium mb-1">{currentPreview.clip.label}</p>
                    <p className="text-[10px] text-white/40">{currentPreview.clip.scene} &middot; Clip {currentPreview.clipIndex + 1} of {timelineClips.length}</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Eye className="h-10 w-10 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/30">Click play to preview your sequence</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-3 bg-white/[0.02] border-t border-white/[0.06]">
              {/* Progress bar */}
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-3 cursor-pointer">
                <div
                  className="h-full bg-[#E50914] rounded-full transition-all duration-100"
                  style={{ width: totalTimelineDuration > 0 ? `${(previewTime / totalTimelineDuration) * 100}%` : '0%' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!previewPlaying ? (
                    <button
                      onClick={startPreview}
                      className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center hover:bg-[#B20710] transition-colors"
                    >
                      <Play className="h-4 w-4 text-white ml-0.5" />
                    </button>
                  ) : (
                    <button
                      onClick={pausePreview}
                      className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center hover:bg-[#B20710] transition-colors"
                    >
                      <Pause className="h-4 w-4 text-white" />
                    </button>
                  )}
                  <button
                    onClick={stopPreview}
                    className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] transition-colors"
                  >
                    <Square className="h-3.5 w-3.5 text-white/60" />
                  </button>
                </div>
                <div className="text-xs text-white/40 font-mono">
                  {formatTime(previewTime)} / {formatTime(totalTimelineDuration)}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ TIMELINE EDITOR ═══ */}
      <section className="relative mb-8">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white/80">Timeline Editor</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddFromLibrary(!showAddFromLibrary)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 hover:text-white/70 hover:bg-white/[0.08] transition-all"
            >
              <Plus className="h-3 w-3" />
              Add Clip
            </button>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock className="h-3.5 w-3.5" />
              Total: <span className="text-white/70 font-semibold">{formatTime(totalTimelineDuration)}</span>
            </div>
          </div>
        </div>

        {/* Add from library dropdown */}
        {showAddFromLibrary && (
          <div className="mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/50 font-medium">Select a clip to add</p>
              <button onClick={() => setShowAddFromLibrary(false)} className="text-white/30 hover:text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {clips.map(clip => (
                <button
                  key={clip.id}
                  onClick={() => { handleUseClip(clip); setShowAddFromLibrary(false) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-[#E50914]/30 hover:bg-white/[0.06] transition-all"
                >
                  <img src={clip.thumbnail} alt="" className="w-8 h-5 rounded object-cover" />
                  <span className="text-xs text-white/60">{clip.label}</span>
                  <span className="text-[10px] text-white/30">{clip.duration}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          {/* Timeline bar */}
          {timelineClips.length === 0 ? (
            <div className="flex items-center justify-center min-h-[80px] rounded-lg border border-dashed border-white/[0.08] text-white/20 text-xs">
              <p>No clips yet. Use "Use" on a clip or click "Add Clip" above.</p>
            </div>
          ) : (
            <div className="flex items-stretch gap-0 mb-4 min-h-[80px] rounded-lg overflow-hidden border border-white/[0.06]">
              {timelineClips.map((clip, i) => {
                const dur = parseDuration(clip.duration)
                const minW = Math.max(70, dur * 8)
                return (
                  <div key={clip.timelineId} className="flex items-stretch">
                    {/* Clip block */}
                    <div
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDrop={() => handleDrop(i)}
                      onDragEnd={() => { setDragIndex(null); setDragOverIndex(null) }}
                      onClick={() => setTooltipClip(tooltipClip === clip.timelineId ? null : clip.timelineId)}
                      className={cn(
                        'group/clip relative flex flex-col items-center justify-center px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-grab border-r border-white/[0.04]',
                        dragOverIndex === i && 'bg-[#E50914]/10 border-l-2 border-l-[#E50914]'
                      )}
                      style={{ minWidth: `${minW}px` }}
                    >
                      <GripHorizontal className="h-3 w-3 text-white/15 absolute top-1.5 left-1.5" />

                      {/* Remove button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFromTimeline(clip.timelineId) }}
                        className="absolute top-1 right-1 opacity-0 group-hover/clip:opacity-100 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/40 transition-all"
                      >
                        <X className="h-3 w-3 text-red-400" />
                      </button>

                      {/* Thumbnail mini */}
                      <div className="w-10 h-6 rounded overflow-hidden mb-1">
                        <img src={clip.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-white/50 font-medium truncate max-w-full">{clip.label}</span>
                      <span className="text-[9px] text-white/30">{clip.duration}</span>

                      {/* Tooltip */}
                      {tooltipClip === clip.timelineId && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.1] shadow-xl min-w-[180px]">
                          <img src={clip.thumbnail} alt="" className="w-full h-20 rounded object-cover mb-2" />
                          <p className="text-xs text-white/80 font-medium mb-1">{clip.label}</p>
                          <p className="text-[10px] text-white/40">{clip.scene} &middot; {clip.duration}</p>
                        </div>
                      )}
                    </div>

                    {/* Transition selector */}
                    {i < timelineClips.length - 1 && (
                      <div className="flex items-center px-1">
                        <select
                          value={selectedTransitions[i] || 'Cut'}
                          onChange={(e) =>
                            setSelectedTransitions((prev) => ({ ...prev, [i]: e.target.value }))
                          }
                          className="bg-[#E50914]/10 border border-[#E50914]/20 rounded px-1.5 py-1 text-[9px] text-[#E50914] font-medium focus:outline-none cursor-pointer appearance-none text-center w-[60px]"
                        >
                          {TRANSITIONS.map((t) => (
                            <option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Transitions legend */}
          <div className="flex items-center gap-4 text-[10px] text-white/30">
            <span>Transitions:</span>
            {TRANSITIONS.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/40">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
