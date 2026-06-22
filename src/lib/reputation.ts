/**
 * Unified reputation scoring system
 * Single score per user, fed by all modules
 */

export const REPUTATION_WEIGHTS = {
  deadlines: 0.20,       // Respect des deadlines
  acceptance: 0.20,      // Taux acceptation 1er jet
  quality: 0.20,         // Qualité notée par clients
  collabs: 0.15,         // Fiabilité collabs
  engagement: 0.10,      // Engagement communauté
  seniority: 0.10,       // Ancienneté
  taskCount: 0.05,       // Nombre tâches complétées
} as const

export const REPUTATION_BADGES = [
  { name: 'bronze', minScore: 0, color: '#CD7F32', label: 'Bronze' },
  { name: 'silver', minScore: 40, color: '#C0C0C0', label: 'Argent' },
  { name: 'gold', minScore: 65, color: '#E50914', label: 'Or' },
  { name: 'platinum', minScore: 85, color: '#E5E4E2', label: 'Platine' },
] as const

export function getBadgeForScore(score: number) {
  const sorted = [...REPUTATION_BADGES].reverse()
  return sorted.find(b => score >= b.minScore) ?? REPUTATION_BADGES[0]
}

export function calculateReputationScore(metrics: {
  deadlineRate: number      // 0-100
  acceptanceRate: number    // 0-100
  qualityScore: number      // 0-100
  collabReliability: number // 0-100
  engagementScore: number   // 0-100
  seniorityDays: number     // days since registration
  taskCount: number         // total tasks completed
}): number {
  const seniorityScore = Math.min(100, (metrics.seniorityDays / 365) * 100)
  const taskScore = Math.min(100, (metrics.taskCount / 50) * 100)

  const weighted =
    metrics.deadlineRate * REPUTATION_WEIGHTS.deadlines +
    metrics.acceptanceRate * REPUTATION_WEIGHTS.acceptance +
    metrics.qualityScore * REPUTATION_WEIGHTS.quality +
    metrics.collabReliability * REPUTATION_WEIGHTS.collabs +
    metrics.engagementScore * REPUTATION_WEIGHTS.engagement +
    seniorityScore * REPUTATION_WEIGHTS.seniority +
    taskScore * REPUTATION_WEIGHTS.taskCount

  return Math.round(weighted * 10) / 10
}
