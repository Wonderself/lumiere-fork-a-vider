/**
 * Voice/Dialogue Generation Service
 * Provides TTS (Text-to-Speech) functionality for film dialogue generation.
 * Currently simulated — in production, connects to ElevenLabs / OpenAI TTS / Azure.
 */

export type VoiceEmotion =
  | 'neutre'
  | 'joyeux'
  | 'triste'
  | 'en-colere'
  | 'effrayé'
  | 'mystérieux'

export type VoiceLanguage = {
  code: string
  label: string
  flag: string
}

export type VoicePreset = {
  id: string
  name: string
  description: string
  gender: 'male' | 'female' | 'neutral'
  accent: string
  sampleText: string
  tags: string[]
  color: string
}

export type GeneratedVoice = {
  id: string
  text: string
  voiceId: string
  voiceName: string
  emotion: VoiceEmotion
  language: string
  audioUrl: string
  duration: number // seconds
  creditCost: number
  createdAt: Date
}

/* ── Constants ── */

export const VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

export const VOICE_EMOTIONS: { id: VoiceEmotion; label: string; icon: string; description: string }[] = [
  { id: 'neutre', label: 'Neutral', icon: '😐', description: 'Natural reading with no particular emotional coloring' },
  { id: 'joyeux', label: 'Joyful', icon: '😊', description: 'Upbeat, light, enthusiastic tone' },
  { id: 'triste', label: 'Sad', icon: '😢', description: 'Melancholic, slow, soft voice' },
  { id: 'en-colere', label: 'Angry', icon: '😠', description: 'Tense, strong, marked tone' },
  { id: 'effrayé', label: 'Scared', icon: '😨', description: 'Trembling, hesitant, hushed voice' },
  { id: 'mystérieux', label: 'Mysterious', icon: '🎭', description: 'Intriguing whisper, slow and steady pace' },
]

const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'narrateur',
    name: 'Narrator',
    description: 'Deep, resonant male voice, ideal for voice-overs and epic narration.',
    gender: 'male',
    accent: 'Classic French',
    sampleText: 'Once upon a time, in a forgotten world...',
    tags: ['Narration', 'Epic', 'Deep'],
    color: '#E50914',
  },
  {
    id: 'narratrice',
    name: 'Narrator (F)',
    description: 'Warm, enveloping female voice, perfect for intimate stories.',
    gender: 'female',
    accent: 'Soft French',
    sampleText: 'And so it all began...',
    tags: ['Narration', 'Warm', 'Intimate'],
    color: '#F472B6',
  },
  {
    id: 'heros',
    name: 'Hero',
    description: 'Determined, confident male voice, for protagonists with hearts of steel.',
    gender: 'male',
    accent: 'International neutral',
    sampleText: 'I will not stop, no matter what.',
    tags: ['Protagonist', 'Strong', 'Determined'],
    color: '#3B82F6',
  },
  {
    id: 'heroine',
    name: 'Heroine',
    description: 'Powerful, courageous female voice, for characters who defy their fate.',
    gender: 'female',
    accent: 'International neutral',
    sampleText: 'No one ever told me it would be easy.',
    tags: ['Protagonist', 'Brave', 'Powerful'],
    color: '#8B5CF6',
  },
  {
    id: 'vilain',
    name: 'Villain',
    description: 'Deep, menacing voice with a slow cadence that builds tension.',
    gender: 'male',
    accent: 'Deep accented',
    sampleText: 'Did you really think you could escape me?',
    tags: ['Antagonist', 'Menacing', 'Dark'],
    color: '#DC2626',
  },
  {
    id: 'enfant',
    name: 'Child',
    description: 'Clear, innocent, slightly high-pitched voice, for young characters.',
    gender: 'neutral',
    accent: 'Childlike',
    sampleText: 'But why is the sky blue?',
    tags: ['Young', 'Innocent', 'Clear'],
    color: '#F59E0B',
  },
  {
    id: 'ancien',
    name: 'Elder',
    description: 'Aging voice with palpable wisdom, slow and steady.',
    gender: 'male',
    accent: 'Traditional',
    sampleText: 'In my long life, I have learned one thing...',
    tags: ['Wise elder', 'Calm', 'Wise'],
    color: '#6B7280',
  },
  {
    id: 'robotique',
    name: 'Robotic',
    description: 'Slightly metallic synthetic voice, for AIs and non-human creatures.',
    gender: 'neutral',
    accent: 'Synthetic',
    sampleText: 'Processing request. Result: optimal.',
    tags: ['AI', 'Synthetic', 'Futuristic'],
    color: '#22D3EE',
  },
]

/* ── Cost calculation ── */

const COST_PER_100_CHARS = 0.5 // credits

/**
 * Estimate the credit cost for generating a voice from text.
 */
export function estimateVoiceCost(text: string): number {
  const charCount = text.replace(/\s+/g, '').length // ignore spaces
  return Math.ceil((charCount / 100) * COST_PER_100_CHARS * 10) / 10
}

/* ── Service functions ── */

/**
 * Get all available voice presets.
 */
export function getAvailableVoices(): VoicePreset[] {
  return VOICE_PRESETS
}

/**
 * Get a single voice preset by ID.
 */
export function getVoiceById(id: string): VoicePreset | undefined {
  return VOICE_PRESETS.find(v => v.id === id)
}

/**
 * Generate a voice dialogue from text.
 * Simulated for now — returns a mock audio URL after a delay.
 *
 * In production: POST to ElevenLabs /v1/text-to-speech/:voice_id
 * or OpenAI TTS /v1/audio/speech
 */
export async function generateDialogueVoice(
  text: string,
  voiceId: string,
  emotion: VoiceEmotion,
  language: string
): Promise<GeneratedVoice> {
  if (!text.trim()) throw new Error('Text cannot be empty')
  if (text.length > 2000) throw new Error('Text cannot exceed 2000 characters')

  const voice = getVoiceById(voiceId)
  if (!voice) throw new Error(`Voix introuvable: ${voiceId}`)

  // Simulate API latency (1.5s - 3s depending on text length)
  const delay = Math.min(1500 + text.length * 2, 3000)
  await new Promise(resolve => setTimeout(resolve, delay))

  // Simulate success with a dummy audio URL
  // In production, this would be an actual audio file URL from storage
  const mockAudioUrl = `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=`

  const creditCost = estimateVoiceCost(text)
  const estimatedDuration = Math.ceil(text.split(' ').length * 0.4) // ~0.4s per word

  const generated: GeneratedVoice = {
    id: `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text,
    voiceId,
    voiceName: voice.name,
    emotion,
    language,
    audioUrl: mockAudioUrl,
    duration: estimatedDuration,
    creditCost,
    createdAt: new Date(),
  }

  return generated
}
