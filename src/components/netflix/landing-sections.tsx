'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clapperboard, Vote, Bot, Globe, Landmark,
  ArrowRight, Check, X as XIcon, Minus, Sparkles,
  Award, Shield, TrendingUp,
} from 'lucide-react'

// ─── MANIFESTO ─────────────────────────────────────────

const manifestoLines = [
  { normal: 'Le cinema coute des', gold: 'millions.' },
  { normal: 'Nous le faisons pour', gold: '25 000\u20AC.' },
  { normal: '', gold: '' },
  { normal: 'Le cinema', gold: 'exclut.' },
  { normal: "Nous l'ouvrons a", gold: 'tous.' },
  { normal: '', gold: '' },
  { normal: "Le cinema a peur de", gold: "l'IA." },
  { normal: 'Nous en faisons notre', gold: 'outil de creation.' },
]

export function ManifestoSection() {
  return (
    <section id="manifesto" className="relative py-36 md:py-48 overflow-hidden">
      {/* Subtle center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #E50914 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 text-center">
        {manifestoLines.map((line, idx) => {
          if (!line.normal && !line.gold) {
            return <div key={idx} className="h-12 md:h-16" />
          }
          return (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white/50 leading-[1.6] md:leading-[1.5]"
            >
              {line.normal}{' '}
              <span className="font-bold text-[#E50914]">{line.gold}</span>
            </motion.p>
          )
        })}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mt-16 md:mt-24"
        >
          Bienvenue dans le <span className="text-[#E50914]">futur du cinema.</span>
        </motion.p>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS — 5 PILLARS ──────────────────────────

const pillars = [
  {
    icon: Clapperboard,
    title: 'MICRO-TACHES',
    description: 'Chaque film = 500 micro-taches a 50\u20AC. Des milliers de createurs participent. Un film complet pour 25 000\u20AC.',
    accent: '100x moins cher qu\'Hollywood.',
    color: '#E50914',
  },
  {
    icon: Vote,
    title: 'VOTE COMMUNAUTAIRE',
    description: 'La communaute choisit quels films produire. Plus de gatekeepers. Plus de comites secrets. Vous decidez.',
    accent: 'La democratie du cinema.',
    color: '#3B82F6',
  },
  {
    icon: Bot,
    title: 'IA ETHIQUE',
    description: "L'IA assiste. L'humain cree. Charte Fair AI Cinema signee. Transparence totale sur l'usage de l'IA.",
    accent: 'Le cinema IA responsable.',
    color: '#8B5CF6',
  },
  {
    icon: Globe,
    title: 'WATCH \u00B7 CREATE \u00B7 EARN',
    description: 'Regardez les films en streaming. Creez via les micro-taches. Gagnez des revenus sur vos contributions.',
    accent: 'Le premier studio ou tout le monde gagne.',
    color: '#10B981',
  },
  {
    icon: Landmark,
    title: 'PONT FRANCE\u2013ISRAEL',
    description: 'Double acces aux subventions FR + IL. Double marche, double reseau de talents. Le meilleur des deux ecosystemes.',
    accent: 'Un avantage competitif unique.',
    color: '#F59E0B',
  },
]

export function HowItWorks() {
  return (
    <section className="py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-18 md:mb-24"
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
        >
          Comment ca marche
        </h2>
        <p className="text-sm md:text-base text-white/30 max-w-lg mx-auto">
          5 piliers qui changent les regles du jeu
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 max-w-7xl mx-auto">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative rounded-2xl overflow-hidden p-8 md:p-9 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)` }}
            />

            <pillar.icon className="h-7 w-7 mb-7 transition-colors" style={{ color: pillar.color }} />

            <h3 className="text-sm font-black text-white tracking-wide mb-4">{pillar.title}</h3>
            <p className="text-[12px] text-white/35 leading-[1.7] mb-6">{pillar.description}</p>
            <p className="text-[11px] font-bold transition-colors" style={{ color: pillar.color }}>
              &rarr; {pillar.accent}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── PIPELINE VISUAL ───────────────────────────────────

const pipelineSteps = [
  { num: '01', label: 'Idee soumise', detail: 'Un membre propose son histoire' },
  { num: '02', label: 'Vote', detail: 'La communaute choisit' },
  { num: '03', label: 'Selection', detail: 'Le scenario gagne' },
  { num: '04', label: '500 taches', detail: "L'IA decompose le film" },
  { num: '05', label: 'Execution', detail: 'Les contributeurs creent' },
  { num: '06', label: 'Assemblage', detail: 'Le film prend forme' },
  { num: '07', label: 'Distribution', detail: 'Streaming + Festivals' },
  { num: '08', label: 'Revenus', detail: 'Partages equitablement' },
]

export function PipelineVisual() {
  return (
    <section className="py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
        >
          De l&apos;idee au <span className="text-[#E50914]">grand ecran</span>
        </h2>
        <p className="text-sm md:text-base text-white/30 max-w-lg mx-auto">
          Le parcours d&apos;un film CINEGENY, du premier mot a la premiere projection
        </p>
      </motion.div>

      {/* Pipeline — horizontal on desktop, vertical on mobile */}
      <div className="max-w-6xl mx-auto">
        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-start relative">
          {/* Connection line */}
          <div className="absolute top-6 left-8 right-8 h-[1px] bg-gradient-to-r from-[#E50914]/30 via-[#E50914]/10 to-[#E50914]/30" />

          {pipelineSteps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="flex-1 text-center relative"
            >
              {/* Dot */}
              <div className="relative z-10 mx-auto w-12 h-12 rounded-full border-2 border-[#E50914]/30 bg-[#0A0A0A] flex items-center justify-center mb-6">
                <span className="text-[11px] font-black text-[#E50914]">{step.num}</span>
              </div>
              <p className="text-[12px] font-bold text-white/70 mb-2">{step.label}</p>
              <p className="text-[10px] text-white/25 leading-relaxed px-2">{step.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {pipelineSteps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="flex items-start gap-5 relative"
            >
              {/* Vertical line */}
              {idx < pipelineSteps.length - 1 && (
                <div className="absolute top-12 left-[23px] bottom-0 w-[1px] bg-[#E50914]/15" />
              )}
              {/* Dot */}
              <div className="relative z-10 shrink-0 w-12 h-12 rounded-full border-2 border-[#E50914]/30 bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-[11px] font-black text-[#E50914]">{step.num}</span>
              </div>
              <div className="pb-9">
                <p className="text-[13px] font-bold text-white/70 mb-1">{step.label}</p>
                <p className="text-[11px] text-white/25">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── COMPARISON TABLE ──────────────────────────────────

interface CompRow {
  label: string
  hollywood: string | null
  netflix: string | null
  cinegeny: string | null
  cinegenyHighlight?: boolean
}

const compRows: CompRow[] = [
  { label: 'Cout par film', hollywood: '5-200M\u20AC', netflix: '5-50M\u20AC', cinegeny: '25K\u20AC', cinegenyHighlight: true },
  { label: 'Delai', hollywood: '2-5 ans', netflix: '6-18 mois', cinegeny: '3 mois', cinegenyHighlight: true },
  { label: 'Qui decide', hollywood: 'Studios / Banques', netflix: 'Algorithmes', cinegeny: 'La communaute', cinegenyHighlight: true },
  { label: 'Participation', hollywood: 'Ferme aux elites', netflix: 'Abonnes passifs', cinegeny: 'Tout le monde cree', cinegenyHighlight: true },
  { label: 'Intelligence Artificielle', hollywood: 'Opposition', netflix: 'Usage interne', cinegeny: 'Outil transparent', cinegenyHighlight: true },
  { label: 'Blockchain / Web3', hollywood: null, netflix: null, cinegeny: 'Full integration', cinegenyHighlight: true },
]

function CellIcon({ value }: { value: string | null }) {
  if (value === null) return <XIcon className="h-4 w-4 text-white/15 mx-auto" />
  return null
}

export function ComparisonTable() {
  return (
    <section className="py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
        >
          Pourquoi <span className="text-[#E50914]">CINEGENY</span>
        </h2>
        <p className="text-sm md:text-base text-white/30 max-w-lg mx-auto">
          La comparaison parle d&apos;elle-meme
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/[0.06]"
      >
        {/* Header */}
        <div className="grid grid-cols-4 bg-white/[0.02]">
          <div className="p-6 md:p-7" />
          <div className="p-6 md:p-7 text-center border-l border-white/[0.04]">
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-wider">Hollywood</p>
          </div>
          <div className="p-6 md:p-7 text-center border-l border-white/[0.04]">
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-wider">Netflix</p>
          </div>
          <div className="p-6 md:p-7 text-center border-l border-[#E50914]/10 bg-[#E50914]/[0.03]">
            <p className="text-[11px] font-black text-[#E50914] uppercase tracking-wider">CINEGENY</p>
          </div>
        </div>

        {/* Rows */}
        {compRows.map((row, idx) => (
          <div key={row.label} className={`grid grid-cols-4 ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'} border-t border-white/[0.04]`}>
            <div className="p-6 md:p-7 flex items-center">
              <p className="text-[12px] md:text-[13px] font-semibold text-white/50">{row.label}</p>
            </div>
            <div className="p-6 md:p-7 flex items-center justify-center border-l border-white/[0.04]">
              {row.hollywood ? (
                <p className="text-[11px] md:text-[12px] text-white/25 text-center">{row.hollywood}</p>
              ) : (
                <CellIcon value={row.hollywood} />
              )}
            </div>
            <div className="p-6 md:p-7 flex items-center justify-center border-l border-white/[0.04]">
              {row.netflix ? (
                <p className="text-[11px] md:text-[12px] text-white/25 text-center">{row.netflix}</p>
              ) : (
                <CellIcon value={row.netflix} />
              )}
            </div>
            <div className="p-6 md:p-7 flex items-center justify-center border-l border-[#E50914]/10 bg-[#E50914]/[0.03]">
              {row.cinegeny ? (
                <p className={`text-[11px] md:text-[12px] text-center font-bold ${row.cinegenyHighlight ? 'text-[#E50914]' : 'text-white/60'}`}>
                  {row.cinegeny}
                </p>
              ) : (
                <CellIcon value={row.cinegeny} />
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

// ─── SOCIAL PROOF ──────────────────────────────────────

const credentials = [
  'Candidat Innovation Authority Israel',
  'Eligible CNC France',
  'Eligible BPI France 2030',
  'Fair AI Cinema Charter',
]

export function SocialProof() {
  return (
    <section className="py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-[11px] font-bold text-white/25 uppercase tracking-[0.2em] mb-12">
          Soutenu par l&apos;ecosysteme innovation
        </p>

        {/* Credential badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-24">
          {credentials.map((cred) => (
            <div
              key={cred}
              className="px-7 py-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[11px] md:text-[12px] text-white/25 font-medium tracking-wide"
            >
              {cred}
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="max-w-2xl mx-auto">
          <div className="h-[1px] w-16 bg-[#E50914]/30 mx-auto mb-12" />
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-white/50 font-light leading-relaxed italic"
          >
            &laquo;&nbsp;Nous ne remplacons pas les artistes. Nous donnons a chaque artiste
            un studio de cinema dans sa poche.&nbsp;&raquo;
          </motion.blockquote>
          <p className="text-[12px] text-white/20 mt-8 font-medium">
            &mdash; Emmanuel &amp; Eric, Fondateurs
          </p>
        </div>
      </motion.div>
    </section>
  )
}

// ─── FINAL CTA ─────────────────────────────────────────

export function FinalCTA() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0808] to-[#0A0A0A]" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse at center, #E50914 0%, transparent 60%)' }}
      />

      {/* Top/bottom lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-10 leading-tight"
        >
          Le cinema de demain se construit{' '}
          <span className="text-[#E50914]">maintenant.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-sm md:text-[15px] text-white/35 leading-[1.8] max-w-xl mx-auto mb-14"
        >
          Que vous soyez scenariste, realisateur, monteur, musicien,
          developpeur, designer ou simplement passionne de cinema &mdash;
          il y a une place pour vous.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-300 hover:shadow-[0_0_60px_rgba(229,9,20,0.4)] hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)' }}
          >
            Creer mon compte gratuitement
            <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <Link
          href="/tasks"
          className="text-sm text-white/30 hover:text-[#E50914] transition-colors font-medium"
        >
          Ou decouvrez les micro-taches disponibles &rsaquo;
        </Link>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-[11px] text-white/15 mt-14 uppercase tracking-[0.2em] font-medium"
        >
          Premiere production : Q2 2026
        </motion.p>
      </div>
    </section>
  )
}
