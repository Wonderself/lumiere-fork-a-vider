/**
 * CineGeny Infrastructure & Monitoring
 * 7 agents, health checks, autonomy score, crons, events.
 */

export interface InfraAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const INFRA_AGENTS: InfraAgent[] = [
  { slug: 'cg-health-monitor', name: 'Health Monitor', role: 'Surveillance santé', description: 'Surveille en continu la santé de tous les services : DB, Redis, APIs, mémoire, disk. Alertes automatiques.', icon: 'heart-pulse', color: '#10B981' },
  { slug: 'cg-autonomy-scorer', name: 'Autonomy Scorer', role: 'Score d\'autonomie', description: 'Calcule le score d\'autonomie du système (0-100) basé sur 4 facteurs : infrastructure, agents, données, intégrations.', icon: 'gauge', color: '#3B82F6' },
  { slug: 'cg-token-tracker', name: 'Token Tracker', role: 'Suivi tokens', description: 'Suit la consommation de tokens par agent, par modèle et par utilisateur. Identifie les optimisations possibles.', icon: 'activity', color: '#8B5CF6' },
  { slug: 'cg-cron-orchestrator', name: 'Cron Orchestrator', role: 'Orchestration crons', description: 'Gère les 12+ cron jobs : planification, exécution, monitoring, retry en cas d\'échec.', icon: 'clock', color: '#F59E0B' },
  { slug: 'cg-event-logger', name: 'Event Logger', role: 'Journal événements', description: 'Enregistre tous les événements système avec catégorisation, filtrage et recherche en temps réel.', icon: 'scroll', color: '#EC4899' },
  { slug: 'cg-metrics-collector', name: 'Metrics Collector', role: 'Métriques système', description: 'Collecte les métriques de performance : latence API, temps de réponse, utilisation mémoire, requêtes/seconde.', icon: 'bar-chart-2', color: '#06B6D4' },
  { slug: 'cg-state-manager', name: 'State Manager', role: 'État global', description: 'Gère l\'état global de l\'application : mode production/maintenance, feature flags, configuration runtime.', icon: 'database', color: '#EF4444' },
]

// ─── Autonomy Score ─────────────────────────────────────────────────

export interface AutonomyFactor {
  id: string; label: string; maxPoints: number; icon: string; color: string
  checks: Array<{ name: string; points: number; status: boolean; detail: string }>
}

export const AUTONOMY_FACTORS: AutonomyFactor[] = [
  {
    id: 'infrastructure', label: 'Infrastructure', maxPoints: 25, icon: 'server', color: '#10B981',
    checks: [
      { name: 'PostgreSQL connecté', points: 5, status: true, detail: 'Prisma ORM opérationnel' },
      { name: 'Redis opérationnel', points: 3, status: false, detail: 'Graceful fallback actif, non requis' },
      { name: 'Health endpoint', points: 3, status: true, detail: '/api/health répond 200' },
      { name: 'Guardrails actifs', points: 5, status: true, detail: '10/10 modules de protection' },
      { name: 'Circuit breakers', points: 3, status: true, detail: 'Monitoring par provider' },
      { name: 'Cron jobs configurés', points: 3, status: true, detail: '12 crons enregistrés' },
      { name: 'Telegram bot actif', points: 3, status: false, detail: 'Token non configuré' },
    ],
  },
  {
    id: 'agents', label: 'Agents IA', maxPoints: 25, icon: 'bot', color: '#3B82F6',
    checks: [
      { name: 'Agents L1 (Execution)', points: 5, status: true, detail: '10 agents Sonnet configurés' },
      { name: 'Agents L2 (Management)', points: 5, status: true, detail: '4 agents Opus configurés' },
      { name: 'Agents L3 (Strategy)', points: 5, status: true, detail: '3 agents Opus+Thinking configurés' },
      { name: 'Chat SSE streaming', points: 3, status: true, detail: 'Endpoint fonctionnel' },
      { name: 'Multi-agent meetings', points: 3, status: true, detail: 'Réunions multi-agents prêtes' },
      { name: 'API IA connectée', points: 4, status: false, detail: 'ANTHROPIC_API_KEY non configuré' },
    ],
  },
  {
    id: 'data', label: 'Données & Contenu', maxPoints: 25, icon: 'database', color: '#8B5CF6',
    checks: [
      { name: 'Schema Prisma V22', points: 5, status: true, detail: '73+ modèles' },
      { name: 'Films catalogués', points: 3, status: true, detail: '100 films avec posters' },
      { name: 'TV shows', points: 3, status: true, detail: '80 shows, 10 genres' },
      { name: 'Templates documents', points: 3, status: true, detail: '8 templates cinéma' },
      { name: 'Templates email', points: 3, status: true, detail: '15 templates prêts' },
      { name: 'Discussion templates', points: 3, status: true, detail: '86 discussions profondes' },
      { name: 'Backup configuré', points: 5, status: false, detail: 'pg_dump non automatisé' },
    ],
  },
  {
    id: 'integrations', label: 'Intégrations', maxPoints: 25, icon: 'plug', color: '#F59E0B',
    checks: [
      { name: 'Stripe paiements', points: 5, status: false, detail: 'STRIPE_SECRET_KEY non configuré' },
      { name: 'Resend emails', points: 4, status: false, detail: 'RESEND_API_KEY non configuré' },
      { name: 'Anthropic API', points: 5, status: false, detail: 'ANTHROPIC_API_KEY non configuré' },
      { name: 'Telegram Bot', points: 3, status: false, detail: 'TELEGRAM_BOT_TOKEN non configuré' },
      { name: 'Fal.ai images', points: 3, status: false, detail: 'FAL_API_KEY non configuré' },
      { name: 'Sentry monitoring', points: 2, status: true, detail: 'SDK installé' },
      { name: 'NextAuth', points: 3, status: true, detail: 'Credentials provider actif' },
    ],
  },
]

