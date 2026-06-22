'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { generateSynopsis, analyzeScenario } from '@/lib/ai-review'

export async function generateSynopsisAction(
  _prev: { error?: string; logline?: string; synopsis?: string; genres?: string[] } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  const genre = (formData.get('genre') as string)?.trim()

  if (!title || title.length < 2) {
    return { error: 'Donnez un titre (minimum 2 caracteres).' }
  }
  if (!genre) {
    return { error: 'Choisissez un genre.' }
  }

  const result = await generateSynopsis(title, genre)
  if (!result) {
    return { error: "L'IA n'est pas disponible pour le moment. Reessayez plus tard." }
  }

  return {
    logline: result.logline,
    synopsis: result.synopsis,
    genres: result.genres,
  }
}

export async function analyzeScenarioAction(
  proposalId: string,
  title: string,
  logline: string,
  synopsis: string | null,
  genre: string | null
) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const result = await analyzeScenario(title, logline, synopsis, genre)
  if (!result) {
    return { error: "L'IA n'est pas disponible." }
  }

  return {
    score: result.score,
    analysis: result.analysis,
    suggestions: result.suggestions,
  }
}

/**
 * AI Task Description Enrichment
 * Takes a basic task title/type and generates a rich description with
 * instructions, deliverables and quality criteria.
 */
export async function enrichTaskDescriptionAction(
  taskTitle: string,
  taskType: string,
  filmGenre: string | null,
  filmTitle: string | null,
) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Only admin can enrich
  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== 'ADMIN') return { error: 'Acces refuse.' }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return { error: "Cle API IA non configuree." }
  }

  const client = new Anthropic({ apiKey: key })

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Tu es un directeur de production de cinema IA. Enrichis cette tache pour un contributeur freelance.

Tache: "${taskTitle}"
Type: ${taskType}
${filmGenre ? `Genre du film: ${filmGenre}` : ''}
${filmTitle ? `Film: ${filmTitle}` : ''}

Reponds en JSON avec:
- "description": description claire en 2-3 phrases (en francais)
- "instructions": liste de 3-5 instructions precises
- "deliverables": ce que le contributeur doit livrer (1-3 items)
- "qualityCriteria": 2-3 criteres de qualite pour la validation

JSON uniquement, pas de markdown.`,
      }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const parsed = JSON.parse(text)

    return {
      description: parsed.description as string,
      instructions: parsed.instructions as string[],
      deliverables: parsed.deliverables as string[],
      qualityCriteria: parsed.qualityCriteria as string[],
    }
  } catch {
    return { error: "Erreur lors de l'enrichissement IA." }
  }
}
