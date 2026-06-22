'use server'

import { auth } from '@/lib/auth'
import * as chatService from '@/lib/chat.service'

/** Create a new conversation */
export async function createConversationAction(agentSlug: string, title?: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const conv = await chatService.createConversation(session.user.id, agentSlug, title)
  return { id: conv.id }
}

/** Get user's conversations */
export async function getConversationsAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated', conversations: [] }

  const conversations = await chatService.getUserConversations(session.user.id)
  return { conversations }
}

/** Archive a conversation */
export async function archiveConversationAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  await chatService.archiveConversation(id, session.user.id)
  return { success: true }
}

/** Toggle pin on a conversation */
export async function togglePinAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  await chatService.togglePinConversation(id, session.user.id)
  return { success: true }
}

/** Get daily budget info */
export async function getDailyBudgetAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const budget = await chatService.getDailyBudget(session.user.id)
  return {
    limit: budget.limit,
    used: budget.used,
    remaining: budget.limit - budget.used,
    requestCount: budget.requestCount,
  }
}

/** Get circuit breaker status */
export async function getCircuitStatusAction() {
  return {
    anthropic: chatService.getCircuitStatus('anthropic'),
    openai: chatService.getCircuitStatus('openai'),
  }
}
