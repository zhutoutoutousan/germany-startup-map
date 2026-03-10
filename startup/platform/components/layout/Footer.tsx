'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Germany Startup Map</h3>
            <p className="text-gray-400">
              Your comprehensive guide to starting a business in Germany
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/businesses" className="hover:text-white">{t('nav.businesses')}</Link></li>
              <li><Link href="/services" className="hover:text-white">{t('nav.services')}</Link></li>
              <li><Link href="/real-estate" className="hover:text-white">{t('nav.realEstate')}</Link></li>
              <li><Link href="/resources" className="hover:text-white">{t('nav.resources')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white">{t('nav.contact')}</Link></li>
              <li><Link href="/about" className="hover:text-white">{t('nav.about')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Germany Startup Map. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
