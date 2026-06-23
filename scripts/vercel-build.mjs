// Vercel build wrapper.
// 1. Always generates the Prisma client.
// 2. If a DATABASE_URL is configured (Vercel env var), pushes the schema so
//    every table exists on the connected Postgres database.
// 3. Builds the Next.js app.
//
// If no DATABASE_URL is set, the schema push is skipped and the app still
// deploys — it just runs in "fallback" mode (admin login works, data-backed
// screens show empty states). See DEPLOY_VERCEL.md.
import { execSync } from 'node:child_process'

function run(cmd) {
  console.log(`\n▶ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

run('prisma generate')

if (process.env.DATABASE_URL) {
  console.log('✓ DATABASE_URL detected — syncing Postgres schema (prisma db push)')
  try {
    run('prisma db push --skip-generate')
  } catch (err) {
    // Don't block the deploy on a transient DB issue — the app degrades gracefully.
    console.warn('⚠ prisma db push failed; continuing build in fallback mode.')
    console.warn(String(err?.message || err))
  }
} else {
  console.warn('⚠ No DATABASE_URL at build time — skipping schema push.')
  console.warn('  The app will deploy in fallback mode (no persistent data).')
}

run('next build --webpack')
