'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FILMS_BY_GENRE, GENRE_ORDER } from '@/data/films'
import type { FilmData } from '@/data/films'
import {
  Palette,
  Users,
  Music,
  Film,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Lock,
  CheckCircle,
  Download,
  Play,
} from 'lucide-react'

/* ── Flatten all films ── */
const ALL_FILMS: FilmData[] = GENRE_ORDER.flatMap(
  (g) => FILMS_BY_GENRE[g] ?? []
)

/* ── Task categories ── */
const TASK_CATEGORIES = [
  { name: 'Scene Rendering', icon: Palette, desc: 'Image generation tasks', color: '#E50914' },
  { name: 'Character Animation', icon: Users, desc: 'Character design tasks', color: '#F59E0B' },
  { name: 'Sound Design', icon: Music, desc: 'Audio tasks', color: '#8B5CF6' },
  { name: 'Final Cut', icon: Film, desc: 'Editing tasks', color: '#10B981' },
  { name: 'Script Review', icon: FileText, desc: 'Writing tasks', color: '#3B82F6' },
  { name: 'VFX Compositing', icon: Sparkles, desc: 'Effects tasks', color: '#EC4899' },
]

/* ── Simulated tasks ── */
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
}

function generateTasks() {
  const tasks = []
  const taskNames: Record<string, string[]> = {
    'Scene Rendering': ['Render forest chase scene', 'Generate cityscape establishing shot', 'Create underwater sequence frames'],
    'Character Animation': ['Design protagonist expressions', 'Animate villain walk cycle', 'Create crowd background characters'],
    'Sound Design': ['Compose tension underscore', 'Design explosion SFX', 'Mix dialogue scene audio'],
    'Final Cut': ['Edit Act 2 montage', 'Color grade sunset sequence', 'Assemble trailer cut'],
    'Script Review': ['Review dialogue Act 1', 'Proofread screenplay final draft'],
    'VFX Compositing': ['Composite green screen shots', 'Add particle effects to climax'],
  }
  const rewards = [5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 50]
  const times = ['15 min', '30 min', '45 min', '1h', '1h 30min', '2h', '3h']

  let idx = 0
  for (const cat of TASK_CATEGORIES) {
    const names = taskNames[cat.name] || []
    for (const name of names) {
      if (idx >= 12) break
      const film = ALL_FILMS[idx % ALL_FILMS.length]
      tasks.push({
        id: idx,
        name,
        category: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        film: film.title,
        filmSlug: film.slug,
        reward: rewards[idx % rewards.length],
        difficulty: DIFFICULTIES[idx % 3],
        time: times[idx % times.length],
      })
      idx++
    }
  }
  return tasks
}

const TASKS = generateTasks()

/* ── Hero films (3 featured with high progress) ── */
const HERO_FILMS = ALL_FILMS.filter((f) => f.progressPct >= 40).slice(0, 3)

/* ── Coming soon films (low progress) ── */
const COMING_SOON = ALL_FILMS.filter((f) => f.progressPct < 15).slice(0, 6)

