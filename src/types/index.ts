import type { User, Film, Task, TaskSubmission, FilmPhase } from '@prisma/client'

export type { User, Film, Task, TaskSubmission, FilmPhase }

export type UserWithStats = User & {
  _count?: {
    claimedTasks: number
    submissions: number
    achievements: number
  }
}

export type FilmWithPhases = Film & {
  phases: FilmPhase[]
  _count?: {
    tasks: number
    votes: number
    backers: number
  }
}

export type TaskWithRelations = Task & {
  film: Pick<Film, 'id' | 'title' | 'slug'>
  phase: Pick<FilmPhase, 'id' | 'phaseName'>
  claimedBy?: Pick<User, 'id' | 'displayName' | 'avatarUrl'> | null
}

export type SubmissionWithRelations = TaskSubmission & {
  task: Pick<Task, 'id' | 'title' | 'priceEuros'>
  user: Pick<User, 'id' | 'displayName' | 'avatarUrl'>
}

export type RoadmapItem = {
  id: string
  phase: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  status: 'todo' | 'in_progress' | 'done'
  category: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      level: string
      isVerified: boolean
    }
  }

  interface User {
    role?: string
    level?: string
    isVerified?: boolean
  }
}

// JWT types are inferred from the next-auth callbacks in auth.ts
// No module augmentation needed — token fields accessed via (token as Record<string, unknown>)
