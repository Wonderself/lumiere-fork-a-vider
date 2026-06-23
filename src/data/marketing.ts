/**
 * CineGeny Marketing & Social Media
 * 7 agents, multi-platform posting, campaign management.
 */

// ─── 7 Marketing Agents ────────────────────────────────────────────

export interface MarketingAgent {
  slug: string
  name: string
  role: string
  description: string
  icon: string
  color: string
  platforms: string[]
}

export const MARKETING_AGENTS: MarketingAgent[] = [
  {
    slug: 'cg-social-strategist',
    name: 'Social strategist',
    role: 'Social media strategy',
    description: 'Defines the overall social media strategy. Editorial calendar, KPIs, audience growth, brand positioning.',
    icon: 'target',
    color: '#E50914',
    platforms: ['all'],
  },
  {
    slug: 'cg-copywriter',
    name: 'Cinema copywriter',
    role: 'Post & caption writing',
    description: 'Writes punchy posts tailored to each network. Tone, length and hashtags optimized per platform.',
    icon: 'pen-tool',
    color: '#3B82F6',
    platforms: ['twitter', 'linkedin', 'instagram', 'facebook'],
  },
  {
    slug: 'cg-hashtag-expert',
    name: 'Expert Hashtags',
    role: 'Hashtags & SEO social',
    description: 'Generates the best-performing film hashtags. Analyzes trends, niches and potential reach.',
    icon: 'hash',
    color: '#8B5CF6',
    platforms: ['twitter', 'instagram'],
  },
  {
    slug: 'cg-campaign-manager',
    name: 'Campaign Manager',
    role: 'Gestion campagnes',
    description: 'Orchestre les campagnes marketing multi-canal. Budget, planning, workflow d\'approbation, mesure ROI.',
    icon: 'megaphone',
    color: '#10B981',
    platforms: ['all'],
  },
  {
    slug: 'cg-email-marketer',
    name: 'Email Marketer',
    role: 'Email & Newsletter',
    description: 'Writes marketing emails, newsletters and onboarding sequences. A/B testing, segmentation, open rates.',
    icon: 'mail',
    color: '#F59E0B',
    platforms: ['email'],
  },
  {
    slug: 'cg-landing-designer',
    name: 'Landing Page Designer',
    role: 'Pages promotionnelles',
    description: 'Designs promotional landing pages for films. Copywriting, CTA, conversion structure.',
    icon: 'layout',
    color: '#EC4899',
    platforms: ['web'],
  },
  {
    slug: 'cg-community-growth',
    name: 'Growth Hacker',
    role: 'Community growth',
    description: 'Acquisition and engagement strategies. Viral loops, referral programs, film influencers.',
    icon: 'trending-up',
    color: '#06B6D4',
    platforms: ['all'],
  },
]

// ─── Social Platforms ───────────────────────────────────────────────

export interface SocialPlatform {
  id: string
  name: string
  icon: string
  color: string
  maxLength: number
  features: string[]
  toneGuide: string
  hashtagStyle: 'inline' | 'block' | 'none'
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'twitter', name: 'Twitter / X', icon: 'twitter', color: '#1DA1F2', maxLength: 280, features: ['threads', 'polls', 'spaces'], toneGuide: 'Concis, punchy, conversationnel. Emojis ok. Hashtags 2-3 max inline.', hashtagStyle: 'inline' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2', maxLength: 3000, features: ['articles', 'carousels', 'newsletters'], toneGuide: 'Professionnel, storytelling, insights industrie. Hashtags en fin de post.', hashtagStyle: 'block' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F', maxLength: 2200, features: ['stories', 'reels', 'carousels'], toneGuide: 'Visual first, emotional caption. Block of 15-30 hashtags in a comment.', hashtagStyle: 'block' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2', maxLength: 5000, features: ['events', 'groups', 'live'], toneGuide: 'Community, events, sharing. 1-2 hashtags max.', hashtagStyle: 'inline' },
]

// ─── Cinema Hashtags ────────────────────────────────────────────────

