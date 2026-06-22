import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Coins, TrendingUp, Film, Clock, Shield,
  ArrowRight, Vote,
  Briefcase, Sparkles, CheckCircle2, Crown,
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  formatEur, getOfferingProgress, getTimeRemaining,
  RISK_LABELS, OFFERING_STATUS_LABELS,
} from '@/lib/tokenization'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Co-Production — Devenez Producteur de Cinema IA',
  description: 'Co-produisez des films IA des 10\u20AC. Tokens de co-production, revenus partages, votre nom au generique, gouvernance participative.',
}

// Sub-navigation tabs
function TokenizationNav({ active }: { active: string }) {
  const tabs = [
    { key: 'marketplace', label: 'Marketplace', href: '/tokenization', icon: Coins },
    { key: 'portfolio', label: 'Mon Portfolio', href: '/tokenization/portfolio', icon: Briefcase },
    { key: 'governance', label: 'Gouvernance', href: '/tokenization/governance', icon: Vote },
  ]

  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/10 w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
            active === tab.key
              ? 'bg-white/5 text-[#E50914] shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
              : 'text-white/50 hover:text-white/60'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default async function TokenizationMarketplacePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Fetch active offerings with their films
  const offerings = await prisma.filmTokenOffering.findMany({
    where: { status: { in: ['OPEN', 'FUNDED'] } },
    include: {
      film: true,
      _count: { select: { purchases: true, proposals: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Recently funded
  const recentlyFunded = await prisma.filmTokenOffering.findMany({
    where: { status: 'FUNDED' },
    include: { film: true },
    orderBy: { fundedAt: 'desc' },
    take: 4,
  })

  // Platform stats
  const totalRaised = await prisma.filmTokenOffering.aggregate({ _sum: { raised: true } })
  const totalOfferings = await prisma.filmTokenOffering.count({ where: { status: { in: ['OPEN', 'FUNDED'] } } })
  const totalInvestors = await prisma.filmTokenPurchase.groupBy({
    by: ['userId'],
    where: { status: 'CONFIRMED' },
  })

  const platformStats = {
    totalRaised: totalRaised._sum.raised || 0,
    activeOfferings: totalOfferings,
    totalInvestors: totalInvestors.length,
    avgROI: 18.5, // Demo value
  }

  return (
    <div className="space-y-10">
      {/* Sub-Nav */}
      <TokenizationNav active="marketplace" />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-amber-500/10 to-white/5 p-7 sm:p-9 lg:p-11">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/[0.06] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1 space-y-4">
            <Badge className="border-[#E50914]/20 bg-[#E50914]/10 text-[#E50914] text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Co-Production Cinematographique
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Co-Produisez le Cinema de Demain
            </h1>
            <p className="text-white/50 max-w-lg text-sm leading-relaxed">
              Chaque token est une part de co-production. Investissez des 10&#8364;,
              votez sur les decisions creatives, percevez des revenus, et voyez votre nom au generique.
            </p>
            {/* Key benefits row */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[
                { icon: Coins, label: 'Des 10\u20AC' },
                { icon: TrendingUp, label: 'Revenus partages' },
                { icon: Vote, label: 'Droit de vote' },
                { icon: Crown, label: 'Nom au generique' },
              ].map((b) => (
                <span key={b.label} className="inline-flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                  <b.icon className="h-3 w-3 text-[#E50914]" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 gap-5 lg:w-72">
            {[
              { label: 'Co-produit', value: formatEur(platformStats.totalRaised), color: 'text-[#E50914]' },
              { label: 'Films ouverts', value: platformStats.activeOfferings.toString(), color: 'text-blue-500' },
              { label: 'Co-producteurs', value: platformStats.totalInvestors.toString(), color: 'text-green-500' },
              { label: 'ROI moyen', value: `${platformStats.avgROI}%`, color: 'text-purple-500' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Offerings */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Films Ouverts a la Co-Production
          </h2>
          <span className="text-white/50 text-sm">{offerings.filter(o => o.status === 'OPEN').length} ouvertes</span>
        </div>

        {offerings.length === 0 ? (
          <div className="py-20 text-center bg-white/5 rounded-2xl border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
              <Sparkles className="h-8 w-8 text-[#E50914]/60" />
            </div>
            <p className="text-white/80 text-lg font-semibold mb-2">Aucune offre active pour le moment</p>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-6 px-4">De nouvelles opportunites de co-production arrivent bientot. Revenez regulierement pour decouvrir les prochains films ouverts.</p>
            <Link href="/films" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] text-white text-sm font-medium hover:bg-[#FF2D2D] transition-colors">
              <Film className="h-4 w-4" />
              Decouvrir les films en production
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map((offering) => {
              const progress = getOfferingProgress(offering)
              const timeLeft = getTimeRemaining(offering.closesAt)

              return (
                <Link key={offering.id} href={`/tokenization/${offering.filmId}`}>
                  <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:border-[#E50914]/30 hover:shadow-md transition-all h-full group overflow-hidden">
                    {/* Film Cover */}
                    <div className="relative h-36 bg-gradient-to-br from-amber-500/10 to-white/5 overflow-hidden">
                      {offering.film.coverImageUrl ? (
                        <img
                          src={offering.film.coverImageUrl}
                          alt={offering.film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {offering.status === 'FUNDED' && (
                        <Badge variant="success" className="absolute top-3 right-3 text-xs">
                          Financé
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-1">{offering.film.title}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <Progress value={progress} className="h-1.5" />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#E50914] text-sm font-semibold">{formatEur(offering.raised)}</span>
                          <span className="text-white/50 text-xs">/ {formatEur(offering.hardCap)}</span>
                        </div>
                      </div>

                      {/* ROI + Time */}
                      <div className="flex items-center justify-between text-xs">
                        {offering.projectedROI && (
                          <span className="text-green-500 font-medium">ROI ~{offering.projectedROI}%</span>
                        )}
                        <span className="text-white/50 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeLeft}
                        </span>
                      </div>

                      {/* CTA */}
                      {offering.status === 'OPEN' && (
                        <Button className="w-full min-h-[44px]">
                          <Coins className="h-4 w-4 mr-1" />
                          Co-Produire
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Recently Funded */}
      {recentlyFunded.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Co-Productions Financees
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyFunded.map((offering) => (
              <Link key={offering.id} href={`/tokenization/${offering.filmId}`}>
                <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:border-green-500/30 transition-all group p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-semibold truncate">{offering.film.title}</p>
                    <p className="text-green-500 text-xs">{formatEur(offering.raised)} levés</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section>
        <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] mb-5">
          Comment Devenir Co-Producteur
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Choisissez', desc: 'Parcourez les films ouverts a la co-production', icon: Film, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { title: 'Co-Produisez', desc: 'Tokens de co-production des 10\u20AC', icon: Coins, color: 'text-[#E50914]', bg: 'bg-amber-500/10' },
            { title: 'Decidez', desc: 'Votez sur les choix creatifs du film', icon: Vote, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { title: 'Gagnez', desc: 'Revenus partages + nom au generique', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#E50914]/20 hover:shadow-md transition-all duration-300">
              <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-white/50 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Disclaimer */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-xs text-white/50 hover:text-white/50 transition-colors list-none py-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Avertissement legal &amp; conformite reglementaire</span>
          <span className="text-[10px] ml-1 group-open:hidden">Cliquez pour lire</span>
        </summary>
        <div className="mt-2 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <p className="text-white/50 text-xs leading-relaxed">
            Les tokens de co-production proposes sur cette plateforme representent des parts de revenus futurs des films.
            L&apos;investissement dans des projets cinematographiques comporte des risques significatifs, incluant la perte totale du capital investi.
            Les offres sont emises dans le respect des cadres reglementaires applicables, incluant la conformite ISA pour les offres exemptees.
          </p>
          <p className="text-white/50 text-xs leading-relaxed">
            Consultez un conseiller financier agree avant tout investissement.
            Investissez uniquement des sommes que vous pouvez vous permettre de perdre.
            Les performances passees ne garantissent pas les resultats futurs.
          </p>
        </div>
      </details>
    </div>
  )
}
