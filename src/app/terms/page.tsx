import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Prestolet' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="text-sm text-brand-600 hover:text-brand-700 font-medium">&larr; Back to homepage</Link>

        <h1 className="text-3xl font-bold text-stone-900 mt-6 mb-2">Terms of Service</h1>
        <p className="text-sm text-stone-400 mb-10">Last updated: September 2026</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">1. About Prestolet</h2>
            <p>Prestolet (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a property management service that helps property owners list and manage short-stay lettings across multiple booking platforms. By registering an account or submitting a property, you agree to these terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">2. Eligibility</h2>
            <p>You must be at least 18 years old and legally authorised to let the property you submit. By using our service, you confirm that you have the right to let your property under any applicable tenancy agreement, mortgage terms, and local regulations.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">3. Our services</h2>
            <p>We provide property listing management, multi-channel distribution via our platform partner (Guesty), cleaner coordination, and a customer dashboard. We do not act as a landlord, tenant, or party to any rental agreement between you and your guests.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">4. Property submissions</h2>
            <p>When you submit a property, you warrant that all information provided is accurate and that you own or are authorised to let the property. We reserve the right to reject any submission without giving a reason. Approved properties are listed at our discretion and may be removed if they breach these terms or any platform policies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">5. Fees and payments</h2>
            <p>Our pricing and commission structure will be communicated to you separately. We reserve the right to update our fees with reasonable notice. Any payments due to you from bookings are subject to the terms of the relevant booking platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">6. Your responsibilities</h2>
            <p>You are responsible for ensuring your property complies with all applicable laws, including health and safety regulations, gas and electrical safety certificates, and any local short-let licensing requirements. You must maintain appropriate insurance for short-term lettings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">7. Limitation of liability</h2>
            <p>To the fullest extent permitted by law, Prestolet shall not be liable for any indirect, incidental, or consequential loss arising from use of our service, including any loss of bookings, revenue, or data. Our total liability shall not exceed the fees paid by you in the three months preceding any claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">8. Termination</h2>
            <p>Either party may terminate the relationship with 30 days&apos; written notice. We may terminate immediately if you breach these terms or engage in fraudulent or harmful conduct.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">9. Changes to these terms</h2>
            <p>We may update these terms from time to time. We will notify registered users by email. Continued use of the service after changes take effect constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">10. Governing law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">11. Contact</h2>
            <p>For any questions about these terms, please contact us at <a href="mailto:hello@prestolet.co.uk" className="text-brand-600 hover:text-brand-700">hello@prestolet.co.uk</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
