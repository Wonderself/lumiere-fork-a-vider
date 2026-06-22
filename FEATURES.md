# Lumiere App — Complete Feature Inventory

> **Ce fichier documente TOUTES les fonctionnalités du site.**
> **Doit être mis à jour à chaque ajout/modification de fonctionnalité.**
> **Ne JAMAIS supprimer une fonctionnalité sans la documenter ici.**

---

## 1. Authentication & User Management

### Registration & Login
- Email/password registration with role selection
- URL param auto-select role (e.g. `?role=SCREENWRITER`)
- Custom welcome for screenwriters: "Devenez Scenariste"
- Credential-based login via NextAuth 5 (no PrismaAdapter — pure JWT + Credentials)
- JWT stateless sessions with type-safe callbacks (no more `as any` casts)
- Clickable demo login buttons (Admin + Contributeur) — gated behind `NEXT_PUBLIC_SHOW_DEMO` or dev mode
- Password visibility toggle (eye icon) on login and register forms
- Password reset via token (1h expiry, email link)
- Email verification with `verify:` prefix tokens (fixed in v8.2)
- Profile updates (name, bio, skills, languages, wallet address) with error handling
- Session callback type safety: defaults to CONTRIBUTOR/ROOKIE/false if token fields missing
- CREATOR role available at registration (in addition to SCREENWRITER, CONTRIBUTOR, etc.)

### Route Protection (Proxy)
- Centralized proxy (`src/proxy.ts`) for auth route protection (Next.js 16 — proxy.ts replaces middleware.ts)
- Protected paths: /dashboard, /tasks, /profile, /lumens, /notifications, /screenplays, /tokenization, /trailer-studio, /credits
- Admin paths: /admin (non-admin redirected to /dashboard)
- Auth paths: /login, /register, /forgot-password, /reset-password, /verify-email (redirect to /dashboard if logged in)
- Security headers applied to all responses
- Open redirect protection: callbackUrl validated as relative-only (no protocol-relative bypass)

### Security Hardening (v8.3)
- Cron endpoint: Blocked when CRON_SECRET not set, uses `timingSafeEqual` for timing-attack-safe comparison
- Zod validation on all 22 admin actions: input size limits, enum validation, CUID format checks
- Race condition prevention: `claimTaskAction` uses atomic WHERE clause (prevents double-claim)
- Rate limiting: Login (5/15min), Register (3/hr), Password reset (3/15min) via in-memory sliding window

### Accessibility (v8.3)
- Skip-to-content link (visible on Tab focus, gold styling)
- aria-labels on all icon-only buttons (header, sidebar, netflix-header)
- aria-current="page" on active sidebar navigation item
- role="alert" on all auth form error messages
- Error boundaries: root, public, dashboard, auth (dark+gold theme, retry button)
- Skeleton loading pages: dashboard, streaming, cinema (animated pulse)

### Roles
| Role | Description |
|------|-------------|
| ADMIN | Full platform access, film/task management |
| CONTRIBUTOR | Can claim and complete micro-tasks |
| ARTIST | Specialized creative contributor |
| STUNT_PERFORMER | Motion capture / stunt tasks |
| VIEWER | Watch films, vote in community |
| SCREENWRITER | Submit and manage screenplays |
| CREATOR | Content creator (videos, social media) |

### Levels & Progression
- ROOKIE → PRO → EXPERT → VIP
- Points-based progression via task completion
- Reputation system with score and badges
- Reputation events: deadline met, quality rating, collabs, etc.

---

## 2. Film Production Pipeline

### Film Management (Admin)
- Create films with auto-generated phases
- Set genre, catalog, status, budget, public visibility
- Track progress (totalTasks, completedTasks, progressPct)
- Cover image, synopsis, description
- **AI Task Generator**: Admin can auto-generate genre-specific tasks via Film Decomposer
  - 13 base tasks + genre-specific tasks (Sci-Fi, Action, Drama, Horror, etc.)
  - Budget-aware pricing, assigned to correct production phases

### Production Phases (auto-generated per film)
1. SCRIPT
2. STORYBOARD
3. DESIGN
4. ANIMATION
5. VFX
6. SOUND
7. EDITING
8. COLOR
9. FINAL

Each phase has: status (LOCKED/ACTIVE/COMPLETED), order, dependencies

### Micro-Tasks
- **Types**: PROMPT_WRITING, IMAGE_GEN, VIDEO_REVIEW, STUNT_CAPTURE, DANCE_CAPTURE, DIALOGUE_EDIT, COLOR_GRADE, SOUND_DESIGN, CONTINUITY_CHECK, QA_REVIEW, CHARACTER_DESIGN, ENV_DESIGN, MOTION_REF, COMPOSITING, TRANSLATION, SUBTITLE
- **Difficulty**: EASY (50EUR), MEDIUM (100EUR), HARD (100EUR), EXPERT (500EUR)
- **Lifecycle**: AVAILABLE → CLAIMED → SUBMITTED → VALIDATED/REJECTED
- AI score + feedback on submission
- Human validation by admin after AI review
- Time-based task reassignment possible
- Comments system per task

---

## 3. Community & Blockchain Voting

### Scenario Proposals
- Users submit story ideas (title, logline, synopsis, genre)
- **Status flow**: SUBMITTED → SHORTLISTED → VOTING → WINNER → ARCHIVED
- Admin shortlists proposals for voting phase
- Premium subscribers only can vote
- Prize pool distributed to winner via Lumens
- All votes recorded on blockchain (SHA-256 proof)

### Trailer Contests
- Admin creates contests (title, prize pool, dates)
- Users submit video trailer entries
- **Status flow**: UPCOMING → OPEN → VOTING → CLOSED
- Any user can vote on entries
- Vote tally determines winners
- Prize distribution: 1st=60%, 2nd=25%, 3rd=15%
- All votes + results recorded on blockchain

### Blockchain Proof System
- SHA-256 hash-based proofs for all on-chain events
- Events: VOTE_CAST, VOTE_TALLY, PRIZE_DISTRIBUTED, CONTEST_CLOSED, CONTENT_REGISTERED
- Stored in BlockchainEvent table
- Ready for Polygon/Base smart contract integration
- Chain configurable via BLOCKCHAIN_NETWORK env var

---

## 4. Tokenization & Investment

### Film Token Offerings
- Create token offerings per film
- Soft cap / hard cap fundraising
- Token price, total tokens, projected ROI
- **Status**: DRAFT → PENDING_LEGAL → OPEN → FUNDED → CLOSED → SUSPENDED
- Legal structures: IL_EXEMPT, IL_PROSPECTUS, IL_SANDBOX
- Risk levels: LOW, MEDIUM, HIGH, VERY_HIGH

### Token Purchase
- KYC verification required (kycRequired flag)
- Accredited-only option
- Anti-whale limits (maxTokensPerUser)
- Lockup periods (lockedUntil date)
- Purchase tracking with status

### Secondary Market
- Token transfers between users
- Price per token tracking
- Transaction hash recording

### Governance
- Token holders create proposals
- Types: CASTING, SCRIPT_CHANGE, BUDGET_REALLOC, DISTRIBUTION, PARTNERSHIP, OTHER
- Voting with token weight
- Quorum requirement (default 30%)
- Results: PASSED, REJECTED, CANCELLED

### Revenue & Dividends
- Film revenue tracking (STREAMING, THEATRICAL, MERCH, LICENSING, SYNDICATION)
- Dividend distribution by period
- Token holders receive proportional share

---

## 5. Streaming Platform

### Catalog
- Film submission to streaming catalog
- **Status**: PENDING → APPROVED → REJECTED → LIVE
- View tracking (watch duration, completion %)
- Revenue share percentage per film
- Tags for discovery

### Contracts
- Revenue share terms
- Exclusivity options
- **Status**: PENDING → SIGNED → EXPIRED

### Payouts
- Monthly creator payouts based on views
- Amount in EUR, status tracking

---

## 6. Creator Content System

### Creator Profiles
- Stage name, niche, description
- Style: FACE, NOFACE, HYBRID
- Voice type, automation level
- Social media links

