/**
 * CineGeny Engagement & Rewards System
 * XP, levels, badges, streaks, challenges, referral.
 * Builds ON TOP of existing Lumens & Leaderboard (no regression).
 */

// ─── 7 Engagement Agents ────────────────────────────────────────────

export interface EngagementAgent {
  slug: string
  name: string
  role: string
  description: string
  icon: string
  color: string
}

export const ENGAGEMENT_AGENTS: EngagementAgent[] = [
  { slug: 'cg-reward-master', name: 'Rewards master', role: 'XP & rewards distribution', description: 'Manages XP distribution, badge unlocking and credit rewards. Analyzes user actions to maximize engagement.', icon: 'gift', color: '#F59E0B' },
  { slug: 'cg-level-designer', name: 'Level Designer', role: 'Progression & niveaux', description: 'Designs progression tiers and XP curves. Balances difficulty and reward to keep users motivated.', icon: 'trending-up', color: '#10B981' },
  { slug: 'cg-badge-curator', name: 'Curateur de Badges', role: 'Badges & achievements', description: 'Creates and awards cinema badges. Defines unlock criteria and rarities.', icon: 'award', color: '#8B5CF6' },
  { slug: 'cg-streak-tracker', name: 'Streak keeper', role: 'Streaks & multiplicateurs', description: 'Monitors consecutive activity streaks and applies XP multipliers. Sends reminders to keep streaks alive.', icon: 'flame', color: '#EF4444' },
  { slug: 'cg-challenge-master', name: 'Challenge master', role: 'Daily challenges', description: 'Generates personalized daily challenges based on the user\'s profile and activity. Distributes the rewards.', icon: 'target', color: '#3B82F6' },
  { slug: 'cg-referral-agent', name: 'Agent Parrainage', role: 'Programme de parrainage', description: 'Manages the referral program: unique codes, referral tracking, two-sided reward distribution.', icon: 'users', color: '#06B6D4' },
  { slug: 'cg-engagement-analyst', name: 'Analyste Engagement', role: 'Analytics & optimisation', description: 'Analyzes engagement metrics, spots drop-offs and suggests optimizations to the reward system.', icon: 'bar-chart-3', color: '#EC4899' },
]

// ─── XP Actions ─────────────────────────────────────────────────────

export interface XPAction {
  id: string
  label: string
  xp: number
  category: 'vote' | 'contribute' | 'invest' | 'social' | 'profile' | 'daily'
  icon: string
  description: string
  dailyLimit?: number
  creditReward?: number  // Bonus credits (micro-credits)
}

export const XP_ACTIONS: XPAction[] = [
  // Voting
  { id: 'vote_film', label: 'Voter sur un film', xp: 10, category: 'vote', icon: 'star', description: 'Vote for a community film', dailyLimit: 10 },
  { id: 'vote_scenario', label: 'Vote on a screenplay', xp: 15, category: 'vote', icon: 'file-text', description: 'Rate a submitted screenplay', dailyLimit: 5 },
  { id: 'vote_governance', label: 'Vote de gouvernance', xp: 25, category: 'vote', icon: 'shield', description: 'Take part in a governance decision' },

  // Contributing
  { id: 'complete_task', label: 'Complete a task', xp: 50, category: 'contribute', icon: 'check-circle', description: 'Finish a creative task', creditReward: 500_000 },
  { id: 'submit_screenplay', label: 'Submit a screenplay', xp: 100, category: 'contribute', icon: 'pen-tool', description: 'Submit a screenplay to the community', creditReward: 1_000_000 },
  { id: 'create_film_project', label: 'Create a film project', xp: 75, category: 'contribute', icon: 'film', description: 'Start a new film project' },
  { id: 'generate_content', label: 'Generate AI content', xp: 5, category: 'contribute', icon: 'sparkles', description: 'Utilisez un agent IA', dailyLimit: 20 },
  { id: 'comment_film', label: 'Commenter un film', xp: 5, category: 'contribute', icon: 'message-square', description: 'Laissez un commentaire constructif', dailyLimit: 10 },
  { id: 'review_film', label: 'Write a review', xp: 30, category: 'contribute', icon: 'edit', description: 'Write a detailed review', dailyLimit: 3 },

  // Investing
  { id: 'first_investment', label: 'Premier investissement', xp: 200, category: 'invest', icon: 'trending-up', description: 'Invest in a film for the first time', creditReward: 2_000_000 },
  { id: 'invest_film', label: 'Investir dans un film', xp: 50, category: 'invest', icon: 'coins', description: 'Financially back a project' },
  { id: 'back_crowdfunding', label: 'Soutenir un crowdfunding', xp: 75, category: 'invest', icon: 'heart', description: 'Participez au financement participatif' },

  // Social
  { id: 'share_film', label: 'Partager un film', xp: 10, category: 'social', icon: 'share-2', description: 'Share a film on social media', dailyLimit: 5 },
  { id: 'invite_friend', label: 'Inviter un ami', xp: 100, category: 'social', icon: 'user-plus', description: 'Parrainez un nouvel utilisateur', creditReward: 5_000_000 },
  { id: 'join_discussion', label: 'Rejoindre une discussion', xp: 15, category: 'social', icon: 'message-circle', description: 'Join a Deep Discussion', dailyLimit: 3 },

  // Profile
  { id: 'complete_profile', label: 'Complete your profile', xp: 50, category: 'profile', icon: 'user', description: 'Remplissez toutes les sections de votre profil', creditReward: 1_000_000 },
  { id: 'add_portfolio', label: 'Ajouter au portfolio', xp: 25, category: 'profile', icon: 'briefcase', description: 'Add a portfolio link' },
  { id: 'set_specialties', label: 'Choose your specialties', xp: 20, category: 'profile', icon: 'tag', description: 'Define your cinema specialties' },

  // Daily
  { id: 'daily_login', label: 'Connexion quotidienne', xp: 5, category: 'daily', icon: 'log-in', description: 'Connectez-vous chaque jour', creditReward: 100_000 },
  { id: 'daily_vote', label: 'Vote quotidien', xp: 10, category: 'daily', icon: 'check', description: 'Votez au moins une fois par jour', creditReward: 200_000 },
]

