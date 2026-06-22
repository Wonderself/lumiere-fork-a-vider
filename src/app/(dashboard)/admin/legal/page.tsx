import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Scale, ShieldCheck, FileText, Building2, CheckCircle, Clock,
  AlertTriangle, Ban, Minus, Bot, User, Users, Cpu, Eye,
  ExternalLink, Landmark, Lock, Globe, Receipt, Gavel,
  MessageSquare, BookOpen, CircleDot,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Conformité Juridique Israélienne' }

// ============================================
// Server Action
// ============================================

async function updateLegalItemAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const itemId = formData.get('itemId') as string
  const status = formData.get('status') as string
  const notes = formData.get('notes') as string

  const data: Record<string, unknown> = {}
  if (status) data.status = status
  if (notes !== null && notes !== undefined) data.notes = notes
  if (status === 'DONE') data.completedAt = new Date()
  if (status !== 'DONE') data.completedAt = null

  await prisma.legalChecklist.update({
    where: { id: itemId },
    data,
  })

  revalidatePath('/admin/legal')
}

// ============================================
// Static config & helpers
// ============================================

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  DONE: { label: 'Complété', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
  IN_PROGRESS: { label: 'En cours', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  PENDING: { label: 'En attente', color: 'bg-white/[0.05] text-white/50 border-white/10', icon: CircleDot },
  BLOCKED: { label: 'Bloqué', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: Ban },
  NA: { label: 'N/A', color: 'bg-white/[0.05] text-white/50 border-white/10', icon: Minus },
}

const responsibleConfig: Record<string, { label: string; color: string; icon: typeof Bot }> = {
  CLAUDE: { label: 'Claude IA', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Bot },
  HUMAN: { label: 'Humain', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: User },
  BOTH: { label: 'Claude + Humain', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20', icon: Users },
  AUTO: { label: 'Automatique', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: Cpu },
}

const priorityConfig: Record<number, { label: string; color: string }> = {
  3: { label: 'HAUTE', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  2: { label: 'MOYENNE', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  1: { label: 'BASSE', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  0: { label: 'INFO', color: 'bg-white/[0.05] text-white/50 border-white/10' },
}

const sectionConfig: Record<string, { title: string; icon: typeof Scale; description: string }> = {
  ISA: {
    title: 'A. Autorité Israélienne des Marchés (ISA)',
    icon: Landmark,
    description: 'Exigences réglementaires de l\'Israel Securities Authority pour les offres de tokens.',
  },
  KYC: {
    title: 'B. Conformité KYC/AML',
    icon: ShieldCheck,
    description: 'Vérification d\'identité et lutte anti-blanchiment conformément à la loi israélienne.',
  },
  TAX: {
    title: 'C. Fiscalité & Comptabilité (Israël)',
    icon: Receipt,
    description: 'Obligations fiscales israéliennes pour la tokenisation et les revenus de la plateforme.',
  },
  CONTRACT: {
    title: 'D. Contrats Intelligents & Technique',
    icon: Lock,
    description: 'Infrastructure technique pour la gestion sécurisée des tokens et des données.',
  },
  CORPORATE: {
    title: 'E. Opérations de la Plateforme',
    icon: Globe,
    description: 'Documents opérationnels et procédures pour le fonctionnement légal de la plateforme.',
  },
}

// ============================================
// Default checklist items for seeding
// ============================================

const DEFAULT_LEGAL_CHECKLIST = [
  // Section A: ISA
  {
    category: 'ISA', item: 'Enregistrement entité juridique', priority: 3, responsible: 'HUMAN',
    description: 'Créer une société israélienne (Ltd ou LLC) pour héberger la plateforme de tokenisation.',
  },
  {
    category: 'ISA', item: 'Demande sandbox ISA', priority: 3, responsible: 'HUMAN',
    description: 'Déposer une demande auprès du sandbox réglementaire de l\'ISA pour les offres de tokens. Lien: https://www.isa.gov.il',
  },
  {
    category: 'ISA', item: 'Documentation offre exemptée (<5M ILS)', priority: 3, responsible: 'BOTH',
    description: 'Préparer la documentation pour une offre exemptée sous le seuil de 5 millions ILS (~1,2M EUR). Claude peut rédiger le brouillon, un avocat doit valider.',
  },
  {
    category: 'ISA', item: 'Processus vérification investisseurs accrédités', priority: 2, responsible: 'BOTH',
    description: 'Mettre en place un processus de vérification du statut d\'investisseur accrédité conforme à la réglementation israélienne.',
  },
  {
    category: 'ISA', item: 'Préparation prospectus (offres >5M ILS)', priority: 1, responsible: 'BOTH',
    description: 'Pour les futures levées dépassant 5M ILS, préparer un prospectus complet. Claude rédige, avocat valide.',
  },

  // Section B: KYC/AML
  {
    category: 'KYC', item: 'Intégration fournisseur KYC', priority: 3, responsible: 'HUMAN',
    description: 'Contracter avec un fournisseur KYC (Sumsub, Jumio ou Onfido) et intégrer leur API.',
  },
  {
    category: 'KYC', item: 'Document politique AML', priority: 2, responsible: 'CLAUDE',
    description: 'Rédiger la politique anti-blanchiment de la plateforme conformément à la loi israélienne sur le blanchiment (2000).',
  },
  {
    category: 'KYC', item: 'Procédure signalement activités suspectes', priority: 2, responsible: 'HUMAN',
    description: 'Définir la procédure de signalement des transactions suspectes auprès de l\'Autorité israélienne de lutte contre le blanchiment (IMPA).',
  },
  {
    category: 'KYC', item: 'Conservation des données (7 ans minimum)', priority: 1, responsible: 'AUTO',
    description: 'Le système conserve automatiquement toutes les données de transaction et vérification pendant minimum 7 ans.',
    status: 'DONE',
  },

  // Section C: Tax
  {
    category: 'TAX', item: 'Inscription TVA (Ma\'am)', priority: 3, responsible: 'HUMAN',
    description: 'S\'inscrire auprès de l\'administration fiscale israélienne pour la TVA (Ma\'am) sur les services de la plateforme.',
  },
  {
    category: 'TAX', item: 'Classification fiscale des tokens', priority: 3, responsible: 'HUMAN',
    description: 'Obtenir un avis juridique sur la classification fiscale des tokens (utility vs security) auprès de l\'administration fiscale israélienne.',
  },
  {
    category: 'TAX', item: 'Certificats fiscaux investisseurs (annuels)', priority: 2, responsible: 'CLAUDE',
    description: 'Générer automatiquement les certificats fiscaux annuels pour les investisseurs. Claude peut créer le template.',
  },
  {
    category: 'TAX', item: 'Documentation prix de transfert', priority: 1, responsible: 'BOTH',
    description: 'Documenter les prix de transfert pour les transactions avec des entités liées internationales.',
  },

  // Section D: Smart Contracts & Technical
  {
    category: 'CONTRACT', item: 'Sélection standard de token', priority: 2, responsible: 'BOTH',
    description: 'Décider entre un token ERC-20 compatible sur blockchain ou un système basé sur base de données. Analyse coût/bénéfice requise.',
  },
  {
    category: 'CONTRACT', item: 'Solution de custody crypto', priority: 2, responsible: 'HUMAN',
    description: 'Contracter avec un fournisseur de custody licencié en Israël pour les paiements en crypto-monnaie.',
  },
  {
    category: 'CONTRACT', item: 'Piste d\'audit complète', priority: 1, responsible: 'AUTO',
    description: 'Piste d\'audit intégrée dans la base de données pour toutes les transactions token et mouvements financiers.',
    status: 'DONE',
  },
  {
    category: 'CONTRACT', item: 'Protection des données (RGPD + loi israélienne)', priority: 2, responsible: 'BOTH',
    description: 'Conformité au RGPD européen et à la Loi israélienne sur la Protection de la Vie Privée (1981). Politique de confidentialité et DPO.',
  },

  // Section E: Platform Operations
  {
    category: 'CORPORATE', item: 'CGU pour les offres de tokens', priority: 3, responsible: 'BOTH',
    description: 'Rédiger les conditions générales d\'utilisation spécifiques aux offres de tokens. Claude rédige, avocat valide.',
  },
  {
    category: 'CORPORATE', item: 'Document de divulgation des risques', priority: 3, responsible: 'BOTH',
    description: 'Document informant les investisseurs de tous les risques associés à l\'investissement en tokens de films IA.',
  },
  {
    category: 'CORPORATE', item: 'Templates communication investisseurs', priority: 1, responsible: 'CLAUDE',
    description: 'Créer les templates d\'emails et notifications pour les investisseurs (confirmation, dividendes, gouvernance).',
  },
  {
    category: 'CORPORATE', item: 'Processus résolution des litiges', priority: 2, responsible: 'HUMAN',
    description: 'Définir un processus de résolution des litiges conforme au droit israélien (arbitrage, médiation).',
  },
]

// ============================================
// Page
// ============================================

export default async function AdminLegalPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const items = await prisma.legalChecklist.findMany({
    orderBy: [{ priority: 'desc' }, { category: 'asc' }, { createdAt: 'asc' }],
  })

  // Group by category
  const grouped: Record<string, typeof items> = {}
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  }

  // Stats
  const total = items.length
  const done = items.filter((i) => i.status === 'DONE').length
  const inProgress = items.filter((i) => i.status === 'IN_PROGRESS').length
  const blocked = items.filter((i) => i.status === 'BLOCKED').length
  const pending = items.filter((i) => i.status === 'PENDING').length
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0

  const highPriority = items.filter((i) => i.priority >= 3 && i.status !== 'DONE').length
  const claudeTasks = items.filter((i) => (i.responsible === 'CLAUDE' || i.responsible === 'BOTH') && i.status !== 'DONE').length
  const humanTasks = items.filter((i) => (i.responsible === 'HUMAN' || i.responsible === 'BOTH') && i.status !== 'DONE').length

  const stats = [
    { label: 'Progression', value: `${progressPct}%`, sub: `${done}/${total} complétés`, color: 'text-[#E50914]', icon: CheckCircle },
    { label: 'En cours', value: inProgress.toString(), sub: 'items actifs', color: 'text-yellow-600', icon: Clock },
    { label: 'Bloqués', value: blocked.toString(), sub: 'à débloquer', color: 'text-red-600', icon: Ban },
    { label: 'Priorité haute', value: highPriority.toString(), sub: 'restants', color: 'text-orange-600', icon: AlertTriangle },
    { label: 'Tâches Claude', value: claudeTasks.toString(), sub: 'automatisables', color: 'text-purple-600', icon: Bot },
    { label: 'Tâches Humain', value: humanTasks.toString(), sub: 'manuelles', color: 'text-blue-600', icon: User },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">
          <Scale className="inline h-7 w-7 text-[#E50914] mr-2 -mt-1" />
          Conformité Juridique Israélienne
        </h1>
        <p className="text-white/50 mt-1">
          Checklist complète pour opérer légalement la tokenisation de co-production en Israël.
        </p>
      </div>

      {/* Global progress */}
      <div className="p-4 rounded-xl border border-[#E50914]/20 bg-[#E50914]/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#E50914]">Progression globale</span>
          <span className="text-sm font-bold text-[#E50914]">{progressPct}%</span>
        </div>
        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" /> {done} complétés
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" /> {inProgress} en cours
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/30" /> {pending} en attente
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" /> {blocked} bloqués
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-white/50">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Scale className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-2">Checklist juridique vide</p>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Exécutez le seed de la base de données pour pré-remplir la checklist avec les éléments
              de conformité israélienne. <code className="bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">npm run db:seed</code>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      {Object.entries(sectionConfig).map(([catKey, catConfig]) => {
        const catItems = grouped[catKey] || []
        if (catItems.length === 0 && items.length > 0) return null

        const catDone = catItems.filter((i) => i.status === 'DONE').length
        const catTotal = catItems.length
        const catPct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0

        const SectionIcon = catConfig.icon

        return (
          <div key={catKey} className="space-y-4">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#E50914]/10 mt-0.5">
                  <SectionIcon className="h-5 w-5 text-[#E50914]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-[family-name:var(--font-playfair)]">
                    {catConfig.title}
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">{catConfig.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0">
                {catDone}/{catTotal} ({catPct}%)
              </Badge>
            </div>

            {/* Section progress */}
            {catTotal > 0 && (
              <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden ml-0 sm:ml-12">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all"
                  style={{ width: `${catPct}%` }}
                />
              </div>
            )}

            {/* Items */}
            <div className="space-y-3 ml-0 sm:ml-12">
              {catItems.map((item) => {
                const stCfg = statusConfig[item.status] || statusConfig.PENDING
                const resCfg = responsibleConfig[item.responsible] || responsibleConfig.HUMAN
                const priCfg = priorityConfig[item.priority] || priorityConfig[0]
                const StatusIcon = stCfg.icon
                const ResponsibleIcon = resCfg.icon

                return (
                  <Card key={item.id} className={item.status === 'DONE' ? 'opacity-60' : ''}>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        {/* Status icon */}
                        <div className="shrink-0 hidden sm:block mt-0.5">
                          <StatusIcon className={`h-5 w-5 ${
                            item.status === 'DONE' ? 'text-green-600' :
                            item.status === 'IN_PROGRESS' ? 'text-yellow-600' :
                            item.status === 'BLOCKED' ? 'text-red-600' :
                            'text-white/50'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-medium text-sm ${item.status === 'DONE' ? 'line-through text-white/50' : ''}`}>
                              {item.item}
                            </h3>
                            <Badge className={`text-[10px] ${stCfg.color}`}>
                              {stCfg.label}
                            </Badge>
                            <Badge className={`text-[10px] ${resCfg.color}`}>
                              <ResponsibleIcon className="h-2.5 w-2.5 mr-0.5" />
                              {resCfg.label}
                            </Badge>
                            <Badge className={`text-[10px] ${priCfg.color}`}>
                              {priCfg.label}
                            </Badge>
                          </div>

                          <p className="text-xs text-white/50 leading-relaxed">
                            {item.description}
                          </p>

                          {item.notes && (
                            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2.5">
                              <p className="text-xs text-yellow-600/70 flex items-start gap-1.5">
                                <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                                {item.notes}
                              </p>
                            </div>
                          )}

                          {item.documentUrl && (
                            <a
                              href={item.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#E50914] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" /> Document associé
                            </a>
                          )}

                          {item.completedAt && (
                            <p className="text-[10px] text-green-600/50">
                              Complété le {new Date(item.completedAt).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="shrink-0">
                          <form action={updateLegalItemAction} className="space-y-2">
                            <input type="hidden" name="itemId" value={item.id} />

                            <select
                              name="status"
                              defaultValue={item.status}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 min-h-[36px]"
                            >
                              <option value="PENDING">En attente</option>
                              <option value="IN_PROGRESS">En cours</option>
                              <option value="DONE">Complété</option>
                              <option value="BLOCKED">Bloqué</option>
                              <option value="NA">N/A</option>
                            </select>

                            <textarea
                              name="notes"
                              placeholder="Notes..."
                              defaultValue={item.notes || ''}
                              rows={2}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 resize-none min-w-[180px]"
                            />

                            <Button type="submit" size="sm" variant="outline" className="w-full min-h-[36px] text-xs">
                              <Eye className="h-3 w-3 mr-1" /> Mettre à jour
                            </Button>
                          </form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Legal disclaimer */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Gavel className="h-5 w-5 text-[#E50914] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Avertissement juridique</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Cette checklist est fournie à titre indicatif et ne constitue pas un avis juridique.
                La réglementation israélienne sur les actifs numériques évolue rapidement.
                Consultez un avocat spécialisé en droit des valeurs mobilières israélien (עורך דין ניירות ערך)
                avant toute offre de tokens. L&apos;Israel Securities Authority (ISA / רשות ניירות ערך) peut
                modifier ses exigences à tout moment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
