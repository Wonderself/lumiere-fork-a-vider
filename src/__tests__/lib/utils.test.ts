import { describe, it, expect } from 'vitest'
import {
  slugify,
  formatPrice,
  getProgressColor,
  truncate,
  getInitials,
  getLevelColor,
  getDifficultyColor,
  getStatusColor,
} from '@/lib/utils'

describe('slugify', () => {
  it('converts basic text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes accents', () => {
    expect(slugify('Café du Cinéma')).toBe('cafe-du-cinema')
  })

  it('removes special characters', () => {
    expect(slugify('Film: The Movie!')).toBe('film-the-movie')
  })

  it('collapses multiple spaces and dashes', () => {
    expect(slugify('hello   world---test')).toBe('hello-world-test')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles numbers', () => {
    expect(slugify('Film 2026')).toBe('film-2026')
  })

  it('handles French titles', () => {
    expect(slugify("L'Étoile du Désert")).toBe('letoile-du-desert')
  })
})

describe('formatPrice', () => {
  it('formats round numbers', () => {
    const result = formatPrice(100)
    expect(result).toContain('100')
    expect(result).toContain('€')
  })

  it('formats decimal numbers', () => {
    const result = formatPrice(99.99)
    expect(result).toContain('99')
    expect(result).toContain('€')
  })

  it('formats zero', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formats large numbers', () => {
    const result = formatPrice(1000000)
    expect(result).toContain('€')
  })
})

describe('getProgressColor', () => {
  it('returns green for 100%', () => {
    expect(getProgressColor(100)).toBe('bg-green-500')
  })

  it('returns green for > 100%', () => {
    expect(getProgressColor(150)).toBe('bg-green-500')
  })

  it('returns blue for 75-99%', () => {
    expect(getProgressColor(75)).toBe('bg-blue-500')
    expect(getProgressColor(99)).toBe('bg-blue-500')
  })

  it('returns yellow for 50-74%', () => {
    expect(getProgressColor(50)).toBe('bg-yellow-500')
    expect(getProgressColor(74)).toBe('bg-yellow-500')
  })

  it('returns orange for 25-49%', () => {
    expect(getProgressColor(25)).toBe('bg-orange-500')
    expect(getProgressColor(49)).toBe('bg-orange-500')
  })

  it('returns red for < 25%', () => {
    expect(getProgressColor(0)).toBe('bg-red-500')
    expect(getProgressColor(24)).toBe('bg-red-500')
  })
})

describe('truncate', () => {
  it('returns text unchanged if shorter than max', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates with ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('returns text unchanged if exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('getInitials', () => {
  it('returns two initials for two-word name', () => {
    expect(getInitials('Jean Dupont')).toBe('JD')
  })

  it('returns two initials for three-word name', () => {
    expect(getInitials('Jean Pierre Dupont')).toBe('JP')
  })

  it('returns one initial for single name', () => {
    expect(getInitials('Jean')).toBe('J')
  })

  it('returns uppercase', () => {
    expect(getInitials('jean dupont')).toBe('JD')
  })
})

describe('getLevelColor', () => {
  it('returns correct colors for each level', () => {
    expect(getLevelColor('ROOKIE')).toBe('text-gray-400')
    expect(getLevelColor('PRO')).toBe('text-blue-400')
    expect(getLevelColor('EXPERT')).toBe('text-purple-400')
    expect(getLevelColor('VIP')).toBe('text-yellow-400')
  })

  it('returns gray for unknown level', () => {
    expect(getLevelColor('UNKNOWN')).toBe('text-gray-400')
  })
})

describe('getDifficultyColor', () => {
  it('returns correct colors', () => {
    expect(getDifficultyColor('EASY')).toBe('text-green-400')
    expect(getDifficultyColor('MEDIUM')).toBe('text-yellow-400')
    expect(getDifficultyColor('HARD')).toBe('text-orange-400')
    expect(getDifficultyColor('EXPERT')).toBe('text-red-400')
  })

  it('returns gray for unknown', () => {
    expect(getDifficultyColor('UNKNOWN')).toBe('text-gray-400')
  })
})

describe('getStatusColor', () => {
  it('returns green for AVAILABLE', () => {
    expect(getStatusColor('AVAILABLE')).toContain('green')
  })

  it('returns blue for CLAIMED', () => {
    expect(getStatusColor('CLAIMED')).toContain('blue')
  })

  it('returns yellow for review statuses', () => {
    expect(getStatusColor('SUBMITTED')).toContain('yellow')
    expect(getStatusColor('AI_REVIEW')).toContain('yellow')
    expect(getStatusColor('HUMAN_REVIEW')).toContain('yellow')
  })

  it('returns red for REJECTED', () => {
    expect(getStatusColor('REJECTED')).toContain('red')
  })

  it('returns gray for LOCKED', () => {
    expect(getStatusColor('LOCKED')).toContain('gray')
  })

  it('returns gray for unknown', () => {
    expect(getStatusColor('UNKNOWN')).toContain('gray')
  })
})