// ─── 8 Levels ───────────────────────────────────────────────────────

export interface UserLevel {
  level: number
  title: string
  titleEn: string
  minXP: number
  maxXP: number
  icon: string
  color: string
  perks: string[]
  creditBonus: number  // Micro-credits awarded on level-up
}

export const USER_LEVELS: UserLevel[] = [
  { level: 1, title: 'Figurant', titleEn: 'Extra', minXP: 0, maxXP: 100, icon: '🎬', color: '#9CA3AF', perks: ['Voting access', 'Profil basique'], creditBonus: 0 },
  { level: 2, title: 'Spectateur', titleEn: 'Viewer', minXP: 100, maxXP: 500, icon: '👀', color: '#6B7280', perks: ['Commentaires', 'Playlist'], creditBonus: 500_000 },
  { level: 3, title: 'Acteur', titleEn: 'Actor', minXP: 500, maxXP: 1500, icon: '🎭', color: '#3B82F6', perks: ['Creative tasks', 'Chat IA'], creditBonus: 1_000_000 },
  { level: 4, title: 'Screenwriter', titleEn: 'Screenwriter', minXP: 1500, maxXP: 3500, icon: '✍️', color: '#8B5CF6', perks: ['Screenplay submission', 'Agents L1'], creditBonus: 2_000_000 },
  { level: 5, title: 'Director', titleEn: 'Director', minXP: 3500, maxXP: 7000, icon: '🎥', color: '#F59E0B', perks: ['Unlimited projects', 'Agents L2'], creditBonus: 3_000_000 },
  { level: 6, title: 'Producteur', titleEn: 'Producer', minXP: 7000, maxXP: 15000, icon: '💼', color: '#10B981', perks: ['Crowdfunding', 'Advanced analytics'], creditBonus: 5_000_000 },
  { level: 7, title: 'Mogul', titleEn: 'Mogul', minXP: 15000, maxXP: 30000, icon: '👑', color: '#E50914', perks: ['Agents L3', 'Governance', 'Badge exclusif'], creditBonus: 10_000_000 },
  { level: 8, title: 'Legend', titleEn: 'Legend', minXP: 30000, maxXP: Infinity, icon: '⭐', color: '#FFD700', perks: ['Everything unlocked', 'Special title', 'Mentor'], creditBonus: 20_000_000 },
]

// ─── 25 Badges ──────────────────────────────────────────────────────

export interface CinemaBadge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  color: string
  criteria: string
  xpReward: number
  creditReward: number  // Micro-credits
}

