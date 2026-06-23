/**
 * CineGeny Productivity Tools
 * CRM, Veille, RSS, Festivals, Box-Office.
 * 7 specialized agents.
 */

// ─── 7 Productivity Agents ─────────────────────────────────────────

export interface ProductivityAgent {
  slug: string
  name: string
  role: string
  description: string
  icon: string
  color: string
}

export const PRODUCTIVITY_AGENTS: ProductivityAgent[] = [
  { slug: 'cg-crm-manager', name: 'CRM Manager', role: 'Gestion contacts & pipeline', description: 'Manages the contact pipeline: investors, distributors, partners. Follow-up tracking, lead scoring, automatic reminders.', icon: 'contact', color: '#3B82F6' },
  { slug: 'cg-deal-closer', name: 'Deal Closer', role: 'Negotiation & closing', description: 'Helps prepare negotiations, draft proposals and track ongoing deals. Analyzes friction points.', icon: 'handshake', color: '#10B981' },
  { slug: 'cg-intel-analyst', name: 'Analyste Veille', role: 'Market intelligence', description: 'Monitors film trends, festival news, industry moves and emerging opportunities.', icon: 'radar', color: '#8B5CF6' },
  { slug: 'cg-festival-tracker', name: 'Tracker Festivals', role: 'Suivi festivals', description: 'Database of global festivals, submission deadlines, results, and optimal selection strategy.', icon: 'award', color: '#F59E0B' },
  { slug: 'cg-box-office-analyst', name: 'Analyste Box-Office', role: 'Box-office data', description: 'Tracks box-office performance, analyzes market trends, identifies promising genres and formats.', icon: 'trending-up', color: '#EF4444' },
  { slug: 'cg-newsletter-curator', name: 'Curateur Newsletter', role: 'Curation contenu', description: 'Selects and summarizes the most relevant film-industry articles for a daily or weekly briefing.', icon: 'newspaper', color: '#06B6D4' },
  { slug: 'cg-task-planner', name: 'Planificateur', role: 'Planning & organisation', description: 'Organizes tasks, sets priorities, builds production workflows and tracks critical deadlines.', icon: 'calendar-check', color: '#EC4899' },
]

// ─── CRM Pipeline ───────────────────────────────────────────────────

export type PipelineStage = 'lead' | 'contacted' | 'meeting' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'

export interface PipelineStageConfig {
  id: PipelineStage
  label: string
  color: string
  icon: string
  description: string
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 'lead', label: 'Lead', color: '#6B7280', icon: 'user-plus', description: 'Contact identified, not yet reached out' },
  { id: 'contacted', label: 'Contacted', color: '#3B82F6', icon: 'mail', description: 'First contact made' },
  { id: 'meeting', label: 'Rendez-vous', color: '#8B5CF6', icon: 'calendar', description: 'Meeting scheduled or held' },
  { id: 'proposal', label: 'Proposition', color: '#F59E0B', icon: 'file-text', description: 'Proposal sent' },
  { id: 'negotiation', label: 'Negotiation', color: '#EF4444', icon: 'message-circle', description: 'In negotiation' },
  { id: 'closed_won', label: 'Won ✓', color: '#10B981', icon: 'check-circle', description: 'Deal closed successfully' },
  { id: 'closed_lost', label: 'Perdu ✗', color: '#9CA3AF', icon: 'x-circle', description: 'Deal lost or abandoned' },
]

export type ContactType = 'investor' | 'distributor' | 'partner' | 'festival' | 'press' | 'talent'

export interface ContactTypeConfig {
  id: ContactType
  label: string
  color: string
  icon: string
}

export const CONTACT_TYPES: ContactTypeConfig[] = [
  { id: 'investor', label: 'Investisseur', color: '#10B981', icon: 'trending-up' },
  { id: 'distributor', label: 'Distributeur', color: '#3B82F6', icon: 'globe' },
  { id: 'partner', label: 'Partenaire', color: '#8B5CF6', icon: 'handshake' },
  { id: 'festival', label: 'Festival', color: '#F59E0B', icon: 'award' },
  { id: 'press', label: 'Presse', color: '#EC4899', icon: 'newspaper' },
  { id: 'talent', label: 'Talent', color: '#06B6D4', icon: 'star' },
]

// ─── Veille / RSS Sources ───────────────────────────────────────────

export interface RSSSource {
  id: string
  name: string
  url: string
  category: string
  language: string
  icon: string
}

