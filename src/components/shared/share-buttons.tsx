'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { SHARE_CONFIGS } from '@/data/marketing'
import {
  Share2, Twitter, Linkedin, Facebook, MessageCircle,
  Send, Mail, Copy, Check, X,
} from 'lucide-react'

const ICON_MAP: Record<string, typeof Share2> = {
  twitter: Twitter, linkedin: Linkedin, facebook: Facebook,
  'message-circle': MessageCircle, send: Send, mail: Mail, copy: Copy,
}

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  compact?: boolean     // Inline mode (small buttons)
  className?: string
}

export function ShareButtons({ url, title, description, compact, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const text = description ? `${title} — ${description}` : title
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  async function handleShare(type: string) {
    if (type === 'copy') {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Lien copié !')
      return
    }

    const config = SHARE_CONFIGS.find(c => c.type === type)
    if (!config) return

    const shareUrl = config.urlTemplate
      .replace('{text}', encodeURIComponent(text))
      .replace('{url}', encodeURIComponent(fullUrl))

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className || ''}`}>
        {SHARE_CONFIGS.slice(0, 4).map(config => {
          const Icon = ICON_MAP[config.icon] || Share2
          return (
            <button
              key={config.type}
              onClick={() => handleShare(config.type)}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title={config.label}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
            </button>
          )
        })}
        <button
          onClick={() => handleShare('copy')}
          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" />
        Partager
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-900 shadow-xl z-50 py-2">
          {SHARE_CONFIGS.map(config => {
            const Icon = ICON_MAP[config.icon] || Share2
            return (
              <button
                key={config.type}
                onClick={() => { handleShare(config.type); if (config.type !== 'copy') setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-800 transition-colors"
              >
                <Icon className="h-4 w-4" style={{ color: config.color }} />
                <span className="text-sm text-gray-300">
                  {config.type === 'copy' && copied ? 'Copié !' : config.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