### AI Video Generation
- Script-based video generation
- **Status**: DRAFT → GENERATING → READY → PUBLISHED
- Token cost tracking

### Multi-Platform Publishing
- Platforms: TIKTOK, INSTAGRAM, YOUTUBE, FACEBOOK, X
- Scheduled publishing
- Social account management (handle, access token, followers)

---

## 7. Collaboration System

### Collab Requests
- Types: SHOUTOUT, CO_CREATE, GUEST, AD_EXCHANGE
- Escrow token system
- **Status**: PENDING → ACCEPTED → COMPLETED → CANCELLED

### Video Orders
- Client → Creator workflow
- Briefing with requirements
- **Status**: OPEN → CLAIMED → IN_PROGRESS → REVIEW → DELIVERED → DISPUTED
- Price in tokens

---

## 8. AI Actors & Bonus Content

### AI Actors
- Name, slug, avatar, bio
- Style: VERSATILE, DRAMATIC, COMEDY, ACTION
- Personality traits array
- Film cast roles (LEAD, SUPPORTING, CAMEO)
- Similar actors discovery

### Bonus Content
- Types: INTERVIEW, DELETED_SCENE, BTS, MAKING_OF
- Can be premium-only
- Linked to film or catalog film
- Optional actor association

---

## 9. Admin Panel

### Film Management
- Create/edit films with all details
- Manage phases and their dependencies
- Create/assign tasks per phase

### Task Submission Review
- View AI score and feedback
- Validate or reject with human feedback
- Configurable AI confidence threshold

### AI Integration (Claude Haiku 4.5)
- **AI Synopsis Generator**: "Generer avec l'IA" button in scenario submission form
  - Auto-generates logline + synopsis from title + genre
  - User can edit generated content before submitting
- **AI Scenario Analysis**: auto-analyzes scenarios on submission (async, non-blocking)
  - Score (0-100), analysis text, 3 suggestions
  - Results displayed on scenario detail page (green/yellow/red score badge)
- **AI Task Review**: evaluates task submissions with contextual scoring
  - Score, feedback, verdict (AI_APPROVED / AI_FLAGGED)
  - Falls back to mock when API unavailable

### Contest Management
- Create/edit contests
- Shortlist proposals for voting
- Tally votes and select winners
- Distribute prizes (recorded on-chain)

### Platform Settings
- AI confidence threshold (default 70%)
- Max concurrent tasks per user
- Bitcoin payments enable/disable
- Maintenance mode toggle
- Lumen pricing and reward per task
- Email notifications enable/disable

### Admin Todos
- Priority: LOW, MEDIUM, HIGH, URGENT
- Due dates, completion tracking

### Analytics
- User engagement metrics
- Task completion stats
- Revenue reports
- Dashboard with charts (area, bar, donut, line, sparkline)

---

## 10. Payments & Currency

### Payment Methods
- Stripe (credit card)
- Lightning Bitcoin
- On-chain Bitcoin
- Lumen (virtual currency)

### Lumen System
- Internal virtual currency
- Earn via task completion
- Spend on platform features
- Transaction history tracking
- Balance displayed in header

---

## 11. Notifications
- In-app notification system
- Unread count in header bell icon
- Mark as read functionality
- API endpoint for real-time count

---

## 12. Public Pages
- **Cinema** (`/cinema`) — Main landing with stats, films, services
- **Films** (`/films`) — Browse all public films
- **Film Detail** (`/films/[slug]`) — Full film info, interactive timeline, tasks, tokenization, JSON-LD SEO
- **Streaming** (`/streaming`) — Browse streaming catalog
- **Actors** (`/actors`) — Browse AI actors
- **Actor Profile** (`/actors/[slug]`) — Actor details, filmography
- **Community Hub** (`/community`) — Scenarios & contests
- **About** (`/about`) — Company info, team, philosophy, pipeline, business model
- **Invest** (`/invest`) — Investor landing page, metrics, advantages, comparison table, timeline
- **Roadmap** (`/roadmap`) — Product roadmap
- **Leaderboard** (`/leaderboard`) — User rankings
- **Public Profiles** (`/users/[id]`) — Creator profile, stats, skills, contributions, scenarios
- **Legal** — Terms, privacy, cookies

---

## 13. Public Funding Tracking
- French grants: subvention, avance, prêt, crédit d'impôt
- Organism and eligibility tracking
- Step-by-step application process
- Document requirements per step

---

## 14. Screenplays
- Screenplay submission
- AI scoring and feedback
- Modification tolerance tracking
- Status management

---

## 15. Netflix-Style Homepage (2026-02-24)

### Hero Banner
- Full-viewport auto-rotating film carousel (65-92vh responsive)
- Animated progress bar per slide with auto-advance (8s)
- Pause on hover, manual navigation arrows + dot navigation
- Cinematic multi-layer gradient overlays (left, bottom, top vignette)
- Film grain texture overlay
- Genre badge with gold accent line
- Action buttons: "Decouvrir" (gold gradient) + "Plus d'infos" (frosted glass)
- Smooth crossfade animation with framer-motion

### Film Rows
- Horizontal scrolling film card carousel
- Card features: 2:3 aspect ratio posters, rounded-xl, ring border, hover glow
- Status badges (colored by status) always visible
- Hover overlay: play button (gold gradient), title, genre, progress bar
- Scroll arrows appear on row hover
- Categories: Top 10, Notre Selection, En Production, Streaming, Genres, En Dev

### Top 10 Row
- Large overlapping numbered rankings (90-150px)
- Gold text-stroke numbers with drop shadow
- Poster overlaps number with negative margin
- Play button and film info on hover

### Creator Bar
- 4 interactive cards: Ecrire, Voter, Concours, Produire
- Background images with dark overlay + gradient per type
- Icon, title, description, CTA arrow on hover
- Top accent line + bottom border glow on hover
- Staggered animation on scroll into view

### Screenwriter CTA Section (NEW)
- "100 Scenaristes. Un Film." recruitment banner
- Benefits grid: Ecrivez, Communaute, Production, Blockchain
- Stats bar: 100 places, 1 film produit, royalties on-chain infini
- Motion animations on scroll
- CTA: "Candidater maintenant" linking to /register?role=SCREENWRITER

### Netflix Header
- Fixed, transparent → solid on scroll with backdrop blur
- Logo + 6 navigation links (Accueil, Films, Streaming, Communaute, Acteurs, Classement)
- Search icon, notifications, Lumens balance, user dropdown
- Mobile hamburger menu with slide-down animation
- Gold accent on active link

### Premium Footer
- 12-column grid layout (Brand, Plateforme, Contribuer, Legal)
- Lucide icons in navigation links
- Gold accent top line
- "Powered by Next.js, Claude AI, Blockchain" bar
- Cities: Paris, Tel Aviv, Hollywood

---

## 16. Consistent Design System

### Spacing
- All sections: `px-8 md:px-16 lg:px-20` (consistent horizontal padding)
- Section gaps: `mb-12 md:mb-16`
- Content max-width enforced via max-w-2xl on hero text

### Typography
- Headlines: Playfair Display, font-black, tracking-tight
- Body: Inter, text-white/45-90 for contrast hierarchy
- Sizes: 10px (labels) → 13px (body) → 2xl-5rem (hero titles)

