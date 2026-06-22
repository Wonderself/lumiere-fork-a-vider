'use client'

import { useActionState, useState } from 'react'
import { withdrawLumensAction } from '@/app/actions/lumens'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle } from 'lucide-react'

export function WithdrawForm({ currentBalance }: { currentBalance: number }) {
  const [state, formAction, isPending] = useActionState(withdrawLumensAction, null)
  const [amount, setAmount] = useState('')

  const parsedAmount = parseInt(amount, 10)
  const isValid = !isNaN(parsedAmount) && parsedAmount >= 10 && parsedAmount <= currentBalance
  const remaining = isValid ? currentBalance - parsedAmount : currentBalance

  return (
    <div className="space-y-4">
      {state?.success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
          <Check className="h-4 w-4 shrink-0" />
          <span>Demande de retrait enregistree. Le virement sera effectue sous 14 jours ouvres.</span>
        </div>
      )}
      {state?.error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="withdraw-amount" className="block text-sm font-medium text-white/60 mb-2">
              Montant a retirer (min. 10 Lumens)
            </label>
            <div className="relative">
              <input
                id="withdraw-amount"
                type="number"
                name="amount"
                min={10}
                max={currentBalance}
                placeholder="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 rounded-lg bg-white/5 border border-white/10 px-4 text-white placeholder-white/30 text-lg focus:outline-none focus:border-[#E50914]/50 focus:ring-1 focus:ring-[#E50914]/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
                Lumens
              </span>
            </div>
          </div>
          <div className="sm:self-end">
            <Button
              type="submit"
              disabled={isPending || !isValid}
              loading={isPending}
              variant="outline"
              className="h-12 px-6"
            >
              Retirer
            </Button>
          </div>
        </div>

        {/* Balance calculation */}
        <div className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/5 p-4">
          <div className="space-y-1">
            <div className="text-xs text-white/40">Solde actuel</div>
            <div className="text-sm font-semibold text-white">
              {currentBalance.toLocaleString('fr-FR')} Lumens
            </div>
          </div>
          {amount && parsedAmount > 0 && (
            <>
              <div className="text-white/20 mx-4">&#8594;</div>
              <div className="space-y-1">
                <div className="text-xs text-white/40">Retrait</div>
                <div className="text-sm font-semibold text-red-400">
                  -{parsedAmount.toLocaleString('fr-FR')} Lumens
                </div>
              </div>
              <div className="text-white/20 mx-4">&#8594;</div>
              <div className="space-y-1">
                <div className="text-xs text-white/40">Solde restant</div>
                <div className={`text-sm font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-400'}`}>
                  {remaining >= 0
                    ? remaining.toLocaleString('fr-FR')
                    : 'Insuffisant'
                  }{' '}
                  {remaining >= 0 && 'Lumens'}
                </div>
              </div>
              <div className="text-white/20 mx-4">=</div>
              <div className="space-y-1">
                <div className="text-xs text-white/40">Virement</div>
                <div className="text-sm font-semibold text-[#E50914]">
                  {parsedAmount > 0 && parsedAmount <= currentBalance
                    ? `${parsedAmount.toFixed(2).replace('.', ',')} EUR`
                    : '—'
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
