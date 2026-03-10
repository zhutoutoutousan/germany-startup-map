import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function DashboardPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: services } = await supabase
    .from('service_providers')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('common.dashboard')}</h1>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          {profile && (
            <>
              {profile.full_name && <p><strong>Name:</strong> {profile.full_name}</p>}
              {profile.company_name && <p><strong>Company:</strong> {profile.company_name}</p>}
              {profile.user_type && <p><strong>User Type:</strong> {profile.user_type}</p>}
            </>
          )}
        </div>
        <Link
          href={`/${locale}/profile/edit`}
          className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Edit Profile
        </Link>
      </div>

      {/* My Businesses */}
      {businesses && businesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Businesses</h2>
            <Link
              href={`/${locale}/businesses/new`}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Add Business
            </Link>
          </div>
          <div className="space-y-4">
            {businesses.map((business) => (
              <div key={business.id} className="border-b pb-4">
                <h3 className="text-xl font-semibold">{business.name}</h3>
                <p className="text-gray-600">{business.city}</p>
                <Link
                  href={`/${locale}/businesses/${business.id}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Services */}
      {services && services.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Service Providers</h2>
            <Link
              href={`/${locale}/services/new`}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Add Service
            </Link>
          </div>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border-b pb-4">
                <h3 className="text-xl font-semibold">{service.company_name}</h3>
                <p className="text-gray-600">{service.service_type} - {service.city}</p>
                <Link
                  href={`/${locale}/services/${service.id}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
