/**
 * CineGeny Landing & Public Content
 * 7 agents, FAQ, trust badges, demos, blog, comparisons.
 */

export interface ContentAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const CONTENT_AGENTS: ContentAgent[] = [
  { slug: 'cg-landing-optimizer', name: 'Landing Optimizer', role: 'Optimisation conversion', description: 'Optimise la landing page : copywriting, CTA, social proof, A/B testing mental.', icon: 'layout', color: '#E50914' },
  { slug: 'cg-faq-manager', name: 'FAQ Manager', role: 'FAQ & support', description: 'Gère les FAQ par catégorie, identifie les questions fréquentes, rédige des réponses claires.', icon: 'help-circle', color: '#3B82F6' },
  { slug: 'cg-demo-designer', name: 'Demo Designer', role: 'Démos interactives', description: 'Conçoit des scénarios de démo testables sans inscription pour convertir les visiteurs.', icon: 'play', color: '#10B981' },
  { slug: 'cg-blog-writer', name: 'Blog Writer', role: 'Rédaction articles', description: 'Rédige des articles sur le cinéma participatif, l\'IA dans le cinéma, les tendances du secteur.', icon: 'pen-tool', color: '#8B5CF6' },
  { slug: 'cg-case-study-writer', name: 'Case Study Writer', role: 'Cas d\'usage', description: 'Rédige des cas d\'usage détaillés pour chaque persona : producteur indépendant, investisseur, créateur.', icon: 'book-open', color: '#F59E0B' },
  { slug: 'cg-competitor-analyst', name: 'Analyste Concurrence', role: 'Veille concurrentielle', description: 'Analyse les alternatives et positionne CineGeny avec des comparaisons objectives et honnêtes.', icon: 'bar-chart', color: '#EC4899' },
  { slug: 'cg-api-docs-writer', name: 'API Doc Writer', role: 'Documentation API', description: 'Rédige la documentation API pour les développeurs : endpoints, authentification, exemples.', icon: 'code', color: '#06B6D4' },
]

// ─── FAQ ────────────────────────────────────────────────────────────

export interface FAQItem { q: string; a: string }
export interface FAQCategory { id: string; label: string; icon: string; color: string; items: FAQItem[] }

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'general', label: 'General', icon: 'help-circle', color: '#3B82F6', items: [
    { q: 'Qu\'est-ce que CineGeny ?', a: 'CineGeny est la première plateforme de cinéma participatif propulsée par l\'IA. Elle permet à chacun de créer, financer et distribuer des films grâce à 113 agents IA spécialisés.' },
    { q: 'Faut-il de l\'expérience en cinéma ?', a: 'Aucune expérience requise. Nos agents IA vous guident à chaque étape, du scénario à la distribution.' },
    { q: 'CineGeny est-il gratuit ?', a: 'L\'inscription est gratuite avec 2 crédits IA offerts. Les fonctionnalités avancées nécessitent des crédits supplémentaires (0% commission — vous ne payez que le coût réel des tokens IA).' },
    { q: 'Dans quelles langues est disponible CineGeny ?', a: 'L\'interface est disponible en français et anglais. Notre agent Traducteur supporte 12 langues pour les contenus.' },
  ]},
  { id: 'investment', label: 'Investissement', icon: 'trending-up', color: '#10B981', items: [
    { q: 'Comment investir dans un film ?', a: 'Chaque film sur CineGeny peut proposer un crowdfunding. Vous choisissez le montant, et les revenus sont répartis : 25% investisseurs, 25% scénaristes, 25% contributeurs, 25% plateforme.' },
    { q: 'Quel est le retour sur investissement ?', a: 'Le ROI dépend du succès du film. Notre agent Investment Strategist analyse chaque projet et fournit des estimations basées sur le genre, le budget et les comparables.' },
    { q: 'Mon investissement est-il sécurisé ?', a: 'Les smart contracts Ethereum garantissent la transparence. Les fonds sont bloqués jusqu\'à ce que les conditions soient remplies.' },
  ]},
  { id: 'creation', label: 'Création', icon: 'film', color: '#E50914', items: [
    { q: 'Comment créer un film sur CineGeny ?', a: 'Suivez les 7 étapes guidées : Script → Storyboard → Casting → Setups → Stills → Vidéos → Musique. Chaque étape est assistée par un agent IA dédié.' },
    { q: 'Puis-je collaborer avec d\'autres créateurs ?', a: 'Oui ! Le Team Workspace permet d\'inviter des collaborateurs avec 7 rôles différents (réalisateur, scénariste, artiste, etc.).' },
    { q: 'Qu\'est-ce que la Mémoire Film ?', a: 'Chaque film a sa propre base de connaissances (personnages, univers, style) qui garantit la cohérence de toutes les contributions IA.' },
  ]},
  { id: 'tokens', label: 'Tokens IA', icon: 'zap', color: '#F59E0B', items: [
    { q: 'Qu\'est-ce qu\'un crédit IA ?', a: '1 crédit = 1 000 000 micro-crédits. Les crédits servent à payer les actions IA (génération d\'images, vidéos, analyse de script, etc.).' },
    { q: 'Combien coûte une action IA ?', a: 'Les prix varient : analyse de script (~0.5 cr), storyboard frame (~1 cr), clip vidéo 5s (~10 cr), trailer complet (~50 cr). Voir /pricing-ia pour le détail.' },
    { q: 'Y a-t-il une commission ?', a: '0% de commission. Vous ne payez que le coût réel des tokens IA du fournisseur (Anthropic, Runway, etc.).' },
    { q: 'Puis-je choisir le modèle IA ?', a: 'Oui pour les tâches créatives libres. Pour les tâches qui impactent la cohérence du film, le modèle est imposé par le système.' },
  ]},
  { id: 'security', label: 'Security', icon: 'shield', color: '#8B5CF6', items: [
    { q: 'Mes données sont-elles protégées ?', a: 'Oui. PII masking (7 patterns), injection prevention, circuit breakers, et 10 modules de guardrails protègent la plateforme.' },
    { q: 'CineGeny est-il conforme RGPD ?', a: 'Oui. Nettoyage RGPD mensuel automatique, droit à l\'oubli, export de données personnelles sur demande.' },
    { q: 'Qui a accès à mes films ?', a: 'Seuls les collaborateurs invités et les agents IA de votre projet. La mémoire film est isolée et chiffrée par projet.' },
  ]},
]

