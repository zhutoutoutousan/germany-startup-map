'use client'

import { useEffect, useMemo, useRef } from 'react'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  description?: string
}

const GERMANY_CENTER: [number, number] = [51.1657, 10.4515]
const GERMANY_ZOOM = 6

interface MapProps {
  markers?: MapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  className?: string
}

type LeafletMap = import('leaflet').Map
type LeafletNs = typeof import('leaflet')

/** Leaflet + OpenStreetMap — loaded only in the browser (no SSR `window`). */
export function Map({
  markers = [],
  center,
  zoom = 10,
  height = '400px',
  className = '',
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)

  const markersKey = useMemo(
    () => markers.map((m) => `${m.id}:${m.lat}:${m.lng}`).join('|'),
    [markers]
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    ;(async () => {
      const leafletMod = await import('leaflet')
      const L = (leafletMod as { default: LeafletNs }).default
      await import('leaflet/dist/leaflet.css')

      if (cancelled || !containerRef.current) return

      fixLeafletDefaultIcons(L)

      const defaultCenter: [number, number] = center
        ? [center.lat, center.lng]
        : GERMANY_CENTER

      const initialZoom = markers.length > 0 ? zoom : GERMANY_ZOOM

      const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView(
        defaultCenter,
        initialZoom
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      markers.forEach((marker) => {
        const popupContent = `
        <div style="padding:8px;font-family:system-ui,sans-serif;">
          <strong>${escapeHtml(marker.title)}</strong>
          ${marker.description ? `<p style="margin:4px 0 0;font-size:12px;color:#444;">${escapeHtml(marker.description)}</p>` : ''}
        </div>`
        L.marker([marker.lat, marker.lng]).addTo(map).bindPopup(popupContent)
      })

      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]))
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 })
      } else if (!center) {
        map.setView(GERMANY_CENTER, GERMANY_ZOOM)
      }

      if (cancelled) {
        map.remove()
        return
      }

      mapRef.current = map
      requestAnimationFrame(() => map.invalidateSize())
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [markersKey, markers, center, zoom])

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', minHeight: 200 }}
      className={`z-0 rounded-md border border-cyan-500/25 bg-club-950 ${className}`}
    />
  )
}

function fixLeafletDefaultIcons(L: LeafletNs) {
  const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: string }
  delete proto._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
