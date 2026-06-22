'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Home,
  Lock,
  Plus,
  MapPin,
  Palette,
  Sun,
  Sparkles,
  CloudSun,
  CloudRain,
  CloudSnow,
  Wind,
  Moon,
  Sunrise,
  Sunset,
  GripVertical,
  Settings2,
  Check,
  X,
  Pencil,
  Trash2,
  Loader2,
  Upload,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const LOCATION_IMAGES = [
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=600&h=400&q=80',
]

const INITIAL_LOCATIONS = [
  {
    id: 'urban',
    name: 'Urban Night',
    description: 'Neon-lit city streets with rain-slicked asphalt and towering buildings.',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Dense woodland canopy with dappled sunlight filtering through ancient trees.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'interior',
    name: 'Interior',
    description: 'Elegant modern interior with warm ambient lighting and minimal decor.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'desert',
    name: 'Desert',
    description: 'Vast arid landscape with rolling dunes and dramatic golden-hour shadows.',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&h=400&q=80',
  },
]

const LIGHTING_PRESETS = ['Golden Hour', 'Blue Hour', 'Neon', 'Natural', 'Studio']

const COLOR_PALETTE = ['#E50914', '#FF6B35', '#F7C948', '#4ECDC4', '#1A535C', '#2D3047', '#8B5CF6', '#EC4899']

const INITIAL_SCENE_MAP = [
  { id: '1', scene: 'Scene 1 - Opening', location: 'Urban Night', time: 'Night', weather: 'Rain' },
  { id: '2', scene: 'Scene 2 - Discovery', location: 'Forest', time: 'Morning', weather: 'Fog' },
  { id: '3', scene: 'Scene 3 - Confrontation', location: 'Interior', time: 'Afternoon', weather: 'Clear' },
  { id: '4', scene: 'Scene 4 - Climax', location: 'Desert', time: 'Sunset', weather: 'Wind' },
]

const TIME_OPTIONS = ['Dawn', 'Morning', 'Afternoon', 'Sunset', 'Night']
const WEATHER_OPTIONS = ['Clear', 'Rain', 'Fog', 'Snow', 'Wind', 'Overcast']

/* ── Types ── */

interface Location {
  id: string
  name: string
  description: string
  image: string
}

interface SceneRow {
  id: string
  scene: string
  location: string
  time: string
  weather: string
}

