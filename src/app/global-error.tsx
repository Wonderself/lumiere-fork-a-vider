'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Report to Sentry if available
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs')
        .then((Sentry) => Sentry.captureException(error))
        .catch((err) => console.error("[Sentry] Failed to load Sentry:", err))
    }
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="fr">
      <body style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#E50914', marginBottom: '1rem' }}>
            Oups, une erreur est survenue
          </h1>
          <p style={{ color: '#ffffff80', marginBottom: '2rem', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
            Une erreur inattendue s&apos;est produite. Notre equipe a ete notifiee automatiquement.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 28px',
              background: '#E50914',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Reessayer
          </button>
        </div>
      </body>
    </html>
  )
}
