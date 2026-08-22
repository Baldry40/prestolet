import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    const body = await res.json()

    if (!res.ok) {
      return NextResponse.json({ ok: false, status: res.status, body })
    }

    const token = body.access_token as string

    const listingsRes = await fetch(`${process.env.GUESTY_BASE_URL}/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const listingsBody = await listingsRes.json()

    return NextResponse.json({
      ok: true,
      tokenObtained: true,
      listingsStatus: listingsRes.status,
      listings: listingsBody,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
