'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { startKycAction } from '@/app/actions/lumens'
import { ShieldCheck, Loader2 } from 'lucide-react'

export function KycButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onClick() {
    setError(null)
    startTransition(async () => {
      const res = await startKycAction()
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div>
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] font-semibold text-white transition-colors disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Verify my identity
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  )
}
