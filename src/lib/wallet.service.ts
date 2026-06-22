import { prisma } from '@/lib/prisma'
import { TOKEN_MARGIN_PERCENT } from '@/lib/ai-pricing'

// ─── Types ──────────────────────────────────────────────────────────

export interface DepositInput {
  userId: string
  amount: number          // micro-credits
  description: string
  type?: 'PACK_PURCHASE' | 'ADMIN_GRANT' | 'SUBSCRIPTION_GRANT' | 'AUTO_TOPUP' | 'CONTEST_PRIZE' | 'REFERRAL_BONUS' | 'PROMO_CODE'
  metadata?: Record<string, unknown>
}

export interface WithdrawResult {
  success: boolean
  transactionId?: string
  balanceAfter?: number
  error?: string
}

export interface HoldResult {
  success: boolean
  holdId?: string
  error?: string
}

export interface AdminStats {
  totalRevenue: number
  totalMargin: number
  totalRequests: number
  activeWallets: number
  totalBalance: number
  topUsers: Array<{
    userId: string
    displayName: string | null
    totalSpent: number
    requestCount: number
  }>
  byAction: Array<{
    action: string
    count: number
    totalBilled: number
  }>
}

// ─── Wallet Operations ──────────────────────────────────────────────

/**
 * Get or create a credit account for a user.
 * Atomic upsert prevents race conditions.
 */
export async function getOrCreateAccount(userId: string) {
  return prisma.creditAccount.upsert({
    where: { userId },
    create: { userId },
    update: {},
  })
}

/**
 * Deposit credits into a user's account.
 * Uses Prisma transaction for atomicity.
 */
export async function deposit(input: DepositInput) {
  const { userId, amount, description, type = 'ADMIN_GRANT', metadata } = input

  if (amount <= 0) throw new Error('Deposit amount must be positive')

  return prisma.$transaction(async (tx) => {
    // Upsert account
    const account = await tx.creditAccount.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    })

    const balanceBefore = account.balance
    const balanceAfter = balanceBefore + amount

    // Update balance
    const updatedAccount = await tx.creditAccount.update({
      where: { id: account.id },
      data: {
        balance: balanceAfter,
        totalPurchased: type === 'PACK_PURCHASE' ? { increment: amount } : undefined,
        totalGranted: type !== 'PACK_PURCHASE' ? { increment: amount } : undefined,
      },
    })

    // Create transaction record
    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        accountId: account.id,
        amount,
        type: type as any,
        description,
        balanceBefore,
        balanceAfter,
        metadata: metadata as any,
      },
    })

    return { account: updatedAccount, transaction }
  })
}

/**
 * Withdraw credits from a user's account.
 * Checks balance first, returns error if insufficient.
 */
export async function withdraw(
  userId: string,
  amount: number,
  description: string,
  type: 'AI_USAGE' | 'HOLD' = 'AI_USAGE',
  metadata?: Record<string, unknown>
): Promise<WithdrawResult> {
  if (amount <= 0) return { success: false, error: 'Amount must be positive' }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.creditAccount.findUnique({
        where: { userId },
      })

      if (!account || account.balance < amount) {
        return { success: false as const, error: 'INSUFFICIENT_BALANCE' }
      }

      const balanceBefore = account.balance
      const balanceAfter = balanceBefore - amount

      await tx.creditAccount.update({
        where: { id: account.id },
        data: {
          balance: balanceAfter,
          totalUsed: { increment: amount },
        },
      })

      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          accountId: account.id,
          amount: -amount,
          type: type as any,
          description,
          balanceBefore,
          balanceAfter,
          metadata: metadata as any,
        },
      })

      return {
        success: true as const,
        transactionId: transaction.id,
        balanceAfter,
      }
    })

    return result
  } catch {
    return { success: false, error: 'Transaction failed' }
  }
}

/**
 * Check if user has sufficient balance.
 */
export async function hasBalance(userId: string, requiredAmount: number): Promise<boolean> {
  const account = await prisma.creditAccount.findUnique({
    where: { userId },
    select: { balance: true },
  })
  return (account?.balance ?? 0) >= requiredAmount
}

/**
 * Hold credits before an AI action.
 * Withdraws estimated max cost, returns hold ID for later release.
 */
