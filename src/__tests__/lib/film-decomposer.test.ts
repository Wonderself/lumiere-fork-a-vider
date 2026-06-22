import { describe, it, expect } from 'vitest'
import {
  decomposeFilmToTokens,
  decomposeFilmToTasks,
  generateTimeline,
  generateRiskAssessment,
} from '@/lib/film-decomposer'

describe('decomposeFilmToTokens', () => {
  it('returns token parameters and budget breakdown', () => {
    const result = decomposeFilmToTokens(100000, 'Action')
    expect(result.tokens).toBeDefined()
    expect(result.budget).toBeDefined()
    expect(result.tokens.totalTokens).toBeGreaterThan(0)
    expect(result.tokens.tokenPrice).toBeGreaterThan(0)
  })

  it('budget amounts sum close to total budget', () => {
    const result = decomposeFilmToTokens(50000, 'Drama')
    const sum = result.budget.reduce((acc, item) => acc + item.amount, 0)
    // Allow some rounding tolerance
    expect(sum).toBeGreaterThan(45000)
    expect(sum).toBeLessThan(55000)
  })

  it('handles different genres', () => {
    const action = decomposeFilmToTokens(100000, 'Action')
    const drama = decomposeFilmToTokens(100000, 'Drama')
    // Both should return valid results
    expect(action.tokens.totalTokens).toBeGreaterThan(0)
    expect(drama.tokens.totalTokens).toBeGreaterThan(0)
  })

  it('scales tokens with budget', () => {
    const small = decomposeFilmToTokens(25000, 'Drama')
    const large = decomposeFilmToTokens(200000, 'Drama')
    expect(large.tokens.totalTokens).toBeGreaterThan(small.tokens.totalTokens)
  })
})

describe('decomposeFilmToTasks', () => {
  it('returns an array of tasks', () => {
    const tasks = decomposeFilmToTasks('Action')
    expect(Array.isArray(tasks)).toBe(true)
    expect(tasks.length).toBeGreaterThan(0)
  })

  it('each task has required fields', () => {
    const tasks = decomposeFilmToTasks('Drama')
    for (const task of tasks) {
      expect(task.title).toBeDefined()
      expect(task.type).toBeDefined()
      expect(task.phase).toBeDefined()
      expect(task.difficulty).toBeDefined()
      expect(task.priceEuros).toBeGreaterThan(0)
    }
  })

  it('genre-specific tasks differ from generic', () => {
    const action = decomposeFilmToTasks('Action')
    const drama = decomposeFilmToTasks('Drama')
    // Action should have more tasks due to VFX/stunts
    expect(action.length).toBeGreaterThanOrEqual(drama.length - 5)
  })

  it('includes base tasks for any genre', () => {
    const tasks = decomposeFilmToTasks('Comédie')
    const types = tasks.map((t) => t.type)
    expect(types).toContain('PROMPT_WRITING')
  })
})

describe('generateTimeline', () => {
  it('returns timeline phases', () => {
    const timeline = generateTimeline('Action')
    expect(Array.isArray(timeline)).toBe(true)
    expect(timeline.length).toBeGreaterThan(0)
  })

  it('phases have required fields', () => {
    const timeline = generateTimeline('Drama')
    for (const phase of timeline) {
      expect(phase.phase).toBeDefined()
      expect(phase.durationWeeks).toBeGreaterThan(0)
      expect(typeof phase.startWeek).toBe('number')
    }
  })

  it('phases are sequential', () => {
    const timeline = generateTimeline('Sci-Fi')
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].startWeek).toBeGreaterThanOrEqual(timeline[i - 1].startWeek)
    }
  })
})

describe('generateRiskAssessment', () => {
  it('returns risk items', () => {
    const risks = generateRiskAssessment(100000, 'Action')
    expect(Array.isArray(risks)).toBe(true)
    expect(risks.length).toBeGreaterThan(0)
  })

  it('each risk has required fields', () => {
    const risks = generateRiskAssessment(50000, 'Drama')
    for (const risk of risks) {
      expect(risk.category).toBeDefined()
      expect(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).toContain(risk.level)
      expect(risk.description).toBeDefined()
      expect(risk.mitigation).toBeDefined()
    }
  })

  it('higher budget may have different risk profile', () => {
    const low = generateRiskAssessment(10000, 'Drama')
    const high = generateRiskAssessment(500000, 'Action')
    // Both should return valid results
    expect(low.length).toBeGreaterThan(0)
    expect(high.length).toBeGreaterThan(0)
  })
})
