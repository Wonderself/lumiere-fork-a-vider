import { auth } from '@/lib/auth'
import * as walletService from '@/lib/wallet.service'
import { NextResponse } from 'next/server'

/** GET /api/wallet — Get user's wallet balance */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const account = await walletService.getOrCreateAccount(session.user.id)
  return NextResponse.json({
    balance: account.balance,
    totalPurchased: account.totalPurchased,
    totalGranted: account.totalGranted,
    totalUsed: account.totalUsed,
    totalRefunded: account.totalRefunded,
    autoTopupEnabled: account.autoTopupEnabled,
    autoTopupThreshold: account.autoTopupThreshold,
    autoTopupAmount: account.autoTopupAmount,
  })
}
