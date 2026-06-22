'use client'

import { useState, useRef } from 'react'
import {
  Mic2,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Coins,
  ChevronDown,
  RefreshCw,
  Globe,
  Trash2,
  Download,
  History,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import {
  VOICE_LANGUAGES,
  VOICE_EMOTIONS,
  getAvailableVoices,
  estimateVoiceCost,
  generateDialogueVoice,
  type VoiceEmotion,
  type GeneratedVoice,
} from '@/lib/voice.service'

/* ── Helpers ── */

function WaveformBars({ active, color = '#E50914' }: { active: boolean; color?: string }) {
  return (
    <div className="flex items-end gap-[2px] h-6">
      {Array.from({ length: 16 }).map((_, i) => {
        const height = 20 + ((i * 17 + 31) % 80)
        return (
          <div
            key={i}
            className={cn('w-[3px] rounded-full transition-all duration-300', active ? 'opacity-100' : 'opacity-30')}
            style={{
              height: `${Math.max(15, height)}%`,
              backgroundColor: color,
              animation: active ? `pulse 0.${(i % 4) + 4}s ease-in-out infinite alternate` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

/* ── Voice Preset Card ── */

function VoiceCard({
  voice,
  selected,
  onSelect,
}: {
  voice: ReturnType<typeof getAvailableVoices>[0]
  selected: boolean
  onSelect: () => void
}) {
  const genderLabel = voice.gender === 'male' ? 'Masculin' : voice.gender === 'female' ? 'Féminin' : 'Neutre'
  const genderIcon = voice.gender === 'male' ? '♂' : voice.gender === 'female' ? '♀' : '⚧'

  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative p-4 rounded-xl border text-left transition-all duration-300 w-full',
        selected
          ? 'border-[#E50914]/40 bg-[#E50914]/5 shadow-[0_0_20px_rgba(229,9,20,0.08)]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
      )}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5">
          <CheckCircle2 className="h-4 w-4 text-[#E50914]" />
        </div>
      )}

      {/* Color bar */}
      <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: voice.color }} />

      <h3 className="text-sm font-bold text-white mb-1">{voice.name}</h3>
      <p className="text-[11px] text-white/40 leading-relaxed mb-3">{voice.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] border border-white/[0.06] text-white/30">
          {genderIcon} {genderLabel}
        </span>
        {voice.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] border border-white/[0.06] text-white/30">
            {tag}
          </span>
        ))}
      </div>

      {/* Sample text */}
      <p className="mt-3 text-[10px] italic text-white/25 border-t border-white/[0.04] pt-2">
        «&nbsp;{voice.sampleText}&nbsp;»
      </p>
    </button>
  )
}

/* ── Generated Voice Item ── */

