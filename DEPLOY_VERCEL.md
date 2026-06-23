# Déploiement CINEGENY sur Vercel + Postgres

Ce guide explique **à quoi sert la base de données**, comment **brancher Postgres
(Neon ou Vercel Postgres)** et **ce qui marchera / ce qui manquera** sans configuration
supplémentaire.

---

## 1. À quoi sert la base de données

CINEGENY n'est pas un site vitrine : c'est une **application** (Next.js + Prisma).
La base Postgres stocke **tout l'état dynamique** :

- **Comptes & auth** : utilisateurs, rôles (ADMIN / créateur / spectateur), sessions.
- **Films & catalogue** : films, phases, casting, contenus bonus, statut de production.
- **Votes** : votes communautaires + votes « 1 par IP » (table `FilmIpVote`).
- **Tâches & soumissions** : micro-tâches, livrables, file de review.
- **Économie** : Lumens, crédits, paiements, payouts.
- **Communauté** : scénarios, concours, discussions, notifications.
- **Admin** : todos fondateur, configuration, analytics, etc.

Sans base, ces écrans s'affichent mais **en mode vide / lecture seule**.

---

## 2. Brancher une base Postgres (Neon — gratuit)

1. Crée un compte sur **https://neon.tech** → **New Project** (région la plus proche, ex. `eu-central-1`).
2. Copie la **connection string POOLED** (bouton *Connection Details* → coche *Pooled connection*).
   Elle ressemble à :
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.eu-central-1.aws.neon.tech/cinegeny?sslmode=require
   ```
   > ⚠️ Utilise bien l'URL **`-pooler`** (PgBouncer) : indispensable en serverless pour ne pas saturer les connexions.

*(Alternative : Vercel → onglet **Storage** → **Create Postgres** ; Vercel injecte alors `DATABASE_URL` automatiquement.)*

---

## 3. Déployer sur Vercel

1. **Import Project** → choisis ce repo GitHub (`Wonderself/lumiere-fork-a-vider`).
   Le framework est détecté (Next.js), `vercel.json` fait le reste.
2. **Project Settings → Environment Variables**, ajoute (Production + Preview) :

   | Variable | Obligatoire | Valeur |
   |---|---|---|
   | `DATABASE_URL` | ✅ | la connection string Neon (pooled) |
   | `AUTH_SECRET` | ✅ | une chaîne aléatoire — `openssl rand -base64 32` |
   | `NEXTAUTH_URL` / `AUTH_URL` | ✅ | l'URL du déploiement (ex. `https://cinegeny.vercel.app`) |
   | `NEXT_PUBLIC_APP_URL` | recommandé | même URL |
   | `ANTHROPIC_API_KEY` | optionnel | pour les fonctions IA |
   | `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | optionnel | pour les paiements |
   | `RESEND_API_KEY` | optionnel | pour les e-mails |

3. **Deploy.** Au build, `npm run vercel-build` :
   - génère le client Prisma,
   - **applique le schéma** sur la base (`prisma db push`) si `DATABASE_URL` est présent,
   - construit l'app.

> Si `DATABASE_URL` est absent au build, le déploiement réussit quand même : l'app
> tourne en **mode fallback** (login admin OK, écrans data vides).

---

## 4. Initialiser les données de démo (films, comptes test)

Le schéma crée les tables vides. Pour remplir avec ~100 films + comptes de test,
lance le seed **une fois**, depuis ta machine, en pointant sur la base de prod :

```bash
# .env.local avec le DATABASE_URL Neon
npm install
npm run db:seed
```

L'admin (`admin123 / admin123`) fonctionne **même sans seed** grâce au fallback d'auth.

---

## 5. Ce qui marche / ce qui manquera

### ✅ Marche immédiatement après déploiement
- Connexion **admin** `admin123` / `admin123` (panel admin accessible).
- Navigation complète, pages publiques, catalogue de démo statique, votes par IP
  (dès que `DATABASE_URL` est branché).

### ⚙️ Nécessite seulement `DATABASE_URL` (+ seed)
- Création/édition de films, utilisateurs, tâches, paiements, votes persistés,
  notifications, communauté, analytics admin — bref tout l'état dynamique.

### 🔌 Nécessite des clés tierces (optionnel, hors base de données)
- **IA** (génération de scénarios/trailers, agents) → `ANTHROPIC_API_KEY`.
- **Paiements réels** (Stripe) → clés `STRIPE_*` + webhook.
- **E-mails** (vérification, reset password) → `RESEND_API_KEY`.
- **Upload de fichiers** (posters, vidéos) → identifiants S3 (`S3_*`).
- **Cache / temps réel avancé** → `REDIS_URL` (sinon dégradé, non bloquant).
- **Login Google** → `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

> En résumé : **base Postgres = cœur fonctionnel** (à brancher en priorité).
> Les clés IA / Stripe / Resend / S3 activent des fonctionnalités spécifiques
> et peuvent être ajoutées progressivement, sans rien casser.

---

## 6. Sécurité

L'accès admin est volontairement en **codes simples `admin123 / admin123`** (demande
explicite, à changer plus tard). Pour le durcir : modifier `ADMIN_LOGIN` /
`ADMIN_PASSWORD` dans `src/lib/auth.ts`, ou supprimer le bypass et créer un vrai
compte admin en base.
