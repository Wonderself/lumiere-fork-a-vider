import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const alt = 'CINEGENY AI Actor'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function ActorOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let name = 'CINEGENY'
  try {
    const actor = await prisma.aIActor.findUnique({ where: { slug }, select: { name: true } })
    if (actor) name = actor.name
  } catch {
    /* fall back to brand defaults */
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0A0A0A', padding: '64px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-180px', left: '-120px', width: '640px', height: '460px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: 30, color: '#D4AF37', fontWeight: 700 }}>∞</div>
          <div style={{ fontSize: 26, color: '#ffffff', fontWeight: 700, letterSpacing: 2 }}>CINEGENY</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignSelf: 'flex-start', background: 'rgba(212,175,55,0.15)', color: '#F4D35E', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '999px', padding: '8px 20px', fontSize: 24, fontWeight: 600 }}>AI Actor</div>
          <div style={{ fontSize: 80, color: '#ffffff', fontWeight: 800, lineHeight: 1.05, maxWidth: '1000px' }}>{name}</div>
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>Cast this AI actor in your film · CINEGENY</div>
      </div>
    ),
    size,
  )
}
