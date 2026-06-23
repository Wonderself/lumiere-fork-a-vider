'use client'

import { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'

/**
 * A copyable prompt template block used across Academy lessons.
 * One-click copy via the icon; shows a transient "Copied" confirmation.
 */
export function CopyPrompt({ label, text }: { label?: string; text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className="rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.04] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[#E50914]/15 bg-[#E50914]/[0.05]">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#E50914]">
          <Sparkles className="h-3.5 w-3.5" />
          {label || 'Prompt template'}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy prompt"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E50914]/25 bg-[#E50914]/10 px-2.5 py-1 text-[11px] font-medium text-white/80 hover:bg-[#E50914]/20 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3.5 text-[13px] leading-relaxed text-white/80 whitespace-pre-wrap font-mono">
        {text}
      </pre>
    </div>
  )
}
