'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProperty } from '@/lib/guesty'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard')
}

export async function approveProperty(propertyId: string) {
  await requireAdmin()

  const property = await db.property.update({
    where: { id: propertyId },
    data: { status: 'ACTIVE' },
  })

  // Push to Guesty — non-blocking
  createProperty({
    nickname: property.name,
    address: {
      full: property.address,
      city: property.address.split(',').at(-2)?.trim() ?? '',
      country: 'GB',
      zipcode: property.postcode,
    },
    propertyType: property.type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    prices: { basePrice: Number(property.expectedRate) },
    pictures: ((property.photos as string[]) ?? []).map((url) => ({ original: url })),
    publicDescription: { summary: property.description ?? '' },
  })
    .then((guesty) =>
      db.property.update({
        where: { id: property.id },
        data: { guestyId: guesty._id },
      })
    )
    .catch((err) => console.error('Guesty push failed (no credentials yet):', err))

  revalidatePath('/admin')
}

export async function rejectProperty(propertyId: string) {
  await requireAdmin()
  await db.property.update({ where: { id: propertyId }, data: { status: 'INACTIVE' } })
  revalidatePath('/admin')
}
