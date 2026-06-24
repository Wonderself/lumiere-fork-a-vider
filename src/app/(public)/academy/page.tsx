import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { LEVELS, totalMinutes, lessonCount } from '@/content/academy'
import { Clock, BookOpen, Lock, ArrowRight, PlayCircle, Sparkles, GraduationCap } from 'lucide-react'
import { InfinityMark } from '@/components/brand/infinity-mark'
import { Reveal } from '@/components/academy/reveal'

export const metadata: Metadata = {
  title: 'Academy — Learn AI Filmmaking | CINEGENY',
  description:
    'A free, in-depth course on making films with AI: shot choice, art direction, image sequencing, advanced prompting, consistency, grading, VFX and a professional pipeline.',
}

export default async function AcademyPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id
  const bootcamp = LEVELS[0]
  const firstLesson = bootcamp?.modules[0]?.lessons[0]
  const startHref = isLoggedIn && firstLesson ? `/academy/${bootcamp.id}/${firstLesson.slug}` : '/register'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-[#E50914]/[0.10] rounded-full blur-[140px]" />
        <div className="absolute top-10 right-10 w-[280px] h-[280px] bg-[#D4AF37]/[0.08] rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="max-w-3xl space-y-5">
          <InfinityMark className="h-12 w-auto" animate />
          <h1 className="text-3xl sm:text-5xl font-bold font-playfair">
            CINEGENY <span className="text-[#E50914]">Academy</span>
          </h1>
          <p className="text-white/55 text-base sm:text-lg leading-relaxed">
            Everything you need to make real films with AI — from your very first shot to a
            professional, repeatable pipeline. Written, image-rich lessons with copy-and-paste prompt
            templates. Completely free with any account.
          </p>
        </div>

        {/* Featured free bootcamp banner */}
        {bootcamp && (
          <Reveal className="mt-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.08] via-white/[0.02] to-[#E50914]/[0.08] p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(212,175,55,0.4)]">
              <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-[#D4AF37]/[0.10] rounded-full blur-[100px]" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Sparkles className="h-3.5 w-3.5" /> Free · full course
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold">{bootcamp.title}</h2>
                <p className="mt-2 text-white/55 max-w-2xl leading-relaxed">{bootcamp.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/45">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {lessonCount(bootcamp)} modules</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~{Math.round(totalMinutes(bootcamp) / 60 * 10) / 10}h of reading</span>
                  <span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> 59 copyable prompts</span>
                </div>
                <Link
                  href={startHref}
                  className="group mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4D35E] text-black font-semibold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                  <GraduationCap className="h-4 w-4" />
                  {isLoggedIn ? 'Start Module 1' : 'Create free account to start'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        )}

        {/* Levels */}
        <div className="mt-14 space-y-16">
          {LEVELS.map((level, li) => (
            <Reveal key={level.id} delay={li === 0 ? 0 : 0.05}>
              <section>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center rounded-full bg-[#E50914]/15 px-3 py-1 text-xs font-semibold text-[#E50914]">
                    {level.badge}
                  </span>
                  <h2 className="text-2xl font-bold">{level.title}</h2>
                </div>
                <p className="text-white/50 leading-relaxed max-w-3xl">{level.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/40">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> {lessonCount(level)} lessons
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> ~{Math.round(totalMinutes(level) / 60 * 10) / 10}h of reading
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <PlayCircle className="h-4 w-4" /> {level.modules.length} modules
                  </span>
                </div>

                {/* Modules */}
                <div className="mt-6 space-y-6">
                  {level.modules.map((mod) => (
                    <div
                      key={mod.title}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)] transition-colors hover:border-white/[0.14]"
                    >
                      <div className="px-5 py-3.5 border-b border-white/[0.06] bg-gradient-to-r from-[#E50914]/[0.08] to-transparent">
                        <h3 className="font-semibold text-white/90">{mod.title}</h3>
                      </div>
                      <ul className="divide-y divide-white/[0.05]">
                        {mod.lessons.map((lesson, idx) => {
                          const inner = (
                            <div className="flex items-center gap-4 px-5 py-4 transition-all hover:bg-white/[0.04] hover:pl-6">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E50914]/12 text-sm font-bold text-[#E50914]">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white/90 truncate">{lesson.title}</p>
                                <p className="text-sm text-white/45 truncate">{lesson.summary}</p>
                              </div>
                              <span className="text-xs text-white/40 inline-flex items-center gap-1 shrink-0">
                                <Clock className="h-3.5 w-3.5" /> {lesson.minutes}m
                              </span>
                              {isLoggedIn ? (
                                <ArrowRight className="h-4 w-4 text-[#E50914] shrink-0 transition-transform group-hover:translate-x-0.5" />
                              ) : (
                                <Lock className="h-4 w-4 text-white/30 shrink-0" />
                              )}
                            </div>
                          )
                          return (
                            <li key={lesson.slug} className="group">
                              {isLoggedIn ? (
                                <Link href={`/academy/${level.id}/${lesson.slug}`}>{inner}</Link>
                              ) : (
                                <Link href="/register">{inner}</Link>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        {/* Sign-up gate for logged-out users */}
        {!isLoggedIn && (
          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <Lock className="h-5 w-5 text-[#E50914] shrink-0" />
            <p className="text-sm text-white/60 flex-1">
              The full course is free — you just need a free account to unlock the lessons.
            </p>
            <div className="flex gap-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#E50914] hover:bg-[#FF2D2D] text-sm font-semibold transition-colors"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center h-10 px-4 rounded-lg border border-white/15 hover:border-white/30 text-sm font-medium transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
