import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as chatService from '@/lib/chat.service'
import { getAgentBySlug, type AgentDef } from '@/data/agents'

/** POST /api/chat/meeting — Create and run a multi-agent meeting */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, topic, agentSlugs, filmProjectId, rounds = 3 } = body

  if (!title || !topic || !agentSlugs || agentSlugs.length < 2) {
    return NextResponse.json(
      { error: 'Need title, topic, and at least 2 agents' },
      { status: 400 }
    )
  }

  // Validate agent slugs
  const agents: AgentDef[] = agentSlugs.map((slug: string) => getAgentBySlug(slug)).filter((a: AgentDef | undefined): a is AgentDef => !!a)
  if (agents.length < 2) {
    return NextResponse.json({ error: 'At least 2 valid agents required' }, { status: 400 })
  }

  try {
    // Create meeting
    const meeting = await chatService.createMeeting({
      userId: session.user.id,
      title,
      topic,
      agentSlugs,
      filmProjectId,
    })

    await chatService.updateMeeting(meeting.id, {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    })

    // TODO: In production, each agent would actually call the AI API
    // For now, simulate a multi-agent discussion
    const transcript: string[] = []
    const startTime = Date.now()

    for (let round = 1; round <= Math.min(rounds, 5); round++) {
      transcript.push(`\n── Round ${round} ──\n`)

      for (const agent of agents) {
        if (!agent) continue
        const response = `[${agent.name}] (Réponse simulée, Round ${round})\n` +
          `En tant que ${agent.name}, voici mon analyse du sujet "${topic.substring(0, 60)}...":\n` +
          `• Point clé lié à mon domaine (${agent.category.toLowerCase()})\n` +
          `• Recommandation spécifique\n` +
          `• Coordination avec les autres participants\n`
        transcript.push(response)
      }
    }

    const fullTranscript = transcript.join('\n')
    const summary = `## Compte-rendu de réunion\n\n` +
      `**Titre :** ${title}\n` +
      `**Sujet :** ${topic}\n` +
      `**Participants :** ${agents.map(a => a?.name).join(', ')}\n` +
      `**Rounds :** ${rounds}\n\n` +
      `### Décisions clés\n` +
      `1. [Décision simulée — sera générée par l'IA en production]\n\n` +
      `### Actions à suivre\n` +
      `- [ ] Action pour ${agents[0]?.name}\n` +
      `- [ ] Action pour ${agents[1]?.name}\n`

    const durationMs = Date.now() - startTime

    await chatService.updateMeeting(meeting.id, {
      status: 'COMPLETED',
      transcript: fullTranscript,
      summary,
      decisions: [{ decision: 'Simulated', by: agents[0]?.slug }],
      actionItems: agents.map(a => ({ agent: a?.slug, action: 'Follow-up simulated' })),
      roundCount: rounds,
      durationMs,
      completedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      meetingId: meeting.id,
      transcript: fullTranscript,
      summary,
      durationMs,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Meeting failed' }, { status: 500 })
  }
}

/** GET /api/chat/meeting — List user's meetings */
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const meetings = await chatService.getUserMeetings(session.user.id)
  return NextResponse.json({ meetings })
}
