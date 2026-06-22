'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  FileText,
  Sparkles,
  Upload,
  Brain,
  Vote,
  ArrowRight,
  Check,
  Lock,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Wand2,
  Bold,
  Italic,
  Type,
  Film,
  User,
  MessageSquare,
  ChevronsRight,
  Minus,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Constants ── */
const UNSPLASH_BG =
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&h=600&q=80'

const GENRES = [
  'Drama',
  'Comedy',
  'Action',
  'Thriller',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Documentary',
  'Animation',
  'Fantasy',
]

const HOW_IT_WORKS = [
  {
    icon: FileText,
    title: 'Write or Upload',
    description:
      'Write your screenplay directly in our editor or upload a PDF/DOCX document. Formatting is handled automatically.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description:
      'Our AI reviews your script and suggests improvements for structure, pacing, and dialogue. Included with your subscription.',
  },
  {
    icon: Vote,
    title: 'Submit or Continue',
    description:
      'Submit your script to community vote for potential funding, or continue building your own film independently.',
  },
]

const ANALYSIS_RESULTS = [
  {
    label: 'Story Structure',
    description: 'Three-act structure, plot points, and narrative arc',
    score: 72,
    grade: 'B',
    feedback:
      'Consider strengthening the midpoint reversal. Your inciting incident is well-placed but the second act could use more tension.',
    suggestions: [
      'Add a stronger midpoint reversal around page 55-60',
      'Increase stakes progressively through Act 2',
      'Ensure your climax directly addresses the central dramatic question',
      'Consider adding a "dark night of the soul" moment before Act 3',
    ],
  },
  {
    label: 'Character Development',
    description: 'Character depth, motivation, and growth arcs',
    score: 85,
    grade: 'A',
    feedback:
      'Strong character arcs detected. The protagonist\'s motivation is clear. Consider adding more depth to supporting characters.',
    suggestions: [
      'Give the antagonist a more sympathetic backstory',
      'Ensure each supporting character has their own mini-arc',
      'Add moments of vulnerability for the protagonist in Act 2',
      'Consider a scene where the mentor figure shows weakness',
    ],
  },
  {
    label: 'Pacing',
    description: 'Scene rhythm, tension buildup, and momentum',
    score: 68,
    grade: 'C',
    feedback:
      'The opening moves quickly but scenes 3-5 may feel slow. Consider trimming exposition in the second act.',
    suggestions: [
      'Cut or combine scenes 3 and 4 to maintain momentum',
      'Add a ticking clock element to increase urgency',
      'Balance action sequences with quieter character moments',
      'Trim dialogue-heavy scenes by 15-20% in Act 2',
    ],
  },
  {
    label: 'Dialogue Quality',
    description: 'Authenticity, subtext, and character voice',
    score: 78,
    grade: 'B',
    feedback:
      'Natural-sounding dialogue with good subtext. Some exchanges in Act 2 feel too expository.',
    suggestions: [
      'Replace expository dialogue with visual storytelling where possible',
      'Give each character a unique speech pattern or verbal tic',
      'Add more subtext — let characters talk around what they really mean',
      'Read dialogue aloud to check for natural rhythm',
    ],
  },
]

const WRITING_TIPS = [
  { tip: 'Show, don\'t tell', detail: 'Use visual action and behavior instead of exposition to convey character emotions and story beats.' },
  { tip: 'Write for the screen', detail: 'Every line should describe something we can see or hear. If the camera can\'t capture it, rewrite it.' },
  { tip: 'Enter scenes late, leave early', detail: 'Cut the pleasantries. Start each scene at the last possible moment and exit before it winds down.' },
  { tip: 'Give every character a distinct voice', detail: 'Cover the character names and see if you can tell who is speaking from dialogue alone.' },
  { tip: 'Conflict drives every scene', detail: 'Every scene needs tension or conflict. If nothing is at stake, the scene likely doesn\'t belong.' },
  { tip: 'Read it aloud', detail: 'Dialogue that looks good on paper can sound unnatural spoken. Always do a read-through.' },
]

