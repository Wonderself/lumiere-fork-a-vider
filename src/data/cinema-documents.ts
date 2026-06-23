/**
 * CineGeny Cinema Document Factory
 * Professional cinema document templates with AI generation.
 * ~3.5 credits per document.
 */

export interface CinemaDocTemplate {
  id: string
  name: string
  nameEn: string
  category: 'legal' | 'financial' | 'creative' | 'production' | 'distribution'
  icon: string
  description: string
  sections: string[]
  estimatedCredits: number  // In display credits (not micro)
  estimatedPages: number
  requiredFields: DocField[]
  agentSlug: string         // Which agent generates this
  reviewAgent: string       // Which agent reviews (usually legal)
}

export interface DocField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'email'
  placeholder: string
  required: boolean
  options?: string[]
}

// ─── Common Fields ──────────────────────────────────────────────────

const PARTY_FIELDS: DocField[] = [
  { key: 'partyAName', label: 'Partie A (Nom complet)', type: 'text', placeholder: 'CINEGENY SAS', required: true },
  { key: 'partyAAddress', label: 'Adresse Partie A', type: 'text', placeholder: '123 rue du Cinéma, Paris', required: true },
  { key: 'partyBName', label: 'Partie B (Nom complet)', type: 'text', placeholder: 'Nom du co-contractant', required: true },
  { key: 'partyBAddress', label: 'Adresse Partie B', type: 'text', placeholder: 'Adresse complète', required: true },
]

const FILM_FIELDS: DocField[] = [
  { key: 'filmTitle', label: 'Titre du film', type: 'text', placeholder: 'Le titre provisoire ou définitif', required: true },
  { key: 'filmGenre', label: 'Genre', type: 'select', placeholder: 'Select', required: true, options: ['Drame', 'Comedy', 'Thriller', 'Science-Fiction', 'Documentaire', 'Animation', 'Horreur', 'Action', 'Romance', 'Autre'] },
  { key: 'filmDuration', label: 'Durée estimée (min)', type: 'number', placeholder: '90', required: false },
  { key: 'filmSynopsis', label: 'Synopsis court', type: 'textarea', placeholder: 'Résumé en 2-3 phrases', required: true },
]

// ─── Document Templates ─────────────────────────────────────────────

