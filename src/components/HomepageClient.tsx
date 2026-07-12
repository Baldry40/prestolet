'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion'

// ── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

// ── Reusable AnimatedSection ────────────────────────────────────────────────

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Counter component ───────────────────────────────────────────────────────

function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = to / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ── Services data ───────────────────────────────────────────────────────────

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

const platforms = [
  'Airbnb', 'Booking.com', 'Vrbo', 'Expedia', 'TripAdvisor', 'HomeAway', 'Sykes Cottages',
  'Airbnb', 'Booking.com', 'Vrbo', 'Expedia', 'TripAdvisor', 'HomeAway', 'Sykes Cottages',
]

const smsMessages = [
  {
    side: 'left' as const,
    text: (
      <>
        Hi Sarah, a cleaning job is available at The Lakeside Retreat.
        <br /><br />
        Guest checks out: 15 Jul 2025.
        <br /><br />
        Reply <strong>YES</strong> to confirm or <strong>NO</strong> to decline.
        <br />
        – Prestolet
      </>
    ),
    time: '09:14',
  },
  { side: 'right' as const, text: 'YES', time: '09:15 ✓✓' },
  {
    side: 'left' as const,
    text: "Confirmed! You're booked in for 15 Jul. Details sent to your email.",
    time: '09:15',
  },
]

// ── Main export ─────────────────────────────────────────────────────────────

