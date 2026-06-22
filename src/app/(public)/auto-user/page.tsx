'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AutoUserPage() {
  const [status, setStatus] = useState('Connexion utilisateur en cours...')

  useEffect(() => {
    signIn('credentials', {
      email: 'admin@admin.com',
      password: 'adminadmin',
      callbackUrl: '/dashboard',
    }).catch(() => setStatus('Erreur de connexion'))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-xl">{status}</p>
    </div>
  )
}
