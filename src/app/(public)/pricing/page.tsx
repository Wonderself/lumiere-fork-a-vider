import { CheckCircle, Zap, Star, Crown, Film, Users, Sparkles, Award, Download, Vote, Eye, HelpCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — CINEGENY',
  description: 'Choose your CINEGENY plan. Free, Premium or Premium+. Stream AI films.',
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Discover AI cinema for free.',
    icon: Film,
    color: 'text-white/60',
    borderColor: 'border-white/10',
    bgColor: 'bg-white/[0.02]',
    popular: false,
    features: [
      '10 films per month',
      '20 short films (<30min) per month',
      'With ads',
      'Basic profile',
      'Vote on films (earn points)',
      '720p quality',
    ],
    cta: 'Start for free',
    ctaStyle: 'border border-white/10 text-white/60 hover:border-white/20 hover:text-white',
    ctaLink: '/register',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2,
    period: '/mois',
    description: 'For demanding film lovers.',
    icon: Star,
    color: 'text-[#E50914]',
    borderColor: 'border-[#E50914]/30',
    bgColor: 'bg-[#E50914]/[0.03]',
    popular: true,
    features: [
      '30 films per month',
      '50 short films per month',
      'No ads',
      '1080p Full HD',
      'Priority voting (2x points)',
      'Offline downloads (5 films)',
      'Early access to premieres',
      '"Supporter" badge',
    ],
    cta: 'Go Premium',
    ctaStyle: 'bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20',
    ctaLink: '/register?plan=premium',
  },
  {
    id: 'premium-plus',
    name: 'Premium+',
    price: 9,
    period: '/mois',
    description: 'The ultimate cinema experience.',
    icon: Crown,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/[0.03]',
    popular: false,
    features: [
      'UNLIMITED films',
      'UNLIMITED short films',
      'No ads',
      '4K Ultra HD + Dolby Atmos',
      '3x voting points',
      'Unlimited downloads',
      'Exclusive behind-the-scenes',
      'VIP premieres',
      'Gold "VIP" badge',
      'Priority support',
    ],
    cta: 'Go Premium+',
    ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-600/20',
    ctaLink: '/register?plan=premium-plus',
  },
]

const COMPARISON = [
  { feature: 'Films / month', free: '10', premium: '30', plus: 'Unlimited' },
  { feature: 'Short films / month', free: '20', premium: '50', plus: 'Unlimited' },
  { feature: 'Quality', free: '720p', premium: '1080p', plus: '4K + Atmos' },
  { feature: 'Ads', free: 'Yes', premium: 'No', plus: 'No' },
  { feature: 'Downloads', free: 'No', premium: '5 / month', plus: 'Unlimited' },
  { feature: 'Voting points', free: '1x', premium: '2x', plus: '3x' },
  { feature: 'Badge', free: '—', premium: 'Supporter', plus: 'VIP Gold' },
]

