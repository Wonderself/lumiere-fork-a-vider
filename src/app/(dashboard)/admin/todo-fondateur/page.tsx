import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ListTodo, CheckCircle, Circle, Server, Scale, Briefcase,
  CreditCard, Mail, Shield, Globe, FileText, Rocket,
  Cpu, MessageSquare, Palette, Film, Megaphone,
  Sparkles, Zap, PartyPopper, Star, ArrowRight,
  Code, Database, Lock, Eye, Users, TrendingUp,
  Play, Mic, Wand2, Camera, Calendar, Bot,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — TODO Fondateur' }

type TodoItem = {
  label: string
  done: boolean
  note?: string
  icon?: React.ElementType
  priority?: 'high' | 'medium' | 'low'
  helper?: 'CLAUDE' | 'HUMAN' | 'BOTH'
  difficulty?: 'trivial' | 'easy' | 'medium' | 'guided'
}

type TodoSection = {
  title: string
  icon: React.ElementType
  color: string
  items: TodoItem[]
}

const sections: TodoSection[] = [
  {
    title: 'V1 Completee — Ce qui est fait',
    icon: PartyPopper,
    color: 'text-green-600',
    items: [
      { label: 'Landing page Hub (Cinema + Creators)', done: true, note: 'Page d\'accueil avec choix entre les 2 plateformes, style videoinu + gradient Instagram', icon: Globe, helper: 'CLAUDE' },
      { label: 'Landing Cinema complete', done: true, note: 'Hero, stats, services, genres, films, pricing, CTA — dark theme or', icon: Film, helper: 'CLAUDE' },
      { label: 'Landing Creators complete', done: true, note: 'Hero, 3 piliers, outils, micro-taches MALT, pricing, CTA — light theme', icon: Palette, helper: 'CLAUDE' },
      { label: 'Page About Cinema (contenu PDF)', done: true, note: 'Team, philosophie, genres, Ruppin, infrastructure, pipeline, tech', icon: FileText, helper: 'CLAUDE' },
      { label: 'Page About Creators (contenu PDF)', done: true, note: 'Vision, equipe, services MALT, partenariats, 3 continents', icon: FileText, helper: 'CLAUDE' },
      { label: 'Auth — Login / Register / Forgot Password', done: true, note: 'NextAuth v5, JWT, Credentials provider, AUTH_SECRET configure', icon: Lock, helper: 'CLAUDE' },
      { label: 'Dashboard complet (7 modules)', done: true, note: 'Studio, Creator IA, Collabs, Analytics, Streaming, Tokenization, Admin', icon: Eye, helper: 'CLAUDE' },
      { label: 'Streaming (hero, filtres, catalogue, soumission)', done: true, note: 'CatalogFilm, recherche, genres, submit, producteur CTA', icon: Play, helper: 'CLAUDE' },
      { label: 'Films (catalogue, filtres, detail, progression)', done: true, note: 'Filtres par status/genre, cards, progress bars, stats', icon: Film, helper: 'CLAUDE' },
      { label: 'Leaderboard (podium + classement)', done: true, note: 'Top 3 podium, table classement, stats globales', icon: Star, helper: 'CLAUDE' },
      { label: 'Roadmap optimiste (cinema + creators)', done: true, note: '7 phases, difficultes recalibrees, ton encourageant', icon: Rocket, helper: 'CLAUDE' },
      { label: 'Admin Command Center (KPIs + sparklines)', done: true, note: 'Users, films, tasks, revenue, soumissions, taux completion', icon: TrendingUp, helper: 'CLAUDE' },
      { label: 'Admin — Films, Tasks, Users, Reviews, Settings', done: true, note: 'CRUD complet, filtres, pagination', icon: Database, helper: 'CLAUDE' },
      { label: 'Admin — Analytics, Payments, Screenplays, Funding', done: true, note: 'Dashboard analytics avec graphiques SVG', icon: TrendingUp, helper: 'CLAUDE' },
      { label: 'Creator Hub (generate, videos, schedule, accounts)', done: true, note: 'Wizard, generation IA, planning, social hub, noface, trending', icon: Wand2, helper: 'CLAUDE' },
      { label: 'Collabs (marketplace, orders, referrals, achievements)', done: true, note: 'Marketplace MALT, commandes, parrainages, badges', icon: Users, helper: 'CLAUDE' },
      { label: 'Tokenization (portfolio, governance, proposals)', done: true, note: 'Achat tokens film, dividendes, votes', icon: CreditCard, helper: 'CLAUDE' },
      { label: 'Community (contests, scenarios, votes)', done: true, note: 'Concours, scenarios communautaires, systeme de vote', icon: MessageSquare, helper: 'CLAUDE' },
      { label: 'SEO (sitemap, robots, metadata, OG, Twitter)', done: true, note: 'Toutes les pages avec meta uniques, images OG', icon: Globe, helper: 'CLAUDE' },
      { label: 'Legal (CGU, Confidentialite, Cookies)', done: true, note: 'Pages legales completes avec cookie banner', icon: FileText, helper: 'CLAUDE' },
      { label: 'Proxy auth (protection routes)', done: true, note: 'proxy.ts Next.js 16 — admin, dashboard, tasks proteges', icon: Shield, helper: 'CLAUDE' },
      { label: 'Images SEO-friendly (17 images renommees)', done: true, note: 'Noms descriptifs, alt tags, next/image', icon: Camera, helper: 'CLAUDE' },
      { label: 'GitHub repos (cinema + creators)', done: true, note: 'Wonderself/cinegeny-app + Wonderself/cinegeny', icon: Code, helper: 'CLAUDE' },
    ],
  },
  {
    title: 'Phase 2 — APIs & Services (Claude peut guider etape par etape)',
    icon: Server,
    color: 'text-blue-600',
    items: [
      {
        label: 'Stripe Connect — Paiements contributeurs',
        done: false,
        note: '1. Creer compte Stripe → 2. npm install stripe → 3. Claude configure les webhooks et l\'API. Temps: ~30min avec Claude.',
        icon: CreditCard,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'guided',
      },
      {
        label: 'Resend — Emails transactionnels',
        done: false,
        note: '1. resend.com → API key gratuite → 2. Claude configure les templates (verification, notification, receipt). Temps: ~15min.',
        icon: Mail,
        priority: 'high',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
      {
        label: 'Claude API — Revue IA automatique des soumissions',
        done: false,
        note: '1. console.anthropic.com → API key → 2. Claude remplace le mock par claude-sonnet-4-6 dans tasks.ts. Temps: ~10min.',
        icon: Cpu,
        priority: 'high',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
      {
        label: 'Cloudflare R2 — Stockage fichiers soumissions',
        done: false,
        note: 'Alternative gratuite a AWS S3. Claude configure le client R2 + upload. Temps: ~20min.',
        icon: Server,
        priority: 'high',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
      {
        label: 'OAuth Providers (Google, GitHub)',
        done: false,
        note: 'Ajouter Google + GitHub login. Claude configure NextAuth providers. Temps: ~15min.',
        icon: Shield,
        priority: 'medium',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
      {
        label: 'Upstash Redis — Cache production',
        done: false,
        note: 'Remplace Redis Docker. Plan gratuit suffisant. Claude configure. Temps: ~10min.',
        icon: Server,
        priority: 'medium',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
      {
        label: 'ElevenLabs / Replicate — Generation IA',
        done: false,
        note: 'API voix off + generation video. Claude integre dans Creator Hub. Temps: ~30min.',
        icon: Bot,
        priority: 'medium',
        helper: 'CLAUDE',
        difficulty: 'guided',
      },
      {
        label: 'Sentry — Monitoring erreurs',
        done: false,
        note: 'sentry.io → projet Next.js → Claude ajoute le SDK. Plan gratuit. Temps: ~5min.',
        icon: Shield,
        priority: 'low',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
      {
        label: 'PostHog — Analytics privacy-first',
        done: false,
        note: 'posthog.com → plan gratuit → Claude integre le script. Temps: ~5min.',
        icon: Globe,
        priority: 'low',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
    ],
  },
  {
    title: 'Phase 3 — Etapes Legales (avec guide)',
    icon: Scale,
    color: 'text-purple-600',
    items: [
      {
        label: 'Creation entite en Israel (Ltd)',
        done: false,
        note: 'Guide: gov.il/companies-registrar. Avocat israelien recommande. Budget: ~2000$. Delai: 2-4 semaines.',
        icon: FileText,
        priority: 'high',
        helper: 'HUMAN',
        difficulty: 'guided',
      },
      {
        label: 'Compte bancaire professionnel',
        done: false,
        note: 'Options: Wise Business (instantane en ligne), Bank Leumi, ou Qonto EU. Le plus rapide: Wise.',
        icon: CreditCard,
        priority: 'high',
        helper: 'HUMAN',
        difficulty: 'easy',
      },
      {
        label: 'INPI — Depot marque "CINEGENY"',
        done: false,
        note: 'inpi.fr → Depot en ligne ~210 EUR. Classes 9, 35, 41. Claude prepare la description. Delai: 5 mois.',
        icon: Shield,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'guided',
      },
      {
        label: 'CNIL — Declaration traitement donnees',
        done: false,
        note: 'RGPD: registre des traitements. Claude genere le template. Vous le soumettez.',
        icon: Shield,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'guided',
      },
      {
        label: 'CGV / CGU detaillees par un avocat',
        done: false,
        note: 'Templates de base deja en place. Avocat pour validation finale ~500-1000 EUR.',
        icon: FileText,
        priority: 'high',
        helper: 'HUMAN',
        difficulty: 'guided',
      },
      {
        label: 'Contrat Contributeur (micro-taches)',
        done: false,
        note: 'Claude redige le draft. Avocat valide. Couvre: cession droits, IP, statut.',
        icon: FileText,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'guided',
      },
      {
        label: 'Assurance RC Pro',
        done: false,
        note: 'Comparateurs en ligne. Budget: ~300-600 EUR/an. Hiscox ou AXA Pro.',
        icon: Shield,
        priority: 'medium',
        helper: 'HUMAN',
        difficulty: 'easy',
      },
      {
        label: 'Expert-comptable',
        done: false,
        note: 'Dougs.fr (full online, ~100 EUR/mois) ou cabinet local. Claude prepare les docs.',
        icon: Briefcase,
        priority: 'medium',
        helper: 'HUMAN',
        difficulty: 'easy',
      },
    ],
  },
  {
    title: 'Phase 4 — Business & Communication',
    icon: Briefcase,
    color: 'text-[#E50914]',
    items: [
      {
        label: 'Pitch Deck — 12 slides',
        done: false,
        note: 'Claude genere le contenu + structure. Vous designez dans Canva/Figma. Contenu du PDF deja integre dans About.',
        icon: Megaphone,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'guided',
      },
      {
        label: 'Video demo / trailer plateforme',
        done: false,
        note: 'Screen recording du site + voice over IA (ElevenLabs). 2 min max. Claude ecrit le script.',
        icon: Film,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'guided',
      },
      {
        label: 'Beta privee — 50 testeurs',
        done: false,
        note: 'Liste d\'attente sur la landing (email capture). Discord pour feedback. Claude configure.',
        icon: MessageSquare,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'easy',
      },
      {
        label: 'Premier film demo complet',
        done: false,
        note: 'Court-metrage 5 min. Utilise la pipeline de micro-taches existante. Vitrine de la plateforme.',
        icon: Film,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'medium',
      },
      {
        label: 'Reseaux sociaux — X, LinkedIn, Instagram',
        done: false,
        note: 'Comptes pro. Claude genere le calendrier editorial + premiers posts.',
        icon: Megaphone,
        priority: 'medium',
        helper: 'BOTH',
        difficulty: 'easy',
      },
      {
        label: 'Communaute Discord',
        done: false,
        note: 'discord.com → serveur gratuit. Claude configure les channels et roles.',
        icon: MessageSquare,
        priority: 'medium',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
      {
        label: 'Domaine cinegeny.studio + DNS',
        done: false,
        note: 'Acheter sur Namecheap/Cloudflare. Pointer vers Coolify. Claude configure.',
        icon: Globe,
        priority: 'high',
        helper: 'BOTH',
        difficulty: 'easy',
      },
      {
        label: 'HTTPS production (Cloudflare)',
        done: false,
        note: 'Gratuit avec Cloudflare. Claude configure les DNS records et SSL.',
        icon: Lock,
        priority: 'high',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
    ],
  },
  {
    title: 'Phase 5 — Ameliorations Techniques (Claude fait tout)',
    icon: Code,
    color: 'text-cyan-600',
    items: [
      {
        label: 'Images WebP optimisees + responsive',
        done: false,
        note: 'Convertir les PNG 8MB → WebP 300KB. Ajouter sizes. Claude automatise.',
        icon: Camera,
        priority: 'medium',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
      {
        label: 'Structured Data JSON-LD (films)',
        done: false,
        note: 'Schema.org Movie/VideoObject. Claude genere automatiquement. SEO boost.',
        icon: Code,
        priority: 'medium',
        helper: 'CLAUDE',
        difficulty: 'trivial',
      },
      {
        label: 'PWA manifest + service worker',
        done: false,
        note: 'App installable sur mobile. Claude configure next-pwa. Temps: ~10min.',
        icon: Zap,
        priority: 'low',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
      {
        label: 'Internationalisation (i18n)',
        done: false,
        note: 'next-intl pour FR/EN/HE. Claude configure les fichiers de traduction.',
        icon: Globe,
        priority: 'low',
        helper: 'CLAUDE',
        difficulty: 'guided',
      },
      {
        label: 'Tests E2E (Playwright)',
        done: false,
        note: 'Tests automatiques login, register, tasks. Claude ecrit tous les tests.',
        icon: Shield,
        priority: 'low',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
      {
        label: 'CI/CD GitHub Actions',
        done: false,
        note: 'Build + lint + test auto sur chaque push. Claude configure le workflow.',
        icon: Rocket,
        priority: 'low',
        helper: 'CLAUDE',
        difficulty: 'easy',
      },
    ],
  },
]

export default async function AdminTodoFondateurPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const allItems = sections.flatMap((s) => s.items)
  const totalItems = allItems.length
  const doneItems = allItems.filter((i) => i.done).length
  const globalPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  const claudeItems = allItems.filter((i) => !i.done && (i.helper === 'CLAUDE' || i.helper === 'BOTH')).length
  const humanItems = allItems.filter((i) => !i.done && i.helper === 'HUMAN').length

  const difficultyMap = {
    trivial: { label: 'Tres facile', color: 'text-green-600 bg-green-500/10 border-green-500/20' },
    easy: { label: 'Facile', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
    medium: { label: 'Moyen', color: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' },
    guided: { label: 'Guide', color: 'text-purple-600 bg-purple-500/10 border-purple-500/20' },
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold flex items-center gap-3"
        >
          <ListTodo className="h-7 w-7 text-[#E50914]" /> TODO Fondateur
        </h1>
        <p className="text-white/50 mt-1">
          Check-list complete pour le lancement de CINEGENY. Chaque etape est faisable et guidee.
        </p>
      </div>

      {/* Global progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-white/50">Progression globale</p>
              <p className="text-4xl font-bold text-[#E50914]">{globalPct}%</p>
              <p className="text-xs text-white/50 mt-1">
                {doneItems}/{totalItems} etapes completees
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <Cpu className="h-4 w-4 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">{claudeItems}</p>
                </div>
                <p className="text-[10px] text-white/50">Claude peut faire</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="h-4 w-4 text-orange-600" />
                  <p className="text-2xl font-bold text-orange-600">{humanItems}</p>
                </div>
                <p className="text-[10px] text-white/50">Humain requis</p>
              </div>
            </div>
          </div>
          <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-700"
              style={{ width: `${globalPct}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-3 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#E50914]" />
            La V1 est deja tres avancee. La plupart des etapes restantes prennent 5-30 min avec Claude.
          </p>
        </CardContent>
      </Card>

      {/* Encouragement banner */}
      <div className="p-6 rounded-2xl border border-[#E50914]/20 bg-[#E50914]/5">
        <div className="flex items-start gap-3">
          <PartyPopper className="h-6 w-6 text-[#E50914] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[#E50914] mb-1">Excellent travail !</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {doneItems} fonctionnalites sont deja developpees et fonctionnelles. Le site Cinema + Creators est a
              un niveau de demo tres avance. Les prochaines etapes sont principalement des integrations API
              (la plupart en 5-15 min) et des demarches administratives guidees.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionDone = section.items.filter((i) => i.done).length
          const sectionTotal = section.items.length
          const sectionPct = Math.round((sectionDone / sectionTotal) * 100)

          return (
            <Card key={section.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold flex items-center gap-2 ${section.color}`}>
                    <section.icon className="h-5 w-5" /> {section.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50">
                      {sectionDone}/{sectionTotal}
                    </span>
                    <div className="w-24 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D]"
                        style={{ width: `${sectionPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, idx) => {
                    const Icon = item.icon || Circle
                    const helperColors = {
                      CLAUDE: 'border-purple-500/20 text-purple-600 bg-purple-500/10',
                      HUMAN: 'border-orange-500/20 text-orange-600 bg-orange-500/10',
                      BOTH: 'border-blue-500/20 text-blue-600 bg-blue-500/10',
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          item.done
                            ? 'bg-green-500/10 opacity-60'
                            : 'bg-white/[0.03] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div
                          className={`mt-0.5 shrink-0 ${item.done ? 'text-green-600' : 'text-white/40'}`}
                        >
                          {item.done ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                item.done ? 'line-through text-white/50' : 'text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.helper && !item.done && (
                              <Badge
                                variant="outline"
                                className={`text-[9px] px-1.5 py-0 h-4 ${helperColors[item.helper]}`}
                              >
                                {item.helper === 'CLAUDE'
                                  ? 'Claude'
                                  : item.helper === 'HUMAN'
                                  ? 'Humain'
                                  : 'Les deux'}
                              </Badge>
                            )}
                            {item.difficulty && !item.done && (
                              <Badge
                                variant="outline"
                                className={`text-[9px] px-1.5 py-0 h-4 ${difficultyMap[item.difficulty].color}`}
                              >
                                {difficultyMap[item.difficulty].label}
                              </Badge>
                            )}
                          </div>
                          {item.note && (
                            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                              {item.note}
                            </p>
                          )}
                        </div>
                        <Icon
                          className={`h-4 w-4 shrink-0 ${item.done ? 'text-green-600/30' : 'text-white/30'}`}
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
        <Sparkles className="h-8 w-8 text-[#E50914] mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 font-playfair">
          Prochaine etape recommandee
        </h3>
        <p className="text-white/50 text-sm mb-6 max-w-lg mx-auto">
          Configurez Stripe Connect pour activer les paiements. C&apos;est la fonctionnalite
          la plus impactante pour passer en production. Claude peut guider chaque etape.
        </p>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] text-white font-semibold hover:bg-[#FF2D2D] transition-colors"
        >
          Configurer les APIs <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
