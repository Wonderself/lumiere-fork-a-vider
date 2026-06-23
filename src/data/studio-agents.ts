/**
 * CineGeny Creative Studio Agents
 * 7 specialized agents for visual content creation.
 */

export interface StudioAgent {
  slug: string
  name: string
  role: string
  description: string
  icon: string
  color: string
  capabilities: string[]
  defaultStyle: string
}

export const STUDIO_AGENTS: StudioAgent[] = [
  {
    slug: 'cg-studio-poster',
    name: 'Affichiste IA',
    role: 'Création d\'affiches',
    description: 'Crée des affiches de film professionnelles avec composition, typographie et impact visuel. Maîtrise tous les styles d\'affiches (blockbuster, indie, festival, série).',
    icon: 'image',
    color: '#E50914',
    capabilities: ['poster_design', 'composition', 'typography', 'color_grading', 'key_art'],
    defaultStyle: 'cinematic',
  },
  {
    slug: 'cg-studio-storyboard',
    name: 'Storyboarder IA',
    role: 'Storyboards & Découpage',
    description: 'Génère des storyboards professionnels frame par frame. Traduit le scénario en séquences visuelles avec indications de caméra.',
    icon: 'layout-grid',
    color: '#3B82F6',
    capabilities: ['storyboard', 'shot_sequence', 'camera_angles', 'scene_breakdown', 'animatic_prep'],
    defaultStyle: 'realistic',
  },
  {
    slug: 'cg-studio-concept',
    name: 'Concept Artist IA',
    role: 'Concept Art & Design',
    description: 'Crée du concept art pour personnages, créatures, véhicules, objets et environments. Style adapté au genre du film.',
    icon: 'palette',
    color: '#8B5CF6',
    capabilities: ['character_design', 'environment_design', 'prop_design', 'creature_design', 'style_exploration'],
    defaultStyle: 'artistic',
  },
  {
    slug: 'cg-studio-decor',
    name: 'Décorateur IA',
    role: 'Décors & Environnements',
    description: 'Conçoit des décors et environnements cinématographiques. Du studio au paysage épique, en passant par les intérieurs réalistes.',
    icon: 'building',
    color: '#10B981',
    capabilities: ['set_design', 'location_scouting', 'environment_art', 'architectural_viz', 'lighting_setup'],
    defaultStyle: 'cinematic',
  },
  {
    slug: 'cg-studio-vfx-prev',
    name: 'Previs VFX IA',
    role: 'Prévisualisation VFX',
    description: 'Génère des prévisualisations d\'effets visuels : explosions, magie, sci-fi, transformations. Permet de valider les VFX avant production.',
    icon: 'sparkles',
    color: '#F97316',
    capabilities: ['vfx_preview', 'particle_effects', 'compositing_mockup', 'before_after', 'motion_design'],
    defaultStyle: 'cinematic',
  },
  {
    slug: 'cg-studio-trailer',
    name: 'Monteur Bande-Annonce IA',
    role: 'Teasers & Trailers',
    description: 'Assemble des bandes-annonces et teasers à partir d\'images et vidéos générées. Maîtrise le rythme, les transitions et le build-up dramatique.',
    icon: 'film',
    color: '#EC4899',
    capabilities: ['trailer_editing', 'teaser_creation', 'pacing', 'music_sync', 'title_cards'],
    defaultStyle: 'cinematic',
  },
  {
    slug: 'cg-studio-costume',
    name: 'Costumier IA',
    role: 'Costumes & Look',
    description: 'Design de costumes et looks pour les personnages. Du contemporain au fantastique, en passant par les époques historiques.',
    icon: 'shirt',
    color: '#14B8A6',
    capabilities: ['costume_design', 'character_look', 'period_accuracy', 'fabric_texture', 'color_coordination'],
    defaultStyle: 'realistic',
  },
]

// ─── Photo Styles ───────────────────────────────────────────────────

export const PHOTO_STYLES = [
  { id: 'realistic', label: 'Realistic', description: 'Photoréalisme haute fidélité', prompt_suffix: 'photorealistic, ultra detailed, 8K, professional photography' },
  { id: 'artistic', label: 'Artistique', description: 'Peinture numérique, illustratif', prompt_suffix: 'digital painting, artistic, concept art, illustration' },
  { id: 'anime', label: 'Anime', description: 'Style japonais animé', prompt_suffix: 'anime style, japanese animation, vibrant colors, cel shading' },
  { id: 'cinematic', label: 'Cinématique', description: 'Éclairage cinéma, depth of field', prompt_suffix: 'cinematic lighting, film grain, anamorphic lens, depth of field, movie still' },
  { id: 'minimalist', label: 'Minimaliste', description: 'Épuré, compositions simples', prompt_suffix: 'minimalist, clean composition, negative space, modern design' },
]

export const PHOTO_RATIOS = [
  { id: '1:1', label: '1:1', w: 1024, h: 1024, description: 'Carré — Réseaux sociaux' },
  { id: '16:9', label: '16:9', w: 1344, h: 768, description: 'Cinéma — Plan large' },
  { id: '9:16', label: '9:16', w: 768, h: 1344, description: 'Portrait — Affiche' },
  { id: '4:3', label: '4:3', w: 1152, h: 896, description: 'Classique — Storyboard' },
]

// ─── Cinema Categories ──────────────────────────────────────────────

export const CINEMA_CATEGORIES = [
  { id: 'posters', label: 'Affiches', icon: 'image', color: '#E50914', agent: 'cg-studio-poster' },
  { id: 'storyboards', label: 'Storyboards', icon: 'layout-grid', color: '#3B82F6', agent: 'cg-studio-storyboard' },
  { id: 'concept-art', label: 'Concept Art', icon: 'palette', color: '#8B5CF6', agent: 'cg-studio-concept' },
  { id: 'vfx-preview', label: 'VFX Preview', icon: 'sparkles', color: '#F97316', agent: 'cg-studio-vfx-prev' },
  { id: 'sets', label: 'Décors', icon: 'building', color: '#10B981', agent: 'cg-studio-decor' },
  { id: 'costumes', label: 'Costumes', icon: 'shirt', color: '#14B8A6', agent: 'cg-studio-costume' },
]

// ─── Trailer Styles ─────────────────────────────────────────────────

export const TRAILER_STYLES = [
  { id: 'blockbuster', label: 'Blockbuster', description: 'Action épique, explosions, musique héroïque' },
  { id: 'indie', label: 'Indie / Art', description: 'Atmosphérique, contemplatif, piano/guitare' },
  { id: 'horror', label: 'Horreur', description: 'Tension, jump scares, sons distordus' },
  { id: 'comedy', label: 'Comedy', description: 'Rythme rapide, gags visuels, musique entraînante' },
  { id: 'scifi', label: 'Sci-Fi', description: 'Futuriste, effets visuels, musique synthétique' },
  { id: 'romance', label: 'Romance', description: 'Doux, émotionnel, musique de cordes' },
]

// ─── Film Genres for Trailer/Poster Generator ───────────────────────

export const FILM_GENRES = [
  'Action', 'Aventure', 'Comedy', 'Drame', 'Fantasy', 'Horreur',
  'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentaire', 'Policier',
  'Western', 'Musical', 'Guerre', 'Historique',
]
