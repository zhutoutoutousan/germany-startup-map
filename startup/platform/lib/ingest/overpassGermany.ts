/**
 * Fetch public POIs from OpenStreetMap via Overpass API (free, attribution required).
 * @see https://wiki.openstreetmap.org/wiki/Overpass_API
 */

export type BusinessRow = {
  name: string
  description: string
  business_type: 'restaurant' | 'retail' | 'ecommerce' | 'service' | 'other'
  city: string
  address: string | null
  latitude: number
  longitude: number
  status: 'active'
  featured: boolean
  user_id: null
  external_source: 'openstreetmap'
  external_id: string
  country: string
}

/** Public instances — rotate on timeout/overload (see Overpass usage policy). */
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
] as const

/** Small bounding boxes — keeps queries light for public Overpass instances. */
const REGIONS = [
  { city: 'Berlin', south: 52.45, west: 13.28, north: 52.58, east: 13.55 },
  { city: 'Hamburg', south: 53.52, west: 9.92, north: 53.6, east: 10.08 },
  { city: 'München', south: 48.08, west: 11.48, north: 48.18, east: 11.62 },
] as const

const MAX_PER_REGION = 55

function buildQuery(south: number, west: number, north: number, east: number, limit: number) {
  return `
[out:json][timeout:45];
(
  node["shop"](${south},${west},${north},${east});
  node["amenity"~"restaurant|fast_food|cafe|bar"](${south},${west},${north},${east});
  node["office"](${south},${west},${north},${east});
  node["amenity"="coworking"](${south},${west},${north},${east});
);
out body ${limit};
`.trim()
}

function tagsToBusinessType(tags: Record<string, string>): BusinessRow['business_type'] {
  if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food' || tags.amenity === 'cafe' || tags.amenity === 'bar')
    return 'restaurant'
  if (tags.shop) return 'retail'
  if (tags.office || tags.amenity === 'coworking') return 'service'
  return 'other'
}

function elementToRow(
  el: { type: string; id: number; lat?: number; lon?: number; tags?: Record<string, string> },
  city: string
): BusinessRow | null {
  const tags = el.tags || {}
  const name =
    tags.name || tags.brand || tags.operator || tags['name:en'] || tags['name:de'] || null
  if (!name) return null

  const lat = el.lat
  const lon = el.lon
  if (lat == null || lon == null) return null

  const addr = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ') || null
  const descParts = [
    'OpenStreetMap community data (not an endorsement).',
    tags.shop && `shop=${tags.shop}`,
    tags.amenity && `amenity=${tags.amenity}`,
    tags.office && `office=${tags.office}`,
  ].filter(Boolean)

  return {
    name: name.slice(0, 200),
    description: descParts.join(' · ').slice(0, 2000),
    business_type: tagsToBusinessType(tags),
    city,
    address: addr,
    latitude: lat,
    longitude: lon,
    status: 'active',
    featured: false,
    user_id: null,
    external_source: 'openstreetmap',
    external_id: `osm-${el.type}-${el.id}`,
    country: 'Germany',
  }
}

async function overpassPost(baseUrl: string, queryBody: string): Promise<Response> {
  return fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: `data=${encodeURIComponent(queryBody)}`,
  })
}

async function fetchRegionWithRetries(region: (typeof REGIONS)[number]): Promise<BusinessRow[]> {
  const body = buildQuery(region.south, region.west, region.north, region.east, MAX_PER_REGION)
  const transient = new Set([408, 429, 502, 503, 504])

  for (let attempt = 0; attempt < 3; attempt++) {
    const url = OVERPASS_URLS[attempt % OVERPASS_URLS.length]
    try {
      const res = await overpassPost(url, body)
      if (!res.ok) {
        if (transient.has(res.status) && attempt < 2) {
          await new Promise((r) => setTimeout(r, 2500 * (attempt + 1)))
          continue
        }
        throw new Error(`Overpass HTTP ${res.status} for ${region.city} (${url})`)
      }
      const json = (await res.json()) as {
        elements?: Array<{ type: string; id: number; lat?: number; lon?: number; tags?: Record<string, string> }>
      }
      const local: BusinessRow[] = []
      for (const el of json.elements || []) {
        if (el.type !== 'node') continue
        const row = elementToRow(el, region.city)
        if (row) local.push(row)
      }
      return local
    } catch (e) {
      if (attempt < 2) {
        console.warn(`[ingest] overpass retry ${region.city}`, e)
        await new Promise((r) => setTimeout(r, 2500 * (attempt + 1)))
        continue
      }
      throw e
    }
  }
  return []
}

export async function fetchOsmBusinessCandidates(): Promise<BusinessRow[]> {
  const rows: BusinessRow[] = []
  const seen = new Set<string>()

  for (const region of REGIONS) {
    try {
      const chunk = await fetchRegionWithRetries(region)
      for (const row of chunk) {
        if (seen.has(row.external_id)) continue
        seen.add(row.external_id)
        rows.push(row)
      }
    } catch (e) {
      console.warn(`[ingest] overpass skipped region ${region.city}`, e)
    }

    await new Promise((r) => setTimeout(r, 1200))
  }

  return rows
}
