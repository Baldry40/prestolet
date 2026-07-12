'use client'

import { useState } from 'react'
import type { MockBooking } from '@/lib/guesty'

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

type Props = {
  bookings: MockBooking[]
  isMock?: boolean
}

export default function BookingCalendar({ bookings, isMock }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // Build set of booked day numbers for current view month
  const bookedDays = new Set<number>()
  const checkInDays = new Set<number>()
  const checkOutDays = new Set<number>()

  bookings.forEach((b) => {
    const ci = new Date(b.checkIn)
    const co = new Date(b.checkOut)
    if (ci.getFullYear() === viewYear && ci.getMonth() === viewMonth) checkInDays.add(ci.getDate())
    if (co.getFullYear() === viewYear && co.getMonth() === viewMonth) checkOutDays.add(co.getDate())

    // Mark all days in range
    const cursor = new Date(ci)
    while (cursor < co) {
      if (cursor.getFullYear() === viewYear && cursor.getMonth() === viewMonth) {
        bookedDays.add(cursor.getDate())
      }
      cursor.setDate(cursor.getDate() + 1)
    }
  })

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  // Convert Sunday=0 to Monday=0 offset
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const platformColour = (p: string) => {
    if (p === 'Airbnb') return 'bg-rose-100 text-rose-700'
    if (p === 'Booking.com') return 'bg-blue-100 text-blue-700'
    return 'bg-purple-100 text-purple-700'
  }

  const upcomingBookings = bookings
    .filter((b) => new Date(b.checkOut) >= today)
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-5">
      {isMock && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          Preview data — live bookings will appear once connected to Guesty
        </div>
      )}

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-cream-100 transition text-stone-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-stone-800">{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-cream-100 transition text-stone-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-stone-400 uppercase py-1">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
            const isBooked = bookedDays.has(day)
            const isCheckIn = checkInDays.has(day)
            const isCheckOut = checkOutDays.has(day)

            return (
              <div key={day} className="flex items-center justify-center py-0.5">
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center text-xs rounded-full font-medium
                    ${isToday ? 'ring-2 ring-brand-500 ring-offset-1' : ''}
                    ${isBooked ? 'bg-brand-600 text-white' : 'text-stone-600 hover:bg-cream-100'}
                    ${isCheckIn ? 'rounded-l-full' : ''}
                    ${isCheckOut ? 'rounded-r-full' : ''}
                  `}
                >
                  {day}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-cream-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-3 h-3 rounded-full bg-brand-600" />
            Booked
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-3 h-3 rounded-full border border-stone-300" />
            Available
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-3 h-3 rounded-full ring-2 ring-brand-500" />
            Today
          </div>
        </div>
      </div>

      {/* Upcoming bookings list */}
      {upcomingBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-cream-200">
            <p className="text-sm font-semibold text-stone-800">Upcoming bookings</p>
          </div>
          <ul className="divide-y divide-cream-100">
            {upcomingBookings.map((b, i) => (
              <li key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-stone-800">{b.guestName}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {' → '}
                    {new Date(b.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {' · '}{b.nights} night{b.nights !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${platformColour(b.platform)}`}>
                  {b.platform}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
