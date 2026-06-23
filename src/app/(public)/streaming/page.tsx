import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Search, Star, Eye, Clock, Film, Coins, Crown, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Streaming — Films IA en continu',
  description:
    "Découvrez et regardez des films créés par l'intelligence artificielle. Catalogue de courts et longs métrages IA, bandes-annonces exclusives.",
  openGraph: {
    title: 'Streaming — Films IA en continu | CINEGENY',
    description: "Découvrez et regardez des films créés par l'intelligence artificielle.",
  },
}

const GENRES = ['Tous', 'Sci-Fi', 'Drame', 'Action', 'Comedy', 'Thriller', 'Animation', 'Documentaire', 'Horreur', 'Romance']

export default async function StreamingPage(props: { searchParams: Promise<{ genre?: string; q?: string }> }) {
  const searchParams = await props.searchParams
  const genre = searchParams.genre
  const query = searchParams.q

  const where: Record<string, unknown> = { status: 'LIVE' }
  if (genre && genre !== 'Tous') where.genre = genre
  if (query) where.title = { contains: query, mode: 'insensitive' }

  const [films, featured] = await Promise.all([
    prisma.catalogFilm.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { viewCount: 'desc' }],
      include: { submittedBy: { select: { displayName: true } } },
    }),
    prisma.catalogFilm.findFirst({
      where: { status: 'LIVE', featured: true },
      include: { submittedBy: { select: { displayName: true } } },
    }),
  ])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Banner */}
      {featured ? (
        <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: featured.posterUrl ? `url(${featured.posterUrl})` : 'linear-gradient(135deg, #1a1a2e, #0A0A0A)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 lg:p-16">
            <Badge className="mb-6 bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30 backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1 fill-[#E50914]" /> En vedette
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)] max-w-3xl">
              {featured.title}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8 line-clamp-2 leading-relaxed">{featured.synopsis}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/streaming/${featured.slug}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#E50914] text-white font-semibold rounded-xl hover:bg-[#FF2D2D] transition-colors text-base sm:text-lg"
              >
                <Play className="h-5 w-5" /> Regarder
              </Link>
              <span className="text-white/50 flex items-center gap-1.5 text-sm">
                <Eye className="h-4 w-4" /> {featured.viewCount.toLocaleString('fr-FR')} vues
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E50914]/[0.05] via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.04] blur-[120px]" />
          <div className="relative text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">
              Streaming
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Decouvrez les films crees par la communaute et l&apos;intelligence artificielle.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-14 sm:py-16">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-5 mb-12">
          <form action="/streaming" method="GET" className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            {genre && genre !== 'Tous' && <input type="hidden" name="genre" value={genre} />}
            <input
              name="q"
              defaultValue={query}
              placeholder="Rechercher un film..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E50914]/50 focus:outline-none"
            />
          </form>
          <div className="flex gap-3 flex-wrap">
            {GENRES.map((g) => (
              <Link
                key={g}
                href={g === 'Tous' ? '/streaming' : `/streaming?genre=${g}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (genre === g || (!genre && g === 'Tous'))
                    ? 'bg-[#E50914] text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {g}
              </Link>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="mb-12 p-7 sm:p-8 rounded-2xl bg-gradient-to-r from-[#E50914]/10 to-transparent border border-[#E50914]/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Vous êtes réalisateur ?</h2>
              <p className="text-white/50">Soumettez votre film et gagnez de l&apos;argent à chaque vue.</p>
            </div>
            <Link
              href="/streaming/submit"
              className="px-6 py-2.5 bg-[#E50914] text-white font-semibold rounded-lg hover:bg-[#FF2D2D] transition-colors"
            >
              Soumettre un film
            </Link>
          </div>
        </div>

        {/* Films Grid */}
        {films.length === 0 ? (
          <div className="text-center py-20">
            <Film className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg">No films found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
            {films.map((film) => (
              <Link key={film.id} href={`/streaming/${film.slug}`} className="group">
                <Card className="bg-white/[0.02] border-white/5 overflow-hidden hover:border-[#E50914]/30 transition-all duration-300">
                  <div className="aspect-[2/3] relative bg-gradient-to-br from-white/5 to-transparent">
                    {film.thumbnailUrl ? (
                      <Image src={film.thumbnailUrl} alt={film.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Film className="h-12 w-12 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {film.genre && (
                      <Badge className="absolute top-2 left-2 bg-black/60 text-white/80 border-0 text-[10px]">
                        {film.genre}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 sm:p-5">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#E50914] transition-colors">
                      {film.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-white/30">
                      <span>{film.submittedBy.displayName || 'Anonyme'}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {film.viewCount}
                      </span>
                    </div>
                    {film.duration && (
                      <span className="flex items-center gap-1 mt-1 text-[11px] text-white/20">
                        <Clock className="h-3 w-3" /> {Math.floor(film.duration / 60)}min
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Devenez Producteur Banner */}
        <div className="mt-20 relative overflow-hidden rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/[0.08] via-[#E50914]/[0.03] to-transparent p-8 md:p-12 lg:p-14">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/[0.06] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-[#E50914]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Devenez Producteur
                </h2>
              </div>
              <p className="text-white/50 leading-relaxed max-w-lg">
                Ne vous contentez pas de regarder. Co-produisez les films de demain des 10&#8364;,
                recevez des revenus et voyez votre nom au generique.
              </p>
            </div>
            <Link
              href="/tokenization"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-colors text-lg shrink-0"
            >
              <Coins className="h-5 w-5" />
              Investir
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
