/**
 * CineGeny Landing & Public Content
 * 7 agents, FAQ, trust badges, demos, blog, comparisons.
 */

export interface ContentAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const CONTENT_AGENTS: ContentAgent[] = [
  { slug: 'cg-landing-optimizer', name: 'Landing Optimizer', role: 'Optimisation conversion', description: 'Optimise la landing page : copywriting, CTA, social proof, A/B testing mental.', icon: 'layout', color: '#E50914' },
  { slug: 'cg-faq-manager', name: 'FAQ Manager', role: 'FAQ & support', description: 'Manages FAQs by category, identifies frequent questions, writes clear answers.', icon: 'help-circle', color: '#3B82F6' },
  { slug: 'cg-demo-designer', name: 'Demo Designer', role: 'Interactive demos', description: 'Designs demo scenarios testable without sign-up to convert visitors.', icon: 'play', color: '#10B981' },
  { slug: 'cg-blog-writer', name: 'Blog Writer', role: 'Article writing', description: 'Writes articles on collaborative cinema, AI in film, and industry trends.', icon: 'pen-tool', color: '#8B5CF6' },
  { slug: 'cg-case-study-writer', name: 'Case Study Writer', role: 'Cas d\'usage', description: 'Writes detailed use cases for each persona: independent producer, investor, creator.', icon: 'book-open', color: '#F59E0B' },
  { slug: 'cg-competitor-analyst', name: 'Analyste Concurrence', role: 'Veille concurrentielle', description: 'Analyzes the alternatives and positions CineGeny with objective, honest comparisons.', icon: 'bar-chart', color: '#EC4899' },
  { slug: 'cg-api-docs-writer', name: 'API Doc Writer', role: 'Documentation API', description: 'Writes the API documentation for developers: endpoints, authentication, examples.', icon: 'code', color: '#06B6D4' },
]

// ─── FAQ ────────────────────────────────────────────────────────────

export interface FAQItem { q: string; a: string }
export interface FAQCategory { id: string; label: string; icon: string; color: string; items: FAQItem[] }

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'general', label: 'General', icon: 'help-circle', color: '#3B82F6', items: [
    { q: 'Qu\'est-ce que CineGeny ?', a: 'CineGeny is the first AI-powered collaborative cinema platform. It lets anyone create, fund and distribute films with 113 specialized AI agents.' },
    { q: 'Do I need filmmaking experience?', a: 'No experience required. Our AI agents guide you at every step, from script to distribution.' },
    { q: 'CineGeny est-il gratuit ?', a: 'Sign-up is free with 2 AI credits included. Advanced features require extra credits (0% commission — you only pay the real cost of the AI tokens).' },
    { q: 'Dans quelles langues est disponible CineGeny ?', a: 'The interface is available in English and French. Our Translator agent supports 12 languages for content.' },
  ]},
  { id: 'investment', label: 'Investissement', icon: 'trending-up', color: '#10B981', items: [
    { q: 'Comment investir dans un film ?', a: 'Every film on CineGeny can run a crowdfunding campaign. You set the amount, and revenue is split: 25% investors, 25% screenwriters, 25% contributors, 25% platform.' },
    { q: 'Quel est le retour sur investissement ?', a: 'ROI depends on the film\'s success. Our Investment Strategist agent analyzes each project and provides estimates based on genre, budget and comparables.' },
    { q: 'Is my investment secure?', a: 'Ethereum smart contracts guarantee transparency. Funds are locked until the conditions are met.' },
  ]},
  { id: 'creation', label: 'Creation', icon: 'film', color: '#E50914', items: [
    { q: 'How do I create a film on CineGeny?', a: 'Follow the 7 guided steps: Script → Storyboard → Casting → Setups → Stills → Videos → Music. Each step is assisted by a dedicated AI agent.' },
    { q: 'Can I collaborate with other creators?', a: 'Yes! The Team Workspace lets you invite collaborators with 7 different roles (director, screenwriter, artist, etc.).' },
    { q: 'What is Film Memory?', a: 'Each film has its own knowledge base (characters, world, style) that ensures the consistency of all AI contributions.' },
  ]},
  { id: 'tokens', label: 'Tokens IA', icon: 'zap', color: '#F59E0B', items: [
    { q: 'What is an AI credit?', a: '1 credit = 1,000,000 micro-credits. Credits pay for AI actions (image generation, videos, script analysis, etc.).' },
    { q: 'How much does an AI action cost?', a: 'Prices vary: script analysis (~0.5 cr), storyboard frame (~1 cr), 5s video clip (~10 cr), full trailer (~50 cr). See /pricing for details.' },
    { q: 'Y a-t-il une commission ?', a: '0% commission. You only pay the real cost of the provider\'s AI tokens (Anthropic, Runway, etc.).' },
    { q: 'Can I choose the AI model?', a: 'Yes for free creative tasks. For tasks that affect the film\'s consistency, the model is set by the system.' },
  ]},
  { id: 'security', label: 'Security', icon: 'shield', color: '#8B5CF6', items: [
    { q: 'Is my data protected?', a: 'Yes. PII masking (7 patterns), injection prevention, circuit breakers, and 10 guardrail modules protect the platform.' },
    { q: 'CineGeny est-il conforme RGPD ?', a: 'Yes. Automatic monthly GDPR cleanup, right to be forgotten, personal data export on request.' },
    { q: 'Who has access to my films?', a: 'Only invited collaborators and your project\'s AI agents. Film memory is isolated and encrypted per project.' },
  ]},
]

