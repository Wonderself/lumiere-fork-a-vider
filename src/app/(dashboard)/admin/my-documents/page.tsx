'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  FileText, Plus, Search, Download, Copy, Check, Loader2,
  Mail, Briefcase, BarChart3, FileSignature, Lightbulb, Target,
  Users, Shield, Megaphone, DollarSign, Zap, BookOpen,
  ClipboardList, PenTool, Presentation, Scale, Heart,
  Globe, Award, Calendar, Star, Film, Trash2, Eye,
} from 'lucide-react'

interface DocTemplate {
  id: string
  name: string
  category: string
  icon: typeof FileText
  prompt: string
}

interface SavedDoc {
  id: string
  templateId: string
  title: string
  content: string
  createdAt: Date
}

const TEMPLATES: DocTemplate[] = [
  // Business
  { id: 'business-plan', name: 'Business Plan', category: 'Business', icon: Briefcase, prompt: 'Generates a structured business plan for a collaborative cinema project.' },
  { id: 'pitch-deck', name: 'Pitch Deck', category: 'Business', icon: Presentation, prompt: 'Creates a compelling pitch deck to present the project to investors.' },
  { id: 'swot', name: 'Analyse SWOT', category: 'Business', icon: Target, prompt: 'Runs a complete SWOT analysis of the project.' },
  { id: 'financial-proj', name: 'Financial projections', category: 'Business', icon: DollarSign, prompt: 'Generates 3-year financial projections.' },
  { id: 'exec-summary', name: 'Executive Summary', category: 'Business', icon: ClipboardList, prompt: 'Writes a one-page executive summary.' },
  // Communication
  { id: 'email-investor', name: 'Email Investisseur', category: 'Communication', icon: Mail, prompt: 'Writes a professional email to reach out to a potential investor.' },
  { id: 'email-partner', name: 'Email Partenariat', category: 'Communication', icon: Mail, prompt: 'Writes a partnership proposal email.' },
  { id: 'press-release', name: 'Press release', category: 'Communication', icon: Megaphone, prompt: 'Writes a press release for a major announcement.' },
  { id: 'newsletter', name: 'Newsletter', category: 'Communication', icon: Mail, prompt: 'Writes a monthly newsletter for the community.' },
  { id: 'social-post', name: 'Social media posts', category: 'Communication', icon: Globe, prompt: 'Generates 5 social media posts (LinkedIn, Twitter, Instagram).' },
  // Legal
  { id: 'contract-collab', name: 'Contrat Collaboration', category: 'Juridique', icon: FileSignature, prompt: 'Writes a creative collaboration contract template.' },
  { id: 'nda', name: 'NDA', category: 'Juridique', icon: Shield, prompt: 'Generates a standard non-disclosure agreement.' },
  { id: 'cgu', name: 'CGU / CGV', category: 'Juridique', icon: Scale, prompt: 'Writes the terms of service.' },
  { id: 'license', name: 'Licence Contenu', category: 'Juridique', icon: FileSignature, prompt: 'Generates a creative content usage license.' },
  // Reports
  { id: 'weekly-report', name: 'Rapport Hebdomadaire', category: 'Rapports', icon: BarChart3, prompt: 'Generates a weekly activity report template.' },
  { id: 'monthly-report', name: 'Rapport Mensuel', category: 'Rapports', icon: BarChart3, prompt: 'Generates a complete monthly report with KPIs.' },
  { id: 'incident-report', name: 'Rapport d\'Incident', category: 'Rapports', icon: Shield, prompt: 'Writes a technical incident report template.' },
  { id: 'audit-report', name: 'Rapport d\'Audit', category: 'Rapports', icon: ClipboardList, prompt: 'Generates a security/quality audit report.' },
  // Creative
  { id: 'brief-creatif', name: 'Creative brief', category: 'Creative', icon: Lightbulb, prompt: 'Writes a creative brief for a new film.' },
  { id: 'synopsis', name: 'Synopsis Film', category: 'Creative', icon: Film, prompt: 'Generates a film synopsis from a concept.' },
  { id: 'character-bible', name: 'Bible Personnages', category: 'Creative', icon: Users, prompt: 'Creates a detailed character bible.' },
  { id: 'mood-board-desc', name: 'Description Mood Board', category: 'Creative', icon: PenTool, prompt: 'Describes a visual mood board for a project.' },
  // Strategy
  { id: 'roadmap', name: 'Roadmap Produit', category: 'Strategy', icon: Calendar, prompt: 'Generates a 6-month product roadmap.' },
  { id: 'competitive', name: 'Analyse Concurrentielle', category: 'Strategy', icon: Award, prompt: 'Runs a detailed competitive analysis.' },
  { id: 'okr', name: 'OKRs Trimestriels', category: 'Strategy', icon: Target, prompt: 'Defines the quarter\'s OKRs.' },
]

