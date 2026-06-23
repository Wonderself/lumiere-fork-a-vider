/**
 * CineGeny Task AI Service
 * AI assistance for creative tasks: review, suggestions, coherence check.
 */

import { getAgentBySlug } from '@/data/agents'
import { getTaskModelMapping, getModelById } from '@/lib/ai-providers'

// ─── Task → Agent Mapping ──────────────────────────────────────────

export interface TaskAgent {
  taskCategory: string
  agentSlug: string
  name: string
  capabilities: string[]
}

export const TASK_AGENTS: TaskAgent[] = [
  { taskCategory: 'screenplay', agentSlug: 'cg-scenariste', name: 'Scénariste IA', capabilities: ['write', 'review', 'suggest', 'continue', 'dialogue'] },
  { taskCategory: 'vfx', agentSlug: 'cg-vfx', name: 'VFX Supervisor IA', capabilities: ['concept_art', 'vfx_breakdown', 'compositing', 'review'] },
  { taskCategory: 'music', agentSlug: 'cg-compositeur', name: 'Compositeur IA', capabilities: ['compose', 'arrange', 'brief', 'cue_sheet'] },
  { taskCategory: 'directing', agentSlug: 'cg-realisateur', name: 'Réalisateur IA', capabilities: ['shot_list', 'blocking', 'notes', 'review'] },
  { taskCategory: 'editing', agentSlug: 'cg-monteur', name: 'Monteur IA', capabilities: ['edit_notes', 'pacing', 'transitions', 'review'] },
  { taskCategory: 'cinematography', agentSlug: 'cg-directeur-photo', name: 'Dir Photo IA', capabilities: ['lighting', 'color', 'lut', 'references'] },
  { taskCategory: 'sound', agentSlug: 'cg-sound-design', name: 'Sound Designer IA', capabilities: ['foley', 'ambience', 'mix', 'review'] },
]

export function getTaskAgent(taskCategory: string): TaskAgent | undefined {
  return TASK_AGENTS.find(a => a.taskCategory === taskCategory)
}

// ─── Coherence Check ────────────────────────────────────────────────

export interface CoherenceCheckResult {
  passed: boolean
  score: number        // 0-100
  issues: CoherenceIssue[]
  suggestions: string[]
}

export interface CoherenceIssue {
  type: 'character' | 'timeline' | 'style' | 'continuity' | 'tone'
  severity: 'error' | 'warning' | 'info'
  description: string
  location?: string
}

/**
 * Check submission coherence with the rest of the film.
 * In production, this calls Claude Opus for deep analysis.
 */
export async function checkCoherence(params: {
  filmProjectId: string
  taskType: string
  content: string
  existingContext?: string
}): Promise<CoherenceCheckResult> {
  // Simulated coherence check — in production, sends to Claude Opus
  const issues: CoherenceIssue[] = []
  const suggestions: string[] = []

  // Character name consistency check (simple heuristic)
  const characterNames = params.content.match(/[A-Z][a-zà-ü]+/g) || []
  if (characterNames.length > 20) {
    issues.push({
      type: 'character',
      severity: 'warning',
      description: 'Beaucoup de noms propres détectés. Vérifiez la cohérence avec les personnages existants.',
    })
  }

  // Length check
  if (params.content.length < 100) {
    issues.push({
      type: 'continuity',
      severity: 'info',
      description: 'Contenu court. Assurez-vous qu\'il est suffisant pour la tâche.',
    })
  }

  // Style consistency (placeholder)
  suggestions.push(
    'Vérifiez que le ton correspond au reste du projet',
    'Assurez-vous de la continuité temporelle avec les scènes précédentes'
  )

  const errorCount = issues.filter(i => i.severity === 'error').length
  const warningCount = issues.filter(i => i.severity === 'warning').length
  const score = Math.max(0, 100 - errorCount * 30 - warningCount * 10)

  return {
    passed: errorCount === 0,
    score,
    issues,
    suggestions,
  }
}

// ─── AI Suggestions ─────────────────────────────────────────────────

export interface AISuggestion {
  type: 'creative' | 'technical' | 'improvement'
  title: string
  content: string
  agentSlug: string
}

/**
 * Get AI suggestions when a creator is stuck.
 * In production, calls the appropriate agent.
 */
