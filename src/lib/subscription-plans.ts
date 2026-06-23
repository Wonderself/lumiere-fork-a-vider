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

// Note: priceEur holds the price in USD ($). The field name is kept for
// backward compatibility with existing references.
export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    priceEur: 0,
    features: [
      '5 films / month',
      '720p streaming',
      'Watch & vote on every project',
      'Full Academy access',
    ],
    maxStreams: 5,
    maxQuality: '720p',
    offlineDownloads: 0,
    adFree: false,
  },
  BASIC: {
    id: 'BASIC',
    name: 'Basic',
    priceEur: 4.99,
    features: [
      'Unlimited streaming',
      '1080p, ad-free',
      'Subtitles + 5 downloads',
      '50 bonus Lumens / month',
      'Reduced marketplace fees',
    ],
    maxStreams: -1,
    maxQuality: '1080p',
    offlineDownloads: 5,
    adFree: true,
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    priceEur: 14.99,
    features: [
      'Everything in Basic',
      'Unlimited 4K + Dolby Atmos, ad-free',
      'Unlimited downloads',
      '200 bonus Lumens / month',
      '2× voting power on every vote',
      'Lowest deposit, withdrawal & marketplace fees',
      'Priority access to paid missions',
      'Extended AI video generation credits',
      'Advanced portfolio & earnings analytics',
      'Early access to new films & token offerings',
      'Premium badge + priority support',
    ],
    maxStreams: -1,
    maxQuality: '4K',
    offlineDownloads: -1,
    adFree: true,
  },
}
