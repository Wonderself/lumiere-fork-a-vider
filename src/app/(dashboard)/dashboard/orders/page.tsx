import type { ComponentType } from 'react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCcw,
  PackageOpen,
  Coins,
  Calendar,
  ExternalLink,
  Clapperboard,
  ChevronRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Orders — CINEGENY',
  description: 'Track the status of your video orders on CINEGENY.',
}

type OrderStatus =
  | 'OPEN'
  | 'CLAIMED'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'REVISION'
  | 'COMPLETED'
  | 'DISPUTED'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: ComponentType<{ className?: string }> }
> = {
  OPEN: {
    label: 'Open',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    icon: PackageOpen,
  },
  CLAIMED: {
    label: 'Accepted',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
    icon: Clock,
  },
  IN_PROGRESS: {
    label: 'In progress',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    icon: RefreshCcw,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    icon: CheckCircle2,
  },
  REVISION: {
    label: 'Revision',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    icon: RefreshCcw,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-white/50',
    bgColor: 'bg-white/[0.05]',
    borderColor: 'border-white/[0.08]',
    icon: CheckCircle2,
  },
  DISPUTED: {
    label: 'Disputed',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    icon: AlertCircle,
  },
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function DashboardOrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const orders = await prisma.videoOrder.findMany({
    where: { clientUserId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      creator: {
        select: { displayName: true, email: true },
      },
    },
  })

  const activeOrders = orders.filter((o) =>
    ['OPEN', 'CLAIMED', 'IN_PROGRESS', 'DELIVERED', 'REVISION'].includes(o.status)
  )
  const completedOrders = orders.filter((o) =>
    ['COMPLETED', 'DISPUTED'].includes(o.status)
  )

  const totalSpent = orders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.priceTokens, 0)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
            My Orders
          </h1>
          <p className="text-white/50 mt-1.5 text-sm">
            Track the progress of your video orders
          </p>
        </div>
        <Link
          href="/community-hub"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#E50914]/20"
        >
          <Clapperboard className="h-4 w-4" />
          New order
        </Link>
      </div>

      {/* KPI Row */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total orders',
              value: orders.length,
              icon: ShoppingBag,
              color: 'text-[#E50914]',
              bg: 'bg-[#E50914]/10',
            },
            {
              label: 'In progress',
              value: activeOrders.length,
              icon: Clock,
              color: 'text-amber-400',
              bg: 'bg-amber-400/10',
            },
            {
              label: 'Tokens spent',
              value: totalSpent,
              icon: Coins,
              color: 'text-purple-400',
              bg: 'bg-purple-400/10',
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/5 rounded-2xl ring-1 ring-white/10 border border-white/[0.06] p-5 flex items-center gap-4"
            >
              <div className={`h-11 w-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-white text-xl font-bold leading-tight">{kpi.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="bg-white/5 rounded-2xl ring-1 ring-white/10 border border-white/[0.06] p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#E50914]/10 flex items-center justify-center mb-5">
            <ShoppingBag className="h-8 w-8 text-[#E50914]/60" />
          </div>
          <h2 className="text-white font-bold text-lg font-playfair mb-2">
            No orders yet
          </h2>
          <p className="text-white/50 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Place your first video order to collaborate with CINEGENY creators.
          </p>
          <Link
            href="/community-hub"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#E50914]/20"
          >
            Find a creator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Clock className="h-4 w-4 text-[#E50914]" />
            <h2 className="text-white font-bold text-base font-playfair">
              Active orders
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#E50914]/10 text-[#E50914] text-xs font-semibold">
              {activeOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {activeOrders.map((order) => {
              const config = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.OPEN
              const StatusIcon = config.icon
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block"
                >
                  <div className="group bg-white/5 rounded-2xl ring-1 ring-white/10 border border-white/[0.06] hover:border-[#E50914]/25 hover:bg-white/[0.07] transition-all duration-300 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: Status Icon + Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`h-11 w-11 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="text-white font-semibold text-sm leading-snug truncate max-w-xs">
                              {order.title}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${config.bgColor} ${config.color} ${config.borderColor} shrink-0`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs mt-1 line-clamp-1">
                            {order.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2.5">
                            {order.creatorUserId && (
                              <span className="text-white/40 text-xs">
                                Creator: <span className="text-white/60">{String((order as unknown as { creator?: { displayName?: string; email?: string } }).creator?.displayName || (order as unknown as { creator?: { email?: string } }).creator?.email || 'Unknown')}</span>
                              </span>
                            )}
                            {order.deadline && (
                              <span className="flex items-center gap-1 text-white/40 text-xs">
                                <Calendar className="h-3 w-3" />
                                {formatDate(order.deadline)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-white/40 text-xs">
                              <Coins className="h-3 w-3" />
                              {order.priceTokens} tokens
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Revision count + Arrow */}
                      <div className="flex items-center gap-4 shrink-0 pl-14 sm:pl-0">
                        {order.status === 'REVISION' && (
                          <span className="text-orange-400 text-xs">
                            Revision {order.revisionCount}/{order.maxRevisions}
                          </span>
                        )}
                        {order.status === 'DELIVERED' && (
                          <span className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold animate-pulse">
                            To review
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-[#E50914] transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <CheckCircle2 className="h-4 w-4 text-white/40" />
            <h2 className="text-white/60 font-bold text-base font-playfair">
              History
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 text-xs font-semibold">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedOrders.map((order) => {
              const config = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.COMPLETED
              const StatusIcon = config.icon
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block"
                >
                  <div className="group bg-white/[0.02] rounded-2xl ring-1 ring-white/[0.06] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 p-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center shrink-0`}>
                        <StatusIcon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white/60 font-medium text-sm truncate max-w-xs">
                            {order.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.bgColor} ${config.color} ${config.borderColor} shrink-0`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-white/30 text-xs">
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center gap-1 text-white/30 text-xs">
                            <Coins className="h-3 w-3" />
                            {order.priceTokens} tokens
                          </span>
                          {order.clientRating !== null && order.clientRating !== undefined && (
                            <span className="text-amber-400/70 text-xs">
                              Rating: {order.clientRating}/5
                            </span>
                          )}
                          {order.deliveryUrl && (
                            <span className="flex items-center gap-1 text-white/30 text-xs">
                              <ExternalLink className="h-3 w-3" />
                              Delivery available
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {orders.length > 0 && (
        <div className="pt-2">
          <Link
            href="/community-hub"
            className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#E50914]/[0.06] to-transparent border border-[#E50914]/10 hover:border-[#E50914]/25 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <p className="text-white/80 font-semibold text-sm">Order marketplace</p>
                <p className="text-white/40 text-xs">Find creators to collaborate with</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-[#E50914] transition-colors" />
          </Link>
        </div>
      )}
    </div>
  )
}
