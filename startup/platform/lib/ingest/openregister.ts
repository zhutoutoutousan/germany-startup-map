/**
 * OpenRegister DE — optional Bearer key (free tier credits).
 * @see https://docs.openregister.de/
 */

export type OpenRegisterHit = {
  companyId: string
  name: string
  registerCourt: string
  cityGuess: string
}

export async function fetchOpenRegisterSamples(): Promise<OpenRegisterHit[]> {
  const key = process.env.OPENREGISTER_API_KEY
  if (!key) return []

  const queries = ['GmbH Berlin', 'UG Hamburg', 'Startup München']
  const hits: OpenRegisterHit[] = []

  for (const q of queries) {
    const url = new URL('https://api.openregister.de/v1/autocomplete/company')
    url.searchParams.set('query', q)
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
    })
    if (!res.ok) continue
    const data = (await res.json()) as {
      results?: Array<{
        company_id: string
        name: string
        register_court?: string
      }>
    }
    for (const r of data.results?.slice(0, 5) || []) {
      hits.push({
        companyId: r.company_id,
        name: r.name,
        registerCourt: r.register_court || '',
        cityGuess: q.split(' ').pop() || 'Germany',
      })
    }
    await new Promise((r) => setTimeout(r, 400))
  }

  return hits
}
