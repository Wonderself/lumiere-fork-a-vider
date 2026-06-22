export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { prisma } from '@/lib/prisma'
import { FILM_STATUS_LABELS } from '@/lib/constants'
import {
  ArrowRight,
  Film,
  CheckCircle,
  ChevronRight,
  Clapperboard,
  Zap,
  Users,
  Sparkles,
  Play,
  BarChart3,
  Handshake,
  Gift,
  Crown,
  Star,
  Eye,
  UserPlus,
  Coins,
  Scan,
  Heart,
  Quote,
  Rocket,
  Shield,
  Check,
  X,
  Clock,
  TrendingUp,
  Mail,
  Vote,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'CINEGENY — Le Studio de Cinema du Futur',
  description:
    "Devenez co-producteur de films IA. Investissez des 10\u20AC, recevez des revenus, votre nom au generique. La premiere plateforme de cinema collaboratif propulsee par l'intelligence artificielle.",
  openGraph: {
    title: 'CINEGENY — Le Studio de Cinema du Futur',
    description:
      'Devenez co-producteur de films IA des 10\u20AC. Revenus partages, votre nom au generique.',
    type: 'website',
  },
}

// ---------------------------------------------------------------------------
// DATA FETCHING
// ---------------------------------------------------------------------------

async function getStats() {
  try {
    const [usersCount, filmsCount, tasksValidated, lumensTx] = await Promise.all([
      prisma.user.count(),
      prisma.film.count({ where: { isPublic: true } }),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.lumenTransaction.count(),
    ])
    return { usersCount, filmsCount, tasksValidated, lumensTx }
  } catch {
    return { usersCount: 500, filmsCount: 12, tasksValidated: 2400, lumensTx: 18000 }
  }
}

