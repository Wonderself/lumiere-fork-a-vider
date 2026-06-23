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
  { slug: 'cg-film-lore-keeper', name: 'Gardien du Lore', role: 'Mémoire film / Bible', description: 'Maintient la bible de chaque film : personnages, lore, timeline, style visuel, contraintes. Garantit la cohérence de toute contribution IA.', icon: 'book-open', color: '#E50914', tier: 'L2' },
  { slug: 'cg-character-memory', name: 'Mémoire Personnages', role: 'Cohérence personnages', description: 'Garde en mémoire chaque personnage : apparence, personnalité, voix, relations, arc narratif. Vérifie toute incohérence.', icon: 'user-circle', color: '#EC4899', tier: 'L1' },
  { slug: 'cg-style-guardian', name: 'Gardien du Style', role: 'Cohérence visuelle', description: 'Préserve la cohérence visuelle du film : palette couleurs, éclairage, texture, direction artistique. Rejette les contributions hors-style.', icon: 'palette', color: '#F59E0B', tier: 'L1' },
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
    description: 'Chaque personnage avec son apparence, sa personnalité, son arc narratif, ses relations et sa voix.',
    requiredFields: ['Nom', 'Âge', 'Apparence physique', 'Personnalité', 'Backstory', 'Objectif', 'Voix/Ton', 'Relations'],
    examples: ['Marie, 32 ans, brune aux yeux verts, déterminée mais vulnérable, ex-journaliste reconvertie en détective privée'],
  },
  {
    id: 'world', label: 'Univers / Lore', icon: 'globe', color: '#3B82F6',
    description: 'Les règles de l\'univers du film : époque, lieu, technologie, magie, société, histoire.',
    requiredFields: ['Époque', 'Lieu principal', 'Règles spéciales', 'Contexte historique', 'État du monde'],
    examples: ['Paris 2045, post-catastrophe climatique, zones inondées, technologie avancée mais société fragmentée'],
  },
  {
    id: 'visual-style', label: 'Style Visuel', icon: 'palette', color: '#F59E0B',
    description: 'Direction artistique : palette de couleurs, éclairage, texture, influences visuelles, mood global.',
    requiredFields: ['Palette couleurs', 'Style éclairage', 'Influences visuelles', 'Mood', 'Texture/Grain'],
    examples: ['Palette froide (bleus/gris), éclairage néon contrasté, influence Blade Runner + Wong Kar-wai, grain 16mm'],
  },
  {
    id: 'timeline', label: 'Timeline', icon: 'clock', color: '#10B981',
    description: 'Chronologie des événements du film : actes, séquences, points tournants, flashbacks.',
    requiredFields: ['Structure', 'Points tournants', 'Chronologie (linéaire/non-linéaire)', 'Durée narrative'],
    examples: ['Acte 1 (setup 25min) → Inciting incident → Acte 2 (confrontation 50min) → Midpoint → Acte 3 (résolution 20min)'],
  },
  {
    id: 'sound', label: 'Identité Sonore', icon: 'volume-2', color: '#8B5CF6',
    description: 'Paysage sonore : ambiances, musique, sound design, voix, silence comme outil narratif.',
    requiredFields: ['Genre musical', 'Instruments dominants', 'Ambiances clés', 'Utilisation du silence'],
    examples: ['Synthwave ambient, piano mélancolique pour les scènes intimes, silence total avant les révélations'],
  },
  {
    id: 'constraints', label: 'Contraintes', icon: 'alert-triangle', color: '#EF4444',
    description: 'Ce qui NE DOIT PAS être fait : limites du monde, incohérences à éviter, choix artistiques verrouillés.',
    requiredFields: ['Interdits narratifs', 'Limites du monde', 'Choix verrouillés', 'Sensibilités'],
    examples: ['Pas de magie dans cet univers, le personnage principal ne tue jamais, pas de happy ending classique'],
  },
  {
    id: 'references', label: 'Références', icon: 'bookmark', color: '#06B6D4',
    description: 'Films, livres, artistes, œuvres qui servent de référence pour le ton, le style ou la narration.',
    requiredFields: ['Films de référence', 'Livres/BD', 'Artistes visuels', 'Musique de référence'],
    examples: ['Parasite (ton social), Her (relation homme-machine), Interstellar (scope visuel), Radiohead (ambiance sonore)'],
  },
  {
    id: 'production', label: 'Notes de Production', icon: 'clipboard', color: '#78716C',
    description: 'Contraintes techniques, budget, équipement, lieux de tournage, planning.',
    requiredFields: ['Budget', 'Jours de tournage', 'Équipement', 'Lieux', 'Équipe'],
    examples: ['Budget 150K€, 15 jours de tournage, RED Komodo, 3 décors studio + 2 extérieurs Paris'],
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
  scene: { label: 'Scène', icon: 'film', color: '#3B82F6' },
  dialogue: { label: 'Dialogue', icon: 'message-square', color: '#8B5CF6' },
  visual_ref: { label: 'Réf. Visuelle', icon: 'image', color: '#F59E0B' },
  sound_ref: { label: 'Réf. Sonore', icon: 'volume-2', color: '#10B981' },
  constraint: { label: 'Contrainte', icon: 'alert-triangle', color: '#EF4444' },
  general: { label: 'General', icon: 'file-text', color: '#6B7280' },
}

// ─── Film Memory Explainer (for creators) ───────────────────────────

export const FILM_MEMORY_EXPLAINER = {
  title: 'La Mémoire de Votre Film',
  subtitle: 'Pourquoi c\'est essentiel pour le cinéma participatif',
  sections: [
    {
      title: '🧠 Qu\'est-ce que la Mémoire Film ?',
      content: 'Chaque film sur CineGeny a sa propre "mémoire" — une base de connaissances qui stocke tout ce qui définit votre film : personnages, univers, style visuel, timeline, contraintes. Cette mémoire est partagée avec tous les agents IA et contributeurs.',
    },
    {
      title: '🎯 Pourquoi c\'est crucial ?',
      content: 'Dans le cinéma participatif, plusieurs créateurs contribuent au même film. Sans mémoire partagée, chaque contribution risque d\'être incohérente. La mémoire film garantit que le scénariste IA, le concept artist et le compositeur travaillent tous dans le même univers.',
    },
    {
      title: '🤖 Comment ça fonctionne ?',
      content: 'Quand vous remplissez la bible de votre film, chaque information est transformée en "embedding" (vecteur mathématique) et stockée. Quand un agent IA travaille sur votre film, il recherche automatiquement les informations pertinentes pour rester cohérent.',
    },
    {
      title: '✅ Que devez-vous faire ?',
      content: 'Remplissez les 8 catégories de mémoire le plus précisément possible. Plus la bible est riche, plus les contributions IA seront cohérentes et de qualité. Vous pouvez la mettre à jour à tout moment.',
    },
    {
      title: '🔒 Qui y a accès ?',
      content: 'Seuls les contributeurs invités et les agents IA de votre film ont accès à la mémoire. Elle est chiffrée et isolée des autres projets.',
    },
  ],
}
