import { auth } from '@/lib/auth'
import * as walletService from '@/lib/wallet.service'
import { NextResponse } from 'next/server'

/** POST /api/wallet/admin/deposit — Admin deposits credits to a user */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if ((session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { userId, amount, description } = body

  if (!userId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const result = await walletService.deposit({
    userId,
    amount,
    description: description || 'Admin credit grant',
    type: 'ADMIN_GRANT',
    metadata: { grantedBy: session.user.id },
  })

  return NextResponse.json({
    success: true,
    newBalance: result.account.balance,
    transactionId: result.transaction.id,
  })
}
