/**
 * Film-to-Token Decomposition Engine
 *
 * Auto-decomposes a film project into tokenized offerings and task lists
 * based on genre, budget, and production requirements.
 */

// Constants (inline to avoid circular dependency)
const DEFAULT_TOKEN_PRICE = 10
const PLATFORM_FEE_PCT = 3

// ============================================
// TYPES
// ============================================

export interface BudgetBreakdown {
  category: string
  label: string
  amount: number
  percentage: number
}

export interface TokenParameters {
  totalTokens: number
  tokenPrice: number
  softCap: number
  hardCap: number
  minInvestment: number
  maxPerUser: number
  distributionPct: number
  lockupDays: number
}

export interface TaskDecomposition {
  title: string
  type: string
  phase: string
  difficulty: string
  priceEuros: number
  description: string
}

export interface TimelineEstimate {
  phase: string
  durationWeeks: number
  startWeek: number
}

export interface RiskAssessment {
  category: string
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  description: string
  mitigation: string
}

export interface OfferingParams {
  totalTokens: number
  tokenPrice: number
  hardCap: number
  softCap: number
  budgetLines: BudgetBreakdown[]
  projectedROI: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  lockupDays: number
}

// ============================================
// BUDGET BREAKDOWN TEMPLATES
// ============================================

/** Standard budget breakdown by category */
const BASE_BUDGET_BREAKDOWN: Record<string, { label: string; basePct: number }> = {
  SCRIPT: { label: 'Scenario & Droits', basePct: 12 },
  PREVIZ: { label: 'Previsualization & Storyboard', basePct: 8 },
  VFX: { label: 'VFX & Effets Speciaux', basePct: 20 },
  ANIMATION: { label: 'Animation & Motion', basePct: 10 },
  SOUND: { label: 'Son & Musique', basePct: 8 },
  ACTORS: { label: 'Acteurs & Performances', basePct: 10 },
  DESIGN: { label: 'Direction Artistique & Design', basePct: 8 },
  EDITING: { label: 'Montage & Post-Production', basePct: 7 },
  MARKETING: { label: 'Marketing & Distribution', basePct: 10 },
  LEGAL: { label: 'Juridique & Compliance', basePct: 4 },
  PLATFORM_FEE: { label: 'Commission Plateforme', basePct: PLATFORM_FEE_PCT },
}

/** Genre-specific budget adjustments (additive to base) */
const GENRE_BUDGET_ADJUSTMENTS: Record<string, Partial<Record<string, number>>> = {
  'Science-Fiction': { VFX: +12, ANIMATION: +5, DESIGN: +3, SCRIPT: -5, ACTORS: -5, MARKETING: -3 },
  'Action': { VFX: +8, ACTORS: +5, ANIMATION: +3, SCRIPT: -5, DESIGN: -3, EDITING: -2 },
  'Drame': { SCRIPT: +6, ACTORS: +8, SOUND: +2, VFX: -10, ANIMATION: -5, DESIGN: -2 },
  'Horreur': { VFX: +5, SOUND: +5, DESIGN: +3, ANIMATION: -5, ACTORS: -3, MARKETING: -2 },
  'Animation': { ANIMATION: +20, DESIGN: +8, VFX: -5, ACTORS: -10, SOUND: +2, EDITING: -5 },
  'Comedie': { SCRIPT: +5, ACTORS: +5, MARKETING: +3, VFX: -8, ANIMATION: -5, DESIGN: -3 },
  'Documentaire': { SCRIPT: +3, SOUND: +3, EDITING: +5, VFX: -10, ANIMATION: -5, ACTORS: -5 },
  'Fantaisie': { VFX: +10, DESIGN: +8, ANIMATION: +5, ACTORS: -5, SCRIPT: -3, EDITING: -3 },
  'Thriller': { SCRIPT: +5, SOUND: +5, EDITING: +3, VFX: -5, ANIMATION: -5, DESIGN: -3 },
  'Musical': { SOUND: +12, ACTORS: +8, ANIMATION: +3, VFX: -8, DESIGN: -3, EDITING: -2 },
  'Romance': { SCRIPT: +5, ACTORS: +5, SOUND: +3, VFX: -8, ANIMATION: -5, DESIGN: -2 },
  'Western': { DESIGN: +5, VFX: +3, ACTORS: +3, ANIMATION: -5, SOUND: -2, EDITING: -2 },
  'Historique': { DESIGN: +8, SCRIPT: +3, VFX: +3, ANIMATION: -5, ACTORS: -2, SOUND: -2 },
  'Biblique': { DESIGN: +10, VFX: +8, SCRIPT: +5, ANIMATION: -5, ACTORS: -5, MARKETING: -3 },
  'Aventure': { VFX: +5, DESIGN: +5, ANIMATION: +3, SCRIPT: -3, ACTORS: -3, SOUND: -2 },
}