// ─── Trust Badges ───────────────────────────────────────────────────

export const TRUST_BADGES = [
  { label: '0% Commission', icon: 'shield', color: '#10B981', detail: 'Real cost of AI tokens' },
  { label: '10 Guardrails', icon: 'lock', color: '#3B82F6', detail: 'Full protection' },
  { label: 'PII Masking', icon: 'eye-off', color: '#8B5CF6', detail: '7 patterns de masquage' },
  { label: 'Smart Contracts', icon: 'file-check', color: '#F59E0B', detail: 'Ethereum transparent' },
  { label: 'RGPD Compliant', icon: 'shield-check', color: '#EC4899', detail: 'Cleanup mensuel auto' },
  { label: '113 Agents IA', icon: 'bot', color: '#E50914', detail: 'Specialized cinema' },
]

// ─── Demo Scenarios ─────────────────────────────────────────────────

export interface DemoScenario {
  id: string; title: string; description: string; icon: string; color: string; steps: string[]; agentUsed: string
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  { id: 'script-analysis', title: 'Analysez un script', description: 'Submit a screenplay idea and receive a complete AI analysis.', icon: 'pen-tool', color: '#3B82F6', steps: ['Describe your film idea', 'The Screenwriter agent analyzes the structure', 'Receive detailed feedback'], agentUsed: 'cg-scenariste' },
  { id: 'poster-generate', title: 'Create a poster', description: 'Generate a professional film poster in 30 seconds.', icon: 'image', color: '#E50914', steps: ['Choisissez un titre et un genre', 'Select a visual style', 'The AI generates your poster'], agentUsed: 'cg-studio-poster' },
  { id: 'investment-analysis', title: 'Evaluate an investment', description: 'Analysez le potentiel ROI d\'un projet de film.', icon: 'trending-up', color: '#10B981', steps: ['Entrez le genre et le budget', 'L\'agent analyse les comparables', 'Receive a ROI estimate'], agentUsed: 'cg-investment-strategist' },
]

// ─── Blog Articles ──────────────────────────────────────────────────

export interface BlogArticle {
  slug: string; title: string; excerpt: string; category: string; author: string; date: string; readTime: string; coverImage: string
}

