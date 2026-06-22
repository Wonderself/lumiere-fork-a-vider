import { auth } from '@/lib/auth'
import * as walletService from '@/lib/wallet.service'
import { NextResponse } from 'next/server'

/** GET /api/wallet/admin/stats — Admin revenue & billing stats */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if ((session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const stats = await walletService.getAdminStats()
  return NextResponse.json(stats)
}
