# CINEGENY App — Deployment Guide

> **Guide complet pour déployer Lumière Cinema en production.**
> Infrastructure: Docker + Coolify + Hetzner (ou tout serveur compatible).

---

## 1. Architecture

```
                 ┌──────────────┐
                 │   Cloudflare  │  DNS + CDN
                 │  cinegeny.film │
                 └──────┬───────┘
                        │ HTTPS
                 ┌──────┴───────┐
                 │   Traefik    │  Reverse proxy (auto-SSL)
                 │  (Coolify)   │
                 └──────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
   ┌──────┴──────┐ ┌───┴────┐ ┌─────┴─────┐
   │  Next.js    │ │  Redis │ │ PostgreSQL │
   │  App :3000  │ │  :6379 │ │   :5432    │
   │ (standalone)│ │        │ │            │
   └─────────────┘ └────────┘ └────────────┘
```

---

## 2. Prerequisites

### Server Requirements
- **VPS**: Hetzner CX21 minimum (2 vCPU, 4GB RAM, 40GB SSD)
- **OS**: Ubuntu 22.04+ or Debian 12+
- **Docker**: v24+ with Docker Compose
- **Coolify**: v4+ (self-hosted PaaS)

### Accounts Required
| Service | Purpose | Required |
|---------|---------|----------|
| Hetzner | VPS hosting | Yes |
| GitHub | Code repository | Yes |
| Cloudflare | DNS + CDN | Recommended |
| Resend | Transactional emails | Optional |
| Stripe | Payments | Optional |
| Sentry | Error monitoring | Optional |
| AWS S3 / Cloudflare R2 | File storage | Optional |

### Environment Variables
```env
# Required
DATABASE_URL="postgresql://cinegeny:PASSWORD@db:5432/cinegeny?sslmode=require"
AUTH_SECRET="your-256-bit-secret-here"

# Optional (graceful degradation if missing)
REDIS_URL="redis://redis:6379"
RESEND_API_KEY="re_xxxxxxxxxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
STRIPE_PRICE_BASIC="price_xxxxxxxxxxxx"
STRIPE_PRICE_PREMIUM="price_xxxxxxxxxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
CRON_SECRET="your-cron-secret"
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"
S3_ACCESS_KEY_ID="AKIAXXXXXXXXXXXX"
S3_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxx"
S3_BUCKET="cinegeny-uploads"
S3_REGION="eu-west-3"

# App
NEXT_PUBLIC_APP_URL="https://cinema.cinegeny.film"
BLOCKCHAIN_NETWORK="polygon_testnet"
```

---

## 3. Coolify Deployment (Recommended)

