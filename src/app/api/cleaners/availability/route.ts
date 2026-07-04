import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLEANER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, available } = await req.json() as { date: string; available: boolean }

  if (!date || typeof available !== 'boolean') {
    return NextResponse.json({ error: 'date and available are required.' }, { status: 400 })
  }

  const profile = await db.cleanerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) {
    return NextResponse.json({ error: 'Cleaner profile not found.' }, { status: 404 })
  }

  await db.cleanerAvailability.upsert({
    where: { cleanerId_date: { cleanerId: profile.id, date: new Date(date) } },
    update: { available },
    create: { cleanerId: profile.id, date: new Date(date), available },
  })

  return NextResponse.json({ ok: true })
}