// ─── Trust Badges ───────────────────────────────────────────────────

export const TRUST_BADGES = [
  { label: '0% Commission', icon: 'shield', color: '#10B981', detail: 'Coût réel des tokens IA' },
  { label: '10 Guardrails', icon: 'lock', color: '#3B82F6', detail: 'Protection complète' },
  { label: 'PII Masking', icon: 'eye-off', color: '#8B5CF6', detail: '7 patterns de masquage' },
  { label: 'Smart Contracts', icon: 'file-check', color: '#F59E0B', detail: 'Ethereum transparent' },
  { label: 'RGPD Compliant', icon: 'shield-check', color: '#EC4899', detail: 'Cleanup mensuel auto' },
  { label: '113 Agents IA', icon: 'bot', color: '#E50914', detail: 'Cinéma spécialisé' },
]

// ─── Demo Scenarios ─────────────────────────────────────────────────

export interface DemoScenario {
  id: string; title: string; description: string; icon: string; color: string; steps: string[]; agentUsed: string
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  { id: 'script-analysis', title: 'Analysez un script', description: 'Soumettez une idée de scénario et recevez une analyse IA complète.', icon: 'pen-tool', color: '#3B82F6', steps: ['Décrivez votre idée de film', 'L\'agent Scénariste analyse la structure', 'Recevez un feedback détaillé'], agentUsed: 'cg-scenariste' },
  { id: 'poster-generate', title: 'Créez une affiche', description: 'Générez une affiche de film professionnelle en 30 secondes.', icon: 'image', color: '#E50914', steps: ['Choisissez un titre et un genre', 'Sélectionnez un style visuel', 'L\'IA génère votre affiche'], agentUsed: 'cg-studio-poster' },
  { id: 'investment-analysis', title: 'Évaluez un investissement', description: 'Analysez le potentiel ROI d\'un projet de film.', icon: 'trending-up', color: '#10B981', steps: ['Entrez le genre et le budget', 'L\'agent analyse les comparables', 'Recevez une évaluation de ROI'], agentUsed: 'cg-investment-strategist' },
]

// ─── Blog Articles ──────────────────────────────────────────────────

export interface BlogArticle {
  slug: string; title: string; excerpt: string; category: string; author: string; date: string; readTime: string; coverImage: string
}

