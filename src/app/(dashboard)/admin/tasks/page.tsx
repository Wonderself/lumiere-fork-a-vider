import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Star, Pencil } from 'lucide-react'
import { TASK_STATUS_LABELS, TASK_TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import { formatPrice, getStatusColor, getDifficultyColor } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Tâches' }

export default async function AdminTasksPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const tasks = await prisma.task.findMany({
    include: {
      film: { select: { title: true, slug: true } },
      phase: { select: { phaseName: true } },
      claimedBy: { select: { displayName: true } },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  })

  const films = await prisma.film.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-playfair">Tâches</h1>
          <p className="text-white/50">{tasks.length} tâche{tasks.length > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/admin/tasks/new">
          <Button><Plus className="h-4 w-4 mr-2" /> Nouvelle Tâche</Button>
        </Link>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {tasks.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <Star className="h-16 w-16 mx-auto mb-4 opacity-40" />
          <p className="text-xl">Aucune tâche</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-4 sm:rounded-2xl rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:shadow-md hover:-translate-y-[1px] transition-all duration-500">
              <div className={`w-2 h-10 rounded-full shrink-0 ${
                task.status === 'AVAILABLE' ? 'bg-green-500' :
                task.status === 'VALIDATED' ? 'bg-[#E50914]' :
                task.status === 'CLAIMED' ? 'bg-blue-500' :
                task.status === 'LOCKED' ? 'bg-white/10' :
                'bg-yellow-500'
              }`} />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{task.title}</p>
                <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                  <span>{task.film.title}</span>
                  <span>·</span>
                  <span>{task.phase.phaseName}</span>
                  <Badge variant="secondary" className="text-xs">{TASK_TYPE_LABELS[task.type]}</Badge>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <span className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                  {DIFFICULTY_LABELS[task.difficulty]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
                  {TASK_STATUS_LABELS[task.status]}
                </span>
              </div>

              <div className="text-sm font-bold text-[#E50914] shrink-0">
                {formatPrice(task.priceEuros)}
              </div>

              <Link href={`/admin/tasks/${task.id}/edit`} className="text-white/50 hover:text-white/70 transition-colors duration-300 shrink-0">
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
