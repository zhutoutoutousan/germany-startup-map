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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <h3 className="text-xl font-semibold mb-2">{getName()}</h3>
      {getDescription() && (
        <p className="text-gray-600 mb-4 line-clamp-2">{getDescription()}</p>
      )}
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2" />
          <span>{business.city}</span>
        </div>
        {business.phone && (
          <div className="flex items-center">
            <Phone size={16} className="mr-2" />
            <span>{business.phone}</span>
          </div>
        )}
        {business.email && (
          <div className="flex items-center">
            <Mail size={16} className="mr-2" />
            <span className="truncate">{business.email}</span>
          </div>
        )}
        {business.website && (
          <div className="flex items-center">
            <Globe size={16} className="mr-2" />
            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">
              {business.website}
            </a>
          </div>
        )}
      </div>
      <Link
        href={`/${locale}/businesses/${business.id}`}
        className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-semibold"
      >
        View Details →
      </Link>
    </div>
  )
}