export function calculateAutonomyScore(): { total: number; factors: Array<{ id: string; label: string; score: number; max: number }> } {
  let total = 0
  const factors = AUTONOMY_FACTORS.map(f => {
    const score = f.checks.filter(c => c.status).reduce((s, c) => s + c.points, 0)
    total += score
    return { id: f.id, label: f.label, score, max: f.maxPoints }
  })
  return { total, factors }
}

// ─── Extended Cron Registry ─────────────────────────────────────────

export interface CronJobConfig {
  name: string; schedule: string; description: string; category: string; enabled: boolean; lastRun?: string; nextRun?: string; status: 'idle' | 'running' | 'success' | 'failed'
}

export const EXTENDED_CRON_JOBS: CronJobConfig[] = [
  { name: 'health-check', schedule: '*/5 * * * *', description: 'Vérification santé plateforme', category: 'monitoring', enabled: true, status: 'success' },
  { name: 'morning-briefing', schedule: '0 8 * * *', description: 'Briefing matinal Telegram', category: 'briefing', enabled: true, status: 'idle' },
  { name: 'improvement-review', schedule: '0 9 * * *', description: 'Review améliorations quotidienne', category: 'briefing', enabled: true, status: 'idle' },
  { name: 'daily-reset', schedule: '0 0 * * *', description: 'Reset compteurs quotidiens (budgets, challenges)', category: 'maintenance', enabled: true, status: 'success' },
  { name: 'demo-expiration', schedule: '0 1 * * *', description: 'Désactivation comptes démo expirés', category: 'users', enabled: true, status: 'idle' },
  { name: 'low-balance-alerts', schedule: '*/30 * * * *', description: 'Alertes solde bas utilisateurs', category: 'billing', enabled: true, status: 'success' },
  { name: 'auto-topup-check', schedule: '*/15 * * * *', description: 'Vérification auto-topup wallets', category: 'billing', enabled: true, status: 'idle' },
  { name: 'purge-90days', schedule: '0 4 * * 0', description: 'Nettoyage données >90 jours', category: 'maintenance', enabled: true, status: 'idle' },
  { name: 'rgpd-cleanup', schedule: '0 3 1 * *', description: 'Nettoyage RGPD mensuel (PII, logs)', category: 'compliance', enabled: true, status: 'idle' },
  { name: 'batch-results', schedule: '*/10 * * * *', description: 'Collecte résultats async (vidéo gen)', category: 'processing', enabled: true, status: 'idle' },
  { name: 'referral-milestones', schedule: '0 */6 * * *', description: 'Vérification paliers parrainage', category: 'engagement', enabled: true, status: 'idle' },
  { name: 'disk-monitor', schedule: '*/30 * * * *', description: 'Surveillance espace disque/mémoire', category: 'monitoring', enabled: true, status: 'success' },
  { name: 'telegram-notify', schedule: '*/15 * * * *', description: 'Notifications urgentes Telegram', category: 'notifications', enabled: true, status: 'idle' },
  { name: 'promo-expiry-check', schedule: '0 6 * * *', description: 'Alertes codes promo expirant bientôt', category: 'marketing', enabled: true, status: 'idle' },
]

// ─── System Event Types ─────────────────────────────────────────────

export interface SystemEvent {
  id: string; type: string; category: string; message: string; severity: 'info' | 'warning' | 'error' | 'critical'; timestamp: Date; metadata?: Record<string, unknown>
}

export const EVENT_CATEGORIES = ['system', 'auth', 'billing', 'agents', 'cron', 'api', 'security', 'deployment']

// ─── Dark Mode Config ───────────────────────────────────────────────

export const THEME_VARS = {
  light: { '--bg-primary': '#FFFFFF', '--bg-secondary': '#F9FAFB', '--text-primary': '#1A1A2E', '--text-secondary': '#6B7280', '--border': '#E5E7EB', '--accent': '#E50914' },
  dark: { '--bg-primary': '#0A0A0A', '--bg-secondary': '#111111', '--text-primary': '#FFFFFF', '--text-secondary': '#9CA3AF', '--border': '#1F2937', '--accent': '#E50914' },
}