export const CINEMA_DOC_TEMPLATES: CinemaDocTemplate[] = [
  {
    id: 'rights-assignment',
    name: 'Contrat de Cession de Droits',
    nameEn: 'Rights Assignment Agreement',
    category: 'legal',
    icon: 'file-signature',
    description: 'Cession des droits d\'auteur, droits d\'exploitation et droits dérivés pour une œuvre cinématographique.',
    sections: ['Parties', 'Objet de la cession', 'Étendue des droits', 'Territoire et durée', 'Compensation', 'Garanties', 'Termination', 'Juridiction'],
    estimatedCredits: 3.5,
    estimatedPages: 8,
    requiredFields: [
      ...PARTY_FIELDS,
      ...FILM_FIELDS,
      { key: 'rightsScope', label: 'Périmètre des droits', type: 'select', placeholder: 'Type', required: true, options: ['Tous droits', 'Droits d\'exploitation cinéma', 'Droits TV/VOD', 'Droits numériques', 'Droits dérivés'] },
      { key: 'territory', label: 'Territoire', type: 'select', placeholder: 'Select', required: true, options: ['Monde entier', 'France', 'Europe', 'Francophonie', 'Autre'] },
      { key: 'duration', label: 'Durée de cession', type: 'select', placeholder: 'Duration', required: true, options: ['5 ans', '10 ans', '15 ans', '25 ans', 'Legal protection period'] },
      { key: 'compensation', label: 'Rémunération (€)', type: 'number', placeholder: '5000', required: true },
    ],
    agentSlug: 'cg-doc-legal',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'co-production',
    name: 'Accord de Co-Production',
    nameEn: 'Co-Production Agreement',
    category: 'legal',
    icon: 'handshake',
    description: 'Accord cadre de co-production entre deux ou plusieurs entités pour la réalisation d\'un film.',
    sections: ['Parties', 'Objet', 'Apports respectifs', 'Budget et financement', 'Répartition des recettes', 'Gouvernance', 'Crédits', 'Termination'],
    estimatedCredits: 4.0,
    estimatedPages: 12,
    requiredFields: [
      ...PARTY_FIELDS,
      ...FILM_FIELDS,
      { key: 'totalBudget', label: 'Budget total (€)', type: 'number', placeholder: '500000', required: true },
      { key: 'partyAShare', label: 'Part Partie A (%)', type: 'number', placeholder: '60', required: true },
      { key: 'partyBShare', label: 'Part Partie B (%)', type: 'number', placeholder: '40', required: true },
      { key: 'governance', label: 'Mode de gouvernance', type: 'select', placeholder: 'Select', required: true, options: ['Producteur délégué unique', 'Co-décision', 'Comité de pilotage'] },
    ],
    agentSlug: 'cg-doc-legal',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'distribution-contract',
    name: 'Contrat de Distribution',
    nameEn: 'Distribution Agreement',
    category: 'distribution',
    icon: 'globe',
    description: 'Contrat de distribution pour l\'exploitation d\'un film en salles, TV, VOD et plateformes numériques.',
    sections: ['Parties', 'Film concerné', 'Territoires', 'Modes d\'exploitation', 'Minimum garanti', 'Commission distributeur', 'Livrables', 'Durée'],
    estimatedCredits: 3.5,
    estimatedPages: 10,
    requiredFields: [
      ...PARTY_FIELDS,
      ...FILM_FIELDS,
      { key: 'distributionTerritory', label: 'Territoires', type: 'select', placeholder: 'Select', required: true, options: ['France', 'Europe', 'Amérique du Nord', 'Monde', 'Autre'] },
      { key: 'minimumGuarantee', label: 'Minimum garanti (€)', type: 'number', placeholder: '50000', required: false },
      { key: 'distributorCommission', label: 'Commission distributeur (%)', type: 'number', placeholder: '25', required: true },
      { key: 'exploitationModes', label: 'Modes d\'exploitation', type: 'select', placeholder: 'Sélectionnez', required: true, options: ['Tous modes', 'Salles uniquement', 'TV + VOD', 'Numérique uniquement', 'SVOD'] },
    ],
    agentSlug: 'cg-doc-distribution',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'nda-cinema',
    name: 'NDA Cinéma',
    nameEn: 'Cinema NDA',
    category: 'legal',
    icon: 'lock',
    description: 'Accord de confidentialité adapté au secteur cinématographique (scénarios, projets en développement).',
    sections: ['Parties', 'Objet', 'Informations confidentielles', 'Obligations', 'Duration', 'Exceptions', 'Sanctions'],
    estimatedCredits: 2.0,
    estimatedPages: 4,
    requiredFields: [
      ...PARTY_FIELDS,
      { key: 'projectName', label: 'Nom du projet', type: 'text', placeholder: 'Nom code ou titre', required: true },
      { key: 'ndaDuration', label: 'Durée de confidentialité', type: 'select', placeholder: 'Duration', required: true, options: ['2 ans', '3 ans', '5 ans', '10 ans'] },
      { key: 'scope', label: 'Périmètre', type: 'select', placeholder: 'Select', required: true, options: ['Screenplay', 'Projet complet', 'Informations financières', 'Tout'] },
    ],
    agentSlug: 'cg-doc-legal',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'production-budget',
    name: 'Devis de Production',
    nameEn: 'Production Budget',
    category: 'financial',
    icon: 'calculator',
    description: 'Devis détaillé de production cinématographique par poste budgétaire (développement, pré-production, tournage, post-production).',
    sections: ['Résumé', 'Développement', 'Pré-production', 'Tournage', 'Post-production', 'Frais généraux', 'Contingence', 'Total'],
    estimatedCredits: 3.0,
    estimatedPages: 6,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'totalBudget', label: 'Budget cible (€)', type: 'number', placeholder: '200000', required: true },
      { key: 'shootingDays', label: 'Jours de tournage', type: 'number', placeholder: '20', required: true },
      { key: 'crewSize', label: 'Taille équipe', type: 'select', placeholder: 'Select', required: true, options: ['Minimale (5-10)', 'Moyenne (10-25)', 'Large (25-50)', 'Complète (50+)'] },
      { key: 'locations', label: 'Nombre de décors', type: 'number', placeholder: '8', required: true },
      { key: 'vfxLevel', label: 'Niveau VFX', type: 'select', placeholder: 'Select', required: true, options: ['Aucun', 'Léger', 'Moyen', 'Intensif'] },
    ],
    agentSlug: 'cg-doc-finance',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck Film',
    nameEn: 'Film Pitch Deck',
    category: 'creative',
    icon: 'presentation',
    description: 'Présentation professionnelle pour pitcher un projet de film à des investisseurs, producteurs ou distributeurs.',
    sections: ['Couverture', 'Logline', 'Synopsis', 'Vision du réalisateur', 'Références visuelles', 'Personnages', 'Marché cible', 'Budget & Financement', 'Team', 'Planning', 'Contact'],
    estimatedCredits: 3.5,
    estimatedPages: 15,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'director', label: 'Director', type: 'text', placeholder: 'Nom du réalisateur', required: true },
      { key: 'targetAudience', label: 'Public cible', type: 'text', placeholder: 'Ex: 25-45 ans, amateurs de thriller', required: true },
      { key: 'budget', label: 'Budget estimé (€)', type: 'number', placeholder: '300000', required: true },
      { key: 'comparableFilms', label: 'Films comparables', type: 'textarea', placeholder: 'Ex: Parasite rencontre Get Out', required: true },
      { key: 'uniqueSellingPoint', label: 'Point fort unique', type: 'textarea', placeholder: 'Qu\'est-ce qui rend ce film unique ?', required: true },
    ],
    agentSlug: 'cg-doc-creative',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'funding-file',
    name: 'Dossier de Financement',
    nameEn: 'Funding Application',
    category: 'financial',
    icon: 'folder-open',
    description: 'Dossier complet pour demande de financement auprès du CNC, régions, fonds européens ou investisseurs privés.',
    sections: ['Résumé exécutif', 'Note d\'intention', 'Scénario (extrait)', 'Budget prévisionnel', 'Plan de financement', 'Calendrier', 'CV équipe', 'Stratégie de distribution'],
    estimatedCredits: 4.5,
    estimatedPages: 20,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'fundingSource', label: 'Source de financement visée', type: 'select', placeholder: 'Select', required: true, options: ['CNC - Avance sur recettes', 'Région / Collectivité', 'Fonds européen (Eurimages/MEDIA)', 'Investisseurs privés', 'Crowdfunding', 'Autre'] },
      { key: 'amountRequested', label: 'Montant demandé (€)', type: 'number', placeholder: '100000', required: true },
      { key: 'totalBudget', label: 'Budget total (€)', type: 'number', placeholder: '500000', required: true },
      { key: 'existingFunding', label: 'Financement déjà acquis (€)', type: 'number', placeholder: '150000', required: false },
      { key: 'directorNote', label: 'Note d\'intention (résumé)', type: 'textarea', placeholder: 'Vision artistique du réalisateur...', required: true },
    ],
    agentSlug: 'cg-doc-finance',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'directors-note',
    name: 'Note d\'Intention',
    nameEn: 'Director\'s Statement',
    category: 'creative',
    icon: 'pen-tool',
    description: 'Note d\'intention du réalisateur exprimant la vision artistique, les choix esthétiques et narratifs du film.',
    sections: ['Genèse du projet', 'Vision artistique', 'Parti pris narratif', 'Approche visuelle', 'Univers sonore', 'Direction d\'acteurs', 'Conclusion'],
    estimatedCredits: 2.5,
    estimatedPages: 5,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'director', label: 'Director', type: 'text', placeholder: 'Votre nom', required: true },
      { key: 'inspiration', label: 'Source d\'inspiration', type: 'textarea', placeholder: 'Qu\'est-ce qui vous a inspiré ce film ?', required: true },
      { key: 'visualStyle', label: 'Style visuel recherché', type: 'textarea', placeholder: 'Lumière, cadrage, palette de couleurs...', required: true },
      { key: 'themes', label: 'Thèmes principaux', type: 'text', placeholder: 'Ex: identité, famille, rédemption', required: true },
    ],
    agentSlug: 'cg-doc-creative',
    reviewAgent: 'cg-doc-reviewer',
  },
]