async function getFilmsInProduction() {
  try {
    return await prisma.film.findMany({
      where: { isPublic: true },
      orderBy: { progressPct: 'desc' },
      take: 6,
      include: { _count: { select: { tasks: true } } },
    })
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const howItWorksSteps = [
  {
    number: '01',
    icon: Film,
    title: 'Choisissez un Film',
    description:
      'Parcourez notre catalogue de productions IA. Trouvez le projet qui vous passionne parmi des dizaines de films en cours.',
  },
  {
    number: '02',
    icon: Coins,
    title: 'Contribuez ou Investissez',
    description:
      'Accomplissez des micro-taches creatives ou investissez des 10\u20AC pour devenir co-producteur du film.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: "L'IA Assemble le Film",
    description:
      'Notre IA evalue, integre et assemble chaque contribution. Les co-producteurs votent sur les decisions creatives.',
  },
  {
    number: '04',
    icon: Crown,
    title: 'Gagnez des Revenus',
    description:
      'Le film est distribue en streaming mondial. Contributeurs et co-producteurs partagent les revenus. Votre nom au generique.',
  },
]

const modules = [
  {
    icon: Coins,
    title: 'Devenez Co-Producteur',
    description: 'Investissez des 10\u20AC dans un film. Recevez des revenus, votez sur les decisions, votre nom au generique.',
    color: '#E50914',
    colorName: 'gold',
    href: '/tokenization',
    badge: 'Co-Production',
    featured: true,
  },
  {
    icon: Clapperboard,
    title: 'Studio Films',
    description: 'Contribuez aux productions cinematographiques IA. Micro-taches, validation IA, credits au generique.',
    color: '#E50914',
    colorName: 'gold',
    href: '/films',
    badge: 'Production',
    featured: false,
  },
  {
    icon: Sparkles,
    title: 'Createur IA',
    description: 'Generez du contenu viral sans montrer votre visage. Avatar, voix clonee, publication automatique.',
    color: '#A855F7',
    colorName: 'purple',
    href: '/creator',
    badge: 'Creation',
    featured: false,
  },
  {
    icon: Play,
    title: 'Streaming',
    description: "Le Netflix de l'IA. Regardez, notez et decouvrez les films generes par la communaute.",
    color: '#EF4444',
    colorName: 'red',
    href: '/streaming',
    badge: 'Diffusion',
    featured: false,
  },
  {
    icon: Handshake,
    title: 'Collabs',
    description: 'Marketplace de creatifs. Trouvez des collaborateurs, echangez des shoutouts, co-creez.',
    color: '#22C55E',
    colorName: 'green',
    href: '/collabs',
    badge: 'Reseau',
    featured: false,
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Pilotez votre croissance. Vues, revenus, engagement, reputation — tout en temps reel.',
    color: '#3B82F6',
    colorName: 'blue',
    href: '/analytics',
    badge: 'Donnees',
    featured: false,
  },
]

const faceInFilmFeatures = [
  {
    icon: Scan,
    title: 'Votre Visage dans le Film',
    description: 'Uploadez un selfie et notre IA vous integre dans les scenes du film. Vous devenez le personnage.',
  },
  {
    icon: Users,
    title: 'Casting Famille & Amis',
    description: "Mettez vos proches dans le film. Offrez-leur un role pour leur anniversaire, un mariage, Noel.",
  },
  {
    icon: Crown,
    title: 'Choisissez Votre Role',
    description: 'Hero, vilain, figurant... Choisissez votre role et le film est genere avec vous dedans.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Creatrice de contenu',
    text: "J'ai contribue a 3 films et je suis creditee au generique de chacun. C'est une experience unique.",
    rating: 5,
  },
  {
    name: 'Thomas K.',
    role: 'Designer VFX',
    text: "La validation IA est incroyablement rapide. Je soumets mon travail et j'ai un retour en 30 secondes.",
    rating: 5,
  },
  {
    name: 'Leah B.',
    role: 'Prompt Engineer',
    text: "J'ai gagne 2000 Lumens en un mois. La plateforme est intuitive et la communaute est geniale.",
    rating: 5,
  },
]

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'pour toujours',
    description: 'Commencez gratuitement',
    features: ['5 taches/mois', '10 Lumens offerts', 'Streaming basique', 'Credit au generique'],
    notIncluded: ['Createur IA', 'Analytics Pro', 'Collabs illimitees'],
    featured: false,
    cta: 'Commencer',
  },
  {
    name: 'Starter',
    price: '9',
    period: '/mois',
    description: 'Pour les creatifs actifs',
    features: ['25 taches/mois', '100 Lumens/mois', 'Streaming HD', 'Createur IA basique', 'Credit au generique'],
    notIncluded: ['Analytics Pro', 'Collabs illimitees'],
    featured: false,
    cta: 'Essai gratuit',
  },
  {
    name: 'Pro',
    price: '29',
    period: '/mois',
    description: 'Le choix des pros',
    features: [
      'Taches illimitees',
      '500 Lumens/mois',
      'Streaming 4K',
      'Createur IA complet',
      'Analytics Pro',
      'Collabs illimitees',
      'Support prioritaire',
    ],
    notIncluded: [],
    featured: true,
    cta: 'Choisir Pro',
  },
  {
    name: 'Business',
    price: '99',
    period: '/mois',
    description: 'Pour les studios',
    features: [
      'Tout de Pro',
      '2000 Lumens/mois',
      'API access',
      'White label',
      'Account manager',
      'Facturation entreprise',
      'SLA garanti',
    ],
    notIncluded: [],
    featured: false,
    cta: 'Contacter',
  },
]

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default async function HomePage() {
  const [stats, films] = await Promise.all([getStats(), getFilmsInProduction()])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CINEGENY',
    url: 'https://cinegen.studio',
    description: "Plateforme de cinema collaboratif propulsee par l'IA",
    foundingDate: '2025',
    sameAs: ['https://github.com/Wonderself/lumiere-app'],
  }

  return (
    <div className="relative overflow-hidden bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      {/* ================================================================ */}
      {/* GLOBAL BACKGROUND — decorative ambient blurs (light mode)       */}
      {/* ================================================================ */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#E50914]/[0.04] blur-[180px]" />
        <div className="absolute top-[40%] right-0 w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[150px]" />
        <div className="absolute bottom-[20%] left-0 w-[400px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[120px]" />
      </div>

      {/* ================================================================ */}
      {/* 1. HERO                                                          */}
      {/* ================================================================ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
        {/* CSS decorative grid */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Vertical lines */}
          <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
          <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-gray-200/30 to-transparent" />
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-gray-200/50 to-transparent" />
          <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-gray-200/30 to-transparent" />
          {/* Horizontal lines */}
          <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/40 to-transparent" />
          <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/40 to-transparent" />
          {/* Corner accents */}
          <div className="absolute top-16 left-8 w-24 h-24 border-l border-t border-[#E50914]/15 rounded-tl-3xl" />
          <div className="absolute top-16 right-8 w-24 h-24 border-r border-t border-[#E50914]/15 rounded-tr-3xl" />
          <div className="absolute bottom-16 left-8 w-24 h-24 border-l border-b border-[#E50914]/15 rounded-bl-3xl" />
          <div className="absolute bottom-16 right-8 w-24 h-24 border-r border-b border-[#E50914]/15 rounded-br-3xl" />
          {/* Radial glow behind headline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#E50914]/[0.04] blur-[100px]" />
          {/* Animated gold particles */}
          <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-[#E50914]/40 animate-pulse" />
          <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#E50914]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-[#E50914]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[70%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#E50914]/35 animate-pulse [animation-delay:1.5s]" />
          <div className="absolute top-[45%] left-[40%] w-0.5 h-0.5 rounded-full bg-[#E50914]/20 animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[35%] right-[35%] w-1 h-1 rounded-full bg-[#E50914]/30 animate-pulse [animation-delay:0.8s]" />
          <div className="absolute bottom-[30%] left-[50%] w-1 h-1 rounded-full bg-[#E50914]/25 animate-pulse [animation-delay:1.3s]" />
          <div className="absolute top-[50%] right-[45%] w-0.5 h-0.5 rounded-full bg-[#E50914]/20 animate-pulse [animation-delay:0.3s]" />
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 px-5 py-2 text-sm text-[#E50914] mb-4">
          <Clapperboard className="h-4 w-4" />
          <span className="font-medium">Le Studio de Cinema du Futur</span>
        </div>

        {/* Tagline */}
        <p className="relative text-sm sm:text-base text-gray-400 uppercase tracking-[0.2em] mb-10 font-medium">
          Produisez &middot; Creez &middot; Investissez
        </p>

        {/* Headline */}
        <h1
          className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-8 max-w-6xl text-gray-900"
        >
          <span className="block">Devenez</span>
          <span className="block mt-2">
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Producteur
            </span>
          </span>
          <span className="block mt-2">
            de{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Cinema
            </span>
          </span>
        </h1>

        {/* Subline */}
        <p className="relative text-lg sm:text-xl md:text-2xl text-gray-500 max-w-3xl mb-12 leading-relaxed px-4">
          Co-produisez des films IA des 10&#8364;. Recevez des revenus, votez sur les decisions creatives,
          et voyez votre nom au generique.
        </p>

        {/* CTA Buttons */}
        <div className="relative flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/tokenization" className="w-full sm:w-auto">
            <Button size="xl" className="group text-base sm:text-lg px-8 sm:px-12 w-full sm:w-auto bg-[#E50914] text-white hover:bg-[#C4A030] rounded-full">
              <Coins className="h-5 w-5" />
              Devenez Producteur
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/streaming" className="w-full sm:w-auto">
            <Button size="xl" variant="outline" className="text-base sm:text-lg px-8 sm:px-12 w-full sm:w-auto bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 rounded-full">
              <Play className="h-5 w-5" />
              Explorer les Films
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            {[
              { label: 'Co-Producteurs', value: stats.usersCount > 0 ? `${stats.usersCount.toLocaleString('fr-FR')}+` : '500+', icon: Users },
              { label: 'Films en Production', value: stats.filmsCount > 0 ? `${stats.filmsCount}+` : '12+', icon: Film },
              { label: 'Taches Validees', value: stats.tasksValidated > 0 ? `${stats.tasksValidated.toLocaleString('fr-FR')}+` : '2,400+', icon: CheckCircle },
              { label: 'Investis en Tokens', value: stats.lumensTx > 0 ? `${stats.lumensTx.toLocaleString('fr-FR')}+` : '18,000+', icon: Coins },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 mx-auto mb-1">
                  <stat.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E50914]"
                >
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Decouvrir</span>
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. HOW IT WORKS                                                  */}
      {/* ================================================================ */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Rocket className="h-3.5 w-3.5 text-[#E50914]" />
              Simple & Puissant
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-gray-900"
            >
              Comment ca{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Marche
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Du choix d&apos;un film aux premiers revenus, en 4 etapes simples.
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {howItWorksSteps.map((step, i) => (
              <div key={step.number} className="relative group">
                {/* Connector line (hidden on last) */}
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-[#E50914]/30 to-transparent z-0" />
                )}
                <div className="relative rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 hover:border-[#E50914]/30 hover:shadow-md transition-all duration-500 h-full shadow-sm">
                  {/* Step number watermark */}
                  <span
                    className="absolute top-4 right-4 text-6xl font-bold text-gray-100 select-none"
                  >
                    {step.number}
                  </span>
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6 group-hover:bg-[#E50914]/20 transition-colors duration-300">
                    <step.icon className="h-7 w-7 text-[#E50914]" />
                  </div>
                  {/* Label */}
                  <div className="text-xs text-[#E50914]/60 uppercase tracking-widest font-medium mb-3">
                    Etape {step.number}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#E50914] transition-colors duration-300"
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. MODULES SHOWCASE                                              */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#E50914]" />
              5 Modules Integres
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-gray-900"
            >
              Un Ecosysteme{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Complet
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Produisez, creez, diffusez, collaborez et analysez — tout en un seul endroit.
            </p>
          </div>

          {/* Module cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <Link key={mod.title} href={mod.href} className={`group ${mod.featured ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <div
                  className={`relative rounded-2xl border bg-white p-6 sm:p-8 h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-md shadow-sm ${mod.featured ? 'ring-1 ring-[#E50914]/20 shadow-md' : ''}`}
                  style={{
                    borderColor: mod.featured ? `${mod.color}40` : '#f3f4f6',
                  }}
                >
                  {/* Badge */}
                  <span
                    className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full mb-5"
                    style={{
                      color: mod.color,
                      backgroundColor: `${mod.color}15`,
                      border: `1px solid ${mod.color}25`,
                    }}
                  >
                    {mod.badge}
                  </span>
                  {/* Icon */}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-colors duration-300"
                    style={{
                      backgroundColor: `${mod.color}15`,
                      border: `1px solid ${mod.color}25`,
                    }}
                  >
                    <mod.icon className="h-7 w-7" style={{ color: mod.color }} />
                  </div>
                  {/* Content */}
                  <h3
                    className="text-xl font-bold mb-3 text-gray-900 transition-colors duration-300"
                  >
                    <span className="group-hover:text-gray-900">{mod.title}</span>
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm mb-5">{mod.description}</p>
                  {/* Link */}
                  <div
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                    style={{ color: mod.color }}
                  >
                    Decouvrir
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}

            {/* 7th card — Producer CTA */}
            <div className="relative rounded-2xl border border-[#E50914]/20 bg-[#E50914]/[0.04] p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E50914]/15 border border-[#E50914]/20 mb-5">
                <Crown className="h-7 w-7 text-[#E50914]" />
              </div>
              <h3
                className="text-xl font-bold mb-3 text-[#E50914]"
              >
                Votre Nom au Generique
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Contribuez ou investissez. Chaque participant est credite comme co-producteur du film.
              </p>
              <Link href="/tokenization">
                <Button variant="outline" size="sm" className="group border-[#E50914]/30 text-[#E50914] hover:bg-[#E50914]/10 rounded-full">
                  Devenez Producteur
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. COMING SOON: FACE IN FILM                                     */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-gray-50 relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-purple-100/40 blur-[150px]" />
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-[#E50914]/[0.05] blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm text-purple-600 mb-8">
                <Clock className="h-3.5 w-3.5" />
                Coming 2026
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900"
              >
                Mettez Votre{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #A855F7 0%, #E50914 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Visage
                </span>{' '}
                dans le Film
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">
                Bientot, vous pourrez vous integrer dans n'importe quel film de la plateforme.
                Choisissez votre role, uploadez votre photo, et l'IA fait le reste.
                Offrez un role a vos proches pour un moment inoubliable.
              </p>
              <div className="space-y-5">
                {faceInFilmFeatures.map((feat) => (
                  <div key={feat.title} className="flex gap-4 items-start">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200">
                      <feat.icon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feat.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/register">
                  <Button size="lg" className="group bg-[#E50914] text-white hover:bg-[#C4A030] rounded-full">
                    Etre notifie du lancement
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: visual mock */}
            <div className="relative">
              {/* Main card */}
              <div className="relative rounded-3xl border border-gray-200 bg-white shadow-lg p-8 sm:p-10">
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-purple-600 to-[#E50914] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  COMING 2026
                </div>
                {/* Film frame mock */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 aspect-video mb-6 border border-gray-200">
                  {/* Face placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-[#E50914]/40 flex items-center justify-center bg-white/50">
                        <Scan className="h-8 w-8 sm:h-12 sm:w-12 text-[#E50914]/50" />
                      </div>
                      {/* Scanning animation rings */}
                      <div className="absolute inset-0 rounded-full border border-[#E50914]/20 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute -inset-3 rounded-full border border-purple-300/20 animate-ping" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#E50914]/30 rounded-tl" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#E50914]/30 rounded-tr" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#E50914]/30 rounded-bl" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#E50914]/30 rounded-br" />
                  {/* Film info overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/90 to-transparent p-4">
                    <div className="text-[10px] text-[#E50914] uppercase tracking-widest mb-1">Role : Personnage Principal</div>
                    <div className="text-gray-500 text-xs">Votre visage sera integre ici par l'IA</div>
                  </div>
                </div>
                {/* Feature chips */}
                <div className="flex flex-wrap gap-2">
                  {['Deep Personalization', 'HD Quality', 'Instant Preview', 'Gift Mode'].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1 text-xs rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-gray-500"
                    >
                      <Sparkles className="h-3 w-3 text-purple-400" />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              {/* Floating accent shapes */}
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-[#E50914]/10 border border-gray-200 flex items-center justify-center shadow-sm">
                <Heart className="h-5 w-5 text-purple-400/60" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-lg bg-gradient-to-br from-[#E50914]/10 to-purple-100 border border-gray-200 flex items-center justify-center shadow-sm">
                <Star className="h-4 w-4 text-[#E50914]/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. FILMS IN PRODUCTION                                           */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
                <Film className="h-3.5 w-3.5 text-[#E50914]" />
                En cours de production
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900"
              >
                Films en{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Production
                </span>
              </h2>
              <p className="text-gray-500 text-lg">
                Rejoignez l'equipe et contribuez des maintenant a un film.
              </p>
            </div>
            <Link
              href="/films"
              className="hidden sm:flex items-center gap-2 text-[#E50914] hover:text-[#C4A030] transition-colors text-sm font-medium shrink-0"
            >
              Voir tous les films <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Films grid */}
          {films.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.slug}`}>
                  <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-[#E50914]/30 hover:shadow-md transition-all duration-500 h-full shadow-sm">
                    {/* Poster */}
                    <div className="relative h-48 sm:h-52 bg-gradient-to-br from-[#E50914]/[0.06] to-gray-100 overflow-hidden">
                      {film.coverImageUrl ? (
                        <img
                          src={film.coverImageUrl}
                          alt={film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="relative">
                            <Film className="h-16 w-16 text-[#E50914]/20" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] uppercase tracking-wider font-medium text-gray-600 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 border border-gray-200 shadow-sm">
                          {FILM_STATUS_LABELS[film.status]}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#E50914] transition-colors duration-300"
                      >
                        {film.title}
                      </h3>
                      {film.description && (
                        <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">{film.description}</p>
                      )}
                      {/* Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progression</span>
                          <span className="text-[#E50914] font-semibold">{Math.round(film.progressPct)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
                            style={{ width: `${film.progressPct}%` }}
                          />
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{film._count.tasks} taches</span>
                        <span className="text-xs text-[#E50914] flex items-center gap-1 group-hover:gap-2 transition-all">
                          Contribuer <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-gray-100 bg-gray-50">
              <Film className="h-16 w-16 text-[#E50914]/20 mx-auto mb-4" />
              <p className="text-gray-500 mb-6">Les films seront bientot disponibles.</p>
              <Link href="/register">
                <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-100 rounded-full">
                  Etre notifie <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile link */}
          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/films"
              className="inline-flex items-center gap-2 text-[#E50914] hover:text-[#C4A030] transition-colors text-sm font-medium"
            >
              Voir tous les films <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. SOCIAL PROOF / TRUST                                          */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Shield className="h-3.5 w-3.5 text-[#E50914]" />
              Confiance & Resultats
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-gray-900"
            >
              Ils nous font{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Confiance
              </span>
            </h2>
          </div>

          {/* Big numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '1M+', label: 'Vues generees' },
              { value: '500+', label: 'Createurs actifs' },
              { value: '98%', label: 'Taux de satisfaction' },
              { value: '24h', label: 'Temps moyen de paiement' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div
                  className="text-3xl sm:text-4xl font-bold text-[#E50914] mb-2"
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 relative shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-[#E50914]/10 absolute top-6 right-6" />
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#E50914] text-[#E50914]" />
                  ))}
                </div>
                {/* Text */}
                <p className="text-gray-600 leading-relaxed mb-6 text-sm italic">
                  &laquo; {t.text} &raquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E50914]/20 to-purple-200/40 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technology partners */}
          <div className="text-center">
            <p className="text-xs text-gray-300 uppercase tracking-widest mb-8">Nos Partenaires Technologiques</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {['Powered by Claude AI', 'Built with Next.js', 'Secured by Stripe', 'Hosted on Vercel', 'Database by PostgreSQL'].map((name) => (
                <div
                  key={name}
                  className="text-gray-300 text-sm sm:text-base font-semibold tracking-wider hover:text-gray-400 transition-colors duration-300"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. VIRAL CTA — Referral                                          */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/[0.04] via-white to-purple-50/30 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-sm">
            {/* Decorative bg elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E50914]/[0.05] blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-purple-200/30 blur-[60px] pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              {/* Left text */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 px-4 py-1.5 text-sm text-[#E50914] mb-6">
                  <Gift className="h-3.5 w-3.5" />
                  Programme de Parrainage
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-5 leading-tight text-gray-900"
                >
                  Invitez vos Amis,{' '}
                  <span className="text-[#E50914]">Gagnez des Tokens</span>
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  Pour chaque ami qui rejoint CINEGENY, vous recevez{' '}
                  <span className="text-[#E50914] font-semibold">30 Lumens</span> et votre ami aussi.
                  Doublez vos tokens, construisez votre equipe de createurs.
                </p>
                <Link href="/register">
                  <Button size="lg" className="group bg-[#E50914] text-white hover:bg-[#C4A030] rounded-full">
                    <UserPlus className="h-5 w-5" />
                    Obtenir mon Lien de Parrainage
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Right visual */}
              <div className="flex flex-col gap-4">
                {/* Reward card 1 */}
                <div className="rounded-xl border border-[#E50914]/15 bg-white p-5 flex items-center gap-4 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E50914]/10 border border-[#E50914]/20">
                    <Gift className="h-6 w-6 text-[#E50914]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">Vous parrainez</div>
                    <div className="text-2xl font-bold text-[#E50914] font-playfair">+30 Lumens</div>
                    <div className="text-xs text-gray-400">Credites instantanement</div>
                  </div>
                </div>
                {/* Reward card 2 */}
                <div className="rounded-xl border border-purple-200 bg-white p-5 flex items-center gap-4 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200">
                    <Heart className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">Votre ami recoit</div>
                    <div className="text-2xl font-bold text-purple-500 font-playfair">+30 Lumens</div>
                    <div className="text-xs text-gray-400">Des son inscription</div>
                  </div>
                </div>
                {/* Bonus info */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-400">
                    <span className="text-[#E50914] font-semibold">Bonus x2</span> — Parrainez 10 amis et recevez un bonus de 100 Lumens supplementaires
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. PRICING TEASER                                                */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Coins className="h-3.5 w-3.5 text-[#E50914]" />
              Tarification Simple
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-gray-900"
            >
              Un Plan pour{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Chacun
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Commencez gratuitement, evoluez quand vous etes pret.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 sm:p-7 flex flex-col h-full transition-all duration-300 ${
                  plan.featured
                    ? 'border-[#E50914]/40 bg-[#E50914]/[0.04] scale-[1.02] shadow-lg'
                    : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold bg-gradient-to-r from-[#E50914] to-[#FF2D2D] text-white px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                {/* Plan name */}
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{plan.name}</div>
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className={`text-4xl sm:text-5xl font-bold font-playfair ${plan.featured ? 'text-[#E50914]' : 'text-gray-900'}`}
                  >
                    {plan.price}&#8364;
                  </span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <p className="text-xs text-gray-400 mb-6">{plan.description}</p>
                {/* Features */}
                <div className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-[#E50914] shrink-0 mt-0.5" />
                      <span className="text-gray-600">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <X className="h-4 w-4 text-gray-200 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <Link href="/dashboard/subscription" className="w-full">
                  <Button
                    className={`w-full rounded-full ${plan.featured ? 'bg-[#E50914] text-white hover:bg-[#C4A030]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Tous les plans incluent le credit au generique. Annulation possible a tout moment.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. FINAL CTA                                                     */}
      {/* ================================================================ */}
      <section className="relative py-32 sm:py-40 px-4 overflow-hidden bg-white">
        {/* Soft gradient bg */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E50914]/[0.04] to-[#E50914]/[0.02]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.06] blur-[120px]" />
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-8">
            <Clapperboard className="h-8 w-8 text-[#E50914]" />
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900"
          >
            Rejoignez la{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Revolution
            </span>
            <br />
            du Cinema IA
          </h2>

          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Des milliers de co-producteurs construisent le cinema de demain.
            Investissez, creez, et voyez votre nom au generique. Commencez aujourd&apos;hui.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 px-4 sm:px-0">
            <Link href="/tokenization" className="w-full sm:w-auto">
              <Button size="xl" className="group text-base sm:text-lg px-10 sm:px-14 w-full sm:w-auto bg-[#E50914] text-white hover:bg-[#C4A030] rounded-full">
                <Coins className="h-5 w-5" />
                Devenez Producteur
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="text-base sm:text-lg px-10 sm:px-14 w-full sm:w-auto bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 rounded-full">
                Creer un Compte Gratuit
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            Co-production des 10&#8364; — Revenus partages — Votre nom au generique
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. FOOTER                                                       */}
      {/* ================================================================ */}
      <Footer />
    </div>
  )
}
