/**
 * Trailer AI Micro-Task Decomposer
 *
 * Decomposes a trailer creation project into granular AI-executable micro-tasks,
 * organized by phases. Each task is designed to be independently executable by
 * an AI system, with clear dependencies and credit cost estimates.
 *
 * Mirrors the pattern of film-decomposer.ts but is purpose-built for
 * AI trailer generation pipelines.
 */

// ============================================
// PRISMA ENUM MIRRORS (string unions for type safety without import)
// ============================================

export type TrailerPhase =
  | 'CONCEPT'
  | 'SCRIPT'
  | 'VISUAL_DESIGN'
  | 'STORYBOARD'
  | 'PRODUCTION'
  | 'AUDIO'
  | 'POST_PRODUCTION'
  | 'ASSEMBLY'

export type TrailerTaskType =
  // CONCEPT
  | 'CONCEPT_BRIEF'
  | 'TARGET_AUDIENCE'
  | 'REFERENCE_MOOD_BOARD'
  | 'GENRE_TONE_DEFINITION'
  // SCRIPT
  | 'TRAILER_STRUCTURE'
  | 'NARRATION_SCRIPT'
  | 'DIALOGUE_SNIPPETS'
  | 'KEY_MOMENTS'
  // VISUAL_DESIGN
  | 'CHARACTER_DESIGN_MAIN'
  | 'CHARACTER_DESIGN_SECONDARY'
  | 'ENVIRONMENT_DESIGN'
  | 'PROPS_DESIGN'
  | 'COLOR_PALETTE_DESIGN'
  | 'TYPOGRAPHY_TITLES'
  // STORYBOARD
  | 'SCENE_STORYBOARD_HOOK'
  | 'SCENE_STORYBOARD_INTRO'
  | 'SCENE_STORYBOARD_BUILD'
  | 'SCENE_STORYBOARD_CLIMAX'
  | 'SCENE_STORYBOARD_TAG'
  | 'TRANSITION_PLANNING'
  // PRODUCTION
  | 'SCENE_VIDEO_GEN_HOOK'
  | 'SCENE_VIDEO_GEN_INTRO'
  | 'SCENE_VIDEO_GEN_BUILD'
  | 'SCENE_VIDEO_GEN_CLIMAX'
  | 'SCENE_VIDEO_GEN_TAG'
  | 'TITLE_CARD_GEN'
  | 'VFX_OVERLAY_GEN'
  // AUDIO
  | 'MUSIC_SELECTION'
  | 'MUSIC_GENERATION'
  | 'SOUND_EFFECTS'
  | 'VOICEOVER_GEN'
  | 'DIALOGUE_RECORDING'
  // POST_PRODUCTION
  | 'COLOR_GRADING'
  | 'VFX_COMPOSITING'
  | 'TRANSITION_EFFECTS'
  | 'SUBTITLE_GEN'
  // ASSEMBLY
  | 'ROUGH_CUT'
  | 'FINAL_ASSEMBLY'
  | 'QUALITY_REVIEW'
  | 'EXPORT_FORMATS'

export type TrailerDuration =
  | 'TEASER_15S'
  | 'TEASER_30S'
  | 'STANDARD_60S'
  | 'EXTENDED_90S'
  | 'FULL_120S'

// ============================================
// TYPES
// ============================================

/** Configuration for the trailer decomposer */
export interface TrailerDecomposeConfig {
  /** Film genre (sci-fi, action, drama, horror, comedy, etc.) */
  genre: string
  /** Target trailer duration */
  duration: TrailerDuration
  /** Visual style (cinematic, anime, noir, documentary, etc.) */
  style: string
  /** Whether this is an internal CINEGENY production (adds automation tasks) */
  isInternal: boolean
  /** Whether the trailer includes voiceover narration */
  hasVoiceover: boolean
  /** Whether the trailer includes character dialogue */
  hasDialogue: boolean
  /** Whether community voting is enabled for task outputs */
  communityVoteEnabled: boolean
}

/** A single decomposed trailer task definition */
export interface TrailerTaskDefinition {
  /** The Prisma enum task type */
  taskType: TrailerTaskType
  /** The phase this task belongs to */
  phase: TrailerPhase
  /** Human-readable title (French) */
  title: string
  /** Detailed description of the task (French) */
  description: string
  /** Detailed AI prompt instructions for executing this task */
  instructions: string
  /** Execution order within the full task list */
  order: number
  /** Estimated AI credit cost */
  estimatedCredits: number
  /** Task types that must complete before this task can begin */
  dependsOnTypes: TrailerTaskType[]
  /** Whether community can vote on this task's output */
  communityVoteEnabled: boolean
}

/** Genre-specific additional task definition (before order is assigned) */
interface GenreTaskTemplate {
  taskType: TrailerTaskType
  phase: TrailerPhase
  title: string
  description: string
  instructions: string
  estimatedCredits: number
  dependsOnTypes: TrailerTaskType[]
  /** If true, this task can be voted on by the community */
  voteable: boolean
}

/** Credit estimate summary */
export interface TrailerCreditEstimate {
  /** Total estimated credits */
  total: number
  /** Credits breakdown by phase */
  byPhase: Record<TrailerPhase, number>
  /** Number of tasks */
  taskCount: number
  /** Duration multiplier applied */
  durationMultiplier: number
}

// ============================================
// LABELS (French)
// ============================================

/** French labels for each trailer task type */
export const TRAILER_TASK_LABELS: Record<TrailerTaskType, string> = {
  // CONCEPT
  CONCEPT_BRIEF: 'Brief conceptuel',
  TARGET_AUDIENCE: 'Audience cible',
  REFERENCE_MOOD_BOARD: 'Moodboard de reference',
  GENRE_TONE_DEFINITION: 'Definition du genre et du ton',
  // SCRIPT
  TRAILER_STRUCTURE: 'Structure du trailer',
  NARRATION_SCRIPT: 'Script de narration',
  DIALOGUE_SNIPPETS: 'Extraits de dialogues',
  KEY_MOMENTS: 'Moments cles',
  // VISUAL_DESIGN
  CHARACTER_DESIGN_MAIN: 'Design personnage principal',
  CHARACTER_DESIGN_SECONDARY: 'Design personnages secondaires',
  ENVIRONMENT_DESIGN: 'Design des environnements',
  PROPS_DESIGN: 'Design des accessoires',
  COLOR_PALETTE_DESIGN: 'Palette de couleurs',
  TYPOGRAPHY_TITLES: 'Typographie et titres',
  // STORYBOARD
  SCENE_STORYBOARD_HOOK: 'Storyboard — Accroche',
  SCENE_STORYBOARD_INTRO: 'Storyboard — Introduction',
  SCENE_STORYBOARD_BUILD: 'Storyboard — Montee en tension',
  SCENE_STORYBOARD_CLIMAX: 'Storyboard — Climax',
  SCENE_STORYBOARD_TAG: 'Storyboard — Tagline finale',
  TRANSITION_PLANNING: 'Planification des transitions',
  // PRODUCTION
  SCENE_VIDEO_GEN_HOOK: 'Generation video — Accroche',
  SCENE_VIDEO_GEN_INTRO: 'Generation video — Introduction',
  SCENE_VIDEO_GEN_BUILD: 'Generation video — Montee en tension',
  SCENE_VIDEO_GEN_CLIMAX: 'Generation video — Climax',
  SCENE_VIDEO_GEN_TAG: 'Generation video — Tagline finale',
  TITLE_CARD_GEN: 'Generation des cartons-titres',
  VFX_OVERLAY_GEN: 'Generation des overlays VFX',
  // AUDIO
  MUSIC_SELECTION: 'Selection musicale',
  MUSIC_GENERATION: 'Generation musicale IA',
  SOUND_EFFECTS: 'Effets sonores',
  VOICEOVER_GEN: 'Generation voix-off',
  DIALOGUE_RECORDING: 'Enregistrement dialogues',
  // POST_PRODUCTION
  COLOR_GRADING: 'Etalonnage colorimetrique',
  VFX_COMPOSITING: 'Compositing VFX',
  TRANSITION_EFFECTS: 'Effets de transition',
  SUBTITLE_GEN: 'Generation des sous-titres',
  // ASSEMBLY
  ROUGH_CUT: 'Montage preliminaire',
  FINAL_ASSEMBLY: 'Assemblage final',
  QUALITY_REVIEW: 'Revue qualite',
  EXPORT_FORMATS: 'Export multi-formats',
}

/** French labels for each trailer phase */
export const TRAILER_PHASE_LABELS: Record<TrailerPhase, string> = {
  CONCEPT: 'Concept',
  SCRIPT: 'Script',
  VISUAL_DESIGN: 'Design Visuel',
  STORYBOARD: 'Storyboard',
  PRODUCTION: 'Production',
  AUDIO: 'Audio',
  POST_PRODUCTION: 'Post-Production',
  ASSEMBLY: 'Assemblage',
}

/** Phases in correct execution order */
export const TRAILER_PHASE_ORDER: TrailerPhase[] = [
  'CONCEPT',
  'SCRIPT',
  'VISUAL_DESIGN',
  'STORYBOARD',
  'PRODUCTION',
  'AUDIO',
  'POST_PRODUCTION',
  'ASSEMBLY',
]

// ============================================
// DURATION MULTIPLIERS
// ============================================

/** Credit multiplier based on trailer duration (longer = more scenes = more credits) */
const DURATION_MULTIPLIERS: Record<TrailerDuration, number> = {
  TEASER_15S: 0.5,
  TEASER_30S: 0.7,
  STANDARD_60S: 1.0,
  EXTENDED_90S: 1.4,
  FULL_120S: 1.8,
}

/** Duration labels for instructions */
const DURATION_LABELS: Record<TrailerDuration, string> = {
  TEASER_15S: '15 secondes (teaser)',
  TEASER_30S: '30 secondes (teaser)',
  STANDARD_60S: '60 secondes (standard)',
  EXTENDED_90S: '90 secondes (etendu)',
  FULL_120S: '120 secondes (complet)',
}

// ============================================
// BASE TASK DEFINITIONS
// ============================================

/**
 * Build the base task list. Each task has dependencies, credits, and detailed
 * instructions suitable for AI execution.
 */
