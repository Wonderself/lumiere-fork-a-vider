import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { verifyUserAction, changeUserRoleAction } from '@/app/actions/admin'
import { formatDate, getInitials, getLevelColor } from '@/lib/utils'
import { CheckCircle, Clock, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Utilisateurs' }

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const users = await prisma.user.findMany({
    orderBy: [{ isVerified: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { claimedTasks: true, submissions: true } },
    },
  })

  const ROLE_OPTIONS = ['CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'SCREENWRITER', 'VIEWER', 'ADMIN']

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair">Utilisateurs</h1>
        <p className="text-white/50">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} —{' '}
          {users.filter((u) => !u.isVerified).length} en attente de validation
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Pending first */}
      {users.some((u) => !u.isVerified) && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center gap-2">
            <Clock className="h-5 w-5" /> En attente de validation
          </h2>
          <div className="space-y-2">
            {users.filter((u) => !u.isVerified).map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 sm:rounded-2xl rounded-xl border border-yellow-500/20 bg-yellow-500/5 hover:shadow-md transition-all duration-500">
                <div className="h-10 w-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center text-sm font-bold text-[#E50914] shrink-0">
                  {getInitials(user.displayName || user.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{user.displayName || 'N/A'}</p>
                  <p className="text-sm text-white/50">{user.email}</p>
                  <p className="text-xs text-white/50">Inscrit le {formatDate(user.createdAt)} · {user.role}</p>
                  {user.skills.length > 0 && (
                    <p className="text-xs text-white/50 mt-1">Skills : {user.skills.slice(0, 3).join(', ')}</p>
                  )}
                </div>
                <form action={verifyUserAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <Button type="submit" size="sm" variant="default">
                    <CheckCircle className="h-4 w-4 mr-1" /> Valider
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* All users */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" /> Tous les Utilisateurs
        </h2>
        <div className="space-y-2">
          {users.filter((u) => u.isVerified).map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-4 sm:rounded-2xl rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:shadow-md hover:-translate-y-[1px] transition-all duration-500">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                {getInitials(user.displayName || user.email)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{user.displayName || 'N/A'}</p>
                  <Badge variant="default" className={`text-xs ${getLevelColor(user.level)}`}>
                    {user.level}
                  </Badge>
                </div>
                <p className="text-xs text-white/50">{user.email}</p>
                <p className="text-xs text-white/50">
                  {user._count.claimedTasks} tâches · {user.points} pts · Inscrit {formatDate(user.createdAt)}
                </p>
              </div>

              <form action={changeUserRoleAction} className="flex items-center gap-2">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  className="h-8 rounded-xl border border-white/10 bg-white/5 px-2 text-xs text-white focus:outline-none transition-colors duration-300"
                >
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <Button type="submit" variant="outline" size="sm">Changer</Button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
