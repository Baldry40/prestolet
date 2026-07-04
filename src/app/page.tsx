import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HomepageClient from '@/components/HomepageClient'

export const metadata: Metadata = {
  title: 'Prestolet — Effortless Short-Stay Lettings Management',
  description:
    'Prestolet is a dedicated short-stay lettings management company focused on enhancing your rental experience, ensuring an effortless, hands-free approach to lettings.',
  keywords: [
    'short-stay lettings',
    'property management UK',
    'Airbnb management',
    'holiday let management',
    'serviced accommodation',
    'Prestolet',
  ],
  openGraph: {
    title: 'Prestolet — Effortless Short-Stay Lettings Management',
    description:
      'List your property across Airbnb, Booking.com, Vrbo and more — managed from one place. Real-time insights. Coordinated cleaning. Maximum returns.',
    url: 'https://prestolet.co.uk',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <HomepageClient />
      <Footer />
    </>
  )
}
