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
    name: 'Philosophe du Cinéma',
    role: 'Analyse philosophique',
    description: 'Explore les dimensions philosophiques du cinéma : ontologie de l\'image, phénoménologie du spectateur, éthique de la représentation.',
    icon: 'brain',
    color: '#7C3AED',
    expertise: ['philosophie', 'ontologie', 'phénoménologie', 'aesthetic', 'ethical'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-historian',
    name: 'Historien du Cinéma',
    role: 'Histoire & mouvements',
    description: 'Expert de l\'histoire du cinéma mondial. Des frères Lumière au streaming, en passant par la Nouvelle Vague et le Dogme 95.',
    icon: 'book-open',
    color: '#B45309',
    expertise: ['histoire', 'mouvements', 'évolution technique', 'cinéma mondial', 'patrimoine'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-critic',
    name: 'Critique d\'Art',
    role: 'Analyse critique',
    description: 'Analyse critique rigoureuse des œuvres cinématographiques. Déconstruit les films, identifie les influences, évalue l\'innovation.',
    icon: 'eye',
    color: '#DC2626',
    expertise: ['critique', 'analyse', 'déconstruction', 'influences', 'innovation'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-sociologist',
    name: 'Sociologue du Cinéma',
    role: 'Impact social & culturel',
    description: 'Étudie le cinéma comme miroir et moteur de la société. Représentations, diversité, impact culturel, industrie.',
    icon: 'users',
    color: '#0891B2',
    expertise: ['sociologie', 'représentation', 'diversité', 'industrie', 'audience'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-narratologist',
    name: 'Narratologue',
    role: 'Techniques narratives',
    description: 'Spécialiste de la narration cinématographique. Structure, personnages, arcs, temps, point de vue, sous-texte.',
    icon: 'pen-tool',
    color: '#2563EB',
    expertise: ['narration', 'structure', 'personnages', 'dramaturgie', 'sous-texte'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-futurist',
    name: 'Futuriste du Cinéma',
    role: 'Futur de l\'industrie',
    description: 'Anticipe l\'évolution du cinéma : IA générative, réalité virtuelle, distribution, économie créative, droits d\'auteur.',
    icon: 'rocket',
    color: '#059669',
    expertise: ['futurisme', 'IA', 'technologie', 'distribution', 'économie créative'],
    model: 'claude-opus-4-6',
  },
  {
    slug: 'cg-cine-provocateur',
    name: 'L\'Avocat du Diable',
    role: 'Challenge & Débat',
    description: 'Joue l\'avocat du diable. Conteste les opinions, pousse la réflexion, expose les contradictions. Mode Challenge activé.',
    icon: 'flame',
    color: '#E11D48',
    expertise: ['débat', 'contradiction', 'rhétorique', 'provocation intellectuelle', 'dialectique'],
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
  { id: 'film-analysis', label: 'Analyse Filmique', icon: 'film', color: '#E50914', description: 'Décortiquer un film en profondeur', defaultAgent: 'cg-cine-critic' },
  { id: 'philosophy', label: 'Philosophie', icon: 'brain', color: '#7C3AED', description: 'Cinéma et pensée philosophique', defaultAgent: 'cg-cine-philosopher' },
  { id: 'ethics', label: 'Éthique', icon: 'shield', color: '#DC2626', description: 'Questions éthiques de la représentation', defaultAgent: 'cg-cine-philosopher' },
  { id: 'history', label: 'Histoire', icon: 'book-open', color: '#B45309', description: 'Mouvements et évolution du cinéma', defaultAgent: 'cg-cine-historian' },
  { id: 'narrative', label: 'Narration', icon: 'pen-tool', color: '#2563EB', description: 'Techniques et structures narratives', defaultAgent: 'cg-cine-narratologist' },
  { id: 'society', label: 'Company', icon: 'users', color: '#0891B2', description: 'Cinéma et société contemporaine', defaultAgent: 'cg-cine-sociologist' },
  { id: 'representation', label: 'Representation', icon: 'eye', color: '#DB2777', description: 'Diversité et inclusion à l\'écran', defaultAgent: 'cg-cine-sociologist' },
  { id: 'technology', label: 'Technologie', icon: 'cpu', color: '#059669', description: 'IA, VR, et futur technique', defaultAgent: 'cg-cine-futurist' },
  { id: 'industry', label: 'Industrie', icon: 'building', color: '#6366F1', description: 'Business et économie du cinéma', defaultAgent: 'cg-cine-futurist' },
  { id: 'auteur', label: 'Cinéma d\'Auteur', icon: 'star', color: '#F59E0B', description: 'Vision, style, signature', defaultAgent: 'cg-cine-critic' },
  { id: 'genre', label: 'Genres', icon: 'layers', color: '#EC4899', description: 'Exploration des genres cinéma', defaultAgent: 'cg-cine-historian' },
  { id: 'sound-music', label: 'Son & Musique', icon: 'music', color: '#14B8A6', description: 'Bande son, sound design, score', defaultAgent: 'cg-cine-critic' },
  { id: 'visual', label: 'Langage Visuel', icon: 'camera', color: '#8B5CF6', description: 'Photographie, composition, lumière', defaultAgent: 'cg-cine-critic' },
  { id: 'adaptation', label: 'Adaptations', icon: 'book', color: '#78716C', description: 'Du livre au film, fidélité vs création', defaultAgent: 'cg-cine-narratologist' },
  { id: 'global', label: 'Cinéma Mondial', icon: 'globe', color: '#0EA5E9', description: 'Cinémas du monde entier', defaultAgent: 'cg-cine-historian' },
  { id: 'debate', label: 'Débats', icon: 'flame', color: '#E11D48', description: 'Questions polarisantes, mode Challenge', defaultAgent: 'cg-cine-provocateur' },
]

// ─── 17 Tags ────────────────────────────────────────────────────────

export const DISCUSSION_TAGS = [
  'narratif', 'visuel', 'sonore', 'philosophique', 'politique',
  'social', 'technologique', 'historique', 'ethical', 'aesthetic',
  'economic', 'psychologique', 'anthropologique', 'feminist',
  'postcolonial', 'ecological', 'experimental',
]

// ─── Sensitivity Alerts ─────────────────────────────────────────────

export const SENSITIVITY_TOPICS = [
  { id: 'religion', label: 'Religion', icon: '\u{1F54A}\uFE0F', color: '#F59E0B' },
  { id: 'politics', label: 'Politique', icon: '\u{1F3DB}\uFE0F', color: '#3B82F6' },
  { id: 'violence', label: 'Violence', icon: '\u26A0\uFE0F', color: '#EF4444' },
  { id: 'representation', label: 'Representation', icon: '\u{1F30D}', color: '#8B5CF6' },
  { id: 'sexuality', label: 'Sexualité', icon: '\u2764\uFE0F', color: '#EC4899' },
  { id: 'mental-health', label: 'Santé mentale', icon: '\u{1F9E0}', color: '#14B8A6' },
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
  { id: 'fa-1', title: 'Déconstruction d\'un chef-d\'œuvre', description: 'Analyse plan par plan, séquence par séquence d\'un film majeur.', category: 'film-analysis', tags: ['narratif', 'visuel', 'esthétique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Analysons ce film couche par couche. Commençons par la structure narrative.', approfondissement: 'Creusons les choix visuels et leur impact émotionnel sur le spectateur.', synthese: 'Synthétisons : quelle est la contribution de ce film au cinéma mondial ?' } },
  { id: 'fa-2', title: 'Symbolisme et sous-texte', description: 'Décoder les symboles cachés et les niveaux de lecture d\'un film.', category: 'film-analysis', tags: ['philosophique', 'esthétique', 'psychologique'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Quels symboles récurrents identifiez-vous dans ce film ?', approfondissement: 'Comment ces symboles construisent-ils un sous-texte cohérent ?', synthese: 'Quelle lecture symbolique globale proposez-vous ?' } },
  { id: 'fa-3', title: 'Direction d\'acteurs', description: 'Analyser le travail de direction d\'acteurs et les performances.', category: 'film-analysis', tags: ['narratif', 'psychologique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Comment le réalisateur dirige-t-il ses acteurs dans ce film ?', approfondissement: 'Analysons les choix de jeu et leur impact sur la narration.', synthese: 'Quel est l\'apport de la direction d\'acteurs à l\'œuvre finale ?' } },
  { id: 'fa-4', title: 'Montage et rythme', description: 'Étude du montage comme langage narratif.', category: 'film-analysis', tags: ['narratif', 'visuel'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Comment le montage structure-t-il le récit ?', approfondissement: 'Analysons le rythme et ses variations émotionnelles.', synthese: 'En quoi le montage de ce film est-il innovant ou significatif ?' } },
  { id: 'fa-5', title: 'Première vs dernière scène', description: 'Comparer l\'ouverture et la fermeture d\'un film.', category: 'film-analysis', tags: ['narratif', 'aesthetic'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Que nous dit la première scène sur le film entier ?', approfondissement: 'Comment la dernière scène répond-elle à la promesse initiale ?', synthese: 'Quel arc narratif se dessine entre ces deux pôles ?' } },
  { id: 'fa-6', title: 'Sound design comme narration', description: 'Le son comme vecteur narratif et émotionnel.', category: 'film-analysis', tags: ['sonore', 'aesthetic'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Comment le son participe-t-il à la narration ?', approfondissement: 'Analysons les choix de sound design les plus marquants.', synthese: 'Quelle est la signature sonore de ce film ?' } },
  { id: 'fa-7', title: 'Couleur et émotion', description: 'Analyse chromatique et palette émotionnelle.', category: 'film-analysis', tags: ['visuel', 'aesthetic', 'psychologique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Quelle palette chromatique domine ce film ?', approfondissement: 'Comment les couleurs traduisent-elles les émotions ?', synthese: 'Quel système chromatique le film propose-t-il ?' } },
  { id: 'fa-8', title: 'Film comme expérience sensorielle', description: 'Au-delà du récit : le film comme immersion totale.', category: 'film-analysis', tags: ['aesthetic', 'philosophique', 'experimental'], agent: 'cg-cine-philosopher', depth: 'approfondissement', prompts: { exploration: 'Comment ce film engage-t-il nos sens au-delà de la vue ?', approfondissement: 'Quelle phénoménologie du spectateur ce film propose-t-il ?', synthese: 'En quoi ce film redéfinit-il l\'expérience cinématographique ?' } },

  // ── PHILOSOPHIE (7) ──
  { id: 'ph-1', title: 'Cinéma et réalité', description: 'Le cinéma peut-il capturer la réalité ou la crée-t-il ?', category: 'philosophy', tags: ['philosophique', 'aesthetic'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Le cinéma est-il une fenêtre sur le réel ou une construction ?', approfondissement: 'Que nous apprennent Bazin et Deleuze sur l\'image-mouvement ?', synthese: 'Quelle ontologie de l\'image cinématographique proposez-vous ?' } },
  { id: 'ph-2', title: 'Le spectateur comme co-créateur', description: 'Le film existe-t-il sans spectateur ?', category: 'philosophy', tags: ['philosophique', 'psychologique'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Quel rôle joue le spectateur dans la création du sens ?', approfondissement: 'Comment la réception transforme-t-elle l\'œuvre ?', synthese: 'Le spectateur est-il co-auteur du film ?' } },
  { id: 'ph-3', title: 'Temps et cinéma', description: 'Comment le cinéma manipule-t-il notre perception du temps ?', category: 'philosophy', tags: ['philosophique', 'narratif'], agent: 'cg-cine-philosopher', depth: 'approfondissement', prompts: { exploration: 'Quels sont les temps du cinéma ?', approfondissement: 'Comment Tarkovski et Bergman sculptent-ils le temps ?', synthese: 'Le cinéma est-il l\'art du temps par excellence ?' } },
  { id: 'ph-4', title: 'Mort de l\'auteur au cinéma', description: 'La théorie de l\'auteur est-elle encore pertinente ?', category: 'philosophy', tags: ['philosophique', 'aesthetic'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'La politique des auteurs a-t-elle encore un sens ?', approfondissement: 'Comment concilier auteur et industrie collaborative ?', synthese: 'Qui est l\'auteur d\'un film ?' } },
  { id: 'ph-5', title: 'L\'illusion cinématographique', description: 'Pourquoi pleurons-nous pour des personnages fictifs ?', category: 'philosophy', tags: ['philosophique', 'psychologique'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Pourquoi l\'illusion du cinéma fonctionne-t-elle ?', approfondissement: 'Qu\'est-ce que la "suspension d\'incrédulité" ?', synthese: 'Le cinéma est-il le plus puissant des arts de l\'illusion ?' } },
  { id: 'ph-6', title: 'Esthétique de la violence', description: 'La violence au cinéma : art ou complaisance ?', category: 'philosophy', tags: ['ethical', 'aesthetic', 'philosophique'], agent: 'cg-cine-philosopher', depth: 'approfondissement', sensitivityFlags: ['violence'], prompts: { exploration: 'La violence peut-elle être esthétique ?', approfondissement: 'Tarantino, Refn, Park Chan-wook : stylisation de la violence.', synthese: 'Où est la frontière entre art et complaisance ?' } },
  { id: 'ph-7', title: 'Cinéma et mémoire', description: 'Le cinéma comme mémoire collective de l\'humanité.', category: 'philosophy', tags: ['philosophique', 'historique', 'social'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Le cinéma peut-il servir de mémoire collective ?', approfondissement: 'Comment les films façonnent-ils notre mémoire du passé ?', synthese: 'Le cinéma est-il le meilleur gardien de notre mémoire ?' } },

  // ── ÉTHIQUE (6) ──
  { id: 'et-1', title: 'IA et droit d\'auteur', description: 'Qui détient les droits sur un film généré par IA ?', category: 'ethics', tags: ['éthique', 'technologique', 'économique'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'L\'IA peut-elle être considérée comme auteure ?', approfondissement: 'Quelles implications juridiques pour le cinéma IA ?', synthese: 'Quel cadre éthique proposer pour la création IA ?' } },
  { id: 'et-2', title: 'Consentement et deepfakes', description: 'Les limites éthiques de la manipulation d\'image.', category: 'ethics', tags: ['éthique', 'technologique'], agent: 'cg-cine-philosopher', depth: 'approfondissement', sensitivityFlags: ['representation'], prompts: { exploration: 'Les deepfakes posent-ils un problème éthique fondamental ?', approfondissement: 'Consentement, identité et droit à l\'image à l\'ère de l\'IA.', synthese: 'Comment protéger les individus tout en permettant la création ?' } },
  { id: 'et-3', title: 'Responsabilité du cinéaste', description: 'Le cinéaste a-t-il une responsabilité morale ?', category: 'ethics', tags: ['ethical', 'social'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'Un cinéaste a-t-il des responsabilités envers la société ?', approfondissement: 'Art engagé vs art pour l\'art : faut-il choisir ?', synthese: 'Quelle éthique du cinéaste pour le 21e siècle ?' } },
  { id: 'et-4', title: 'Représentation des minorités', description: 'Inclusion et authenticité dans la représentation à l\'écran.', category: 'ethics', tags: ['éthique', 'social', 'féministe', 'postcolonial'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Comment évaluer la qualité de la représentation ?', approfondissement: 'Au-delà de la visibilité : authenticité et agentivité.', synthese: 'Quels critères pour une représentation juste et riche ?' } },
  { id: 'et-5', title: 'Cinéma et propagande', description: 'La frontière entre persuasion et manipulation.', category: 'ethics', tags: ['ethical', 'politique', 'historique'], agent: 'cg-cine-historian', depth: 'approfondissement', sensitivityFlags: ['politics'], prompts: { exploration: 'Tout film est-il propagande ?', approfondissement: 'De Riefenstahl à Marvel : le cinéma au service de l\'idéologie.', synthese: 'Comment développer un regard critique face à la persuasion cinématographique ?' } },
  { id: 'et-6', title: 'Exploitation animale au cinéma', description: 'Du vrai au CGI : traitement des animaux dans les films.', category: 'ethics', tags: ['ethical', 'ecological'], agent: 'cg-cine-philosopher', depth: 'exploration', prompts: { exploration: 'L\'utilisation d\'animaux réels au cinéma est-elle justifiable ?', approfondissement: 'Le CGI offre-t-il une alternative éthique satisfaisante ?', synthese: 'Vers un cinéma sans exploitation animale ?' } },

  // ── HISTOIRE (6) ──
  { id: 'hi-1', title: 'La Nouvelle Vague et ses enfants', description: 'Héritage et influence du mouvement qui a changé le cinéma.', category: 'history', tags: ['historique', 'aesthetic'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Qu\'est-ce que la Nouvelle Vague a réellement changé ?', approfondissement: 'Ses héritiers aujourd\'hui : qui porte le flambeau ?', synthese: 'La Nouvelle Vague est-elle le plus grand mouvement cinématographique ?' } },
  { id: 'hi-2', title: 'Hollywood vs Cinémas nationaux', description: 'Domination américaine et résistances culturelles.', category: 'history', tags: ['historique', 'economic', 'politique'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Comment Hollywood a-t-il conquis le monde ?', approfondissement: 'Quelles résistances culturelles existent ?', synthese: 'Un cinéma mondial est-il possible face à Hollywood ?' } },
  { id: 'hi-3', title: 'Du muet au parlant', description: 'La révolution du cinéma sonore.', category: 'history', tags: ['historique', 'sonore'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Qu\'a-t-on gagné et perdu avec le parlant ?', approfondissement: 'Le muet comme art complet en soi.', synthese: 'Le cinéma muet a-t-il encore quelque chose à nous apprendre ?' } },
  { id: 'hi-4', title: 'Le néoréalisme italien', description: 'Quand le cinéma a regardé la réalité en face.', category: 'history', tags: ['historique', 'social', 'aesthetic'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Pourquoi le néoréalisme reste-t-il si influent ?', approfondissement: 'De Sica, Rossellini, Visconti : trois visions du réel.', synthese: 'Le néoréalisme a-t-il créé le cinéma moderne ?' } },
  { id: 'hi-5', title: 'Cinéma d\'animation : art majeur', description: 'L\'animation comme forme d\'art à part entière.', category: 'history', tags: ['historique', 'esthétique', 'expérimental'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'L\'animation est-elle un genre ou un medium ?', approfondissement: 'De Disney à Miyazaki : visions de l\'animation.', synthese: 'L\'animation peut-elle surpasser le cinéma live-action ?' } },
  { id: 'hi-6', title: 'Le cinéma de genre réhabilité', description: 'Quand l\'horreur et la SF deviennent art.', category: 'history', tags: ['historique', 'esthétique'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Pourquoi le cinéma de genre a-t-il été longtemps méprisé ?', approfondissement: 'Jordan Peele, Denis Villeneuve : la légitimation du genre.', synthese: 'Le genre est-il l\'avenir du cinéma d\'auteur ?' } },

  // ── NARRATION (6) ──
  { id: 'na-1', title: 'La structure en 3 actes est-elle morte ?', description: 'Remettre en question le paradigme narratif dominant.', category: 'narrative', tags: ['narratif', 'aesthetic'], agent: 'cg-cine-narratologist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'La structure en 3 actes est-elle un carcan ou un outil ?', approfondissement: 'Quelles alternatives narratives émergent ?', synthese: 'Faut-il déconstruire les structures pour les réinventer ?' } },
  { id: 'na-2', title: 'Le narrateur non-fiable', description: 'Quand le film ment au spectateur.', category: 'narrative', tags: ['narratif', 'psychologique'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Qu\'est-ce qu\'un narrateur non-fiable au cinéma ?', approfondissement: 'Fight Club, Shutter Island, Gone Girl : l\'art du mensonge.', synthese: 'Le narrateur non-fiable change-t-il fondamentalement l\'expérience ?' } },
  { id: 'na-3', title: 'Non-linéarité temporelle', description: 'Flashbacks, boucles, temps inversé.', category: 'narrative', tags: ['narratif', 'philosophique'], agent: 'cg-cine-narratologist', depth: 'approfondissement', prompts: { exploration: 'Pourquoi briser la chronologie ?', approfondissement: 'Nolan, Tarantino, Denis Villeneuve : architectes du temps.', synthese: 'La non-linéarité est-elle un progrès narratif ?' } },
  { id: 'na-4', title: 'Show don\'t tell', description: 'L\'art de raconter sans mots.', category: 'narrative', tags: ['narratif', 'visuel'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Comment un film peut-il raconter sans dialogue ?', approfondissement: 'Les maîtres du silence : Kubrick, Tarkovski, Malick.', synthese: 'Le cinéma est-il plus fort quand il se tait ?' } },
  { id: 'na-5', title: 'Le MacGuffin Hitchcockien', description: 'L\'objet qui motive l\'intrigue mais n\'a pas d\'importance.', category: 'narrative', tags: ['narratif', 'aesthetic'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Qu\'est-ce qu\'un MacGuffin et pourquoi fonctionne-t-il ?', approfondissement: 'Les MacGuffins modernes : de la mallette de Pulp Fiction au Graal.', synthese: 'Le MacGuffin est-il le secret de tout bon thriller ?' } },
  { id: 'na-6', title: 'Fin ouverte vs fin fermée', description: 'Le pouvoir de l\'ambiguïté narrative.', category: 'narrative', tags: ['narratif', 'philosophique'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Une fin ouverte est-elle plus riche qu\'une fin fermée ?', approfondissement: 'Inception, Lost in Translation, 2001 : l\'art de ne pas conclure.', synthese: 'La meilleure fin est-elle celle que le spectateur écrit ?' } },

  // ── SOCIÉTÉ (6) ──
  { id: 'so-1', title: 'Cinéma et gentrification', description: 'Quand le cinéma reflète et accélère les transformations urbaines.', category: 'society', tags: ['social', 'politique', 'economic'], agent: 'cg-cine-sociologist', depth: 'exploration', prompts: { exploration: 'Comment le cinéma représente-t-il la gentrification ?', approfondissement: 'Le cinéma contribue-t-il à la gentrification culturelle ?', synthese: 'Quel rôle le cinéma joue-t-il dans les transformations sociales ?' } },
  { id: 'so-2', title: 'Cinéma et masculinité', description: 'Évolution de la représentation masculine à l\'écran.', category: 'society', tags: ['social', 'féministe', 'psychologique'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Comment la masculinité a-t-elle évolué au cinéma ?', approfondissement: 'De John Wayne à Timothée Chalamet : quels modèles ?', synthese: 'Le cinéma peut-il redéfinir la masculinité ?' } },
  { id: 'so-3', title: 'Films de pandémie après le COVID', description: 'Comment le cinéma post-pandémie a changé.', category: 'society', tags: ['social', 'historique'], agent: 'cg-cine-sociologist', depth: 'exploration', prompts: { exploration: 'Le cinéma post-COVID est-il fondamentalement différent ?', approfondissement: 'Streaming, salles, distribution : le nouveau paysage.', synthese: 'La pandémie a-t-elle accéléré une révolution déjà en cours ?' } },
  { id: 'so-4', title: 'Cinéma et santé mentale', description: 'Représentation des troubles psychiques à l\'écran.', category: 'society', tags: ['social', 'psychologique', 'éthique'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['mental-health'], prompts: { exploration: 'Le cinéma aide-t-il à destigmatiser la santé mentale ?', approfondissement: 'Joker, Silver Linings, Girl Interrupted : représentation juste ?', synthese: 'Quel est l\'impact réel des films sur la perception de la santé mentale ?' } },
  { id: 'so-5', title: 'Cinéma et changement climatique', description: 'L\'écran comme alerte écologique.', category: 'society', tags: ['social', 'écologique', 'politique'], agent: 'cg-cine-sociologist', depth: 'exploration', prompts: { exploration: 'Le cinéma peut-il sensibiliser au changement climatique ?', approfondissement: 'De Don\'t Look Up à Avatar : efficacité du message écologique.', synthese: 'Le cinéma est-il un outil de changement ou un simple miroir ?' } },
  { id: 'so-6', title: 'Cancel culture et cinéma', description: 'Faut-il séparer l\'artiste de l\'œuvre ?', category: 'society', tags: ['social', 'ethical', 'politique'], agent: 'cg-cine-sociologist', depth: 'approfondissement', challengeMode: true, sensitivityFlags: ['politics'], prompts: { exploration: 'Peut-on séparer l\'artiste de son œuvre ?', approfondissement: 'Polanski, Allen, Spacey : cas concrets et nuances.', synthese: 'Quel cadre éthique pour consommer de l\'art "problématique" ?' } },

  // ── REPRÉSENTATION (5) ──
  { id: 're-1', title: 'Le regard féminin (Female Gaze)', description: 'Quand les femmes filment les femmes.', category: 'representation', tags: ['feminist', 'aesthetic', 'social'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Qu\'est-ce que le Female Gaze ?', approfondissement: 'Greta Gerwig, Céline Sciamma, Sofia Coppola : définir le regard féminin.', synthese: 'Le Female Gaze change-t-il fondamentalement la narration ?' } },
  { id: 're-2', title: 'Afrofuturisme au cinéma', description: 'Imaginer le futur à travers le prisme afro-descendant.', category: 'representation', tags: ['postcolonial', 'social', 'aesthetic'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Qu\'est-ce que l\'afrofuturisme au cinéma ?', approfondissement: 'Black Panther, Sorry to Bother You : visions du futur noir.', synthese: 'L\'afrofuturisme est-il un nouveau mouvement cinématographique ?' } },
  { id: 're-3', title: 'Cinéma queer', description: 'Visibilité et évolution de la représentation LGBTQ+.', category: 'representation', tags: ['social', 'feminist', 'politique'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['sexuality', 'representation'], prompts: { exploration: 'Comment le cinéma queer a-t-il évolué ?', approfondissement: 'Du Brokeback Mountain codé au cinéma queer militant.', synthese: 'Le cinéma queer a-t-il besoin d\'une catégorie séparée ?' } },
  { id: 're-4', title: 'Handicap au cinéma', description: 'Entre inspiration porn et représentation authentique.', category: 'representation', tags: ['social', 'ethical'], agent: 'cg-cine-sociologist', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Le cinéma représente-t-il bien le handicap ?', approfondissement: 'Intouchables : succès populaire ou problème de représentation ?', synthese: 'Quels standards pour une représentation respectueuse du handicap ?' } },
  { id: 're-5', title: 'Orientalisme cinématographique', description: 'Le regard occidental sur l\'Orient.', category: 'representation', tags: ['postcolonial', 'politique', 'historique'], agent: 'cg-cine-sociologist', depth: 'approfondissement', sensitivityFlags: ['representation', 'politics'], prompts: { exploration: 'Qu\'est-ce que l\'orientalisme au cinéma ?', approfondissement: 'De Lawrence d\'Arabie à Aladdin : déconstruire les stéréotypes.', synthese: 'Comment le cinéma peut-il dépasser l\'orientalisme ?' } },

  // ── TECHNOLOGIE (5) ──
  { id: 'te-1', title: 'IA générative et cinéma', description: 'L\'IA va-t-elle remplacer les cinéastes ?', category: 'technology', tags: ['technologique', 'éthique', 'économique'], agent: 'cg-cine-futurist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'L\'IA générative menace-t-elle la création cinématographique ?', approfondissement: 'Scénarios écrits par IA, acteurs synthétiques, montage automatisé.', synthese: 'L\'IA est-elle un outil ou un remplaçant ?' } },
  { id: 'te-2', title: 'Réalité virtuelle narrative', description: 'La VR comme nouveau medium cinématographique.', category: 'technology', tags: ['technologique', 'narratif', 'experimental'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'La VR peut-elle raconter des histoires comme le cinéma ?', approfondissement: 'Que change le passage de spectateur à participant ?', synthese: 'La VR est-elle le cinéma de demain ou un medium distinct ?' } },
  { id: 'te-3', title: 'Volume LED (The Mandalorian)', description: 'La révolution des décors virtuels.', category: 'technology', tags: ['technologique', 'visuel'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Comment les stages LED changent-ils la production ?', approfondissement: 'Avantages et limites vs fond vert vs décors réels.', synthese: 'Les décors virtuels vont-ils rendre les locations obsolètes ?' } },
  { id: 'te-4', title: 'Streaming vs Salle', description: 'Le grand débat de la distribution.', category: 'technology', tags: ['technologique', 'economic', 'social'], agent: 'cg-cine-futurist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'La salle de cinéma est-elle condamnée ?', approfondissement: 'Les modèles Netflix, Apple, A24 : qui gagne ?', synthese: 'Quel avenir pour l\'expérience collective du cinéma ?' } },
  { id: 'te-5', title: 'Deepfakes et résurrection numérique', description: 'Ramener les morts à l\'écran.', category: 'technology', tags: ['technologique', 'éthique'], agent: 'cg-cine-futurist', depth: 'approfondissement', sensitivityFlags: ['representation'], prompts: { exploration: 'Est-il éthique de ressusciter numériquement un acteur décédé ?', approfondissement: 'Carrie Fisher, Paul Walker : cas concrets et implications.', synthese: 'Quelles limites poser à la résurrection numérique ?' } },

  // ── INDUSTRIE (5) ──
  { id: 'in-1', title: 'Économie de l\'attention', description: 'Comment le cinéma lutte pour notre attention.', category: 'industry', tags: ['économique', 'social', 'technologique'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Le cinéma peut-il rivaliser avec TikTok pour notre attention ?', approfondissement: 'Format court, épisodique, interactif : les adaptations.', synthese: 'Comment le cinéma peut-il rester pertinent dans l\'économie de l\'attention ?' } },
  { id: 'in-2', title: 'Festivals : gatekeepers ou découvreurs ?', description: 'Le rôle des festivals dans l\'écosystème cinéma.', category: 'industry', tags: ['économique', 'politique'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Les festivals servent-ils encore à découvrir des talents ?', approfondissement: 'Cannes, Sundance, Berlin : quel pouvoir réel ?', synthese: 'Les festivals doivent-ils se réinventer ?' } },
  { id: 'in-3', title: 'Franchise fatigue', description: 'Le public en a-t-il assez des suites et franchises ?', category: 'industry', tags: ['economic', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Les franchises tuent-elles la créativité ?', approfondissement: 'MCU, Star Wars, Fast & Furious : modèles en crise ?', synthese: 'Le cinéma original peut-il reconquérir le box-office ?' } },
  { id: 'in-4', title: 'Le modèle A24', description: 'Comment un petit studio est devenu culturellement dominant.', category: 'industry', tags: ['economic', 'aesthetic'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Comment A24 a-t-il réussi ?', approfondissement: 'Marketing, curation, identité : les clés du succès A24.', synthese: 'Le modèle A24 est-il reproductible ?' } },
  { id: 'in-5', title: 'Crowdfunding cinéma', description: 'Le financement participatif change-t-il les règles du jeu ?', category: 'industry', tags: ['economic', 'technologique', 'social'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'Le crowdfunding peut-il financer le cinéma ?', approfondissement: 'Veronica Mars, Blue Ruin, CineGeny : cas d\'étude.', synthese: 'Le financement participatif est-il l\'avenir du cinéma indépendant ?' } },

  // ── AUTEUR (5) ──
  { id: 'au-1', title: 'Kubrick : perfectionnisme et génie', description: 'L\'obsession comme méthode créative.', category: 'auteur', tags: ['esthétique', 'psychologique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Qu\'est-ce qui fait de Kubrick un génie ?', approfondissement: 'Symétrie, répétition, aliénation : décoder la méthode.', synthese: 'Le perfectionnisme est-il nécessaire à la grandeur ?' } },
  { id: 'au-2', title: 'Wong Kar-wai : poésie du temps', description: 'L\'art de filmer la nostalgie et le désir.', category: 'auteur', tags: ['esthétique', 'philosophique', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Comment Wong Kar-wai capture-t-il la nostalgie ?', approfondissement: 'In the Mood for Love : l\'amour comme absence.', synthese: 'Wong Kar-wai a-t-il inventé un nouveau langage cinématographique ?' } },
  { id: 'au-3', title: 'Denis Villeneuve : le spectacle intelligent', description: 'Concilier blockbuster et profondeur.', category: 'auteur', tags: ['aesthetic', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Comment Villeneuve transforme-t-il le blockbuster ?', approfondissement: 'Dune, Arrival, Blade Runner 2049 : intellect et spectacle.', synthese: 'Villeneuve prouve-t-il que le blockbuster peut être art ?' } },
  { id: 'au-4', title: 'Bong Joon-ho : cinéma de classe', description: 'Le regard acéré sur les inégalités sociales.', category: 'auteur', tags: ['social', 'politique', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Comment Bong Joon-ho filme-t-il les classes sociales ?', approfondissement: 'Parasite : architecture de l\'inégalité.', synthese: 'Bong Joon-ho a-t-il créé un nouveau genre ?' } },
  { id: 'au-5', title: 'Greta Gerwig : réécriture du canon', description: 'Réinventer les classiques avec un regard contemporain.', category: 'auteur', tags: ['feminist', 'narratif', 'aesthetic'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Comment Gerwig réinvente-t-elle les classiques ?', approfondissement: 'Little Women, Barbie : subversion et hommage.', synthese: 'Gerwig définit-elle le cinéma féministe mainstream ?' } },

  // ── GENRES (5) ──
  { id: 'ge-1', title: 'L\'horreur comme métaphore', description: 'Quand l\'horreur parle de société.', category: 'genre', tags: ['aesthetic', 'social', 'psychologique'], agent: 'cg-cine-critic', depth: 'exploration', sensitivityFlags: ['violence'], prompts: { exploration: 'Pourquoi l\'horreur est-elle un genre si efficace pour parler de société ?', approfondissement: 'Get Out, Hereditary, The Babadook : horreur sociale.', synthese: 'L\'horreur est-elle le genre le plus politiquement pertinent ?' } },
  { id: 'ge-2', title: 'Le film noir et ses héritiers', description: 'Du classic noir au neo-noir contemporain.', category: 'genre', tags: ['historique', 'aesthetic', 'narratif'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Qu\'est-ce qui définit le film noir ?', approfondissement: 'De Double Indemnity à Drive : évolution du noir.', synthese: 'Le neo-noir est-il fidèle à l\'esprit original ?' } },
  { id: 'ge-3', title: 'La comédie comme art', description: 'Faire rire est-il plus dur que faire pleurer ?', category: 'genre', tags: ['aesthetic', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'La comédie est-elle sous-estimée comme art ?', approfondissement: 'De Chaplin à Wes Anderson : élévation du comique.', synthese: 'La comédie peut-elle atteindre les sommets du drame ?' } },
  { id: 'ge-4', title: 'Science-fiction spéculative', description: 'Quand la SF anticipe notre futur.', category: 'genre', tags: ['technologique', 'philosophique', 'social'], agent: 'cg-cine-futurist', depth: 'exploration', prompts: { exploration: 'La SF a-t-elle le pouvoir de prédire le futur ?', approfondissement: 'Blade Runner, Her, Ex Machina : anticipations devenues réalité.', synthese: 'La SF est-elle notre meilleur outil de prospective ?' } },
  { id: 'ge-5', title: 'Le documentaire hybride', description: 'Quand la frontière entre fiction et réel s\'efface.', category: 'genre', tags: ['esthétique', 'expérimental', 'éthique'], agent: 'cg-cine-critic', depth: 'approfondissement', prompts: { exploration: 'Qu\'est-ce qu\'un documentaire hybride ?', approfondissement: 'Les limites de la mise en scène documentaire.', synthese: 'Le documentaire hybride est-il plus honnête que le pur documentaire ?' } },

  // ── SON & MUSIQUE (4) ──
  { id: 'sm-1', title: 'Le silence au cinéma', description: 'Quand l\'absence de son devient le son le plus puissant.', category: 'sound-music', tags: ['sonore', 'esthétique', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Quel est le pouvoir du silence au cinéma ?', approfondissement: 'A Quiet Place, No Country : le silence comme tension.', synthese: 'Le silence est-il le son le plus expressif ?' } },
  { id: 'sm-2', title: 'Leitmotiv et mémoire musicale', description: 'Comment la musique de film grave nos souvenirs.', category: 'sound-music', tags: ['sonore', 'psychologique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Pourquoi certains thèmes musicaux sont-ils inoubliables ?', approfondissement: 'Williams, Morricone, Zimmer : architectes sonores.', synthese: 'La musique de film est-elle le lien le plus fort entre un film et son public ?' } },
  { id: 'sm-3', title: 'Musique diégétique vs extradiégétique', description: 'Musique dans le film vs musique du film.', category: 'sound-music', tags: ['sonore', 'narratif'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Quelle est la différence d\'impact ?', approfondissement: 'Scorsese et la jukebox diégétique : cas d\'étude.', synthese: 'Le choix diégétique/extradiégétique change-t-il la nature du film ?' } },
  { id: 'sm-4', title: 'ASMR cinématographique', description: 'Quand le son design crée une expérience physique.', category: 'sound-music', tags: ['sonore', 'aesthetic', 'experimental'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Le son au cinéma peut-il être physiquement ressenti ?', approfondissement: 'Sound design immersif : Gravity, Dunkirk, Arrival.', synthese: 'Vers un cinéma haptique à travers le son ?' } },

  // ── LANGAGE VISUEL (4) ──
  { id: 'vi-1', title: 'Le plan-séquence', description: 'Quand la caméra ne coupe jamais.', category: 'visual', tags: ['visuel', 'aesthetic', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Pourquoi le plan-séquence fascine-t-il tant ?', approfondissement: '1917, Birdman, Children of Men : prouesses techniques.', synthese: 'Le plan-séquence est-il un sommet du cinéma ?' } },
  { id: 'vi-2', title: 'Symétrie et cadrage', description: 'L\'obsession géométrique au cinéma.', category: 'visual', tags: ['visuel', 'esthétique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Que communique la symétrie au cinéma ?', approfondissement: 'Kubrick, Anderson, Villeneuve : géomètres de l\'image.', synthese: 'La symétrie est-elle beauté ou oppression visuelle ?' } },
  { id: 'vi-3', title: 'Le noir et blanc aujourd\'hui', description: 'Choix esthétique radical à l\'ère de la 4K HDR.', category: 'visual', tags: ['visuel', 'aesthetic', 'experimental'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Pourquoi choisir le noir et blanc aujourd\'hui ?', approfondissement: 'Roma, Mank, Belfast : le N&B comme déclaration.', synthese: 'Le noir et blanc est-il plus cinématographique que la couleur ?' } },
  { id: 'vi-4', title: 'Aspect ratio comme outil narratif', description: 'Quand le format d\'image raconte l\'histoire.', category: 'visual', tags: ['visuel', 'narratif'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Le format d\'image est-il un choix narratif ?', approfondissement: 'Mommy (Dolan), Grand Budapest Hotel : format comme sens.', synthese: 'Le ratio d\'image est-il la dimension narrative la plus sous-estimée ?' } },

  // ── ADAPTATIONS (4) ──
  { id: 'ad-1', title: 'Le livre est toujours mieux ?', description: 'L\'éternel débat livre vs film.', category: 'adaptation', tags: ['narratif', 'esthétique'], agent: 'cg-cine-narratologist', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Le livre est-il vraiment toujours supérieur au film ?', approfondissement: 'Adaptations qui surpassent l\'original : existe-t-il des exemples ?', synthese: 'Faut-il comparer ou considérer deux œuvres distinctes ?' } },
  { id: 'ad-2', title: 'Adapter l\'inadaptable', description: 'Les œuvres réputées impossibles à filmer.', category: 'adaptation', tags: ['narratif', 'esthétique'], agent: 'cg-cine-narratologist', depth: 'approfondissement', prompts: { exploration: 'Qu\'est-ce qui rend une œuvre inadaptable ?', approfondissement: 'Dune, Watchmen, Ulysse : défis et solutions.', synthese: 'L\'inadaptable est-il un mythe ?' } },
  { id: 'ad-3', title: 'Remake et reboot', description: 'L\'art de refaire sans copier.', category: 'adaptation', tags: ['narratif', 'économique'], agent: 'cg-cine-critic', depth: 'exploration', prompts: { exploration: 'Les remakes sont-ils créativement justifiables ?', approfondissement: 'The Thing, Scarface, Suspiria : quand le remake transcende.', synthese: 'Le remake est-il un acte de création ou de paresse ?' } },
  { id: 'ad-4', title: 'Jeux vidéo → Cinéma', description: 'Pourquoi les adaptations de jeux échouent (et changent).', category: 'adaptation', tags: ['narratif', 'technologique'], agent: 'cg-cine-narratologist', depth: 'exploration', prompts: { exploration: 'Pourquoi les adaptations de jeux vidéo échouent-elles ?', approfondissement: 'The Last of Us, Arcane : la nouvelle vague.', synthese: 'L\'adaptation vidéoludique a-t-elle enfin trouvé sa formule ?' } },

  // ── CINÉMA MONDIAL (4) ──
  { id: 'gw-1', title: 'Hallyu : la vague coréenne', description: 'Comment le cinéma coréen a conquis le monde.', category: 'global', tags: ['historique', 'social', 'economic'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Qu\'est-ce qui fait la force du cinéma coréen ?', approfondissement: 'De Kim Ki-duk à Bong Joon-ho : trajectoire mondiale.', synthese: 'Le modèle coréen est-il reproductible par d\'autres cinémas nationaux ?' } },
  { id: 'gw-2', title: 'Bollywood au-delà des clichés', description: 'Le cinéma indien dans toute sa diversité.', category: 'global', tags: ['historique', 'social'], agent: 'cg-cine-historian', depth: 'exploration', prompts: { exploration: 'Bollywood est-il réducteur pour parler du cinéma indien ?', approfondissement: 'Malayalam, Tamil, Bengali : les cinémas indiens.', synthese: 'Le cinéma indien est-il le plus divers du monde ?' } },
  { id: 'gw-3', title: 'Cinéma africain émergent', description: 'Nollywood et au-delà : le continent qui s\'affirme.', category: 'global', tags: ['historique', 'social', 'postcolonial'], agent: 'cg-cine-historian', depth: 'exploration', sensitivityFlags: ['representation'], prompts: { exploration: 'Quel est l\'état du cinéma africain aujourd\'hui ?', approfondissement: 'Nollywood, Ouagadougou, nouveaux auteurs : paysage.', synthese: 'Le cinéma africain est-il le prochain grand mouvement mondial ?' } },
  { id: 'gw-4', title: 'Cinéma iranien : art sous contrainte', description: 'Créer des chefs-d\'œuvre malgré la censure.', category: 'global', tags: ['historique', 'politique', 'esthétique'], agent: 'cg-cine-historian', depth: 'approfondissement', sensitivityFlags: ['politics', 'religion'], prompts: { exploration: 'Comment le cinéma iranien crée-t-il dans la contrainte ?', approfondissement: 'Kiarostami, Farhadi, Panahi : résistance par l\'art.', synthese: 'La contrainte est-elle un catalyseur de créativité ?' } },

  // ── DÉBATS (6) ──
  { id: 'de-1', title: 'Marvel est-il du cinéma ?', description: 'Le débat Scorsese revisité.', category: 'debate', tags: ['aesthetic', 'economic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Scorsese a-t-il raison de dire que Marvel n\'est pas du cinéma ?', approfondissement: 'Qu\'est-ce qui définit le "vrai" cinéma ?', synthese: 'Le cinéma doit-il être une catégorie exclusive ?' } },
  { id: 'de-2', title: 'CGI vs effets pratiques', description: 'Le numérique a-t-il tué la magie ?', category: 'debate', tags: ['technologique', 'aesthetic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Le CGI est-il devenu une béquille créative ?', approfondissement: 'Mad Max Fury Road vs tout le MCU : comparaison.', synthese: 'La meilleure approche est-elle l\'hybride ?' } },
  { id: 'de-3', title: 'Les Oscars sont-ils pertinents ?', description: 'La plus grande cérémonie du cinéma est-elle encore crédible ?', category: 'debate', tags: ['politique', 'economic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Les Oscars reflètent-ils la qualité cinématographique ?', approfondissement: 'Lobbying, politique, représentation : les coulisses.', synthese: 'Faut-il réinventer les prix cinématographiques ?' } },
  { id: 'de-4', title: 'Cinéma trop long ?', description: 'Les films sont-ils devenus trop longs ?', category: 'debate', tags: ['narratif', 'social'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Un film de 3h est-il justifié ?', approfondissement: 'Killers of the Flower Moon, Oppenheimer : trop long ?', synthese: 'Y a-t-il une durée idéale pour un film ?' } },
  { id: 'de-5', title: 'La mort du DVD', description: 'Le physique a-t-il encore un sens ?', category: 'debate', tags: ['technologique', 'economic', 'ecological'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Le DVD est-il mort pour de bon ?', approfondissement: 'Collection physique vs streaming : perte ou progrès ?', synthese: 'La dématérialisation est-elle une menace pour la préservation ?' } },
  { id: 'de-6', title: 'Sous-titres vs doublage', description: 'Le grand schisme de la consommation internationale.', category: 'debate', tags: ['social', 'aesthetic'], agent: 'cg-cine-provocateur', depth: 'exploration', challengeMode: true, prompts: { exploration: 'Le doublage trahit-il l\'œuvre originale ?', approfondissement: 'L\'argument de l\'accessibilité vs la pureté artistique.', synthese: 'Existe-t-il un compromis idéal ?' } },
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
  { id: 'explore', label: '\u{1F50D} Explorer', description: 'Découvrir un sujet', categories: ['film-analysis', 'history', 'genre', 'global'] },
  { id: 'think', label: '\u{1F9E0} Réfléchir', description: 'Penser en profondeur', categories: ['philosophy', 'ethics', 'narrative'] },
  { id: 'debate', label: '\u{1F525} Débattre', description: 'Confronter les idées', categories: ['debate', 'industry'] },
  { id: 'society', label: '\u{1F30D} Société', description: 'Cinéma et monde', categories: ['society', 'representation'] },
  { id: 'craft', label: '\u{1F3A8} Technique', description: 'L\'art du cinéma', categories: ['visual', 'sound-music'] },
  { id: 'future', label: '\u{1F680} Futur', description: 'Demain', categories: ['technology'] },
  { id: 'auteurs', label: '\u2B50 Auteurs', description: 'Les grands noms', categories: ['auteur'] },
  { id: 'adapt', label: '\u{1F4DA} Adaptations', description: 'Du livre au film', categories: ['adaptation'] },
  { id: 'challenge', label: '\u2694\uFE0F Challenge', description: 'L\'avocat du diable', categories: [] },
  { id: 'sensitive', label: '\u26A0\uFE0F Sensible', description: 'Sujets délicats', categories: [] },
  { id: 'trending', label: '\u{1F4C8} Tendances', description: 'Sujets actuels', categories: [] },
  { id: 'random', label: '\u{1F3B2} Aléatoire', description: 'Surprise !', categories: [] },
]
