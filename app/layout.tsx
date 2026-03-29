import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Deepbloom — Root Deep, Bloom Safe',
    template: '%s | Deepbloom',
  },
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface. Work with Ayelen for honest, unhurried 1:1 coaching.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://deepbloom.me'),
  openGraph: {
    siteName: 'Deepbloom',
    type: 'website',
    locale: 'en_GB',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1C1A]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
