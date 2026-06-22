'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { UNSPLASH_CATEGORIES, BUSINESS_AGENTS } from '@/data/business-tools'
import {
  Image, Search, Download, Heart, Grid3X3, Bot,
  ExternalLink, Copy, Check, Plus, Eye,
} from 'lucide-react'

interface ImageResult {
  id: string; url: string; thumb: string; alt: string; photographer: string; downloadUrl: string
}

const MOCK_IMAGES: ImageResult[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300', alt: 'Cinema projection', photographer: 'Jake Hills', downloadUrl: '#' },
  { id: '2', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300', alt: 'Film reel', photographer: 'Chris Murray', downloadUrl: '#' },
  { id: '3', url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', thumb: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300', alt: 'Movie theater', photographer: 'Krists Luhaers', downloadUrl: '#' },
  { id: '4', url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800', thumb: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300', alt: 'Cinema noir', photographer: 'Denise Jans', downloadUrl: '#' },
  { id: '5', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300', alt: 'Empty cinema', photographer: 'Felix Mooneeram', downloadUrl: '#' },
  { id: '6', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300', alt: 'Camera lens', photographer: 'ShareGrid', downloadUrl: '#' },
  { id: '7', url: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800', thumb: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=300', alt: 'Film set', photographer: 'Chris Murray', downloadUrl: '#' },
  { id: '8', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', thumb: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', alt: 'Costume design', photographer: 'Aiony Haust', downloadUrl: '#' },
]

export default function ImageBankPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('cinema')
  const [images] = useState<ImageResult[]>(MOCK_IMAGES)
  const [moodboard, setMoodboard] = useState<ImageResult[]>([])
  const [preview, setPreview] = useState<ImageResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function addToMoodboard(img: ImageResult) {
    if (moodboard.find(m => m.id === img.id)) { toast.error('Déjà dans le moodboard'); return }
    setMoodboard(prev => [...prev, img])
    toast.success('Ajouté au moodboard')
  }

  async function copyUrl(url: string, id: string) {
    await navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Banque d&apos;Images</h1>
          <p className="text-sm text-white/50 mt-1">Unsplash intégré · Moodboards cinéma · {UNSPLASH_CATEGORIES.length} catégories</p>
        </div>
        <span className="text-[10px] text-white/40">Moodboard: {moodboard.length} images</span>
      </div>

      {/* Agent */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 w-fit">
        <Bot className="h-3.5 w-3.5" style={{ color: BUSINESS_AGENTS[6].color }} />
        <div><p className="text-[10px] font-medium text-white">{BUSINESS_AGENTS[6].name}</p><p className="text-[9px] text-white/40">{BUSINESS_AGENTS[6].role}</p></div>
      </div>

      {/* Search + Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher des images (ex: neon city night)..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {UNSPLASH_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${category === cat.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map(img => (
          <div key={img.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden group">
            <div className="aspect-video relative">
              <img src={img.thumb} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => setPreview(img)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><Eye className="h-4 w-4 text-white" /></button>
                <button onClick={() => addToMoodboard(img)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><Plus className="h-4 w-4 text-white" /></button>
                <button onClick={() => copyUrl(img.url, img.id)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30">
                  {copied === img.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white" />}
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-white truncate">{img.alt}</p>
              <p className="text-[10px] text-white/40">📷 {img.photographer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Moodboard */}
      {moodboard.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-[#E50914]" /> Mon Moodboard ({moodboard.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {moodboard.map(img => (
              <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group">
                <img src={img.thumb} alt={img.alt} className="w-full h-full object-cover" />
                <button onClick={() => setMoodboard(p => p.filter(m => m.id !== img.id))} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreview(null)}>
          <div className="max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={preview.url} alt={preview.alt} className="w-full rounded-xl" />
            <div className="flex items-center justify-between mt-3 px-2">
              <p className="text-sm text-white">{preview.alt} — 📷 {preview.photographer}</p>
              <button onClick={() => { addToMoodboard(preview); setPreview(null) }} className="px-3 py-1.5 rounded-lg bg-[#E50914] text-white text-xs">Ajouter au moodboard</button>
            </div>
            <button onClick={() => setPreview(null)} className="mt-3 w-full py-2 bg-white/[0.08] text-white/60 rounded-xl text-sm">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}
