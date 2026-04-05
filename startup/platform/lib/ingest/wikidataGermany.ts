/**
 * Wikidata SPARQL (free, no API key). Organizations in Germany with coordinates.
 * @see https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service
 */

export type WikidataBiz = {
  name: string
  description: string
  lat: number
  lng: number
  externalId: string
}

const ENDPOINT = 'https://query.wikidata.org/sparql'

/** Parse WKT Point from Wikidata coordinate node */
function parseCoord(raw: string): { lat: number; lng: number } | null {
  const m = raw.match(/Point\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i)
  if (!m) return null
  const lng = parseFloat(m[1])
  const lat = parseFloat(m[2])
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  return { lat, lng }
}

export async function fetchWikidataOrganizations(): Promise<WikidataBiz[]> {
  const query = `
SELECT ?item ?itemLabel ?coord WHERE {
  VALUES ?type { wd:Q4830453 wd:Q6881511 wd:Q783794 wd:Q167270 }
  ?item wdt:P31/wdt:P279* ?type .
  ?item wdt:P17 wd:Q183 .
  ?item wdt:P625 ?coord .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,de". }
}
LIMIT 40
`.trim()

  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/sparql-results+json',
      'User-Agent': 'GermanyStartupMap/1.0 (educational; contact: local)',
    },
  })

  if (!res.ok) throw new Error(`Wikidata SPARQL HTTP ${res.status}`)

  const json = (await res.json()) as {
    results?: {
      bindings: Array<{
        item?: { value: string }
        itemLabel?: { value: string }
        coord?: { value: string }
      }>
    }
  }

  const out: WikidataBiz[] = []
  for (const b of json.results?.bindings || []) {
    const label = b.itemLabel?.value
    const coordStr = b.coord?.value
    const item = b.item?.value
    if (!label || !coordStr || !item) continue
    const pos = parseCoord(coordStr)
    if (!pos) continue
    const id = item.split('/').pop() || item
    out.push({
      name: label.slice(0, 200),
      description: 'Wikidata entity (CC0). Verify before relying on data.',
      lat: pos.lat,
      lng: pos.lng,
      externalId: `wd-${id}`,
    })
  }
  return out
}
