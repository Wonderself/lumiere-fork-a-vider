/**
 * CineGeny Memory/RAG & Knowledge System
 * Semantic search, film memory, knowledge management.
 * 7 specialized agents.
 */

export interface KnowledgeAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string; tier: string
}

export const KNOWLEDGE_AGENTS: KnowledgeAgent[] = [
  { slug: 'cg-memory-manager', name: 'Memory Manager', role: 'Stockage & recherche vectorielle', description: 'Manages vector embeddings (pgvector), semantic search via cosine similarity, and automatic content indexing.', icon: 'brain', color: '#8B5CF6', tier: 'L2' },
  { slug: 'cg-knowledge-auditor', name: 'Knowledge Auditor', role: 'Audit connaissances', description: 'Audits the knowledge base: detects outdated information, contradictions, and gaps to fill.', icon: 'shield-check', color: '#3B82F6', tier: 'L2' },
  { slug: 'cg-film-lore-keeper', name: 'Gardien du Lore', role: 'Film Memory / Bible', description: 'Maintains each film\'s bible: characters, lore, timeline, visual style, constraints. Ensures the consistency of every AI contribution.', icon: 'book-open', color: '#E50914', tier: 'L2' },
  { slug: 'cg-character-memory', name: 'Character Memory', role: 'Character consistency', description: 'Remembers every character: appearance, personality, voice, relationships, narrative arc. Checks for any inconsistency.', icon: 'user-circle', color: '#EC4899', tier: 'L1' },
  { slug: 'cg-style-guardian', name: 'Gardien du Style', role: 'Visual consistency', description: 'Preserves the film\'s visual consistency: color palette, lighting, texture, art direction. Rejects off-style contributions.', icon: 'palette', color: '#F59E0B', tier: 'L1' },
  { slug: 'cg-context-builder', name: 'Constructeur Contexte', role: 'Enrichissement contexte', description: 'Dynamically builds the optimal context for each AI request by combining long-term memory + conversation + film bible.', icon: 'layers', color: '#10B981', tier: 'L1' },
  { slug: 'cg-embedding-engine', name: 'Moteur Embeddings', role: 'Vectorisation & indexation', description: 'Turns text into embedding vectors for semantic search. Handles indexing, batch processing and freshness.', icon: 'cpu', color: '#06B6D4', tier: 'L1' },
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
    requiredFields: ['Nom', 'Age', 'Apparence physique', 'Personality', 'Backstory', 'Objectif', 'Voix/Ton', 'Relations'],
    examples: ['Marie, 32, brown hair and green eyes, determined yet vulnerable, a former journalist turned private detective'],
  },
  {
    id: 'world', label: 'Univers / Lore', icon: 'globe', color: '#3B82F6',
    description: 'The rules of the film\'s universe: era, place, technology, magic, society, history.',
    requiredFields: ['Era', 'Lieu principal', 'Special rules', 'Contexte historique', 'World state'],
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
    examples: ['Act 1 (setup 25min) → Inciting incident → Act 2 (confrontation 50min) → Midpoint → Act 3 (resolution 20min)'],
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
    requiredFields: ['Budget', 'Jours de tournage', 'Equipment', 'Lieux', 'Team'],
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
      content: 'Every film on CineGeny has its own "memory" — a knowledge base that stores everything defining your film: characters, world, visual style, timeline, constraints. This memory is shared with all AI agents and contributors.',
    },
    {
      title: '🎯 Pourquoi c\'est crucial ?',
      content: 'In collaborative cinema, several creators contribute to the same film. Without shared memory, each contribution risks being inconsistent. Film memory ensures the AI screenwriter, concept artist and composer all work within the same world.',
    },
    {
      title: '🤖 How does it work?',
      content: 'When you fill in your film\'s bible, each piece of information is turned into an "embedding" (mathematical vector) and stored. When an AI agent works on your film, it automatically retrieves the relevant information to stay consistent.',
    },
    {
      title: '✅ Que devez-vous faire ?',
      content: 'Fill in the 8 memory categories as precisely as possible. The richer the bible, the more consistent and higher-quality the AI contributions. You can update it at any time.',
    },
    {
      title: '🔒 Who has access?',
      content: 'Only invited contributors and your film\'s AI agents can access the memory. It is encrypted and isolated from other projects.',
    },
  ],
}
