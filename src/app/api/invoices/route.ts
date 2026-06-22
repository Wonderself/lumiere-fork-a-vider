import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInvoice, buildInvoiceData } from '@/lib/invoices'

export const dynamic = 'force-dynamic'

/**
 * GET /api/invoices?paymentId=xxx
 * Returns invoice as Markdown text file for the authenticated user (or admin).
 */
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('paymentId')
  if (!paymentId) {
    return NextResponse.json({ error: 'paymentId required' }, { status: 400 })
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      user: { select: { id: true, displayName: true, email: true } },
      task: { select: { title: true, film: { select: { title: true } } } },
    },
  })

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  // Only allow the payment owner or admin
  const isOwner = payment.userId === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const invoiceData = buildInvoiceData({
    paymentId: payment.id,
    contributorName: payment.user.displayName || 'Contributeur',
    contributorEmail: payment.user.email,
    contributorId: payment.user.id,
    taskTitle: payment.task.title,
    filmTitle: payment.task.film.title,
    amount: payment.amountEur,
    method: payment.method,
    status: payment.status === 'COMPLETED' ? 'PAID' : 'PENDING',
    paidAt: payment.paidAt,
  })

  const markdown = generateInvoice(invoiceData)

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="facture-${invoiceData.invoiceNumber}.md"`,
    },
  })
}
