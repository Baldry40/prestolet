'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong. Please try again.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 3000)
    }
  }

  const inputClass = 'w-full border border-cream-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-cream-50'

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-600">Invalid reset link. Please request a new one.</p>
        <Link href="/auth/forgot-password" className="mt-4 inline-block text-sm text-brand-600 font-medium hover:text-brand-700">
          Request new link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-stone-900 mb-2">Password updated</h2>
        <p className="text-sm text-stone-500">Redirecting you to sign in…</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold text-stone-900 mb-6">Choose a new password</h1>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">New password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-stone-700 mb-1">Confirm password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClass}
            placeholder="Repeat password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-brand-800">
            Prestolet
          </Link>
          <p className="mt-2 text-sm text-stone-500">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8">
          <Suspense fallback={<div className="text-sm text-stone-400">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-stone-500">
            <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700">
              &larr; Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
