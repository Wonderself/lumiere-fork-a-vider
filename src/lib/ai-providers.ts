/**
 * CineGeny AI Provider Registry
 * All AI models available on the platform with pricing, capabilities, and status.
 * Prices in micro-credits (1 credit = 1,000,000 µ-credits).
 */

export type ProviderCategory = 'llm' | 'image' | 'video' | 'audio' | 'music'

export interface AIModel {
  id: string
  name: string
  provider: string
  category: ProviderCategory
  // Pricing
  pricingType: 'per_token' | 'per_request' | 'per_second' | 'per_minute'
  inputCostPer1M?: number   // For LLMs: µ-credits per 1M input tokens
  outputCostPer1M?: number  // For LLMs: µ-credits per 1M output tokens
  costPerRequest?: number   // For image/video: µ-credits per generation
  costPerSecond?: number    // For video/audio: µ-credits per second
  // Capabilities
  maxTokens?: number
  maxResolution?: string
  maxDuration?: string
  capabilities: string[]
  // Status
  status: 'available' | 'coming_soon' | 'maintenance'
  requiresApiKey: string    // ENV var name
  // UI
  icon: string              // emoji or icon name
  color: string
  description: string
  bestFor: string
}

// ─── LLM Models ─────────────────────────────────────────────────────

export const LLM_MODELS: AIModel[] = [
  {
    id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 80_000, outputCostPer1M: 400_000,
    maxTokens: 4096, capabilities: ['text', 'analysis', 'code', 'fast'],
    status: 'available', requiresApiKey: 'ANTHROPIC_API_KEY',
    icon: '⚡', color: '#D97706', description: 'Fast and economical', bestFor: 'Simple tasks, quick fixes',
  },
  {
    id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 300_000, outputCostPer1M: 1_500_000,
    maxTokens: 8192, capabilities: ['text', 'analysis', 'code', 'creative', 'vision'],
    status: 'available', requiresApiKey: 'ANTHROPIC_API_KEY',
    icon: '🎯', color: '#2563EB', description: 'Precise and versatile', bestFor: 'Screenplays, dialogue, in-depth analysis',
  },
  {
    id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 1_500_000, outputCostPer1M: 7_500_000,
    maxTokens: 16384, capabilities: ['text', 'analysis', 'code', 'creative', 'vision', 'reasoning', 'extended_thinking'],
    status: 'available', requiresApiKey: 'ANTHROPIC_API_KEY',
    icon: '🧠', color: '#7C3AED', description: 'Deep reasoning', bestFor: 'Strategy, creative arbitration, complex analysis',
  },
  {
    id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 250_000, outputCostPer1M: 1_000_000,
    maxTokens: 4096, capabilities: ['text', 'analysis', 'code', 'vision'],
    status: 'coming_soon', requiresApiKey: 'OPENAI_API_KEY',
    icon: '🤖', color: '#10B981', description: 'OpenAI multimodal model', bestFor: 'Versatile alternative',
  },
  {
    id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 15_000, outputCostPer1M: 60_000,
    maxTokens: 4096, capabilities: ['text', 'analysis', 'fast'],
    status: 'coming_soon', requiresApiKey: 'OPENAI_API_KEY',
    icon: '💨', color: '#10B981', description: 'Ultra fast and economical', bestFor: 'Basic high-volume tasks',
  },
  {
    id: 'gemini-2-flash', name: 'Gemini 2.0 Flash', provider: 'Google', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 7_500, outputCostPer1M: 30_000,
    maxTokens: 8192, capabilities: ['text', 'analysis', 'fast', 'vision'],
    status: 'coming_soon', requiresApiKey: 'GOOGLE_AI_KEY',
    icon: '💎', color: '#4285F4', description: 'Ultra-fast Google Flash', bestFor: 'Fast analysis, brainstorming',
  },
  {
    id: 'llama-3-70b', name: 'Llama 3.3 70B', provider: 'Meta (via Together)', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 90_000, outputCostPer1M: 90_000,
    maxTokens: 4096, capabilities: ['text', 'analysis', 'open_source'],
    status: 'coming_soon', requiresApiKey: 'TOGETHER_API_KEY',
    icon: '🦙', color: '#1877F2', description: 'Powerful open source', bestFor: 'Open-source alternative',
  },
  {
    id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', category: 'llm',
    pricingType: 'per_token', inputCostPer1M: 200_000, outputCostPer1M: 600_000,
    maxTokens: 8192, capabilities: ['text', 'analysis', 'code', 'multilingual'],
    status: 'coming_soon', requiresApiKey: 'MISTRAL_API_KEY',
    icon: '🌬️', color: '#FF7000', description: 'Native French, multilingual', bestFor: 'Dialogue in French, multilingual',
  },
]

