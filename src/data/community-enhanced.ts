/**
 * CineGeny Community Enhanced
 * Builds ON TOP of existing Community Governance (no regression).
 * 7 agents, reputation, mentors, collabs, teams, widget, custom agents.
 */

export interface CommunityAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const COMMUNITY_AGENTS: CommunityAgent[] = [
  { slug: 'cg-community-curator', name: 'Community curator', role: 'Moderation & quality', description: 'Moderates content, checks contribution quality, highlights the best creators.', icon: 'shield-check', color: '#3B82F6' },
  { slug: 'cg-reputation-engine', name: 'Reputation engine', role: 'Reputation score', description: 'Computes the reputation score based on votes received, task quality, seniority and engagement.', icon: 'star', color: '#F59E0B' },
  { slug: 'cg-mentor-matcher', name: 'Matcher Mentors', role: 'Mentorat', description: 'Connects experienced creators with newcomers. Analyzes skill/interest compatibility.', icon: 'users', color: '#10B981' },
  { slug: 'cg-collab-facilitator', name: 'Facilitateur Collabs', role: 'Co-creation', description: 'Facilitates collaborations between creators: skill matching, co-creation proposals.', icon: 'handshake', color: '#8B5CF6' },
  { slug: 'cg-team-coordinator', name: 'Team coordinator', role: 'Team management', description: 'Manages collaborative per-film workspaces: roles, permissions, invitations, contribution tracking.', icon: 'briefcase', color: '#EC4899' },
  { slug: 'cg-feed-curator', name: 'Curateur Feed', role: 'Activity feed', description: 'Curates the community activity feed: highlights notable contributions, builds social proof.', icon: 'activity', color: '#06B6D4' },
  { slug: 'cg-agent-builder', name: 'Agent Builder', role: 'Custom agents', description: 'Guides users in creating their own custom AI agents for their projects.', icon: 'wrench', color: '#EF4444' },
]

// ─── Reputation System ──────────────────────────────────────────────

export interface ReputationFactor {
  id: string; label: string; weight: number; description: string; icon: string
}

export const REPUTATION_FACTORS: ReputationFactor[] = [
  { id: 'votes_received', label: 'Votes received', weight: 25, description: 'Nombre de votes positifs sur vos contributions', icon: 'star' },
  { id: 'task_quality', label: 'Task quality', weight: 25, description: 'Average score on completed tasks (validated vs rejected)', icon: 'check-circle' },
  { id: 'seniority', label: 'Seniority', weight: 15, description: 'Time active on the platform', icon: 'clock' },
  { id: 'engagement', label: 'Engagement', weight: 20, description: 'Activity frequency, streak, participation', icon: 'flame' },
  { id: 'mentoring', label: 'Mentorat', weight: 15, description: 'Referrals guided, questions answered, community help', icon: 'heart' },
]

export const REPUTATION_LEVELS = [
  { min: 0, label: 'Nouveau', color: '#9CA3AF', badge: '🌱' },
  { min: 20, label: 'Contributeur', color: '#3B82F6', badge: '⭐' },
  { min: 40, label: 'Established Creator', color: '#8B5CF6', badge: '🎬' },
  { min: 60, label: 'Expert', color: '#F59E0B', badge: '🏆' },
  { min: 80, label: 'Master', color: '#E50914', badge: '👑' },
  { min: 95, label: 'Legend', color: '#FFD700', badge: '💎' },
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
  'Screenplay', 'Directing', 'Production', 'VFX', 'Sound Design',
  'Composition', 'Montage', 'Photographie', 'Marketing', 'Investissement',
]

// ─── Collaboration Types ────────────────────────────────────────────

export interface CollabType {
  id: string; label: string; description: string; icon: string; color: string
}

