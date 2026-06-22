'use client'

import { toast } from 'sonner'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActivateAllButtonProps {
  remaining: number
}

export function ActivateAllButton({ remaining }: ActivateAllButtonProps) {
  function handleClick() {
    if (remaining === 0) {
      toast.info('Tous les modules sont déjà activés')
      return
    }
    toast.promise(
      new Promise<void>((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Activation de ${remaining} module(s)...`,
        success: `${remaining} module(s) activé(s) avec succès !`,
        error: 'Erreur lors de l\'activation',
      }
    )
  }

  return (
    <Button size="lg" className="min-h-[48px]" onClick={handleClick}>
      <Zap className="h-4 w-4 mr-2" />
      Activer tous les modules ({remaining} restants)
    </Button>
  )
}
