/**
 * CineGeny Briefing & Intelligent Notifications
 * 7 agents, daily briefing, improvement review, attack plan.
 */

export interface BriefingAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const BRIEFING_AGENTS: BriefingAgent[] = [
  { slug: 'cg-morning-briefer', name: 'Briefeur Matinal', role: 'Briefing quotidien', description: 'Compile les stats de la veille, nouveaux users, films tendance, investissements et tâches complétées. Envoi Telegram à 8h.', icon: 'sun', color: '#F59E0B' },
  { slug: 'cg-improvement-scout', name: 'Éclaireur Améliorations', role: 'Détection opportunités', description: 'Scanne quotidiennement les nouvelles APIs IA, fonctions sous-utilisées, intégrations possibles et tendances tech pertinentes.', icon: 'radar', color: '#3B82F6' },
  { slug: 'cg-attack-planner', name: 'Planificateur d\'Attaque', role: 'Plan d\'action quotidien', description: 'Génère un plan d\'attaque IA quotidien priorisé pour l\'admin : tâches critiques, opportunités, améliorations à implémenter.', icon: 'target', color: '#E50914' },
  { slug: 'cg-alert-dispatcher', name: 'Dispatche Alertes', role: 'Notifications intelligentes', description: 'Route les notifications vers les bons canaux (Telegram, email, in-app) selon la priorité et les préférences de l\'admin.', icon: 'bell', color: '#8B5CF6' },
  { slug: 'cg-trend-watcher', name: 'Veilleur Tendances', role: 'Tendances tech & IA', description: 'Surveille les évolutions des APIs IA (nouveaux modèles, prix, capacités) et les tendances pertinentes pour CineGeny.', icon: 'trending-up', color: '#10B981' },
  { slug: 'cg-usage-analyst', name: 'Analyste Usage', role: 'Fonctions sous-utilisées', description: 'Identifie les fonctionnalités existantes peu utilisées et propose des actions pour augmenter leur adoption.', icon: 'bar-chart', color: '#EC4899' },
  { slug: 'cg-integration-scout', name: 'Éclaireur Intégrations', role: 'Nouvelles intégrations', description: 'Recherche de nouvelles intégrations possibles : APIs, services, outils qui pourraient enrichir la plateforme.', icon: 'plug', color: '#06B6D4' },
]

// ─── Improvement Categories ─────────────────────────────────────────

export interface ImprovementCategory {
  id: string; label: string; icon: string; color: string; description: string
}

export const IMPROVEMENT_CATEGORIES: ImprovementCategory[] = [
  { id: 'new-apis', label: 'Nouvelles APIs', icon: 'plug', color: '#3B82F6', description: 'Nouveaux modèles IA et services disponibles' },
  { id: 'underused', label: 'Fonctions sous-utilisées', icon: 'bar-chart', color: '#F59E0B', description: 'Features existantes peu exploitées' },
  { id: 'integrations', label: 'Intégrations possibles', icon: 'link', color: '#8B5CF6', description: 'Services externes à connecter' },
  { id: 'tech-trends', label: 'Tendances tech', icon: 'trending-up', color: '#10B981', description: 'Évolutions pertinentes pour la plateforme' },
  { id: 'performance', label: 'Performance', icon: 'zap', color: '#EF4444', description: 'Optimisations de vitesse et coût' },
  { id: 'ux', label: 'Expérience utilisateur', icon: 'smile', color: '#EC4899', description: 'Améliorations UX identifiées' },
]

// ─── Sample Improvements ────────────────────────────────────────────

export interface ImprovementProposal {
  id: string
  category: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  priority: number  // 1=highest
  status: 'proposed' | 'accepted' | 'rejected' | 'implemented'
  source: string    // Which agent proposed this
  createdAt: string
}

