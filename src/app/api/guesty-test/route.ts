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

async function guestyGet(token: string, path: string) {
  const res = await fetch(`${process.env.GUESTY_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await res.text()
  return { ok: res.ok, status: res.status, body: JSON.parse(body) }
}

async function postListing(token: string, label: string, payload: object) {
  const res = await fetch(`${process.env.GUESTY_BASE_URL}/listings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.text()
  return { label, ok: res.ok, status: res.status, body: JSON.parse(body) }
}

const BASE = {
  nickname: 'Test',
  title: 'Test',
  address: { full: '1 Test Street, London' },
  prices: { basePrice: 100 },
  pictures: [],
  terms: { minNights: 1, maxNights: 90 },
}

export async function GET() {
  try {
    const token = await getToken()

    const [account, withSingle, withMtl, noType] = await Promise.all([
      // 1. Verify account is readable
      guestyGet(token, '/listings?limit=1'),
      // 2. type=SINGLE (current attempt)
      postListing(token, 'type=SINGLE', { ...BASE, type: 'SINGLE' }),
      // 3. type=MTL
      postListing(token, 'type=MTL', { ...BASE, type: 'MTL' }),
      // 4. no type field at all — see if error message changes
      postListing(token, 'no-type', BASE),
    ])

    return NextResponse.json({ account, withSingle, withMtl, noType })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
