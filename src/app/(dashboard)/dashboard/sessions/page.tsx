'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getActiveSessionsAction,
  revokeSessionAction,
  revokeAllSessionsAction,
} from '@/app/actions/sessions'
import {
  Key, Monitor, Smartphone, Globe, Clock, MapPin,
  Shield, Trash2, AlertTriangle, CheckCircle2, Loader2,
} from 'lucide-react'

interface SessionData {
  id: string
  device: string | null
  browser: string | null
  os: string | null
  ip: string | null
  country: string | null
  lastActive: Date
  createdAt: Date
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)

  async function loadSessions() {
    const result = await getActiveSessionsAction()
    if (result.sessions) {
      setSessions(result.sessions.map(s => ({ ...s, lastActive: new Date(s.lastActive), createdAt: new Date(s.createdAt) })))
    }
    setLoading(false)
  }

  useEffect(() => { loadSessions() }, [])

  async function revokeSession(id: string) {
    setRevoking(id)
    const result = await revokeSessionAction(id)
    if (result.success) {
      setSessions(prev => prev.filter(s => s.id !== id))
      toast.success('Session révoquée')
    } else {
      toast.error(result.error || 'Erreur')
    }
    setRevoking(null)
  }

  async function revokeAll() {
    setRevoking('all')
    const result = await revokeAllSessionsAction()
    if (result.success) {
      setSessions(prev => prev.slice(0, 1)) // keep current only
      toast.success(`${result.count} session(s) révoquée(s)`)
    } else {
      toast.error(result.error || 'Erreur')
    }
    setRevoking(null)
  }

  function getIcon(device: string | null) {
    if (device === 'Mobile' || device === 'Tablet') return Smartphone
    return Monitor
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-white/30" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Sessions Actives</h1>
        <p className="text-sm text-white/50 mt-1">Gérez vos sessions de connexion</p>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <div className="flex items-center gap-3">
          <Key className="h-5 w-5 text-blue-400" />
          <div>
            <p className="text-sm font-semibold text-blue-300">Authentification JWT</p>
            <p className="text-xs text-blue-400/70">Tokens signés côté serveur · Expiration automatique · Révocation instantanée</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="px-5 py-8 text-center text-white/40 text-sm">Aucune session active</div>
        ) : (
          <div className="divide-y divide-white/10">
            {sessions.map((sess, i) => {
              const SIcon = getIcon(sess.device)
              const isCurrent = i === 0
              return (
                <div key={sess.id} className="flex items-center gap-4 px-5 py-4">
                  <SIcon className="h-5 w-5 text-white/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{sess.device || 'Unknown'} — {sess.browser || 'Unknown'}</p>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">Session actuelle</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/50 mt-0.5">
                      {sess.ip && <span className="flex items-center gap-0.5"><Globe className="h-3 w-3" />{sess.ip}</span>}
                      {sess.country && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{sess.country}</span>}
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{sess.lastActive.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                  {!isCurrent && (
                    <button
                      onClick={() => revokeSession(sess.id)}
                      disabled={revoking === sess.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      {revoking === sess.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Révoquer
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {sessions.length > 1 && (
        <button
          onClick={revokeAll}
          disabled={revoking === 'all'}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {revoking === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />} Révoquer toutes les autres sessions
        </button>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> Conseils sécurité</h3>
        <ul className="space-y-2 text-xs text-white/50">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />Révoquez les sessions que vous ne reconnaissez pas</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />Activez le 2FA pour une sécurité renforcée</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />Utilisez un mot de passe unique et fort</li>
        </ul>
      </div>
    </div>
  )
}
