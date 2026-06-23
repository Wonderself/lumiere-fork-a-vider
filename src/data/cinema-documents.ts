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
  { key: 'partyAAddress', label: 'Adresse Partie A', type: 'text', placeholder: '123 Cinema Street, Paris', required: true },
  { key: 'partyBName', label: 'Partie B (Nom complet)', type: 'text', placeholder: 'Nom du co-contractant', required: true },
  { key: 'partyBAddress', label: 'Adresse Partie B', type: 'text', placeholder: 'Full address', required: true },
]

const FILM_FIELDS: DocField[] = [
  { key: 'filmTitle', label: 'Titre du film', type: 'text', placeholder: 'The working or final title', required: true },
  { key: 'filmGenre', label: 'Genre', type: 'select', placeholder: 'Select', required: true, options: ['Drame', 'Comedy', 'Thriller', 'Science-Fiction', 'Documentaire', 'Animation', 'Horreur', 'Action', 'Romance', 'Autre'] },
  { key: 'filmDuration', label: 'Estimated duration (min)', type: 'number', placeholder: '90', required: false },
  { key: 'filmSynopsis', label: 'Synopsis court', type: 'textarea', placeholder: 'Summary in 2-3 sentences', required: true },
]

// ─── Document Templates ─────────────────────────────────────────────

