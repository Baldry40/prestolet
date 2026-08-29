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

async function guestyGet(token: string, path: string) {
  const res = await fetch(`${process.env.GUESTY_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await res.text()
  return { ok: res.ok, status: res.status, body: JSON.parse(body) }
}

export async function GET() {
  try {
    const token = await getToken()
    const [account, users] = await Promise.all([
      guestyGet(token, '/accounts/me'),
      guestyGet(token, '/users?limit=3'),
    ])
    return NextResponse.json({ account, users })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
