import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function CleanerPortalPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLEANER') redirect('/auth/login')

  const profile = await db.cleanerProfile.findUnique({
    where: { userId: session.user.id },
    include: { availability: { orderBy: { date: 'asc' } } },
  })

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cleaner portal</h1>
      <p className="text-gray-500 mb-8">Manage your availability and coverage areas.</p>

      {!profile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 mb-8">
          Your cleaner profile isn't set up yet. Contact Prestolet to complete setup.
        </div>
      )}

      {profile && (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Coverage areas</h2>
            <div className="flex flex-wrap gap-2">
              {profile.coverageAreas.map((area) => (
                <span key={area} className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Availability</h2>
            <div className="space-y-2">
              {profile.availability.map((a) => (
                <div key={a.id} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">
                    {new Date(a.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <span className={`text-sm font-medium ${a.available ? 'text-green-600' : 'text-red-500'}`}>
                    {a.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
