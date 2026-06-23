export const ROLES = {
  ADMIN: 'ADMIN',
  CONTRIBUTOR: 'CONTRIBUTOR',
  ARTIST: 'ARTIST',
  STUNT_PERFORMER: 'STUNT_PERFORMER',
  VIEWER: 'VIEWER',
  SCREENWRITER: 'SCREENWRITER',
} as const

export const LEVELS = {
  ROOKIE: 'ROOKIE',
  PRO: 'PRO',
  EXPERT: 'EXPERT',
  VIP: 'VIP',
} as const

export const LEVEL_POINTS = {
  ROOKIE: 0,
  PRO: 500,
  EXPERT: 2500,
  VIP: 10000,
} as const

export const TASK_PRICES = [50, 100, 500] as const

export const DIFFICULTY_LABELS = {
  EASY: 'Facile',
  MEDIUM: 'Moyen',
  HARD: 'Difficile',
  EXPERT: 'Expert',
} as const

export const DIFFICULTY_STARS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXPERT: 4,
} as const

export const TASK_STATUS_LABELS = {
  LOCKED: 'Verrouillée',
  AVAILABLE: 'Available',
  CLAIMED: 'In progress',
  SUBMITTED: 'Soumise',
  AI_REVIEW: 'Revue IA',
  HUMAN_REVIEW: 'Revue Humaine',
  VALIDATED: 'Validated',
  REJECTED: 'Rejetée',
} as const

export const FILM_STATUS_LABELS = {
  DRAFT: 'Draft',
  PRE_PRODUCTION: 'Pré-production',
  IN_PRODUCTION: 'En production',
  POST_PRODUCTION: 'Post-production',
  RELEASED: 'Sorti',
} as const

export const PHASE_LABELS = {
  SCRIPT: 'Screenplay',
  STORYBOARD: 'Storyboard',
  PREVIZ: 'Préviz',
  DESIGN: 'Design',
  ANIMATION: 'Animation',
  VFX: 'VFX',
  AUDIO: 'Audio',
  EDITING: 'Montage',
  COLOR: 'Étalonnage',
  FINAL: 'Finalisation',
} as const

export const TASK_TYPE_LABELS = {
  PROMPT_WRITING: 'Écriture de Prompt',
  IMAGE_GEN: 'Génération Image',
  VIDEO_REVIEW: 'Revue Vidéo',
  STUNT_CAPTURE: 'Capture Cascade',
  DANCE_CAPTURE: 'Capture Danse',
  DIALOGUE_EDIT: 'Édition Dialogue',
  COLOR_GRADE: 'Étalonnage',
  SOUND_DESIGN: 'Sound Design',
  CONTINUITY_CHECK: 'Vérification Continuité',
  QA_REVIEW: 'QA Review',
  CHARACTER_DESIGN: 'Design Personnage',
  ENV_DESIGN: "Design d'Environnement",
  MOTION_REF: 'Référence Mouvement',
  COMPOSITING: 'Compositing',
  TRANSLATION: 'Traduction',
  SUBTITLE: 'Sous-titrage',
} as const

export const CATALOG_LABELS = {
  CINEGENY: 'CINEGENY Originals',
  RUPPIN: 'Ruppin College',
  BIBLE: 'Films Bibliques',
  ACTION: 'Action',
  COMMUNITY: 'Community',
} as const

export const SKILLS = [
  'Prompt Engineering',
  'Image Generation',
  'Video Editing',
  'Stunt Performance',
  'Dance',
  'Motion Capture',
  'Sound Design',
  'Color Grading',
  'VFX / Compositing',
  'Character Design',
  'Environment Design',
  'Translation',
  'Subtitling',
  'QA / Review',
  'Screenwriting',
  'Direction Artistique',
] as const

export const LANGUAGES = [
  'Français',
  'English',
  'עברית',
  'Español',
  'Deutsch',
  'Italiano',
  'Português',
  '中文',
  'العربية',
] as const

export const GENRES = [
  'Action',
  'Aventure',
  'Animation',
  'Comedy',
  'Documentaire',
  'Drame',
  'Fantaisie',
  'Horreur',
  'Musical',
  'Romance',
  'Science-Fiction',
  'Thriller',
  'Western',
  'Historique',
  'Biblique',
] as const

export const ACTOR_STYLE_LABELS = {
  DRAMATIC: 'Dramatique',
  COMEDY: 'Comedy',
  ACTION: 'Action',
  VERSATILE: 'Polyvalent',
  HORROR: 'Horreur',
  ROMANCE: 'Romance',
  EXPERIMENTAL: 'Expérimental',
} as const

export const CAST_ROLE_LABELS = {
  LEAD: 'Rôle principal',
  SUPPORTING: 'Second rôle',
  CAMEO: 'Caméo',
  VOICE: 'Voix',
  NARRATOR: 'Narrateur',
} as const

export const BONUS_TYPE_LABELS = {
  INTERVIEW: 'Interview',
  DELETED_SCENE: 'Deleted scene',
  BLOOPER: 'Bloopers',
  BTS: 'Making-of',
  DIRECTORS_COMMENTARY: 'Commentaire du réalisateur',
  CONCEPT_ART: 'Concept Art',
  SOUNDTRACK: 'Bande originale',
  MAKING_OF: 'Coulisses',
  AUDITION_TAPE: 'Audition',
} as const

export const SCENARIO_STATUS_LABELS = {
  SUBMITTED: 'Submitted',
  SHORTLISTED: 'Présélectionné',
  VOTING: 'En vote',
  WINNER: 'Gagnant',
  ARCHIVED: 'Archivé',
} as const

export const CONTEST_STATUS_LABELS = {
  UPCOMING: 'À venir',
  OPEN: 'Ouvert',
  VOTING: 'En vote',
  CLOSED: 'Completed',
} as const
