import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://cinegen.studio'
  const now = new Date()

  // Static pages — all public routes
  const staticPages: MetadataRoute.Sitemap = [
    // Core
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/films`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/streaming`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/actors`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // Community
    { url: `${baseUrl}/community`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/community-hub`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },

    // Create & Tools
    { url: `${baseUrl}/create`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/studio`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/studio/guided`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/studio/pro`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/poster-maker`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/trailer-maker`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/agent-builder`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/create/book-adaptation`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/create/voices`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },

    // Business
    { url: `${baseUrl}/invest`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/investors`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/produce`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/work`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/act`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // AI Agents
    { url: `${baseUrl}/agents`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/agents/marketplace`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/chat`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },

    // Engagement
    { url: `${baseUrl}/rewards`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/referral`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/points`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },

    // Content
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/discussions`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/film-knowledge`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/marketing`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Info
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/roadmap`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/vs-alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/api-pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/fonctionnalites/agents-ia`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cas/createur`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/developers`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // TV sub-pages

    // Auth
    { url: `${baseUrl}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Dynamic film pages
  let filmPages: MetadataRoute.Sitemap = []
  try {
    const { prisma } = await import('@/lib/prisma')
    const films = await prisma.film.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
    })
    filmPages = films.map((film) => ({
      url: `${baseUrl}/films/${film.slug}`,
      lastModified: film.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not available — return static pages only
  }

  return [...staticPages, ...filmPages]
}
