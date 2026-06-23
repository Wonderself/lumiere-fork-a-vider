/**
 * CineGeny Briefing & Intelligent Notifications
 * 7 agents, daily briefing, improvement review, attack plan.
 */

export interface BriefingAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const BRIEFING_AGENTS: BriefingAgent[] = [
  { slug: 'cg-morning-briefer', name: 'Briefeur Matinal', role: 'Briefing quotidien', description: 'Compiles yesterday\'s stats, new users, trending films, investments and completed tasks. Sent via Telegram at 8am.', icon: 'sun', color: '#F59E0B' },
  { slug: 'cg-improvement-scout', name: 'Improvements scout', role: 'Opportunity detection', description: 'Scans daily for new AI APIs, underused features, possible integrations and relevant tech trends.', icon: 'radar', color: '#3B82F6' },
  { slug: 'cg-attack-planner', name: 'Planificateur d\'Attaque', role: 'Plan d\'action quotidien', description: 'Generates a prioritized daily AI action plan for the admin: critical tasks, opportunities, improvements to implement.', icon: 'target', color: '#E50914' },
  { slug: 'cg-alert-dispatcher', name: 'Dispatche Alertes', role: 'Notifications intelligentes', description: 'Routes notifications to the right channels (Telegram, email, in-app) based on priority and the admin\'s preferences.', icon: 'bell', color: '#8B5CF6' },
  { slug: 'cg-trend-watcher', name: 'Veilleur Tendances', role: 'Tendances tech & IA', description: 'Monitors AI API developments (new models, prices, capabilities) and trends relevant to CineGeny.', icon: 'trending-up', color: '#10B981' },
  { slug: 'cg-usage-analyst', name: 'Analyste Usage', role: 'Underused features', description: 'Identifies underused existing features and suggests actions to increase their adoption.', icon: 'bar-chart', color: '#EC4899' },
  { slug: 'cg-integration-scout', name: 'Integrations scout', role: 'New integrations', description: 'Researches possible new integrations: APIs, services, tools that could enrich the platform.', icon: 'plug', color: '#06B6D4' },
]

// ─── Improvement Categories ─────────────────────────────────────────

export interface ImprovementCategory {
  id: string; label: string; icon: string; color: string; description: string
}

