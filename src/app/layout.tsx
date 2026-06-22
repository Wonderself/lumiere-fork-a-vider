import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthSessionProvider } from '@/components/layout/session-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { ServiceWorkerRegister } from '@/components/layout/sw-register'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cinegeny.studio'),
  title: {
    template: '%s | CINEGENY',
    default: 'CINEGENY — The AI Cinema Studio',
  },
  description:
    "CINEGENY: collaborative AI film production, creative micro-tasks, streaming, trailers, community governance. Create. Fund. Stream Your Films.",
  keywords: [
    'AI cinema',
    'AI film production',
    'collaborative filmmaking',
    'micro-tasks cinema',
    'AI streaming',
    'AI trailers',
    'CINEGENY Studio',
    'AI cinema studio',
  ],
  authors: [{ name: 'CINEGENY Studio' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CINEGENY',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CINEGENY',
    title: 'CINEGENY — The AI Cinema Studio',
    description: "Collaborative AI film production, creative micro-tasks, worldwide streaming.",
    url: 'https://cinegeny.studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CINEGENY — The AI Cinema Studio',
    description: "Collaborative AI film production, creative micro-tasks, worldwide streaming.",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#0A0A0A] text-white`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E50914] focus:text-white focus:rounded-lg focus:font-semibold">
          Aller au contenu principal
        </a>
        <NextIntlClientProvider messages={messages}>
        <AuthSessionProvider>
        <div id="main-content">{children}</div>
        <CookieConsent />
        <ServiceWorkerRegister />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #222222',
              color: '#FAFAFA',
            },
          }}
        />
        </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
