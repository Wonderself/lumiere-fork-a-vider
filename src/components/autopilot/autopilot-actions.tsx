'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Shield, Heart, Briefcase, Loader2, Play } from 'lucide-react'

export function AutopilotActions() {
  const [runningAudit, setRunningAudit] = useState<string | null>(null)

  async function runAudit(type: 'health' | 'business' | 'security') {
    setRunningAudit(type)
    try {
      const res = await fetch('/api/autopilot/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Audit ${type} terminé: ${data.score}/100`)
        // Refresh page to show new results
        window.location.reload()
      } else {
        toast.error(data.error || 'Audit failed')
      }
    } catch {
      toast.error('Erreur lors de l\'audit')
    }
    setRunningAudit(null)
  }

  return (
    <div className="flex gap-2">
      {[
        { type: 'health' as const, label: 'Health', icon: Heart, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
        { type: 'business' as const, label: 'Business', icon: Briefcase, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
        { type: 'security' as const, label: 'Security', icon: Shield, color: 'text-red-600 bg-red-50 hover:bg-red-100' },
      ].map(audit => {
        const Icon = audit.icon
        const isRunning = runningAudit === audit.type
        return (
          <button
            key={audit.type}
            onClick={() => runAudit(audit.type)}
            disabled={!!runningAudit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${audit.color}`}
          >
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
            {audit.label}
          </button>
        )
      })}
    </div>
  )
}
