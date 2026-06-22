'use client'

import { useActionState } from 'react'
import { purchaseLumensAction } from '@/app/actions/lumens'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Crown } from 'lucide-react'

const PACKS = [
  {
    amount: 10,
    price: 10,
    bonus: 0,
    discount: null,
    badge: null,
    icon: Sparkles,
    features: ['10 Lumens credites', 'Utilisation immediate', 'Sans engagement'],
  },
  {
    amount: 25,
    price: 22.5,
    bonus: 2,
    discount: '-10%',
    badge: 'Populaire',
    icon: Sparkles,
    features: ['25 + 2 Lumens bonus', 'Economisez 2,50 EUR', 'Ideal pour debuter'],
  },
  {
    amount: 100,
    price: 80,
    bonus: 10,
    discount: '-20%',
    badge: 'Meilleur rapport',
    icon: Crown,
    features: ['100 + 10 Lumens bonus', 'Economisez 20 EUR', 'Pour les contributeurs actifs'],
  },
]

export function PurchaseForm() {
  const [state, formAction, isPending] = useActionState(purchaseLumensAction, null)

  return (
    <div className="space-y-4">
      {state?.success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
          <Check className="h-4 w-4 shrink-0" />
          <span>Lumens credites avec succes ! Votre solde a ete mis a jour.</span>
        </div>
      )}
      {state?.error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {PACKS.map((pack) => {
          const isPopular = pack.badge === 'Populaire'
          const isBest = pack.badge === 'Meilleur rapport'

          return (
            <form action={formAction} key={pack.amount}>
              <input type="hidden" name="amount" value={pack.amount} />
              <div
                className={`relative rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02] ${
                  isPopular
                    ? 'border-[#E50914]/30 bg-[rgba(229,9,20,0.05)] shadow-[0_0_30px_rgba(229,9,20,0.08)]'
                    : isBest
                    ? 'border-purple-500/20 bg-purple-500/[0.03]'
                    : 'border-white/10 bg-white/[0.02]'
                } backdrop-blur-sm`}
              >
                {/* Badge */}
                {pack.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge
                      className={
                        isPopular
                          ? 'border-[#E50914]/50 bg-[#E50914]/20 text-[#E50914]'
                          : 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                      }
                    >
                      {pack.badge}
                    </Badge>
                  </div>
                )}

                {/* Discount */}
                {pack.discount && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold text-green-600 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                      {pack.discount}
                    </span>
                  </div>
                )}

                <div className="text-center mb-5 pt-2">
                  <div className="text-3xl font-bold text-white mb-1">
                    {pack.amount}
                    <span className="text-sm font-normal text-white/40 ml-1">Lumens</span>
                  </div>
                  <div className="text-2xl font-bold text-[#E50914]">
                    {pack.price.toFixed(2).replace('.', ',')}&#8364;
                  </div>
                  {pack.bonus > 0 && (
                    <div className="text-xs text-purple-300 mt-1">
                      +{pack.bonus} Lumens bonus
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {pack.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-xs text-white/50"
                    >
                      <Check className="h-3.5 w-3.5 text-[#E50914] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  variant={isPopular ? 'default' : 'outline'}
                  className="w-full"
                >
                  Acheter {pack.amount} Lumens
                </Button>
              </div>
            </form>
          )
        })}
      </div>
    </div>
  )
}
