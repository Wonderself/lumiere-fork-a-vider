import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Film,
  Heart,
  Clapperboard,
  ArrowRight,
  Star,
  Eye,
} from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'

interface ViewerDashboardProps {
  user: {
    id: string
    displayName: string | null
    points: number
    level: string
  }
}

export async function ViewerDashboard({ user }: ViewerDashboardProps) {
  const featuredFilms = await prisma.film.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const filmCount = await prisma.film.count({
    where: { status: 'IN_PRODUCTION' },
  })

  return (
    <div className="p-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1
          className="text-3xl font-bold mb-1"
        >
          Bienvenue, {user.displayName || 'Spectateur'}
        </h1>
        <p className="text-white/50">
          Decouvrez les films en production et soutenez vos favoris
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-[#E50914]/10">
                <Clapperboard className="h-5 w-5 text-[#E50914]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#E50914]">{filmCount}</div>
            <div className="text-xs text-white/40">Films en production</div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Star className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-400">{user.points}</div>
            <div className="text-xs text-white/40">Points accumules</div>
          </CardContent>
        </Card>

        <Card variant="glass" className="col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-400">{featuredFilms.length}</div>
            <div className="text-xs text-white/40">Films publics</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Films */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Films a la une</h2>
          <Link href="/films" className="text-sm text-[#E50914] hover:text-[#FF2D2D]">
            Voir tout &rarr;
          </Link>
        </div>

        {featuredFilms.length === 0 ? (
          <Card variant="glass">
            <CardContent className="p-8 text-center">
              <Film className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/40">Aucun film public pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {featuredFilms.map((film) => (
              <Link key={film.id} href={`/films/${film.slug}`}>
                <Card variant="glass" className="hover:border-[#E50914]/20 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    {film.coverImageUrl ? (
                      <div className="aspect-video rounded-lg bg-white/5 mb-3 overflow-hidden">
                        <img
                          src={film.coverImageUrl}
                          alt={film.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-[#E50914]/10 to-transparent border border-white/5 mb-3 flex items-center justify-center">
                        <Film className="h-8 w-8 text-white/10" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-1.5 truncate">{film.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status}
                      </Badge>
                      {film.genre && (
                        <span className="text-xs text-white/30">{film.genre}</span>
                      )}
                    </div>
                    {film.progressPct > 0 && (
                      <div className="mt-3">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full"
                            style={{ width: `${film.progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/25 mt-1">{film.progressPct.toFixed(0)}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card variant="gold">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-5 w-5 text-[#E50914]" />
              <h3 className="font-semibold">Soutenir un film</h3>
            </div>
            <p className="text-sm text-white/40 mb-4">
              Soutenez vos films preferes et recevez des recompenses exclusives.
            </p>
            <Link href="/films">
              <Button variant="outline" size="sm">
                Decouvrir <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">Decouvrir les taches</h3>
            </div>
            <p className="text-sm text-white/40 mb-4">
              Participez a la production et gagnez des points et des Lumens.
            </p>
            <Link href="/tasks">
              <Button variant="secondary" size="sm">
                Explorer <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
