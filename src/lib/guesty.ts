const BASE_URL = process.env.GUESTY_BASE_URL!

let tokenCache: { token: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }

  const res = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'open-api',
      client_id: process.env.GUESTY_CLIENT_ID!,
      client_secret: process.env.GUESTY_CLIENT_SECRET!,
    }),
  })

  if (!res.ok) throw new Error(`Guesty auth failed: ${res.status}`)

  const data = await res.json() as { access_token: string; expires_in: number }
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return tokenCache.token
}

async function guestyFetch(path: string, options: RequestInit = {}) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Guesty ${options.method ?? 'GET'} ${path} failed (${res.status}): ${body}`)
  }
  return res.json()
}

export type GuestyPropertyPayload = {
  type: 'SINGLE' | 'MTL'
  nickname: string
  title: string
  address: {
    full: string
    city: string
    country: string
    zipcode: string
  }
  propertyType?: string
  bedrooms: number
  bathrooms: number
  prices: { basePrice: number }
  pictures: { original: string }[]
  publicDescription: { summary: string }
  terms: { minNights: number; maxNights: number }
}

export async function createProperty(payload: GuestyPropertyPayload) {
  return guestyFetch('/listings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }) as Promise<{ _id: string }>
}

export async function getPropertyInsights(guestyId: string) {
  return guestyFetch(`/listings/${guestyId}/stats`) as Promise<{
    revenue: number
    occupancyRate: number
    avgDailyRate: number
  }>
}

export async function getCalendar(guestyId: string, from: string, to: string) {
  return guestyFetch(`/availability-pricing/api/v3/listings/${guestyId}?startDate=${from}&endDate=${to}`)
}

// ── Mock data (used until Guesty credentials are configured) ────────────────

function seedHash(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i)
  return Math.abs(h)
}

export function getMockInsights(propertyId: string, expectedRate: number) {
  const h = seedHash(propertyId)
  const occupancyRate = 0.72 + (h % 18) / 100   // 72–90%
  const rateVariance = 0.9 + (h % 20) / 100      // ±10%
  return {
    revenue: Math.round(expectedRate * 30 * occupancyRate),
    occupancyRate,
    avgDailyRate: Math.round(expectedRate * rateVariance),
    isMock: true,
  }
}

export type MockBooking = {
  checkIn: Date
  checkOut: Date
  guestName: string
  platform: string
  nights: number
}

export function getMockBookings(propertyId: string, year: number, month: number): MockBooking[] {
  const h = seedHash(propertyId + String(year) + String(month))
  const platforms = ['Airbnb', 'Booking.com', 'Vrbo']
  const guests = ['James Wilson', 'Sarah Mitchell', 'The Chen Family', 'Oliver Thompson', 'Priya Patel', 'The Robinsons', 'Emma Davies']
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Fixed booking slots spread across the month, offset by property hash
  const slots = [
    { start: 2 + (h % 3),        nights: 3 + (h % 3) },
    { start: 10 + ((h >> 4) % 3), nights: 5 + ((h >> 4) % 2) },
    { start: 18 + ((h >> 8) % 3), nights: 4 + ((h >> 8) % 3) },
    { start: 27,                   nights: 2 },
  ]

  return slots
    .filter((s) => s.start + s.nights <= daysInMonth + 1)
    .map((s, i) => ({
      checkIn: new Date(year, month, s.start),
      checkOut: new Date(year, month, s.start + s.nights),
      guestName: guests[(h + i * 7) % guests.length],
      platform: platforms[(h + i * 3) % platforms.length],
      nights: s.nights,
    }))
}
