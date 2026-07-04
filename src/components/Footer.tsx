import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1 — Brand */}
          <div>
            <div className="mb-3">
              <Logo size="sm" inverted />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Effortless short-stay lettings management. We handle everything so you can focus on what matters.
            </p>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick links</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#services" className="text-slate-400 hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-slate-400 hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-slate-400 hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="mailto:hello@prestolet.co.uk" className="hover:text-white transition">
                  hello@prestolet.co.uk
                </a>
              </li>
              <li>Operating across the UK</li>
              <li>
                <a href="https://prestolet.co.uk" className="hover:text-white transition">
                  prestolet.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-sm text-slate-500 text-center">
          &copy; 2025 Prestolet Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