export default function HomepageClient() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay — light at top, slightly deeper at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/55" />
        </div>

        {/* Centred content */}
        <div className="relative text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-7xl sm:text-9xl lg:text-[11rem] font-bold text-white leading-none tracking-tight drop-shadow-2xl mb-5"
          >
            Prestolet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="text-white/85 text-base sm:text-xl font-light tracking-[0.25em] uppercase mb-10"
          >
            Effortless Short-Stay Lettings Management
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-800 font-bold rounded-xl hover:bg-cream-100 transition shadow-xl text-base"
            >
              List your property &rarr;
            </Link>
            <Link
              href="/#who-we-are"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition text-base backdrop-blur-sm"
            >
              How it works
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── MARQUEE BAR ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-cream-50 border-y border-cream-200 py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {platforms.map((p, i) => (
            <span key={i} className="mx-8 text-brand-600/60 font-semibold text-sm uppercase tracking-widest">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── WHO WE ARE ────────────────────────────────────────────────────── */}
      <section id="who-we-are" className="bg-cream-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={slideLeft}
            >
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Who We Are</span>
              <h2 className="mt-3 text-4xl font-black text-brand-900 leading-tight mb-6">
                A dedicated partner for your property
              </h2>
              <p className="text-stone-600 leading-relaxed mb-5 text-lg">
                Prestolet is a dedicated short-stay lettings management company focused on enhancing your rental
                experience, ensuring an effortless, hands-free approach to lettings.
              </p>
              <p className="text-stone-600 leading-relaxed text-lg mb-8">
                We handle everything from managing bookings and coordinating cleaning to conducting inspections and
                arranging maintenance. With us, clients can maximise occupancy and profit effortlessly.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { value: '200+', label: 'Properties' },
                  { value: '8+', label: 'Platforms' },
                  { value: '84%', label: 'Avg Occupancy' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-brand-600">{stat.value}</p>
                    <p className="text-sm text-stone-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition"
              >
                Get started today
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Right — animated dashboard card */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={slideRight}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-stone-800">The Lakeside Retreat</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-400">Revenue to date</span>
                          <span className="font-semibold text-stone-700">£4,820</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-400">Occupancy rate</span>
                          <span className="font-semibold text-stone-700">84.2%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-400">Avg nightly rate</span>
                          <span className="font-semibold text-stone-700">£127</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-1 flex-wrap">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <section className="bg-brand-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center"
          >
            {[
              { to: 200, suffix: '+', prefix: '', label: 'Properties Listed' },
              { to: 8, suffix: '+', prefix: '', label: 'UK Platforms' },
              { to: 84, suffix: '%', prefix: '', label: 'Avg Occupancy' },
              { to: 2, suffix: 'M+', prefix: '£', label: 'Revenue Generated' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <p className="text-5xl font-black text-cream-100 mb-2">
                  <Counter to={stat.to} suffix={stat.suffix} prefix={stat.prefix} />
                </p>
                <p className="text-brand-200 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section id="services" className="bg-cream-100 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">What We Do</span>
            <h2 className="mt-3 text-4xl font-black text-brand-900">Everything your property needs</h2>
            <p className="mt-4 text-stone-500 max-w-xl mx-auto">
              From listing to maintenance, we cover the full lifecycle of short-stay lettings management.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-400 to-brand-600" />
                <div className="p-7">
                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-5">
                    {service.icon}
                  </div>
                  <h3 className="text-base font-bold text-stone-800 mb-2">{service.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{service.copy}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">The Process</span>
            <h2 className="mt-3 text-4xl font-black text-brand-900">How It Works</h2>
            <p className="mt-4 text-stone-500 max-w-xl mx-auto">Getting started takes minutes. We do the rest.</p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {steps.map((step, index) => (
              <motion.div key={step.number} variants={fadeUp} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full z-0 px-4">
                    <motion.div
                      className="h-px bg-gradient-to-r from-brand-300 to-brand-100"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
                    />
                  </div>
                )}
                <div className="text-8xl font-black text-brand-100 mb-4 leading-none">{step.number}</div>
                <h3 className="text-xl font-bold text-brand-900 mb-3">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed">{step.copy}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition shadow-md"
            >
              List your property today
            </Link>
          </div>
        </div>
      </section>

      {/* ── CLEANER SECTION ───────────────────────────────────────────────── */}
      <section id="cleaners" className="bg-cream-100 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={slideLeft}
            >
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Cleaning Coordination</span>
              <h2 className="mt-3 text-4xl font-black text-brand-900 mb-6">
                Seamless Cleaning Coordination
              </h2>
              <p className="text-stone-600 leading-relaxed mb-5">
                The moment a guest checks out, our vetted cleaner network is notified automatically via SMS. Cleaners
                confirm their availability in seconds — no phone calls, no chasing.
              </p>
              <p className="text-stone-600 leading-relaxed mb-5">
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
                  <li key={point} className="flex items-start gap-3 text-sm text-stone-600">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Phone mockup with animated messages */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={slideRight}
              className="flex justify-center lg:justify-end"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GLAMPING TEASER ───────────────────────────────────────────────── */}
      <section className="bg-brand-900 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <motion.span
              className="inline-block text-sm font-semibold text-brand-300 uppercase tracking-widest mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              Coming Soon
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Glamping Ventures
            </h2>
            <p className="text-brand-200 leading-relaxed mb-3 text-xl">
              We&apos;re actively seeking unused land to develop premium glamping facilities — turning
              underutilised plots into profitable retreats.
            </p>
            <p className="text-brand-300 mb-10 text-lg">
              Whether you own farmland, a field, or a woodland — we may be interested.
            </p>
            <a
              href="mailto:hello@prestolet.co.uk?subject=Land enquiry"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-500 text-white rounded-xl hover:border-brand-300 hover:bg-white/5 transition font-medium text-base"
            >
              Interested in land? Get in touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Ready to maximise your property&apos;s potential?
            </h2>
            <p className="text-brand-100 text-xl mb-10 leading-relaxed">
              Join property owners already earning more with Prestolet&apos;s hands-free lettings management.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brand-700 font-black rounded-xl hover:bg-cream-100 transition shadow-2xl text-lg"
              >
                Get started today
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

// ── Phone mockup sub-component ──────────────────────────────────────────────

function PhoneMockup() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    smsMessages.forEach((_, i) => {
      const timer = setTimeout(() => setVisibleCount(i + 1), i * 700 + 400)
      return () => clearTimeout(timer)
    })
  }, [inView])

  return (
    <div ref={ref} className="w-72">
      <div className="bg-brand-900 rounded-3xl p-4 shadow-2xl">
        <div className="bg-brand-800 rounded-2xl overflow-hidden">
          {/* Phone top bar */}
          <div className="bg-brand-900 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Prestolet</p>
              <p className="text-brand-300 text-[10px]">+44 7700 900123</p>
            </div>
          </div>

          <div className="px-4 py-5 space-y-3 bg-cream-50 min-h-[220px]">
            <AnimatePresence>
              {smsMessages.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                      msg.side === 'right'
                        ? 'bg-brand-600 rounded-tr-sm'
                        : 'bg-white rounded-tl-sm'
                    }`}
                  >
                    <p className={`text-xs leading-relaxed ${msg.side === 'right' ? 'text-white font-semibold' : 'text-stone-800'}`}>
                      {msg.text}
                    </p>
                    <p className={`text-[10px] mt-1 text-right ${msg.side === 'right' ? 'text-brand-200' : 'text-stone-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