function buildBaseTasks(config: TrailerDecomposeConfig): TrailerTaskDefinition[] {
  const durationLabel = DURATION_LABELS[config.duration]
  const durationMult = DURATION_MULTIPLIERS[config.duration]

  const tasks: TrailerTaskDefinition[] = []
  let order = 1

  // Helper to add a task and auto-increment order
  function addTask(
    taskType: TrailerTaskType,
    phase: TrailerPhase,
    title: string,
    description: string,
    instructions: string,
    estimatedCredits: number,
    dependsOnTypes: TrailerTaskType[],
    voteable: boolean = false
  ): void {
    tasks.push({
      taskType,
      phase,
      title,
      description,
      instructions,
      order: order++,
      estimatedCredits: Math.round(estimatedCredits * durationMult),
      dependsOnTypes,
      communityVoteEnabled: voteable && config.communityVoteEnabled,
    })
  }

  // ─────────────────────────────────────────────
  // PHASE 1: CONCEPT
  // ─────────────────────────────────────────────

  addTask(
    'CONCEPT_BRIEF',
    'CONCEPT',
    'Redaction du brief conceptuel',
    'Definir le concept general du trailer : objectif, message cle, emotion recherchee, et positionnement marketing du film.',
    `Genere un brief conceptuel complet pour un trailer de film.
Genre : ${config.genre}
Style : ${config.style}
Duree cible : ${durationLabel}

Le brief doit inclure :
1. Objectif principal du trailer (attirer, intriguer, informer)
2. Message cle a transmettre en une phrase
3. Emotion dominante a susciter chez le spectateur
4. Positionnement marketing (public cible, ton, promesse)
5. References visuelles et cinematographiques
6. Contraintes specifiques liees au genre ${config.genre}

Format de sortie : document structure en sections avec titres.`,
    10,
    [],
    false
  )

  addTask(
    'TARGET_AUDIENCE',
    'CONCEPT',
    'Definition de l\'audience cible',
    'Identifier et decrire precisement les segments d\'audience vises par le trailer, leurs attentes et habitudes de consommation.',
    `Analyse et definis l'audience cible pour un trailer de film.
Genre : ${config.genre}
Style : ${config.style}

Produis :
1. Profil demographique principal (age, genre, centres d'interet)
2. Profils secondaires (audiences croisees)
3. Habitudes de consommation de trailers (plateformes, horaires)
4. Attentes specifiques du genre ${config.genre}
5. Elements declencheurs d'engagement (ce qui pousse a regarder le film)
6. Benchmarks : 3 trailers similaires ayant bien fonctionne

Format : fiches personas structurees.`,
    8,
    [],
    false
  )

  addTask(
    'REFERENCE_MOOD_BOARD',
    'CONCEPT',
    'Creation du moodboard de reference',
    'Assembler un moodboard visuel definissant l\'atmosphere, les couleurs, les textures et l\'univers graphique du trailer.',
    `Genere un moodboard visuel complet pour un trailer de film.
Genre : ${config.genre}
Style : ${config.style}

Le moodboard doit contenir :
1. 6-8 images de reference definissant l'atmosphere generale
2. Palette de couleurs dominante (5 couleurs avec codes hex)
3. References de textures et materiaux
4. Exemples de cadrage et composition
5. References typographiques
6. Ambiance lumineuse (type d'eclairage, contrastes)
7. Notes sur le mouvement de camera et le rythme visuel

Genere des images d'ambiance couvrant ces differents aspects.`,
    35,
    ['CONCEPT_BRIEF'],
    true
  )

  addTask(
    'GENRE_TONE_DEFINITION',
    'CONCEPT',
    'Definition du genre et du ton',
    'Etablir le cadre tonal precis du trailer : registre emotionnel, rythme, intensite et conventions du genre a respecter ou subvertir.',
    `Definis le ton et le registre precis pour un trailer de film.
Genre : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Documente :
1. Registre emotionnel principal et ses variations au fil du trailer
2. Courbe d'intensite (comment le rythme evolue du debut a la fin)
3. Conventions du genre ${config.genre} a respecter
4. Elements de subversion ou d'originalite a integrer
5. Ton de la voix narrative (si applicable)
6. Palette sonore associee au ton (types de musique, ambiances)
7. References de trailers avec un ton similaire

Format : guide de ton structure.`,
    8,
    ['CONCEPT_BRIEF', 'TARGET_AUDIENCE'],
    false
  )

  // ─────────────────────────────────────────────
  // PHASE 2: SCRIPT
  // ─────────────────────────────────────────────

  addTask(
    'TRAILER_STRUCTURE',
    'SCRIPT',
    'Structure narrative du trailer',
    'Definir la structure en actes du trailer : accroche, introduction, montee en tension, climax et tagline finale.',
    `Cree la structure narrative complete du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Structure attendue en 5 segments :
1. ACCROCHE (Hook) — Les 3-5 premieres secondes. Image ou phrase choc qui capte l'attention.
2. INTRODUCTION — Presenter le monde, le personnage principal, le contexte.
3. MONTEE EN TENSION (Build) — Accelerer le rythme, montrer les enjeux, les obstacles.
4. CLIMAX — Point culminant emotionnel ou visuel. L'image/la sequence la plus marquante.
5. TAGLINE FINALE (Tag) — Logo, date de sortie, phrase d'accroche finale.

Pour chaque segment, precise :
- Duree approximative en secondes
- Objectif narratif
- Emotion cible
- Type de plan (large, serre, mouvement)
- Rythme de montage (lent, moyen, rapide)`,
    12,
    ['CONCEPT_BRIEF', 'GENRE_TONE_DEFINITION'],
    true
  )

  if (config.hasVoiceover) {
    addTask(
      'NARRATION_SCRIPT',
      'SCRIPT',
      'Script de narration voix-off',
      'Ecrire le texte de narration voix-off qui accompagne le trailer, synchronise avec la structure narrative.',
      `Ecris le script de narration voix-off pour le trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Contraintes :
1. Le texte doit etre synchronise avec les 5 segments de la structure narrative
2. Ton : ${config.style}, adapte au genre ${config.genre}
3. Chaque phrase doit etre concise et percutante (max 15 mots par phrase)
4. Inclure des pauses strategiques (marquer [PAUSE] dans le script)
5. La narration ne doit pas depasser 30% de la duree totale du trailer
6. La voix-off doit completer les images, pas les decrire
7. Terminer par une phrase memorable liee a la tagline du film

Format : script timeline avec timecodes approximatifs et indications de ton.`,
      10,
      ['TRAILER_STRUCTURE'],
      true
    )
  }

  if (config.hasDialogue) {
    addTask(
      'DIALOGUE_SNIPPETS',
      'SCRIPT',
      'Selection des extraits de dialogues',
      'Choisir et adapter les repliques cles du film a integrer dans le trailer pour renforcer l\'impact narratif.',
      `Selectionne et adapte les extraits de dialogues pour le trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Directives :
1. Selectionner 3-5 repliques percutantes qui resument l'essence du film
2. Chaque replique doit fonctionner hors contexte (comprehensible seule)
3. Varier les personnages (protagoniste, antagoniste, mentor)
4. Au moins une replique doit creer du mystere ou de la tension
5. Eviter les spoilers majeurs
6. Indiquer le personnage, le moment dans le trailer, et le ton de delivrance
7. Prevoir des alternatives pour chaque replique

Format : liste numerotee avec contexte, personnage, et notes de direction.`,
      8,
      ['TRAILER_STRUCTURE'],
      false
    )
  }

  addTask(
    'KEY_MOMENTS',
    'SCRIPT',
    'Identification des moments cles',
    'Lister et decrire les moments visuels et emotionnels les plus forts a mettre en avant dans le trailer.',
    `Identifie les moments cles visuellement les plus forts pour le trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Pour chaque moment cle (6-10 moments) :
1. Description visuelle precise de la scene (composition, couleurs, mouvement)
2. Emotion transmise
3. Position dans la structure du trailer (accroche, build, climax, etc.)
4. Type de plan recommande (gros plan, plan large, travelling, drone)
5. Duree approximative (1-5 secondes)
6. Son associe (musique, effet, silence, dialogue)
7. Lien avec les autres moments (progression dramatique)

Organise les moments par ordre chronologique dans le trailer.`,
    10,
    ['TRAILER_STRUCTURE'],
    true
  )

  // ─────────────────────────────────────────────
  // PHASE 3: VISUAL_DESIGN
  // ─────────────────────────────────────────────

  addTask(
    'CHARACTER_DESIGN_MAIN',
    'VISUAL_DESIGN',
    'Design du personnage principal',
    'Creer le design visuel complet du personnage principal : apparence, expressions, poses cles et guide de coherence.',
    `Genere le design complet du personnage principal du trailer.
Genre : ${config.genre}
Style : ${config.style}

Produire :
1. Vue de face, profil et trois-quarts du personnage
2. 4 expressions faciales cles (neutre, determination, peur/surprise, emotion dominante du genre)
3. 3 poses dynamiques adaptees au genre ${config.genre}
4. Palette de couleurs du personnage (vetements, peau, cheveux)
5. Details distinctifs (cicatrices, accessoires, vetements signature)
6. Guide de coherence : proportions, eclairage de reference

Style visuel : ${config.style}
Resolution : haute qualite, coherent avec le moodboard.`,
    45,
    ['REFERENCE_MOOD_BOARD', 'GENRE_TONE_DEFINITION'],
    true
  )

  addTask(
    'CHARACTER_DESIGN_SECONDARY',
    'VISUAL_DESIGN',
    'Design des personnages secondaires',
    'Creer les designs visuels des personnages secondaires en coherence avec le personnage principal.',
    `Genere les designs des personnages secondaires du trailer.
Genre : ${config.genre}
Style : ${config.style}

Pour chaque personnage secondaire (2-3 personnages) :
1. Vue de face et trois-quarts
2. 2 expressions faciales cles
3. 1 pose dynamique
4. Relation visuelle avec le personnage principal (contraste, complementarite)
5. Elements distinctifs propres

Coherence obligatoire :
- Meme style graphique que le personnage principal
- Palette de couleurs complementaire
- Proportions et eclairage identiques`,
    35,
    ['CHARACTER_DESIGN_MAIN'],
    true
  )

  addTask(
    'ENVIRONMENT_DESIGN',
    'VISUAL_DESIGN',
    'Design des environnements',
    'Concevoir les environnements principaux du trailer : lieux, decors, atmosphere et eclairage.',
    `Genere les designs d'environnements pour le trailer.
Genre : ${config.genre}
Style : ${config.style}

Creer 3-5 environnements correspondant aux scenes cles :
1. Environnement d'ouverture (accroche)
2. Lieu principal de l'histoire
3. Lieu de confrontation / climax
4. Environnements secondaires selon le genre ${config.genre}

Pour chaque environnement :
- Vue d'ensemble (establishing shot)
- Detail d'ambiance (texture, lumiere, atmosphere)
- Palette de couleurs specifique au lieu
- Indications d'eclairage (heure du jour, sources lumineuses)
- Elements narratifs dans le decor (indices visuels)

Style : ${config.style}, coherent avec le moodboard et les personnages.`,
    50,
    ['REFERENCE_MOOD_BOARD', 'COLOR_PALETTE_DESIGN'],
    true
  )

  addTask(
    'PROPS_DESIGN',
    'VISUAL_DESIGN',
    'Design des accessoires et objets cles',
    'Concevoir les accessoires, armes, vehicules ou objets narratifs importants visibles dans le trailer.',
    `Genere les designs des accessoires et objets cles du trailer.
Genre : ${config.genre}
Style : ${config.style}

Identifier et concevoir 3-6 objets importants :
1. Objet narratif central (McGuffin, arme, artefact, document)
2. Accessoires des personnages (vetements, outils, gadgets)
3. Vehicules ou moyens de transport (si applicable)
4. Elements de decor interactifs

Pour chaque objet :
- Vue principale et detail
- Materiaux et textures
- Etat (neuf, use, endommage)
- Contexte d'utilisation dans le trailer
- Coherence avec le style ${config.style}`,
    25,
    ['REFERENCE_MOOD_BOARD'],
    false
  )

  addTask(
    'COLOR_PALETTE_DESIGN',
    'VISUAL_DESIGN',
    'Definition de la palette de couleurs',
    'Etablir la palette de couleurs definitive du trailer : couleurs primaires, secondaires, accents et variations par scene.',
    `Definis la palette de couleurs complete du trailer.
Genre : ${config.genre}
Style : ${config.style}

Produire :
1. 3 couleurs primaires (dominantes du trailer) avec codes hex
2. 3 couleurs secondaires (accents et contrastes) avec codes hex
3. Couleurs par segment du trailer :
   - Accroche : palette specifique
   - Introduction : palette specifique
   - Montee en tension : evolution des couleurs
   - Climax : palette d'intensite maximale
   - Tag finale : palette de cloture
4. Regles de contraste et lisibilite
5. Palette sombre vs claire selon les moments
6. Coherence avec les conventions du genre ${config.genre}

Genere un nuancier visuel avec exemples d'application.`,
    20,
    ['REFERENCE_MOOD_BOARD', 'GENRE_TONE_DEFINITION'],
    true
  )

  addTask(
    'TYPOGRAPHY_TITLES',
    'VISUAL_DESIGN',
    'Design typographique et titres',
    'Concevoir la typographie du titre du film, des cartons intermediaires et de la tagline finale.',
    `Cree le design typographique complet du trailer.
Genre : ${config.genre}
Style : ${config.style}

Elements a concevoir :
1. Titre du film — typographie principale, taille, couleur, effets (glow, ombre, texture)
2. Cartons intermediaires — style des textes de transition entre les scenes
3. Tagline finale — typographie de la phrase d'accroche
4. Date de sortie et mentions legales — style discret mais lisible
5. Logo du studio / production

Contraintes :
- Lisibilite a toutes les tailles (mobile, cinema)
- Coherence avec la palette de couleurs
- Animation typographique suggeree (fondu, apparition lettre par lettre, glitch)
- Adapte au genre ${config.genre} et au style ${config.style}

Genere les visuels des titres sur fond sombre.`,
    25,
    ['COLOR_PALETTE_DESIGN'],
    true
  )

  // ─────────────────────────────────────────────
  // PHASE 4: STORYBOARD
  // ─────────────────────────────────────────────

  addTask(
    'SCENE_STORYBOARD_HOOK',
    'STORYBOARD',
    'Storyboard — Scene d\'accroche',
    'Realiser le storyboard detaille de la scene d\'accroche (hook) : les premieres secondes qui captent l\'attention.',
    `Genere le storyboard de la scene d'accroche du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree du segment : 3-5 secondes

Produire 3-5 vignettes montrant :
1. Plan d'ouverture — l'image qui accroche instantanement
2. Mouvement de camera (zoom, travelling, static)
3. Premier element sonore (impact, silence, phrase choc)
4. Transition vers l'introduction

Pour chaque vignette :
- Cadrage et composition precise
- Annotations de mouvement (fleches, trajectoires)
- Notes d'eclairage et de couleur
- Timecode approximatif
- Son/musique associe

Le hook doit provoquer une reaction immediate : curiosite, choc, ou intrigue.
Style des vignettes : ${config.style}, semi-detaille, en noir et blanc avec accents de couleur.`,
    30,
    ['TRAILER_STRUCTURE', 'KEY_MOMENTS', 'CHARACTER_DESIGN_MAIN'],
    true
  )

  addTask(
    'SCENE_STORYBOARD_INTRO',
    'STORYBOARD',
    'Storyboard — Introduction',
    'Realiser le storyboard de la sequence d\'introduction : presenter le monde, les personnages et le contexte.',
    `Genere le storyboard de la sequence d'introduction du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree du segment : 10-20 secondes (selon duree totale ${durationLabel})

Produire 6-10 vignettes montrant :
1. Etablissement du monde/univers (plan large)
2. Presentation du personnage principal
3. Contexte narratif (ou, quand, qui)
4. Premier indice du conflit a venir
5. Rythme calme a moyen, montage fluide

Pour chaque vignette :
- Cadrage et composition
- Type de plan (large, moyen, serre)
- Mouvement de camera
- Duree approximative
- Transition vers la vignette suivante
- Notes audio (ambiance, musique legere, dialogue)

L'introduction doit poser les bases sans tout reveler.
Style des vignettes : ${config.style}.`,
    35,
    ['SCENE_STORYBOARD_HOOK', 'ENVIRONMENT_DESIGN'],
    true
  )

  addTask(
    'SCENE_STORYBOARD_BUILD',
    'STORYBOARD',
    'Storyboard — Montee en tension',
    'Realiser le storyboard de la montee en tension : accelerer le rythme, montrer les enjeux et obstacles.',
    `Genere le storyboard de la montee en tension du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree du segment : 15-30 secondes (selon duree totale ${durationLabel})

Produire 8-12 vignettes montrant :
1. Escalade des enjeux — les obstacles se multiplient
2. Alternance entre action et emotion
3. Acceleration progressive du rythme de montage
4. Plans de plus en plus serres (tension croissante)
5. Integration des personnages secondaires
6. Un ou deux plans "wow" visuels

Pour chaque vignette :
- Cadrage et mouvement (de plus en plus dynamiques)
- Rythme de montage (coupes de plus en plus rapides)
- Synchronisation musicale (build-up musical)
- Effets sonores ponctuels (impacts, respirations, stingers)

Le montage doit suivre une courbe ascendante d'intensite.`,
    40,
    ['SCENE_STORYBOARD_INTRO', 'CHARACTER_DESIGN_SECONDARY'],
    true
  )

  addTask(
    'SCENE_STORYBOARD_CLIMAX',
    'STORYBOARD',
    'Storyboard — Climax',
    'Realiser le storyboard du climax : le point culminant visuel et emotionnel du trailer.',
    `Genere le storyboard du climax du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree du segment : 5-15 secondes (selon duree totale ${durationLabel})

Produire 4-8 vignettes montrant :
1. Le moment le plus intense du trailer (visuellement et emotionnellement)
2. La sequence la plus spectaculaire
3. Le point de non-retour narratif
4. Possible micro-silence avant l'impact final

Pour chaque vignette :
- Plans dynamiques, cadrage impactant
- Eclairage dramatique maximal
- Son : pic musical + impact sonore majeur
- Timing precis au dixieme de seconde
- Cut to black possible avant ou apres le climax

C'est LE moment dont le spectateur doit se souvenir.
Genre ${config.genre} : exploiter les codes visuels les plus forts.`,
    35,
    ['SCENE_STORYBOARD_BUILD'],
    true
  )

  addTask(
    'SCENE_STORYBOARD_TAG',
    'STORYBOARD',
    'Storyboard — Tagline finale',
    'Realiser le storyboard de la conclusion : logo, titre, date de sortie et phrase d\'accroche.',
    `Genere le storyboard de la tagline finale du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree du segment : 5-10 secondes

Produire 3-5 vignettes montrant :
1. Transition depuis le climax (cut to black, fondu, ou plan final)
2. Apparition du titre du film (animation typographique)
3. Tagline / phrase d'accroche
4. Date de sortie et credits
5. Logo(s) de production

Pour chaque vignette :
- Fond (noir, image fixe, derniere image)
- Animation du texte (vitesse, direction, effet)
- Son : musique finale, dernier stinger sonore
- Timing precis
- Possible post-credit tease (micro-scene bonus)

La fin doit laisser le spectateur dans l'etat emotionnel souhaite : excite, intrigue, ou emu.`,
    25,
    ['SCENE_STORYBOARD_CLIMAX', 'TYPOGRAPHY_TITLES'],
    false
  )

  addTask(
    'TRANSITION_PLANNING',
    'STORYBOARD',
    'Planification des transitions',
    'Definir les types de transitions entre chaque scene et segment du trailer.',
    `Planifie les transitions entre chaque segment et scene du trailer.
Genre : ${config.genre}
Style : ${config.style}

Pour chaque transition (8-15 transitions) :
1. Type : cut franc, fondu, whip pan, match cut, smash cut, dissolve, glitch, flash
2. Duree : instantane, 0.25s, 0.5s, 1s
3. Motivation narrative : pourquoi cette transition a ce moment
4. Synchronisation musicale : sur un beat, en contretemps, en silence
5. Effet visuel associe (flash blanc, noir, deformation, particules)

Regles generales :
- Accroche et intro : transitions fluides, fondus
- Build : transitions de plus en plus rapides, cuts francs
- Climax : smash cuts, transitions brutales
- Tag finale : fondu ou cut to black

Adapte au genre ${config.genre} : utiliser les conventions du genre.`,
    10,
    ['SCENE_STORYBOARD_HOOK', 'SCENE_STORYBOARD_TAG'],
    false
  )

  // ─────────────────────────────────────────────
  // PHASE 5: PRODUCTION (AI video generation)
  // ─────────────────────────────────────────────

  addTask(
    'SCENE_VIDEO_GEN_HOOK',
    'PRODUCTION',
    'Generation video IA — Accroche',
    'Generer les sequences video de l\'accroche a partir du storyboard, du design des personnages et environnements.',
    `Genere la sequence video de l'accroche du trailer par IA.
Genre : ${config.genre}
Style : ${config.style}
Duree : 3-5 secondes

Entrees :
- Storyboard de l'accroche (vignettes detaillees)
- Design du personnage principal
- Environnement d'ouverture
- Palette de couleurs

Instructions de generation :
1. Respecter exactement le cadrage du storyboard
2. Mouvement de camera fluide et cinematographique
3. Eclairage conforme au moodboard
4. Coherence des personnages avec les character sheets
5. Resolution : 1920x1080 minimum, 24fps
6. Style visuel : ${config.style}
7. Generer 3 variations pour selection

Post-generation :
- Verifier la coherence visuelle
- Selectionner la meilleure variation
- Noter les ajustements necessaires pour le compositing`,
    200,
    ['SCENE_STORYBOARD_HOOK', 'CHARACTER_DESIGN_MAIN', 'ENVIRONMENT_DESIGN'],
    true
  )

  addTask(
    'SCENE_VIDEO_GEN_INTRO',
    'PRODUCTION',
    'Generation video IA — Introduction',
    'Generer les sequences video de l\'introduction : presentation du monde et des personnages.',
    `Genere les sequences video de l'introduction du trailer par IA.
Genre : ${config.genre}
Style : ${config.style}
Duree : 10-20 secondes (selon duree totale ${durationLabel})

Entrees :
- Storyboard de l'introduction
- Designs de tous les personnages
- Environnements
- Palette de couleurs

Instructions de generation :
1. Generer chaque vignette du storyboard en clip video (2-4 secondes chacun)
2. Maintenir la coherence visuelle entre les clips
3. Plans larges pour l'etablissement, plans moyens pour les personnages
4. Mouvement de camera fluide, cinematographique
5. Eclairage naturaliste adapte au ${config.style}
6. Generer 2 variations par clip pour selection
7. Resolution : 1920x1080, 24fps

Coherence critique :
- Le personnage principal doit etre identique d'un clip a l'autre
- Les environnements doivent rester coherents
- La lumiere doit suivre une logique temporelle`,
    250,
    ['SCENE_STORYBOARD_INTRO', 'SCENE_VIDEO_GEN_HOOK'],
    true
  )

  addTask(
    'SCENE_VIDEO_GEN_BUILD',
    'PRODUCTION',
    'Generation video IA — Montee en tension',
    'Generer les sequences video de la montee en tension : rythme croissant et enjeux visuels.',
    `Genere les sequences video de la montee en tension du trailer par IA.
Genre : ${config.genre}
Style : ${config.style}
Duree : 15-30 secondes (selon duree totale ${durationLabel})

Instructions de generation :
1. Generer chaque vignette du storyboard (plans de 1-3 secondes, de plus en plus courts)
2. Augmenter progressivement le dynamisme des mouvements de camera
3. Integrer des plans d'action/emotion specifiques au genre ${config.genre}
4. Effets visuels legers (particules, lumieres, reflets)
5. Generer 2 variations par clip
6. Resolution : 1920x1080, 24fps

Rythme :
- Debut du build : plans de 3s
- Milieu : plans de 2s
- Fin du build : plans de 1-1.5s
- Crescendo visuel vers le climax

Coherence : tous les personnages et decors doivent rester identiques aux clips precedents.`,
    300,
    ['SCENE_STORYBOARD_BUILD', 'SCENE_VIDEO_GEN_INTRO'],
    true
  )

  addTask(
    'SCENE_VIDEO_GEN_CLIMAX',
    'PRODUCTION',
    'Generation video IA — Climax',
    'Generer la sequence video du climax : le moment visuellement le plus spectaculaire.',
    `Genere la sequence video du climax du trailer par IA.
Genre : ${config.genre}
Style : ${config.style}
Duree : 5-15 secondes (selon duree totale ${durationLabel})

Instructions de generation :
1. C'est la sequence la plus importante visuellement — qualite maximale
2. Plans ultra-dynamiques, mouvements de camera spectaculaires
3. Eclairage dramatique (contrastes forts, couleurs saturees)
4. Effets visuels avances selon le genre ${config.genre}
5. Generer 3-4 variations pour selection (qualite prime sur la quantite)
6. Resolution : 1920x1080, 24fps, qualite maximale

Elements cles :
- Le plan le plus memorable du trailer
- Pic d'intensite visuelle
- Possible ralenti ou acceleration selon l'effet desire
- Composition soignee a chaque frame

Post-generation : selectionner LA meilleure variation, celle qui donne des frissons.`,
    280,
    ['SCENE_STORYBOARD_CLIMAX', 'SCENE_VIDEO_GEN_BUILD'],
    true
  )

  addTask(
    'SCENE_VIDEO_GEN_TAG',
    'PRODUCTION',
    'Generation video IA — Tagline finale',
    'Generer la sequence video de la conclusion : apparition du titre et tagline.',
    `Genere la sequence video de la tagline finale du trailer par IA.
Genre : ${config.genre}
Style : ${config.style}
Duree : 5-10 secondes

Instructions de generation :
1. Transition depuis le climax (cut to black ou fondu)
2. Plan fixe ou leger mouvement sur fond sombre/stylise
3. Animation du titre du film (apparition progressive)
4. Espace pour la tagline textuelle
5. Fond adapte : noir, particules, dernier plan evocateur
6. Resolution : 1920x1080, 24fps

Si applicable :
- Micro-scene post-credit (2-3 secondes bonus)
- Generer 2 variations de fond

Le dernier plan doit etre propre, elegant, et laisser une impression durable.`,
    150,
    ['SCENE_STORYBOARD_TAG', 'SCENE_VIDEO_GEN_CLIMAX'],
    false
  )

  addTask(
    'TITLE_CARD_GEN',
    'PRODUCTION',
    'Generation des cartons-titres',
    'Generer les cartons-titres animes : titre du film, textes de transition, date de sortie.',
    `Genere les cartons-titres animes du trailer.
Genre : ${config.genre}
Style : ${config.style}

Cartons a generer :
1. Titre principal du film — animation d'apparition (2-3 secondes)
2. 2-3 cartons de transition ("De la part du createur de...", "Cet ete...", etc.)
3. Tagline — animation subtile
4. Date de sortie + "Bientot au cinema" / "Exclusivement sur CINEGENY"
5. Logos de production (animation simple)

Specifications :
- Utiliser la typographie validee en phase Visual Design
- Palette de couleurs du trailer
- Fond : noir ou semi-transparent sur les images
- Animations fluides, professionnelles
- Export avec canal alpha pour compositing
- Generer 2 variations par carton`,
    80,
    ['TYPOGRAPHY_TITLES', 'COLOR_PALETTE_DESIGN'],
    true
  )

  addTask(
    'VFX_OVERLAY_GEN',
    'PRODUCTION',
    'Generation des overlays VFX',
    'Generer les elements VFX a superposer aux scenes : particules, lumieres, effets atmospheriques.',
    `Genere les overlays VFX a superposer sur les scenes du trailer.
Genre : ${config.genre}
Style : ${config.style}

Elements a generer :
1. Particules atmospheriques (poussiere, neige, braises, pollen — selon le genre)
2. Effets de lumiere volumetrique (rayons, halos, lens flares)
3. Effets meteorologiques (pluie, brouillard, foudre — si applicable)
4. Overlay de texture (grain film, aberration chromatique, vignettage)
5. Effets specifiques au genre ${config.genre}

Specifications :
- Boucles sans couture (loopable) de 5-10 secondes
- Fond transparent (canal alpha)
- Resolution : 1920x1080
- Plusieurs intensites (leger, moyen, intense)
- Palette coherente avec la direction artistique

Generer 2-3 variations par type d'overlay.`,
    100,
    ['COLOR_PALETTE_DESIGN', 'ENVIRONMENT_DESIGN'],
    false
  )

  // ─────────────────────────────────────────────
  // PHASE 6: AUDIO
  // ─────────────────────────────────────────────

  addTask(
    'MUSIC_SELECTION',
    'AUDIO',
    'Selection de la direction musicale',
    'Definir la direction musicale du trailer : genre, tempo, instrumentation et courbe emotionnelle.',
    `Definis la direction musicale complete du trailer.
Genre du film : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Produire :
1. Genre musical principal (orchestral epic, electronic, minimal, hybrid)
2. Tempo de base et variations (BPM par segment)
3. Instrumentation cle (cordes, synthes, percussions, voix)
4. Courbe emotionnelle musicale synchronisee avec le trailer :
   - Accroche : [description musicale]
   - Intro : [description musicale]
   - Build : [crescendo, layers]
   - Climax : [peak musical]
   - Tag : [resolution, silence ou note tenue]
5. 3-5 references de bandes originales similaires
6. Points de synchronisation musique/image (hits, drops, silences)

Format : brief musical detaille pour la generation ou la selection.`,
    10,
    ['TRAILER_STRUCTURE', 'GENRE_TONE_DEFINITION'],
    true
  )

  addTask(
    'MUSIC_GENERATION',
    'AUDIO',
    'Generation de la musique IA',
    'Generer la bande musicale du trailer par IA, en respectant la direction musicale et la synchronisation avec les images.',
    `Genere la bande musicale complete du trailer par IA.
Genre du film : ${config.genre}
Style : ${config.style}
Duree exacte : ${durationLabel}

Contraintes :
1. Respecter exactement la direction musicale definie
2. Synchronisation precise avec la structure du trailer :
   - Intro musicale douce / tendue (selon le genre)
   - Build progressif avec ajout de couches instrumentales
   - Drop ou climax musical synchronise avec le climax visuel
   - Resolution finale (note tenue, silence, ou impact final)
3. Tempo : conforme au brief musical
4. Mix : stereo, qualite broadcast (44.1kHz / 16bit minimum)
5. Generer 3 variations avec des instrumentations differentes
6. Prevoir des stems separes (percussions, melodie, basse, pads) pour le mix final

Post-generation : selectionner la variation la plus impactante.`,
    80,
    ['MUSIC_SELECTION'],
    true
  )

  addTask(
    'SOUND_EFFECTS',
    'AUDIO',
    'Creation des effets sonores',
    'Generer ou selectionner les effets sonores : impacts, transitions, ambiances et stingers.',
    `Genere les effets sonores du trailer.
Genre : ${config.genre}
Style : ${config.style}

Effets a creer :
1. Impacts (booms, hits, whoosh) — 5-8 variations
2. Transitions sonores (risers, sweeps, reverses) — 4-6 variations
3. Ambiances (fond sonore pour chaque scene) — 3-5 ambiances
4. Stingers (accents musicaux courts, 1-2 secondes) — 3-4 variations
5. Bruitages specifiques au genre ${config.genre}
6. Silence design (preparation avant un impact)

Specifications :
- Qualite broadcast (WAV, 48kHz / 24bit)
- Categorises par type et intensite
- Timecodes suggeres pour le placement
- Compatibles avec la bande musicale

Effets specifiques au genre ${config.genre} a ne pas oublier :
${getGenreSoundNotes(config.genre)}`,
    50,
    ['MUSIC_SELECTION', 'TRANSITION_PLANNING'],
    false
  )

  if (config.hasVoiceover) {
    addTask(
      'VOICEOVER_GEN',
      'AUDIO',
      'Generation de la voix-off IA',
      'Generer la narration voix-off par IA vocale, en respectant le ton et le rythme du trailer.',
      `Genere la voix-off du trailer par IA vocale.
Genre : ${config.genre}
Style : ${config.style}
Script : utiliser le script de narration valide

Parametres de generation :
1. Voix : grave/profonde/autoritaire (trailer standard) ou adapte au ${config.genre}
2. Ton : ${config.style}, adapte au genre
3. Rythme : synchronise avec la structure du trailer
4. Pauses : respecter les [PAUSE] du script
5. Emotion : crescendo emotionnel du debut a la fin
6. Qualite : broadcast (WAV, 48kHz / 24bit)

Generer :
- 3 variations avec des voix differentes (masculine, feminine, neutre)
- 2 niveaux d'intensite par variation (subtil vs dramatique)
- Stems propres sans bruit de fond

Post-generation : selectionner la voix la plus impactante pour le genre.`,
      60,
      ['NARRATION_SCRIPT', 'MUSIC_GENERATION'],
      true
    )
  }

  if (config.hasDialogue) {
    addTask(
      'DIALOGUE_RECORDING',
      'AUDIO',
      'Generation des dialogues IA',
      'Generer les repliques de dialogue par IA vocale avec des voix distinctes pour chaque personnage.',
      `Genere les repliques de dialogue du trailer par IA vocale.
Genre : ${config.genre}
Style : ${config.style}

Pour chaque replique selectionnee :
1. Assigner une voix unique et reconnaissable a chaque personnage
2. Adapter le ton de delivrance aux notes de direction
3. Respecter le timing prevu dans la structure du trailer
4. Ajouter de la reverb/traitement selon l'environnement de la scene
5. Qualite : broadcast (WAV, 48kHz / 24bit)

Generer :
- 2 interpretations par replique (nuances differentes)
- Stems propres
- Version avec et sans traitement spatial

Coherence : les voix doivent correspondre aux designs des personnages.`,
      50,
      ['DIALOGUE_SNIPPETS', 'CHARACTER_DESIGN_MAIN'],
      false
    )
  }

  // ─────────────────────────────────────────────
  // PHASE 7: POST_PRODUCTION
  // ─────────────────────────────────────────────

  addTask(
    'COLOR_GRADING',
    'POST_PRODUCTION',
    'Etalonnage colorimetrique',
    'Appliquer l\'etalonnage final sur toutes les sequences video pour unifier l\'ambiance visuelle.',
    `Applique l'etalonnage colorimetrique sur toutes les sequences du trailer.
Genre : ${config.genre}
Style : ${config.style}

Processus :
1. Appliquer la palette de couleurs validee a chaque clip
2. Unifier la temperature de couleur entre tous les clips
3. Creer des LUTs specifiques par segment :
   - Accroche : [ton de l'etalonnage]
   - Intro : tons naturels / legerement stylises
   - Build : desaturation progressive ou saturation selon le genre
   - Climax : contraste maximal, couleurs intenses
   - Tag : noir et blanc ou desature (retour au calme)
4. Ajuster les niveaux de noir, blancs et gamma
5. Ajouter du grain film si le style le requiert
6. Verifier la coherence sur differents ecrans (SDR)

Genre ${config.genre} : ${getGenreColorNotes(config.genre)}`,
    60,
    [
      'SCENE_VIDEO_GEN_HOOK',
      'SCENE_VIDEO_GEN_INTRO',
      'SCENE_VIDEO_GEN_BUILD',
      'SCENE_VIDEO_GEN_CLIMAX',
      'SCENE_VIDEO_GEN_TAG',
      'COLOR_PALETTE_DESIGN',
    ],
    true
  )

  addTask(
    'VFX_COMPOSITING',
    'POST_PRODUCTION',
    'Compositing VFX',
    'Assembler les couches visuelles : overlays VFX, effets atmospheriques et corrections sur les scenes.',
    `Effectue le compositing VFX du trailer.
Genre : ${config.genre}
Style : ${config.style}

Operations :
1. Superposer les overlays VFX sur les scenes appropriees
2. Integrer les particules atmospheriques (intensite variable par scene)
3. Ajouter les effets de lumiere volumetrique
4. Appliquer les effets de lens (flares, aberration chromatique, bokeh)
5. Compositer les effets specifiques au genre ${config.genre}
6. Nettoyer les artefacts de generation IA (glitches, incoherences)
7. Ajouter du grain ou de la texture si necessaire
8. Integrer les cartons-titres dans les scenes

Verification :
- Pas d'artefacts visibles
- Transitions fluides entre plans avec et sans VFX
- Coherence de l'eclairage avec les overlays
- Export en ProRes ou sequence d'images haute qualite`,
    90,
    ['COLOR_GRADING', 'VFX_OVERLAY_GEN', 'TITLE_CARD_GEN'],
    false
  )

  addTask(
    'TRANSITION_EFFECTS',
    'POST_PRODUCTION',
    'Application des effets de transition',
    'Appliquer les transitions planifiees entre chaque scene et segment du trailer.',
    `Applique les effets de transition sur le montage du trailer.
Genre : ${config.genre}
Style : ${config.style}

Pour chaque transition planifiee :
1. Appliquer le type de transition defini (cut, fondu, whip, match cut, etc.)
2. Respecter la duree planifiee
3. Synchroniser avec la musique (sur le beat ou en contretemps)
4. Ajouter un effet sonore de transition si necessaire
5. Verifier la fluidite a vitesse normale et au ralenti

Types de transitions a maîtriser :
- Cut franc : instantane, precis a la frame
- Fondu enchaine : duree variable (0.25s a 1s)
- Whip pan : mouvement rapide + motion blur
- Match cut : raccord graphique ou mouvement
- Smash cut : contraste brutal (calme → action)
- Flash / glitch : effets stylises selon ${config.style}

Verification : regarder le trailer en entier pour valider le rythme global.`,
    45,
    ['VFX_COMPOSITING', 'TRANSITION_PLANNING'],
    false
  )

  addTask(
    'SUBTITLE_GEN',
    'POST_PRODUCTION',
    'Generation des sous-titres',
    'Generer les sous-titres multilingues pour les dialogues et la narration du trailer.',
    `Genere les sous-titres du trailer.
Genre : ${config.genre}
Duree : ${durationLabel}

Langues :
1. Francais (langue source)
2. Anglais (traduction)
3. Espagnol (traduction)

Pour chaque langue :
1. Transcrire tous les dialogues et narrations
2. Synchroniser les sous-titres avec l'audio (timecodes precis)
3. Respecter les regles de sous-titrage :
   - Maximum 2 lignes de 42 caracteres
   - Duree minimum : 1 seconde
   - Duree maximum : 7 secondes
   - Pauses de 200ms entre deux sous-titres
4. Adapter le style des sous-titres au genre (police, couleur, position)
5. Export : fichiers SRT et VTT

Verification : relecture de chaque langue pour qualite linguistique.`,
    30,
    ['MUSIC_GENERATION'],
    false
  )

  // ─────────────────────────────────────────────
  // PHASE 8: ASSEMBLY
  // ─────────────────────────────────────────────

  addTask(
    'ROUGH_CUT',
    'ASSEMBLY',
    'Montage preliminaire',
    'Assembler une premiere version du trailer en combinant toutes les sequences video, audio et effets.',
    `Assemble le montage preliminaire (rough cut) du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree cible : ${durationLabel}

Etapes :
1. Importer toutes les sequences video generees (hook, intro, build, climax, tag)
2. Placer les clips dans l'ordre de la structure narrative
3. Appliquer les transitions planifiees
4. Synchroniser la musique avec les images
5. Placer les effets sonores aux timecodes definis
6. Integrer la voix-off et/ou les dialogues${config.hasVoiceover ? '\n7. Synchroniser la narration voix-off avec les images' : ''}${config.hasDialogue ? '\n8. Placer les dialogues aux moments prevus' : ''}
9. Integrer les cartons-titres
10. Verifier la duree totale (ajuster si necessaire)

Verification du rough cut :
- Le rythme est-il bon ? Le trailer tient-il en haleine ?
- Les transitions sont-elles fluides ?
- L'audio est-il bien synchronise ?
- La duree est-elle conforme a ${durationLabel} ?
- Noter tous les ajustements necessaires pour le final.`,
    40,
    ['TRANSITION_EFFECTS', 'MUSIC_GENERATION', 'SOUND_EFFECTS'],
    true
  )

  addTask(
    'FINAL_ASSEMBLY',
    'ASSEMBLY',
    'Assemblage final',
    'Realiser la version finale du trailer avec tous les ajustements, le mix audio final et les finitions.',
    `Realise l'assemblage final du trailer.
Genre : ${config.genre}
Style : ${config.style}
Duree : ${durationLabel}

Finitions :
1. Appliquer tous les ajustements notes lors du rough cut
2. Mix audio final :
   - Niveaux : musique (-12dB), dialogues (-6dB), effets (-10dB), voix-off (-8dB)
   - Spatialisation stereo
   - Compression et limiting (loudness broadcast : -14 LUFS)
3. Etalonnage final : derniers ajustements de couleur
4. Verification frame par frame des transitions
5. Ajout du logo CINEGENY en fin
6. Verification de la duree exacte
7. Dernier visionnage complet en conditions reelles

Le trailer doit etre a 100% de sa qualite finale.
Aucun artefact, aucune incoherence, audio parfaitement mixe.`,
    60,
    ['ROUGH_CUT', 'SUBTITLE_GEN', 'VFX_COMPOSITING'],
    false
  )

  addTask(
    'QUALITY_REVIEW',
    'ASSEMBLY',
    'Revue qualite finale',
    'Effectuer une revue qualite complete : technique, artistique et conformite avant export.',
    `Effectue la revue qualite finale du trailer.
Genre : ${config.genre}
Style : ${config.style}

Checklist qualite :
1. TECHNIQUE
   - Resolution : 1920x1080 minimum
   - Framerate : constant 24fps
   - Pas d'artefacts visuels (glitch, banding, compression)
   - Audio : pas de clipping, pas de bruit, niveaux conformes
   - Duree : conforme a ${durationLabel} (tolerance +/- 1s)

2. ARTISTIQUE
   - Le trailer raconte-t-il une histoire coherente ?
   - Le rythme tient-il le spectateur en haleine ?
   - Les emotions sont-elles correctement transmises ?
   - Le climax est-il suffisamment impactant ?
   - La fin donne-t-elle envie de voir le film ?

3. CONFORMITE
   - Pas de contenu problematique
   - Sous-titres corrects et synchronises
   - Logos et mentions legales presents
   - Coherence avec la charte graphique du film

4. TESTS
   - Visionnage sur grand ecran
   - Visionnage sur mobile
   - Test avec son et sans son
   - Test avec sous-titres actives

Rapport : note sur 10 + liste des points a corriger si < 8/10.`,
    15,
    ['FINAL_ASSEMBLY'],
    true
  )

  addTask(
    'EXPORT_FORMATS',
    'ASSEMBLY',
    'Export multi-formats',
    'Exporter le trailer dans tous les formats necessaires : cinema, web, mobile et reseaux sociaux.',
    `Exporte le trailer final dans tous les formats requis.
Genre : ${config.genre}
Duree : ${durationLabel}

Formats d'export :
1. MASTER
   - ProRes 422 HQ, 1920x1080, 24fps (archive)
   - WAV audio master stereo

2. WEB (streaming CINEGENY)
   - H.264, 1920x1080, 24fps, CRF 18 (haute qualite)
   - H.264, 1280x720, 24fps, CRF 20 (mobile)
   - H.265/HEVC, 1920x1080, 24fps (navigateurs compatibles)
   - Audio : AAC 320kbps

3. RESEAUX SOCIAUX
   - Format carre 1080x1080 (Instagram feed)
   - Format vertical 1080x1920 (Stories / TikTok / Reels)
   - Format 16:9 1920x1080 (YouTube / X)
   - Chaque format avec sous-titres incrustes

4. CINEMA (si applicable)
   - DCP 2K (2048x1080)

5. THUMBNAILS
   - 3 miniatures haute qualite (1920x1080, PNG)
   - 1 miniature verticale (1080x1920, PNG)

Pour chaque export : verifier la qualite, les sous-titres, l'audio.`,
    30,
    ['QUALITY_REVIEW'],
    false
  )

  // ─────────────────────────────────────────────
  // INTERNAL CINEGENY AUTOMATION TASKS
  // ─────────────────────────────────────────────

  if (config.isInternal) {
    addTask(
      'CONCEPT_BRIEF',
      'CONCEPT',
      'Auto-generation du brief par le pipeline interne',
      'Le pipeline interne CINEGENY genere automatiquement le brief a partir des metadata du film et de la base de donnees projet.',
      `[PIPELINE INTERNE CINEGENY]
Genere automatiquement le brief conceptuel en interrogeant :
1. La base de donnees du film (synopsis, genre, casting)
2. Les metadata marketing (audience cible, positionnement)
3. Les trailers precedents du meme genre sur la plateforme
4. Les metriques de performance des trailers similaires
5. Les tendances actuelles du marche

Ce brief enrichi remplace le brief manuel et inclut des recommandations data-driven.`,
      5,
      [],
      false
    )
  }

  return tasks
}