export const IMPROVEMENT_CATEGORIES: ImprovementCategory[] = [
  { id: 'new-apis', label: 'Nouvelles APIs', icon: 'plug', color: '#3B82F6', description: 'New AI models and services available' },
  { id: 'underused', label: 'Underused features', icon: 'bar-chart', color: '#F59E0B', description: 'Underused existing features' },
  { id: 'integrations', label: 'Possible integrations', icon: 'link', color: '#8B5CF6', description: 'External services to connect' },
  { id: 'tech-trends', label: 'Tendances tech', icon: 'trending-up', color: '#10B981', description: 'Relevant developments for the platform' },
  { id: 'performance', label: 'Performance', icon: 'zap', color: '#EF4444', description: 'Speed and cost optimizations' },
  { id: 'ux', label: 'User experience', icon: 'smile', color: '#EC4899', description: 'Identified UX improvements' },
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
  { id: 'imp-1', category: 'new-apis', title: 'Integrate the Kling 2.0 Video API', description: 'Kling launched its v2 API with lip-sync and camera control. Would allow generating 4K film scenes directly on the platform.', impact: 'high', effort: 'medium', priority: 1, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
  { id: 'imp-2', category: 'new-apis', title: 'Claude 4.6 Extended Thinking disponible', description: 'The new Opus model with Extended Thinking is available. Would significantly improve the quality of L3 Strategy agents.', impact: 'high', effort: 'low', priority: 2, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
  { id: 'imp-3', category: 'underused', title: 'Deep Discussions: 2% d\'adoption', description: 'The 86 Deep Discussions templates are used by only 2% of users. Add a "Discussion of the day" on the homepage.', impact: 'medium', effort: 'low', priority: 3, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-4', category: 'underused', title: 'Trailer Maker: pas de partage viral', description: 'The Trailer Maker generates content but has no native share button to TikTok/YouTube Shorts. Add a vertical 9:16 export.', impact: 'high', effort: 'medium', priority: 4, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-5', category: 'integrations', title: 'Stripe webhooks for real payments', description: 'The credit system is ready but real payments via Stripe are not connected. Priority for launch.', impact: 'high', effort: 'high', priority: 5, status: 'proposed', source: 'cg-integration-scout', createdAt: '2026-03-16' },
  { id: 'imp-6', category: 'integrations', title: 'Connecter Resend pour emails transactionnels', description: 'The 15 email templates are ready but real sending via Resend isn\'t wired up. Quick win for onboarding.', impact: 'high', effort: 'low', priority: 6, status: 'proposed', source: 'cg-integration-scout', createdAt: '2026-03-16' },
  { id: 'imp-7', category: 'tech-trends', title: 'Suno V4 pour musique originale', description: 'Suno V4 can generate complete songs with lyrics. Perfect for CineGeny film soundtracks.', impact: 'medium', effort: 'medium', priority: 7, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
  { id: 'imp-8', category: 'performance', title: 'Activer le prompt caching Anthropic', description: 'The cache_control header is ready in the code but not enabled in production. Would cut costs by 90% on system prompts.', impact: 'high', effort: 'low', priority: 8, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-9', category: 'ux', title: 'Onboarding wizard interactif', description: 'The 7 onboarding steps exist but aren\'t linked to an interactive wizard. Add a guided post-signup flow.', impact: 'medium', effort: 'medium', priority: 9, status: 'proposed', source: 'cg-usage-analyst', createdAt: '2026-03-16' },
  { id: 'imp-10', category: 'new-apis', title: 'ElevenLabs Conversational AI', description: 'ElevenLabs now offers a voice conversation API. Would enable interactive video pitches with the agents.', impact: 'medium', effort: 'high', priority: 10, status: 'proposed', source: 'cg-trend-watcher', createdAt: '2026-03-16' },
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
  { id: 'film_completed', label: 'Film completed', description: 'Un film termine sa production', icon: 'film', color: '#8B5CF6', channels: ['telegram', 'email', 'inapp'], defaultEnabled: true, priority: 'high' },
  { id: 'task_submitted', label: 'Task submitted', description: 'A creator submits a task', icon: 'check-circle', color: '#F59E0B', channels: ['inapp'], defaultEnabled: true, priority: 'low' },
  { id: 'vote_milestone', label: 'Seuil de votes', description: 'Un film atteint un seuil de votes', icon: 'star', color: '#EF4444', channels: ['telegram', 'inapp'], defaultEnabled: true, priority: 'medium' },
  { id: 'error_spike', label: 'Pic d\'erreurs', description: 'Abnormally high AI error rate', icon: 'alert-triangle', color: '#EF4444', channels: ['telegram', 'email'], defaultEnabled: true, priority: 'critical' },
  { id: 'low_balance_platform', label: 'Solde plateforme bas', description: 'The global credit balance is low', icon: 'alert-circle', color: '#EF4444', channels: ['telegram', 'email'], defaultEnabled: true, priority: 'critical' },
  { id: 'daily_briefing', label: 'Briefing matinal', description: 'Rapport quotidien automatique', icon: 'sun', color: '#F59E0B', channels: ['telegram'], defaultEnabled: true, priority: 'medium' },
  { id: 'improvement_review', label: 'Review improvements', description: 'Daily improvement proposals', icon: 'lightbulb', color: '#8B5CF6', channels: ['telegram'], defaultEnabled: true, priority: 'medium' },
  { id: 'attack_plan', label: 'Plan d\'attaque', description: 'Plan d\'action IA quotidien', icon: 'target', color: '#E50914', channels: ['telegram'], defaultEnabled: true, priority: 'medium' },
  { id: 'referral_milestone', label: 'Palier parrainage', description: 'Un parrain atteint un nouveau palier', icon: 'users', color: '#06B6D4', channels: ['telegram', 'inapp'], defaultEnabled: false, priority: 'low' },
  { id: 'promo_expiring', label: 'Promo expiring soon', description: 'Un code promo expire dans 48h', icon: 'clock', color: '#F59E0B', channels: ['telegram'], defaultEnabled: true, priority: 'low' },
]

// ─── Attack Plan Templates ──────────────────────────────────────────

export interface AttackPlanItem {
  time: string; title: string; description: string; priority: 'must' | 'should' | 'nice'; category: string
}

export const SAMPLE_ATTACK_PLAN: AttackPlanItem[] = [
  { time: '08:00', title: 'Review briefing matinal', description: 'Consulter les stats de la veille et identifier les anomalies', priority: 'must', category: 'review' },
  { time: '08:30', title: 'Approuver les propositions en attente', description: '3 propositions autopilot en attente d\'approbation', priority: 'must', category: 'governance' },
  { time: '09:00', title: 'Implement prompt caching', description: 'Quick win: enable cache_control on system prompts (−90% cost)', priority: 'must', category: 'performance' },
  { time: '10:00', title: 'Connecter Resend pour les emails', description: 'The 15 templates are ready, only real sending is missing', priority: 'should', category: 'integration' },
  { time: '11:00', title: 'Tester Kling 2.0 API', description: 'Assess video quality for film scenes', priority: 'should', category: 'exploration' },
  { time: '14:00', title: 'Review of underused features', description: 'Deep Discussions et Trailer Maker ont un faible taux d\'adoption', priority: 'should', category: 'ux' },
  { time: '15:00', title: 'Prepare the investor pitch deck', description: 'Use the Document Factory to generate an updated pitch deck', priority: 'nice', category: 'business' },
  { time: '16:00', title: 'Planifier les posts de la semaine', description: 'Use the Marketing Studio to prepare 7 posts', priority: 'nice', category: 'marketing' },
]
