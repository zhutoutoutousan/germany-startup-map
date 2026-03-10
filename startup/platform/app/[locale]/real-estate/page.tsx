import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/search/SearchBar'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Mark as dynamic since we're using searchParams
export const dynamic = 'force-dynamic'

export default async function RealEstatePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { q?: string; type?: string; city?: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations()
  
  let properties = null
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient()

      let query = supabase
        .from('real_estate')
        .select('*')
        .eq('status', 'available')

      if (searchParams.q) {
        query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
      }

      if (searchParams.type) {
        query = query.eq('property_type', searchParams.type)
      }

      if (searchParams.city) {
        query = query.eq('city', searchParams.city)
      }

      const result = await query.order('created_at', { ascending: false })
      properties = result.data
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('realEstate.title')}</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="px-4 py-2 border rounded">
          <option value="">All Property Types</option>
          <option value="commercial">Commercial</option>
          <option value="retail">Retail</option>
          <option value="office">Office</option>
          <option value="warehouse">Warehouse</option>
        </select>
        <select className="px-4 py-2 border rounded">
          <option value="">All Listing Types</option>
          <option value="rental">{t('realEstate.rental')}</option>
          <option value="sale">{t('realEstate.sale')}</option>
          <option value="lease">{t('realEstate.lease')}</option>
        </select>
        <input
          type="text"
          placeholder="Filter by city..."
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Properties List */}
      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              {property.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
              )}
              <div className="space-y-2 text-sm text-gray-500">
                <div><strong>Type:</strong> {property.property_type}</div>
                <div><strong>Listing:</strong> {property.listing_type}</div>
                {property.size_sqm && <div><strong>Size:</strong> {property.size_sqm} sqm</div>}
                {property.price_monthly && (
                  <div><strong>Monthly:</strong> €{property.price_monthly.toLocaleString()}</div>
                )}
                {property.price_total && (
                  <div><strong>Total:</strong> €{property.price_total.toLocaleString()}</div>
                )}
                <div><strong>City:</strong> {property.city}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found.</p>
        </div>
      )}
    </div>
  )
}
