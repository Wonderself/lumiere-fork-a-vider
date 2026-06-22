import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { updateSettingsAction } from '@/app/actions/admin'
import { Settings, Sun, Mail, Cpu, CreditCard, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Paramètres' }

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const settings = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } }) || {
    aiConfidenceThreshold: 70,
    maxConcurrentTasks: 3,
    bitcoinEnabled: false,
    maintenanceMode: false,
    lumenPrice: 1.0,
    lumenRewardPerTask: 10,
    notifEmailEnabled: false,
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 font-playfair">
          <Settings className="h-7 w-7 text-[#E50914]" /> Paramètres
        </h1>
        <p className="text-white/60">Configuration globale de la plateforme.</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <form action={updateSettingsAction} className="space-y-6">
        {/* AI Settings */}
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-md">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-[#E50914] flex items-center gap-2">
              <Cpu className="h-5 w-5" /> Paramètres IA
            </h2>

            <div className="space-y-3">
              <Label>
                Seuil de Confiance IA — {settings.aiConfidenceThreshold}%
              </Label>
              <p className="text-xs text-white/50">
                Score minimum pour qu&apos;une soumission soit automatiquement validée par l&apos;IA. En dessous, elle passe en review humaine.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="aiConfidenceThreshold"
                  min="0"
                  max="100"
                  step="5"
                  defaultValue={settings.aiConfidenceThreshold}
                  className="flex-1 accent-[#E50914] h-2 rounded-full"
                />
                <span className="text-sm text-[#E50914] font-medium w-12 text-right">{settings.aiConfidenceThreshold}%</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>0% — Tout passe en review humaine</span>
                <span>100% — Tout auto-validé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lumens Settings */}
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-md">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-[#E50914] flex items-center gap-2">
              <Sun className="h-5 w-5" /> Lumens (Crédits)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lumenPrice">Prix d&apos;un Lumen (€)</Label>
                <p className="text-xs text-white/50">Taux de conversion EUR → Lumen.</p>
                <Input
                  id="lumenPrice"
                  name="lumenPrice"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  defaultValue={settings.lumenPrice}
                  className="w-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lumenRewardPerTask">Lumens par tâche validée</Label>
                <p className="text-xs text-white/50">Bonus attribué au contributeur.</p>
                <Input
                  id="lumenRewardPerTask"
                  name="lumenRewardPerTask"
                  type="number"
                  min="0"
                  max="1000"
                  defaultValue={settings.lumenRewardPerTask}
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-md">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-[#E50914] flex items-center gap-2">
              <Mail className="h-5 w-5" /> Notifications Email
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notifEmailEnabled"
                name="notifEmailEnabled"
                value="true"
                defaultChecked={settings.notifEmailEnabled}
                className="rounded accent-[#E50914]"
              />
              <div>
                <Label htmlFor="notifEmailEnabled">Activer les emails transactionnels</Label>
                <p className="text-xs text-white/50">Envoie des emails pour les validations, paiements, etc. Nécessite Resend API key.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Settings */}
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-md">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-[#E50914] flex items-center gap-2">
              <Settings className="h-5 w-5" /> Tâches
            </h2>

            <div className="space-y-2">
              <Label htmlFor="maxConcurrentTasks">Tâches simultanées max par contributeur</Label>
              <p className="text-xs text-white/50">
                Un contributeur ne peut pas accepter plus de X tâches en même temps.
              </p>
              <Input
                id="maxConcurrentTasks"
                name="maxConcurrentTasks"
                type="number"
                min="1"
                max="10"
                defaultValue={settings.maxConcurrentTasks}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-md">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-[#E50914] flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Paiements
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="bitcoinEnabled"
                name="bitcoinEnabled"
                value="true"
                defaultChecked={settings.bitcoinEnabled}
                className="rounded accent-[#E50914]"
              />
              <div>
                <Label htmlFor="bitcoinEnabled">Activer les paiements Bitcoin Lightning</Label>
                <p className="text-xs text-white/50">Nécessite la configuration de BTCPay Server.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-red-500/20 hover:shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Zone Dangereuse
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                value="true"
                defaultChecked={settings.maintenanceMode}
                className="rounded accent-red-500"
              />
              <div>
                <Label htmlFor="maintenanceMode" className="text-red-400">Mode Maintenance</Label>
                <p className="text-xs text-white/50">Redirige tous les visiteurs vers la page de maintenance.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">Sauvegarder les Paramètres</Button>
      </form>
    </div>
  )
}