// ─── Video Models ───────────────────────────────────────────────────

export const VIDEO_MODELS: AIModel[] = [
  {
    id: 'kling-v1-5', name: 'Kling 1.5', provider: 'Kuaishou', category: 'video',
    pricingType: 'per_request', costPerRequest: 15_000_000,
    maxDuration: '10s', maxResolution: '1080p',
    capabilities: ['text_to_video', 'image_to_video', 'high_quality', 'motion_control'],
    status: 'coming_soon', requiresApiKey: 'KLING_API_KEY',
    icon: '🎬', color: '#FF4500', description: 'Realistic high-quality video', bestFor: 'Film scenes, cinematic shots',
  },
  {
    id: 'kling-v2', name: 'Kling 2.0', provider: 'Kuaishou', category: 'video',
    pricingType: 'per_request', costPerRequest: 25_000_000,
    maxDuration: '10s', maxResolution: '4K',
    capabilities: ['text_to_video', 'image_to_video', 'ultra_quality', 'camera_control', 'lip_sync'],
    status: 'coming_soon', requiresApiKey: 'KLING_API_KEY',
    icon: '🎬', color: '#FF4500', description: 'Latest Kling generation', bestFor: 'Cinema quality, lip-sync, camera control',
  },
  {
    id: 'runway-gen3', name: 'Runway Gen-3 Alpha', provider: 'Runway', category: 'video',
    pricingType: 'per_second', costPerSecond: 2_000_000,
    maxDuration: '10s', maxResolution: '1080p',
    capabilities: ['text_to_video', 'image_to_video', 'motion_brush'],
    status: 'coming_soon', requiresApiKey: 'RUNWAY_API_KEY',
    icon: '🛤️', color: '#6366F1', description: 'Creative-industry standard', bestFor: 'Motion design, visual effects',
  },
  {
    id: 'pika-v2', name: 'Pika 2.0', provider: 'Pika', category: 'video',
    pricingType: 'per_request', costPerRequest: 8_000_000,
    maxDuration: '4s', maxResolution: '1080p',
    capabilities: ['text_to_video', 'image_to_video', 'style_transfer'],
    status: 'coming_soon', requiresApiKey: 'PIKA_API_KEY',
    icon: '⚡', color: '#F59E0B', description: 'Fast and creative', bestFor: 'Short clips, previsualization',
  },
  {
    id: 'luma-dream-machine', name: 'Luma Dream Machine', provider: 'Luma AI', category: 'video',
    pricingType: 'per_request', costPerRequest: 10_000_000,
    maxDuration: '5s', maxResolution: '1080p',
    capabilities: ['text_to_video', 'image_to_video', '3d_aware'],
    status: 'coming_soon', requiresApiKey: 'LUMA_API_KEY',
    icon: '🌙', color: '#8B5CF6', description: 'Video with 3D awareness', bestFor: 'Camera moves, 3D perspective',
  },
  {
    id: 'minimax-video', name: 'MiniMax Video-01', provider: 'MiniMax', category: 'video',
    pricingType: 'per_request', costPerRequest: 12_000_000,
    maxDuration: '6s', maxResolution: '1080p',
    capabilities: ['text_to_video', 'image_to_video', 'high_motion'],
    status: 'coming_soon', requiresApiKey: 'MINIMAX_API_KEY',
    icon: '🎥', color: '#EC4899', description: 'Dynamic motion', bestFor: 'Action scenes, fast motion',
  },
  {
    id: 'hailuo-video', name: 'Hailuo AI Video', provider: 'MiniMax', category: 'video',
    pricingType: 'per_request', costPerRequest: 10_000_000,
    maxDuration: '6s', maxResolution: '1080p',
    capabilities: ['text_to_video', 'realistic', 'character_consistency'],
    status: 'coming_soon', requiresApiKey: 'HAILUO_API_KEY',
    icon: '🌊', color: '#06B6D4', description: 'Consistent characters', bestFor: 'Character consistency, dialogue',
  },
]

// ─── Image Models ───────────────────────────────────────────────────

