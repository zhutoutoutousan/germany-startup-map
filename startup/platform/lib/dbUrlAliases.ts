/**
 * If DATABASE_URL / DIRECT_URL are unset, derive them from Vercel/Supabase-style
 * POSTGRES_* variables so Prisma and Next.js can share one .env.local layout.
 */
export function applyDbUrlAliases(): void {
  if (typeof process === 'undefined') return

  if (!process.env.DATABASE_URL && process.env.POSTGRES_PRISMA_URL) {
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL
  }

  if (!process.env.DIRECT_URL) {
    const host = process.env.POSTGRES_HOST
    const pass = process.env.POSTGRES_PASSWORD
    const user = process.env.POSTGRES_USER || 'postgres'
    const db = process.env.POSTGRES_DATABASE || 'postgres'
    if (host && pass) {
      process.env.DIRECT_URL = `postgresql://${user}:${encodeURIComponent(pass)}@${host}:5432/${db}?sslmode=require`
    } else if (process.env.POSTGRES_URL_NON_POOLING) {
      process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING
    }
  }
}

applyDbUrlAliases()
