import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as agentService from '@/lib/agent.service'

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

    // TODO: In production, this would call the actual AI API
    // For now, return a placeholder response
    const placeholderResponse = `[Agent ${slug}] Réponse simulée pour: "${prompt.substring(0, 100)}..."\n\nCette fonctionnalité sera connectée à l'API IA prochainement. L'agent analysera votre demande avec le modèle approprié et vous fournira une réponse experte.`

    await agentService.updateExecution(execution.id, {
      status: 'COMPLETED',
      response: placeholderResponse,
      completedAt: new Date(),
      durationMs: 1200,
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
      response: placeholderResponse,
      model: execution.model,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Execution failed' }, { status: 500 })
  }
}
