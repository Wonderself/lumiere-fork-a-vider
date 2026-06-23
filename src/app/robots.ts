import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://platform.cinegeny.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/tasks/',
          '/profile/',
          '/api/',
          '/credits/',
          '/lumens/',
          '/tokenization/',
          '/notifications/',
          '/documents/',
          '/screenplays/',
          '/trailer-studio/',
          '/chat/meeting/',
          '/earnings/',
          '/playlists/',
          '/orders/',
          '/sessions/',
          '/preferences/',
          '/subscription/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
