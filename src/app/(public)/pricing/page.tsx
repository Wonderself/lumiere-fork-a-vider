import { CheckCircle, Zap, Star, Crown, Film, Users, Sparkles, Award, Download, Vote, Eye, HelpCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abonnements — CINEGENY',
  description: 'Choisissez votre plan CINEGENY. Gratuit, Premium ou Premium+. Regardez des films IA en streaming.',
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'pour toujours',
    description: 'Decouvrez le cinema IA gratuitement.',
    icon: Film,
    color: 'text-white/60',
    borderColor: 'border-white/10',
    bgColor: 'bg-white/[0.02]',
    popular: false,
    features: [
      '10 films par mois',
      '20 courts-metrages (<30min) par mois',
      'Avec publicites',
      'Profil de base',
      'Votez sur les films (gagnez des points)',
      'Qualite 720p',
    ],
    cta: 'Commencer gratuitement',
    ctaStyle: 'border border-white/10 text-white/60 hover:border-white/20 hover:text-white',
    ctaLink: '/register',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2,
    period: '/mois',
    description: 'Pour les cinephiles exigeants.',
    icon: Star,
    color: 'text-[#E50914]',
    borderColor: 'border-[#E50914]/30',
    bgColor: 'bg-[#E50914]/[0.03]',
    popular: true,
    features: [
      '30 films par mois',
      '50 courts-metrages par mois',
      'Sans publicites',
      '1080p Full HD',
      'Vote prioritaire (2x points)',
      'Telechargement hors-ligne (5 films)',
      'Acces anticipe aux premieres',
      'Badge "Supporter"',
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
    description: "L'experience cinema ultime.",
    icon: Crown,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/[0.03]',
    popular: false,
    features: [
      'Films ILLIMITES',
      'Courts-metrages ILLIMITES',
      'Sans publicites',
      '4K Ultra HD + Dolby Atmos',
      '3x points de vote',
      'Telechargements illimites',
      'Making-of exclusifs',
      'VIP avant-premieres',
      'Badge "VIP" dore',
      'Support prioritaire',
    ],
    cta: 'Go Premium+',
    ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-600/20',
    ctaLink: '/register?plan=premium-plus',
  },
]

const COMPARISON = [
  { feature: 'Films / mois', free: '10', premium: '30', plus: 'Illimite' },
  { feature: 'Courts-metrages / mois', free: '20', premium: '50', plus: 'Illimite' },
  { feature: 'Qualite', free: '720p', premium: '1080p', plus: '4K + Atmos' },
  { feature: 'Publicites', free: 'Oui', premium: 'Non', plus: 'Non' },
  { feature: 'Telechargements', free: 'Non', premium: '5 / mois', plus: 'Illimite' },
  { feature: 'Points de vote', free: '1x', premium: '2x', plus: '3x' },
  { feature: 'Badge', free: '—', premium: 'Supporter', plus: 'VIP Gold' },
]

const FAQ = [
  {
    q: 'Puis-je regarder gratuitement ?',
    a: 'Oui ! Le plan Free vous donne acces a 10 films et 20 courts-metrages par mois, avec publicites. Aucune carte bancaire requise.',
  },
  {
    q: 'Comment fonctionnent les points de vote ?',
    a: 'Votez sur les films soumis par la communaute pour gagner des points. Accumulez-les et convertissez-les en temps Premium gratuit : 1000 points = 1 mois Premium, 2500 points = 1 mois Premium+.',
  },
  {
    q: "Qu'est-ce qu'un court-metrage ?",
    a: 'Tout film de moins de 30 minutes est considere comme un court-metrage et compte dans votre quota de courts-metrages, pas dans celui des films.',
  },
  {
    q: 'Puis-je changer de plan a tout moment ?',
    a: 'Oui, vous pouvez upgrader instantanement. Le montant est calcule au prorata. Vous pouvez aussi downgrader a la fin de votre periode de facturation.',
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
            Plans & Tarifs
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            Le cinema IA,{' '}
            <span className="text-shimmer">accessible a tous</span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Regardez des films crees par l&apos;intelligence artificielle. Votez, gagnez des points, et debloquez du contenu Premium gratuitement.
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
                  Le plus populaire
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
                  {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
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
              Systeme de Points
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-playfair">
              Votez, gagnez,{' '}
              <span className="text-shimmer">regardez gratuitement</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto">
              Gagnez des points en votant sur les films soumis par la communaute. Plus vous votez, plus vous debloquez.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <Eye className="h-6 w-6 text-white/40 mx-auto mb-3" />
              <p className="text-sm text-white/60">Votez sur les films soumis</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <Zap className="h-6 w-6 text-[#E50914] mx-auto mb-3" />
              <p className="text-sm text-white/60">Gagnez des points a chaque vote</p>
            </div>
            <div className="rounded-2xl border border-[#E50914]/20 bg-[#E50914]/[0.03] p-5 text-center">
              <Star className="h-6 w-6 text-[#E50914] mx-auto mb-3" />
              <p className="text-sm text-white/80 font-medium">1000 pts = 1 mois Premium</p>
            </div>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-5 text-center">
              <Crown className="h-6 w-6 text-purple-400 mx-auto mb-3" />
              <p className="text-sm text-white/80 font-medium">2500 pts = 1 mois Premium+</p>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Les membres Premium gagnent 2x points, les Premium+ gagnent 3x points par vote.
          </p>
        </div>

        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-playfair">
              Comparez les plans
            </h2>
            <p className="text-white/40 text-sm sm:text-base">
              Tous les details, cote a cote.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 font-medium">Fonctionnalite</th>
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
              Questions frequentes
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
              { title: 'Pack 5 Films', price: '6.99', unit: '/5 films', desc: '5 film credits to use anytime. Never expires. ~€1.40/film.', badge: 'Save 30%' },
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
                <p className="text-3xl font-black text-amber-400 mt-2">€{opt.price}</p>
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
              Vous etes createur ?
            </h3>
            <p className="text-white/40 text-sm max-w-md">
              Tous les plans incluent l&apos;acces au studio de creation. Soumettez vos films, contribuez aux projets, et gagnez des revenus.
            </p>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium"
            >
              <Zap className="h-4 w-4" /> Explorer les taches disponibles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