const CATEGORIES = Array.from(new Set(TEMPLATES.map(t => t.category)))

export default function MyDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [activeTemplate, setActiveTemplate] = useState<DocTemplate | null>(null)
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<'templates' | 'library'>('templates')

  const filtered = TEMPLATES
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))

  async function generateDoc(template: DocTemplate) {
    setGenerating(template.id)
    setActiveTemplate(template)
    setGeneratedContent(null)

    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000))

    const content = `# ${template.name}\n\n*Généré le ${new Date().toLocaleDateString('fr-FR')} par CineGeny AI*\n\n---\n\n## ${template.name}\n\n${template.prompt}\n\n### Section 1\nContenu généré par l'IA pour "${template.name}". En production, ce contenu sera généré par Claude avec le prompt spécifique au template.\n\n### Section 2\nAnalyse détaillée et recommandations personnalisées basées sur le contexte du projet CineGeny.\n\n### Section 3\nConclusion et prochaines étapes.\n\n---\n*Document généré automatiquement — à personnaliser selon vos besoins.*`

    setGeneratedContent(content)
    setGenerating(null)
    toast.success(`${template.name} généré`)
  }

  function saveDoc() {
    if (!generatedContent || !activeTemplate) return
    const doc: SavedDoc = {
      id: `doc-${Date.now()}`,
      templateId: activeTemplate.id,
      title: activeTemplate.name,
      content: generatedContent,
      createdAt: new Date(),
    }
    setSavedDocs(prev => [doc, ...prev])
    toast.success('Document sauvegardé')
  }

  async function copyContent() {
    if (!generatedContent) return
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">My Documents</h1>
          <p className="text-sm text-white/50 mt-1">25 templates · AI generation · Personal library</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('templates')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === 'templates' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>Templates</button>
          <button onClick={() => setView('library')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === 'library' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
            Bibliothèque ({savedDocs.length})
          </button>
        </div>
      </div>

      {view === 'templates' ? (
        <>
          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un template..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              <button onClick={() => setSelectedCategory('all')} className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${selectedCategory === 'all' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>Tous</button>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${selectedCategory === cat ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(template => {
              const TIcon = template.icon
              const isGenerating = generating === template.id
              return (
                <button
                  key={template.id}
                  onClick={() => generateDoc(template)}
                  disabled={!!generating}
                  className="text-left rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.03] hover:border-white/15 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TIcon className="h-5 w-5 text-[#E50914]" />
                    <span className="text-sm font-medium text-white">{template.name}</span>
                    {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-[#E50914] ml-auto" />}
                  </div>
                  <p className="text-[10px] text-white/50">{template.category}</p>
                </button>
              )
            })}
          </div>

          {/* Custom Prompt */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <PenTool className="h-4 w-4 text-purple-500" /> Document personnalisé
            </h3>
            <div className="flex gap-3">
              <input value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Describe the document to generate..." className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
              <button
                onClick={() => { if (customPrompt) generateDoc({ id: 'custom', name: 'Custom document', category: 'Custom', icon: FileText, prompt: customPrompt }) }}
                disabled={!customPrompt || !!generating}
                className="px-4 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">{activeTemplate?.name}</h3>
                <div className="flex gap-2">
                  <button onClick={copyContent} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] hover:bg-white/[0.08] transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={saveDoc} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-500/10 text-green-400 hover:bg-green-500/15 transition-colors">
                    <Download className="h-3.5 w-3.5" /> Sauver
                  </button>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white/80 leading-relaxed bg-white/[0.03] rounded-xl p-4">{generatedContent}</pre>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Library */
        <div className="space-y-3">
          {savedDocs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <FileText className="h-10 w-10 text-white/50 mx-auto mb-3" />
              <p className="text-sm text-white/50">No saved documents</p>
              <p className="text-xs text-white/50 mt-1">Generate a document then click Save</p>
            </div>
          ) : savedDocs.map(doc => (
            <div key={doc.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#E50914]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{doc.title}</p>
                  <p className="text-[10px] text-white/50">{doc.createdAt.toLocaleString('fr-FR')}</p>
                </div>
                <button onClick={() => { setGeneratedContent(doc.content); setActiveTemplate({ id: doc.templateId, name: doc.title, category: '', icon: FileText, prompt: '' }); setView('templates') }} className="text-xs text-blue-500 hover:underline">
                  <Eye className="h-4 w-4" />
                </button>
                <button onClick={() => setSavedDocs(prev => prev.filter(d => d.id !== doc.id))} className="text-xs text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