const FAQ = [
  {
    q: 'Can I watch for free?',
    a: 'Yes! The Free plan gives you 10 films and 20 short films per month, with ads. No credit card required.',
  },
  {
    q: 'How do voting points work?',
    a: 'Vote on films submitted by the community to earn points. Accumulate them and convert them into free Premium time: 1000 points = 1 month Premium, 2500 points = 1 month Premium+.',
  },
  {
    q: 'What counts as a short film?',
    a: 'Any film under 30 minutes is a short film and counts toward your short-film quota, not your feature-film quota.',
  },
  {
    q: 'Can I change plans anytime?',
    a: 'Yes, you can upgrade instantly with prorated billing. You can also downgrade at the end of your billing period.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[200px]" />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E50914]/[0.06] border border-[#E50914]/15 text-[#E50914] text-xs sm:text-sm font-medium mb-7">
            <Sparkles className="h-3.5 w-3.5" />
            Plans & Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            AI cinema,{' '}
            <span className="text-shimmer">for everyone</span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Watch films created by artificial intelligence. Vote, earn points, and unlock Premium content for free.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl sm:rounded-3xl border p-6 sm:p-8 ${plan.borderColor} ${plan.bgColor} transition-all duration-500 hover:scale-[1.02] hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E50914] text-white text-xs font-bold">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <plan.icon className={`h-8 w-8 mb-3 ${plan.color}`} />
                <h3 className="text-xl font-bold text-white font-playfair">
                  {plan.name}
                </h3>
                <p className="text-white/40 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.color}`}>
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-white/30 text-sm ml-1">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${plan.color}`} />
                    <span className="text-sm text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaLink}
                className={`golden-border-btn block w-full text-center py-3.5 rounded-xl text-sm transition-all duration-300 ${plan.ctaStyle} ${plan.popular ? 'golden-border-always' : ''}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent mb-20" />

        {/* Points & Voting Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/[0.08] border border-purple-500/20 text-purple-400 text-xs font-medium mb-5">
              <Award className="h-3.5 w-3.5" />
              Points System
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-playfair">
              Vote, earn,{' '}
              <span className="text-shimmer">watch for free</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto">
              Earn points by voting on community-submitted films. The more you vote, the more you unlock.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <Eye className="h-6 w-6 text-white/40 mx-auto mb-3" />
              <p className="text-sm text-white/60">Vote on submitted films</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <Zap className="h-6 w-6 text-[#E50914] mx-auto mb-3" />
              <p className="text-sm text-white/60">Earn points with every vote</p>
            </div>
            <div className="rounded-2xl border border-[#E50914]/20 bg-[#E50914]/[0.03] p-5 text-center">
              <Star className="h-6 w-6 text-[#E50914] mx-auto mb-3" />
              <p className="text-sm text-white/80 font-medium">1000 pts = 1 month Premium</p>
            </div>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-5 text-center">
              <Crown className="h-6 w-6 text-purple-400 mx-auto mb-3" />
              <p className="text-sm text-white/80 font-medium">2500 pts = 1 month Premium+</p>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Premium members earn 2x points, Premium+ earn 3x points per vote.
          </p>
        </div>

        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-playfair">
              Compare plans
            </h2>
            <p className="text-white/40 text-sm sm:text-base">
              All the details, side by side.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-white/60 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 text-[#E50914] font-semibold">Premium</th>
                  <th className="text-center py-4 px-4 text-purple-400 font-semibold">Premium+</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-white/50">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center text-white/40">{row.free}</td>
                    <td className="py-3.5 px-4 text-center text-white/70 font-medium">{row.premium}</td>
                    <td className="py-3.5 px-4 text-center text-white/70 font-medium">{row.plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent mb-20" />

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/50 text-xs font-medium mb-5">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-playfair">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <h4 className="text-white font-semibold text-sm mb-2 flex items-start gap-2.5">
                  <ChevronDown className="h-4 w-4 mt-0.5 shrink-0 text-[#E50914]" />
                  {item.q}
                </h4>
                <p className="text-white/40 text-sm pl-6.5 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent my-12" />

        {/* ═══ PAY-PER-VIEW ═══ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-amber-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Pay Per View
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              No subscription? <span className="text-shimmer">Pay as you watch.</span>
            </h2>
            <p className="text-white/35 text-sm max-w-lg mx-auto mt-3">
              Exceeded your monthly limit or prefer to pay per film? Choose from flexible one-time options.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Single Film', price: '1.99', unit: '/film', desc: 'Watch any feature film once. 48h access after purchase.', badge: null },
              { title: 'Short Film', price: '0.99', unit: '/film', desc: 'Watch any short film (<30min) once. 48h access.', badge: null },
              { title: 'Day Pass', price: '2.99', unit: '/24h', desc: 'Unlimited films for 24 hours. No ads. Perfect for binge watching.', badge: 'Best Value' },
              { title: 'Pack 5 Films', price: '6.99', unit: '/5 films', desc: '5 film credits to use anytime. Never expires. ~$1.40/film.', badge: 'Save 30%' },
            ].map((opt) => (
              <div
                key={opt.title}
                className="relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center hover:border-amber-500/20 transition-all duration-300"
              >
                {opt.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    {opt.badge}
                  </div>
                )}
                <p className="text-3xl font-black text-amber-400 mt-2">${opt.price}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{opt.unit}</p>
                <p className="text-sm font-semibold text-white mt-3">{opt.title}</p>
                <p className="text-xs text-white/35 mt-2 leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] text-center">
            <p className="text-xs text-white/30">
              Pay with <span className="text-white/50">credit card</span>, <span className="text-white/50">crypto (ETH/USDC)</span>, or <span className="text-amber-400/60">points</span>.
              Revenue from views is distributed to film creators via smart contracts on Ethereum.
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-12" />

        {/* Creator CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <Users className="h-8 w-8 text-[#E50914]" />
            <h3 className="text-lg font-bold font-playfair">
              Are you a creator?
            </h3>
            <p className="text-white/40 text-sm max-w-md">
              All plans include access to the creation studio. Submit your films, contribute to projects, and earn revenue.
            </p>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium"
            >
              <Zap className="h-4 w-4" /> Explore available missions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