// Budget templates by genre (legacy format kept for backward-compat)
const BUDGET_TEMPLATES: Record<string, { category: string; label: string; pct: number }[]> = {
  default: [
    { category: 'SCRIPT', label: 'Scenario & droits', pct: 8 },
    { category: 'VFX', label: 'Effets visuels & animation', pct: 30 },
    { category: 'SOUND', label: 'Sound design & musique', pct: 10 },
    { category: 'ACTORS', label: 'Capture performance & voix', pct: 12 },
    { category: 'MARKETING', label: 'Marketing & distribution', pct: 15 },
    { category: 'LEGAL', label: 'Frais juridiques & conformite', pct: 8 },
    { category: 'PLATFORM_FEE', label: 'Commission plateforme', pct: 10 },
    { category: 'CONTINGENCY', label: 'Reserve imprevus', pct: 7 },
  ],
  'Science-Fiction': [
    { category: 'SCRIPT', label: 'Scenario & worldbuilding', pct: 7 },
    { category: 'VFX', label: 'VFX & environnements 3D', pct: 35 },
    { category: 'SOUND', label: 'Sound design sci-fi', pct: 10 },
    { category: 'ACTORS', label: 'Capture performance', pct: 10 },
    { category: 'MARKETING', label: 'Marketing & trailers', pct: 14 },
    { category: 'LEGAL', label: 'Frais juridiques', pct: 7 },
    { category: 'PLATFORM_FEE', label: 'Commission plateforme', pct: 10 },
    { category: 'CONTINGENCY', label: 'Reserve imprevus', pct: 7 },
  ],
  Action: [
    { category: 'SCRIPT', label: 'Scenario & choregraphie', pct: 6 },
    { category: 'VFX', label: 'VFX & cascades numeriques', pct: 32 },
    { category: 'SOUND', label: 'Sound design action', pct: 10 },
    { category: 'ACTORS', label: 'Capture cascades & mocap', pct: 15 },
    { category: 'MARKETING', label: 'Marketing & bandes-annonces', pct: 14 },
    { category: 'LEGAL', label: 'Frais juridiques & assurance', pct: 7 },
    { category: 'PLATFORM_FEE', label: 'Commission plateforme', pct: 10 },
    { category: 'CONTINGENCY', label: 'Reserve imprevus', pct: 6 },
  ],
  Animation: [
    { category: 'SCRIPT', label: 'Scenario & storyboard', pct: 8 },
    { category: 'VFX', label: 'Animation & rendu', pct: 38 },
    { category: 'SOUND', label: 'Voix & musique', pct: 12 },
    { category: 'ACTORS', label: 'Direction artistique', pct: 8 },
    { category: 'MARKETING', label: 'Marketing', pct: 12 },
    { category: 'LEGAL', label: 'Frais juridiques', pct: 6 },
    { category: 'PLATFORM_FEE', label: 'Commission plateforme', pct: 10 },
    { category: 'CONTINGENCY', label: 'Reserve imprevus', pct: 6 },
  ],
  Documentaire: [
    { category: 'SCRIPT', label: 'Recherche & scenario', pct: 15 },
    { category: 'VFX', label: 'Montage & post-prod', pct: 20 },
    { category: 'SOUND', label: 'Sound design & narration', pct: 12 },
    { category: 'ACTORS', label: 'Interviews & tournage', pct: 15 },
    { category: 'MARKETING', label: 'Marketing & festivals', pct: 15 },
    { category: 'LEGAL', label: 'Droits & juridique', pct: 8 },
    { category: 'PLATFORM_FEE', label: 'Commission plateforme', pct: 10 },
    { category: 'CONTINGENCY', label: 'Reserve imprevus', pct: 5 },
  ],
  Biblique: [
    { category: 'SCRIPT', label: 'Scenario & recherche historique', pct: 10 },
    { category: 'VFX', label: 'VFX & decors d\'epoque', pct: 33 },
    { category: 'SOUND', label: 'Musique orchestrale', pct: 10 },
    { category: 'ACTORS', label: 'Costumes & capture', pct: 12 },
    { category: 'MARKETING', label: 'Marketing communautaire', pct: 12 },
    { category: 'LEGAL', label: 'Frais juridiques', pct: 7 },
    { category: 'PLATFORM_FEE', label: 'Commission plateforme', pct: 10 },
    { category: 'CONTINGENCY', label: 'Reserve imprevus', pct: 6 },
  ],
}

