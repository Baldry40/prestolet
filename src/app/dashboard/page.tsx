import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getPropertyInsights } from '@/lib/guesty'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Property, SmsLog } from '@/types'

type PropertyWithStats = {
  property: Property
  stats: {
    revenue: number
    occupancyRate: number
    avgDailyRate: number
  } | null
}

async function getSafeInsights(guestyId: string) {
  try {
    return await getPropertyInsights(guestyId)
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  // Cleaner → redirect to cleaner portal
  if (session.user.role === 'CLEANER') redirect('/cleaners')

  const properties = await db.property.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const insights: PropertyWithStats[] = await Promise.all(
    properties.map(async (p) => ({
      property: p,
      stats: p.guestyId ? await getSafeInsights(p.guestyId) : null,
    }))
  )

  // Recent SMS logs for the user's properties
  let recentSmsLogs: (SmsLog & { cleaner: { user: { name: string } } })[] = []
  if (properties.length > 0) {
    const propertyIds = properties.map((p) => p.id)
    recentSmsLogs = await db.smsLog.findMany({
      where: { propertyId: { in: propertyIds } },
      include: { cleaner: { include: { user: { select: { name: true } } } } },
      orderBy: { sentAt: 'desc' },
      take: 10,
    }) as typeof recentSmsLogs
  }

  const statusBadge = (status: string) => {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-700'
    if (status === 'INACTIVE') return 'bg-gray-100 text-gray-500'
    return 'bg-amber-100 text-amber-700' // PENDING
  }

  const smsStatusBadge = (status: string) => {
    if (status === 'CONFIRMED') return 'bg-green-100 text-green-700'
    if (status === 'DECLINED') return 'bg-red-100 text-red-600'
    if (status === 'NO_RESPONSE') return 'bg-gray-100 text-gray-500'
    return 'bg-blue-100 text-blue-700' // SENT
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            {properties.length === 0
              ? 'No properties yet — add one to get started'
              : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} on your account`}
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add property
        </Link>
      </div>

      {/* Empty state */}
      {insights.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Submit your first property and we&apos;ll get it listed across Airbnb, Booking.com, Vrbo and more.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-medium"
          >
            List your first property &rarr;
          </Link>
        </div>
      )}

      {/* Property cards */}
      {insights.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map(({ property, stats }) => (
            <div
              key={property.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{property.name}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{property.address}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge(property.status)}`}
                >
                  {property.status}
                </span>
              </div>

              {/* Stats */}
              {stats ? (
                <dl className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <dt className="text-xs text-gray-400 mb-1">Revenue</dt>
                    <dd className="text-sm font-bold text-gray-900">£{stats.revenue.toLocaleString()}</dd>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <dt className="text-xs text-gray-400 mb-1">Occupancy</dt>
                    <dd className="text-sm font-bold text-gray-900">{(stats.occupancyRate * 100).toFixed(1)}%</dd>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <dt className="text-xs text-gray-400 mb-1">Avg / night</dt>
                    <dd className="text-sm font-bold text-gray-900">£{stats.avgDailyRate.toFixed(0)}</dd>
                  </div>
                </dl>
              ) : property.status === 'PENDING' ? (
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                  Your property is being reviewed and listed. Stats will appear once it goes live.
                </div>
              ) : (
                <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-400">
                  Stats loading…
                </div>
              )}

              {/* Platform tags */}
              <div className="mt-4 flex gap-1 flex-wrap">
                {['Airbnb', 'Booking.com', 'Vrbo'].map((p) => (
                  <span
                    key={p}
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      property.status === 'ACTIVE'
                        ? 'bg-brand-50 text-brand-600 border-brand-100'
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add another property CTA (when they have at least 1) */}
      {insights.length > 0 && (
        <div className="mt-6 text-center">
          <Link href="/onboarding" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            + Add another property
          </Link>
        </div>
      )}

      {/* Recent SMS notifications */}
      {recentSmsLogs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent cleaner notifications</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking ref</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Cleaner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSmsLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs text-gray-700">{log.bookingRef}</td>
                    <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{log.cleaner.user.name}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${smsStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {new Date(log.sentAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}
