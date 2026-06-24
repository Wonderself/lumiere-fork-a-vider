import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { getLesson } from '@/content/academy'
import { BlockRenderer } from '@/components/academy/block-renderer'
import { ShareButtons } from '@/components/shared/share-buttons'
import { Clock, ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react'

interface Params {
  params: Promise<{ level: string; slug: string }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { level, slug } = await params
  const found = getLesson(level, slug)
  if (!found) return { title: 'Academy — CINEGENY' }
  return {
    title: `${found.lesson.title} — CINEGENY Academy`,
    description: found.lesson.summary,
  }
}

export default async function LessonPage({ params }: Params) {
  const { level, slug } = await params
  const session = await auth()
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/academy/${level}/${slug}`)
  }

  const found = getLesson(level, slug)
  if (!found) notFound()
  const { level: lvl, module: mod, lesson } = found

  // Flat list for prev/next within the level
  const flat = lvl.modules.flatMap((m) => m.lessons)
  const idx = flat.findIndex((l) => l.slug === slug)
  const prev = idx > 0 ? flat[idx - 1] : null
  const next = idx < flat.length - 1 ? flat[idx + 1] : null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/academy" className="inline-flex items-center gap-1.5 hover:text-white/70 transition-colors">
            <GraduationCap className="h-4 w-4" /> Academy
          </Link>
          <span>/</span>
          <span className="text-[#E50914]">{lvl.badge}</span>
        </div>

        {/* Header */}
        <p className="text-sm text-white/40">{mod.title}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-playfair leading-tight">{lesson.title}</h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {lesson.minutes} min read
          </span>
          <ShareButtons compact url={`/academy/${lvl.id}/${slug}`} title={lesson.title} description={lesson.summary} />
        </div>
        <p className="mt-5 text-lg text-white/60 leading-relaxed">{lesson.summary}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Body */}
        <article>
          <BlockRenderer blocks={lesson.body} />
        </article>

        {/* Prev / Next */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/academy/${lvl.id}/${prev.slug}`}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 hover:border-white/20 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </span>
              <p className="mt-1 font-medium text-white/80 group-hover:text-white">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/academy/${lvl.id}/${next.slug}`}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 hover:border-[#E50914]/30 transition-colors text-right"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-1 font-medium text-white/80 group-hover:text-white">{next.title}</p>
            </Link>
          ) : (
            <Link
              href="/academy"
              className="group rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.06] p-4 hover:border-[#E50914]/40 transition-colors text-right"
            >
              <span className="text-xs text-white/40">You finished {lvl.badge} 🎬</span>
              <p className="mt-1 font-medium text-[#E50914]">Back to the Academy</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
