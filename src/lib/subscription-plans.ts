/**
 * Subscription plan configurations.
 * Extracted from server actions because "use server" files
 * can only export async functions (not objects/constants).
 */

export type PlanConfig = {
  id: string
  name: string
  priceEur: number
  features: string[]
  maxStreams: number
  maxQuality: '720p' | '1080p' | '4K'
  offlineDownloads: number
  adFree: boolean
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Gratuit',
    priceEur: 0,
    features: ['5 films/mois', '720p', 'Publicités'],
    maxStreams: 5,
    maxQuality: '720p',
    offlineDownloads: 0,
    adFree: false,
  },
  BASIC: {
    id: 'BASIC',
    name: 'Basic',
    priceEur: 4.99,
    features: ['Illimité', '1080p', 'Sans pubs', 'Sous-titres', '5 downloads'],
    maxStreams: -1,
    maxQuality: '1080p',
    offlineDownloads: 5,
    adFree: true,
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    priceEur: 9.99,
    features: ['Illimité', '4K', 'Sans pubs', 'Dolby Atmos', 'Downloads illimités'],
    maxStreams: -1,
    maxQuality: '4K',
    offlineDownloads: -1,
    adFree: true,
  },
}