function GeneratedVoiceItem({
  item,
  onDelete,
}: {
  item: GeneratedVoice
  onDelete: () => void
}) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const langInfo = VOICE_LANGUAGES.find(l => l.code === item.language)
  const emotionInfo = VOICE_EMOTIONS.find(e => e.id === item.emotion)

  function togglePlay() {
    // In production: audioRef.current?.play() / pause()
    setPlaying(p => !p)
    if (!playing) {
      setTimeout(() => setPlaying(false), item.duration * 1000)
    }
  }

  return (
    <div className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.03] transition-all duration-200">
      {/* Play button */}
      <button
        onClick={togglePlay}
        className={cn(
          'shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200',
          playing
            ? 'bg-[#E50914] text-white'
            : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white'
        )}
      >
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
      </button>

      {/* Waveform + info */}
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <WaveformBars active={playing} />
        </div>
        <p className="text-sm text-white/70 truncate">{item.text.slice(0, 80)}{item.text.length > 80 ? '…' : ''}</p>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <Mic2 className="h-3 w-3" />
            {item.voiceName}
          </span>
          <span>{emotionInfo?.icon} {emotionInfo?.label}</span>
          <span>{langInfo?.flag} {langInfo?.label}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(item.duration)}
          </span>
          <span className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            {item.creditCost} crédits
          </span>
          <span>{formatTime(item.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => toast.success('Téléchargement de la piste audio...')}
          className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          title="Télécharger"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/* ── Main Page ── */

const VOICES = getAvailableVoices()
const MAX_CHARS = 2000

export default function VoicesPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()

  const [text, setText] = useState('')
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICES[0].id)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('fr')
  const [selectedEmotion, setSelectedEmotion] = useState<VoiceEmotion>('neutre')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedVoice[]>([])
  const [showAllVoices, setShowAllVoices] = useState(false)

  if (!loaded) return null

  const unlocked = isStepUnlocked('music', CREATE_STEPS) // voice is post-music step

  const creditCost = estimateVoiceCost(text)
  const charCount = text.length
  const visibleVoices = showAllVoices ? VOICES : VOICES.slice(0, 4)

  async function handleGenerate() {
    if (!text.trim()) { toast.error('Entrez du texte à vocaliser'); return }
    if (!unlocked) { toast.error('Complétez les étapes précédentes pour débloquer cette fonctionnalité'); return }

    setIsGenerating(true)
    try {
      const result = await generateDialogueVoice(text, selectedVoiceId, selectedEmotion, selectedLanguage)
      setGenerated(prev => [result, ...prev])
      toast.success(`Voix générée — ${result.voiceName} · ${result.creditCost} crédits utilisés`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la génération')
    } finally {
      setIsGenerating(false)
    }
  }

  function deleteGenerated(id: string) {
    setGenerated(prev => prev.filter(g => g.id !== id))
    toast.success('Piste supprimée')
  }

  const selectedLangInfo = VOICE_LANGUAGES.find(l => l.code === selectedLanguage)
  const selectedVoice = VOICES.find(v => v.id === selectedVoiceId)

  return (
    <CreateLayout
      currentStepId="music"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('music')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <Mic2 className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Voix & <span className="text-[#E50914]">Dialogues</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Donnez vie à vos personnages avec des voix expressives générées par IA.
          Choisissez un preset, sélectionnez une émotion, et générez vos pistes audio en quelques secondes.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">Comment ça marche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Mic2, title: 'Choisissez une voix', desc: '8 presets cinématographiques — narrateur, héros, vilain, enfant et plus encore.' },
            { icon: Globe, title: 'Sélectionnez la langue', desc: '12 langues supportées pour atteindre votre audience internationale.' },
            { icon: Sparkles, title: 'Générez en un clic', desc: 'L\'IA génère une piste audio expressionnelle en quelques secondes. 0,5 crédit par 100 caractères.' },
          ].map(item => (
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

      {/* ═══ GENERATOR ═══ */}
      <section className="relative mb-16">
        {!unlocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-not-allowed">
            <AlertCircle className="h-8 w-8 text-white/20" />
            <p className="text-sm text-white/30 font-medium">Complétez les étapes précédentes pour débloquer</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: text + controls */}
          <div className="space-y-5">
            {/* Text input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/60">Texte du dialogue</label>
                <span className={cn('text-[10px] tabular-nums', charCount > MAX_CHARS * 0.9 ? 'text-amber-400' : 'text-white/30')}>
                  {charCount} / {MAX_CHARS}
                </span>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Entrez le texte du dialogue à vocaliser&#10;&#10;Ex: Il était une fois, dans un monde oublié des hommes, une lumière qui refusait de s'éteindre..."
                rows={8}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors resize-none leading-relaxed"
              />
              {text.trim() && (
                <div className="mt-2 flex items-center gap-4 text-[10px] text-white/30">
                  <span>{text.trim().split(/\s+/).length} mots</span>
                  <span>~{formatDuration(Math.ceil(text.split(' ').length * 0.4))} audio estimé</span>
                  <span className="flex items-center gap-1 text-[#E50914]/70">
                    <Coins className="h-3 w-3" />
                    {creditCost} crédits estimés
                  </span>
                </div>
              )}
            </div>

            {/* Emotion selector */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-2 block">Émotion</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {VOICE_EMOTIONS.map(emotion => (
                  <button
                    key={emotion.id}
                    onClick={() => setSelectedEmotion(emotion.id)}
                    title={emotion.description}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all duration-200',
                      selectedEmotion === emotion.id
                        ? 'bg-[#E50914]/10 border-[#E50914]/40 text-[#E50914]'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
                    )}
                  >
                    <span className="text-xl leading-none">{emotion.icon}</span>
                    <span className="text-[10px] font-medium leading-tight">{emotion.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language selector */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-2 block">Langue</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {VOICE_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] font-medium border transition-all duration-200',
                      selectedLanguage === lang.code
                        ? 'bg-[#E50914]/10 border-[#E50914]/40 text-[#E50914]'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
                    )}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#E50914] to-[#B20710] text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer la voix
                  {text.trim() && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/15 text-[10px]">
                      {creditCost} crédits
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Right: voice selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-white/60">Voix sélectionnée</label>
              {selectedVoice && (
                <span className="text-[10px] text-white/30">{selectedVoice.accent}</span>
              )}
            </div>

            <div className="space-y-2">
              {visibleVoices.map(voice => (
                <VoiceCard
                  key={voice.id}
                  voice={voice}
                  selected={selectedVoiceId === voice.id}
                  onSelect={() => setSelectedVoiceId(voice.id)}
                />
              ))}
            </div>

            {VOICES.length > 4 && (
              <button
                onClick={() => setShowAllVoices(p => !p)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showAllVoices && 'rotate-180')} />
                {showAllVoices ? 'Voir moins' : `Voir ${VOICES.length - 4} autres voix`}
              </button>
            )}

            {/* Preview bubble */}
            {selectedVoice && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedVoice.color }} />
                  <span className="text-xs font-medium text-white/60">{selectedVoice.name}</span>
                  <span className="ml-auto text-[10px] text-white/25">{selectedLangInfo?.flag} {selectedLangInfo?.label}</span>
                </div>
                <p className="text-[11px] italic text-white/30">«&nbsp;{selectedVoice.sampleText}&nbsp;»</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ GENERATED GALLERY ═══ */}
      {generated.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-white/40" />
              <h2 className="text-lg font-bold text-white/80">Voix générées</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914]">
                {generated.length}
              </span>
            </div>
            <button
              onClick={() => {
                setGenerated([])
                toast.success('Galerie effacée')
              }}
              className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Tout supprimer
            </button>
          </div>

          <div className="space-y-3">
            {generated.map(item => (
              <GeneratedVoiceItem
                key={item.id}
                item={item}
                onDelete={() => deleteGenerated(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when nothing generated yet */}
      {generated.length === 0 && unlocked && (
        <section className="mb-8">
          <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-white/[0.06] text-center">
            <Mic2 className="h-10 w-10 text-white/10 mb-4" />
            <p className="text-sm text-white/30">Vos voix générées apparaîtront ici</p>
            <p className="text-[11px] text-white/20 mt-1">Entrez un texte et cliquez sur Générer pour commencer</p>
          </div>
        </section>
      )}
    </CreateLayout>
  )
}
