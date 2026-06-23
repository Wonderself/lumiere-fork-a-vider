import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Eye, Clock, User, Calendar, ArrowLeft, Film } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FilmTabs } from '@/components/streaming/film-tabs'
import { FilmActions } from '@/components/streaming/film-actions'
import { VideoPlayerWrapper } from '@/components/streaming/video-player-wrapper'
import { WatchlistButton } from '@/components/watchlist-button'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const film = await prisma.catalogFilm.findUnique({
    where: { slug },
    select: { title: true, synopsis: true, thumbnailUrl: true },
  })
  if (!film) return { title: 'Film not found' }
  return {
    title: `${film.title} — CINEGENY Streaming`,
    description: film.synopsis || `Regardez ${film.title} on CINEGENY`,
    openGraph: {
      title: film.title,
      description: film.synopsis || undefined,
      images: film.thumbnailUrl ? [film.thumbnailUrl] : undefined,
    },
  }
}

export default async function StreamingFilmPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  const film = await prisma.catalogFilm.findUnique({
    where: { slug },
    include: {
      submittedBy: { select: { displayName: true, avatarUrl: true, bio: true } },
      contract: true,
      castRoles: {
        include: { actor: { select: { name: true, slug: true, avatarUrl: true, style: true } } },
        orderBy: { sortOrder: 'asc' },
      },
      bonusContent: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!film || film.status !== 'LIVE') notFound()

  // Similar films
  const similar = await prisma.catalogFilm.findMany({
    where: { status: 'LIVE', genre: film.genre, id: { not: film.id } },
    take: 5,
    orderBy: { viewCount: 'desc' },
  })

  return (
    <div className="cinema-dark min-h-screen bg-[#0A0A0A]">
      {/* Video Player Area */}
      <div className="relative bg-black aspect-video max-h-[70vh] w-full">
        {film.videoUrl ? (
          <VideoPlayerWrapper
            filmId={film.id}
            src={film.videoUrl}
            poster={film.thumbnailUrl || undefined}
            title={film.title}
            className="w-full h-full"
          />
        ) : film.trailerUrl ? (
          <>
            <VideoPlayerWrapper
              filmId={film.id}
              src={film.trailerUrl}
              poster={film.thumbnailUrl || undefined}
              title={`${film.title} — Bande-annonce`}
              className="w-full h-full"
            />
            {/* Trailer badge overlay */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#E50914]/90 text-white text-xs font-semibold backdrop-blur-sm pointer-events-none">
              Bande-annonce
            </div>
          </>
        ) : (
          <div className="relative flex items-center justify-center h-full overflow-hidden">
            {/* Background poster/thumbnail with blur */}
            {(film.posterUrl || film.thumbnailUrl) && (
              <>
                <img
                  src={film.posterUrl || film.thumbnailUrl || ''}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-30"
                />
                <div className="absolute inset-0 bg-black/60" />
              </>
            )}
            {/* Glass card overlay */}
            <div className="relative z-10 text-center px-6 py-10 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] max-w-sm mx-4">
              <div className="relative mx-auto mb-5 h-16 w-16">
                <Film className="h-16 w-16 text-[#E50914]/40" />
                {/* Subtle pulse animation */}
                <div className="absolute inset-0 rounded-full bg-[#E50914]/10 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <p className="text-white/70 text-lg font-semibold mb-2 font-playfair">
                En cours de production
              </p>
              <p className="text-white/30 text-sm mb-1">
                Ce film est actuellement en production.
              </p>
              {film.contract && (
                <p className="text-[#E50914]/60 text-xs mt-3">
                  Statut du contrat : {film.contract.status === 'SIGNED' ? 'Signe' : film.contract.status === 'PENDING' ? 'En attente' : film.contract.status.toLowerCase()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <Link href="/streaming" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {film.genre && <Badge className="bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30">{film.genre}</Badge>}
                {film.year && <span className="text-white/30 text-sm">{film.year}</span>}
                {film.language && <span className="text-white/30 text-sm uppercase">{film.language}</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">
                {film.title}
              </h1>
              <div className="flex items-center gap-6 text-white/40 text-sm">
                <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {film.viewCount.toLocaleString()} vues</span>
                {film.duration && (
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {Math.floor(film.duration / 60)} min {film.duration % 60} sec</span>
                )}
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {film.createdAt.toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <FilmActions filmTitle={film.title} filmSlug={film.slug} />
              <WatchlistButton filmId={film.id} />
            </div>

            {/* Film Tabs: Synopsis, Casting, Bonus */}
            <FilmTabs
              synopsis={film.synopsis}
              tags={film.tags}
              castRoles={film.castRoles.map((cr) => ({
                id: cr.id,
                characterName: cr.characterName,
                role: cr.role,
                description: cr.description,
                actor: {
                  name: cr.actor.name,
                  slug: cr.actor.slug,
                  avatarUrl: cr.actor.avatarUrl,
                  style: cr.actor.style,
                },
              }))}
              bonusContent={film.bonusContent.map((bc) => ({
                id: bc.id,
                type: bc.type,
                title: bc.title,
                description: bc.description,
                contentUrl: bc.contentUrl,
                thumbnailUrl: bc.thumbnailUrl,
                duration: bc.duration,
                isPremium: bc.isPremium,
                viewCount: bc.viewCount,
              }))}
            />
          </div>

          {/* Sidebar — Creator Info */}
          <div className="space-y-6">
            <Card className="bg-white/[0.03] border-white/10">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Réalisateur</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-[#E50914]/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-[#E50914]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{film.submittedBy.displayName || 'Anonyme'}</p>
                    <p className="text-white/30 text-sm">Créateur vérifié</p>
                  </div>
                </div>
                {film.submittedBy.bio && (
                  <p className="text-white/40 text-sm mt-3">{film.submittedBy.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Trailer */}
            {film.trailerUrl && film.videoUrl && (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Bande-annonce</h3>
                  <video src={film.trailerUrl} controls className="w-full rounded-lg" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Similar Films */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">Films similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {similar.map((f) => (
                <Link key={f.id} href={`/streaming/${f.slug}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 relative mb-2">
                    {f.thumbnailUrl ? (
                      <Image src={f.thumbnailUrl} alt={f.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Film className="h-8 w-8 text-white/10" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-sm text-white/70 truncate group-hover:text-[#E50914] transition-colors">{f.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
