/**
 * CineGeny Memory/RAG Service
 * Embedding storage, semantic search, film knowledge management.
 * Uses pgvector for production (simulated here).
 */

import { prisma } from '@/lib/prisma'
import { EMBEDDING_CONFIG } from '@/data/knowledge'
import type { KnowledgeType } from '@/data/knowledge'

// ─── Types ──────────────────────────────────────────────────────────

export interface MemoryEntry {
  id: string
  filmProjectId: string | null
  type: KnowledgeType
  content: string
  tags: string[]
  source: string
  embedding?: number[]    // Vector (simulated)
  similarity?: number     // Cosine similarity score
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult {
  entry: MemoryEntry
  score: number
  matchType: 'semantic' | 'textual'
}

export interface FilmKnowledge {
  filmProjectId: string
  filmTitle: string
  categories: Record<string, MemoryEntry[]>
  totalEntries: number
  completeness: number    // 0-100
  lastUpdated: Date | null
}

// ─── In-Memory Store (prod: pgvector) ───────────────────────────────

const memoryStore: MemoryEntry[] = []

// ─── Embedding (simulated) ──────────────────────────────────────────

function simpleHash(text: string): number[] {
  const vec = new Array(64).fill(0)
  for (let i = 0; i < text.length; i++) {
    vec[i % 64] += text.charCodeAt(i) / 255
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map(v => v / mag)
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1)
}

// ─── Core Operations ────────────────────────────────────────────────

/** Store a memory entry with embedding */
export function storeMemory(entry: Omit<MemoryEntry, 'id' | 'embedding' | 'createdAt' | 'updatedAt'>): MemoryEntry {
  const embedding = simpleHash(entry.content)
  const memory: MemoryEntry = {
    ...entry,
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  memoryStore.push(memory)
  return memory
}

/** Semantic search across memories */
export function searchMemory(query: string, filters?: {
  filmProjectId?: string
  type?: KnowledgeType
  tags?: string[]
  limit?: number
}): SearchResult[] {
  const queryEmbedding = simpleHash(query)
  const limit = filters?.limit ?? EMBEDDING_CONFIG.maxResults

  let candidates = [...memoryStore]

  // Filter
  if (filters?.filmProjectId) candidates = candidates.filter(m => m.filmProjectId === filters.filmProjectId)
  if (filters?.type) candidates = candidates.filter(m => m.type === filters.type)
  if (filters?.tags?.length) candidates = candidates.filter(m => filters.tags!.some(t => m.tags.includes(t)))

  // Remove expired
  const now = new Date()
  candidates = candidates.filter(m => !m.expiresAt || m.expiresAt > now)

  // Score by semantic similarity
  const scored: SearchResult[] = candidates
    .map(entry => {
      const score = entry.embedding ? cosineSimilarity(queryEmbedding, entry.embedding) : 0
      return { entry, score, matchType: 'semantic' as const }
    })
    .filter(r => r.score >= EMBEDDING_CONFIG.similarityThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  // Fallback to textual search if few results
  if (scored.length < 3) {
    const queryLower = query.toLowerCase()
    const textMatches = candidates
      .filter(m => m.content.toLowerCase().includes(queryLower) && !scored.find(s => s.entry.id === m.id))
      .map(entry => ({ entry, score: 0.5, matchType: 'textual' as const }))
      .slice(0, limit - scored.length)
    scored.push(...textMatches)
  }

  return scored
}

/** Get all memories for a film project */
export function getFilmMemories(filmProjectId: string): MemoryEntry[] {
  return memoryStore
    .filter(m => m.filmProjectId === filmProjectId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

/** Get film knowledge overview */
export function getFilmKnowledge(filmProjectId: string, filmTitle: string): FilmKnowledge {
  const entries = getFilmMemories(filmProjectId)
  const categories: Record<string, MemoryEntry[]> = {}
  for (const entry of entries) {
    if (!categories[entry.type]) categories[entry.type] = []
    categories[entry.type].push(entry)
  }

  const totalCategories = 8
  const filledCategories = Object.keys(categories).length
  const completeness = Math.round((filledCategories / totalCategories) * 100)

  return {
    filmProjectId,
    filmTitle,
    categories,
    totalEntries: entries.length,
    completeness,
    lastUpdated: entries.length > 0 ? entries[0].updatedAt : null,
  }
}

/** Delete a memory entry */
export function deleteMemory(id: string): boolean {
  const idx = memoryStore.findIndex(m => m.id === id)
  if (idx === -1) return false
  memoryStore.splice(idx, 1)
  return true
}

/** Update a memory entry */
export function updateMemory(id: string, content: string, tags?: string[]): MemoryEntry | null {
  const entry = memoryStore.find(m => m.id === id)
  if (!entry) return null
  entry.content = content
  entry.embedding = simpleHash(content)
  if (tags) entry.tags = tags
  entry.updatedAt = new Date()
  return entry
}

/** Build context for an AI request about a film */
export function buildFilmContext(filmProjectId: string, query: string, maxChars: number = 4000): string {
  // Get relevant memories for this film
  const results = searchMemory(query, { filmProjectId, limit: 10 })

  const parts: string[] = [
    '=== FILM KNOWLEDGE BASE ===',
    '',
  ]

  let totalChars = 0
  for (const result of results) {
    const chunk = `[${result.entry.type}] ${result.entry.content}`
    if (totalChars + chunk.length > maxChars) break
    parts.push(chunk)
    totalChars += chunk.length
  }

  if (parts.length <= 2) {
    parts.push('[No relevant knowledge found for this query. The AI will work without film-specific context.]')
  }

  parts.push('', '=== END KNOWLEDGE BASE ===')
  return parts.join('\n')
}

/** Get memory stats */
export function getMemoryStats(): {
  totalEntries: number
  byType: Record<string, number>
  byFilm: Record<string, number>
  avgEmbeddingSize: number
  oldestEntry: Date | null
} {
  const byType: Record<string, number> = {}
  const byFilm: Record<string, number> = {}
  for (const m of memoryStore) {
    byType[m.type] = (byType[m.type] || 0) + 1
    const filmKey = m.filmProjectId || 'global'
    byFilm[filmKey] = (byFilm[filmKey] || 0) + 1
  }
  return {
    totalEntries: memoryStore.length,
    byType,
    byFilm,
    avgEmbeddingSize: EMBEDDING_CONFIG.dimensions,
    oldestEntry: memoryStore.length > 0 ? memoryStore[0].createdAt : null,
  }
}
