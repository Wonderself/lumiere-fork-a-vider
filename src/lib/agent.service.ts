import { prisma } from '@/lib/prisma'
import { ALL_AGENTS, getAgentBySlug, TIER_CONFIG } from '@/data/agents'
import type { AgentTier } from '@/data/agents'

// ─── Types ──────────────────────────────────────────────────────────

export interface AgentHealth {
  slug: string
  status: 'healthy' | 'degraded' | 'offline'
  lastExecution?: Date
  avgDurationMs?: number
  successRate?: number
  totalExecutions: number
}

export interface ExecuteAgentInput {
  agentSlug: string
  prompt: string
  context?: Record<string, unknown>
  filmProjectId?: string
  parentExecutionId?: string
}

export interface ExecuteAgentResult {
  success: boolean
  executionId?: string
  response?: string
  model?: string
  inputTokens?: number
  outputTokens?: number
  costCredits?: number
  durationMs?: number
  error?: string
}

// ─── Registry ───────────────────────────────────────────────────────

/** Seed all agent definitions to DB (idempotent) */
export async function seedAgentDefinitions() {
  for (const agent of ALL_AGENTS) {
    await prisma.agentDefinition.upsert({
      where: { slug: agent.slug },
      create: {
        slug: agent.slug,
        name: agent.name,
        nameEn: agent.nameEn,
        description: agent.description,
        descriptionEn: agent.descriptionEn,
        tier: agent.tier,
        category: agent.category,
        defaultModel: agent.defaultModel,
        systemPrompt: agent.systemPrompt,
        icon: agent.icon,
        color: agent.color,
        capabilities: agent.capabilities,
        inputTypes: agent.inputTypes,
        outputTypes: agent.outputTypes,
        maxTokens: agent.maxTokens,
        temperature: agent.temperature,
        tags: agent.tags,
        isMarketplace: agent.category === 'MARKETPLACE',
      },
      update: {
        name: agent.name,
        nameEn: agent.nameEn,
        description: agent.description,
        descriptionEn: agent.descriptionEn,
        systemPrompt: agent.systemPrompt,
        defaultModel: agent.defaultModel,
        capabilities: agent.capabilities,
        tags: agent.tags,
      },
    })
  }
}

/** Get all agents from DB with optional filters */
export async function getAgents(filters?: {
  tier?: AgentTier
  category?: string
  isMarketplace?: boolean
  isActive?: boolean
}) {
  return prisma.agentDefinition.findMany({
    where: {
      ...(filters?.tier && { tier: filters.tier }),
      ...(filters?.category && { category: filters.category as any }),
      ...(filters?.isMarketplace !== undefined && { isMarketplace: filters.isMarketplace }),
      isActive: filters?.isActive ?? true,
    },
    orderBy: [{ tier: 'asc' }, { name: 'asc' }],
  })
}

/** Get agent by slug */
export async function getAgent(slug: string) {
  return prisma.agentDefinition.findUnique({
    where: { slug },
  })
}

// ─── Health Monitoring ──────────────────────────────────────────────

/** Get health status for all agents */
export async function getAgentHealth(): Promise<AgentHealth[]> {
  const agents = ALL_AGENTS
  const stats = await prisma.agentExecution.groupBy({
    by: ['agentId'],
    _count: true,
    _avg: { durationMs: true },
  })

  const successCounts = await prisma.agentExecution.groupBy({
    by: ['agentId'],
    where: { status: 'COMPLETED' },
    _count: true,
  })

  const lastExecutions = await prisma.agentExecution.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    distinct: ['agentId'],
    select: { agentId: true, completedAt: true },
    take: 50,
  })

  const agentDefs = await prisma.agentDefinition.findMany({
    select: { id: true, slug: true },
  })
  const slugById = new Map(agentDefs.map(a => [a.id, a.slug]))
  const idBySlug = new Map(agentDefs.map(a => [a.slug, a.id]))

  const statsMap = new Map(stats.map(s => [s.agentId, s]))
  const successMap = new Map(successCounts.map(s => [s.agentId, s._count]))
  const lastExecMap = new Map(lastExecutions.map(e => [e.agentId, e.completedAt]))

  return agents.map(agent => {
    const agentId = idBySlug.get(agent.slug)
    const stat = agentId ? statsMap.get(agentId) : undefined
    const total = stat?._count ?? 0
    const successes = agentId ? (successMap.get(agentId) ?? 0) : 0

    return {
      slug: agent.slug,
      status: 'healthy' as const,
      lastExecution: agentId ? (lastExecMap.get(agentId) ?? undefined) : undefined,
      avgDurationMs: stat?._avg.durationMs ?? undefined,
      successRate: total > 0 ? successes / total : undefined,
      totalExecutions: total,
    }
  })
}

// ─── Execution ──────────────────────────────────────────────────────

/** Create an execution record (pending state) */
export async function createExecution(
  userId: string,
  input: ExecuteAgentInput
) {
  const agentDef = await prisma.agentDefinition.findUnique({
    where: { slug: input.agentSlug },
  })
  if (!agentDef) throw new Error(`Agent not found: ${input.agentSlug}`)

  // Get user preferences
  const prefs = await prisma.agentPreferences.findUnique({
    where: { userId },
  })

  const execution = await prisma.agentExecution.create({
    data: {
      userId,
      agentId: agentDef.id,
      prompt: input.prompt,
      context: input.context as any,
      status: 'PENDING',
      model: agentDef.defaultModel,
      filmProjectId: input.filmProjectId,
      parentId: input.parentExecutionId,
      preferences: prefs ? {
        formality: prefs.formality,
        length: prefs.length,
        creativity: prefs.creativity,
        proactivity: prefs.proactivity,
        expertise: prefs.expertise,
        humor: prefs.humor,
      } : undefined,
    },
  })

  return execution
}

