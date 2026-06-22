'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircle,
  Sparkles,
  Plus,
  Search,
  Camera,
  Upload,
  Wand2,
  Star,
  Lock,
  Check,
  ChevronRight,
  ArrowRight,
  Users,
  Heart,
  Mic,
  UserPlus,
  RefreshCw,
  GripVertical,
  Play,
  RotateCcw,
  FileText,
  Tag,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const AI_ACTORS = [
  { id: 1, name: 'Marcus Kane', style: 'Dramatic', gender: 'Male', age: '30-40', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.9 },
  { id: 2, name: 'Elena Vasquez', style: 'Comedy', gender: 'Female', age: '25-35', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.8 },
  { id: 3, name: 'James Alderton', style: 'Action', gender: 'Male', age: '35-45', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.7 },
  { id: 4, name: 'Sophia Ren', style: 'Dramatic', gender: 'Female', age: '20-30', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.9 },
  { id: 5, name: 'Ethan Cross', style: 'Action', gender: 'Male', age: '25-35', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.6 },
  { id: 6, name: 'Ava Mitchell', style: 'Comedy', gender: 'Female', age: '30-40', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.8 },
  { id: 7, name: 'Daniel Reyes', style: 'Dramatic', gender: 'Male', age: '40-50', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.5 },
  { id: 8, name: 'Clara Dubois', style: 'Action', gender: 'Female', age: '25-35', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.7 },
]

const GENERATED_PORTRAITS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&h=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=400&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400&q=80',
]

const STYLE_OPTIONS = ['All', 'Dramatic', 'Comedy', 'Action'] as const
const GENDER_OPTIONS = ['All', 'Male', 'Female'] as const
const AGE_OPTIONS = ['All', '20-30', '25-35', '30-40', '35-45', '40-50'] as const
const CHARACTER_STYLES = ['Realistic', 'Stylized', 'Animated'] as const
const ROLE_OPTIONS = ['Lead', 'Supporting', 'Cameo'] as const
const VOICE_TYPES = ['Deep', 'Medium', 'High', 'Raspy', 'Soft', 'Authoritative'] as const
const SCREEN_TIME_OPTIONS = ['Major', 'Moderate', 'Brief'] as const
const RELATIONSHIP_OPTIONS = ['Define relationship...', 'Allies', 'Rivals', 'Lovers', 'Siblings', 'Mentor & Student', 'Enemies', 'Strangers'] as const

const RELATIONSHIP_COLORS: Record<string, string> = {
  'Allies': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Rivals': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Lovers': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  'Siblings': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Mentor & Student': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Enemies': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Strangers': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
}

type CastMember = {
  id: number
  name: string
  characterName: string
  role: (typeof ROLE_OPTIONS)[number]
  image: string
  dialogueLines: number
  screenTime: (typeof SCREEN_TIME_OPTIONS)[number]
}

type GeneratedCharacter = {
  name: string
  age: string
  traits: string
  appearance: string
  style: string
  backstory: string
  motivation: string
  voiceType: string
  image: string
}

type Tab = 'browse' | 'create' | 'yourself'

/* ── Component ── */

