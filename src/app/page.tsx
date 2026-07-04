import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Prestolet — Effortless Short-Stay Lettings Management',
  description:
    'Prestolet is a dedicated short-stay lettings management company focused on enhancing your rental experience, ensuring an effortless, hands-free approach to lettings.',
  keywords: [
    'short-stay lettings',
    'property management UK',
    'Airbnb management',
    'holiday let management',
    'serviced accommodation',
    'Prestolet',
  ],
  openGraph: {
    title: 'Prestolet — Effortless Short-Stay Lettings Management',
    description:
      'List your property across Airbnb, Booking.com, Vrbo and more — managed from one place. Real-time insights. Coordinated cleaning. Maximum returns.',
    url: 'https://prestolet.co.uk',
    type: 'website',
  },
}

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
    title: 'Multi-Channel Listings',
    copy: 'One submission, listed everywhere. We sync your calendar across all major platforms automatically.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    title: 'Dynamic Pricing',
    copy: 'AI-powered pricing adjusts nightly rates to maximise your occupancy and revenue.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: 'Booking Management',
    copy: 'We handle every enquiry, confirmation, and guest communication on your behalf.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: 'Cleaning Coordination',
    copy: 'Our vetted cleaner network is notified of every checkout and confirms availability instantly.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    title: 'Property Inspections',
    copy: 'Regular property checks ensure your listing maintains its reputation and standards.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'Owner Dashboard',
    copy: 'Real-time revenue, occupancy rates, and pricing effectiveness — always in your pocket.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Submit your property',
    copy: 'Fill in details, upload photos, and set your expected rate. Our team reviews and prepares your listing.',
  },
  {
    number: '02',
    title: 'We handle everything',
    copy: 'We push your listing across all major platforms, manage bookings, coordinate cleaning, and communicate with guests.',
  },
  {
    number: '03',
    title: 'Collect your earnings',
    copy: 'Track revenue, occupancy rates, and pricing effectiveness in your personal dashboard — updated in real time.',
  },
]

export default function HomePage() {
  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="max-w-3xl">
              <span className="inline-block text-brand-300 text-sm font-semibold tracking-widest uppercase mb-6">
                Short-Stay Lettings Management
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Effortless Short-Stay Lettings Management
              </h1>
              <p className="text-lg sm:text-xl text-brand-100 leading-relaxed mb-10 max-w-2xl">
                List your property across Airbnb, Booking.com, Vrbo and more — managed from one place.
                Real-time insights. Coordinated cleaning. Maximum returns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition shadow-lg"
                >
                  List your property &rarr;
                </Link>
                <Link
                  href="/#who-we-are"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="bg-white py-10 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Trusted listings across leading platforms
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
              {['Airbnb', 'Booking.com', 'Vrbo', 'Expedia', 'TripAdvisor'].map((platform) => (
                <span
                  key={platform}
                  className="text-gray-500 font-semibold text-sm sm:text-base px-4 py-2 rounded-full bg-gray-50 border border-gray-200"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who We Are ── */}
        <section id="who-we-are" className="bg-brand-50 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div>
                <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Who We Are</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  A dedicated partner for your property
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                  Prestolet is a dedicated short-stay lettings management company focused on enhancing your rental
                  experience, ensuring an effortless, hands-free approach to lettings.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  We handle everything from managing bookings and coordinating cleaning to conducting inspections and
                  arranging maintenance. With us, clients can maximise occupancy and profit effortlessly.
                </p>
                <Link
                  href="/auth/register"
                  className="mt-8 inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition"
                >
                  Get started today
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Visual — property card mockup */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm">
                  <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-900">The Lakeside Retreat</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Revenue to date</span>
                            <span className="font-semibold text-gray-800">£4,820</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Occupancy rate</span>
                            <span className="font-semibold text-gray-800">84.2%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Avg nightly rate</span>
                            <span className="font-semibold text-gray-800">£127</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-1">
                          {['Airbnb', 'Booking.com', 'Vrbo'].map((p) => (
                            <span key={p} className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full border border-brand-100">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section id="services" className="bg-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">What We Do</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Everything your property needs</h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                From listing to maintenance, we cover the full lifecycle of short-stay lettings management.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-brand-200 transition"
                >
                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition">
                    {service.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{service.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="bg-brand-50 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">The Process</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                Getting started takes minutes. We do the rest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="text-6xl font-black text-brand-100 mb-4 leading-none">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition shadow-md"
              >
                List your property today
              </Link>
            </div>
          </div>
        </section>

        {/* ── Cleaner Network ── */}
        <section id="cleaners" className="bg-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* Text */}
              <div>
                <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Cleaning Coordination</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Seamless Cleaning Coordination
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  The moment a guest checks out, our vetted cleaner network is notified automatically via SMS. Cleaners
                  confirm their availability in seconds — no phone calls, no chasing.
                </p>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Property owners can see cleaner confirmation status directly in their dashboard — every booking,
                  every time.
                </p>
                <ul className="space-y-3">
                  {[
                    'Instant SMS notifications to available cleaners',
                    'Cleaners reply YES/NO — confirmation tracked automatically',
                    'Full calendar visibility for scheduling',
                    'Coverage area matching for nearby jobs',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* SMS mockup */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-72">
                  <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
                    <div className="bg-gray-800 rounded-2xl overflow-hidden">
                      {/* Phone top bar */}
                      <div className="bg-gray-900 px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <div>
                          <p className="text-white text-xs font-semibold">Prestolet</p>
                          <p className="text-gray-400 text-[10px]">+44 7700 900123</p>
                        </div>
                      </div>

                      <div className="px-4 py-5 space-y-3 bg-gray-50">
                        {/* Incoming message */}
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
                            <p className="text-xs text-gray-800 leading-relaxed">
                              Hi Sarah, a cleaning job is available at The Lakeside Retreat.
                              <br /><br />
                              Guest checks out: 15 Jul 2025.
                              <br /><br />
                              Reply <strong>YES</strong> to confirm or <strong>NO</strong> to decline.
                              <br />
                              – Prestolet
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">09:14</p>
                          </div>
                        </div>

                        {/* Reply */}
                        <div className="flex justify-end">
                          <div className="bg-brand-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[60%] shadow-sm">
                            <p className="text-xs text-white font-semibold">YES</p>
                            <p className="text-[10px] text-brand-200 mt-1 text-right">09:15 ✓✓</p>
                          </div>
                        </div>

                        {/* Confirmation */}
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
                            <p className="text-xs text-gray-800">
                              Confirmed! You&apos;re booked in for 15 Jul. Details sent to your email.
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">09:15</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Glamping Teaser ── */}
        <section className="bg-slate-800 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Coming Soon
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
              Glamping Ventures
            </h2>
            <p className="text-slate-300 leading-relaxed mb-3 text-lg">
              We&apos;re actively seeking unused land to develop premium glamping facilities — turning
              underutilised plots into profitable retreats.
            </p>
            <p className="text-slate-400 mb-8">
              Whether you own farmland, a field, or a woodland — we may be interested.
            </p>
            <a
              href="mailto:hello@prestolet.co.uk?subject=Land enquiry"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-slate-500 text-white rounded-xl hover:border-white hover:bg-white/5 transition font-medium"
            >
              Interested in land? Get in touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-brand-600 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to maximise your property&apos;s potential?
            </h2>
            <p className="text-brand-100 text-lg mb-10 leading-relaxed">
              Join property owners already earning more with Prestolet&apos;s hands-free lettings management.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition shadow-lg text-lg"
            >
              Get started today
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
