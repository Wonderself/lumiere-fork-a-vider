'use client'

import { useState, useEffect } from 'react'
import {
  Coins,
  Crown,
  Zap,
  Film,
  ThumbsUp,
  Trophy,
  CalendarCheck,
  Briefcase,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

function getUserPoints(): number {
  if (typeof window === 'undefined') return 500
  return Number(localStorage.getItem('cinegen-user-points') ?? '500')
}

function setUserPoints(pts: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cinegen-user-points', String(pts))
  }
}

const CONVERSION_OPTIONS = [
  {
    points: 1000,
    label: '1 mois Premium',
    value: '2',
    icon: Crown,
    color: 'amber',
  },
  {
    points: 2500,
    label: '1 mois Premium+',
    value: '9',
    icon: Zap,
    color: 'amber',
  },
  {
    points: 100,
    label: '1 film supplementaire ce mois',
    value: '',
    icon: Film,
    color: 'amber',
  },
]

const EARN_METHODS = [
  { label: 'Voter sur un film', points: '+10 pts', icon: ThumbsUp },
  { label: 'Vote correspond au resultat', points: '+25 pts bonus', icon: Award },
  { label: 'Connexion quotidienne', points: '+5 pts', icon: CalendarCheck },
  { label: 'Completer une tache', points: '+50 pts', icon: Briefcase },
  { label: 'Gagner un challenge', points: '+100 pts', icon: Trophy },
  { label: 'Membre Premium', points: '2x tous les points', icon: Crown },
  { label: 'Membre Premium+', points: '3x tous les points', icon: Zap },
]

const SIMULATED_HISTORY = [
  { date: '2026-03-11', reason: 'Connexion quotidienne', amount: 5, balance: 500 },
  { date: '2026-03-10', reason: 'Vote sur "Eclipse Digitale"', amount: -10, balance: 495 },
  { date: '2026-03-10', reason: 'Vote correct — bonus', amount: 25, balance: 505 },
  { date: '2026-03-09', reason: 'Connexion quotidienne', amount: 5, balance: 480 },
  { date: '2026-03-09', reason: 'Tache completee — script review', amount: 50, balance: 475 },
  { date: '2026-03-08', reason: 'Vote sur "Neon Requiem"', amount: -25, balance: 425 },
  { date: '2026-03-07', reason: 'Connexion quotidienne', amount: 5, balance: 450 },
  { date: '2026-03-06', reason: 'Challenge remporte — Best Pitch', amount: 100, balance: 445 },
  { date: '2026-03-05', reason: 'Vote sur "Les Ombres"', amount: -5, balance: 345 },
  { date: '2026-03-04', reason: 'Connexion quotidienne', amount: 5, balance: 350 },
]

export default function PointsPage() {
  const [points, setPoints] = useState(500)
  const [mounted, setMounted] = useState(false)
  const [converted, setConverted] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    setPoints(getUserPoints())
  }, [])

  function handleConvert(index: number, cost: number) {
    if (points < cost) return
    const next = points - cost
    setPoints(next)
    setUserPoints(next)
    setConverted(index)
    setTimeout(() => setConverted(null), 2500)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="relative pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/3 w-80 h-80 bg-[#E50914]/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative container mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8">
            <Coins className="h-4 w-4" />
            <span className="font-medium">Systeme de Points</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
            Vos{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #F59E0B 0%, #FBBF24 40%, #F59E0B 70%, #D97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Points
            </span>
          </h1>

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">
            Gagnez des points en participant, convertissez-les en avantages Premium.
          </p>

          {/* Balance card */}
          <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-12 py-8">
            <Coins className="h-10 w-10 text-amber-400" />
            <span className="text-5xl font-bold text-amber-400">
              {points.toLocaleString('fr-FR')}
            </span>
            <span className="text-sm text-amber-400/60 uppercase tracking-wider font-medium">
              Points disponibles
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* CONVERSION OPTIONS                                               */}
      {/* ================================================================ */}
      <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
            Convertir vos points
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CONVERSION_OPTIONS.map((opt, i) => {
              const canAfford = points >= opt.points
              const isConverted = converted === i
              const Icon = opt.icon

              return (
                <div
                  key={i}
                  className="rounded-2xl border border-amber-500/[0.15] bg-white/[0.02] p-6 flex flex-col items-center text-center transition-all duration-500 hover:border-amber-500/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-amber-400" />
                  </div>

                  <p className="text-sm font-semibold text-white mb-1">{opt.label}</p>
                  {opt.value && (
                    <p className="text-xs text-white/40 mb-3">Valeur : {opt.value} EUR</p>
                  )}

                  <p className="text-lg font-bold text-amber-400 mb-5">
                    {opt.points.toLocaleString('fr-FR')} pts
                  </p>

                  <button
                    onClick={() => handleConvert(i, opt.points)}
                    disabled={!canAfford || isConverted}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isConverted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : canAfford
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                          : 'bg-white/[0.04] text-white/30 border border-white/[0.06] cursor-not-allowed'
                    }`}
                  >
                    {isConverted ? 'Converti !' : 'Convertir'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW TO EARN                                                      */}
      {/* ================================================================ */}
      <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-16">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
            Comment gagner des points
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {EARN_METHODS.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-start gap-4 transition-all duration-500 hover:border-white/[0.12]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#E50914]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-1">{method.label}</p>
                    <p className="text-xs font-semibold text-amber-400">{method.points}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* POINTS HISTORY                                                   */}
      {/* ================================================================ */}
      <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-16 pb-24">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
            Historique
          </h2>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[120px_1fr_100px_100px] gap-4 px-6 py-3 border-b border-white/[0.06] text-xs text-white/40 uppercase tracking-wider font-medium">
              <span>Date</span>
              <span>Raison</span>
              <span className="text-right">Montant</span>
              <span className="text-right">Solde</span>
            </div>

            {/* Rows */}
            {SIMULATED_HISTORY.map((entry, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 sm:grid-cols-[120px_1fr_100px_100px] gap-2 sm:gap-4 px-6 py-4 ${
                  i < SIMULATED_HISTORY.length - 1 ? 'border-b border-white/[0.04]' : ''
                } transition-colors hover:bg-white/[0.02]`}
              >
                <span className="text-xs text-white/40">{entry.date}</span>
                <span className="text-sm text-white/70">{entry.reason}</span>
                <span
                  className={`text-sm font-medium text-right flex items-center justify-end gap-1 ${
                    entry.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {entry.amount > 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {entry.amount > 0 ? '+' : ''}
                  {entry.amount}
                </span>
                <span className="text-sm text-white/50 text-right">
                  {entry.balance} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
