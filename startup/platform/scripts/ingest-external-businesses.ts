/**
 * One-shot: fetch OpenStreetMap (Overpass) + Wikidata (+ OpenRegister if OPENREGISTER_API_KEY) and upsert businesses.
 * Loads .env.local / .env like other platform scripts.
 *
 * Usage: npm run ingest:external
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(__dirname, '..')
  for (const name of ['.env.local', '.env'] as const) {
    const p = path.join(root, name)
    if (fs.existsSync(p)) config({ path: p })
  }

  const { applyDbUrlAliases } = await import('../lib/dbUrlAliases')
  applyDbUrlAliases()

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL (set in .env.local, or use POSTGRES_PRISMA_URL).')
    process.exit(1)
  }

  const { runExternalBusinessIngest } = await import('../lib/ingest/runExternalIngest')
  try {
    const result = await runExternalBusinessIngest()
    console.log(JSON.stringify(result, null, 2))
  } finally {
    const { prisma } = await import('../lib/prisma')
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
