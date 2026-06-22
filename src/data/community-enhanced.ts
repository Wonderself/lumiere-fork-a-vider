/**
 * CineGeny Community Enhanced
 * Builds ON TOP of existing Community Governance (no regression).
 * 7 agents, reputation, mentors, collabs, teams, widget, custom agents.
 */

export interface CommunityAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const COMMUNITY_AGENTS: CommunityAgent[] = [
  { slug: 'cg-community-curator', name: 'Curateur Communauté', role: 'Modération & qualité', description: 'Modère les contenus, vérifie la qualité des contributions, met en avant les meilleurs créateurs.', icon: 'shield-check', color: '#3B82F6' },
  { slug: 'cg-reputation-engine', name: 'Moteur Réputation', role: 'Score de réputation', description: 'Calcule le score de réputation basé sur votes reçus, qualité des tâches, ancienneté et engagement.', icon: 'star', color: '#F59E0B' },
  { slug: 'cg-mentor-matcher', name: 'Matcher Mentors', role: 'Mentorat', description: 'Met en relation les créateurs expérimentés avec les nouveaux. Analyse compatibilité skills/intérêts.', icon: 'users', color: '#10B981' },
  { slug: 'cg-collab-facilitator', name: 'Facilitateur Collabs', role: 'Co-création', description: 'Facilite les collaborations entre créateurs : matching de compétences, propositions de co-création.', icon: 'handshake', color: '#8B5CF6' },
  { slug: 'cg-team-coordinator', name: 'Coordinateur Équipe', role: 'Team management', description: 'Gère les workspaces collaboratifs par film : rôles, permissions, invitations, suivi contributions.', icon: 'briefcase', color: '#EC4899' },
  { slug: 'cg-feed-curator', name: 'Curateur Feed', role: 'Fil d\'activité', description: 'Curate le fil d\'activité communautaire : met en avant les contributions remarquables, crée du social proof.', icon: 'activity', color: '#06B6D4' },
  { slug: 'cg-agent-builder', name: 'Agent Builder', role: 'Agents personnalisés', description: 'Guide les utilisateurs dans la création de leurs propres agents IA personnalisés pour leurs projets.', icon: 'wrench', color: '#EF4444' },
]

// ─── Reputation System ──────────────────────────────────────────────

export interface ReputationFactor {
  id: string; label: string; weight: number; description: string; icon: string
}

export const REPUTATION_FACTORS: ReputationFactor[] = [
  { id: 'votes_received', label: 'Votes reçus', weight: 25, description: 'Nombre de votes positifs sur vos contributions', icon: 'star' },
  { id: 'task_quality', label: 'Qualité tâches', weight: 25, description: 'Note moyenne sur les tâches complétées (validées vs rejetées)', icon: 'check-circle' },
  { id: 'seniority', label: 'Ancienneté', weight: 15, description: 'Durée d\'activité sur la plateforme', icon: 'clock' },
  { id: 'engagement', label: 'Engagement', weight: 20, description: 'Fréquence d\'activité, streak, participation', icon: 'flame' },
  { id: 'mentoring', label: 'Mentorat', weight: 15, description: 'Filleuls guidés, réponses aux questions, aide communautaire', icon: 'heart' },
]

export const REPUTATION_LEVELS = [
  { min: 0, label: 'Nouveau', color: '#9CA3AF', badge: '🌱' },
  { min: 20, label: 'Contributeur', color: '#3B82F6', badge: '⭐' },
  { min: 40, label: 'Créateur Confirmé', color: '#8B5CF6', badge: '🎬' },
  { min: 60, label: 'Expert', color: '#F59E0B', badge: '🏆' },
  { min: 80, label: 'Maître', color: '#E50914', badge: '👑' },
  { min: 95, label: 'Légende', color: '#FFD700', badge: '💎' },
]

// ─── Mentor System ──────────────────────────────────────────────────

export const MENTOR_CONFIG = {
  minReputation: 60,        // Min reputation to become mentor
  minTasksCompleted: 10,    // Min tasks completed
  minDaysActive: 30,        // Min days on platform
  maxMentees: 5,            // Max mentees at a time
  rewardPerMentee: { xp: 50, credits: 1_000_000 }, // Per successful mentoring
}

export const MENTOR_SPECIALTIES = [
  'Scénario', 'Réalisation', 'Production', 'VFX', 'Sound Design',
  'Composition', 'Montage', 'Photographie', 'Marketing', 'Investissement',
]

// ─── Collaboration Types ────────────────────────────────────────────

export interface CollabType {
  id: string; label: string; description: string; icon: string; color: string
}

