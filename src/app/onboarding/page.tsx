export default function OnboardingPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a property</h1>
      <p className="text-gray-500 mb-8">
        Fill in your property details and we'll get it listed across all major booking platforms.
      </p>

      <form action="/api/properties" method="POST" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property name</label>
          <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full address</label>
          <input name="address" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
          <input name="postcode" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input name="bedrooms" type="number" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input name="bathrooms" type="number" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected nightly rate (£)</label>
          <input name="expectedRate" type="number" min="1" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property type</label>
          <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option>House</option>
            <option>Flat</option>
            <option>Cottage</option>
            <option>Lodge</option>
            <option>Glamping Pod</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition font-medium"
        >
          Submit property
        </button>
      </form>
    </main>
  )
}
