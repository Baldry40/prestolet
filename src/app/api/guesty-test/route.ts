import { NextResponse } from 'next/server'
import { createProperty } from '@/lib/guesty'

export async function GET() {
  try {
    const result = await createProperty({
      nickname: 'Test Property',
      title: 'Test Property',
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
    })
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) })
  }
}
