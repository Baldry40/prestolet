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

async function guestyJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init)
  const text = await res.text()
  let body: unknown
  try { body = JSON.parse(text) } catch { body = text }
  return { ok: res.ok, status: res.status, body }
}

export async function GET() {
  try {
    const token = await getToken()
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    const base = process.env.GUESTY_BASE_URL

    // 1. Read listings (confirms read access)
    const listRes = await guestyJson(`${base}/listings?limit=1`, { headers })

    // 2. Try create with full payload
    const payload = {
      nickname: 'Prestolet API Test (auto-delete)',
      title: 'Prestolet API Test (auto-delete)',
      type: 'SINGLE',
      address: { full: '1 Test Street, London, UK' },
    }
    const createRes = await guestyJson(`${base}/listings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!createRes.ok) {
      return NextResponse.json({ listRead: listRes, createFailed: { status: createRes.status, body: createRes.body, sentPayload: payload } })
    }

    const listingId = (createRes.body as { _id: string })._id

    // 3. Delete immediately
    const deleteRes = await guestyJson(`${base}/listings/${listingId}`, { method: 'DELETE', headers })

    return NextResponse.json({ listRead: listRes, createOk: true, listingId, deleteOk: deleteRes.ok, deleteStatus: deleteRes.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
