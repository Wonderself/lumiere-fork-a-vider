# Déploiement CINEGENY sur Hetzner + Coolify (recommandé)

C'est **le moyen le plus simple** : pas besoin de Vercel ni de Neon. Le repo contient
déjà tout (`docker-compose.yml` + `Dockerfile` + `start.sh`). Coolify monte **l'app +
PostgreSQL + Redis ensemble**, et la base est créée/synchronisée automatiquement au
démarrage. Redis est inclus aussi — **rien à provisionner à part le serveur**.

---

## 1. Créer le projet dans Coolify

1. Coolify → **+ New** → **Resource** → **Docker Compose** (ou « Public/Private Git Repository »
   puis choisis le **Build Pack = Docker Compose**).
2. Source : ce repo Git, branche `claude/cinegeny-repo-rebuild-hbvtub` (ou `main` une fois mergé).
3. Compose file : `docker-compose.yml` (à la racine — détecté automatiquement).

Coolify va construire l'image (multi-stage `Dockerfile`) et lancer les **3 services** :
`app` (port 3000, proxifié par Coolify), `postgres`, `redis`.

---

## 2. Variables d'environnement (dans Coolify)

La plupart ont déjà des valeurs par défaut dans le compose. Tu n'as **vraiment besoin que de 3** :

| Variable | Obligatoire | Valeur |
|---|---|---|
| `AUTH_SECRET` | ✅ | une chaîne aléatoire secrète (voir §4) |
| `AUTH_URL` + `NEXTAUTH_URL` | ✅ | l'URL publique canonique, ex. `https://platform.cinegeny.com` (sans / final) |
| `NEXT_PUBLIC_APP_URL` | recommandé | même URL |
| `SEED_DB` | 1er déploiement | `true` pour pré-remplir ~100 films + comptes, puis remets `false` |
| `SEED_ADMIN_PASSWORD` | recommandé | mot de passe du compte admin — defini UNIQUEMENT dans Coolify, jamais commite |
| `SEED_USER_PASSWORD` | optionnel | mot de passe des comptes de test |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optionnel | active le bouton Google (sinon masqué). Redirect URI: `https://platform.cinegeny.com/api/auth/callback/google` |
| `POSTGRES_PASSWORD` | recommandé | un mot de passe fort (sinon défaut) |
| `ANTHROPIC_API_KEY`, `STRIPE_*`, `RESEND_API_KEY`, `S3_*` | optionnel | active IA / paiements / e-mails / upload |

> Postgres et Redis sont **internes** (plus exposés publiquement) : l'app les joint via le
> réseau Docker (`postgres:5432`, `redis:6379`). Rien à configurer pour ça.

---

## 3. Déployer

Clique **Deploy**. Au démarrage, `start.sh` :
1. attend que Postgres soit prêt,
2. applique le schéma (`prisma db push`),
3. seed la base si `SEED_DB=true`,
4. lance le serveur Next.js.

Mets ton **domaine** dans Coolify (il gère le HTTPS/Let's Encrypt automatiquement).

Connexion admin : **`admin123` / `admin123`**.

---

## 4. `AUTH_SECRET` — c'est quoi et pourquoi

Quand quelqu'un se connecte, le serveur lui remet un **jeton de session** (un cookie qui
dit « cet utilisateur est connecté en tant que X, rôle ADMIN »). Ce jeton est **signé/chiffré**
avec une clé secrète : `AUTH_SECRET`. C'est ce qui empêche un visiteur de **fabriquer un faux
jeton** pour se faire passer pour l'admin.

Règles :
- une **longue chaîne aléatoire** (32+ octets),
- **gardée secrète** (jamais dans le code public),
- **stable** : si tu la changes, toutes les sessions sont invalidées (tout le monde est déconnecté).

Pour en générer une :
```bash
openssl rand -base64 32
```

J'en ai déjà généré une pour toi (utilise-la ou regénère la tienne) :
```
AUTH_SECRET=onFhhYAmTwCSr/IdnmQg1zm66m2nlReysze90feHMb8=
```
> Colle-la dans les variables Coolify. Si tu préfères, regénère-en une nouvelle avec la
> commande ci-dessus — peu importe la valeur tant qu'elle est aléatoire et secrète.

---

## 5. Ce qui marche / ce qui manquera

- ✅ **Out of the box** (app + Postgres + Redis via Coolify) : login admin, navigation
  complète, catalogue, **votes (1/IP)**, films/users/tâches/paiements en base, admin complet,
  notifications, communauté. Le seed remplit des données de démo.
- 🔌 **Optionnel, à ajouter quand tu veux** (clés tierces, sans rien casser) :
  - **IA** (scénarios/trailers/agents) → `ANTHROPIC_API_KEY`
  - **Paiements réels** → `STRIPE_*` (+ webhook)
  - **E-mails** (vérif, reset mot de passe) → `RESEND_API_KEY`
  - **Upload fichiers** (posters/vidéos) → `S3_*`
  - **Login Google** → `GOOGLE_CLIENT_ID/SECRET`

Redis est **déjà inclus** — pas besoin d'un service séparé.

---

*Alternative Vercel + Neon : voir `DEPLOY_VERCEL.md` (utile si tu ne veux pas gérer de
serveur, mais avec ton Hetzner+Coolify, ce guide-ci est le plus simple).*
