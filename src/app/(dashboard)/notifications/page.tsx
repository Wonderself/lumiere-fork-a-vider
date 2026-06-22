import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Briefcase,
  CheckCircle,
  XCircle,
  FileSearch,
  CreditCard,
  TrendingUp,
  ExternalLink,
  InboxIcon,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { markNotificationReadAction, markAllNotificationsReadAction } from '@/app/actions/notifications'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Notifications' }

const NOTIF_ICONS: Record<string, typeof Bell> = {
  NEW_TASK_AVAILABLE: Briefcase,
  TASK_VALIDATED: CheckCircle,
  TASK_REJECTED: XCircle,
  SUBMISSION_REVIEWED: FileSearch,
  PAYMENT_RECEIVED: CreditCard,
  LEVEL_UP: TrendingUp,
  SYSTEM: Bell,
}

const NOTIF_COLORS: Record<string, string> = {
  NEW_TASK_AVAILABLE: 'text-blue-500',
  TASK_VALIDATED: 'text-green-500',
  TASK_REJECTED: 'text-red-500',
  SUBMISSION_REVIEWED: 'text-yellow-500',
  PAYMENT_RECEIVED: 'text-emerald-500',
  LEVEL_UP: 'text-[#E50914]',
  SYSTEM: 'text-white/50',
}

function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "A l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return formatDate(date)
}

function groupByDate<T extends { createdAt: Date }>(notifications: T[]): {
  label: string
  items: T[]
}[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)

  const groups: { label: string; items: T[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: 'Hier', items: [] },
    { label: 'Plus ancien', items: [] },
  ]

  for (const notif of notifications) {
    const notifDate = new Date(notif.createdAt)
    if (notifDate >= today) {
      groups[0].items.push(notif)
    } else if (notifDate >= yesterday) {
      groups[1].items.push(notif)
    } else {
      groups[2].items.push(notif)
    }
  }

  return groups.filter((g) => g.items.length > 0)
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const params = await searchParams

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      ...(params.type ? { type: params.type as never } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const grouped = groupByDate(notifications)

  const FILTER_TYPES = [
    { value: '', label: 'Toutes' },
    { value: 'TASK_VALIDATED', label: 'Validees' },
    { value: 'TASK_REJECTED', label: 'Rejetees' },
    { value: 'PAYMENT_RECEIVED', label: 'Paiements' },
    { value: 'LEVEL_UP', label: 'Niveaux' },
    { value: 'SYSTEM', label: 'Systeme' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-white/50 mt-1">
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsReadAction}>
            <Button variant="outline" size="sm" type="submit" className="rounded-xl border-[#E50914]/30 text-[#E50914] hover:bg-[#E50914]/5 transition-all duration-300">
              <CheckCircle className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </form>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TYPES.map((filter) => {
          const isActive = (params.type || '') === filter.value
          return (
            <Link
              key={filter.value}
              href={filter.value ? `/notifications?type=${filter.value}` : '/notifications'}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isActive
                  ? 'bg-[#E50914]/10 text-[#E50914] border-[#E50914]/30'
                  : 'bg-white/[0.03] text-white/50 border-white/10 hover:border-white/10 hover:text-white/80'
              }`}
            >
              {filter.label}
            </Link>
          )
        })}
      </div>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white/5 sm:rounded-3xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] mb-4">
            <InboxIcon className="h-8 w-8 text-white/30" />
          </div>
          <p className="text-white/60 text-lg mb-1">Aucune notification</p>
          <p className="text-white/50 text-sm">
            Vos notifications apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3 px-1">
                {group.label}
              </h2>
              {/* Date group container */}
              <div className="bg-white/5 sm:rounded-2xl rounded-xl border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-2 sm:p-4 space-y-2">
                {group.items.map((notification) => {
                  const Icon = NOTIF_ICONS[notification.type] || Bell
                  const iconColor = NOTIF_COLORS[notification.type] || 'text-white/50'
                  const isUnread = !notification.read

                  return (
                    <div
                      key={notification.id}
                      className={`rounded-xl border transition-all duration-300 p-4 hover:bg-white/[0.03] ${
                        isUnread
                          ? 'border-l-2 border-l-[#E50914] border-white/10 bg-[#E50914]/5'
                          : 'border-white/5 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon with gold dot for unread */}
                        <div className="relative mt-0.5">
                          <div
                            className={`p-2.5 rounded-xl bg-white/[0.03] ${iconColor}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          {isUnread && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E50914] border-2 border-[#0A0A0A] shadow-[0_2px_8px_rgba(0,0,0,0.3)] shadow-[#E50914]/20" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  isUnread ? 'text-white' : 'text-white/50'
                                }`}
                              >
                                {notification.title}
                              </p>
                              {notification.body && (
                                <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                                  {notification.body}
                                </p>
                              )}
                            </div>
                            <span className="text-[11px] text-white/50 shrink-0 mt-0.5 tabular-nums">
                              {timeAgo(notification.createdAt)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2.5">
                            {notification.href && (
                              <Link href={notification.href}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg text-[#E50914] hover:text-[#FF2D2D] hover:bg-[#E50914]/5 transition-all duration-300">
                                  Voir <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </Link>
                            )}
                            {isUnread && (
                              <form action={markNotificationReadAction.bind(null, notification.id)}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="submit"
                                  className="h-7 text-xs rounded-lg text-white/50 hover:text-white/60 transition-all duration-300"
                                >
                                  Marquer comme lu
                                </Button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
