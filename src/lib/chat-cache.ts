import { getCached, invalidateCache } from '@/lib/redis'

/**
 * Cache a chat response in Redis.
 * TTL: 5 minutes for identical prompt+context combinations.
 */
export async function cacheResponse(key: string, response: string): Promise<void> {
  try {
    // Use getCached with a fetcher that returns the response
    await getCached(key, async () => response, 300) // 5 min TTL
  } catch {
    // Cache write failed — silently continue
  }
}

/**
 * Try to get a cached response.
 * Returns null if not cached.
 */
export async function getCachedChatResponse(key: string): Promise<string | null> {
  try {
    // Trick: use getCached with a fetcher that returns null
    // If cache has a value, it returns it. Otherwise fetcher runs and returns null.
    const result = await getCached<string | null>(key, async () => null, 300)
    return result
  } catch {
    return null
  }
}

/**
 * Invalidate all chat caches for a conversation.
 */
export async function invalidateChatCache(conversationId: string): Promise<void> {
  await invalidateCache(`chat:${conversationId}:*`)
}

/**
 * Build Anthropic-compatible messages with prompt caching headers.
 * The system prompt gets cache_control: { type: "ephemeral" } to enable
 * Anthropic's prompt caching (saves ~90% on repeated system prompts).
 */
export function buildAnthropicMessages(
  systemPrompt: string,
  contextMessages: Array<{ role: string; content: string }>,
  newMessage: string
) {
  return {
    system: [
      {
        type: 'text' as const,
        text: systemPrompt,
        cache_control: { type: 'ephemeral' as const }, // Anthropic prompt caching
      },
    ],
    messages: [
      ...contextMessages.map(m => ({
        role: m.role === 'USER' ? 'user' as const : 'assistant' as const,
        content: m.content,
      })),
      {
        role: 'user' as const,
        content: newMessage,
      },
    ],
  }
}
