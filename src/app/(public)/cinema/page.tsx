import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import {
  ArrowRight,
  Star,
  Users,
  Film,
  CheckCircle,
  ChevronRight,
  Zap,
  Shield,
  Sparkles,
  Play,
  Palette,
  Camera,
  Mic,
  Wand2,
  Layers,
  Globe,
  Award,
  Eye,
  Infinity,
} from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

async function getStats() {
  const { getCached } = await import('@/lib/redis')
  return getCached('stats:cinema', async () => {
    try {
      const [filmsCount, tasksCount, usersCount, availableTasks] = await Promise.all([
        prisma.film.count({ where: { isPublic: true } }),
        prisma.task.count({ where: { status: 'VALIDATED' } }),
        prisma.user.count({ where: { isVerified: true } }),
        prisma.task.count({ where: { status: 'AVAILABLE' } }),
      ])
      return { filmsCount, tasksCount, usersCount, availableTasks }
    } catch {
      return { filmsCount: 5, tasksCount: 200, usersCount: 50, availableTasks: 30 }
    }
  }, 300)
}

async function getPublicFilms() {
  const { getCached } = await import('@/lib/redis')
  return getCached('films:public:top3', async () => {
    try {
      return await prisma.film.findMany({
        where: { isPublic: true },
        orderBy: { progressPct: 'desc' },
        take: 3,
        include: { _count: { select: { tasks: true } } },
      })
    } catch {
      return []
    }
  }, 300)
}

const steps = [
  {
    number: '01',
    icon: Film,
    title: 'Choisissez une Tache',
    description: 'Parcourez le catalogue de taches creatives par film, type, ou niveau de difficulte. Prompt writing, design, audio, VFX, cascade...',
  },
  {
    number: '02',
    icon: Star,
    title: 'Realisez & Soumettez',
    description: "Acceptez la tache et livrez votre travail dans les 48h. L'IA evalue votre soumission instantanement avec un retour detaille.",
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Soyez Paye Instantanement',
    description: 'Tache validee = paiement immediat. 50EUR, 100EUR ou 500EUR par tache selon la difficulte. Stripe ou Bitcoin Lightning.',
  },
]

const services = [
  {
    icon: Play,
    title: 'Bandes-Annonces IA',
    description: 'Creation de trailers cinematiques generes par intelligence artificielle, avec montage professionnel et sound design.',
  },
  {
    icon: Palette,
    title: 'Affiches de Film',
    description: "Design d'affiches de qualite studio, du concept a la finalisation. Styles multiples : realiste, animation, artistique.",
  },
  {
    icon: Camera,
    title: 'Votre Visage dans le Film',
    description: 'Integration de votre visage dans nos productions grace a la technologie IA. Devenez acteur de notre univers cinematique.',
  },
  {
    icon: Eye,
    title: 'Plateforme de Streaming',
    description: 'Accedez a notre catalogue de films IA finalises. Regardez, votez, et participez aux concours communautaires.',
  },
]

const genres = [
  { name: 'Animation 3D & Stop-Motion', desc: "Qualite studio d'animation mondial" },
  { name: 'Horreur & Thriller', desc: 'Profondeur psychologique et texture' },
  { name: 'Films Historiques IA', desc: "Recreation realiste d'epoques passees" },
  { name: 'Science-Fiction', desc: 'Univers futuristes immersifs' },
  { name: 'Restauration de Films', desc: 'Redonner vie aux classiques du cinema' },
  { name: 'Hybride Live + IA', desc: 'Acteurs reels dans des environnements IA' },
]

