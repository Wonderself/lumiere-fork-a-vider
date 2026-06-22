import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NewTrailerForm } from './new-trailer-form'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nouveau Projet — Studio Bande-Annonce',
}

export default async function NewTrailerPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Nouvelle Bande-Annonce
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Décrivez votre concept et l&apos;IA décomposera la création en micro-tâches intelligentes
        </p>
      </div>
      <NewTrailerForm />
    </div>
  )
}
