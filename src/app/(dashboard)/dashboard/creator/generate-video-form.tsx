'use client'

import { useActionState, useEffect } from 'react'
import { generateVideoAction } from '@/app/actions/creator'
import { Loader2, Video, Zap } from 'lucide-react'
import { toast } from 'sonner'

const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Facebook']

export function GenerateVideoForm() {
  const [state, formAction, isPending] = useActionState(generateVideoAction, null)

  useEffect(() => {
    if (state?.success) toast.success('Vidéo en cours de génération !')
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs text-white/50 mb-1.5 block">Titre de la vidéo</label>
        <input
          name="title"
          required
          placeholder="Mon incroyable film IA..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white focus:border-[#E50914] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs text-white/50 mb-1.5 block">Script (optionnel)</label>
        <textarea
          name="script"
          rows={3}
          placeholder="Décrivez la scène ou collez votre script..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white focus:border-[#E50914] focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="text-xs text-white/50 mb-1.5 block">Plateformes cibles</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <label key={p} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" name="platforms" value={p} className="accent-[#E50914]" defaultChecked={p === 'TikTok'} />
              <span className="text-xs text-white/70">{p}</span>
            </label>
          ))}
        </div>
      </div>
      {state?.error && (
        <p className="text-xs text-red-400">⚠ {state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
        Générer la vidéo (10 tokens)
      </button>
    </form>
  )
}
