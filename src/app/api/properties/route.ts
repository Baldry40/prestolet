import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { createProperty } from '@/lib/guesty'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    name: string
    address: string
    postcode: string
    type: string
    bedrooms: number
    bathrooms: number
    expectedRate: number
    description?: string
    photos?: string[]
  }

  const property = await db.property.create({
    data: {
      ownerId: session.user.id,
      name: body.name,
      address: body.address,
      postcode: body.postcode,
      type: body.type,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      expectedRate: body.expectedRate,
      description: body.description,
      photos: body.photos ?? [],
    },
  })

  // Push to Guesty — non-blocking; status updates to ACTIVE on success
  createProperty({
    nickname: body.name,
    address: {
      full: body.address,
      city: body.address.split(',').at(-2)?.trim() ?? '',
      country: 'GB',
      zipcode: body.postcode,
    },
    propertyType: body.type,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    prices: { basePrice: body.expectedRate },
    pictures: (body.photos ?? []).map((url) => ({ original: url })),
    publicDescription: { summary: body.description ?? '' },
  })
    .then((guesty) =>
      db.property.update({
        where: { id: property.id },
        data: { guestyId: guesty._id, status: 'ACTIVE' },
      })
    )
    .catch((err) => console.error('Guesty push failed:', err))

  return NextResponse.json(property, { status: 201 })
}
