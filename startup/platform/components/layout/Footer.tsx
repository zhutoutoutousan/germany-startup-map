'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/components/ui/Link'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="relative mt-auto border-t border-fuchsia-500/25 bg-club-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="disco-floor absolute inset-0 opacity-40" aria-hidden />
      <div className="relative container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-neon-gold">
              德國 · Startup Map
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Your guide to starting and running a business in Germany — maps, listings, and
              resources in one place.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-club text-[10px] font-bold uppercase tracking-[0.35em] text-fuchsia-400/90">
              Quick links
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/businesses" className="transition hover:text-cyan-300">
                  {t('nav.businesses')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-cyan-300">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="transition hover:text-cyan-300">
                  {t('nav.realEstate')}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="transition hover:text-cyan-300">
                  {t('nav.resources')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-club text-[10px] font-bold uppercase tracking-[0.35em] text-fuchsia-400/90">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/contact" className="transition hover:text-cyan-300">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-cyan-300">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-club text-[10px] font-bold uppercase tracking-[0.35em] text-fuchsia-400/90">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/privacy" className="transition hover:text-cyan-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-cyan-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-800 pt-8 text-center font-club text-[10px] uppercase tracking-widest text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Germany Startup Map</p>
        </div>
      </div>
    </footer>
  )
}
