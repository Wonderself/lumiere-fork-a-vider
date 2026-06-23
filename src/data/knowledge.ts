/**
 * CineGeny Memory/RAG & Knowledge System
 * Semantic search, film memory, knowledge management.
 * 7 specialized agents.
 */

export interface KnowledgeAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string; tier: string
}

export const KNOWLEDGE_AGENTS: KnowledgeAgent[] = [
  { slug: 'cg-memory-manager', name: 'Memory Manager', role: 'Stockage & recherche vectorielle', description: 'Gère les embeddings vectoriels (pgvector), recherche sémantique par cosine similarity, indexation automatique du contenu.', icon: 'brain', color: '#8B5CF6', tier: 'L2' },
  { slug: 'cg-knowledge-auditor', name: 'Knowledge Auditor', role: 'Audit connaissances', description: 'Audite la base de connaissances : détecte les informations obsolètes, les contradictions, les lacunes à combler.', icon: 'shield-check', color: '#3B82F6', tier: 'L2' },
  { slug: 'cg-film-lore-keeper', name: 'Gardien du Lore', role: 'Film Memory / Bible', description: 'Maintient la bible de chaque film : personnages, lore, timeline, style visuel, contraintes. Garantit la cohérence de toute contribution IA.', icon: 'book-open', color: '#E50914', tier: 'L2' },
  { slug: 'cg-character-memory', name: 'Character Memory', role: 'Character consistency', description: 'Garde en mémoire chaque personnage : apparence, personnalité, voix, relations, arc narratif. Vérifie toute incohérence.', icon: 'user-circle', color: '#EC4899', tier: 'L1' },
  { slug: 'cg-style-guardian', name: 'Gardien du Style', role: 'Visual consistency', description: 'Préserve la cohérence visuelle du film : palette couleurs, éclairage, texture, direction artistique. Rejette les contributions hors-style.', icon: 'palette', color: '#F59E0B', tier: 'L1' },
  { slug: 'cg-context-builder', name: 'Constructeur Contexte', role: 'Enrichissement contexte', description: 'Construit dynamiquement le contexte optimal pour chaque requête IA en combinant mémoire long-terme + conversation + bible film.', icon: 'layers', color: '#10B981', tier: 'L1' },
  { slug: 'cg-embedding-engine', name: 'Moteur Embeddings', role: 'Vectorisation & indexation', description: 'Transforme le texte en vecteurs d\'embeddings pour la recherche sémantique. Gère l\'indexation, le batch processing et la fraîcheur.', icon: 'cpu', color: '#06B6D4', tier: 'L1' },
]

// ─── Film Memory Categories ─────────────────────────────────────────

export interface FilmMemoryCategory {
  id: string; label: string; icon: string; color: string
  description: string
  requiredFields: string[]
  examples: string[]
}

export const FILM_MEMORY_CATEGORIES: FilmMemoryCategory[] = [
  {
    id: 'characters', label: 'Personnages', icon: 'users', color: '#EC4899',
    description: 'Each character with their appearance, personality, narrative arc, relationships and voice.',
    requiredFields: ['Nom', 'Âge', 'Apparence physique', 'Personality', 'Backstory', 'Objectif', 'Voix/Ton', 'Relations'],
    examples: ['Marie, 32 ans, brune aux yeux verts, déterminée mais vulnérable, ex-journaliste reconvertie en détective privée'],
  },
  {
    id: 'world', label: 'Univers / Lore', icon: 'globe', color: '#3B82F6',
    description: 'The rules of the film\'s universe: era, place, technology, magic, society, history.',
    requiredFields: ['Époque', 'Lieu principal', 'Special rules', 'Contexte historique', 'État du monde'],
    examples: ['Paris 2045, post-climate-catastrophe, flooded zones, advanced technology but a fragmented society'],
  },
  {
    id: 'visual-style', label: 'Style Visuel', icon: 'palette', color: '#F59E0B',
    description: 'Art direction: color palette, lighting, texture, visual influences, overall mood.',
    requiredFields: ['Palette couleurs', 'Lighting style', 'Influences visuelles', 'Mood', 'Texture/Grain'],
    examples: ['Cool palette (blues/grays), high-contrast neon lighting, Blade Runner + Wong Kar-wai influence, 16mm grain'],
  },
  {
    id: 'timeline', label: 'Timeline', icon: 'clock', color: '#10B981',
    description: 'Timeline of the film\'s events: acts, sequences, turning points, flashbacks.',
    requiredFields: ['Structure', 'Points tournants', 'Timeline (linear/non-linear)', 'Narrative duration'],
    examples: ['Acte 1 (setup 25min) → Inciting incident → Acte 2 (confrontation 50min) → Midpoint → Acte 3 (résolution 20min)'],
  },
  {
    id: 'sound', label: 'Sound identity', icon: 'volume-2', color: '#8B5CF6',
    description: 'Paysage sonore : ambiances, musique, sound design, voix, silence comme outil narratif.',
    requiredFields: ['Genre musical', 'Instruments dominants', 'Key atmospheres', 'Utilisation du silence'],
    examples: ['Ambient synthwave, melancholic piano for intimate scenes, total silence before the reveals'],
  },
  {
    id: 'constraints', label: 'Contraintes', icon: 'alert-triangle', color: '#EF4444',
    description: 'What must NOT be done: world limits, inconsistencies to avoid, locked artistic choices.',
    requiredFields: ['Interdits narratifs', 'Limites du monde', 'Locked choices', 'Sensitivities'],
    examples: ['Pas de magie dans cet univers, le personnage principal ne tue jamais, pas de happy ending classique'],
  },
  {
    id: 'references', label: 'References', icon: 'bookmark', color: '#06B6D4',
    description: 'Films, books, artists and works used as references for tone, style or narration.',
    requiredFields: ['Reference films', 'Livres/BD', 'Artistes visuels', 'Reference music'],
    examples: ['Parasite (ton social), Her (relation homme-machine), Interstellar (scope visuel), Radiohead (ambiance sonore)'],
  },
  {
    id: 'production', label: 'Notes de Production', icon: 'clipboard', color: '#78716C',
    description: 'Technical constraints, budget, equipment, shooting locations, schedule.',
    requiredFields: ['Budget', 'Jours de tournage', 'Équipement', 'Lieux', 'Équipe'],
    examples: ['Budget $150K, 15 shooting days, RED Komodo, 3 studio sets + 2 Paris exteriors'],
  },
]

