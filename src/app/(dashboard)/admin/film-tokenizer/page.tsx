import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { PHASE_LABELS, DIFFICULTY_LABELS, TASK_TYPE_LABELS, GENRES } from '@/lib/constants'
import {
  decomposeFilmToTokens,
  decomposeFilmToTasks,
  generateTimeline,
  generateRiskAssessment,
} from '@/lib/film-decomposer'
import {
  Wand2, Coins, Film, Clock, AlertTriangle, CheckCircle, Plus,
  ArrowRight, Calculator, ListChecks, Calendar, Shield,
  PieChart, Target, Sparkles, BarChart3,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Film Tokenizer' }

// ============================================
// Server Actions
// ============================================

async function createOfferingFromFilmAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  const totalTokens = parseInt(formData.get('totalTokens') as string)
  const tokenPrice = parseFloat(formData.get('tokenPrice') as string)
  const softCap = parseFloat(formData.get('softCap') as string)
  const hardCap = parseFloat(formData.get('hardCap') as string)
  const minInvestment = parseInt(formData.get('minInvestment') as string) || 1
  const maxPerUser = parseInt(formData.get('maxPerUser') as string) || undefined
  const distributionPct = parseFloat(formData.get('distributionPct') as string) || 70
  const lockupDays = parseInt(formData.get('lockupDays') as string) || 90

  if (!filmId || isNaN(totalTokens) || isNaN(tokenPrice) || isNaN(hardCap)) return

  // Check if film already has an offering
  const existing = await prisma.filmTokenOffering.findUnique({
    where: { filmId },
  })
  if (existing) return

  // Create offering
  await prisma.filmTokenOffering.create({
    data: {
      filmId,
      totalTokens,
      tokenPrice,
      softCap: softCap || null,
      hardCap,
      minInvestment,
      maxPerUser: maxPerUser || null,
      distributionPct,
      lockupDays,
      status: 'DRAFT',
      legalStructure: hardCap <= 1200000 ? 'IL_EXEMPT' : 'IL_PROSPECTUS',
      riskLevel: hardCap > 500000 ? 'HIGH' : hardCap > 100000 ? 'MEDIUM' : 'LOW',
      votingRights: true,
      kycRequired: true,
      accreditedOnly: hardCap > 1200000,
    },
  })

  // Create budget lines from form data
  const budgetCategories = formData.getAll('budgetCategory') as string[]
  const budgetLabels = formData.getAll('budgetLabel') as string[]
  const budgetAmounts = formData.getAll('budgetAmount') as string[]
  const budgetPercentages = formData.getAll('budgetPercentage') as string[]

  for (let i = 0; i < budgetCategories.length; i++) {
    await prisma.filmBudgetLine.create({
      data: {
        filmId,
        category: budgetCategories[i],
        label: budgetLabels[i],
        amount: parseFloat(budgetAmounts[i]) || 0,
        percentage: parseFloat(budgetPercentages[i]) || 0,
      },
    })
  }

  revalidatePath('/admin/film-tokenizer')
  revalidatePath('/admin/tokenization')
}

async function autoGenerateTasksAction(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  const genre = formData.get('genre') as string

  if (!filmId) return

  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: { phases: true },
  })
  if (!film) return

  const tasks = decomposeFilmToTasks(genre || film.genre)

  // Ensure phases exist
  const phaseNames = [...new Set(tasks.map((t) => t.phase))]
  const existingPhases = film.phases.map((p) => p.phaseName)

  let phaseOrder = film.phases.length
  for (const phaseName of phaseNames) {
    if (!existingPhases.includes(phaseName as never)) {
      await prisma.filmPhase.create({
        data: {
          filmId,
          phaseName: phaseName as never,
          phaseOrder: phaseOrder++,
          status: 'LOCKED',
        },
      })
    }
  }

  // Re-fetch phases
  const allPhases = await prisma.filmPhase.findMany({
    where: { filmId },
  })

  const phaseMap: Record<string, string> = {}
  for (const p of allPhases) {
    phaseMap[p.phaseName] = p.id
  }

  // Create tasks
  for (const task of tasks) {
    const phaseId = phaseMap[task.phase]
    if (!phaseId) continue

    await prisma.task.create({
      data: {
        filmId,
        phaseId,
        title: task.title,
        descriptionMd: task.description,
        type: task.type as never,
        difficulty: task.difficulty as never,
        priceEuros: task.priceEuros,
        status: 'LOCKED',
        requiredLevel: task.difficulty === 'EXPERT' ? 'EXPERT' : task.difficulty === 'HARD' ? 'PRO' : 'ROOKIE',
      },
    })
  }

  // Update film task count
  const taskCount = await prisma.task.count({ where: { filmId } })
  await prisma.film.update({
    where: { id: filmId },
    data: { totalTasks: taskCount },
  })

  revalidatePath('/admin/film-tokenizer')
  revalidatePath('/admin/tasks')
}

