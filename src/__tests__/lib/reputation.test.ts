import { describe, it, expect } from 'vitest'
import {
  calculateReputationScore,
  getBadgeForScore,
  REPUTATION_WEIGHTS,
  REPUTATION_BADGES,
} from '@/lib/reputation'

describe('calculateReputationScore', () => {
  it('returns 100 for perfect metrics', () => {
    const score = calculateReputationScore({
      deadlineRate: 100,
      acceptanceRate: 100,
      qualityScore: 100,
      collabReliability: 100,
      engagementScore: 100,
      seniorityDays: 365,
      taskCount: 50,
    })
    expect(score).toBe(100)
  })

  it('returns 0 for all-zero metrics', () => {
    const score = calculateReputationScore({
      deadlineRate: 0,
      acceptanceRate: 0,
      qualityScore: 0,
      collabReliability: 0,
      engagementScore: 0,
      seniorityDays: 0,
      taskCount: 0,
    })
    expect(score).toBe(0)
  })

  it('caps seniority at 365 days', () => {
    const score365 = calculateReputationScore({
      deadlineRate: 0, acceptanceRate: 0, qualityScore: 0,
      collabReliability: 0, engagementScore: 0,
      seniorityDays: 365, taskCount: 0,
    })
    const score730 = calculateReputationScore({
      deadlineRate: 0, acceptanceRate: 0, qualityScore: 0,
      collabReliability: 0, engagementScore: 0,
      seniorityDays: 730, taskCount: 0,
    })
    expect(score365).toBe(score730)
  })

  it('caps taskCount at 50', () => {
    const score50 = calculateReputationScore({
      deadlineRate: 0, acceptanceRate: 0, qualityScore: 0,
      collabReliability: 0, engagementScore: 0,
      seniorityDays: 0, taskCount: 50,
    })
    const score100 = calculateReputationScore({
      deadlineRate: 0, acceptanceRate: 0, qualityScore: 0,
      collabReliability: 0, engagementScore: 0,
      seniorityDays: 0, taskCount: 100,
    })
    expect(score50).toBe(score100)
  })

  it('applies correct weights', () => {
    // Only deadline at 100, rest 0
    const score = calculateReputationScore({
      deadlineRate: 100,
      acceptanceRate: 0,
      qualityScore: 0,
      collabReliability: 0,
      engagementScore: 0,
      seniorityDays: 0,
      taskCount: 0,
    })
    expect(score).toBe(REPUTATION_WEIGHTS.deadlines * 100)
  })

  it('returns number with max 1 decimal', () => {
    const score = calculateReputationScore({
      deadlineRate: 33,
      acceptanceRate: 67,
      qualityScore: 45,
      collabReliability: 89,
      engagementScore: 12,
      seniorityDays: 100,
      taskCount: 5,
    })
    const decimals = score.toString().split('.')[1]
    expect(!decimals || decimals.length <= 1).toBe(true)
  })
})

describe('getBadgeForScore', () => {
  it('returns bronze for score 0', () => {
    expect(getBadgeForScore(0).name).toBe('bronze')
  })

  it('returns silver for score 40', () => {
    expect(getBadgeForScore(40).name).toBe('silver')
  })

  it('returns gold for score 65', () => {
    expect(getBadgeForScore(65).name).toBe('gold')
  })

  it('returns platinum for score 85', () => {
    expect(getBadgeForScore(85).name).toBe('platinum')
  })

  it('returns platinum for score 100', () => {
    expect(getBadgeForScore(100).name).toBe('platinum')
  })

  it('returns bronze for score 39', () => {
    expect(getBadgeForScore(39).name).toBe('bronze')
  })

  it('returns gold for score 84', () => {
    expect(getBadgeForScore(84).name).toBe('gold')
  })
})

describe('REPUTATION_WEIGHTS', () => {
  it('sums to 1.0', () => {
    const total = Object.values(REPUTATION_WEIGHTS).reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(1.0)
  })
})

describe('REPUTATION_BADGES', () => {
  it('has 4 badges', () => {
    expect(REPUTATION_BADGES).toHaveLength(4)
  })

  it('badges are ordered by minScore ascending', () => {
    for (let i = 1; i < REPUTATION_BADGES.length; i++) {
      expect(REPUTATION_BADGES[i].minScore).toBeGreaterThan(REPUTATION_BADGES[i - 1].minScore)
    }
  })
})
