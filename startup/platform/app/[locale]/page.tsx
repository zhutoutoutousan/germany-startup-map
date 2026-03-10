import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/components/ui/Link'
import { SearchBar } from '@/components/search/SearchBar'
import { BusinessCard } from '@/components/business/BusinessCard'
import { ServiceCard } from '@/components/services/ServiceCard'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const t = await getTranslations()
  const supabase = await createClient()

  // Fetch featured businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('featured', true)
    .eq('status', 'active')
    .limit(6)

  // Fetch featured service providers
  const { data: services } = await supabase
    .from('service_providers')
    .select('*')
    .eq('verified', true)
    .eq('status', 'active')
    .order('rating', { ascending: false })
    .limit(6)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {t('common.welcome')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your comprehensive guide to starting a business in Germany
        </p>
        <SearchBar />
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Link href="/businesses" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">{t('nav.businesses')}</h3>
          <p className="text-gray-600">Explore businesses in Germany</p>
        </Link>
        <Link href="/services" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">{t('nav.services')}</h3>
          <p className="text-gray-600">Find service providers</p>
        </Link>
        <Link href="/real-estate" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">{t('nav.realEstate')}</h3>
          <p className="text-gray-600">Browse properties</p>
        </Link>
        <Link href="/resources" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">{t('nav.resources')}</h3>
          <p className="text-gray-600">Access guides and tools</p>
        </Link>
      </section>

      {/* Featured Businesses */}
      {businesses && businesses.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Services */}
      {services && services.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top Service Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
