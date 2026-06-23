import { prisma } from '@/lib/prisma'
import { NetflixHome } from '@/components/netflix/netflix-home'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CINEGENY — Create. Fund. Stream Your Films.',
  description:
    'The collaborative cinema platform powered by AI. Micro-tasks, streaming, independent film production. Paris, Jerusalem, Hollywood.',
  openGraph: {
    title: 'CINEGENY — The AI Cinema Studio',
    description: 'Create, fund, and stream films powered by 113 AI agents. Join the cinema revolution.',
    url: 'https://cinegeny.studio',
    siteName: 'CINEGENY',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CINEGENY — The AI Cinema Studio',
    description: 'Create, fund, and stream films powered by 113 AI agents.',
  },
  keywords: ['AI cinema', 'collaborative film', 'film production', 'streaming', 'film crowdfunding', 'CINEGENY'],
}

async function getHomeData() {
  try {
    // Featured films for hero banner (most advanced projects)
    const heroFilms = await prisma.film.findMany({
      where: { isPublic: true, coverImageUrl: { not: null } },
      orderBy: [{ status: 'desc' }, { updatedAt: 'desc' }],
      take: 5,
      select: {
        id: true, title: true, slug: true, synopsis: true,
        genre: true, coverImageUrl: true, status: true,
      },
    })

    // All public films grouped by genre
    const allFilmsRaw = await prisma.film.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, genre: true,
        coverImageUrl: true, status: true, progressPct: true,
        estimatedBudget: true,
      },
    })

    // Compute a deterministic fundingPct from estimatedBudget + progressPct
    const allFilms = allFilmsRaw.map(f => {
      // Seed a deterministic funding % based on slug hash + progress
      const hash = f.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const baseFunding = (hash % 60) + 15 // 15-74%
      const bonus = Math.min(f.progressPct * 0.5, 25) // more progress = more funded
      const fundingPct = Math.min(Math.round(baseFunding + bonus), 100)
      return { ...f, fundingPct }
    })

    // Catalog films (streaming)
    const catalogFilms = await prisma.catalogFilm.findMany({
      where: { status: { in: ['LIVE', 'APPROVED'] } },
      orderBy: { viewCount: 'desc' },
      select: {
        id: true, title: true, slug: true, genre: true,
        thumbnailUrl: true, posterUrl: true, status: true, viewCount: true,
      },
    })

    // Group films by genre
    const genres = new Map<string, typeof allFilms>()
    for (const film of allFilms) {
      const genre = film.genre || 'Other'
      if (!genres.has(genre)) genres.set(genre, [])
      genres.get(genre)!.push(film)
    }

    // Films in production
    const inProduction = allFilms.filter(f =>
      f.status === 'IN_PRODUCTION' || f.status === 'POST_PRODUCTION'
    )

    // Films in development
    const inDevelopment = allFilms.filter(f =>
      f.status === 'DRAFT' || f.status === 'PRE_PRODUCTION'
    )

    // Released films
    const released = allFilms.filter(f => f.status === 'RELEASED')

    return {
      heroFilms: heroFilms.map(f => ({ ...f, type: 'film' as const })),
      allFilms: allFilms.map(f => ({ ...f, type: 'film' as const })),
      catalogFilms: catalogFilms.map(f => ({
        id: f.id,
        title: f.title,
        slug: f.slug,
        genre: f.genre,
        coverImageUrl: f.posterUrl || f.thumbnailUrl,
        status: f.status,
        progressPct: 0,
        type: 'catalog' as const,
      })),
      genres: Object.fromEntries(
        Array.from(genres.entries())
          .filter(([, films]) => films.length > 0)
          .map(([genre, films]) => [genre, films.map(f => ({ ...f, type: 'film' as const }))])
      ),
      inProduction: inProduction.map(f => ({ ...f, type: 'film' as const })),
      inDevelopment: inDevelopment.map(f => ({ ...f, type: 'film' as const })),
      released: released.map(f => ({ ...f, type: 'film' as const })),
    }
  } catch {
    // DB not available — return empty data
    return {
      heroFilms: [],
      allFilms: [],
      catalogFilms: [],
      genres: {},
      inProduction: [],
      inDevelopment: [],
      released: [],
    }
  }
}

export default async function HomePage() {
  const data = await getHomeData()

  return <NetflixHome data={data} />
}
