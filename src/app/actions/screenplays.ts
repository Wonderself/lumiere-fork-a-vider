'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createNotification } from '@/lib/notifications'
import { registerContentHash } from '@/lib/content-hash'
import { recordEvent } from '@/lib/blockchain'
import { generateScreenplayDeal } from '@/lib/contracts'
import { sendScreenplayAcceptedEmail } from '@/lib/email'
import { z } from 'zod'

const screenplaySchema = z.object({
  title: z.string().min(2, 'Titre trop court').max(200),
  logline: z.string().max(500).optional(),
  genre: z.string().optional(),
  content: z.string().min(100, 'Le scénario doit contenir au moins 100 caractères'),
  modificationTolerance: z.coerce.number().min(0).max(50).default(20),
  revenueShareBps: z.coerce.number().min(0).max(3000).default(0),
})

// Mock AI evaluation for screenplays
function evaluateScreenplay(content: string, title: string): { score: number; feedback: string } {
  // Deterministic scoring based on content characteristics
  let score = 60

  // Length bonus
  if (content.length > 5000) score += 10
  if (content.length > 10000) score += 5

  // Structure indicators
  if (content.includes('INT.') || content.includes('EXT.')) score += 5 // Screenplay format
  if (content.includes('FONDU') || content.includes('CUT TO')) score += 3
  if (content.split('\n').length > 50) score += 5 // Multiple scenes

  // Dialogue indicators
  const dialogueCount = (content.match(/[A-Z]{2,}\n/g) || []).length
  if (dialogueCount > 5) score += 5
  if (dialogueCount > 15) score += 3

  // Cap at 95
  score = Math.min(score, 95)

  const feedbacks: Record<string, string> = {
    excellent: `"${title}" présente une qualité narrative remarquable. La structure est solide, les dialogues sont naturels, et le potentiel visuel est élevé. Recommandé pour production.`,
    good: `"${title}" est un scénario prometteur avec une bonne base narrative. Quelques ajustements sur le rythme et les transitions amélioreraient l'ensemble.`,
    average: `"${title}" nécessite un travail supplémentaire. La trame narrative a du potentiel mais la structure et les dialogues peuvent être renforcés.`,
    poor: `"${title}" ne répond pas encore aux critères de production. Un retravail significatif est recommandé sur la structure narrative et le format.`,
  }

  let category: string
  if (score >= 80) category = 'excellent'
  else if (score >= 65) category = 'good'
  else if (score >= 50) category = 'average'
  else category = 'poor'

  return { score, feedback: feedbacks[category] }
}

export async function submitScreenplayAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const parsed = screenplaySchema.safeParse({
    title: formData.get('title'),
    logline: formData.get('logline'),
    genre: formData.get('genre'),
    content: formData.get('content'),
    modificationTolerance: formData.get('modificationTolerance'),
    revenueShareBps: formData.get('revenueShareBps'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Données invalides' }
  }

  const { title, logline, genre, content, modificationTolerance, revenueShareBps } = parsed.data

  // Run mock AI evaluation
  const { score, feedback } = evaluateScreenplay(content, title)
  const status = score >= 65 ? 'ACCEPTED' : 'REJECTED'

  const screenplay = await prisma.screenplay.create({
    data: {
      userId: session.user.id,
      title,
      logline,
      genre,
      content,
      modificationTolerance,
      revenueShareBps,
      aiScore: score,
      aiFeedback: feedback,
      status: status as 'ACCEPTED' | 'REJECTED',
    },
  })

  // Register content hash for IP protection
  await registerContentHash('screenplay', screenplay.id, content, session.user.id)

  // Notify user
  await createNotification(session.user.id, 'SUBMISSION_REVIEWED', `Scénario "${title}" évalué`, {
    body: `Score IA : ${score}/100 — ${status === 'ACCEPTED' ? 'Accepté' : 'À retravailler'}`,
    href: '/screenplays',
  })

  // Send email if accepted
  if (status === 'ACCEPTED') {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, displayName: true },
    })
    if (user?.email) {
      const sharePct = revenueShareBps / 100
      sendScreenplayAcceptedEmail(user.email, user.displayName || 'Auteur', title, sharePct).catch((err) => console.error("[Email] Failed to send screenplay accepted email:", err))
    }
  }

  revalidatePath('/screenplays')
  return { success: true }
}

// ─── Admin: Generate Deal for Accepted Screenplay ────────────

export async function generateScreenplayDealAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return { error: 'Non autorisé' }

  const screenplayId = formData.get('screenplayId') as string
  if (!screenplayId) return { error: 'ID manquant' }

  const screenplay = await prisma.screenplay.findUnique({
    where: { id: screenplayId },
    include: { user: { select: { displayName: true, email: true } } },
  })

  if (!screenplay) return { error: 'Scénario introuvable' }
  if (screenplay.status !== 'ACCEPTED') return { error: 'Le scénario doit être accepté pour générer un deal' }

  const revenueSharePct = screenplay.revenueShareBps > 0
    ? screenplay.revenueShareBps / 100
    : 5 // Default 5% if not specified

  const dealMarkdown = generateScreenplayDeal({
    writerName: screenplay.user.displayName || 'Auteur',
    screenplayTitle: screenplay.title,
    genre: screenplay.genre || 'Non spécifié',
    revenueSharePct,
    modificationTolerancePct: screenplay.modificationTolerance,
    signDate: new Date().toISOString().split('T')[0],
  })

  // Store deal in screenplay record (using aiFeedback field for deal terms — pragmatic)
  await prisma.screenplay.update({
    where: { id: screenplayId },
    data: {
      status: 'ACCEPTED' as never,
      aiFeedback: `${screenplay.aiFeedback || ''}\n\n---\n\n${dealMarkdown}`,
    },
  })

  // Notify writer
  await createNotification(screenplay.userId, 'SYSTEM' as never, 'Deal proposé pour votre scénario', {
    body: `Un contrat de ${revenueSharePct}% des revenus vous est proposé pour "${screenplay.title}". Consultez les détails sur votre page scénarios.`,
    href: '/screenplays',
  })

  // Record on blockchain
  await recordEvent({
    type: 'SCREENPLAY_DEAL_CREATED',
    entityType: 'Screenplay',
    entityId: screenplayId,
    data: { userId: screenplay.userId, revenueSharePct, title: screenplay.title },
  }).catch((err) => console.error("[Blockchain] Failed to record SCREENPLAY_DEAL_CREATED:", err))

  // Send email
  if (screenplay.user.email) {
    sendScreenplayAcceptedEmail(
      screenplay.user.email,
      screenplay.user.displayName || 'Auteur',
      screenplay.title,
      revenueSharePct
    ).catch((err) => console.error("[Email] Failed to send screenplay deal email:", err))
  }

  revalidatePath('/admin/screenplays')
  revalidatePath('/screenplays')
  return { success: true }
}
