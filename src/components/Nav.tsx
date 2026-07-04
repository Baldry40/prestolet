'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-brand-700 tracking-tight">
            Prestolet
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm text-gray-600 hover:text-brand-700 transition">
              Services
            </Link>
            <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-brand-700 transition">
              How It Works
            </Link>
            <Link href="/#cleaners" className="text-sm text-gray-600 hover:text-brand-700 transition">
              Cleaners
            </Link>
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-700 hover:text-brand-700 font-medium transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-700 hover:text-brand-700 font-medium transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-medium"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            href="/#services"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-700 hover:text-brand-700 py-2 transition"
          >
            Services
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-700 hover:text-brand-700 py-2 transition"
          >
            How It Works
          </Link>
          <Link
            href="/#cleaners"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-700 hover:text-brand-700 py-2 transition"
          >
            Cleaners
          </Link>
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-brand-700 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="block w-full text-left text-sm text-gray-600 py-2"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm px-4 py-2 bg-brand-600 text-white rounded-lg text-center font-medium"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
