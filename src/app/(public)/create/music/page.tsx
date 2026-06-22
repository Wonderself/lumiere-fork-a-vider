'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Music,
  Lock,
  Sparkles,
  Play,
  Pause,
  Plus,
  Search,
  Library,
  Headphones,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Mic2,
  Waves,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const GENRES = ['Orchestral', 'Electronic', 'Jazz', 'Ambient', 'Rock', 'World']

const SAMPLE_TRACKS = [
  { id: 1, title: 'Epic Orchestral Rise', duration: '2:34', genre: 'Orchestral', bpm: 120 },
  { id: 2, title: 'Neon Nights', duration: '3:12', genre: 'Electronic', bpm: 128 },
  { id: 3, title: 'Midnight Jazz', duration: '4:01', genre: 'Jazz', bpm: 95 },
  { id: 4, title: 'Ambient Dreamscape', duration: '5:45', genre: 'Ambient', bpm: 70 },
  { id: 5, title: 'Driving Force', duration: '2:58', genre: 'Rock', bpm: 140 },
  { id: 6, title: 'Desert Wind', duration: '3:30', genre: 'World', bpm: 100 },
]

const SFX_CATEGORIES = ['Foley', 'Nature', 'Urban', 'Sci-Fi', 'Horror', 'Action']

const SFX_SAMPLES: Record<string, string[]> = {
  Foley: ['Footsteps', 'Door Creak', 'Glass Break', 'Cloth Rustle'],
  Nature: ['Rain', 'Thunder', 'Wind', 'Birds'],
  Urban: ['Traffic', 'Siren', 'Crowd Murmur', 'Subway'],
  'Sci-Fi': ['Laser', 'Warp Drive', 'Hologram', 'Robot Servo'],
  Horror: ['Heartbeat', 'Whisper', 'Creaking Floor', 'Scream'],
  Action: ['Explosion', 'Gunshot', 'Punch', 'Car Chase'],
}

const AUDIO_TRACKS = [
  { id: 'music', label: 'Music', color: '#E50914', volume: 80 },
  { id: 'dialogue', label: 'Dialogue', color: '#4ECDC4', volume: 100 },
  { id: 'sfx', label: 'SFX', color: '#F7C948', volume: 65 },
  { id: 'ambiance', label: 'Ambiance', color: '#8B5CF6', volume: 45 },
]

/* ── Helpers ── */

function LockOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-not-allowed">
      <Lock className="h-8 w-8 text-white/20" />
      <p className="text-sm text-white/30 font-medium">Complete previous steps to unlock</p>
    </div>
  )
}

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-8">
      {Array.from({ length: 20 }).map((_, i) => {
        const height = Math.random() * 100
        return (
          <div
            key={i}
            className={cn(
              'w-[3px] rounded-full transition-all duration-300',
              active ? 'bg-[#E50914]' : 'bg-white/15'
            )}
            style={{
              height: `${Math.max(15, height)}%`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        )
      })}
    </div>
  )
}

/* ── Page ── */

