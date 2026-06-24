import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'
import { FILMS_BY_SLUG } from '@/data/films'

export const runtime = 'nodejs'
export const alt = 'CINEGENY — AI film'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function FilmOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let title = 'CINEGENY'
  let genre: string | null = null
  try {
    const film = await prisma.film.findUnique({ where: { slug }, select: { title: true, genre: true } })
    if (film) {
      title = film.title
      genre = film.genre
    } else {
      const fake = FILMS_BY_SLUG[slug]
      if (fake) {
        title = fake.title
        genre = fake.genre ?? null
      }
    }
  } catch {
    const fake = FILMS_BY_SLUG[slug]
    if (fake) {
      title = fake.title
      genre = fake.genre ?? null
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          position: 'relative',
          padding: '64px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-120px',
            width: '700px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(229,9,20,0.22) 0%, transparent 70%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: 30, color: '#D4AF37', fontWeight: 700 }}>∞</div>
          <div style={{ fontSize: 26, color: '#ffffff', fontWeight: 700, letterSpacing: 2 }}>CINEGENY</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {genre && (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: 'rgba(229,9,20,0.15)',
                color: '#FF5A5F',
                border: '1px solid rgba(229,9,20,0.4)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {genre}
            </div>
          )}
          <div style={{ fontSize: 76, color: '#ffffff', fontWeight: 800, lineHeight: 1.05, maxWidth: '1000px' }}>
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>Cinema &amp; Creative Studio · AI film</div>
          <div style={{ fontSize: 22, color: '#D4AF37', fontWeight: 600 }}>Watch · Vote · Invest</div>
        </div>
      </div>
    ),
    size,
  )
}
