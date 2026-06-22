'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Zap, CheckCircle, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AutomationItem {
  id: string
  title: string
  description: string
  detail: string
  icon: React.ElementType
  costSaving: number
  active: boolean
}

interface AutomationToggleProps {
  item: AutomationItem
  type: 'auto' | 'assisted' | 'human'
}

export function AutomationToggle({ item, type }: AutomationToggleProps) {
  const [active, setActive] = useState(item.active)

  if (type === 'human') return null

  function handleToggle() {
    const next = !active
    setActive(next)
    if (next) {
      toast.success(`Module "${item.title}" activé`)
    } else {
      toast.info(`Module "${item.title}" désactivé`)
    }
  }

  if (active) {
    return (
      <button onClick={handleToggle} className="shrink-0">
        <Badge variant="success" className="text-[10px] cursor-pointer hover:opacity-80 transition-opacity">
          <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> ON
        </Badge>
      </button>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-[10px] min-h-[36px] px-3 shrink-0"
      onClick={handleToggle}
    >
      <Zap className="h-3 w-3 mr-1" /> Activer
    </Button>
  )
}

interface AutomationCardProps {
  item: AutomationItem
  type: 'auto' | 'assisted' | 'human'
}

export function AutomationCard({ item, type }: AutomationCardProps) {
  const ItemIcon = item.icon

  const borderColor = type === 'auto'
    ? 'border-green-500/20 hover:border-green-500/40'
    : type === 'assisted'
    ? 'border-yellow-500/20 hover:border-yellow-500/40'
    : 'border-red-500/20 hover:border-red-500/40'

  const [active, setActive] = useState(item.active)

  function handleToggle() {
    const next = !active
    setActive(next)
    if (next) {
      toast.success(`Module "${item.title}" activé`)
    } else {
      toast.info(`Module "${item.title}" désactivé`)
    }
  }

  return (
    <div className={`rounded-xl border ${borderColor} transition-all bg-card`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${
            type === 'auto' ? 'bg-green-500/10' :
            type === 'assisted' ? 'bg-yellow-500/10' :
            'bg-red-500/10'
          }`}>
            <ItemIcon className={`h-4 w-4 ${
              type === 'auto' ? 'text-green-600' :
              type === 'assisted' ? 'text-yellow-600' :
              'text-red-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{item.title}</h4>
              {active && (
                <Badge variant="success" className="text-[10px]">Actif</Badge>
              )}
            </div>
            <p className="text-xs text-white/50 mb-2">{item.description}</p>

            <details className="group">
              <summary className="text-[10px] text-[#E50914] cursor-pointer hover:underline list-none">
                Voir le détail...
              </summary>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                {item.detail}
              </p>
            </details>

            {item.costSaving > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <DollarSign className="h-3 w-3 text-[#E50914]" />
                <span className="text-[10px] text-[#E50914]">
                  Économie estimée : {new Intl.NumberFormat('fr-FR').format(item.costSaving)} EUR/mois
                </span>
              </div>
            )}
          </div>

          {type !== 'human' && (
            active ? (
              <button onClick={handleToggle} className="shrink-0">
                <Badge variant="success" className="text-[10px] cursor-pointer hover:opacity-80 transition-opacity">
                  <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> ON
                </Badge>
              </button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] min-h-[36px] px-3 shrink-0"
                onClick={handleToggle}
              >
                <Zap className="h-3 w-3 mr-1" /> Activer
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
