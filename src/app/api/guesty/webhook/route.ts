import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, buildCleanerNotification } from '@/lib/sms'

type GuestyReservationEvent = {
  event: string
  data: {
    _id: string
    listingId: string
    checkIn: string
    checkOut: string
    status: string
    guest?: { fullName?: string }
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (process.env.GUESTY_WEBHOOK_SECRET && secret !== process.env.GUESTY_WEBHOOK_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const payload = await req.json() as GuestyReservationEvent

  if (payload.event !== 'reservation.created' || payload.data?.status !== 'confirmed') {
    return new NextResponse('', { status: 200 })
  }

  const { _id: bookingRef, listingId, checkIn, checkOut } = payload.data

  if (!listingId || !checkOut) {
    return new NextResponse('', { status: 200 })
  }

  const property = await db.property.findFirst({ where: { guestyId: listingId } })
  if (!property) {
    return new NextResponse('', { status: 200 })
  }

  const checkoutDay = new Date(checkOut)
  checkoutDay.setHours(0, 0, 0, 0)

  const allCleaners = await db.cleanerProfile.findMany({
    include: {
      availability: { where: { date: checkoutDay, available: true } },
      user: { select: { name: true } },
    },
  })

  // Prefix match: cleaner area must be a prefix of the property postcode (spaces ignored)
  const normalised = property.postcode.toUpperCase().replace(/\s+/g, '')
  const matchingCleaners = allCleaners.filter((c) => {
    const areas = c.coverageAreas as string[]
    return (
      areas.some((area) => normalised.startsWith(area.toUpperCase().replace(/\s+/g, ''))) &&
      c.availability.length > 0
    )
  })

  await Promise.allSettled(
    matchingCleaners.map(async (cleaner) => {
      const message = buildCleanerNotification({
        cleanerName: cleaner.user.name,
        propertyName: property.name,
        bookingDate: formatDate(checkIn),
        checkoutDate: formatDate(checkOut),
      })

      await sendSms(cleaner.phone, message)

      await db.smsLog.create({
        data: {
          cleanerId: cleaner.id,
          bookingRef,
          propertyId: property.id,
          message,
          status: 'SENT',
        },
      })
    })
  )

  return new NextResponse('', { status: 200 })
}
