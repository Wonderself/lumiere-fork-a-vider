'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionDiv,
  MotionSection,
  MotionCard,
  MotionList,
  MotionItem,
  fadeInUp,
  fadeIn,
  staggerContainer,
  staggerContainerSlow,
} from '@/components/ui/motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

/* ============================================================
   CONSTANTS & DATA
   ============================================================ */

const COLORS = {
  bg: '#0A0A0A',
  red: '#E50914',
  redLight: '#FF2D2D',
  gold: '#D4AF37',
  goldLight: '#F4D35E',
  white: '#FFFFFF',
  gray: '#A0A0A0',
  darkGray: '#1A1A1A',
  cardBg: 'rgba(255,255,255,0.03)',
}

const PHASES = [
  {
    id: 1,
    name: 'Family & Friends',
    subtitle: 'SAFE — Founders\' circle',
    tokenPrice: 0.05,
    discount: 50,
    raiseTarget: 50000,
    tokensAllocated: 1000000,
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-05-31T23:59:59'),
    status: 'ACTIVE' as const,
    perks: ['SAFE with a 50% discount on the next round', 'Earliest access', 'Maximum upside', 'Monthly calls with the founders'],
    color: COLORS.gold,
    raisedSoFar: 0,
  },
  {
    id: 2,
    name: 'Pre-Seed',
    subtitle: 'Strategic investors',
    tokenPrice: 0.08,
    discount: 20,
    raiseTarget: 200000,
    tokensAllocated: 2500000,
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-07-31T23:59:59'),
    status: 'UPCOMING' as const,
    perks: ['Governance rights', 'Quarterly reports', 'Platform beta access', 'Event invitations'],
    color: COLORS.red,
    raisedSoFar: 0,
  },
  {
    id: 3,
    name: 'Seed',
    subtitle: 'Accelerated growth — Fall',
    tokenPrice: 0.10,
    discount: 0,
    raiseTarget: 500000,
    tokensAllocated: 5000000,
    startDate: new Date('2026-08-01'),
    endDate: new Date('2026-09-30T23:59:59'),
    status: 'UPCOMING' as const,
    perks: ['Revenue share', 'Full platform access', 'Token liquidity post-lockup', 'Co-branding opportunities'],
    color: '#4A90D9',
    raisedSoFar: 0,
  },
]

const TOKENOMICS_SLICES = [
  { label: 'Public sale (Phases)', pct: 30, color: COLORS.red },
  { label: 'Team & Founders', pct: 25, color: COLORS.gold },
  { label: 'Treasury & Operations', pct: 20, color: '#4A90D9' },
  { label: 'Grants & Ecosystem', pct: 15, color: '#2ECC71' },
  { label: 'Advisors & Partners', pct: 10, color: '#9B59B6' },
]

const PIPELINE_PROJECTS = [
  {
    num: 1,
    title: 'MERCI',
    subtitle: 'The Miracle Protocol',
    genre: 'Docu-series',
    format: '4x52\'',
    status: 'Development',
    financing: 'CNC, CIR, Fondation Shoah, Coprod Jessica Philippe',
    pitch: 'October 7 told through miracles and human resilience.',
    color: COLORS.red,
  },
  {
    num: 2,
    title: 'KETER',
    subtitle: 'The Singularity Point',
    genre: 'Thriller Sci-Fi',
    format: 'Feature film',
    status: 'Writing',
    financing: 'BPI Deeptech, IIA R&D, CNC',
    pitch: '"Nolan meets Zohar" — when AI reaches consciousness, Kabbalah had the answer.',
    color: '#4A90D9',
  },
  {
    num: 3,
    title: 'LE CODE D\'ESTHER',
    subtitle: 'Docu-fiction',
    genre: 'Docu-fiction',
    format: 'Feature film',
    status: 'Rights acquired',
    financing: 'CNC, Creative Europe, French Judaism Foundation',
    pitch: 'Adaptation of the best-seller. The Jewish Da Vinci Code.',
    color: COLORS.gold,
  },
  {
    num: 4,
    title: 'ZION OF AFRICA',
    subtitle: 'Historical documentary',
    genre: 'Documentary',
    format: 'Series 6x52\'',
    status: 'Research',
    financing: 'AFD, Creative Europe, Eurimages, World Cinema Fund',
    pitch: 'The forgotten Jewish tribes of Africa — a little-known odyssey.',
    color: '#2ECC71',
  },
  {
    num: 5,
    title: 'LE DERNIER CONVOI',
    subtitle: 'Film / Docu-drama',
    genre: 'Docu-drama',
    format: 'Feature film',
    status: 'Development',
    financing: 'Shoah Foundation, Claims Conference, CNC, Kev Adams connection',
    pitch: 'The Holocaust in North Africa — the untold story.',
    color: '#E67E22',
  },
  {
    num: 6,
    title: 'CARNAVAL',
    subtitle: 'Bad Trip',
    genre: 'Short film',
    format: '15\'',
    status: 'READY TO PRODUCE',
    financing: 'Self-funded + CNC short film',
    pitch: 'VFX technology demo — script locked, crew confirmed.',
    color: '#E50914',
  },
  {
    num: 7,
    title: 'NA NAH NAHMA',
    subtitle: 'Docu-series',
    genre: 'Documentary',
    format: 'Series 4x52\'',
    status: 'Research',
    financing: 'Jewish Story Partners, Fondation Rothschild',
    pitch: 'Rabbi Nachman and the philosophy of happiness — ancient wisdom, modern resonance.',
    color: '#9B59B6',
  },
  {
    num: 8,
    title: 'ORTISTES',
    subtitle: 'The Gift',
    genre: 'Animated mini-series',
    format: '8x26\'',
    status: 'Concept',
    financing: 'Fondation Autisme, AGEFIPH, CNC Animation',
    pitch: 'Autistic artists — social innovation and a celebration of neurodiversity.',
    color: '#1ABC9C',
  },
]