export const CINEMA_HASHTAGS = {
  general: ['#cinema', '#film', '#movie', '#cinephile', '#filmmaking', '#filmmaker'],
  genre: {
    action: ['#actionmovie', '#stunts', '#adrenaline'],
    comedy: ['#comedy', '#funny', '#laughs'],
    drama: ['#drama', '#storytelling', '#emotions'],
    horror: ['#horror', '#scary', '#horrormovie'],
    scifi: ['#scifi', '#sciencefiction', '#futuristic'],
    thriller: ['#thriller', '#suspense', '#mystery'],
    documentary: ['#documentary', '#docfilm', '#realstories'],
    animation: ['#animation', '#animated', '#cartoon'],
  },
  platform: ['#CineGeny', '#CinemaParticipatif', '#AIcinema', '#filmIA'],
  trending: ['#newfilm', '#mustwatch', '#movienight', '#filmreview'],
}

// ─── Post Templates ─────────────────────────────────────────────────

export interface PostTemplate {
  id: string
  name: string
  category: string
  platforms: string[]
  template: string
  variables: string[]
}

export const POST_TEMPLATES: PostTemplate[] = [
  { id: 'film-launch', name: 'Lancement de film', category: 'launch', platforms: ['all'], template: '🎬 {filmTitle} est maintenant disponible sur CineGeny !\n\n{description}\n\n{hashtags}', variables: ['filmTitle', 'description'] },
  { id: 'trailer-drop', name: 'Sortie bande-annonce', category: 'trailer', platforms: ['all'], template: '🎥 The trailer for "{filmTitle}" is here!\n\n{teaser}\n\n▶️ Watch now on CineGeny\n\n{hashtags}', variables: ['filmTitle', 'teaser'] },
  { id: 'vote-call', name: 'Appel au vote', category: 'community', platforms: ['all'], template: '🗳️ Vote for "{filmTitle}"!\n\nThe community decides. Your voice counts.\n\n{hashtags}', variables: ['filmTitle'] },
  { id: 'behind-scenes', name: 'Behind the scenes', category: 'engagement', platforms: ['instagram', 'twitter'], template: '🎬 Behind the scenes de "{filmTitle}"\n\n{behindContent}\n\n{hashtags}', variables: ['filmTitle', 'behindContent'] },
  { id: 'creator-spotlight', name: 'Creator spotlight', category: 'community', platforms: ['linkedin', 'twitter'], template: '⭐ Spotlight on {creatorName}!\n\n{creatorStory}\n\nJoin the CineGeny community.\n\n{hashtags}', variables: ['creatorName', 'creatorStory'] },
  { id: 'milestone', name: 'Milestone plateforme', category: 'growth', platforms: ['all'], template: '🎉 {milestone}!\n\nThank you to our incredible community of creators.\n\n{hashtags}', variables: ['milestone'] },
  { id: 'invest-update', name: 'Investment update', category: 'investment', platforms: ['linkedin'], template: '📊 {filmTitle} has reached {percentage}% of its funding goal!\n\n{details}\n\nInvest in collaborative cinema.\n\n{hashtags}', variables: ['filmTitle', 'percentage', 'details'] },
  { id: 'weekly-digest', name: 'Digest hebdomadaire', category: 'newsletter', platforms: ['email'], template: '📬 Cette semaine sur CineGeny :\n\n{weeklyHighlights}\n\n{hashtags}', variables: ['weeklyHighlights'] },
]

// ─── Campaign Types ─────────────────────────────────────────────────

export type CampaignStatus = 'draft' | 'pending_approval' | 'approved' | 'active' | 'completed' | 'paused' | 'cancelled'
export type CampaignType = 'social' | 'email' | 'sms' | 'multi_channel'

