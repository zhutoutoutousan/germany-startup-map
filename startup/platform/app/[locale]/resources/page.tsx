import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/search/SearchBar'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Mark as dynamic since we're using searchParams
export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { q?: string; type?: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations()
  
  let resources = null
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient()

      let query = supabase
        .from('resources')
        .select('*')

      if (searchParams.q) {
        query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
      }

      if (searchParams.type) {
        query = query.eq('resource_type', searchParams.type)
      }

      const result = await query.order('created_at', { ascending: false })
      resources = result.data
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('resources.title')}</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="px-4 py-2 border rounded">
          <option value="">All Resource Types</option>
          <option value="guide">{t('resources.guides')}</option>
          <option value="document">{t('resources.documents')}</option>
          <option value="tool">{t('resources.tools')}</option>
          <option value="contact">{t('resources.contacts')}</option>
        </select>
      </div>

      {/* Resources List */}
      {resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
              <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
              {resource.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
              )}
              <div className="text-sm text-gray-500 mb-4">
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                  {resource.resource_type}
                </span>
              </div>
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View Resource →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No resources found.</p>
        </div>
      )}
    </div>
  )
}
