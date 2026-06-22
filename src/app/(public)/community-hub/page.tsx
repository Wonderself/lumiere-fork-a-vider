'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { COMMUNITY_AGENTS, REPUTATION_FACTORS, REPUTATION_LEVELS, MENTOR_CONFIG, COLLAB_TYPES, FEED_EVENT_TYPES, MENTOR_SPECIALTIES } from '@/data/community-enhanced'
import {
  Users, Star, Activity, Heart, Handshake, Shield,
  Bot, Search, Filter, ChevronRight, Award, Flame,
  Clock, CheckCircle2, MessageCircle, Film, TrendingUp,
  Briefcase, Eye, Zap, Crown, Check, X,
} from 'lucide-react'
import Link from 'next/link'
import { sendCollabRequestAction, respondToCollabAction } from '@/app/actions/collabs'

const MOCK_CREATORS = [
  { id: '1', name: 'Sophie M.', reputation: 78, level: 'Expert', badge: '🏆', specialties: ['Scénario', 'Réalisation'], tasksCompleted: 34, votesReceived: 156, isMentor: true },
  { id: '2', name: 'Alex D.', reputation: 65, level: 'Expert', badge: '🏆', specialties: ['VFX', 'Montage'], tasksCompleted: 22, votesReceived: 89, isMentor: true },
  { id: '3', name: 'Marie L.', reputation: 52, level: 'Créateur Confirmé', badge: '🎬', specialties: ['Composition', 'Sound Design'], tasksCompleted: 15, votesReceived: 67, isMentor: false },
  { id: '4', name: 'Lucas R.', reputation: 41, level: 'Créateur Confirmé', badge: '🎬', specialties: ['Production', 'Marketing'], tasksCompleted: 11, votesReceived: 45, isMentor: false },
  { id: '5', name: 'Emma K.', reputation: 28, level: 'Contributeur', badge: '⭐', specialties: ['Photographie'], tasksCompleted: 5, votesReceived: 23, isMentor: false },
]

const MOCK_FEED = [
  { user: 'Sophie M.', type: 'film_created', detail: '"Les Ombres de Minuit"', time: '2h' },
  { user: 'Alex D.', type: 'badge_earned', detail: 'Badge "Contributeur Star"', time: '3h' },
  { user: 'Marie L.', type: 'task_completed', detail: 'Composition Act 2', time: '5h' },
  { user: 'Lucas R.', type: 'vote_cast', detail: 'Film "Aurora"', time: '6h' },
  { user: 'Emma K.', type: 'level_up', detail: 'Niveau Contributeur', time: '8h' },
  { user: 'Sophie M.', type: 'collab_started', detail: 'Co-écriture avec Alex D.', time: '12h' },
  { user: 'Alex D.', type: 'comment_posted', detail: 'Sur "Les Ombres de Minuit"', time: '1j' },
  { user: 'Marie L.', type: 'mentor_assigned', detail: 'Mentor pour Emma K.', time: '2j' },
]

const MOCK_COLLABS = [
  { id: '1', type: 'co-write', from: 'Sophie M.', to: 'Lucas R.', film: 'Projet Aurore', status: 'active' },
  { id: '2', type: 'skill-trade', from: 'Alex D.', to: 'Marie L.', film: 'VFX↔Musique', status: 'pending' },
  { id: '3', type: 'mentoring', from: 'Sophie M.', to: 'Emma K.', film: 'Mentorat scénario', status: 'active' },
]

