import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { CRON_JOBS, runCronJob, runAllCrons } from '@/lib/cron.service'

/** GET — List all cron jobs */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const jobs = CRON_JOBS.map(j => ({
    name: j.name,
    schedule: j.schedule,
    description: j.description,
  }))

  return NextResponse.json({ jobs })
}

/** POST — Run a cron job or all jobs */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 })

  const { name } = await request.json()

  if (name === 'all') {
    const results = await runAllCrons()
    return NextResponse.json({ results })
  }

  const result = await runCronJob(name)
  return NextResponse.json(result)
}
