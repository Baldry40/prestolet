import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['400', '700'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Prestolet',
    default: 'Prestolet — Effortless Short-Stay Lettings Management',
  },
  description:
    'Prestolet manages your short-stay property across Airbnb, Booking.com, Vrbo and more. Real-time insights, coordinated cleaning, maximum returns.',
  keywords: [
    'short-stay lettings',
    'property management',
    'Airbnb management',
    'holiday let',
    'serviced accommodation',
    'UK property',
    'Prestolet',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://prestolet.co.uk',
    siteName: 'Prestolet',
    title: 'Prestolet — Effortless Short-Stay Lettings Management',
    description:
      'List your property across all major booking platforms, managed from one place. Real-time insights. Coordinated cleaning. Maximum returns.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
