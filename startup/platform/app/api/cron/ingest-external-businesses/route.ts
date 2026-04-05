import { NextRequest, NextResponse } from 'next/server'
import { runExternalBusinessIngest } from '@/lib/ingest/runExternalIngest'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * Ingest OSM + Wikidata (+ optional OpenRegister API key) into `businesses` via Prisma.
 * Requires DATABASE_URL + migration 002 (external columns). CRON_SECRET or Vercel cron header.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  const vercelCron = request.headers.get('x-vercel-cron')

  const okSecret = secret && auth === `Bearer ${secret}`
  const okVercelCron = process.env.VERCEL === '1' && vercelCron === '1'

  if (!okSecret && !okVercelCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Missing DATABASE_URL for Prisma' }, { status: 500 })
  }

  try {
    const body = await runExternalBusinessIngest()
    return NextResponse.json(body)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[ingest-external-businesses]', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