export const CINEMA_BADGES: CinemaBadge[] = [
  // Common (easy to get)
  { id: 'first-clap', name: 'Premier Clap', description: 'Create your first film project', icon: '🎬', rarity: 'common', color: '#6B7280', criteria: 'create_film_project >= 1', xpReward: 25, creditReward: 500_000 },
  { id: 'first-vote', name: 'Voix qui Compte', description: 'Vote for the first time', icon: '🗳️', rarity: 'common', color: '#6B7280', criteria: 'vote_film >= 1', xpReward: 10, creditReward: 200_000 },
  { id: 'profile-star', name: 'Star profile', description: 'Complete your profile to 100%', icon: '⭐', rarity: 'common', color: '#6B7280', criteria: 'complete_profile', xpReward: 30, creditReward: 500_000 },
  { id: 'first-comment', name: 'First review', description: 'Laissez votre premier commentaire', icon: '💬', rarity: 'common', color: '#6B7280', criteria: 'comment_film >= 1', xpReward: 10, creditReward: 200_000 },
  { id: 'ai-explorer', name: 'Explorateur IA', description: 'Use an AI agent for the first time', icon: '🤖', rarity: 'common', color: '#6B7280', criteria: 'generate_content >= 1', xpReward: 15, creditReward: 300_000 },

  // Rare (require effort)
  { id: 'directors-eye', name: 'Director\'s eye', description: 'Votez sur 50 films', icon: '👁️', rarity: 'rare', color: '#3B82F6', criteria: 'vote_film >= 50', xpReward: 100, creditReward: 2_000_000 },
  { id: 'golden-pen', name: 'Plume d\'Or', description: 'Submit 5 screenplays', icon: '✒️', rarity: 'rare', color: '#3B82F6', criteria: 'submit_screenplay >= 5', xpReward: 150, creditReward: 3_000_000 },
  { id: 'task-master', name: 'Task master', description: 'Complete 25 creative tasks', icon: '⚡', rarity: 'rare', color: '#3B82F6', criteria: 'complete_task >= 25', xpReward: 200, creditReward: 5_000_000 },
  { id: 'social-butterfly', name: 'Papillon Social', description: 'Share 20 films on social media', icon: '🦋', rarity: 'rare', color: '#3B82F6', criteria: 'share_film >= 20', xpReward: 75, creditReward: 1_500_000 },
  { id: 'contributor-star', name: 'Contributeur Star', description: 'Obtenez une note moyenne de 4.5+', icon: '🌟', rarity: 'rare', color: '#3B82F6', criteria: 'avg_rating >= 4.5', xpReward: 150, creditReward: 3_000_000 },
  { id: 'streak-7', name: 'Semaine de Feu', description: 'Maintenez un streak de 7 jours', icon: '🔥', rarity: 'rare', color: '#3B82F6', criteria: 'streak >= 7', xpReward: 50, creditReward: 1_000_000 },
  { id: 'reviewer', name: 'Insightful critic', description: 'Write 10 detailed reviews', icon: '📝', rarity: 'rare', color: '#3B82F6', criteria: 'review_film >= 10', xpReward: 100, creditReward: 2_000_000 },
  { id: 'ambassador', name: 'Ambassadeur', description: 'Parrainez 5 nouveaux utilisateurs', icon: '🤝', rarity: 'rare', color: '#3B82F6', criteria: 'invite_friend >= 5', xpReward: 200, creditReward: 5_000_000 },

  // Epic (dedicated users)
  { id: 'visionary-investor', name: 'Investisseur Visionnaire', description: 'Investissez dans 10 films', icon: '💎', rarity: 'epic', color: '#8B5CF6', criteria: 'invest_film >= 10', xpReward: 300, creditReward: 10_000_000 },
  { id: 'prolific-creator', name: 'Prolific creator', description: 'Create 10 film projects', icon: '🎬', rarity: 'epic', color: '#8B5CF6', criteria: 'create_film_project >= 10', xpReward: 250, creditReward: 7_000_000 },
  { id: 'streak-30', name: 'Mois de Fer', description: '30-day consecutive streak', icon: '💪', rarity: 'epic', color: '#8B5CF6', criteria: 'streak >= 30', xpReward: 200, creditReward: 5_000_000 },
  { id: 'community-leader', name: 'Leader Communautaire', description: '100 votes de gouvernance', icon: '🏛️', rarity: 'epic', color: '#8B5CF6', criteria: 'vote_governance >= 100', xpReward: 300, creditReward: 8_000_000 },
  { id: 'deep-thinker', name: 'Penseur Profond', description: '50 Deep Discussions completed', icon: '🧠', rarity: 'epic', color: '#8B5CF6', criteria: 'join_discussion >= 50', xpReward: 250, creditReward: 7_000_000 },
  { id: 'master-recruiter', name: 'Recruteur en Chef', description: 'Parrainez 25 utilisateurs', icon: '👥', rarity: 'epic', color: '#8B5CF6', criteria: 'invite_friend >= 25', xpReward: 500, creditReward: 15_000_000 },

  // Legendary (exceptional)
  { id: 'cinema-legend', name: 'Cinema legend', description: 'Reach level 8 (Legend)', icon: '🏆', rarity: 'legendary', color: '#FFD700', criteria: 'level >= 8', xpReward: 1000, creditReward: 50_000_000 },
  { id: 'founding-member', name: 'Membre Fondateur', description: 'Parmi les 100 premiers inscrits', icon: '🌟', rarity: 'legendary', color: '#FFD700', criteria: 'user_id <= 100', xpReward: 500, creditReward: 20_000_000 },
  { id: 'streak-100', name: 'Centurion', description: 'Streak de 100 jours', icon: '💯', rarity: 'legendary', color: '#FFD700', criteria: 'streak >= 100', xpReward: 500, creditReward: 20_000_000 },
  { id: 'total-voter', name: 'Voix du Peuple', description: '500 votes sur la plateforme', icon: '📢', rarity: 'legendary', color: '#FFD700', criteria: 'total_votes >= 500', xpReward: 500, creditReward: 15_000_000 },
  { id: 'ai-virtuoso', name: 'Virtuose IA', description: '1000 interactions avec les agents', icon: '🎯', rarity: 'legendary', color: '#FFD700', criteria: 'generate_content >= 1000', xpReward: 500, creditReward: 20_000_000 },
]

