/**
 * AI Pricing Configuration — CineGeny Wallet System
 *
 * All costs are in MICRO-CREDITS (1 credit = 1,000,000 micro-credits)
 * This avoids floating-point precision issues in financial calculations.
 *
 * TOKEN_MARGIN_PERCENT: Platform margin on top of raw AI costs.
 * Set to 0% for launch — users pay ONLY the raw AI cost.
 */

export const MICRO_CREDITS_PER_CREDIT = 1_000_000

export const TOKEN_MARGIN_PERCENT = parseFloat(process.env.TOKEN_MARGIN_PERCENT || '0')

// ─── Pricing per 1M tokens (in micro-credits) ──────────────────────
export interface ModelPricing {
  inputPer1M: number   // micro-credits per 1M input tokens
  outputPer1M: number  // micro-credits per 1M output tokens
  label: string        // Display name
  provider: string
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // ─── Anthropic ───
  'claude-haiku-4-5': {
    inputPer1M: 80_000,
    outputPer1M: 400_000,
    label: 'Claude Haiku 4.5',
    provider: 'anthropic',
  },
  'claude-sonnet-4-6': {
    inputPer1M: 300_000,
    outputPer1M: 1_500_000,
    label: 'Claude Sonnet 4.6',
    provider: 'anthropic',
  },
  'claude-opus-4-6': {
    inputPer1M: 1_500_000,
    outputPer1M: 7_500_000,
    label: 'Claude Opus 4.6',
    provider: 'anthropic',
  },
  // ─── OpenAI ───
  'gpt-4o': {
    inputPer1M: 250_000,
    outputPer1M: 1_000_000,
    label: 'GPT-4o',
    provider: 'openai',
  },
  'gpt-4o-mini': {
    inputPer1M: 15_000,
    outputPer1M: 60_000,
    label: 'GPT-4o Mini',
    provider: 'openai',
  },
  // ─── Image Generation ───
  'runway-gen3': {
    inputPer1M: 0,
    outputPer1M: 0,
    label: 'Runway Gen-3 Alpha',
    provider: 'runway',
  },
  'replicate-sdxl': {
    inputPer1M: 0,
    outputPer1M: 0,
    label: 'Stable Diffusion XL',
    provider: 'replicate',
  },
  // ─── Audio ───
  'elevenlabs-tts': {
    inputPer1M: 0,
    outputPer1M: 0,
    label: 'ElevenLabs TTS',
    provider: 'elevenlabs',
  },
}

// ─── Fixed-price actions (in micro-credits) ──────────────────────
export interface ActionPricing {
  costMicroCredits: number
  label: string
  description: string
  category: 'script' | 'image' | 'video' | 'audio' | 'analysis'
}

export const ACTION_PRICING: Record<string, ActionPricing> = {
  script_analysis: {
    costMicroCredits: 500_000,    // 0.5 credits
    label: 'Script Analysis',
    description: 'AI analysis of your screenplay with feedback and suggestions',
    category: 'script',
  },
  storyboard_frame: {
    costMicroCredits: 1_000_000,  // 1 credit
    label: 'Storyboard Frame',
    description: 'Generate one storyboard frame from scene description',
    category: 'image',
  },
  still_image: {
    costMicroCredits: 1_500_000,  // 1.5 credits
    label: 'Still Image',
    description: 'High-quality film still generation',
    category: 'image',
  },
  video_clip_5s: {
    costMicroCredits: 10_000_000, // 10 credits
    label: 'Video Clip (5s)',
    description: '5-second AI video clip generation',
    category: 'video',
  },
  video_clip_15s: {
    costMicroCredits: 25_000_000, // 25 credits
    label: 'Video Clip (15s)',
    description: '15-second AI video clip generation',
    category: 'video',
  },
  music_track: {
    costMicroCredits: 5_000_000,  // 5 credits
    label: 'Music Track',
    description: 'AI music composition (30s-2min)',
    category: 'audio',
  },
  sfx_generation: {
    costMicroCredits: 2_000_000,  // 2 credits
    label: 'Sound Effect',
    description: 'AI sound effect generation',
    category: 'audio',
  },
  voice_clone: {
    costMicroCredits: 3_000_000,  // 3 credits
    label: 'Voice Clone',
    description: 'Clone a voice for character dialogue',
    category: 'audio',
  },
  trailer_full: {
    costMicroCredits: 50_000_000, // 50 credits
    label: 'Full Trailer',
    description: 'Complete trailer assembly with AI',
    category: 'video',
  },
}