// ============================================
// GENRE-BASED TASK TEMPLATES
// ============================================

const BASE_TASKS: TaskDecomposition[] = [
  // Script phase
  { title: 'Redaction du synopsis IA', type: 'PROMPT_WRITING', difficulty: 'EASY', phase: 'SCRIPT', priceEuros: 50, description: 'Ecrire un prompt optimise pour generer le synopsis du film avec une IA.' },
  { title: 'Revision du scenario', type: 'DIALOGUE_EDIT', difficulty: 'MEDIUM', phase: 'SCRIPT', priceEuros: 100, description: 'Relire et ameliorer les dialogues generes par IA.' },
  // Storyboard phase
  { title: 'Generation storyboard - Acte 1', type: 'IMAGE_GEN', difficulty: 'MEDIUM', phase: 'STORYBOARD', priceEuros: 100, description: 'Generer les planches de storyboard pour le premier acte.' },
  { title: 'Generation storyboard - Acte 2', type: 'IMAGE_GEN', difficulty: 'MEDIUM', phase: 'STORYBOARD', priceEuros: 100, description: 'Generer les planches de storyboard pour le deuxieme acte.' },
  { title: 'Generation storyboard - Acte 3', type: 'IMAGE_GEN', difficulty: 'MEDIUM', phase: 'STORYBOARD', priceEuros: 100, description: 'Generer les planches de storyboard pour le troisieme acte.' },
  // Design phase
  { title: 'Design des personnages principaux', type: 'CHARACTER_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Creer les designs des personnages principaux en coherence avec la direction artistique.' },
  { title: 'Design des environnements cles', type: 'ENV_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Concevoir les environnements principaux du film.' },
  // Audio phase
  { title: 'Sound design - ambiances', type: 'SOUND_DESIGN', difficulty: 'MEDIUM', phase: 'AUDIO', priceEuros: 100, description: 'Creer les ambiances sonores du film.' },
  // Editing phase
  { title: 'Verification continuite', type: 'CONTINUITY_CHECK', difficulty: 'EASY', phase: 'EDITING', priceEuros: 50, description: 'Verifier la continuite visuelle et narrative entre les sequences.' },
  { title: 'QA Review - version beta', type: 'QA_REVIEW', difficulty: 'EASY', phase: 'EDITING', priceEuros: 50, description: 'Effectuer une revue qualite complete de la version beta.' },
  // Color phase
  { title: 'Etalonnage colorimetrique', type: 'COLOR_GRADE', difficulty: 'HARD', phase: 'COLOR', priceEuros: 500, description: 'Appliquer l\'etalonnage final sur l\'ensemble du film.' },
  // Final phase
  { title: 'Traduction anglaise', type: 'TRANSLATION', difficulty: 'MEDIUM', phase: 'FINAL', priceEuros: 100, description: 'Traduire les dialogues et textes en anglais.' },
  { title: 'Sous-titrage multi-langues', type: 'SUBTITLE', difficulty: 'EASY', phase: 'FINAL', priceEuros: 50, description: 'Creer les fichiers de sous-titres synchronises.' },
]

