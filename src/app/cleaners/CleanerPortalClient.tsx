'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

type AvailabilityEntry = {
  id: string
  date: string // YYYY-MM-DD
  available: boolean
}

type SmsLogEntry = {
  id: string
  bookingRef: string
  propertyId: string
  status: string
  sentAt: string
  respondedAt: string | null
}

type Profile = {
  id: string
  phone: string
  coverageAreas: string[]
  bio: string | null
  availability: AvailabilityEntry[]
  smsLogs: SmsLogEntry[]
}

type Props = {
  profile: Profile | null
  userName: string
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function smsStatusBadge(status: string) {
  if (status === 'CONFIRMED') return 'bg-green-100 text-green-700'
  if (status === 'DECLINED') return 'bg-red-100 text-red-600'
  if (status === 'NO_RESPONSE') return 'bg-gray-100 text-gray-500'
  return 'bg-blue-100 text-blue-700'
}

export default function CleanerPortalClient({ profile, userName }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  // Local availability map: date string → boolean
  const [availMap, setAvailMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    if (profile) {
      for (const a of profile.availability) {
        map[a.date] = a.available
      }
    }
    return map
  })

  // Coverage areas state
  const [areas, setAreas] = useState<string[]>(profile?.coverageAreas ?? [])
  const [newArea, setNewArea] = useState('')
  const [areaLoading, setAreaLoading] = useState(false)
  const [areaError, setAreaError] = useState<string | null>(null)

  async function toggleDate(dateStr: string) {
    const current = availMap[dateStr]
    // If no entry = unknown, first click = available (true)
    const nextValue = current === undefined ? true : !current

    setAvailMap((prev) => ({ ...prev, [dateStr]: nextValue }))

    await fetch('/api/cleaners/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, available: nextValue }),
    })
  }

  async function addArea() {
    const area = newArea.trim()
    if (!area) return
    setAreaLoading(true)
    setAreaError(null)

    const res = await fetch('/api/cleaners/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area }),
    })

    setAreaLoading(false)

    if (res.ok) {
      setAreas((prev) => [...prev, area])
      setNewArea('')
    } else {
      const data = await res.json().catch(() => ({}))
      setAreaError(data.error ?? 'Failed to add area.')
    }
  }

  async function removeArea(area: string) {
    const res = await fetch('/api/cleaners/areas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area }),
    })
    if (res.ok) {
      setAreas((prev) => prev.filter((a) => a !== area))
    }
  }

  function renderMonth(y: number, m: number) {
    const monthName = new Date(y, m, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' })
    const days = daysInMonth(y, m)
    const firstDay = (firstDayOfMonth(y, m) + 6) % 7 // Monday-first

    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= days; d++) cells.push(d)

    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">{monthName}</h3>
          <div className="flex gap-1">
            <button
              onClick={() => {
                if (m === 0) { setYear(y - 1); setMonth(11) } else setMonth(m - 1)
              }}
              className="p-1 text-gray-400 hover:text-gray-700 transition"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              onClick={() => {
                if (m === 11) { setYear(y + 1); setMonth(0) } else setMonth(m + 1)
              }}
              className="p-1 text-gray-400 hover:text-gray-700 transition"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />
            const dateStr = `${y}-${pad(m + 1)}-${pad(day)}`
            const avail = availMap[dateStr]
            const isPast = dateStr < todayStr
            const isToday = dateStr === todayStr

            let cellClass = 'bg-gray-100 text-gray-400' // unknown
            if (avail === true) cellClass = 'bg-green-100 text-green-700 font-medium'
            if (avail === false) cellClass = 'bg-red-100 text-red-600 font-medium'
            if (isPast) cellClass = 'bg-white text-gray-200 cursor-default'

            return (
              <button
                key={i}
                onClick={() => !isPast && toggleDate(dateStr)}
                disabled={isPast}
                title={dateStr}
                className={`
                  aspect-square flex items-center justify-center rounded text-xs
                  transition hover:opacity-80
                  ${cellClass}
                  ${isToday ? 'ring-2 ring-brand-400' : ''}
                `}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="text-base font-bold text-brand-700">Prestolet</Link>
            <span className="text-sm text-gray-500 hidden sm:block">Cleaner Portal — {userName}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cleaner portal</h1>
          <p className="text-gray-500 mt-1">Manage your availability and coverage areas.</p>
        </div>

        {!profile && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800">
            <p className="font-semibold mb-1">Profile not fully set up</p>
            <p className="text-sm">Your cleaner profile hasn&apos;t been fully configured yet. Contact Prestolet at{' '}
              <a href="mailto:hello@prestolet.co.uk" className="underline">hello@prestolet.co.uk</a> to complete setup.
            </p>
          </div>
        )}

        {profile && (
          <>
            {/* ── Coverage areas ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Coverage areas</h2>

              <div className="flex flex-wrap gap-2 mb-5">
                {areas.length === 0 && (
                  <p className="text-sm text-gray-400">No coverage areas set yet.</p>
                )}
                {areas.map((area) => (
                  <span key={area} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 rounded-full text-sm">
                    {area}
                    <button
                      onClick={() => removeArea(area)}
                      className="text-brand-400 hover:text-red-500 transition text-xs"
                      aria-label={`Remove ${area}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
                  placeholder="Add postcode prefix, e.g. LS1"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
                <button
                  onClick={addArea}
                  disabled={areaLoading}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-60"
                >
                  Add
                </button>
              </div>
              {areaError && <p className="mt-2 text-xs text-red-600">{areaError}</p>}
            </section>

            {/* ── Availability calendar ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-base font-semibold text-gray-900">Availability calendar</h2>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Click dates to toggle available (green) or unavailable (red). Gray = not set.
              </p>

              <div className="flex gap-3 text-xs text-gray-500 mb-6 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 inline-block" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 inline-block" />
                  Unavailable
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200 inline-block" />
                  Not set
                </span>
              </div>

              {renderMonth(year, month)}
            </section>

            {/* ── SMS logs ── */}
            {profile.smsLogs.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h2 className="text-base font-semibold text-gray-900">Recent booking notifications</h2>
                  <p className="text-sm text-gray-500 mt-0.5">SMS alerts you&apos;ve received for cleaning jobs</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking ref</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Sent</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Responded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {profile.smsLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-mono text-xs text-gray-700">{log.bookingRef}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${smsStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-xs hidden sm:table-cell">
                          {new Date(log.sentAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-xs hidden md:table-cell">
                          {log.respondedAt
                            ? new Date(log.respondedAt).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                              })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
