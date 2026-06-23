'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Target, FolderOpen, Brain, StickyNote, Plus, Trash2,
  CheckCircle2, Circle, Clock, AlertTriangle, Loader2,
  Flag, Calendar, Zap, TrendingUp, Shield, Eye,
} from 'lucide-react'

interface Objective {
  id: string
  title: string
  description: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

interface ActionFolder {
  name: string
  icon: typeof Target
  color: string
  items: string[]
}

interface Note {
  id: string
  content: string
  timestamp: Date
}

const ACTION_FOLDERS: ActionFolder[] = [
  { name: 'Produit', icon: Zap, color: '#3B82F6', items: [] },
  { name: 'Marketing', icon: TrendingUp, color: '#EF4444', items: [] },
  { name: 'Finance', icon: Target, color: '#10B981', items: [] },
  { name: 'Tech', icon: Brain, color: '#8B5CF6', items: [] },
  { name: 'Juridique', icon: Shield, color: '#6366F1', items: [] },
  { name: 'Équipe', icon: Flag, color: '#F59E0B', items: [] },
  { name: 'Partenariats', icon: Eye, color: '#EC4899', items: [] },
  { name: 'Community', icon: Calendar, color: '#14B8A6', items: [] },
]

export default function MyStrategyPage() {
  const [tab, setTab] = useState<'objectives' | 'actions' | 'plan' | 'notes'>('objectives')
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: '1', title: 'Lancer la V1 publique', description: 'Deploy the first publicly accessible version', deadline: '2026-04-15', priority: 'high', completed: false },
    { id: '2', title: 'Premiers 100 utilisateurs', description: 'Atteindre 100 inscrits actifs', deadline: '2026-05-01', priority: 'high', completed: false },
    { id: '3', title: 'Anthropic API integration', description: 'Connect the AI agents to the real Claude model', deadline: '2026-04-01', priority: 'medium', completed: false },
  ])
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [newObj, setNewObj] = useState({ title: '', description: '', deadline: '', priority: 'medium' as const })
  const [showNewObj, setShowNewObj] = useState(false)
  const [aiPlan, setAiPlan] = useState<string | null>(null)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [folders, setFolders] = useState(ACTION_FOLDERS)
  const [activeFolderIdx, setActiveFolderIdx] = useState<number | null>(null)
  const [newAction, setNewAction] = useState('')

  function addObjective() {
    if (!newObj.title) return
    setObjectives(prev => [...prev, { ...newObj, id: `obj-${Date.now()}`, completed: false }])
    setNewObj({ title: '', description: '', deadline: '', priority: 'medium' })
    setShowNewObj(false)
    toast.success('Goal added')
  }

  function toggleObjective(id: string) {
    setObjectives(prev => prev.map(o => o.id === id ? { ...o, completed: !o.completed } : o))
  }

  function addNote() {
    if (!newNote.trim()) return
    setNotes(prev => [{ id: `note-${Date.now()}`, content: newNote.trim(), timestamp: new Date() }, ...prev])
    setNewNote('')
  }

  function addAction(folderIdx: number) {
    if (!newAction.trim()) return
    setFolders(prev => {
      const updated = [...prev]
      updated[folderIdx] = { ...updated[folderIdx], items: [...updated[folderIdx].items, newAction.trim()] }
      return updated
    })
    setNewAction('')
  }

  async function generateAIPlan() {
    setGeneratingPlan(true)
    await new Promise(r => setTimeout(r, 3000))
    setAiPlan(`## Plan Stratégique IA — CineGeny\n*Généré par Studio Head · ${new Date().toLocaleDateString('fr-FR')}*\n\n### 🎯 Priorités de la semaine\n1. Finaliser l'intégration API Anthropic\n2. Tester le flux de paiement crédits\n3. Préparer le pitch deck investisseurs\n\n### 📋 Actions 30 jours\n- Déployer la V1 sur le domaine production\n- Recruter 3 beta-testeurs créateurs\n- Configurer les crons Telegram en production\n- Mettre en place le monitoring Sentry\n- Rédiger la documentation API publique\n\n### 🔭 Vision 90 jours\n- 100 utilisateurs actifs\n- 5 films en production sur la plateforme\n- Première levée de fonds seed (€200K)\n- Partenariat avec 1 festival de cinéma\n\n### 📊 KPIs à suivre\n| KPI | Cible | Actuel |\n|-----|-------|--------|\n| Users actifs | 100 | 0 |\n| Films en prod | 5 | 0 |\n| Revenue (cr) | 1000 | 0 |\n| NPS | >40 | N/A |\n\n### ⚠️ Risques\n1. **Coût API IA** — Surveiller la consommation tokens\n2. **Adoption** — Besoin de contenu de qualité pour attirer les créateurs\n3. **Technique** — Stabilité du déploiement Coolify`)
    setGeneratingPlan(false)
    toast.success('Plan IA généré par Studio Head')
  }

  const PRIORITY_CONFIG = {
    high: { label: 'Haute', color: 'text-red-400', bg: 'bg-red-500/10' },
    medium: { label: 'Moyenne', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    low: { label: 'Basse', color: 'text-green-400', bg: 'bg-green-500/10' },
  }

  const tabs = [
    { key: 'objectives' as const, label: 'Objectifs', icon: Target },
    { key: 'actions' as const, label: 'Actions', icon: FolderOpen },
    { key: 'plan' as const, label: 'Plan IA', icon: Brain },
    { key: 'notes' as const, label: 'Notes', icon: StickyNote },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">My Strategy</h1>
        <p className="text-sm text-white/50 mt-1">Objectifs · Actions · Plan IA · Notes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => {
          const TIcon = t.icon
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>
              <TIcon className="h-4 w-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {/* Objectives Tab */}
      {tab === 'objectives' && (
        <div className="space-y-4">
          <button onClick={() => setShowNewObj(!showNewObj)} className="flex items-center gap-2 text-sm text-[#E50914] hover:underline"><Plus className="h-4 w-4" /> Ajouter un objectif</button>

          {showNewObj && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
              <input value={newObj.title} onChange={e => setNewObj(p => ({ ...p, title: e.target.value }))} placeholder="Titre" className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
              <input value={newObj.description} onChange={e => setNewObj(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
              <div className="flex gap-3">
                <input type="date" value={newObj.deadline} onChange={e => setNewObj(p => ({ ...p, deadline: e.target.value }))} className="rounded-lg border border-white/10 px-3 py-2 text-sm" />
                <select value={newObj.priority} onChange={e => setNewObj(p => ({ ...p, priority: e.target.value as any }))} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </select>
                <button onClick={addObjective} className="px-4 py-2 bg-[#E50914] text-white text-sm rounded-lg">Add</button>
              </div>
            </div>
          )}

          {objectives.map(obj => (
            <div key={obj.id} className={`rounded-xl border bg-white/5 p-5 transition-colors ${obj.completed ? 'border-green-500/20 opacity-60' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleObjective(obj.id)}>
                  {obj.completed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-white/50" />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${obj.completed ? 'line-through text-white/50' : 'text-white'}`}>{obj.title}</p>
                  {obj.description && <p className="text-xs text-white/50">{obj.description}</p>}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[obj.priority].bg} ${PRIORITY_CONFIG[obj.priority].color}`}>{PRIORITY_CONFIG[obj.priority].label}</span>
                {obj.deadline && <span className="text-[10px] text-white/50 flex items-center gap-1"><Clock className="h-3 w-3" />{obj.deadline}</span>}
                <button onClick={() => setObjectives(prev => prev.filter(o => o.id !== obj.id))} className="text-white/50 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions Tab */}
      {tab === 'actions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder, idx) => {
            const FIcon = folder.icon
            const isActive = activeFolderIdx === idx
            return (
              <div key={folder.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <button onClick={() => setActiveFolderIdx(isActive ? null : idx)} className="flex items-center gap-2 w-full text-left mb-3">
                  <FIcon className="h-4 w-4" style={{ color: folder.color }} />
                  <span className="text-sm font-semibold text-white">{folder.name}</span>
                  <span className="text-[10px] text-white/50 ml-auto">{folder.items.length}</span>
                </button>
                {folder.items.map((item, i) => (
                  <p key={i} className="text-xs text-white/60 py-1 border-t border-white/10">• {item}</p>
                ))}
                {isActive && (
                  <div className="flex gap-2 mt-2">
                    <input value={newAction} onChange={e => setNewAction(e.target.value)} placeholder="Nouvelle action..." className="flex-1 text-xs rounded border border-white/10 px-2 py-1 focus:outline-none" onKeyDown={e => { if (e.key === 'Enter') addAction(idx) }} />
                    <button onClick={() => addAction(idx)} className="text-xs text-[#E50914]"><Plus className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* AI Plan Tab */}
      {tab === 'plan' && (
        <div className="space-y-4">
          {!aiPlan ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <Brain className="h-12 w-12 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI strategic plan</h3>
              <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">L&apos;agent Studio Head analyse votre situation et génère un plan stratégique complet.</p>
              <button onClick={generateAIPlan} disabled={generatingPlan} className="px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
                {generatingPlan ? <><Loader2 className="inline h-5 w-5 animate-spin mr-2" />Generating...</> : <><Brain className="inline h-5 w-5 mr-2" />Generate the plan</>}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Plan generated by Studio Head</h3>
                <button onClick={() => setAiPlan(null)} className="text-xs text-white/50 hover:text-[#E50914]">Regenerate</button>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white/80 leading-relaxed">{aiPlan}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {tab === 'notes' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Nouvelle note..." className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" onKeyDown={e => { if (e.key === 'Enter') addNote() }} />
            <button onClick={addNote} disabled={!newNote.trim()} className="px-4 py-2 bg-[#E50914] text-white rounded-xl disabled:opacity-30"><Plus className="h-4 w-4" /></button>
          </div>
          {notes.length === 0 && <p className="text-center text-sm text-white/50 py-8">Aucune note</p>}
          {notes.map(note => (
            <div key={note.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-white/50">{note.timestamp.toLocaleString('fr-FR')}</span>
                <button onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))} className="text-white/50 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <p className="text-sm text-white/80">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
