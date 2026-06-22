'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addTaskCommentAction } from '@/app/actions/comments'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'

interface CommentFormProps {
  taskId: string
}

export function CommentForm({ taskId }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(addTaskCommentAction, null)
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (state?.success) {
      // Clear the textarea on successful submission
      if (formRef.current) {
        formRef.current.reset()
      }
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
    }
  }, [state?.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="taskId" value={taskId} />

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        name="content"
        rows={3}
        placeholder="Ajouter un commentaire..."
        required
        minLength={1}
        maxLength={2000}
        className="bg-white/[0.03] border-white/10 focus:border-[#E50914]/40"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          loading={isPending}
          className="gap-2"
        >
          <Send className="h-3.5 w-3.5" />
          {isPending ? 'Envoi...' : 'Ajouter un commentaire'}
        </Button>
      </div>
    </form>
  )
}
