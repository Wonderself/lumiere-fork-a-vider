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
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
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
  { id: 'neutre', label: 'Neutre', icon: '😐', description: 'Lecture naturelle sans coloration émotionnelle particulière' },
  { id: 'joyeux', label: 'Joyeux', icon: '😊', description: 'Ton enjoué, léger, enthousiaste' },
  { id: 'triste', label: 'Triste', icon: '😢', description: 'Voix mélancolique, lente, douce' },
  { id: 'en-colere', label: 'En colère', icon: '😠', description: 'Ton tendu, fort, marqué' },
  { id: 'effrayé', label: 'Effrayé', icon: '😨', description: 'Voix tremblante, hésitante, à voix basse' },
  { id: 'mystérieux', label: 'Mystérieux', icon: '🎭', description: 'Murmure intrigant, rythme lent et posé' },
]

const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'narrateur',
    name: 'Narrateur',
    description: 'Voix masculine grave et profonde, idéale pour les voix off et narrations épiques.',
    gender: 'male',
    accent: 'Français classique',
    sampleText: 'Il était une fois, dans un monde oublié...',
    tags: ['Narration', 'Épique', 'Grave'],
    color: '#E50914',
  },
  {
    id: 'narratrice',
    name: 'Narratrice',
    description: 'Voix féminine chaleureuse et enveloppante, parfaite pour les récits intimistes.',
    gender: 'female',
    accent: 'Français doux',
    sampleText: 'Et c\'est ainsi que tout commença...',
    tags: ['Narration', 'Chaleureux', 'Intime'],
    color: '#F472B6',
  },
  {
    id: 'heros',
    name: 'Héros',
    description: 'Voix masculine déterminée et confiante, pour les protagonistes au cœur d\'acier.',
    gender: 'male',
    accent: 'Neutre international',
    sampleText: 'Je ne m\'arrêterai pas, quoi qu\'il arrive.',
    tags: ['Protagoniste', 'Fort', 'Déterminé'],
    color: '#3B82F6',
  },
  {
    id: 'heroine',
    name: 'Héroïne',
    description: 'Voix féminine puissante et courageuse, pour les personnages qui défient leur destin.',
    gender: 'female',
    accent: 'Neutre international',
    sampleText: 'On ne m\'a jamais dit que ce serait facile.',
    tags: ['Protagoniste', 'Courageux', 'Puissant'],
    color: '#8B5CF6',
  },
  {
    id: 'vilain',
    name: 'Vilain',
    description: 'Voix grave et menaçante, avec une cadence lente qui installe une atmosphère de tension.',
    gender: 'male',
    accent: 'Grave accentué',
    sampleText: 'Vous pensiez vraiment pouvoir m\'échapper ?',
    tags: ['Antagoniste', 'Menaçant', 'Sombre'],
    color: '#DC2626',
  },
  {
    id: 'enfant',
    name: 'Enfant',
    description: 'Voix claire et innocente, légèrement aiguë, pour les personnages jeunes.',
    gender: 'neutral',
    accent: 'Enfantin',
    sampleText: 'Mais pourquoi le ciel est-il bleu ?',
    tags: ['Jeune', 'Innocent', 'Clair'],
    color: '#F59E0B',
  },
  {
    id: 'ancien',
    name: 'Ancien',
    description: 'Voix vieillissante avec une sagesse palpable, lente et posée.',
    gender: 'male',
    accent: 'Traditionnel',
    sampleText: 'Dans ma longue vie, j\'ai appris une chose...',
    tags: ['Vieux sage', 'Posé', 'Sage'],
    color: '#6B7280',
  },
  {
    id: 'robotique',
    name: 'Robotique',
    description: 'Voix synthétique légèrement métallique, pour les IA et créatures non-humaines.',
    gender: 'neutral',
    accent: 'Synthétique',
    sampleText: 'Traitement de la demande en cours. Résultat : optimal.',
    tags: ['IA', 'Synthétique', 'Futuriste'],
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
  if (!text.trim()) throw new Error('Le texte ne peut pas être vide')
  if (text.length > 2000) throw new Error('Le texte ne peut pas dépasser 2000 caractères')

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
