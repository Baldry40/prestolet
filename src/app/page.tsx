import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-4xl font-bold text-brand-700 mb-4">Prestolet</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Property management across every booking platform, from one place.
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition"
        >
          Get started
        </Link>
      </div>
    </main>
  )
}