const GRANTS_DATA = {
  israel: [
    { name: 'IIA Tnufa (Ideation)', organism: 'Israel Innovation Authority', maxAmount: '60K€', eligibility: '85% of approved budget', status: 'NOT_STARTED' },
    { name: 'IIA Startup Fund Seed', organism: 'Israel Innovation Authority', maxAmount: '1.25M€', eligibility: '50% matching', status: 'NOT_STARTED' },
    { name: 'IIA R&D Fund / National AI Program', organism: 'Israel Innovation Authority', maxAmount: 'Variable', eligibility: '20-50%', status: 'NOT_STARTED' },
    { name: 'JDA Jnext Employment', organism: 'Jewish Agency / Jnext', maxAmount: '~$15K/employee', eligibility: 'Per qualified employee', status: 'NOT_STARTED' },
    { name: 'JDA/JFF Film Fund', organism: 'Jewish Agency / JFF', maxAmount: '500K-1M NIS', eligibility: 'Par projet', status: 'NOT_STARTED' },
    { name: 'Human Capital Fund AI', organism: 'Israeli Government', maxAmount: '7M NIS (total)', eligibility: 'Programme IA national', status: 'NOT_STARTED' },
  ],
  france: [
    { name: 'BPI Bourse French Tech', organism: 'Bpifrance', maxAmount: '90K€', eligibility: 'Deeptech', status: 'IN_PROGRESS' },
    { name: 'BPI Deeptech Development Grant', organism: 'Bpifrance', maxAmount: '2M€', eligibility: 'Validated deeptech', status: 'NOT_STARTED' },
    { name: 'BPI Digital Transition Culture & AI', organism: 'Bpifrance', maxAmount: '50% (min 400K budget)', eligibility: 'Culture + IA', status: 'NOT_STARTED' },
    { name: 'CNC Grande Fabrique de l\'Image / AMT', organism: 'CNC', maxAmount: '40-50%', eligibility: 'Innovation audiovisuelle', status: 'NOT_STARTED' },
    { name: 'CNC Development Grant', organism: 'CNC', maxAmount: 'Par projet', eligibility: 'Approved company', status: 'NOT_STARTED' },
    { name: 'CNC Short Film Grant', organism: 'CNC', maxAmount: 'Par projet', eligibility: 'Short film', status: 'NOT_STARTED' },
    { name: 'CIR (Research Tax Credit)', organism: 'French State', maxAmount: '30% of R&D spend', eligibility: 'Toute entreprise R&D', status: 'IN_PROGRESS' },
    { name: 'C2I (International Tax Credit)', organism: 'CNC / State', maxAmount: '30-40% France production', eligibility: 'International co-production', status: 'NOT_STARTED' },
    { name: 'CII (Innovation Tax Credit)', organism: 'French State', maxAmount: '20-30%', eligibility: 'PME innovante', status: 'NOT_STARTED' },
    { name: 'JEI (Jeune Entreprise Innovante)', organism: 'French State', maxAmount: 'Payroll exemptions', eligibility: '<8 ans, >15% R&D', status: 'NOT_STARTED' },
    { name: 'France 2030 Pionniers IA', organism: 'French State', maxAmount: 'Multi-millions', eligibility: 'IA souveraine', status: 'NOT_STARTED' },
    { name: 'Regions (Île-de-France, etc.)', organism: 'Regional Councils', maxAmount: '$4K-8K (writing) + production', eligibility: 'Per region', status: 'NOT_STARTED' },
  ],
  international: [
    { name: 'Creative Europe MEDIA', organism: 'European Commission', maxAmount: 'Variable', eligibility: 'EU cinema program', status: 'NOT_STARTED' },
    { name: 'Eurimages (Conseil de l\'Europe)', organism: 'Conseil de l\'Europe', maxAmount: 'Variable', eligibility: 'European co-production', status: 'NOT_STARTED' },
    { name: 'World Cinema Fund (ACM)', organism: 'ACM / CNC', maxAmount: 'Par projet', eligibility: 'Films du Sud', status: 'NOT_STARTED' },
    { name: 'FIRAD (France-Israel bilateral)', organism: 'France & Israel', maxAmount: '50% each side', eligibility: 'Bilateral R&D', status: 'NOT_STARTED' },
    { name: 'MOST-France Academic', organism: 'MOST / CNRS', maxAmount: '$80K/side (3 years)', eligibility: 'Academic research', status: 'NOT_STARTED' },
  ],
  projectSpecific: [
    { name: 'Foundation for the Memory of the Shoah', organism: 'FMS', maxAmount: 'Variable', eligibility: 'Memory projects', status: 'NOT_STARTED' },
    { name: 'Jewish Story Partners (Spielberg)', organism: 'USC / Spielberg Foundation', maxAmount: 'Variable', eligibility: 'Histoires juives', status: 'NOT_STARTED' },
    { name: 'USC Shoah Foundation', organism: 'USC', maxAmount: 'Variable', eligibility: 'Holocaust remembrance', status: 'NOT_STARTED' },
    { name: 'French Judaism Foundation', organism: 'FJF', maxAmount: 'Variable', eligibility: 'Culture juive', status: 'NOT_STARTED' },
    { name: 'Fondation Rothschild', organism: 'Rothschild', maxAmount: 'Variable', eligibility: 'Culture & Education', status: 'NOT_STARTED' },
    { name: 'Claims Conference', organism: 'Claims Conference', maxAmount: 'Variable', eligibility: 'Holocaust remembrance', status: 'NOT_STARTED' },
    { name: 'Fondation Autisme / AGEFIPH', organism: 'French State', maxAmount: 'Variable', eligibility: 'Handicap & Inclusion', status: 'NOT_STARTED' },
    { name: 'AFD (French Development Agency)', organism: 'AFD', maxAmount: 'Variable', eligibility: 'Development & Culture', status: 'NOT_STARTED' },
  ],
}

const ROADMAP_PHASES = [
  {
    phase: 'Phase 1',
    period: 'M1 — M6',
    title: 'Foundation',
    items: [
      'Legal structuring (Israeli Ltd + SAS)',
      'Family & Friends round ($50K)',
      'BPI / Tnufa applications',
      'Production of the short film Carnaval',
      'MVP plateforme CINEGENY',
    ],
    color: COLORS.gold,
  },
  {
    phase: 'Phase 2',
    period: 'M6 — M12',
    title: 'Validation',
    items: [
      'Pre-Seed round ($200K)',
      'First pilot film (Merci)',
      'API v1 — production pipeline',
      'CNC applications',
      'First Service revenue',
    ],
    color: COLORS.red,
  },
  {
    phase: 'Phase 3',
    period: 'M12 — M18',
    title: 'Acceleration',
    items: [
      'Seed round ($500K)',
      'Scale up the team',
      'C2I activation',
      'Full R&D team in Jerusalem',
      'Complete production software',
    ],
    color: '#4A90D9',
  },
  {
    phase: 'Phase 4',
    period: 'M18 — M24',
    title: 'Expansion',
    items: [
      'Series A target ($15-17M valuation)',
      '3 films in parallel production',
      'International distribution',
      'Delaware C-Corp pour US',
      'Token public listing',
    ],
    color: '#2ECC71',
  },
]

