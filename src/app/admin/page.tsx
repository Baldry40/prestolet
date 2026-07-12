import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { approveProperty, rejectProperty } from './actions'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [totalProperties, activeProperties, totalCleaners, pendingSms] = await Promise.all([
    db.property.count(),
    db.property.count({ where: { status: 'ACTIVE' } }),
    db.cleanerProfile.count(),
    db.smsLog.count({ where: { status: 'SENT' } }),
  ])

  const properties = await db.property.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const recentSmsLogs = await db.smsLog.findMany({
    include: {
      cleaner: { include: { user: { select: { name: true } } } },
    },
    orderBy: { sentAt: 'desc' },
    take: 30,
  })

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

  const stats = [
    { label: 'Total properties', value: totalProperties, colour: 'text-brand-600' },
    { label: 'Active properties', value: activeProperties, colour: 'text-green-600' },
    { label: 'Registered cleaners', value: totalCleaners, colour: 'text-purple-600' },
    { label: 'Pending SMS confirmations', value: pendingSms, colour: 'text-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="text-base font-bold text-brand-700">Prestolet</Link>
            <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">Admin</span>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-700">
            &larr; Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-gray-900">Admin overview</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.colour}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Properties table */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All properties</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Property</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Owner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Guesty ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Listed</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.postcode}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <p className="text-gray-700">{p.owner.name}</p>
                      <p className="text-xs text-gray-400">{p.owner.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500 hidden md:table-cell">
                      {p.guestyId ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 hidden lg:table-cell">
                      {new Date(p.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      {p.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <form action={approveProperty.bind(null, p.id)}>
                            <button
                              type="submit"
                              className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={rejectProperty.bind(null, p.id)}>
                            <button
                              type="submit"
                              className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      )}
                      {p.status === 'ACTIVE' && (
                        <form action={rejectProperty.bind(null, p.id)}>
                          <button
                            type="submit"
                            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-100 hover:text-red-600 transition font-medium"
                          >
                            Deactivate
                          </button>
                        </form>
                      )}
                      {p.status === 'INACTIVE' && (
                        <form action={approveProperty.bind(null, p.id)}>
                          <button
                            type="submit"
                            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-green-100 hover:text-green-600 transition font-medium"
                          >
                            Re-activate
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                      No properties yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SMS logs table */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent SMS logs</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking ref</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Cleaner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Sent</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Responded</th>
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
                    <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                      {new Date(log.sentAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 hidden lg:table-cell">
                      {log.respondedAt
                        ? new Date(log.respondedAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
                {recentSmsLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                      No SMS logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
