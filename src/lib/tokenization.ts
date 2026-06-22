/**
 * Tokenization Utilities — Israeli Co-Production Framework
 *
 * Israel Securities Authority (ISA) sandbox program, exempt offerings under 5M ILS.
 * Revenue-sharing tokens for AI film co-production.
 */

import { prisma } from '@/lib/prisma'

// ============================================
// CONSTANTS
// ============================================

/** Platform fee on secondary market trades (%) */
export const PLATFORM_FEE_PCT = 2.5

/** Default governance quorum requirement (%) */
export const GOVERNANCE_QUORUM = 30

/** Default token price in EUR */
export const DEFAULT_TOKEN_PRICE = 10

/** Maximum offering under ISA exempt route (ILS) */
export const ISA_EXEMPT_MAX_ILS = 5_000_000

/** Approximate ILS/EUR rate */
export const ILS_EUR_RATE = 3.8

/** Maximum offering in EUR under exempt route */
export const ISA_EXEMPT_MAX_EUR = Math.floor(ISA_EXEMPT_MAX_ILS / ILS_EUR_RATE)

/** Default lockup period in days */
export const DEFAULT_LOCKUP_DAYS = 90

/** Default offering parameters */
export const OFFERING_DEFAULTS = {
  tokenPrice: DEFAULT_TOKEN_PRICE,
  minInvestment: 1,
  maxPerUser: null as number | null,
  softCapPct: 60, // 60% of hard cap
  lockupDays: DEFAULT_LOCKUP_DAYS,
  distributionPct: 70,
  votingRights: true,
  kycRequired: true,
  accreditedOnly: false,
  riskLevel: 'MEDIUM' as const,
  revenueModel: 'REVENUE_SHARE',
  legalStructure: 'IL_EXEMPT',
} as const

/** Israeli legal framework descriptions */
export const LEGAL_STRUCTURES = {
  IL_EXEMPT: {
    name: 'Offre Exemptée ISA',
    description: 'Offre de titres exemptée sous le seuil de 5M ILS (Israel Securities Authority). Pas de prospectus requis.',
    maxRaise: ISA_EXEMPT_MAX_ILS,
    currency: 'ILS',
    maxRaiseEur: ISA_EXEMPT_MAX_EUR,
    kycRequired: true,
    accreditedOnly: false,
  },
  IL_PROSPECTUS: {
    name: 'Offre avec Prospectus ISA',
    description: 'Offre publique complète avec prospectus approuvé par la ISA. Aucune limite de levée.',
    maxRaise: null,
    currency: 'ILS',
    maxRaiseEur: null,
    kycRequired: true,
    accreditedOnly: false,
  },
  IL_SANDBOX: {
    name: 'Sandbox ISA FinTech',
    description: 'Programme sandbox de la ISA pour l\'innovation FinTech. Conditions allégées sous supervision.',
    maxRaise: 10_000_000,
    currency: 'ILS',
    maxRaiseEur: Math.floor(10_000_000 / ILS_EUR_RATE),
    kycRequired: true,
    accreditedOnly: false,
  },
} as const

/** Revenue source labels */
export const REVENUE_SOURCE_LABELS: Record<string, string> = {
  STREAMING: 'Streaming',
  THEATRICAL: 'Cinéma (sorties salles)',
  MERCH: 'Merchandising',
  LICENSING: 'Licences & Droits',
  SPONSORSHIP: 'Sponsoring',
}