// ─── Document Categories ────────────────────────────────────────────

export const DOC_CATEGORIES = [
  { id: 'legal', label: 'Juridique', icon: 'scale', color: '#6366F1', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'legal').length },
  { id: 'financial', label: 'Finance', icon: 'calculator', color: '#10B981', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'financial').length },
  { id: 'creative', label: 'Créatif', icon: 'pen-tool', color: '#E50914', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'creative').length },
  { id: 'distribution', label: 'Distribution', icon: 'globe', color: '#3B82F6', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'distribution').length },
]

// ─── Factory Agents ─────────────────────────────────────────────────

export interface DocFactoryAgent {
  slug: string
  name: string
  role: string
  description: string
  icon: string
  color: string
  specialties: string[]
}

export const DOC_FACTORY_AGENTS: DocFactoryAgent[] = [
  {
    slug: 'cg-doc-legal',
    name: 'Juriste Cinéma',
    role: 'Rédaction juridique',
    description: 'Spécialisé dans le droit du cinéma et de l\'audiovisuel. Rédige contrats, cessions de droits, NDA et accords conformes au droit français et européen.',
    icon: 'scale',
    color: '#6366F1',
    specialties: ['droit d\'auteur', 'contrats', 'cession de droits', 'propriété intellectuelle'],
  },
  {
    slug: 'cg-doc-finance',
    name: 'Directeur Financier',
    role: 'Documents financiers',
    description: 'Expert en financement cinéma. Crée devis de production, plans de financement et dossiers conformes aux standards CNC/Eurimages.',
    icon: 'calculator',
    color: '#10B981',
    specialties: ['budget', 'financement', 'devis', 'prévisionnel'],
  },
  {
    slug: 'cg-doc-creative',
    name: 'Directeur Artistique',
    role: 'Documents créatifs',
    description: 'Traduit la vision artistique en documents professionnels : pitch decks, notes d\'intention, dossiers de présentation.',
    icon: 'pen-tool',
    color: '#E50914',
    specialties: ['pitch deck', 'note d\'intention', 'présentation', 'storytelling'],
  },
  {
    slug: 'cg-doc-distribution',
    name: 'Expert Distribution',
    role: 'Documents distribution',
    description: 'Spécialisé dans la distribution cinéma. Rédige contrats de distribution, accords de vente internationale et stratégies de sortie.',
    icon: 'globe',
    color: '#3B82F6',
    specialties: ['distribution', 'vente internationale', 'festivals', 'VOD/SVOD'],
  },
  {
    slug: 'cg-doc-reviewer',
    name: 'Réviseur Juridique',
    role: 'Review & Conformité',
    description: 'Vérifie la conformité juridique de tous les documents générés. Identifie les clauses manquantes, risques et incohérences.',
    icon: 'shield-check',
    color: '#F59E0B',
    specialties: ['conformité', 'review', 'risques', 'clauses obligatoires'],
  },
  {
    slug: 'cg-doc-formatter',
    name: 'Metteur en Page',
    role: 'Formatage & Export',
    description: 'Formate les documents aux standards professionnels du cinéma. Gère la mise en page, numérotation et export PDF/Word.',
    icon: 'file-text',
    color: '#8B5CF6',
    specialties: ['mise en page', 'PDF', 'Word', 'formatage professionnel'],
  },
  {
    slug: 'cg-doc-translator',
    name: 'Traducteur Cinéma',
    role: 'Traduction spécialisée',
    description: 'Traduit les documents cinéma en maintenant la terminologie juridique et technique exacte dans chaque langue.',
    icon: 'languages',
    color: '#EC4899',
    specialties: ['traduction FR/EN', 'terminologie cinéma', 'localisation juridique'],
  },
]
