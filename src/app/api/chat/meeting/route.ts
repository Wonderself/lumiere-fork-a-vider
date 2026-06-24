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

    // Live multi-agent discussion via Anthropic when configured, else simulated.
    const transcript: string[] = []
    const startTime = Date.now()
    const useReal = !!process.env.ANTHROPIC_API_KEY
    const client = useReal
      ? new ((await import('@anthropic-ai/sdk')).default)({ apiKey: process.env.ANTHROPIC_API_KEY })
      : null
    const maxRounds = Math.min(rounds, 5)

    for (let round = 1; round <= maxRounds; round++) {
      transcript.push(`\n── Round ${round} ──\n`)
      for (const agent of agents) {
        if (!agent) continue
        if (client) {
          const recent = transcript.join('\n').slice(-4000)
          const msg = await client.messages.create({
            model: agent.defaultModel,
            max_tokens: 600,
            system: `${agent.systemPrompt}\n\nYou are taking part in a multi-agent film production meeting. Be concise (3-5 sentences), speak in your area of expertise, and build on what other participants already said.`,
            messages: [{ role: 'user', content: `Meeting topic: ${topic}\n\nDiscussion so far:\n${recent || '(you open the discussion)'}\n\nGive your contribution for round ${round} as ${agent.name}.` }],
          })
          const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim()
          transcript.push(`[${agent.name}]\n${text}\n`)
        } else {
          transcript.push(
            `[${agent.name}] (Simulated, Round ${round})\n` +
            `As ${agent.name}, here is my take on "${topic.substring(0, 60)}...":\n` +
            `• Key point from my field (${agent.category.toLowerCase()})\n` +
            `• A specific recommendation\n` +
            `• How it coordinates with the other participants\n`,
          )
        }
      }
    }

    const fullTranscript = transcript.join('\n')

    let summary: string
    if (client) {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 900,
        system: 'You turn a film production meeting transcript into a clear, structured brief.',
        messages: [{ role: 'user', content: `Title: ${title}\nTopic: ${topic}\nParticipants: ${agents.map((a) => a?.name).join(', ')}\n\nTranscript:\n${fullTranscript}\n\nWrite a concise markdown summary with sections: Key decisions, Action items (one per participant), and Next steps.` }],
      })
      summary = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim() || '(no summary)'
    } else {
      summary = `## Meeting summary\n\n` +
        `**Title:** ${title}\n` +
        `**Topic:** ${topic}\n` +
        `**Participants:** ${agents.map((a) => a?.name).join(', ')}\n` +
        `**Rounds:** ${rounds}\n\n` +
        `### Key decisions\n` +
        `1. [Simulated — set ANTHROPIC_API_KEY to generate a real summary]\n\n` +
        `### Action items\n` +
        `- [ ] Action for ${agents[0]?.name}\n` +
        `- [ ] Action for ${agents[1]?.name}\n`
    }

    const durationMs = Date.now() - startTime

    await chatService.updateMeeting(meeting.id, {
      status: 'COMPLETED',
      transcript: fullTranscript,
      summary,
      decisions: [{ decision: useReal ? 'See summary' : 'Simulated', by: agents[0]?.slug }],
      actionItems: agents.map(a => ({ agent: a?.slug, action: useReal ? 'See summary' : 'Follow-up simulated' })),
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