/** Extra tasks by genre */
export const GENRE_TASK_TEMPLATES: Record<string, TaskDecomposition[]> = {
  'Science-Fiction': [
    { title: 'Generation VFX - vaisseaux spatiaux', type: 'IMAGE_GEN', difficulty: 'EXPERT', phase: 'VFX', priceEuros: 500, description: 'Generer les elements VFX pour les vaisseaux et environnements spatiaux.' },
    { title: 'Generation VFX - hologrammes', type: 'IMAGE_GEN', difficulty: 'HARD', phase: 'VFX', priceEuros: 500, description: 'Creer les effets holographiques et interfaces futuristes.' },
    { title: 'Design - technologie futuriste', type: 'ENV_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Concevoir les gadgets et technologies du monde futuriste.' },
    { title: 'Compositing - scenes spatiales', type: 'COMPOSITING', difficulty: 'EXPERT', phase: 'VFX', priceEuros: 500, description: 'Assembler les couches visuelles des sequences spatiales.' },
    { title: 'Sound design - effets sci-fi', type: 'SOUND_DESIGN', difficulty: 'HARD', phase: 'AUDIO', priceEuros: 500, description: 'Creer les effets sonores futuristes et spatiaux.' },
  ],
  'Action': [
    { title: 'Capture cascade - sequence poursuite', type: 'STUNT_CAPTURE', difficulty: 'EXPERT', phase: 'ANIMATION', priceEuros: 500, description: 'Capturer les mouvements de la sequence de poursuite principale.' },
    { title: 'Capture cascade - combat final', type: 'STUNT_CAPTURE', difficulty: 'EXPERT', phase: 'ANIMATION', priceEuros: 500, description: 'Capturer les mouvements du combat final.' },
    { title: 'VFX - explosions & destructions', type: 'IMAGE_GEN', difficulty: 'HARD', phase: 'VFX', priceEuros: 500, description: 'Generer les effets d\'explosions et de destructions.' },
    { title: 'Compositing - sequences d\'action', type: 'COMPOSITING', difficulty: 'HARD', phase: 'VFX', priceEuros: 500, description: 'Assembler les couches visuelles des scenes d\'action.' },
    { title: 'Reference mouvement - choregraphie combat', type: 'MOTION_REF', difficulty: 'HARD', phase: 'PREVIZ', priceEuros: 100, description: 'Filmer les references de mouvement pour les combats.' },
  ],
  'Drame': [
    { title: 'Edition dialogues - scenes cles', type: 'DIALOGUE_EDIT', difficulty: 'HARD', phase: 'SCRIPT', priceEuros: 500, description: 'Peaufiner les dialogues des scenes emotionnelles cles.' },
    { title: 'Sound design - musique emotionnelle', type: 'SOUND_DESIGN', difficulty: 'HARD', phase: 'AUDIO', priceEuros: 500, description: 'Composer la bande sonore emotionnelle du film.' },
    { title: 'Revue video - coherence emotionnelle', type: 'VIDEO_REVIEW', difficulty: 'MEDIUM', phase: 'EDITING', priceEuros: 100, description: 'Verifier la coherence emotionnelle a travers les sequences.' },
  ],
  'Horreur': [
    { title: 'VFX - creatures & monstres', type: 'IMAGE_GEN', difficulty: 'EXPERT', phase: 'VFX', priceEuros: 500, description: 'Generer les visuels des creatures et monstres.' },
    { title: 'Sound design - tensions & jump scares', type: 'SOUND_DESIGN', difficulty: 'HARD', phase: 'AUDIO', priceEuros: 500, description: 'Creer les effets sonores pour les scenes de tension et jump scares.' },
    { title: 'Design - decors horrifiques', type: 'ENV_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Concevoir les environnements sombres et inquietants.' },
    { title: 'Etalonnage - ambiance sombre', type: 'COLOR_GRADE', difficulty: 'HARD', phase: 'COLOR', priceEuros: 500, description: 'Appliquer un etalonnage sombre et oppressant.' },
  ],
  'Animation': [
    { title: 'Animation - personnages principaux', type: 'IMAGE_GEN', difficulty: 'EXPERT', phase: 'ANIMATION', priceEuros: 500, description: 'Animer les personnages principaux du film.' },
    { title: 'Animation - sequences secondaires', type: 'IMAGE_GEN', difficulty: 'HARD', phase: 'ANIMATION', priceEuros: 500, description: 'Animer les sequences secondaires.' },
    { title: 'Design - style visuel unique', type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', phase: 'DESIGN', priceEuros: 500, description: 'Definir et appliquer le style visuel unique du film d\'animation.' },
    { title: 'Compositing - assemblage final', type: 'COMPOSITING', difficulty: 'HARD', phase: 'VFX', priceEuros: 500, description: 'Assembler tous les elements d\'animation en compositing final.' },
  ],
  'Fantaisie': [
    { title: 'VFX - magie & sorts', type: 'IMAGE_GEN', difficulty: 'HARD', phase: 'VFX', priceEuros: 500, description: 'Generer les effets visuels de magie et de sorts.' },
    { title: 'Design - monde fantastique', type: 'ENV_DESIGN', difficulty: 'EXPERT', phase: 'DESIGN', priceEuros: 500, description: 'Concevoir l\'univers fantastique complet.' },
    { title: 'Design - creatures mythiques', type: 'CHARACTER_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Creer les designs des creatures mythiques.' },
  ],
  'Comedie': [
    { title: 'Edition dialogues - timing comique', type: 'DIALOGUE_EDIT', difficulty: 'HARD', phase: 'SCRIPT', priceEuros: 500, description: 'Optimiser le timing des dialogues pour maximiser l\'effet comique.' },
    { title: 'Sound design - effets comiques', type: 'SOUND_DESIGN', difficulty: 'MEDIUM', phase: 'AUDIO', priceEuros: 100, description: 'Creer les effets sonores comiques.' },
  ],
  'Documentaire': [
    { title: 'Prompt writing - narration', type: 'PROMPT_WRITING', difficulty: 'MEDIUM', phase: 'SCRIPT', priceEuros: 100, description: 'Ecrire les prompts pour la narration documentaire.' },
    { title: 'Montage - interviews & sequences', type: 'VIDEO_REVIEW', difficulty: 'HARD', phase: 'EDITING', priceEuros: 500, description: 'Assembler les interviews et sequences documentaires.' },
  ],
  'Musical': [
    { title: 'Capture danse - numero principal', type: 'DANCE_CAPTURE', difficulty: 'EXPERT', phase: 'ANIMATION', priceEuros: 500, description: 'Capturer les mouvements de danse du numero musical principal.' },
    { title: 'Capture danse - numeros secondaires', type: 'DANCE_CAPTURE', difficulty: 'HARD', phase: 'ANIMATION', priceEuros: 500, description: 'Capturer les mouvements des numeros secondaires.' },
    { title: 'Sound design - orchestration', type: 'SOUND_DESIGN', difficulty: 'EXPERT', phase: 'AUDIO', priceEuros: 500, description: 'Orchestrer et produire la bande musicale.' },
    { title: 'Sound design - mixage musical', type: 'SOUND_DESIGN', difficulty: 'HARD', phase: 'AUDIO', priceEuros: 500, description: 'Mixer les pistes musicales avec les dialogues.' },
  ],
  'Thriller': [
    { title: 'Sound design - tension psychologique', type: 'SOUND_DESIGN', difficulty: 'HARD', phase: 'AUDIO', priceEuros: 500, description: 'Creer la bande sonore de tension psychologique.' },
    { title: 'Montage - rythme & suspense', type: 'VIDEO_REVIEW', difficulty: 'HARD', phase: 'EDITING', priceEuros: 500, description: 'Optimiser le montage pour le suspense et le rythme.' },
  ],
  'Biblique': [
    { title: 'Design - decors historiques bibliques', type: 'ENV_DESIGN', difficulty: 'EXPERT', phase: 'DESIGN', priceEuros: 500, description: 'Reconstituer les environnements historiques bibliques.' },
    { title: 'VFX - miracles & effets divins', type: 'IMAGE_GEN', difficulty: 'EXPERT', phase: 'VFX', priceEuros: 500, description: 'Generer les effets visuels pour les scenes miraculeuses.' },
    { title: 'Design - costumes d\'epoque', type: 'CHARACTER_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Concevoir les costumes historiques authentiques.' },
    { title: 'Sound design - chants & hymnes', type: 'SOUND_DESIGN', difficulty: 'HARD', phase: 'AUDIO', priceEuros: 500, description: 'Composer les chants et hymnes d\'accompagnement.' },
  ],
  'Historique': [
    { title: 'Design - reconstitution historique', type: 'ENV_DESIGN', difficulty: 'EXPERT', phase: 'DESIGN', priceEuros: 500, description: 'Reconstituer fidelement les decors historiques.' },
    { title: 'Design - uniformes & costumes', type: 'CHARACTER_DESIGN', difficulty: 'HARD', phase: 'DESIGN', priceEuros: 500, description: 'Concevoir les costumes et uniformes d\'epoque.' },
    { title: 'Verification - exactitude historique', type: 'QA_REVIEW', difficulty: 'HARD', phase: 'EDITING', priceEuros: 500, description: 'Verifier l\'exactitude historique de chaque sequence.' },
  ],
}

