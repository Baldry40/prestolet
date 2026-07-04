import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Twilio posts to this endpoint when a cleaner replies YES/NO
export async function POST(req: NextRequest) {
  const body = await req.formData()
  const from = body.get('From') as string
  const text = (body.get('Body') as string)?.trim().toUpperCase()

  const cleaner = await db.cleanerProfile.findFirst({ where: { phone: from } })
  if (!cleaner) return new NextResponse('', { status: 200 })

  const latestLog = await db.smsLog.findFirst({
    where: { cleanerId: cleaner.id, status: 'SENT' },
    orderBy: { sentAt: 'desc' },
  })

  if (!latestLog) return new NextResponse('', { status: 200 })

  const status = text.startsWith('YES') ? 'CONFIRMED' : text.startsWith('NO') ? 'DECLINED' : null
  if (!status) return new NextResponse('', { status: 200 })

  await db.smsLog.update({
    where: { id: latestLog.id },
    data: { status, respondedAt: new Date() },
  })

  return new NextResponse('', { status: 200 })
}
