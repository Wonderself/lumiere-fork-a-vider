'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1A1A2E',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '13px',
        },
        className: 'cinegen-toast',
      }}
      richColors
      closeButton
    />
  )
}