// ============================================
// GENRE-SPECIFIC ADDITIONAL TASKS
// ============================================

/** Additional tasks based on the film genre */
const GENRE_SPECIFIC_TASKS: Record<string, GenreTaskTemplate[]> = {
  'sci-fi': [
    {
      taskType: 'VFX_OVERLAY_GEN',
      phase: 'PRODUCTION',
      title: 'VFX — Hologrammes et interfaces futuristes',
      description: 'Generer les overlays d\'hologrammes, interfaces HUD et effets technologiques futuristes.',
      instructions: `Genere des overlays VFX specifiques science-fiction :
1. Interfaces holographiques (HUD, ecrans flottants, donnees)
2. Effets de teleportation / distorsion spatiale
3. Trainee lumineuse de propulsion (vaisseaux, reacteurs)
4. Effets de champ de force / bouclier energetique
5. Particules de plasma / energie
6. Texte alien / glyphes technologiques animes

Specifications :
- Fond transparent (canal alpha)
- Style : ${'{style}'} — coherent avec l'univers sci-fi
- Boucles de 5-10 secondes
- Couleurs : bleu electrique, cyan, violet, blanc
- 3 niveaux d'intensite par effet`,
      estimatedCredits: 120,
      dependsOnTypes: ['ENVIRONMENT_DESIGN', 'COLOR_PALETTE_DESIGN'],
      voteable: true,
    },
    {
      taskType: 'ENVIRONMENT_DESIGN',
      phase: 'VISUAL_DESIGN',
      title: 'Design — Environnements spatiaux et futuristes',
      description: 'Concevoir des environnements supplementaires : interieur de vaisseau, station spatiale, planete alien.',
      instructions: `Genere des environnements supplementaires pour un trailer de science-fiction :
1. Interieur de vaisseau spatial (pont de commandement, couloirs)
2. Vue spatiale (nebuleuse, planetes, champ d'asteroides)
3. Ville futuriste (skyline, rues, transports)
4. Laboratoire ou base technologique
5. Surface de planete alien (vegetation, atmosphere, ciel different)

Pour chaque environnement : vue d'ensemble + detail d'ambiance.
Style coherent avec le moodboard du trailer.`,
      estimatedCredits: 60,
      dependsOnTypes: ['REFERENCE_MOOD_BOARD'],
      voteable: true,
    },
    {
      taskType: 'VFX_COMPOSITING',
      phase: 'POST_PRODUCTION',
      title: 'Compositing avance — Effets spatiaux',
      description: 'Compositing avance pour les effets d\'espace, de warp et de technologies futuristes.',
      instructions: `Compositing avance pour les sequences sci-fi :
1. Integration des effets d'espace (etoiles, nebuleuses, planetes en arriere-plan)
2. Effets de warp / hyperespace
3. Reflection et refraction sur les surfaces metalliques
4. Integration des hologrammes dans les scenes
5. Effets de particules d'energie sur les personnages
6. Nettoyage des artefacts IA specifiques aux scenes complexes

Qualite cinema : chaque frame doit etre impeccable.`,
      estimatedCredits: 100,
      dependsOnTypes: ['COLOR_GRADING', 'VFX_OVERLAY_GEN'],
      voteable: false,
    },
  ],

  horror: [
    {
      taskType: 'SOUND_EFFECTS',
      phase: 'AUDIO',
      title: 'Sound design — Tension et jump scares',
      description: 'Creer des effets sonores specialises pour la tension, l\'angoisse et les jump scares.',
      instructions: `Genere des effets sonores specialises horreur :
1. Drones de tension (basses frequences oppressantes) — 4 variations
2. Stingers de jump scare (impact + cri aigu) — 5 variations d'intensite
3. Craquements, grincements, pas dans le noir — 6 variations
4. Respirations (paniques, etouffees, spectrales) — 4 variations
5. Whispers (chuchotements incomprehensibles) — 3 variations
6. Silence oppressant puis impact brutal — 3 variations
7. Distorsions sonores (voix inversees, ralentissements)

Specifications : WAV 48kHz/24bit, categorises par type et intensite.
Timing : certains effets doivent durer exactement 0.5s (jump scare), d'autres 5-10s (drones).`,
      estimatedCredits: 60,
      dependsOnTypes: ['MUSIC_SELECTION'],
      voteable: false,
    },
    {
      taskType: 'COLOR_GRADING',
      phase: 'POST_PRODUCTION',
      title: 'Etalonnage — Atmosphere sombre et oppressante',
      description: 'Appliquer un etalonnage specialise pour creer une atmosphere horrifique : ombres profondes, desaturation, teintes froides.',
      instructions: `Etalonnage specialise horreur :
1. Desaturation partielle (couleurs lavees, cadaveriques)
2. Ombres ultra-profondes (noirs ecrases, details perdus dans l'ombre)
3. Teinte dominante froide (bleu-vert pour les scenes de tension)
4. Contraste extreme dans les scenes de jump scare
5. Grain film prononce (texture analogique anxiogene)
6. Flash de couleur chaude pour les scenes de choc (rouge, orange)
7. Vignettage prononce (isole le personnage, ferme le cadre)

Courbe d'etalonnage : de plus en plus sombre et contraste a mesure que le trailer avance.`,
      estimatedCredits: 70,
      dependsOnTypes: ['SCENE_VIDEO_GEN_CLIMAX', 'COLOR_PALETTE_DESIGN'],
      voteable: true,
    },
    {
      taskType: 'TRANSITION_EFFECTS',
      phase: 'POST_PRODUCTION',
      title: 'Transitions — Effets horrifiques',
      description: 'Appliquer des transitions specialisees : flash strobe, glitch, fondu au noir progressif.',
      instructions: `Transitions specialisees horreur :
1. Flash strobe : alternance rapide noir/blanc (0.1s) avant un jump scare
2. Glitch video : distorsion numerique entre scenes angoissantes
3. Fondu au noir progressif : lent, oppressant, pour les fins de sequence
4. Shake camera : vibration de la camera sur les impacts
5. Inversion rapide : image inversee pendant 1-2 frames (subliminal)
6. Smash cut depuis le silence vers le bruit

Timing : les transitions doivent amplifier la tension, jamais la reduire.`,
      estimatedCredits: 50,
      dependsOnTypes: ['VFX_COMPOSITING', 'TRANSITION_PLANNING'],
      voteable: false,
    },
  ],

  action: [
    {
      taskType: 'SCENE_VIDEO_GEN_BUILD',
      phase: 'PRODUCTION',
      title: 'Generation video — Sequences de cascades et explosions',
      description: 'Generer des sequences supplementaires de cascades, explosions et poursuites pour la montee en tension.',
      instructions: `Genere des sequences d'action supplementaires :
1. Sequence de poursuite (vehicule, pied, ou les deux) — 3-5 secondes
2. Explosion spectaculaire avec debris — 2-3 secondes
3. Cascade physique (saut, chute, esquive) — 2-3 secondes
4. Combat rapproche (2-3 plans rapides) — 3-4 secondes
5. Destruction d'environnement (effondrement, impact vehicule) — 2-3 secondes

Specifications :
- Mouvements de camera dynamiques (shaky cam controlee, tracking rapide)
- Ralenti partiel sur les impacts (ramped speed)
- Eclairage dramatique (backlight, explosions comme source lumineuse)
- Generer 2 variations par sequence

Ces plans s'inserent dans la montee en tension du trailer.`,
      estimatedCredits: 250,
      dependsOnTypes: ['SCENE_STORYBOARD_BUILD', 'SCENE_VIDEO_GEN_INTRO'],
      voteable: true,
    },
    {
      taskType: 'VFX_OVERLAY_GEN',
      phase: 'PRODUCTION',
      title: 'VFX — Explosions, debris et effets de vitesse',
      description: 'Generer des overlays VFX d\'explosions, de debris volants et d\'effets de vitesse.',
      instructions: `Genere des overlays VFX specifiques action :
1. Explosions (boule de feu, onde de choc, debris) — 4 variations
2. Etincelles et debris metalliques — 3 variations
3. Trainees de vitesse (speed lines, motion blur directionnel) — 3 variations
4. Impact de balles / projectiles — 5 variations
5. Fumee et poussiere d'explosion — 3 variations
6. Eclats de verre — 2 variations

Fond transparent, boucles, 1920x1080, multiples intensites.`,
      estimatedCredits: 100,
      dependsOnTypes: ['ENVIRONMENT_DESIGN'],
      voteable: false,
    },
    {
      taskType: 'SOUND_EFFECTS',
      phase: 'AUDIO',
      title: 'Sound design — Impacts, explosions et vitesse',
      description: 'Effets sonores d\'action : explosions, impacts metalliques, crissements de pneus, tirs.',
      instructions: `Genere des effets sonores d'action :
1. Explosions (petites, moyennes, massives) — 5 variations par taille
2. Impacts metalliques (coups, collisions vehicules) — 6 variations
3. Crissements de pneus et moteurs — 4 variations
4. Tirs et projectiles (whoosh, impact, ricochets) — 8 variations
5. Bris de verre et destruction — 4 variations
6. Grunts et impacts corporels — 5 variations
7. Wind whoosh pour les sequences rapides — 3 variations

WAV 48kHz/24bit, categorises, avec timecodes suggeres.`,
      estimatedCredits: 55,
      dependsOnTypes: ['MUSIC_SELECTION'],
      voteable: false,
    },
  ],

  comedy: [
    {
      taskType: 'SOUND_EFFECTS',
      phase: 'AUDIO',
      title: 'Sound design — Effets comiques et timing',
      description: 'Creer des effets sonores comiques : rim shots, effets cartoon, sons de reaction.',
      instructions: `Genere des effets sonores comiques :
1. Rim shot / ba dum tss — 3 variations (subtil, moyen, exagere)
2. Record scratch (pour les moments de rupture) — 2 variations
3. Effets de reaction (gasp collectif, rire, silence embarrasse) — 4 variations
4. Sons cartoon adaptes au ton (boing, slide whistle, honk) — si ton le permet
5. Transitions comiques (whip, pop, clac) — 5 variations
6. Stingers comiques (phrases musicales droles, 1-2 secondes) — 3 variations

Important : adapter le niveau de cartoon au ton du film.
Un drame comique n'utilise pas les memes effets qu'une farce.
WAV 48kHz/24bit.`,
      estimatedCredits: 40,
      dependsOnTypes: ['MUSIC_SELECTION', 'GENRE_TONE_DEFINITION'],
      voteable: false,
    },
    {
      taskType: 'NARRATION_SCRIPT',
      phase: 'SCRIPT',
      title: 'Script — Narration comique et timing des gags',
      description: 'Adapter la narration pour mettre en valeur les gags et le timing comique.',
      instructions: `Ecris un script de narration optimise pour la comedie :
1. Setup / Punchline : structure chaque segment comme un gag
2. Contraste : narration serieuse sur images droles (ou inverse)
3. Pauses comediques : timing precis pour laisser le rire s'installer
4. Callback : referencer un element du debut a la fin
5. Understatement : minimiser les situations absurdes dans la narration
6. Running gag : un element qui revient 3 fois (regle de 3)

La narration doit donner le ton du film : est-ce une comedie legere, une satire, un buddy movie ?
Chaque phrase doit servir le rythme comique.`,
      estimatedCredits: 12,
      dependsOnTypes: ['TRAILER_STRUCTURE'],
      voteable: true,
    },
    {
      taskType: 'MUSIC_GENERATION',
      phase: 'AUDIO',
      title: 'Musique — Bande son legere et entrainante',
      description: 'Generer une musique legere, fun et entrainante adaptee au ton comique du trailer.',
      instructions: `Genere une bande musicale comique :
1. Ton : fun, leger, entrainant (pas de musique epicque sauf en parodie)
2. Instruments : ukulele, pizzicato, xylophone, claquements de doigts, sifflement
3. Tempo : moyen-rapide (120-140 BPM), groove constant
4. Structure :
   - Intro : theme accrocheut, reconnaissable
   - Build : ajout de couches (batterie, basse)
   - Pause comedique : silence ou note tenue pour le timing du gag
   - Reprise : le theme repart apres le gag
   - Fin : stinger comique ou fondu

3 variations : pop legere, jazz swing, indie quirky.`,
      estimatedCredits: 70,
      dependsOnTypes: ['MUSIC_SELECTION'],
      voteable: true,
    },
  ],

  drama: [
    {
      taskType: 'CHARACTER_DESIGN_MAIN',
      phase: 'VISUAL_DESIGN',
      title: 'Design — Expressions emotionnelles approfondies',
      description: 'Creer une planche etendue d\'expressions emotionnelles pour le personnage principal, essentielle aux scenes intimes.',
      instructions: `Genere une planche d'expressions emotionnelles approfondies :
1. 8-10 expressions subtiles (pas de surjeu) :
   - Tristesse contenue, larmes silencieuses
   - Colere refoulee, machoire serree
   - Espoir fragile, regard vers le haut
   - Desespoir, regard vide
   - Tendresse, demi-sourire
   - Surprise emotionnelle
   - Determination silencieuse
   - Vulnerabilite
2. Chaque expression en gros plan (yeux, bouche, posture)
3. Eclairage intime : sources douces, contre-jour, lumiere naturelle
4. Coherence avec le character design existant

Le drame repose sur la subtilite des expressions — chaque micro-expression compte.`,
      estimatedCredits: 40,
      dependsOnTypes: ['REFERENCE_MOOD_BOARD'],
      voteable: true,
    },
    {
      taskType: 'COLOR_GRADING',
      phase: 'POST_PRODUCTION',
      title: 'Etalonnage — Tons intimes et emotionnels',
      description: 'Appliquer un etalonnage cinematographique subtil privilegiant les tons chauds, la douceur et l\'intimite.',
      instructions: `Etalonnage specialise drame :
1. Tons chauds dominants (ambre, or, sepia leger)
2. Contraste doux, pas d'ombres ecrasees
3. Peau naturelle, lumineuse (pas de teint cadaverique)
4. Highlights doux (halation, blooming leger)
5. Transitions de couleur subtiles entre scenes joyeuses et tristes
6. Scenes tristes : desaturation legere, bleus froids
7. Scenes d'espoir : lumiere doree, legerement surexposee
8. Grain film analogique (35mm) pour la chaleur

L'etalonnage doit servir l'emotion sans la forcer.`,
      estimatedCredits: 65,
      dependsOnTypes: ['SCENE_VIDEO_GEN_CLIMAX', 'COLOR_PALETTE_DESIGN'],
      voteable: true,
    },
    {
      taskType: 'MUSIC_GENERATION',
      phase: 'AUDIO',
      title: 'Musique — Bande son emotionnelle et intime',
      description: 'Generer une bande musicale cinematographique privilegiant le piano, les cordes et les crescendos emotionnels.',
      instructions: `Genere une bande musicale de drame cinematographique :
1. Instrument dominant : piano solo (intro), puis cordes
2. Crescendo emotionnel progressif :
   - Debut : piano seul, melancolique, epure
   - Build : ajout violoncelle, puis violons
   - Climax : orchestre complet, pic emotionnel
   - Fin : retour au piano seul (boucle emotionnelle)
3. Tempo : lent (60-80 BPM), respirant
4. Pas de percussions lourdes (sauf heartbeat subtil)
5. Silences strategiques aux moments cles
6. Qualite cinema : enregistrement orchestral IA haut de gamme

3 variations : piano et cordes, guitare acoustique, musique ambiante.`,
      estimatedCredits: 80,
      dependsOnTypes: ['MUSIC_SELECTION'],
      voteable: true,
    },
  ],

  animation: [
    {
      taskType: 'CHARACTER_DESIGN_MAIN',
      phase: 'VISUAL_DESIGN',
      title: 'Design — Coherence du style d\'animation',
      description: 'Creer un guide de style d\'animation detaille pour garantir la coherence visuelle sur toutes les scenes.',
      instructions: `Cree un guide de style d'animation complet :
1. Style d'animation defini (2D, 3D, mixed media, stop-motion)
2. Proportions des personnages (head-to-body ratio, stylisation)
3. Gamme de mouvements (squash & stretch, timing, spacing)
4. Palette de couleurs par personnage
5. Regles d'eclairage anime (flat, cel-shaded, realiste)
6. Turnarounds des personnages principaux (360 degres)
7. Expression sheets conformes au style d'animation
8. Guide de ligne (epaisseur, couleur, style)

Le guide doit permettre a l'IA de generer des videos coherentes d'une scene a l'autre.`,
      estimatedCredits: 50,
      dependsOnTypes: ['REFERENCE_MOOD_BOARD'],
      voteable: true,
    },
    {
      taskType: 'VFX_OVERLAY_GEN',
      phase: 'PRODUCTION',
      title: 'VFX — Effets d\'animation stylises',
      description: 'Generer des effets visuels stylises coherents avec le style d\'animation : particules, impacts, magie.',
      instructions: `Genere des effets visuels stylises pour animation :
1. Effets d'impact anime (lignes de vitesse, etoiles, ondes de choc stylisees)
2. Particules stylisees (pas realistes : brillantes, geometriques, colorees)
3. Effets de magie/pouvoir (halos, auras, rayons)
4. Transitions stylisees (wipe colore, explosion de confettis, morphing)
5. Effets atmospheriques stylises (pluie en traits, neige en points)
6. Effets d'emotion (lignes de colere, gouttes de sueur, coeurs)

Tout doit etre dans le meme style graphique que l'animation.
Fond transparent, boucles, haute resolution.`,
      estimatedCredits: 90,
      dependsOnTypes: ['CHARACTER_DESIGN_MAIN', 'COLOR_PALETTE_DESIGN'],
      voteable: true,
    },
    {
      taskType: 'VFX_COMPOSITING',
      phase: 'POST_PRODUCTION',
      title: 'Compositing — Integration des effets d\'animation',
      description: 'Assembler les effets stylises avec les scenes animees en maintenant la coherence graphique.',
      instructions: `Compositing specialise animation :
1. Integrer les effets d'animation stylises sur les scenes
2. Verifier la coherence du style graphique (pas de melange realiste/stylise)
3. Ajuster l'eclairage des overlays pour matcher le cel-shading
4. Gerer la profondeur de champ stylisee
5. Verifier les contours et lignes sur les composites
6. Animer les effets en coherence avec le timing de l'animation (frames on 2s vs 1s)

La fusion doit etre invisible : tout semble faire partie du meme monde anime.`,
      estimatedCredits: 80,
      dependsOnTypes: ['COLOR_GRADING', 'VFX_OVERLAY_GEN'],
      voteable: false,
    },
  ],

  musical: [
    {
      taskType: 'MUSIC_GENERATION',
      phase: 'AUDIO',
      title: 'Musique — Numero musical du trailer',
      description: 'Generer une sequence musicale complete avec choregraphie audio pour le trailer.',
      instructions: `Genere la sequence musicale principale du trailer :
1. Extrait du numero musical le plus accrocheur du film (15-30 secondes)
2. Structure : intro instrumentale → couplet → refrain explosif
3. Mix special trailer : version boostee, plus epicque que la version film
4. Synchronisation avec les mouvements de danse (beats marques)
5. Transition vers la musique "trailer" classique apres le numero
6. Drop musical spectaculaire pour le climax

Generer le numero + la transition vers la musique de trailer.
3 variations : pop moderne, broadway classique, hip-hop/R&B.`,
      estimatedCredits: 100,
      dependsOnTypes: ['MUSIC_SELECTION'],
      voteable: true,
    },
    {
      taskType: 'SCENE_VIDEO_GEN_BUILD',
      phase: 'PRODUCTION',
      title: 'Generation video — Sequence de danse/choregraphie',
      description: 'Generer des sequences de danse et choregraphie pour le trailer musical.',
      instructions: `Genere des sequences de danse pour le trailer musical :
1. Plans larges de groupe (choregraphie d'ensemble) — 3-5 secondes
2. Plans serres du personnage principal en mouvement — 2-3 secondes
3. Plans de detail (pieds, mains, expressions) — 1-2 secondes
4. Travelling lateral suivant les danseurs — 3-4 secondes
5. Plan plongeant (vue drone, formation geometrique) — 2-3 secondes

Synchronisation :
- Chaque mouvement doit etre sur le beat de la musique
- Les coupes doivent tomber sur les accents musicaux
- Le rythme de montage suit le tempo

Style : fluide, energique, joyeux — adapte au style du film.`,
      estimatedCredits: 280,
      dependsOnTypes: ['SCENE_STORYBOARD_BUILD', 'MUSIC_GENERATION'],
      voteable: true,
    },
  ],

  documentary: [
    {
      taskType: 'ENVIRONMENT_DESIGN',
      phase: 'VISUAL_DESIGN',
      title: 'Design — Cadrage d\'interview et style archival',
      description: 'Definir le style visuel des sequences d\'interview et des images d\'archive pour le trailer documentaire.',
      instructions: `Definis le style visuel du trailer documentaire :
1. Cadrage d'interview :
   - Position du sujet (regle des tiers, regard)
   - Arriere-plan (epure, contextuel, bokeh)
   - Eclairage (naturel, soft box, rembrandt)
   - Style de carton-nom (police, couleur, position)

2. Style archival :
   - Traitement des images d'archive (grain, vignettage, format 4:3)
   - Transitions archive → actuel (fondu, match cut)
   - Couleur des archives vs couleur du present

3. Donnees et infographies :
   - Style des chiffres et statistiques a l'ecran
   - Animations de donnees (graphiques, cartes, timelines)
   - Police et couleurs des infographies

4. Plans de coupe :
   - B-roll atmospherique (lieux, details, textures)
   - Slow-motion emotionnel
   - Time-lapse contextuel`,
      estimatedCredits: 40,
      dependsOnTypes: ['REFERENCE_MOOD_BOARD'],
      voteable: true,
    },
    {
      taskType: 'NARRATION_SCRIPT',
      phase: 'SCRIPT',
      title: 'Script — Narration factuelle et engageante',
      description: 'Ecrire une narration documentaire factuelle mais engageante, avec des donnees cles et un arc narratif.',
      instructions: `Ecris la narration d'un trailer documentaire :
1. Ton : factuel, credible, engage mais pas militant
2. Structure :
   - Accroche : fait choquant ou question provocante
   - Contexte : poser le sujet en 2-3 phrases
   - Enjeux : pourquoi c'est important maintenant
   - Temoignage : laisser la place aux intervenants (pauses narration)
   - Conclusion : question ouverte ou appel a la curiosite
3. Inclure 2-3 donnees chifrees impactantes
4. Alterner narration et extraits de temoignages
5. Eviter le sensationnalisme : laisser les faits parler
6. Fin : ne pas tout reveler, donner envie d'en savoir plus

Timecodes precis pour la synchronisation avec les images.`,
      estimatedCredits: 12,
      dependsOnTypes: ['TRAILER_STRUCTURE'],
      voteable: true,
    },
    {
      taskType: 'VOICEOVER_GEN',
      phase: 'AUDIO',
      title: 'Voix-off — Narration documentaire credible',
      description: 'Generer une voix-off credible et naturelle pour la narration documentaire.',
      instructions: `Genere la voix-off documentaire :
1. Voix : naturelle, credible, pas "trailer voice" (pas de voix profonde epicque)
2. Ton : informatif, engage, humain
3. Rythme : pose, avec des pauses naturelles
4. Emotion : subtile, pas melodramatique
5. Generer 3 variations :
   - Voix masculine posee (type journaliste)
   - Voix feminine engagee (type realisatrice)
   - Voix neutre narrative
6. Qualite broadcast, son naturel (pas trop traite)

Le spectateur doit avoir l'impression qu'un humain lui parle, pas un robot.`,
      estimatedCredits: 55,
      dependsOnTypes: ['NARRATION_SCRIPT'],
      voteable: true,
    },
  ],
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Get genre-specific notes for sound design instructions */
function getGenreSoundNotes(genre: string): string {
  const notes: Record<string, string> = {
    'sci-fi': '- Effets laser, teleportation, moteurs spatiaux, interfaces electroniques, void spatial',
    horror: '- Drones basse frequence, craquements, chuchotements, impacts jump scare, silence oppressant',
    action: '- Explosions, impacts metalliques, tirs, crissements de pneus, whoosh, debris',
    comedy: '- Rim shots, record scratch, reactions de foule, effets cartoon subtils, transitions pop',
    drama: '- Ambiances naturelles douces, respiration, heartbeat, silence emotionnel, bruissements',
    animation: '- Effets stylises, impacts cartoon, transitions magiques, sons expressifs',
    musical: '- Claquements de talons, froissements de tissu, ovation, instruments live',
    documentary: '- Ambiances urbaines/nature, bruits d\'archive, sons de machine a ecrire, flashs photo',
  }
  return notes[genre.toLowerCase()] || '- Effets sonores adaptes au genre du film'
}

/** Get genre-specific notes for color grading instructions */
function getGenreColorNotes(genre: string): string {
  const notes: Record<string, string> = {
    'sci-fi': 'Bleus electriques, cyans, violets. Hautes lumieres nettes. Ambiance futuriste froide.',
    horror: 'Desaturation, teintes froides bleu-vert, ombres profondes, contrastes extremes.',
    action: 'Couleurs saturees, oranges et teals (Hollywood look), contrastes forts, eclats de lumiere.',
    comedy: 'Couleurs vives et chaudes, saturation elevee, eclairage flatteur, tons joyeux.',
    drama: 'Tons chauds (ambre, or), contraste doux, peau naturelle, grain analogique.',
    animation: 'Couleurs vives et coherentes avec le style graphique, pas de grain, nettete.',
    musical: 'Couleurs spectacle (or, rouge, bleu electrique), eclairage de scene, brillance.',
    documentary: 'Naturaliste, tons neutres, separation claire entre archive (desature) et actuel.',
  }
  return notes[genre.toLowerCase()] || 'Etalonnage adapte au genre et au style du film.'
}

/** Normalize genre string for lookup */
function normalizeGenre(genre: string): string {
  const mapping: Record<string, string> = {
    'science-fiction': 'sci-fi',
    'science fiction': 'sci-fi',
    scifi: 'sci-fi',
    'sci-fi': 'sci-fi',
    sf: 'sci-fi',
    horreur: 'horror',
    horror: 'horror',
    action: 'action',
    comedie: 'comedy',
    comedy: 'comedy',
    drame: 'drama',
    drama: 'drama',
    animation: 'animation',
    musical: 'musical',
    documentaire: 'documentary',
    documentary: 'documentary',
  }
  return mapping[genre.toLowerCase()] || genre.toLowerCase()
}

// ============================================
// MAIN DECOMPOSITION FUNCTION
// ============================================

/**
 * Decompose a trailer creation project into a complete list of AI-executable micro-tasks.
 *
 * @param config - Trailer configuration (genre, duration, style, options)
 * @returns Array of task definitions, ordered by execution sequence
 */
export function decomposeTrailerToTasks(config: TrailerDecomposeConfig): TrailerTaskDefinition[] {
  // Build base tasks with config-aware conditional inclusion
  const baseTasks = buildBaseTasks(config)

  // Add genre-specific tasks
  const genreTasks = getGenreSpecificTasks(config.genre)
  const durationMult = DURATION_MULTIPLIERS[config.duration]

  // Convert genre tasks to full task definitions and merge
  const allTasks = [...baseTasks]
  let nextOrder = baseTasks.length + 1

  for (const template of genreTasks) {
    // Replace {style} placeholder in instructions
    const instructions = template.instructions.replace(/\$\{'\{style\}'\}/g, config.style)

    allTasks.push({
      taskType: template.taskType,
      phase: template.phase,
      title: template.title,
      description: template.description,
      instructions,
      order: nextOrder++,
      estimatedCredits: Math.round(template.estimatedCredits * durationMult),
      dependsOnTypes: template.dependsOnTypes,
      communityVoteEnabled: template.voteable && config.communityVoteEnabled,
    })
  }

  // Sort by phase order, then by order within phase
  const phaseIndex = (phase: TrailerPhase) => TRAILER_PHASE_ORDER.indexOf(phase)
  allTasks.sort((a, b) => {
    const phaseDiff = phaseIndex(a.phase) - phaseIndex(b.phase)
    if (phaseDiff !== 0) return phaseDiff
    return a.order - b.order
  })

  // Re-assign order numbers after sorting
  allTasks.forEach((task, index) => {
    task.order = index + 1
  })

  return allTasks
}

/**
 * Get additional genre-specific tasks for a trailer.
 *
 * @param genre - Film genre (French or English)
 * @returns Array of genre-specific task templates
 */
export function getGenreSpecificTasks(genre: string): GenreTaskTemplate[] {
  const normalized = normalizeGenre(genre)
  return GENRE_SPECIFIC_TASKS[normalized] || []
}

/**
 * Estimate the total AI credits needed for a trailer based on configuration.
 *
 * @param config - Trailer configuration
 * @returns Credit estimate with total, breakdown by phase, and task count
 */
export function estimateTrailerCredits(config: TrailerDecomposeConfig): TrailerCreditEstimate {
  const tasks = decomposeTrailerToTasks(config)
  const durationMult = DURATION_MULTIPLIERS[config.duration]

  const byPhase: Record<TrailerPhase, number> = {
    CONCEPT: 0,
    SCRIPT: 0,
    VISUAL_DESIGN: 0,
    STORYBOARD: 0,
    PRODUCTION: 0,
    AUDIO: 0,
    POST_PRODUCTION: 0,
    ASSEMBLY: 0,
  }

  let total = 0

  for (const task of tasks) {
    byPhase[task.phase] += task.estimatedCredits
    total += task.estimatedCredits
  }

  return {
    total,
    byPhase,
    taskCount: tasks.length,
    durationMultiplier: durationMult,
  }
}
