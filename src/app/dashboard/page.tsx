import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { getPropertyInsights } from '@/lib/guesty'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const properties = await db.property.findMany({
    where: { ownerId: session.user.id },
  })

  const insights = await Promise.all(
    properties
      .filter((p) => p.guestyId)
      .map(async (p) => ({
        property: p,
        stats: await getPropertyInsights(p.guestyId!),
      }))
  )

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your properties</h1>

      {insights.length === 0 && (
        <p className="text-gray-500">No active properties yet. <a href="/onboarding" className="text-brand-600 underline">Add one</a>.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {insights.map(({ property, stats }) => (
          <div key={property.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{property.name}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Revenue to date</dt>
                <dd className="font-medium">£{stats.revenue.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Occupancy rate</dt>
                <dd className="font-medium">{(stats.occupancyRate * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Avg nightly rate</dt>
                <dd className="font-medium">£{stats.avgDailyRate.toFixed(0)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </main>
  )
}