const features = [
  { icon: Zap, title: 'Validation IA Instantanee', description: "Chaque soumission est evaluee par l'IA en temps reel. Feedback immediat, paiement rapide." },
  { icon: Shield, title: 'Paiements Securises', description: "Stripe, Lightning Bitcoin — choisissez votre mode de paiement. Funds en escrow jusqu'a validation." },
  { icon: Users, title: 'Communaute Creative', description: 'Montez en niveau, gagnez des badges, apparaissez au generique des films. Du ROOKIE au VIP.' },
  { icon: Sparkles, title: 'IA qui Dirige', description: '"We don\'t prompt. We direct AI." Notre workflow maison s\'ameliore chaque jour grace a notre systeme proprietaire.' },
  { icon: Globe, title: 'Paris · Tel Aviv · Hollywood', description: "Un studio tri-continental avec l'agilite de la Silicon Valley et la rigueur du systeme studio." },
  { icon: Award, title: 'IP & Equity', description: "Partenariat avec Editions Ruppin : acces prioritaire aux biographies et recits historiques pour le book-to-screen." },
]

export default async function CinemaPage() {
  const [stats, films] = await Promise.all([getStats(), getPublicFilms()])

  return (
    <div className="relative overflow-hidden film-grain">
      {/* Fixed ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#E50914]/[0.04] blur-[200px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-purple-900/[0.06] blur-[180px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[150px]" />
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/cinema-clapperboard-clouds-hero.webp"
            alt="CINEGENY Studio - Le studio de demain"
            fill
            className="object-cover opacity-15"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>

        {/* Gold particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[25%] left-[18%] w-1 h-1 rounded-full bg-[#E50914]/40 particle" />
          <div className="absolute top-[35%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#E50914]/30 particle particle-delay-1" />
          <div className="absolute top-[55%] left-[30%] w-1 h-1 rounded-full bg-[#E50914]/25 particle particle-delay-2" />
          <div className="absolute top-[45%] right-[15%] w-1 h-1 rounded-full bg-[#FF2D2D]/30 particle particle-delay-3" />
          <div className="absolute top-[65%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#E50914]/20 particle particle-delay-4" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E50914]/20 bg-[#E50914]/[0.06] px-5 sm:px-6 py-2.5 text-xs sm:text-sm text-[#E50914] mb-8 sm:mb-10 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium">Cinema IA — Paris · Tel Aviv · Hollywood</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.92] mb-7 sm:mb-9 max-w-5xl tracking-tight"
          >
            Le Studio de{' '}
            <span className="text-shimmer">Demain.</span>
            <br />
            <span className="text-white/90">Ouvert </span>
            <span className="text-shimmer">Aujourd&apos;hui.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed">
            Contribuez a des films IA revolutionnaires. Choisissez vos taches creatives,
            livrez votre talent, et soyez paye instantanement. De l&apos;horreur a l&apos;animation,
            du biopic au thriller — <span className="text-white/60">nous dirigeons l&apos;IA, nous ne promptons pas.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-20 sm:mb-24">
            <Link href="/register">
              <Button size="xl" className="group text-sm sm:text-base px-7 sm:px-9 py-4 sm:py-[18px] hover:shadow-[0_0_40px_rgba(229,9,20,0.2)]">
                Rejoindre l&apos;Aventure
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/films">
              <Button size="xl" variant="outline" className="text-sm sm:text-base px-7 sm:px-9 py-4 sm:py-[18px]">
                Decouvrir les Films
              </Button>
            </Link>
          </div>

          {/* Stats with glass cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-3xl mx-auto w-full">
            {[
              { label: 'Films en Production', value: stats.filmsCount > 0 ? stats.filmsCount : '5+', icon: Film },
              { label: 'Taches Validees', value: stats.tasksCount > 0 ? stats.tasksCount : '200+', icon: CheckCircle },
              { label: 'Contributeurs Actifs', value: stats.usersCount > 0 ? stats.usersCount : '50+', icon: Users },
              { label: 'Taches Disponibles', value: stats.availableTasks > 0 ? stats.availableTasks : '30+', icon: Zap },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 hover:bg-white/[0.04] transition-all duration-500"
              >
                <stat.icon className="h-4 w-4 mx-auto mb-3 text-[#E50914]/40" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E50914] mb-1 font-playfair">
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-[0.15em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] text-white/15 uppercase tracking-[0.25em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#E50914]/40 scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT TEASER ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-5">Notre Vision</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-7 leading-[1.1] font-playfair">
                La disruption, ce n&apos;est pas detruire le passe.
                <br />
                <span className="text-shimmer">C&apos;est l&apos;upgrader.</span>
              </h2>
              <p className="text-white/45 text-base sm:text-lg leading-relaxed mb-5">
                CINEGENY Studio fusionne l&apos;expertise Prime Time de TF1 et Lagardere
                avec la puissance de l&apos;IA de nouvelle generation. Nous ne promptons pas.
                Nous dirigeons l&apos;IA.
              </p>
              <p className="text-white/25 leading-relaxed mb-8">
                Fonde par Emmanuel Smadja (ex-TF1, Lagardere, Shine) et Eric Haldezos
                (realisateur IA prime, festivals internationaux), notre studio cree des films
                allant de l&apos;horreur a l&apos;animation familiale grace a un workflow proprietaire
                qui s&apos;ameliore chaque jour.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#E50914] hover:text-[#FF2D2D] transition-colors font-medium group">
                En savoir plus sur notre histoire <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute -inset-6 rounded-3xl blur-[60px] bg-[#E50914]/[0.05] group-hover:bg-[#E50914]/[0.08] transition-all duration-700" />
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-white/5">
                <Image
                  src="/images/human-meets-ai-creative-collision.webp"
                  alt="L'humain rencontre l'IA - Vision creative CINEGENY Studio"
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14 sm:mb-18">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-4">Le Processus</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 font-playfair">
              Comment ca <span className="text-gold-gradient">Marche</span>
            </h2>
            <p className="text-white/35 text-base sm:text-lg max-w-xl mx-auto">Simple, rapide, et remunerateur. En 3 etapes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 stagger-children">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 lg:p-10 hover:border-[#E50914]/15 hover:bg-white/[0.04] transition-all duration-500 group hover-lift"
              >
                {/* Top gold line on hover */}
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E50914]/[0.08] border border-[#E50914]/15 group-hover:bg-[#E50914]/[0.12] group-hover:scale-110 transition-all duration-500">
                    <step.icon className="h-6 w-6 text-[#E50914]" />
                  </div>
                  <span className="text-6xl font-bold text-white/[0.03] font-playfair">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-white/35 leading-relaxed text-sm sm:text-[15px]">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-[#E50914]/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NOS SERVICES ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14 sm:mb-18">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-4">Services</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 font-playfair">
              Le Studio aux <span className="text-shimmer">Possibilites Infinies</span>
            </h2>
            <p className="text-white/35 text-base sm:text-lg max-w-xl mx-auto">Du trailer a l&apos;affiche, du face-swap au streaming.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 lg:p-10 hover:border-[#E50914]/15 hover:bg-white/[0.04] transition-all duration-500 group hover-lift"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#E50914]/[0.08] border border-[#E50914]/15 mb-6 group-hover:scale-110 group-hover:bg-[#E50914]/[0.12] transition-all duration-500">
                  <service.icon className="h-6 w-6 text-[#E50914]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-white/35 leading-relaxed text-sm sm:text-[15px]">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GENRE VERSATILITY ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl blur-[50px] bg-[#E50914]/[0.04] group-hover:bg-[#E50914]/[0.07] transition-all duration-700" />
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-white/5">
                <Image
                  src="/images/genre-versatility-meeting-characters.webp"
                  alt="Production multi-genre IA - De l'animation a l'horreur"
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 to-transparent" />
              </div>
            </div>
            <div>
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-5">Genre-Agnostic</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-7 leading-[1.1] font-playfair">
                De l&apos;Horreur Glacante au{' '}
                <span className="text-gold-gradient">Divertissement Familial</span>
              </h2>
              <p className="text-white/40 leading-relaxed mb-8">
                Notre workflow maison proprietaire nous permet de creer dans tous les genres.
                Un systeme d&apos;amelioration continue &quot;sauce secrete&quot; qui progresse chaque jour.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {genres.map((genre) => (
                  <div key={genre.name} className="p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/12 hover:bg-white/[0.04] transition-all duration-300">
                    <h4 className="text-sm font-semibold mb-1">{genre.name}</h4>
                    <p className="text-xs text-white/30">{genre.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FILMS EN PRODUCTION ═══════════ */}
      {films.length > 0 && (
        <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-14">
              <div>
                <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-3">Pipeline</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-playfair">
                  Films en <span className="text-gold-gradient">Production</span>
                </h2>
              </div>
              <Link href="/films" className="hidden md:flex items-center gap-2 text-[#E50914] hover:text-[#FF2D2D] transition-colors text-sm font-medium group">
                Voir tous les films <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.slug}`}>
                  <div className="group rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                    <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#E50914]/[0.06] to-purple-900/[0.1]">
                      {film.coverImageUrl ? (
                        <Image src={film.coverImageUrl} alt={`Film IA ${film.title} - CINEGENY Studio`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-16 w-16 text-[#E50914]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs text-white/60 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 font-medium">
                          {FILM_STATUS_LABELS[film.status]}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-7">
                      <h3 className="font-semibold text-lg mb-3 group-hover:text-[#E50914] transition-colors duration-300">{film.title}</h3>
                      {film.description && <p className="text-sm text-white/30 mb-4 line-clamp-2">{film.description}</p>}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/30">Progression</span>
                          <span className="text-[#E50914] font-medium">{Math.round(film.progressPct)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full" style={{ width: `${film.progressPct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                        <span className="text-xs text-white/25">{film._count.tasks} taches</span>
                        <span className="text-xs text-[#E50914] flex items-center gap-1 font-medium group-hover:gap-2 transition-all">
                          Contribuer <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ WORKFLOW MAISON ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-5">Workflow Proprietaire</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-7 leading-[1.1] font-playfair">
                Des Micro-Taches pour{' '}
                <span className="text-gold-gradient">Chaque Talent</span>
              </h2>
              <p className="text-white/40 leading-relaxed mb-8">
                Notre systeme decompose chaque film en centaines de micro-taches creatives.
                Chaque tache est ultra-guidee, detaillee etape par etape, et accessible a tous les niveaux.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Wand2, label: 'Prompt Writing & Direction IA', price: '50EUR' },
                  { icon: Palette, label: 'Design de Personnages & Environnements', price: '100EUR' },
                  { icon: Camera, label: 'Motion Capture & Cascades', price: '500EUR' },
                  { icon: Mic, label: 'Sound Design & Voix Off', price: '100EUR' },
                  { icon: Layers, label: 'Compositing & VFX', price: '500EUR' },
                ].map((task) => (
                  <div key={task.label} className="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/12 hover:bg-white/[0.04] transition-all duration-300 group/task">
                    <div className="flex items-center gap-3">
                      <task.icon className="h-5 w-5 text-[#E50914] group-hover/task:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{task.label}</span>
                    </div>
                    <span className="text-sm text-[#E50914] font-bold">{task.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl blur-[50px] bg-[#E50914]/[0.04] group-hover:bg-[#E50914]/[0.07] transition-all duration-700" />
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-white/5">
                <Image
                  src="/images/studio-workflow-maison-desk.webp"
                  alt="Workflow Maison - Studio de production IA CINEGENY Studio"
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES GRID ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14 sm:mb-18">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-4">Pourquoi Nous</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 font-playfair">
              L&apos;Avantage <span className="text-shimmer">CINEGENY</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 stagger-children">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-9 hover:border-[#E50914]/15 hover:bg-white/[0.04] transition-all duration-500 group hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]/[0.08] border border-[#E50914]/15 mb-5 group-hover:bg-[#E50914]/[0.12] group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <h3 className="text-lg font-semibold mb-2.5">{feature.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ EDITIONS RUPPIN PARTNERSHIP ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 rounded-3xl blur-[50px] bg-[#E50914]/[0.04] group-hover:bg-[#E50914]/[0.07] transition-all duration-700" />
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-white/5">
                <Image
                  src="/images/editions-ruppin-library-partnership.webp"
                  alt="Editions Ruppin - Partenariat book-to-screen CINEGENY Studio"
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-5">Partenariat Strategique</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-7 leading-[1.1] font-playfair">
                Editions Ruppin :{' '}
                <span className="text-gold-gradient">Du Livre a l&apos;Ecran</span>
              </h2>
              <p className="text-white/40 leading-relaxed mb-7">
                Nous detenons 33% d&apos;Editions Ruppin, une maison d&apos;edition que nous transformons
                en startup tech &quot;Book-to-Screen&quot; grace a nos outils IA proprietaires.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'First-Look Deal', desc: 'Acces prioritaire a chaque biographie et recit historique avant le marche.' },
                  { title: 'IP Co-Detenue', desc: "Nous ne faisons pas qu'adapter des histoires. Nous co-detenons les droits." },
                  { title: 'Ecosysteme Scalable', desc: "Transformation d'une maison d'edition traditionnelle en pipeline cinema IA." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E50914] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-white/30">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/20 italic">
                &quot;Nous controlons l&apos;histoire du premier mot imprime au dernier pixel.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICE TIERS ═══════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-4">Tarification</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 font-playfair">
            Des Taches pour <span className="text-gold-gradient">Chaque Niveau</span>
          </h2>
          <p className="text-white/35 mb-14">Plus la tache est complexe, plus la recompense est elevee.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { level: 'Debutant', price: '50EUR', desc: 'Prompt writing, revue qualite, traduction, sous-titres', color: 'from-emerald-500/[0.06] to-transparent', borderColor: 'border-white/[0.06]' },
              { level: 'Avance', price: '100EUR', desc: 'Design, animation, sound design, colorimetrie', color: 'from-blue-500/[0.06] to-transparent', borderColor: 'border-white/[0.06]' },
              { level: 'Expert', price: '500EUR', desc: 'VFX, cascades, direction artistique, compositing', color: 'from-[#E50914]/[0.08] to-transparent', featured: true, borderColor: 'border-[#E50914]/25' },
            ].map((tier) => (
              <div
                key={tier.level}
                className={`rounded-2xl sm:rounded-3xl border p-7 sm:p-8 relative bg-gradient-to-b ${tier.color} ${tier.borderColor} hover-lift transition-all duration-500`}
              >
                {tier.featured && (
                  <>
                    <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-[#E50914] text-white font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Premium
                    </div>
                  </>
                )}
                <div className={`text-4xl sm:text-5xl font-bold mb-2 ${tier.featured ? 'text-[#E50914]' : 'text-white/90'}`}>
                  {tier.price}
                </div>
                <div className="text-sm text-white/30 mb-1">par tache</div>
                <div className="font-semibold mb-4 text-white/70">{tier.level}</div>
                <div className="text-sm text-white/30 leading-relaxed">{tier.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/[0.06] blur-[200px]" />
        </div>

        {/* Gold particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[20%] left-[20%] w-1 h-1 rounded-full bg-[#E50914]/30 particle particle-delay-1" />
          <div className="absolute top-[40%] right-[25%] w-1 h-1 rounded-full bg-[#E50914]/20 particle particle-delay-3" />
          <div className="absolute bottom-[30%] left-[35%] w-1.5 h-1.5 rounded-full bg-[#FF2D2D]/20 particle particle-delay-5" />
        </div>

        <div className="relative z-10 container mx-auto max-w-3xl">
          <Infinity className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-8 text-[#E50914]/20" strokeWidth={1} />
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-7 leading-[1.05] font-playfair">
            Pret a Entrer dans la
            <br />
            <span className="text-shimmer">CINEGENY ?</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/35 mb-12 sm:mb-14 leading-relaxed max-w-lg mx-auto">
            Rejoignez la communaute des createurs qui faconnent le cinema de demain.
            <br />
            <span className="text-white/20">10 concepts actifs. 0 obstacles logistiques.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="group text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-[18px] hover:shadow-[0_0_50px_rgba(229,9,20,0.2)]">
                Creer mon Compte Gratuit
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="xl" variant="outline" className="text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-[18px]">
                Decouvrir Notre Histoire
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
