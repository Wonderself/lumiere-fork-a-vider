'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Megaphone, Calendar, Loader2, Copy, Check, Plus,
  Twitter, Linkedin, Instagram, Globe, Zap, Trash2,
  Clock, Send,
} from 'lucide-react'

interface SocialPost {
  id: string
  platform: string
  content: string
  scheduledAt: string
  status: 'draft' | 'scheduled' | 'published'
}

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', maxLength: 280 },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', maxLength: 3000 },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F', maxLength: 2200 },
  { id: 'all', label: 'Tous', icon: Globe, color: '#E50914', maxLength: 280 },
]

const POST_TEMPLATES = [
  'Annonce nouvelle fonctionnalité',
  'Mise à jour de la plateforme',
  'Témoignage créateur',
  'Behind the scenes',
  'Statistiques de la communauté',
  'Lancement d\'un nouveau film',
  'Appel à contributeurs',
  'Événement communautaire',
]

export default function AdminSocialPage() {
  const [tab, setTab] = useState<'generator' | 'calendar'>('generator')
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('all')
  const [tone, setTone] = useState('professional')
  const [generating, setGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<Array<{ platform: string; content: string }>>([])
  const [calendar, setCalendar] = useState<SocialPost[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  async function generatePosts() {
    if (!topic.trim()) { toast.error('Saisissez un sujet'); return }
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))

    const posts = [
      { platform: 'twitter', content: `🎬 ${topic}\n\nLa plateforme de cinéma participatif #CineGeny continue d'innover. Rejoignez la communauté et créez votre film avec l'IA.\n\n#cinema #IA #filmmaking` },
      { platform: 'linkedin', content: `🎬 ${topic}\n\nChez CineGeny, nous démocratisons la création cinématographique grâce à l'IA.\n\n${topic} — une avancée majeure pour notre communauté de créateurs.\n\nPoints clés :\n• Innovation technologique\n• Communauté grandissante\n• 0% de commission sur les tokens IA\n\nRejoignez-nous : cinegeny.com\n\n#CinemaParticipatif #IntelligenceArtificielle #Innovation` },
      { platform: 'instagram', content: `🎬 ${topic}\n\n✨ CineGeny repousse les limites de la création cinématographique.\n\n🎥 Créez votre film avec l'IA\n🤖 22 agents spécialisés cinéma\n💰 0% de commission\n\nLien en bio 👆\n\n#cinegeny #cinema #ia #filmmaking #creativecommunity` },
    ]

    setGeneratedPosts(platform === 'all' ? posts : posts.filter(p => p.platform === platform))
    setGenerating(false)
    toast.success('Posts générés')
  }

  function addToCalendar(post: { platform: string; content: string }) {
    const item: SocialPost = {
      id: `post-${Date.now()}`,
      platform: post.platform,
      content: post.content,
      scheduledAt: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'draft',
    }
    setCalendar(prev => [...prev, item])
    toast.success('Ajouté au calendrier')
  }

  async function copyPost(content: string, id: string) {
    await navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Admin Social</h1>
        <p className="text-sm text-white/50 mt-1">Générateur de posts · Calendrier éditorial</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('generator')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === 'generator' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
          <Megaphone className="h-4 w-4" /> Générateur
        </button>
        <button onClick={() => setTab('calendar')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === 'calendar' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
          <Calendar className="h-4 w-4" /> Calendrier ({calendar.length})
        </button>
      </div>

      {tab === 'generator' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Sujet du post</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ex: Lancement de la fonctionnalité Chat IA..." className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1.5 block">Plateforme</label>
                <div className="flex gap-2">
                  {PLATFORMS.map(p => {
                    const PIcon = p.icon
                    return (
                      <button key={p.id} onClick={() => setPlatform(p.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${platform === p.id ? 'text-white' : 'bg-white/[0.05] text-white/60'}`} style={platform === p.id ? { backgroundColor: p.color } : {}}>
                        <PIcon className="h-3.5 w-3.5" /> {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Ton</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
                  <option value="professional">Professionnel</option>
                  <option value="casual">Décontracté</option>
                  <option value="enthusiastic">Enthousiaste</option>
                  <option value="informative">Informatif</option>
                </select>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Templates rapides</label>
              <div className="flex flex-wrap gap-1.5">
                {POST_TEMPLATES.map(t => (
                  <button key={t} onClick={() => setTopic(t)} className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-white/50 hover:bg-white/[0.03]">{t}</button>
                ))}
              </div>
            </div>

            <button onClick={generatePosts} disabled={generating || !topic.trim()} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
              {generating ? <><Loader2 className="h-5 w-5 animate-spin" /> Génération...</> : <><Zap className="h-5 w-5" /> Générer les posts</>}
            </button>
          </div>

          {/* Generated Posts */}
          {generatedPosts.length > 0 && (
            <div className="space-y-4">
              {generatedPosts.map((post, i) => {
                const pConfig = PLATFORMS.find(p => p.id === post.platform)
                const PIcon = pConfig?.icon || Globe
                return (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <PIcon className="h-4 w-4" style={{ color: pConfig?.color }} />
                      <span className="text-sm font-medium text-white">{pConfig?.label}</span>
                      <div className="flex gap-1.5 ml-auto">
                        <button onClick={() => copyPost(post.content, `gen-${i}`)} className="text-xs px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.08] flex items-center gap-1">
                          {copied === `gen-${i}` ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          {copied === `gen-${i}` ? 'Copié' : 'Copier'}
                        </button>
                        <button onClick={() => addToCalendar(post)} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/15 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Planifier
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                    <p className="text-[10px] text-white/50 mt-2">{post.content.length} / {pConfig?.maxLength || 280} caractères</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'calendar' && (
        <div className="space-y-3">
          {calendar.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <Calendar className="h-10 w-10 text-white/50 mx-auto mb-3" />
              <p className="text-sm text-white/50">Calendrier éditorial vide</p>
              <p className="text-xs text-white/50 mt-1">Générez des posts et ajoutez-les au calendrier</p>
            </div>
          ) : calendar.map(post => {
            const pConfig = PLATFORMS.find(p => p.id === post.platform)
            const PIcon = pConfig?.icon || Globe
            return (
              <div key={post.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <PIcon className="h-4 w-4 shrink-0" style={{ color: pConfig?.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{post.content.substring(0, 80)}...</p>
                    <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{post.scheduledAt}</span>
                      <span className={`px-1.5 py-0.5 rounded-full ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/[0.03] text-white/50'}`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setCalendar(prev => prev.filter(p => p.id !== post.id))} className="text-white/50 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
