'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { SOCIAL_PLATFORMS, POST_TEMPLATES, CAMPAIGN_TEMPLATES, CINEMA_HASHTAGS, MARKETING_AGENTS } from '@/data/marketing'
import type { CampaignStatus } from '@/data/marketing'
import {
  Megaphone, Calendar, Target, PenTool, Hash, Mail,
  Layout, TrendingUp, Send, Loader2, Copy, Check,
  Plus, ChevronLeft, ChevronRight, Bot, Shield,
  Twitter, Linkedin, Instagram, Facebook, Zap,
  Eye, Play, Pause, CheckCircle2, XCircle, Clock,
} from 'lucide-react'

const PLATFORM_ICONS: Record<string, typeof Twitter> = {
  twitter: Twitter, linkedin: Linkedin, instagram: Instagram, facebook: Facebook,
}

interface GeneratedPost {
  id: string; platform: string; content: string; hashtags: string[]; tone: string; createdAt: Date
}

interface CalendarItem {
  id: string; date: string; platform: string; content: string; status: 'draft' | 'scheduled' | 'published'
}

interface Campaign {
  id: string; name: string; type: string; status: CampaignStatus; budget: number; channels: string[]; startDate: string; endDate: string
}

export default function MarketingPage() {
  const [tab, setTab] = useState<'posts' | 'calendar' | 'campaigns'>('posts')
  // Posts
  const [postTopic, setPostTopic] = useState('')
  const [postPlatform, setPostPlatform] = useState('all')
  const [postTone, setPostTone] = useState('professional')
  const [generating, setGenerating] = useState(false)
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  // Calendar
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([])
  const [calendarWeek, setCalendarWeek] = useState(0)
  // Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', type: 'social', templateId: '' })

  async function generatePosts() {
    if (!postTopic.trim()) { toast.error('Saisissez un sujet'); return }
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    const platforms = postPlatform === 'all' ? SOCIAL_PLATFORMS : SOCIAL_PLATFORMS.filter(p => p.id === postPlatform)
    const generated = platforms.map(p => ({
      id: `post-${Date.now()}-${p.id}`,
      platform: p.id,
      content: `${p.id === 'twitter' ? '🎬' : '🎥'} ${postTopic}\n\n${p.toneGuide.split('.')[0]}.\n\n${p.id === 'linkedin' ? 'Chez CineGeny, nous démocratisons le cinéma participatif grâce à l\'IA.\n\n' : ''}${p.id === 'instagram' ? '📸 Découvrez les coulisses sur notre profil\n\n' : ''}Rejoignez la communauté ! 🎬\n\n${CINEMA_HASHTAGS.platform.join(' ')} ${CINEMA_HASHTAGS.general.slice(0, 3).join(' ')}`,
      hashtags: [...CINEMA_HASHTAGS.platform, ...CINEMA_HASHTAGS.general.slice(0, 3)],
      tone: postTone,
      createdAt: new Date(),
    }))
    setPosts(prev => [...generated, ...prev])
    setGenerating(false)
    toast.success(`${generated.length} post(s) générés`)
  }

  function addToCalendar(post: GeneratedPost) {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    setCalendarItems(prev => [...prev, { id: `cal-${Date.now()}`, date: tomorrow, platform: post.platform, content: post.content, status: 'draft' }])
    toast.success('Ajouté au calendrier')
  }

  async function copyPost(content: string, id: string) {
    await navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function createCampaign() {
    if (!newCampaign.name.trim()) { toast.error('Nom requis'); return }
    const template = CAMPAIGN_TEMPLATES.find(t => t.id === newCampaign.templateId)
    const start = new Date().toISOString().split('T')[0]
    const end = new Date(Date.now() + (template?.defaultDuration || 14) * 86400000).toISOString().split('T')[0]
    setCampaigns(prev => [...prev, {
      id: `camp-${Date.now()}`, name: newCampaign.name, type: newCampaign.type,
      status: 'draft', budget: template?.defaultBudget || 20,
      channels: template?.channels || ['twitter'], startDate: start, endDate: end,
    }])
    setShowNewCampaign(false)
    setNewCampaign({ name: '', type: 'social', templateId: '' })
    toast.success('Campagne créée')
  }

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <Megaphone className="h-4 w-4 text-[#E50914]" />
            <span className="text-sm font-medium text-[#E50914]">Marketing Studio</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
            Social Media & <span className="text-[#E50914]">Campagnes</span>
          </h1>
          <p className="text-gray-400 text-sm">7 agents · Multi-plateforme · Calendrier éditorial · Campagnes</p>
        </div>

        {/* Agents */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {MARKETING_AGENTS.map(a => (
            <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-800 bg-gray-900/50 shrink-0">
              <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
              <div>
                <p className="text-[10px] font-medium text-white">{a.name}</p>
                <p className="text-[9px] text-gray-500">{a.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'posts' as const, label: 'Posts', icon: PenTool },
            { key: 'calendar' as const, label: `Calendrier (${calendarItems.length})`, icon: Calendar },
            { key: 'campaigns' as const, label: `Campagnes (${campaigns.length})`, icon: Target },
          ].map(t => {
            const TIcon = t.icon
            return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><TIcon className="h-4 w-4" />{t.label}</button>
          })}
        </div>

        {/* POSTS TAB */}
        {tab === 'posts' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
              <input value={postTopic} onChange={e => setPostTopic(e.target.value)} placeholder="Sujet du post (ex: Lancement du film Aurora)" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 mb-1.5 block">Plateforme</label>
                  <div className="flex gap-1.5">
                    <button onClick={() => setPostPlatform('all')} className={`px-3 py-1.5 rounded-lg text-xs ${postPlatform === 'all' ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>Toutes</button>
                    {SOCIAL_PLATFORMS.map(p => {
                      const PIcon = PLATFORM_ICONS[p.id] || Send
                      return <button key={p.id} onClick={() => setPostPlatform(p.id)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${postPlatform === p.id ? 'text-white' : 'bg-gray-800 text-gray-400'}`} style={postPlatform === p.id ? { backgroundColor: p.color } : {}}><PIcon className="h-3 w-3" />{p.name.split(' ')[0]}</button>
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-1.5 block">Ton</label>
                  <select value={postTone} onChange={e => setPostTone(e.target.value)} className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white">
                    <option value="professional">Pro</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthousiaste</option>
                    <option value="cinephile">Cinéphile</option>
                  </select>
                </div>
              </div>
              <button onClick={generatePosts} disabled={generating || !postTopic.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
                {generating ? <><Loader2 className="h-5 w-5 animate-spin" />Generating...</> : <><Zap className="h-5 w-5" />Générer les posts</>}
              </button>
            </div>

            {posts.length > 0 && (
              <div className="space-y-4">
                {posts.map(post => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.id === post.platform)
                  const PIcon = PLATFORM_ICONS[post.platform] || Send
                  return (
                    <div key={post.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <PIcon className="h-4 w-4" style={{ color: platform?.color }} />
                        <span className="text-sm font-medium text-white">{platform?.name}</span>
                        <div className="flex gap-1.5 ml-auto">
                          <button onClick={() => copyPost(post.content, post.id)} className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 flex items-center gap-1">
                            {copied === post.id ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                            {copied === post.id ? 'Copied' : 'Copy'}
                          </button>
                          <button onClick={() => addToCalendar(post)} className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />Planifier
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{post.content}</p>
                      <p className="text-[10px] text-gray-600 mt-2">{post.content.length}/{platform?.maxLength} caractères</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* CALENDAR TAB */}
        {tab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCalendarWeek(w => w - 1)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm text-white font-medium">Semaine {calendarWeek >= 0 ? `+${calendarWeek}` : calendarWeek}</span>
              <button onClick={() => setCalendarWeek(w => w + 1)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                const dayItems = calendarItems.filter((_, idx) => idx % 7 === i)
                return (
                  <div key={day} className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 min-h-[120px]">
                    <p className="text-[10px] text-gray-500 font-medium mb-2">{day}</p>
                    {dayItems.slice(0, 2).map(item => {
                      const PIcon = PLATFORM_ICONS[item.platform] || Send
                      const pColor = SOCIAL_PLATFORMS.find(p => p.id === item.platform)?.color
                      return (
                        <div key={item.id} className="rounded-lg bg-gray-800 p-2 mb-1">
                          <div className="flex items-center gap-1">
                            <PIcon className="h-3 w-3" style={{ color: pColor }} />
                            <span className="text-[9px] text-gray-400 truncate flex-1">{item.content.substring(0, 30)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            {calendarItems.length === 0 && <p className="text-center text-sm text-gray-600 py-8">Calendrier vide — générez des posts et planifiez-les</p>}
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {tab === 'campaigns' && (
          <div className="space-y-6">
            <button onClick={() => setShowNewCampaign(true)} className="flex items-center gap-2 px-4 py-2 bg-[#E50914] text-white text-sm rounded-xl hover:bg-[#FF2D2D]"><Plus className="h-4 w-4" />Nouvelle campagne</button>

            {showNewCampaign && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
                <input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} placeholder="Nom de la campagne" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
                <div className="flex gap-3">
                  <select value={newCampaign.templateId} onChange={e => setNewCampaign(p => ({ ...p, templateId: e.target.value }))} className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white">
                    <option value="">Template (optionnel)</option>
                    {CAMPAIGN_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
                  </select>
                  <button onClick={createCampaign} className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl">Create</button>
                  <button onClick={() => setShowNewCampaign(false)} className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-xl">Cancel</button>
                </div>
              </div>
            )}

            {campaigns.length === 0 ? (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-12 text-center">
                <Target className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Aucune campagne</p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map(camp => {
                  const STATUS_CONFIG: Record<string, { color: string; icon: typeof Clock }> = {
                    draft: { color: 'text-gray-400', icon: Clock },
                    pending_approval: { color: 'text-yellow-400', icon: Clock },
                    approved: { color: 'text-blue-400', icon: CheckCircle2 },
                    active: { color: 'text-green-400', icon: Play },
                    completed: { color: 'text-emerald-400', icon: CheckCircle2 },
                    paused: { color: 'text-orange-400', icon: Pause },
                    cancelled: { color: 'text-red-400', icon: XCircle },
                  }
                  const st = STATUS_CONFIG[camp.status] || STATUS_CONFIG.draft
                  const StIcon = st.icon
                  return (
                    <div key={camp.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 flex items-center gap-4">
                      <StIcon className={`h-5 w-5 ${st.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{camp.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                          <span>{camp.type}</span><span>·</span><span>{camp.budget} cr</span><span>·</span>
                          <span>{camp.channels.map(c => PLATFORM_ICONS[c] ? '●' : '').join(' ')}</span>
                          <span>·</span><span>{camp.startDate} → {camp.endDate}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${st.color} bg-gray-800`}>{camp.status.replace('_', ' ')}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">0% commission — vous ne payez que les tokens IA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
