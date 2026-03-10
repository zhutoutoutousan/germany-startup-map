'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

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
    { href: '/services', label: t('nav.services') },
    { href: '/real-estate', label: t('nav.realEstate') },
    { href: '/resources', label: t('nav.resources') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${getLocale()}`} className="text-2xl font-bold text-primary-600">
            Germany Startup Map
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${getLocale()}${item.href}`}
                className={`hover:text-primary-600 transition ${
                  pathname === `/${getLocale()}${item.href}` ? 'text-primary-600 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 hover:text-primary-600"
              >
                <Globe size={20} />
                <span className="uppercase">{getLocale()}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('zh')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    中文
                  </button>
                  <button
                    onClick={() => changeLanguage('de')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Deutsch
                  </button>
                </div>
              )}
            </div>

            <Link
              href={`/${getLocale()}/auth/login`}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
            >
              {t('common.login')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${getLocale()}${item.href}`}
                className="block py-2 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${getLocale()}/auth/login`}
              className="block mt-4 px-4 py-2 bg-primary-600 text-white rounded text-center"
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
