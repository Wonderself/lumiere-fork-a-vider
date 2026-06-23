import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { submitFilmAction } from '@/app/actions/catalog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Film, Upload, FileText, Shield } from 'lucide-react'
import Link from 'next/link'
import { Markdown } from '@/components/ui/markdown'
import { generateFilmContract } from '@/lib/contracts'

export default async function SubmitFilmPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const previewContract = generateFilmContract({
    creatorName: '[Votre nom]',
    filmTitle: '[Titre du film]',
    revenueSharePct: 50,
    exclusivity: false,
    exclusivityBonus: 10,
    signDate: new Date().toLocaleDateString('fr-FR'),
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/streaming" className="text-white/40 hover:text-white/70 text-sm transition-colors duration-300">
          ← Retour au catalogue
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Soumettre votre film
          </h1>
          <p className="text-white/50 mt-2">
            Partagez votre création avec notre communauté et gagnez de l&apos;argent à chaque vue.
          </p>
        </div>

        {/* Revenue Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#E50914]/5 border-[#E50914]/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-[#E50914] text-2xl font-bold">50%</p>
              <p className="text-white/50 text-sm">Default creator share</p>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-white text-2xl font-bold">+10%</p>
              <p className="text-white/50 text-sm">Exclusivity bonus</p>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-white text-2xl font-bold">Mensuel</p>
              <p className="text-white/50 text-sm">Paiement fin de mois</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/10 to-transparent mb-8" />

        <form action={async (formData: FormData) => {
          'use server'
          await submitFilmAction(null, formData)
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left — Form */}
            <div className="space-y-6">
              <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Film className="h-5 w-5 text-[#E50914]" /> Informations du film
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/60">Titre *</Label>
                    <Input name="title" required className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="Le titre de votre film" />
                  </div>
                  <div>
                    <Label className="text-white/60">Synopsis *</Label>
                    <Textarea name="synopsis" required className="bg-white/5 border-white/[0.08] text-white mt-1" rows={4} placeholder="Describe your film..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Genre</Label>
                      <Input name="genre" className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="Sci-Fi, Drame..." />
                    </div>
                    <div>
                      <Label className="text-white/60">Year</Label>
                      <Input name="year" type="number" className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="2026" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Duration (seconds)</Label>
                      <Input name="duration" type="number" className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="5400" />
                    </div>
                    <div>
                      <Label className="text-white/60">Langue</Label>
                      <Input name="language" defaultValue="fr" className="bg-white/5 border-white/[0.08] text-white mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-[#E50914]" /> Fichiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/60">Video URL *</Label>
                    <Input name="videoUrl" required className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="https://..." />
                    <p className="text-white/20 text-xs mt-1">Direct link to the video file (MP4, WebM)</p>
                  </div>
                  <div>
                    <Label className="text-white/60">URL bande-annonce</Label>
                    <Input name="trailerUrl" className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="https://..." />
                  </div>
                  <div>
                    <Label className="text-white/60">URL affiche / thumbnail</Label>
                    <Input name="thumbnailUrl" className="bg-white/5 border-white/[0.08] text-white mt-1" placeholder="https://..." />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#E50914]" /> Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="exclusivity" value="true" className="mt-1 accent-[#E50914]" />
                    <div>
                      <p className="text-white font-medium">CINEGENY Exclusive</p>
                      <p className="text-white/40 text-sm">Ne pas diffuser sur d&apos;autres plateformes → +10% de revenus</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="isContest" value="true" className="mt-1 accent-[#E50914]" />
                    <div>
                      <p className="text-white font-medium">Participer au concours mensuel</p>
                      <p className="text-white/40 text-sm">Votre film sera visible dans la section concours</p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Right — Contract Preview */}
            <div className="space-y-6">
              <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#E50914]" /> Contrat de distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <Markdown content={previewContract} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#E50914]/5 border-[#E50914]/20 backdrop-blur-sm">
                <CardContent className="p-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="acceptTerms" value="true" required className="mt-1 accent-[#E50914]" />
                    <p className="text-white/70 text-sm">
                      J&apos;ai lu et j&apos;accepte les conditions du contrat de distribution.
                      Je certifie être le titulaire des droits sur cette œuvre.
                    </p>
                  </label>
                </CardContent>
              </Card>

              <button
                type="submit"
                className="w-full py-3 bg-[#E50914] text-white font-bold rounded-lg hover:bg-[#FF2D2D] transition-colors duration-300 text-lg"
              >
                Soumettre mon film
              </button>
              <p className="text-white/20 text-xs text-center">
                Votre film sera vérifié par notre équipe avant d&apos;être publié dans le catalogue.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
