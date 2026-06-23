import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AutomationCard } from '@/components/admin/automation-toggle'
import { ActivateAllButton } from '@/components/admin/activate-all-button'
import {
  Bot, User, Users, Zap, CheckCircle, AlertTriangle, XCircle,
  DollarSign, TrendingUp, Cpu, Brain, Sparkles, Shield,
  FileText, MessageSquare, Globe, BarChart3, Target, Palette,
  Scale, Building2, CreditCard, PenLine, Gavel, Stamp,
  Calculator, Eye, Video, Languages, Megaphone, Lightbulb,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Automatisation Claude IA' }

// ============================================
// Automation items data
// ============================================

interface AutomationItem {
  id: string
  title: string
  description: string
  detail: string
  icon: typeof Bot
  costSaving: number // Monthly EUR saved
  active: boolean
}

const fullyAutomated: AutomationItem[] = [
  {
    id: 'script-gen',
    title: 'Screenplay generation',
    description: 'Creation of complete scripts from prompts.',
    detail: 'Claude génère des scénarios structurés (3 actes, dialogues, descriptions de scènes) à partir d\'un simple pitch. Inclut le formatage professionnel et les notes de réalisation.',
    icon: PenLine,
    costSaving: 2000,
    active: true,
  },
  {
    id: 'task-decomposition',
    title: 'Task breakdown',
    description: 'Film -> phases -> micro-tasks automatically.',
    detail: 'Analyse le scénario et le genre pour décomposer automatiquement un film en phases de production et micro-tâches assignables. Estime les budgets et délais pour chaque tâche.',
    icon: Target,
    costSaving: 1500,
    active: true,
  },
  {
    id: 'ai-review',
    title: 'Revue IA des soumissions',
    description: 'Automatic quality scoring of deliverables.',
    detail: 'Évalue chaque soumission sur des critères de qualité technique et artistique. Score de 0-100 avec feedback détaillé. Les soumissions sous le seuil sont signalées pour revue humaine.',
    icon: Eye,
    costSaving: 3000,
    active: true,
  },
  {
    id: 'token-creation',
    title: 'Token offering creation',
    description: 'Automatic setup of tokenization offerings.',
    detail: 'À partir des paramètres du film (budget, genre, durée), génère automatiquement la structure de l\'offre de tokens : prix, caps, budget breakdown, risk assessment.',
    icon: Sparkles,
    costSaving: 500,
    active: true,
  },
  {
    id: 'revenue-calc',
    title: 'Calcul des revenus & dividendes',
    description: 'Distribution proportionnelle automatique.',
    detail: 'Calcule automatiquement les dividendes pour chaque détenteur de tokens en fonction des revenus enregistrés et du pourcentage de distribution configuré.',
    icon: Calculator,
    costSaving: 800,
    active: true,
  },
  {
    id: 'marketing-copy',
    title: 'Marketing & social media',
    description: 'Writing posts, emails and marketing copy.',
    detail: 'Generates marketing content tailored to each platform (X, Instagram, LinkedIn, TikTok) with the right formats, hashtags and calls to action.',
    icon: Megaphone,
    costSaving: 1200,
    active: false,
  },
  {
    id: 'investor-comms',
    title: 'Communications investisseurs',
    description: 'Drafts d\'emails et rapports pour les investisseurs.',
    detail: 'Rédige les communications périodiques aux investisseurs : rapports trimestriels, annonces de dividendes, mises à jour de production, convocations de vote.',
    icon: MessageSquare,
    costSaving: 600,
    active: false,
  },
  {
    id: 'contract-templates',
    title: 'Contract generation',
    description: 'Custom contract templates.',
    detail: 'Génère des templates de contrats adaptés : CGU investisseurs, accords de co-production, licences de droits, contrats de prestation pour les contributeurs.',
    icon: FileText,
    costSaving: 1000,
    active: false,
  },
  {
    id: 'content-moderation',
    title: 'Moderation & quality scoring',
    description: 'Analyse et scoring automatique du contenu.',
    detail: 'Modère automatiquement le contenu soumis par les utilisateurs (commentaires, portfolios, soumissions) et détecte le contenu inapproprié ou de faible qualité.',
    icon: Shield,
    costSaving: 800,
    active: true,
  },
  {
    id: 'ab-testing',
    title: 'Variantes A/B testing',
    description: 'Variant generation for creative testing.',
    detail: 'Automatically creates variants (titles, thumbnails, descriptions) for creators\' videos and analyzes performance to optimize.',
    icon: Palette,
    costSaving: 400,
    active: false,
  },
  {
    id: 'translation',
    title: 'Traduction multilingue',
    description: 'Instant translation into 10+ languages.',
    detail: 'Traduit automatiquement le contenu de la plateforme, les sous-titres, les communications marketing et les documents juridiques en français, anglais, hébreu, arabe, espagnol, et plus.',
    icon: Languages,
    costSaving: 1500,
    active: true,
  },
  {
    id: 'budget-optimization',
    title: 'Budget optimization',
    description: 'Cost-optimization suggestions.',
    detail: 'Analyse les dépenses par catégorie et suggère des optimisations : réallocation de budget, alternatives moins coûteuses, priorisation des tâches à fort ROI.',
    icon: Lightbulb,
    costSaving: 500,
    active: false,
  },
  {
    id: 'analytics',
    title: 'Analytics & reporting',
    description: 'Rapports automatiques et insights.',
    detail: 'Generates weekly/monthly reports with KPIs, trends, alerts and actionable recommendations for the founder.',
    icon: BarChart3,
    costSaving: 700,
    active: true,
  },
]

const assisted: AutomationItem[] = [
  {
    id: 'legal-docs',
    title: 'Documents juridiques',
    description: 'CGU, prospectus, divulgation des risques.',
    detail: 'Claude rédige les brouillons des documents juridiques (CGU token, prospectus, document de risques). Un avocat spécialisé doit valider avant publication.',
    icon: Scale,
    costSaving: 800,
    active: true,
  },
  {
    id: 'kyc-decisions',
    title: 'KYC/AML decisions',
    description: 'Pre-analysis of KYC files.',
    detail: 'Claude pré-analyse les dossiers KYC et signale les incohérences ou risques. La décision finale d\'approbation ou rejet reste humaine pour la conformité réglementaire.',
    icon: Shield,
    costSaving: 400,
    active: false,
  },
  {
    id: 'dispute-resolution',
    title: 'Dispute resolution',
    description: 'Assisted resolution suggestions.',
    detail: 'Analyse les litiges entre contributeurs et investisseurs, propose des résolutions basées sur les CGU et le droit applicable. L\'humain décide et communique.',
    icon: Gavel,
    costSaving: 300,
    active: false,
  },
  {
    id: 'pricing-strategy',
    title: 'Pricing strategy',
    description: 'Recommandations de prix et positionnement.',
    detail: 'Analyse le marché, la concurrence et les données internes pour recommander des prix de tokens, des montants de tâches et des tarifs d\'abonnement optimaux.',
    icon: DollarSign,
    costSaving: 200,
    active: false,
  },
  {
    id: 'sensitive-content',
    title: 'Contenu sensible',
    description: 'Review de contenu potentiellement litigieux.',
    detail: 'Identifie le contenu qui pourrait poser des problèmes juridiques, éthiques ou culturels (notamment pour les marchés israélien et international). Escalade vers un humain.',
    icon: AlertTriangle,
    costSaving: 300,
    active: false,
  },
  {
    id: 'creative-decisions',
    title: 'Creative decisions',
    description: 'AI-assisted art direction.',
    detail: 'Propose des options créatives (casting, style visuel, direction musicale) mais les décisions finales de direction artistique restent au réalisateur/fondateur.',
    icon: Video,
    costSaving: 200,
    active: false,
  },
]

const humanOnly: AutomationItem[] = [
  {
    id: 'isa-filings',
    title: 'ISA regulatory filings',
    description: 'Official filings with the securities authority.',
    detail: 'Les dépôts auprès de l\'Israel Securities Authority (ISA) doivent être effectués par une personne physique autorisée, souvent avec signature électronique certifiée.',
    icon: Building2,
    costSaving: 0,
    active: false,
  },
  {
    id: 'bank-setup',
    title: 'Comptes bancaires & PSP',
    description: 'Ouverture de comptes et contrats processeurs.',
    detail: 'L\'ouverture de comptes bancaires d\'entreprise en Israël et la contractualisation avec des processeurs de paiement (Stripe, PayPlus) nécessitent une présence physique.',
    icon: CreditCard,
    costSaving: 0,
    active: false,
  },
  {
    id: 'kyc-contracts',
    title: 'Contrats fournisseurs KYC',
    description: 'Negotiation and signing with Sumsub/Jumio.',
    detail: 'Selecting, negotiating rates and signing contracts with identity-verification providers requires a human contact.',
    icon: Shield,
    costSaving: 0,
    active: false,
  },
  {
    id: 'incorporation',
    title: 'Company incorporation',
    description: 'Creation of the legal entity in Israel.',
    detail: 'Registering a company (Ltd/LLC) with the Israeli Registrar of Companies requires physical documents and a local lawyer.',
    icon: Building2,
    costSaving: 0,
    active: false,
  },
  {
    id: 'tax-declarations',
    title: 'Tax filings',
    description: 'VAT and corporate tax filings.',
    detail: 'Tax filings with the Israeli authorities (Mas Hachnasa, Ma\'am) must be signed by a certified accountant (Ro\'e Heshbon).',
    icon: Calculator,
    costSaving: 0,
    active: false,
  },
  {
    id: 'signatures',
    title: 'Signatures physiques',
    description: 'Documents requiring a handwritten signature.',
    detail: 'Some Israeli legal documents require a physical signature authenticated or certified by a notary (No\'tar).',
    icon: Stamp,
    costSaving: 0,
    active: false,
  },
  {
    id: 'court',
    title: 'Litiges juridiques & tribunaux',
    description: 'Court representation and hearings.',
    detail: 'Any proceeding before Israeli courts requires a lawyer admitted to the Israeli Bar (Lishkat Orchei HaDin).',
    icon: Gavel,
    costSaving: 0,
    active: false,
  },
  {
    id: 'accreditation',
    title: 'Accreditation verification',
    description: 'Accredited investor status verification.',
    detail: 'La vérification finale du statut d\'investisseur accrédité selon la loi israélienne doit être effectuée par un professionnel qualifié (avocat ou comptable).',
    icon: Users,
    costSaving: 0,
    active: false,
  },
]

// ============================================
// Page
// ============================================

export default async function AdminAIAutomationPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const totalItems = fullyAutomated.length + assisted.length + humanOnly.length
  const automationPct = Math.round((fullyAutomated.length / totalItems) * 100)
  const activatedCount = [...fullyAutomated, ...assisted].filter((i) => i.active).length
  const totalActivatable = fullyAutomated.length + assisted.length
  const totalMonthlySavings = [...fullyAutomated, ...assisted].reduce((s, i) => s + i.costSaving, 0)
  const activeSavings = [...fullyAutomated, ...assisted].filter((i) => i.active).reduce((s, i) => s + i.costSaving, 0)
  const claudeApiCost = 100

  const stats = [
    { label: 'Full automation', value: `${fullyAutomated.length}/${totalItems}`, sub: `${automationPct}% automatisé`, color: 'text-green-600', icon: CheckCircle },
    { label: 'Assisted (Claude + Human)', value: assisted.length.toString(), sub: 'approbation requise', color: 'text-yellow-600', icon: AlertTriangle },
    { label: 'Humain uniquement', value: humanOnly.length.toString(), sub: 'non automatisable', color: 'text-red-400', icon: XCircle },
    { label: 'Modules enabled', value: `${activatedCount}/${totalActivatable}`, sub: 'en production', color: 'text-blue-600', icon: Zap },
    { label: 'Claude API cost', value: `${claudeApiCost} EUR/mois`, sub: 'budget API actuel', color: 'text-purple-600', icon: Brain },
    { label: 'Active savings', value: `${new Intl.NumberFormat('fr-FR').format(activeSavings)} EUR`, sub: '/month est.', color: 'text-[#E50914]', icon: DollarSign },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">
          <Bot className="inline h-7 w-7 text-[#E50914] mr-2 -mt-1" />
          Automatisation Claude IA
        </h1>
        <p className="text-white/50 mt-1">
          Tableau de bord complet : ce que Claude automatise vs ce qui nécessite une intervention humaine.
        </p>
      </div>

      {/* Cost analysis hero card */}
      <Card variant="gold">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Brain className="h-8 w-8 text-[#E50914] mx-auto mb-2" />
              <p className="text-3xl font-bold text-[#E50914]">{claudeApiCost} EUR</p>
              <p className="text-xs text-white/50 mt-1">Monthly Claude API cost</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR').format(totalMonthlySavings)} EUR
              </p>
              <p className="text-xs text-white/50 mt-1">Potential savings / month</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(totalMonthlySavings / claudeApiCost)}x
              </p>
              <p className="text-xs text-white/50 mt-1">ROI de l&apos;investissement IA</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/10">
            <p className="text-xs text-white/50 text-center">
              Avec Claude API à <span className="text-[#E50914] font-bold">{claudeApiCost} EUR/mois</span>,
              vous remplacez environ <span className="text-green-600 font-bold">{new Intl.NumberFormat('fr-FR').format(totalMonthlySavings)} EUR/mois</span> en
              main-d&apos;oeuvre. Économie actuellement active :
              <span className="text-[#E50914] font-bold"> {new Intl.NumberFormat('fr-FR').format(activeSavings)} EUR/mois</span>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-white/40">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automation progress bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Niveau d&apos;automatisation</span>
          <span className="text-sm font-bold text-[#E50914]">
            {fullyAutomated.length + assisted.length}/{totalItems} tâches automatisables
          </span>
        </div>
        <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${(fullyAutomated.length / totalItems) * 100}%` }}
            title={`${fullyAutomated.length} entièrement automatisées`}
          />
          <div
            className="h-full bg-yellow-500 transition-all"
            style={{ width: `${(assisted.length / totalItems) * 100}%` }}
            title={`${assisted.length} assistées`}
          />
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${(humanOnly.length / totalItems) * 100}%` }}
            title={`${humanOnly.length} humain uniquement`}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" /> {fullyAutomated.length} auto
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" /> {assisted.length} assisté
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" /> {humanOnly.length} humain
          </span>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Fully Automated (Green) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-green-600 font-[family-name:var(--font-playfair)]">
                Automatisation complète
              </h2>
              <p className="text-[10px] text-white/50">Claude handles 100%</p>
            </div>
            <Badge variant="success" className="ml-auto text-[10px]">{fullyAutomated.length}</Badge>
          </div>
          <div className="space-y-3">
            {fullyAutomated.map((item) => <AutomationCard key={item.id} item={item} type="auto" />)}
          </div>
        </div>

        {/* Column 2: Assisted (Yellow) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-semibold text-yellow-600 font-[family-name:var(--font-playfair)]">
                Assisté par Claude
              </h2>
              <p className="text-[10px] text-white/50">Claude drafts, human approves</p>
            </div>
            <Badge variant="warning" className="ml-auto text-[10px]">{assisted.length}</Badge>
          </div>
          <div className="space-y-3">
            {assisted.map((item) => <AutomationCard key={item.id} item={item} type="assisted" />)}
          </div>
        </div>

        {/* Column 3: Human Only (Red) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-red-400 font-[family-name:var(--font-playfair)]">
                Humain uniquement
              </h2>
              <p className="text-[10px] text-white/50">Non automatisable</p>
            </div>
            <Badge variant="destructive" className="ml-auto text-[10px]">{humanOnly.length}</Badge>
          </div>
          <div className="space-y-3">
            {humanOnly.map((item) => <AutomationCard key={item.id} item={item} type="human" />)}
          </div>
        </div>
      </div>

      {/* Monthly cost estimate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[#E50914]" />
            Estimation des Coûts Mensuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/50 uppercase">
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-right py-3 px-2">Avec Humains</th>
                  <th className="text-right py-3 px-2">Avec Claude</th>
                  <th className="text-right py-3 px-2">Economy</th>
                </tr>
              </thead>
              <tbody className="text-white/60">
                {fullyAutomated.filter(i => i.costSaving > 0).map((item) => (
                  <tr key={item.id} className="border-b border-white/10">
                    <td className="py-2.5 px-2 flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {item.title}
                    </td>
                    <td className="text-right py-2.5 px-2 text-white/50">
                      {new Intl.NumberFormat('fr-FR').format(item.costSaving)} EUR
                    </td>
                    <td className="text-right py-2.5 px-2 text-green-600">
                      ~{Math.round(item.costSaving * 0.01)} EUR
                    </td>
                    <td className="text-right py-2.5 px-2 text-[#E50914] font-medium">
                      -{new Intl.NumberFormat('fr-FR').format(Math.round(item.costSaving * 0.99))} EUR
                    </td>
                  </tr>
                ))}
                {assisted.filter(i => i.costSaving > 0).map((item) => (
                  <tr key={item.id} className="border-b border-white/10">
                    <td className="py-2.5 px-2 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      {item.title}
                    </td>
                    <td className="text-right py-2.5 px-2 text-white/50">
                      {new Intl.NumberFormat('fr-FR').format(item.costSaving)} EUR
                    </td>
                    <td className="text-right py-2.5 px-2 text-yellow-600">
                      ~{Math.round(item.costSaving * 0.3)} EUR
                    </td>
                    <td className="text-right py-2.5 px-2 text-[#E50914] font-medium">
                      -{new Intl.NumberFormat('fr-FR').format(Math.round(item.costSaving * 0.7))} EUR
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-3 px-2">TOTAL</td>
                  <td className="text-right py-3 px-2 text-white/50">
                    {new Intl.NumberFormat('fr-FR').format(totalMonthlySavings)} EUR
                  </td>
                  <td className="text-right py-3 px-2 text-green-600">
                    {claudeApiCost} EUR
                  </td>
                  <td className="text-right py-3 px-2 text-[#E50914]">
                    -{new Intl.NumberFormat('fr-FR').format(totalMonthlySavings - claudeApiCost)} EUR
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activation CTA */}
      <Card variant="glass">
        <CardContent className="p-6 text-center">
          <Cpu className="h-8 w-8 text-[#E50914] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1 font-[family-name:var(--font-playfair)]">
            Activer tous les modules
          </h3>
          <p className="text-xs text-white/50 max-w-lg mx-auto mb-4">
            Activez tous les modules d&apos;automatisation Claude pour maximiser les économies.
            Chaque module peut être activé/désactivé individuellement. L&apos;API Claude est
            facturée à l&apos;usage avec un budget plafonné à {claudeApiCost} EUR/mois.
          </p>
          <ActivateAllButton remaining={totalActivatable - activatedCount} />
        </CardContent>
      </Card>
    </div>
  )
}
