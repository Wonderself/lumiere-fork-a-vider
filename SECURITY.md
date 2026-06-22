# Lumiere App — Security Policy

> **Ce document décrit les pratiques de sécurité, les protections en place,
> et les procédures de réponse aux incidents.**

---

## 1. Authentication & Authorization

### Auth System
- **NextAuth v5** (beta) with JWT strategy
- Stateless sessions — no server-side session storage
- JWT tokens signed with `AUTH_SECRET` (256-bit minimum)
- Token expiry: 30 days (configurable)

### Password Policy
- Minimum 8 characters
- Bcrypt hashing with automatic salt rounds
- Password reset tokens: 1-hour expiry, single-use
- Reset link sent via email (Resend)

### Route Protection
- `src/proxy.ts` — Centralized route protection (Next.js 16)
- Protected routes: `/dashboard/*`, `/admin/*`, `/profile/*`, `/tasks/*`, `/lumens/*`, `/notifications/*`, `/screenplays/*`, `/tokenization/*`
- Admin routes: additional role check (redirects non-admin to `/dashboard`)
- Unauthenticated users → redirect to `/login?callbackUrl=...`

### Role-Based Access Control (RBAC)
| Role | Access Level |
|------|-------------|
| ADMIN | Full platform access, all CRUD operations |
| CONTRIBUTOR | Claim tasks, submit deliverables, view earnings |
| ARTIST | Specialized creative task access |
| STUNT_PERFORMER | Motion capture / stunt tasks only |
| VIEWER | Watch films, vote in community |
| SCREENWRITER | Submit and manage screenplays |
| CREATOR | Content creation tools |

### Admin Action Protection
- All admin actions check `role === 'ADMIN'` server-side
- Server actions validated before execution (not just UI gating)
- Sensitive operations logged with user ID and timestamp

---

## 2. Data Protection & RGPD

### Personal Data
- Email addresses, display names, bio stored in PostgreSQL
- Wallet addresses stored for payment processing
- IP addresses NOT stored (no tracking)
- Session data: JWT only (no cookie-based tracking)

### RGPD Compliance
- **CGU** (Terms): `/legal/terms` — Full French legal page
- **Privacy Policy**: `/legal/privacy` — Data collection, usage, rights
- **Cookie Policy**: `/legal/cookies` — Technical cookies only (no tracking)
- **Right to deletion**: Users can request account deletion via email
- **Data portability**: CSV export available (admin payments)

### Data Encryption
- **In transit**: HTTPS enforced via Traefik (Let's Encrypt)
- **At rest**: PostgreSQL with encrypted connections (SSL)
- **Passwords**: Bcrypt with automatic salt rounds
- **Blockchain proofs**: SHA-256 hashes (tamper-evident)

---

## 3. API Security

### Input Validation
- **Zod schemas** for all form inputs (registration, task submission, etc.)
- Server-side validation on every action (never trust client)
- File upload MIME type validation + size limits (500MB max)
- SQL injection prevented by Prisma ORM (parameterized queries)

### Rate Limiting
- Redis-based rate limiting recommended for production
- Cron endpoints protected by `CRON_SECRET` token
- Stripe webhooks verified with `STRIPE_WEBHOOK_SECRET` signature

### CORS & Headers
- Next.js default CORS (same-origin)
- API routes: no CORS headers by default (server-side only)
- SSE endpoint: same-origin with auth check

### File Upload Security
- S3 presigned URLs: direct client-to-bucket (no server proxy)
- MIME type allowlist per category (video, image, document, subtitle, audio)
- Max file size: 500MB
- Random file keys (no predictable paths)
- User ID stored in S3 metadata for audit trail

---

## 4. Infrastructure Security

### Docker Build
- **Multi-stage build**: deps → builder → runner (minimal attack surface)
- **Non-root user**: `nodejs:1001` in production container
- **No secrets in image**: DATABASE_URL is dummy during build, real at runtime
- **Alpine Linux**: Minimal base image (node:20-alpine)
- **Healthcheck**: curl-based health monitoring

### Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `AUTH_SECRET` | JWT signing secret | Yes |
| `REDIS_URL` | Redis cache connection | No (graceful degradation) |
| `RESEND_API_KEY` | Email sending | No (logs in dev) |
| `STRIPE_SECRET_KEY` | Payment processing | No (mock mode) |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | No |
| `CRON_SECRET` | Cron job authentication | No |
| `ANTHROPIC_API_KEY` | AI features | No (mock mode) |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring | No |
| `S3_ACCESS_KEY_ID` | File upload | No (local fallback) |

### Secrets Management
- **NEVER** commit `.env` files (in `.gitignore`)
- Use Coolify environment variables for production
- Rotate secrets periodically (especially AUTH_SECRET)
- Stripe keys: use test mode (`sk_test_*`) for development

---

## 5. Blockchain Security

### Current: Hash-Based Proofs
- SHA-256 hashes for all on-chain events
- Immutable audit trail in `BlockchainEvent` table
- 23 event types covering full platform lifecycle
- `txHash` field ready for real blockchain integration

### Future: Smart Contracts (Polygon/Base)
- ERC-20 film tokens with KYC verification
- Anti-whale limits (maxTokensPerUser)
- Governance quorum requirements (30% minimum)
- Escrow payments with milestone release
- Multi-sig admin operations planned

---

## 6. Monitoring & Incident Response

### Error Tracking
- **Sentry** integration via `src/instrumentation.ts`
- Server-side + client-side error capture
- `onRequestError` handler for API route errors
- Global error boundary (`src/app/global-error.tsx`)

### Logging
- Console logging for all critical operations
- Email sending logged (success/failure)
- Payment operations logged with amounts
- Blockchain events logged with hashes
- Failed auth attempts visible in server logs

### Incident Response Process
1. **Detection**: Sentry alert or user report
2. **Assessment**: Determine severity and scope
3. **Containment**: Enable maintenance mode if needed
4. **Fix**: Deploy patch via Coolify
5. **Communication**: Notify affected users via email
6. **Review**: Post-mortem and prevention

---

## 7. Dependency Security

### Package Management
- `npm ci` in Docker (deterministic installs)
- `package-lock.json` committed for reproducibility
- Regular `npm audit` checks recommended
- No `--ignore-scripts` bypass in production

### Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | Framework |
| next-auth | 5.x beta | Authentication |
| prisma | 7.4.1 | Database ORM |
| bcryptjs | 3.x | Password hashing |
| ioredis | 5.x | Cache |
| @sentry/nextjs | latest | Monitoring |

---

## 8. Reporting Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email: **security@lumiere.film**
3. Include: description, reproduction steps, potential impact
4. We will respond within 48 hours
5. Credit will be given in our security changelog

---

## 9. Security Checklist (Deployment)

- [ ] `AUTH_SECRET` is set and unique (min 32 chars)
- [ ] `DATABASE_URL` uses SSL connection
- [ ] HTTPS enforced (Traefik + Let's Encrypt)
- [ ] `.env` not in Docker image
- [ ] Non-root user in container
- [ ] Stripe webhook secret configured
- [ ] Sentry DSN configured for error monitoring
- [ ] CRON_SECRET set for automated tasks
- [ ] Redis secured (password if exposed)
- [ ] Admin account has strong password
