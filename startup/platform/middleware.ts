import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { locales } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const response = intlMiddleware(request)
  
  // Update Supabase session and merge with intl response
  const supabaseResponse = await updateSession(request)
  
  // Merge headers - prioritize Supabase session headers
  supabaseResponse.headers.forEach((value, key) => {
    response.headers.set(key, value)
  })
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
