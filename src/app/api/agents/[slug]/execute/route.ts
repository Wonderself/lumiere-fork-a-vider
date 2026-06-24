import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'
import { getAgentBySlug } from '@/data/agents'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const body = await request.json()
  const { prompt, context, filmProjectId } = body

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  try {
    const execution = await agentService.createExecution(session.user.id, {
      agentSlug: slug,
      prompt,
      context,
      filmProjectId,
    })

    // Mark as running
    await agentService.updateExecution(execution.id, {
      status: 'RUNNING',
      startedAt: new Date(),
    })

    // Run the agent: live Anthropic when configured, simulated otherwise.
    const def = getAgentBySlug(slug)
    const startedAt = Date.now()
    let response: string
    if (process.env.ANTHROPIC_API_KEY && def) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const msg = await client.messages.create({
        model: def.defaultModel,
        max_tokens: def.maxTokens || 4096,
        system: def.systemPrompt,
        messages: [{ role: 'user', content: context ? `${context}\n\n${prompt}` : prompt }],
      })
      response = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim() || '(no response)'
    } else {
      response = `[Agent ${slug}] Simulated response for: "${prompt.substring(0, 100)}..."\n\nSet ANTHROPIC_API_KEY to connect this agent to the live AI. It will analyze your request with the right model and return an expert reply.`
    }

    await agentService.updateExecution(execution.id, {
      status: 'COMPLETED',
      response,
      completedAt: new Date(),
      durationMs: Date.now() - startedAt,
    })

    // Increment execution count
    const agent = await agentService.getAgent(slug)
    if (agent) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.agentDefinition.update({
        where: { slug },
        data: { totalExecutions: { increment: 1 } },
      })
    }

    return NextResponse.json({
      success: true,
      executionId: execution.id,
      response,
      model: execution.model,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Execution failed' }, { status: 500 })
  }
}
