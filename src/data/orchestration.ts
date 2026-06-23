/**
 * CineGeny Orchestration & Event Architecture
 * 7 agents, approval workflows, event bus, SSE, orchestrator.
 */

export interface OrchestrationAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const ORCHESTRATION_AGENTS: OrchestrationAgent[] = [
  { slug: 'cg-approval-engine', name: 'Approval Engine', role: 'Workflow d\'approbation', description: 'Manages the 3 approval levels (minor/moderate/critical). Auto-expiration, configurable auto-approval, multi-channel.', icon: 'check-square', color: '#10B981' },
  { slug: 'cg-event-dispatcher', name: 'Event Dispatcher', role: 'Event bus', description: 'Pub/sub avec correlation IDs, handlers par type, logging configurable, retry automatique.', icon: 'radio', color: '#3B82F6' },
  { slug: 'cg-sse-manager', name: 'SSE Manager', role: 'Real-time streaming', description: 'Manages up to 500 simultaneous SSE connections. 30s heartbeat, 90s dead-client detection, backpressure, alerts at 300 clients.', icon: 'wifi', color: '#8B5CF6' },
  { slug: 'cg-orchestrator', name: 'Orchestrateur', role: 'Boucle principale', description: '30s loop: TaskScheduler + RecurringScheduler + EventDrivenOrchestrator. Coordinates all systems.', icon: 'cog', color: '#F59E0B' },
  { slug: 'cg-report-generator', name: 'Report Generator', role: 'Rapports automatiques', description: 'Generates and sends the weekly (Monday) and monthly (1st) reports via Telegram. Stats, KPIs, trends.', icon: 'file-bar-chart', color: '#EC4899' },
  { slug: 'cg-escalation-handler', name: 'Escalation Handler', role: 'Escalade & timeouts', description: 'Manages escalations: auto-expires old requests, escalates L1→L2→L3, multi-channel notification.', icon: 'arrow-up-circle', color: '#EF4444' },
  { slug: 'cg-workflow-designer', name: 'Workflow Designer', role: 'Design workflows', description: 'Designs custom approval workflows by action type and role. Visual workflow builder.', icon: 'git-branch', color: '#06B6D4' },
]

// ─── Approval Levels ────────────────────────────────────────────────

export type ApprovalLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'

export interface ApprovalLevelConfig {
  level: ApprovalLevel
  label: string
  description: string
  color: string
  icon: string
  autoExpireHours: number
  autoApprovalEnabled: boolean
  requiredRole: string
  channels: ('telegram' | 'email' | 'inapp')[]
}

export const APPROVAL_LEVELS: ApprovalLevelConfig[] = [
  { level: 'LEVEL_1', label: 'Minor', description: 'Low-impact actions: notifications, non-critical feature flags', color: '#10B981', icon: 'check', autoExpireHours: 24, autoApprovalEnabled: true, requiredRole: 'ADMIN', channels: ['inapp'] },
  { level: 'LEVEL_2', label: 'Moderate', description: 'Medium-impact actions: agent config, promo codes, user tier changes', color: '#F59E0B', icon: 'alert-circle', autoExpireHours: 48, autoApprovalEnabled: false, requiredRole: 'ADMIN', channels: ['telegram', 'inapp'] },
  { level: 'LEVEL_3', label: 'Critical', description: 'Critical actions: billing params, maintenance mode, deletions, deployment', color: '#EF4444', icon: 'shield-alert', autoExpireHours: 72, autoApprovalEnabled: false, requiredRole: 'ADMIN', channels: ['telegram', 'email', 'inapp'] },
]

// ─── Auto-Approval Rules ────────────────────────────────────────────

export interface AutoApprovalRule {
  actionType: string
  level: ApprovalLevel
  autoApprove: boolean
  condition: string
}

export const AUTO_APPROVAL_RULES: AutoApprovalRule[] = [
  { actionType: 'SEND_NOTIFICATION', level: 'LEVEL_1', autoApprove: true, condition: 'Always auto-approved' },
  { actionType: 'CREATE_PROMO_CODE', level: 'LEVEL_1', autoApprove: true, condition: 'If value < 10 credits' },
  { actionType: 'UPDATE_AGENT_CONFIG', level: 'LEVEL_1', autoApprove: true, condition: 'Si seulement temperature/maxTokens' },
  { actionType: 'TOGGLE_FEATURE_FLAG', level: 'LEVEL_2', autoApprove: false, condition: 'Requiert validation admin' },
  { actionType: 'UPDATE_USER_TIER', level: 'LEVEL_2', autoApprove: false, condition: 'Requiert validation admin' },
  { actionType: 'MODIFY_BILLING_PARAM', level: 'LEVEL_3', autoApprove: false, condition: 'Critique — validation obligatoire' },
  { actionType: 'PUBLISH_CONTENT', level: 'LEVEL_2', autoApprove: false, condition: 'Requiert review avant publication' },
  { actionType: 'TRIGGER_CRON', level: 'LEVEL_1', autoApprove: true, condition: 'Safe crons auto-approved' },
]

