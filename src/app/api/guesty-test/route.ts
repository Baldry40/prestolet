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

export async function GET() {
  try {
    const token = await getToken()

    const payload = {
      type: 'SINGLE',
      nickname: 'Test Property',
      title: 'Test Property',
      address: {
        full: '1 Test Street, London',
        city: 'London',
        country: 'GB',
        zipcode: 'SW1A 1AA',
      },
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      prices: { basePrice: 100 },
      pictures: [],
      publicDescription: { summary: 'Test' },
      terms: { minNights: 1, maxNights: 90 },
    }

    const res = await fetch(`${process.env.GUESTY_BASE_URL}/listings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = await res.text()
    return NextResponse.json({ ok: res.ok, status: res.status, body, sentPayload: payload })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