// ─── Helper Functions ──────────────────────────────────────────────

/** Convert display credits to internal micro-credits */
export function creditsToMicro(credits: number): number {
  return Math.round(credits * MICRO_CREDITS_PER_CREDIT)
}

/** Convert internal micro-credits to display credits */
export function microToCredits(microCredits: number): number {
  return microCredits / MICRO_CREDITS_PER_CREDIT
}

/** Format micro-credits for display (e.g., "1.50 credits") */
export function formatCredits(microCredits: number): string {
  const credits = microToCredits(microCredits)
  if (credits >= 1) return `${credits.toFixed(2)} credits`
  return `${(credits * 100).toFixed(0)} centimes`
}

/** Format micro-credits as EUR (e.g., "€0.15") — assumes 1 credit = 0.10€ base */
export function formatEur(microCredits: number, creditPriceEur = 0.10): string {
  const eur = microToCredits(microCredits) * creditPriceEur
  return `€${eur.toFixed(4)}`
}

/**
 * Calculate cost for a token-based AI call
 * Returns costs in micro-credits
 */
export function calculateTokenCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): { costCredits: number; billedCredits: number; marginCredits: number } {
  const pricing = MODEL_PRICING[model] || {
    inputPer1M: 500_000,
    outputPer1M: 2_500_000,
    label: 'Unknown',
    provider: 'unknown',
  }

  const inputCost = Math.ceil((inputTokens * pricing.inputPer1M) / 1_000_000)
  const outputCost = Math.ceil((outputTokens * pricing.outputPer1M) / 1_000_000)
  const costCredits = inputCost + outputCost

  const billedCredits = Math.ceil(costCredits * (1 + TOKEN_MARGIN_PERCENT / 100))
  const marginCredits = billedCredits - costCredits

  return { costCredits, billedCredits, marginCredits }
}

/**
 * Calculate cost for a fixed-price action
 */
export function calculateActionCost(
  action: string
): { costCredits: number; billedCredits: number; marginCredits: number } {
  const pricing = ACTION_PRICING[action]
  if (!pricing) {
    throw new Error(`Unknown action: ${action}`)
  }

  const costCredits = pricing.costMicroCredits
  const billedCredits = Math.ceil(costCredits * (1 + TOKEN_MARGIN_PERCENT / 100))
  const marginCredits = billedCredits - costCredits

  return { costCredits, billedCredits, marginCredits }
}

/**
 * Estimate max cost for a token-based call (for hold amount)
 * Uses conservative estimate: assume max output tokens
 */
export function estimateMaxCost(
  model: string,
  inputTokens: number,
  maxOutputTokens: number = 4096
): number {
  const { billedCredits } = calculateTokenCost(model, inputTokens, maxOutputTokens)
  // Add 20% safety buffer
  return Math.ceil(billedCredits * 1.2)
}

/** Get all pricing data for the transparent pricing page */
export function getAllPricing() {
  return {
    marginPercent: TOKEN_MARGIN_PERCENT,
    models: Object.entries(MODEL_PRICING).map(([id, p]) => ({
      id,
      ...p,
      inputPer1MCredited: microToCredits(p.inputPer1M),
      outputPer1MCredited: microToCredits(p.outputPer1M),
    })),
    actions: Object.entries(ACTION_PRICING).map(([id, p]) => ({
      id,
      ...p,
      costCredits: microToCredits(p.costMicroCredits),
    })),
  }
}