/** Update execution status */
export async function updateExecution(
  executionId: string,
  data: {
    status?: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    response?: string
    model?: string
    inputTokens?: number
    outputTokens?: number
    costCredits?: number
    durationMs?: number
    errorMessage?: string
    startedAt?: Date
    completedAt?: Date
  }
) {
  return prisma.agentExecution.update({
    where: { id: executionId },
    data: data as any,
  })
}

/** Get execution history for user */
export async function getUserExecutions(
  userId: string,
  limit = 20,
  offset = 0,
  agentSlug?: string
) {
  const where: any = { userId }
  if (agentSlug) {
    const agent = await prisma.agentDefinition.findUnique({
      where: { slug: agentSlug },
      select: { id: true },
    })
    if (agent) where.agentId = agent.id
  }

  return prisma.agentExecution.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      agent: { select: { slug: true, name: true, icon: true, color: true, tier: true } },
    },
  })
}

/** Rate an execution */
export async function rateExecution(
  executionId: string,
  userId: string,
  rating: number,
  feedback?: string
) {
  const execution = await prisma.agentExecution.findUnique({
    where: { id: executionId },
    select: { userId: true, agentId: true },
  })
  if (!execution || execution.userId !== userId) throw new Error('Not authorized')

  await prisma.agentExecution.update({
    where: { id: executionId },
    data: { rating, feedback },
  })

  // Update agent average rating
  const avgResult = await prisma.agentExecution.aggregate({
    where: { agentId: execution.agentId, rating: { not: null } },
    _avg: { rating: true },
  })

  if (avgResult._avg.rating) {
    await prisma.agentDefinition.update({
      where: { id: execution.agentId },
      data: { avgRating: avgResult._avg.rating },
    })
  }
}

// ─── Favorites ──────────────────────────────────────────────────────

/** Toggle agent favorite */
export async function toggleFavorite(userId: string, agentSlug: string) {
  const agent = await prisma.agentDefinition.findUnique({
    where: { slug: agentSlug },
    select: { id: true },
  })
  if (!agent) throw new Error('Agent not found')

  const existing = await prisma.agentFavorite.findUnique({
    where: { userId_agentId: { userId, agentId: agent.id } },
  })

  if (existing) {
    await prisma.agentFavorite.delete({ where: { id: existing.id } })
    return { favorited: false }
  } else {
    const maxOrder = await prisma.agentFavorite.aggregate({
      where: { userId },
      _max: { pinOrder: true },
    })
    await prisma.agentFavorite.create({
      data: {
        userId,
        agentId: agent.id,
        pinOrder: (maxOrder._max.pinOrder ?? 0) + 1,
      },
    })
    return { favorited: true }
  }
}

/** Get user's favorite agents */
export async function getUserFavorites(userId: string) {
  return prisma.agentFavorite.findMany({
    where: { userId },
    orderBy: { pinOrder: 'asc' },
    include: {
      agent: { select: { slug: true, name: true, nameEn: true, icon: true, color: true, tier: true, category: true, description: true } },
    },
  })
}

// ─── Preferences ────────────────────────────────────────────────────

/** Get or create user preferences */
export async function getUserPreferences(userId: string) {
  return prisma.agentPreferences.upsert({
    where: { userId },
    create: { userId },
    update: {},
  })
}

/** Update user preferences */
export async function updateUserPreferences(
  userId: string,
  prefs: {
    formality?: number
    length?: number
    creativity?: number
    proactivity?: number
    expertise?: number
    humor?: number
  }
) {
  // Clamp all values 0-100
  const clamped: Record<string, number> = {}
  for (const [key, val] of Object.entries(prefs)) {
    if (val !== undefined) clamped[key] = Math.max(0, Math.min(100, val))
  }

  return prisma.agentPreferences.upsert({
    where: { userId },
    create: { userId, ...clamped },
    update: clamped,
  })
}

/** Build preference-aware system prompt suffix */
export function buildPreferencesSuffix(prefs: {
  formality: number
  length: number
  creativity: number
  proactivity: number
  expertise: number
  humor: number
}): string {
  const parts: string[] = []

  if (prefs.formality < 30) parts.push('Adopte un ton décontracté et familier.')
  else if (prefs.formality > 70) parts.push('Adopte un ton formel et professionnel.')

  if (prefs.length < 30) parts.push('Sois très concis, va droit au but.')
  else if (prefs.length > 70) parts.push('Sois détaillé et exhaustif dans tes réponses.')

  if (prefs.creativity < 30) parts.push('Reste conservateur et conventionnel dans tes suggestions.')
  else if (prefs.creativity > 70) parts.push('Sois audacieux et créatif, propose des idées originales.')

  if (prefs.proactivity < 30) parts.push('Réponds uniquement à ce qui est demandé, sans ajouter de suggestions.')
  else if (prefs.proactivity > 70) parts.push('Sois proactif : anticipe les besoins et propose des suggestions supplémentaires.')

  if (prefs.expertise < 30) parts.push('Explique avec des termes simples, comme pour un débutant.')
  else if (prefs.expertise > 70) parts.push('Utilise le vocabulaire technique du cinéma professionnel.')

  if (prefs.humor > 60) parts.push('Ajoute une touche d\'humour quand c\'est approprié.')

  return parts.length > 0
    ? `\n\nPréférences utilisateur :\n${parts.join('\n')}`
    : ''
}

// ─── Model Routing ──────────────────────────────────────────────────

/** Route to the correct model based on agent tier */
export function getModelForTier(tier: AgentTier): string {
  return TIER_CONFIG[tier].model
}
