import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import CleanerPortalClient from './CleanerPortalClient'

export default async function CleanerPortalPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLEANER') redirect('/auth/login')

  const profile = await db.cleanerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      availability: { orderBy: { date: 'asc' } },
      smsLogs: {
        orderBy: { sentAt: 'desc' },
        take: 20,
      },
    },
  })

  // Serialise for client component (Dates → strings)
  const serialised = profile
    ? {
        id: profile.id,
        phone: profile.phone,
        coverageAreas: (profile.coverageAreas as string[]) ?? [],
        bio: profile.bio,
        availability: profile.availability.map((a) => ({
          id: a.id,
          date: a.date.toISOString().split('T')[0], // YYYY-MM-DD
          available: a.available,
        })),
        smsLogs: profile.smsLogs.map((l) => ({
          id: l.id,
          bookingRef: l.bookingRef,
          propertyId: l.propertyId,
          status: l.status,
          sentAt: l.sentAt.toISOString(),
          respondedAt: l.respondedAt?.toISOString() ?? null,
        })),
      }
    : null

  return (
    <CleanerPortalClient
      profile={serialised}
      userName={session.user.name ?? 'Cleaner'}
    />
  )
}
