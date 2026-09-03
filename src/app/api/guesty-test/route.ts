import { NextResponse } from 'next/server'

let tokenCache: { token: string; expiresAt: number } | null = null

async function getToken() {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token

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
  tokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
  return tokenCache.token
}

export async function GET() {
  try {
    const token = await getToken()

    // Step 1: create a test listing
    const payload = {
      type: 'SINGLE',
      nickname: 'Prestolet API Test (auto-delete)',
      title: 'Prestolet API Test (auto-delete)',
      address: { full: '1 Test Street, London' },
      prices: { basePrice: 100 },
      pictures: [],
      terms: { minNights: 1, maxNights: 90 },
    }

    const createRes = await fetch(`${process.env.GUESTY_BASE_URL}/listings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const createBody = await createRes.json()

    if (!createRes.ok) {
      return NextResponse.json({ step: 'create', ok: false, status: createRes.status, body: createBody })
    }

    const listingId = createBody._id

    // Step 2: immediately delete it
    const deleteRes = await fetch(`${process.env.GUESTY_BASE_URL}/listings/${listingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const deleteBody = await deleteRes.text()

    return NextResponse.json({
      step: 'done',
      createOk: true,
      listingId,
      deleteOk: deleteRes.ok,
      deleteStatus: deleteRes.status,
      deleteBody,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
