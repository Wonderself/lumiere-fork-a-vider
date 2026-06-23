/**
 * CineGeny Growth & Acquisition
 * Promo codes, referral, demo accounts, user tiers, signup bonus.
 * 7 specialized agents.
 */

// ─── 7 Growth Agents ────────────────────────────────────────────────

export interface GrowthAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const GROWTH_AGENTS: GrowthAgent[] = [
  { slug: 'cg-promo-manager', name: 'Promo Manager', role: 'Codes promo & offres', description: 'Crée et gère les codes promotionnels. Contrôle unicité, limites d\'utilisation, expiration. Analyse l\'impact sur l\'acquisition.', icon: 'ticket', color: '#E50914' },
  { slug: 'cg-referral-engine', name: 'Moteur Parrainage', role: 'Programme referral', description: 'Gère le programme de parrainage : génération de codes CG-XXXXXX, suivi des conversions, distribution des récompenses par paliers.', icon: 'users', color: '#3B82F6' },
  { slug: 'cg-onboarding-guide', name: 'Guide Onboarding', role: 'Parcours d\'accueil', description: 'Orchestre le parcours d\'onboarding : signup bonus, premiers pas guidés, activation des fonctionnalités clés.', icon: 'compass', color: '#10B981' },
  { slug: 'cg-tier-manager', name: 'Gestionnaire Tiers', role: 'Niveaux d\'accès', description: 'Gère les 4 tiers (guest/demo/free/paid) avec limites quotidiennes. Auto-upgrade, downgrade, restrictions.', icon: 'layers', color: '#8B5CF6' },
  { slug: 'cg-demo-controller', name: 'Contrôleur Demo', role: 'Comptes démo', description: 'Gère les comptes de démonstration : expiration configurable, auto-désactivation par cron, conversion vers paid.', icon: 'clock', color: '#F59E0B' },
  { slug: 'cg-activation-tracker', name: 'Tracker Activation', role: 'Suivi activation', description: 'Suit l\'activation des nouveaux utilisateurs : première action, premier vote, premier projet. Identifie les points de friction.', icon: 'activity', color: '#EC4899' },
  { slug: 'cg-retention-analyst', name: 'Analyste Rétention', role: 'Rétention & churn', description: 'Analyse la rétention, identifie les utilisateurs à risque de churn, propose des actions de réengagement.', icon: 'heart', color: '#06B6D4' },
]

// ─── Promo Code Config ──────────────────────────────────────────────

export type PromoType = 'credits' | 'discount' | 'trial' | 'bonus_xp'

export interface PromoCodeConfig {
  code: string
  type: PromoType
  value: number             // Credits (µ-credits) or discount % or trial days or XP
  maxUses: number           // 0 = unlimited
  usedCount: number
  expiresAt: string | null  // ISO date or null for no expiry
  isActive: boolean
  onePerUser: boolean       // Enforce uniqueness per user
  description: string
  createdAt: string
  createdBy: string
}

export const PROMO_TYPES: Record<PromoType, { label: string; icon: string; color: string; unit: string }> = {
  credits: { label: 'Crédits gratuits', icon: 'coins', color: '#10B981', unit: 'crédits' },
  discount: { label: 'Réduction', icon: 'percent', color: '#3B82F6', unit: '%' },
  trial: { label: 'Essai gratuit', icon: 'clock', color: '#8B5CF6', unit: 'jours' },
  bonus_xp: { label: 'Bonus XP', icon: 'zap', color: '#F59E0B', unit: 'XP' },
}

export const SAMPLE_PROMO_CODES: PromoCodeConfig[] = [
  { code: 'WELCOME2026', type: 'credits', value: 5_000_000, maxUses: 1000, usedCount: 47, expiresAt: '2026-12-31', isActive: true, onePerUser: true, description: 'Bienvenue — 5 crédits offerts', createdAt: '2026-03-01', createdBy: 'admin' },
  { code: 'CINEMA50', type: 'discount', value: 50, maxUses: 100, usedCount: 12, expiresAt: '2026-06-30', isActive: true, onePerUser: true, description: '50% de réduction sur le premier pack', createdAt: '2026-03-10', createdBy: 'admin' },
  { code: 'TRYCINEGENY', type: 'trial', value: 14, maxUses: 500, usedCount: 89, expiresAt: null, isActive: true, onePerUser: true, description: '14 jours d\'essai Premium', createdAt: '2026-01-15', createdBy: 'admin' },
  { code: 'XPBOOST', type: 'bonus_xp', value: 500, maxUses: 200, usedCount: 34, expiresAt: '2026-04-30', isActive: true, onePerUser: true, description: '+500 XP bonus', createdAt: '2026-03-15', createdBy: 'admin' },
]