// ─── Streak Config ──────────────────────────────────────────────────

export interface StreakMultiplier {
  days: number
  multiplier: number
  label: string
  emoji: string
}

export const STREAK_MULTIPLIERS: StreakMultiplier[] = [
  { days: 1, multiplier: 1.0, label: 'Normal', emoji: '' },
  { days: 3, multiplier: 1.2, label: '3 jours', emoji: '🔥' },
  { days: 7, multiplier: 1.5, label: 'Semaine', emoji: '🔥🔥' },
  { days: 14, multiplier: 1.8, label: '2 semaines', emoji: '🔥🔥🔥' },
  { days: 30, multiplier: 2.0, label: 'Mois', emoji: '💎' },
  { days: 60, multiplier: 2.5, label: '2 mois', emoji: '💎💎' },
  { days: 100, multiplier: 3.0, label: 'Centurion', emoji: '💎💎💎' },
]

export function getStreakMultiplier(streakDays: number): StreakMultiplier {
  for (let i = STREAK_MULTIPLIERS.length - 1; i >= 0; i--) {
    if (streakDays >= STREAK_MULTIPLIERS[i].days) return STREAK_MULTIPLIERS[i]
  }
  return STREAK_MULTIPLIERS[0]
}

// ─── Daily Challenges ───────────────────────────────────────────────

