import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { approveFilmAction, rejectFilmAction } from '@/app/actions/catalog'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  Film, CheckCircle, XCircle, Eye, Star, Pause,
  Play, Search, Clock, TrendingUp,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Catalogue' }

async function suspendFilmAction(formData: FormData) {
  'use server'
  const { auth: getAuth } = await import('@/lib/auth')
  const { prisma: db } = await import('@/lib/prisma')
  const { revalidatePath } = await import('next/cache')

  const session = await getAuth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await db.catalogFilm.update({
    where: { id: filmId },
    data: { status: 'SUSPENDED' },
  })

  revalidatePath('/admin/catalog')
}

async function toggleFeaturedAction(formData: FormData) {
  'use server'
  const { auth: getAuth } = await import('@/lib/auth')
  const { prisma: db } = await import('@/lib/prisma')
  const { revalidatePath } = await import('next/cache')

  const session = await getAuth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  const currentFeatured = formData.get('currentFeatured') === 'true'
  if (!filmId) return

  await db.catalogFilm.update({
    where: { id: filmId },
    data: { featured: !currentFeatured },
  })

  revalidatePath('/admin/catalog')
}

export default async function AdminCatalogPage(
  props: { searchParams: Promise<{ status?: string; search?: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/dashboard')

  const searchParams = await props.searchParams
  const statusFilter = searchParams.status || 'all'
  const searchQuery = searchParams.search || ''

  // Build where clause
  const where: Record<string, unknown> = {}
  if (statusFilter !== 'all') {
    where.status = statusFilter.toUpperCase()
  }
  if (searchQuery) {
    where.title = { contains: searchQuery, mode: 'insensitive' }
  }

  const films = await prisma.catalogFilm.findMany({
    where,
    include: {
      submittedBy: { select: { displayName: true, email: true } },
      _count: { select: { views: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Stats
  const [totalFilms, pendingCount, liveCount, featuredCount] = await Promise.all([
    prisma.catalogFilm.count(),
    prisma.catalogFilm.count({ where: { status: 'PENDING' } }),
    prisma.catalogFilm.count({ where: { status: 'LIVE' } }),
    prisma.catalogFilm.count({ where: { featured: true } }),
  ])

  const statusTabs = [
    { key: 'all', label: 'Tous', count: totalFilms },
    { key: 'pending', label: 'En attente', count: pendingCount },
    { key: 'live', label: 'En ligne', count: liveCount },
    { key: 'suspended', label: 'Suspendus', count: null },
    { key: 'rejected', label: 'Rejetes', count: null },
  ]

  const statusColors: Record<string, string> = {
    PENDING: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600',
    APPROVED: 'border-blue-500/30 bg-blue-500/10 text-blue-600',
    LIVE: 'border-green-500/30 bg-green-500/10 text-green-600',
    REJECTED: 'border-red-500/30 bg-red-500/10 text-red-400',
    SUSPENDED: 'border-orange-500/30 bg-orange-500/10 text-orange-600',
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
            Catalogue
          </h1>
          <p className="text-white/50">Gestion des films du catalogue streaming</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 flex items-center gap-2">
            <Film className="h-3.5 w-3.5 text-white/50" />
            <span className="text-white/60">{totalFilms} films</span>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-yellow-600" />
            <span className="text-yellow-600">{pendingCount} en attente</span>
          </div>
          <div className="rounded-lg border border-[#E50914]/20 bg-[#E50914]/5 px-3 py-2 flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-[#E50914]" />
            <span className="text-[#E50914]">{featuredCount} en vedette</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 overflow-x-auto">
          {statusTabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/admin/catalog?status=${tab.key}${searchQuery ? `&search=${searchQuery}` : ''}`}
            >
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}>
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{tab.count}</span>
                )}
              </button>
            </Link>
          ))}
        </div>

        <form action="/admin/catalog" method="GET" className="relative">
          <input type="hidden" name="status" value={statusFilter} />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Rechercher un film..."
            className="h-9 pl-9 pr-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 w-64"
          />
        </form>
      </div>

      {/* Films Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {films.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <Film className="h-14 w-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Aucun film trouve</p>
            <p className="text-sm mt-1">Modifiez vos filtres ou attendez des soumissions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium p-4">Film</th>
                  <th className="text-left text-xs text-white/40 font-medium p-4">Createur</th>
                  <th className="text-center text-xs text-white/40 font-medium p-4">Statut</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Vues</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Rev. Share</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Date</th>
                  <th className="text-center text-xs text-white/40 font-medium p-4">Vedette</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {films.map((film) => (
                  <tr key={film.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {film.thumbnailUrl ? (
                          <img src={film.thumbnailUrl} alt="" className="w-12 h-8 rounded object-cover bg-white/5" />
                        ) : (
                          <div className="w-12 h-8 rounded bg-white/5 flex items-center justify-center">
                            <Film className="h-4 w-4 text-white/20" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{film.title}</p>
                          <p className="text-[10px] text-white/40">{film.genre || 'Non defini'} {film.language && `· ${film.language}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-white/60">{film.submittedBy.displayName || film.submittedBy.email}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[film.status] || 'border-white/10 bg-white/5 text-white/40'}`}>
                        {film.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Eye className="h-3 w-3 text-white/40" />
                        <span className="text-sm text-white/60">{film.viewCount.toLocaleString('fr-FR')}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm text-[#E50914] font-medium">{film.revenueSharePct}%</span>
                    </td>
                    <td className="p-4 text-right text-xs text-white/40">
                      {formatDate(film.createdAt)}
                    </td>
                    <td className="p-4 text-center">
                      <form action={toggleFeaturedAction} className="inline">
                        <input type="hidden" name="filmId" value={film.id} />
                        <input type="hidden" name="currentFeatured" value={String(film.featured)} />
                        <button
                          type="submit"
                          className={`p-1.5 rounded-lg transition-colors ${
                            film.featured
                              ? 'text-[#E50914] bg-[#E50914]/10 hover:bg-[#E50914]/20'
                              : 'text-white/20 hover:text-white/40 hover:bg-white/5'
                          }`}
                          title={film.featured ? 'Retirer de la vedette' : 'Mettre en vedette'}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve */}
                        {(film.status === 'PENDING' || film.status === 'APPROVED') && (
                          <form action={approveFilmAction}>
                            <input type="hidden" name="filmId" value={film.id} />
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-500/10 transition-colors"
                              title="Approuver (LIVE)"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </form>
                        )}

                        {/* Reject */}
                        {film.status !== 'REJECTED' && (
                          <form action={rejectFilmAction}>
                            <input type="hidden" name="filmId" value={film.id} />
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Rejeter"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </form>
                        )}

                        {/* Suspend */}
                        {film.status === 'LIVE' && (
                          <form action={suspendFilmAction}>
                            <input type="hidden" name="filmId" value={film.id} />
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-500/10 transition-colors"
                              title="Suspendre"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          </form>
                        )}

                        {/* Reactivate suspended */}
                        {film.status === 'SUSPENDED' && (
                          <form action={approveFilmAction}>
                            <input type="hidden" name="filmId" value={film.id} />
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition-colors"
                              title="Reactiver"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          </form>
                        )}

                        {/* View */}
                        <Link
                          href={`/streaming/${film.slug}`}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
