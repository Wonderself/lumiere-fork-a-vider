import type { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mot de passe oublié — CINEGENY',
  description: 'Réinitialisez votre mot de passe CINEGENY.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
