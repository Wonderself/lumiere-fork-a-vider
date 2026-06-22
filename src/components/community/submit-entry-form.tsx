'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { submitTrailerEntryAction } from '@/app/actions/community'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Film, ChevronDown, ChevronUp, CheckCircle, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubmitEntryFormProps {
  contestId: string
}

export function SubmitEntryForm({ contestId }: SubmitEntryFormProps) {
  const [state, formAction, isPending] = useActionState(submitTrailerEntryAction, null)
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      setTimeout(() => setIsOpen(false), 2500)
    }
  }, [state?.success])

  return (
    <div className="rounded-2xl border border-[#E50914]/20 bg-amber-50/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-amber-50/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Upload className="h-5 w-5 text-[#E50914]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Participer au concours</h3>
            <p className="text-sm text-gray-500">Soumettez votre trailer pour ce concours</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-500',
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-amber-100 pt-5">
            {state?.success && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-600">Participation soumise !</p>
                  <p className="text-xs text-green-500 mt-0.5">Votre trailer est en lice.</p>
                </div>
              </div>
            )}

            {state?.error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
              <input type="hidden" name="contestId" value={contestId} />

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Titre de votre trailer *
                </label>
                <Input
                  name="title"
                  required
                  placeholder="Ex: CINEGENY Awakens — Teaser"
                  className="bg-white border-gray-200 focus:border-[#E50914]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  URL de la video
                </label>
                <Input
                  name="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-white border-gray-200 focus:border-[#E50914]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  URL de la miniature
                </label>
                <Input
                  name="thumbnailUrl"
                  type="url"
                  placeholder="https://..."
                  className="bg-white border-gray-200 focus:border-[#E50914]/40"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  className="gap-2"
                >
                  <Film className="h-4 w-4" />
                  {isPending ? 'Envoi...' : 'Soumettre mon trailer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
