import { NextResponse } from 'next/server'

async function getToken() {
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
  const data = await res.json()
  if (!res.ok) throw new Error(`Auth failed: ${JSON.stringify(data)}`)
  return data.access_token as string
}

async function postListing(token: string, payload: object) {
  const res = await fetch(`${process.env.GUESTY_BASE_URL}/listings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.text()
  return { ok: res.ok, status: res.status, body: JSON.parse(body) }
}

export async function GET() {
  try {
    const token = await getToken()

    // Variant A: absolute minimum — only fields the schema lists as required
    const minimal = {
      type: 'SINGLE',
      nickname: 'Test Min',
      title: 'Test Min',
      address: { full: '1 Test Street, London' },
      prices: { basePrice: 100 },
      pictures: [],
      terms: { minNights: 1, maxNights: 90 },
    }

    // Variant B: add address sub-fields back
    const withAddress = {
      ...minimal,
      nickname: 'Test Addr',
      title: 'Test Addr',
      address: {
        full: '1 Test Street, London',
        city: 'London',
        country: 'United Kingdom',
        zipcode: 'SW1A 1AA',
      },
    }

    const [resultA, resultB] = await Promise.all([
      postListing(token, minimal),
      postListing(token, withAddress),
    ])

    return NextResponse.json({ minimal: resultA, withAddress: resultB })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
