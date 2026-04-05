import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/components/ui/Link'
import { BusinessCard } from '@/components/business/BusinessCard'
import { ServiceCard } from '@/components/services/ServiceCard'
import { ScrollMapShell } from '@/components/home/ScrollMapShell'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { businessToCard, serviceToCard } from '@/lib/mappers/prismaToCard'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)

  const t = await getTranslations()

  let mapMarkers: {
    id: string
    lat: number
    lng: number
    title: string
    description?: string
  }[] = []

  let businesses: ReturnType<typeof businessToCard>[] | null = null
  let services: ReturnType<typeof serviceToCard>[] | null = null

  const usePrisma = Boolean(process.env.DATABASE_URL)

  if (usePrisma) {
    try {
      const mapRows = await prisma.business.findMany({
        where: {
          status: 'active',
          latitude: { not: null },
          longitude: { not: null },
        },
        select: {
          id: true,
          name: true,
          city: true,
          businessType: true,
          latitude: true,
          longitude: true,
        },
        take: 400,
      })

      mapMarkers = mapRows.map((b) => ({
        id: b.id,
        lat: Number(b.latitude),
        lng: Number(b.longitude),
        title: b.name,
        description: [b.city, b.businessType].filter(Boolean).join(' · '),
      }))

      const feat = await prisma.business.findMany({
        where: { featured: true, status: 'active' },
        take: 6,
      })
      businesses = feat.length ? feat.map(businessToCard) : null

      const svc = await prisma.serviceProvider.findMany({
        where: { verified: true, status: 'active' },
        orderBy: { rating: 'desc' },
        take: 6,
      })
      services = svc.length ? svc.map(serviceToCard) : null
    } catch (error) {
      console.error('Home Prisma fetch:', error)
    }
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient()

      const mapResult = await supabase
        .from('businesses')
        .select('id, name, city, business_type, latitude, longitude')
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(400)

      if (mapResult.data) {
        mapMarkers = mapResult.data.map((b) => ({
          id: b.id,
          lat: Number(b.latitude),
          lng: Number(b.longitude),
          title: b.name,
          description: [b.city, b.business_type].filter(Boolean).join(' · '),
        }))
      }

      const businessesResult = await supabase
        .from('businesses')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .limit(6)

      businesses = businessesResult.data as unknown as ReturnType<typeof businessToCard>[] | null

      const servicesResult = await supabase
        .from('service_providers')
        .select('*')
        .eq('verified', true)
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .limit(6)

      services = servicesResult.data as unknown as ReturnType<typeof serviceToCard>[] | null
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <ScrollMapShell markers={mapMarkers} />

      <div className="mx-auto max-w-6xl px-4 py-14">
        {businesses && businesses.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex flex-col gap-2 border-b border-fuchsia-500/20 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-neon-gold md:text-3xl">
                  Featured businesses
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Highlights along the map — add more from your dashboard.
                </p>
              </div>
              <Link
                href="/businesses"
                className="font-club text-xs font-bold uppercase tracking-widest text-cyan-400 transition hover:text-fuchsia-300"
              >
                {t('nav.businesses')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </section>
        )}

        {services && services.length > 0 && (
          <section>
            <div className="mb-8 flex flex-col gap-2 border-b border-fuchsia-500/20 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-neon-gold md:text-3xl">
                  Top service providers
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Verified partners for legal, tax, and operations.
                </p>
              </div>
              <Link
                href="/services"
                className="font-club text-xs font-bold uppercase tracking-widest text-cyan-400 transition hover:text-fuchsia-300"
              >
                {t('nav.services')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
