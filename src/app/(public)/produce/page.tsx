'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FILMS_BY_GENRE } from '@/data/films'
import {
  ArrowRight,
  Camera,
  Users,
  Heart,
  TrendingUp,
  DollarSign,
  Shield,
  CreditCard,
  Coins,
  FileText,
  Rocket,
  Target,
  Handshake,
  Play,
  Film,
  PieChart,
} from 'lucide-react'

/* ── Helpers ── */

const allFilms = Object.values(FILMS_BY_GENRE).flat()
const openFilms = allFilms.filter((f) => f.fundingPct < 100)

function getFunding(film: (typeof allFilms)[0]) {
  const target = 25000 + film.fundingPct * 200
  const raised = Math.round((target * film.fundingPct) / 100)
  return { target, raised }
}

function formatUsd(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

/* ── Feature cards ── */

const features = [
  {
    icon: FileText,
    title: 'Create Your Project',
    desc: 'Submit your film concept, screenplay, or storyboard. Our AI pipeline helps you shape your vision into a production-ready package.',
  },
  {
    icon: Target,
    title: 'Crowdfund Your Film',
    desc: 'Set a funding goal and let the community invest. Backers receive production shares backed by smart contracts on Ethereum.',
  },
  {
    icon: Users,
    title: 'Build Your Community',
    desc: 'Rally actors, writers, and crew around your project. Every contributor earns reputation and shares in the final production.',
  },
]

/* ── How it works steps ── */

const steps = [
  { num: '1', title: 'Submit your project', desc: 'Upload your screenplay, pitch deck, or concept art to the platform.', icon: FileText },
  { num: '2', title: 'Set funding goal', desc: 'Define your budget and timeline. Smart contracts lock the terms.', icon: Target },
  { num: '3', title: 'Community invests', desc: 'Backers purchase production shares. Funds are held in escrow until milestones are met.', icon: Handshake },
  { num: '4', title: 'Production begins', desc: 'Once funded, your film enters the AI-powered production pipeline with community contributors.', icon: Rocket },
]

/* ── Revenue sharing breakdown ── */

const revenueShares = [
  { label: 'Investors', pct: 25, color: 'bg-emerald-500' },
  { label: 'Screenwriters', pct: 25, color: 'bg-[#E50914]' },
  { label: 'Workers', pct: 25, color: 'bg-amber-500' },
  { label: 'Platform', pct: 25, color: 'bg-blue-500' },
]

/* ── Payment options ── */

const paymentOptions = [
  { icon: CreditCard, title: 'Fiat (Stripe)', desc: 'Credit card, bank transfer, Apple Pay. Instant settlement in USD/EUR.' },
  { icon: Coins, title: 'Crypto (Ethereum)', desc: 'USDC, ETH, or ERC-20 tokens. Secured on Ethereum mainnet + L2.' },
  { icon: PieChart, title: 'Production Shares', desc: 'Workers can be paid in shares. Revenue distributed proportionally via smart contracts.' },
]

/* ═══════════════════════════════════════════════════════════════
   PRODUCE PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function ProducePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] rounded-full bg-[#E50914]/[0.04] blur-[180px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.02] blur-[200px]" />

        {/* Decorative cinema icons */}
        <div className="absolute top-20 left-[10%] text-white/[0.03]">
          <Camera className="h-32 w-32" />
        </div>
        <div className="absolute bottom-20 right-[10%] text-white/[0.03]">
          <Film className="h-28 w-28" />
        </div>

        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#E50914]/15 bg-[#E50914]/[0.06] text-[#E50914] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5" />
            Film Production
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-shimmer">PRODUCE</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-10">
            Turn your vision into a reality. Start and crowdfund your film
            with the power of community.
          </p>

          <Link
            href="/create"
            className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
          >
            Start a Project
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                  <f.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How It <span className="text-gold-gradient">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="relative text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-full bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center mx-auto mb-3 text-[#E50914] font-bold text-lg">
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ TRENDING FILM PROJECTS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair">
                Trending Film Projects
              </h2>
              <p className="text-sm text-white/40 mt-2">
                Support the next generation of cinema.
              </p>
            </div>
            <Link
              href="/films"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium transition-colors"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Film cards */}
            {openFilms.slice(0, 5).map((film) => {
              const { target, raised } = getFunding(film)
              return (
                <Link
                  key={film.slug}
                  href={`/films/${film.slug}`}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#E50914]/20 transition-all duration-300"
                >
                  <div className="relative h-36 bg-[#141414]">
                    {film.coverImageUrl ? (
                      <Image
                        src={film.coverImageUrl}
                        alt={film.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="h-10 w-10 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-xs font-bold text-white">{film.title}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                      <span>{film.genre}</span>
                      <span className="text-emerald-400 font-bold">
                        {film.fundingPct}% funded
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        style={{ width: `${Math.min(film.fundingPct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60 font-medium">
                        {formatUsd(raised)} raised
                      </span>
                      <span className="text-white/30">
                        of {formatUsd(target)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* YOUR FILM card */}
            <Link
              href="/create"
              className="group rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] hover:border-[#E50914]/30 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center min-h-[280px]"
            >
              <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">YOUR FILM</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-4 max-w-[200px]">
                Have a story to tell? Launch your project and let the community fund it.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm text-[#E50914] font-medium group-hover:gap-2.5 transition-all">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Mobile explore link */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/films"
              className="inline-flex items-center gap-1.5 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium transition-colors"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair">
              Featured Projects
            </h2>
            <Link
              href="/films"
              className="inline-flex items-center gap-1.5 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium transition-colors"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {openFilms
              .sort((a, b) => b.fundingPct - a.fundingPct)
              .slice(0, 4)
              .map((film) => {
                const { target, raised } = getFunding(film)
                return (
                  <Link
                    key={film.slug}
                    href={`/films/${film.slug}`}
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#E50914]/20 transition-all duration-300"
                  >
                    <div className="relative h-28 bg-[#141414]">
                      {film.coverImageUrl ? (
                        <Image
                          src={film.coverImageUrl}
                          alt={film.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="h-8 w-8 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-white truncate mb-2">
                        {film.title}
                      </h3>
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ width: `${Math.min(film.fundingPct, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/30">
                        <span>{formatUsd(raised)}</span>
                        <span>/ {formatUsd(target)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ REVENUE SHARING ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Economics
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Revenue <span className="text-gold-gradient">Sharing</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Equal revenue sharing: IP is as valuable as investment. All shares are utility tokens
              on Ethereum, self-executing smart contracts. No resale — buyback by platform only.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual breakdown */}
            <div className="p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">
                Revenue Distribution
              </h3>
              <div className="space-y-4">
                {revenueShares.map((share) => (
                  <div key={share.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-white/70 font-medium">{share.label}</span>
                      <span className="text-white font-bold">{share.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${share.color} transition-all duration-700`}
                        style={{ width: `${share.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Combined bar */}
              <div className="mt-6 flex h-3 rounded-full overflow-hidden">
                {revenueShares.map((share) => (
                  <div
                    key={share.label}
                    className={`${share.color} first:rounded-l-full last:rounded-r-full`}
                    style={{ width: `${share.pct}%` }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {revenueShares.map((share) => (
                  <div key={share.label} className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <div className={`h-2 w-2 rounded-full ${share.color}`} />
                    {share.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Description cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Investor Returns</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      25% of all revenue is distributed to investors proportionally to their shares. Quarterly payouts via smart contract on Ethereum.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 text-[#E50914]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Screenwriter IP</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      25% goes to the screenwriter. IP is the real value — your story earns as much as the investment. 5% base, up to 10% if your script reaches Top 10 votes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Heart className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Worker Shares</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      25% is allocated to contributors. AI calculates fair share based on estimated work value. Workers can choose cash or production shares (2x value).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenwriter Tiers */}
            <div className="mt-8 p-6 rounded-2xl border border-[#E50914]/10 bg-[#E50914]/[0.02]">
              <h3 className="text-sm font-bold text-[#E50914] mb-4 uppercase tracking-wider">Screenwriter Revenue Tiers</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                  <p className="text-2xl font-black text-white">5%</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Base Tier</p>
                  <p className="text-xs text-white/30 mt-2">Net revenue share for every accepted screenplay</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] text-center">
                  <p className="text-2xl font-black text-amber-400">7%</p>
                  <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mt-1">Challenge Tier</p>
                  <p className="text-xs text-white/30 mt-2">Complete challenges + earn votes from the community</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] text-center">
                  <p className="text-2xl font-black text-emerald-400">10%</p>
                  <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider mt-1">Top 10 Tier</p>
                  <p className="text-xs text-white/30 mt-2">Script reaches Top 10 votes at least once</p>
                </div>
              </div>
              <p className="text-[10px] text-white/25 mt-3 text-center">
                Admin may adjust percentages based on specific conditions. All tiers backed by smart contracts on Ethereum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ CREATOR PLATFORM FEES ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-amber-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Independent Creators
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Creator <span className="text-shimmer">Platform Fees</span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto mt-3 text-sm">
              Built your film yourself via /create? Submit it for community vote.
              Once approved, you keep your revenue minus the platform fee.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] text-center">
              <p className="text-4xl font-black text-emerald-400">25%</p>
              <p className="text-sm font-bold text-white mt-2">Exclusive to CINEGENY</p>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Your film is only available on CINEGENY. You keep 75% of all revenue.
                Verified by our AI monitoring agent.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] text-center">
              <p className="text-4xl font-black text-amber-400">33%</p>
              <p className="text-sm font-bold text-white mt-2">Sold Elsewhere Too</p>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Your film is also distributed on other platforms. You keep 67% of CINEGENY revenue.
                AI agent verifies external distribution automatically.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-white/20 text-center mt-4">
            Platform fee applies after community vote approval. AI dashboard agent monitors distribution status in real-time.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ PAYMENT OPTIONS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Flexible Payments
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Payment <span className="text-gold-gradient">Options</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {paymentOptions.map((opt) => (
              <div
                key={opt.title}
                className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 text-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mb-5 mx-auto transition-transform duration-500 group-hover:scale-105">
                  <opt.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{opt.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>

          {/* Smart contract note */}
          <div className="mt-8 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400 mb-1">
                Smart Contract Integration
              </h4>
              <p className="text-sm text-white/50 leading-relaxed">
                All funding, revenue distribution, and production shares are managed by
                audited smart contracts on <span className="text-white/70 font-medium">Ethereum</span>.
                Funds are held in escrow and released only when production milestones are
                verified on-chain. Every transaction is transparent and immutable.
                Tokens are non-transferable utility tokens — no resale, platform buyback only.
                Governed by <span className="text-white/70 font-medium">Israeli Ltd</span> with planned <span className="text-white/70 font-medium">Delaware C-Corp</span> for US operations.
              </p>
            </div>
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
            <span className="text-shimmer">Produce?</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Your story deserves to be told. Launch your film project today and let the
            CINEGENY community bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
            >
              Start a Project
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/films"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              Browse Film Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
