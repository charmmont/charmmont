import type { Metadata } from 'next'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: {
    default: 'Deepbloom — Root Deep, Bloom Safe',
    template: '%s | Deepbloom',
  },
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface. Work with Ayelen for honest, unhurried 1:1 coaching.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://deepbloom.me'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    siteName: 'Deepbloom',
    type: 'website',
    locale: 'en_GB',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1C1A]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
