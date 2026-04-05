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

const prismaArgs = process.argv.slice(2)
if (prismaArgs.length === 0) {
  console.error('Usage: node scripts/prisma-run.js <prisma subcommand> [...args]')
  process.exit(1)
}

const r = spawnSync('npx', ['prisma', ...prismaArgs], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
})

process.exit(r.status === null ? 1 : r.status)