export async function getSuggestions(params: {
  taskCategory: string
  taskDescription: string
  currentContent: string
  filmContext?: string
}): Promise<AISuggestion[]> {
  const agent = getTaskAgent(params.taskCategory)

  // Simulated suggestions — in production, calls the agent via chat API
  const suggestions: AISuggestion[] = [
    {
      type: 'creative',
      title: 'Approche alternative',
      content: `Pour "${params.taskDescription.substring(0, 50)}...", essayez d'explorer une perspective différente. L'agent ${agent?.name || 'IA'} peut vous aider à développer cette idée.`,
      agentSlug: agent?.agentSlug || 'cg-scenariste',
    },
    {
      type: 'technical',
      title: 'Conseil technique',
      content: 'Assurez-vous que votre soumission respecte les standards techniques du projet. Vérifiez le format, la résolution et la cohérence stylistique.',
      agentSlug: agent?.agentSlug || 'cg-realisateur',
    },
    {
      type: 'improvement',
      title: 'Amélioration suggérée',
      content: 'Ajoutez plus de détails sensoriels et d\'émotions pour enrichir votre contribution. Les meilleurs soumissions incluent des éléments visuels et auditifs.',
      agentSlug: agent?.agentSlug || 'cg-scenariste',
    },
  ]

  return suggestions
}

// ─── AI Review Before Submission ────────────────────────────────────

export interface AIReviewResult {
  approved: boolean
  score: number           // 0-100 quality score
  coherence: CoherenceCheckResult
  feedback: string
  improvements: string[]
}

/**
 * Full AI review before submission.
 * Combines coherence check + quality assessment.
 */
export async function reviewBeforeSubmission(params: {
  filmProjectId: string
  taskType: string
  taskCategory: string
  content: string
  filmContext?: string
}): Promise<AIReviewResult> {
  // Run coherence check
  const coherence = await checkCoherence({
    filmProjectId: params.filmProjectId,
    taskType: params.taskType,
    content: params.content,
    existingContext: params.filmContext,
  })

  // Quality score (placeholder — in production, uses LLM evaluation)
  const qualityScore = Math.min(100, coherence.score + Math.floor(Math.random() * 20))

  const improvements: string[] = []
  if (qualityScore < 70) {
    improvements.push('Ajoutez plus de détails descriptifs')
    improvements.push('Check consistency with existing scenes')
  }
  if (qualityScore < 50) {
    improvements.push('Le contenu semble trop court ou incomplet')
  }

  return {
    approved: coherence.passed && qualityScore >= 60,
    score: qualityScore,
    coherence,
    feedback: qualityScore >= 80
      ? 'Excellent travail ! Votre soumission est cohérente et de haute qualité.'
      : qualityScore >= 60
      ? 'Bonne soumission avec quelques améliorations possibles.'
      : 'Des améliorations sont nécessaires avant soumission.',
    improvements,
  }
}

// ─── Video Generation Paths ─────────────────────────────────────────

export interface VideoGenerationConfig {
  provider: string
  modelId: string
  maxDuration: number      // seconds
  maxResolution: string
  supportedInputs: ('text' | 'image' | 'video')[]
  estimatedCost: number    // µ-credits
  estimatedTime: number    // seconds
}

export function getVideoGenerationConfigs(): VideoGenerationConfig[] {
  return [
    { provider: 'kling', modelId: 'kling-v2', maxDuration: 10, maxResolution: '4K', supportedInputs: ['text', 'image'], estimatedCost: 25_000_000, estimatedTime: 120 },
    { provider: 'kling', modelId: 'kling-v1-5', maxDuration: 10, maxResolution: '1080p', supportedInputs: ['text', 'image'], estimatedCost: 15_000_000, estimatedTime: 90 },
    { provider: 'runway', modelId: 'runway-gen3', maxDuration: 10, maxResolution: '1080p', supportedInputs: ['text', 'image'], estimatedCost: 20_000_000, estimatedTime: 60 },
    { provider: 'pika', modelId: 'pika-v2', maxDuration: 4, maxResolution: '1080p', supportedInputs: ['text', 'image'], estimatedCost: 8_000_000, estimatedTime: 30 },
    { provider: 'luma', modelId: 'luma-dream-machine', maxDuration: 5, maxResolution: '1080p', supportedInputs: ['text', 'image'], estimatedCost: 10_000_000, estimatedTime: 45 },
    { provider: 'minimax', modelId: 'minimax-video', maxDuration: 6, maxResolution: '1080p', supportedInputs: ['text', 'image'], estimatedCost: 12_000_000, estimatedTime: 50 },
    { provider: 'hailuo', modelId: 'hailuo-video', maxDuration: 6, maxResolution: '1080p', supportedInputs: ['text', 'image'], estimatedCost: 10_000_000, estimatedTime: 55 },
  ]
}
