import { fetchOsmBusinessCandidates } from '@/lib/ingest/overpassGermany'
import { fetchWikidataOrganizations } from '@/lib/ingest/wikidataGermany'
import { fetchOpenRegisterSamples } from '@/lib/ingest/openregister'
import { upsertIngestBusinesses, fromOsmRow, type IngestBusinessInput } from '@/lib/ingest/businessUpsertPrisma'
import { prisma } from '@/lib/prisma'

const CITY_COORD: Record<string, { lat: number; lng: number }> = {
  Berlin: { lat: 52.52, lng: 13.405 },
  Hamburg: { lat: 53.5511, lng: 9.9937 },
  München: { lat: 48.1372, lng: 11.5755 },
  Germany: { lat: 51.1657, lng: 10.4515 },
}

function wikidataToIngest(w: {
  name: string
  description: string
  lat: number
  lng: number
  externalId: string
}): IngestBusinessInput {
  return {
    name: w.name,
    description: w.description,
    businessType: 'other',
    city: 'Germany',
    address: null,
    latitude: w.lat,
    longitude: w.lng,
    status: 'active',
    featured: false,
    externalSource: 'wikidata',
    externalId: w.externalId,
    country: 'Germany',
  }
}

function openRegisterToIngest(
  h: { companyId: string; name: string; registerCourt: string; cityGuess: string },
  i: number
): IngestBusinessInput | null {
  const coord = CITY_COORD[h.cityGuess] || CITY_COORD.Germany
  const jitter = (i % 10) * 0.002
  return {
    name: h.name.slice(0, 200),
    description: `Handelsregister-related listing via OpenRegister sample. Court: ${h.registerCourt}`.slice(
      0,
      2000
    ),
    businessType: 'service',
    city: h.cityGuess,
    address: null,
    latitude: coord.lat + jitter,
    longitude: coord.lng + jitter,
    status: 'active',
    featured: false,
    externalSource: 'openregister',
    externalId: `or-${h.companyId.replace(/[^a-zA-Z0-9_-]/g, '_')}`.slice(0, 120),
    country: 'Germany',
  }
}

export type ExternalIngestResult = {
  ok: true
  upserted: number
  sources: string[]
  attribution: string
}

/**
 * Pull OSM (Overpass) + Wikidata (+ optional OpenRegister) and upsert into `businesses`.
 */
export async function runExternalBusinessIngest(): Promise<ExternalIngestResult> {
  await prisma.$connect()

  const batch: IngestBusinessInput[] = []

  const osm = await fetchOsmBusinessCandidates()
  osm.forEach((row, i) => batch.push(fromOsmRow(row, i < 6)))

  try {
    const wd = await fetchWikidataOrganizations()
    wd.forEach((w) => batch.push(wikidataToIngest(w)))
  } catch (e) {
    console.warn('[ingest] wikidata skipped', e)
  }

  try {
    const orHits = await fetchOpenRegisterSamples()
    orHits.forEach((h, i) => {
      const row = openRegisterToIngest(h, i)
      if (row) batch.push(row)
    })
  } catch (e) {
    console.warn('[ingest] openregister skipped', e)
  }

  const n = await upsertIngestBusinesses(batch)

  return {
    ok: true,
    upserted: n,
    sources: ['openstreetmap', 'wikidata', process.env.OPENREGISTER_API_KEY ? 'openregister' : null].filter(
      Boolean
    ) as string[],
    attribution: '© OpenStreetMap contributors · Wikidata (CC0) · optional OpenRegister (see docs)',
  }
}