export interface DailyChallenge {
  id: string
  title: string
  description: string
  icon: string
  actionRequired: string
  target: number
  xpReward: number
  creditReward: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'dc-vote-3', title: 'Critique du jour', description: 'Votez sur 3 films', icon: '🗳️', actionRequired: 'vote_film', target: 3, xpReward: 30, creditReward: 500_000, difficulty: 'easy' },
  { id: 'dc-comment-1', title: 'Voix entendue', description: 'Comment on a screenplay', icon: '💬', actionRequired: 'comment_film', target: 1, xpReward: 15, creditReward: 200_000, difficulty: 'easy' },
  { id: 'dc-share-2', title: 'Ambassadeur du jour', description: 'Partagez 2 films', icon: '📢', actionRequired: 'share_film', target: 2, xpReward: 20, creditReward: 300_000, difficulty: 'easy' },
  { id: 'dc-task-1', title: 'Contributeur actif', description: 'Complete 1 creative task', icon: '⚡', actionRequired: 'complete_task', target: 1, xpReward: 60, creditReward: 1_000_000, difficulty: 'medium' },
  { id: 'dc-discussion-1', title: 'Penseur du jour', description: 'Join a Deep Discussion', icon: '🧠', actionRequired: 'join_discussion', target: 1, xpReward: 25, creditReward: 400_000, difficulty: 'medium' },
  { id: 'dc-agent-3', title: 'AI master', description: 'Use 3 different AI agents', icon: '🤖', actionRequired: 'generate_content', target: 3, xpReward: 25, creditReward: 500_000, difficulty: 'medium' },
  { id: 'dc-review-1', title: 'Critique expert', description: 'Write a complete review', icon: '📝', actionRequired: 'review_film', target: 1, xpReward: 40, creditReward: 800_000, difficulty: 'medium' },
  { id: 'dc-invest-1', title: 'Investisseur audacieux', description: 'Investissez dans un projet', icon: '💰', actionRequired: 'invest_film', target: 1, xpReward: 75, creditReward: 1_500_000, difficulty: 'hard' },
  { id: 'dc-vote-10', title: 'Marathon du vote', description: 'Vote on 10 films in a single day', icon: '🏃', actionRequired: 'vote_film', target: 10, xpReward: 80, creditReward: 1_500_000, difficulty: 'hard' },
  { id: 'dc-all-agents', title: 'Tour complet', description: 'Use 5 different AI agents', icon: '🎯', actionRequired: 'generate_content', target: 5, xpReward: 50, creditReward: 1_000_000, difficulty: 'hard' },
]

// ─── Referral Config ────────────────────────────────────────────────

export const REFERRAL_CONFIG = {
  referrerReward: { xp: 100, credits: 5_000_000, label: '5 credits + 100 XP' },
  refereeReward: { xp: 50, credits: 2_000_000, label: '2 credits + 50 XP' },
  milestones: [
    { count: 5, bonus: 10_000_000, badge: 'ambassador', label: '5 filleuls → 10 cr + Badge Ambassadeur' },
    { count: 10, bonus: 25_000_000, badge: null, label: '10 filleuls → 25 cr bonus' },
    { count: 25, bonus: 50_000_000, badge: 'master-recruiter', label: '25 filleuls → 50 cr + Badge Recruteur en Chef' },
  ],
}

// ─── Rarity Config ──────────────────────────────────────────────────

export const RARITY_CONFIG = {
  common: { label: 'Commun', color: '#6B7280', bgGradient: 'from-gray-400 to-gray-500' },
  rare: { label: 'Rare', color: '#3B82F6', bgGradient: 'from-blue-400 to-blue-600' },
  epic: { label: 'Epic', color: '#8B5CF6', bgGradient: 'from-purple-400 to-purple-600' },
  legendary: { label: 'Legendary', color: '#FFD700', bgGradient: 'from-yellow-400 to-amber-500' },
}

// ─── Helpers ────────────────────────────────────────────────────────

export function getLevelForXP(xp: number): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= USER_LEVELS[i].minXP) return USER_LEVELS[i]
  }
  return USER_LEVELS[0]
}

export function getXPProgress(xp: number): { level: UserLevel; nextLevel: UserLevel | null; progress: number; remaining: number } {
  const level = getLevelForXP(xp)
  const nextIdx = USER_LEVELS.findIndex(l => l.level === level.level) + 1
  const nextLevel = nextIdx < USER_LEVELS.length ? USER_LEVELS[nextIdx] : null

  if (!nextLevel) return { level, nextLevel: null, progress: 100, remaining: 0 }

  const levelXP = xp - level.minXP
  const levelRange = nextLevel.minXP - level.minXP
  const progress = Math.min(100, Math.round((levelXP / levelRange) * 100))
  const remaining = nextLevel.minXP - xp

  return { level, nextLevel, progress, remaining }
}

export function getDailyChallenges(count: number = 3): DailyChallenge[] {
  // Pick random challenges, balanced by difficulty
  const easy = DAILY_CHALLENGES.filter(c => c.difficulty === 'easy')
  const medium = DAILY_CHALLENGES.filter(c => c.difficulty === 'medium')
  const hard = DAILY_CHALLENGES.filter(c => c.difficulty === 'hard')

  const selected: DailyChallenge[] = []
  if (easy.length > 0) selected.push(easy[Math.floor(Math.random() * easy.length)])
  if (medium.length > 0) selected.push(medium[Math.floor(Math.random() * medium.length)])
  if (hard.length > 0 && count >= 3) selected.push(hard[Math.floor(Math.random() * hard.length)])

  return selected.slice(0, count)
}