// ─── Referral Program ───────────────────────────────────────────────

export interface ReferralTier {
  count: number           // Referrals needed
  referrerReward: number  // µ-credits for referrer
  refereeReward: number   // µ-credits for referee
  bonusXP: number
  badge: string | null
  label: string
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { count: 1, referrerReward: 2_000_000, refereeReward: 1_000_000, bonusXP: 50, badge: null, label: '1er parrainage — 2 cr + 50 XP' },
  { count: 3, referrerReward: 3_000_000, refereeReward: 1_500_000, bonusXP: 100, badge: null, label: '3 filleuls — 3 cr/filleul + 100 XP' },
  { count: 5, referrerReward: 5_000_000, refereeReward: 2_000_000, bonusXP: 200, badge: 'ambassador', label: '5 filleuls — 5 cr + Badge Ambassadeur' },
  { count: 10, referrerReward: 7_000_000, refereeReward: 2_500_000, bonusXP: 300, badge: null, label: '10 filleuls — 7 cr/filleul + 300 XP' },
  { count: 25, referrerReward: 10_000_000, refereeReward: 3_000_000, bonusXP: 500, badge: 'master-recruiter', label: '25 filleuls — 10 cr + Badge Recruteur en Chef' },
  { count: 50, referrerReward: 15_000_000, refereeReward: 5_000_000, bonusXP: 1000, badge: null, label: '50 filleuls — 15 cr + 1000 XP' },
  { count: 100, referrerReward: 25_000_000, refereeReward: 5_000_000, bonusXP: 2000, badge: 'cinema-legend', label: '100 filleuls — 25 cr + Badge Légende + 2000 XP' },
]

export function getReferralTier(count: number): ReferralTier {
  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (count >= REFERRAL_TIERS[i].count) return REFERRAL_TIERS[i]
  }
  return REFERRAL_TIERS[0]
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'CG-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ─── Referral Leaderboard (anonymized) ──────────────────────────────

export interface LeaderboardEntry {
  rank: number
  initials: string     // Anonymized: first letter of first/last name
  referralCount: number
  tier: string
  totalEarned: number  // µ-credits earned
}

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, initials: 'S.M.', referralCount: 47, tier: '50 filleuls', totalEarned: 350_000_000 },
  { rank: 2, initials: 'A.D.', referralCount: 31, tier: '25 filleuls', totalEarned: 220_000_000 },
  { rank: 3, initials: 'L.C.', referralCount: 22, tier: '10 filleuls', totalEarned: 140_000_000 },
  { rank: 4, initials: 'P.B.', referralCount: 15, tier: '10 filleuls', totalEarned: 95_000_000 },
  { rank: 5, initials: 'M.R.', referralCount: 12, tier: '10 filleuls', totalEarned: 75_000_000 },
  { rank: 6, initials: 'J.L.', referralCount: 8, tier: '5 filleuls', totalEarned: 40_000_000 },
  { rank: 7, initials: 'C.V.', referralCount: 6, tier: '5 filleuls', totalEarned: 30_000_000 },
  { rank: 8, initials: 'N.K.', referralCount: 5, tier: '5 filleuls', totalEarned: 25_000_000 },
  { rank: 9, initials: 'R.F.', referralCount: 4, tier: '3 filleuls', totalEarned: 12_000_000 },
  { rank: 10, initials: 'T.G.', referralCount: 3, tier: '3 filleuls', totalEarned: 9_000_000 },
]

// ─── User Tiers ─────────────────────────────────────────────────────

