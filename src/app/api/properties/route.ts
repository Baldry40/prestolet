import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { sendNewPropertyAlert } from '@/lib/mail'

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

  // Notify admin — non-blocking
  sendNewPropertyAlert({
    name: property.name,
    address: property.address,
    postcode: property.postcode,
    type: property.type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    expectedRate: property.expectedRate.toString(),
    ownerName: session.user.name ?? '',
    ownerEmail: session.user.email ?? '',
  }).catch((err) => console.error('Mail send failed:', err))

  return NextResponse.json(property, { status: 201 })
}