const COMPETITIVE_TABLE = {
  headers: ['Criterion', 'CINEGENY', 'Hollywood', 'Netflix', 'Traditional Studio'],
  rows: [
    ['Average budget / film', '50K-200K€', '50-200M€', '10-30M€', '1-5M€'],
    ['Production time', '3-6 mois', '18-36 mois', '12-24 mois', '12-18 mois'],
    ['AI usage', '90%+ pipeline', '< 5%', '~15% post-prod', '~5%'],
    ['Community participation', 'Token governance', 'None', 'None', 'None'],
    ['Revenue sharing', '25% aux holders', '0%', '0%', '0%'],
    ['Blockchain / Web3', 'Token CINE natif', 'No', 'No', 'No'],
    ['Marginal cost /10', 'Yes (AI)', 'No', 'Partially', 'No'],
    ['Grant leverage', 'x2.5', 'Not applicable', 'No', 'Partially'],
  ],
}

/* ============================================================
   UTILITY COMPONENTS
   ============================================================ */

function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-8 md:py-12">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E50914]/50" />
      <div className="mx-4 w-2 h-2 rotate-45 bg-[#E50914]/60" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E50914]/50" />
    </div>
  )
}

function SectionTitle({ badge, title, subtitle, gold = false }: { badge?: string; title: string; subtitle?: string; gold?: boolean }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="text-center mb-12 md:mb-16"
    >
      {badge && (
        <Badge className={`mb-4 ${gold ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]' : ''}`}>
          {badge}
        </Badge>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
        gold
          ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4D35E] to-[#D4AF37] bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent'
      }`}>
        {title}
      </h2>
      {subtitle && <p className="text-white/50 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>}
    </MotionDiv>
  )
}

function GlowCard({ children, className = '', gold = false, delay = 0 }: { children: React.ReactNode; className?: string; gold?: boolean; delay?: number }) {
  return (
    <MotionCard delay={delay}>
      <div className={`relative rounded-xl border p-6 md:p-8 overflow-hidden ${
        gold
          ? 'border-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent'
          : 'border-white/5 bg-white/[0.02]'
      } ${className}`}>
        <div className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 ${
          gold
            ? 'bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent'
            : 'bg-gradient-to-br from-[#E50914]/[0.04] to-transparent'
        }`} />
        <div className="relative z-10">{children}</div>
      </div>
    </MotionCard>
  )
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime()
      const diff = targetDate.getTime() - now
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTimeLeft(calc())
    const interval = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-2 md:gap-3">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="bg-white/[0.06] border border-white/10 rounded-lg w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-mono font-bold text-white">
              {String(u.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] md:text-xs text-white/40 mt-1">{u.label}</span>
        </div>
      ))}
    </div>
  )
}