// ─── Event Types ────────────────────────────────────────────────────

export interface EventType {
  type: string; category: string; description: string; severity: 'info' | 'warning' | 'error' | 'critical'
}

export const EVENT_TYPES: EventType[] = [
  { type: 'user.registered', category: 'auth', description: 'Nouvel utilisateur inscrit', severity: 'info' },
  { type: 'user.login', category: 'auth', description: 'Connexion utilisateur', severity: 'info' },
  { type: 'user.login_failed', category: 'auth', description: 'Connection failure', severity: 'warning' },
  { type: 'film.created', category: 'content', description: 'Nouveau projet de film', severity: 'info' },
  { type: 'film.voted', category: 'content', description: 'Vote sur un film', severity: 'info' },
  { type: 'task.completed', category: 'content', description: 'Task completed', severity: 'info' },
  { type: 'agent.executed', category: 'ai', description: 'AI agent executed', severity: 'info' },
  { type: 'agent.failed', category: 'ai', description: 'AI agent failure', severity: 'error' },
  { type: 'chat.message', category: 'ai', description: 'Chat message sent', severity: 'info' },
  { type: 'wallet.deposit', category: 'billing', description: 'Credit deposit', severity: 'info' },
  { type: 'wallet.low_balance', category: 'billing', description: 'Low balance detected', severity: 'warning' },
  { type: 'proposal.created', category: 'governance', description: 'Proposal created', severity: 'info' },
  { type: 'proposal.approved', category: 'governance', description: 'Proposal approved', severity: 'info' },
  { type: 'circuit.opened', category: 'system', description: 'Circuit breaker ouvert', severity: 'error' },
  { type: 'health.degraded', category: 'system', description: 'Degraded health', severity: 'warning' },
  { type: 'health.critical', category: 'system', description: 'Critical health', severity: 'critical' },
  { type: 'sse.capacity_warning', category: 'system', description: 'SSE at 60% capacity (300/500)', severity: 'warning' },
  { type: 'sse.capacity_critical', category: 'system', description: 'SSE at 80%+ capacity', severity: 'critical' },
  { type: 'cron.executed', category: 'system', description: 'Cron job executed', severity: 'info' },
  { type: 'cron.failed', category: 'system', description: 'Cron job failed', severity: 'error' },
]

// ─── SSE Config ─────────────────────────────────────────────────────

export const SSE_CONFIG = {
  maxClients: 500,
  warningThreshold: 300,       // Alert at 300 (60%)
  criticalThreshold: 400,      // Critical at 400 (80%)
  heartbeatIntervalMs: 30_000, // 30s
  deadClientTimeoutMs: 90_000, // 90s no activity = dead
  backpressureMaxQueue: 100,   // Max queued events per client
  cleanupIntervalMs: 60_000,   // Cleanup dead clients every 60s
}

// ─── Orchestrator Config ────────────────────────────────────────────

export const ORCHESTRATOR_CONFIG = {
  mainLoopIntervalMs: 30_000,  // 30s main loop
  taskSchedulerEnabled: true,
  recurringSchedulerEnabled: true,
  eventDrivenEnabled: true,
  maxConcurrentTasks: 10,
  retryAttempts: 3,
  retryDelayMs: 5_000,
}

// ─── Reporting Schedule ─────────────────────────────────────────────

export interface ReportSchedule {
  id: string; type: 'weekly' | 'monthly'; label: string; schedule: string; channel: string; description: string
}

export const REPORT_SCHEDULES: ReportSchedule[] = [
  { id: 'weekly-report', type: 'weekly', label: 'Rapport Hebdomadaire', schedule: 'Lundi 8h', channel: 'telegram', description: 'Stats semaine, nouveaux users, films tendance, revenue, top agents' },
  { id: 'monthly-report', type: 'monthly', label: 'Rapport Mensuel', schedule: '1er du mois 8h', channel: 'telegram', description: 'Monthly KPIs, growth, prior-month comparison, trends, next-month plan' },
]
