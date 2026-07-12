'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<'CUSTOMER' | 'CLEANER'>('CUSTOMER')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Registration failed. Please try again.')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)

    if (result?.error) {
      setError('Account created but sign-in failed. Please sign in manually.')
      router.push('/auth/login')
    } else {
      router.push('/dashboard')
    }
  }

  const inputClass = 'w-full border border-cream-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-cream-50'

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-brand-800">
            Prestolet
          </Link>
          <p className="mt-2 text-sm text-stone-500">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8">
          <h1 className="text-xl font-bold text-stone-900 mb-6">Get started</h1>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition ${
                    role === 'CUSTOMER'
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-cream-300 text-stone-600 hover:border-brand-400 bg-cream-50'
                  }`}
                >
                  Property Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('CLEANER')}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition ${
                    role === 'CLEANER'
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-cream-300 text-stone-600 hover:border-brand-400 bg-cream-50'
                  }`}
                >
                  Cleaning Professional
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Full name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                required autoComplete="name" className={inputClass} placeholder="Jane Smith" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email" className={inputClass} placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="new-password" minLength={8} className={inputClass} placeholder="Min. 8 characters" />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-stone-700 mb-1">Confirm password</label>
              <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required autoComplete="new-password" className={inputClass} placeholder="Repeat password" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          <Link href="/" className="hover:text-stone-600">&larr; Back to homepage</Link>
        </p>
      </div>
    </div>
  )
}
