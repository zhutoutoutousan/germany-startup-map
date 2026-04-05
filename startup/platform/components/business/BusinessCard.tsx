'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface Business {
  id: string
  name: string
  name_zh?: string
  name_de?: string
  description?: string
  description_zh?: string
  description_de?: string
  business_type: string
  city: string
  phone?: string
  email?: string
  website?: string
}

interface BusinessCardProps {
  business: Business
}

export function BusinessCard({ business }: BusinessCardProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const getName = () => {
    if (locale === 'zh' && business.name_zh) return business.name_zh
    if (locale === 'de' && business.name_de) return business.name_de
    return business.name
  }

  const getDescription = () => {
    if (locale === 'zh' && business.description_zh) return business.description_zh
    if (locale === 'de' && business.description_de) return business.description_de
    return business.description
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-club-900/60 p-6 shadow-club transition hover:border-fuchsia-500/40 hover:shadow-neon-fuchsia">
      <h3 className="mb-2 font-display text-xl font-semibold text-zinc-100">{getName()}</h3>
      {getDescription() && (
        <p className="mb-4 line-clamp-2 text-sm text-zinc-400">{getDescription()}</p>
      )}
      <div className="space-y-2 text-sm text-zinc-500">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-fuchsia-400/80" />
          <span className="text-zinc-300">{business.city}</span>
        </div>
        {business.phone && (
          <div className="flex items-center">
            <Phone size={16} className="mr-2 text-cyan-400/80" />
            <span>{business.phone}</span>
          </div>
        )}
        {business.email && (
          <div className="flex items-center">
            <Mail size={16} className="mr-2 text-cyan-400/80" />
            <span className="truncate">{business.email}</span>
          </div>
        )}
        {business.website && (
          <div className="flex items-center">
            <Globe size={16} className="mr-2 text-cyan-400/80" />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-cyan-400 hover:text-fuchsia-300 hover:underline"
            >
              {business.website}
            </a>
          </div>
        )}
      </div>
      <Link
        href={`/${locale}/businesses/${business.id}`}
        className="mt-4 inline-block font-club text-xs font-bold uppercase tracking-wider text-fuchsia-400 transition hover:text-cyan-300"
      >
        View Details →
      </Link>
    </div>
  )
}
