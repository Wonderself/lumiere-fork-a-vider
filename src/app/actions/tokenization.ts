'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getTokenBalance, PLATFORM_FEE_PCT } from '@/lib/tokenization'
import { recordEvent } from '@/lib/blockchain'

// ============================================
// BUY TOKENS (PRIMARY MARKET)
// ============================================

export async function buyTokensAction(
  prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const offeringId = formData.get('offeringId') as string
  const tokenCountStr = formData.get('tokenCount') as string
  const tokenCount = parseInt(tokenCountStr, 10)

  if (!offeringId || !tokenCount || tokenCount < 1) {
    return { success: false, error: 'Nombre de tokens invalide.' }
  }

  try {
    // Fetch offering with lock-like read
    const offering = await prisma.filmTokenOffering.findUnique({
      where: { id: offeringId },
    })

    if (!offering) {
      return { success: false, error: 'Offre introuvable.' }
    }

    if (offering.status !== 'OPEN') {
      return { success: false, error: 'Cette offre n\'est pas ouverte aux investissements.' }
    }

    // Check offering dates
    const now = new Date()
    if (offering.opensAt && now < offering.opensAt) {
      return { success: false, error: 'L\'offre n\'est pas encore ouverte.' }
    }
    if (offering.closesAt && now > offering.closesAt) {
      return { success: false, error: 'L\'offre est clôturée.' }
    }

    // Check min/max investment
    if (tokenCount < offering.minInvestment) {
      return { success: false, error: `Investissement minimum : ${offering.minInvestment} token(s).` }
    }

    // Check remaining tokens
    const remaining = offering.totalTokens - offering.tokensSold
    if (tokenCount > remaining) {
      return { success: false, error: `Seulement ${remaining} token(s) disponible(s).` }
    }

    // Check max per user
    if (offering.maxPerUser) {
      const existingTokens = await getTokenBalance(offeringId, session.user.id)
      if (existingTokens + tokenCount > offering.maxPerUser) {
        return { success: false, error: `Maximum ${offering.maxPerUser} tokens par investisseur.` }
      }
    }

    // Check KYC if required
    if (offering.kycRequired) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user?.isVerified) {
        return { success: false, error: 'Vérification KYC requise avant d\'investir. Veuillez vérifier votre profil.' }
      }
    }

    // Calculate amount
    const amountPaid = tokenCount * offering.tokenPrice

    // Calculate lockup end date
    const lockedUntil = new Date()
    lockedUntil.setDate(lockedUntil.getDate() + offering.lockupDays)

    // Execute purchase in transaction
    await prisma.$transaction(async (tx) => {
      // Create purchase record
      await tx.filmTokenPurchase.create({
        data: {
          offeringId,
          userId: session.user.id,
          tokenCount,
          amountPaid,
          currency: 'EUR',
          paymentMethod: 'STRIPE',
          status: 'CONFIRMED', // In demo mode, auto-confirm
          kycVerified: true,
          lockedUntil,
        },
      })

      // Update offering stats
      await tx.filmTokenOffering.update({
        where: { id: offeringId },
        data: {
          tokensSold: { increment: tokenCount },
          raised: { increment: amountPaid },
        },
      })

      // Record lumen transaction for tracking
      await tx.lumenTransaction.create({
        data: {
          userId: session.user.id,
          amount: -tokenCount,
          type: 'TOKEN_PURCHASE',
          description: `Achat de ${tokenCount} token(s) pour ${amountPaid}€`,
          relatedId: offeringId,
        },
      })

      // Check if offering is now funded
      const updated = await tx.filmTokenOffering.findUnique({ where: { id: offeringId } })
      if (updated && updated.raised >= updated.hardCap) {
        await tx.filmTokenOffering.update({
          where: { id: offeringId },
          data: {
            status: 'FUNDED',
            fundedAt: new Date(),
          },
        })
      }
    })

    // Record token purchase on blockchain
    await recordEvent({
      type: 'TOKEN_PURCHASED',
      entityType: 'FilmTokenPurchase',
      entityId: offeringId,
      data: { userId: session.user.id, tokenCount, amountPaid, offeringId },
    }).catch((err) => console.error("[Blockchain] Failed to record TOKEN_PURCHASED:", err))

    revalidatePath(`/tokenization/${offering.filmId}`)
    revalidatePath('/tokenization')
    revalidatePath('/tokenization/portfolio')

    return { success: true }
  } catch (error) {
    console.error('buyTokensAction error:', error)
    return { success: false, error: 'Erreur lors de l\'achat. Veuillez réessayer.' }
  }
}