export default function WorkPage() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = dir === 'left' ? -400 : 400
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#E50914]/[0.03] blur-[200px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-amber-500/[0.02] blur-[150px]" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#E50914]/15 bg-[#E50914]/[0.06] text-[#E50914] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                Earn While You Create
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-shimmer">WORK</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-4">
                Complete film projects, get paid for every task.
              </p>
              <p className="text-base text-white/35 leading-relaxed mb-10">
                Download a movie kit, bring it to life and earn revenue.
                Choose between immediate cash payment or production shares worth 2x more.
              </p>
              <Link
                href="/register"
                className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
              >
                Start Earning Money
                <ArrowRight className="h-5 w-5" />
              </Link>

              {/* 0% commission banner */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">
                  0% commission on AI — you only pay actual token costs
                </span>
              </div>
            </div>

            {/* Right: 3 hero film cards */}
            <div className="flex gap-4 justify-center lg:justify-end">
              {HERO_FILMS.map((film) => (
                <Link
                  key={film.slug}
                  href={`/films/${film.slug}`}
                  className="group relative w-[140px] sm:w-[160px] rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all duration-500"
                >
                  <div className="relative aspect-[2/3] bg-[#141414]">
                    {film.coverImageUrl && (
                      <Image
                        src={film.coverImageUrl}
                        alt={film.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="160px"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* Progress badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
                      <span className="text-[10px] font-bold text-[#E50914]">{film.progressPct}%</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-xs font-bold text-white leading-tight line-clamp-2">{film.title}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF6B6B]"
                          style={{ width: `${film.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STEPS ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { step: '1', title: 'Choose a Movie', desc: 'Browse available films and pick a project that inspires you.', icon: Play },
              { step: '2', title: 'Download Kit', desc: 'Get the task assets, guidelines and creative brief.', icon: Download },
              { step: '3', title: 'Get Paid', desc: 'Submit your work, get approved, receive payment instantly.', icon: DollarSign },
            ].map((s, i) => (
              <div key={s.step} className="relative text-center p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 md:-right-6 w-8 md:w-12 h-px bg-gradient-to-r from-[#E50914]/40 to-transparent" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center mx-auto mb-3 text-[#E50914] font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ AVAILABLE MOVIES ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title-flash text-2xl md:text-3xl font-bold text-white font-playfair">
                Available Movies
              </h2>
              <p className="text-sm text-white/40 mt-2">Pick a film and start working on tasks</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-white/50" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-white/50" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {ALL_FILMS.slice(0, 30).map((film) => {
              const isDone = film.progressPct >= 100
              return (
                <Link
                  key={film.slug}
                  href={`/films/${film.slug}`}
                  className="group flex-shrink-0 w-[160px] sm:w-[180px] snap-start rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all duration-300"
                >
                  <div className="relative aspect-[2/3] bg-[#141414]">
                    {film.coverImageUrl && (
                      <Image
                        src={film.coverImageUrl}
                        alt={film.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="180px"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30'
                        }`}
                      >
                        {isDone ? 'DONE' : `${100 - film.progressPct}% REMAIN`}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-xs font-bold text-white leading-tight line-clamp-2 mb-1">{film.title}</p>
                      <p className="text-[10px] text-white/40">{film.genre}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF6B6B]"
                          style={{ width: `${film.progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-white/30">{film.progressPct}% complete</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ IN PROGRESS PROJECTS ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Active Tasks
            </p>
            <h2 className="section-title-flash text-3xl sm:text-4xl font-bold tracking-tight">
              In Progress <span className="text-shimmer">Projects</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Browse available tasks across all active film productions. Pick a task, complete it, and earn.
            </p>
          </div>

          {/* Task category pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {TASK_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 cursor-default"
              >
                <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                <span className="text-xs font-medium text-white/60">{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Task grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TASKS.map((task) => (
              <Link
                key={task.id}
                href="/tasks"
                className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/15 transition-all duration-500 backdrop-blur-sm"
              >
                {/* Category + difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${task.categoryColor}15`, border: `1px solid ${task.categoryColor}30` }}
                    >
                      <task.categoryIcon className="h-4 w-4" style={{ color: task.categoryColor }} />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">{task.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${DIFFICULTY_COLORS[task.difficulty]}`}>
                    {task.difficulty}
                  </span>
                </div>

                {/* Task name */}
                <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-white/90 transition-colors">
                  {task.name}
                </h3>
                <p className="text-xs text-white/30 mb-4">
                  Film: <span className="text-white/50">{task.film}</span>
                </p>

                {/* Reward + time */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">${task.reward}</span>
                    <span className="text-[10px] text-white/25">or {task.reward * 2} shares</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px]">{task.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ PAYMENT OPTIONS ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Your Choice
            </p>
            <h2 className="section-title-flash text-3xl sm:text-4xl font-bold tracking-tight">
              Payment <span className="text-shimmer">Options</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Choose how you want to be paid. Cash, production shares, or a mix of both.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Cash */}
            <div className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 transition-all duration-500 text-center">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cash</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Immediate payment via Stripe or Crypto. Get paid as soon as your task is approved.
              </p>
              <div className="text-2xl font-bold text-emerald-400 mb-2">$5 — $50</div>
              <p className="text-[10px] text-white/25">per task</p>
            </div>

            {/* Shares */}
            <div className="group relative p-7 rounded-2xl border border-[#E50914]/20 bg-[#E50914]/[0.03] hover:border-[#E50914]/30 transition-all duration-500 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-bold">
                2x VALUE
              </div>
              <div className="h-14 w-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="h-6 w-6 text-[#E50914]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Production Shares</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Get 2x value in production shares. Tokens locked until film release, potential 5-10x return.
              </p>
              <div className="text-2xl font-bold text-[#E50914] mb-2">$10 — $100</div>
              <p className="text-[10px] text-white/25">in share value per task</p>
            </div>

            {/* Mix */}
            <div className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-500/20 transition-all duration-500 text-center">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mix</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Split your payment: 50% cash + 50% production shares. Best of both worlds.
              </p>
              <div className="text-2xl font-bold text-amber-400 mb-2">Custom</div>
              <p className="text-[10px] text-white/25">you decide the split</p>
            </div>
          </div>

          {/* Smart contract note */}
          <div className="mt-8 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-sm text-white/50 text-center sm:text-left">
              <span className="text-emerald-400 font-semibold">Smart contract backed</span> — All payments are transparent,
              automatic, and verified on blockchain. No middlemen, no delays.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ HOW PAYMENT WORKS ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Comparison
            </p>
            <h2 className="section-title-flash text-3xl sm:text-4xl font-bold tracking-tight">
              How Payment <span className="text-shimmer">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cash path */}
            <div className="p-7 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-400">Cash Payment</h3>
                  <p className="text-xs text-white/30">Immediate &amp; guaranteed</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'Complete a task and submit',
                  'AI + human review (24-48h)',
                  'Payment via Stripe or Crypto',
                  'Funds in your account instantly',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-white/50">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/10 text-center">
                <span className="text-xs text-emerald-400 font-medium">Receive $5 — $50 per task</span>
              </div>
            </div>

            {/* Shares path */}
            <div className="p-7 rounded-2xl border border-[#E50914]/10 bg-[#E50914]/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#E50914]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E50914]">Production Shares</h3>
                  <p className="text-xs text-white/30">Higher potential return</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'Complete a task and submit',
                  'AI + human review (24-48h)',
                  'Tokens minted to your wallet',
                  'Locked until film release date',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#E50914]/15 flex items-center justify-center shrink-0">
                      {i < 3 ? (
                        <CheckCircle className="h-3.5 w-3.5 text-[#E50914]" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-[#E50914]" />
                      )}
                    </div>
                    <span className="text-sm text-white/50">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-[#E50914]/[0.05] border border-[#E50914]/10 text-center">
                <span className="text-xs text-[#E50914] font-medium">Potential 5-10x return on release</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ NEXT MOVIES COMING SOON ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Pipeline
            </p>
            <h2 className="section-title-flash text-2xl md:text-3xl font-bold text-white font-playfair">
              Next Movies Coming Soon
            </h2>
            <p className="text-sm text-white/40 mt-2">More projects, more tasks, more earnings</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COMING_SOON.map((film) => (
              <Link
                key={film.slug}
                href={`/films/${film.slug}`}
                className="group rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="relative aspect-[2/3] bg-[#141414]">
                  {film.coverImageUrl && (
                    <Image
                      src={film.coverImageUrl}
                      alt={film.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 640px) 50vw, 16vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-white/60 border border-white/10">
                      SOON
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">{film.title}</p>
                    <p className="text-[9px] text-white/30 mt-1">{film.genre}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 md:px-16 lg:px-20 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to{' '}
            <span className="text-shimmer">Start Earning</span>?
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Join hundreds of creators already earning from film production tasks.
            No experience needed — we provide everything you need to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
            >
              Start Earning
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/films"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              Browse All Films
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/20">
            Smart contract backed &middot; Instant payments &middot; No minimum withdrawal
          </p>
        </div>
      </section>
    </div>
  )
}