const FORMATTING_BUTTONS = [
  { label: 'Bold', icon: Bold, insert: '**text**' },
  { label: 'Italic', icon: Italic, insert: '_text_' },
  { label: 'UPPER', icon: Type, insert: 'UPPERCASE' },
  { label: 'Scene', icon: Film, insert: '\nINT./EXT. LOCATION - DAY/NIGHT\n\n' },
  { label: 'Character', icon: User, insert: '\n                    CHARACTER NAME\n' },
  { label: 'Paren', icon: Minus, insert: '          (parenthetical)\n' },
  { label: 'Dialogue', icon: MessageSquare, insert: '     Dialogue goes here.\n' },
  { label: 'Transition', icon: ChevronsRight, insert: '\n                                                      CUT TO:\n\n' },
]

const AUTOSAVE_KEY = 'cinegen-script-draft'

/* ── Helper: letter grade color ── */
function gradeColor(grade: string) {
  if (grade === 'A') return 'text-emerald-400'
  if (grade === 'B') return 'text-blue-400'
  if (grade === 'C') return 'text-amber-400'
  return 'text-red-400'
}

function scoreBarColor(score: number) {
  if (score >= 80) return 'from-emerald-500 to-emerald-400'
  if (score >= 70) return 'from-blue-500 to-blue-400'
  if (score >= 60) return 'from-amber-500 to-amber-400'
  return 'from-red-500 to-red-400'
}

/* ── Locked overlay component ── */
function LockedOverlay() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
      <div className="text-center px-6">
        <Lock className="h-8 w-8 text-white/30 mx-auto mb-3" />
        <p className="text-sm text-white/40 font-medium">Complete previous steps to unlock</p>
      </div>
    </div>
  )
}

/* ── Animated score bar ── */
function AnimatedScore({ score, grade, delay }: { score: number; grade: string; delay: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0
      const interval = setInterval(() => {
        current += 1
        if (current >= score) {
          setAnimatedScore(score)
          clearInterval(interval)
        } else {
          setAnimatedScore(current)
        }
      }, 15)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [score, delay])

  return (
    <div className="flex items-center gap-3">
      <span className={cn('text-lg font-black', gradeColor(grade))}>{grade}</span>
      <span className="text-sm font-bold text-white/80">{animatedScore}%</span>
    </div>
  )
}

