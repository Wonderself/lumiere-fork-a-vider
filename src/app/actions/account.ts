'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

// ─── Export Personal Data (RGPD Art. 20 — Portabilité) ────────────

export async function exportPersonalDataAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non autorisé' }

  const userId = session.user.id

  // Fetch user profile and all related personal data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      portfolioUrl: true,
      walletAddress: true,
      role: true,
      level: true,
      skills: true,
      languages: true,
      points: true,
      tasksCompleted: true,
      tasksValidated: true,
      rating: true,
      lumenBalance: true,
      isVerified: true,
      reputationScore: true,
      reputationBadge: true,
      referralCode: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) return { error: 'Utilisateur introuvable' }

  // Fetch related data in parallel
  const [
    submissions,
    payments,
    lumenTransactions,
    achievements,
    screenplays,
    filmVotes,
    filmBackings,
    notifications,
    comments,
    scenarioProposals,
    scenarioVotes,
    contentHashes,
    reputationEvents,
  ] = await Promise.all([
    prisma.taskSubmission.findMany({
      where: { userId },
      select: {
        id: true,
        taskId: true,
        fileUrl: true,
        notes: true,
        aiScore: true,
        aiFeedback: true,
        humanFeedback: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.payment.findMany({
      where: { userId },
      select: {
        id: true,
        taskId: true,
        amountEur: true,
        method: true,
        status: true,
        paidAt: true,
        createdAt: true,
      },
    }),
    prisma.lumenTransaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      select: {
        id: true,
        achievementType: true,
        metadata: true,
        earnedAt: true,
      },
    }),
    prisma.screenplay.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        logline: true,
        genre: true,
        aiScore: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.filmVote.findMany({
      where: { userId },
      select: {
        id: true,
        filmId: true,
        voteType: true,
        createdAt: true,
      },
    }),
    prisma.filmBacker.findMany({
      where: { userId },
      select: {
        id: true,
        filmId: true,
        amountInvested: true,
        revenueShareBps: true,
        perks: true,
        createdAt: true,
      },
    }),
    prisma.notification.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        read: true,
        createdAt: true,
      },
    }),
    prisma.taskComment.findMany({
      where: { userId },
      select: {
        id: true,
        taskId: true,
        content: true,
        createdAt: true,
      },
    }),
    prisma.scenarioProposal.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        logline: true,
        synopsis: true,
        genre: true,
        status: true,
        votesCount: true,
        createdAt: true,
      },
    }),
    prisma.scenarioVote.findMany({
      where: { userId },
      select: {
        id: true,
        proposalId: true,
        createdAt: true,
      },
    }),
    prisma.contentHash.findMany({
      where: { createdById: userId },
      select: {
        id: true,
        entityType: true,
        entityId: true,
        hash: true,
        algorithm: true,
        createdAt: true,
      },
    }),
    prisma.reputationEvent.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        score: true,
        source: true,
        metadata: true,
        createdAt: true,
      },
    }),
  ])

  const exportData = {
    exportDate: new Date().toISOString(),
    format: 'RGPD Art. 20 — Portabilité des données',
    user,
    submissions,
    payments,
    lumenTransactions,
    achievements,
    screenplays,
    filmVotes,
    filmBackings,
    notifications,
    comments,
    scenarioProposals,
    scenarioVotes,
    contentHashes,
    reputationEvents,
  }

  return { data: exportData }
}

// ─── Request Account Deletion (RGPD Art. 17 — Droit à l'effacement) ──

export async function requestAccountDeletionAction(confirmEmail: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non autorisé' }

  const userId = session.user.id

  // Fetch user to verify email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (!user) return { error: 'Utilisateur introuvable' }

  // Verify the confirmation email matches
  if (user.email.toLowerCase() !== confirmEmail.trim().toLowerCase()) {
    return { error: "L'email ne correspond pas à votre compte." }
  }

  // Anonymize user data (keep record for referential integrity but strip PII)
  const anonymizedHash = createHash('sha256')
    .update(userId + Date.now().toString())
    .digest('hex')
    .slice(0, 16)

  await prisma.$transaction([
    // Anonymize user record
    prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${anonymizedHash}@anonymized.cinegen.studio`,
        displayName: 'Utilisateur supprimé',
        passwordHash: 'DELETED',
        avatarUrl: null,
        bio: null,
        portfolioUrl: null,
        walletAddress: null,
        skills: [],
        languages: [],
        referralCode: null,
        isVerified: false,
      },
    }),

    // Delete personal notifications
    prisma.notification.deleteMany({
      where: { userId },
    }),

    // Delete password reset tokens
    prisma.passwordReset.deleteMany({
      where: { userId },
    }),

    // Delete comments (personal content)
    prisma.taskComment.deleteMany({
      where: { userId },
    }),
  ])

  // Note: We keep tasks, submissions, payments, film votes, achievements,
  // lumen transactions, reputation events, and blockchain-linked data
  // for film integrity and financial records. They are linked to the
  // now-anonymized user record.

  return { success: true }
}
