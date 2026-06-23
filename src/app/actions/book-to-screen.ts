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
    high: `"${title}" shows excellent potential for a film adaptation. The ${genre} genre, combined with rich storytelling, offers many visual possibilities. Recommended for priority production.`,
    medium: `"${title}" is a promising candidate for adaptation. The visual potential is good, but some narrative aspects may require deeper adaptation work.`,
    low: `"${title}" needs careful consideration before adaptation. The move from the literary format to the cinematic format could pose significant challenges.`,
  }

  const feedbackKey = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low'

  // Generate adaptation outline
  const adaptationOutline = `# ADAPTATION OUTLINE — "${title}"

## Source
- **Original title**: ${title}
- **Genre**: ${genre}
- **Pages**: ${pageCount}
- **Suggested format**: ${suggestedFormat === 'SERIES' ? 'Series (6-10 episodes)' : suggestedFormat === 'FEATURE' ? 'Feature film (90-120 min)' : 'Short film (15-30 min)'}

## Proposed Structure

### Act I — Setup (25%)
- Introduce the world and the main character
- Establish the stakes
- Inciting incident

### Act II — Confrontation (50%)
- Rising obstacles
- Development of relationships
- Midpoint / revelation
- Escalating tension

### Act III — Resolution (25%)
- Climax
- Resolution of conflicts
- Denouement / open ending

## Adaptation Notes
- **Elements to keep**: main characters, central narrative arc, atmosphere of the ${genre} genre
- **Elements to adapt**: inner monologues → dialogue, descriptions → visuals
- **Possible additions**: visual action scenes, condensed dialogue, cinematic pacing
${estimatedBudget === 'HIGH' ? '\n- **VFX budget**: plan a significant budget for visual effects' : ''}

## Recommended Team
- 1 adaptation screenwriter
- 1 storyboard artist
- ${estimatedBudget === 'HIGH' ? '2-3 concept artists' : '1 concept artist'}
- 1 art director

*Outline generated automatically by the CINEGENY Studio Pipeline.*
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
    return { error: 'Title, synopsis and genre are required' }
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
      logline: `Film adaptation of the book "${title}" by ${author || 'Unknown'}${publisher ? ` (${publisher})` : ''}${isbn ? ` — ISBN: ${isbn}` : ''}`,
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
