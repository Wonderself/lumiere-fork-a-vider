'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { NOTIFICATION_EVENTS, BRIEFING_AGENTS } from '@/data/briefing'
import {
  Bell, Save, Bot, Send, Mail, Smartphone,
  UserPlus, TrendingUp, Film, CheckCircle2, Star,
  AlertTriangle, AlertCircle, Sun, Lightbulb, Target,
  Users, Clock, Loader2,
} from 'lucide-react'

const EVENT_ICONS: Record<string, typeof Bell> = {
  'user-plus': UserPlus, 'trending-up': TrendingUp, film: Film,
  'check-circle': CheckCircle2, star: Star, 'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle, sun: Sun, lightbulb: Lightbulb,
  target: Target, users: Users, clock: Clock,
}

export default function NotificationsConfigPage() {
  const [events, setEvents] = useState(NOTIFICATION_EVENTS.map(e => ({ ...e, enabled: e.defaultEnabled })))
  const [saving, setSaving] = useState(false)

  function toggleEvent(id: string) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e))
  }

  function toggleChannel(id: string, channel: 'telegram' | 'email' | 'inapp') {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e
      const channels = e.channels.includes(channel) ? e.channels.filter(c => c !== channel) : [...e.channels, channel]
      return { ...e, channels }
    }))
  }

  async function saveConfig() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Configuration sauvegardée')
  }

  const CHANNEL_CONFIG = [
    { id: 'telegram' as const, label: 'Telegram', icon: Send, color: '#0088CC' },
    { id: 'email' as const, label: 'Email', icon: Mail, color: '#6B7280' },
    { id: 'inapp' as const, label: 'In-App', icon: Smartphone, color: '#8B5CF6' },
  ]

  const PRIORITY_CONFIG = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    low: { color: 'text-white/50', bg: 'bg-white/[0.03]' },
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Notifications Push</h1>
          <p className="text-sm text-white/50 mt-1">{events.length} types d&apos;événements · 3 canaux · Configurable</p>
        </div>
        <button onClick={saveConfig} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] text-white text-xs font-medium rounded-lg disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder
        </button>
      </div>

      {/* Agent */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 w-fit">
        <Bot className="h-3.5 w-3.5" style={{ color: BRIEFING_AGENTS[3].color }} />
        <div><p className="text-[10px] font-medium text-white">{BRIEFING_AGENTS[3].name}</p><p className="text-[9px] text-white/50">{BRIEFING_AGENTS[3].role}</p></div>
      </div>

      {/* Channel Legend */}
      <div className="flex gap-4">
        {CHANNEL_CONFIG.map(ch => {
          const ChIcon = ch.icon
          return (
            <div key={ch.id} className="flex items-center gap-1.5 text-xs text-white/50">
              <ChIcon className="h-3.5 w-3.5" style={{ color: ch.color }} />
              {ch.label}
            </div>
          )
        })}
      </div>

      {/* Events List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="divide-y divide-white/10">
          {events.map(event => {
            const EIcon = EVENT_ICONS[event.icon] || Bell
            const prio = PRIORITY_CONFIG[event.priority]
            return (
              <div key={event.id} className={`flex items-center gap-4 px-5 py-4 ${!event.enabled ? 'opacity-50' : ''}`}>
                {/* Toggle */}
                <button onClick={() => toggleEvent(event.id)} className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${event.enabled ? 'bg-[#E50914]' : 'bg-white/20'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white/5 transition-transform ${event.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>

                {/* Event Info */}
                <EIcon className="h-4 w-4 shrink-0" style={{ color: event.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{event.label}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${prio.bg} ${prio.color}`}>{event.priority}</span>
                  </div>
                  <p className="text-[10px] text-white/50">{event.description}</p>
                </div>

                {/* Channel Toggles */}
                <div className="flex gap-2 shrink-0">
                  {CHANNEL_CONFIG.map(ch => {
                    const ChIcon = ch.icon
                    const isActive = event.channels.includes(ch.id)
                    return (
                      <button
                        key={ch.id}
                        onClick={() => toggleChannel(event.id, ch.id)}
                        disabled={!event.enabled}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-white/[0.05]' : 'bg-transparent'}`}
                        title={`${ch.label}: ${isActive ? 'ON' : 'OFF'}`}
                      >
                        <ChIcon className="h-3.5 w-3.5" style={{ color: isActive ? ch.color : '#D1D5DB' }} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
