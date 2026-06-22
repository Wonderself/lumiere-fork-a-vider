'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FILM_MEMORY_CATEGORIES, FILM_MEMORY_EXPLAINER, KNOWLEDGE_AGENTS } from '@/data/knowledge'
import {
  Brain, BookOpen, Users, Globe, Palette, Clock,
  Volume2, AlertTriangle, Bookmark, Clipboard, Bot,
  Plus, Save, Loader2, ChevronDown, ChevronRight,
  Shield, Sparkles, Lock, CheckCircle2, Search,
  Film, Eye, Trash2, Edit,
} from 'lucide-react'

const CAT_ICONS: Record<string, typeof Users> = {
  users: Users, globe: Globe, palette: Palette, clock: Clock,
  'volume-2': Volume2, 'alert-triangle': AlertTriangle,
  bookmark: Bookmark, clipboard: Clipboard,
}

interface MemoryEntry {
  id: string; category: string; content: string; tags: string[]; createdAt: Date
}

export default function FilmKnowledgePage() {
  const [view, setView] = useState<'explain' | 'build'>('explain')
  const [filmTitle, setFilmTitle] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [newContent, setNewContent] = useState('')
  const [newTags, setNewTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  function addEntry() {
    if (!newContent.trim() || !activeCategory) return
    setSaving(true)
    setTimeout(() => {
      setEntries(prev => [...prev, {
        id: `e-${Date.now()}`, category: activeCategory, content: newContent.trim(),
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean), createdAt: new Date(),
      }])
      setNewContent(''); setNewTags(''); setSaving(false)
      toast.success('Mémoire ajoutée — l\'IA l\'utilisera pour rester cohérente')
    }, 800)
  }

  const categoryEntries = entries.filter(e => e.category === activeCategory)
  const completeness = Math.round((new Set(entries.map(e => e.category)).size / FILM_MEMORY_CATEGORIES.length) * 100)

  // ─── EXPLAIN VIEW ─────────────────────────────────────────────────

  if (view === 'explain') {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Mémoire Film</span>
            </div>
            <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
              {FILM_MEMORY_EXPLAINER.title}
            </h1>
            <p className="text-lg text-gray-400">{FILM_MEMORY_EXPLAINER.subtitle}</p>
          </div>

          {/* Agents */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {KNOWLEDGE_AGENTS.map(a => (
              <div key={a.slug} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 shrink-0">
                <Bot className="h-4 w-4" style={{ color: a.color }} />
                <div><p className="text-xs font-medium text-white">{a.name}</p><p className="text-[10px] text-gray-500">{a.role}</p></div>
              </div>
            ))}
          </div>

          {/* Explainer Sections */}
          <div className="space-y-6 mb-12">
            {FILM_MEMORY_EXPLAINER.sections.map((section, i) => (
              <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Categories Preview */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 text-center">8 Catégories de Mémoire</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FILM_MEMORY_CATEGORIES.map(cat => {
                const CIcon = CAT_ICONS[cat.icon] || Brain
                return (
                  <div key={cat.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 text-center">
                    <CIcon className="h-8 w-8 mx-auto mb-3" style={{ color: cat.color }} />
                    <p className="text-sm font-semibold text-white">{cat.label}</p>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button onClick={() => setView('build')} className="inline-flex items-center gap-2 px-8 py-4 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-2xl transition-colors text-lg">
              <BookOpen className="h-6 w-6" />
              Construire la Mémoire de Mon Film
            </button>
            <p className="text-xs text-gray-600 mt-3">Plus la bible est riche, plus les contributions IA seront cohérentes</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── BUILD VIEW ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => setView('explain')} className="text-xs text-gray-500 hover:text-white mb-2 block">← Retour aux explications</button>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Bible Film — Mémoire IA</h1>
            <p className="text-sm text-gray-400 mt-1">Complétude: {completeness}% · {entries.length} entrées</p>
          </div>
          <div className="text-right">
            <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#E50914] rounded-full transition-all" style={{ width: `${completeness}%` }} />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">{completeness}% complet</p>
          </div>
        </div>

        {/* Film Title */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-6">
          <label className="text-xs text-gray-400 mb-1.5 block">Titre du film</label>
          <input value={filmTitle} onChange={e => setFilmTitle(e.target.value)} placeholder="Le titre de votre film..." className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category List */}
          <div className="space-y-2">
            {FILM_MEMORY_CATEGORIES.map(cat => {
              const CIcon = CAT_ICONS[cat.icon] || Brain
              const count = entries.filter(e => e.category === cat.id).length
              const isActive = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${isActive ? 'bg-gray-800 border border-gray-700' : 'border border-transparent hover:bg-gray-900/50'}`}>
                  <CIcon className="h-4 w-4 shrink-0" style={{ color: cat.color }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>{cat.label}</p>
                  </div>
                  {count > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914]">{count}</span>}
                  {count === 0 && <span className="text-[10px] text-gray-600">vide</span>}
                </button>
              )
            })}
          </div>

          {/* Category Content */}
          <div className="lg:col-span-3">
            {!activeCategory ? (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/30 p-12 text-center">
                <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-sm text-gray-500">Sélectionnez une catégorie pour commencer à remplir la mémoire de votre film</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Category Header */}
                {(() => {
                  const cat = FILM_MEMORY_CATEGORIES.find(c => c.id === activeCategory)!
                  const CIcon = CAT_ICONS[cat.icon] || Brain
                  return (
                    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <CIcon className="h-5 w-5" style={{ color: cat.color }} />
                        <h2 className="text-lg font-semibold text-white">{cat.label}</h2>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{cat.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {cat.requiredFields.map(f => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{f}</span>)}
                      </div>
                      <p className="text-[10px] text-gray-600 italic">Ex: {cat.examples[0]}</p>
                    </div>
                  )
                })()}

                {/* Add Entry */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 space-y-3">
                  <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Décrivez en détail... L'IA utilisera cette information pour rester cohérente." rows={4} className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
                  <input value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="Tags (séparés par virgules)" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
                  <button onClick={addEntry} disabled={saving || !newContent.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                    {saving ? 'Indexation...' : 'Ajouter à la mémoire'}
                  </button>
                </div>

                {/* Entries */}
                {categoryEntries.length > 0 && (
                  <div className="space-y-3">
                    {categoryEntries.map(entry => (
                      <div key={entry.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex gap-1.5">
                            {entry.tags.map(tag => <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">#{tag}</span>)}
                          </div>
                          <button onClick={() => { setEntries(prev => prev.filter(e => e.id !== entry.id)); toast.success('Supprimé') }} className="text-gray-600 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{entry.content}</p>
                        <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          Indexé · {entry.createdAt.toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
