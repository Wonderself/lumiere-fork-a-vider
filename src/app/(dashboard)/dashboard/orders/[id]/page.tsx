import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Coins, Calendar, ExternalLink, User } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Order — CINEGENY' }

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const order = await prisma.videoOrder.findUnique({
    where: { id },
    include: { creator: { select: { displayName: true, email: true } } },
  })
  if (!order || order.clientUserId !== session.user.id) notFound()

  return (
    <div className="space-y-8 max-w-3xl">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div>
        <span className="inline-flex items-center rounded-full bg-[#E50914]/10 px-3 py-1 text-xs font-semibold text-[#E50914]">
          {order.status}
        </span>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white font-playfair">{order.title}</h1>
        <p className="mt-2 text-white/55 leading-relaxed">{order.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <Coins className="h-5 w-5 text-[#E50914] mb-2" />
          <p className="text-white text-lg font-bold">{order.priceTokens} Lumens</p>
          <p className="text-white/40 text-xs">Price</p>
        </div>
        {order.deadline && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <Calendar className="h-5 w-5 text-[#E50914] mb-2" />
            <p className="text-white text-lg font-bold">{formatDate(order.deadline)}</p>
            <p className="text-white/40 text-xs">Deadline</p>
          </div>
        )}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <User className="h-5 w-5 text-[#E50914] mb-2" />
          <p className="text-white text-lg font-bold truncate">
            {order.creator?.displayName || order.creator?.email || 'Unassigned'}
          </p>
          <p className="text-white/40 text-xs">Creator</p>
        </div>
      </div>

      {order.deliveryUrl && (
        <a
          href={order.deliveryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] font-semibold text-white text-sm transition-colors"
        >
          <ExternalLink className="h-4 w-4" /> View delivery
        </a>
      )}

      <p className="text-xs text-white/30">Created on {formatDate(order.createdAt)}</p>
    </div>
  )
}
