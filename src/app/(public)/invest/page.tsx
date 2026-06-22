import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { FILMS_BY_GENRE } from '@/data/films'
import {
  TrendingUp,
  Film,
  Shield,
  Globe,
  Cpu,
  Users,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  BookOpen,
  Landmark,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Investisseurs — CINEGENY',
  description:
    'Investissez dans le cinema de demain. CINEGENY : studio IA, micro-taches collaboratives, tokenisation blockchain.',
}

const highlights = [
  { value: '25K€', label: 'Budget moyen par film', icon: Film },
  { value: '20+', label: 'Films en pipeline', icon: BarChart3 },
  { value: '500+', label: 'Micro-taches par film', icon: Zap },
  { value: '3', label: 'Continents couverts', icon: Globe },
]

const advantages = [
  {
    icon: Cpu,
    title: 'IA comme levier de production',
    desc: "Notre workflow proprietaire utilise l'IA pour reduire les couts de production de 95% par rapport a Hollywood, tout en maintenant une qualite cinematographique.",
  },
  {
    icon: Users,
    title: 'Communaute de contributeurs',
    desc: "Plus de 500 micro-taches par film, realisees par une communaute mondiale de createurs. Chaque contribution est validee par IA + humain.",
  },
  {
    icon: Shield,
    title: 'Blockchain & Tracabilite',
    desc: "Chaque contribution hashee SHA-256 et horodatee. Pret pour la tokenisation sur Ethereum : co-production, gouvernance, revenus partages.",
  },
  {
    icon: BookOpen,
    title: 'IP co-detenue (Editions Ruppin)',
    desc: "Participation de 33% dans Editions Ruppin. First-look deal exclusif sur chaque biographie et recit historique. Pipeline book-to-screen integre.",
  },
  {
    icon: TrendingUp,
    title: 'Double moteur de croissance',
    desc: "Studio Services (cash-flow court terme via commerciaux pour marques) + Original Pictures (IP long terme via films originaux). Deux flux de revenus complementaires.",
  },
  {
    icon: Landmark,
    title: 'Cadre legal structure',
    desc: "Israeli Ltd (holding). Delaware C-Corp planned for US acquisition. Ethereum-based tokenization. Advisory Board FinTech & Legal.",
  },
]

const timeline = [
  { phase: 'Phase 1', title: 'Plateforme & Pipeline', desc: '20 films en pre-production, communaute active, IA operationnelle', status: 'done' },
  { phase: 'Phase 2', title: 'Premiers Films', desc: 'Sortie des 3 premiers films, streaming en ligne, premieres revenues', status: 'current' },
  { phase: 'Phase 3', title: 'Tokenisation', desc: 'Lancement des tokens film sur Ethereum, co-production decentralisee', status: 'next' },
  { phase: 'Phase 4', title: 'Scale International', desc: 'Distribution mondiale, partenariats Hollywood, 50+ films par an', status: 'next' },
]

