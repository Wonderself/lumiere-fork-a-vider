'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Flag, AlertTriangle, Shield, CreditCard, Key,
  UserX, Trash2, RefreshCcw, Loader2, Gift,
} from 'lucide-react'

interface UserActionsProps {
  userId: string
  userEmail: string
  userRole: string
}

export function UserActions({ userId, userEmail, userRole }: UserActionsProps) {
  const [creditAmount, setCreditAmount] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  async function grantCredits() {
    const amount = parseInt(creditAmount)
    if (!amount || amount <= 0) { toast.error('Montant invalide'); return }
    setLoading('credits')
    try {
      const res = await fetch('/api/wallet/admin/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: amount * 1_000_000, description: `Admin grant: ${amount} credits` }),
      })
      if (res.ok) {
        toast.success(`${amount} crédits accordés`)
        setCreditAmount('')
      } else toast.error('Erreur')
    } catch { toast.error('Erreur') }
    setLoading(null)
  }

  async function generateImpersonationToken() {
    setLoading('impersonate')
    // In production: would create a short-lived JWT for this user
    toast.success(`Token d'impersonation généré (1h)\nUser: ${userEmail}\n⚠️ Full implementation requires JWT signing`)
    setLoading(null)
  }

  return (
    <div className="space-y-6">
      {/* Credit Grant */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4 text-green-500" /> Accorder des crédits
        </h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
            placeholder="Montant (crédits)"
            className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none"
          />
          <button
            onClick={grantCredits}
            disabled={!!loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === 'credits' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accorder'}
          </button>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <Flag className="h-4 w-4 text-blue-500" /> Feature Flags (par user)
        </h3>
        <p className="text-xs text-white/50 mb-3">Activez/désactivez des fonctionnalités pour cet utilisateur sans déploiement.</p>
        <div className="space-y-2">
          {[
            { key: 'beta_features', label: 'Beta Features', desc: 'Accès aux fonctionnalités expérimentales' },
            { key: 'unlimited_agents', label: 'Agents illimités', desc: 'Pas de limite de requêtes agents' },
            { key: 'priority_queue', label: 'File prioritaire', desc: 'Requêtes IA traitées en priorité' },
            { key: 'extended_context', label: 'Contexte étendu', desc: 'Fenêtre de contexte de 50 messages' },
          ].map(flag => (
            <div key={flag.key} className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/10 hover:bg-white/[0.03]">
              <div>
                <p className="text-xs font-medium text-[#1A1A2E]">{flag.label}</p>
                <p className="text-[10px] text-white/50">{flag.desc}</p>
              </div>
              <button className="h-6 w-11 rounded-full bg-gray-200 relative cursor-pointer">
                <span className="inline-block h-4 w-4 rounded-full bg-white/5 translate-x-1 transition-transform shadow-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="text-sm font-semibold text-red-700 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Danger Zone
        </h3>
        <div className="space-y-3">
          <button
            onClick={generateImpersonationToken}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-orange-200 bg-white/5 hover:bg-orange-50 transition-colors text-left"
          >
            <Key className="h-4 w-4 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs font-medium text-[#1A1A2E]">Impersonation JWT (1h)</p>
              <p className="text-[10px] text-white/50">Se connecter en tant que cet utilisateur pour debug</p>
            </div>
            {loading === 'impersonate' && <Loader2 className="h-4 w-4 animate-spin text-orange-500" />}
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-yellow-200 bg-white/5 hover:bg-yellow-50 transition-colors text-left">
            <UserX className="h-4 w-4 text-yellow-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-[#1A1A2E]">Suspendre le compte</p>
              <p className="text-[10px] text-white/50">L&apos;utilisateur ne pourra plus se connecter</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 bg-white/5 hover:bg-red-50 transition-colors text-left">
            <Trash2 className="h-4 w-4 text-red-500" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-700">Soft Delete</p>
              <p className="text-[10px] text-white/50">Marquer le compte comme supprimé (réversible)</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/[0.03] transition-colors text-left">
            <RefreshCcw className="h-4 w-4 text-white/50" />
            <div className="flex-1">
              <p className="text-xs font-medium text-[#1A1A2E]">Reset API Key</p>
              <p className="text-[10px] text-white/50">Invalider et régénérer la clé API</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
