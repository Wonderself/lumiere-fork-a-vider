'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import { recordEvent } from '@/lib/blockchain'

/**
 * Book-to-Screen Pipeline — Éditions Ruppin & IP Partners
 *
 * Flow:
 * 1. Admin/Partner submits book metadata (title, author, synopsis, genre)
 * 2. System generates adaptation outline (screenplay skeleton)
 * 3. AI evaluates adaptation potential (score + breakdown)
 * 4. If approved, creates a screenplay entry + film project
 *
 * This enables book publishers to submit IP for automated adaptation.
 */

// ─── Book Adaptation Scoring ────────────────────────────────

type AdaptationAnalysis = {
  score: number
  visualPotential: number
  dialogueDensity: number
  narrativeStructure: number
  marketAppeal: number
  estimatedBudget: 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKBUSTER'
  suggestedFormat: 'SHORT' | 'FEATURE' | 'SERIES'
  feedback: string
  adaptationOutline: string
}

function analyzeBookForAdaptation(params: {
  title: string
  synopsis: string
  genre: string
  pageCount: number
  hasDialogue: boolean
}): AdaptationAnalysis {
  const { title, synopsis, genre, pageCount, hasDialogue } = params
  let score = 55

  // Visual potential (based on genre)
  const visualGenres = ['Science-Fiction', 'Fantasy', 'Action', 'Thriller', 'Horreur', 'Animation']
  const visualPotential = visualGenres.includes(genre) ? 85 : 65
  score += visualGenres.includes(genre) ? 10 : 0

  // Dialogue density
  const dialogueDensity = hasDialogue ? 80 : 50
  score += hasDialogue ? 5 : 0

  // Narrative structure (based on synopsis length & complexity indicators)
  const synopsisWords = synopsis.split(' ').length
  const narrativeStructure = synopsisWords > 100 ? 80 : synopsisWords > 50 ? 65 : 50
  score += synopsisWords > 100 ? 8 : synopsisWords > 50 ? 4 : 0

  // Market appeal (popular genres)
  const popularGenres = ['Thriller', 'Science-Fiction', 'Drame', 'Romance', 'Comedy']
  const marketAppeal = popularGenres.includes(genre) ? 80 : 60
  score += popularGenres.includes(genre) ? 7 : 0

  // Page count factor
  if (pageCount > 300) score += 5 // Rich source material
  if (pageCount < 80) score -= 5 // May be too thin

  score = Math.min(95, Math.max(30, score))

  // Budget estimation
  const estimatedBudget: AdaptationAnalysis['estimatedBudget'] =
    visualGenres.includes(genre) && pageCount > 200 ? 'HIGH' :
    pageCount > 300 ? 'HIGH' :
    pageCount > 150 ? 'MEDIUM' : 'LOW'

  // Format suggestion
  const suggestedFormat: AdaptationAnalysis['suggestedFormat'] =
    pageCount > 400 ? 'SERIES' :
    pageCount > 100 ? 'FEATURE' : 'SHORT'

  // Feedback
  const feedbackMap: Record<string, string> = {
    high: `"${title}" présente un excellent potentiel d'adaptation cinématographique. Le genre ${genre}, combiné à une narration riche, offre de nombreuses possibilités visuelles. Recommandé pour production prioritaire.`,
    medium: `"${title}" est un candidat prometteur pour l'adaptation. Le potentiel visuel est bon, mais certains aspects narratifs pourraient nécessiter un travail d'adaptation plus poussé.`,
    low: `"${title}" nécessite une réflexion approfondie avant adaptation. Le passage du format littéraire au format cinématographique pourrait poser des défis importants.`,
  }

  const feedbackKey = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low'

  // Generate adaptation outline
  const adaptationOutline = `# OUTLINE D'ADAPTATION — "${title}"

## Source
- **Titre original** : ${title}
- **Genre** : ${genre}
- **Pages** : ${pageCount}
- **Format suggéré** : ${suggestedFormat === 'SERIES' ? 'Series (6-10 episodes)' : suggestedFormat === 'FEATURE' ? 'Feature film (90-120 min)' : 'Short film (15-30 min)'}

## Structure Proposée

### Acte I — Mise en Place (25%)
- Présentation du monde et du personnage principal
- Établissement des enjeux
- Incident déclencheur

### Acte II — Confrontation (50%)
- Obstacles croissants
- Développement des relations
- Point médian / révélation
- Montée en tension

### Acte III — Résolution (25%)
- Climax
- Résolution des conflits
- Dénouement / ouverture

## Notes d'Adaptation
- **Éléments à conserver** : personnages principaux, arc narratif central, atmosphère du genre ${genre}
- **Éléments à adapter** : monologues intérieurs → dialogues, descriptions → visuels
- **Ajouts possibles** : scènes d'action visuelles, dialogues condensés, rythme cinématographique
${estimatedBudget === 'HIGH' ? '\n- **VFX budget**: plan a significant budget for visual effects' : ''}

## Équipe Recommandée
- 1 scénariste adaptateur
- 1 story-boarder
- ${estimatedBudget === 'HIGH' ? '2-3 designers concept art' : '1 designer concept art'}
- 1 directeur artistique

*Outline généré automatiquement par le Pipeline CINEGENY Studio.*
`

  return {
    score,
    visualPotential,
    dialogueDensity,
    narrativeStructure,
    marketAppeal,
    estimatedBudget,
    suggestedFormat,
    feedback: feedbackMap[feedbackKey],
    adaptationOutline,
  }
}

