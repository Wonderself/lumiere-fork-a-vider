'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function InviteLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex gap-2">
      <code className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/60 truncate">
        {link}
      </code>
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm font-medium text-white/80 transition-colors"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