// ============================================
// DECOMPOSITION FUNCTIONS
// ============================================

/**
 * Decompose a film's budget into budget line items and token parameters.
 * Uses genre-specific adjustments for budget allocation.
 */
export function decomposeFilmToTokens(
  estimatedBudget: number,
  genre: string | null
): { budget: BudgetBreakdown[]; tokens: TokenParameters } {
  // Try new-style genre adjustment first, fallback to legacy templates
  const adjustments = GENRE_BUDGET_ADJUSTMENTS[genre || '']

  if (adjustments) {
    // New-style: base + genre adjustments, normalized to 100%
    const rawLines: { category: string; label: string; pct: number }[] = []
    let totalPct = 0

    for (const [category, { label, basePct }] of Object.entries(BASE_BUDGET_BREAKDOWN)) {
      const adjustment = adjustments[category] || 0
      const pct = Math.max(1, basePct + adjustment)
      rawLines.push({ category, label, pct })
      totalPct += pct
    }

    const budget: BudgetBreakdown[] = rawLines.map(({ category, label, pct }) => {
      const normalizedPct = Math.round((pct / totalPct) * 1000) / 10
      return {
        category,
        label,
        percentage: normalizedPct,
        amount: Math.round(estimatedBudget * normalizedPct / 100),
      }
    })

    const tokenPrice = estimatedBudget >= 100000 ? 100 : estimatedBudget >= 10000 ? 50 : DEFAULT_TOKEN_PRICE
    const totalTokens = Math.ceil(estimatedBudget / tokenPrice)

    const tokens: TokenParameters = {
      totalTokens,
      tokenPrice,
      softCap: Math.round(estimatedBudget * 0.6),
      hardCap: estimatedBudget,
      minInvestment: 1,
      maxPerUser: Math.ceil(totalTokens * 0.1),
      distributionPct: 70,
      lockupDays: estimatedBudget >= 500_000 ? 60 : estimatedBudget >= 200_000 ? 90 : 120,
    }

    return { budget, tokens }
  }

  // Legacy template approach
  const template = BUDGET_TEMPLATES[genre || ''] || BUDGET_TEMPLATES.default

  const budget: BudgetBreakdown[] = template.map((item) => ({
    category: item.category,
    label: item.label,
    amount: Math.round(estimatedBudget * (item.pct / 100)),
    percentage: item.pct,
  }))

  const tokenPrice = estimatedBudget >= 100000 ? 100 : estimatedBudget >= 10000 ? 50 : DEFAULT_TOKEN_PRICE
  const totalTokens = Math.ceil(estimatedBudget / tokenPrice)
  const hardCap = estimatedBudget
  const softCap = Math.round(estimatedBudget * 0.6)

  const tokens: TokenParameters = {
    totalTokens,
    tokenPrice,
    softCap,
    hardCap,
    minInvestment: 1,
    maxPerUser: Math.ceil(totalTokens * 0.1),
    distributionPct: 70,
    lockupDays: 90,
  }

  return { budget, tokens }
}