export default function CommunityHubPage() {
  const [tab, setTab] = useState<'feed' | 'creators' | 'mentors' | 'collabs'>('feed')
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSendCollabRequest(collabTypeId: string, collabTypeLabel: string) {
    startTransition(async () => {
      // Map UI collab type IDs to server action enum values
      const typeMap: Record<string, string> = {
        'co-write': 'CO_CREATE',
        'co-direct': 'CO_CREATE',
        'co-produce': 'CO_CREATE',
        'skill-trade': 'AD_EXCHANGE',
        'mentoring': 'GUEST',
      }
      const serverType = typeMap[collabTypeId] || 'CO_CREATE'

      const formData = new FormData()
      // toUserId left empty here — UI will prompt user to select a creator
      // For the request to work a real target user must be selected; this
      // guard returns a clear error that is shown via toast.
      formData.set('toUserId', '')
      formData.set('type', serverType)
      formData.set('message', `Demande de collaboration : ${collabTypeLabel}`)

      const result = await sendCollabRequestAction(null, formData)
      if (result?.error) {
        // "Destinataire requis" tells the user they need to pick a creator first
        toast.error(result.error === 'Destinataire requis'
          ? 'Sélectionnez d\'abord un créateur pour proposer une collaboration'
          : result.error
        )
      } else if (result?.success) {
        toast.success(`Demande de ${collabTypeLabel} envoyée !`)
      }
    })
  }

  function handleRespondToCollab(collabId: string, action: 'accept' | 'reject') {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('collabId', collabId)
      formData.set('action', action)
      formData.set('response', action === 'accept' ? 'Accepté' : 'Refusé')

      await respondToCollabAction(formData)
      toast.success(action === 'accept' ? 'Collaboration acceptée !' : 'Collaboration refusée')
    })
  }

  const FEED_ICONS: Record<string, typeof Film> = {
    film: Film, 'check-circle': CheckCircle2, star: Star, 'message-circle': MessageCircle,
    users: Users, award: Award, 'trending-up': TrendingUp, heart: Heart,
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Community Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Communauté <span className="text-[#E50914]">CineGeny</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Créateurs, mentors, collaborations. Rejoignez la communauté du cinéma participatif.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/community" className="text-xs text-gray-500 hover:text-white">← Community Governance</Link>
            <Link href="/rewards" className="text-xs text-gray-500 hover:text-white">Récompenses →</Link>
          </div>
        </div>

        {/* Agents */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {COMMUNITY_AGENTS.map(a => (
            <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-800 bg-gray-900/50 shrink-0">
              <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
              <div><p className="text-[10px] font-medium text-white">{a.name}</p><p className="text-[9px] text-gray-500">{a.role}</p></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'feed' as const, label: 'Activité', icon: Activity },
            { key: 'creators' as const, label: 'Créateurs', icon: Users },
            { key: 'mentors' as const, label: 'Mentors', icon: Heart },
            { key: 'collabs' as const, label: 'Collaborations', icon: Handshake },
          ].map(t => {
            const TIcon = t.icon
            return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><TIcon className="h-4 w-4" />{t.label}</button>
          })}
        </div>

        {/* FEED */}
        {tab === 'feed' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-4">Fil d&apos;activité en temps réel — social proof</p>
            {MOCK_FEED.map((event, i) => {
              const config = FEED_EVENT_TYPES.find(f => f.type === event.type) || FEED_EVENT_TYPES[0]
              const EIcon = FEED_ICONS[config.icon] || Activity
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-xl border border-gray-800 bg-gray-900/50">
                  <EIcon className="h-4 w-4 shrink-0" style={{ color: config.color }} />
                  <div className="flex-1">
                    <p className="text-sm text-white"><span className="font-medium">{event.user}</span> <span className="text-gray-500">{config.label}</span></p>
                    <p className="text-xs text-gray-500">{event.detail}</p>
                  </div>
                  <span className="text-[10px] text-gray-600">{event.time}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* CREATORS */}
        {tab === 'creators' && (
          <div className="space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un créateur..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
            </div>
            {MOCK_CREATORS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map(creator => {
              const repLevel = [...REPUTATION_LEVELS].reverse().find(l => creator.reputation >= l.min) || REPUTATION_LEVELS[0]
              return (
                <div key={creator.id} className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-lg">{repLevel.badge}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{creator.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${repLevel.color}15`, color: repLevel.color }}>{repLevel.label}</span>
                      {creator.isMentor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">Mentor</span>}
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {creator.specialties.map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{s}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: repLevel.color }}>{creator.reputation}</p>
                    <p className="text-[10px] text-gray-500">{creator.tasksCompleted} tâches · {creator.votesReceived} votes</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* MENTORS */}
        {tab === 'mentors' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-5 w-5 text-pink-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Programme de Mentorat</p>
                  <p className="text-xs text-gray-400">Créateurs expérimentés (rep ≥{MENTOR_CONFIG.minReputation}) qui guident les nouveaux</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-lg font-bold text-pink-400">{MOCK_CREATORS.filter(c => c.isMentor).length}</p><p className="text-[10px] text-gray-500">Mentors actifs</p></div>
                <div><p className="text-lg font-bold text-white">{MENTOR_CONFIG.maxMentees}</p><p className="text-[10px] text-gray-500">Filleuls max/mentor</p></div>
                <div><p className="text-lg font-bold text-emerald-400">+50 XP</p><p className="text-[10px] text-gray-500">Par mentorat réussi</p></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MOCK_CREATORS.filter(c => c.isMentor).map(mentor => (
                <div key={mentor.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center text-lg">👑</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{mentor.name}</p>
                      <div className="flex gap-1">{mentor.specialties.map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{s}</span>)}</div>
                    </div>
                  </div>
                  <button onClick={() => toast.success('Demande de mentorat envoyée')} className="w-full py-2 bg-pink-500/10 text-pink-400 text-xs rounded-lg hover:bg-pink-500/20 transition-colors">Demander un mentorat</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COLLABS */}
        {tab === 'collabs' && (
          <div className="space-y-6">
            <p className="text-xs text-gray-500 mb-3">Sélectionnez un créateur dans l&apos;onglet Créateurs, puis proposez une collaboration :</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {COLLAB_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleSendCollabRequest(type.id, type.label)}
                  disabled={isPending}
                  className="text-left rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <p className="text-sm font-medium text-white">{type.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{type.description}</p>
                  <p className="text-[10px] text-blue-400/70 mt-1.5 font-medium">→ Proposer</p>
                </button>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-white">Collaborations actives</h3>
            {MOCK_COLLABS.map(collab => {
              const type = COLLAB_TYPES.find(t => t.id === collab.type)
              return (
                <div key={collab.id} className="flex items-center gap-4 px-5 py-3 rounded-xl border border-gray-800 bg-gray-900/50">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: collab.status === 'active' ? '#10B981' : '#F59E0B' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{collab.from} ↔ {collab.to}</p>
                    <p className="text-[10px] text-gray-500">{type?.label} · {collab.film}</p>
                  </div>
                  {collab.status === 'pending' ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRespondToCollab(collab.id, 'accept')}
                        disabled={isPending}
                        title="Accepter"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/25 transition-colors border border-emerald-500/20 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> Accepter
                      </button>
                      <button
                        onClick={() => handleRespondToCollab(collab.id, 'reject')}
                        disabled={isPending}
                        title="Refuser"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-[10px] font-semibold hover:bg-red-500/25 transition-colors border border-red-500/20 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" /> Refuser
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 shrink-0">{collab.status}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
