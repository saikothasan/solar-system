import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multi BIN CC Generator | Educational Testing Tool',
  description: 'A credit card number generator tool for educational and testing purposes. Generate valid card numbers using multiple BINs with Luhn algorithm validation.',
  keywords: 'credit card generator, BIN generator, test card numbers, Luhn algorithm, payment testing, AMEX',
  openGraph: {
    title: 'Multi BIN CC Generator',
    description: 'Generate valid test credit card numbers for educational purposes',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-JGJHYKVK12" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JGJHYKVK12');
          `}
        </Script>
      </head>
      <body className={spaceGrotesk.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