/**
 * Auto-generate a task list for a film based on genre.
 * Combines base tasks with genre-specific tasks.
 */
export function decomposeFilmToTasks(
  genre: string | null,
  basePrice: number = 50
): TaskDecomposition[] {
  const baseTasks = [...BASE_TASKS]
  const genreTasks = GENRE_TASK_TEMPLATES[genre || ''] || []
  return [...baseTasks, ...genreTasks]
}

/**
 * Generate timeline estimates based on genre
 */
export function generateTimeline(genre: string | null): TimelineEstimate[] {
  const phases = [
    { phase: 'SCRIPT', durationWeeks: 4 },
    { phase: 'STORYBOARD', durationWeeks: 3 },
    { phase: 'DESIGN', durationWeeks: 4 },
    { phase: 'PREVIZ', durationWeeks: 2 },
    { phase: 'ANIMATION', durationWeeks: 8 },
    { phase: 'VFX', durationWeeks: 6 },
    { phase: 'AUDIO', durationWeeks: 4 },
    { phase: 'EDITING', durationWeeks: 3 },
    { phase: 'COLOR', durationWeeks: 2 },
    { phase: 'FINAL', durationWeeks: 2 },
  ]

  if (genre === 'Action' || genre === 'Science-Fiction') {
    const vfx = phases.find((p) => p.phase === 'VFX')
    const anim = phases.find((p) => p.phase === 'ANIMATION')
    if (vfx) vfx.durationWeeks = 8
    if (anim) anim.durationWeeks = 10
  }

  let currentWeek = 0
  return phases.map((p) => {
    const result = { ...p, startWeek: currentWeek }
    currentWeek += p.durationWeeks
    return result
  })
}

