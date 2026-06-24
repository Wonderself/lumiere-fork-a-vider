import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as chatService from '@/lib/chat.service'
import * as walletService from '@/lib/wallet.service'
import { getAgentBySlug } from '@/data/agents'
import { calculateTokenCost, estimateMaxCost } from '@/lib/ai-pricing'
import { getCachedChatResponse, cacheResponse, buildAnthropicMessages } from '@/lib/chat-cache'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60s for streaming

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await request.json()
    const { conversationId, message, agentSlug } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!agentSlug) {
      return NextResponse.json({ error: 'agentSlug is required' }, { status: 400 })
    }

    // ─── Check Circuit Breaker ──────────────────────────────────
    const agent = getAgentBySlug(agentSlug)
    const provider = agent?.defaultModel.includes('claude') ? 'anthropic' : 'openai'

    if (!chatService.checkCircuit(provider)) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again in 60 seconds.' },
        { status: 503 }
      )
    }

    // ─── Check Daily Budget ─────────────────────────────────────
    const { model, tier } = chatService.routeModel(agentSlug)
    const estimatedCost = estimateMaxCost(model, 500, agent?.maxTokens || 4096)

    const budgetCheck = await chatService.checkDailyBudget(userId, estimatedCost)
    if (!budgetCheck.allowed) {
      return NextResponse.json(
        { error: 'Daily budget exceeded. Try again tomorrow or increase your limit.' },
        { status: 429 }
      )
    }

    // ─── Check Wallet Balance ───────────────────────────────────
    const hasBalance = await walletService.hasBalance(userId, estimatedCost)
    if (!hasBalance) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please top up your wallet.' },
        { status: 402 }
      )
    }

    // ─── Get or Create Conversation ─────────────────────────────
    let convId = conversationId
    if (!convId) {
      const conv = await chatService.createConversation(userId, agentSlug)
      convId = conv.id
    }

    // ─── Save User Message ──────────────────────────────────────
    await chatService.addMessage({
      conversationId: convId,
      userId,
      role: 'USER',
      content: message,
    })

    // ─── Build Context (last 20 messages) ───────────────────────
    const contextMessages = await chatService.getContextMessages(convId, 20)
    const contextHash = chatService.hashContext(contextMessages)

    // ─── Check Redis Cache ──────────────────────────────────────
    const cacheKey = chatService.buildCacheKey(agentSlug, message, contextHash)
    const cachedResponse = await getCachedChatResponse(cacheKey)

    if (cachedResponse) {
      // Cache hit — return immediately, no AI cost
      const assistantMsg = await chatService.addMessage({
        conversationId: convId,
        userId,
        role: 'ASSISTANT',
        content: cachedResponse,
        model,
        agentSlug,
        cacheHit: true,
        status: 'COMPLETED',
      })

      return NextResponse.json({
        conversationId: convId,
        messageId: assistantMsg.id,
        content: cachedResponse,
        cached: true,
        model,
      })
    }

    // ─── Hold Credits ───────────────────────────────────────────
    const holdResult = await walletService.deductBeforeAction(
      userId, estimatedCost, `Chat with ${agent?.name || agentSlug}`
    )

    if (!holdResult.success) {
      return NextResponse.json(
        { error: holdResult.error || 'Failed to hold credits' },
        { status: 402 }
      )
    }

    // ─── Build System Prompt ────────────────────────────────────
    const systemPrompt = await chatService.buildSystemPrompt(agentSlug, userId)
    const anthropicPayload = buildAnthropicMessages(
      systemPrompt,
      contextMessages.map(m => ({ role: m.role, content: m.content })),
      message
    )

    // ─── Create Streaming Assistant Message (placeholder) ───────
    const assistantMsg = await chatService.addMessage({
      conversationId: convId,
      userId,
      role: 'ASSISTANT',
      content: '',
      model,
      agentSlug,
      status: 'STREAMING',
    })

    // ─── SSE Stream Response ────────────────────────────────────
    const startTime = Date.now()

    const CIRCUIT_MAX_FAILURES = 5

    // TODO: In production, connect to Anthropic API with streaming
    // For now, simulate a streaming response
    const encoder = new TextEncoder()
    const simulatedResponse = `[${agent?.name || 'Agent'}] This is a simulated streaming response to your message: "${message.substring(0, 80)}..."

Set ANTHROPIC_API_KEY to switch this chat to the live Anthropic API. It will use model ${model} (${tier}) with prompt caching to cut cost ~90% on repeated system tokens.

Active features:
• Circuit breaker (${CIRCUIT_MAX_FAILURES} failures -> 60s pause)
• Daily budget (checked before each request)
• Sliding context (last 20 messages)
• Redis memoization (identical responses cached 5 min)
• Hold/Release credits (refunded on error)
• Cancellation via AbortController`

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = ''
          let inputTokens = 0
          let outputTokens = 0

          if (process.env.ANTHROPIC_API_KEY) {
            // ── Live Anthropic streaming ──
            const Anthropic = (await import('@anthropic-ai/sdk')).default
            const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
            const aiStream = await client.messages.create({
              model,
              max_tokens: agent?.maxTokens || 4096,
              system: anthropicPayload.system,
              messages: anthropicPayload.messages,
              stream: true,
            })
            let i = 0
            for await (const event of aiStream) {
              if (event.type === 'message_start') {
                inputTokens = event.message.usage?.input_tokens ?? inputTokens
              } else if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                const word = event.delta.text
                fullContent += word
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', content: word, index: i++ })}\n\n`))
              } else if (event.type === 'message_delta') {
                outputTokens = event.usage?.output_tokens ?? outputTokens
              }
            }
          } else {
            // ── Simulated streaming (no ANTHROPIC_API_KEY set) ──
            const words = simulatedResponse.split(' ')
            for (let i = 0; i < words.length; i++) {
              const word = (i > 0 ? ' ' : '') + words[i]
              fullContent += word
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', content: word, index: i })}\n\n`))
              await new Promise(resolve => setTimeout(resolve, 30))
            }
          }

          const durationMs = Date.now() - startTime
          if (!inputTokens) inputTokens = Math.ceil(message.length / 4)
          if (!outputTokens) outputTokens = Math.ceil(fullContent.length / 4)
          const { billedCredits: actualCost } = calculateTokenCost(model, inputTokens, outputTokens)

          // Update message with final content
          await chatService.updateMessageContent(assistantMsg.id, fullContent, 'COMPLETED')

          // Release hold with actual cost
          if (holdResult.holdId) {
            await walletService.releaseHold(userId, holdResult.holdId, actualCost)
          }

          // Deduct daily budget
          await chatService.deductDailyBudget(userId, actualCost)

          // Cache the response
          await cacheResponse(cacheKey, fullContent)

          // Record circuit success
          chatService.recordCircuitSuccess(provider)

          // Send completion event
          const doneData = JSON.stringify({
            type: 'done',
            conversationId: convId,
            messageId: assistantMsg.id,
            model,
            inputTokens,
            outputTokens,
            costCredits: actualCost,
            durationMs,
            cached: false,
          })
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
          controller.close()
        } catch (err: any) {
          // Record circuit failure
          chatService.recordCircuitFailure(provider)

          // Refund held credits (full refund on error)
          if (holdResult.holdId) {
            await walletService.releaseHold(userId, holdResult.holdId, 0)
          }

          // Update message as failed
          await chatService.updateMessageContent(assistantMsg.id, '', 'FAILED')

          const errorData = JSON.stringify({
            type: 'error',
            error: err.message || 'Streaming failed',
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Conversation-Id': convId,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chat failed' }, { status: 500 })
  }
}
