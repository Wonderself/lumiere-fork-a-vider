import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const alt = 'CINEGENY Streaming'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function StreamingOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let title = 'CINEGENY'
  let genre: string | null = null
  try {
    const film = await prisma.catalogFilm.findUnique({ where: { slug }, select: { title: true, genre: true } })
    if (film) {
      title = film.title
      genre = film.genre
    }
  } catch {
    /* fall back to brand defaults */
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0A0A0A', padding: '64px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-200px', right: '-120px', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(229,9,20,0.22) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: 30, color: '#D4AF37', fontWeight: 700 }}>∞</div>
          <div style={{ fontSize: 26, color: '#ffffff', fontWeight: 700, letterSpacing: 2 }}>CINEGENY</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {genre && (
            <div style={{ display: 'flex', alignSelf: 'flex-start', background: 'rgba(229,9,20,0.15)', color: '#FF5A5F', border: '1px solid rgba(229,9,20,0.4)', borderRadius: '999px', padding: '8px 20px', fontSize: 24, fontWeight: 600 }}>{genre}</div>
          )}
          <div style={{ fontSize: 76, color: '#ffffff', fontWeight: 800, lineHeight: 1.05, maxWidth: '1000px' }}>{title}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>Now streaming · AI cinema</div>
          <div style={{ fontSize: 22, color: '#D4AF37', fontWeight: 600 }}>Watch on CINEGENY</div>
        </div>
      </div>
    ),
    size,
  )
}