export const IMAGE_MODELS: AIModel[] = [
  {
    id: 'flux-pro', name: 'FLUX.1 Pro', provider: 'Black Forest Labs (fal.ai)', category: 'image',
    pricingType: 'per_request', costPerRequest: 1_500_000,
    maxResolution: '2048x2048', capabilities: ['text_to_image', 'high_quality', 'photorealistic'],
    status: 'coming_soon', requiresApiKey: 'FAL_API_KEY',
    icon: '🎨', color: '#EC4899', description: 'Ultimate photorealism', bestFor: 'Film stills, concept art',
  },
  {
    id: 'sdxl-turbo', name: 'SDXL Turbo', provider: 'Stability AI (Replicate)', category: 'image',
    pricingType: 'per_request', costPerRequest: 500_000,
    maxResolution: '1024x1024', capabilities: ['text_to_image', 'fast', 'style_control'],
    status: 'coming_soon', requiresApiKey: 'REPLICATE_API_KEY',
    icon: '🖼️', color: '#10B981', description: 'Rapide et flexible', bestFor: 'Storyboards, fast iterations',
  },
  {
    id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', category: 'image',
    pricingType: 'per_request', costPerRequest: 2_000_000,
    maxResolution: '1024x1792', capabilities: ['text_to_image', 'creative', 'text_rendering'],
    status: 'coming_soon', requiresApiKey: 'OPENAI_API_KEY',
    icon: '🎨', color: '#10B981', description: 'Creative with built-in text', bestFor: 'Posters, title cards',
  },
  {
    id: 'midjourney-v6', name: 'Midjourney v6', provider: 'Midjourney (via API)', category: 'image',
    pricingType: 'per_request', costPerRequest: 2_500_000,
    maxResolution: '2048x2048', capabilities: ['text_to_image', 'artistic', 'cinematic'],
    status: 'coming_soon', requiresApiKey: 'MIDJOURNEY_API_KEY',
    icon: '✨', color: '#7C3AED', description: 'Unique artistic style', bestFor: 'Concept art, mood boards',
  },
]

// ─── Audio Models ───────────────────────────────────────────────────

export const AUDIO_MODELS: AIModel[] = [
  {
    id: 'elevenlabs-v2', name: 'ElevenLabs V2', provider: 'ElevenLabs', category: 'audio',
    pricingType: 'per_request', costPerRequest: 3_000_000,
    capabilities: ['tts', 'voice_clone', 'multilingual', 'emotion'],
    status: 'coming_soon', requiresApiKey: 'ELEVENLABS_API_KEY',
    icon: '🔊', color: '#6366F1', description: 'Realistic voices with emotion', bestFor: 'Dialogues, narration, doublage',
  },
  {
    id: 'openai-tts-hd', name: 'OpenAI TTS HD', provider: 'OpenAI', category: 'audio',
    pricingType: 'per_request', costPerRequest: 1_500_000,
    capabilities: ['tts', 'multilingual', 'natural'],
    status: 'coming_soon', requiresApiKey: 'OPENAI_API_KEY',
    icon: '🗣️', color: '#10B981', description: 'TTS naturel', bestFor: 'Narration, voice-over',
  },
  {
    id: 'deepgram-nova', name: 'Deepgram Nova-3', provider: 'Deepgram', category: 'audio',
    pricingType: 'per_minute', costPerSecond: 50_000,
    capabilities: ['stt', 'transcription', 'real_time', 'multilingual'],
    status: 'coming_soon', requiresApiKey: 'DEEPGRAM_API_KEY',
    icon: '🎙️', color: '#14B8A6', description: 'Ultra-fast transcription', bestFor: 'Sous-titres, transcription rushes',
  },
]

// ─── Music Models ───────────────────────────────────────────────────

export const MUSIC_MODELS: AIModel[] = [
  {
    id: 'suno-v4', name: 'Suno V4', provider: 'Suno', category: 'music',
    pricingType: 'per_request', costPerRequest: 5_000_000,
    maxDuration: '4min', capabilities: ['text_to_music', 'vocals', 'genres', 'full_songs'],
    status: 'coming_soon', requiresApiKey: 'SUNO_API_KEY',
    icon: '🎵', color: '#EF4444', description: 'Full music with vocals', bestFor: 'Bande originale, chansons',
  },
  {
    id: 'udio-v1', name: 'Udio', provider: 'Udio', category: 'music',
    pricingType: 'per_request', costPerRequest: 4_000_000,
    maxDuration: '2min', capabilities: ['text_to_music', 'genres', 'instrumental'],
    status: 'coming_soon', requiresApiKey: 'UDIO_API_KEY',
    icon: '🎼', color: '#8B5CF6', description: 'Musique instrumentale pro', bestFor: 'Underscore, ambiances',
  },
]