export const CINEMA_DOC_TEMPLATES: CinemaDocTemplate[] = [
  {
    id: 'rights-assignment',
    name: 'Contrat de Cession de Droits',
    nameEn: 'Rights Assignment Agreement',
    category: 'legal',
    icon: 'file-signature',
    description: 'Assignment of copyright, exploitation rights and derivative rights for a cinematic work.',
    sections: ['Parties', 'Objet de la cession', 'Scope of rights', 'Territory and term', 'Compensation', 'Garanties', 'Termination', 'Juridiction'],
    estimatedCredits: 3.5,
    estimatedPages: 8,
    requiredFields: [
      ...PARTY_FIELDS,
      ...FILM_FIELDS,
      { key: 'rightsScope', label: 'Scope of rights', type: 'select', placeholder: 'Type', required: true, options: ['Tous droits', 'Theatrical exploitation rights', 'Droits TV/VOD', 'Digital rights', 'Derivative rights'] },
      { key: 'territory', label: 'Territoire', type: 'select', placeholder: 'Select', required: true, options: ['Monde entier', 'France', 'Europe', 'Francophonie', 'Autre'] },
      { key: 'duration', label: 'Assignment term', type: 'select', placeholder: 'Duration', required: true, options: ['5 ans', '10 ans', '15 ans', '25 ans', 'Legal protection period'] },
      { key: 'compensation', label: 'Compensation ($)', type: 'number', placeholder: '5000', required: true },
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
    description: 'Framework co-production agreement between two or more entities to make a film.',
    sections: ['Parties', 'Objet', 'Apports respectifs', 'Budget et financement', 'Revenue split', 'Gouvernance', 'Credits', 'Termination'],
    estimatedCredits: 4.0,
    estimatedPages: 12,
    requiredFields: [
      ...PARTY_FIELDS,
      ...FILM_FIELDS,
      { key: 'totalBudget', label: 'Budget total (€)', type: 'number', placeholder: '500000', required: true },
      { key: 'partyAShare', label: 'Part Partie A (%)', type: 'number', placeholder: '60', required: true },
      { key: 'partyBShare', label: 'Part Partie B (%)', type: 'number', placeholder: '40', required: true },
      { key: 'governance', label: 'Mode de gouvernance', type: 'select', placeholder: 'Select', required: true, options: ['Single lead producer', 'Joint decision', 'Steering committee'] },
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
    description: 'Distribution agreement for exploiting a film in theaters, TV, VOD and digital platforms.',
    sections: ['Parties', 'Related film', 'Territoires', 'Modes d\'exploitation', 'Minimum garanti', 'Commission distributeur', 'Livrables', 'Duration'],
    estimatedCredits: 3.5,
    estimatedPages: 10,
    requiredFields: [
      ...PARTY_FIELDS,
      ...FILM_FIELDS,
      { key: 'distributionTerritory', label: 'Territoires', type: 'select', placeholder: 'Select', required: true, options: ['France', 'Europe', 'North America', 'Monde', 'Autre'] },
      { key: 'minimumGuarantee', label: 'Minimum garanti (€)', type: 'number', placeholder: '50000', required: false },
      { key: 'distributorCommission', label: 'Commission distributeur (%)', type: 'number', placeholder: '25', required: true },
      { key: 'exploitationModes', label: 'Modes d\'exploitation', type: 'select', placeholder: 'Select', required: true, options: ['Tous modes', 'Salles uniquement', 'TV + VOD', 'Digital only', 'SVOD'] },
    ],
    agentSlug: 'cg-doc-distribution',
    reviewAgent: 'cg-doc-reviewer',
  },
  {
    id: 'nda-cinema',
    name: 'Film NDA',
    nameEn: 'Cinema NDA',
    category: 'legal',
    icon: 'lock',
    description: 'Confidentiality agreement tailored to the film industry (screenplays, projects in development).',
    sections: ['Parties', 'Objet', 'Informations confidentielles', 'Obligations', 'Duration', 'Exceptions', 'Sanctions'],
    estimatedCredits: 2.0,
    estimatedPages: 4,
    requiredFields: [
      ...PARTY_FIELDS,
      { key: 'projectName', label: 'Nom du projet', type: 'text', placeholder: 'Nom code ou titre', required: true },
      { key: 'ndaDuration', label: 'Confidentiality term', type: 'select', placeholder: 'Duration', required: true, options: ['2 ans', '3 ans', '5 ans', '10 ans'] },
      { key: 'scope', label: 'Scope', type: 'select', placeholder: 'Select', required: true, options: ['Screenplay', 'Projet complet', 'Financial information', 'Tout'] },
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
    description: 'Detailed film production budget by line item (development, pre-production, shooting, post-production).',
    sections: ['Summary', 'Development', 'Pre-production', 'Tournage', 'Post-production', 'Overhead', 'Contingence', 'Total'],
    estimatedCredits: 3.0,
    estimatedPages: 6,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'totalBudget', label: 'Budget cible (€)', type: 'number', placeholder: '200000', required: true },
      { key: 'shootingDays', label: 'Jours de tournage', type: 'number', placeholder: '20', required: true },
      { key: 'crewSize', label: 'Crew size', type: 'select', placeholder: 'Select', required: true, options: ['Minimale (5-10)', 'Moyenne (10-25)', 'Large (25-50)', 'Full (50+)'] },
      { key: 'locations', label: 'Number of sets', type: 'number', placeholder: '8', required: true },
      { key: 'vfxLevel', label: 'Niveau VFX', type: 'select', placeholder: 'Select', required: true, options: ['Aucun', 'Light', 'Moyen', 'Intensif'] },
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
    description: 'Professional presentation to pitch a film project to investors, producers or distributors.',
    sections: ['Couverture', 'Logline', 'Synopsis', 'Director\'s vision', 'Visual references', 'Personnages', 'Target market', 'Budget & Financement', 'Team', 'Planning', 'Contact'],
    estimatedCredits: 3.5,
    estimatedPages: 15,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'director', label: 'Director', type: 'text', placeholder: 'Director\'s name', required: true },
      { key: 'targetAudience', label: 'Public cible', type: 'text', placeholder: 'Ex: 25-45 ans, amateurs de thriller', required: true },
      { key: 'budget', label: 'Estimated budget ($)', type: 'number', placeholder: '300000', required: true },
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
    description: 'Complete application for funding from the CNC, regions, European funds or private investors.',
    sections: ['Executive summary', 'Note d\'intention', 'Screenplay (excerpt)', 'Projected budget', 'Plan de financement', 'Calendrier', 'Crew CVs', 'Distribution strategy'],
    estimatedCredits: 4.5,
    estimatedPages: 20,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'fundingSource', label: 'Target funding source', type: 'select', placeholder: 'Select', required: true, options: ['CNC - Avance sur recettes', 'Region / Authority', 'European fund (Eurimages/MEDIA)', 'Private investors', 'Crowdfunding', 'Autre'] },
      { key: 'amountRequested', label: 'Amount requested ($)', type: 'number', placeholder: '100000', required: true },
      { key: 'totalBudget', label: 'Budget total (€)', type: 'number', placeholder: '500000', required: true },
      { key: 'existingFunding', label: 'Funding already secured ($)', type: 'number', placeholder: '150000', required: false },
      { key: 'directorNote', label: 'Statement of intent (summary)', type: 'textarea', placeholder: 'The director\'s artistic vision...', required: true },
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
    description: 'The director\'s statement of intent expressing the artistic vision and the film\'s aesthetic and narrative choices.',
    sections: ['Origin of the project', 'Vision artistique', 'Parti pris narratif', 'Approche visuelle', 'Univers sonore', 'Direction d\'acteurs', 'Conclusion'],
    estimatedCredits: 2.5,
    estimatedPages: 5,
    requiredFields: [
      ...FILM_FIELDS,
      { key: 'director', label: 'Director', type: 'text', placeholder: 'Votre nom', required: true },
      { key: 'inspiration', label: 'Source d\'inspiration', type: 'textarea', placeholder: 'What inspired this film?', required: true },
      { key: 'visualStyle', label: 'Desired visual style', type: 'textarea', placeholder: 'Lighting, framing, color palette...', required: true },
      { key: 'themes', label: 'Main themes', type: 'text', placeholder: 'e.g. identity, family, redemption', required: true },
    ],
    agentSlug: 'cg-doc-creative',
    reviewAgent: 'cg-doc-reviewer',
  },
]

