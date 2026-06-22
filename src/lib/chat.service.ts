import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/redis'
import { getAgentBySlug, TIER_CONFIG } from '@/data/agents'
import type { AgentTier } from '@/data/agents'
import { buildPreferencesSuffix } from '@/lib/agent.service'

// ─── Circuit Breaker ────────────────────────────────────────────────

interface CircuitState {
  failures: number
  lastFailure: number
  isOpen: boolean
}

const circuitBreakers = new Map<string, CircuitState>()
const CIRCUIT_MAX_FAILURES = 5
const CIRCUIT_RESET_MS = 60_000 // 60 seconds

export function checkCircuit(provider: string): boolean {
  const state = circuitBreakers.get(provider)
  if (!state) return true // No state = circuit closed (healthy)

  if (state.isOpen) {
    // Check if enough time has passed to try again
    if (Date.now() - state.lastFailure > CIRCUIT_RESET_MS) {
      state.isOpen = false
      state.failures = 0
      return true // Half-open: allow one request
    }
    return false // Still open: reject
  }
  return true
}

export function recordCircuitFailure(provider: string): void {
  const state = circuitBreakers.get(provider) || { failures: 0, lastFailure: 0, isOpen: false }
  state.failures++
  state.lastFailure = Date.now()
  if (state.failures >= CIRCUIT_MAX_FAILURES) {
    state.isOpen = true
  }
  circuitBreakers.set(provider, state)
}

export function recordCircuitSuccess(provider: string): void {
  circuitBreakers.delete(provider)
}

export function getCircuitStatus(provider: string): CircuitState {
  return circuitBreakers.get(provider) || { failures: 0, lastFailure: 0, isOpen: false }
}

// ─── Daily Budget ───────────────────────────────────────────────────

const DEFAULT_DAILY_BUDGET = 100_000_000 // 100 credits in micro-credits

export async function getDailyBudget(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.dailyBudget.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, limit: DEFAULT_DAILY_BUDGET },
    update: {},
  })
}

export async function checkDailyBudget(userId: string, estimatedCost: number): Promise<{ allowed: boolean; remaining: number }> {
  const budget = await getDailyBudget(userId)
  const remaining = budget.limit - budget.used
  return {
    allowed: remaining >= estimatedCost,
    remaining,
  }
}

export async function deductDailyBudget(userId: string, cost: number): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.dailyBudget.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, used: cost, requestCount: 1 },
    update: { used: { increment: cost }, requestCount: { increment: 1 } },
  })
}

// ─── Conversations ──────────────────────────────────────────────────

export async function createConversation(userId: string, agentSlug: string, title?: string, filmProjectId?: string) {
  const agent = getAgentBySlug(agentSlug)
  const autoTitle = title || `Chat avec ${agent?.name || agentSlug}`

  return prisma.conversation.create({
    data: {
      userId,
      agentSlug,
      title: autoTitle,
      filmProjectId,
    },
  })
}

