'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'cinegen-create-progress'
const ACTIVE_FILM_KEY = 'cinegen-active-film'

/**
 * Hook to manage film creation progress across steps.
 * Supports multi-film projects — each film has its own progress.
 * Falls back to a global progress if no active film is set.
 */
export function useCreateProgress() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [activeFilmId, setActiveFilmId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Build the storage key for the current film
  const getStorageKey = useCallback((filmId?: string | null) => {
    const fid = filmId ?? activeFilmId
    return fid ? `${STORAGE_KEY}-${fid}` : STORAGE_KEY
  }, [activeFilmId])

  useEffect(() => {
    try {
      // Load active film ID
      const savedFilmId = localStorage.getItem(ACTIVE_FILM_KEY)
      if (savedFilmId) {
        setActiveFilmId(savedFilmId)
      }

      // Load progress for active film (or global)
      const key = savedFilmId ? `${STORAGE_KEY}-${savedFilmId}` : STORAGE_KEY
      const saved = localStorage.getItem(key)
      if (saved) {
        setCompletedSteps(JSON.parse(saved))
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true)
  }, [])

  // Switch to a different film project
  const switchFilm = useCallback((filmId: string | null) => {
    setActiveFilmId(filmId)
    try {
      if (filmId) {
        localStorage.setItem(ACTIVE_FILM_KEY, filmId)
      } else {
        localStorage.removeItem(ACTIVE_FILM_KEY)
      }
      const key = filmId ? `${STORAGE_KEY}-${filmId}` : STORAGE_KEY
      const saved = localStorage.getItem(key)
      setCompletedSteps(saved ? JSON.parse(saved) : [])
    } catch {
      setCompletedSteps([])
    }
  }, [])

  const markComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepId)) return prev
      const next = [...prev, stepId]
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(next))
      } catch {
        // Ignore storage errors
      }
      return next
    })
  }, [getStorageKey])

  const isStepUnlocked = useCallback((stepId: string, steps: { id: string }[]) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId)
    if (stepIndex === 0) return true
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(steps[i].id)) return false
    }
    return true
  }, [completedSteps])

  const resetProgress = useCallback(() => {
    setCompletedSteps([])
    try {
      localStorage.removeItem(getStorageKey())
    } catch {
      // Ignore
    }
  }, [getStorageKey])

  return {
    completedSteps,
    markComplete,
    isStepUnlocked,
    resetProgress,
    loaded,
    activeFilmId,
    switchFilm,
  }
}
