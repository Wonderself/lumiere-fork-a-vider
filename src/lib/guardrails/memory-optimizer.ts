/**
 * Memory Optimizer
 * Manages memory for long-running agent sessions.
 * Progressive conversation compression.
 */

export interface CompressedMessage {
  role: string
  content: string
  originalLength: number
  compressed: boolean
  timestamp: number
}

const THRESHOLDS = {
  softLimit: 20,       // Start summarizing after 20 messages
  hardLimit: 50,       // Force-compress after 50 messages
  maxContentLength: 4000,  // Max chars per message in context
  summaryRatio: 0.3,   // Compress to 30% of original
}

/** Truncate a message to maxLength */
function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength - 50) + '\n...[truncated]'
}

/** Simple summarization: keep first and last sentences */
function simpleSummarize(content: string, targetLength: number): string {
  const sentences = content.split(/[.!?]\s+/)
  if (sentences.length <= 2) return truncateContent(content, targetLength)

  const result: string[] = []
  let currentLength = 0

  // Keep first sentence
  result.push(sentences[0])
  currentLength += sentences[0].length

  // Keep last 2 sentences
  const lastSentences = sentences.slice(-2)

  // Fill middle from important sentences (longer ones tend to be more informative)
  const middle = sentences.slice(1, -2).sort((a, b) => b.length - a.length)
  for (const s of middle) {
    if (currentLength + s.length > targetLength * 0.6) break
    result.push(s)
    currentLength += s.length
  }

  result.push(...lastSentences)
  return result.join('. ') + '.'
}

/** Optimize a conversation for context window */
export function optimizeContext(
  messages: Array<{ role: string; content: string; createdAt?: Date | string }>,
  maxMessages: number = 20
): CompressedMessage[] {
  if (messages.length <= THRESHOLDS.softLimit) {
    // Under soft limit: just truncate long messages
    return messages.map(m => ({
      role: m.role,
      content: truncateContent(m.content, THRESHOLDS.maxContentLength),
      originalLength: m.content.length,
      compressed: m.content.length > THRESHOLDS.maxContentLength,
      timestamp: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
    }))
  }

  // Over soft limit: progressive compression
  const result: CompressedMessage[] = []

  // Keep first 2 messages (context setting)
  for (const m of messages.slice(0, 2)) {
    result.push({
      role: m.role,
      content: truncateContent(m.content, THRESHOLDS.maxContentLength),
      originalLength: m.content.length,
      compressed: false,
      timestamp: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
    })
  }

  // Summarize middle messages
  const middle = messages.slice(2, -maxMessages + 2)
  if (middle.length > 0) {
    const summary = middle.map(m =>
      `[${m.role}]: ${simpleSummarize(m.content, 200)}`
    ).join('\n')

    result.push({
      role: 'SYSTEM',
      content: `[Summary of ${middle.length} earlier messages]\n${truncateContent(summary, 2000)}`,
      originalLength: middle.reduce((sum, m) => sum + m.content.length, 0),
      compressed: true,
      timestamp: middle[0].createdAt ? new Date(middle[0].createdAt).getTime() : Date.now(),
    })
  }

  // Keep last N messages uncompressed
  const recent = messages.slice(-(maxMessages - 2))
  for (const m of recent) {
    result.push({
      role: m.role,
      content: truncateContent(m.content, THRESHOLDS.maxContentLength),
      originalLength: m.content.length,
      compressed: m.content.length > THRESHOLDS.maxContentLength,
      timestamp: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
    })
  }

  return result
}

/** Estimate token count from text */
export function estimateTokens(text: string): number {
  // Rough: ~4 chars per token for English, ~2.5 for French
  return Math.ceil(text.length / 3)
}

/** Get memory stats for optimization decisions */
export function getMemoryStats(messages: CompressedMessage[]): {
  totalMessages: number
  compressedMessages: number
  totalChars: number
  estimatedTokens: number
  compressionRatio: number
} {
  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0)
  const originalChars = messages.reduce((sum, m) => sum + m.originalLength, 0)

  return {
    totalMessages: messages.length,
    compressedMessages: messages.filter(m => m.compressed).length,
    totalChars,
    estimatedTokens: estimateTokens(messages.map(m => m.content).join('')),
    compressionRatio: originalChars > 0 ? totalChars / originalChars : 1,
  }
}
