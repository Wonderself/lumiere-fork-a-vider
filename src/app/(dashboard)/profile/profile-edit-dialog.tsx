'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { updateProfileAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Pencil, Save } from 'lucide-react'

interface ProfileEditDialogProps {
  user: {
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    portfolioUrl: string | null
    skills: string[]
    languages: string[]
    walletAddress: string | null
  }
}

export function ProfileEditDialog({ user }: ProfileEditDialogProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null)
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
    }
  }, [state?.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Pencil className="h-4 w-4" />
          Modifier mon profil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-playfair">
            Modifier mon profil
          </DialogTitle>
          <DialogDescription>
            Mettez a jour vos informations personnelles et professionnelles.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {state.error}
            </div>
          )}

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Nom d&apos;affichage</Label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={user.displayName || ''}
              placeholder="Votre nom ou pseudo"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={user.bio || ''}
              placeholder="Parlez-nous de vous, de votre experience..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL de l&apos;avatar</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              defaultValue={user.avatarUrl || ''}
              placeholder="https://exemple.com/avatar.jpg"
            />
          </div>

          {/* Portfolio URL */}
          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">URL du portfolio</Label>
            <Input
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              defaultValue={user.portfolioUrl || ''}
              placeholder="https://votre-portfolio.com"
            />
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Adresse de portefeuille (Bitcoin / Lightning)</Label>
            <Input
              id="walletAddress"
              name="walletAddress"
              defaultValue={user.walletAddress || ''}
              placeholder="bc1q... ou lnurl..."
              maxLength={100}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Competences (separees par des virgules)</Label>
            <Input
              id="skills"
              name="skillsRaw"
              defaultValue={user.skills.join(', ')}
              placeholder="Prompt engineering, Color grading, Sound design..."
            />
            <p className="text-xs text-white/30">Ex: Prompt engineering, Color grading, Sound design</p>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label htmlFor="languages">Langues (separees par des virgules)</Label>
            <Input
              id="languages"
              name="languagesRaw"
              defaultValue={user.languages.join(', ')}
              placeholder="Francais, English, Espanol..."
            />
          </div>

          {/* Hidden fields for skills and languages arrays - handled via JS */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isPending}
            loading={isPending}
            onClick={() => {
              // Before submit, convert comma-separated strings to hidden inputs
              if (formRef.current) {
                // Remove previous hidden skill/language inputs
                formRef.current.querySelectorAll('input[name="skills"], input[name="languages"]').forEach(el => el.remove())

                const skillsRaw = (formRef.current.querySelector('[name="skillsRaw"]') as HTMLInputElement)?.value || ''
                const languagesRaw = (formRef.current.querySelector('[name="languagesRaw"]') as HTMLInputElement)?.value || ''

                skillsRaw.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => {
                  const input = document.createElement('input')
                  input.type = 'hidden'
                  input.name = 'skills'
                  input.value = skill
                  formRef.current!.appendChild(input)
                })

                languagesRaw.split(',').map(s => s.trim()).filter(Boolean).forEach(lang => {
                  const input = document.createElement('input')
                  input.type = 'hidden'
                  input.name = 'languages'
                  input.value = lang
                  formRef.current!.appendChild(input)
                })
              }
            }}
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