// ============================================
// Risk level colors
// ============================================

const riskColors: Record<string, string> = {
  LOW: 'text-green-600 bg-green-500/10 border-green-500/20',
  MEDIUM: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
  HIGH: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
  VERY_HIGH: 'text-red-400 bg-red-500/10 border-red-500/20',
}

// ============================================
// Page
// ============================================

export default async function AdminFilmTokenizerPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  // Get films without token offerings
  const allFilms = await prisma.film.findMany({
    include: { tokenOffering: true, tasks: { select: { id: true } } },
    orderBy: { title: 'asc' },
  })

  const availableFilms = allFilms.filter((f) => !f.tokenOffering)
  const tokenizedFilms = allFilms.filter((f) => f.tokenOffering)

  // Pre-calculate decomposition for the first available film (demo)
  const demoFilm = availableFilms[0]
  const demoGenre = demoFilm?.genre || null
  const demoBudget = demoFilm?.estimatedBudget || 50000
  const demoDecomp = decomposeFilmToTokens(demoBudget, demoGenre)
  const demoTasks = decomposeFilmToTasks(demoGenre)
  const demoTimeline = generateTimeline(demoGenre)
  const demoRisks = generateRiskAssessment(demoBudget, demoGenre)
  const totalTimelineWeeks = demoTimeline.reduce((max, t) => Math.max(max, t.startWeek + t.durationWeeks), 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">
            <Wand2 className="inline h-7 w-7 text-[#E50914] mr-2 -mt-1" />
            Film Tokenizer
          </h1>
          <p className="text-white/50 mt-1">
            Décomposition automatique d&apos;un film en offre tokenisée et micro-tâches.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{availableFilms.length} films disponibles</Badge>
          <Badge>{tokenizedFilms.length} déjà tokenisés</Badge>
        </div>
      </div>

      {/* Empty state */}
      {availableFilms.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Film className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-2">Tous les films sont déjà tokenisés</p>
            <p className="text-white/25 text-sm max-w-md mx-auto">
              Créez un nouveau film depuis l&apos;admin ou ajoutez-en via le seed pour pouvoir le tokeniser.
            </p>
            <a href="/admin/films/new" className="inline-block mt-4">
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouveau Film</Button>
            </a>
          </CardContent>
        </Card>
      )}

      {availableFilms.length > 0 && (
        <>
          {/* ========================================== */}
          {/* CREATE OFFERING FORM */}
          {/* ========================================== */}
          <form action={createOfferingFromFilmAction}>
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Coins className="h-4 w-4 text-[#E50914]" />
                  Créer une Offre de Tokenisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Film selector */}
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Sélectionner un film</label>
                  <select
                    name="filmId"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
                    defaultValue={demoFilm?.id || ''}
                  >
                    <option value="">Choisir un film...</option>
                    {availableFilms.map((film) => (
                      <option key={film.id} value={film.id}>
                        {film.title} — {film.genre || 'Genre non défini'} — Budget: {formatPrice(film.estimatedBudget || 0)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Breakdown Preview */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-[#E50914]" />
                    Répartition budgétaire (modifiable)
                  </h3>
                  <div className="space-y-2">
                    {demoDecomp.budget.map((line, idx) => (
                      <div key={line.category} className="grid grid-cols-12 gap-2 items-center">
                        <input type="hidden" name="budgetCategory" value={line.category} />
                        <input type="hidden" name="budgetLabel" value={line.label} />
                        <div className="col-span-4 sm:col-span-3">
                          <span className="text-xs text-white/60">{line.label}</span>
                        </div>
                        <div className="col-span-3 sm:col-span-3">
                          <input
                            type="number"
                            name="budgetAmount"
                            defaultValue={line.amount}
                            step="1"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white min-h-[36px]"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                          <input
                            type="number"
                            name="budgetPercentage"
                            defaultValue={line.percentage}
                            step="0.1"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white min-h-[36px]"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-4">
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D]"
                              style={{ width: `${line.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token Parameters */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#E50914]" />
                    Paramètres des Tokens (modifiable)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Tokens totaux</label>
                      <input
                        type="number"
                        name="totalTokens"
                        defaultValue={demoDecomp.tokens.totalTokens}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Prix / token (EUR)</label>
                      <input
                        type="number"
                        name="tokenPrice"
                        step="0.01"
                        defaultValue={demoDecomp.tokens.tokenPrice}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Soft Cap (EUR)</label>
                      <input
                        type="number"
                        name="softCap"
                        step="0.01"
                        defaultValue={demoDecomp.tokens.softCap}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Hard Cap (EUR)</label>
                      <input
                        type="number"
                        name="hardCap"
                        step="0.01"
                        defaultValue={demoDecomp.tokens.hardCap}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Min. investissement</label>
                      <input
                        type="number"
                        name="minInvestment"
                        defaultValue={demoDecomp.tokens.minInvestment}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Max / utilisateur</label>
                      <input
                        type="number"
                        name="maxPerUser"
                        defaultValue={demoDecomp.tokens.maxPerUser}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Distribution (%)</label>
                      <input
                        type="number"
                        name="distributionPct"
                        step="1"
                        min="0"
                        max="100"
                        defaultValue={demoDecomp.tokens.distributionPct}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Lockup (jours)</label>
                      <input
                        type="number"
                        name="lockupDays"
                        defaultValue={demoDecomp.tokens.lockupDays}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full min-h-[48px]" size="lg">
                  <Coins className="h-4 w-4 mr-2" />
                  Créer l&apos;Offre de Tokenisation
                </Button>
              </CardContent>
            </Card>
          </form>

          {/* ========================================== */}
          {/* TASK DECOMPOSITION PREVIEW */}
          {/* ========================================== */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-[#E50914]" />
                Prévisualisation des Tâches Auto-Générées
                <Badge variant="outline" className="text-[10px] ml-2">
                  {demoTasks.length} tâches
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {/* Group by phase */}
                {Object.entries(
                  demoTasks.reduce<Record<string, typeof demoTasks>>((acc, task) => {
                    if (!acc[task.phase]) acc[task.phase] = []
                    acc[task.phase].push(task)
                    return acc
                  }, {})
                ).map(([phase, tasks]) => (
                  <div key={phase} className="mb-4">
                    <h4 className="text-xs font-semibold text-[#E50914] mb-2 uppercase tracking-wider">
                      {(PHASE_LABELS as Record<string, string>)[phase] || phase}
                    </h4>
                    <div className="space-y-1.5">
                      {tasks.map((task, idx) => (
                        <div
                          key={`${phase}-${idx}`}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all"
                        >
                          <div className={`w-1.5 h-8 rounded-full shrink-0 ${
                            task.difficulty === 'EXPERT' ? 'bg-red-500' :
                            task.difficulty === 'HARD' ? 'bg-orange-500' :
                            task.difficulty === 'MEDIUM' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{task.title}</p>
                            <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
                              <span>{(TASK_TYPE_LABELS as Record<string, string>)[task.type] || task.type}</span>
                              <span>·</span>
                              <span>{(DIFFICULTY_LABELS as Record<string, string>)[task.difficulty] || task.difficulty}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[#E50914] shrink-0">
                            {formatPrice(task.priceEuros)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-sm text-white/50">
                  Coût total des tâches :
                </span>
                <span className="text-lg font-bold text-[#E50914]">
                  {formatPrice(demoTasks.reduce((s, t) => s + t.priceEuros, 0))}
                </span>
              </div>

              {/* Auto-generate tasks form */}
              {demoFilm && (
                <form action={autoGenerateTasksAction} className="mt-4">
                  <input type="hidden" name="filmId" value={demoFilm.id} />
                  <input type="hidden" name="genre" value={demoGenre || ''} />
                  <Button type="submit" variant="outline" className="w-full min-h-[48px]" size="lg">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Auto-Générer {demoTasks.length} Tâches pour &laquo;{demoFilm.title}&raquo;
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ========================================== */}
            {/* TIMELINE ESTIMATE */}
            {/* ========================================== */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E50914]" />
                  Estimation du Planning
                  <Badge variant="outline" className="text-[10px] ml-2">
                    {totalTimelineWeeks} semaines
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoTimeline.map((phase) => {
                    const widthPct = totalTimelineWeeks > 0
                      ? (phase.durationWeeks / totalTimelineWeeks) * 100
                      : 0
                    const leftPct = totalTimelineWeeks > 0
                      ? (phase.startWeek / totalTimelineWeeks) * 100
                      : 0

                    return (
                      <div key={phase.phase} className="flex items-center gap-3">
                        <div className="w-24 shrink-0 text-right">
                          <span className="text-xs text-white/50">
                            {(PHASE_LABELS as Record<string, string>)[phase.phase] || phase.phase}
                          </span>
                        </div>
                        <div className="flex-1 h-6 bg-white/[0.02] rounded relative">
                          <div
                            className="absolute h-full rounded bg-gradient-to-r from-[#E50914]/60 to-[#FF2D2D]/60 border border-[#E50914]/20"
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-white/80">
                              {phase.durationWeeks}s
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-white/30">
                  <span>Semaine 0</span>
                  <span>Semaine {totalTimelineWeeks}</span>
                </div>
                <div className="mt-2 text-xs text-white/40 text-center">
                  Durée estimée : <span className="text-[#E50914] font-medium">
                    {Math.ceil(totalTimelineWeeks / 4)} mois
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ========================================== */}
            {/* RISK ASSESSMENT */}
            {/* ========================================== */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#E50914]" />
                  Évaluation des Risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoRisks.map((risk) => (
                    <div
                      key={risk.category}
                      className="p-3 rounded-lg border border-white/5 bg-white/[0.01]"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{risk.category}</span>
                        <Badge className={`text-[10px] ${riskColors[risk.level] || riskColors.MEDIUM}`}>
                          {risk.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50 mb-1">{risk.description}</p>
                      <div className="flex items-start gap-1.5">
                        <Shield className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-green-600/70">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall risk */}
                <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-xs text-white/40">Risque global</p>
                  <p className="text-lg font-bold text-yellow-600 mt-1">MOYEN</p>
                  <p className="text-[10px] text-white/30 mt-1">
                    Basé sur {demoRisks.length} facteurs de risque analysés
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========================================== */}
          {/* SUMMARY */}
          {/* ========================================== */}
          <Card variant="glass">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 font-[family-name:var(--font-playfair)] flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#E50914]" />
                Résumé de la Décomposition
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <Coins className="h-5 w-5 text-[#E50914] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#E50914]">{demoDecomp.tokens.totalTokens}</p>
                  <p className="text-[10px] text-white/40">Tokens à émettre</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <Target className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-600">{formatPrice(demoDecomp.tokens.hardCap)}</p>
                  <p className="text-[10px] text-white/40">Objectif de levée</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <ListChecks className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-600">{demoTasks.length}</p>
                  <p className="text-[10px] text-white/40">Tâches générées</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-purple-600">{Math.ceil(totalTimelineWeeks / 4)} mois</p>
                  <p className="text-[10px] text-white/40">Durée estimée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Already tokenized films */}
      {tokenizedFilms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Films Déjà Tokenisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokenizedFilms.map((film) => (
                <div
                  key={film.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.01]"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{film.title}</p>
                    <p className="text-[10px] text-white/30">{film.genre || 'N/A'} · {film.tasks.length} tâches</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-[#E50914] font-bold">
                      {formatPrice(film.tokenOffering?.raised || 0)}
                    </p>
                    <p className="text-[10px] text-white/30">
                      / {formatPrice(film.tokenOffering?.hardCap || 0)}
                    </p>
                  </div>
                  <a href="/admin/tokenization">
                    <Button size="sm" variant="ghost" className="min-h-[36px]">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