export async function hold(
  userId: string,
  estimatedAmount: number,
  description: string
): Promise<HoldResult> {
  if (estimatedAmount <= 0) return { success: false, error: 'Amount must be positive' }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.creditAccount.findUnique({
        where: { userId },
      })

      if (!account || account.balance < estimatedAmount) {
        return { success: false as const, error: 'INSUFFICIENT_BALANCE' }
      }

      const balanceBefore = account.balance
      const balanceAfter = balanceBefore - estimatedAmount

      await tx.creditAccount.update({
        where: { id: account.id },
        data: {
          balance: balanceAfter,
          totalUsed: { increment: estimatedAmount },
        },
      })

      // Create hold record
      const walletHold = await tx.walletHold.create({
        data: {
          userId,
          accountId: account.id,
          amount: estimatedAmount,
          description,
          status: 'ACTIVE',
        },
      })

      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          userId,
          accountId: account.id,
          amount: -estimatedAmount,
          type: 'HOLD' as any,
          description: `[HOLD] ${description}`,
          balanceBefore,
          balanceAfter,
          metadata: { holdId: walletHold.id } as any,
        },
      })

      return { success: true as const, holdId: walletHold.id }
    })

    return result
  } catch {
    return { success: false, error: 'Hold creation failed' }
  }
}

/**
 * Release a hold after AI action completes.
 * Refunds overestimate or charges additional if actual > estimated.
 */
export async function releaseHold(
  userId: string,
  holdId: string,
  actualAmount: number
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const walletHold = await tx.walletHold.findUnique({
      where: { id: holdId },
    })

    if (!walletHold || walletHold.status !== 'ACTIVE') return

    const account = await tx.creditAccount.findUnique({
      where: { userId },
    })
    if (!account) return

    const heldAmount = walletHold.amount
    const difference = heldAmount - actualAmount

    if (difference > 0) {
      // Overestimate: refund the difference
      const balanceBefore = account.balance
      const balanceAfter = balanceBefore + difference

      await tx.creditAccount.update({
        where: { id: account.id },
        data: {
          balance: balanceAfter,
          totalUsed: { decrement: difference },
          totalRefunded: { increment: difference },
        },
      })

      await tx.creditTransaction.create({
        data: {
          userId,
          accountId: account.id,
          amount: difference,
          type: 'HOLD_RELEASE' as any,
          description: `[HOLD RELEASE] Refund overestimate`,
          balanceBefore,
          balanceAfter,
          metadata: { holdId, heldAmount, actualAmount, refunded: difference } as any,
        },
      })
    } else if (difference < 0) {
      // Underestimate: charge the overage
      const overage = Math.abs(difference)
      const balanceBefore = account.balance
      const balanceAfter = balanceBefore - overage

      await tx.creditAccount.update({
        where: { id: account.id },
        data: {
          balance: { decrement: overage },
          totalUsed: { increment: overage },
        },
      })

      await tx.creditTransaction.create({
        data: {
          userId,
          accountId: account.id,
          amount: -overage,
          type: 'HOLD_OVERAGE' as any,
          description: `[HOLD OVERAGE] Additional charge`,
          balanceBefore,
          balanceAfter,
          metadata: { holdId, heldAmount, actualAmount, overage } as any,
        },
      })
    }

    // Mark hold as released
    await tx.walletHold.update({
      where: { id: holdId },
      data: {
        status: 'RELEASED',
        releasedAt: new Date(),
        actualAmount,
        refundAmount: difference > 0 ? difference : 0,
      },
    })
  })
}

/**
 * Refund credits (manual admin refund or automatic error refund).
 */
export async function refund(
  userId: string,
  amount: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<WithdrawResult> {
  if (amount <= 0) return { success: false, error: 'Amount must be positive' }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.creditAccount.findUnique({
        where: { userId },
      })
      if (!account) return { success: false as const, error: 'Account not found' }

      const balanceBefore = account.balance
      const balanceAfter = balanceBefore + amount

      await tx.creditAccount.update({
        where: { id: account.id },
        data: {
          balance: balanceAfter,
          totalRefunded: { increment: amount },
        },
      })

      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          accountId: account.id,
          amount,
          type: 'REFUND' as any,
          description,
          balanceBefore,
          balanceAfter,
          metadata: metadata as any,
        },
      })

      return {
        success: true as const,
        transactionId: transaction.id,
        balanceAfter,
      }
    })

    return result
  } catch {
    return { success: false, error: 'Refund failed' }
  }
}

/**
 * Record AI usage in the usage log.
 */
