import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getInitials } from '@/lib/utils'
import { InviteLink } from './invite-link'
import { Users, Crown, Star, ShieldCheck, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Team — CINEGENY' }
export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard/team')

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      displayName: true,
      email: true,
      avatarUrl: true,
      referralCode: true,
      createdAt: true,
    },
  })
  if (!me) redirect('/login')

  // Real collaborators: the platform's most active contributors (people whose
  // validated work moves films forward). This is the live collaboration network.
  const collaborators = await prisma.user.findMany({
    where: { id: { not: me.id }, tasksValidated: { gt: 0 } },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      tasksValidated: true,
      reputationBadge: true,
      createdAt: true,
    },
    orderBy: { tasksValidated: 'desc' },
    take: 9,
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const inviteLink = me.referralCode ? `${appUrl}/register?ref=${me.referralCode}` : ''

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-playfair">Team</h1>
        <p className="text-sm text-white/50 mt-1">
          The people building films together on CINEGENY. Invite collaborators and grow the network.
        </p>
      </div>

      {/* You (owner) */}
      <div className="rounded-2xl border border-[#E50914]/20 bg-[#E50914]/[0.05] p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E50914]/15 text-[#E50914] font-semibold">
          {me.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image src={me.avatarUrl} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            getInitials(me.displayName || me.email)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{me.displayName || me.email}</p>
          <p className="text-xs text-white/50 truncate">{me.email}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E50914]/15 px-3 py-1 text-xs font-medium text-[#E50914]">
          <Crown className="h-3.5 w-3.5" /> Owner
        </span>
      </div>

      {/* Invite */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-[#E50914]" /> Invite collaborators
        </h2>
        <p className="text-sm text-white/50 mt-1 mb-4">
          Share your personal invite link. Anyone who joins with it is linked to you through the
          referral program.
        </p>
        {inviteLink ? (
          <InviteLink link={inviteLink} />
        ) : (
          <Link
            href="/dashboard/referral"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#E50914] hover:bg-[#FF2D2D] text-sm font-semibold transition-colors"
          >
            Generate my invite link <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Collaborators */}
      <div>
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-[#E50914]" /> Active collaborators
        </h2>
        {collaborators.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
            <Users className="h-10 w-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No collaborators yet.</p>
            <p className="text-white/40 text-sm mt-1">
              Invite people or complete missions to grow the network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {collaborators.map((c) => (
              <Link
                key={c.id}
                href={`/users/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/80 text-sm font-semibold shrink-0">
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image src={c.avatarUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    getInitials(c.displayName || 'U')
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.displayName || 'Contributor'}</p>
                  <p className="text-xs text-white/40 inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> {c.tasksValidated} validated
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