export const COLLAB_TYPES: CollabType[] = [
  { id: 'co-write', label: 'Co-writing', description: 'Write a screenplay together', icon: 'pen-tool', color: '#3B82F6' },
  { id: 'co-direct', label: 'Co-directing', description: 'Partager la direction artistique', icon: 'film', color: '#E50914' },
  { id: 'co-produce', label: 'Co-production', description: 'Share costs and revenue', icon: 'briefcase', color: '#10B981' },
  { id: 'skill-trade', label: 'Skill exchange', description: 'VFX for music, editing for screenplay...', icon: 'refresh-cw', color: '#8B5CF6' },
  { id: 'mentoring', label: 'Mentorat', description: 'Mentor a less experienced creator', icon: 'heart', color: '#EC4899' },
  { id: 'review', label: 'Peer review', description: 'Relire et critiquer mutuellement', icon: 'message-circle', color: '#F59E0B' },
]

// ─── Team Roles ─────────────────────────────────────────────────────

export interface TeamRole {
  id: string; label: string; permissions: string[]; icon: string; color: string
}

export const TEAM_ROLES: TeamRole[] = [
  { id: 'owner', label: 'Owner', permissions: ['all'], icon: 'crown', color: '#FFD700' },
  { id: 'director', label: 'Director', permissions: ['edit_all', 'approve', 'invite', 'manage_agents'], icon: 'clapperboard', color: '#E50914' },
  { id: 'producer', label: 'Producteur', permissions: ['edit_budget', 'approve', 'invite', 'manage_team'], icon: 'briefcase', color: '#10B981' },
  { id: 'writer', label: 'Screenwriter', permissions: ['edit_script', 'comment'], icon: 'pen-tool', color: '#3B82F6' },
  { id: 'artist', label: 'Artiste', permissions: ['edit_visual', 'upload', 'comment'], icon: 'palette', color: '#8B5CF6' },
  { id: 'contributor', label: 'Contributeur', permissions: ['edit_assigned', 'comment'], icon: 'user', color: '#6B7280' },
  { id: 'viewer', label: 'Observateur', permissions: ['view_only'], icon: 'eye', color: '#9CA3AF' },
]

// ─── Widget Config ──────────────────────────────────────────────────

export const WIDGET_CONFIG = {
  embedCode: `<script src="https://cinegeny.com/widget.js" data-film-id="{FILM_ID}" data-theme="dark"></script>`,
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
  { key: 'name', label: 'Nom de l\'agent', type: 'text', required: true, placeholder: 'My Cinema Agent' },
  { key: 'role', label: 'Role / Specialty', type: 'text', required: true, placeholder: 'e.g. Thriller screenplay analyst' },
  { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe what your agent does...' },
  { key: 'systemPrompt', label: 'Instructions (System Prompt)', type: 'textarea', required: true, placeholder: 'You are an agent specialized in...' },
  { key: 'model', label: 'AI model', type: 'select', required: true, options: ['claude-haiku-4-5', 'claude-sonnet-4-6', 'claude-opus-4-6'] },
  { key: 'temperature', label: 'Creativity (temperature)', type: 'slider', required: false, min: 0, max: 100 },
  { key: 'maxTokens', label: 'Max response length', type: 'select', required: false, options: ['2048', '4096', '8192', '16384'] },
  { key: 'category', label: 'Category', type: 'select', required: true, options: ['Writing', 'Analyse', 'Production', 'Marketing', 'Technique', 'Autre'] },
  { key: 'icon', label: 'Icon', type: 'select', required: false, options: ['bot', 'brain', 'pen-tool', 'film', 'star', 'zap', 'shield', 'target'] },
]

// ─── Activity Feed Types ────────────────────────────────────────────

export const FEED_EVENT_TYPES = [
  { type: 'film_created', label: 'created a film', icon: 'film', color: '#E50914' },
  { type: 'task_completed', label: 'completed a task', icon: 'check-circle', color: '#10B981' },
  { type: 'vote_cast', label: 'voted', icon: 'star', color: '#F59E0B' },
  { type: 'comment_posted', label: 'commented', icon: 'message-circle', color: '#3B82F6' },
  { type: 'collab_started', label: 'started a collaboration', icon: 'users', color: '#8B5CF6' },
  { type: 'badge_earned', label: 'a obtenu un badge', icon: 'award', color: '#EC4899' },
  { type: 'level_up', label: 'leveled up', icon: 'trending-up', color: '#06B6D4' },
  { type: 'mentor_assigned', label: 'est devenu mentor', icon: 'heart', color: '#EF4444' },
]