export async function recordAIUsage(data: {
  userId: string
  accountId?: string
  provider: string
  model: string
  action: string
  inputTokens?: number
  outputTokens?: number
  costCredits: number
  billedCredits: number
  marginCredits: number
  durationMs?: number
  success?: boolean
  errorMessage?: string
  filmProjectId?: string
  holdId?: string
  metadata?: Record<string, unknown>
}) {
  return prisma.aIUsageLog.create({
    data: {
      userId: data.userId,
      accountId: data.accountId,
      provider: data.provider,
      model: data.model,
      action: data.action,
      inputTokens: data.inputTokens ?? 0,
      outputTokens: data.outputTokens ?? 0,
      totalTokens: (data.inputTokens ?? 0) + (data.outputTokens ?? 0),
      costCredits: data.costCredits,
      billedCredits: data.billedCredits,
      marginCredits: data.marginCredits,
      marginPercent: TOKEN_MARGIN_PERCENT,
      durationMs: data.durationMs,
      success: data.success ?? true,
      errorMessage: data.errorMessage,
      filmProjectId: data.filmProjectId,
      holdId: data.holdId,
      metadata: data.metadata as any,
    },
  })
}

/**
 * Get transaction history for a user.
 */
export async function getTransactions(
  userId: string,
  limit = 50,
  offset = 0
) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

/**
 * Get auto-topup settings.
 */
export async function getAutoTopupSettings(userId: string) {
  const account = await prisma.creditAccount.findUnique({
    where: { userId },
    select: {
      autoTopupEnabled: true,
      autoTopupThreshold: true,
      autoTopupAmount: true,
    },
  })
  return account
}

/**
 * Update auto-topup settings.
 */
export async function updateAutoTopup(
  userId: string,
  settings: {
    autoTopupEnabled: boolean
    autoTopupThreshold: number
    autoTopupAmount: number
  }
) {
  return prisma.creditAccount.update({
    where: { userId },
    data: settings,
  })
}

/**
 * Get wallets needing topup (for cron job / admin alerts).
 */
export async function getWalletsNeedingTopup() {
  return prisma.creditAccount.findMany({
    where: {
      autoTopupEnabled: true,
      autoTopupAmount: { gt: 0 },
      autoTopupThreshold: { gt: 0 },
    },
    include: {
      user: { select: { id: true, displayName: true, email: true } },
    },
  }).then(accounts =>
    accounts.filter(a => a.balance < a.autoTopupThreshold)
  )
}

/**
 * Admin: Get platform-wide billing stats.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const [usageStats, walletStats, topUsers, byAction] = await Promise.all([
    // Total revenue & margin from usage logs
    prisma.aIUsageLog.aggregate({
      _sum: { billedCredits: true, marginCredits: true },
      _count: true,
    }),
    // Active wallets & total balance
    prisma.creditAccount.aggregate({
      _count: true,
      _sum: { balance: true },
      where: { balance: { gt: 0 } },
    }),
    // Top spending users
    prisma.aIUsageLog.groupBy({
      by: ['userId'],
      _sum: { billedCredits: true },
      _count: true,
      orderBy: { _sum: { billedCredits: 'desc' } },
      take: 10,
    }).then(async (groups) => {
      const userIds = groups.map(g => g.userId)
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, displayName: true },
      })
      const userMap = new Map(users.map(u => [u.id, u.displayName]))
      return groups.map(g => ({
        userId: g.userId,
        displayName: userMap.get(g.userId) ?? null,
        totalSpent: g._sum.billedCredits ?? 0,
        requestCount: g._count,
      }))
    }),
    // Usage by action type
    prisma.aIUsageLog.groupBy({
      by: ['action'],
      _sum: { billedCredits: true },
      _count: true,
      orderBy: { _sum: { billedCredits: 'desc' } },
    }),
  ])

  return {
    totalRevenue: usageStats._sum.billedCredits ?? 0,
    totalMargin: usageStats._sum.marginCredits ?? 0,
    totalRequests: usageStats._count,
    activeWallets: walletStats._count,
    totalBalance: walletStats._sum.balance ?? 0,
    topUsers,
    byAction: byAction.map(a => ({
      action: a.action,
      count: a._count,
      totalBilled: a._sum.billedCredits ?? 0,
    })),
  }
}

/**
 * Deduct credits BEFORE an AI action.
 * Uses hold/release pattern for safety.
 * Automatically refunds if the AI call fails.
 *
 * Usage:
 *   const deduction = await deductBeforeAction(userId, estimatedCost, 'Script analysis')
 *   if (!deduction.success) return { error: deduction.error }
 *   try {
 *     const result = await callAI(...)
 *     await releaseHold(userId, deduction.holdId!, actualCost)
 *   } catch (err) {
 *     await releaseHold(userId, deduction.holdId!, 0) // Full refund
 *   }
 */
export async function deductBeforeAction(
  userId: string,
  estimatedCost: number,
  description: string
): Promise<HoldResult> {
  // Ensure account exists
  await getOrCreateAccount(userId)
  return hold(userId, estimatedCost, description)
}
