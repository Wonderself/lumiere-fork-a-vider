import { Suspense } from 'react'
import type { Metadata } from 'next'
import { RegisterForm } from './register-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Inscription — CINEGENY',
  description: 'Créez votre compte et rejoignez le studio de cinéma collaboratif propulsé par l\'IA.',
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#E50914] rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
