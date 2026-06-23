'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  DISCUSSION_TEMPLATES, DISCUSSION_CATEGORIES, DISCUSSION_AGENTS,
  DISCUSSION_TAGS, SENSITIVITY_TOPICS, DISCUSSION_SECTIONS,
  getTemplatesByCategory, getChallengeTemplates, getTemplateById,
} from '@/data/deep-discussions'
import type { DiscussionTemplate, DiscussionAgent } from '@/data/deep-discussions'
import {
  MessageSquare, Search, Bot, Flame, Shield, Send,
  Loader2, Copy, Check, Download, Share2, ArrowLeft,
  Brain, BookOpen, Eye, Users, PenTool, Rocket,
  Film, Cpu, Building, Star, Layers, Music, Camera,
  Globe, BookOpenIcon, Zap, AlertTriangle, ChevronRight,
  Twitter, Linkedin, Mail, X, Edit3, RefreshCcw,
} from 'lucide-react'

const AGENT_ICON_MAP: Record<string, typeof Brain> = {
  brain: Brain, 'book-open': BookOpen, eye: Eye, users: Users,
  'pen-tool': PenTool, rocket: Rocket, flame: Flame,
}

const CAT_ICON_MAP: Record<string, typeof Film> = {
  film: Film, brain: Brain, shield: Shield, 'book-open': BookOpen,
  'pen-tool': PenTool, users: Users, eye: Eye, cpu: Cpu,
  building: Building, star: Star, layers: Layers, music: Music,
  camera: Camera, book: BookOpen, globe: Globe, flame: Flame,
}

interface ChatMsg { role: 'user' | 'assistant'; content: string; depth?: string }