### Colors
- Background: #0A0A0A (near-black)
- Gold primary: #D4AF37 (accent), #F0D060 (light), #8B6914 (dark)
- Status: Green (#10B981), Blue (#60A5FA), Purple (#A78BFA), Gray (#6B7280)
- Text: white with opacity scale (15-90%)

### Effects
- Card hover: scale 1.06, ring-[#D4AF37]/30, shadow
- Gradient buttons: linear-gradient(135deg, #D4AF37, #F0D060, #D4AF37)
- Frosted glass: backdrop-blur-xl + bg-white/8
- Transitions: 300-500ms, ease [0.25, 0.1, 0.25, 1]

---

## 17. SEO & Structured Data
- **Metadata**: Dynamic titles, descriptions, OpenGraph, Twitter Cards per page
- **Sitemap**: Dynamic XML sitemap with static + film pages (`src/app/sitemap.ts`)
- **Robots.txt**: Allows public pages, blocks /admin/, /dashboard/, /api/ (`src/app/robots.ts`)
- **JSON-LD**: Organization schema on homepage, Movie schema on film detail pages
- **OpenGraph images**: Film cover images in og:image for social sharing

---

## 18. Deployment & Infrastructure
- **Docker multi-stage build**: deps → builder → runner (node:20-alpine)
- **Build-safe Prisma**: Lazy Proxy singleton, never connects at build time
- **Dockerfile**: Dummy DATABASE_URL during build, real env at runtime
- **Coolify**: Self-hosted on Hetzner (188.245.182.200), Traefik reverse proxy
- **force-dynamic**: All 52 Prisma-using pages marked for runtime rendering
- **Standalone output**: Next.js standalone mode for Docker deployment
- **Healthcheck**: curl-based Docker healthcheck on port 3000

---

## 19. Search System
- **Search Overlay** (`src/components/search-overlay.tsx`): Ctrl+K keyboard shortcut
- **Expandable search bar** in Netflix header (replaces static icon)
- **Real-time results** with 300ms debounce across 3 categories:
  - Films (title, genre, description) — public only
  - Tasks (title, description) — available only
  - Users (displayName, email) — all users
- **Server action** (`src/app/actions/search.ts`): Prisma parallel queries
- **Navigation**: Click any result to navigate to detail page

---

## 20. Screenwriter Dashboard
- **Dedicated page** (`/dashboard/screenwriter`): Full scenario management
- **Stats grid**: Total scenarios, total votes, average AI score, winners count
- **Voting alert**: Gold banner when scenarios are in active voting phase
- **Scenario list**: Status badges, AI scores, vote counts, creation dates, loglines
- **Status tracking**: SUBMITTED → SHORTLISTED → VOTING → WINNER → ARCHIVED
- **Tips section**: Best practices for writing good scenarios
- **Dashboard link**: Banner on main dashboard for SCREENWRITER and ADMIN roles

---

## 21. Film Production Timeline
- **Interactive component** (`src/components/film-timeline.tsx`)
- **Desktop horizontal bar**: Phase dots on progress track with status colors
- **Expandable vertical list**: Click phases to see tasks with prices and status
- **Task status dots**: Green (validated), gold (available), blue (claimed)
- **Phase indicators**: Completed (green checkmark), Active (gold pulse), Locked (gray lock)
- **Replaces** static phase display on film detail pages

---

## 22. Badge & Achievement System
- **13 badges** across 4 categories (`src/lib/achievements.ts`)
- **Contribution**: Premiere Lumiere (1st task), Marathonien (10), Centurion (100), Polyvalent (5 types)
- **Quality**: Perfectionniste (95%+ AI x3), Regulier (10 on-time), Zero Rejet (20 no rejections)
- **Community**: Scenariste (1st scenario), Scenariste Star (winner), Votant (5 votes), Parrain (3 referrals)
- **Special**: Early Adopter (first 100 users), Investisseur (token purchase)
- **Auto-award** triggers integrated in admin.ts, community.ts, referral.ts
- **BadgeShowcase component** (`src/components/badge-showcase.tsx`) — compact row or full grid
- **Displayed** on private profile page and public user profiles
- **Notifications** sent when a badge is earned

---

## 23. Referral System
- **Server actions** in `src/app/actions/referral.ts`
- `getReferralCode()` — Generates unique code (LUM-XXXXXX-XXXXX)
- `applyReferralCode()` — Links new user to referrer (PENDING status)
- `completeReferral()` — Awards 30 Lumens to referrer + 10 to referred user
- `getReferralStats()` — Returns referral count, completed count, total earnings
- **Dashboard page** at `/dashboard/referral` with:
  - How-it-works section (3 steps)
  - Copyable referral code and share link
  - Stats grid (total, active, Lumens earned)
  - Referral list with status indicators
- **Dashboard banner** linking to referral page on main dashboard
- **Lumen transactions** created for both parties
- **Notifications** sent to both referrer and referred

---

## 24. Level Progress Visualization
- **LevelProgress component** (`src/components/level-progress.tsx`)
- **4 levels**: ROOKIE (0 pts) → PRO (500) → EXPERT (2500) → VIP (10000)
- **Progress bar** showing current position within level range
- **Distance indicator** showing points needed for next level
- **Milestone markers** for all 4 levels
- **Compact mode** for inline use (just bar + labels)
- **Full mode** with detailed card view
- **Integrated** in private profile page (light theme) and public profiles (dark theme)

---

## 25. AI Task Description Enrichment
- **Server action** `enrichTaskDescriptionAction` in `src/app/actions/ai.ts`
- **Admin-only** — Uses Claude Haiku 4.5 to enhance task descriptions
- **Generates**: description, instructions, deliverables, quality criteria
- **Context-aware**: Uses task title, type, film genre, film title
- **JSON output** structured for direct use in task creation forms

---

## 26. Task Recommendation Engine
- **Server action** `getRecommendedTasks()` in `src/app/actions/recommendations.ts`
- **Skill-to-task-type mapping**: 16 user skills mapped to matching task types
  - e.g. "Image Generation" → IMAGE_GEN, CHARACTER_DESIGN, ENV_DESIGN
  - e.g. "QA / Review" → QA_REVIEW, CONTINUITY_CHECK, VIDEO_REVIEW
- **Difficulty filtering** by user level:
  - ROOKIE: EASY, MEDIUM | PRO: EASY, MEDIUM, HARD | EXPERT/VIP: MEDIUM, HARD, EXPERT
- **Scoring algorithm**: skill match (+10), previously completed type (+5), pay rate (+1 per 50€)
- **Returns** top 6 recommendations with: title, type, difficulty, price, film info, match score
- **Dashboard integration**: "Recommande pour vous" section with gold MATCH badges on skill-matched tasks
- **Fallback**: Shows nothing gracefully if no tasks available

---

## 27. Lumen Analytics
- **Stats cards** on Lumens page (`/lumens`) below balance card
- **4 metrics computed** from transaction history:
  - Total earned (green) — sum of positive transactions
  - Total spent (red) — sum of negative transactions
  - Task rewards (gold) — TASK_REWARD type transactions
  - Bonuses (purple) — BONUS type transactions
- **Color-coded cards** with matching icons (TrendingUp, TrendingDown, Sparkles, Coins)
- **Only shown** when user has at least one transaction

---

## 28. Notification Type Filters
- **URL-based filtering** on notifications page (`/notifications?type=TASK_VALIDATED`)
- **Filter pills**: Toutes, Validees, Rejetees, Paiements, Niveaux, Systeme
- **Active filter** highlighted with gold accent (`bg-[#D4AF37]/10 text-[#D4AF37]`)
- **Inactive filters** in subtle gray with hover state
- **Grouped by date**: Aujourd'hui, Hier, Plus ancien — groups with 0 items hidden

---

## 29. Leaderboard → Public Profiles Link
- **Clickable ranking rows** on leaderboard page (`/leaderboard`)
- Each row links to the user's public profile (`/users/{id}`)
- **Gold hover effect** on rows (`hover:border-[#D4AF37]/20`)
- **Top 3 podium** remains static cards; ranks 4+ are interactive links

---

## 30. Task Dependencies (DAG)
- **Dependency validation** in `claimTaskAction` (`src/app/actions/tasks.ts`)
- Tasks with `dependsOnIds` can only be claimed when all dependencies are VALIDATED
- **Phase gate**: task's phase must be ACTIVE (not LOCKED) to allow claiming
- **Enables**: sequential production pipeline where tasks unlock in order
- **Backward-compatible**: tasks with empty `dependsOnIds` array work as before

---

## 31. Automated Cron Maintenance
- **API endpoint** `GET /api/cron?key=CRON_SECRET` (`src/app/api/cron/route.ts`)
- **3 automated tasks**:
  1. **Expired task release**: CLAIMED tasks past 48h deadline → reset to AVAILABLE + notify user
  2. **Contest auto-close**: VOTING contests past endDate with autoClose=true
  3. **Phase auto-complete**: when ALL tasks in an ACTIVE phase are VALIDATED → complete phase, unlock next, update film progress
- **Secured** with CRON_SECRET env var
- **Returns** JSON with counts of each action taken
- Callable by Coolify cron, external service, or manually

---

## 32. Admin Payments CSV Export
- **API endpoint** `GET /api/admin/export-payments` — admin-only
- **CSV columns**: Date, Utilisateur, Email, Film, Tache, Montant EUR, Methode, Statut, Date Paiement, ID
- **Proper escaping**: quotes in fields handled with double-quote CSV convention
- **Dynamic filename**: `lumiere-paiements-YYYY-MM-DD.csv`
- **Export button** added to admin payments page with Download icon

---

## 33. Contributor Earnings Dashboard
- **Page** at `/dashboard/earnings` (`src/app/(dashboard)/dashboard/earnings/page.tsx`)
- **Stats cards**: total earned, pending amount, completed payments count, Lumen balance
- **Monthly revenue chart**: bar graph of last 6 months with gold gradient
- **Payment history list**: each payment with task info, film, amount, date, status badge
- **Status labels**: Paye (green), En attente (yellow), En cours (blue), Echoue (red)
- **Empty state**: CTA linking to task marketplace
- **Dashboard banner**: earnings link on main dashboard with green gradient

---

## 34. Monthly Themed Contests
- **12 monthly themes** defined in `src/app/actions/community.ts`:
  - Jan: Nouveau Depart | Fev: Amour & Connexion | Mar: Femmes de Cinema
  - Avr: Nature & Environnement | Mai: Travail & Passion | Jun: Musique & Rythme
  - Jul: Aventure Estivale | Aou: Science-Fiction | Sep: Rentree des Createurs
  - Oct: Frissons & Mystere | Nov: Memoire & Heritage | Dec: Lumiere & Espoir
- **`createMonthlyContestAction`**: admin action, 1-click contest creation
- **Duplicate prevention**: checks if contest already exists for current month
- **Default config**: 500 EUR prize pool, 60/25/15% distribution, auto-close enabled
- **Integrated** with existing trailer contest system (entries, votes, prize distribution)

---

## 35. Redis Cache & Performance
- **`getCached()`** from `src/lib/redis.ts` applied to high-traffic public pages:
  - Films hero stats (filmsCount, tasksCount, contributorsCount) — 5 min TTL
  - Leaderboard top 50 users — 2 min TTL
  - Leaderboard global stats (users, tasks, paid) — 5 min TTL
  - Community stats (votes, scenarios, contests, entries) — 3 min TTL
- **Graceful degradation**: if Redis unavailable, falls back to direct Prisma query
- **No user impact**: cache-miss still returns fresh data, just slightly slower
- **Significant load reduction** on PostgreSQL for frequently-accessed public pages

---

## 36. Emails Transactionnels (Resend)
- **Service**: `src/lib/email.ts` — wrapper Resend avec graceful degradation
- **6 templates HTML** avec layout dark/gold brand-matching:
  - `sendWelcomeEmail()` — bienvenue après inscription
  - `sendPasswordResetEmail()` — lien de reset (1h expiry)
  - `sendTaskValidatedEmail()` — tâche validée + montant crédité
  - `sendPaymentEmail()` — paiement envoyé + montant
  - `sendScreenplayAcceptedEmail()` — scénario accepté + deal proposé
  - `sendWeeklyDigest()` — résumé hebdomadaire (tâches, Lumens, films)
- **Intégré** dans auth.ts (register, reset), admin.ts (task validation, payment), screenplays.ts (deal)
- **Fallback dev**: si pas de RESEND_API_KEY, log en console (pas d'erreur)

---

## 37. Deal Automatisé Scénarios
- **Contrat complet**: `generateScreenplayDeal()` dans `src/lib/contracts.ts`
- **8 articles**: droits cédés, rémunération (%), crédit au générique, modifications, garanties, résiliation
- **Bonus festival**: +500€ si sélectionné (Cannes, Berlin, Venice, Toronto, Sundance)
- **Bonus 100K vues**: +200€ si le film dépasse 100 000 vues
- **Credit types**: sole writer, co-written, story-by
- **Production deadline**: 24 mois pour entrer en production, sinon droits reviennent à l'auteur
- **Action admin**: `generateScreenplayDealAction` — génère deal pour scénario accepté
- **Notifications**: email + in-app + blockchain event

---

## 38. Monitoring Sentry
- **Instrumentation**: `src/instrumentation.ts` — hook Next.js auto-chargé
- **Error boundary**: `src/app/global-error.tsx` — capture erreurs globales
- **Dynamic import**: Sentry ne charge que si `NEXT_PUBLIC_SENTRY_DSN` est défini
- **Server errors**: `onRequestError` capture les erreurs côté serveur
- **Zero overhead**: aucun impact perf si pas configuré
- **Config**: tracesSampleRate 0.1 en prod, 1.0 en dev

---

## 39. Video Player Component
- **Fichier**: `src/components/video-player.tsx`
- **Features**: play/pause, volume, mute, fullscreen, seek, skip ±10s
- **Sous-titres**: support tracks .vtt/.srt multi-langues
- **Raccourcis clavier**: Space/K (play), F (fullscreen), M (mute), flèches (seek)
- **Auto-hide**: contrôles disparaissent après 3s d'inactivité
- **Callbacks**: onProgress(%), onComplete pour analytics
- **Design**: gold-themed controls matching le design system

---

## 40. Système de Facturation
- **Génération**: `src/lib/invoices.ts` — factures Markdown légales
- **Format français**: SIRET, TVA intracommunautaire, auto-liquidation Art. 283-2 CGI
- **Numérotation séquentielle**: LB-YYYY-MMDD-XXXXXX
- **API download**: `GET /api/invoices?paymentId=xxx` — Markdown à télécharger
- **Sécurité**: propriétaire du paiement ou admin uniquement
- **Dashboard**: bouton "Facture" visible sur chaque paiement COMPLETED dans /dashboard/earnings
- **Blockchain**: event PAYMENT_COMPLETED enregistré à chaque paiement

---

## 41. File Upload Service (S3-Compatible)
- **Service**: `src/lib/upload.ts` — presigned URL generation pour uploads directs client-to-bucket
- **5 catégories**: video, image, document, subtitle, audio
- **Validation**: MIME types par catégorie, taille max 500MB
- **S3-compatible**: AWS S3, Cloudflare R2, Supabase Storage, MinIO
- **Presigned PUT URL**: le client upload directement sur le bucket (bypass serveur)
- **Dev fallback**: URL locale via API route (`/api/upload`)
- **API route**: `src/app/api/upload/route.ts` — stockage local dans `public/uploads/` en dev
- **Composant client**: `src/components/file-upload.tsx`
  - Drag & drop zone avec icônes par catégorie
  - Barre de progression circulaire (SVG)
  - Validation des types de fichiers côté client
  - XHR upload avec suivi de progression pour presigned URLs
  - Callbacks: onUploadComplete(fileKey, publicUrl), onError

---

## 42. Subtitle Management
- **Server actions**: `src/app/actions/subtitles.ts`
- **12 langues supportées**: fr, en, es, de, it, pt, ar, zh, ja, ko, ru, he
- **Validation**: `validateSubtitleContent()` détecte format VTT/SRT, compte les cues
- **Conversion automatique**: `srtToVtt()` convertit SRT→WebVTT (virgule→point dans timecodes)
- **Stockage**: `addSubtitleAction()` stocke les sous-titres dans les tags du film (pas de changement de schéma)
- **Extraction**: `extractSubtitleTracks()` extrait les données pour le composant VideoPlayer
- **Intégré** avec le VideoPlayer pour l'affichage multi-langues

---

## 43. Book-to-Screen Pipeline (Éditions Ruppin)
- **Server actions**: `src/app/actions/book-to-screen.ts`
- **Analyse d'adaptation**: `analyzeBookForAdaptation()` score sur 4 axes:
  - Potentiel visuel (0-100)
  - Densité de dialogues (0-100)
  - Structure narrative (0-100)
  - Appel marché (0-100)
- **Estimation budget**: LOW (<25K€), MEDIUM (25K-100K€), HIGH (>100K€)
- **Format recommandé**: SHORT (<30min), FEATURE (30min-2h+), SERIES (multi-épisode)
- **Outline automatique**: structure en 3 actes (Set-up, Confrontation, Resolution)
- **Soumission**: `submitBookForAdaptationAction()` crée un scénario à partir des métadonnées du livre
- **Tags**: genre, format recommandé, langue automatiquement ajoutés

---

## 44. Système d'Abonnements
- **Page pricing**: `src/app/(public)/pricing/page.tsx` — 3 plans avec comparaison
- **Plans**:
  | Plan | Prix | Qualité | Écrans | Offline | Pubs |
  |------|------|---------|--------|---------|------|
  | Free | 0€ | 720p | 1 | Non | Oui |
  | Basic | 4.99€/mois | 1080p | 2 | 5 films | Non |
  | Premium | 9.99€/mois | 4K HDR | 4 | Illimité | Non |
- **Server actions**: `src/app/actions/subscriptions.ts`
  - `subscribeToPlanAction(planId)` — active l'abonnement
  - `getUserSubscription()` — retourne plan actuel + vérification expiration
  - `cancelSubscriptionAction()` — annule l'abonnement
- **Type explicite**: `UserSubscription` — type TypeScript dédié pour les données d'abonnement retournées
- **Stripe-ready**: préparé pour intégration Stripe Checkout, fonctionne sans Stripe en attendant
- **Design**: cards avec badges "Populaire" / "Pro", gradient gold pour le plan Premium

---

## 45. Stripe Connect Integration
- **Server actions**: `src/app/actions/stripe.ts`
- **Checkout**: `createCheckoutSessionAction(planId)` — crée session Stripe Checkout
- **Payout**: `createPayoutAction(paymentId)` — paiement admin vers contributeur via Connect
- **Auto-payment**: `generateAutoPayment(taskId, userId, amount, filmId)` — paiement auto à validation
- **Connect onboarding**: `createConnectOnboardingAction()` — KYC contributeur sur Stripe
- **Status**: `getStripeStatusAction()` — mode (live/test/disabled), connexion utilisateur
- **Webhook**: `src/app/api/stripe/webhook/route.ts`
  - `checkout.session.completed` → active abonnement
  - `invoice.payment_succeeded` → renouvellement
  - `invoice.payment_failed` → suspension
  - `account.updated` → mise à jour Connect
- **Graceful degradation**: mode mock si pas de clés Stripe (log + activation directe)

---

## 46. FFmpeg Transcoding Pipeline
- **Service**: `src/lib/transcoding.ts`
- **4 profils de qualité**:
  | Profil | Résolution | Bitrate vidéo | Bitrate audio | FPS |
  |--------|-----------|---------------|---------------|-----|
  | 360p (SD) | 640×360 | 800k | 96k | 30 |
  | 720p (HD) | 1280×720 | 2500k | 128k | 30 |
  | 1080p (Full HD) | 1920×1080 | 5000k | 192k | 60 |
  | 4K (Ultra HD) | 3840×2160 | 15000k | 256k | 60 |
- **HLS output**: segments de 6s, H.264 High profile, AAC audio
- **Master playlist**: fichier `.m3u8` avec toutes les qualités pour adaptive streaming
- **`buildFFmpegArgs()`**: génère la commande FFmpeg complète
- **`startTranscodingAction()`**: admin lance le transcoding, retourne la commande
- **`setFilmHlsUrl()`**: mise à jour du film avec URL HLS après transcoding

---

## 47. Notifications Temps Réel (SSE)
- **SSE endpoint**: `src/app/api/notifications/stream/route.ts`
- **Events**:
  - `connected` — confirmation connexion (userId, timestamp)
  - `notification` — nouvelle notification (id, type, title, body, href)
  - `count` — nombre de non-lues mis à jour
  - Heartbeat pour maintenir la connexion
- **Polling**: vérifie les nouvelles notifications toutes les 5 secondes
- **Hook React**: `src/hooks/use-notifications.ts`
  - `useNotifications({ enabled, onNotification })` → `{ unreadCount, notifications, connected }`
  - Auto-reconnexion avec backoff exponentiel (max 5 tentatives)
  - Fallback: fetch initial du compteur via REST
- **Sécurité**: authentification vérifiée côté serveur, nettoyage sur déconnexion

---

## 48. Smart Contract Interfaces (Polygon/Base)
- **Fichier**: `src/lib/smart-contracts.ts`
- **4 contrats définis** (types TypeScript + ABI):
  1. **FilmToken (ERC-20)** — tokens de co-production par film
     - mint, transfer, approve, distributeRevenue, claimDividend
  2. **FilmNFT (ERC-721)** — NFT preuve de contribution
     - mintContribution (filmId, taskId, taskType, metadata)
  3. **Governance** — votes token-weighted
     - createProposal, castVote, executeProposal
  4. **Payments** — paiements automatiques + escrow
     - createEscrow, releasePayment, batchRelease
- **Multi-chain**: Polygon (137), Polygon Amoy (80002), Base (8453), Base Sepolia (84532)
- **Helpers**: `getActiveChain()`, `getContractAddresses()`, `isContractsDeployed()`
- **Explorer**: `getExplorerTxUrl()`, `getExplorerAddressUrl()`
- **Migration**: hash-based proofs actuels → vrais smart contracts quand déployés

---

## 49. Documentation Technique
- **SECURITY.md** — Politique de sécurité complète:
  - Auth, RBAC, password policy, route protection
  - RGPD compliance, encryption, data protection
  - API security (Zod, rate limiting, CORS)
  - Infrastructure (Docker, non-root, secrets)
  - Incident response, monitoring, checklist
- **DEPLOYMENT.md** — Guide de déploiement:
  - Architecture (Cloudflare → Traefik → Next.js + Redis + PostgreSQL)
  - Coolify step-by-step (6 étapes)
  - Docker Compose alternative
  - Dockerfile expliqué (3 stages)
  - Cron jobs, monitoring, troubleshooting, backup
- **CONTRIBUTING.md** — Guide du contributeur:
  - Quick start (5 commandes)
  - Project structure
  - Golden rules, code style, design system
  - Workflow (branches, commits, PRs)
  - Common tasks, known pitfalls

## 50. Audit Visuel Complet
- **60+ corrections** sur 12 fichiers (auth, Netflix components, pages publiques)
- Responsive mobile: padding px-4 sm:px-8 sur toutes les sections
- Reset password form redesigné (gold button, h-12 inputs, labels cohérents)
- Hero banner: flèches de navigation visibles sur mobile
- Top Ten Row: taille des chiffres adaptée au mobile
- Film Row, Creator Bar, Streaming: responsive grid/gap/typography
- Toutes les pages testées tsc --noEmit = 0 erreurs

## 51. Progressive Web App (PWA)
- `public/manifest.json` enrichi (shortcuts, categories, orientation)
- `manifest` lié dans metadata de layout.tsx
- Meta tags: theme-color, apple-mobile-web-app-capable, mobile-web-app-capable
- `public/sw.js` — Service worker:
  - Cache-first pour assets statiques (images, fonts, CSS, JS)
  - Network-first pour pages (fallback offline vers cache)
  - Nettoyage automatique des anciens caches
- `src/hooks/use-service-worker.ts` — Hook d'enregistrement
- `src/components/layout/sw-register.tsx` — Composant d'initialisation

## 52. Analytics Avancées (Admin)
- `getAnalyticsOverview()` dans `src/app/actions/analytics.ts`
- Métriques: utilisateurs (total, 30j, 7j, vérifiés), films, tâches, scénarios
- Croissance quotidienne (30 jours), distribution des rôles
- Revenue par jour, top 10 contributeurs
- Taux de complétion des tâches, taux d'approbation scénarios

## 53. API REST Publique v1
- `GET /api/v1/films` — Liste films publics (pagination, filtres genre/status, tri)
- `GET /api/v1/films/:id` — Détail film par ID ou slug (phases, compteurs)
- `GET /api/v1/stats` — Stats plateforme (cache Redis 5min)
- `GET /api/v1/contributors` — Leaderboard contributeurs (pagination)
- Toutes les routes avec `force-dynamic`

## 54. Admin Analytics Dashboard UI
- Page `/admin/analytics` enrichie avec `getAnalyticsOverview()` action
- 6 cartes KPI avec sparklines: Utilisateurs, Films, Tâches, Scénarios, Revenus, Engagement
- Graphique croissance utilisateurs (30 jours, LineChart)
- Graphique revenus quotidiens (30 jours, AreaChart)
- Distribution des rôles (DonutChart), niveaux, difficulté
- Top 10 contributeurs avec classement et badges
- Pipeline tâches avec barre de progression de complétion
- Tâches par type (BarChart), taux de succès par difficulté

## 55. Page Documentation API Développeurs
- Page `/developers` avec documentation interactive API REST v1
- Cards endpoint avec badges méthode (GET), tables paramètres, exemples JSON
- Section Quick Start: JavaScript/TypeScript et cURL
- Documentation rate limiting et format erreurs
- Design cohérent avec le thème dark/gold

## 56. Internationalisation (i18n) — Infrastructure
- `next-intl` 4.8.3 intégré en mode "sans routing i18n"
- Fichiers traductions: `messages/fr.json` et `messages/en.json`
- Configuration: `src/i18n/config.ts` (locales: fr, en)
- Requête serveur: `src/i18n/request.ts` (lecture cookie locale)
- Action serveur: `src/app/actions/locale.ts` (switch locale via cookie)
- Composant sélecteur: `src/components/layout/locale-switcher.tsx` (drapeaux + noms)
- `NextIntlClientProvider` dans root layout avec détection dynamique
- Header Netflix traduit: navigation, dropdown, menu mobile
- `next.config.ts` mis à jour avec `createNextIntlPlugin`

## 57. Route Protection (Proxy — Next.js 16)
- `src/proxy.ts` — Protection routes via proxy (Next.js 16, remplace middleware.ts)
- Routes protégées: /dashboard, /tasks, /profile, /lumens, /notifications, /screenplays, /tokenization
- Routes admin: /admin (non-admin redirigé vers /dashboard)
- Routes auth: /login, /register, /forgot-password, /reset-password, /verify-email (redirige vers /dashboard si connecté)
- Security headers appliqués sur chaque réponse (CSP, HSTS, X-Frame-Options, etc.)
- Pattern: `export async function proxy(req: NextRequest) { ... }` avec getToken JWT

## 58. Navigation Améliorée
- Header Netflix redesigné avec split navigation:
  - Liens principaux toujours visibles: Accueil, Films, Streaming, Voter
  - Menu "Plus" dropdown: Acteurs, Classement, A propos, Tarifs, Roadmap, Investir, API
  - Icônes Lucide pour chaque lien secondaire
  - Menu mobile: tous les liens avec séparation visuelle
- Footer enrichi: liens Roadmap, Tarifs, API Développeurs ajoutés
- Nouvelles clés i18n: about, roadmap, pricing, developers, invest, more

## 59. UX: Loading States & 404
- `src/app/loading.tsx` — Spinner gold plein écran (route racine)
- `src/app/(public)/loading.tsx` — Spinner pages publiques
- `src/app/(dashboard)/loading.tsx` — Spinner dashboard
- `src/app/not-found.tsx` — Page 404 cinéma (Film icon, "Cette scène n'existe pas encore")
- Boutons retour accueil et voir nos films

## 60. Roadmap: Indicateurs de Complétion
- Badges statut proéminents: "✓ Fait" (vert), "⏳ En cours" (gold), "○ A faire" (gris)
- Items terminés en texte vert (au lieu de barré)
- Badges difficulté et notes en ligne séparée sous description
- V8-7 (Loading & 404) ajouté au roadmap

## 61. Tests Unitaires (Vitest)
- **Configuration**: `vitest.config.ts` avec aliases `@/` → `src/`
- **5 suites de tests** (85 tests total, 100% passing):
  - `src/__tests__/lib/utils.test.ts` — 34 tests: slugify, formatPrice, getProgressColor, truncate, getInitials, color helpers
  - `src/__tests__/lib/reputation.test.ts` — 16 tests: calculateReputationScore, getBadgeForScore, REPUTATION_WEIGHTS sum, badges ordering
  - `src/__tests__/lib/invoices.test.ts` — Tests: generateInvoiceNumber format, generateInvoice content (header, amounts, TVA), buildInvoiceData, PLATFORM_INFO
  - `src/__tests__/lib/film-decomposer.test.ts` — 14 tests: token decomposition, budget sum tolerance, genre-specific tasks, timeline sequential, risk assessment
  - `src/__tests__/lib/rate-limit.test.ts` — 6 tests: allows first request, maxAttempts, blocks after exceeded, per-identifier tracking, reset, retryAfterSeconds
- **Scripts npm**: `test`, `test:watch`, `test:coverage` (v8 provider)
- **Stratégie**: tests de fonctions pures uniquement, pas de mocking DB/Redis

## 62. CI/CD GitHub Actions
- **Fichier**: `.github/workflows/ci.yml`
- **Trigger**: push ou PR sur main
- **3 jobs**:
  1. `lint-and-typecheck` — `npx tsc --noEmit`
  2. `test` — `npx vitest run --reporter=verbose`
  3. `build` — `npm run build` (dépend des 2 précédents)
- **Node 20** avec cache npm pour rapidité
- **Prisma generate** avant chaque job
- **Build env**: dummy `DATABASE_URL` + `AUTH_SECRET` + `SKIP_ENV_VALIDATION`

## 63. Rate Limiting
- **Fichier**: `src/lib/rate-limit.ts`
- **Implémentation**: Sliding window in-memory (Map-based)
- **3 limiteurs pré-configurés**:
  | Limiter | Max tentatives | Fenêtre | Utilisation |
  |---------|---------------|---------|-------------|
  | loginLimiter | 5 | 15 min | loginAction |
  | registerLimiter | 3 | 1 heure | registerAction |
  | passwordResetLimiter | 3 | 15 min | forgotPasswordAction |
- **Identification**: IP via `x-forwarded-for` / `x-real-ip` + email
- **Auto-cleanup**: Nettoyage des entrées expirées toutes les 5 minutes
- **API**: `check(identifier)` → `{ allowed, remaining, retryAfterSeconds }`
- **Reset**: `reset(identifier)` pour libérer après succès

## 64. Security Headers
- **Fichier**: `src/lib/security-headers.ts`
- **Headers appliqués** sur chaque réponse via proxy.ts:
  | Header | Valeur |
  |--------|--------|
  | Content-Security-Policy | default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https://api.resend.com |
  | Strict-Transport-Security | max-age=63072000; includeSubDomains; preload |
  | X-Frame-Options | DENY |
  | X-Content-Type-Options | nosniff |
  | Permissions-Policy | camera=(), microphone=(), geolocation=() |
  | Referrer-Policy | strict-origin-when-cross-origin |
  | X-XSS-Protection | 1; mode=block |
  | X-DNS-Prefetch-Control | on |
- **Application**: `addSecurityHeaders()` dans proxy.ts, couvre redirections et réponses normales

## 65. Email Verification
- **Action**: `resendVerificationAction()` dans `src/app/actions/auth.ts`
- **Flow**: inscription → email de bienvenue avec prompt de vérification
- **Modèle Prisma**: `EmailVerification` — token unique, expiration, lié au userId
- **Page dédiée**: `/verify-email` — vérifie le token et active le compte
- **Rate limited**: 3 renvois max par 15 min (via passwordResetLimiter)
- **Auth-gated**: seuls les utilisateurs connectés peuvent re-demander
- **Login check**: avertissement si `isVerified === false` (soft, pas bloquant)
- **Champ DB**: `isVerified` dans modèle User (existait déjà)

---

## 66. Gestion Abonnement (Cancel Subscription)
- **Page**: `/dashboard/subscription` — gestion complète de l'abonnement
- **Affiche**: plan actuel (Free/Basic/Premium), statut, prix, dates
- **Actions**: annulation (CancelButton), lien vers upgrade
- **Détails plan**: qualité max, films/mois, downloads, features
- **États**: actif (vert), annulé (rouge avec notice), expiré (gris)
- **Bannière upgrade**: pour les utilisateurs gratuits avec liens vers plans payants
- **Server actions**: `cancelSubscriptionAction()`, `getUserSubscription()`

## 67. Historique de Visionnage (Watch History)
- **Fichier**: `src/app/actions/watch-history.ts`
- **Actions**:
  - `recordWatchProgressAction()` — enregistre la progression de visionnage
  - `getWatchHistoryAction()` — historique des films vus
  - `getContinueWatchingAction()` — films en cours (0 < progress < 95%)
  - `markAsWatchedAction()` — marquer comme vu
- **Stockage**: via modèle `FilmView` (userId, filmId, watchDuration, completionPct)

## 68. Watchlist / Ma Liste
- **Fichier**: `src/app/actions/watchlist.ts`
- **Modèle Prisma dédié**: `Watchlist` — relation userId + filmId avec contrainte unique
- **Actions**:
  - `addToWatchlistAction()` — ajouter un film à la liste personnelle
  - `removeFromWatchlistAction()` — retirer un film de la liste
  - `getWatchlistAction()` — liste complète avec détails des films (titre, slug, coverImage, genre, status)
  - `isInWatchlistAction()` — vérifier si un film est dans la watchlist

## 69. Film Reviews & Ratings
- **Server actions**: `src/app/actions/reviews.ts`
  - `submitReviewAction()` — soumettre un avis (1-5 étoiles + commentaire optionnel)
  - `getFilmReviewsAction()` — récupérer les avis d'un film (paginé, 10 par page)
  - `getFilmRatingAction()` — note moyenne + distribution des notes (1-5 étoiles)
  - `deleteReviewAction()` — supprimer son propre avis
- **Modèle Prisma**: `Review` — persistence avec relation userId + filmId
- **Contrainte**: un seul avis par utilisateur par film (upsert — mise à jour si existant)
- **Pagination**: listing paginé des avis (10 par page)
- **Agrégation**: note moyenne calculée + distribution des notes par étoile
- **Composant**: `src/components/film-reviews.tsx`
  - Affichage étoiles remplies/vides (lucide Star)
  - Note moyenne + nombre d'avis
  - Liste des avis avec nom, date, note, commentaire
  - Formulaire "Écrire un avis" (connecté uniquement)

## 70. Partage Social
- **Composant**: `src/components/social-share.tsx`
- **Props**: `{ url, title, description? }`
- **Boutons**: Copier le lien, X/Twitter, Facebook, WhatsApp
- **Feedback**: "Lien copié !" après copie clipboard
- **Design**: petite rangée horizontale d'icônes, hover gold

## 71. Transcoding Job Queue
- **Fichier**: `src/lib/transcoding-queue.ts`
- **Fonctions**: createTranscodeJob, getTranscodeJob, updateTranscodeJob, listTranscodeJobs, cancelTranscodeJob, getQueueStats, getNextPendingJob, cleanupOldJobs
- **Statuts**: PENDING → PROCESSING → COMPLETED/FAILED/CANCELLED
- **Priorité**: 0 (normal), 1 (high), 2 (urgent)
- **Store**: en mémoire (Map), prêt pour Redis/DB en production

## 72. Thumbnail Generation
- **Fichier**: `src/lib/thumbnails.ts`
- **Fonctions**:
  - `buildThumbnailCommand()` — commande FFmpeg pour extraire une vignette
  - `buildThumbnailBatchCommands()` — extraction à intervalles
  - `buildSpriteSheetCommand()` — sprite sheet pour preview hover
  - `parseFFmpegProgress()` — parsing progression FFmpeg
  - `getThumbnailUrls()` — URLs attendues pour un film
- **Config par défaut**: intervalles [10s, 30s, 1m, 2m, 5m, 10m], 480px, webp, qualité 80

## 73. CDN Configuration
- **Fichier**: `src/lib/cdn.ts`
- **Providers**: Cloudflare Stream, Mux, self-hosted
- **Fonctions**: getCDNConfig, getVideoPlaybackUrl, getHLSUrl, getCDNThumbnailUrl, isCDNConfigured, getSignedVideoUrl
- **Env vars**: CDN_PROVIDER, CDN_BASE_URL, CDN_API_KEY, CDN_ACCOUNT_ID, CDN_SIGNING_SECRET
- **Signed URLs**: HMAC-SHA256 pour contenu premium

## 74. RGPD Account Management
- **Fichier**: `src/app/actions/account.ts`
- **Actions**:
  - `exportPersonalDataAction()` — téléchargement JSON complet (profil, tâches, paiements, Lumens, scénarios, etc.)
  - `requestAccountDeletionAction()` — anonymisation des données (nom → "Utilisateur supprimé", email → hash)
- **Intégrité**: conservation des données de contribution pour les films, mais anonymisées
- **Sécurité**: vérification email pour la suppression

## 75. Health Check API
- **Endpoint**: `GET /api/health`
- **Checks**: PostgreSQL (latency), Redis (latency)
- **Réponse**: status (healthy/degraded), timestamp, uptime, version, latency, checks
- **HTTP**: 200 si healthy, 503 si degraded
- **Utilisé par**: Docker healthcheck, monitoring, orchestrateurs

---

## 76. Configuration Bitrate Adaptatif (v11-5)
- **Fichier**: `src/app/actions/bitrate-config.ts`
- **Actions**:
  - `getBitrateProfilesAction()` — retourne les 4 profils HLS (360p, 720p, 1080p, 4K)
  - `getFilmBitrateConfigAction(filmId)` — config par film stockée dans tags CatalogFilm
  - `setFilmBitrateConfigAction(filmId, enabledProfiles)` — active/désactive profils par film
- **Stockage**: tag `bitrate:360p,720p,1080p,4k` dans CatalogFilm.tags
- **Fallback**: tous profils activés si aucune config custom

## 77. Gestion des Sessions (v12-4)
- **Fichier**: `src/app/actions/sessions.ts`
- **Modèle Prisma**: `UserSession` — ip, userAgent, device, browser, os, country, lastActive, revokedAt
- **Actions**:
  - `recordSessionAction()` — enregistre une session avec parsing user-agent (device/browser/OS)
  - `getActiveSessionsAction()` — liste les sessions non-révoquées
  - `revokeSessionAction(sessionId)` — révoque une session spécifique
  - `revokeAllSessionsAction()` — révoque toutes les sessions
- **Parsing UA**: détection Chrome/Firefox/Safari/Edge, Windows/macOS/iOS/Android, Desktop/Mobile/Tablet

## 78. Journal d'Audit Admin (v12-5)
- **Fichier**: `src/app/actions/audit.ts`
- **Modèle Prisma**: `AuditLog` — userId, action, entity, entityId, details (Json), ip, createdAt
- **Actions**:
  - `logAuditEvent(action, entity, entityId?, details?)` — utilitaire interne pour logger actions
  - `getAuditLogAction(page?, entity?, userId?)` — log paginé avec noms utilisateurs
  - `getAuditStatsAction()` — stats: actions aujourd'hui/semaine, top acteurs, top types
- **Indexes**: userId, entity+entityId, createdAt pour requêtes rapides
- **Usage**: à intégrer dans admin.ts, community.ts etc. via `logAuditEvent()`

## 79. Commentaires Films (v13-1)
- **Fichier**: `src/app/actions/comments.ts`
- **Modèle Prisma**: `FilmComment` — filmId, userId, parentId (self-relation), content, likes, isEdited, isHidden
- **Modèle Prisma**: `CommentLike` — commentId, userId (@@unique)
- **Actions**:
  - `addCommentAction(filmId, content, parentId?)` — commentaire ou réponse threadée
  - `getFilmCommentsAction(filmId, page?)` — paginé (15/page) avec 3 réponses par commentaire
  - `likeCommentAction(commentId)` — toggle like/unlike avec compteur
  - `deleteCommentAction(commentId)` — soft delete (isHidden), owner ou admin
  - `editCommentAction(commentId, content)` — modification avec flag isEdited
- **Threaded**: réponses imbriquées via parentId self-relation
- **Modération**: soft delete + isHidden pour masquer sans supprimer

## 80. Générique / Crédits d'Équipe (v13-2)
- **Fichier**: `src/app/actions/credits.ts`
- **Action**: `getFilmCreditsAction(filmSlug)` — public
- **Données**: tâches VALIDATED groupées par phase avec contributeur (displayName, avatarUrl, role)
- **Scénariste**: inclut l'auteur du ScenarioProposal WINNER lié au film
- **Format retour**: `{ filmTitle, credits: [{ phase, tasks: [{ title, type, contributor }] }] }`

## 81. Collections & Playlists (v13-3)
- **Fichier**: `src/app/actions/playlists.ts`
- **Modèle Prisma**: `Playlist` — userId, title, description, isPublic, coverUrl
- **Modèle Prisma**: `PlaylistItem` — playlistId, filmId, sortOrder (@@unique playlistId+filmId)
- **Actions**:
  - `createPlaylistAction(title, description?, isPublic?)` — max 50 playlists par user
  - `addToPlaylistAction(playlistId, filmId)` — max 200 items, gère doublons
  - `removeFromPlaylistAction(playlistId, filmId)`
  - `getPlaylistAction(playlistId)` — public ou privé (owner)
  - `getUserPlaylistsAction(userId?)` — listes propres ou publiques d'un user
  - `deletePlaylistAction(playlistId)` — cascade sur items
  - `updatePlaylistAction(playlistId, data)` — titre, description, visibilité

## 82. Créateur à la Une (v13-4)
- **Fichier**: `src/app/actions/featured-creator.ts`
- **Modèle Prisma**: `FeaturedCreator` — userId, weekStart (@@unique), headline, achievement, isActive
- **Actions**:
  - `getFeaturedCreatorAction()` — retourne le créateur mis en avant cette semaine
  - `setFeaturedCreatorAction(userId, headline, achievement)` — admin: sélection manuelle
  - `autoSelectFeaturedCreatorAction()` — admin: auto-sélectionne top contributeur de la semaine
- **Calcul semaine**: lundi UTC de la semaine courante
- **Auto-sélection**: basée sur le nombre de tâches validées dans les 7 derniers jours

---

## 83. Trailer Studio — AI Trailer Creation (v9.0)

### Trailer Project Management
- **Create trailer projects** with title, concept, synopsis, genre, style, mood, duration, target audience
- **Community vote toggle**: Enable/disable community voting on creative choices
- **Contest submission**: Submit trailers to open trailer contests
- **Progress tracking**: Global %, per-phase progress, task completion counts
- **Credits tracking**: Estimated credits, used credits, remaining balance

### Trailer Decomposer Engine (`src/lib/trailer-decomposer.ts`)
- **8 production phases**: CONCEPT → SCRIPT → VISUAL_DESIGN → STORYBOARD → PRODUCTION → AUDIO → POST_PRODUCTION → ASSEMBLY
- **25-35+ auto-generated micro-tasks** per trailer project
- **Genre-specific tasks**: Sci-Fi (FX, vehicles), Action (stunts, explosions), Drama (emotions, environments), Horror (atmospheric), Comedy (timing), Animation (character design), Documentary (archive), Musical (choreography, musical numbers)
- **Duration multipliers**: TEASER_15S (0.5x) → FULL_120S (1.8x) affect credit estimates
- **Credit estimation per task**: text 5-15, images 20-50, video 100-300, audio 30-80, post-prod 40-100

### 32 Task Types
- **Concept**: CONCEPT_BRIEF, CONCEPT_KEYWORDS, REFERENCE_IMAGES
- **Script**: SCRIPT_STRUCTURE, SCRIPT_DIALOGUES, SCRIPT_VOICEOVER
- **Visual Design**: MOODBOARD, COLOR_PALETTE, CHARACTER_DESIGN, ENVIRONMENT_DESIGN
- **Storyboard**: STORYBOARD_PANELS, STORYBOARD_TIMING, SHOT_LIST
- **Production**: AI_IMAGE_GEN, AI_VIDEO_GEN, FACE_SWAP, STYLE_TRANSFER, MOTION_GEN
- **Audio**: VOICE_RECORDING, VOICE_CLONE, MUSIC_SELECTION, MUSIC_GEN, SOUND_EFFECTS, AUDIO_MIX
- **Post-Production**: COLOR_GRADING, VFX_COMPOSITING, TITLE_CARD, SUBTITLE_GEN, TRANSITION_DESIGN
- **Assembly**: ROUGH_CUT, FINE_CUT, FINAL_RENDER, THUMBNAIL_GEN, TRAILER_POSTER

### Task Status Flow
- PENDING → BLOCKED → READY → GENERATING → AWAITING_CHOICE → IN_REVIEW → APPROVED/REJECTED → COMPLETED/SKIPPED

### Server Actions (`src/app/actions/trailer.ts`)
- `createTrailerProjectAction` — Create new project
- `decomposeTrailerAction` — Generate micro-tasks via decomposer
- `startTrailerGenerationAction` — Start AI generation for a task
- `completeTrailerTaskAction` — Mark task as completed with result
- `updateTrailerChoiceAction` — Resolve a community choice
- `submitTrailerToContestAction` — Submit to open contest
- `createTrailerChoiceAction` — Create community voting question
- `voteOnTrailerChoiceAction` — Cast vote on a choice
- `getMyTrailerProjectsAction` — List user's projects
- `getTrailerProjectAction` — Get single project with tasks
- `deleteTrailerProjectAction` — Delete draft project
- `getOpenContestsAction` — List open contests

### UI Pages
- `/trailer-studio` — Main studio (project list, contest banner, 4-step how-it-works)
- `/trailer-studio/new` — Create form (genre/style/mood selectors, duration picker, community vote toggle)
- `/trailer-studio/[id]` — Project detail (phase progress, task list, pending choices, credit usage)
- Sidebar: "Studio Bande-Annonce" with NEW badge in Cinema section

---

## 84. AI Credit System (v9.0)

### Credit Accounts (`src/lib/credits.ts`)
- **Prepaid balance system**: Users buy credits before using AI features
- **20% commission**: Platform takes 20% on all AI token costs (`COMMISSION_RATE = 0.20`)
- **Credit rate**: 1 credit = 0.05€ (`CREDIT_TO_EUR = 0.05`)
- **Atomic transactions**: All balance mutations via `prisma.$transaction()` (no partial state)

### Credit Operations (13 Functions)
- `getOrCreateCreditAccount(userId)` — Lazy account creation
- `addCredits(userId, amount, txType, description)` — Add credits (pack purchase, free grant)
- `deductCredits(userId, amount, rawCostEur, description, taskId?)` — Deduct with commission tracking
- `refundCredits(userId, amount, originalTxId, reason)` — Full or partial refund
- `checkBalance(userId, amount)` — Check if user has enough credits
- `checkWeeklyFreeTrailer(userId)` — Check if premium free trailer available this week
- `useWeeklyFreeTrailer(userId)` — Consume weekly free trailer
- `getCreditHistory(userId, limit?, offset?)` — Paginated transaction history
- `estimateCreditCost(tasks[])` — Estimate total credit cost for a set of tasks

### Credit Packs (`CreditPack` model)
| Pack | Credits | Price | Discount |
|------|---------|-------|----------|
| Starter | 100 | 5€ | — |
| Creator | 500 | 20€ | -20% |
| Studio | 1500 | 50€ | -33% |
| Enterprise | 5000 | 125€ | -50% |

### Transaction Tracking
- Every credit movement logged with: amount, type, description, rawCostEur, commissionEur, totalChargedEur, balanceBefore, balanceAfter, relatedTaskId
- Types: PACK_PURCHASE, FREE_GRANT, TASK_DEDUCTION, TASK_REFUND, WEEKLY_FREE, PROMO, ADMIN_ADJUST, PAYOUT

### Credit Management Page (`/credits`)
- Balance display with gold accent
- 4 credit packs (disabled "Bientot disponible" for now — no Stripe yet)
- Transaction history list with type icons and amounts
- Sidebar: "Credits IA" with NEW badge in Mon Compte section
