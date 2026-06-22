# LUMIERE CINEMA — Roadmap Technique Detaillee

> Chaque etape inclut le **prompt pret a copier** pour Claude Code et la **liste de prerequis** (ce que le fondateur doit fournir avant de lancer).

---

## ETAT ACTUEL (Fevrier 2026)

### Fait
- [x] Architecture Next.js 16 + Prisma 7 + PostgreSQL + Redis
- [x] Auth complete (register, login, reset password, roles)
- [x] 23 films avec pipeline 10 phases (230 phases, 17 taches)
- [x] Design Netflix premium (hero banner, film rows, top 10, creator bar)
- [x] Systeme de vote blockchain (hash SHA-256, pret pour on-chain)
- [x] Scenarios communautaires (soumission + vote)
- [x] Concours de bandes-annonces
- [x] Streaming catalog (3 films live)
- [x] Tokenisation V4 (modeles DB complets)
- [x] Dashboard admin complet
- [x] 54 tests E2E automatises
- [x] Creator tools (profil, videos, social, scheduler)
- [x] AI Review mock (scoring deterministe)
- [x] Paiements Stripe (modeles prets)

### En cours
- [ ] Integration Claude AI reelle (remplacement du mock)
- [ ] Invitation scenaristes (systeme d'invitation en masse)

---

## PHASE 1 — IA & QUALITE (Semaines 1-2)

### 1.1 Review IA reelle avec Claude API
**Statut**: EN COURS
**Prerequis fondateur**: Cle API Anthropic (FAIT — dans .env)

> **Prompt Claude Code:**
> ```
> Remplace le mock AI review dans src/lib/ai-review.ts par une vraie integration Claude API.
> La cle ANTHROPIC_API_KEY est dans .env.
> Utilise le SDK @anthropic-ai/sdk.
> La fonction doit:
> 1. Analyser le contenu de la soumission (notes + fileUrl)
> 2. Evaluer la qualite sur 100 selon le type de tache
> 3. Donner un feedback detaille en francais
> 4. Rendre un verdict AI_APPROVED ou AI_FLAGGED
> Optimise les tokens: utilise haiku pour les reviews simples, sonnet pour les complexes.
> Garde le fallback mock si l'API est indisponible.
> ```

### 1.2 Analyse IA des scenarios
**Statut**: A FAIRE
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Ajoute une analyse IA automatique quand un scenario est soumis via submitScenarioAction.
> Dans src/app/actions/community.ts, apres la creation du scenario, lance une analyse async avec Claude:
> - Evaluation du logline (originalite, clarte, potentiel commercial)
> - Score sur 100
> - Suggestions d'amelioration
> - Detection de contenu inapproprie
> Stocke le resultat dans un nouveau champ aiAnalysis (JSON) sur ScenarioProposal.
> Utilise claude-haiku pour economiser les tokens.
> ```

### 1.3 Generation de synopsis IA
**Statut**: A FAIRE
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Ajoute un bouton "Generer avec l'IA" sur le formulaire de soumission de scenario.
> Quand l'utilisateur donne un titre et un genre, Claude genere:
> - Un logline accrocheur
> - Un synopsis de 3 paragraphes
> - 3 suggestions de genre
> Cree une server action generateSynopsisAction dans src/app/actions/ai.ts.
> UI: bouton gold avec sparkles icon, resultat dans un dialog.
> ```

---

## PHASE 2 — INVITATION SCENARISTES (Semaines 2-3)

### 2.1 Systeme d'invitation par email
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte Resend.com (service email) — gratuit 100 emails/jour
- Domaine verifie sur Resend (lumiere.film ou autre)
- Variable env: `RESEND_API_KEY`

> **Prompt Claude Code:**
> ```
> Cree un systeme d'invitation de scenaristes en masse.
> 1. Page admin /admin/invite-screenwriters avec:
>    - Textarea pour coller des emails (1 par ligne, max 100)
>    - Template d'email personnalisable
>    - Bouton "Envoyer les invitations"
> 2. Server action sendScreenwriterInvitesAction qui:
>    - Valide les emails
>    - Cree un InviteToken unique par email (nouveau modele Prisma)
>    - Envoie l'email via Resend API
>    - L'email contient un lien /register?invite=TOKEN&role=SCREENWRITER
> 3. Sur /register, si invite token present:
>    - Pre-remplit le role SCREENWRITER
>    - Marque l'invitation comme utilisee
>    - Credite 50 lumens de bienvenue
> Installe resend (npm install resend).
> ```

### 2.2 Page scenariste dediee
**Statut**: A FAIRE
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Cree une page /screenwriters (landing page publique) qui explique:
> - Comment devenir scenariste sur Lumiere
> - Les avantages (credits, blockchain, coproduction)
> - Les films ouverts aux scenarios
> - Formulaire de candidature (nom, email, bio, portfolio)
> - Testimonials (faux pour l'instant)
> Design: style cinema premium, gold accents, fond noir.
> ```

---

## PHASE 3 — PAIEMENTS & STRIPE (Semaines 3-5)

### 3.1 Checkout Stripe
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte Stripe (stripe.com) — mode test gratuit
- Variables env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

> **Prompt Claude Code:**
> ```
> Integre Stripe Checkout pour:
> 1. Abonnements (FREE, STARTER 9.99/mois, PRO 19.99/mois, PREMIUM 49.99/mois)
> 2. Achat de Lumens (packs: 100L=5EUR, 500L=20EUR, 2000L=70EUR)
> 3. Investissement tokenise (montants custom)
> Cree:
> - src/app/api/stripe/checkout/route.ts (session creation)
> - src/app/api/stripe/webhook/route.ts (webhook handler)
> - src/app/actions/payment.ts (server actions)
> - src/app/(public)/pricing/page.tsx (page tarifs)
> Utilise stripe npm package. Mode test avec cles test.
> ```

### 3.2 Wallet Lumens
**Statut**: PARTIELLEMENT FAIT (modeles DB existent)
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Cree l'interface du wallet Lumens dans /dashboard/wallet:
> - Solde actuel avec animation compteur
> - Historique des transactions (gains taches + achats)
> - Bouton "Acheter des Lumens" (redirige vers Stripe)
> - Bouton "Retirer" (convertir en EUR, minimum 50 Lumens)
> Les donnees viennent de la table LumenTransaction deja dans Prisma.
> Design: cards avec gradients gold, graphique d'evolution.
> ```

---

## PHASE 4 — BLOCKCHAIN REELLE (Semaines 5-8)

### 4.1 Smart contracts Polygon
**Statut**: A FAIRE
**Prerequis fondateur**:
- Wallet MetaMask avec MATIC test (faucet gratuit)
- Variable env: `POLYGON_RPC_URL`, `DEPLOYER_PRIVATE_KEY`
- Optionnel: compte Alchemy ou Infura (RPC gratuit)

> **Prompt Claude Code:**
> ```
> Deploie les smart contracts sur Polygon Mumbai testnet:
> 1. LumiereVoting.sol — enregistrement des votes on-chain
> 2. LumiereToken.sol — ERC-20 pour les Lumens
> 3. LumiereNFT.sol — ERC-721 pour les credits de coproduction
> Utilise Hardhat + ethers.js.
> Cree contracts/ a la racine du projet.
> Connecte src/lib/blockchain.ts aux vrais contrats.
> ```

### 4.2 Credits NFT de coproduction
**Statut**: A FAIRE
**Prerequis fondateur**: Smart contracts deployes (4.1)

> **Prompt Claude Code:**
> ```
> Quand un scenario gagne le vote et que le film est produit:
> 1. Mint un NFT "Co-Producteur" pour l'auteur du scenario
> 2. Mint des NFTs "Contributeur" pour chaque participant valide
> 3. Le NFT contient: titre du film, role, pourcentage de revenue share
> 4. Ajoute une page /dashboard/nfts pour voir ses NFTs
> Le metadata IPFS peut etre simule pour l'instant (JSON sur le serveur).
> ```

---

## PHASE 5 — VIDEO & CONTENU (Semaines 8-12)

### 5.1 Generation video IA
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte API video (Runway ML, Luma AI, ou Kling)
- Variable env: `VIDEO_API_KEY`, `VIDEO_API_PROVIDER`

> **Prompt Claude Code:**
> ```
> Integre la generation video IA dans le workflow de production:
> 1. Sur chaque tache de type IMAGE_GEN ou VIDEO_REVIEW:
>    - Bouton "Generer avec l'IA"
>    - L'utilisateur entre un prompt
>    - L'API genere la video/image
>    - Le resultat est soumis comme submission
> 2. Cree src/lib/video-gen.ts avec support multi-provider
> 3. Stocke les videos generees sur un CDN (Cloudflare R2 ou S3)
> Variables: VIDEO_API_KEY, VIDEO_API_PROVIDER (runway|luma|kling)
> ```

### 5.2 Stockage media (CDN)
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte Cloudflare R2 (10GB gratuit) ou AWS S3
- Variables env: `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, `R2_ENDPOINT`

> **Prompt Claude Code:**
> ```
> Cree un systeme d'upload media centralise:
> 1. src/lib/storage.ts — upload/download/delete vers R2
> 2. src/app/api/upload/route.ts — endpoint d'upload avec presigned URLs
> 3. Integre dans: soumission de taches, affiches de films, avatars
> 4. Limite: 50MB par fichier, formats image+video
> Installe @aws-sdk/client-s3 et @aws-sdk/s3-request-presigner.
> ```

---

## PHASE 6 — SEO & PERFORMANCE (Semaines 12-14)

### 6.1 SEO & Metadata
**Statut**: PARTIELLEMENT FAIT
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Optimise le SEO de toutes les pages:
> 1. Ajoute generateMetadata() sur chaque page dynamique
> 2. Cree src/app/sitemap.ts (sitemap dynamique)
> 3. Cree src/app/robots.ts
> 4. Ajoute OpenGraph images pour les films (og:image)
> 5. Schema.org JSON-LD pour les films (Movie type)
> 6. Canonical URLs sur toutes les pages
> Langue: fr. Titre pattern: "Nom | Lumiere Cinema"
> ```

### 6.2 Performance & Core Web Vitals
**Statut**: PARTIELLEMENT FAIT
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Optimise les performances:
> 1. Lazy load tous les composants below-the-fold avec dynamic()
> 2. Prefetch les liens critiques
> 3. Optimise les images: blur placeholder, priority sur hero
> 4. Ajoute loading.tsx sur chaque route group
> 5. Cache les requetes Prisma chaudes avec Redis (src/lib/redis.ts)
> 6. Bundle analysis: supprime les imports inutiles
> Target: LCP < 2.5s, CLS < 0.1, FID < 100ms
> ```

---

## PHASE 7 — DEPLOIEMENT PRODUCTION (Semaines 14-16)

### 7.1 Docker & CI/CD
**Statut**: PARTIELLEMENT FAIT (docker-compose local existe)
**Prerequis fondateur**:
- Compte Vercel (gratuit) OU serveur VPS (Hetzner ~5EUR/mois)
- Domaine (lumiere.film ou similaire)
- Variables env de production

> **Prompt Claude Code:**
> ```
> Prepare le deploiement production:
> 1. Dockerfile multi-stage optimise (build + runtime)
> 2. docker-compose.prod.yml (avec SSL, Redis persist, PG backups)
> 3. .github/workflows/deploy.yml (CI: lint + test + build + deploy)
> 4. Script de migration automatique au deploiement
> 5. Health check endpoint /api/health
> Si Vercel: configure vercel.json + edge runtime ou pas.
> Si VPS: nginx reverse proxy + certbot SSL.
> ```

---

## PHASE 8 — FEATURES AVANCEES (Post-lancement)

### 8.1 Systeme de recommandation
> **Prompt:** Cree un algorithme de recommandation base sur: genres preferes, votes passes, films consultes. Stocke les scores dans Redis pour la rapidite.

### 8.2 Notifications temps reel
> **Prompt:** Ajoute des notifications push avec Server-Sent Events. Notifie: nouveau vote sur ton scenario, tache validee, nouveau film disponible.

### 8.3 Mobile app (React Native)
> **Prompt:** Scaffolde une app React Native avec Expo qui reutilise les API existantes. Ecrans: Home, Films, Mon Profil, Wallet.

### 8.4 Multi-langue (i18n)
> **Prompt:** Ajoute le support francais/anglais/hebreu avec next-intl. Commence par FR (defaut) + EN.

---

## PHASE 9 — SCALE & INTELLIGENCE (En cours)

### 9.1 App mobile PWA ✅
> Service worker, manifest, meta tags, mode offline cache-first.

### 9.2 Internationalisation (i18n) ✅
> next-intl + FR/EN + switcher + header traduit.

### 9.3 Analytics avancees ✅
> Dashboard admin avec KPIs, graphiques, top contributors, pipeline.

### 9.4 CDN video + HLS ✅
> cdn.ts multi-provider (Cloudflare/Mux/self-hosted), signed URLs, transcoding 4 profils.

### 9.5 Annulation abonnement ✅
> Page /dashboard/subscription — gestion plan, annulation, upgrade, dates.

### 9.6 Historique de visionnage ✅
> watch-history.ts — recordProgress, getContinueWatching, getHistory via FilmView.

### 9.7 Watchlist / Ma Liste ✅
> watchlist.ts — add/remove/get/isInWatchlist.

### 9.8 Cookie consent RGPD ✅
> CookieBanner + CookieConsent dans layout.tsx.

### 9.9 Health check API ✅
> /api/health — DB + Redis checks, latency, uptime.

### 9.10 IA Generative
**Statut**: A FAIRE
**Prerequis**: API Runway/Luma/Kling
> Generation d'affiches, storyboards, previsualisations par IA.

### 9.11 Whisper sous-titres auto
**Statut**: A FAIRE
**Prerequis**: OpenAI Whisper API ou modele local
> Transcription automatique audio → sous-titres multi-langues.

---

## PHASE 10 — BLOCKCHAIN LIVE

### 10.1 Deploy smart contracts
**Statut**: A FAIRE
**Prerequis**: Wallet MetaMask + RPC Polygon/Base + cles deploiement
> ERC-20 FilmToken + ERC-721 ContributionNFT sur Polygon/Base.

### 10.2 Wallet Connect
**Statut**: A FAIRE
> Connexion MetaMask/WalletConnect pour acheter tokens et voter.

### 10.3 NFT contributeur
**Statut**: A FAIRE
> Mint automatique d'un NFT preuve-de-contribution a chaque tache validee.

### 10.4 Gouvernance on-chain
**Statut**: A FAIRE
> Votes token-weighted pour decisions de production.

### 10.5 Dividendes automatiques
**Statut**: A FAIRE
> Distribution automatique des revenus aux detenteurs de tokens.

---

## PHASE 11 — INFRASTRUCTURE VIDEO (En cours)

### 11.1 File d'attente transcoding ✅
> transcoding-queue.ts — CRUD jobs, stats, priorite, cleanup.

### 11.2 Generation auto de thumbnails ✅
> thumbnails.ts — FFmpeg commands, sprite sheets, progress parsing.

### 11.3 CDN video (Cloudflare/Mux) ✅
> cdn.ts — multi-provider, signed URLs, hotlink protection.

### 11.4 Protection DRM
**Statut**: A FAIRE
**Prerequis**: Licence Widevine/FairPlay
> Protection du contenu premium des abonnes.

### 11.5 Configuration bitrate adaptatif
**Statut**: A FAIRE
> Interface admin pour configurer les profils qualite par film.

---

## PHASE 12 — CONFORMITE & SECURITE (En cours)

### 12.1 Authentification deux facteurs (2FA)
**Statut**: A FAIRE
> TOTP via app authenticator (Google Auth, Authy).

### 12.2 Suppression de compte (RGPD Art. 17) ✅
> account.ts — requestAccountDeletionAction, anonymisation des donnees.

### 12.3 Export donnees personnelles (RGPD Art. 20) ✅
> account.ts — exportPersonalDataAction, JSON complet.

### 12.4 Gestion des sessions
**Statut**: A FAIRE
> Voir et revoquer les sessions actives depuis le profil.

### 12.5 Journal d'audit admin
**Statut**: A FAIRE
> Log de toutes les actions admin avec horodatage.

---

## PHASE 13 — SOCIAL & ENGAGEMENT

### 13.1 Commentaires sur les films
**Statut**: A FAIRE
> Discussion par film avec reponses, likes et moderation.

### 13.2 Generique / credits d'equipe
**Statut**: A FAIRE
> Page credits interactive par film listant tous les contributeurs et roles.

### 13.3 Collections & playlists
**Statut**: A FAIRE
> Playlists thematiques de films partagees ou personnelles.

### 13.4 Createur a la une
**Statut**: A FAIRE
> Mise en avant hebdomadaire d'un createur avec interview et stats.

---

## FEATURES TRANSVERSALES (Fait)

### Avis & notations films ✅
> reviews.ts + FilmReviews component — etoiles 1-5, formulaire, listing.

### Partage social ✅
> SocialShare component — copie lien, X/Twitter, Facebook, WhatsApp.

### Tests unitaires (85 tests Vitest) ✅
> 5 suites: utils, reputation, invoices, film-decomposer, rate-limiter.

### CI/CD GitHub Actions ✅
> Pipeline 3 jobs: lint, test, build sur chaque push/PR.

### Rate Limiting ✅
> Login (5/15min), register (3/h), password reset (3/15min).

### Security Headers ✅
> CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy.

### Email Verification ✅
> isVerified check + resendVerificationAction.

---

## CHECKLIST PREREQUIS FONDATEUR

| Etape | Ce que tu dois fournir | Gratuit? |
|-------|----------------------|----------|
| 1.1 IA Review | Cle Anthropic API | 5$ credit gratuit |
| 2.1 Invitations | Compte Resend + domaine verifie | 100 emails/jour gratuit |
| 3.1 Paiements | Compte Stripe (mode test) | Gratuit en test |
| 10.x Blockchain | Wallet MetaMask + RPC Polygon | Gratuit (testnet) |
| 9.10 Video IA | API Runway/Luma/Kling | ~0.05$/video |
| 11.3 CDN | Cloudflare R2/Stream | 10GB gratuit |
| 7.1 Hosting | Vercel ou VPS | Gratuit (Vercel hobby) |
| 11.4 DRM | Licence Widevine | Gratuit (Shaka Player) |
| 9.11 Whisper | OpenAI Whisper API | ~0.006$/min |

---

*Derniere mise a jour: 25 Fevrier 2026*
