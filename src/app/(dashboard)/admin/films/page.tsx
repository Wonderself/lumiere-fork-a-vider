import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Film, Plus, Edit, Eye } from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Films' }

export default async function AdminFilmsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const films = await prisma.film.findMany({
    include: {
      _count: { select: { tasks: true, phases: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-playfair">Films</h1>
          <p className="text-white/50">{films.length} film{films.length > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/admin/films/new">
          <Button><Plus className="h-4 w-4 mr-2" /> Nouveau Film</Button>
        </Link>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {films.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <Film className="h-16 w-16 mx-auto mb-4 opacity-40" />
          <p className="text-xl">Aucun film</p>
          <p className="text-sm mt-2">Créez votre premier film.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {films.map((film) => (
            <div key={film.id} className="flex items-center gap-4 p-4 sm:rounded-2xl rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:shadow-md hover:-translate-y-[1px] transition-all duration-500">
              <div className="h-14 w-20 rounded-xl bg-gradient-to-br from-[#E50914]/10 to-purple-900/20 shrink-0 overflow-hidden">
                {film.coverImageUrl ? (
                  <img src={film.coverImageUrl} alt={film.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-6 w-6 text-[#E50914]/30" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{film.title}</h3>
                  {film.isPublic && <Badge variant="success">Public</Badge>}
                  {!film.isPublic && <Badge variant="secondary">Privé</Badge>}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>{FILM_STATUS_LABELS[film.status]}</span>
                  <span>·</span>
                  <span>{film._count.tasks} tâches</span>
                  <span>·</span>
                  <span>{film._count.phases} phases</span>
                  <span>·</span>
                  <span>{Math.round(film.progressPct)}% complété</span>
                </div>
              </div>

              <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden hidden md:block">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full"
                  style={{ width: `${film.progressPct}%` }}
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {film.isPublic && (
                  <Link href={`/films/${film.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href={`/admin/films/${film.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Éditer
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
