'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PROPERTY_TYPES = ['House', 'Flat', 'Cottage', 'Lodge', 'Glamping Pod', 'Other']

export default function OnboardingPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [type, setType] = useState('House')
  const [bedrooms, setBedrooms] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [expectedRate, setExpectedRate] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<string[]>([''])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setPhoto(index: number, value: string) {
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function addPhotoField() {
    if (photos.length < 5) setPhotos((prev) => [...prev, ''])
  }

  function removePhotoField(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const filteredPhotos = photos.filter((url) => url.trim() !== '')

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        address,
        postcode,
        type,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        expectedRate: parseFloat(expectedRate),
        description,
        photos: filteredPhotos,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Submission failed. Please try again.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-brand-700">Prestolet</Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-700 transition">
            &larr; Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add a property</h1>
          <p className="text-gray-500 mt-1">
            Fill in your property details and we&apos;ll get it listed across Airbnb, Booking.com, Vrbo and more.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic details */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Basic details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. The Lakeside Retreat"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="e.g. 12 Lake Road, Windermere, Cumbria"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  required
                  placeholder="e.g. LA23 1BJ"
                  className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition uppercase"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Pricing</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected nightly rate (£)
              </label>
              <div className="relative w-full sm:w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  value={expectedRate}
                  onChange={(e) => setExpectedRate(e.target.value)}
                  required
                  placeholder="120.00"
                  className="w-full pl-7 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                This is your base rate — dynamic pricing may adjust it to optimise occupancy.
              </p>
            </div>
          </section>

          {/* Description */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Tell guests what makes your property special…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-y"
            />
          </section>

          {/* Photos */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Photos</h2>
            <p className="text-sm text-gray-500 mb-5">
              Add up to 5 photo URLs. We recommend high-quality landscape images.
            </p>
            <div className="space-y-3">
              {photos.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setPhoto(i, e.target.value)}
                    placeholder={`Photo ${i + 1} URL`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhotoField(i)}
                      className="px-3 py-2 text-gray-400 hover:text-red-500 transition"
                      aria-label="Remove photo"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {photos.length < 5 && (
              <button
                type="button"
                onClick={addPhotoField}
                className="mt-3 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + Add another photo
              </button>
            )}
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3.5 rounded-xl hover:bg-brand-700 transition font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? 'Submitting your property…' : 'Submit property for listing'}
          </button>
        </form>
      </main>
    </div>
  )
}