export default function MusicPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const [selectedSfxCategory, setSelectedSfxCategory] = useState('Foley')
  const [playingSfx, setPlayingSfx] = useState<string | null>(null)
  const [trackVolumes, setTrackVolumes] = useState<Record<string, number>>({
    music: 80,
    dialogue: 100,
    sfx: 65,
    ambiance: 45,
  })
  const [masterVolume, setMasterVolume] = useState(85)

  if (!loaded) return null

  const unlocked = isStepUnlocked('music', CREATE_STEPS)

  const filteredTracks = SAMPLE_TRACKS.filter((t) => {
    const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = !selectedGenre || t.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  function toggleTrack(id: number) {
    setPlayingTrack((prev) => (prev === id ? null : id))
  }

  function updateTrackVolume(trackId: string, value: number) {
    setTrackVolumes((prev) => ({ ...prev, [trackId]: value }))
  }

  return (
    <CreateLayout
      currentStepId="music"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('music')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <Music className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Add <span className="text-[#E50914]">Music & SFX</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Browse curated audio libraries, generate custom soundtracks, and mix every layer to perfection.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Library, title: 'Browse Library', desc: 'Explore curated tracks across genres - orchestral, electronic, jazz and more.' },
            { icon: Sparkles, title: 'Generate Custom', desc: 'Let AI compose original music tailored to your film\'s mood and pacing.' },
            { icon: SlidersHorizontal, title: 'Mix & Master', desc: 'Layer music, dialogue, SFX and ambiance with precise volume control.' },
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

      {/* ═══ MUSIC LIBRARY ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-white/80">Music Library</h2>
          <button
            onClick={() => {
              if (!unlocked) { toast.error('Complétez les étapes précédentes pour débloquer cette fonctionnalité'); return }
              toast.promise(
                new Promise<void>((resolve) => setTimeout(resolve, 2500)),
                {
                  loading: 'Composition IA en cours...',
                  success: 'Piste originale générée et ajoutée à votre bibliothèque !',
                  error: 'Erreur lors de la génération',
                }
              )
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#E50914] to-[#B20710] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4" />
            Generate Custom Track
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>
          </button>
        </div>

        {/* Search + genre filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks..."
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedGenre(null)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                !selectedGenre
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
              )}
            >
              All
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  selectedGenre === g
                    ? 'bg-[#E50914] text-white'
                    : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTracks.map((track) => {
            const isPlaying = playingTrack === track.id
            return (
              <div
                key={track.id}
                className={cn(
                  'group p-4 rounded-xl border transition-all duration-300',
                  isPlaying
                    ? 'bg-[#E50914]/5 border-[#E50914]/20'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                )}
              >
                {/* Waveform */}
                <div className="mb-3 overflow-hidden rounded-lg bg-white/[0.02] p-2">
                  <WaveformBars active={isPlaying} />
                </div>

                {/* Info */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">{track.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <span>{track.genre}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{track.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{track.bpm} BPM</span>
                    </div>
                  </div>
                  {/* Play button */}
                  <button
                    onClick={() => toggleTrack(track.id)}
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0',
                      isPlaying
                        ? 'bg-[#E50914] text-white'
                        : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white'
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Add button */}
                <button
                  onClick={() => toast.success(`"${track.title}" ajouté à votre film !`)}
                  className="w-full py-2 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-[#E50914] hover:border-[#E50914] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add to Film
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ SFX LIBRARY ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">SFX Library</h2>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {SFX_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSfxCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                selectedSfxCategory === cat
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SFX grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(SFX_SAMPLES[selectedSfxCategory] || []).map((sfx) => {
            const isPlaying = playingSfx === sfx
            return (
              <button
                key={sfx}
                onClick={() => setPlayingSfx(isPlaying ? null : sfx)}
                className={cn(
                  'group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
                  isPlaying
                    ? 'bg-[#E50914]/10 border-[#E50914]/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  isPlaying
                    ? 'bg-[#E50914] text-white'
                    : 'bg-white/[0.06] text-white/40 group-hover:text-white/60'
                )}>
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 ml-0.5" />
                  )}
                </div>
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  isPlaying ? 'text-white/80' : 'text-white/50 group-hover:text-white/70'
                )}>
                  {sfx}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ═══ AUDIO TIMELINE ═══ */}
      <section className="relative mb-8">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Audio Timeline</h2>

        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          {/* Track layers */}
          <div className="space-y-3 mb-6">
            {AUDIO_TRACKS.map((track) => (
              <div key={track.id} className="flex items-center gap-4">
                {/* Label */}
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: track.color }} />
                  <span className="text-xs font-medium text-white/60">{track.label}</span>
                </div>

                {/* Timeline visualization */}
                <div className="flex-1 h-10 rounded-lg bg-white/[0.02] border border-white/[0.04] relative overflow-hidden">
                  {/* Placeholder audio blocks */}
                  {track.id === 'music' && (
                    <div className="absolute left-[5%] top-1 bottom-1 w-[60%] rounded bg-[#E50914]/20 border border-[#E50914]/30 flex items-center px-2">
                      <span className="text-[9px] text-[#E50914]/60 truncate">Epic Orchestral Rise</span>
                    </div>
                  )}
                  {track.id === 'dialogue' && (
                    <>
                      <div className="absolute left-[10%] top-1 bottom-1 w-[20%] rounded bg-[#4ECDC4]/20 border border-[#4ECDC4]/30" />
                      <div className="absolute left-[45%] top-1 bottom-1 w-[25%] rounded bg-[#4ECDC4]/20 border border-[#4ECDC4]/30" />
                    </>
                  )}
                  {track.id === 'sfx' && (
                    <>
                      <div className="absolute left-[15%] top-1 bottom-1 w-[8%] rounded bg-[#F7C948]/20 border border-[#F7C948]/30" />
                      <div className="absolute left-[50%] top-1 bottom-1 w-[5%] rounded bg-[#F7C948]/20 border border-[#F7C948]/30" />
                      <div className="absolute left-[70%] top-1 bottom-1 w-[10%] rounded bg-[#F7C948]/20 border border-[#F7C948]/30" />
                    </>
                  )}
                  {track.id === 'ambiance' && (
                    <div className="absolute left-[0%] top-1 bottom-1 w-[90%] rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20" />
                  )}
                </div>

                {/* Volume slider */}
                <div className="w-28 shrink-0 flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-white/30 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={trackVolumes[track.id] ?? 80}
                    onChange={(e) => updateTrackVolume(track.id, Number(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${track.color} 0%, ${track.color} ${trackVolumes[track.id] ?? 80}%, rgba(255,255,255,0.06) ${trackVolumes[track.id] ?? 80}%, rgba(255,255,255,0.06) 100%)`,
                    }}
                  />
                  <span className="text-[10px] text-white/40 w-7 text-right shrink-0">{trackVolumes[track.id]}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Master volume */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
            <div className="w-24 shrink-0 flex items-center gap-2">
              <Headphones className="h-4 w-4 text-white/50" />
              <span className="text-xs font-semibold text-white/70">Master</span>
            </div>
            <div className="flex-1" />
            <div className="w-28 shrink-0 flex items-center gap-2">
              {masterVolume === 0 ? (
                <VolumeX className="h-3.5 w-3.5 text-white/30 shrink-0" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-white/30 shrink-0" />
              )}
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E50914 0%, #E50914 ${masterVolume}%, rgba(255,255,255,0.06) ${masterVolume}%, rgba(255,255,255,0.06) 100%)`,
                }}
              />
              <span className="text-[10px] text-white/40 w-7 text-right shrink-0">{masterVolume}%</span>
            </div>
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