// ─── Document Categories ────────────────────────────────────────────

export const DOC_CATEGORIES = [
  { id: 'legal', label: 'Juridique', icon: 'scale', color: '#6366F1', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'legal').length },
  { id: 'financial', label: 'Finance', icon: 'calculator', color: '#10B981', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'financial').length },
  { id: 'creative', label: 'Creative', icon: 'pen-tool', color: '#E50914', count: CINEMA_DOC_TEMPLATES.filter(t => t.category === 'creative').length },
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
    name: 'Film lawyer',
    role: 'Legal drafting',
    description: 'Specialized in film and audiovisual law. Drafts contracts, rights assignments, NDAs and agreements compliant with French and European law.',
    icon: 'scale',
    color: '#6366F1',
    specialties: ['droit d\'auteur', 'contrats', 'cession de droits', 'intellectual property'],
  },
  {
    slug: 'cg-doc-finance',
    name: 'Directeur Financier',
    role: 'Documents financiers',
    description: 'Film financing expert. Creates production budgets, financing plans and dossiers compliant with CNC/Eurimages standards.',
    icon: 'calculator',
    color: '#10B981',
    specialties: ['budget', 'financement', 'devis', 'forecast'],
  },
  {
    slug: 'cg-doc-creative',
    name: 'Directeur Artistique',
    role: 'Creative documents',
    description: 'Turns the artistic vision into professional documents: pitch decks, statements of intent, presentation dossiers.',
    icon: 'pen-tool',
    color: '#E50914',
    specialties: ['pitch deck', 'note d\'intention', 'presentation', 'storytelling'],
  },
  {
    slug: 'cg-doc-distribution',
    name: 'Expert Distribution',
    role: 'Documents distribution',
    description: 'Specialized in film distribution. Drafts distribution contracts, international sales agreements and release strategies.',
    icon: 'globe',
    color: '#3B82F6',
    specialties: ['distribution', 'vente internationale', 'festivals', 'VOD/SVOD'],
  },
  {
    slug: 'cg-doc-reviewer',
    name: 'Legal reviewer',
    role: 'Review & compliance',
    description: 'Checks the legal compliance of all generated documents. Identifies missing clauses, risks and inconsistencies.',
    icon: 'shield-check',
    color: '#F59E0B',
    specialties: ['compliance', 'review', 'risques', 'clauses obligatoires'],
  },
  {
    slug: 'cg-doc-formatter',
    name: 'Metteur en Page',
    role: 'Formatage & Export',
    description: 'Formats documents to professional film standards. Handles layout, numbering and PDF/Word export.',
    icon: 'file-text',
    color: '#8B5CF6',
    specialties: ['mise en page', 'PDF', 'Word', 'formatage professionnel'],
  },
  {
    slug: 'cg-doc-translator',
    name: 'Film translator',
    role: 'Specialized translation',
    description: 'Translates film documents while keeping the exact legal and technical terminology in each language.',
    icon: 'languages',
    color: '#EC4899',
    specialties: ['traduction FR/EN', 'film terminology', 'localisation juridique'],
  },
]
