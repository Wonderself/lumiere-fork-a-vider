#!/bin/sh
set -e

echo "=== Lumiere Startup ==="
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

echo "Starting Next.js server..."
exec node server.js
