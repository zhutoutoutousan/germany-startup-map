'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  const getLocale = () => {
    const segments = pathname.split('/')
    return segments[1] || 'en'
  }

  const changeLanguage = (locale: string) => {
    const currentPath = pathname.replace(/^\/[^/]+/, '')
    router.push(`/${locale}${currentPath}`)
    setIsLangMenuOpen(false)
  }

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/businesses', label: t('nav.businesses') },
    { href: '/community', label: t('nav.community') },
    { href: '/founders', label: t('nav.founders') },
    { href: '/messages', label: t('nav.messages') },
    { href: '/services', label: t('nav.services') },
    { href: '/real-estate', label: t('nav.realEstate') },
    { href: '/resources', label: t('nav.resources') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <nav className="relative z-[100] border-b border-cyan-500/20 bg-club-950/90 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-[3.75rem] items-center justify-between">
          <Link
            href={`/${getLocale()}`}
            className="flex flex-wrap items-baseline gap-x-2 gap-y-0"
          >
            <span className="font-display text-lg font-semibold text-neon-gold md:text-xl">
              德國
            </span>
            <span className="text-fuchsia-400/70" aria-hidden>
              ·
            </span>
            <span className="font-club text-sm font-bold uppercase tracking-[0.2em] text-zinc-100 md:text-base md:tracking-[0.28em]">
              Startup Map
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${getLocale()}${item.href}`}
                className={`rounded-sm px-3 py-2 font-club text-xs font-semibold uppercase tracking-wider transition ${
                  pathname === `/${getLocale()}${item.href}`
                    ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]'
                    : 'text-zinc-400 hover:text-fuchsia-300'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="relative z-[110]">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 rounded-sm px-2 py-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-cyan-300"
              >
                <Globe size={18} />
                <span className="font-club text-xs uppercase">{getLocale()}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full z-[120] mt-2 w-40 rounded-sm border border-fuchsia-500/30 bg-club-900 py-1 shadow-neon-fuchsia">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('zh')}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                  >
                    中文
                  </button>
                  <button
                    onClick={() => changeLanguage('de')}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                  >
                    Deutsch
                  </button>
                </div>
              )}
            </div>

            <Link
              href={`/${getLocale()}/auth/login`}
              className="rounded-sm bg-gradient-to-r from-fuchsia-600 to-cyan-600 px-4 py-2 font-club text-xs font-bold uppercase tracking-wide text-white shadow-neon-fuchsia transition hover:from-fuchsia-500 hover:to-cyan-500"
            >
              {t('common.login')}
            </Link>
          </div>

          <button
            className="text-cyan-300 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-cyan-500/15 py-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${getLocale()}${item.href}`}
                className="block rounded-sm py-2 font-club text-sm uppercase tracking-wide text-zinc-300 hover:bg-white/5 hover:text-fuchsia-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${getLocale()}/auth/login`}
              className="mt-4 block rounded-sm bg-gradient-to-r from-fuchsia-600 to-cyan-600 py-2 text-center font-club text-sm font-bold uppercase text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.login')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
