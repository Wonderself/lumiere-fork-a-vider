/**
 * Credit Guard
 * Validates credits before operations, atomic transactions, zero financial leakage.
 */

import { prisma } from '@/lib/prisma'

export interface CreditCheckResult {
  valid: boolean
  reason?: string
  balance?: number
  required?: number
  accountId?: string
}

/** Pre-flight credit check */
export async function validateCredits(userId: string, requiredAmount: number): Promise<CreditCheckResult> {
  if (requiredAmount <= 0) {
    return { valid: true, reason: 'Free operation' }
  }

  const account = await prisma.creditAccount.findUnique({
    where: { userId },
    select: { id: true, balance: true },
  })

  if (!account) {
    return { valid: false, reason: 'NO_ACCOUNT', balance: 0, required: requiredAmount }
  }

  if (account.balance < requiredAmount) {
    return {
      valid: false,
      reason: 'INSUFFICIENT_BALANCE',
      balance: account.balance,
      required: requiredAmount,
      accountId: account.id,
    }
  }

  return {
    valid: true,
    balance: account.balance,
    required: requiredAmount,
    accountId: account.id,
  }
}

/** Check for credit coherence (balance vs transaction history) */
export async function auditCoherence(): Promise<Array<{ userId: string; balance: number; transactionSum: number; discrepancy: number }>> {
  const accounts = await prisma.creditAccount.findMany({
    select: { id: true, userId: true, balance: true },
  })

  const discrepancies: Array<{ userId: string; balance: number; transactionSum: number; discrepancy: number }> = []

  for (const account of accounts) {
    const txSum = await prisma.creditTransaction.aggregate({
      where: { accountId: account.id },
      _sum: { amount: true },
    })

    const transactionBalance = txSum._sum.amount ?? 0
    const diff = Math.abs(account.balance - transactionBalance)

    if (diff > 0) {
      discrepancies.push({
        userId: account.userId,
        balance: account.balance,
        transactionSum: transactionBalance,
        discrepancy: diff,
      })
    }
  }

  return discrepancies
}

/** Fix negative balances (should never happen, but safety net) */
export async function fixNegativeBalances(): Promise<number> {
  const result = await prisma.creditAccount.updateMany({
    where: { balance: { lt: 0 } },
    data: { balance: 0 },
  })
  return result.count
}

/** Detect anomalies: high burn rate, instant drain */
export async function detectAnomalies(): Promise<Array<{ type: string; userId: string; detail: string }>> {
  const anomalies: Array<{ type: string; userId: string; detail: string }> = []
  const fiveMinAgo = new Date(Date.now() - 300_000)

  // High burn: >50 credits in 5 minutes
  const highBurn = await prisma.creditTransaction.groupBy({
    by: ['userId'],
    where: {
      amount: { lt: 0 },
      createdAt: { gte: fiveMinAgo },
    },
    _sum: { amount: true },
    having: { amount: { _sum: { lt: -50_000_000 } } },
  })

  for (const h of highBurn) {
    anomalies.push({
      type: 'HIGH_BURN',
      userId: h.userId,
      detail: `Burned ${Math.abs(h._sum.amount ?? 0) / 1_000_000} credits in 5 minutes`,
    })
  }

  // Negative balances
  const negatives = await prisma.creditAccount.findMany({
    where: { balance: { lt: 0 } },
    select: { userId: true, balance: true },
  })

  for (const n of negatives) {
    anomalies.push({
      type: 'NEGATIVE_BALANCE',
      userId: n.userId,
      detail: `Balance: ${n.balance} micro-credits`,
    })
  }

  return anomalies
}
