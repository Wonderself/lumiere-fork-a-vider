'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Lock, Check, ArrowRight, Sparkles, Film, Plus, Clock, Trash2, ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { useCreateProgress } from '@/components/create/use-create-progress'

/* ── My Films localStorage ── */
const FILMS_STORAGE_KEY = 'cinegeny-my-films'

interface UserFilm {
  id: string
  title: string
  genre: string
  createdAt: string
  completedSteps: string[]
  thumbnail: string
}

const FILM_THUMBNAILS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=225&q=80',
]

const STEP_TIMES: Record<string, string> = {
  script: '30-60 min',
  storyboard: '45-90 min',
  casting: '20-40 min',
  setups: '30-60 min',
  stills: '20-45 min',
  videos: '60-120 min',
  music: '30-60 min',
}

const FAQ_ITEMS = [
  {
    q: 'How long does it take to create a film?',
    a: 'A short film (5-10 min) typically takes 4-8 hours spread across the 7 steps. You can save progress and return anytime.',
  },
  {
    q: 'Do I need any filmmaking experience?',
    a: 'Not at all! Our AI guides you through every step. The tools are designed for complete beginners and professionals alike.',
  },
  {
    q: 'How much does it cost?',
    a: 'You only pay the actual AI token costs — 0% commission. Submitting a script to community vote costs a one-time $9 fee. Check our transparent pricing page for detailed costs per action.',
  },
  {
    q: 'Can I collaborate with others?',
    a: 'Yes! You can invite collaborators to your project (coming soon). You can also browse and purchase characters from the marketplace.',
  },
  {
    q: 'What happens after I complete all 7 steps?',
    a: 'Your film is assembled automatically. You can preview it, make final adjustments, and publish it to the CINEGENY platform for the world to see.',
  },
  {
    q: 'Can I work on multiple films at once?',
    a: 'Absolutely. You get 2 free film projects. Additional projects are available with your subscription.',
  },
]