### Step 1: Install Coolify
```bash
ssh root@your-server-ip
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### Step 2: Connect GitHub Repository
1. Open Coolify dashboard (http://your-server-ip:8000)
2. Add new resource → GitHub App
3. Connect `Wonderself/cinegeny-app` repository
4. Select branch: `main`

### Step 3: Configure Build
- **Build pack**: Dockerfile
- **Dockerfile path**: `./Dockerfile`
- **Port**: 3000

### Step 4: Add Services
1. **PostgreSQL**: Add managed PostgreSQL database
   - Note the connection string for DATABASE_URL
2. **Redis**: Add managed Redis instance
   - Note the connection string for REDIS_URL

### Step 5: Set Environment Variables
Add all variables from Section 2 in Coolify's environment settings.

### Step 6: Deploy
Click "Deploy" — Coolify will:
1. Pull from GitHub
2. Build Docker image (multi-stage)
3. Run `start.sh` which handles:
   - Prisma migration (`prisma db push`)
   - Seed if first deploy
   - Start Next.js server

### Step 7: Configure Domain
1. In Coolify: Set custom domain `cinema.cinegeny.film`
2. In Cloudflare: Add A record → your server IP
3. Traefik auto-generates SSL certificate

---

## 4. Docker Compose (Manual)

For non-Coolify deployments:

```yaml
# docker-compose.production.yml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://cinegeny:${DB_PASSWORD}@db:5432/cinegeny
      - AUTH_SECRET=${AUTH_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cinegeny
      POSTGRES_USER: cinegeny
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cinegeny"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

```bash
# Deploy
DB_PASSWORD=your-password AUTH_SECRET=your-secret docker compose -f docker-compose.production.yml up -d
```

---

## 5. Dockerfile Explained

Our Dockerfile uses a 3-stage build:

### Stage 1: Dependencies
- Installs npm packages with `npm ci --ignore-scripts`
- Cached: only rebuilds when package.json changes

### Stage 2: Builder
- Generates Prisma client
- Builds Next.js (standalone output)
- Uses dummy DATABASE_URL (Prisma needs it for module analysis, not connection)

### Stage 3: Runner
- Minimal Alpine image
- Non-root user `nextjs:1001`
- Copies: standalone build + static + Prisma + pg drivers
- Copies: start.sh for migration handling
- Healthcheck on port 3000

### Key: pg module copies
Next.js `serverExternalPackages: ['@prisma/adapter-pg', 'pg']` means pg is NOT bundled.
We must explicitly COPY 13 pg-related packages to the runner stage.

---

## 6. Startup Script (start.sh)

```bash
#!/bin/sh
echo "🎬 CINEGENY Cinema — Starting..."

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set"
  exit 1
fi

# Check pg module
node -e "require('pg')" 2>/dev/null || {
  echo "❌ pg module not found"
  exit 1
}

# Run migrations
npx prisma db push --accept-data-loss 2>/dev/null || echo "⚠️ Migration warning (normal on first deploy)"

# Start Next.js
exec node server.js
```

---

## 7. Cron Jobs

Set up a cron job to call the maintenance endpoint:

```bash
# Every 15 minutes — auto-release expired tasks, close contests, complete phases
*/15 * * * * curl -s "https://cinema.cinegeny.film/api/cron?key=YOUR_CRON_SECRET" > /dev/null
```

In Coolify: Add a scheduled task with the same URL.

---

## 8. Monitoring

### Sentry
Set `NEXT_PUBLIC_SENTRY_DSN` to enable:
- Server-side error capture (instrumentation.ts)
- Client-side error boundary (global-error.tsx)
- Performance monitoring (10% sample rate in prod)

### Health Check
```bash
curl -f https://cinema.cinegeny.film/
# Returns 200 if healthy
```

### Logs
```bash
# Coolify: View logs in dashboard
# Docker: docker logs -f cinegeny-app
```

---

## 9. Troubleshooting

### Build fails: "Type 'string' is not assignable to type 'TaskType'"
- Prisma enum types need `as never` cast in seed.ts
- Already fixed in codebase (commit e8dbf1a)

### Build fails: "Both middleware and proxy detected"
- Delete `src/middleware.ts` — Next.js 16 uses `proxy.ts`
- Already fixed (commit f0ef985)

### Runtime: "Cannot find module 'pg'"
- The 13 pg packages must be COPY'd to the runner stage
- Check Dockerfile for all COPY lines

### Redis errors in build logs
- Normal — Redis graceful degradation means the app logs warnings but works without Redis
- These are NOT errors, just informational warnings

### Prisma: "Can't reach database server"
- Ensure DATABASE_URL is set at **runtime** (not just build time)
- The build uses a dummy URL; the real connection happens at first request

### Slow Docker pull
- Hetzner EU servers may have slow Docker Hub access
- Consider using a Docker registry mirror

---

## 10. Backup Strategy

### PostgreSQL
```bash
# Daily backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20260224.sql
```

### Redis
- Redis is a cache layer — no backup needed
- App works without Redis (graceful degradation)

### Files (S3)
- S3 handles durability (11 nines)
- Consider cross-region replication for critical assets
