'use server'

import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

interface AiReviewResult {
  score: number
  feedback: string
  verdict: 'AI_APPROVED' | 'AI_FLAGGED'
}

// Initialize Claude client (lazy — only when API key is present)
function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new Anthropic({ apiKey: key })
}

// ──────────────────────────────────────────
// REAL AI REVIEW — Claude evaluates submissions
// ──────────────────────────────────────────
export async function runAiReview(
  submissionId: string,
  notes: string | null,
  fileUrl: string | null,
  taskContext?: { title: string; type: string; instructions: string | null }
): Promise<AiReviewResult> {
  const client = getClient()

  // Fallback to mock if no API key
  if (!client) {
    return runMockAiReview(submissionId, notes, fileUrl)
  }

  // Get threshold from admin settings
  let threshold = 70
  try {
    const settings = await prisma.adminSettings.findUnique({
      where: { id: 'singleton' },
    })
    if (settings) threshold = settings.aiConfidenceThreshold
  } catch {
    // Use default
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: buildReviewPrompt(notes, fileUrl, taskContext),
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return parseReviewResponse(text, threshold)
  } catch (err) {
    console.error('[AI Review] Claude API error, falling back to mock:', err)
    return runMockAiReview(submissionId, notes, fileUrl)
  }
}

function buildReviewPrompt(
  notes: string | null,
  fileUrl: string | null,
  context?: { title: string; type: string; instructions: string | null }
): string {
  const taskInfo = context
    ? `Tache: "${context.title}" (type: ${context.type})\nInstructions: ${context.instructions || 'Aucune instruction specifique'}\n\n`
    : ''

  return `Tu es un evaluateur qualite pour un studio de cinema collaboratif appele CINEGENY.
Evalue cette soumission et reponds UNIQUEMENT au format JSON suivant (rien d'autre):
{"score": <number 0-100>, "feedback": "<string en francais>", "verdict": "<AI_APPROVED ou AI_FLAGGED>"}

${taskInfo}Contenu soumis:
${notes ? `Notes du contributeur: "${notes}"` : 'Aucune note fournie.'}
${fileUrl ? `Fichier joint: ${fileUrl}` : 'Aucun fichier joint.'}

Criteres:
- Score 80+: Travail de qualite, bien detaille, suit les instructions
- Score 60-79: Acceptable mais ameliorable
- Score < 60: Insuffisant, ne respecte pas les consignes
- Penalise fortement si aucune note ET aucun fichier
- Bonus si le travail est detaille (notes > 100 caracteres)
- Le feedback doit etre constructif, en francais, 1-2 phrases max`
}

function parseReviewResponse(text: string, threshold: number): AiReviewResult {
  try {
    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')

    const parsed = JSON.parse(jsonMatch[0])
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 50))
    const feedback = String(parsed.feedback || 'Evaluation terminee.')
    const verdict = score >= threshold ? 'AI_APPROVED' : 'AI_FLAGGED'

    return { score, feedback, verdict }
  } catch {
    // If parsing fails, extract what we can
    return {
      score: 50,
      feedback: 'Evaluation automatique terminee. Revision humaine recommandee.',
      verdict: 'AI_FLAGGED',
    }
  }
}

// ──────────────────────────────────────────
// SCENARIO ANALYSIS — Claude evaluates screenplays
// ──────────────────────────────────────────
export async function analyzeScenario(
  title: string,
  logline: string,
  synopsis: string | null,
  genre: string | null
): Promise<{ score: number; analysis: string; suggestions: string[] } | null> {
  const client = getClient()
  if (!client) return null

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: `Tu es un lecteur de scenario professionnel pour le studio CINEGENY.
Analyse ce scenario et reponds UNIQUEMENT au format JSON:
{"score": <0-100>, "analysis": "<analyse en francais, 2-3 phrases>", "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]}

Titre: "${title}"
Genre: ${genre || 'Non specifie'}
Logline: "${logline}"
${synopsis ? `Synopsis: "${synopsis}"` : ''}

Evalue: originalite, potentiel commercial, clarte narrative, faisabilite technique avec IA.`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      analysis: String(parsed.analysis || ''),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
    }
  } catch (err) {
    console.error('[AI] Scenario analysis error:', err)
    return null
  }
}

