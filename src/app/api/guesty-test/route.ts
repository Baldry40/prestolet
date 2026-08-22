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

    const testPayload = {
      nickname: 'Test Property',
      address: {
        full: '1 Test Street, London',
        city: 'London',
        country: 'GB',
        zipcode: 'SW1A 1AA',
      },
      propertyType: 'APARTMENT',
      bedrooms: 1,
      bathrooms: 1,
      prices: { basePrice: 100 },
      pictures: [],
      publicDescription: { summary: 'Test' },
    }

    const postRes = await fetch(`${process.env.GUESTY_BASE_URL}/listings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    })
    const postBody = await postRes.json()

    return NextResponse.json({
      ok: postRes.ok,
      tokenObtained: true,
      postStatus: postRes.status,
      postResponse: postBody,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
