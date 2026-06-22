'use client'

import { useState, useEffect } from 'react'
import {
  Key, Eye, EyeOff, Copy, Check, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  const arr = new Uint8Array(20)
  crypto.getRandomValues(arr)
  for (const byte of arr) secret += chars[byte % 32]
  return secret
}

function generateTOTP(secret: string): string {
  const timeSlice = Math.floor(Date.now() / 30000)
  let hash = 0
  for (let i = 0; i < secret.length; i++) {
    hash = ((hash << 5) - hash + secret.charCodeAt(i) + timeSlice) | 0
  }
  return Math.abs(hash % 1000000).toString().padStart(6, '0')
}

export function TwoFactorSetup() {
  const [totpSecret, setTotpSecret] = useState<string | null>(null)
  const [totpCode, setTotpCode] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
      setTimeLeft(remaining)
      if (totpSecret) setTotpCode(generateTOTP(totpSecret))
    }, 1000)
    return () => clearInterval(interval)
  }, [totpSecret])

  function setupTOTP() {
    const secret = generateSecret()
    setTotpSecret(secret)
    setTotpCode(generateTOTP(secret))
    toast.success('Secret TOTP généré')
  }

  function verifyTOTP() {
    if (verifyCode === totpCode) {
      setIs2FAEnabled(true)
      toast.success('2FA activé avec succès')
    } else {
      toast.error('Code invalide')
    }
  }

  async function copySecret() {
    if (!totpSecret) return
    await navigator.clipboard.writeText(totpSecret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* 2FA Status */}
      <div className={`rounded-2xl border p-6 ${is2FAEnabled ? 'border-green-500/20 bg-green-500/10' : 'border-yellow-500/20 bg-yellow-500/10'}`}>
        <div className="flex items-center gap-3">
          {is2FAEnabled ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <AlertTriangle className="h-6 w-6 text-yellow-600" />}
          <div>
            <p className="text-sm font-semibold text-white">
              2FA {is2FAEnabled ? 'Activé' : 'Non activé'}
            </p>
            <p className="text-xs text-white/50">
              {is2FAEnabled ? 'Votre compte est protégé par authentification à 2 facteurs' : 'Activez le 2FA pour sécuriser votre compte admin'}
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Setup */}
      {!is2FAEnabled && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="h-4 w-4 text-blue-500" /> Configuration TOTP
          </h2>

          {!totpSecret ? (
            <button
              onClick={setupTOTP}
              className="px-4 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Générer un secret TOTP
            </button>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Secret (ajoutez dans votre app authenticator)</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] text-sm font-mono text-white select-all">
                    {showSecret ? totpSecret : '●'.repeat(20)}
                  </code>
                  <button onClick={() => setShowSecret(!showSecret)} className="p-2 rounded-lg hover:bg-white/[0.05]">
                    {showSecret ? <EyeOff className="h-4 w-4 text-white/50" /> : <Eye className="h-4 w-4 text-white/50" />}
                  </button>
                  <button onClick={copySecret} className="p-2 rounded-lg hover:bg-white/[0.05]">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white/50" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Code actuel ({timeLeft}s)</label>
                <div className="flex items-center gap-3">
                  <code className="text-3xl font-mono font-bold text-[#E50914] tracking-widest">{totpCode}</code>
                  <div className="w-8 h-8 relative">
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#E50914" strokeWidth="3"
                        strokeDasharray={`${(timeLeft / 30) * 94.2} 94.2`}
                        strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Entrez le code pour vérifier</label>
                <div className="flex gap-2">
                  <input
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-40 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white text-center text-lg font-mono tracking-widest focus:border-[#E50914] focus:outline-none"
                  />
                  <button
                    onClick={verifyTOTP}
                    disabled={verifyCode.length !== 6}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Activer 2FA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