// ============================================
// LIST TOKENS FOR SALE (SECONDARY MARKET)
// ============================================

export async function listTokensForSaleAction(
  prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const offeringId = formData.get('offeringId') as string
  const tokenCountStr = formData.get('tokenCount') as string
  const pricePerTokenStr = formData.get('pricePerToken') as string

  const tokenCount = parseInt(tokenCountStr, 10)
  const pricePerToken = parseFloat(pricePerTokenStr)

  if (!offeringId || !tokenCount || tokenCount < 1 || !pricePerToken || pricePerToken <= 0) {
    return { success: false, error: 'Paramètres invalides.' }
  }

  try {
    // Check user has enough tokens
    const balance = await getTokenBalance(offeringId, session.user.id)
    if (balance < tokenCount) {
      return { success: false, error: `Solde insuffisant. Vous possédez ${balance} token(s).` }
    }

    // Check lockup period on purchases
    const purchases = await prisma.filmTokenPurchase.findMany({
      where: {
        offeringId,
        userId: session.user.id,
        status: 'CONFIRMED',
      },
      orderBy: { createdAt: 'asc' },
    })

    const now = new Date()
    let unlockedTokens = 0
    for (const purchase of purchases) {
      if (!purchase.lockedUntil || now >= purchase.lockedUntil) {
        unlockedTokens += purchase.tokenCount
      }
    }

    // Account for already-listed tokens (pending transfers from this user)
    const pendingSales = await prisma.filmTokenTransfer.aggregate({
      _sum: { tokenCount: true },
      where: {
        offeringId,
        fromUserId: session.user.id,
        status: 'PENDING',
      },
    })
    const alreadyListed = pendingSales._sum.tokenCount || 0
    const availableForSale = unlockedTokens - alreadyListed

    if (tokenCount > availableForSale) {
      return { success: false, error: `Seulement ${availableForSale} token(s) déverrouillé(s) et disponibles à la vente.` }
    }

    // Create transfer listing (pending, no buyer yet)
    const totalAmount = tokenCount * pricePerToken
    const fee = Math.round(totalAmount * PLATFORM_FEE_PCT) / 100

    await prisma.filmTokenTransfer.create({
      data: {
        offeringId,
        fromUserId: session.user.id,
        toUserId: session.user.id, // Placeholder — will be updated when bought
        tokenCount,
        pricePerToken,
        totalAmount,
        fee,
        status: 'PENDING',
      },
    })

    // Record token listing on blockchain
    await recordEvent({
      type: 'TOKEN_LISTED_FOR_SALE',
      entityType: 'FilmTokenTransfer',
      entityId: offeringId,
      data: { userId: session.user.id, tokenCount, pricePerToken, offeringId },
    }).catch((err) => console.error("[Blockchain] Failed to record TOKEN_LISTED_FOR_SALE:", err))

    revalidatePath(`/tokenization`)
    revalidatePath('/tokenization/portfolio')

    return { success: true }
  } catch (error) {
    console.error('listTokensForSaleAction error:', error)
    return { success: false, error: 'Erreur lors de la mise en vente. Veuillez réessayer.' }
  }
}

// ============================================
// BUY FROM SECONDARY MARKET
// ============================================

