import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  TrendingUp,
  Briefcase,
  PieChart,
  FileText,
  Drama,
  Rocket,
  GraduationCap,
} from 'lucide-react'
import { InfinityMark, InfinityDivider } from '@/components/brand/infinity-mark'
import { MotionCard } from '@/components/ui/motion'

export const metadata: Metadata = {
  title: 'Participate — CINEGENY',
  description:
    'One free account. Watch and vote, then unlock whatever you want: invest, take on paid missions, earn shares, submit a screenplay, act, or produce a film.',
}

const CAPABILITIES = [
  {
    icon: TrendingUp,
    title: 'Invest',
    desc: 'Buy film shares with Lumens. Earn dividends and vote on creative decisions.',
    href: '/tokenization',
    cta: 'Start investing',
  },
  {
    icon: Briefcase,
    title: 'Paid missions',
    desc: 'Complete production tasks and get paid in Lumens — convertible to real money.',
    href: '/work',
    cta: 'Browse missions',
  },
  {
    icon: PieChart,
    title: 'Missions for shares',
    desc: 'Prefer equity? Earn a percentage of a film instead of cash for your work.',
    href: '/work',
    cta: 'Earn shares',
  },
  {
    icon: FileText,
    title: 'Submit a screenplay',
    desc: 'Pitch your story. If the community votes it through, it becomes a trailer — then a film.',
    href: '/screenplays/new',
    cta: 'Submit a script',
  },
  {
    icon: Drama,
    title: 'Act',
    desc: 'Lend your image and voice to AI-assisted productions and get credited.',
    href: '/act',
    cta: 'Become an actor',
  },
  {
    icon: Rocket,
    title: 'Produce / launch a film',
    desc: 'Kick off a project, set a budget, and rally the community to fund it.',
    href: '/produce',
    cta: 'Launch a film',
  },
]

export default function ParticipatePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <InfinityMark className="h-12 w-auto mx-auto" animate />

          <h1 className="text-3xl sm:text-5xl font-bold font-playfair">
            One account. <span className="text-[#E50914]">Every way to take part.</span>
          </h1>
          <p className="text-white/55 text-base sm:text-lg leading-relaxed">
            Create your free account, watch and vote on the films of tomorrow, then unlock any of
            these whenever you&apos;re ready. No role to pick — just possibilities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] font-semibold transition-colors"
            >
              Create a free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/films"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/15 hover:border-white/30 font-medium transition-colors"
            >
              Watch &amp; vote first
            </Link>
          </div>
        </div>

        <InfinityDivider />

        {/* Capability grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map(({ icon: Icon, title, desc, href, cta }, i) => (
            <MotionCard key={title} delay={i * 0.06}>
            <Link
              href={href}
              className="group relative block h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-[#E50914]/30 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#E50914]/25 to-[#E50914]/[0.04] ring-1 ring-[#E50914]/25 shadow-lg shadow-[#E50914]/10 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <Icon className="h-6 w-6 text-[#E50914]" />
              </div>
              <h2 className="text-lg font-semibold mb-2">{title}</h2>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#E50914] opacity-80 group-hover:opacity-100">
                {cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
            </MotionCard>
          ))}
        </div>

        {/* Learn banner */}
        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#E50914]/[0.08] to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 shrink-0">
              <GraduationCap className="h-6 w-6 text-[#E50914]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">New here? Learn filmmaking for free.</h3>
              <p className="text-sm text-white/50 leading-relaxed mt-1">
                Our Academy walks you through making a film with AI — from shot choice and art
                direction to advanced prompting. Free with any account.
              </p>
            </div>
          </div>
          <Link
            href="/academy"
            className="shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/15 hover:border-white/30 font-medium transition-colors"
          >
            Open the Academy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
