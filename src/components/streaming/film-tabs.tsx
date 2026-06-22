'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Eye,
  Clock,
  Film,
  Users,
  Sparkles,
  ImageIcon,
  Music,
  Video,
  Mic2,
  Scissors,
  Laugh,
  Camera,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { incrementBonusViewAction } from '@/app/actions/bonus'

type Props = {
  synopsis: string | null
  tags: string[]
  castRoles: Array<{
    id: string
    characterName: string
    role: string
    description: string | null
    actor: { name: string; slug: string; avatarUrl: string | null; style: string }
  }>
  bonusContent: Array<{
    id: string
    type: string
    title: string
    description: string | null
    contentUrl: string | null
    thumbnailUrl: string | null
    duration: number | null
    isPremium: boolean
    viewCount: number
  }>
}

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  LEAD: { bg: 'bg-[#E50914]/20', text: 'text-[#E50914]', border: 'border-[#E50914]/30' },
  SUPPORTING: { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400/30' },
  CAMEO: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  VOICE: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  NARRATOR: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
}

const ROLE_LABELS: Record<string, string> = {
  LEAD: 'Principal',
  SUPPORTING: 'Secondaire',
  CAMEO: 'Cameo',
  VOICE: 'Voix',
  NARRATOR: 'Narrateur',
}

const BONUS_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  INTERVIEW: Mic2,
  DELETED_SCENE: Scissors,
  BLOOPER: Laugh,
  BTS: Camera,
  DIRECTORS_COMMENTARY: Film,
  CONCEPT_ART: ImageIcon,
  SOUNDTRACK: Music,
  MAKING_OF: Video,
  AUDITION_TAPE: Star,
}

const BONUS_TYPE_LABELS: Record<string, string> = {
  INTERVIEW: 'Interview',
  DELETED_SCENE: 'Scène coupée',
  BLOOPER: 'Bêtisier',
  BTS: 'Coulisses',
  DIRECTORS_COMMENTARY: 'Commentaire',
  CONCEPT_ART: 'Concept Art',
  SOUNDTRACK: 'Bande-son',
  MAKING_OF: 'Making-of',
  AUDITION_TAPE: 'Audition',
}

const BONUS_TYPE_COLORS: Record<string, string> = {
  INTERVIEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DELETED_SCENE: 'bg-red-500/20 text-red-400 border-red-500/30',
  BLOOPER: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  BTS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  DIRECTORS_COMMENTARY: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  CONCEPT_ART: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  SOUNDTRACK: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  MAKING_OF: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  AUDITION_TAPE: 'bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30',
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${m} min`
}

type TabId = 'film' | 'casting' | 'bonus'

export function FilmTabs({ synopsis, tags, castRoles, bonusContent }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('film')

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'film', label: 'Film' },
    { id: 'casting', label: 'Casting', count: castRoles.length },
    { id: 'bonus', label: 'Bonus', count: bonusContent.length },
  ]

  const isVideoType = (type: string) =>
    ['INTERVIEW', 'DELETED_SCENE', 'BLOOPER', 'BTS', 'DIRECTORS_COMMENTARY', 'MAKING_OF', 'AUDITION_TAPE', 'SOUNDTRACK'].includes(type)

  const handleBonusClick = async (bonusId: string) => {
    try {
      await incrementBonusViewAction(bonusId)
    } catch {
      // silent fail for view tracking
    }
  }

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex gap-1 border-b border-white/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative px-5 py-3 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'text-[#E50914]'
                : 'text-white/40 hover:text-white/70'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`
                  text-[10px] px-1.5 py-0.5 rounded-full
                  ${activeTab === tab.id
                    ? 'bg-[#E50914]/20 text-[#E50914]'
                    : 'bg-white/10 text-white/40'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'film' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Synopsis</h2>
            <p className="text-white/60 leading-relaxed">{synopsis || 'Aucun synopsis disponible.'}</p>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'casting' && (
        <div>
          {castRoles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Aucun acteur dans le casting.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {castRoles.map((cr) => {
                const roleColor = ROLE_COLORS[cr.role] || ROLE_COLORS.SUPPORTING
                return (
                  <div
                    key={cr.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="shrink-0">
                        {cr.actor.avatarUrl ? (
                          <img
                            src={cr.actor.avatarUrl}
                            alt={cr.actor.name}
                            className="h-14 w-14 rounded-full object-cover border-2 border-white/10"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-[#E50914]/10 flex items-center justify-center border-2 border-[#E50914]/20">
                            <span className="text-[#E50914] font-bold text-lg">
                              {cr.actor.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/actors/${cr.actor.slug}`}
                          className="text-white font-medium text-sm hover:text-[#E50914] transition-colors"
                        >
                          {cr.actor.name}
                        </Link>
                        <p className="text-[#E50914]/80 text-xs mt-0.5">
                          &laquo; {cr.characterName} &raquo;
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-[10px] px-1.5 py-0 h-4 ${roleColor.bg} ${roleColor.text} border ${roleColor.border}`}>
                            {ROLE_LABELS[cr.role] || cr.role}
                          </Badge>
                          <span className="text-white/20 text-[10px] uppercase">
                            {cr.actor.style}
                          </span>
                        </div>
                        {cr.description && (
                          <p className="text-white/30 text-xs mt-2 line-clamp-2">{cr.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bonus' && (
        <div>
          {bonusContent.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-10 w-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Aucun contenu bonus disponible.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bonusContent.map((bc) => {
                const TypeIcon = BONUS_TYPE_ICONS[bc.type] || Film
                const typeColor = BONUS_TYPE_COLORS[bc.type] || 'bg-white/10 text-white/50 border-white/20'
                const hasVideo = isVideoType(bc.type) && bc.contentUrl

                return (
                  <div
                    key={bc.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:bg-white/[0.04] transition-all group cursor-pointer"
                    onClick={() => handleBonusClick(bc.id)}
                  >
                    {/* Thumbnail / Icon */}
                    <div className="relative aspect-video bg-black/50 flex items-center justify-center">
                      {bc.thumbnailUrl ? (
                        <img
                          src={bc.thumbnailUrl}
                          alt={bc.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TypeIcon className="h-10 w-10 text-white/10" />
                      )}
                      {/* Play overlay for video types */}
                      {hasVideo && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-[#E50914]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-5 w-5 text-black ml-0.5" />
                          </div>
                        </div>
                      )}
                      {/* Premium badge */}
                      {bc.isPremium && (
                        <div className="absolute top-2 right-2">
                          <Badge className="text-[9px] bg-[#E50914] text-white border-none px-1.5 py-0">
                            PREMIUM
                          </Badge>
                        </div>
                      )}
                      {/* Duration */}
                      {bc.duration && (
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-white/80">
                            {formatDuration(bc.duration)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge className={`text-[9px] px-1.5 py-0 h-4 border ${typeColor}`}>
                          {BONUS_TYPE_LABELS[bc.type] || bc.type}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-medium text-white/80 line-clamp-2 group-hover:text-white transition-colors">
                        {bc.title}
                      </h3>
                      {bc.description && (
                        <p className="text-white/30 text-xs mt-1 line-clamp-2">{bc.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-white/20 text-[10px]">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {bc.viewCount.toLocaleString()}
                        </span>
                        {bc.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatDuration(bc.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
