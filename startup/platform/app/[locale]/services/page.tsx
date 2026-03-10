import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { ServiceCard } from '@/components/services/ServiceCard'
import { SearchBar } from '@/components/search/SearchBar'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ServicesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { q?: string; type?: string; city?: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations()
  const supabase = await createClient()

  let query = supabase
    .from('service_providers')
    .select('*')
    .eq('status', 'active')

  if (searchParams.q) {
    query = query.or(`company_name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }

  if (searchParams.type) {
    query = query.eq('service_type', searchParams.type)
  }

  if (searchParams.city) {
    query = query.eq('city', searchParams.city)
  }

  const { data: services } = await query.order('rating', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('services.title')}</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="px-4 py-2 border rounded">
          <option value="">All Service Types</option>
          <option value="legal">{t('services.legal')}</option>
          <option value="accounting">{t('services.accounting')}</option>
          <option value="real_estate">{t('services.realEstate')}</option>
          <option value="consulting">{t('services.consulting')}</option>
          <option value="supply_chain">{t('services.supplyChain')}</option>
        </select>
        <input
          type="text"
          placeholder="Filter by city..."
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Service Providers List */}
      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No service providers found.</p>
        </div>
      )}
    </div>
  )
}
