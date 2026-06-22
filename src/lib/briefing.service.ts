/**
 * CineGeny Briefing Service
 * Daily briefing, improvement review, attack plan.
 */

import { prisma } from '@/lib/prisma'
import { microToCredits } from '@/lib/ai-pricing'
import { SAMPLE_IMPROVEMENTS, SAMPLE_ATTACK_PLAN } from '@/data/briefing'

// ─── Morning Briefing ───────────────────────────────────────────────

export interface MorningBriefing {
  date: string
  stats: {
    newUsers: number
    totalUsers: number
    aiRequests: number
    revenue: number
    pendingProposals: number
    errors: number
    activeConversations: number
    tasksCompleted: number
  }
  highlights: string[]
  alerts: string[]
}

export async function generateMorningBriefing(): Promise<MorningBriefing> {
  const yesterday = new Date(Date.now() - 86400000)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    newUsers, totalUsers, aiRequests, revenue,
    pendingProposals, errors, conversations, tasks,
  ] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.user.count(),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: yesterday } }, _sum: { billedCredits: true } }),
    prisma.autopilotProposal.count({ where: { status: 'PENDING_REVIEW' as any } }),
    prisma.aIUsageLog.count({ where: { success: false, createdAt: { gte: yesterday } } }),
    prisma.conversation.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.task.count({ where: { status: 'VALIDATED', updatedAt: { gte: yesterday } } }),
  ])

  const highlights: string[] = []
  const alerts: string[] = []

  if (newUsers > 0) highlights.push(`+${newUsers} nouveaux utilisateurs`)
  if (aiRequests > 0) highlights.push(`${aiRequests} requêtes IA traitées`)
  if (tasks > 0) highlights.push(`${tasks} tâches validées`)

  if (errors > 5) alerts.push(`⚠️ ${errors} erreurs IA détectées`)
  if (pendingProposals > 0) alerts.push(`⏳ ${pendingProposals} propositions en attente`)

  return {
    date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    stats: {
      newUsers,
      totalUsers,
      aiRequests,
      revenue: revenue._sum.billedCredits ?? 0,
      pendingProposals,
      errors,
      activeConversations: conversations,
      tasksCompleted: tasks,
    },
    highlights,
    alerts,
  }
}

// ─── Format for Telegram ────────────────────────────────────────────

export function formatBriefingForTelegram(briefing: MorningBriefing): string {
  return [
    `☀️ *Bonjour ! Briefing CineGeny*`,
    `📅 ${briefing.date}`,
    '',
    '📊 *Stats 24h*',
    `👥 Nouveaux: +${briefing.stats.newUsers} (total: ${briefing.stats.totalUsers})`,
    `🤖 Requêtes IA: ${briefing.stats.aiRequests}`,
    `💰 Revenue: ${microToCredits(briefing.stats.revenue).toFixed(2)} cr`,
    `💬 Conversations: ${briefing.stats.activeConversations}`,
    `✅ Tâches validées: ${briefing.stats.tasksCompleted}`,
    `❌ Erreurs: ${briefing.stats.errors}`,
    '',
    briefing.highlights.length > 0 ? `✨ *Highlights*\n${briefing.highlights.map(h => `• ${h}`).join('\n')}` : '',
    briefing.alerts.length > 0 ? `\n🚨 *Alertes*\n${briefing.alerts.map(a => `• ${a}`).join('\n')}` : '',
    '',
    '🔧 /pending — Propositions en attente',
    '📊 /report — Rapport complet',
  ].filter(Boolean).join('\n')
}

// ─── Improvement Review ─────────────────────────────────────────────

export function formatImprovementReview(): string {
  const improvements = SAMPLE_IMPROVEMENTS.filter(i => i.status === 'proposed').slice(0, 5)

  return [
    '🔍 *Review Améliorations Quotidienne*',
    '',
    ...improvements.map((imp, i) => {
      const impactEmoji = imp.impact === 'high' ? '🔴' : imp.impact === 'medium' ? '🟡' : '🟢'
      const effortEmoji = imp.effort === 'low' ? '⚡' : imp.effort === 'medium' ? '🔧' : '🏗️'
      return [
        `*${i + 1}. ${imp.title}*`,
        `${impactEmoji} Impact: ${imp.impact} | ${effortEmoji} Effort: ${imp.effort}`,
        `📁 ${imp.category} | 🤖 ${imp.source}`,
        `${imp.description.substring(0, 150)}`,
        '',
      ].join('\n')
    }),
    '💡 Répondez avec le numéro pour implémenter.',
  ].join('\n')
}

// ─── Attack Plan ────────────────────────────────────────────────────

export function formatAttackPlan(): string {
  return [
    '🎯 *Plan d\'Attaque IA — Aujourd\'hui*',
    '',
    ...SAMPLE_ATTACK_PLAN.map(item => {
      const prioEmoji = item.priority === 'must' ? '🔴' : item.priority === 'should' ? '🟡' : '🟢'
      return `${prioEmoji} *${item.time}* — ${item.title}\n   ${item.description}`
    }),
    '',
    '🔴 Must | 🟡 Should | 🟢 Nice to have',
  ].join('\n')
}

// ─── Get all daily messages ─────────────────────────────────────────

export async function getDailyMessages(): Promise<{ briefing: string; improvements: string; attackPlan: string }> {
  const briefing = await generateMorningBriefing()
  return {
    briefing: formatBriefingForTelegram(briefing),
    improvements: formatImprovementReview(),
    attackPlan: formatAttackPlan(),
  }
}
