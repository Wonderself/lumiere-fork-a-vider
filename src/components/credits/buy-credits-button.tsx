'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createCheckoutSessionAction } from '@/app/actions/stripe'

interface BuyCreditsButtonProps {
  packId: string
  amount: number
  popular?: boolean
  label?: string
}

export function BuyCreditsButton({ packId, amount, popular = false, label = 'Acheter' }: BuyCreditsButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      // Only 'basic' and 'premium' are valid subscription plans in the action.
      // For credit packs we pass the packId as-is; if it's not a sub plan,
      // the action returns mock mode which we handle gracefully.
      const result = await createCheckoutSessionAction(packId as 'basic' | 'premium')

      if ('error' in result && result.error) {
        toast.error(result.error)
        return
      }

      const { url, mock } = result.data!

      if (mock) {
        toast.success('Mode démo — paiement simulé', {
          description: `${amount} crédits ajoutés à votre compte (simulation).`,
          duration: 4000,
        })
        // Refresh the page after a short delay so balance updates
        setTimeout(() => window.location.reload(), 1500)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={`w-full ${
        popular
          ? 'bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold'
          : 'bg-white/[0.05] hover:bg-white/[0.08] text-white/60'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Traitement…
        </>
      ) : (
        label
      )}
    </Button>
  )
}
