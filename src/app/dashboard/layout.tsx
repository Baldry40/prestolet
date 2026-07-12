import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardSignOut from './SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const roleLabel =
    session.user.role === 'ADMIN' ? 'Admin'
    : session.user.role === 'CLEANER' ? 'Cleaner'
    : 'Property Owner'

  const roleBadgeColour =
    session.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700'
    : session.user.role === 'CLEANER' ? 'bg-brand-100 text-brand-700'
    : 'bg-cream-200 text-brand-700'

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-xl font-bold text-brand-800">
              Prestolet
            </Link>
            <nav className="hidden sm:flex items-center gap-5 text-sm">
              <Link href="/dashboard" className="text-stone-600 hover:text-brand-700 transition">
                Dashboard
              </Link>
              {session.user.role === 'CUSTOMER' && (
                <Link href="/onboarding" className="text-stone-600 hover:text-brand-700 transition">
                  Add Property
                </Link>
              )}
              {session.user.role === 'CLEANER' && (
                <Link href="/cleaners" className="text-stone-600 hover:text-brand-700 transition">
                  Cleaner Portal
                </Link>
              )}
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="text-stone-600 hover:text-brand-700 transition">
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-stone-700 font-medium">{session.user.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColour}`}>
                {roleLabel}
              </span>
            </div>
            <DashboardSignOut />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  )
}