/** Risk level labels and colors */
export const RISK_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  LOW: { label: 'Faible', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/30' },
  MEDIUM: { label: 'Moyen', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
  HIGH: { label: 'Élevé', color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/30' },
  VERY_HIGH: { label: 'Très élevé', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
}

/** Offering status labels */
export const OFFERING_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PENDING_LEGAL: 'Revue juridique',
  OPEN: 'Ouvert',
  FUNDED: 'Financé',
  CLOSED: 'Clôturé',
  CANCELLED: 'Annulé',
  SUSPENDED: 'Suspendu',
}

/** Proposal type labels */
export const PROPOSAL_TYPE_LABELS: Record<string, string> = {
  CASTING: 'Casting',
  SCRIPT_CHANGE: 'Modification Scénario',
  BUDGET_REALLOC: 'Réallocation Budget',
  DISTRIBUTION: 'Distribution',
  MARKETING: 'Marketing',
  CREATIVE: 'Créatif',
  GENERAL: 'Général',
}

/** Dividend status labels */
export const DIVIDEND_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CALCULATED: 'Calculé',
  PAID: 'Payé',
  FAILED: 'Échoué',
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate token price from a film's budget.
 * Default: 1 token = 10 EUR. Adjusted if budget is very high.
 */
export function calculateTokenPrice(film: {
  estimatedBudget?: number | null
}): { tokenPrice: number; totalTokens: number } {
  const budget = film.estimatedBudget || 100_000
  const tokenPrice = DEFAULT_TOKEN_PRICE

  // Total tokens = budget / price per token
  const totalTokens = Math.ceil(budget / tokenPrice)

  return { tokenPrice, totalTokens }
}

/**
 * Calculate the dividend owed to a user for a given offering and period.
 */
export async function calculateDividend(
  offeringId: string,
  userId: string,
  period: string
): Promise<{
  amount: number
  tokenCount: number
  totalPool: number
  userShare: number
}> {
  // Get offering info
  const offering = await prisma.filmTokenOffering.findUnique({
    where: { id: offeringId },
  })
  if (!offering) return { amount: 0, tokenCount: 0, totalPool: 0, userShare: 0 }

  // Get user's token balance
  const tokenCount = await getTokenBalance(offeringId, userId)
  if (tokenCount <= 0) return { amount: 0, tokenCount: 0, totalPool: 0, userShare: 0 }

  // Get total revenue for this period
  const revenues = await prisma.filmRevenue.findMany({
    where: { offeringId, period, distributed: false },
  })
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0)

  // Pool = revenue * distribution percentage
  const totalPool = totalRevenue * (offering.distributionPct / 100)

  // User share = (user tokens / total sold tokens) * pool
  const userShare = offering.tokensSold > 0 ? tokenCount / offering.tokensSold : 0
  const amount = Math.round(totalPool * userShare * 100) / 100

  return { amount, tokenCount, totalPool, userShare }
}

/**
 * Get a user's effective token balance for an offering.
 * Balance = purchased (confirmed) - sold + bought on secondary
 */
export async function getTokenBalance(
  offeringId: string,
  userId: string
): Promise<number> {
  // Confirmed primary purchases
  const purchases = await prisma.filmTokenPurchase.aggregate({
    _sum: { tokenCount: true },
    where: {
      offeringId,
      userId,
      status: 'CONFIRMED',
    },
  })

  // Completed sales on secondary market (outflow)
  const sales = await prisma.filmTokenTransfer.aggregate({
    _sum: { tokenCount: true },
    where: {
      offeringId,
      fromUserId: userId,
      status: 'COMPLETED',
    },
  })

  // Completed buys on secondary market (inflow)
  const buys = await prisma.filmTokenTransfer.aggregate({
    _sum: { tokenCount: true },
    where: {
      offeringId,
      toUserId: userId,
      status: 'COMPLETED',
    },
  })

  const purchased = purchases._sum.tokenCount || 0
  const sold = sales._sum.tokenCount || 0
  const bought = buys._sum.tokenCount || 0

  return purchased - sold + bought
}

/**
 * Check if tokens from a purchase can be transferred (lockup period expired).
 */
export function canTransferTokens(purchase: {
  lockedUntil?: Date | null
  status: string
}): { canTransfer: boolean; reason?: string; daysRemaining?: number } {
  if (purchase.status !== 'CONFIRMED') {
    return { canTransfer: false, reason: 'Achat non confirmé' }
  }

  if (purchase.lockedUntil) {
    const now = new Date()
    if (now < purchase.lockedUntil) {
      const diffMs = purchase.lockedUntil.getTime() - now.getTime()
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      return {
        canTransfer: false,
        reason: `Période de verrouillage: ${daysRemaining} jour(s) restant(s)`,
        daysRemaining,
      }
    }
  }

  return { canTransfer: true }
}

/**
 * Format a number as EUR currency string
 */
export function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a percentage
 */
export function formatPct(value: number): string {
  return `${Math.round(value * 10) / 10}%`
}

/**
 * Calculate the progress percentage for a token offering
 */
export function getOfferingProgress(offering: {
  raised: number
  hardCap: number
}): number {
  if (offering.hardCap <= 0) return 0
  return Math.min(100, Math.round((offering.raised / offering.hardCap) * 1000) / 10)
}

/**
 * Calculate time remaining for an offering
 */
export function getTimeRemaining(closesAt: Date | null): string {
  if (!closesAt) return 'Pas de date limite'
  const now = new Date()
  const diff = closesAt.getTime() - now.getTime()
  if (diff <= 0) return 'Terminé'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 30) return `${Math.floor(days / 30)} mois restants`
  if (days > 0) return `${days}j ${hours}h restants`
  return `${hours}h restantes`
}
