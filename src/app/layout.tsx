import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible_Next, Pixelify_Sans } from 'next/font/google'
import { site } from '@/content/site'
import './globals.css'

// next/font has no metrics to size-match a fallback for this family, so use a plain one
const atkinson = Atkinson_Hyperlegible_Next({
  variable: '--font-atkinson',
  subsets: ['latin'],
  adjustFontFallback: false,
  fallback: ['system-ui', 'sans-serif'],
})

const pixelify = Pixelify_Sans({
  variable: '--font-pixelify',
  subsets: ['latin'],
  weight: '700',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    title: site.name,
    description: site.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9eee6' },
    { media: '(prefers-color-scheme: dark)', color: '#10201d' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${atkinson.variable} ${pixelify.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:bg-ink focus:px-4 focus:py-2 focus:text-base focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