export const COLLAB_TYPES: CollabType[] = [
  { id: 'co-write', label: 'Co-écriture', description: 'Écrire un scénario à plusieurs', icon: 'pen-tool', color: '#3B82F6' },
  { id: 'co-direct', label: 'Co-réalisation', description: 'Partager la direction artistique', icon: 'film', color: '#E50914' },
  { id: 'co-produce', label: 'Co-production', description: 'Partager les coûts et les revenus', icon: 'briefcase', color: '#10B981' },
  { id: 'skill-trade', label: 'Échange de compétences', description: 'VFX contre musique, montage contre scénario...', icon: 'refresh-cw', color: '#8B5CF6' },
  { id: 'mentoring', label: 'Mentorat', description: 'Guider un créateur moins expérimenté', icon: 'heart', color: '#EC4899' },
  { id: 'review', label: 'Review croisée', description: 'Relire et critiquer mutuellement', icon: 'message-circle', color: '#F59E0B' },
]

// ─── Team Roles ─────────────────────────────────────────────────────

export interface TeamRole {
  id: string; label: string; permissions: string[]; icon: string; color: string
}

export const TEAM_ROLES: TeamRole[] = [
  { id: 'owner', label: 'Propriétaire', permissions: ['all'], icon: 'crown', color: '#FFD700' },
  { id: 'director', label: 'Réalisateur', permissions: ['edit_all', 'approve', 'invite', 'manage_agents'], icon: 'clapperboard', color: '#E50914' },
  { id: 'producer', label: 'Producteur', permissions: ['edit_budget', 'approve', 'invite', 'manage_team'], icon: 'briefcase', color: '#10B981' },
  { id: 'writer', label: 'Scénariste', permissions: ['edit_script', 'comment'], icon: 'pen-tool', color: '#3B82F6' },
  { id: 'artist', label: 'Artiste', permissions: ['edit_visual', 'upload', 'comment'], icon: 'palette', color: '#8B5CF6' },
  { id: 'contributor', label: 'Contributeur', permissions: ['edit_assigned', 'comment'], icon: 'user', color: '#6B7280' },
  { id: 'viewer', label: 'Observateur', permissions: ['view_only'], icon: 'eye', color: '#9CA3AF' },
]

// ─── Widget Config ──────────────────────────────────────────────────

export const WIDGET_CONFIG = {
  embedCode: `<script src="https://cinegen.com/widget.js" data-film-id="{FILM_ID}" data-theme="dark"></script>`,
  features: ['Chat agents IA', 'Vote communautaire', 'Contributions', 'Commentaires'],
  themes: ['dark', 'light', 'auto'],
  sizes: ['compact', 'standard', 'full'],
}

// ─── Custom Agent Builder ───────────────────────────────────────────

export interface CustomAgentField {
  key: string; label: string; type: 'text' | 'textarea' | 'select' | 'number' | 'slider'; required: boolean
  placeholder?: string; options?: string[]; min?: number; max?: number
}

export const AGENT_BUILDER_FIELDS: CustomAgentField[] = [
  { key: 'name', label: 'Nom de l\'agent', type: 'text', required: true, placeholder: 'Mon Agent Cinéma' },
  { key: 'role', label: 'Rôle / Spécialité', type: 'text', required: true, placeholder: 'Ex: Analyste de scénarios de thriller' },
  { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Décrivez ce que fait votre agent...' },
  { key: 'systemPrompt', label: 'Instructions (System Prompt)', type: 'textarea', required: true, placeholder: 'Tu es un agent spécialisé en...' },
  { key: 'model', label: 'Modèle IA', type: 'select', required: true, options: ['claude-haiku-4-5', 'claude-sonnet-4-6', 'claude-opus-4-6'] },
  { key: 'temperature', label: 'Créativité (température)', type: 'slider', required: false, min: 0, max: 100 },
  { key: 'maxTokens', label: 'Longueur max réponse', type: 'select', required: false, options: ['2048', '4096', '8192', '16384'] },
  { key: 'category', label: 'Catégorie', type: 'select', required: true, options: ['Écriture', 'Analyse', 'Production', 'Marketing', 'Technique', 'Autre'] },
  { key: 'icon', label: 'Icône', type: 'select', required: false, options: ['bot', 'brain', 'pen-tool', 'film', 'star', 'zap', 'shield', 'target'] },
]

// ─── Activity Feed Types ────────────────────────────────────────────

export const FEED_EVENT_TYPES = [
  { type: 'film_created', label: 'a créé un film', icon: 'film', color: '#E50914' },
  { type: 'task_completed', label: 'a complété une tâche', icon: 'check-circle', color: '#10B981' },
  { type: 'vote_cast', label: 'a voté', icon: 'star', color: '#F59E0B' },
  { type: 'comment_posted', label: 'a commenté', icon: 'message-circle', color: '#3B82F6' },
  { type: 'collab_started', label: 'a démarré une collaboration', icon: 'users', color: '#8B5CF6' },
  { type: 'badge_earned', label: 'a obtenu un badge', icon: 'award', color: '#EC4899' },
  { type: 'level_up', label: 'a monté de niveau', icon: 'trending-up', color: '#06B6D4' },
  { type: 'mentor_assigned', label: 'est devenu mentor', icon: 'heart', color: '#EF4444' },
]