function useMyFilms() {
  const [films, setFilms] = useState<UserFilm[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FILMS_STORAGE_KEY)
      if (saved) setFilms(JSON.parse(saved))
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  function saveFilms(next: UserFilm[]) {
    setFilms(next)
    try { localStorage.setItem(FILMS_STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function addFilm(title: string, genre: string) {
    const newFilm: UserFilm = {
      id: Date.now().toString(36),
      title,
      genre,
      createdAt: new Date().toISOString(),
      completedSteps: [],
      thumbnail: FILM_THUMBNAILS[Math.floor(Math.random() * FILM_THUMBNAILS.length)],
    }
    saveFilms([newFilm, ...films])
    return newFilm
  }

  function deleteFilm(id: string) {
    saveFilms(films.filter(f => f.id !== id))
  }

  return { films, addFilm, deleteFilm, loaded }
}

/* ── Animated golden border keyframes (injected once) ── */
const GOLDEN_KEYFRAMES = `
@keyframes goldenBorderRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
`

export default function CreatePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { completedSteps, loaded } = useCreateProgress()
  const myFilms = useMyFilms()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [showNewFilm, setShowNewFilm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newGenre, setNewGenre] = useState('Drama')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth || 340
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' })
  }

  function isStepUnlocked(stepId: string) {
    const idx = CREATE_STEPS.findIndex((s) => s.id === stepId)
    if (idx === 0) return true
    for (let i = 0; i < idx; i++) {
      if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
    }
    return true
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <style dangerouslySetInnerHTML={{ __html: GOLDEN_KEYFRAMES }} />

      {/* ── Hero ── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.04] blur-[120px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E50914]" />
            AI-Powered Film Production
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Create Your{' '}
            <span className="text-[#E50914]">Movie</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Step-by-step, we guide you from scriptwriting to publishing your film.
            Bring your vision to life with the most advanced AI technology.
          </p>

          {/* 0% commission badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <span className="text-xs text-emerald-400 font-medium">
              0% commission — you only pay actual AI token costs
            </span>
          </div>
        </div>
      </section>

      {/* ── Carousel ── */}
      <section className="relative pb-20 md:pb-28">
        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="flex gap-5 px-4 sm:px-8 lg:px-16 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {CREATE_STEPS.map((step) => {
            const unlocked = loaded ? isStepUnlocked(step.id) : step.number === 1
            const completed = completedSteps.includes(step.id)

            return (
              <Link
                key={step.id}
                href={step.href}
                data-card
                className={cn(
                  'group relative flex-shrink-0 snap-start rounded-xl overflow-hidden transition-all duration-500',
                  'w-[280px] sm:w-[320px] md:w-[340px]',
                  'hover:scale-[1.03]',
                )}
              >
                {/* Animated golden border on hover */}
                <div
                  className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, #C4A030, #FFD700, #C4A030, #B8860B, #C4A030)',
                    backgroundSize: '300% 300%',
                    animation: 'goldenBorderRotate 3s ease infinite',
                  }}
                />

                {/* Card inner */}
                <div className="relative bg-[#111] rounded-xl overflow-hidden z-20 m-[1px]">
                  {/* Image */}
                  <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                    <Image
                      src={step.unsplashImage}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="340px"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />

                    {/* Step number badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {completed ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                      ) : !unlocked ? (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <Lock className="h-3.5 w-3.5 text-white/30" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-xs font-bold text-[#E50914]">
                          {step.number}
                        </div>
                      )}
                    </div>

                    {/* Icon badge */}
                    <div className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-white/70" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E50914] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-5 line-clamp-2">
                      {step.description}
                    </p>

                    {/* CTA button */}
                    <div
                      className={cn(
                        'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                        unlocked
                          ? 'bg-[#E50914] text-white group-hover:bg-[#FF2D2D] group-hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]'
                          : 'bg-white/5 text-white/30 border border-white/[0.06]'
                      )}
                    >
                      {!unlocked && <Lock className="h-3.5 w-3.5" />}
                      {step.cta}
                      {unlocked && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {/* Publish card */}
          <div
            data-card
            className="group relative flex-shrink-0 snap-start rounded-xl overflow-hidden w-[280px] sm:w-[320px] md:w-[340px]"
          >
            <div className="relative bg-gradient-to-br from-[#E50914]/20 to-[#111] rounded-xl overflow-hidden border border-[#E50914]/20 h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center mb-5">
                <Sparkles className="h-8 w-8 text-[#E50914]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Publish Your Film</h3>
              <p className="text-sm text-white/40 mb-6 max-w-[240px]">
                Complete all 7 steps and publish your AI-generated film to the world.
              </p>
              <div className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/5 text-white/30 border border-white/[0.06]">
                <Lock className="h-3.5 w-3.5 inline mr-2" />
                Complete All Steps
              </div>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {CREATE_STEPS.map((step) => {
            const completed = completedSteps.includes(step.id)
            return (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  completed
                    ? 'bg-emerald-400 w-4'
                    : 'bg-white/15 hover:bg-white/30'
                )}
              />
            )
          })}
        </div>
      </section>

      {/* ── My Films ── */}
      <section className="px-4 sm:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Film className="h-6 w-6 text-[#E50914]" />
              My Films
              {myFilms.films.length > 0 && (
                <span className="text-sm font-normal text-white/30">({myFilms.films.length}/2 free)</span>
              )}
            </h2>
            <button
              onClick={() => setShowNewFilm(!showNewFilm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#E50914] text-white hover:bg-[#FF2D2D] transition-all duration-200 hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]"
            >
              <Plus className="h-4 w-4" />
              New Film
            </button>
          </div>

          {/* New film form */}
          {showNewFilm && (
            <div className="mb-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Start a new project</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Film title..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                />
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 focus:outline-none focus:border-[#E50914]/40 transition-colors appearance-none cursor-pointer"
                >
                  {['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Sci-Fi', 'Romance', 'Documentary', 'Animation', 'Fantasy'].map(g => (
                    <option key={g} value={g} className="bg-[#1a1a1a]">{g}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (!newTitle.trim()) return
                    myFilms.addFilm(newTitle.trim(), newGenre)
                    setNewTitle('')
                    setShowNewFilm(false)
                  }}
                  disabled={!newTitle.trim()}
                  className={cn(
                    'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                    newTitle.trim()
                      ? 'bg-[#E50914] text-white hover:bg-[#FF2D2D]'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  )}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Films grid */}
          {myFilms.loaded && myFilms.films.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-12 text-center">
              <Film className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-white/40 mb-2">No films yet</h3>
              <p className="text-sm text-white/25 max-w-md mx-auto mb-6">
                Start your first AI film project. You get 2 free films to create with all tools included.
              </p>
              <button
                onClick={() => setShowNewFilm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#E50914] text-white hover:bg-[#FF2D2D] transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Your First Film
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myFilms.films.map((film) => {
                const progress = Math.round((film.completedSteps.length / CREATE_STEPS.length) * 100)
                return (
                  <div
                    key={film.id}
                    className="group rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={film.thumbnail}
                        alt={film.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/60 border border-white/10">
                        {film.genre}
                      </span>
                      <button
                        onClick={() => myFilms.deleteFilm(film.id)}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-white mb-1 truncate">{film.title}</h4>
                      <p className="text-[10px] text-white/30 mb-3">
                        Created {new Date(film.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 shrink-0">{progress}%</span>
                      </div>
                      <Link
                        href="/create/script"
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-[#E50914] text-white hover:bg-[#FF2D2D] transition-all"
                      >
                        Continue
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Estimated Times ── */}
      <section className="px-4 sm:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-bold text-white/80 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/40" />
            Estimated Time Per Step
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CREATE_STEPS.map((step) => {
              const completed = completedSteps.includes(step.id)
              return (
                <div
                  key={step.id}
                  className={cn(
                    'p-4 rounded-xl border text-center transition-all duration-300',
                    completed
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2',
                    completed ? 'bg-emerald-500/10' : 'bg-white/[0.04]'
                  )}>
                    {completed ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <step.icon className="h-4 w-4 text-white/30" />
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-white/60 mb-0.5">{step.shortTitle}</p>
                  <p className="text-[10px] text-white/30">{STEP_TIMES[step.id]}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-white/20 text-center mt-4">
            Total estimated time: 4-8 hours for a complete short film
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 sm:px-8 lg:px-16 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-white/80 mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-white/40" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-medium text-white/70">{item.q}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-white/30 shrink-0 ml-4 transition-transform duration-200',
                    openFaq === i && 'rotate-180'
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-0">
                    <p className="text-xs text-white/40 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