export default function CastingPage() {
  const { completedSteps, markComplete, loaded } = useCreateProgress()

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('browse')

  // Browse tab state
  const [searchQuery, setSearchQuery] = useState('')
  const [styleFilter, setStyleFilter] = useState<string>('All')
  const [genderFilter, setGenderFilter] = useState<string>('All')
  const [ageFilter, setAgeFilter] = useState<string>('All')

  // Create tab state
  const [charName, setCharName] = useState('')
  const [charAge, setCharAge] = useState('')
  const [charTraits, setCharTraits] = useState('')
  const [charAppearance, setCharAppearance] = useState('')
  const [charStyle, setCharStyle] = useState<(typeof CHARACTER_STYLES)[number]>('Realistic')
  const [charBackstory, setCharBackstory] = useState('')
  const [charMotivation, setCharMotivation] = useState('')
  const [charVoiceType, setCharVoiceType] = useState<string>('Medium')

  // Character generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedChar, setGeneratedChar] = useState<GeneratedCharacter | null>(null)
  const [generateError, setGenerateError] = useState('')

  // Marketplace pricing state
  const [listOnMarketplace, setListOnMarketplace] = useState(false)
  const [marketplacePrice, setMarketplacePrice] = useState<number>(5)
  const [autoGenerateTags, setAutoGenerateTags] = useState(true)

  // Insert yourself tab state
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<{ url: string; name: string; size: string } | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [voiceCaptured, setVoiceCaptured] = useState(false)
  const [capturedDuration, setCapturedDuration] = useState(0)
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cast list
  const [castList, setCastList] = useState<CastMember[]>([])

  // Relationships state
  const [relationships, setRelationships] = useState<Record<string, string>>({})

  // Drag reorder state
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  // Lock check
  const isLocked = !loaded || !isStepUnlocked('casting')

  function isStepUnlocked(stepId: string) {
    const idx = CREATE_STEPS.findIndex((s) => s.id === stepId)
    if (idx === 0) return true
    for (let i = 0; i < idx; i++) {
      if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
    }
    return true
  }

  // Filter actors
  const filteredActors = AI_ACTORS.filter((actor) => {
    if (searchQuery && !actor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (styleFilter !== 'All' && actor.style !== styleFilter) return false
    if (genderFilter !== 'All' && actor.gender !== genderFilter) return false
    if (ageFilter !== 'All' && actor.age !== ageFilter) return false
    return true
  })

  // Next available ID for custom characters
  const nextId = useRef(100)

  function castActor(actor: (typeof AI_ACTORS)[0]) {
    if (castList.find((c) => c.id === actor.id)) return
    setCastList((prev) => [
      ...prev,
      { id: actor.id, name: actor.name, characterName: '', role: 'Supporting', image: actor.image, dialogueLines: 0, screenTime: 'Moderate' },
    ])
  }

  function removeCast(id: number) {
    setCastList((prev) => prev.filter((c) => c.id !== id))
  }

  function updateCast(id: number, field: keyof CastMember, value: string | number) {
    setCastList((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  // Character generation
  function handleGenerate() {
    setGenerateError('')
    if (!charName.trim()) {
      setGenerateError('Character name is required.')
      return
    }
    if (!charAge && !charTraits && !charAppearance && !charBackstory && !charMotivation) {
      setGenerateError('Please fill in at least one field besides the name.')
      return
    }
    setIsGenerating(true)
    setGeneratedChar(null)
    const delay = 2000 + Math.random() * 1000
    setTimeout(() => {
      const portrait = GENERATED_PORTRAITS[Math.floor(Math.random() * GENERATED_PORTRAITS.length)]
      setGeneratedChar({
        name: charName,
        age: charAge,
        traits: charTraits,
        appearance: charAppearance,
        style: charStyle,
        backstory: charBackstory,
        motivation: charMotivation,
        voiceType: charVoiceType,
        image: portrait,
      })
      setIsGenerating(false)
    }, delay)
  }

  function handleRegenerate() {
    handleGenerate()
  }

  function addGeneratedToCast() {
    if (!generatedChar) return
    const id = nextId.current++
    setCastList((prev) => [
      ...prev,
      { id, name: generatedChar.name, characterName: generatedChar.name, role: 'Supporting', image: generatedChar.image, dialogueLines: 0, screenTime: 'Moderate' },
    ])
  }

  // Auto-generated tags from character fields
  function getAutoTags(): string[] {
    const tags: string[] = []
    if (charTraits) charTraits.split(',').forEach((t) => { const trimmed = t.trim(); if (trimmed) tags.push(trimmed) })
    if (charStyle) tags.push(charStyle)
    if (charAge) tags.push(`Age ${charAge}`)
    if (charVoiceType) tags.push(`${charVoiceType} voice`)
    return tags.slice(0, 8)
  }

  // Photo upload
  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    const sizeKB = (file.size / 1024).toFixed(1)
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const sizeLabel = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
    const url = URL.createObjectURL(file)
    setUploadedPhoto({ url, name: file.name, size: sizeLabel })
    setScanComplete(false)
    setIsScanning(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  function handleScanFace() {
    setIsScanning(true)
    const delay = 2000 + Math.random() * 1000
    setTimeout(() => {
      setIsScanning(false)
      setScanComplete(true)
    }, delay)
  }

  // Voice recording simulation
  function startRecording() {
    setIsRecording(true)
    setVoiceCaptured(false)
    setRecordingSeconds(0)
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1)
    }, 1000)
  }

  function stopRecording() {
    setIsRecording(false)
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    setCapturedDuration(recordingSeconds)
    setVoiceCaptured(true)
  }

  function reRecord() {
    setVoiceCaptured(false)
    setRecordingSeconds(0)
    setCapturedDuration(0)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    }
  }, [])

  // Format seconds as m:ss
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Relationships
  function setRelationship(aId: number, bId: number, value: string) {
    const key = `${Math.min(aId, bId)}-${Math.max(aId, bId)}`
    setRelationships((prev) => ({ ...prev, [key]: value }))
  }

  function getRelationship(aId: number, bId: number) {
    const key = `${Math.min(aId, bId)}-${Math.max(aId, bId)}`
    return relationships[key] || 'Define relationship...'
  }

  // Cast drag reorder
  function handleDragStart(idx: number) {
    setDragIdx(idx)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setDragOverIdx(idx)
  }

  function handleDragEnd() {
    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
      setCastList((prev) => {
        const newList = [...prev]
        const [removed] = newList.splice(dragIdx, 1)
        newList.splice(dragOverIdx, 0, removed)
        return newList
      })
    }
    setDragIdx(null)
    setDragOverIdx(null)
  }

  if (!loaded) return null

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'browse', label: 'Browse AI Actors', icon: Users },
    { id: 'create', label: 'Create Custom Character', icon: UserPlus },
    { id: 'yourself', label: 'Insert Yourself', icon: Camera },
  ]

  return (
    <CreateLayout
      currentStepId="casting"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('casting')}
    >
      {/* ── Hero ── */}
      <section className="relative text-center mb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/[0.04] blur-[100px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5">
            <UserCircle className="h-7 w-7 text-[#E50914]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Cast Your <span className="text-[#E50914]">Characters</span>
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Build your dream cast. Browse AI actors, create custom characters from scratch, or insert yourself into your film.
          </p>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !isLocked && setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border',
              activeTab === tab.id
                ? 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]'
                : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="relative">
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-8">
              <Lock className="h-10 w-10 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-sm">Complete previous steps to unlock casting</p>
            </div>
          </div>
        )}

        {/* ─── Browse AI Actors ─── */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search AI actors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Style filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Style</span>
                  <div className="flex gap-1">
                    {STYLE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStyleFilter(s)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                          styleFilter === s
                            ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30'
                            : 'bg-white/[0.03] text-white/35 border border-white/[0.06] hover:text-white/50'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Gender filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Gender</span>
                  <div className="flex gap-1">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                          genderFilter === g
                            ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30'
                            : 'bg-white/[0.03] text-white/35 border border-white/[0.06] hover:text-white/50'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Age filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Age</span>
                  <div className="flex gap-1">
                    {AGE_OPTIONS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAgeFilter(a)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                          ageFilter === a
                            ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30'
                            : 'bg-white/[0.03] text-white/35 border border-white/[0.06] hover:text-white/50'
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredActors.map((actor) => {
                const alreadyCast = castList.some((c) => c.id === actor.id)
                return (
                  <div
                    key={actor.id}
                    className="group relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={actor.image}
                        alt={actor.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Rating */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] text-white/80 font-medium">{actor.rating}</span>
                      </div>

                      {/* Style badge */}
                      <div className="absolute top-2 left-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-sm',
                          actor.style === 'Dramatic' && 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                          actor.style === 'Comedy' && 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                          actor.style === 'Action' && 'bg-red-500/20 text-red-300 border-red-500/30',
                        )}>
                          {actor.style}
                        </span>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="text-sm font-semibold text-white mb-0.5">{actor.name}</h4>
                        <p className="text-[10px] text-white/50">{actor.gender} &middot; {actor.age}</p>
                      </div>
                    </div>

                    {/* Cast button */}
                    <div className="p-2.5">
                      <button
                        onClick={() => castActor(actor)}
                        disabled={alreadyCast}
                        className={cn(
                          'w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5',
                          alreadyCast
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#E50914] text-white hover:bg-[#FF2D2D] hover:shadow-[0_0_16px_rgba(229,9,20,0.25)]'
                        )}
                      >
                        {alreadyCast ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Cast
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Cast
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredActors.length === 0 && (
              <div className="text-center py-12 text-white/30 text-sm">
                No actors match your filters. Try adjusting your search.
              </div>
            )}

            {/* Browse all link */}
            <div className="text-center pt-2">
              <Link
                href="/actors"
                className="inline-flex items-center gap-2 text-sm text-[#E50914] hover:text-[#FF2D2D] transition-colors font-medium"
              >
                Browse all actors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ─── Create Custom Character ─── */}
        {activeTab === 'create' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-[#E50914]" />
                  Character Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Character Name <span className="text-[#E50914]">*</span></label>
                    <input
                      type="text"
                      value={charName}
                      onChange={(e) => setCharName(e.target.value)}
                      placeholder="e.g. Detective Noir"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Age</label>
                    <input
                      type="text"
                      value={charAge}
                      onChange={(e) => setCharAge(e.target.value)}
                      placeholder="e.g. 35"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Personality Traits</label>
                    <input
                      type="text"
                      value={charTraits}
                      onChange={(e) => setCharTraits(e.target.value)}
                      placeholder="e.g. Brooding, intelligent, haunted by past"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Appearance Description</label>
                    <textarea
                      value={charAppearance}
                      onChange={(e) => setCharAppearance(e.target.value)}
                      placeholder="Describe the character's physical appearance, clothing style, distinguishing features..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Backstory</label>
                    <textarea
                      value={charBackstory}
                      onChange={(e) => setCharBackstory(e.target.value)}
                      placeholder="Brief character backstory... Where do they come from? What shaped them?"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Motivation</label>
                    <input
                      type="text"
                      value={charMotivation}
                      onChange={(e) => setCharMotivation(e.target.value)}
                      placeholder="What drives this character? e.g. Seeking justice for a past wrong"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                    />
                  </div>

                  {/* Voice Type selector */}
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2">Voice Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {VOICE_TYPES.map((vt) => (
                        <button
                          key={vt}
                          onClick={() => setCharVoiceType(vt)}
                          className={cn(
                            'py-2 rounded-xl text-xs font-medium border transition-all duration-200',
                            charVoiceType === vt
                              ? 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]'
                              : 'bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/50'
                          )}
                        >
                          {vt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style options */}
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2">Visual Style</label>
                    <div className="flex gap-2">
                      {CHARACTER_STYLES.map((style) => (
                        <button
                          key={style}
                          onClick={() => setCharStyle(style)}
                          className={cn(
                            'flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200',
                            charStyle === style
                              ? 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]'
                              : 'bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/50'
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {generateError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400">{generateError}</p>
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={cn(
                    'w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2',
                    isGenerating
                      ? 'bg-[#E50914]/50 cursor-not-allowed'
                      : 'bg-[#E50914] hover:bg-[#FF2D2D] hover:shadow-[0_0_24px_rgba(229,9,20,0.3)]'
                  )}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating your character...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Character
                      <span className="text-[10px] ml-1 px-2 py-0.5 rounded-full bg-white/10">Included</span>
                    </>
                  )}
                </button>
              </div>

              {/* Marketplace Pricing Section */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#E50914]" />
                  Marketplace
                </h3>

                {/* List toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/60">List on Marketplace</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Make this character available for others to use</p>
                  </div>
                  <button
                    onClick={() => setListOnMarketplace(!listOnMarketplace)}
                    className="shrink-0"
                  >
                    {listOnMarketplace ? (
                      <ToggleRight className="h-7 w-7 text-[#E50914]" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-white/20" />
                    )}
                  </button>
                </div>

                {listOnMarketplace && (
                  <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                    {/* Price input */}
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1.5">Set your price (min 1)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30 font-medium">&euro;</span>
                        <input
                          type="number"
                          min={1}
                          value={marketplacePrice}
                          onChange={(e) => setMarketplacePrice(Math.max(1, Number(e.target.value)))}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#E50914]/40 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Commission notice */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-[11px] text-white/35">
                        Platform takes <span className="text-white/60 font-medium">30% commission</span>. You earn{' '}
                        <span className="text-emerald-400 font-medium">&euro;{(marketplacePrice * 0.7).toFixed(2)}</span> per sale.
                      </p>
                    </div>

                    {/* Auto-generate tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-white/30" />
                        <p className="text-xs text-white/50">Auto-generate tags</p>
                      </div>
                      <button onClick={() => setAutoGenerateTags(!autoGenerateTags)}>
                        {autoGenerateTags ? (
                          <ToggleRight className="h-6 w-6 text-[#E50914]" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-white/20" />
                        )}
                      </button>
                    </div>

                    {/* Tags preview */}
                    {autoGenerateTags && (
                      <div className="flex flex-wrap gap-1.5">
                        {getAutoTags().length > 0 ? (
                          getAutoTags().map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.04] border border-white/[0.08] text-white/40"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-[10px] text-white/20 italic">Fill in character details to auto-generate tags</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Preview area */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center min-h-[400px]">
              {isGenerating ? (
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <RefreshCw className="h-10 w-10 text-[#E50914]/40 animate-spin" />
                  </div>
                  <h4 className="text-sm font-semibold text-white/60 mb-2">Creating your character...</h4>
                  <p className="text-xs text-white/25">AI is generating a unique character based on your inputs.</p>
                </div>
              ) : generatedChar ? (
                <div className="w-full space-y-5">
                  {/* Generated portrait */}
                  <div className="relative w-full max-w-[240px] mx-auto aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.1]">
                    <Image
                      src={generatedChar.image}
                      alt={generatedChar.name}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-sm font-bold text-white">{generatedChar.name}</h4>
                      <p className="text-[10px] text-white/60">AI Generated &middot; {generatedChar.style}</p>
                    </div>
                  </div>

                  {/* Character details */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    {generatedChar.age && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/30 w-16 shrink-0">Age</span>
                        <span className="text-xs text-white/60">{generatedChar.age}</span>
                      </div>
                    )}
                    {generatedChar.traits && (
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-white/30 w-16 shrink-0 mt-0.5">Traits</span>
                        <span className="text-xs text-white/60">{generatedChar.traits}</span>
                      </div>
                    )}
                    {generatedChar.appearance && (
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-white/30 w-16 shrink-0 mt-0.5">Look</span>
                        <span className="text-xs text-white/60">{generatedChar.appearance}</span>
                      </div>
                    )}
                    {generatedChar.backstory && (
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-white/30 w-16 shrink-0 mt-0.5">Backstory</span>
                        <span className="text-xs text-white/60">{generatedChar.backstory}</span>
                      </div>
                    )}
                    {generatedChar.motivation && (
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-white/30 w-16 shrink-0 mt-0.5">Motivation</span>
                        <span className="text-xs text-white/60">{generatedChar.motivation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30 w-16 shrink-0">Voice</span>
                      <span className="text-xs text-white/60">{generatedChar.voiceType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30 w-16 shrink-0">Style</span>
                      <span className="text-xs text-white/60">{generatedChar.style}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={addGeneratedToCast}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-[#E50914] hover:bg-[#FF2D2D] transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(229,9,20,0.3)]"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cast
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="px-5 py-3 rounded-xl text-sm font-semibold text-white/60 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <UserCircle className="h-12 w-12 text-white/10" />
                  </div>
                  <h4 className="text-sm font-semibold text-white/50 mb-2">Character Preview</h4>
                  <p className="text-xs text-white/25 max-w-[200px]">
                    Fill in the character details and click Generate to see your character appear here.
                  </p>
                  {charName && (
                    <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
                      <p className="text-xs text-white/30 mb-1">Preview summary</p>
                      <p className="text-sm text-white/70 font-medium">{charName}</p>
                      {charAge && <p className="text-xs text-white/40 mt-1">Age: {charAge}</p>}
                      {charTraits && <p className="text-xs text-white/40 mt-1">Traits: {charTraits}</p>}
                      {charBackstory && <p className="text-xs text-white/40 mt-1">Backstory: {charBackstory}</p>}
                      {charMotivation && <p className="text-xs text-white/40 mt-1">Motivation: {charMotivation}</p>}
                      <p className="text-[10px] text-white/20 mt-2">Style: {charStyle} &middot; Voice: {charVoiceType}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Insert Yourself ─── */}
        {activeTab === 'yourself' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload zone */}
              <div className="space-y-5">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {!uploadedPhoto ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'relative p-10 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] cursor-pointer',
                      isDragging
                        ? 'border-[#E50914]/50 bg-[#E50914]/5'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                    )}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                      <Upload className="h-7 w-7 text-white/25" />
                    </div>
                    <h4 className="text-sm font-semibold text-white/60 mb-1">Upload Your Photo</h4>
                    <p className="text-xs text-white/30 text-center max-w-[240px] mb-4">
                      Drag and drop a clear headshot, or click to browse. For best results, use a well-lit, front-facing photo.
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/[0.1] transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                    {/* Photo preview */}
                    <div className="relative w-full max-w-[200px] mx-auto aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.1]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedPhoto.url}
                        alt="Uploaded photo"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* File info */}
                    <div className="text-center">
                      <p className="text-xs text-white/60 font-medium truncate">{uploadedPhoto.name}</p>
                      <p className="text-[10px] text-white/30">{uploadedPhoto.size}</p>
                    </div>

                    {/* Scan / status buttons */}
                    {scanComplete ? (
                      <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">Face mapped successfully</span>
                      </div>
                    ) : isScanning ? (
                      <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                        <span className="text-xs text-blue-400 font-medium">Scanning face...</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleScanFace}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#E50914] hover:bg-[#FF2D2D] transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(229,9,20,0.3)]"
                      >
                        <Camera className="h-4 w-4" />
                        Scan Face
                      </button>
                    )}

                    {/* Re-upload button */}
                    <button
                      onClick={() => { setUploadedPhoto(null); setScanComplete(false); setIsScanning(false) }}
                      className="w-full py-2 rounded-xl text-xs font-medium text-white/40 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                    >
                      Upload Different Photo
                    </button>
                  </div>
                )}

                {/* Face scan explanation */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Camera className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white/70 mb-1">AI Face Scanning</h4>
                      <p className="text-xs text-white/35 leading-relaxed">
                        Our AI will analyze your photo to create a realistic digital likeness. The scan captures facial structure, skin tone, and unique features to generate a consistent character model across all scenes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Voice recording */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h4 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                    <Mic className="h-4 w-4 text-[#E50914]" />
                    Record Your Voice
                  </h4>
                  <p className="text-xs text-white/35 mb-4 leading-relaxed">
                    Record a short voice sample so the AI can clone your voice for dialogue. Read the sample text naturally for best results.
                  </p>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                    <p className="text-xs text-white/25 italic leading-relaxed">
                      &ldquo;The rain fell softly on the empty streets. I turned up my collar and kept walking, knowing this night would change everything.&rdquo;
                    </p>
                  </div>

                  {voiceCaptured ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">
                          Voice sample captured ({capturedDuration} second{capturedDuration !== 1 ? 's' : ''})
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-1.5">
                          <Play className="h-3.5 w-3.5" />
                          Play
                        </button>
                        <button
                          onClick={reRecord}
                          className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Re-record
                        </button>
                      </div>
                    </div>
                  ) : isRecording ? (
                    <div className="space-y-3">
                      {/* Recording timer */}
                      <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm text-red-400 font-mono font-medium">{formatTime(recordingSeconds)}</span>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="w-full py-3 rounded-xl text-sm font-semibold border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Stop Recording
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-full py-3 rounded-xl text-sm font-semibold border border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914]/20 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </button>
                  )}
                </div>

                {/* Preview placeholder */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center min-h-[140px]">
                  {uploadedPhoto && scanComplete ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uploadedPhoto.url} alt="Your likeness" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-white/60 font-medium">AI Likeness Ready</p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {voiceCaptured ? 'Face + Voice mapped' : 'Face mapped. Record voice for full clone.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UserCircle className="h-10 w-10 text-white/10 mb-2" />
                      <p className="text-xs text-white/25 text-center">
                        Your AI likeness preview will appear here after uploading a photo.
                      </p>
                    </>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <p className="text-[11px] text-amber-400/60 leading-relaxed">
                    <strong className="text-amber-400/80">AI Likeness Rights:</strong> By uploading your photo and voice, you consent to the creation of an AI-generated likeness for use in your film. Your data is processed securely and never shared with third parties. You retain full ownership of your digital likeness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Cast List ── */}
      <section className="mt-12 relative">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="h-8 w-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-xs">Locked</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#E50914]" />
              Your Cast
              {castList.length > 0 && (
                <span className="text-xs font-normal text-white/30 ml-1">({castList.length} member{castList.length !== 1 ? 's' : ''})</span>
              )}
            </h3>
          </div>

          {castList.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="h-12 w-12 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-1">No characters cast yet</p>
              <p className="text-xs text-white/20">Browse AI actors or create custom characters to build your cast.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {castList.map((member, idx) => (
                <div
                  key={member.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border transition-colors group',
                    dragOverIdx === idx && dragIdx !== idx
                      ? 'border-[#E50914]/30 bg-[#E50914]/5'
                      : 'border-white/[0.06] hover:border-white/[0.1]'
                  )}
                >
                  {/* Drag handle */}
                  <div className="flex flex-col gap-0.5 text-white/15 cursor-grab active:cursor-grabbing shrink-0">
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                  </div>

                  {/* Photo */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>

                  {/* Name */}
                  <div className="min-w-[80px] shrink-0">
                    <p className="text-sm font-medium text-white/80">{member.name}</p>
                  </div>

                  {/* Role select */}
                  <select
                    value={member.role}
                    onChange={(e) => updateCast(member.id, 'role', e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 focus:outline-none focus:border-[#E50914]/40 appearance-none cursor-pointer shrink-0"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-[#1a1a1a]">{r}</option>
                    ))}
                  </select>

                  {/* Character name */}
                  <input
                    type="text"
                    value={member.characterName}
                    onChange={(e) => updateCast(member.id, 'characterName', e.target.value)}
                    placeholder="Character name..."
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />

                  {/* Dialogue Lines */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <FileText className="h-3 w-3 text-white/20" />
                    <input
                      type="number"
                      min={0}
                      value={member.dialogueLines}
                      onChange={(e) => updateCast(member.id, 'dialogueLines', Math.max(0, Number(e.target.value)))}
                      className="w-14 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 focus:outline-none focus:border-[#E50914]/40 text-center"
                      title="Dialogue lines"
                    />
                  </div>

                  {/* Screen Time */}
                  <select
                    value={member.screenTime}
                    onChange={(e) => updateCast(member.id, 'screenTime', e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 focus:outline-none focus:border-[#E50914]/40 appearance-none cursor-pointer shrink-0"
                    title="Screen time"
                  >
                    {SCREEN_TIME_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-[#1a1a1a]">{st}</option>
                    ))}
                  </select>

                  {/* Remove */}
                  <button
                    onClick={() => removeCast(member.id)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Remove from cast"
                  >
                    <Plus className="h-4 w-4 rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Character Relationships ── */}
      <section className="mt-8 relative">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="h-8 w-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-xs">Locked</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
            <Heart className="h-5 w-5 text-[#E50914]" />
            Character Relationships
          </h3>

          {castList.length < 2 ? (
            <div className="text-center py-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-white/10" />
                </div>
                <div className="w-8 h-px bg-white/[0.06]" />
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-dashed border-white/[0.08] flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white/10" />
                </div>
              </div>
              <p className="text-sm text-white/30 mb-1">Add at least two characters</p>
              <p className="text-xs text-white/20">Cast multiple characters to define their relationships and dynamics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {castList.map((a) =>
                castList
                  .filter((b) => b.id !== a.id)
                  .map((b) => {
                    // Only show each pair once
                    if (a.id > b.id) return null
                    const rel = getRelationship(a.id, b.id)
                    const hasRelationship = rel !== 'Define relationship...'
                    return (
                      <div
                        key={`${a.id}-${b.id}`}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                            <Image src={a.image} alt={a.name} fill className="object-cover" sizes="28px" />
                          </div>
                          <div className="w-4 h-px bg-white/[0.1]" />
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                            <Image src={b.image} alt={b.name} fill className="object-cover" sizes="28px" />
                          </div>
                        </div>
                        <p className="text-[10px] text-white/40 truncate">{a.name} &amp; {b.name}</p>

                        {/* Relationship badge */}
                        {hasRelationship && (
                          <div className="mt-1.5 mb-1">
                            <span className={cn(
                              'inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border',
                              RELATIONSHIP_COLORS[rel] || 'bg-white/[0.05] text-white/40 border-white/[0.1]'
                            )}>
                              {rel}
                            </span>
                          </div>
                        )}

                        <select
                          value={rel}
                          onChange={(e) => setRelationship(a.id, b.id, e.target.value)}
                          className="mt-1.5 w-full px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/35 focus:outline-none appearance-none cursor-pointer"
                        >
                          {RELATIONSHIP_OPTIONS.map((r) => (
                            <option key={r} value={r} className="bg-[#1a1a1a]">{r}</option>
                          ))}
                        </select>
                      </div>
                    )
                  })
              )}
            </div>
          )}
        </div>
      </section>
    </CreateLayout>
  )
}
