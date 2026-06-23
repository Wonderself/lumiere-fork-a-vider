'use client'

import { useState } from 'react'
import { RSS_SOURCES, VEILLE_CATEGORIES, MAJOR_FESTIVALS, PRODUCTIVITY_AGENTS } from '@/data/productivity'
import {
  Rss, Globe, Award, TrendingUp, Calendar, Clock,
  ExternalLink, Search, Filter, Bot, RefreshCcw,
  Star, MapPin, Tag, BarChart3, Newspaper,
} from 'lucide-react'
import { toast } from 'sonner'

interface FeedItem {
  id: string; source: string; title: string; summary: string; url: string; date: Date; category: string
}

const MOCK_FEED: FeedItem[] = [
  { id: '1', source: 'Variety', title: 'AI-Generated Films Are Reshaping Hollywood Distribution', summary: 'Major studios are experimenting with AI tools for pre-production and distribution strategy.', url: '#', date: new Date(Date.now() - 3600000), category: 'industry' },
  { id: '2', source: 'Deadline', title: 'Cannes 2026: First Wave of Official Selection Announced', summary: 'The festival reveals its initial lineup including several AI-assisted productions.', url: '#', date: new Date(Date.now() - 7200000), category: 'festivals' },
  { id: '3', source: 'TechCrunch AI', title: 'New Video Generation Models Achieve Cinema-Quality Output', summary: 'Latest models from Kling and Runway approach professional production standards.', url: '#', date: new Date(Date.now() - 14400000), category: 'tech' },
  { id: '4', source: 'Hollywood Reporter', title: 'Box Office: Indie Films Outperform Franchise Sequels in Q1', summary: 'A24 and independent distributors see record numbers as franchise fatigue sets in.', url: '#', date: new Date(Date.now() - 28800000), category: 'box-office' },
  { id: '5', source: 'Cahiers du Cinéma', title: 'Le cinéma participatif : nouvelle frontière de la création', summary: 'Analyse approfondie du modèle collaboratif porté par les plateformes comme CineGeny.', url: '#', date: new Date(Date.now() - 43200000), category: 'critique' },
  { id: '6', source: 'Screen Daily', title: 'European Co-Productions Hit All-Time High in 2025', summary: 'Cross-border collaborations increase as funding becomes more accessible.', url: '#', date: new Date(Date.now() - 86400000), category: 'industry' },
]

export default function VeillePage() {
  const [tab, setTab] = useState<'feed' | 'festivals' | 'sources'>('feed')
  const [filterCat, setFilterCat] = useState('all')
  const [search, setSearch] = useState('')
  const [feed] = useState<FeedItem[]>(MOCK_FEED)

  const filteredFeed = feed
    .filter(f => filterCat === 'all' || f.category === filterCat)
    .filter(f => !search || f.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Veille Cinéma</h1>
          <p className="text-sm text-white/50 mt-1">{RSS_SOURCES.length} sources · {MAJOR_FESTIVALS.length} festivals · Tendances industrie</p>
        </div>
        <button onClick={() => toast.success('Flux actualisé')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] text-white/60 hover:bg-white/[0.08] self-start sm:self-auto">
          <RefreshCcw className="h-3.5 w-3.5" /> Actualiser
        </button>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PRODUCTIVITY_AGENTS.slice(2, 6).map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div>
              <p className="text-[10px] font-medium text-white">{a.name}</p>
              <p className="text-[9px] text-white/50">{a.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'feed' as const, label: 'Flux', icon: Rss },
          { key: 'festivals' as const, label: 'Festivals', icon: Award },
          { key: 'sources' as const, label: 'Sources', icon: Globe },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}><TIcon className="h-4 w-4" />{t.label}</button>
        })}
      </div>

      {/* FEED TAB */}
      {tab === 'feed' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-lg text-xs ${filterCat === 'all' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>Tous</button>
              {VEILLE_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${filterCat === cat.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
                  <span>{cat.icon}</span>{cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFeed.map(item => {
              const catConf = VEILLE_CATEGORIES.find(c => c.id === item.category)
              return (
                <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="text-lg">{catConf?.icon || '📰'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${catConf?.color}15`, color: catConf?.color }}>{item.source}</span>
                        <span className="text-[10px] text-white/50 flex items-center gap-0.5"><Clock className="h-3 w-3" />{item.date.toLocaleDateString('fr-FR')}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-white/50 line-clamp-2">{item.summary}</p>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/[0.05] shrink-0">
                      <ExternalLink className="h-4 w-4 text-white/50" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* FESTIVALS TAB */}
      {tab === 'festivals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MAJOR_FESTIVALS.map(festival => (
              <div key={festival.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <h3 className="text-sm font-semibold text-white flex-1">{festival.name}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${festival.prestige === 'A-list' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-white/[0.05] text-white/50'}`}>{festival.prestige}</span>
                </div>
                <div className="space-y-1.5 text-[10px] text-white/50">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{festival.location}</p>
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3" />Dates: {festival.dates}</p>
                  <p className="flex items-center gap-1"><Clock className="h-3 w-3" />Deadline: <span className="text-orange-500 font-medium">{festival.deadline}</span></p>
                  <p className="flex items-center gap-1"><Tag className="h-3 w-3" />{festival.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SOURCES TAB */}
      {tab === 'sources' && (
        <div className="space-y-3">
          {VEILLE_CATEGORIES.map(cat => {
            const catSources = RSS_SOURCES.filter(s => s.category === cat.id)
            return (
              <div key={cat.id}>
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <span>{cat.icon}</span>{cat.label} ({catSources.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {catSources.map(source => (
                    <div key={source.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-lg">{source.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{source.name}</p>
                        <p className="text-[10px] text-white/50 truncate">{source.url}</p>
                      </div>
                      <span className="text-[10px] text-white/50">{source.language.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
