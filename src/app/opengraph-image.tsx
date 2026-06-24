import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'CINEGENY — Cinema & Creative Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle red radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(229,9,20,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #E50914, transparent)',
          }}
        />

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #E50914, transparent)',
          }}
        />

        {/* Film reel icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'rgba(229,9,20,0.12)',
            border: '2px solid rgba(229,9,20,0.3)',
            marginBottom: '32px',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <path d="M7 2v20" />
            <path d="M17 2v20" />
            <path d="M2 12h20" />
            <path d="M2 7h5" />
            <path d="M2 17h5" />
            <path d="M17 7h5" />
            <path d="M17 17h5" />
          </svg>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 800,
            letterSpacing: '6px',
            background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          CINEGENY
        </div>

        {/* Accent divider */}
        <div
          style={{
            width: '120px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #E50914, transparent)',
            marginBottom: '24px',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
            letterSpacing: '1px',
          }}
        >
          La Premiere Plateforme de Co-Production
        </div>
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
            letterSpacing: '1px',
          }}
        >
          Cinematographique par IA
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '16px',
            color: 'rgba(229,9,20,0.5)',
            letterSpacing: '3px',
          }}
        >
          cinegeny.studio
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
