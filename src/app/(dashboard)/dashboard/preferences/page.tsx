'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Settings, Sun, Moon, Globe, Bell,
  Save, Loader2, Monitor, Smartphone,
} from 'lucide-react'

export default function PreferencesPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [language, setLanguage] = useState('fr')
  const [pushNotifs, setPushNotifs] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true)
  const [taskAlerts, setTaskAlerts] = useState(true)
  const [voteAlerts, setVoteAlerts] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount (persists across sessions)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cinegeny-preferences')
      if (saved) {
        const prefs = JSON.parse(saved)
        if (prefs.theme) setTheme(prefs.theme)
        if (prefs.language) setLanguage(prefs.language)
        if (prefs.pushNotifs !== undefined) setPushNotifs(prefs.pushNotifs)
        if (prefs.emailNotifs !== undefined) setEmailNotifs(prefs.emailNotifs)
        if (prefs.lowBalanceAlert !== undefined) setLowBalanceAlert(prefs.lowBalanceAlert)
        if (prefs.taskAlerts !== undefined) setTaskAlerts(prefs.taskAlerts)
        if (prefs.voteAlerts !== undefined) setVoteAlerts(prefs.voteAlerts)
      }
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  async function savePreferences() {
    setSaving(true)
    const prefs = { theme, language, pushNotifs, emailNotifs, lowBalanceAlert, taskAlerts, voteAlerts }

    // Save to localStorage for persistence
    localStorage.setItem('cinegeny-preferences', JSON.stringify(prefs))

    // Save language preference via server action (cookie for i18n)
    try {
      const { setLocaleAction } = await import('@/app/actions/locale')
      await setLocaleAction(language)
    } catch { /* non-blocking */ }

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('dark', 'light')
    }

    setSaving(false)
    toast.success('Préférences sauvegardées')
  }

  if (!loaded) return null

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Préférences</h1>
        <p className="text-sm text-white/50 mt-1">Personnalisez votre expérience CineGeny</p>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Settings className="h-4 w-4 text-white/50" /> Apparence</h2>
        <div className="flex gap-3">
          {[
            { value: 'light' as const, label: 'Clair', icon: Sun },
            { value: 'dark' as const, label: 'Sombre', icon: Moon },
            { value: 'system' as const, label: 'Système', icon: Monitor },
          ].map(opt => {
            const OIcon = opt.icon
            return (
              <button key={opt.value} onClick={() => setTheme(opt.value)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${theme === opt.value ? 'border-[#E50914] bg-[#E50914]/10 text-[#E50914]' : 'border-white/10 text-white/50 hover:border-white/15'}`}>
                <OIcon className="h-4 w-4" /> <span className="text-sm">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Langue</h2>
        <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 text-white px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none">
          <option value="fr" className="bg-[#111]">Français</option>
          <option value="en" className="bg-[#111]">English</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Bell className="h-4 w-4 text-yellow-500" /> Notifications</h2>
        {[
          { label: 'Notifications push', desc: 'Recevoir les notifications dans le navigateur', value: pushNotifs, set: setPushNotifs, icon: Smartphone },
          { label: 'Notifications email', desc: 'Recevoir les résumés par email', value: emailNotifs, set: setEmailNotifs, icon: Bell },
          { label: 'Alerte solde bas', desc: 'Alerte quand les crédits sont faibles', value: lowBalanceAlert, set: setLowBalanceAlert, icon: Bell },
          { label: 'Tâches & missions', desc: 'Notifications pour les nouvelles tâches', value: taskAlerts, set: setTaskAlerts, icon: Bell },
          { label: 'Résultats des votes', desc: 'Résultats des votes communautaires', value: voteAlerts, set: setVoteAlerts, icon: Bell },
        ].map(notif => {
          const NIcon = notif.icon
          return (
            <div key={notif.label} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <NIcon className="h-4 w-4 text-white/50" />
                <div>
                  <p className="text-sm text-white">{notif.label}</p>
                  <p className="text-[10px] text-white/50">{notif.desc}</p>
                </div>
              </div>
              <button onClick={() => notif.set(!notif.value)} className={`relative h-6 w-11 rounded-full transition-colors ${notif.value ? 'bg-[#E50914]' : 'bg-white/20'}`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${notif.value ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )
        })}
      </div>

      <button onClick={savePreferences} disabled={saving} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
        Sauvegarder les préférences
      </button>
    </div>
  )
}
