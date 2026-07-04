import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

async function getProfile(userId: string) {
  return db.cleanerProfile.findUnique({ where: { userId } })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLEANER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { area } = await req.json() as { area: string }
  if (!area?.trim()) {
    return NextResponse.json({ error: 'Area is required.' }, { status: 400 })
  }

  const profile = await getProfile(session.user.id)
  if (!profile) {
    return NextResponse.json({ error: 'Cleaner profile not found.' }, { status: 404 })
  }

  if (profile.coverageAreas.includes(area.trim())) {
    return NextResponse.json({ error: 'Area already added.' }, { status: 409 })
  }

  await db.cleanerProfile.update({
    where: { id: profile.id },
    data: { coverageAreas: { push: area.trim() } },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLEANER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { area } = await req.json() as { area: string }
  if (!area?.trim()) {
    return NextResponse.json({ error: 'Area is required.' }, { status: 400 })
  }

  const profile = await getProfile(session.user.id)
  if (!profile) {
    return NextResponse.json({ error: 'Cleaner profile not found.' }, { status: 404 })
  }

  await db.cleanerProfile.update({
    where: { id: profile.id },
    data: {
      coverageAreas: profile.coverageAreas.filter((a) => a !== area.trim()),
    },
  })

  return NextResponse.json({ ok: true })
}