export const SAMPLE_IMPROVEMENTS: ImprovementProposal[] = [
  { id: 'imp-1', category: 'new-apis', title: 'Intégrer Kling 2.0 Video API', description: 'Kling a lancé son API v2 avec lip-sync et contrôle caméra. Permettrait de générer des scènes de film en 4K directement sur la plateforme.', impact: 'high', effort: 'medium', priority: 1, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
  { id: 'imp-2', category: 'new-apis', title: 'Claude 4.6 Extended Thinking disponible', description: 'Le nouveau modèle Opus avec Extended Thinking est disponible. Améliorerait significativement la qualité des agents L3 Strategy.', impact: 'high', effort: 'low', priority: 2, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
  { id: 'imp-3', category: 'underused', title: 'Deep Discussions: 2% d\'adoption', description: 'Les 86 templates de Deep Discussions ne sont utilisés que par 2% des users. Proposer un "Discussion du jour" sur la homepage.', impact: 'medium', effort: 'low', priority: 3, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-4', category: 'underused', title: 'Trailer Maker: pas de partage viral', description: 'Le Trailer Maker génère du contenu mais aucun bouton de partage natif vers TikTok/YouTube Shorts. Ajouter l\'export vertical 9:16.', impact: 'high', effort: 'medium', priority: 4, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-5', category: 'integrations', title: 'Webhooks Stripe pour paiements réels', description: 'Le système de crédits est prêt mais les paiements réels via Stripe ne sont pas connectés. Priorité pour le lancement.', impact: 'high', effort: 'high', priority: 5, status: 'proposed', source: 'cg-integration-scout', createdAt: '2026-03-16' },
  { id: 'imp-6', category: 'integrations', title: 'Connecter Resend pour emails transactionnels', description: 'Les 15 templates email sont prêts mais l\'envoi réel via Resend n\'est pas branché. Quick win pour l\'onboarding.', impact: 'high', effort: 'low', priority: 6, status: 'proposed', source: 'cg-integration-scout', createdAt: '2026-03-16' },
  { id: 'imp-7', category: 'tech-trends', title: 'Suno V4 pour musique originale', description: 'Suno V4 permet de générer des chansons complètes avec paroles. Parfait pour les bandes originales de films CineGeny.', impact: 'medium', effort: 'medium', priority: 7, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
  { id: 'imp-8', category: 'performance', title: 'Activer le prompt caching Anthropic', description: 'Le header cache_control est prêt dans le code mais pas activé en production. Réduirait les coûts de 90% sur les system prompts.', impact: 'high', effort: 'low', priority: 8, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-9', category: 'ux', title: 'Onboarding wizard interactif', description: 'Les 7 étapes d\'onboarding existent mais ne sont pas liées à un wizard interactif. Ajouter un flow guidé post-inscription.', impact: 'medium', effort: 'medium', priority: 9, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-10', category: 'new-apis', title: 'ElevenLabs Conversational AI', description: 'ElevenLabs propose maintenant une API de conversation vocale. Permettrait des pitchs vidéo interactifs avec les agents.', impact: 'medium', effort: 'high', priority: 10, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
]

// ─── Notification Event Types ───────────────────────────────────────

export interface NotificationEventType {
  id: string; label: string; description: string; icon: string; color: string
  channels: ('telegram' | 'email' | 'inapp')[]
  defaultEnabled: boolean
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export const NOTIFICATION_EVENTS: NotificationEventType[] = [
  { id: 'new_user', label: 'Nouvel utilisateur', description: 'Un utilisateur s\'inscrit', icon: 'user-plus', color: '#3B82F6', channels: ['telegram', 'inapp'], defaultEnabled: true, priority: 'low' },
  { id: 'new_investment', label: 'Nouvel investissement', description: 'Quelqu\'un investit dans un film', icon: 'trending-up', color: '#10B981', channels: ['telegram', 'email', 'inapp'], defaultEnabled: true, priority: 'high' },
  { id: 'film_completed', label: 'Film complété', description: 'Un film termine sa production', icon: 'film', color: '#8B5CF6', channels: ['telegram', 'email', 'inapp'], defaultEnabled: true, priority: 'high' },
  { id: 'task_submitted', label: 'Tâche soumise', description: 'Un créateur soumet une tâche', icon: 'check-circle', color: '#F59E0B', channels: ['inapp'], defaultEnabled: true, priority: 'low' },
  { id: 'vote_milestone', label: 'Seuil de votes', description: 'Un film atteint un seuil de votes', icon: 'star', color: '#EF4444', channels: ['telegram', 'inapp'], defaultEnabled: true, priority: 'medium' },
  { id: 'error_spike', label: 'Pic d\'erreurs', description: 'Taux d\'erreur IA anormalement élevé', icon: 'alert-triangle', color: '#EF4444', channels: ['telegram', 'email'], defaultEnabled: true, priority: 'critical' },
  { id: 'low_balance_platform', label: 'Solde plateforme bas', description: 'Le solde global de crédits est bas', icon: 'alert-circle', color: '#EF4444', channels: ['telegram', 'email'], defaultEnabled: true, priority: 'critical' },
  { id: 'daily_briefing', label: 'Briefing matinal', description: 'Rapport quotidien automatique', icon: 'sun', color: '#F59E0B', channels: ['telegram'], defaultEnabled: true, priority: 'medium' },
  { id: 'improvement_review', label: 'Review améliorations', description: 'Propositions d\'améliorations quotidiennes', icon: 'lightbulb', color: '#8B5CF6', channels: ['telegram'], defaultEnabled: true, priority: 'medium' },
  { id: 'attack_plan', label: 'Plan d\'attaque', description: 'Plan d\'action IA quotidien', icon: 'target', color: '#E50914', channels: ['telegram'], defaultEnabled: true, priority: 'medium' },
  { id: 'referral_milestone', label: 'Palier parrainage', description: 'Un parrain atteint un nouveau palier', icon: 'users', color: '#06B6D4', channels: ['telegram', 'inapp'], defaultEnabled: false, priority: 'low' },
  { id: 'promo_expiring', label: 'Promo expire bientôt', description: 'Un code promo expire dans 48h', icon: 'clock', color: '#F59E0B', channels: ['telegram'], defaultEnabled: true, priority: 'low' },
]

// ─── Attack Plan Templates ──────────────────────────────────────────

export interface AttackPlanItem {
  time: string; title: string; description: string; priority: 'must' | 'should' | 'nice'; category: string
}

export const SAMPLE_ATTACK_PLAN: AttackPlanItem[] = [
  { time: '08:00', title: 'Review briefing matinal', description: 'Consulter les stats de la veille et identifier les anomalies', priority: 'must', category: 'review' },
  { time: '08:30', title: 'Approuver les propositions en attente', description: '3 propositions autopilot en attente d\'approbation', priority: 'must', category: 'governance' },
  { time: '09:00', title: 'Implémenter le prompt caching', description: 'Quick win: activer cache_control sur les system prompts (−90% coûts)', priority: 'must', category: 'performance' },
  { time: '10:00', title: 'Connecter Resend pour les emails', description: 'Les 15 templates sont prêts, il manque l\'envoi réel', priority: 'should', category: 'integration' },
  { time: '11:00', title: 'Tester Kling 2.0 API', description: 'Évaluer la qualité vidéo pour les scènes de film', priority: 'should', category: 'exploration' },
  { time: '14:00', title: 'Review des fonctions sous-utilisées', description: 'Deep Discussions et Trailer Maker ont un faible taux d\'adoption', priority: 'should', category: 'ux' },
  { time: '15:00', title: 'Préparer le pitch deck investisseur', description: 'Utiliser le Document Factory pour générer un pitch deck mis à jour', priority: 'nice', category: 'business' },
  { time: '16:00', title: 'Planifier les posts de la semaine', description: 'Utiliser le Marketing Studio pour préparer 7 posts', priority: 'nice', category: 'marketing' },
]
