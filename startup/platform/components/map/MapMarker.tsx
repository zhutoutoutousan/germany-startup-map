'use client'

import { MapPin } from 'lucide-react'

interface MapMarkerProps {
  lat: number
  lng: number
  title: string
  description?: string
  onClick?: () => void
}

export function MapMarker({ lat, lng, title, description, onClick }: MapMarkerProps) {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
      style={{ left: '50%', top: '50%' }}
      onClick={onClick}
    >
      <MapPin className="w-6 h-6 text-primary-600 fill-primary-600" />
      {title && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded shadow-lg p-2 text-sm whitespace-nowrap">
          <div className="font-semibold">{title}</div>
          {description && <div className="text-gray-600 text-xs">{description}</div>}
        </div>
      )}
    </div>
  )
}
