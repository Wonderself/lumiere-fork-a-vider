/**
 * Next.js Instrumentation — Sentry error tracking
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * This file is auto-loaded by Next.js at startup.
 * Sentry initializes only when NEXT_PUBLIC_SENTRY_DSN is set.
 */
export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
    })
  }
}

export const onRequestError = async (
  err: { digest: string } & Error,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string }
) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(err, request, context)
}
