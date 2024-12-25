import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multi BIN CC Generator | Educational Testing Tool',
  description: 'A credit card number generator tool for educational and testing purposes. Generate valid card numbers using multiple BINs with Luhn algorithm validation.',
  keywords: 'credit card generator, BIN generator, test card numbers, Luhn algorithm, payment testing',
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
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