export default function DeepDiscussionsPage() {
  const [view, setView] = useState<'browse' | 'chat'>('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showChallengeOnly, setShowChallengeOnly] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<DiscussionTemplate | null>(null)
  const [activeAgent, setActiveAgent] = useState<DiscussionAgent | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [depth, setDepth] = useState<'exploration' | 'approfondissement' | 'synthese'>('exploration')
  const [challengeMode, setChallengeMode] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [copied, setCopied] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Filter templates
  let filtered = DISCUSSION_TEMPLATES
  if (selectedCategory) filtered = filtered.filter(t => t.category === selectedCategory)
  if (selectedTag) filtered = filtered.filter(t => t.tags.includes(selectedTag))
  if (showChallengeOnly) filtered = filtered.filter(t => t.challengeMode)
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }

  function startDiscussion(template: DiscussionTemplate) {
    const agent = DISCUSSION_AGENTS.find(a => a.slug === template.agent) || DISCUSSION_AGENTS[0]
    setActiveTemplate(template)
    setActiveAgent(agent)
    setChallengeMode(template.challengeMode || false)
    setCustomTitle(template.title)
    setMessages([])
    setDepth('exploration')
    setView('chat')
    // Auto-send first prompt
    setTimeout(() => sendWithPrompt(template.prompts.exploration), 300)
  }

  function buildDepthResponse(promptText: string, depthLevel: string, template: DiscussionTemplate | null, agent: DiscussionAgent | null, isChallenge: boolean): string {
    const agentName = agent?.name || 'Agent'
    const topic = template?.title || promptText.substring(0, 60)
    const category = template?.category || 'cinema'

    // Exploration-level responses: broad framing and key tensions
    const explorationBodies: Record<string, string> = {
      philosophie: `La question que vous soulevez touche à l'une des tensions les plus fondamentales de l'art cinématographique : peut-on dissocier l'œuvre de l'intention qui l'a produite ? Le philosophe Roland Barthes, dans sa célèbre "Mort de l'auteur" (1967), argue que le texte, une fois livré au lecteur, acquiert une autonomie radicale. Appliqué au cinéma, ce principe nous invite à lire un film comme une structure signifiante indépendante de la biographie ou de la volonté de son créateur.\n\nPourtant, le cinéma résiste à cette dématérialisation. Il est, par essence, un art collectif, industriel, incarné dans des corps et des lieux. Le plan de caméra porte l'empreinte d'une décision concrète ; le montage trahit une vision du monde. En ce sens, André Bazin voyait dans le cinéma une "fenêtre ouverte sur le monde" — une ambition phénoménologique que ni la peinture ni la littérature ne peuvent revendiquer avec la même urgence.\n\nCe qu'il faut peut-être retenir, c'est que le cinéma produit deux types de vérité simultanément : la vérité ontologique de l'enregistrement (la lumière a vraiment frappé cette surface, ce visage a vraiment existé devant cette caméra) et la vérité construite du récit, qui est toujours partielle, orientée, idéologique. La grande force des œuvres qui durent, de Tarkovski à Chantal Akerman, est précisément d'exposer cette tension plutôt que de la résoudre.`,

      histoire: `Pour comprendre l'enjeu de votre question, il faut replacer le cinéma dans la longue durée de son histoire — cent trente ans à peine, mais d'une densité exceptionnelle. Le cinéma est né comme attraction foraine (les frères Lumière, 1895), est devenu art narratif sous l'impulsion de Griffith et Méliès, puis industrie culturelle avec Hollywood dans les années 1930-1940, avant de se réinventer en langage d'auteur avec les Nouvelles Vagues des années 1950-1960.\n\nChaque rupture technologique — l'avènement du parlant en 1927, la couleur généralisée dans les années 1950, le numérique dans les années 2000 — a produit une crise esthétique et économique, mais aussi un renouvellement des possibles. Les cinéastes qui ont su saisir ces moments de transition (Godard avec le Scope, Cassavetes avec le 16mm, Alfonso Cuarón avec le numérique dans "Roma") ont redéfini ce que le cinéma pouvait montrer et comment il pouvait le montrer.\n\nCe qu'on observe aujourd'hui avec la prolifération des plateformes de streaming et la démocratisation des outils de production, c'est un nouveau moment de ce type. La question n'est pas de savoir si le cinéma "survit", mais sous quelles formes et avec quels imaginaires il se reconfigure — et qui aura le pouvoir de nommer ce qui mérite d'être appelé "cinema".`,

      ethique: `La dimension éthique du cinéma est peut-être la plus négligée par la critique académique, pourtant la plus immédiatement perçue par les spectateurs ordinaires. Lorsqu'un film montre la souffrance d'un individu réel, lorsqu'il utilise l'image d'un corps sans consentement explicite, lorsqu'il recourt à des représentations stéréotypées pour faciliter la compréhension narrative — il engage une responsabilité qui déborde le seul cadre esthétique.\n\nEmmanuel Levinas nous offre ici un cadre précieux : la rencontre avec le visage de l'Autre constitue une obligation éthique primordiale, irréductible à toute systématisation. Le gros plan cinématographique sur un visage humain n'est donc jamais innocent : il convoque cette obligation. Ingmar Bergman l'avait compris — "Persona" (1966) tout entier est construit sur l'insupportable proximité de deux visages de femmes.\n\nMais l'éthique du cinéma ne se réduit pas à l'image. Elle traverse aussi les conditions de production : qui travaille dans quelles conditions pour produire ce divertissement ? Qui finance, et dans quel but ? Les scandales révélés par le mouvement #MeToo ont montré que l'industrie cinématographique pouvait produire des œuvres humanistes tout en reproduisant en coulisses des structures de domination. Cette contradiction n'est pas résoluble par la seule "quality" artistique.`,

      narration: `La question narrative au cinéma est fondamentalement une question de temps : le cinéma, plus que tout autre art, est l'art de la durée organisée. Vingt-quatre images par seconde, une heure quarante-cinq de présence imposée au spectateur — c'est une architecture temporelle que le cinéaste fabrique et que le spectateur doit habiter.\n\nDavid Bordwell, dans ses travaux sur la narratologie cinématographique, distingue entre le "syuzhet" (la manière dont l'histoire est racontée, l'ordre des scènes) et la "fabula" (l'histoire reconstituée mentalement par le spectateur). Toute la sophistication du cinéma classique consiste à rendre cette distinction imperceptible : le spectateur doit oublier qu'il regarde un récit construit pour se croire face à une vie qui se déroule naturellement.\n\nLes grandes ruptures narratives du cinéma — le flashback dans "Citizen Kane" (Welles, 1941), la structure fragmentée de "Rashomon" (Kurosawa, 1950), l'ellipse radicale de "L'Année dernière à Marienbad" (Resnais, 1961), la temporalité distordue de "Memento" (Nolan, 2000) — ont toutes eu pour effet de révéler ce que le cinéma classique dissimulait : que toute narration est un acte de pouvoir sur le temps, et donc sur la vérité.`,
    }

    const approfondissementBodies: Record<string, string> = {
      philosophie: `En approfondissant la dimension philosophique, on touche à la question du "réel" cinématographique — ce que le philosophe Stanley Cavell appelait "the claim of reason" appliquée à l'image photographique. Le cinéma hérite de la photographie une relation privilégiée et problématique au monde : il l'enregistre, mais en le transformant irrémédiablement par le cadre, la lumière, le montage.\n\nZigmunt Bauman, théoricien de la "modernité liquide", nous offre une grille de lecture inattendue : dans un monde où les identités sont fluides et les certitudes évanescentes, le cinéma joue le rôle d'un condensateur d'expériences. Il fixe ce qui fuit, il donne forme à ce qui résiste à la forme. D'où peut-être son attrait persistant dans une époque saturée d'images.\n\nMais cette fonction condensatrice a un coût : elle simplifie, elle sélectionne, elle exclut. Le hors-champ n'est pas qu'une technique filmique — c'est une métaphore épistémologique. Ce que le cinéma ne montre pas structure aussi profondément notre compréhension du réel que ce qu'il montre. C'est pourquoi les cinéastes les plus philosophiquement ambitieux — de Bresson à Haneke — travaillent autant sur l'absence que sur la présence.`,

      histoire: `À un niveau d'analyse plus fin, on découvre que l'histoire du cinéma est aussi une histoire des corps — et de leur contrôle. La star-system hollywoodien n'a pas seulement produit des figures mythiques ; il a codifié des normes de beauté, de race et de genre qui ont infiltré les imaginaires collectifs de plusieurs générations. La "blonde hitchcockienne" n'est pas qu'un type narratif : c'est un dispositif de régulation du désir masculin érigé en convention cinématographique.\n\nLes travaux de Laura Mulvey sur le "regard masculin" (male gaze) dans le cinéma classique hollywoodien restent un point de référence incontournable, non parce qu'ils épuisent la question, mais parce qu'ils l'ont rendue visible. Depuis, des générations de cinéastes — de Kathryn Bigelow à Céline Sciamma — ont travaillé à déconstruire ou reconfigurer ce regard, avec des succès et des limites variables.\n\nCe que l'histoire longue du cinéma nous apprend, c'est que les formes esthétiques ne sont jamais neutres : elles portent des relations de pouvoir, des hiérarchies sociales, des désirs et des peurs. L'histoire du cinéma est donc aussi une histoire politique — pas nécessairement dans le sens de la politique partisane, mais dans le sens des conditions d'apparition et de circulation des images.`,

      ethique: `L'approfondissement éthique nous conduit vers la question de la représentation des minorités et des "autres" — question qui a explosé dans le débat public avec les discussions sur la diversité à Hollywood et dans les industries cinématographiques mondiales.\n\nLa sociologue bell hooks, dans "Black Looks: Race and Representation" (1992), analyse comment le cinéma hollywoodien a historiquement construit le regard des spectateurs noirs à travers des images qui les réduisaient à des stéréotypes ou les rendaient invisibles. Le simple accès à des représentations "positives" ne suffit pas, argue-t-elle : il faut interroger qui contrôle les moyens de production des images et dans quel cadre économique et idéologique.\n\nCette question de la représentation ne concerne pas seulement la race. Elle touche le handicap, la classe sociale, le genre, l'orientation sexuelle — toutes les catégories d'identité par lesquelles les sociétés organisent leur hiérarchie. Le cinéma, en tant qu'art de masse, a une responsabilité particulière dans la reproduction ou la transformation de ces hiérarchies. Mais cette responsabilité ne peut pas être réduite à une injonction de "représentation positive" sans nuancer : la complexité artistique et la justice sociale ne se recoupent pas toujours de manière simple.`,

      narration: `L'approfondissement narratif nous conduit vers la question du point de vue — qui voit, qui sait, qui raconte dans un film ? La focalisation narrative (terme emprunté à Genette et adapté par Metz à l'analyse filmique) désigne le filtre perceptif et cognitif à travers lequel l'histoire nous est présentée.\n\nLe film noir américain des années 1940-1950 a exploité magistralement l'instabilité du point de vue : dans "Double Indemnité" (Wilder, 1944) ou "Sunset Boulevard" (Wilder, 1950), la voix off du narrateur crée un décalage ironique entre ce que l'on voit et ce qu'on nous dit, instillant un doute permanent sur la fiabilité de la perception. Cette convention narrative a traversé les décennies pour irriguer des œuvres aussi différentes que "American Beauty" (Mendes, 1999) ou "The Usual Suspects" (Singer, 1995).\n\nL'ère du cinéma de superhéros a d'une certaine manière appauvri cette sophistication narrative : le point de vue y est généralement clair, omniscient, orienté vers l'action. Mais en réaction, une génération de cinéastes contemporains — Lynne Ramsay, Pablo Larraín, Kleber Mendonça Filho — travaille à restaurer l'opacité, l'ambiguïté, la subjectivité radicale comme outils narratifs.`,
    }

    const syntheseBodies: Record<string, string> = {
      philosophie: `La synthèse philosophique nous ramène à une question fondamentale : pourquoi le cinéma résiste-t-il aux catégories ? Peut-être parce qu'il est, comme le disait Deleuze, un "cerveau-écran" — une machine à produire des percepts et des affects qui court-circuitent les médiations conceptuelles habituelles.\n\nLa synthèse que l'on peut proposer est la suivante : le cinéma n'est ni un miroir du réel (conception naïve), ni une pure construction arbitraire (relativisme radical), mais un dispositif de mise en tension permanente entre l'enregistrement et la construction, entre l'automatisme photographique et la décision artistique. Cette tension n'est pas un défaut à corriger : elle est la condition même de sa puissance spécifique.\n\nPour le cinéaste contemporain, cela implique une double conscience : conscience des conditions matérielles et technologiques qui rendent l'image possible, et conscience des héritages culturels et idéologiques qui orientent le regard. Le grand cinéma — de Kubrick à Parasite de Bong Joon-ho — est celui qui, précisément, rend cette double conscience visible dans l'œuvre elle-même.`,

      histoire: `La synthèse historique invite à distinguer deux types de continuité dans l'histoire du cinéma : la continuité technologique (toujours davantage de résolution, de réalisme, de spectaculaire) et la continuité artistique (toujours davantage de complexité, de nuance, d'ambiguïté). Ces deux lignes ne coïncident pas nécessairement — et leur tension est productrice.\n\nLe cinéma qui a le plus marqué les mémoires n'est pas toujours le cinéma le plus techniquement avancé de son époque. "La Passion de Jeanne d'Arc" de Dreyer (1928) — film muet, noir et blanc, gros plans obsessionnels — continue d'exercer une fascination que des superproductions contemporaines ne parviennent pas à égaler. Ce paradoxe dit quelque chose d'essentiel : la puissance du cinéma réside moins dans la perfection de l'illusion que dans la qualité de la présence qu'il convoque.\n\nEn définitive, l'histoire du cinéma est l'histoire d'un médium en perpétuelle négociation avec lui-même — entre divertissement et art, entre industrie et artisanat, entre domination culturelle et résistance esthétique. C'est cette négociation, jamais résolue, qui maintient le cinéma vivant.`,

      ethique: `La synthèse éthique nous conduit à reconnaître que le cinéma est irréductiblement situé — dans le temps, dans l'espace, dans des rapports sociaux. Toute tentative de lui assigner une éthique universelle se heurte à cette contingence radicale.\n\nCe que l'on peut affirmer, en revanche, c'est l'importance d'une éthique de la réflexivité : un cinéma qui sait qu'il produit des effets dans le monde, qui assume cette responsabilité sans la fuir dans le refugede "l'art pour l'art", et qui construit des dispositifs permettant au spectateur de prendre conscience de sa propre position de regard.\n\nLes films qui durent — qui continuent d'être regardés, discutés, enseignés des décennies après leur production — sont souvent ceux qui ont su incorporer cette réflexivité dans leur forme même. "Tokyo Story" d'Ozu, "Shoah" de Lanzmann, "Sans Soleil" de Marker : des films qui, chacun à leur manière, interrogent les limites et les responsabilités de la mise en images du monde.`,

      narration: `La synthèse narrative nous permet d'identifier ce qui fait la spécificité du récit cinématographique par rapport aux autres formes narratives : sa temporalité imposée. Le lecteur d'un roman contrôle son rythme de lecture ; le spectateur d'un film est soumis au temps du cinéaste.\n\nCette contrainte est aussi une libération : elle permet au cinéaste de jouer sur la durée, sur la répétition, sur l'attente — de créer des effets impossibles dans d'autres médias. La lenteur d'Andreï Tarkovski n'est pas une déficience narrative : c'est une technique pour modifier le temps intérieur du spectateur, pour créer les conditions d'une expérience contemplative que la vie quotidienne ne permet plus.\n\nLa grande question narrative du cinéma contemporain est peut-être celle-ci : dans un monde saturé de stimuli, de coupures, de flux discontinus, le cinéma a-t-il encore le luxe de la durée ? Les réponses divergent. Certains (Christopher Nolan, Denis Villeneuve) maintiennent l'ambition de la grande forme narrative. D'autres (Apichatpong Weerasethakul, Wang Bing) explorent des durées qui défient toute classification commerciale. Ces deux tendances ne s'excluent pas : elles témoignent de la vitalité d'un médium qui n'a pas encore épuisé ses possibles.`,
    }

    const catKey = category.toLowerCase()
    let bodyText = ''

    if (depthLevel === 'exploration') {
      bodyText = explorationBodies[catKey] || explorationBodies['philosophie']
    } else if (depthLevel === 'approfondissement') {
      bodyText = approfondissementBodies[catKey] || approfondissementBodies['philosophie']
    } else {
      bodyText = syntheseBodies[catKey] || syntheseBodies['philosophie']
    }

    const challengeTag = isChallenge
      ? `\n\n---\n⚔️ **Mode Challenge** : Il convient toutefois de noter que cette analyse, aussi rigoureuse soit-elle, repose sur des prémisses contestables. On pourrait argumenter que le cinéma d'auteur tel que nous l'avons décrit est lui-même un produit idéologique — une construction de la critique française des années 1950 qui a eu pour effet de hiérarchiser les pratiques cinématographiques au profit de formes culturellement dominantes. La "politique des auteurs" a ses angles morts : elle tend à invisibiliser le travail collectif, à survaloriser l'originalité individuelle, à reproduire des canons qui excluent systématiquement certaines voix.`
      : ''

    const depthLabels: Record<string, string> = {
      exploration: 'Exploration',
      approfondissement: 'Approfondissement',
      synthese: 'Summary',
    }

    return `**${agentName} — ${depthLabels[depthLevel] || depthLevel}**\n\n*${topic}*\n\n${bodyText}${challengeTag}\n\n---\n*Passez au niveau suivant pour approfondir l'analyse.*`
  }

  async function sendWithPrompt(promptText: string) {
    setMessages(prev => [...prev, { role: 'user', content: promptText, depth }])
    setStreaming(true)
    await new Promise(r => setTimeout(r, 2000))
    const response = buildDepthResponse(promptText, depth, activeTemplate, activeAgent, challengeMode)
    setMessages(prev => [...prev, { role: 'assistant', content: response, depth }])
    setStreaming(false)
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return
    const msg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg, depth }])
    setStreaming(true)
    await new Promise(r => setTimeout(r, 1800))
    const agentName = activeAgent?.name || 'Agent'
    const category = activeTemplate?.category || 'philosophie'

    const followUpBodies: string[] = [
      `Votre question ouvre une piste particulièrement fructueuse. En reprenant le fil de l'analyse, on peut observer que le point que vous soulevez — "${msg.substring(0, 80)}${msg.length > 80 ? '...' : ''}" — touche à une dimension souvent négligée dans les discussions sur le cinéma : celle des conditions de réception.\n\nUn film n'existe pas dans un vide culturel. Il est regardé dans des contextes spécifiques — une salle obscure parisienne des années 1970, un écran de smartphone en 2024, une rétrospective en Cinémathèque — et ces contextes transforment radicalement l'expérience qu'il produit. C'est pourquoi les grandes œuvres cinématographiques semblent "parler autrement" à chaque génération de spectateurs : non parce qu'elles changent, mais parce que les cadres interprétatifs évoluent.\n\nLe théoricien Hans Robert Jauss appelait cela l'"horizon d'attente" : l'ensemble des normes, des références et des expériences que le spectateur apporte avec lui et qui conditionnent sa rencontre avec l'œuvre. Travailler sur ce concept, c'est reconnaître que la réception est toujours une co-production — entre le film et son spectateur, entre le passé et le présent.`,

      `La direction que vous proposez est particulièrement stimulante. Elle nous oblige à quitter le terrain des généralisations pour descendre dans la spécificité des œuvres — ce que la critique cinématographique a parfois tendance à négliger au profit des grandes théories.\n\nPrenons un exemple concret : la manière dont le cinéma iranien post-révolutionnaire (Kiarostami, Makhmalbaf, Panahi) a développé une esthétique du contournement face à la censure. Les contraintes imposées par le régime — interdiction de représenter des femmes sans voile, impossibilité de montrer des contacts physiques entre hommes et femmes non mariés — ont paradoxalement conduit ces cinéastes à inventer des formes nouvelles, plus subtiles, plus elliptiques. La limite est devenue productrice.\n\nCela rejoint une observation plus générale : les contraintes — budgétaires, politiques, technologiques — ne sont pas que des obstacles à la création cinématographique. Elles sont souvent ce qui force les cinéastes à trouver des solutions inédites, à inventer plutôt qu'à reproduire. Le néoréalisme italien est né de la pénurie de l'après-guerre ; la Nouvelle Vague française, du refus de l'académisme et du manque de moyens.`,
    ]

    const randomBody = followUpBodies[Math.floor(Math.random() * followUpBodies.length)]
    const response = `**${agentName} — Réponse**\n\n${randomBody}`
    setMessages(prev => [...prev, { role: 'assistant', content: response, depth }])
    setStreaming(false)
  }

  function advanceDepth() {
    if (!activeTemplate) return
    if (depth === 'exploration') {
      setDepth('approfondissement')
      sendWithPrompt(activeTemplate.prompts.approfondissement)
    } else if (depth === 'approfondissement') {
      setDepth('synthese')
      sendWithPrompt(activeTemplate.prompts.synthese)
    }
  }

  function exportMarkdown() {
    const md = `# ${customTitle}\n\n${messages.map(m => `**${m.role === 'user' ? 'Vous' : activeAgent?.name}** (${m.depth}):\n${m.content}\n`).join('\n---\n\n')}`
    navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Discussion exported as Markdown')
  }

  function shareUrl(platform: string) {
    const text = `Discussion cinéma : "${customTitle}" sur CineGeny`
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    }
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank')
  }

  // ─── BROWSE VIEW ──────────────────────────────────────────────────

  if (view === 'browse') {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{DISCUSSION_TEMPLATES.length} discussions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
              Deep <span className="text-[#E50914]">Discussions</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explorez le cinéma en profondeur avec 7 agents experts. Philosophie, histoire, éthique, narration, et plus.
            </p>
            <p className="text-xs text-gray-600 mt-2">Opus + Extended Thinking · 16 catégories · 17 tags · Mode Challenge</p>
          </div>

          {/* Agents */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {DISCUSSION_AGENTS.map(agent => {
              const AIcon = AGENT_ICON_MAP[agent.icon] || Bot
              return (
                <div key={agent.slug} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 shrink-0">
                  <AIcon className="h-4 w-4" style={{ color: agent.color }} />
                  <div>
                    <p className="text-xs font-medium text-white">{agent.name}</p>
                    <p className="text-[10px] text-gray-500">{agent.role}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Search + Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher une discussion..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <button onClick={() => { setSelectedCategory(null); setShowChallengeOnly(false) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${!selectedCategory && !showChallengeOnly ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>Tous ({DISCUSSION_TEMPLATES.length})</button>
              <button onClick={() => setShowChallengeOnly(!showChallengeOnly)} className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 ${showChallengeOnly ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}><Flame className="h-3 w-3" />Challenge</button>
              {DISCUSSION_CATEGORIES.map(cat => {
                const CIcon = CAT_ICON_MAP[cat.icon] || MessageSquare
                return (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id === selectedCategory ? null : cat.id); setShowChallengeOnly(false) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 ${selectedCategory === cat.id ? 'text-white' : 'bg-gray-800 text-gray-400'}`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}>
                    <CIcon className="h-3 w-3" />{cat.label}
                  </button>
                )
              })}
            </div>

            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              {DISCUSSION_TAGS.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-[10px] px-2 py-1 rounded-full border ${selectedTag === tag ? 'border-[#E50914] bg-[#E50914]/10 text-[#E50914]' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, 30).map(template => {
              const agent = DISCUSSION_AGENTS.find(a => a.slug === template.agent)
              const cat = DISCUSSION_CATEGORIES.find(c => c.id === template.category)
              return (
                <button key={template.id} onClick={() => startDiscussion(template)}
                  className="text-left rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-gray-600 hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    {template.challengeMode && <Flame className="h-3.5 w-3.5 text-red-500" />}
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>{cat?.label}</span>
                    {template.sensitivityFlags && template.sensitivityFlags.length > 0 && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{template.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">{agent?.name}</span>
                    <div className="flex gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {filtered.length > 30 && <p className="text-center text-xs text-gray-600 mt-6">+{filtered.length - 30} discussions supplémentaires...</p>}
        </div>
      </div>
    )
  }

  // ─── CHAT VIEW ────────────────────────────────────────────────────

  const AIcon = AGENT_ICON_MAP[activeAgent?.icon || 'brain'] || Bot

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
        <button onClick={() => setView('browse')} className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
        <AIcon className="h-5 w-5" style={{ color: activeAgent?.color }} />
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => { if (e.key === 'Enter') setEditingTitle(false) }} autoFocus className="bg-transparent text-sm font-semibold text-white border-b border-[#E50914] focus:outline-none w-full" />
          ) : (
            <button onClick={() => setEditingTitle(true)} className="text-sm font-semibold text-white hover:text-[#E50914] flex items-center gap-1 truncate">
              {customTitle} <Edit3 className="h-3 w-3 text-gray-500" />
            </button>
          )}
          <p className="text-[10px] text-gray-500">{activeAgent?.name} · Opus + Extended Thinking</p>
        </div>

        {/* Depth level */}
        <div className="flex gap-1">
          {(['exploration', 'approfondissement', 'synthese'] as const).map(d => (
            <span key={d} className={`text-[10px] px-2 py-1 rounded-full ${depth === d ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-500'}`}>{d}</span>
          ))}
        </div>

        {/* Challenge mode */}
        <button onClick={() => setChallengeMode(!challengeMode)} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] ${challengeMode ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
          <Flame className="h-3 w-3" /> {challengeMode ? 'Challenge ON' : 'Challenge'}
        </button>

        {/* Sensitivity flags */}
        {activeTemplate?.sensitivityFlags && activeTemplate.sensitivityFlags.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-yellow-500">
            <AlertTriangle className="h-3 w-3" /> Sensible
          </span>
        )}

        {/* Actions */}
        <button onClick={exportMarkdown} className="text-gray-400 hover:text-white" title="Export MD">
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Download className="h-4 w-4" />}
        </button>
        <div className="flex gap-1">
          {[
            { platform: 'twitter', icon: Twitter },
            { platform: 'linkedin', icon: Linkedin },
            { platform: 'email', icon: Mail },
          ].map(s => {
            const SIcon = s.icon
            return <button key={s.platform} onClick={() => shareUrl(s.platform)} className="p-1 text-gray-500 hover:text-white"><SIcon className="h-3.5 w-3.5" /></button>
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: `${activeAgent?.color}15` }}>
                  <AIcon className="h-4 w-4" style={{ color: activeAgent?.color }} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-200'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.depth && <p className="text-[10px] mt-2 opacity-50">Niveau: {msg.depth}</p>}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${activeAgent?.color}15` }}>
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: activeAgent?.color }} />
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" /><div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'150ms'}} /><div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'300ms'}} /></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input + Depth Advance */}
      <div className="px-6 pb-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {depth !== 'synthese' && messages.length > 0 && !streaming && (
            <button onClick={advanceDepth} className="w-full py-2 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Passer au niveau : {depth === 'exploration' ? 'Approfondissement' : 'Summary'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Your thoughts..."
              rows={1}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none min-h-[44px] max-h-[120px]"
              onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px' }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || streaming} className="h-11 w-11 rounded-xl bg-[#E50914] text-white disabled:opacity-30 flex items-center justify-center shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 text-center">
            Opus + Extended Thinking · {depth} · {challengeMode ? '⚔️ Challenge Mode' : 'Discussion'} · 0% commission
          </p>
        </div>
      </div>
    </div>
  )
}