export async function getConversation(id: string, userId: string) {
  return prisma.conversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function getUserConversations(userId: string, limit = 30) {
  return prisma.conversation.findMany({
    where: { userId, isArchived: false },
    orderBy: [{ isPinned: 'desc' }, { lastMessageAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      agentSlug: true,
      title: true,
      isPinned: true,
      messageCount: true,
      lastMessageAt: true,
      createdAt: true,
    },
  })
}

export async function archiveConversation(id: string, userId: string) {
  return prisma.conversation.updateMany({
    where: { id, userId },
    data: { isArchived: true },
  })
}

export async function togglePinConversation(id: string, userId: string) {
  const conv = await prisma.conversation.findFirst({ where: { id, userId } })
  if (!conv) return null
  return prisma.conversation.update({
    where: { id },
    data: { isPinned: !conv.isPinned },
  })
}

// ─── Messages ───────────────────────────────────────────────────────

export async function addMessage(data: {
  conversationId: string
  userId: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  model?: string
  agentSlug?: string
  inputTokens?: number
  outputTokens?: number
  costCredits?: number
  durationMs?: number
  cacheHit?: boolean
  promptCacheHit?: boolean
  cachedTokens?: number
  status?: 'STREAMING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  errorMessage?: string
  metadata?: Record<string, unknown>
}) {
  const message = await prisma.chatMessage.create({
    data: {
      conversationId: data.conversationId,
      userId: data.userId,
      role: data.role as any,
      content: data.content,
      model: data.model,
      agentSlug: data.agentSlug,
      inputTokens: data.inputTokens ?? 0,
      outputTokens: data.outputTokens ?? 0,
      costCredits: data.costCredits ?? 0,
      durationMs: data.durationMs,
      cacheHit: data.cacheHit ?? false,
      promptCacheHit: data.promptCacheHit ?? false,
      cachedTokens: data.cachedTokens ?? 0,
      status: (data.status || 'COMPLETED') as any,
      errorMessage: data.errorMessage,
      metadata: data.metadata as any,
    },
  })

  // Update conversation stats
  await prisma.conversation.update({
    where: { id: data.conversationId },
    data: {
      messageCount: { increment: 1 },
      totalTokens: { increment: (data.inputTokens ?? 0) + (data.outputTokens ?? 0) },
      totalCost: { increment: data.costCredits ?? 0 },
      lastMessageAt: new Date(),
    },
  })

  return message
}

export async function updateMessageContent(messageId: string, content: string, status: 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'COMPLETED') {
  return prisma.chatMessage.update({
    where: { id: messageId },
    data: { content, status: status as any },
  })
}

/** Get last N messages for context window */
export async function getContextMessages(conversationId: string, limit = 20) {
  const messages = await prisma.chatMessage.findMany({
    where: {
      conversationId,
      status: 'COMPLETED' as any,
      role: { not: 'SYSTEM' as any },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      role: true,
      content: true,
      agentSlug: true,
      createdAt: true,
    },
  })
  return messages.reverse() // Oldest first
}

// ─── Model Routing ──────────────────────────────────────────────────

/** Get the model to use based on agent tier */
export function routeModel(agentSlug: string): { model: string; tier: AgentTier } {
  const agent = getAgentBySlug(agentSlug)
  if (!agent) return { model: 'claude-sonnet-4-6', tier: 'L1_EXECUTION' }
  return {
    model: TIER_CONFIG[agent.tier].model,
    tier: agent.tier,
  }
}

// ─── System Prompt Builder ──────────────────────────────────────────

/** Build the full system prompt with agent definition + user preferences */
export async function buildSystemPrompt(agentSlug: string, userId: string): Promise<string> {
  const agent = getAgentBySlug(agentSlug)
  if (!agent) return 'Tu es un assistant IA spécialisé cinéma.'

  let systemPrompt = agent.systemPrompt

  // Add user preferences
  try {
    const prefs = await prisma.agentPreferences.findUnique({
      where: { userId },
    })
    if (prefs) {
      systemPrompt += buildPreferencesSuffix({
        formality: prefs.formality,
        length: prefs.length,
        creativity: prefs.creativity,
        proactivity: prefs.proactivity,
        expertise: prefs.expertise,
        humor: prefs.humor,
      })
    }
  } catch {
    // Preferences not found, use defaults
  }

  return systemPrompt
}

// ─── Redis Memoization ──────────────────────────────────────────────

/** Generate cache key for a chat request */
export function buildCacheKey(agentSlug: string, prompt: string, contextHash: string): string {
  // Simple hash: agent + first 200 chars of prompt + context hash
  const promptKey = prompt.substring(0, 200).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  return `chat:${agentSlug}:${promptKey}:${contextHash}`
}

/** Check Redis cache for identical recent response */
export async function getCachedResponse(cacheKey: string): Promise<string | null> {
  try {
    return await getCached<string | null>(
      cacheKey,
      async () => null, // No fetcher — we only check cache
      300 // 5 minutes TTL
    )
  } catch {
    return null
  }
}

/** Simple hash for context messages */
export function hashContext(messages: Array<{ role: string; content: string }>): string {
  const str = messages.map(m => `${m.role}:${m.content.substring(0, 50)}`).join('|')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// ─── Multi-Agent Meetings ───────────────────────────────────────────

export async function createMeeting(data: {
  userId: string
  title: string
  topic: string
  agentSlugs: string[] // Which agents participate
  filmProjectId?: string
}) {
  const meeting = await prisma.agentMeeting.create({
    data: {
      title: data.title,
      topic: data.topic,
      filmProjectId: data.filmProjectId,
      status: 'PENDING',
      participants: {
        create: data.agentSlugs.map((slug, i) => ({
          userId: data.userId,
          agentSlug: slug,
          role: i === 0 ? 'moderator' : 'contributor',
        })),
      },
    },
    include: { participants: true },
  })

  return meeting
}

export async function getMeeting(id: string) {
  return prisma.agentMeeting.findUnique({
    where: { id },
    include: { participants: true },
  })
}

export async function getUserMeetings(userId: string, limit = 20) {
  return prisma.agentMeeting.findMany({
    where: {
      participants: { some: { userId } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      participants: {
        select: { agentSlug: true, role: true, messageCount: true },
      },
    },
  })
}

export async function updateMeeting(id: string, data: {
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  transcript?: string
  summary?: string
  decisions?: unknown
  actionItems?: unknown
  totalTokens?: number
  totalCost?: number
  durationMs?: number
  roundCount?: number
  startedAt?: Date
  completedAt?: Date
}) {
  return prisma.agentMeeting.update({
    where: { id },
    data: data as any,
  })
}