// ─── Server Actions ─────────────────────────────────────────

/**
 * Submit a book for adaptation analysis.
 * Can be used by admins or partner publishers.
 */
export async function submitBookForAdaptationAction(
  prevState: { error?: string; success?: boolean; analysis?: AdaptationAnalysis } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const synopsis = formData.get('synopsis') as string
  const genre = formData.get('genre') as string
  const pageCount = parseInt(formData.get('pageCount') as string || '200', 10)
  const hasDialogue = formData.get('hasDialogue') === 'true'
  const publisher = formData.get('publisher') as string
  const isbn = formData.get('isbn') as string

  if (!title || !synopsis || !genre) {
    return { error: 'Titre, synopsis et genre sont requis' }
  }

  // Run analysis
  const analysis = analyzeBookForAdaptation({
    title, synopsis, genre, pageCount, hasDialogue,
  })

  // Create screenplay entry from the book
  const screenplay = await prisma.screenplay.create({
    data: {
      userId: session.user.id,
      title: `[Adaptation] ${title}`,
      logline: `Adaptation cinématographique du livre "${title}" de ${author || 'Inconnu'}${publisher ? ` (${publisher})` : ''}${isbn ? ` — ISBN: ${isbn}` : ''}`,
      genre,
      content: analysis.adaptationOutline,
      aiScore: analysis.score,
      aiFeedback: analysis.feedback,
      modificationTolerance: 30, // Higher tolerance for adaptations
      revenueShareBps: 300, // 3% default for book adaptations
      status: (analysis.score >= 65 ? 'ACCEPTED' : 'SUBMITTED') as never,
    },
  })

  // Notify admin
  await createNotification(session.user.id, 'SYSTEM' as never, `Adaptation analysis complete`, {
    body: `"${title}" — Score: ${analysis.score}/100 — ${analysis.suggestedFormat} — ${analysis.estimatedBudget} budget`,
    href: '/screenplays',
  })

  // Record blockchain event
  await recordEvent({
    type: 'CONTENT_REGISTERED',
    entityType: 'Screenplay',
    entityId: screenplay.id,
    data: {
      userId: session.user.id,
      bookTitle: title,
      author,
      publisher,
      adaptationScore: analysis.score,
    },
  }).catch((err) => console.error("[Blockchain] Failed to record book-to-screen submission:", err))

  revalidatePath('/screenplays')
  return { success: true, analysis }
}