function PieChart({ slices }: { slices: typeof TOKENOMICS_SLICES }) {
  let cumulativePercent = 0
  const size = 200
  const radius = 80
  const center = size / 2

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent) * radius
    const y = Math.sin(2 * Math.PI * percent) * radius
    return [x, y]
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-48 md:w-56 md:h-56 mx-auto" style={{ transform: 'rotate(-90deg)' }}>
      {slices.map((slice, i) => {
        const startPercent = cumulativePercent
        cumulativePercent += slice.pct / 100
        const [startX, startY] = getCoordinatesForPercent(startPercent)
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent)
        const largeArcFlag = slice.pct > 50 ? 1 : 0
        const pathData = [
          `M ${center} ${center}`,
          `L ${center + startX} ${center + startY}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${center + endX} ${center + endY}`,
          'Z',
        ].join(' ')

        return (
          <motion.path
            key={i}
            d={pathData}
            fill={slice.color}
            opacity={0.85}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.85, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="hover:opacity-100 transition-opacity cursor-pointer"
            stroke="#0A0A0A"
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'success' | 'warning' | 'secondary' | 'default' | 'destructive' }> = {
    NOT_STARTED: { label: 'Not started', variant: 'secondary' },
    IN_PROGRESS: { label: 'In progress', variant: 'warning' },
    SUBMITTED: { label: 'Submitted', variant: 'default' },
    APPROVED: { label: 'Approved', variant: 'success' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
  }
  const s = map[status] || map.NOT_STARTED
  return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */

export default function InvestorsPage() {
  // Set document title
  useEffect(() => {
    document.title = 'Investors | CineGeny Pictures'
  }, [])

  // JSON-LD schema
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CineGeny Pictures / CINEGENY',
      description: 'The first AI-native studio — a tech company that produces films',
      url: 'https://cinegeny.studio',
      email: 'invest@cinegeny.studio',
      foundingDate: '2025',
      location: [
        { '@type': 'Place', name: 'Paris, France' },
        { '@type': 'Place', name: 'Jerusalem, Israel' },
      ],
      sameAs: [],
    })
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  // Current phase detection
  const currentPhase = useMemo(() => {
    const now = new Date()
    return PHASES.find(p => now >= p.startDate && now <= p.endDate) || PHASES[0]
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* =========================================================
          FLOATING NAV DOTS
          ========================================================= */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {['hero', 'phases', 'tokenomics', 'financials', 'leverage', 'pipeline', 'grants', 'model', 'competitive', 'roadmap', 'team', 'legal', 'risks', 'cta'].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-[#E50914] transition-colors duration-300 block"
            title={id}
          />
        ))}
      </nav>

      {/* =========================================================
          SECTION 1 — HERO
          ========================================================= */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#E50914]/[0.04] rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[180px]" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-sm px-4 py-1.5">
              Phase {currentPhase.id} — {currentPhase.name} | LIVE
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Invest in the
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E50914] via-[#FF2D2D] to-[#D4AF37] bg-clip-text text-transparent">
              Premier Studio AI-Native
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10"
          >
            <span className="text-white/80 font-medium">CineGeny Pictures</span> — the tech company that produces films.
            <br className="hidden md:block" />
            Artificial intelligence, cinema, blockchain. An unprecedented model.
          </motion.p>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12"
          >
            {[
              { value: '2M€', label: 'Valorisation', icon: '💎' },
              { value: '8', label: 'Projets en pipeline', icon: '🎬' },
              { value: 'x2.5', label: 'Effet de levier', icon: '🚀' },
              { value: 'FR-IL', label: 'Structure hybride', icon: '🌍' },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 md:p-6 backdrop-blur-sm"
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F4D35E] bg-clip-text text-transparent">
                  {m.value}
                </div>
                <div className="text-xs md:text-sm text-white/40 mt-1">{m.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" className="text-base font-semibold" onClick={() => document.getElementById('phases')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the opportunity
            </Button>
            <Button variant="outline" size="xl" className="text-base font-semibold" asChild>
              <a href="mailto:invest@cinegeny.studio">Contact the team</a>
            </Button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-6 h-10 border border-white/20 rounded-full mx-auto flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-2.5 bg-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 2 — INVESTMENT PHASES
          ========================================================= */}
      <section id="phases" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="INVESTMENT PHASES"
          title="Join the adventure"
          subtitle="Three strategic phases with progressive pricing. The earlier you invest, the greater your advantage."
        />

        {/* Timeline connector */}
        <div className="hidden lg:flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-4xl">
            {PHASES.map((phase, i) => (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      phase.status === 'ACTIVE'
                        ? 'bg-[#D4AF37] text-black ring-4 ring-[#D4AF37]/30'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {phase.id}
                  </div>
                  <span className={`text-xs mt-2 ${phase.status === 'ACTIVE' ? 'text-[#D4AF37]' : 'text-white/30'}`}>
                    {phase.name}
                  </span>
                </div>
                {i < PHASES.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    phase.status === 'ACTIVE' ? 'bg-gradient-to-r from-[#D4AF37] to-white/10' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
            {/* Post-seed indicator */}
            <div className="h-px w-8 bg-white/10 mx-4" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-white/5 text-white/30 border border-white/10">
                P
              </div>
              <span className="text-xs mt-2 text-white/30">Public</span>
            </div>
          </div>
        </div>

        {/* Phase cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {PHASES.map((phase, i) => (
            <MotionCard key={phase.id} delay={i * 0.15}>
              <div className={`relative rounded-xl overflow-hidden ${
                phase.status === 'ACTIVE'
                  ? 'border-2 border-[#D4AF37]/40 bg-gradient-to-b from-[#D4AF37]/[0.06] to-[#0A0A0A]'
                  : 'border border-white/[0.06] bg-white/[0.02]'
              }`}>
                {/* Active glow */}
                {phase.status === 'ACTIVE' && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                )}

                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/40 mb-1">Phase {phase.id}</div>
                      <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                      <p className="text-sm text-white/40">{phase.subtitle}</p>
                    </div>
                    {phase.status === 'ACTIVE' ? (
                      <Badge className="border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37] animate-pulse">
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge variant="secondary">UPCOMING</Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold" style={{ color: phase.color }}>
                        {phase.tokenPrice}€
                      </span>
                      <span className="text-sm text-white/40">/ token PRODCOIN</span>
                    </div>
                    <Badge className="border-green-500/30 bg-green-500/10 text-green-400">
                      -{phase.discount}% vs. prix public
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Raise target</span>
                      <span className="text-white font-medium">{(phase.raiseTarget).toLocaleString('fr-FR')}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Tokens allocated</span>
                      <span className="text-white font-medium">{phase.tokensAllocated.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Period</span>
                      <span className="text-white font-medium text-xs">
                        {phase.startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — {phase.endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar (active phase only) */}
                  {phase.status === 'ACTIVE' && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-white/40 mb-2">
                        <span>{phase.raisedSoFar.toLocaleString('fr-FR')} raised</span>
                        <span>{Math.round((phase.raisedSoFar / phase.raiseTarget) * 100)}%</span>
                      </div>
                      <Progress
                        value={(phase.raisedSoFar / phase.raiseTarget) * 100}
                        className="h-2.5"
                        indicatorClassName="bg-gradient-to-r from-[#D4AF37] to-[#F4D35E]"
                      />
                    </div>
                  )}

                  {/* Countdown (active phase) */}
                  {phase.status === 'ACTIVE' && (
                    <div className="mb-6">
                      <div className="text-xs text-white/40 mb-2">Time left:</div>
                      <CountdownTimer targetDate={phase.endDate} />
                    </div>
                  )}

                  {/* Perks */}
                  <div className="space-y-2">
                    <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Perks</div>
                    {phase.perks.map((perk, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5" style={{ color: phase.color }}>&#10003;</span>
                        <span className="text-white/60">{perk}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6">
                    {phase.status === 'ACTIVE' ? (
                      <Button className="w-full bg-[#D4AF37] hover:bg-[#F4D35E] text-black font-semibold" size="lg" asChild>
                        <a href="mailto:invest@cinegeny.studio?subject=Phase 1 - Family %26 Friends">
                          Invest now
                        </a>
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full" size="lg" disabled>
                        Coming soon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* Post-seed box */}
        <MotionCard delay={0.5}>
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-xl p-6 md:p-8 text-center">
            <Badge variant="secondary" className="mb-3">POST-SEED — FALL 2026</Badge>
            <h3 className="text-xl font-bold text-white mb-2">PRODCOIN public token price</h3>
            <div className="text-4xl font-bold text-white mb-2">$0.10</div>
            <p className="text-white/40 text-sm">Full platform access. No discount.</p>
          </div>
        </MotionCard>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 3 — TOKENOMICS
          ========================================================= */}
      <section id="tokenomics" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="TOKEN ECONOMICS"
          title="The PRODCOIN Token"
          subtitle="A dual token — Utility & Security — designed to align the interests of the community, creators and investors."
          gold
        />

        {/* Key token stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Supply totale', value: '20M', sub: 'PRODCOIN tokens' },
            { label: 'Type', value: 'Dual', sub: 'Utility + Security' },
            { label: 'Prix de base', value: '$0.10', sub: 'post-seed' },
            { label: 'FDV', value: '$2M', sub: 'Fully Diluted' },
          ].map((s, i) => (
            <MotionCard key={i} delay={i * 0.1}>
              <div className="bg-white/[0.03] border border-[#D4AF37]/10 rounded-xl p-5 text-center">
                <div className="text-xs text-white/40 mb-1">{s.label}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F4D35E] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-white/30 mt-1">{s.sub}</div>
              </div>
            </MotionCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Pie chart */}
          <MotionCard delay={0.2}>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6 text-center">Token distribution</h3>
              <PieChart slices={TOKENOMICS_SLICES} />
              <div className="mt-6 space-y-3">
                {TOKENOMICS_SLICES.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-white/70">{s.label}</span>
                    </div>
                    <span className="font-mono text-white/50">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionCard>

          {/* Token utility */}
          <MotionCard delay={0.35}>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6">PRODCOIN token utility</h3>
              <div className="space-y-5">
                {[
                  {
                    icon: '🗳️',
                    title: 'Gouvernance',
                    desc: 'Vote on production decisions, project selection and strategic direction.',
                  },
                  {
                    icon: '💰',
                    title: 'Revenue Share',
                    desc: '25% of film profits redistributed to token holders.',
                  },
                  {
                    icon: '⭐',
                    title: 'Premium access',
                    desc: 'Exclusive CINEGENY platform features for holders.',
                  },
                  {
                    icon: '📈',
                    title: 'Staking',
                    desc: 'Stake your tokens to reach higher tiers and greater benefits.',
                  },
                  {
                    icon: '🔄',
                    title: 'Secondary trading',
                    desc: 'Trade on the secondary market after the lockup period.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <h4 className="font-medium text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vesting note */}
              <div className="mt-8 p-4 rounded-lg bg-[#D4AF37]/[0.06] border border-[#D4AF37]/15">
                <div className="text-xs text-[#D4AF37] font-medium mb-1">TEAM & FOUNDERS VESTING</div>
                <p className="text-sm text-white/50">
                  4-year linear vesting with a 1-year cliff. Ensures long-term alignment
                  between founders and investors.
                </p>
              </div>
            </div>
          </MotionCard>
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 4 — FINANCIAL PROJECTIONS
          ========================================================= */}
      <section id="financials" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="FINANCIAL FORECAST"
          title="3-year P&L projections"
          subtitle="A hybrid Films + Tech model with growing margins thanks to AI's economies of scale."
        />

        <MotionCard delay={0.15}>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.04]">
                    <th className="text-left p-4 text-white/50 font-medium border-b border-white/[0.06]" />
                    <th className="text-right p-4 text-white font-semibold border-b border-white/[0.06]">
                      <span className="text-[#D4AF37]">Year 1</span>
                    </th>
                    <th className="text-right p-4 text-white font-semibold border-b border-white/[0.06]">
                      <span className="text-[#D4AF37]">Year 2</span>
                    </th>
                    <th className="text-right p-4 text-white font-semibold border-b border-white/[0.06]">
                      <span className="text-[#D4AF37]">Year 3</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Total revenue', y1: '900K€', y2: '3 000K€', y3: '6 400K€', bold: true, highlight: false },
                    { label: '  of which Films', y1: '800K€', y2: '2 400K€', y3: '4 000K€', bold: false, highlight: false },
                    { label: '  of which Tech (API/SaaS)', y1: '100K€', y2: '600K€', y3: '2 400K€', bold: false, highlight: false },
                    { label: 'COGS', y1: '(420K€)', y2: '(1 300K€)', y3: '(2 200K€)', bold: false, highlight: false },
                    { label: 'Gross margin', y1: '480K€ (53%)', y2: '1 700K€ (57%)', y3: '4 200K€ (65%)', bold: true, highlight: true },
                    { label: 'Operating costs', y1: '(540K€)', y2: '(980K€)', y3: '(1 450K€)', bold: false, highlight: false },
                    { label: 'EBITDA', y1: '(60K€)', y2: '720K€', y3: '2 750K€', bold: true, highlight: false },
                    { label: 'Non-dilutive financing', y1: '+500K€', y2: '+600K€', y3: '+400K€', bold: false, highlight: false },
                    { label: 'Net result', y1: '+440K€', y2: '+1 320K€', y3: '+3 150K€', bold: true, highlight: true },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${
                        row.highlight ? 'bg-[#D4AF37]/[0.03]' : ''
                      }`}
                    >
                      <td className={`p-4 text-left ${row.bold ? 'font-semibold text-white' : 'text-white/50'}`}>
                        {row.label}
                      </td>
                      <td className={`p-4 text-right font-mono ${row.bold ? 'font-semibold text-white' : 'text-white/50'} ${
                        row.highlight ? 'text-[#D4AF37]' : ''
                      }`}>{row.y1}</td>
                      <td className={`p-4 text-right font-mono ${row.bold ? 'font-semibold text-white' : 'text-white/50'} ${
                        row.highlight ? 'text-[#D4AF37]' : ''
                      }`}>{row.y2}</td>
                      <td className={`p-4 text-right font-mono ${row.bold ? 'font-semibold text-white' : 'text-white/50'} ${
                        row.highlight ? 'text-[#D4AF37]' : ''
                      }`}>{row.y3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionCard>

        {/* Revenue split visual */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { year: 'Year 1', films: 89, tech: 11, total: '900K€' },
            { year: 'Year 2', films: 80, tech: 20, total: '3 000K€' },
            { year: 'Year 3', films: 62, tech: 38, total: '6 400K€' },
          ].map((y, i) => (
            <MotionCard key={i} delay={0.1 * i}>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <div className="text-sm text-white/40 mb-1">{y.year}</div>
                <div className="text-2xl font-bold text-white mb-3">{y.total}</div>
                <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                  <div className="bg-[#E50914] rounded-l-full" style={{ width: `${y.films}%` }} />
                  <div className="bg-[#4A90D9] rounded-r-full" style={{ width: `${y.tech}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Films {y.films}%</span>
                  <span>Tech {y.tech}%</span>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 5 — LEVERAGE
          ========================================================= */}
      <section id="leverage" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="THE KEY MECHANISM"
          title="The x2.5 Leverage Effect"
          subtitle="For every $1 invested, $2.5 of production budget thanks to public grants."
          gold
        />

        {/* Leverage visual */}
        <MotionCard delay={0.15}>
          <div className="bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent border border-[#D4AF37]/15 rounded-xl p-8 md:p-12">
            {/* Flow diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-10">
              {/* Input */}
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-[#D4AF37]">1€</div>
                    <div className="text-xs text-white/40">invested</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:block">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="text-[#D4AF37] text-4xl"
                >
                  &#10230;
                </motion.div>
              </div>
              <div className="md:hidden">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="text-[#D4AF37] text-3xl"
                >
                  &#10515;
                </motion.div>
              </div>

              {/* Multiplier */}
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#E50914]/10 border border-[#E50914]/25 flex items-center justify-center mx-auto mb-3 rotate-45">
                  <div className="-rotate-45">
                    <div className="text-xl md:text-2xl font-bold text-[#E50914]">x2.5</div>
                  </div>
                </div>
                <div className="text-xs text-white/40">Grant leverage</div>
              </div>

              {/* Arrow */}
              <div className="hidden md:block">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                  className="text-[#D4AF37] text-4xl"
                >
                  &#10230;
                </motion.div>
              </div>
              <div className="md:hidden">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                  className="text-[#D4AF37] text-3xl"
                >
                  &#10515;
                </motion.div>
              </div>

              {/* Output */}
              <div className="text-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#E50914]/10 border-2 border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-3">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F4D35E] bg-clip-text text-transparent">
                      2.5€
                    </div>
                    <div className="text-xs text-white/40">prod budget</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grant sources */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { name: 'C2I', pct: '30%', desc: 'International Tax Credit' },
                { name: 'CIR', pct: '30%', desc: 'Research Tax Credit' },
                { name: 'BPI', pct: 'Variable', desc: 'Bpifrance Deeptech' },
                { name: 'CNC', pct: 'Variable', desc: 'Cinema grants' },
                { name: 'JDA', pct: 'Variable', desc: 'Jewish Agency grants' },
              ].map((g, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-[#D4AF37]">{g.name}</div>
                  <div className="text-sm text-white/60">{g.pct}</div>
                  <div className="text-[10px] text-white/30 mt-1">{g.desc}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-8 relative">
              <div className="absolute -top-3 left-4 text-5xl text-[#D4AF37]/20 font-serif">&ldquo;</div>
              <blockquote className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 pl-12 italic text-white/60">
                The money invested doesn't pay for walls — it unlocks public funds.
                Every private dollar is a catalyst for institutional financing.
              </blockquote>
            </div>
          </div>
        </MotionCard>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 6 — PIPELINE
          ========================================================= */}
      <section id="pipeline" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="CREATIVE PIPELINE"
          title="8 projects in development"
          subtitle="A diverse catalog spanning documentary, fiction and animation — all amplified by AI."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PIPELINE_PROJECTS.map((project, i) => (
            <MotionCard key={i} delay={i * 0.08}>
              <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/15 transition-all duration-300">
                {/* Top color bar */}
                <div className="h-1" style={{ backgroundColor: project.color }} />

                <div className="p-5">
                  {/* Number & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-white/[0.06] leading-none">
                      {String(project.num).padStart(2, '0')}
                    </span>
                    <Badge
                      className={`text-[10px] ${
                        project.status === 'READY TO PRODUCE'
                          ? 'border-green-500/30 bg-green-500/10 text-green-400 animate-pulse'
                          : 'border-white/10 bg-white/5 text-white/50'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-[#E50914] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/30 mb-3">{project.subtitle}</p>

                  {/* Meta */}
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary" className="text-[10px]">{project.genre}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{project.format}</Badge>
                  </div>

                  {/* Pitch */}
                  <p className="text-sm text-white/40 mb-3 line-clamp-2">{project.pitch}</p>

                  {/* Financing */}
                  <div className="text-[10px] text-white/25">
                    <span className="text-white/40">Financing:</span> {project.financing}
                  </div>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 7 — GRANTS & SUBSIDIES TRACKER
          ========================================================= */}
      <section id="grants" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="GRANTS & SUBSIDIES"
          title="Funding map"
          subtitle="A rich ecosystem of public and private grants — our structural advantage."
        />

        {/* Scenario badges */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-center flex-1 max-w-xs">
            <div className="text-xs text-white/40 mb-1">Conservative scenario</div>
            <div className="text-2xl font-bold text-white">~255K€</div>
          </div>
          <div className="bg-[#D4AF37]/[0.05] border border-[#D4AF37]/20 rounded-xl p-5 text-center flex-1 max-w-xs">
            <div className="text-xs text-[#D4AF37] mb-1">Realistic scenario</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F4D35E] bg-clip-text text-transparent">~2.45M€</div>
          </div>
        </div>

        {/* Grant tables */}
        {[
          { title: 'Israel', flag: '🇮🇱', data: GRANTS_DATA.israel },
          { title: 'France', flag: '🇫🇷', data: GRANTS_DATA.france },
          { title: 'International', flag: '🌍', data: GRANTS_DATA.international },
          { title: 'Project-specific', flag: '🎯', data: GRANTS_DATA.projectSpecific },
        ].map((section, si) => (
          <MotionCard key={si} delay={si * 0.1}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">{section.flag}</span> {section.title}
              </h3>
              <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.04]">
                        <th className="text-left p-3 text-white/50 font-medium border-b border-white/[0.06]">Programme</th>
                        <th className="text-left p-3 text-white/50 font-medium border-b border-white/[0.06] hidden md:table-cell">Organisme</th>
                        <th className="text-right p-3 text-white/50 font-medium border-b border-white/[0.06]">Montant max</th>
                        <th className="text-right p-3 text-white/50 font-medium border-b border-white/[0.06] hidden sm:table-cell">Eligibility</th>
                        <th className="text-center p-3 text-white/50 font-medium border-b border-white/[0.06]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.data.map((grant, gi) => (
                        <tr key={gi} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-white/70 font-medium">{grant.name}</td>
                          <td className="p-3 text-white/40 hidden md:table-cell">{grant.organism}</td>
                          <td className="p-3 text-right text-white/60 font-mono text-xs">{grant.maxAmount}</td>
                          <td className="p-3 text-right text-white/40 text-xs hidden sm:table-cell">{grant.eligibility}</td>
                          <td className="p-3 text-center"><StatusBadge status={grant.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </MotionCard>
        ))}
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 8 — BUSINESS MODEL
          ========================================================= */}
      <section id="model" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="BUSINESS MODEL"
          title="La Flywheel IA"
          subtitle="Trois piliers qui se renforcent mutuellement — un moteur de croissance exponentielle."
        />

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              pillar: '01',
              title: 'Service',
              subtitle: 'Cash Flow',
              desc: 'Production pour clients externes. L\'AI cuts costs by 60-80%, generating 40%+ margins. Revenue from day one.',
              icon: '⚡',
              color: COLORS.red,
              metric: '40%+ marge',
            },
            {
              pillar: '02',
              title: 'IP Originale',
              subtitle: 'Value Creation',
              desc: 'Films & series developed in-house. 10x lower cost thanks to the AI pipeline. Each IP is an asset that generates long-term value.',
              icon: '🎬',
              color: COLORS.gold,
              metric: '10x lower cost via AI',
            },
            {
              pillar: '03',
              title: 'Tech Licensing',
              subtitle: 'Recurring Upside',
              desc: 'Our production pipeline becomes an API and then a SaaS. Recurring revenue with 80%+ software margins.',
              icon: '🔧',
              color: '#4A90D9',
              metric: '80%+ marge SaaS',
            },
          ].map((p, i) => (
            <MotionCard key={i} delay={i * 0.15}>
              <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 md:p-8 h-full hover:border-white/15 transition-all">
                <div className="text-5xl font-black text-white/[0.04] absolute top-4 right-4">{p.pillar}</div>
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{p.title}</h3>
                <p className="text-sm mb-4" style={{ color: p.color }}>{p.subtitle}</p>
                <p className="text-sm text-white/40 mb-4">{p.desc}</p>
                <div className="mt-auto pt-4 border-t border-white/[0.06]">
                  <span className="text-sm font-semibold" style={{ color: p.color }}>{p.metric}</span>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* Flywheel visual */}
        <MotionCard delay={0.3}>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 md:p-12">
            <h3 className="text-center text-lg font-semibold text-white mb-8">L&apos;effet Flywheel</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {[
                { label: 'Service generates\ncash flow', color: COLORS.red },
                { label: 'Cash flow finance\nles IPs originales', color: COLORS.gold },
                { label: 'IPs valident\nla technologie', color: '#4A90D9' },
                { label: 'Tech attire\ndes clients Service', color: '#2ECC71' },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 md:p-6 text-center min-w-[140px]">
                    <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: step.color }} />
                    <p className="text-xs text-white/60 whitespace-pre-line">{step.label}</p>
                  </div>
                  {i < 3 && (
                    <>
                      <div className="hidden md:block text-white/20 text-2xl px-2">&#10230;</div>
                      <div className="md:hidden text-white/20 text-2xl">&#10515;</div>
                    </>
                  )}
                  {i === 3 && (
                    <div className="hidden md:block text-white/20 text-sm px-3 -ml-2">&#x21BB;</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </MotionCard>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 9 — COMPETITIVE ADVANTAGE
          ========================================================= */}
      <section id="competitive" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="COMPETITIVE ADVANTAGE"
          title="Why CINEGENY gagne"
          subtitle="Comparaison avec les acteurs traditionnels de l'industrie."
        />

        <MotionCard delay={0.15}>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.04]">
                    {COMPETITIVE_TABLE.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`p-4 font-medium border-b border-white/[0.06] ${
                          i === 0 ? 'text-left text-white/50' : 'text-center'
                        } ${i === 1 ? 'text-[#E50914] font-bold bg-[#E50914]/[0.04]' : 'text-white/60'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPETITIVE_TABLE.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`p-4 ${ci === 0 ? 'text-left text-white/70 font-medium' : 'text-center'} ${
                            ci === 1 ? 'text-[#E50914] font-semibold bg-[#E50914]/[0.02]' : 'text-white/40'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionCard>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 10 — ROADMAP
          ========================================================= */}
      <section id="roadmap" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="ROADMAP"
          title="Feuille de route 24 mois"
          subtitle="From structuring to Series A — each phase builds on the previous one."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#E50914] to-[#4A90D9]" />

          {ROADMAP_PHASES.map((phase, i) => (
            <MotionCard key={i} delay={i * 0.15}>
              <div className={`relative flex flex-col md:flex-row gap-6 mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10"
                  style={{ backgroundColor: '#0A0A0A', borderColor: phase.color }} />

                {/* Content */}
                <div className={`flex-1 ml-10 md:ml-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className={`bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 inline-block ${
                    i % 2 === 0 ? 'md:ml-auto' : ''
                  }`}>
                    <div className="flex items-center gap-3 mb-3" style={{ justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                      <Badge className="text-xs" style={{
                        borderColor: `${phase.color}30`,
                        backgroundColor: `${phase.color}15`,
                        color: phase.color,
                      }}>
                        {phase.period}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{phase.phase}: {phase.title}</h3>
                    <ul className={`space-y-2 mt-4 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                      {phase.items.map((item, j) => (
                        <li key={j} className="text-sm text-white/50 flex items-start gap-2" style={{
                          justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                          flexDirection: i % 2 === 0 ? 'row-reverse' : 'row',
                        }}>
                          <span style={{ color: phase.color }} className="mt-0.5 flex-shrink-0">&#9670;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block flex-1" />
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 11 — TEAM
          ========================================================= */}
      <section id="team" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="THE TEAM"
          title="Les Fondateurs"
          subtitle="Two complementary entrepreneurs at the crossroads of cinema, tech and finance."
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: 'Emmanuel Smadja',
              role: 'CEO & Co-Fondateur',
              focus: 'Finance & Ventes',
              bio: 'French-Israeli entrepreneur, expert in hybrid tax structuring and fundraising. Specialist in international co-production and public-funding mechanisms. Deep knowledge of the France-Israel regulatory environments.',
              color: COLORS.gold,
              initials: 'E',
            },
            {
              name: 'Eric Haldezos',
              role: 'Co-Founder & Managing Director',
              focus: 'IA & Production',
              bio: 'Expert in generative AI and the film production pipeline. Software architecture, development of the CINEGENY platform, creative supervision. A pioneer of AI use in audiovisual production.',
              color: COLORS.red,
              initials: 'É',
            },
          ].map((member, i) => (
            <MotionCard key={i} delay={i * 0.2}>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 hover:border-white/15 transition-all">
                {/* Avatar placeholder */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto md:mx-0"
                  style={{
                    backgroundColor: `${member.color}15`,
                    border: `2px solid ${member.color}40`,
                    color: member.color,
                  }}
                >
                  {member.initials}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-sm font-medium mb-1" style={{ color: member.color }}>{member.role}</p>
                <Badge variant="secondary" className="text-[10px] mb-4">{member.focus}</Badge>
                <p className="text-sm text-white/40 leading-relaxed">{member.bio}</p>
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 12 — LEGAL & STRUCTURE
          ========================================================= */}
      <section id="legal" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="LEGAL STRUCTURE"
          title="Legal architecture"
          subtitle="A structure optimized for dual France-Israel tax residency."
        />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current */}
          <MotionCard delay={0.1}>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 md:p-8">
              <Badge variant="warning" className="mb-4">IN PROGRESS</Badge>
              <h3 className="text-lg font-bold text-white mb-4">Current status</h3>
              <div className="space-y-3 text-sm text-white/50">
                <p>Ossek Patoua'h (Israeli sole trader)</p>
                <p className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">&#10230;</span>
                  <span>Transitioning to <span className="text-white font-medium">Israeli Ltd</span></span>
                </p>
              </div>
            </div>
          </MotionCard>

          {/* Target */}
          <MotionCard delay={0.2}>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 md:p-8">
              <Badge className="mb-4 border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">TARGET</Badge>
              <h3 className="text-lg font-bold text-white mb-4">Target structure</h3>
              <div className="space-y-3 text-sm text-white/50">
                <p><span className="text-white font-medium">Israeli Ltd</span> — Holding, R&D, Jerusalem Zone A</p>
                <p><span className="text-white font-medium">French SAS</span> — Production, IP Films, Paris</p>
                <p><span className="text-white font-medium">Delaware C-Corp</span> — Post-seed, US market</p>
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Partenariat Ruppin',
              desc: '33% participation, accord first-look — en finalisation',
              badge: 'Ruppin Editions',
            },
            {
              title: 'ISA Compliance',
              desc: 'Exempt offering (<5M ILS). KYC required for any investment.',
              badge: 'Regulation',
            },
            {
              title: 'France-Israel treaty',
              desc: 'Bilateral film co-production agreement (2002)',
              badge: 'Coproduction',
            },
            {
              title: 'IR-PME / Madelin',
              desc: '25% tax reduction for eligible French investors.',
              badge: 'Avantage fiscal FR',
            },
            {
              title: 'IP strategy',
              desc: 'Tech IP → Israeli entity (Patent Box 12%). Film IP → French entity.',
              badge: 'Intellectual property',
            },
            {
              title: 'KYC Obligatoire',
              desc: 'Identity verification required before participating in any investment phase.',
              badge: 'Compliance',
            },
          ].map((item, i) => (
            <MotionCard key={i} delay={i * 0.08}>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 h-full">
                <Badge variant="secondary" className="text-[10px] mb-3">{item.badge}</Badge>
                <h4 className="text-sm font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 13 — RISK DISCLOSURE
          ========================================================= */}
      <section id="risks" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <SectionTitle
          badge="AVERTISSEMENT"
          title="Risk factors"
          subtitle="Investing in a startup carries significant risks. Read carefully."
        />

        <MotionCard delay={0.15}>
          <div className="bg-white/[0.02] border border-[#E50914]/10 rounded-xl p-6 md:p-10">
            <div className="space-y-4 text-sm text-white/50 leading-relaxed">
              <p>
                <strong className="text-white/70">Risk of capital loss:</strong> Investing in
                CineGeny Pictures / CINEGENY is a high-risk investment. The capital invested may be
                partially or totally lost. Past performance is no guarantee of future results.
              </p>
              <p>
                <strong className="text-white/70">Liquidity risk:</strong> CINE tokens are not listed on
                a regulated market. There is no guarantee of liquidity or a secondary market. Tokens
                are subject to lockup periods that vary by investment phase.
              </p>
              <p>
                <strong className="text-white/70">Regulatory risk:</strong> The regulatory environment for
                digital assets is evolving rapidly in France, Israel and worldwide. Regulatory changes
                could affect the value, transferability or utility of the tokens.
              </p>
              <p>
                <strong className="text-white/70">Operational risk:</strong> The company is at an
                early stage. Financial projections are estimates, not guarantees. Grant funding
                depends on approval by third-party bodies.
              </p>
              <p>
                <strong className="text-white/70">Technology risk:</strong> The artificial-intelligence
                sector evolves rapidly. Current competitive advantages could be eroded by
                new technologies or better-funded competitors.
              </p>
              <p>
                <strong className="text-white/70">Market risk:</strong> The commercial success of the films and content
                produced is never guaranteed. The entertainment industry is inherently unpredictable.
              </p>
              <p className="border-t border-white/[0.06] pt-4 text-xs text-white/30">
                This document does not constitute investment advice. We recommend consulting an independent
                financial, legal and tax advisor before making any investment decision. The information
                presented is provided for informational purposes only and constitutes neither an offer nor a solicitation
                in jurisdictions where this would be unlawful.
              </p>
            </div>
          </div>
        </MotionCard>
      </section>

      <SectionDivider />

      {/* =========================================================
          SECTION 14 — CTA FOOTER
          ========================================================= */}
      <section id="cta" className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <MotionCard>
            <div className="relative rounded-2xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/20 via-[#D4AF37]/10 to-[#0A0A0A]" />
              <div className="absolute inset-0 bg-[#0A0A0A]/60" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="relative z-10 p-8 md:p-16 text-center">
                <Badge className="mb-6 border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-sm px-4 py-1.5">
                  PHASE 1 — FAMILY & FRIENDS | OPEN
                </Badge>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Join Phase 1
                </h2>
                <p className="text-white/50 text-lg mb-8 max-w-2xl mx-auto">
                  CINE token at <span className="text-[#D4AF37] font-semibold">$0.004</span> — the lowest price before the June
                  increase. Limited spots for the founders' circle.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                  <Button
                    size="xl"
                    className="bg-[#D4AF37] hover:bg-[#F4D35E] text-black font-semibold text-base shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                    asChild
                  >
                    <a href="mailto:invest@cinegeny.studio?subject=Investment Phase 1 - Family %26 Friends">
                      Contact us to invest
                    </a>
                  </Button>
                  <Button variant="outline" size="xl" className="text-base font-semibold border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10" asChild>
                    <a href="mailto:invest@cinegeny.studio?subject=Investor deck">
                      Get the deck
                    </a>
                  </Button>
                </div>

                {/* Contact info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-white/40">
                  <a href="mailto:invest@cinegeny.studio" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                    <span>&#9993;</span> invest@cinegeny.studio
                  </a>
                  <span className="hidden md:inline text-white/10">|</span>
                  <span className="flex items-center gap-2">
                    <span>&#9673;</span> Paris, France
                  </span>
                  <span className="hidden md:inline text-white/10">|</span>
                  <span className="flex items-center gap-2">
                    <span>&#9673;</span> Jérusalem, Israël
                  </span>
                </div>

                {/* Social links placeholder */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  {['LinkedIn', 'X/Twitter', 'Instagram', 'YouTube'].map((social) => (
                    <div
                      key={social}
                      className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs text-white/30 hover:border-white/20 hover:text-white/50 transition-colors cursor-pointer"
                      title={social}
                    >
                      {social[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Very bottom */}
        <div className="text-center mt-12 text-xs text-white/20">
          <p>&copy; {new Date().getFullYear()} CineGeny Pictures / CINEGENY. All rights reserved.</p>
          <p className="mt-1">This document is confidential and intended for potential investors only.</p>
        </div>
      </section>
    </div>
  )
}