export default function InvestPage() {
  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#E50914]/[0.02] blur-[200px]" />
        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#E50914]/15 bg-[#E50914]/[0.06] text-[#E50914] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            Investisseurs & Partenaires
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Investissez dans le{' '}
            <span className="text-shimmer">Cinema de Demain</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-10">
            CINEGENY reinvents film production with AI,
            la blockchain et une communaute mondiale de createurs.
          </p>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-center"
              >
                <h.icon className="h-5 w-5 text-[#E50914] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#E50914]">{h.value}</div>
                <div className="text-xs text-white/35 mt-1">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMENT CA MARCHE ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-playfair text-center">Comment investir</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: '1', title: 'Choisissez', desc: 'Parcourez notre catalogue et selectionnez un film qui vous inspire.' },
              { step: '2', title: 'Investissez', desc: 'A partir de 10€. Achetez des tokens de co-production.' },
              { step: '3', title: 'Suivez', desc: 'Accedez aux coulisses et votez sur les decisions creatives.' },
              { step: '4', title: 'Recevez', desc: 'Touchez votre part des revenus du film.' },
            ].map((s) => (
              <div key={s.step} className="relative text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-10 h-10 rounded-full bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center mx-auto mb-3 text-[#E50914] font-bold text-lg">{s.step}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ FILMS OUVERTS ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-playfair">Films ouverts a l&apos;investissement</h2>
          <p className="text-sm text-white/40 mb-8">Selectionnez un film et devenez co-producteur.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(FILMS_BY_GENRE).flat().filter(f => f.fundingPct < 100).slice(0, 6).map((film) => (
              <Link key={film.slug} href={`/films/${film.slug}`} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#E50914]/20 transition-all duration-300">
                <div className="relative h-32 bg-[#141414]">
                  {film.coverImageUrl && <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="text-xs font-bold text-white">{film.title}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                    <span>{film.genre}</span>
                    <span className="text-emerald-400 font-bold">{film.fundingPct}% finance</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${Math.min(film.fundingPct, 100)}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ POURQUOI INVESTIR ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Pourquoi Investir
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            >
              Un Modele <span className="text-gold-gradient">Unique au Monde</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto">
              La combinaison IA + micro-taches + blockchain cree un avantage competitif ineditable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv) => (
              <div
                key={adv.title}
                className="group p-7 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                  <adv.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{adv.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ COMPARAISON MARCHE ═══ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Comparaison
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              CINEGENY vs The <span className="text-gold-gradient">Market</span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-white/40 font-medium" />
                  <th className="p-4 text-white/40 font-medium text-center">Hollywood</th>
                  <th className="p-4 text-white/40 font-medium text-center">Netflix</th>
                  <th className="p-4 text-center font-bold text-[#E50914] bg-[#E50914]/[0.05]">CINEGENY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ['Budget moyen', '$50-200M', '$5-30M', '25K€'],
                  ['Delai production', '2-5 ans', '1-2 ans', '3-6 mois'],
                  ['Participation', 'Fermee', 'Fermee', 'Ouverte a tous'],
                  ['IA', 'Minimale', 'Recommandation', 'Production integrale'],
                  ['Blockchain', 'Non', 'Non', 'Tracabilite totale'],
                  ['Partage revenus', 'Studios only', 'Netflix only', 'Tous les contributeurs'],
                ].map(([label, hollywood, netflix, cinegeny]) => (
                  <tr key={label}>
                    <td className="p-4 text-white/60 font-medium">{label}</td>
                    <td className="p-4 text-white/30 text-center">{hollywood}</td>
                    <td className="p-4 text-white/30 text-center">{netflix}</td>
                    <td className="p-4 text-[#E50914] text-center font-semibold bg-[#E50914]/[0.03]">
                      {cinegeny}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ TIMELINE ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Feuille de Route
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              <span className="text-gold-gradient">Ou en Sommes-Nous</span>
            </h2>
          </div>

          <div className="space-y-4">
            {timeline.map((step, i) => (
              <div
                key={step.phase}
                className={`flex gap-5 p-6 rounded-2xl border transition-all duration-300 ${
                  step.status === 'done'
                    ? 'border-green-500/20 bg-green-500/[0.03]'
                    : step.status === 'current'
                      ? 'border-[#E50914]/20 bg-[#E50914]/[0.05]'
                      : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'done'
                        ? 'bg-green-500/20 text-green-400'
                        : step.status === 'current'
                          ? 'bg-[#E50914]/20 text-[#E50914]'
                          : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {step.status === 'done' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px h-full min-h-[20px] bg-white/[0.06] mt-2" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                      {step.phase}
                    </span>
                    {step.status === 'current' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold">
                        EN COURS
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-white/40">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ FAQ ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-playfair text-center">Questions frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Quel est le montant minimum pour investir ?', a: 'Vous pouvez investir a partir de 10\u20AC en achetant des tokens de co-production. Chaque token represente une part du film.' },
              { q: 'Comment sont distribues les revenus ?', a: 'Les revenus sont partages proportionnellement au nombre de tokens detenus. Les distributions sont effectuees apres chaque exploitation (streaming, ventes, festivals).' },
              { q: 'Quel est le cadre juridique ?', a: 'CINEGENY is an Israeli Ltd with a planned Delaware C-Corp for US market. Investments are governed by Israeli securities law with blockchain traceability on Ethereum.' },
              { q: 'Quand vais-je recevoir des retours ?', a: 'Les premiers retours arrivent generalement 12 a 18 mois apres la fin de production, lors de la phase d\'exploitation commerciale.' },
              { q: 'Puis-je revendre mes tokens ?', a: 'Oui, les tokens seront echangeables sur notre marketplace des l\'ouverture de la phase de tokenisation (voir roadmap).' },
              { q: 'Mon investissement est-il garanti ?', a: 'Comme tout investissement dans la creation, il comporte des risques. Cependant, notre modele de production IA reduit les couts de 95% par rapport a Hollywood, limitant significativement le risque.' },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-white hover:text-[#E50914] transition-colors">
                  {faq.q}
                  <span className="text-white/30 group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ SECURITE & CADRE JURIDIQUE ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Securite
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Cadre <span className="text-gold-gradient">Juridique & Technique</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Landmark, title: 'Israeli Ltd', desc: 'Holding company registered in Israel. Delaware C-Corp planned for US market and acquisition.' },
              { icon: Shield, title: 'Utility Tokens', desc: 'Non-transferable utility tokens on Ethereum. No resale — platform buyback only. Self-executing smart contracts.' },
              { icon: Cpu, title: 'Blockchain', desc: 'Every transaction and contribution tracked on Ethereum. Immutable and verifiable.' },
              { icon: BookOpen, title: 'Israeli Securities', desc: 'Investment process compliant with ISA (Israel Securities Authority) guidelines. Delaware Corp planned for US investors.' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] text-center">
            <p className="text-sm text-white/50">
              <span className="text-emerald-400 font-semibold">100% tracable</span> — Chaque euro investi est suivi sur la blockchain.
              Rapports trimestriels, dashboard investisseur en temps reel, et audit externe annuel.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ CHIFFRES CLES ═══ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-5xl relative">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 font-playfair text-center">Le Cinema en Chiffres</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '$100B+', label: 'Marche mondial du cinema', sub: 'En croissance de 8% par an' },
              { value: '95%', label: 'Reduction des couts IA', sub: 'vs production traditionnelle' },
              { value: '6 mois', label: 'Cycle de production', sub: 'vs 2-5 ans en moyenne' },
              { value: '∞', label: 'Scalabilite', sub: 'Pas de limite physique' },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <div className="text-3xl font-bold text-[#E50914] mb-1">{stat.value}</div>
                <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                <div className="text-[10px] text-white/30 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Parlons de{' '}
            <span className="text-shimmer">Votre Investissement</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Que vous soyez investisseur, partenaire ou distributeur, nous serions ravis
            d&apos;echanger sur les opportunites de collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:invest@cinegeny.studio"
              className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
            >
              Nous Contacter
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              En savoir plus sur l&apos;equipe
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/20">
            invest@cinegeny.studio &middot; Paris &middot; Jerusalem
          </p>
        </div>
      </section>
    </div>
  )
}
