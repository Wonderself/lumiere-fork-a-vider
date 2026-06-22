import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Film,
  Users,
  Layers,
  Cpu,
  Shield,
  Sparkles,
  Globe,
  BookOpen,
  Building2,
  Award,
  ArrowRight,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Landmark,
  Lightbulb,
  Clapperboard,
  MapPin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'À Propos — CINEGENY Studio',
  description:
    'Découvrez CINEGENY Studio : le studio de cinéma IA fondé par Emmanuel Smadja (TF1, Lagardère) et Eric Haldezos (réalisateur primé). Paris · Tel Aviv · Hollywood.',
}

const pipeline = [
  { name: 'Project Heritage', desc: 'Biopics sourcés directement du catalogue d\'Éditions Ruppin', icon: BookOpen },
  { name: 'Project Hybrid', desc: 'Drames live-action enrichis par des environnements IA', icon: Layers },
  { name: 'Project Pulse', desc: 'Films de genre high-concept (Thriller/Sci-Fi)', icon: Sparkles },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-28 sm:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#E50914]/[0.02] blur-[200px]" />
        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#E50914]/15 bg-[#E50914]/[0.06] text-[#E50914] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Clapperboard className="h-3.5 w-3.5" />
            Cinema & Creative Studio
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight font-playfair">
            <span className="text-shimmer">The Dreams Team</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-4">
            Une fusion de pedigree majeur et d&apos;IA de nouvelle generation.
          </p>
          <p className="text-base sm:text-lg text-white/25 max-w-2xl mx-auto italic">
            &quot;La disruption, ce n&apos;est pas detruire le passe. C&apos;est l&apos;upgrader.&quot;
          </p>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══════════ L'EQUIPE FONDATRICE ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden group ring-1 ring-white/[0.06]">
              <Image
                src="/images/cinegeny-team-startup-office.webp"
                alt="L'equipe fondatrice de CINEGENY Studio"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
              <div className="absolute inset-0 bg-[#E50914]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div>
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">Les Fondateurs</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight font-playfair">
                L&apos;Expertise <span className="text-gold-gradient">Prime Time</span> a l&apos;Ere de l&apos;IA
              </h2>

              <div className="space-y-6">
                <div className="group p-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                      <Briefcase className="h-5 w-5 text-[#E50914]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Emmanuel Smadja</h3>
                      <p className="text-sm text-[#E50914]/80">CEO</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-sm text-white/45">
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Production Executive pour les programmes Tier-1 (TF1)</li>
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Experience grands groupes : Lagardere, Shine/DMLSTV</li>
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Expertise TV haut budget & evenements live</li>
                  </ul>
                </div>

                <div className="group p-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                      <Award className="h-5 w-5 text-[#E50914]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Eric Haldezos</h3>
                      <p className="text-sm text-[#E50914]/80">CCO</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-sm text-white/45">
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Realisateur de films IA prime</li>
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Specialiste innovation documentaire</li>
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Reconnaissance festivals internationaux</li>
                    <li className="flex items-start gap-2.5"><CheckCircle className="h-4 w-4 text-[#E50914]/70 shrink-0 mt-0.5" />Experience lourde en production TV</li>
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-white/25 text-sm italic">
                &quot;We bring Prime Time rigor to the AI era.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ PHILOSOPHIE & GENRES ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">Notre Philosophie</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight font-playfair">
                <span className="text-shimmer">&quot;We don&apos;t prompt. We direct AI.&quot;</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-8">
                Production Genre-Agnostique : notre workflow maison proprietaire s&apos;ameliore
                chaque jour grace a un systeme d&apos;amelioration continue &quot;sauce secrete&quot;.
                Nous pouvons creer du film d&apos;horreur glacant au divertissement familial anime.
              </p>
              <div className="grid grid-cols-2 gap-3 stagger-children">
                {[
                  'Animation 3D & Stop-Motion',
                  'Horreur & Thriller Psychologique',
                  'Films Historiques IA',
                  'Science-Fiction Futuriste',
                  'Restauration de Films Classiques',
                  'Hybride Live-Action + IA',
                ].map((genre) => (
                  <div key={genre} className="flex items-center gap-2.5 text-sm text-white/45 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors duration-300">
                    <Film className="h-3.5 w-3.5 text-[#E50914]/70 shrink-0" />
                    {genre}
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm text-white/25 italic">
                &quot;Let&apos;s start to ART.&quot;
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden group ring-1 ring-white/[0.06]">
              <Image
                src="/images/genre-versatility-meeting-characters.webp"
                alt="Versatilite des genres - Personnages de differents genres de film IA"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 to-transparent" />
              <div className="absolute inset-0 bg-[#E50914]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══════════ EDITIONS RUPPIN ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden order-2 lg:order-1 group ring-1 ring-white/[0.06]">
              <Image
                src="/images/editions-ruppin-library-partnership.webp"
                alt="Editions Ruppin - Bibliotheque et partenariat book-to-screen"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[#E50914]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">L&apos;Atout Strategique</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight font-playfair">
                IP & Equity :{' '}
                <span className="text-gold-gradient">Editions Ruppin</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-8">
                Participation de 33% dans Editions Ruppin, une maison d&apos;edition que nous
                transformons en startup tech &quot;Book-to-Screen&quot; scalable grace a nos outils IA proprietaires.
              </p>
              <div className="space-y-4 mb-8 stagger-children">
                <div className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                  <BookOpen className="h-5 w-5 text-[#E50914]/70 shrink-0 mt-1 transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h4 className="font-semibold mb-1.5">First-Look Deal</h4>
                    <p className="text-sm text-white/35 leading-relaxed">Acces prioritaire a chaque biographie et recit historique avant le marche.</p>
                  </div>
                </div>
                <div className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                  <Shield className="h-5 w-5 text-[#E50914]/70 shrink-0 mt-1 transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h4 className="font-semibold mb-1.5">IP Co-Detenue</h4>
                    <p className="text-sm text-white/35 leading-relaxed">Nous ne faisons pas qu&apos;adapter des histoires — nous co-detenons les droits.</p>
                  </div>
                </div>
                <div className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                  <TrendingUp className="h-5 w-5 text-[#E50914]/70 shrink-0 mt-1 transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h4 className="font-semibold mb-1.5">Ecosysteme Scalable</h4>
                    <p className="text-sm text-white/35 leading-relaxed">Transformation d&apos;une maison d&apos;edition traditionnelle en pipeline cinema IA a grande echelle.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/25 italic">
                &quot;Nous controlons l&apos;histoire du premier mot imprime au dernier pixel.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ INFRASTRUCTURE ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">L&apos;Infrastructure</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight font-playfair">
              Un Backbone de <span className="text-gold-gradient">Qualite Industrielle</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto leading-relaxed">
              L&apos;agilite de la Silicon Valley rencontre la rigueur du systeme studio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#E50914]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Landmark className="h-5 w-5 text-[#E50914]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Le Bouclier Financier</h3>
              <p className="text-sm text-white/35 leading-relaxed mb-4">Europe/Israel</p>
              <ul className="space-y-2.5 text-sm text-white/45">
                <li className="flex items-start gap-2.5"><CheckCircle className="h-3.5 w-3.5 text-[#E50914]/70 shrink-0 mt-0.5" />Cabinet CPA #1 en France (credits d&apos;impot & subventions medias)</li>
                <li className="flex items-start gap-2.5"><CheckCircle className="h-3.5 w-3.5 text-[#E50914]/70 shrink-0 mt-0.5" />Advisory Board dirige par le CMO d&apos;un leader mondial FinTech</li>
              </ul>
            </div>

            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#E50914]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Globe className="h-5 w-5 text-[#E50914]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Le Pont Hollywood</h3>
              <p className="text-sm text-white/35 leading-relaxed mb-4">USA</p>
              <ul className="space-y-2.5 text-sm text-white/45">
                <li className="flex items-start gap-2.5"><CheckCircle className="h-3.5 w-3.5 text-[#E50914]/70 shrink-0 mt-0.5" />Partenaire d&apos;expansion strategique a Los Angeles</li>
                <li className="flex items-start gap-2.5"><CheckCircle className="h-3.5 w-3.5 text-[#E50914]/70 shrink-0 mt-0.5" />Liaison dediee au scouting de talents et deals de co-production US</li>
              </ul>
            </div>

            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#E50914]/15 md:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Building2 className="h-5 w-5 text-[#E50914]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3 Continents</h3>
              <p className="text-sm text-white/35 leading-relaxed mb-4">Reseau mondial</p>
              <div className="space-y-3">
                {[
                  { city: 'Paris', role: 'QG Creatif & Production' },
                  { city: 'Tel Aviv', role: 'R&D Tech & IA' },
                  { city: 'Hollywood', role: 'Distribution & Talents' },
                ].map((loc) => (
                  <div key={loc.city} className="flex items-center gap-2.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-[#E50914]/70" />
                    <span className="font-medium">{loc.city}</span>
                    <span className="text-white/25">— {loc.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══════════ PIPELINE ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">Le Pipeline</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight font-playfair">
                Projets en <span className="text-gold-gradient">Developpement</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-8">
                Un double moteur de croissance : Studio Services (cash-flow via commerciaux haut de gamme pour marques & agences)
                et Original Pictures (richesse long terme via propriete et licence d&apos;IP).
              </p>
              <div className="space-y-4 mb-8 stagger-children">
                {pipeline.map((project) => (
                  <div key={project.name} className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                    <project.icon className="h-5 w-5 text-[#E50914]/70 shrink-0 mt-0.5 transition-transform duration-500 group-hover:scale-110" />
                    <div>
                      <h4 className="font-semibold mb-1.5">{project.name}</h4>
                      <p className="text-sm text-white/35 leading-relaxed">{project.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 p-5 rounded-xl sm:rounded-2xl bg-[#E50914]/[0.04] border border-[#E50914]/15 backdrop-blur-sm">
                <Lightbulb className="h-5 w-5 text-[#E50914] shrink-0" />
                <p className="text-sm text-white/50"><strong className="text-[#E50914]">10 concepts actifs.</strong> 0 obstacles logistiques.</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden group ring-1 ring-white/[0.06]">
              <Image
                src="/images/book-to-screen-film-reels-ip.webp"
                alt="Pipeline de production - Du livre au film IA"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[#E50914]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ BUSINESS MODEL ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">Le Modele</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight font-playfair">
              Double Moteur de <span className="text-gold-gradient">Croissance</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group glass-gold rounded-2xl sm:rounded-3xl p-8 sm:p-9 hover-lift transition-all duration-500">
              <div className="h-14 w-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                <Cpu className="h-6 w-6 text-[#E50914]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Studio Services</h3>
              <p className="text-white/45 leading-relaxed mb-4">Generation de cash-flow via commerciaux haut de gamme pour marques & agences.</p>
              <p className="text-sm text-white/25">Revenue stream #1 — Court terme</p>
            </div>
            <div className="group glass-gold rounded-2xl sm:rounded-3xl p-8 sm:p-9 hover-lift transition-all duration-500">
              <div className="h-14 w-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                <Film className="h-6 w-6 text-[#E50914]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Original Pictures</h3>
              <p className="text-white/45 leading-relaxed mb-4">Richesse long terme via propriete d&apos;IP et licensing des films originaux.</p>
              <p className="text-sm text-white/25">Revenue stream #2 — Long terme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent" />

      {/* ═══════════ TECHNOLOGIE ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14 sm:mb-16">
            <p className="text-[#E50914] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">La Technologie</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight font-playfair">
              Notre Stack <span className="text-gold-gradient">Technique</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 stagger-children">
            {[
              { icon: Cpu, title: 'IA Claude', desc: 'Evaluation des soumissions, feedback intelligent, scoring automatique de chaque contribution.' },
              { icon: Shield, title: 'Provenance SHA-256', desc: 'Chaque contribution hashee et horodatee pour la tracabilite et la preuve de paternite.' },
              { icon: Sparkles, title: 'Pipeline Automatise', desc: 'De la soumission a la distribution : transcoding, sous-titrage multi-langues, assemblage final.' },
              { icon: Users, title: 'Micro-Taches Collaboratives', desc: 'Chaque film decoupe en centaines de taches guidees, accessibles a tous les niveaux.' },
            ].map((tech) => (
              <div key={tech.title} className="group flex gap-4 p-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500 hover-lift">
                <div className="h-11 w-11 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110">
                  <tech.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5">{tech.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ CONTACT / CTA ═══════════ */}
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden group ring-1 ring-white/[0.06]">
              <Image
                src="/images/cinegeny-office-contact-touch.webp"
                alt="Contactez CINEGENY Studio"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
              <div className="absolute inset-0 bg-[#E50914]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight font-playfair">
                Le Studio de Demain.{' '}
                <span className="text-shimmer">Ouvert Aujourd&apos;hui.</span>
              </h2>
              <div className="space-y-4 mb-8 stagger-children">
                <div className="group p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500">
                  <p className="text-sm text-white/50"><strong className="text-white/80">Investisseurs :</strong> Rejoignez la scalabilite du modele &quot;Studio Hybride&quot;.</p>
                </div>
                <div className="group p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500">
                  <p className="text-sm text-white/50"><strong className="text-white/80">Partenaires :</strong> Racontons vos histoires avec les outils de la prochaine generation.</p>
                </div>
                <div className="group p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#E50914]/15 transition-all duration-500">
                  <p className="text-sm text-white/50"><strong className="text-white/80">Createurs :</strong> Votre talent a sa place dans le cinema de demain.</p>
                </div>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
              >
                Rejoindre CINEGENY
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