export async function buyFromSecondaryAction(
  prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const transferId = formData.get('transferId') as string
  if (!transferId) {
    return { success: false, error: 'Identifiant de l\'offre manquant.' }
  }

  try {
    const transfer = await prisma.filmTokenTransfer.findUnique({
      where: { id: transferId },
    })

    if (!transfer || transfer.status !== 'PENDING') {
      return { success: false, error: 'Cette offre n\'est plus disponible.' }
    }

    if (transfer.fromUserId === session.user.id) {
      return { success: false, error: 'Vous ne pouvez pas acheter vos propres tokens.' }
    }

    // Execute secondary purchase in transaction
    await prisma.$transaction(async (tx) => {
      // Update transfer with buyer
      await tx.filmTokenTransfer.update({
        where: { id: transferId },
        data: {
          toUserId: session.user.id,
          status: 'COMPLETED',
        },
      })

      // Record lumen transactions for both parties
      await tx.lumenTransaction.create({
        data: {
          userId: session.user.id,
          amount: -transfer.tokenCount,
          type: 'TOKEN_PURCHASE',
          description: `Achat secondaire de ${transfer.tokenCount} token(s) à ${transfer.pricePerToken}€/token`,
          relatedId: transfer.offeringId,
        },
      })

      await tx.lumenTransaction.create({
        data: {
          userId: transfer.fromUserId,
          amount: transfer.tokenCount,
          type: 'TOKEN_SALE',
          description: `Vente de ${transfer.tokenCount} token(s) à ${transfer.pricePerToken}€/token (frais: ${transfer.fee}€)`,
          relatedId: transfer.offeringId,
        },
      })
    })

    // Record secondary market purchase on blockchain
    await recordEvent({
      type: 'TOKEN_TRANSFERRED',
      entityType: 'FilmTokenTransfer',
      entityId: transferId,
      data: {
        fromUserId: transfer.fromUserId,
        toUserId: session.user.id,
        tokenCount: transfer.tokenCount,
        pricePerToken: transfer.pricePerToken,
        totalAmount: transfer.totalAmount,
        offeringId: transfer.offeringId,
      },
    }).catch((err) => console.error("[Blockchain] Failed to record TOKEN_TRANSFERRED:", err))

    revalidatePath('/tokenization')
    revalidatePath('/tokenization/portfolio')

    return { success: true }
  } catch (error) {
    console.error('buyFromSecondaryAction error:', error)
    return { success: false, error: 'Erreur lors de l\'achat. Veuillez réessayer.' }
  }
}

// ============================================
// CREATE GOVERNANCE PROPOSAL
// ============================================

export async function createProposalAction(
  prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const offeringId = formData.get('offeringId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string
  const deadlineDaysStr = formData.get('deadlineDays') as string

  if (!offeringId || !title || !description || !type) {
    return { success: false, error: 'Tous les champs sont requis.' }
  }

  if (title.length < 5 || title.length > 200) {
    return { success: false, error: 'Le titre doit contenir entre 5 et 200 caractères.' }
  }

  if (description.length < 20) {
    return { success: false, error: 'La description doit contenir au moins 20 caractères.' }
  }

  try {
    // Check user holds tokens for this offering
    const balance = await getTokenBalance(offeringId, session.user.id)
    if (balance <= 0) {
      return { success: false, error: 'Vous devez détenir des tokens pour créer une proposition.' }
    }

    // Check offering exists and has voting rights
    const offering = await prisma.filmTokenOffering.findUnique({
      where: { id: offeringId },
    })

    if (!offering) {
      return { success: false, error: 'Offre introuvable.' }
    }

    if (!offering.votingRights) {
      return { success: false, error: 'Les droits de vote ne sont pas activés pour cette offre.' }
    }

    // Set deadline (default 7 days)
    const deadlineDays = parseInt(deadlineDaysStr, 10) || 7
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + Math.min(deadlineDays, 30))

    await prisma.governanceProposal.create({
      data: {
        offeringId,
        proposerId: session.user.id,
        title,
        description,
        type: type as never,
        status: 'ACTIVE',
        quorumPct: offering.distributionPct >= 50 ? 20 : 30,
        deadline,
      },
    })

    // Record governance proposal creation on blockchain
    await recordEvent({
      type: 'GOVERNANCE_PROPOSAL_CREATED',
      entityType: 'GovernanceProposal',
      entityId: offeringId,
      data: { proposerId: session.user.id, title, type, offeringId },
    }).catch((err) => console.error("[Blockchain] Failed to record GOVERNANCE_PROPOSAL_CREATED:", err))

    revalidatePath('/tokenization/governance')
    revalidatePath(`/tokenization/${offering.filmId}`)

    return { success: true }
  } catch (error) {
    console.error('createProposalAction error:', error)
    return { success: false, error: 'Erreur lors de la création de la proposition.' }
  }
}

// ============================================
// VOTE ON PROPOSAL
// ============================================

