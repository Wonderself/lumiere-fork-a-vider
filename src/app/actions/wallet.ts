'use server'

import { auth } from '@/lib/auth'
import * as walletService from '@/lib/wallet.service'
import { getAllPricing, microToCredits } from '@/lib/ai-pricing'

// ─── User Actions ───────────────────────────────────────────────────

/** Get current user's wallet balance and account info */
export async function getWalletAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const account = await walletService.getOrCreateAccount(session.user.id)
  return {
    balance: account.balance,
    balanceCredits: microToCredits(account.balance),
    totalPurchased: account.totalPurchased,
    totalGranted: account.totalGranted,
    totalUsed: account.totalUsed,
    totalRefunded: account.totalRefunded,
    autoTopupEnabled: account.autoTopupEnabled,
    autoTopupThreshold: account.autoTopupThreshold,
    autoTopupAmount: account.autoTopupAmount,
  }
}

/** Get user's transaction history */
export async function getTransactionsAction(limit = 50, offset = 0) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated', transactions: [] }

  const transactions = await walletService.getTransactions(session.user.id, limit, offset)
  return { transactions }
}

/** Update auto-topup settings */
export async function updateAutoTopupAction(settings: {
  autoTopupEnabled: boolean
  autoTopupThreshold: number
  autoTopupAmount: number
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  if (settings.autoTopupEnabled) {
    if (settings.autoTopupThreshold <= 0 || settings.autoTopupAmount <= 0) {
      return { error: 'Threshold and amount must be positive when auto-topup is enabled' }
    }
  }

  await walletService.updateAutoTopup(session.user.id, settings)
  return { success: true }
}

/** Check if user can afford an action */
export async function canAffordAction(microCreditsNeeded: number) {
  const session = await auth()
  if (!session?.user?.id) return { canAfford: false, error: 'Not authenticated' }

  const canAfford = await walletService.hasBalance(session.user.id, microCreditsNeeded)
  return { canAfford }
}

/** Get transparent pricing data */
export async function getPricingAction() {
  return getAllPricing()
}

// ─── Admin Actions ──────────────────────────────────────────────────

/** Admin: Grant credits to a user */
export async function adminGrantCreditsAction(input: {
  targetUserId: string
  amount: number
  description: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }
  if ((session.user as any).role !== 'ADMIN') return { error: 'Admin access required' }

  if (input.amount <= 0) return { error: 'Amount must be positive' }

  const result = await walletService.deposit({
    userId: input.targetUserId,
    amount: input.amount,
    description: input.description,
    type: 'ADMIN_GRANT',
    metadata: { grantedBy: session.user.id },
  })

  return { success: true, newBalance: result.account.balance }
}

/** Admin: Refund credits to a user */
export async function adminRefundAction(input: {
  targetUserId: string
  amount: number
  description: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }
  if ((session.user as any).role !== 'ADMIN') return { error: 'Admin access required' }

  const result = await walletService.refund(
    input.targetUserId,
    input.amount,
    input.description,
    { refundedBy: session.user.id }
  )

  return result
}

/** Admin: Get platform billing stats */
export async function getAdminBillingStatsAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }
  if ((session.user as any).role !== 'ADMIN') return { error: 'Admin access required' }

  return walletService.getAdminStats()
}

/** Admin: Get wallets needing topup alerts */
export async function getWalletsNeedingTopupAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }
  if ((session.user as any).role !== 'ADMIN') return { error: 'Admin access required' }

  const wallets = await walletService.getWalletsNeedingTopup()
  return { wallets }
}
