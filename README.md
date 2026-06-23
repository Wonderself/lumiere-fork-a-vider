# CINEGENY — Cinema & Creative Studio

> The AI-powered collaborative cinema platform. Create, fund, vote on, and stream films — with a real, convertible in-platform currency (Lumens).

The brand mark is the **gold film-strip infinity (∞)** — a recurring identity marker across the app.

## Tech stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Animation**: framer-motion (tasteful, purposeful micro-interactions)
- **i18n**: next-intl (English default, French available)
- **Auth**: NextAuth v5 (credentials + Google OAuth)
- **DB**: PostgreSQL + Prisma 7
- **Cache**: Redis
- **UI**: shadcn/ui + lucide-react
- **AI**: Anthropic Claude

## What's new — Platform Refresh 2026 (V14)

- **One account + capabilities** — no role to pick at signup. Watch and vote, then unlock: Invest, Paid missions, Missions for shares, Submit a screenplay, Act, Produce.
- **Lumen economy in USD** — `1 Lumen = $1`. Buy/withdraw with a one-time identity check (KYC) before cash-out. Stripe-ready (simulated until keys); USDC/Bitcoin rails pluggable. Reserve = USD + USDC.
- **Academy** — a free, account-gated AI-filmmaking course: Level 1 (foundations) + Level 2 (advanced), text + images.
- **Voting ladder** — Screenplay → Trailer → Short film → Feature, ~10 active projects per stage.
- **Generous Premium** — Lumens, 2× voting power, fee discounts, priority missions, AI credits, early access.
- **Full English UI** — default locale switched to English; the entire user-facing app and displayed content translated.
- **Brand identity** — real gold infinity logo + reusable `InfinityMark` / `InfinityDivider`.
- **Google sign-in** + corrected Coolify env keys.

## Quick start

### 1. Prerequisites
- Node.js 18+
- Docker Desktop (for PostgreSQL + Redis)

### 2. Install
```bash
npm install
```

### 3. Environment
```bash
cp .env.example .env.local
# .env.local is pre-configured for local dev
```

### 4. Start the database
```bash
docker compose up -d
```

### 5. Apply the Prisma schema
```bash
npm run db:push
```

### 6. Seed demo data
```bash
npm run db:seed
```

### 7. Start the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Useful commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run db:push      # Push schema without migration
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset DB + re-seed
npm run test         # Run unit tests (Vitest)
```

## Key pages

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/participate` | Capabilities hub (invest, missions, act, produce…) |
| `/vote` | Community voting ladder |
| `/academy` | Free AI-filmmaking course |
| `/films`, `/films/[slug]` | Film catalog & detail |
| `/lumens` | Lumens wallet (buy / withdraw) |
| `/dashboard` | User dashboard |
| `/dashboard/kyc` | One-time identity verification |
| `/pricing` | Plans & pricing |
| `/admin` | Admin panel |
| `/roadmap` | Full roadmap |

## Payments & integrations (Coolify env)

All run in a safe **simulated/disabled** mode until keys are set. See `.env.example` and `DEPLOY_COOLIFY.md`:
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — buy/withdraw Lumens
- `KYC_PROVIDER` — identity verification (auto-approved in simulated mode)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google sign-in (redirect `…/api/auth/callback/google`)
- `S3_ENDPOINT` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_BUCKET` / `S3_REGION` — uploads
- `ANTHROPIC_API_KEY`, `RESEND_API_KEY` — AI, emails
- Optional crypto rails: `USDC_PROVIDER_API_KEY`, `BITCOIN_PROVIDER_API_KEY`

---
© CINEGENY Studio — Cinema & Creative Studio.