/**
 * Generate risk assessment for a film offering
 */
export function generateRiskAssessment(
  estimatedBudget: number,
  genre: string | null
): RiskAssessment[] {
  const risks: RiskAssessment[] = [
    {
      category: 'Marche',
      level: 'MEDIUM',
      description: 'Risque de faible demande pour le genre selectionne.',
      mitigation: 'Etude de marche prealable et marketing cible.',
    },
    {
      category: 'Technique',
      level: genre === 'Science-Fiction' || genre === 'Action' ? 'HIGH' : 'MEDIUM',
      description: 'Complexite technique de la production IA.',
      mitigation: 'Pipeline technique eprouve et controle qualite continu.',
    },
    {
      category: 'Reglementaire',
      level: 'HIGH',
      description: 'Evolution de la reglementation ISA sur les tokens.',
      mitigation: 'Veille juridique continue et structure legale adaptable.',
    },
    {
      category: 'Financier',
      level: estimatedBudget > 100000 ? 'HIGH' : 'MEDIUM',
      description: `Budget de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(estimatedBudget)} avec risque de depassement.`,
      mitigation: 'Reserve de 7% et suivi budgetaire en temps reel.',
    },
    {
      category: 'Calendrier',
      level: 'MEDIUM',
      description: 'Risque de retard sur le planning de production.',
      mitigation: 'Methodologie agile et micro-taches parallelisables.',
    },
    {
      category: 'Liquidite',
      level: 'HIGH',
      description: 'Marche secondaire des tokens potentiellement illiquide.',
      mitigation: 'Periode de lockup et market-making par la plateforme.',
    },
  ]

  return risks
}

/** Category colors for charts */
export const BUDGET_CATEGORY_COLORS: Record<string, string> = {
  SCRIPT: '#E50914',
  PREVIZ: '#FF2D2D',
  VFX: '#8B5CF6',
  ANIMATION: '#3B82F6',
  SOUND: '#10B981',
  ACTORS: '#EF4444',
  DESIGN: '#F59E0B',
  EDITING: '#06B6D4',
  MARKETING: '#EC4899',
  LEGAL: '#6B7280',
  PLATFORM_FEE: '#9CA3AF',
  CONTINGENCY: '#374151',
}
