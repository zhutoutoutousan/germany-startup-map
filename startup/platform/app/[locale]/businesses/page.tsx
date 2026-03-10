import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { BusinessCard } from '@/components/business/BusinessCard'
import { SearchBar } from '@/components/search/SearchBar'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Mark as dynamic since we're using searchParams
export const dynamic = 'force-dynamic'

export default async function BusinessesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { q?: string; type?: string; city?: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations()
  
  let businesses = null
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('business.title')}</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="px-4 py-2 border rounded">
          <option value="">All Types</option>
          <option value="restaurant">Restaurant</option>
          <option value="retail">Retail</option>
          <option value="ecommerce">E-commerce</option>
          <option value="service">Service</option>
        </select>
        <input
          type="text"
          placeholder="Filter by city..."
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Business List */}
      {businesses && businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No businesses found.</p>
        </div>
      )}
    </div>
  )
}