interface MoodImage {
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

function randomLocationImage() {
  return LOCATION_IMAGES[Math.floor(Math.random() * LOCATION_IMAGES.length)]
}

let idCounter = 100

/* ── Page ── */

export default function SetupsPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()
  const [selectedLighting, setSelectedLighting] = useState('Golden Hour')
  const [selectedColors, setSelectedColors] = useState<string[]>(['#E50914', '#F7C948'])
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS)
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([])
  const [sceneData, setSceneData] = useState<SceneRow[]>(INITIAL_SCENE_MAP)

  // Add location form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newImage, setNewImage] = useState('')

  // Customize (inline edit)
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // Mood board
  const [moodImages, setMoodImages] = useState<MoodImage[]>([])
  const moodInputRef = useRef<HTMLInputElement>(null)

  // Generate environment
  const [envGenerating, setEnvGenerating] = useState(false)
  const [envResult, setEnvResult] = useState<string | null>(null)

  // Scene editing
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null)
  const [editSceneName, setEditSceneName] = useState('')

  if (!loaded) return null

  const unlocked = isStepUnlocked('setups', CREATE_STEPS)

  function toggleColor(color: string) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  function updateScene(id: string, field: 'location' | 'time' | 'weather', value: string) {
    setSceneData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  // --- Location actions ---

  function handleAddLocation() {
    if (!newName.trim()) return
    const loc: Location = {
      id: `custom-${++idCounter}`,
      name: newName.trim(),
      description: newDesc.trim(),
      image: newImage.trim() || randomLocationImage(),
    }
    setLocations((prev) => [...prev, loc])
    setNewName('')
    setNewDesc('')
    setNewImage('')
    setShowAddForm(false)
  }

  function handleGenerateAIImage() {
    setNewImage(randomLocationImage())
  }

  function toggleSelectLocation(id: string) {
    setSelectedLocationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function startCustomize(loc: Location) {
    setEditingLocationId(loc.id)
    setEditName(loc.name)
    setEditDesc(loc.description)
  }

  function saveCustomize(id: string) {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, name: editName.trim() || loc.name, description: editDesc.trim() || loc.description } : loc
      )
    )
    setEditingLocationId(null)
  }

  function regenerateImage(id: string) {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, image: randomLocationImage() } : loc))
    )
  }

  // --- Mood board ---

  function handleMoodUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      setMoodImages((prev) => [...prev, { url, name: file.name }])
    })
    e.target.value = ''
  }

  function removeMoodImage(index: number) {
    setMoodImages((prev) => prev.filter((_, i) => i !== index))
  }

  // --- Generate environment ---

  async function handleGenerateEnvironment() {
    setEnvGenerating(true)
    setEnvResult(null)
    await new Promise((r) => setTimeout(r, 2500))
    setEnvResult(randomLocationImage())
    setEnvGenerating(false)
  }

  function handleUseEnvResult() {
    if (!envResult) return
    const loc: Location = {
      id: `env-${++idCounter}`,
      name: `Generated Environment`,
      description: `${selectedLighting} lighting with custom color palette`,
      image: envResult,
    }
    setLocations((prev) => [...prev, loc])
    setEnvResult(null)
  }

  // --- Scene mapping ---

  function addScene() {
    const num = sceneData.length + 1
    setSceneData((prev) => [
      ...prev,
      {
        id: `scene-${++idCounter}`,
        scene: `Scene ${num} - Untitled`,
        location: locations[0]?.name || 'Urban Night',
        time: 'Morning',
        weather: 'Clear',
      },
    ])
  }

  function deleteScene(id: string) {
    setSceneData((prev) => prev.filter((row) => row.id !== id))
  }

  function startEditSceneName(row: SceneRow) {
    setEditingSceneId(row.id)
    setEditSceneName(row.scene)
  }

  function saveSceneName(id: string) {
    setSceneData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, scene: editSceneName.trim() || row.scene } : row))
    )
    setEditingSceneId(null)
  }

  return (
    <CreateLayout
      currentStepId="setups"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('setups')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <Home className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Design Your <span className="text-[#E50914]">Sets</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Build immersive locations, craft mood boards, and set the perfect ambiance for every scene in your film.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: MapPin, title: 'Define Locations', desc: 'Choose preset environments or build custom locations from scratch.' },
            { icon: Palette, title: 'Create Mood Boards', desc: 'Curate colors, textures and references to nail the visual tone.' },
            { icon: Sun, title: 'Set the Ambiance', desc: 'Configure lighting, weather and time-of-day for each scene.' },
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

      {/* ═══ LOCATION BUILDER ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white/80">Location Builder</h2>
            {selectedLocationIds.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[#E50914]/20 text-[#E50914] text-xs font-semibold">
                {selectedLocationIds.length} selected
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        </div>

        {/* Add Location Form */}
        {showAddForm && (
          <div className="mb-6 p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-semibold text-white/70">New Location</h3>
            <input
              type="text"
              placeholder="Location name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 transition-colors"
            />
            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 resize-none focus:outline-none focus:border-[#E50914]/40 transition-colors"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 transition-colors"
              />
              <button
                onClick={handleGenerateAIImage}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-medium hover:bg-white/[0.1] hover:text-white/80 transition-all whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate with AI
              </button>
            </div>
            {newImage && (
              <div className="relative h-32 w-48 rounded-lg overflow-hidden">
                <Image src={newImage} alt="Preview" fill className="object-cover" sizes="192px" />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleAddLocation}
                disabled={!newName.trim()}
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Location
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewName(''); setNewDesc(''); setNewImage('') }}
                className="px-5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc) => {
            const isSelected = selectedLocationIds.includes(loc.id)
            const isEditing = editingLocationId === loc.id

            return (
              <div
                key={loc.id}
                className={cn(
                  'group rounded-xl overflow-hidden bg-white/[0.02] border-2 transition-all duration-300',
                  isSelected
                    ? 'border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
                )}
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-md px-2 py-1 text-xs text-white/80 focus:outline-none focus:border-[#E50914]/40"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-md px-2 py-1 text-xs text-white/80 resize-none focus:outline-none focus:border-[#E50914]/40"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => saveCustomize(loc.id)}
                          className="flex-1 py-1 rounded-md text-[10px] font-medium bg-[#E50914] text-white hover:bg-[#B20710] transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => regenerateImage(loc.id)}
                          className="py-1 px-2 rounded-md text-[10px] font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] transition-colors"
                        >
                          Regenerate Image
                        </button>
                        <button
                          onClick={() => setEditingLocationId(null)}
                          className="py-1 px-2 rounded-md text-white/40 hover:text-white/70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-bold text-white mb-1">{loc.name}</h3>
                      <p className="text-xs text-white/40 leading-relaxed mb-3 line-clamp-2">{loc.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startCustomize(loc)}
                          className="flex-1 py-1.5 rounded-md text-xs font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] transition-colors"
                        >
                          Customize
                        </button>
                        <button
                          onClick={() => toggleSelectLocation(loc.id)}
                          className={cn(
                            'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors',
                            isSelected
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-[#E50914] text-white hover:bg-[#B20710]'
                          )}
                        >
                          {isSelected ? 'Selected' : 'Use'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ MOOD BOARD ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Mood Board</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drop zone */}
          <div
            className="lg:col-span-2 min-h-[300px] rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] transition-colors cursor-pointer"
            onClick={() => moodInputRef.current?.click()}
          >
            <input
              ref={moodInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMoodUpload}
            />
            {moodImages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[300px] p-8">
                <div className="text-center">
                  <Upload className="h-10 w-10 text-white/15 mx-auto mb-3" />
                  <p className="text-sm text-white/30 mb-1">Click to upload images for your mood board</p>
                  <p className="text-xs text-white/20">Or drag and drop reference images</p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {moodImages.map((img, i) => (
                    <div key={i} className="relative group/mood aspect-square rounded-lg overflow-hidden">
                      <Image src={img.url} alt={img.name} fill className="object-cover" sizes="150px" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeMoodImage(i) }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white/80 flex items-center justify-center opacity-0 group-hover/mood:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {/* Add more placeholder */}
                  <div className="aspect-square rounded-lg border border-dashed border-white/[0.1] flex items-center justify-center">
                    <Plus className="h-5 w-5 text-white/20" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Color palette */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white/70 mb-3">Color Palette</h3>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={cn(
                      'w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110',
                      selectedColors.includes(color)
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A] scale-110'
                        : 'ring-1 ring-white/10'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Lighting presets */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white/70 mb-3">Lighting Presets</h3>
              <div className="flex flex-wrap gap-2">
                {LIGHTING_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSelectedLighting(preset)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                      selectedLighting === preset
                        ? 'bg-[#E50914] text-white'
                        : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateEnvironment}
              disabled={envGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B20710] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {envGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {envGenerating ? 'Generating...' : 'Generate Environment'}
              {!envGenerating && <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>}
            </button>

            {/* Environment result */}
            {envResult && (
              <div className="rounded-xl overflow-hidden border border-white/[0.08]">
                <div className="relative h-40">
                  <Image src={envResult} alt="Generated environment" fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-3 bg-white/[0.02] flex gap-2">
                  <button
                    onClick={handleUseEnvResult}
                    className="flex-1 py-1.5 rounded-md text-xs font-medium bg-[#E50914] text-white hover:bg-[#B20710] transition-colors"
                  >
                    Use
                  </button>
                  <button
                    onClick={handleGenerateEnvironment}
                    className="flex-1 py-1.5 rounded-md text-xs font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ SCENE MAPPING ═══ */}
      <section className="relative mb-8">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white/80">Scene Mapping</h2>
          <button
            onClick={addScene}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Scene
          </button>
        </div>

        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3 bg-white/[0.03] border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Scene</span>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Location</span>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Time of Day</span>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Weather</span>
            <span />
          </div>

          {/* Rows */}
          {sceneData.map((row, i) => (
            <div
              key={row.id}
              className={cn(
                'grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]',
                i < sceneData.length - 1 && 'border-b border-white/[0.04]'
              )}
            >
              {/* Scene name - click to edit */}
              {editingSceneId === row.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editSceneName}
                    onChange={(e) => setEditSceneName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveSceneName(row.id)}
                    className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-md px-2 py-1 text-xs text-white/80 focus:outline-none focus:border-[#E50914]/40"
                    autoFocus
                  />
                  <button onClick={() => saveSceneName(row.id)} className="text-green-400 hover:text-green-300">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => startEditSceneName(row)}
                  className="text-sm text-white/70 font-medium cursor-pointer hover:text-white/90 flex items-center gap-1.5 group/scene"
                >
                  {row.scene}
                  <Pencil className="h-3 w-3 text-white/20 opacity-0 group-hover/scene:opacity-100 transition-opacity" />
                </span>
              )}

              {/* Location dropdown */}
              <select
                value={row.location}
                onChange={(e) => updateScene(row.id, 'location', e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-[#1a1a1a]">{loc.name}</option>
                ))}
              </select>

              {/* Time selector */}
              <select
                value={row.time}
                onChange={(e) => updateScene(row.id, 'time', e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-[#1a1a1a]">{t}</option>
                ))}
              </select>

              {/* Weather selector */}
              <select
                value={row.weather}
                onChange={(e) => updateScene(row.id, 'weather', e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
              >
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w} value={w} className="bg-[#1a1a1a]">{w}</option>
                ))}
              </select>

              {/* Delete */}
              <button
                onClick={() => deleteScene(row.id)}
                className="p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {sceneData.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-white/30">
              No scenes yet. Click "Add Scene" to get started.
            </div>
          )}
        </div>
      </section>
    </CreateLayout>
  )
}
