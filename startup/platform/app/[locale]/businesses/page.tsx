import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { BusinessCard } from '@/components/business/BusinessCard'
import { SearchBar } from '@/components/search/SearchBar'
import { Map } from '@/components/map/Map'
import { BusinessesFilters } from '@/components/business/BusinessesFilters'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-dynamic'

function FiltersFallback() {
  return (
    <div className="h-24 animate-pulse rounded-sm bg-fuchsia-950/40" aria-hidden />
  )
}

export default async function BusinessesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { q?: string; type?: string; city?: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations('business')

  let businesses: any[] | null = null

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient()

      let query = supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active')

      if (searchParams.q) {
        query = query.or(`name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
      }

      if (searchParams.type) {
        query = query.eq('business_type', searchParams.type)
      }

      if (searchParams.city) {
        query = query.eq('city', searchParams.city)
      }

      const result = await query.order('created_at', { ascending: false })
      businesses = result.data
    } catch (error) {
      console.error('Error fetching businesses:', error)
    }
  }

  const mapMarkers =
    businesses?.filter((b) => b.latitude && b.longitude).map((b) => ({
      id: b.id,
      lat: Number(b.latitude),
      lng: Number(b.longitude),
      title: b.name,
      description: b.city,
    })) ?? []

  const list = businesses ?? []

  return (
    <div className="min-h-screen">
      <div className="border-b border-cyan-500/15 bg-gradient-to-r from-club-950 via-fuchsia-950/20 to-club-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-amber-200 via-fuchsia-200 to-cyan-300 bg-clip-text md:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-zinc-400">
            Browse the registry on the chart, then read each listing below.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar tone="disco" />
          </div>
          <div className="mt-6">
            <Suspense fallback={<FiltersFallback />}>
              <BusinessesFilters />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10">
          <h2 className="mb-3 font-club text-xs font-bold uppercase tracking-[0.35em] text-fuchsia-400">
            Map
          </h2>
          <Map
            markers={mapMarkers}
            height="420px"
            className="w-full border-fuchsia-500/30 shadow-neon-fuchsia"
          />
        </div>

        {list.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="china-corners relative overflow-hidden rounded-sm border border-amber-400/20 bg-club-900/80 px-8 py-16 text-center shadow-hub backdrop-blur-sm">
            <p className="font-display text-lg text-zinc-200">{t('emptyHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
