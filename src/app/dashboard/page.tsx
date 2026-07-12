import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getPropertyInsights, getMockInsights, getMockBookings, type MockBooking } from '@/lib/guesty'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BookingCalendar from '@/components/BookingCalendar'
import type { SmsLog } from '@/types'

type Stats = {
  revenue: number
  occupancyRate: number
  avgDailyRate: number
  isMock: boolean
}

async function getInsights(propertyId: string, guestyId: string | null, expectedRate: number): Promise<Stats | null> {
  if (guestyId) {
    try {
      const data = await getPropertyInsights(guestyId)
      return { ...data, isMock: false }
    } catch {
      // Fall through to mock
    }
  }
  return getMockInsights(propertyId, expectedRate)
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if (session.user.role === 'CLEANER') redirect('/cleaners')

  const properties = await db.property.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const now = new Date()

  const propertyData = await Promise.all(
    properties.map(async (p) => {
      const showData = p.status === 'ACTIVE' || p.status === 'PENDING'
      const stats = showData
        ? await getInsights(p.id, p.guestyId, Number(p.expectedRate))
        : null
      const bookings: MockBooking[] = showData
        ? getMockBookings(p.id, now.getFullYear(), now.getMonth())
        : []
      return { property: p, stats, bookings }
    })
  )

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
    return 'bg-amber-100 text-amber-700'
  }

  const smsStatusBadge = (status: string) => {
    if (status === 'CONFIRMED') return 'bg-green-100 text-green-700'
    if (status === 'DECLINED') return 'bg-red-100 text-red-600'
    if (status === 'NO_RESPONSE') return 'bg-gray-100 text-gray-500'
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Your properties</h1>
          <p className="text-sm text-stone-500 mt-1">
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
      {propertyData.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cream-200 shadow-sm">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">No properties yet</h2>
          <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
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

      {/* Property sections */}
      {propertyData.map(({ property, stats, bookings }) => (
        <div key={property.id} className="mb-12">
          {/* Property header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-stone-900">{property.name}</h2>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge(property.status)}`}>
                  {property.status}
                </span>
              </div>
              <p className="text-sm text-stone-400 mt-0.5">{property.address}</p>
            </div>
            <div className="flex gap-1 flex-wrap justify-end">
              {['Airbnb', 'Booking.com', 'Vrbo'].map((pl) => (
                <span
                  key={pl}
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    property.status === 'ACTIVE'
                      ? 'bg-brand-50 text-brand-600 border-brand-100'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  {pl}
                </span>
              ))}
            </div>
          </div>

          {/* Pending — show preview stats with notice */}
          {property.status === 'PENDING' && stats && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                Under review — the figures below are a preview of what your dashboard will look like once live.
              </div>
            </div>
          )}

          {/* Active or Pending — stats + calendar */}
          {(property.status === 'ACTIVE' || property.status === 'PENDING') && stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left — stats */}
              <div className="space-y-4">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center shadow-sm">
                    <p className="text-xs text-stone-400 mb-1">Revenue</p>
                    <p className="text-xl font-black text-stone-900">£{stats.revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">this month</p>
                  </div>
                  <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center shadow-sm">
                    <p className="text-xs text-stone-400 mb-1">Occupancy</p>
                    <p className="text-xl font-black text-stone-900">{(stats.occupancyRate * 100).toFixed(0)}%</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">this month</p>
                  </div>
                  <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center shadow-sm">
                    <p className="text-xs text-stone-400 mb-1">Per night</p>
                    <p className="text-xl font-black text-stone-900">£{stats.avgDailyRate}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">avg rate</p>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="bg-white border border-cream-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between text-xs text-stone-500 mb-2">
                    <span>Occupancy rate</span>
                    <span className="font-semibold text-stone-700">{(stats.occupancyRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
                      style={{ width: `${(stats.occupancyRate * 100).toFixed(1)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1.5">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Expected rate */}
                <div className="bg-white border border-cream-200 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-stone-400 mb-1">Your expected nightly rate</p>
                  <p className="text-2xl font-black text-brand-600">£{Number(property.expectedRate).toFixed(0)}</p>
                  <p className="text-xs text-stone-400 mt-1">Dynamic pricing adjusts around this base rate</p>
                </div>
              </div>

              {/* Right — calendar */}
              <BookingCalendar bookings={bookings} isMock={stats.isMock} />
            </div>
          )}

          {/* Inactive state */}
          {property.status === 'INACTIVE' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
              This property is currently inactive. Contact us to reactivate it.
            </div>
          )}
        </div>
      ))}

      {/* Add another */}
      {propertyData.length > 0 && (
        <div className="mt-2 text-center">
          <Link href="/onboarding" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            + Add another property
          </Link>
        </div>
      )}

      {/* SMS logs */}
      {recentSmsLogs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Recent cleaner notifications</h2>
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 border-b border-cream-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Booking ref</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden sm:table-cell">Cleaner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden md:table-cell">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {recentSmsLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50">
                    <td className="px-5 py-3 font-mono text-xs text-stone-700">{log.bookingRef}</td>
                    <td className="px-5 py-3 text-stone-600 hidden sm:table-cell">{log.cleaner.user.name}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${smsStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-400 text-xs hidden md:table-cell">
                      {new Date(log.sentAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
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
