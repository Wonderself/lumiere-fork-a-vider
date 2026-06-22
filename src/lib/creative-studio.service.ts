/**
 * CineGeny Creative Studio Service
 * Photo & video generation with gallery management.
 */

import { PHOTO_STYLES, PHOTO_RATIOS, STUDIO_AGENTS, TRAILER_STYLES } from '@/data/studio-agents'

// ─── Types ──────────────────────────────────────────────────────────

export interface PhotoGenRequest {
  prompt: string
  style: string
  ratio: string
  hdMode: boolean
  category: string
  agentSlug?: string
  faceImageUrl?: string    // For face insertion
}

export interface VideoGenRequest {
  prompt: string
  duration: 5 | 10 | 15
  style?: string
  inputImageUrl?: string   // Image-to-video
  faceImageUrl?: string    // Talking head / face insert
}

export interface TrailerGenRequest {
  filmTitle: string
  genre: string
  synopsis: string
  style: string            // blockbuster, indie, horror, etc.
  faceImageUrl?: string    // Insert user's face as protagonist
  duration: 15 | 30 | 60
}

export interface PosterGenRequest {
  filmTitle: string
  genre: string
  tagline: string
  style: string
  faceImageUrl?: string    // Insert user's face
  ratio: '9:16' | '2:3' | '1:1'
}

export interface GeneratedMedia {
  id: string
  type: 'photo' | 'video' | 'trailer' | 'poster'
  prompt: string
  url: string
  thumbnailUrl?: string
  style: string
  category: string
  agentSlug: string
  metadata: Record<string, unknown>
  createdAt: Date
}

export interface AgentQueueItem {
  id: string
  agentSlug: string
  agentName: string
  request: string
  priority: 'normal' | 'high' | 'urgent'
  status: 'queued' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  estimatedCredits: number
}

// ─── Photo Generation ───────────────────────────────────────────────

/**
 * Generate a photo via fal.ai (FLUX/Schnell).
 * In production: POST to fal.ai API with the prompt + style suffix.
 */
export async function generatePhoto(request: PhotoGenRequest): Promise<GeneratedMedia> {
  const style = PHOTO_STYLES.find(s => s.id === request.style) || PHOTO_STYLES[0]
  const ratio = PHOTO_RATIOS.find(r => r.id === request.ratio) || PHOTO_RATIOS[0]

  const fullPrompt = `${request.prompt}. ${style.prompt_suffix}`
  const agent = STUDIO_AGENTS.find(a => a.slug === request.agentSlug) || STUDIO_AGENTS[0]

  // Simulate generation (in production: call fal.ai FLUX API)
  await new Promise(r => setTimeout(r, 2000))

  // Placeholder URLs by category
  const placeholderUrls: Record<string, string> = {
    posters: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    storyboards: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    'concept-art': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    'vfx-preview': 'https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&w=800&q=80',
    sets: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    costumes: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  }

  return {
    id: `photo-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    type: 'photo',
    prompt: request.prompt,
    url: placeholderUrls[request.category] || placeholderUrls.posters,
    style: request.style,
    category: request.category,
    agentSlug: agent.slug,
    metadata: {
      width: ratio.w * (request.hdMode ? 1.5 : 1),
      height: ratio.h * (request.hdMode ? 1.5 : 1),
      hdMode: request.hdMode,
      faceInsert: !!request.faceImageUrl,
    },
    createdAt: new Date(),
  }
}

// ─── Video Generation ───────────────────────────────────────────────

/**
 * Generate a video via fal.ai LTX Video.
 * In production: submit job → poll status → get result URL.
 */
export async function generateVideo(request: VideoGenRequest): Promise<GeneratedMedia> {
  // Simulate async polling
  await new Promise(r => setTimeout(r, request.duration * 500))

  return {
    id: `video-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    type: 'video',
    prompt: request.prompt,
    url: '#video-placeholder',
    thumbnailUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&q=80',
    style: request.style || 'cinematic',
    category: 'video',
    agentSlug: 'cg-studio-trailer',
    metadata: {
      duration: request.duration,
      faceInsert: !!request.faceImageUrl,
      inputImage: !!request.inputImageUrl,
    },
    createdAt: new Date(),
  }
}

// ─── Trailer Generation ─────────────────────────────────────────────

/**
 * Generate a film trailer from an invented concept.
 * Multi-step: generate concept → scenes → assemble.
 */
export async function generateTrailer(request: TrailerGenRequest): Promise<{
  filmTitle: string
  synopsis: string
  style: string
  scenes: Array<{ description: string; imageUrl: string }>
  trailerUrl: string
  posterUrl: string
}> {
  // Simulate multi-step generation
  await new Promise(r => setTimeout(r, 5000))

  const scenes = [
    { description: `Opening: ${request.genre} ambiance establishing shot`, imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80' },
    { description: 'Character introduction scene', imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80' },
    { description: 'Conflict/tension build-up', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80' },
    { description: 'Climax moment', imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80' },
    { description: 'Title card reveal', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80' },
  ]

  return {
    filmTitle: request.filmTitle,
    synopsis: request.synopsis,
    style: request.style,
    scenes,
    trailerUrl: '#trailer-placeholder',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
  }
}

// ─── Poster Generation ──────────────────────────────────────────────

/**
 * Generate a film poster with optional face insertion.
 */
export async function generatePoster(request: PosterGenRequest): Promise<GeneratedMedia> {
  await new Promise(r => setTimeout(r, 3000))

  return {
    id: `poster-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    type: 'poster',
    prompt: `Film poster for "${request.filmTitle}" - ${request.genre} - ${request.tagline}`,
    url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    style: request.style,
    category: 'posters',
    agentSlug: 'cg-studio-poster',
    metadata: {
      filmTitle: request.filmTitle,
      genre: request.genre,
      tagline: request.tagline,
      faceInsert: !!request.faceImageUrl,
      ratio: request.ratio,
    },
    createdAt: new Date(),
  }
}

// ─── Agent Queue ────────────────────────────────────────────────────

const agentQueue: AgentQueueItem[] = []

export function addToQueue(item: Omit<AgentQueueItem, 'id' | 'createdAt' | 'status'>): AgentQueueItem {
  const queueItem: AgentQueueItem = {
    ...item,
    id: `q-${Date.now()}`,
    status: 'queued',
    createdAt: new Date(),
  }
  agentQueue.push(queueItem)
  return queueItem
}

export function getQueue(): AgentQueueItem[] {
  return [...agentQueue].reverse()
}

export function getQueueByAgent(agentSlug: string): AgentQueueItem[] {
  return agentQueue.filter(q => q.agentSlug === agentSlug).reverse()
}
