'use server'

import { auth } from '@/lib/auth'
import * as agentService from '@/lib/agent.service'
import { ALL_AGENTS } from '@/data/agents'
import type { AgentTier } from '@/data/agents'

// ─── Browse & Search ────────────────────────────────────────────────

/** Get all agents with optional filters */
export async function getAgentsAction(filters?: {
  tier?: AgentTier
  category?: string
  isMarketplace?: boolean
}) {
  return agentService.getAgents(filters)
}

/** Get single agent by slug */
export async function getAgentAction(slug: string) {
  // Try DB first, fall back to static data
  const dbAgent = await agentService.getAgent(slug)
  if (dbAgent) return dbAgent

  const staticAgent = ALL_AGENTS.find(a => a.slug === slug)
  return staticAgent || null
}

/** Get agent health status */
export async function getAgentHealthAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }
  return agentService.getAgentHealth()
}

// ─── Execution ──────────────────────────────────────────────────────

/** Execute an agent (create pending execution) */
export async function executeAgentAction(input: {
  agentSlug: string
  prompt: string
  context?: Record<string, unknown>
  filmProjectId?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  try {
    const execution = await agentService.createExecution(session.user.id, input)
    return { success: true, executionId: execution.id }
  } catch (err: any) {
    return { error: err.message || 'Execution failed' }
  }
}

/** Get user's execution history */
export async function getExecutionHistoryAction(
  limit = 20,
  offset = 0,
  agentSlug?: string
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated', executions: [] }

  const executions = await agentService.getUserExecutions(
    session.user.id, limit, offset, agentSlug
  )
  return { executions }
}

/** Rate an execution */
export async function rateExecutionAction(
  executionId: string,
  rating: number,
  feedback?: string
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  try {
    await agentService.rateExecution(executionId, session.user.id, rating, feedback)
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

// ─── Favorites ──────────────────────────────────────────────────────

/** Toggle favorite on an agent */
export async function toggleFavoriteAction(agentSlug: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  try {
    const result = await agentService.toggleFavorite(session.user.id, agentSlug)
    return result
  } catch (err: any) {
    return { error: err.message }
  }
}

/** Get user's favorite agents */
export async function getFavoritesAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated', favorites: [] }

  const favorites = await agentService.getUserFavorites(session.user.id)
  return { favorites }
}

// ─── Preferences ────────────────────────────────────────────────────

/** Get user's agent preferences */
export async function getPreferencesAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  return agentService.getUserPreferences(session.user.id)
}

/** Update user's agent preferences */
export async function updatePreferencesAction(prefs: {
  formality?: number
  length?: number
  creativity?: number
  proactivity?: number
  expertise?: number
  humor?: number
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  return agentService.updateUserPreferences(session.user.id, prefs)
}
