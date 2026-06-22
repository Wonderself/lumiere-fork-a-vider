# CINEGENY — Plateforme de Micro-Tâches Créatives

> L'Uber du Film IA — Production collaborative de films d'intelligence artificielle

## Stack Technique

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Auth**: NextAuth.js v5 (email/password)
- **DB**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7
- **UI**: shadcn/ui + lucide-react

## Installation Rapide

### 1. Prérequis

- Node.js 18+
- Docker Desktop (pour PostgreSQL + Redis)

### 2. Installer les dépendances

```bash
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env.local
# .env.local est déjà configuré pour le dev local
```

### 4. Démarrer la base de données

```bash
docker compose up -d
```

### 5. Appliquer le schéma Prisma

```bash
npm run db:push
```

### 6. Seeder les données de démo

```bash
npm run db:seed
```

### 7. Démarrer le serveur

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@lumiere.film | Admin1234! |
| Contributeur | contributeur@lumiere.film | Test1234! |

## Commandes Utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run db:push      # Push schéma sans migration
npm run db:seed      # Seeder les données de démo
npm run db:studio    # Ouvrir Prisma Studio
npm run db:reset     # Reset DB + re-seed
```

## Pages Disponibles (V1)

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/films` | Catalogue films |
| `/films/[slug]` | Détail film |
| `/login` | Connexion |
| `/register` | Inscription |
| `/dashboard` | Dashboard contributeur |
| `/tasks` | Marketplace tâches |
| `/tasks/[id]` | Détail tâche |
| `/profile` | Profil utilisateur |
| `/admin` | Panel admin |
| `/admin/films` | Gestion films |
| `/admin/users` | Gestion utilisateurs |
| `/admin/reviews` | Queue de review |
| `/admin/settings` | Paramètres IA |
| `/roadmap` | Roadmap complète |

---

*CINEGENY Pictures — 2026*