export interface CampaignTemplate {
  id: string
  name: string
  type: CampaignType
  description: string
  defaultBudget: number  // In credits
  defaultDuration: number // Days
  channels: string[]
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  { id: 'film-launch-campaign', name: 'Lancement Film', type: 'multi_channel', description: 'Complete launch campaign for a new film', defaultBudget: 50, defaultDuration: 14, channels: ['twitter', 'linkedin', 'instagram', 'facebook', 'email'] },
  { id: 'crowdfunding-push', name: 'Push Crowdfunding', type: 'social', description: 'Campagne pour booster le financement participatif', defaultBudget: 30, defaultDuration: 7, channels: ['twitter', 'linkedin', 'facebook'] },
  { id: 'trailer-release', name: 'Sortie Bande-Annonce', type: 'social', description: 'Campagne virale pour une bande-annonce', defaultBudget: 25, defaultDuration: 3, channels: ['twitter', 'instagram', 'facebook'] },
  { id: 'community-engagement', name: 'Community engagement', type: 'social', description: 'Engagement and retention campaign', defaultBudget: 15, defaultDuration: 30, channels: ['twitter', 'instagram'] },
  { id: 'email-onboarding', name: 'Onboarding Email', type: 'email', description: 'Welcome email sequence for new sign-ups', defaultBudget: 10, defaultDuration: 14, channels: ['email'] },
  { id: 'festival-submission', name: 'Soumission Festival', type: 'multi_channel', description: 'Promotion avant/pendant un festival', defaultBudget: 40, defaultDuration: 21, channels: ['twitter', 'linkedin', 'instagram', 'email'] },
  { id: 'vote-mobilization', name: 'Mobilisation Vote', type: 'social', description: 'Campagne pour maximiser les votes communautaires', defaultBudget: 20, defaultDuration: 5, channels: ['twitter', 'instagram', 'facebook'] },
  { id: 'investor-outreach', name: 'Outreach Investisseurs', type: 'email', description: 'Email sequence for potential investors', defaultBudget: 15, defaultDuration: 21, channels: ['email', 'linkedin'] },
]

// ─── Share Configs ──────────────────────────────────────────────────

export interface ShareConfig {
  type: string
  label: string
  icon: string
  color: string
  urlTemplate: string
}

export const SHARE_CONFIGS: ShareConfig[] = [
  { type: 'twitter', label: 'Twitter', icon: 'twitter', color: '#1DA1F2', urlTemplate: 'https://twitter.com/intent/tweet?text={text}&url={url}' },
  { type: 'linkedin', label: 'LinkedIn', icon: 'linkedin', color: '#0A66C2', urlTemplate: 'https://www.linkedin.com/sharing/share-offsite/?url={url}' },
  { type: 'facebook', label: 'Facebook', icon: 'facebook', color: '#1877F2', urlTemplate: 'https://www.facebook.com/sharer/sharer.php?u={url}' },
  { type: 'whatsapp', label: 'WhatsApp', icon: 'message-circle', color: '#25D366', urlTemplate: 'https://wa.me/?text={text}%20{url}' },
  { type: 'telegram', label: 'Telegram', icon: 'send', color: '#0088CC', urlTemplate: 'https://t.me/share/url?url={url}&text={text}' },
  { type: 'email', label: 'Email', icon: 'mail', color: '#6B7280', urlTemplate: 'mailto:?subject={text}&body={url}' },
  { type: 'copy', label: 'Copier le lien', icon: 'copy', color: '#9CA3AF', urlTemplate: '' },
]

// ─── Landing Page Blocks ────────────────────────────────────────────

export type LandingBlockType = 'hero' | 'trailer' | 'synopsis' | 'cast' | 'cta' | 'reviews' | 'gallery' | 'countdown'

export interface LandingBlock {
  type: LandingBlockType
  label: string
  description: string
  icon: string
  defaultContent: Record<string, string>
}

export const LANDING_BLOCKS: LandingBlock[] = [
  { type: 'hero', label: 'Hero Banner', description: 'Titre, tagline et image de couverture', icon: 'image', defaultContent: { title: 'Titre du film', tagline: 'Tagline accrocheur', bgImage: '' } },
  { type: 'trailer', label: 'Bande-Annonce', description: 'Built-in video player', icon: 'play', defaultContent: { videoUrl: '', poster: '' } },
  { type: 'synopsis', label: 'Synopsis', description: 'Film summary', icon: 'file-text', defaultContent: { text: 'Synopsis du film...', genre: '', duration: '' } },
  { type: 'cast', label: 'Casting', description: 'Cast/creator list', icon: 'users', defaultContent: {} },
  { type: 'cta', label: 'Call to action', description: 'Bouton principal (vote, invest, watch)', icon: 'zap', defaultContent: { text: 'Votez maintenant', href: '#', color: '#E50914' } },
  { type: 'reviews', label: 'Avis', description: 'Citations et notes', icon: 'star', defaultContent: {} },
  { type: 'gallery', label: 'Galerie Photos', description: 'Stills du film', icon: 'grid', defaultContent: {} },
  { type: 'countdown', label: 'Countdown', description: 'Countdown vers la sortie', icon: 'clock', defaultContent: { targetDate: '' } },
]
