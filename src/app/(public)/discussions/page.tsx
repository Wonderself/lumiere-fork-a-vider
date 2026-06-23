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
      philosophie: `The question you raise touches one of the most fundamental tensions in the art of cinema: can a work be separated from the intention that produced it? In his famous essay "The Death of the Author" (1967), Roland Barthes argued that a text, once handed to the reader, acquires radical autonomy. Applied to cinema, this principle invites us to read a film as a structure of meaning independent of the biography or will of its creator.\n\nAnd yet cinema resists this dematerialization. It is, by essence, a collective, industrial art, embodied in bodies and places. A camera setup carries the imprint of a concrete decision; editing betrays a vision of the world. In this sense André Bazin saw in cinema a "window open onto the world" — a phenomenological ambition that neither painting nor literature can claim with the same urgency.\n\nWhat we should perhaps remember is that cinema produces two kinds of truth at once: the ontological truth of the recording (light really struck this surface, this face really existed in front of this camera) and the constructed truth of the story, which is always partial, oriented, ideological. The great strength of the works that endure, from Tarkovsky to Chantal Akerman, lies precisely in exposing this tension rather than resolving it.`,

      histoire: `To grasp what is at stake in your question, we have to place cinema within the long arc of its history — barely a hundred and thirty years, but of exceptional density. Cinema was born as a fairground attraction (the Lumière brothers, 1895), became a narrative art under the impulse of Griffith and Méliès, then a culture industry with Hollywood in the 1930s-1940s, before reinventing itself as an auteur language with the New Waves of the 1950s-1960s.\n\nEvery technological rupture — the arrival of sound in 1927, the spread of color in the 1950s, digital in the 2000s — produced an aesthetic and economic crisis, but also a renewal of possibilities. The filmmakers who seized these moments of transition (Godard with Scope, Cassavetes with 16mm, Alfonso Cuarón with digital in "Roma") redefined what cinema could show and how it could show it.\n\nWhat we are seeing today, with the proliferation of streaming platforms and the democratization of production tools, is a new moment of this kind. The question is not whether cinema "survives," but in what forms and with what imaginaries it reconfigures itself — and who will hold the power to name what deserves to be called "cinema."`,

      ethique: `The ethical dimension of cinema is perhaps the most neglected by academic criticism, yet the most immediately felt by ordinary viewers. When a film shows the suffering of a real person, when it uses the image of a body without explicit consent, when it resorts to stereotyped representations to ease narrative comprehension — it engages a responsibility that exceeds the purely aesthetic frame.\n\nEmmanuel Levinas offers a precious framework here: the encounter with the face of the Other constitutes a primordial ethical obligation, irreducible to any systematization. The cinematic close-up on a human face is therefore never innocent: it summons that obligation. Ingmar Bergman understood this — "Persona" (1966) is built in its entirety on the unbearable proximity of two women's faces.\n\nBut the ethics of cinema is not reducible to the image. It also runs through the conditions of production: who works, under what conditions, to produce this entertainment? Who funds it, and to what end? The scandals revealed by the #MeToo movement showed that the film industry could produce humanist works while reproducing structures of domination behind the scenes. This contradiction cannot be resolved by artistic "quality" alone.`,

      narration: `The question of narrative in cinema is fundamentally a question of time: cinema, more than any other art, is the art of organized duration. Twenty-four frames per second, an hour and forty-five minutes of presence imposed on the viewer — this is a temporal architecture that the filmmaker builds and the viewer must inhabit.\n\nIn his work on cinematic narratology, David Bordwell distinguishes between the "syuzhet" (the way the story is told, the order of scenes) and the "fabula" (the story mentally reconstructed by the viewer). The entire sophistication of classical cinema consists of making this distinction imperceptible: the viewer must forget they are watching a constructed narrative in order to believe they face a life unfolding naturally.\n\nThe great narrative ruptures of cinema — the flashback in "Citizen Kane" (Welles, 1941), the fragmented structure of "Rashomon" (Kurosawa, 1950), the radical ellipsis of "Last Year at Marienbad" (Resnais, 1961), the distorted temporality of "Memento" (Nolan, 2000) — all worked to reveal what classical cinema concealed: that all narration is an act of power over time, and therefore over truth.`,
    }

    const approfondissementBodies: Record<string, string> = {
      philosophie: `Digging deeper into the philosophical dimension, we reach the question of the cinematic "real" — what the philosopher Stanley Cavell called "the claim of reason" applied to the photographic image. Cinema inherits from photography a privileged and problematic relationship to the world: it records it, but transforms it irreversibly through framing, light, and editing.\n\nZygmunt Bauman, theorist of "liquid modernity," offers an unexpected reading: in a world where identities are fluid and certainties evanescent, cinema plays the role of a condenser of experiences. It fixes what flees, it gives form to what resists form. Hence, perhaps, its persistent appeal in an era saturated with images.\n\nBut this condensing function has a cost: it simplifies, it selects, it excludes. The off-screen space is not merely a filmic technique — it is an epistemological metaphor. What cinema does not show structures our understanding of the real as deeply as what it does show. That is why the most philosophically ambitious filmmakers — from Bresson to Haneke — work as much on absence as on presence.`,

      histoire: `At a finer level of analysis, we discover that the history of cinema is also a history of bodies — and of their control. The Hollywood star system did not only produce mythical figures; it codified norms of beauty, race, and gender that infiltrated the collective imaginations of several generations. The "Hitchcock blonde" is not just a narrative type: it is a device for regulating male desire, erected into a cinematic convention.\n\nLaura Mulvey's work on the "male gaze" in classical Hollywood cinema remains an unavoidable reference point — not because it exhausts the question, but because it made it visible. Since then, generations of filmmakers — from Kathryn Bigelow to Céline Sciamma — have worked to deconstruct or reconfigure that gaze, with varying degrees of success and limitation.\n\nWhat the long history of cinema teaches us is that aesthetic forms are never neutral: they carry power relations, social hierarchies, desires, and fears. The history of cinema is therefore also a political history — not necessarily in the sense of partisan politics, but in the sense of the conditions under which images appear and circulate.`,

      ethique: `Pushing the ethical inquiry further leads us to the question of the representation of minorities and of "others" — a question that exploded into public debate alongside discussions of diversity in Hollywood and in film industries worldwide.\n\nIn "Black Looks: Race and Representation" (1992), the scholar bell hooks analyzes how Hollywood cinema historically constructed the gaze of Black viewers through images that reduced them to stereotypes or rendered them invisible. Mere access to "positive" representations is not enough, she argues: we must ask who controls the means of producing images, and within what economic and ideological frame.\n\nThis question of representation does not concern race alone. It touches disability, social class, gender, sexual orientation — all the categories of identity by which societies organize their hierarchies. As a mass art, cinema bears a particular responsibility in reproducing or transforming those hierarchies. But that responsibility cannot be reduced to a demand for "positive representation" without nuance: artistic complexity and social justice do not always overlap in simple ways.`,

      narration: `Pushing the narrative inquiry further leads us to the question of point of view — who sees, who knows, who tells the story in a film? Narrative focalization (a term borrowed from Genette and adapted by Metz to film analysis) designates the perceptual and cognitive filter through which the story is presented to us.\n\nAmerican film noir of the 1940s-1950s exploited the instability of point of view masterfully: in "Double Indemnity" (Wilder, 1944) or "Sunset Boulevard" (Wilder, 1950), the narrator's voice-over creates an ironic gap between what we see and what we are told, instilling a permanent doubt about the reliability of perception. This narrative convention crossed the decades to feed works as different as "American Beauty" (Mendes, 1999) and "The Usual Suspects" (Singer, 1995).\n\nThe era of superhero cinema has, in a sense, impoverished this narrative sophistication: point of view there is generally clear, omniscient, oriented toward action. But in reaction, a generation of contemporary filmmakers — Lynne Ramsay, Pablo Larraín, Kleber Mendonça Filho — is working to restore opacity, ambiguity, and radical subjectivity as narrative tools.`,
    }

    const syntheseBodies: Record<string, string> = {
      philosophie: `The philosophical synthesis brings us back to a fundamental question: why does cinema resist categories? Perhaps because it is, as Deleuze put it, a "brain-screen" — a machine for producing percepts and affects that short-circuit our habitual conceptual mediations.\n\nThe synthesis we can propose is this: cinema is neither a mirror of the real (a naïve conception) nor a purely arbitrary construction (radical relativism), but a device of permanent tension between recording and construction, between photographic automatism and artistic decision. This tension is not a flaw to be corrected: it is the very condition of cinema's specific power.\n\nFor the contemporary filmmaker, this implies a double consciousness: awareness of the material and technological conditions that make the image possible, and awareness of the cultural and ideological legacies that orient the gaze. Great cinema — from Kubrick to Bong Joon-ho's Parasite — is precisely the cinema that makes this double consciousness visible within the work itself.`,

      histoire: `The historical synthesis invites us to distinguish two kinds of continuity in the history of cinema: technological continuity (ever more resolution, realism, spectacle) and artistic continuity (ever more complexity, nuance, ambiguity). These two lines do not necessarily coincide — and their tension is productive.\n\nThe cinema that has marked memory most is not always the most technically advanced cinema of its time. Dreyer's "The Passion of Joan of Arc" (1928) — silent, black and white, obsessive close-ups — still exerts a fascination that contemporary blockbusters cannot match. This paradox says something essential: the power of cinema lies less in the perfection of the illusion than in the quality of the presence it summons.\n\nUltimately, the history of cinema is the history of a medium in perpetual negotiation with itself — between entertainment and art, between industry and craft, between cultural domination and aesthetic resistance. It is this never-resolved negotiation that keeps cinema alive.`,

      ethique: `The ethical synthesis leads us to recognize that cinema is irreducibly situated — in time, in space, in social relations. Any attempt to assign it a universal ethic runs up against this radical contingency.\n\nWhat we can affirm, however, is the importance of an ethics of reflexivity: a cinema that knows it produces effects in the world, that assumes this responsibility rather than fleeing into the refuge of "art for art's sake," and that builds devices allowing the viewer to become aware of their own position as a watcher.\n\nThe films that endure — that continue to be watched, discussed, and taught decades after their production — are often those that managed to incorporate this reflexivity into their very form. Ozu's "Tokyo Story," Lanzmann's "Shoah," Marker's "Sans Soleil": films that, each in their own way, interrogate the limits and responsibilities of putting the world into images.`,

      narration: `The narrative synthesis lets us identify what makes cinematic storytelling specific compared to other narrative forms: its imposed temporality. The reader of a novel controls their reading pace; the viewer of a film is subject to the filmmaker's time.\n\nThis constraint is also a liberation: it lets the filmmaker play on duration, on repetition, on anticipation — to create effects impossible in other media. Andrei Tarkovsky's slowness is not a narrative deficiency: it is a technique for altering the viewer's inner time, for creating the conditions of a contemplative experience that everyday life no longer permits.\n\nThe great narrative question of contemporary cinema may be this: in a world saturated with stimuli, cuts, and discontinuous flows, does cinema still have the luxury of duration? Answers diverge. Some (Christopher Nolan, Denis Villeneuve) sustain the ambition of the grand narrative form. Others (Apichatpong Weerasethakul, Wang Bing) explore durations that defy any commercial classification. These two tendencies do not exclude each other: they testify to the vitality of a medium that has not yet exhausted its possibilities.`,
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
      ? `\n\n---\n⚔️ **Challenge Mode**: It is worth noting, however, that this analysis, however rigorous, rests on contestable premises. One could argue that auteur cinema as we have described it is itself an ideological product — a construction of 1950s French criticism that had the effect of ranking film practices in favor of culturally dominant forms. The "auteur theory" has its blind spots: it tends to render collective work invisible, to overvalue individual originality, and to reproduce canons that systematically exclude certain voices.`
      : ''

    const depthLabels: Record<string, string> = {
      exploration: 'Exploration',
      approfondissement: 'Deep dive',
      synthese: 'Summary',
    }

    return `**${agentName} — ${depthLabels[depthLevel] || depthLevel}**\n\n*${topic}*\n\n${bodyText}${challengeTag}\n\n---\n*Move to the next level to deepen the analysis.*`
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
      `Your question opens a particularly fruitful path. Picking up the thread of the analysis, we can observe that the point you raise — "${msg.substring(0, 80)}${msg.length > 80 ? '...' : ''}" — touches a dimension often neglected in discussions of cinema: that of the conditions of reception.\n\nA film does not exist in a cultural vacuum. It is watched in specific contexts — a darkened Paris theater in the 1970s, a smartphone screen in 2024, a retrospective at the Cinémathèque — and those contexts radically transform the experience it produces. That is why great cinematic works seem to "speak differently" to each generation of viewers: not because they change, but because the interpretive frames evolve.\n\nThe theorist Hans Robert Jauss called this the "horizon of expectation": the set of norms, references, and experiences a viewer brings with them, conditioning their encounter with the work. To work with this concept is to recognize that reception is always a co-production — between the film and its viewer, between past and present.`,

      `The direction you propose is particularly stimulating. It forces us to leave the terrain of generalizations and descend into the specificity of works — something film criticism sometimes tends to neglect in favor of grand theories.\n\nTake a concrete example: the way post-revolutionary Iranian cinema (Kiarostami, Makhmalbaf, Panahi) developed an aesthetic of circumvention in the face of censorship. The constraints imposed by the regime — a ban on showing women unveiled, the impossibility of depicting physical contact between unmarried men and women — paradoxically led these filmmakers to invent new forms, more subtle, more elliptical. The limit became productive.\n\nThis connects to a more general observation: constraints — budgetary, political, technological — are not only obstacles to film creation. They are often what forces filmmakers to find unprecedented solutions, to invent rather than reproduce. Italian neorealism was born of postwar scarcity; the French New Wave, of a rejection of academicism and a lack of means.`,
    ]

    const randomBody = followUpBodies[Math.floor(Math.random() * followUpBodies.length)]
    const response = `**${agentName} — Response**\n\n${randomBody}`
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
    const text = `Cinema discussion: "${customTitle}" on CineGeny`
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
              Explore cinema in depth with 7 expert agents. Philosophy, history, ethics, narrative, and more.
            </p>
            <p className="text-xs text-gray-600 mt-2">Opus + Extended Thinking · 16 categories · 17 tags · Challenge Mode</p>
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
          {filtered.length > 30 && <p className="text-center text-xs text-gray-600 mt-6">+{filtered.length - 30} more discussions...</p>}
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