export async function voteOnProposalAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const proposalId = formData.get('proposalId') as string
  const vote = formData.get('vote') as string // "FOR", "AGAINST", "ABSTAIN"

  if (!proposalId || !vote || !['FOR', 'AGAINST', 'ABSTAIN'].includes(vote)) {
    return { success: false, error: 'Vote invalide.' }
  }

  try {
    const proposal = await prisma.governanceProposal.findUnique({
      where: { id: proposalId },
    })

    if (!proposal) {
      return { success: false, error: 'Proposition introuvable.' }
    }

    if (proposal.status !== 'ACTIVE') {
      return { success: false, error: 'Cette proposition n\'est plus active.' }
    }

    if (new Date() > proposal.deadline) {
      return { success: false, error: 'Le délai de vote est expiré.' }
    }

    // Check user has not already voted
    const existingVote = await prisma.governanceVote.findUnique({
      where: {
        proposalId_userId: {
          proposalId,
          userId: session.user.id,
        },
      },
    })

    if (existingVote) {
      return { success: false, error: 'Vous avez déjà voté sur cette proposition.' }
    }

    // Get user's token weight (balance = voting power)
    const tokenWeight = await getTokenBalance(proposal.offeringId, session.user.id)
    if (tokenWeight <= 0) {
      return { success: false, error: 'Vous devez détenir des tokens pour voter.' }
    }

    // Record vote and update tallies
    await prisma.$transaction(async (tx) => {
      await tx.governanceVote.create({
        data: {
          proposalId,
          userId: session.user.id,
          vote,
          tokenWeight,
        },
      })

      // Update proposal tallies
      const updateData: Record<string, { increment: number }> = {}
      if (vote === 'FOR') updateData.votesFor = { increment: tokenWeight }
      else if (vote === 'AGAINST') updateData.votesAgainst = { increment: tokenWeight }
      else updateData.abstentions = { increment: tokenWeight }

      await tx.governanceProposal.update({
        where: { id: proposalId },
        data: updateData,
      })

      // Reward voter with lumen bonus
      await tx.lumenTransaction.create({
        data: {
          userId: session.user.id,
          amount: 5,
          type: 'GOVERNANCE_REWARD',
          description: 'Récompense de participation au vote de gouvernance',
          relatedId: proposalId,
        },
      })
      await tx.user.update({
        where: { id: session.user.id },
        data: { lumenBalance: { increment: 5 } },
      })
    })

    // Record governance vote on blockchain
    await recordEvent({
      type: 'GOVERNANCE_VOTE_CAST',
      entityType: 'GovernanceVote',
      entityId: proposalId,
      data: { voterId: session.user.id, vote, tokenWeight, proposalId },
    }).catch((err) => console.error("[Blockchain] Failed to record GOVERNANCE_VOTE_CAST:", err))

    revalidatePath('/tokenization/governance')

    return { success: true }
  } catch (error) {
    console.error('voteOnProposalAction error:', error)
    return { success: false, error: 'Erreur lors du vote. Veuillez réessayer.' }
  }
}

// ============================================
// CLAIM DIVIDEND
// ============================================

export async function claimDividendAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const dividendId = formData.get('dividendId') as string
  if (!dividendId) {
    return { success: false, error: 'Identifiant du dividende manquant.' }
  }

  try {
    const dividend = await prisma.tokenDividend.findUnique({
      where: { id: dividendId },
    })

    if (!dividend) {
      return { success: false, error: 'Dividende introuvable.' }
    }

    if (dividend.userId !== session.user.id) {
      return { success: false, error: 'Ce dividende ne vous appartient pas.' }
    }

    if (dividend.status === 'PAID') {
      return { success: false, error: 'Ce dividende a déjà été réclamé.' }
    }

    if (dividend.status !== 'CALCULATED' && dividend.status !== 'PENDING') {
      return { success: false, error: 'Ce dividende ne peut pas être réclamé.' }
    }

    // Pay out dividend
    await prisma.$transaction(async (tx) => {
      await tx.tokenDividend.update({
        where: { id: dividendId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      })

      // Convert to lumen balance (1 EUR = 1 lumen for simplicity)
      const lumenAmount = Math.round(dividend.amount)
      await tx.user.update({
        where: { id: session.user.id },
        data: { lumenBalance: { increment: lumenAmount } },
      })

      await tx.lumenTransaction.create({
        data: {
          userId: session.user.id,
          amount: lumenAmount,
          type: 'TOKEN_DIVIDEND',
          description: `Dividende de ${dividend.amount}€ pour la période ${dividend.period}`,
          relatedId: dividend.offeringId,
        },
      })
    })

    // Record dividend claim on blockchain
    await recordEvent({
      type: 'DIVIDEND_CLAIMED',
      entityType: 'TokenDividend',
      entityId: dividendId,
      data: {
        userId: session.user.id,
        amount: dividend.amount,
        period: dividend.period,
        offeringId: dividend.offeringId,
      },
    }).catch((err) => console.error("[Blockchain] Failed to record DIVIDEND_CLAIMED:", err))

    revalidatePath('/tokenization/portfolio')

    return { success: true }
  } catch (error) {
    console.error('claimDividendAction error:', error)
    return { success: false, error: 'Erreur lors de la réclamation du dividende.' }
  }
}