/* ── Main page ── */
export default function ScriptPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()

  const [activeTab, setActiveTab] = useState<'write' | 'upload'>('write')
  const [scriptText, setScriptText] = useState('')
  const [scriptTitle, setScriptTitle] = useState('')
  const [logline, setLogline] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [expandedSuggestions, setExpandedSuggestions] = useState<Record<string, boolean>>({})
  const [dragOver, setDragOver] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const [uploadToast, setUploadToast] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stepUnlocked = isStepUnlocked('script', CREATE_STEPS)

  /* ── Load draft from localStorage on mount ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.scriptText) setScriptText(draft.scriptText)
        if (draft.scriptTitle) setScriptTitle(draft.scriptTitle)
        if (draft.logline) setLogline(draft.logline)
        if (draft.selectedGenres) setSelectedGenres(draft.selectedGenres)
        setAutoSaveStatus('saved')
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  /* ── Auto-save with 1.5s debounce ── */
  useEffect(() => {
    if (!loaded) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)

    setAutoSaveStatus('saving')
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          AUTOSAVE_KEY,
          JSON.stringify({ scriptText, scriptTitle, logline, selectedGenres })
        )
        setAutoSaveStatus('saved')
      } catch {
        setAutoSaveStatus('idle')
      }
    }, 1500)

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [scriptText, scriptTitle, logline, selectedGenres, loaded])

  /* ── Computed stats ── */
  const wordCount = scriptText.split(/\s+/).filter(Boolean).length
  const pageEstimate = Math.max(1, Math.round(wordCount / 250))
  const screenTimeMin = pageEstimate

  const sceneCount = useCallback(() => {
    const matches = scriptText.match(/^(INT\.|EXT\.|INT\/EXT\.)/gim)
    return matches ? matches.length : 0
  }, [scriptText])

  /* ── Genre toggle ── */
  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) return prev.filter((g) => g !== genre)
      if (prev.length >= 3) return prev
      return [...prev, genre]
    })
  }, [])

  /* ── Formatting toolbar insert ── */
  const insertFormatting = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = scriptText.slice(0, start)
    const after = scriptText.slice(end)
    const newText = before + text + after
    setScriptText(newText)
    // Focus and set cursor after inserted text
    setTimeout(() => {
      textarea.focus()
      const cursorPos = start + text.length
      textarea.setSelectionRange(cursorPos, cursorPos)
    }, 0)
  }, [scriptText])

  /* ── File upload handler ── */
  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile({ name: file.name, size: file.size })
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (ext === 'txt') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setScriptText(content)
        setActiveTab('write')
      }
      reader.readAsText(file)
    } else if (ext === 'pdf' || ext === 'docx' || ext === 'fdx') {
      setUploadToast(`${ext.toUpperCase()} parsing will use AI — coming soon`)
      setTimeout(() => setUploadToast(''), 4000)
    }
  }, [])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  /* ── AI Analysis with animated progress ── */
  const handleAnalyze = useCallback(() => {
    if (!stepUnlocked) return
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setAnalysisProgress(0)

    // Animate progress bar over ~3.5 seconds
    const steps = [
      { progress: 15, delay: 300 },
      { progress: 35, delay: 800 },
      { progress: 55, delay: 1400 },
      { progress: 72, delay: 2000 },
      { progress: 88, delay: 2600 },
      { progress: 95, delay: 3000 },
      { progress: 100, delay: 3400 },
    ]

    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setAnalysisProgress(progress), delay)
    })

    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3600)
  }, [stepUnlocked])

  /* ── Toggle suggestion panel ── */
  const toggleSuggestion = useCallback((label: string) => {
    setExpandedSuggestions((prev) => ({ ...prev, [label]: !prev[label] }))
  }, [])

  /* ── Overall score ── */
  const overallScore = Math.round(
    ANALYSIS_RESULTS.reduce((sum, r) => sum + r.score, 0) / ANALYSIS_RESULTS.length
  )
  const overallGrade = overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 60 ? 'C' : 'D'

  if (!loaded) return null

  return (
    <CreateLayout
      currentStepId="script"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('script')}
    >
      {/* ── HERO SECTION ── */}
      <section className="relative rounded-2xl overflow-hidden mb-12">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={UNSPLASH_BG}
            alt="Scriptwriting"
            fill
            className="object-cover opacity-20"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
        </div>

        <div className="relative px-6 sm:px-10 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E50914]" />
            Step 1 of {CREATE_STEPS.length}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#E50914]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Write Your <span className="text-[#E50914]">Script</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Every great film starts with a great script. Write your screenplay directly,
            upload an existing document, or let AI help you polish your story to perfection.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-white/40" />
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={item.title}
              className="group relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <span className="text-xs font-bold text-white/20">STEP {i + 1}</span>
              </div>
              <h3 className="text-sm font-semibold text-white/90 mb-2">{item.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCRIPT EDITOR SECTION ── */}
      <section className="relative mb-12">
        {!stepUnlocked && <LockedOverlay />}

        <div className={cn('rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden', !stepUnlocked && 'opacity-40 blur-[2px]')}>
          {/* Tab bar */}
          <div className="flex border-b border-white/[0.06]">
            <button
              onClick={() => setActiveTab('write')}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2',
                activeTab === 'write'
                  ? 'text-[#E50914] border-[#E50914] bg-[#E50914]/[0.04]'
                  : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/[0.02]'
              )}
            >
              <FileText className="h-4 w-4" />
              Write Script
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2',
                activeTab === 'upload'
                  ? 'text-[#E50914] border-[#E50914] bg-[#E50914]/[0.04]'
                  : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/[0.02]'
              )}
            >
              <Upload className="h-4 w-4" />
              Upload Script
            </button>
          </div>

          {/* Write tab */}
          {activeTab === 'write' && (
            <div className="p-6">
              {/* Title input */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Script Title
                </label>
                <input
                  type="text"
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                  placeholder="Untitled Screenplay"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all"
                />
              </div>

              {/* Logline input */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Logline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={logline}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) setLogline(e.target.value)
                    }}
                    placeholder="A one-sentence summary of your story..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all"
                  />
                  <span
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono',
                      logline.length >= 200 ? 'text-[#E50914]' : 'text-white/25'
                    )}
                  >
                    {logline.length}/200
                  </span>
                </div>
              </div>

              {/* Genre selector */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Genre <span className="text-white/20 normal-case">(select up to 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => {
                    const isSelected = selectedGenres.includes(genre)
                    return (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                          isSelected
                            ? 'bg-[#E50914] border-[#E50914] text-white'
                            : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-white/[0.15] hover:text-white/70'
                        )}
                      >
                        {genre}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Formatting toolbar */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Screenplay
                </label>
                <div className="flex flex-wrap items-center gap-1 bg-white/[0.03] border border-white/[0.08] border-b-0 rounded-t-lg px-2 py-1.5">
                  {FORMATTING_BUTTONS.map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => insertFormatting(btn.insert)}
                      title={btn.label}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-150"
                    >
                      <btn.icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{btn.label}</span>
                    </button>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder={`FADE IN:\n\nEXT. CITY STREET - NIGHT\n\nRain hammers the asphalt. A lone figure emerges from the shadows...\n\n                    CHARACTER\n          (whispering)\n     This is where it all begins.`}
                  rows={18}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-b-lg px-5 py-4 text-sm text-white/90 font-mono leading-relaxed placeholder:text-white/15 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all resize-y min-h-[300px]"
                />
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/30">
                <span>
                  {scriptText.length.toLocaleString()} characters
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>
                  {wordCount.toLocaleString()} words
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span className="flex items-center gap-1">
                  {sceneCount()} scenes detected
                  {sceneCount() > 0 && <Check className="h-3 w-3 text-emerald-400" />}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>
                  ~{pageEstimate} {pageEstimate === 1 ? 'page' : 'pages'} (est. {screenTimeMin} min screen time)
                </span>
                <span className="w-px h-3 bg-white/10" />
                {/* Auto-save indicator */}
                <span className="flex items-center gap-1.5">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-400/70">Saving...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400/70">Saved</span>
                    </>
                  )}
                  {autoSaveStatus === 'idle' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span>Draft</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Upload tab */}
          {activeTab === 'upload' && (
            <div className="p-6">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.fdx"
                onChange={handleFileInput}
                className="hidden"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer',
                  dragOver
                    ? 'border-[#E50914]/50 bg-[#E50914]/[0.04]'
                    : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
                )}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
                  <Upload className="h-7 w-7 text-white/30" />
                </div>
                <h3 className="text-base font-semibold text-white/80 mb-2">
                  Drag & drop your script here
                </h3>
                <p className="text-sm text-white/35 mb-5">
                  Supports PDF, DOCX, FDX, and plain text files (max 10 MB)
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/[0.06] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
                >
                  <Upload className="h-4 w-4" />
                  Browse Files
                </button>
              </div>

              {/* Uploaded file info */}
              {uploadedFile && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <FileText className="h-5 w-5 text-[#E50914]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-white/30">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                </div>
              )}

              {/* Upload toast */}
              {uploadToast && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {uploadToast}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── AI ANALYSIS SECTION ── */}
      <section className="relative mb-12">
        {!stepUnlocked && <LockedOverlay />}

        <div className={cn(!stepUnlocked && 'opacity-40 blur-[2px]')}>
          <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
            <Brain className="h-5 w-5 text-white/40" />
            AI Script Analysis
          </h2>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Info header */}
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="h-4 w-4 text-[#E50914]" />
                    <h3 className="text-sm font-semibold text-white/90">Nano Banana AI Analysis</h3>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed max-w-lg">
                    Our AI engine analyzes your screenplay for story structure, character development,
                    pacing, and dialogue quality. Receive actionable feedback to strengthen your script
                    before moving to production.
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || scriptText.length < 50}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 shrink-0',
                    isAnalyzing
                      ? 'bg-[#E50914]/30 text-white/50 cursor-wait'
                      : scriptText.length < 50
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-[#E50914] text-white hover:bg-[#FF2D2D] hover:shadow-[0_0_24px_rgba(229,9,20,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>

              {/* Token cost notice */}
              <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                <AlertCircle className="h-3.5 w-3.5" />
                <span><strong className="text-white/50">Included</strong> with subscription</span>
              </div>

              {/* Animated progress bar during analysis */}
              {isAnalyzing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Analyzing screenplay...</span>
                    <span className="text-xs text-white/40 font-mono">{analysisProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF6B6B] transition-all duration-500 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-white/25">
                    <span className={analysisProgress >= 15 ? 'text-white/50' : ''}>Parsing structure</span>
                    <span className={analysisProgress >= 40 ? 'text-white/50' : ''}>Evaluating characters</span>
                    <span className={analysisProgress >= 65 ? 'text-white/50' : ''}>Checking pacing</span>
                    <span className={analysisProgress >= 90 ? 'text-white/50' : ''}>Scoring dialogue</span>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis results area */}
            <div className="p-6">
              {analysisComplete ? (
                <div>
                  {/* Overall score summary */}
                  <div className="mb-6 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col items-center justify-center">
                        <span className={cn('text-2xl font-black', gradeColor(overallGrade))}>{overallGrade}</span>
                        <span className="text-[10px] font-bold text-white/30">GRADE</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-bold text-white/90">Overall Script Score</h4>
                          <span className="text-lg font-black text-white/80">{overallScore}%</span>
                        </div>
                        <p className="text-xs text-white/40">
                          Your script shows promise with strong character work. Focus on tightening pacing
                          and reinforcing story structure to elevate it further.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ANALYSIS_RESULTS.map((cat, idx) => (
                      <div
                        key={cat.label}
                        className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.1] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white/80">{cat.label}</h4>
                          <AnimatedScore score={cat.score} grade={cat.grade} delay={idx * 200} />
                        </div>

                        <p className="text-xs text-white/35 leading-relaxed mb-1">{cat.description}</p>

                        {/* Score bar */}
                        <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                          <div
                            className={cn(
                              'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                              scoreBarColor(cat.score)
                            )}
                            style={{
                              width: `${cat.score}%`,
                              transitionDelay: `${idx * 200}ms`,
                            }}
                          />
                        </div>

                        {/* Feedback text */}
                        <p className="text-xs text-white/50 leading-relaxed mb-3">{cat.feedback}</p>

                        {/* Expandable suggestions */}
                        <button
                          onClick={() => toggleSuggestion(cat.label)}
                          className="flex items-center gap-1 text-[11px] font-medium text-[#E50914]/80 hover:text-[#E50914] transition-colors"
                        >
                          <ChevronDown
                            className={cn(
                              'h-3 w-3 transition-transform duration-200',
                              expandedSuggestions[cat.label] ? 'rotate-180' : ''
                            )}
                          />
                          Suggestions ({cat.suggestions.length})
                        </button>
                        {expandedSuggestions[cat.label] && (
                          <div className="mt-2 space-y-1.5 pl-1">
                            {cat.suggestions.map((s, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-[11px] text-white/40 leading-relaxed"
                              >
                                <span className="text-[#E50914] mt-0.5 shrink-0">&#8226;</span>
                                {s}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : !isAnalyzing ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="h-6 w-6 text-white/15" />
                  </div>
                  <h4 className="text-sm font-medium text-white/30 mb-1">No Analysis Yet</h4>
                  <p className="text-xs text-white/20 max-w-sm mx-auto">
                    Write at least 50 characters, then click &ldquo;Analyze with AI&rdquo; to receive
                    detailed feedback on story structure, character development, pacing, and dialogue quality.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMISSION OPTIONS ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-white/40" />
          Choose Your Path
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Path A: Community Vote */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-[#E50914]/30 hover:bg-[#E50914]/[0.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                <Vote className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90">Submit to Community Vote</h3>
                <p className="text-[11px] text-white/30">Path A</p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-5">
              Submit your script for community review. If approved, your project may receive
              funding and collaborative support from the CINEGENY community. Great scripts
              get visibility and resources.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Submission fee: <strong className="text-white/40">$9</strong>
              </span>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#E50914]/15 text-[#E50914] hover:bg-[#E50914]/25 transition-all duration-200 group-hover:translate-x-0.5">
                Submit for Vote
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Path B: Make Your Own */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white/50" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90">Make Your Own Film</h3>
                <p className="text-[11px] text-white/30">Path B</p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-5">
              Skip the community vote and proceed directly to storyboarding. You retain
              full creative control with all AI tools included in your subscription.
              Perfect for personal projects.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Included with subscription
              </span>
              <Link
                href="/create/storyboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-200 group-hover:translate-x-0.5"
              >
                Continue to Storyboard
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WRITING TIPS ── */}
      <section className="mb-4">
        <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-white/40" />
          Screenwriting Tips
        </h2>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {WRITING_TIPS.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 hover:bg-white/[0.02] transition-colors duration-200"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-xs font-bold text-[#E50914]">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">{item.tip}</h4>
                  <p className="text-xs text-white/35 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
