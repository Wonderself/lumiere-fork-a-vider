# Contributing to Lumiere Cinema

> **Bienvenue !** Lumière est un studio de cinéma collaboratif propulsé par l'IA.
> Ce guide explique comment contribuer au code de la plateforme.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Wonderself/lumiere-app.git
cd lumiere-app

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start PostgreSQL + Redis (Docker)
docker compose up -d

# 5. Initialize database
npx prisma db push
npx prisma db seed

# 6. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
lumiere-app/
├── prisma/              # Database schema + seed
│   ├── schema.prisma    # 70+ models
│   └── seed.ts          # 20 films + demo data
├── src/
│   ├── app/
│   │   ├── (public)/    # Public pages (cinema, films, streaming, etc.)
│   │   ├── (dashboard)/ # Protected dashboard pages
│   │   ├── actions/     # 26 server action files
│   │   └── api/         # API routes (auth, cron, stripe, upload, etc.)
│   ├── components/
│   │   ├── netflix/     # Netflix-style UI components
│   │   ├── ui/          # Radix UI primitives
│   │   └── *.tsx        # Feature components
│   ├── hooks/           # React hooks (useNotifications, etc.)
│   └── lib/             # 21 utility libraries
├── public/              # Static assets
├── PROJECT_HISTORY.md   # Full changelog (MUST update)
├── FEATURES.md          # Feature inventory (MUST update)
├── SECURITY.md          # Security practices
├── DEPLOYMENT.md        # Deployment guide
└── SLATE_DECK.md        # 20 film projects details
```

---

## Rules

### Golden Rules (Non-Negotiable)

1. **NEVER delete features** — Only add, improve, or optimize
2. **ALWAYS update docs** — `PROJECT_HISTORY.md` and `FEATURES.md` after every change
3. **ALWAYS test** — Run `npx tsc --noEmit` before committing (minimum)
4. **ALWAYS use `force-dynamic`** — On every page that uses Prisma
5. **Keep it fast and light** — Performance is a feature

### Code Style

- **TypeScript strict** — `noImplicitAny: true`, no `any` types
- **French UI text** — All user-facing strings in French
- **English code** — Variable names, comments, function names in English
- **Prisma enums** — Use `as never` when passing string variables as enum values
- **Server Actions** — Prefer server actions over API routes

### Design System

- **Theme**: Dark (#0A0A0A) + Gold (#D4AF37)
- **Fonts**: Playfair Display (headlines), Inter (body)
- **Components**: Radix UI primitives + custom Netflix-style components
- **Animations**: Framer Motion, keep subtle (300-500ms)
- **Responsive**: Mobile-first, 3 breakpoints (sm, md, lg)

---

## Workflow

### Branch Strategy
```
main ← Direct push (small fixes) or PR (features)
```

### Commit Convention
```
feat: description    — New feature
fix: description     — Bug fix
docs: description    — Documentation only
chore: description   — Maintenance (deps, config)
refactor: description — Code restructure (no behavior change)
```

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes
3. Run `npx tsc --noEmit` — zero errors
4. Update `PROJECT_HISTORY.md` with changes
5. Update `FEATURES.md` if new feature
6. Push and create PR
7. PR description must include: what, why, how to test

---

## Common Tasks

### Add a New Page
```bash
# Public page
src/app/(public)/my-page/page.tsx

# Dashboard page (protected)
src/app/(dashboard)/dashboard/my-page/page.tsx
```

Always add `export const dynamic = 'force-dynamic'` if using Prisma.

### Add a Server Action
```bash
src/app/actions/my-feature.ts
```

Pattern:
```typescript
'use server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function myAction(input: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Your logic here
  return { data: result }
}
```

### Add a New API Route
```bash
src/app/api/my-route/route.ts
```

Always add `export const dynamic = 'force-dynamic'`.

### Add a Component
```bash
# Feature component
src/components/my-component.tsx

# Netflix-style component
src/components/netflix/my-component.tsx
```

Use `'use client'` only when needed (interactivity, hooks).

---

## Known Pitfalls

| Pitfall | Solution |
|---------|----------|
| Prisma fails at build time | Use `force-dynamic` + lazy Proxy singleton |
| Redis errors in logs | Normal — graceful degradation |
| `middleware.ts` + `proxy.ts` conflict | Next.js 16 uses `proxy.ts` only |
| Enum type errors in seed.ts | Use `as never` cast |
| `useRef` needs initial value (React 19) | Use `useRef<Type>(undefined)` |
| S3 SDK not installed locally | Use `@ts-expect-error` for conditional imports |

---

## Getting Help

- **Issues**: https://github.com/Wonderself/lumiere-app/issues
- **Email**: dev@lumiere.film
- **Docs**: `PROJECT_HISTORY.md`, `FEATURES.md`, `FILM_PIPELINE.md`

---

## License

All rights reserved — Lumière Brothers SAS / Wonderself.
Contributions are welcome under the project's license terms.
