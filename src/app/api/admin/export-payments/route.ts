import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/export-payments — CSV export of all payments
 * Admin-only endpoint for accounting/bookkeeping.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { displayName: true, email: true } },
      task: { select: { title: true, film: { select: { title: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Build CSV
  const headers = ['Date', 'Utilisateur', 'Email', 'Film', 'Tache', 'Montant EUR', 'Methode', 'Statut', 'Date Paiement', 'ID']
  const rows = payments.map(p => [
    p.createdAt.toISOString().split('T')[0],
    `"${(p.user.displayName || '').replace(/"/g, '""')}"`,
    p.user.email,
    `"${(p.task.film.title || '').replace(/"/g, '""')}"`,
    `"${(p.task.title || '').replace(/"/g, '""')}"`,
    p.amountEur.toFixed(2),
    p.method,
    p.status,
    p.paidAt ? p.paidAt.toISOString().split('T')[0] : '',
    p.id,
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cinegen-paiements-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
