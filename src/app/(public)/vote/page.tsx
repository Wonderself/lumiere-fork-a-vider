import Link from 'next/link'
import type { Metadata } from 'next'
import { FileText, Clapperboard, Film, Clock, ArrowRight, ArrowDown, CheckCircle2 } from 'lucide-react'
import { InfinityMark } from '@/components/brand/infinity-mark'

export const metadata: Metadata = {
  title: 'Vote — Decide the films of tomorrow | CINEGENY',
  description:
    'Every film climbs a ladder powered by your votes: screenplay → trailer → short film → feature film. Vote to push the projects you believe in to the next stage.',
}

const STAGES = [
  {
    icon: FileText,
    stage: 'Stage 1',
    title: 'Screenplays',
    count: 10,
    promote: 'Vote a screenplay through and it becomes a trailer.',
    href: '/community/scenarios',
    cta: 'Vote on screenplays',
    live: true,
  },
  {
    icon: Clapperboard,
    stage: 'Stage 2',
    title: 'Trailers',
    count: 10,
    promote: 'Vote a trailer through and it becomes a short film.',
    href: '/films',
    cta: 'Vote on trailers',
    live: true,
  },
  {
    icon: Film,
    stage: 'Stage 3',
    title: 'Short films',
    count: 0,
    promote: 'Vote a short film through and it becomes a feature.',
    href: '/vote',
    cta: 'Coming soon',
    live: false,
  },
  {
    icon: Clock,
    stage: 'Stage 4',
    title: 'Feature films (1h)',
    count: 0,
    promote: 'The finished works the community brought to life.',
    href: '/vote',
    cta: 'Coming soon',
    live: false,
  },
]

export default function VotePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="max-w-3xl space-y-5">
          <InfinityMark className="h-12 w-auto" animate />
          <h1 className="text-3xl sm:text-5xl font-bold font-playfair">
            You decide what gets <span className="text-[#E50914]">made</span>.
          </h1>
          <p className="text-white/55 text-base sm:text-lg leading-relaxed">
            Every project climbs a ladder powered by community votes. We always keep{' '}
            <strong className="text-white/80">10 active projects at each stage</strong>. Push the ones
            you believe in to the next level.
          </p>
        </div>

        {/* Funnel */}
        <div className="mt-14 space-y-4">
          {STAGES.map((s, i) => (
            <div key={s.title}>
              <div
                className={`group rounded-2xl border p-6 sm:p-7 transition-all duration-300 ${
                  s.live
                    ? 'border-white/[0.08] bg-white/[0.03] hover:border-[#E50914]/30 hover:bg-white/[0.05]'
                    : 'border-white/[0.06] bg-white/[0.02] opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#E50914]/25 to-[#E50914]/[0.04] ring-1 ring-[#E50914]/25 shadow-lg shadow-[#E50914]/10 shrink-0 transition-transform duration-300 group-hover:scale-105">
                      <s.icon className="h-7 w-7 text-[#E50914]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#E50914]">{s.stage}</span>
                        {s.live ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {s.count} active
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">Unlocked by votes</span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold mt-0.5">{s.title}</h2>
                      <p className="text-sm text-white/50 mt-1">{s.promote}</p>
                    </div>
                  </div>
                  {s.live ? (
                    <Link
                      href={s.href}
                      className="shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] font-semibold text-sm transition-colors"
                    >
                      {s.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="shrink-0 inline-flex items-center h-11 px-5 rounded-xl border border-white/10 text-sm text-white/40">
                      {s.cta}
                    </span>
                  )}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-5 w-5 text-white/20" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
          <p className="text-white/60">
            Want your own story in the ladder?{' '}
            <Link href="/screenplays/new" className="text-[#E50914] font-medium hover:underline">
              Submit a screenplay
            </Link>{' '}
            and let the community vote it into a film.
          </p>
        </div>
      </div>
    </div>
  )
}
