/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

for (const name of ['.env.local', '.env']) {
  const p = path.join(root, name)
  if (fs.existsSync(p)) {
    require('dotenv').config({ path: p })
  }
}

const { applyDbUrlAliases } = require('./loadDbEnvFallbacks')
applyDbUrlAliases()

const strict = process.argv.includes('--strict')

const r = spawnSync('npx', ['prisma', 'generate'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
})

if (r.status !== 0) {
  const msg =
    '\n[prisma] generate failed. Set DATABASE_URL + DIRECT_URL, or POSTGRES_PRISMA_URL + POSTGRES_HOST/PASSWORD (see .env.example). Then run: npm run db:generate\n'
  if (strict) {
    console.error(msg)
    process.exit(r.status === null ? 1 : r.status)
  }
  console.warn(msg)
  process.exit(0)
}
