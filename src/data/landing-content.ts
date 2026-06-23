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
    { q: 'Qu\'est-ce que CineGeny ?', a: 'CineGeny est la première plateforme de cinéma participatif propulsée par l\'IA. Elle permet à chacun de créer, financer et distribuer des films grâce à 113 agents IA spécialisés.' },
    { q: 'Do I need filmmaking experience?', a: 'No experience required. Our AI agents guide you at every step, from script to distribution.' },
    { q: 'CineGeny est-il gratuit ?', a: 'L\'inscription est gratuite avec 2 crédits IA offerts. Les fonctionnalités avancées nécessitent des crédits supplémentaires (0% commission — vous ne payez que le coût réel des tokens IA).' },
    { q: 'Dans quelles langues est disponible CineGeny ?', a: 'L\'interface est disponible en français et anglais. Notre agent Traducteur supporte 12 langues pour les contenus.' },
  ]},
  { id: 'investment', label: 'Investissement', icon: 'trending-up', color: '#10B981', items: [
    { q: 'Comment investir dans un film ?', a: 'Chaque film sur CineGeny peut proposer un crowdfunding. Vous choisissez le montant, et les revenus sont répartis : 25% investisseurs, 25% scénaristes, 25% contributeurs, 25% plateforme.' },
    { q: 'Quel est le retour sur investissement ?', a: 'Le ROI dépend du succès du film. Notre agent Investment Strategist analyse chaque projet et fournit des estimations basées sur le genre, le budget et les comparables.' },
    { q: 'Is my investment secure?', a: 'Les smart contracts Ethereum garantissent la transparence. Les fonds sont bloqués jusqu\'à ce que les conditions soient remplies.' },
  ]},
  { id: 'creation', label: 'Creation', icon: 'film', color: '#E50914', items: [
    { q: 'How do I create a film on CineGeny?', a: 'Suivez les 7 étapes guidées : Script → Storyboard → Casting → Setups → Stills → Vidéos → Musique. Chaque étape est assistée par un agent IA dédié.' },
    { q: 'Can I collaborate with other creators?', a: 'Oui ! Le Team Workspace permet d\'inviter des collaborateurs avec 7 rôles différents (réalisateur, scénariste, artiste, etc.).' },
    { q: 'What is Film Memory?', a: 'Chaque film a sa propre base de connaissances (personnages, univers, style) qui garantit la cohérence de toutes les contributions IA.' },
  ]},
  { id: 'tokens', label: 'Tokens IA', icon: 'zap', color: '#F59E0B', items: [
    { q: 'What is an AI credit?', a: '1 crédit = 1 000 000 micro-crédits. Les crédits servent à payer les actions IA (génération d\'images, vidéos, analyse de script, etc.).' },
    { q: 'How much does an AI action cost?', a: 'Les prix varient : analyse de script (~0.5 cr), storyboard frame (~1 cr), clip vidéo 5s (~10 cr), trailer complet (~50 cr). Voir /pricing-ia pour le détail.' },
    { q: 'Y a-t-il une commission ?', a: '0% commission. You only pay the real cost of the provider\'s AI tokens (Anthropic, Runway, etc.).' },
    { q: 'Can I choose the AI model?', a: 'Oui pour les tâches créatives libres. Pour les tâches qui impactent la cohérence du film, le modèle est imposé par le système.' },
  ]},
  { id: 'security', label: 'Security', icon: 'shield', color: '#8B5CF6', items: [
    { q: 'Is my data protected?', a: 'Oui. PII masking (7 patterns), injection prevention, circuit breakers, et 10 modules de guardrails protègent la plateforme.' },
    { q: 'CineGeny est-il conforme RGPD ?', a: 'Yes. Automatic monthly GDPR cleanup, right to be forgotten, personal data export on request.' },
    { q: 'Who has access to my films?', a: 'Seuls les collaborateurs invités et les agents IA de votre projet. La mémoire film est isolée et chiffrée par projet.' },
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
  { id: 'investment-analysis', title: 'Évaluez un investissement', description: 'Analysez le potentiel ROI d\'un projet de film.', icon: 'trending-up', color: '#10B981', steps: ['Entrez le genre et le budget', 'L\'agent analyse les comparables', 'Receive a ROI estimate'], agentUsed: 'cg-investment-strategist' },
]

// ─── Blog Articles ──────────────────────────────────────────────────

export interface BlogArticle {
  slug: string; title: string; excerpt: string; category: string; author: string; date: string; readTime: string; coverImage: string
}

export const BLOG_ARTICLES: BlogArticle[] = [
  { slug: 'cinema-participatif-revolution', title: 'Collaborative cinema: the silent revolution', excerpt: 'Comment la technologie IA et le crowdfunding transforment la production cinématographique, la rendant accessible à tous.', category: 'Industrie', author: 'CineGeny Team', date: '2026-03-15', readTime: '8 min', coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { slug: 'ia-scenariste-avenir', title: 'The AI screenwriter: tool or threat?', excerpt: 'Analyse approfondie du rôle de l\'IA dans l\'écriture de scénarios. Collaboration homme-machine plutôt que remplacement.', category: 'AI & Cinema', author: 'CineGeny Team', date: '2026-03-10', readTime: '6 min', coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'guide-premier-film', title: 'Guide: Create your first film on CineGeny', excerpt: 'Step-by-step tutorial to create, produce and distribute your first film using the CineGeny platform.', category: 'Tutoriel', author: 'CineGeny Team', date: '2026-03-05', readTime: '12 min', coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80' },
  { slug: 'investir-cinema-ia', title: 'Investing in AI cinema: the complete guide', excerpt: 'Tout ce que vous devez savoir sur l\'investissement dans le cinéma participatif : ROI, risques, smart contracts.', category: 'Investissement', author: 'CineGeny Team', date: '2026-02-28', readTime: '10 min', coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'agents-ia-cinema', title: '113 AI cinema agents: CineGeny\'s strength', excerpt: 'See how our 113 specialized agents cover every aspect of film production.', category: 'Produit', author: 'CineGeny Team', date: '2026-02-20', readTime: '7 min', coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
  { slug: 'memoire-film-coherence', title: 'Film Memory: the key to AI consistency', excerpt: 'Comment la base de connaissances par film garantit que chaque contribution IA reste cohérente avec l\'univers du projet.', category: 'Technologie', author: 'CineGeny Team', date: '2026-02-15', readTime: '5 min', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
]

// ─── Competitor Comparison ──────────────────────────────────────────

export interface CompetitorFeature { feature: string; cinegeny: string; competitor1: string; competitor2: string; competitor3: string }

export const COMPETITORS = { cinegeny: 'CineGeny', competitor1: 'Runway ML', competitor2: 'Pika', competitor3: 'Studios traditionnels' }

export const COMPARISON_FEATURES: CompetitorFeature[] = [
  { feature: 'Collaborative cinema', cinegeny: '✅ Complet', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Specialized AI agents', cinegeny: '✅ 113 agents', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Video generation', cinegeny: '✅ 7 providers', competitor1: '✅ Propre', competitor2: '✅ Propre', competitor3: '❌' },
  { feature: 'Film Memory (RAG)', cinegeny: '✅ 8 categories', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Commission', cinegeny: '✅ 0%', competitor1: '⚠️ Abonnement', competitor2: '⚠️ Credits', competitor3: '❌ 15-40%' },
  { feature: 'Built-in crowdfunding', cinegeny: '✅ Smart contracts', competitor1: '❌', competitor2: '❌', competitor3: '⚠️ Externe' },
  { feature: 'Chat IA streaming', cinegeny: '✅ SSE', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Multi-agent meetings', cinegeny: '✅', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Documents juridiques', cinegeny: '✅ 8 templates', competitor1: '❌', competitor2: '❌', competitor3: '⚠️ Avocat' },
  { feature: 'Team workspace', cinegeny: '✅ 7 roles', competitor1: '⚠️ Basique', competitor2: '❌', competitor3: '✅' },
]

// ─── API Pricing (for developers) ───────────────────────────────────

export interface APIPlan { name: string; price: string; requests: string; features: string[]; popular: boolean }

export const API_PLANS: APIPlan[] = [
  { name: 'Free', price: '0€/mois', requests: '100 requests/month', features: ['L1 agent access', 'Chat API', 'Film knowledge read-only', 'Rate limit: 10/min'], popular: false },
  { name: 'Developer', price: '29€/mois', requests: '5,000 requests/month', features: ['Tous les agents', 'SSE streaming', 'Film knowledge R/W', 'Webhooks', 'Rate limit: 60/min'], popular: true },
  { name: 'Studio', price: '99€/mois', requests: '50,000 requests/month', features: ['Tout Developer +', 'Agents L3 Strategy', 'Multi-agent meetings API', 'Priority support', 'Rate limit: 300/min'], popular: false },
  { name: 'Enterprise', price: 'Sur mesure', requests: 'Unlimited', features: ['Tout Studio +', 'SLA garanti', 'Dedicated support', 'Custom agents', 'On-premise option'], popular: false },
]
