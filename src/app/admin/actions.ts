'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard')
}

export async function approveProperty(propertyId: string) {
  await requireAdmin()
  await db.property.update({ where: { id: propertyId }, data: { status: 'ACTIVE' } })
  revalidatePath('/admin')
}

export async function rejectProperty(propertyId: string) {
  await requireAdmin()
  await db.property.update({ where: { id: propertyId }, data: { status: 'INACTIVE' } })
  revalidatePath('/admin')
}
