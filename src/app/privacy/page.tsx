import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Prestolet' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="text-sm text-brand-600 hover:text-brand-700 font-medium">&larr; Back to homepage</Link>

        <h1 className="text-3xl font-bold text-stone-900 mt-6 mb-2">Privacy Policy</h1>
        <p className="text-sm text-stone-400 mb-10">Last updated: September 2026</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">1. Who we are</h2>
            <p>Prestolet (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the prestolet.co.uk platform. We are the data controller for personal information collected through this website. Contact us at <a href="mailto:hello@prestolet.co.uk" className="text-brand-600 hover:text-brand-700">hello@prestolet.co.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">2. Information we collect</h2>
            <p>We collect the following information when you register or use our service:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Name and email address</li>
              <li>Phone number (if provided)</li>
              <li>Property details including address, photos, and expected nightly rate</li>
              <li>Account credentials (passwords are stored as one-way hashes — we cannot see your password)</li>
              <li>Usage data such as login timestamps</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">3. How we use your information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide and manage our property listing service</li>
              <li>Send transactional emails (account notifications, booking alerts)</li>
              <li>Coordinate cleaning services via SMS</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">4. Third-party services</h2>
            <p>We share data with the following third parties to operate our service:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Guesty</strong> — property listing management platform. Property details and addresses are transmitted to Guesty to create listings.</li>
              <li><strong>Twilio</strong> — SMS notifications for cleaning coordination.</li>
              <li><strong>Google (Gmail)</strong> — transactional email delivery.</li>
            </ul>
            <p className="mt-3">Each of these providers has their own privacy policy and processes data in accordance with GDPR where applicable.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">5. Data retention</h2>
            <p>We retain your account data for as long as your account is active. If you request deletion, we will remove your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">6. Your rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:hello@prestolet.co.uk" className="text-brand-600 hover:text-brand-700">hello@prestolet.co.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">7. Cookies</h2>
            <p>We use session cookies to keep you logged in. We do not use tracking or advertising cookies. No third-party analytics scripts are loaded on this site.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">8. Security</h2>
            <p>We use industry-standard security measures including encrypted HTTPS connections and hashed password storage. No system is completely secure, and we cannot guarantee the absolute security of your data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">9. Changes to this policy</h2>
            <p>We may update this policy from time to time. We will notify registered users by email of any material changes. The date at the top of this page indicates when it was last updated.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