export const BLOG_ARTICLES: BlogArticle[] = [
  { slug: 'cinema-participatif-revolution', title: 'Collaborative cinema: the silent revolution', excerpt: 'How AI technology and crowdfunding are transforming film production, making it accessible to everyone.', category: 'Industrie', author: 'CineGeny Team', date: '2026-03-15', readTime: '8 min', coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { slug: 'ia-scenariste-avenir', title: 'The AI screenwriter: tool or threat?', excerpt: 'An in-depth look at AI\'s role in screenwriting. Human-machine collaboration rather than replacement.', category: 'AI & Cinema', author: 'CineGeny Team', date: '2026-03-10', readTime: '6 min', coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'guide-premier-film', title: 'Guide: Create your first film on CineGeny', excerpt: 'Step-by-step tutorial to create, produce and distribute your first film using the CineGeny platform.', category: 'Tutoriel', author: 'CineGeny Team', date: '2026-03-05', readTime: '12 min', coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80' },
  { slug: 'investir-cinema-ia', title: 'Investing in AI cinema: the complete guide', excerpt: 'Everything you need to know about investing in collaborative cinema: ROI, risks, smart contracts.', category: 'Investissement', author: 'CineGeny Team', date: '2026-02-28', readTime: '10 min', coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'agents-ia-cinema', title: '113 AI cinema agents: CineGeny\'s strength', excerpt: 'See how our 113 specialized agents cover every aspect of film production.', category: 'Produit', author: 'CineGeny Team', date: '2026-02-20', readTime: '7 min', coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
  { slug: 'memoire-film-coherence', title: 'Film Memory: the key to AI consistency', excerpt: 'How the per-film knowledge base ensures every AI contribution stays consistent with the project\'s world.', category: 'Technologie', author: 'CineGeny Team', date: '2026-02-15', readTime: '5 min', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
]

// ─── Competitor Comparison ──────────────────────────────────────────

export interface CompetitorFeature { feature: string; cinegeny: string; competitor1: string; competitor2: string; competitor3: string }

export const COMPETITORS = { cinegeny: 'CineGeny', competitor1: 'Runway ML', competitor2: 'Pika', competitor3: 'Studios traditionnels' }

export const COMPARISON_FEATURES: CompetitorFeature[] = [
  { feature: 'Collaborative cinema', cinegeny: '✅ Complet', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Specialized AI agents', cinegeny: '✅ 113 agents', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Video generation', cinegeny: '✅ 7 providers', competitor1: '✅ Propre', competitor2: '✅ Propre', competitor3: '❌' },
  { feature: 'Film Memory (RAG)', cinegeny: '✅ 8 categories', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Commission', cinegeny: '✅ 0%', competitor1: '⚠️ Subscription', competitor2: '⚠️ Credits', competitor3: '❌ 15-40%' },
  { feature: 'Built-in crowdfunding', cinegeny: '✅ Smart contracts', competitor1: '❌', competitor2: '❌', competitor3: '⚠️ External' },
  { feature: 'Chat IA streaming', cinegeny: '✅ SSE', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Multi-agent meetings', cinegeny: '✅', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Documents juridiques', cinegeny: '✅ 8 templates', competitor1: '❌', competitor2: '❌', competitor3: '⚠️ Lawyer' },
  { feature: 'Team workspace', cinegeny: '✅ 7 roles', competitor1: '⚠️ Basic', competitor2: '❌', competitor3: '✅' },
]

// ─── API Pricing (for developers) ───────────────────────────────────

export interface APIPlan { name: string; price: string; requests: string; features: string[]; popular: boolean }

export const API_PLANS: APIPlan[] = [
  { name: 'Free', price: '0€/mois', requests: '100 requests/month', features: ['L1 agent access', 'Chat API', 'Film knowledge read-only', 'Rate limit: 10/min'], popular: false },
  { name: 'Developer', price: '29€/mois', requests: '5,000 requests/month', features: ['Tous les agents', 'SSE streaming', 'Film knowledge R/W', 'Webhooks', 'Rate limit: 60/min'], popular: true },
  { name: 'Studio', price: '99€/mois', requests: '50,000 requests/month', features: ['Tout Developer +', 'Agents L3 Strategy', 'Multi-agent meetings API', 'Priority support', 'Rate limit: 300/min'], popular: false },
  { name: 'Enterprise', price: 'Sur mesure', requests: 'Unlimited', features: ['Tout Studio +', 'SLA garanti', 'Dedicated support', 'Custom agents', 'On-premise option'], popular: false },
]