// ─── All Models ─────────────────────────────────────────────────────

export const ALL_AI_MODELS: AIModel[] = [
  ...LLM_MODELS,
  ...VIDEO_MODELS,
  ...IMAGE_MODELS,
  ...AUDIO_MODELS,
  ...MUSIC_MODELS,
]

export function getModelById(id: string): AIModel | undefined {
  return ALL_AI_MODELS.find(m => m.id === id)
}

export function getModelsByCategory(category: ProviderCategory): AIModel[] {
  return ALL_AI_MODELS.filter(m => m.category === category)
}

export function getAvailableModels(): AIModel[] {
  return ALL_AI_MODELS.filter(m => m.status === 'available')
}

/** Get estimated cost for a model */
export function estimateModelCost(modelId: string, params?: { tokens?: number; seconds?: number }): number {
  const model = getModelById(modelId)
  if (!model) return 0

  if (model.pricingType === 'per_request') return model.costPerRequest ?? 0
  if (model.pricingType === 'per_second') return (model.costPerSecond ?? 0) * (params?.seconds ?? 5)
  if (model.pricingType === 'per_token' && params?.tokens) {
    return Math.ceil((params.tokens * (model.outputCostPer1M ?? 0)) / 1_000_000)
  }
  return 0
}

// ─── Task → Model Mapping (imposed models for coherence) ───────────

export interface TaskModelMapping {
  taskType: string
  userChoice: boolean     // Can user choose model?
  defaultModel: string    // Default/imposed model
  allowedModels: string[] // Models user can choose from (if userChoice=true)
  reason: string
}

export const TASK_MODEL_MAPPINGS: TaskModelMapping[] = [
  // User can choose
  { taskType: 'STORYBOARD', userChoice: true, defaultModel: 'sdxl-turbo', allowedModels: ['sdxl-turbo', 'flux-pro', 'dall-e-3', 'midjourney-v6'], reason: 'Storyboards = creative, free choice' },
  { taskType: 'CONCEPT_ART', userChoice: true, defaultModel: 'flux-pro', allowedModels: ['flux-pro', 'sdxl-turbo', 'dall-e-3', 'midjourney-v6'], reason: 'Concept art = creative, free choice' },
  { taskType: 'MUSIC_COMPOSE', userChoice: true, defaultModel: 'suno-v4', allowedModels: ['suno-v4', 'udio-v1'], reason: 'Standalone music = free choice' },
  { taskType: 'VOICE_ACTING', userChoice: true, defaultModel: 'elevenlabs-v2', allowedModels: ['elevenlabs-v2', 'openai-tts-hd'], reason: 'Voice = personal preference' },
  { taskType: 'BRAINSTORM', userChoice: true, defaultModel: 'claude-sonnet-4-6', allowedModels: ['claude-haiku-4-5', 'claude-sonnet-4-6', 'gpt-4o', 'gemini-2-flash', 'mistral-large'], reason: 'Brainstorming = creative, free choice' },

  // System imposed for coherence
  { taskType: 'SCREENPLAY_CONTINUE', userChoice: false, defaultModel: 'claude-sonnet-4-6', allowedModels: ['claude-sonnet-4-6'], reason: 'Screenplay continuation = narrative consistency required' },
  { taskType: 'VFX_MATCH', userChoice: false, defaultModel: 'flux-pro', allowedModels: ['flux-pro'], reason: 'VFX matching = visual consistency required' },
  { taskType: 'VIDEO_SCENE', userChoice: false, defaultModel: 'kling-v2', allowedModels: ['kling-v2'], reason: 'Film scenes = enforced cinema quality' },
  { taskType: 'DIALOGUE_VOICE', userChoice: false, defaultModel: 'elevenlabs-v2', allowedModels: ['elevenlabs-v2'], reason: 'Character voices = enforced voice consistency' },
  { taskType: 'COHERENCE_REVIEW', userChoice: false, defaultModel: 'claude-opus-4-6', allowedModels: ['claude-opus-4-6'], reason: 'Consistency review = deep analysis required' },
]

export function getTaskModelMapping(taskType: string): TaskModelMapping | undefined {
  return TASK_MODEL_MAPPINGS.find(m => m.taskType === taskType)
}
