'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { LANDING_BLOCKS } from '@/data/marketing'
import type { LandingBlockType } from '@/data/marketing'
import {
  Layout, Plus, Trash2, MoveUp, MoveDown, Eye, Save,
  Image, Play, FileText, Users, Zap, Star, Grid3X3,
  Clock, Loader2, ExternalLink, Wand2,
} from 'lucide-react'

const BLOCK_ICONS: Record<string, typeof Layout> = {
  image: Image, play: Play, 'file-text': FileText, users: Users,
  zap: Zap, star: Star, grid: Grid3X3, clock: Clock,
}

interface PageBlock {
  id: string
  type: LandingBlockType
  content: Record<string, string>
}

interface LandingPage {
  id: string
  name: string
  filmTitle: string
  blocks: PageBlock[]
  status: 'draft' | 'published'
  createdAt: Date
}

export default function LandingBuilderPage() {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [activePage, setActivePage] = useState<LandingPage | null>(null)
  const [pageName, setPageName] = useState('')
  const [filmTitle, setFilmTitle] = useState('')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  function createPage() {
    if (!pageName.trim() || !filmTitle.trim()) { toast.error('Nom et titre requis'); return }
    const page: LandingPage = {
      id: `lp-${Date.now()}`, name: pageName, filmTitle,
      blocks: [
        { id: `b-${Date.now()}`, type: 'hero', content: { title: filmTitle, tagline: 'Un film qui va vous surprendre', bgImage: '' } },
        { id: `b-${Date.now() + 1}`, type: 'synopsis', content: { text: 'Synopsis à rédiger...', genre: '', duration: '' } },
        { id: `b-${Date.now() + 2}`, type: 'cta', content: { text: 'Votez maintenant', href: '#', color: '#E50914' } },
      ],
      status: 'draft', createdAt: new Date(),
    }
    setPages(prev => [page, ...prev])
    setActivePage(page)
    setPageName('')
    setFilmTitle('')
    toast.success('Landing page créée')
  }

  function addBlock(type: LandingBlockType) {
    if (!activePage) return
    const blockDef = LANDING_BLOCKS.find(b => b.type === type)
    const newBlock: PageBlock = {
      id: `b-${Date.now()}`, type, content: { ...blockDef?.defaultContent } as Record<string, string>,
    }
    setActivePage(prev => prev ? { ...prev, blocks: [...prev.blocks, newBlock] } : null)
  }

  function removeBlock(blockId: string) {
    setActivePage(prev => prev ? { ...prev, blocks: prev.blocks.filter(b => b.id !== blockId) } : null)
  }

  function moveBlock(blockId: string, direction: 'up' | 'down') {
    if (!activePage) return
    const idx = activePage.blocks.findIndex(b => b.id === blockId)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === activePage.blocks.length - 1)) return
    const newBlocks = [...activePage.blocks]
    const swap = direction === 'up' ? idx - 1 : idx + 1
    ;[newBlocks[idx], newBlocks[swap]] = [newBlocks[swap], newBlocks[idx]]
    setActivePage(prev => prev ? { ...prev, blocks: newBlocks } : null)
  }

  function updateBlockContent(blockId: string, key: string, value: string) {
    setActivePage(prev => {
      if (!prev) return null
      return { ...prev, blocks: prev.blocks.map(b => b.id === blockId ? { ...b, content: { ...b.content, [key]: value } } : b) }
    })
  }

  async function savePage() {
    if (!activePage) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setPages(prev => prev.map(p => p.id === activePage.id ? activePage : p))
    setSaving(false)
    toast.success('Page sauvegardée')
  }

  // ─── List View ────────────────────────────────────────────────────

  if (!activePage) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Landing Builder</h1>
          <p className="text-sm text-white/50 mt-1">Créez des pages promo pour vos films</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input value={pageName} onChange={e => setPageName(e.target.value)} placeholder="Nom de la page" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
            <input value={filmTitle} onChange={e => setFilmTitle(e.target.value)} placeholder="Titre du film" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
          </div>
          <button onClick={createPage} disabled={!pageName.trim() || !filmTitle.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50">
            <Plus className="h-5 w-5" /> Créer une landing page
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <Layout className="h-10 w-10 text-white/50 mx-auto mb-3" />
            <p className="text-sm text-white/50">Aucune landing page</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map(page => (
              <button key={page.id} onClick={() => setActivePage(page)} className="w-full text-left rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/15 transition-colors flex items-center gap-4">
                <Layout className="h-5 w-5 text-[#E50914]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{page.name}</p>
                  <p className="text-xs text-white/50">{page.filmTitle} · {page.blocks.length} blocs · {page.status}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── Editor View ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => setActivePage(null)} className="text-xs text-white/50 hover:text-white mb-1">← Retour</button>
          <h1 className="text-xl font-bold text-white">{activePage.name}</h1>
          <p className="text-xs text-white/50">{activePage.filmTitle} · {activePage.blocks.length} blocs</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPreview(!preview)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${preview ? 'bg-blue-50 text-blue-700' : 'bg-white/[0.05] text-white/60'}`}>
            <Eye className="inline h-3.5 w-3.5 mr-1" />{preview ? 'Éditer' : 'Preview'}
          </button>
          <button onClick={savePage} disabled={saving} className="px-4 py-1.5 bg-[#E50914] text-white text-xs font-medium rounded-lg disabled:opacity-50">
            {saving ? <Loader2 className="inline h-3.5 w-3.5 animate-spin mr-1" /> : <Save className="inline h-3.5 w-3.5 mr-1" />}Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Block Palette */}
        <div>
          <p className="text-xs font-semibold text-white/50 uppercase mb-3">Ajouter un bloc</p>
          <div className="space-y-2">
            {LANDING_BLOCKS.map(block => {
              const BIcon = BLOCK_ICONS[block.icon] || Layout
              return (
                <button key={block.type} onClick={() => addBlock(block.type)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.03] text-left transition-colors">
                  <BIcon className="h-4 w-4 text-[#E50914]" />
                  <div>
                    <p className="text-xs font-medium text-white">{block.label}</p>
                    <p className="text-[10px] text-white/50">{block.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Blocks Editor */}
        <div className="lg:col-span-3 space-y-4">
          {activePage.blocks.map((block, idx) => {
            const blockDef = LANDING_BLOCKS.find(b => b.type === block.type)
            const BIcon = BLOCK_ICONS[blockDef?.icon || 'zap'] || Layout

            if (preview) {
              return (
                <div key={block.id} className="rounded-xl border border-white/10 bg-white/5 p-8">
                  <div className="flex items-center gap-2 mb-4 text-[10px] text-white/50">
                    <BIcon className="h-3 w-3" /> {blockDef?.label}
                  </div>
                  {block.type === 'hero' && (
                    <div className="text-center py-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
                      <h2 className="text-3xl font-bold">{block.content.title || 'Titre'}</h2>
                      <p className="text-white/50 mt-2">{block.content.tagline || 'Tagline'}</p>
                    </div>
                  )}
                  {block.type === 'synopsis' && <p className="text-sm text-white/60 leading-relaxed">{block.content.text || 'Synopsis...'}</p>}
                  {block.type === 'cta' && (
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: block.content.color || '#E50914' }}>{block.content.text || 'CTA'}</button>
                    </div>
                  )}
                  {!['hero', 'synopsis', 'cta'].includes(block.type) && <p className="text-sm text-white/50 italic">[{blockDef?.label} — contenu configurable]</p>}
                </div>
              )
            }

            return (
              <div key={block.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <BIcon className="h-4 w-4 text-[#E50914]" />
                  <span className="text-sm font-medium text-white flex-1">{blockDef?.label}</span>
                  <button onClick={() => moveBlock(block.id, 'up')} disabled={idx === 0} className="p-1 text-white/50 hover:text-white/60 disabled:opacity-30"><MoveUp className="h-4 w-4" /></button>
                  <button onClick={() => moveBlock(block.id, 'down')} disabled={idx === activePage.blocks.length - 1} className="p-1 text-white/50 hover:text-white/60 disabled:opacity-30"><MoveDown className="h-4 w-4" /></button>
                  <button onClick={() => removeBlock(block.id)} className="p-1 text-white/50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3">
                  {Object.entries(block.content).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-[10px] text-white/50 mb-1 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                      {key === 'text' || key === 'tagline' ? (
                        <textarea value={value} onChange={e => updateBlockContent(block.id, key, e.target.value)} rows={2} className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
                      ) : (
                        <input value={value} onChange={e => updateBlockContent(block.id, key, e.target.value)} className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