export const RSS_SOURCES: RSSSource[] = [
  // Industry News
  { id: 'variety', name: 'Variety', url: 'https://variety.com/feed/', category: 'industry', language: 'en', icon: '📰' },
  { id: 'deadline', name: 'Deadline', url: 'https://deadline.com/feed/', category: 'industry', language: 'en', icon: '📰' },
  { id: 'hollywood-reporter', name: 'Hollywood Reporter', url: 'https://www.hollywoodreporter.com/feed/', category: 'industry', language: 'en', icon: '📰' },
  { id: 'screen-daily', name: 'Screen Daily', url: 'https://www.screendaily.com/feed', category: 'industry', language: 'en', icon: '📰' },
  { id: 'cahiers-cinema', name: 'Cahiers du Cinéma', url: 'https://www.cahiersducinema.com/feed/', category: 'critique', language: 'fr', icon: '🎬' },
  { id: 'ecran-large', name: 'Écran Large', url: 'https://www.ecranlarge.com/rss.xml', category: 'critique', language: 'fr', icon: '🎬' },
  // Tech & AI
  { id: 'techcrunch-ai', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'tech', language: 'en', icon: '🤖' },
  { id: 'the-verge', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'tech', language: 'en', icon: '💻' },
  // Box Office
  { id: 'box-office-mojo', name: 'Box Office Mojo', url: '#', category: 'box-office', language: 'en', icon: '💰' },
  { id: 'allocine', name: 'AlloCiné', url: 'https://www.allocine.fr/rss/', category: 'critique', language: 'fr', icon: '🎬' },
  // Festivals
  { id: 'festival-cannes', name: 'Festival de Cannes', url: '#', category: 'festivals', language: 'fr', icon: '🏆' },
  { id: 'sundance', name: 'Sundance', url: '#', category: 'festivals', language: 'en', icon: '🏔️' },
]

export const VEILLE_CATEGORIES = [
  { id: 'industry', label: 'Industrie', icon: '📰', color: '#3B82F6' },
  { id: 'critique', label: 'Critique', icon: '🎬', color: '#E50914' },
  { id: 'tech', label: 'Tech & IA', icon: '🤖', color: '#8B5CF6' },
  { id: 'box-office', label: 'Box-Office', icon: '💰', color: '#10B981' },
  { id: 'festivals', label: 'Festivals', icon: '🏆', color: '#F59E0B' },
]

// ─── Festival Calendar ──────────────────────────────────────────────

export interface FestivalEntry {
  name: string
  location: string
  dates: string
  deadline: string
  category: string
  prestige: 'A-list' | 'B-list' | 'niche'
  website: string
}

export const MAJOR_FESTIVALS: FestivalEntry[] = [
  { name: 'Festival de Cannes', location: 'Cannes, France', dates: 'Mai', deadline: 'February', category: 'General', prestige: 'A-list', website: 'festival-cannes.com' },
  { name: 'Berlinale', location: 'Berlin, Allemagne', dates: 'February', deadline: 'Novembre', category: 'General', prestige: 'A-list', website: 'berlinale.de' },
  { name: 'Mostra de Venise', location: 'Venise, Italie', dates: 'Septembre', deadline: 'Juin', category: 'General', prestige: 'A-list', website: 'labiennale.org' },
  { name: 'Sundance', location: 'Park City, USA', dates: 'Janvier', deadline: 'Septembre', category: 'Independent', prestige: 'A-list', website: 'sundance.org' },
  { name: 'TIFF', location: 'Toronto, Canada', dates: 'Septembre', deadline: 'Juin', category: 'General', prestige: 'A-list', website: 'tiff.net' },
  { name: 'Locarno', location: 'Locarno, Suisse', dates: 'August', deadline: 'Avril', category: 'Art & Essai', prestige: 'A-list', website: 'locarnofestival.ch' },
  { name: 'San Sebastián', location: 'San Sebastián, Spain', dates: 'Septembre', deadline: 'Juin', category: 'General', prestige: 'A-list', website: 'sansebastianfestival.com' },
  { name: 'Tribeca', location: 'New York, USA', dates: 'Juin', deadline: 'Janvier', category: 'Independent', prestige: 'B-list', website: 'tribecafilm.com' },
  { name: 'Rotterdam', location: 'Rotterdam, Pays-Bas', dates: 'Janvier', deadline: 'Octobre', category: 'Experimental', prestige: 'B-list', website: 'iffr.com' },
  { name: 'Annecy', location: 'Annecy, France', dates: 'Juin', deadline: 'February', category: 'Animation', prestige: 'A-list', website: 'annecy.org' },
  { name: 'SXSW', location: 'Austin, USA', dates: 'Mars', deadline: 'Octobre', category: 'Tech/Indie', prestige: 'B-list', website: 'sxsw.com' },
  { name: 'Clermont-Ferrand', location: 'Clermont-Ferrand, France', dates: 'February', deadline: 'Octobre', category: 'Short film', prestige: 'A-list', website: 'clermont-filmfest.org' },
]
