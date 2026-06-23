#!/bin/sh
set -e

echo "=== CINEGENY Startup ==="
echo "Node: $(node -v)"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo 'yes' || echo 'NO — THIS WILL FAIL')"

# Verify pg module is available
node -e "require('pg'); console.log('pg module: OK')" || {
  echo "ERROR: pg module not found in node_modules!"
  exit 1
}

# Wait for PostgreSQL to be ready
echo "Waiting for database..."
MAX_RETRIES=30
RETRY=0
until node -e "
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  pool.query('SELECT 1').then(() => { pool.end(); process.exit(0); }).catch((e) => { console.error('  DB error:', e.message); pool.end(); process.exit(1); });
" 2>/dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Database not ready after ${MAX_RETRIES} attempts!"
    echo "Check DATABASE_URL and that PostgreSQL is running."
    echo "Starting server anyway (pages with DB fallback will still work)..."
    break
  fi
  echo "  Retry $RETRY/$MAX_RETRIES..."
  sleep 2
done

if [ "$RETRY" -lt "$MAX_RETRIES" ]; then
  echo "Database is ready!"
fi

# Run Prisma schema push
echo "Syncing database schema..."
npx prisma db push 2>&1 || {
  echo "Warning: db push failed. Trying with --accept-data-loss for first deploy..."
  npx prisma db push --accept-data-loss 2>&1 || echo "Warning: db push retry also failed"
}

# Seed database if SEED_DB=true (only on first deploy)
if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  npx prisma db seed 2>&1 || echo "Warning: seed failed (data may already exist)"
fi

# Integration configuration check (informational — never blocks startup).
# Anything left blank runs in a safe simulated/disabled mode.
echo "=== Integration status ==="
check_key() { [ -n "$1" ] && echo "  [ON ] $2" || echo "  [off] $2 (simulated/disabled)"; }
check_key "$ANTHROPIC_API_KEY" "AI (Anthropic)"
check_key "$RESEND_API_KEY" "Email (Resend)"
check_key "$STRIPE_SECRET_KEY" "Payments — Lumen on/off-ramp (Stripe)"
check_key "$KYC_PROVIDER" "Identity verification (KYC)"
check_key "$USDC_PROVIDER_API_KEY" "Crypto rail — USDC stablecoin"
check_key "$BITCOIN_PROVIDER_API_KEY" "Crypto rail — Bitcoin payments"
check_key "$S3_ACCESS_KEY" "Storage (S3)"
echo "=========================="

echo "Starting Next.js server..."
exec node server.js
