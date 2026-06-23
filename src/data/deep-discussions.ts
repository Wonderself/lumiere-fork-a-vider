/**
 * CineGeny Deep Discussions — Cinema & Culture
 * 85+ templates, 7 agents, 16 categories, 17 tags
 * Opus + Extended Thinking for maximum depth.
 */

// ─── 7 Discussion Agents ────────────────────────────────────────────

export interface DiscussionAgent {
  slug: string
  name: string
  role: string
  description: string
  icon: string
  color: string
  expertise: string[]
  model: string
}

export const DISCUSSION_AGENTS: DiscussionAgent[] = [
  {
    slug: 'cg-cine-philosopher',
    name: 'Cinema Philosopher',
    role: 'Philosophical analysis',
    description: 'Explores the philosophical dimensions of cinema: ontology of the image, phenomenology of the viewer, ethics of representation.',
    icon: 'brain',
    color: '#7C3AED',
    expertise: ['philosophie', 'ontologie', 'phenomenology', 'aesthetic', 'ethical'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-historian',
    name: 'Cinema Historian',
    role: 'Histoire & mouvements',
    description: 'Expert in the history of world cinema. From the Lumière brothers to streaming, by way of the New Wave and Dogme 95.',
    icon: 'book-open',
    color: '#B45309',
    expertise: ['histoire', 'mouvements', 'technical evolution', 'world cinema', 'patrimoine'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-critic',
    name: 'Art Critic',
    role: 'Analyse critique',
    description: 'Rigorous critical analysis of cinematic works. Deconstructs films, identifies influences, evaluates innovation.',
    icon: 'eye',
    color: '#DC2626',
    expertise: ['critique', 'analyse', 'deconstruction', 'influences', 'innovation'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-sociologist',
    name: 'Cinema Sociologist',
    role: 'Impact social & culturel',
    description: 'Studies cinema as a mirror and engine of society. Representation, diversity, cultural impact, industry.',
    icon: 'users',
    color: '#0891B2',
    expertise: ['sociologie', 'representation', 'diversity', 'industrie', 'audience'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-narratologist',
    name: 'Narratologist',
    role: 'Techniques narratives',
    description: 'Specialist in cinematic storytelling. Structure, characters, arcs, time, point of view, subtext.',
    icon: 'pen-tool',
    color: '#2563EB',
    expertise: ['narration', 'structure', 'personnages', 'dramaturgie', 'sous-texte'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-futurist',
    name: 'Cinema Futurist',
    role: 'Futur de l\'industrie',
    description: 'Anticipates the evolution of cinema: generative AI, virtual reality, distribution, creative economy, copyright.',
    icon: 'rocket',
    color: '#059669',
    expertise: ['futurisme', 'IA', 'technologie', 'distribution', 'creative economy'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-provocateur',
    name: 'The Devil\'s Advocate',
    role: 'Challenge & Debate',
    description: 'Plays devil\'s advocate. Challenges opinions, pushes thinking, exposes contradictions. Challenge Mode on.',
    icon: 'flame',
    color: '#E11D48',
    expertise: ['debate', 'contradiction', 'rhetoric', 'provocation intellectuelle', 'dialectique'],
    model: 'claude-opus-4-6',
  },
]

// ─── 16 Categories ──────────────────────────────────────────────────

export interface DiscussionCategory {
  id: string
  label: string
  icon: string
  color: string
  description: string
  defaultAgent: string
}

export const DISCUSSION_CATEGORIES: DiscussionCategory[] = [
  { id: 'film-analysis', label: 'Film Analysis', icon: 'film', color: '#E50914', description: 'Dissect a film in depth', defaultAgent: 'cg-cine-critic' },
  { id: 'philosophy', label: 'Philosophy', icon: 'brain', color: '#7C3AED', description: 'Cinema and philosophical thought', defaultAgent: 'cg-cine-philosopher' },
  { id: 'ethics', label: 'Ethics', icon: 'shield', color: '#DC2626', description: 'Ethical questions of representation', defaultAgent: 'cg-cine-philosopher' },
  { id: 'history', label: 'Histoire', icon: 'book-open', color: '#B45309', description: 'Movements and the evolution of cinema', defaultAgent: 'cg-cine-historian' },
  { id: 'narrative', label: 'Narration', icon: 'pen-tool', color: '#2563EB', description: 'Narrative techniques and structures', defaultAgent: 'cg-cine-narratologist' },
  { id: 'society', label: 'Company', icon: 'users', color: '#0891B2', description: 'Cinema and contemporary society', defaultAgent: 'cg-cine-sociologist' },
  { id: 'representation', label: 'Representation', icon: 'eye', color: '#DB2777', description: 'Diversity and inclusion on screen', defaultAgent: 'cg-cine-sociologist' },
  { id: 'technology', label: 'Technologie', icon: 'cpu', color: '#059669', description: 'AI, VR, and the technical future', defaultAgent: 'cg-cine-futurist' },
  { id: 'industry', label: 'Industrie', icon: 'building', color: '#6366F1', description: 'Film business and economics', defaultAgent: 'cg-cine-futurist' },
  { id: 'auteur', label: 'Auteur Cinema', icon: 'star', color: '#F59E0B', description: 'Vision, style, signature', defaultAgent: 'cg-cine-critic' },
  { id: 'genre', label: 'Genres', icon: 'layers', color: '#EC4899', description: 'Exploring film genres', defaultAgent: 'cg-cine-historian' },
  { id: 'sound-music', label: 'Son & Musique', icon: 'music', color: '#14B8A6', description: 'Bande son, sound design, score', defaultAgent: 'cg-cine-critic' },
  { id: 'visual', label: 'Langage Visuel', icon: 'camera', color: '#8B5CF6', description: 'Cinematography, composition, light', defaultAgent: 'cg-cine-critic' },
  { id: 'adaptation', label: 'Adaptations', icon: 'book', color: '#78716C', description: 'From book to film, fidelity vs creation', defaultAgent: 'cg-cine-narratologist' },
  { id: 'global', label: 'World Cinema', icon: 'globe', color: '#0EA5E9', description: 'Cinemas from around the world', defaultAgent: 'cg-cine-historian' },
  { id: 'debate', label: 'Debates', icon: 'flame', color: '#E11D48', description: 'Questions polarisantes, mode Challenge', defaultAgent: 'cg-cine-provocateur' },
]

// ─── 17 Tags ────────────────────────────────────────────────────────

export const DISCUSSION_TAGS = [
  'narrative', 'visual', 'sonore', 'philosophical', 'politique',
  'social', 'technological', 'historical', 'ethical', 'aesthetic',
  'economic', 'psychological', 'anthropologique', 'feminist',
  'postcolonial', 'ecological', 'experimental',
]

// ─── Sensitivity Alerts ─────────────────────────────────────────────

export const SENSITIVITY_TOPICS = [
  { id: 'religion', label: 'Religion', icon: '\u{1F54A}\uFE0F', color: '#F59E0B' },
  { id: 'politics', label: 'Politique', icon: '\u{1F3DB}\uFE0F', color: '#3B82F6' },
  { id: 'violence', label: 'Violence', icon: '\u26A0\uFE0F', color: '#EF4444' },
  { id: 'representation', label: 'Representation', icon: '\u{1F30D}', color: '#8B5CF6' },
  { id: 'sexuality', label: 'Sexuality', icon: '\u2764\uFE0F', color: '#EC4899' },
  { id: 'mental-health', label: 'Mental health', icon: '\u{1F9E0}', color: '#14B8A6' },
]

// ─── 85+ Discussion Templates ───────────────────────────────────────

export interface DiscussionTemplate {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  agent: string
  depth: 'exploration' | 'approfondissement' | 'synthese'
  challengeMode?: boolean
  sensitivityFlags?: string[]
  prompts: {
    exploration: string
    approfondissement: string
    synthese: string
  }
}

export const DISCUSSION_TEMPLATES: DiscussionTemplate[] = [
  // ── ANALYSE FILMIQUE (8) ──
  { id: 'fa-1', title: 'Deconstructing a masterpiece', description: 'Shot-by-shot, sequence-by-sequence analysis of a major film.', category: 'film-analysis', tags: ['narrative', 'visual', 'aesthetics'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Let\'s analyze this film layer by layer. Let\'s start with the narrative structure.', approfondissement: 'Let\'s dig into the visual choices and their emotional impact on the viewer.', synthese: 'Let\'s synthesize: what is this film\'s contribution to world cinema?' } },
  { id: 'fa-2', title: 'Symbolism and subtext', description: 'Decoding the hidden symbols and layers of meaning in a film.', category: 'film-analysis', tags: ['philosophical', 'aesthetics', 'psychological'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'What recurring symbols do you identify in this film?', approfondissement: 'How do these symbols build a coherent subtext?', synthese: 'Quelle lecture symbolique globale proposez-vous ?' } },
  { id: 'fa-3', title: 'Direction d\'acteurs', description: 'Analyzing the actor-direction work and the performances.', category: 'film-analysis', tags: ['narrative', 'psychological'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'How does the director guide the actors in this film?', approfondissement: 'Let\'s analyze the acting choices and their impact on the storytelling.', synthese: 'What does actor direction contribute to the final work?' } },
  { id: 'fa-4', title: 'Editing and rhythm', description: 'A study of editing as a narrative language.', category: 'film-analysis', tags: ['narrative', 'visual'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'How does editing structure the narrative?', approfondissement: 'Let\'s analyze the rhythm and its emotional variations.', synthese: 'How is this film\'s editing innovative or significant?' } },
  { id: 'fa-5', title: 'First vs last scene', description: 'Comparing the opening and the closing of a film.', category: 'film-analysis', tags: ['narrative', 'aesthetic'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'What does the opening scene tell us about the whole film?', approfondissement: 'How does the final scene answer the opening promise?', synthese: 'What narrative arc emerges between these two poles?' } },
  { id: 'fa-6', title: 'Sound design as storytelling', description: 'Sound as a narrative and emotional vehicle.', category: 'film-analysis', tags: ['sonore', 'aesthetic'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'How does sound contribute to the storytelling?', approfondissement: 'Let\'s analyze the most striking sound-design choices.', synthese: 'What is this film\'s sonic signature?' } },
  { id: 'fa-7', title: 'Color and emotion', description: 'Chromatic analysis and emotional palette.', category: 'film-analysis', tags: ['visual', 'aesthetic', 'psychological'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Quelle palette chromatique domine ce film ?', approfondissement: 'How do colors convey emotions?', synthese: 'What color system does the film propose?' } },
  { id: 'fa-8', title: 'Film as a sensory experience', description: 'Beyond narrative: film as total immersion.', category: 'film-analysis', tags: ['aesthetic', 'philosophical', 'experimental'], agent: 'cg-cine-philosopher', depth: 'approfondissement', prompts: { exploration: 'How does this film engage our senses beyond sight?', approfondissement: 'What phenomenology of the viewer does this film propose?', synthese: 'How does this film redefine the cinematic experience?' } },

  // ── PHILOSOPHIE (7) ──
  { id: 'ph-1', title: 'Cinema and reality', description: 'Can cinema capture reality, or does it create it?', category: 'philosophy', tags: ['philosophical', 'aesthetic'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Is cinema a window onto the real or a construction?', approfondissement: 'What do Bazin and Deleuze teach us about the movement-image?', synthese: 'What ontology of the cinematic image do you propose?' } },
  { id: 'ph-2', title: 'The viewer as co-creator', description: 'Le film existe-t-il sans spectateur ?', category: 'philosophy', tags: ['philosophical', 'psychological'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'What role does the viewer play in creating meaning?', approfondissement: 'How does reception transform the work?', synthese: 'Is the viewer a co-author of the film?' } },
  { id: 'ph-3', title: 'Time and cinema', description: 'How does cinema manipulate our perception of time?', category: 'philosophy', tags: ['philosophical', 'narrative'], agent: 'cg-cine-philosopher', depth: 'approfondissement', prompts: { exploration: 'What are the tenses of cinema?', approfondissement: 'How do Tarkovsky and Bergman sculpt time?', synthese: 'Is cinema the art of time par excellence?' } },
  { id: 'ph-4', title: 'The death of the author in cinema', description: 'Is auteur theory still relevant?', category: 'philosophy', tags: ['philosophical', 'aesthetic'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'La politique des auteurs a-t-elle encore un sens ?', approfondissement: 'How do we reconcile the auteur with a collaborative industry?', synthese: 'Who is the author of a film?' } },
  { id: 'ph-5', title: 'The cinematic illusion', description: 'Why do we cry for fictional characters?', category: 'philosophy', tags: ['philosophical', 'psychological'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Why does the illusion of cinema work?', approfondissement: 'What is \'suspension of disbelief\'?', synthese: 'Is cinema the most powerful of the illusion arts?' } },
  { id: 'ph-6', title: 'The aesthetics of violence', description: 'Violence in cinema: art or indulgence?', category: 'philosophy', tags: ['ethical', 'aesthetic', 'philosophical'], agent: 'cg-cine-philosopher', depth: 'approfondissement', sensitivityFlags: ['violence'], prompts: { exploration: 'Can violence be aesthetic?', approfondissement: 'Tarantino, Refn, Park Chan-wook: the stylization of violence.', synthese: 'Where is the line between art and indulgence?' } },
  { id: 'ph-7', title: 'Cinema and memory', description: 'Cinema as humanity\'s collective memory.', category: 'philosophy', tags: ['philosophical', 'historical', 'social'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Can cinema serve as a collective memory?', approfondissement: 'How do films shape our memory of the past?', synthese: 'Is cinema the best guardian of our memory?' } },

  // ── ETHICS (6) ──
  { id: 'et-1', title: 'AI and copyright', description: 'Who holds the rights to an AI-generated film?', category: 'ethics', tags: ['ethics', 'technological', 'economic'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Can AI be considered an author?', approfondissement: 'What legal implications for AI cinema?', synthese: 'What ethical framework should we propose for AI creation?' } },
  { id: 'et-2', title: 'Consent and deepfakes', description: 'The ethical limits of image manipulation.', category: 'ethics', tags: ['ethics', 'technological'], agent: 'cg-cine-philosopher', depth: 'approfondissement', sensitivityFlags: ['representation'], prompts: { exploration: 'Do deepfakes pose a fundamental ethical problem?', approfondissement: 'Consent, identity and image rights in the age of AI.', synthese: 'How do we protect individuals while still allowing creation?' } },
  { id: 'et-3', title: 'The filmmaker\'s responsibility', description: 'Does the filmmaker have a moral responsibility?', category: 'ethics', tags: ['ethical', 'social'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Does a filmmaker have responsibilities toward society?', approfondissement: 'Engaged art vs art for art\'s sake: must we choose?', synthese: 'What ethics for the filmmaker in the 21st century?' } },
  { id: 'et-4', title: 'Representation of minorities', description: 'Inclusion and authenticity in on-screen representation.', category: 'ethics', tags: ['ethics', 'social', 'feminist', 'postcolonial'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'How do we assess the quality of representation?', approfondissement: 'Beyond visibility: authenticity and agency.', synthese: 'What criteria for fair and rich representation?' } },
  { id: 'et-5', title: 'Cinema and propaganda', description: 'The line between persuasion and manipulation.', category: 'ethics', tags: ['ethical', 'politique', 'historical'], agent: 'cg-cine-historian', depth: 'approfondissement', sensitivityFlags: ['politics'], prompts: { exploration: 'Is every film propaganda?', approfondissement: 'From Riefenstahl to Marvel: cinema in the service of ideology.', synthese: 'How do we develop a critical eye toward cinematic persuasion?' } },
  { id: 'et-6', title: 'Animal exploitation in cinema', description: 'From real to CGI: the treatment of animals in films.', category: 'ethics', tags: ['ethical', 'ecological'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Is the use of real animals in film justifiable?', approfondissement: 'Does CGI offer a satisfying ethical alternative?', synthese: 'Toward a cinema without animal exploitation?' } },

  // ── HISTOIRE (6) ──
  { id: 'hi-1', title: 'The New Wave and its children', description: 'The legacy and influence of the movement that changed cinema.', category: 'history', tags: ['historical', 'aesthetic'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'What did the New Wave really change?', approfondissement: 'Its heirs today: who carries the torch?', synthese: 'Is the New Wave the greatest cinematic movement?' } },
  { id: 'hi-2', title: 'Hollywood vs national cinemas', description: 'American dominance and cultural resistance.', category: 'history', tags: ['historical', 'economic', 'politique'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'How did Hollywood conquer the world?', approfondissement: 'What cultural resistances exist?', synthese: 'Is a world cinema possible in the face of Hollywood?' } },
  { id: 'hi-3', title: 'Du muet au parlant', description: 'The sound-cinema revolution.', category: 'history', tags: ['historical', 'sonore'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'What did we gain and lose with sound?', approfondissement: 'Silent film as a complete art in itself.', synthese: 'Does silent cinema still have something to teach us?' } },
  { id: 'hi-4', title: 'Italian neorealism', description: 'When cinema looked reality in the face.', category: 'history', tags: ['historical', 'social', 'aesthetic'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Why does neorealism remain so influential?', approfondissement: 'De Sica, Rossellini, Visconti: three visions of the real.', synthese: 'Did neorealism create modern cinema?' } },
  { id: 'hi-5', title: 'Animated cinema: a major art form', description: 'Animation as an art form in its own right.', category: 'history', tags: ['historical', 'aesthetics', 'experimental'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Is animation a genre or a medium?', approfondissement: 'From Disney to Miyazaki: visions of animation.', synthese: 'Can animation surpass live-action cinema?' } },
  { id: 'hi-6', title: 'Genre cinema rehabilitated', description: 'When horror and sci-fi become art.', category: 'history', tags: ['historical', 'aesthetics'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Why was genre cinema looked down on for so long?', approfondissement: 'Jordan Peele, Denis Villeneuve: the legitimization of genre.', synthese: 'Is genre the future of auteur cinema?' } },

  // ── NARRATION (6) ──
  { id: 'na-1', title: 'La structure en 3 actes est-elle morte ?', description: 'Questioning the dominant narrative paradigm.', category: 'narrative', tags: ['narrative', 'aesthetic'], agent: 'cg-cine-narratologist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Is the 3-act structure a straitjacket or a tool?', approfondissement: 'What narrative alternatives are emerging?', synthese: 'Must we deconstruct structures in order to reinvent them?' } },
  { id: 'na-2', title: 'Le narrateur non-fiable', description: 'When the film lies to the viewer.', category: 'narrative', tags: ['narrative', 'psychological'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'What is an unreliable narrator in cinema?', approfondissement: 'Fight Club, Shutter Island, Gone Girl: the art of the lie.', synthese: 'Does the unreliable narrator fundamentally change the experience?' } },
  { id: 'na-3', title: 'Temporal non-linearity', description: 'Flashbacks, loops, reversed time.', category: 'narrative', tags: ['narrative', 'philosophical'], agent: 'cg-cine-narratologist', depth: 'approfondissement', prompts: { exploration: 'Why break chronology?', approfondissement: 'Nolan, Tarantino, Denis Villeneuve: architects of time.', synthese: 'Is non-linearity a narrative advance?' } },
  { id: 'na-4', title: 'Show don\'t tell', description: 'L\'art de raconter sans mots.', category: 'narrative', tags: ['narrative', 'visual'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'How can a film tell a story without dialogue?', approfondissement: 'The masters of silence: Kubrick, Tarkovsky, Malick.', synthese: 'Is cinema stronger when it stays silent?' } },
  { id: 'na-5', title: 'Le MacGuffin Hitchcockien', description: 'L\'objet qui motive l\'intrigue mais n\'a pas d\'importance.', category: 'narrative', tags: ['narrative', 'aesthetic'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'What is a MacGuffin and why does it work?', approfondissement: 'Modern MacGuffins: from the Pulp Fiction briefcase to the Grail.', synthese: 'Is the MacGuffin the secret of every good thriller?' } },
  { id: 'na-6', title: 'Open ending vs closed ending', description: 'The power of narrative ambiguity.', category: 'narrative', tags: ['narrative', 'philosophical'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Is an open ending richer than a closed one?', approfondissement: 'Inception, Lost in Translation, 2001 : l\'art de ne pas conclure.', synthese: 'Is the best ending the one the viewer writes?' } },

  // ── SOCIETY (6) ──
  { id: 'so-1', title: 'Cinema and gentrification', description: 'When cinema reflects and accelerates urban transformation.', category: 'society', tags: ['social', 'politique', 'economic'], agent: 'cg-cine-sociologist', depth: 'exploration', prompts: { exploration: 'How does cinema represent gentrification?', approfondissement: 'Does cinema contribute to cultural gentrification?', synthese: 'What role does cinema play in social transformation?' } },
  { id: 'so-2', title: 'Cinema and masculinity', description: 'The evolution of male representation on screen.', category: 'society', tags: ['social', 'feminist', 'psychological'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'How has masculinity evolved in cinema?', approfondissement: 'From John Wayne to Timothée Chalamet: which role models?', synthese: 'Can cinema redefine masculinity?' } },
  { id: 'so-3', title: 'Pandemic films after COVID', description: 'How post-pandemic cinema has changed.', category: 'society', tags: ['social', 'historical'], agent: 'cg-cine-sociologist', depth: 'exploration', prompts: { exploration: 'Is post-COVID cinema fundamentally different?', approfondissement: 'Streaming, theaters, distribution: the new landscape.', synthese: 'Did the pandemic accelerate a revolution already underway?' } },
  { id: 'so-4', title: 'Cinema and mental health', description: 'Representation of mental illness on screen.', category: 'society', tags: ['social', 'psychological', 'ethics'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['mental-health'], prompts: { exploration: 'Does cinema help destigmatize mental health?', approfondissement: 'Joker, Silver Linings, Girl Interrupted: fair representation?', synthese: 'What is the real impact of films on the perception of mental health?' } },
  { id: 'so-5', title: 'Cinema and climate change', description: 'The screen as an ecological alarm.', category: 'society', tags: ['social', 'ecological', 'politique'], agent: 'cg-cine-sociologist', depth: 'exploration', prompts: { exploration: 'Can cinema raise awareness of climate change?', approfondissement: 'From Don\'t Look Up to Avatar: the effectiveness of the ecological message.', synthese: 'Is cinema a tool for change or just a mirror?' } },
  { id: 'so-6', title: 'Cancel culture and cinema', description: 'Should we separate the artist from the work?', category: 'society', tags: ['social', 'ethical', 'politique'], agent: 'cg-cine-sociologist', depth: 'approfondissement', challengeMode: true, sensitivityFlags: ['politics'], prompts: { exploration: 'Can we separate the artist from their work?', approfondissement: 'Polanski, Allen, Spacey: concrete cases and nuance.', synthese: 'What ethical framework for consuming \'problematic\' art?' } },

  // ── REPRESENTATION (5) ──
  { id: 're-1', title: 'The Female Gaze', description: 'When women film women.', category: 'representation', tags: ['feminist', 'aesthetic', 'social'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'What is the Female Gaze?', approfondissement: 'Greta Gerwig, Céline Sciamma, Sofia Coppola: defining the female gaze.', synthese: 'Does the Female Gaze fundamentally change storytelling?' } },
  { id: 're-2', title: 'Afrofuturism in cinema', description: 'Imagining the future through an Afro-descendant lens.', category: 'representation', tags: ['postcolonial', 'social', 'aesthetic'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'What is Afrofuturism in cinema?', approfondissement: 'Black Panther, Sorry to Bother You : visions du futur noir.', synthese: 'Is Afrofuturism a new cinematic movement?' } },
  { id: 're-3', title: 'Queer cinema', description: 'Visibility and the evolution of LGBTQ+ representation.', category: 'representation', tags: ['social', 'feminist', 'politique'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['sexuality', 'representation'], prompts: { exploration: 'How has queer cinema evolved?', approfondissement: 'From coded Brokeback Mountain to militant queer cinema.', synthese: 'Does queer cinema need a separate category?' } },
  { id: 're-4', title: 'Disability in cinema', description: 'Between inspiration porn and authentic representation.', category: 'representation', tags: ['social', 'ethical'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Does cinema represent disability well?', approfondissement: 'Intouchables: popular hit or a representation problem?', synthese: 'What standards for a respectful representation of disability?' } },
  { id: 're-5', title: 'Cinematic orientalism', description: 'The Western gaze on the East.', category: 'representation', tags: ['postcolonial', 'politique', 'historical'], agent: 'cg-cine-sociologist', depth: 'approfondissement', sensitivityFlags: ['representation', 'politics'], prompts: { exploration: 'What is orientalism in cinema?', approfondissement: 'From Lawrence of Arabia to Aladdin: deconstructing stereotypes.', synthese: 'How can cinema move beyond orientalism?' } },

  // ── TECHNOLOGIE (5) ──
  { id: 'te-1', title: 'Generative AI and cinema', description: 'Will AI replace filmmakers?', category: 'technology', tags: ['technological', 'ethics', 'economic'], agent: 'cg-cine-futurist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Does generative AI threaten cinematic creation?', approfondissement: 'AI-written scripts, synthetic actors, automated editing.', synthese: 'Is AI a tool or a replacement?' } },
  { id: 'te-2', title: 'Narrative virtual reality', description: 'VR as a new cinematic medium.', category: 'technology', tags: ['technological', 'narrative', 'experimental'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Can VR tell stories the way cinema does?', approfondissement: 'What changes in the shift from viewer to participant?', synthese: 'Is VR the cinema of tomorrow or a distinct medium?' } },
  { id: 'te-3', title: 'Volume LED (The Mandalorian)', description: 'The virtual-set revolution.', category: 'technology', tags: ['technological', 'visual'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'How are LED stages changing production?', approfondissement: 'Pros and cons vs green screen vs real sets.', synthese: 'Will virtual sets make locations obsolete?' } },
  { id: 'te-4', title: 'Streaming vs Salle', description: 'The great distribution debate.', category: 'technology', tags: ['technological', 'economic', 'social'], agent: 'cg-cine-futurist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Is the movie theater doomed?', approfondissement: 'The Netflix, Apple, A24 models: who wins?', synthese: 'What future for the collective experience of cinema?' } },
  { id: 'te-5', title: 'Deepfakes and digital resurrection', description: 'Bringing the dead back to the screen.', category: 'technology', tags: ['technological', 'ethics'], agent: 'cg-cine-futurist', depth: 'approfondissement', sensitivityFlags: ['representation'], prompts: { exploration: 'Is it ethical to digitally resurrect a deceased actor?', approfondissement: 'Carrie Fisher, Paul Walker: concrete cases and implications.', synthese: 'What limits should we set on digital resurrection?' } },

  // ── INDUSTRIE (5) ──
  { id: 'in-1', title: 'The attention economy', description: 'How cinema fights for our attention.', category: 'industry', tags: ['economic', 'social', 'technological'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Can cinema compete with TikTok for our attention?', approfondissement: 'Short, episodic, interactive formats: adaptations.', synthese: 'How can cinema stay relevant in the attention economy?' } },
  { id: 'in-2', title: 'Festivals: gatekeepers or discoverers?', description: 'The role of festivals in the film ecosystem.', category: 'industry', tags: ['economic', 'politique'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Do festivals still serve to discover talent?', approfondissement: 'Cannes, Sundance, Berlin: what real power?', synthese: 'Must festivals reinvent themselves?' } },
  { id: 'in-3', title: 'Franchise fatigue', description: 'Le public en a-t-il assez des suites et franchises ?', category: 'industry', tags: ['economic', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Are franchises killing creativity?', approfondissement: 'MCU, Star Wars, Fast & Furious: models in crisis?', synthese: 'Can original cinema reclaim the box office?' } },
  { id: 'in-4', title: 'The A24 model', description: 'How a small studio became culturally dominant.', category: 'industry', tags: ['economic', 'aesthetic'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'How did A24 succeed?', approfondissement: 'Marketing, curation, identity: the keys to A24\'s success.', synthese: 'Is the A24 model replicable?' } },
  { id: 'in-5', title: 'Film crowdfunding', description: 'Does crowdfunding change the rules of the game?', category: 'industry', tags: ['economic', 'technological', 'social'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Can crowdfunding finance cinema?', approfondissement: 'Veronica Mars, Blue Ruin, CineGeny: case studies.', synthese: 'Is crowdfunding the future of independent cinema?' } },

  // ── AUTEUR (5) ──
  { id: 'au-1', title: 'Kubrick: perfectionism and genius', description: 'Obsession as a creative method.', category: 'auteur', tags: ['aesthetics', 'psychological'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'What makes Kubrick a genius?', approfondissement: 'Symmetry, repetition, alienation: decoding the method.', synthese: 'Is perfectionism necessary for greatness?' } },
  { id: 'au-2', title: 'Wong Kar-wai: the poetry of time', description: 'The art of filming nostalgia and desire.', category: 'auteur', tags: ['aesthetics', 'philosophical', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'How does Wong Kar-wai capture nostalgia?', approfondissement: 'In the Mood for Love: love as absence.', synthese: 'Did Wong Kar-wai invent a new cinematic language?' } },
  { id: 'au-3', title: 'Denis Villeneuve: intelligent spectacle', description: 'Reconciling blockbuster and depth.', category: 'auteur', tags: ['aesthetic', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'How does Villeneuve transform the blockbuster?', approfondissement: 'Dune, Arrival, Blade Runner 2049: intellect and spectacle.', synthese: 'Does Villeneuve prove the blockbuster can be art?' } },
  { id: 'au-4', title: 'Bong Joon-ho: class cinema', description: 'A sharp eye on social inequality.', category: 'auteur', tags: ['social', 'politique', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'How does Bong Joon-ho film social class?', approfondissement: 'Parasite: the architecture of inequality.', synthese: 'Did Bong Joon-ho create a new genre?' } },
  { id: 'au-5', title: 'Greta Gerwig: rewriting the canon', description: 'Reinventing the classics with a contemporary eye.', category: 'auteur', tags: ['feminist', 'narrative', 'aesthetic'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'How does Gerwig reinvent the classics?', approfondissement: 'Little Women, Barbie: subversion and homage.', synthese: 'Is Gerwig defining mainstream feminist cinema?' } },

  // ── GENRES (5) ──
  { id: 'ge-1', title: 'Horror as metaphor', description: 'When horror speaks about society.', category: 'genre', tags: ['aesthetic', 'social', 'psychological'], agent: 'cg-cine-critic', depth: 'exploration', sensitivityFlags: ['violence'], prompts: { exploration: 'Why is horror such an effective genre for talking about society?', approfondissement: 'Get Out, Hereditary, The Babadook : horreur sociale.', synthese: 'Is horror the most politically relevant genre?' } },
  { id: 'ge-2', title: 'Film noir and its heirs', description: 'Du classic noir au neo-noir contemporain.', category: 'genre', tags: ['historical', 'aesthetic', 'narrative'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'What defines film noir?', approfondissement: 'From Double Indemnity to Drive: the evolution of noir.', synthese: 'Is neo-noir faithful to the original spirit?' } },
  { id: 'ge-3', title: 'Comedy as art', description: 'Is making people laugh harder than making them cry?', category: 'genre', tags: ['aesthetic', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Is comedy underrated as an art form?', approfondissement: 'From Chaplin to Wes Anderson: elevating comedy.', synthese: 'Can comedy reach the heights of drama?' } },
  { id: 'ge-4', title: 'Speculative science fiction', description: 'When sci-fi anticipates our future.', category: 'genre', tags: ['technological', 'philosophical', 'social'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Does sci-fi have the power to predict the future?', approfondissement: 'Blade Runner, Her, Ex Machina: predictions turned reality.', synthese: 'La SF est-elle notre meilleur outil de prospective ?' } },
  { id: 'ge-5', title: 'Le documentaire hybride', description: 'When the line between fiction and reality fades.', category: 'genre', tags: ['aesthetics', 'experimental', 'ethics'], agent: 'cg-cine-critic', depth: 'approfondissement', prompts: { exploration: 'What is a hybrid documentary?', approfondissement: 'The limits of staging in documentary.', synthese: 'Is the hybrid documentary more honest than the pure documentary?' } },

  // ── SON & MUSIQUE (4) ──
  { id: 'sm-1', title: 'Silence in cinema', description: 'When the absence of sound becomes the most powerful sound.', category: 'sound-music', tags: ['sonore', 'aesthetics', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'What is the power of silence in cinema?', approfondissement: 'A Quiet Place, No Country: silence as tension.', synthese: 'Is silence the most expressive sound?' } },
  { id: 'sm-2', title: 'Leitmotif and musical memory', description: 'How film music engraves our memories.', category: 'sound-music', tags: ['sonore', 'psychological'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Why are certain musical themes unforgettable?', approfondissement: 'Williams, Morricone, Zimmer : architectes sonores.', synthese: 'Is film music the strongest link between a film and its audience?' } },
  { id: 'sm-3', title: 'Diegetic vs non-diegetic music', description: 'Music in the film vs music of the film.', category: 'sound-music', tags: ['sonore', 'narrative'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'What is the difference in impact?', approfondissement: 'Scorsese and the diegetic jukebox: a case study.', synthese: 'Does the diegetic/non-diegetic choice change the nature of the film?' } },
  { id: 'sm-4', title: 'Cinematic ASMR', description: 'When sound design creates a physical experience.', category: 'sound-music', tags: ['sonore', 'aesthetic', 'experimental'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Can film sound be physically felt?', approfondissement: 'Sound design immersif : Gravity, Dunkirk, Arrival.', synthese: 'Toward a haptic cinema through sound?' } },

  // ── LANGAGE VISUEL (4) ──
  { id: 'vi-1', title: 'The long take', description: 'When the camera never cuts.', category: 'visual', tags: ['visual', 'aesthetic', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Why is the long take so fascinating?', approfondissement: '1917, Birdman, Children of Men : prouesses techniques.', synthese: 'Is the long take a peak of cinema?' } },
  { id: 'vi-2', title: 'Symmetry and framing', description: 'Geometric obsession in cinema.', category: 'visual', tags: ['visual', 'aesthetics'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'What does symmetry communicate in cinema?', approfondissement: 'Kubrick, Anderson, Villeneuve: geometers of the image.', synthese: 'Is symmetry beauty or visual oppression?' } },
  { id: 'vi-3', title: 'Black and white today', description: 'A radical aesthetic choice in the age of 4K HDR.', category: 'visual', tags: ['visual', 'aesthetic', 'experimental'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Why choose black and white today?', approfondissement: 'Roma, Mank, Belfast: black-and-white as a statement.', synthese: 'Is black and white more cinematic than color?' } },
  { id: 'vi-4', title: 'Aspect ratio as a narrative tool', description: 'When aspect ratio tells the story.', category: 'visual', tags: ['visual', 'narrative'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Is aspect ratio a narrative choice?', approfondissement: 'Mommy (Dolan), Grand Budapest Hotel: format as meaning.', synthese: 'Is aspect ratio the most underrated narrative dimension?' } },

  // ── ADAPTATIONS (4) ──
  { id: 'ad-1', title: 'Le livre est toujours mieux ?', description: 'The eternal book vs film debate.', category: 'adaptation', tags: ['narrative', 'aesthetics'], agent: 'cg-cine-narratologist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Is the book really always better than the film?', approfondissement: 'Adaptations that surpass the original: are there examples?', synthese: 'Should we compare them, or treat them as two distinct works?' } },
  { id: 'ad-2', title: 'Adapter l\'inadaptable', description: 'Works long deemed impossible to film.', category: 'adaptation', tags: ['narrative', 'aesthetics'], agent: 'cg-cine-narratologist', depth: 'approfondissement', prompts: { exploration: 'What makes a work unadaptable?', approfondissement: 'Dune, Watchmen, Ulysses: challenges and solutions.', synthese: 'Is the unadaptable a myth?' } },
  { id: 'ad-3', title: 'Remake and reboot', description: 'L\'art de refaire sans copier.', category: 'adaptation', tags: ['narrative', 'economic'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Are remakes creatively justifiable?', approfondissement: 'The Thing, Scarface, Suspiria: when the remake transcends.', synthese: 'Is the remake an act of creation or laziness?' } },
  { id: 'ad-4', title: 'Video games → Cinema', description: 'Why game adaptations fail (and are changing).', category: 'adaptation', tags: ['narrative', 'technological'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Why do video-game adaptations fail?', approfondissement: 'The Last of Us, Arcane: the new wave.', synthese: 'Has the video-game adaptation finally found its formula?' } },

  // ── WORLD CINEMA (4) ──
  { id: 'gw-1', title: 'Hallyu: the Korean wave', description: 'How Korean cinema conquered the world.', category: 'global', tags: ['historical', 'social', 'economic'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'What makes Korean cinema so strong?', approfondissement: 'From Kim Ki-duk to Bong Joon-ho: a global trajectory.', synthese: 'Is the Korean model replicable by other national cinemas?' } },
  { id: 'gw-2', title: 'Bollywood beyond the clichés', description: 'Indian cinema in all its diversity.', category: 'global', tags: ['historical', 'social'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Is \'Bollywood\' reductive when talking about Indian cinema?', approfondissement: 'Malayalam, Tamil, Bengali: the cinemas of India.', synthese: 'Is Indian cinema the most diverse in the world?' } },
  { id: 'gw-3', title: 'Emerging African cinema', description: 'Nollywood and beyond: a continent asserting itself.', category: 'global', tags: ['historical', 'social', 'postcolonial'], agent: 'cg-cine-historian', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'What is the state of African cinema today?', approfondissement: 'Nollywood, Ouagadougou, nouveaux auteurs : paysage.', synthese: 'Is African cinema the next great global movement?' } },
  { id: 'gw-4', title: 'Iranian cinema: art under constraint', description: 'Creating masterpieces despite censorship.', category: 'global', tags: ['historical', 'politique', 'aesthetics'], agent: 'cg-cine-historian', depth: 'approfondissement', sensitivityFlags: ['politics', 'religion'], prompts: { exploration: 'How does Iranian cinema create under constraint?', approfondissement: 'Kiarostami, Farhadi, Panahi: resistance through art.', synthese: 'Is constraint a catalyst for creativity?' } },

  // ── DEBATES (6) ──
  { id: 'de-1', title: 'Is Marvel cinema?', description: 'The Scorsese debate revisited.', category: 'debate', tags: ['aesthetic', 'economic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Is Scorsese right that Marvel isn\'t cinema?', approfondissement: 'What defines \'real\' cinema?', synthese: 'Should cinema be an exclusive category?' } },
  { id: 'de-2', title: 'CGI vs effets pratiques', description: 'Did digital kill the magic?', category: 'debate', tags: ['technological', 'aesthetic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Has CGI become a creative crutch?', approfondissement: 'Mad Max Fury Road vs the entire MCU: a comparison.', synthese: 'La meilleure approche est-elle l\'hybride ?' } },
  { id: 'de-3', title: 'Les Oscars sont-ils pertinents ?', description: 'Is cinema\'s biggest ceremony still credible?', category: 'debate', tags: ['politique', 'economic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Do the Oscars reflect cinematic quality?', approfondissement: 'Lobbying, politics, representation: behind the scenes.', synthese: 'Should film awards be reinvented?' } },
  { id: 'de-4', title: 'Is cinema too long?', description: 'Les films sont-ils devenus trop longs ?', category: 'debate', tags: ['narrative', 'social'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Is a 3-hour film justified?', approfondissement: 'Killers of the Flower Moon, Oppenheimer : trop long ?', synthese: 'Is there an ideal length for a film?' } },
  { id: 'de-5', title: 'The death of the DVD', description: 'Le physique a-t-il encore un sens ?', category: 'debate', tags: ['technological', 'economic', 'ecological'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Is the DVD dead for good?', approfondissement: 'Physical collection vs streaming: loss or progress?', synthese: 'Is dematerialization a threat to preservation?' } },
  { id: 'de-6', title: 'Sous-titres vs doublage', description: 'The great schism of international consumption.', category: 'debate', tags: ['social', 'aesthetic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Does dubbing betray the original work?', approfondissement: 'The accessibility argument vs artistic purity.', synthese: 'Is there an ideal compromise?' } },
]

// ─── Helpers ────────────────────────────────────────────────────────

export function getTemplatesByCategory(categoryId: string): DiscussionTemplate[] {
  return DISCUSSION_TEMPLATES.filter(t => t.category === categoryId)
}

export function getTemplatesByTag(tag: string): DiscussionTemplate[] {
  return DISCUSSION_TEMPLATES.filter(t => t.tags.includes(tag))
}

export function getChallengeTemplates(): DiscussionTemplate[] {
  return DISCUSSION_TEMPLATES.filter(t => t.challengeMode)
}

export function getSensitiveTemplates(): DiscussionTemplate[] {
  return DISCUSSION_TEMPLATES.filter(t => t.sensitivityFlags && t.sensitivityFlags.length > 0)
}

export function getTemplateById(id: string): DiscussionTemplate | undefined {
  return DISCUSSION_TEMPLATES.find(t => t.id === id)
}

// ─── 12 Sections (for UI grouping) ─────────────────────────────────

export const DISCUSSION_SECTIONS = [
  { id: 'explore', label: '\u{1F50D} Explorer', description: 'Discover a topic', categories: ['film-analysis', 'history', 'genre', 'global'] },
  { id: 'think', label: '\u{1F9E0} Reflect', description: 'Think deeply', categories: ['philosophy', 'ethics', 'narrative'] },
  { id: 'debate', label: '\u{1F525} Debate', description: 'Confront ideas', categories: ['debate', 'industry'] },
  { id: 'society', label: '\u{1F30D} Society', description: 'Cinema and the world', categories: ['society', 'representation'] },
  { id: 'craft', label: '\u{1F3A8} Technique', description: 'The art of cinema', categories: ['visual', 'sound-music'] },
  { id: 'future', label: '\u{1F680} Futur', description: 'Demain', categories: ['technology'] },
  { id: 'auteurs', label: '\u2B50 Auteurs', description: 'Les grands noms', categories: ['auteur'] },
  { id: 'adapt', label: '\u{1F4DA} Adaptations', description: 'Du livre au film', categories: ['adaptation'] },
  { id: 'challenge', label: '\u2694\uFE0F Challenge', description: 'The devil\'s advocate', categories: [] },
  { id: 'sensitive', label: '\u26A0\uFE0F Sensible', description: 'Sensitive topics', categories: [] },
  { id: 'trending', label: '\u{1F4C8} Tendances', description: 'Sujets actuels', categories: [] },
  { id: 'random', label: '\u{1F3B2} Random', description: 'Surprise !', categories: [] },
]