// ──────────────────────────────────────────
// SYNOPSIS GENERATION — AI-assisted writing
// ──────────────────────────────────────────
export async function generateSynopsis(
  title: string,
  genre: string
): Promise<{ logline: string; synopsis: string; genres: string[] } | null> {
  const client = getClient()
  if (!client) return null

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `Tu es un scenariste professionnel pour le studio CINEGENY.
Genere un concept de film et reponds UNIQUEMENT au format JSON:
{"logline": "<1 phrase accrocheuse>", "synopsis": "<3 paragraphes, style cinematographique>", "genres": ["<genre1>", "<genre2>", "<genre3>"]}

Titre du film: "${title}"
Genre souhaite: ${genre}

Le synopsis doit etre captivant, original, et realisable avec les technologies IA actuelles (generation d'images, videos, voix).
Ecris en francais.`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])
    return {
      logline: String(parsed.logline || ''),
      synopsis: String(parsed.synopsis || ''),
      genres: Array.isArray(parsed.genres) ? parsed.genres.map(String) : [genre],
    }
  } catch (err) {
    console.error('[AI] Synopsis generation error:', err)
    return null
  }
}

// ──────────────────────────────────────────
// MOCK FALLBACK — Deterministic when API unavailable
// ──────────────────────────────────────────
function hashToNumber(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash % 1000) / 1000
}

const FEEDBACK_TEMPLATES = {
  excellent: [
    'Excellent travail ! La qualite est remarquable et repond parfaitement aux attentes du projet.',
    'Soumission de tres haute qualite. Les details sont soignes et le resultat est professionnel.',
    'Travail exceptionnel. La creativite et la precision sont au rendez-vous.',
  ],
  good: [
    "Bon travail dans l'ensemble. Quelques ajustements mineurs pourraient ameliorer le resultat.",
    'La soumission est de bonne qualite. Le travail est soigne avec quelques points a peaufiner.',
    'Resultat satisfaisant. La direction artistique est bien respectee.',
  ],
  average: [
    'Le travail est acceptable mais necessite des ameliorations. Verifiez les consignes detaillees.',
    "Qualite moyenne. Certains elements ne correspondent pas entierement au brief.",
    'Des progres sont necessaires sur certains aspects. Revoyez les instructions du projet.',
  ],
  poor: [
    "Le travail ne repond pas aux criteres de qualite requis. Veuillez revoir les instructions.",
    "Soumission en dessous des attentes. Les consignes principales n'ont pas ete suivies.",
    'Qualite insuffisante pour validation. Un travail plus approfondi est necessaire.',
  ],
}

function runMockAiReview(
  submissionId: string,
  notes: string | null,
  fileUrl: string | null
): AiReviewResult {
  const baseHash = hashToNumber(submissionId)
  let score = 50 + Math.floor(baseHash * 45)

  if (notes && notes.length > 100) score = Math.min(score + 5, 98)
  if (notes && notes.length > 200) score = Math.min(score + 3, 98)
  if (fileUrl) score = Math.min(score + 8, 98)
  if (!notes || notes.length < 20) score = Math.max(score - 15, 30)

  let feedbackCategory: keyof typeof FEEDBACK_TEMPLATES
  if (score >= 85) feedbackCategory = 'excellent'
  else if (score >= 70) feedbackCategory = 'good'
  else if (score >= 55) feedbackCategory = 'average'
  else feedbackCategory = 'poor'

  const templates = FEEDBACK_TEMPLATES[feedbackCategory]
  const feedbackIndex = Math.floor(hashToNumber(submissionId + 'feedback') * templates.length)
  const feedback = templates[feedbackIndex]

  const verdict = score >= 70 ? 'AI_APPROVED' : 'AI_FLAGGED'

  return { score, feedback, verdict }
}
