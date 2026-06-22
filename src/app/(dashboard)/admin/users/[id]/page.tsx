import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import { UserActions } from '@/components/admin/user-actions'
import {
  ArrowLeft, User, Mail, Shield, Star, CreditCard,
  Calendar, Zap, MessageSquare, Bot, Crown, Flag,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'User Detail — Admin CINEGENY' }

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      creditAccount: true,
      subscription: true,
      _count: {
        select: {
          claimedTasks: true,
          filmVotes: true,
          conversations: true,
          agentExecutions: true,
          chatMessages: true,
          lumenTransactions: true,
        },
      },
    },
  })

  if (!user) notFound()

  const recentActivity = await prisma.agentExecution.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { agent: { select: { name: true, slug: true } } },
  })

  const recentTransactions = await prisma.creditTransaction.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const stats = [
    { label: 'Tasks', value: user._count.claimedTasks, icon: Zap },
    { label: 'Votes', value: user._count.filmVotes, icon: Star },
    { label: 'Chats', value: user._count.conversations, icon: MessageSquare },
    { label: 'Exécutions', value: user._count.agentExecutions, icon: Bot },
    { label: 'Messages', value: user._count.chatMessages, icon: MessageSquare },
    { label: 'Transactions', value: user._count.lumenTransactions, icon: CreditCard },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Link href="/admin/users/manage" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#FF6B35] flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.displayName || 'Sans nom'}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-white/50"><Mail className="h-3 w-3" /> {user.email}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {user.role}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50">{user.level}</span>
              {user.isVerified && <span className="text-[10px] text-green-500">✓ Verified</span>}
            </div>
            <p className="text-[10px] text-white/50 mt-1">
              <Calendar className="inline h-3 w-3" /> Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              {' · '}ID: {user.id}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => {
          const SIcon = s.icon
          return (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <SIcon className="h-4 w-4 text-white/50 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/50">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Wallet Info */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-green-500" /> Wallet
        </h2>
        {user.creditAccount ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><p className="text-[10px] text-white/50">Balance</p><p className="text-lg font-bold text-[#E50914]">{microToCredits(user.creditAccount.balance).toFixed(2)}</p></div>
            <div><p className="text-[10px] text-white/50">Total acheté</p><p className="text-lg font-bold text-white">{microToCredits(user.creditAccount.totalPurchased).toFixed(2)}</p></div>
            <div><p className="text-[10px] text-white/50">Total accordé</p><p className="text-lg font-bold text-white">{microToCredits(user.creditAccount.totalGranted).toFixed(2)}</p></div>
            <div><p className="text-[10px] text-white/50">Total utilisé</p><p className="text-lg font-bold text-white">{microToCredits(user.creditAccount.totalUsed).toFixed(2)}</p></div>
            <div><p className="text-[10px] text-white/50">Remboursé</p><p className="text-lg font-bold text-white">{microToCredits(user.creditAccount.totalRefunded).toFixed(2)}</p></div>
          </div>
        ) : (
          <p className="text-sm text-white/50">Aucun compte crédit</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Transactions récentes</h2>
        </div>
        <div className="divide-y divide-white/10">
          {recentTransactions.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/50">Aucune transaction</div>
          ) : recentTransactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-3">
              <div className="flex-1">
                <p className="text-xs font-medium text-white">{tx.type.replace(/_/g, ' ')}</p>
                {tx.description && <p className="text-[10px] text-white/50 truncate">{tx.description}</p>}
              </div>
              <p className={`text-xs font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{microToCredits(tx.amount).toFixed(2)}
              </p>
              <p className="text-[10px] text-white/50">{new Date(tx.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Actions (Client Component) */}
      <UserActions userId={user.id} userEmail={user.email} userRole={user.role} />
    </div>
  )
}