export const BLOG_ARTICLES: BlogArticle[] = [
  { slug: 'cinema-participatif-revolution', title: 'Le cinéma participatif : la révolution silencieuse', excerpt: 'Comment la technologie IA et le crowdfunding transforment la production cinématographique, la rendant accessible à tous.', category: 'Industrie', author: 'CineGeny Team', date: '2026-03-15', readTime: '8 min', coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { slug: 'ia-scenariste-avenir', title: 'L\'IA scénariste : outil ou menace ?', excerpt: 'Analyse approfondie du rôle de l\'IA dans l\'écriture de scénarios. Collaboration homme-machine plutôt que remplacement.', category: 'IA & Cinéma', author: 'CineGeny Team', date: '2026-03-10', readTime: '6 min', coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'guide-premier-film', title: 'Guide : Créer votre premier film sur CineGeny', excerpt: 'Tutoriel pas à pas pour créer, produire et distribuer votre premier film en utilisant la plateforme CineGeny.', category: 'Tutoriel', author: 'CineGeny Team', date: '2026-03-05', readTime: '12 min', coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80' },
  { slug: 'investir-cinema-ia', title: 'Investir dans le cinéma IA : guide complet', excerpt: 'Tout ce que vous devez savoir sur l\'investissement dans le cinéma participatif : ROI, risques, smart contracts.', category: 'Investissement', author: 'CineGeny Team', date: '2026-02-28', readTime: '10 min', coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'agents-ia-cinema', title: '113 agents IA cinéma : la force de CineGeny', excerpt: 'Découvrez comment nos 113 agents spécialisés couvrent chaque aspect de la production cinématographique.', category: 'Produit', author: 'CineGeny Team', date: '2026-02-20', readTime: '7 min', coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
  { slug: 'memoire-film-coherence', title: 'La Mémoire Film : clé de la cohérence IA', excerpt: 'Comment la base de connaissances par film garantit que chaque contribution IA reste cohérente avec l\'univers du projet.', category: 'Technologie', author: 'CineGeny Team', date: '2026-02-15', readTime: '5 min', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
]

// ─── Competitor Comparison ──────────────────────────────────────────

export interface CompetitorFeature { feature: string; cinegeny: string; competitor1: string; competitor2: string; competitor3: string }

export const COMPETITORS = { cinegeny: 'CineGeny', competitor1: 'Runway ML', competitor2: 'Pika', competitor3: 'Studios traditionnels' }

export const COMPARISON_FEATURES: CompetitorFeature[] = [
  { feature: 'Cinéma participatif', cinegeny: '✅ Complet', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Agents IA spécialisés', cinegeny: '✅ 113 agents', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Génération vidéo', cinegeny: '✅ 7 providers', competitor1: '✅ Propre', competitor2: '✅ Propre', competitor3: '❌' },
  { feature: 'Mémoire Film (RAG)', cinegeny: '✅ 8 catégories', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Commission', cinegeny: '✅ 0%', competitor1: '⚠️ Abonnement', competitor2: '⚠️ Crédits', competitor3: '❌ 15-40%' },
  { feature: 'Crowdfunding intégré', cinegeny: '✅ Smart contracts', competitor1: '❌', competitor2: '❌', competitor3: '⚠️ Externe' },
  { feature: 'Chat IA streaming', cinegeny: '✅ SSE', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Multi-agent meetings', cinegeny: '✅', competitor1: '❌', competitor2: '❌', competitor3: '❌' },
  { feature: 'Documents juridiques', cinegeny: '✅ 8 templates', competitor1: '❌', competitor2: '❌', competitor3: '⚠️ Avocat' },
  { feature: 'Team workspace', cinegeny: '✅ 7 rôles', competitor1: '⚠️ Basique', competitor2: '❌', competitor3: '✅' },
]

// ─── API Pricing (for developers) ───────────────────────────────────

export interface APIPlan { name: string; price: string; requests: string; features: string[]; popular: boolean }

export const API_PLANS: APIPlan[] = [
  { name: 'Free', price: '0€/mois', requests: '100 requêtes/mois', features: ['Accès agents L1', 'Chat API', 'Film knowledge read-only', 'Rate limit: 10/min'], popular: false },
  { name: 'Developer', price: '29€/mois', requests: '5 000 requêtes/mois', features: ['Tous les agents', 'SSE streaming', 'Film knowledge R/W', 'Webhooks', 'Rate limit: 60/min'], popular: true },
  { name: 'Studio', price: '99€/mois', requests: '50 000 requêtes/mois', features: ['Tout Developer +', 'Agents L3 Strategy', 'Multi-agent meetings API', 'Priority support', 'Rate limit: 300/min'], popular: false },
  { name: 'Enterprise', price: 'Sur mesure', requests: 'Unlimited', features: ['Tout Studio +', 'SLA garanti', 'Dedicated support', 'Custom agents', 'On-premise option'], popular: false },
]
