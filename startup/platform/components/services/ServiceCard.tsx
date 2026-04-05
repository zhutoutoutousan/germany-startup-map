'use client'

import Link from 'next/link'
import { MapPin, Star, Phone, Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface ServiceProvider {
  id: string
  company_name: string
  company_name_zh?: string
  company_name_de?: string
  service_type: string
  description?: string
  description_zh?: string
  description_de?: string
  city: string
  phone?: string
  email?: string
  rating: number
  review_count: number
  verified: boolean
}

interface ServiceCardProps {
  service: ServiceProvider
}

export function ServiceCard({ service }: ServiceCardProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const getName = () => {
    if (locale === 'zh' && service.company_name_zh) return service.company_name_zh
    if (locale === 'de' && service.company_name_de) return service.company_name_de
    return service.company_name
  }

  const getDescription = () => {
    if (locale === 'zh' && service.description_zh) return service.description_zh
    if (locale === 'de' && service.description_de) return service.description_de
    return service.description
  }

  const serviceTypeLabels: Record<string, Record<string, string>> = {
    en: {
      legal: 'Legal Services',
      accounting: 'Accounting',
      real_estate: 'Real Estate',
      consulting: 'Consulting',
      supply_chain: 'Supply Chain',
      other: 'Other'
    },
    zh: {
      legal: '法律服务',
      accounting: '会计',
      real_estate: '房地产',
      consulting: '咨询',
      supply_chain: '供应链',
      other: '其他'
    },
    de: {
      legal: 'Rechtsdienstleistungen',
      accounting: 'Buchhaltung',
      real_estate: 'Immobilien',
      consulting: 'Beratung',
      supply_chain: 'Lieferkette',
      other: 'Sonstiges'
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-club-900/60 p-6 shadow-club transition hover:border-cyan-500/35 hover:shadow-neon-cyan">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-display text-xl font-semibold text-zinc-100">{getName()}</h3>
        {service.verified && (
          <span className="rounded border border-emerald-500/40 bg-emerald-950/60 px-2 py-1 font-club text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Verified
          </span>
        )}
      </div>
      <p className="mb-2 font-club text-xs uppercase tracking-wider text-cyan-400/90">
        {serviceTypeLabels[locale]?.[service.service_type] || service.service_type}
      </p>
      {getDescription() && (
        <p className="mb-4 line-clamp-2 text-sm text-zinc-400">{getDescription()}</p>
      )}
      <div className="mb-4 flex items-center">
        <Star size={16} className="mr-1 fill-neon-gold text-neon-gold" />
        <span className="font-semibold text-zinc-200">{service.rating.toFixed(1)}</span>
        <span className="ml-2 text-zinc-500">({service.review_count} reviews)</span>
      </div>
      <div className="mb-4 space-y-2 text-sm text-zinc-500">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-fuchsia-400/80" />
          <span className="text-zinc-300">{service.city}</span>
        </div>
        {service.phone && (
          <div className="flex items-center">
            <Phone size={16} className="mr-2 text-cyan-400/80" />
            <span>{service.phone}</span>
          </div>
        )}
        {service.email && (
          <div className="flex items-center">
            <Mail size={16} className="mr-2 text-cyan-400/80" />
            <span className="truncate">{service.email}</span>
          </div>
        )}
      </div>
      <Link
        href={`/${locale}/services/${service.id}`}
        className="inline-block font-club text-xs font-bold uppercase tracking-wider text-fuchsia-400 transition hover:text-cyan-300"
      >
        View Details →
      </Link>
    </div>
  )
}