export type UserTier = 'guest' | 'demo' | 'free' | 'paid'

export interface TierConfig {
  id: UserTier
  label: string
  color: string
  icon: string
  dailyLimits: { aiRequests: number; votes: number; comments: number; projects: number; agents: number }
  features: string[]
  restrictions: string[]
}

export const USER_TIERS: TierConfig[] = [
  {
    id: 'guest', label: 'Visiteur', color: '#9CA3AF', icon: 'eye',
    dailyLimits: { aiRequests: 0, votes: 0, comments: 0, projects: 0, agents: 0 },
    features: ['Voir les films', 'Voir les bandes-annonces', 'Lire les commentaires'],
    restrictions: ['Pas de vote', 'Pas de création', 'Pas d\'IA', 'Inscription requise'],
  },
  {
    id: 'demo', label: 'Demo', color: '#F59E0B', icon: 'clock',
    dailyLimits: { aiRequests: 5, votes: 5, comments: 3, projects: 1, agents: 3 },
    features: ['Tout visiteur +', '5 requêtes IA/jour', '5 votes/jour', '1 projet', 'Expire automatiquement'],
    restrictions: ['Limité dans le temps', 'Pas de paiement', 'Pas de parrainage'],
  },
  {
    id: 'free', label: 'Gratuit', color: '#3B82F6', icon: 'user',
    dailyLimits: { aiRequests: 10, votes: 10, comments: 10, projects: 2, agents: 5 },
    features: ['Tout démo +', '10 requêtes IA/jour', '2 projets', 'Vote', 'Commentaires', 'Parrainage'],
    restrictions: ['Crédits IA limités', '10 films/mois en streaming'],
  },
  {
    id: 'paid', label: 'Premium', color: '#10B981', icon: 'crown',
    dailyLimits: { aiRequests: 100, votes: 50, comments: 50, projects: 10, agents: 22 },
    features: ['Tout gratuit +', '100 requêtes/jour', 'Projets illimités', 'Tous les agents', 'Streaming illimité', 'Support prioritaire'],
    restrictions: [],
  },
]

// ─── Demo Account Config ────────────────────────────────────────────

export const DEMO_CONFIG = {
  defaultDuration: 7,        // Days
  maxDuration: 30,           // Max configurable
  autoDisableEnabled: true,  // Cron auto-disables expired demos
  conversionReminder: 2,     // Days before expiry: send conversion email
  initialCredits: 3_000_000, // 3 credits for demo accounts
}

// ─── Signup Bonus ───────────────────────────────────────────────────

export const SIGNUP_BONUS = {
  credits: 2_000_000,     // 2 credits at signup
  xp: 50,                 // 50 XP bonus
  label: '2 crédits IA + 50 XP',
  description: 'Offerts à chaque nouvelle inscription pour découvrir les outils IA.',
}

// ─── Onboarding Steps ───────────────────────────────────────────────

export interface OnboardingStep {
  id: string; label: string; description: string; icon: string; xpReward: number; creditReward: number; completed?: boolean
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'signup', label: 'Inscription', description: 'Créez votre compte CineGeny', icon: 'user-plus', xpReward: 10, creditReward: 0 },
  { id: 'profile', label: 'Profil complet', description: 'Remplissez votre bio et spécialités', icon: 'user', xpReward: 50, creditReward: 1_000_000 },
  { id: 'first-vote', label: 'Premier vote', description: 'Votez sur un film de la communauté', icon: 'star', xpReward: 10, creditReward: 200_000 },
  { id: 'first-agent', label: 'Premier agent IA', description: 'Utilisez un agent IA cinéma', icon: 'bot', xpReward: 15, creditReward: 300_000 },
  { id: 'first-project', label: 'Premier projet', description: 'Create your first film project', icon: 'film', xpReward: 75, creditReward: 500_000 },
  { id: 'first-share', label: 'Premier partage', description: 'Share a film on social media', icon: 'share-2', xpReward: 10, creditReward: 100_000 },
  { id: 'referral', label: 'Inviter un ami', description: 'Parrainez votre premier utilisateur', icon: 'users', xpReward: 100, creditReward: 5_000_000 },
]
