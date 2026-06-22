import { auth } from '@/lib/auth'
import * as walletService from '@/lib/wallet.service'
import { NextResponse } from 'next/server'

/** GET /api/wallet/transactions — Get user's transaction history */
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const transactions = await walletService.getTransactions(
    session.user.id,
    Math.min(limit, 100),
    offset
  )

  return NextResponse.json({ transactions })
}
