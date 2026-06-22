'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Bell, BellOff, Check, CheckCheck, Trash2, Filter,
  CreditCard, Film, Zap, Vote, TrendingUp, AlertTriangle,
  MessageSquare, Star, Clock, RefreshCcw,
} from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  createdAt: string
}

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  SYSTEM: { icon: Bell, color: 'text-blue-500', label: 'Système' },
  LOW_BALANCE: { icon: CreditCard, color: 'text-red-500', label: 'Solde bas' },
  FILM_APPROVED: { icon: Film, color: 'text-green-500', label: 'Film approuvé' },
  TASK_COMPLETED: { icon: Zap, color: 'text-purple-500', label: 'Tâche complétée' },
  VOTE_RESULT: { icon: Star, color: 'text-yellow-500', label: 'Résultat vote' },
  INVESTMENT_UPDATE: { icon: TrendingUp, color: 'text-emerald-500', label: 'Investissement' },
  ALERT: { icon: AlertTriangle, color: 'text-orange-500', label: 'Alerte' },
  CHAT: { icon: MessageSquare, color: 'text-cyan-500', label: 'Message' },
}

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/count')
      if (!res.ok) return
      // Simulate fetching full notifications list
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Initial load — simulate with mock data
    setNotifications([
      { id: '1', type: 'SYSTEM', title: 'Bienvenue sur CineGeny !', body: 'Votre compte a été créé avec succès.', read: true, createdAt: new Date().toISOString() },
      { id: '2', type: 'LOW_BALANCE', title: 'Solde bas', body: 'Votre solde de crédits est inférieur à 10. Rechargez pour continuer à utiliser les fonctionnalités IA.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', type: 'TASK_COMPLETED', title: 'Tâche validée', body: 'Votre contribution au film "Midnight Express" a été validée.', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: '4', type: 'VOTE_RESULT', title: 'Résultats du vote', body: 'Le scénario "La Dernière Danse" a été sélectionné par la communauté.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: '5', type: 'INVESTMENT_UPDATE', title: 'Mise à jour investissement', body: 'Le film "Aurora" a atteint 75% de son objectif de financement.', read: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
    ])
    setLoading(false)

    // Polling every 30s
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('Toutes les notifications marquées comme lues')
  }

  function deleteNotif(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Notifications</h1>
          <p className="text-sm text-white/50 mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${filter === 'unread' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>
            <Filter className="h-3.5 w-3.5" /> {filter === 'unread' ? 'Non lues' : 'Toutes'}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] text-white/60 hover:bg-white/[0.08]">
              <CheckCheck className="h-3.5 w-3.5" /> Tout lire
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BellOff className="h-10 w-10 text-white/50 mx-auto mb-3" />
            <p className="text-sm text-white/50">{filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filtered.map(notif => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.SYSTEM
              const NIcon = config.icon
              return (
                <div key={notif.id} className={`flex items-start gap-4 px-5 py-4 transition-colors ${!notif.read ? 'bg-blue-50/30' : 'hover:bg-white/[0.03]'}`}>
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${!notif.read ? 'bg-white/5 border border-white/10' : 'bg-white/[0.03]'}`}>
                    <NIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!notif.read ? 'font-semibold text-white' : 'font-medium text-white/60'}`}>{notif.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.color} bg-opacity-10`}>{config.label}</span>
                    </div>
                    {notif.body && <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{notif.body}</p>}
                    <p className="text-[10px] text-white/50 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(notif.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!notif.read && (
                      <button onClick={() => markAsRead(notif.id)} className="p-1.5 rounded-lg hover:bg-white/[0.05]" title="Marquer comme lu">
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      </button>
                    )}
                    <button onClick={() => deleteNotif(notif.id)} className="p-1.5 rounded-lg hover:bg-white/[0.05]" title="Supprimer">
                      <Trash2 className="h-3.5 w-3.5 text-white/50 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
