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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{getName()}</h3>
        {service.verified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
        )}
      </div>
      <p className="text-sm text-primary-600 mb-2">
        {serviceTypeLabels[locale]?.[service.service_type] || service.service_type}
      </p>
      {getDescription() && (
        <p className="text-gray-600 mb-4 line-clamp-2">{getDescription()}</p>
      )}
      <div className="flex items-center mb-4">
        <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
        <span className="font-semibold">{service.rating.toFixed(1)}</span>
        <span className="text-gray-500 ml-2">({service.review_count} reviews)</span>
      </div>
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2" />
          <span>{service.city}</span>
        </div>
        {service.phone && (
          <div className="flex items-center">
            <Phone size={16} className="mr-2" />
            <span>{service.phone}</span>
          </div>
        )}
        {service.email && (
          <div className="flex items-center">
            <Mail size={16} className="mr-2" />
            <span className="truncate">{service.email}</span>
          </div>
        )}
      </div>
      <Link
        href={`/${locale}/services/${service.id}`}
        className="inline-block text-primary-600 hover:text-primary-700 font-semibold"
      >
        View Details →
      </Link>
    </div>
  )
}
