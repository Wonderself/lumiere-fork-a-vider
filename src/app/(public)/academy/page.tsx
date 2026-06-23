import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { LEVELS, totalMinutes, lessonCount } from '@/content/academy'
import { Clock, BookOpen, Lock, ArrowRight, PlayCircle } from 'lucide-react'
import { InfinityMark } from '@/components/brand/infinity-mark'

export const metadata: Metadata = {
  title: 'Academy — Learn AI Filmmaking | CINEGENY',
  description:
    'A free, in-depth course on making films with AI: shot choice, art direction, image sequencing, advanced prompting, consistency, grading, VFX and a professional pipeline.',
}

export default async function AcademyPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="max-w-3xl space-y-5">
          <InfinityMark className="h-12 w-auto" animate />
          <h1 className="text-3xl sm:text-5xl font-bold font-playfair">
            CINEGENY <span className="text-[#E50914]">Academy</span>
          </h1>
          <p className="text-white/55 text-base sm:text-lg leading-relaxed">
            Everything you need to make real films with AI — from your very first shot to a
            professional, repeatable pipeline. Written, image-rich lessons. Completely free with any
            account.
          </p>

          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
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

        {/* Levels */}
        <div className="mt-14 space-y-14">
          {LEVELS.map((level) => (
            <section key={level.id}>
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
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
                  >
                    <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                      <h3 className="font-semibold text-white/90">{mod.title}</h3>
                    </div>
                    <ul className="divide-y divide-white/[0.05]">
                      {mod.lessons.map((lesson) => {
                        const inner = (
                          <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white/90 truncate">{lesson.title}</p>
                              <p className="text-sm text-white/45 truncate">{lesson.summary}</p>
                            </div>
                            <span className="text-xs text-white/40 inline-flex items-center gap-1 shrink-0">
                              <Clock className="h-3.5 w-3.5" /> {lesson.minutes}m
                            </span>
                            {isLoggedIn ? (
                              <ArrowRight className="h-4 w-4 text-[#E50914] shrink-0" />
                            ) : (
                              <Lock className="h-4 w-4 text-white/30 shrink-0" />
                            )}
                          </div>
                        )
                        return (
                          <li key={lesson.slug}>
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
          ))}
        </div>
      </div>
    </div>
  )
}