// ─── Embedding Config ───────────────────────────────────────────────

export const EMBEDDING_CONFIG = {
  model: 'text-embedding-3-small',    // OpenAI embedding model
  dimensions: 1536,                    // Vector dimensions
  chunkSize: 500,                      // Max chars per chunk
  chunkOverlap: 50,                    // Overlap between chunks
  similarityThreshold: 0.75,           // Min cosine similarity for matches
  maxResults: 10,                      // Max results per search
  ttlDays: 90,                         // Default TTL for memories
  batchSize: 100,                      // Batch processing size
}

// ─── Knowledge Types ────────────────────────────────────────────────

export type KnowledgeType = 'film_bible' | 'character' | 'scene' | 'dialogue' | 'visual_ref' | 'sound_ref' | 'constraint' | 'general'

export const KNOWLEDGE_TYPES: Record<KnowledgeType, { label: string; icon: string; color: string }> = {
  film_bible: { label: 'Bible Film', icon: 'book-open', color: '#E50914' },
  character: { label: 'Personnage', icon: 'user', color: '#EC4899' },
  scene: { label: 'Scene', icon: 'film', color: '#3B82F6' },
  dialogue: { label: 'Dialogue', icon: 'message-square', color: '#8B5CF6' },
  visual_ref: { label: 'Visual ref.', icon: 'image', color: '#F59E0B' },
  sound_ref: { label: 'Sound ref.', icon: 'volume-2', color: '#10B981' },
  constraint: { label: 'Contrainte', icon: 'alert-triangle', color: '#EF4444' },
  general: { label: 'General', icon: 'file-text', color: '#6B7280' },
}

// ─── Film Memory Explainer (for creators) ───────────────────────────

export const FILM_MEMORY_EXPLAINER = {
  title: 'Your Film\'s Memory',
  subtitle: 'Why it\'s essential for collaborative cinema',
  sections: [
    {
      title: '🧠 What is Film Memory?',
      content: 'Chaque film sur CineGeny a sa propre "memory" — une base de connaissances qui stocke tout ce qui définit votre film : personnages, univers, style visuel, timeline, contraintes. Cette mémoire est partagée avec tous les agents IA et contributeurs.',
    },
    {
      title: '🎯 Pourquoi c\'est crucial ?',
      content: 'Dans le cinéma participatif, plusieurs créateurs contribuent au même film. Sans mémoire partagée, chaque contribution risque d\'être incohérente. La mémoire film garantit que le scénariste IA, le concept artist et le compositeur travaillent tous dans le même univers.',
    },
    {
      title: '🤖 How does it work?',
      content: 'Quand vous remplissez la bible de votre film, chaque information est transformée en "embedding" (vecteur mathématique) et stockée. Quand un agent IA travaille sur votre film, il recherche automatiquement les informations pertinentes pour rester cohérent.',
    },
    {
      title: '✅ Que devez-vous faire ?',
      content: 'Remplissez les 8 catégories de mémoire le plus précisément possible. Plus la bible est riche, plus les contributions IA seront cohérentes et de qualité. Vous pouvez la mettre à jour à tout moment.',
    },
    {
      title: '🔒 Who has access?',
      content: 'Seuls les contributeurs invités et les agents IA de votre film ont accès à la mémoire. Elle est chiffrée et isolée des autres projets.',
    },
  ],
}
