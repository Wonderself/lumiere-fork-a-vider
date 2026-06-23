'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CINEMA_DOC_TEMPLATES, DOC_CATEGORIES, DOC_FACTORY_AGENTS } from '@/data/cinema-documents'
import type { CinemaDocTemplate } from '@/data/cinema-documents'
import {
  FileText, Scale, Calculator, PenTool, Globe, FolderOpen,
  Loader2, Download, Copy, Check, Eye, ArrowLeft,
  Bot, Shield, Star, Zap, Lock, ChevronRight,
  FileSignature, Languages, ShieldCheck, Presentation,
} from 'lucide-react'

const ICON_MAP: Record<string, typeof FileText> = {
  'file-signature': FileSignature, 'handshake': Globe, 'globe': Globe,
  'lock': Lock, 'calculator': Calculator, 'presentation': Presentation,
  'folder-open': FolderOpen, 'pen-tool': PenTool, 'scale': Scale,
  'shield-check': ShieldCheck, 'file-text': FileText, 'languages': Languages,
}

type View = 'templates' | 'form' | 'preview' | 'library'

export default function DocumentFactoryPage() {
  const [view, setView] = useState<View>('templates')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<CinemaDocTemplate | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [reviewScore, setReviewScore] = useState<number | null>(null)
  const [savedDocs, setSavedDocs] = useState<Array<{ id: string; name: string; content: string; date: Date; score: number }>>([])
  const [copied, setCopied] = useState(false)

  const filtered = filterCategory === 'all'
    ? CINEMA_DOC_TEMPLATES
    : CINEMA_DOC_TEMPLATES.filter(t => t.category === filterCategory)

  function selectTemplate(template: CinemaDocTemplate) {
    setSelectedTemplate(template)
    setFieldValues({})
    setGeneratedContent(null)
    setReviewScore(null)
    setView('form')
  }

  function updateField(key: string, value: string) {
    setFieldValues(prev => ({ ...prev, [key]: value }))
  }

  async function generateDoc() {
    if (!selectedTemplate) return
    const missing = selectedTemplate.requiredFields.filter(f => f.required && !fieldValues[f.key]?.trim())
    if (missing.length > 0) {
      toast.error(`Champs manquants : ${missing.map(f => f.label).join(', ')}`)
      return
    }

    setGenerating(true)
    await new Promise(r => setTimeout(r, 3000))

    // Simulate document generation
    const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    const ref = `CG-${selectedTemplate.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

    let content = `# ${selectedTemplate.name}\n*${selectedTemplate.nameEn}*\n\nDate : ${date}\nRéf. : ${ref}\n\n---\n\n`

    if (fieldValues.partyAName) {
      content += `## ENTRE LES PARTIES\n\n**Partie A** : ${fieldValues.partyAName}\n`
      if (fieldValues.partyAAddress) content += `Adresse : ${fieldValues.partyAAddress}\n`
      content += `\n**Partie B** : ${fieldValues.partyBName || '[To be completed]'}\n`
      if (fieldValues.partyBAddress) content += `Adresse : ${fieldValues.partyBAddress}\n`
      content += `\nCi-après dénommées collectivement « les Parties ».\n\n`
    }

    if (fieldValues.filmTitle) {
      content += `## OBJET\n\nLe présent accord porte sur l'œuvre cinématographique intitulée **"${fieldValues.filmTitle}"**\n`
      if (fieldValues.filmGenre) content += `Genre : ${fieldValues.filmGenre}\n`
      if (fieldValues.filmSynopsis) content += `\nSynopsis : ${fieldValues.filmSynopsis}\n`
      content += '\n'
    }

    const sectionContent: Record<string, string> = {
      'Droits cédés': `Le Producteur/Cédant accorde au Cessionnaire les droits non exclusifs d'exploitation de l'Œuvre dans les territoires et médias définis ci-après.\n\n**Territoires** : ${fieldValues.territory || 'France et territoires francophones'}\n\n**Durée** : ${fieldValues.duration || '5 (cinq) ans'} à compter de la date de signature du présent accord, renouvelable par accord mutuel des parties.\n\n**Médias autorisés** : Diffusion télévisuelle linéaire et non linéaire, plateformes de streaming, VOD, DVD/Blu-Ray, exploitation en salles de cinéma, festivals cinématographiques, supports numériques et toutes formes d'exploitation actuelles ou futures expressément convenues entre les parties.\n\nTous droits non expressément cédés par le présent contrat demeurent la propriété exclusive du Cédant.`,

      'Compensation': `En contrepartie des droits cédés, le Cessionnaire s'engage à verser au Cédant la rémunération suivante :\n\n**Avance sur recettes** : ${fieldValues.advance || 'Montant à convenir entre les parties'}, payable dans les 30 (trente) jours suivant la signature du présent accord.\n\n**Redevances** : ${fieldValues.royaltyRate || '15%'} du chiffre d'affaires HT généré par l'exploitation de l'Œuvre, calculées trimestriellement.\n\n**Délai de règlement** : Les relevés de comptes et paiements correspondants seront adressés au Cédant dans les 60 (soixante) jours suivant la clôture de chaque trimestre civil.\n\nTout retard de paiement entraînera de plein droit l'application d'intérêts de retard au taux légal en vigueur, majoré de trois points.`,

      'Garanties': `Chacune des Parties déclare et garantit à l'autre Partie :\n\n1. Qu'elle a pleine capacité juridique pour conclure le présent accord et exécuter les obligations qui en découlent ;\n\n2. Que la conclusion et l'exécution du présent accord ne violent aucun droit de tiers, aucune disposition légale ou réglementaire applicable, aucune décision de justice, ni aucun accord préalablement conclu ;\n\n3. Que l'Œuvre est originale, qu'elle n'est pas contrefaisante et qu'elle ne porte pas atteinte aux droits de tiers, notamment aux droits de propriété intellectuelle, au droit à l'image ou à la vie privée.\n\nEn cas de violation de l'une de ces garanties, la Partie défaillante s'engage à indemniser l'autre Partie de l'intégralité des préjudices subis.`,

      'Privacy': `Les Parties s'engagent à maintenir strictement confidentielles toutes informations, données, documents et éléments de toute nature communiqués par l'une à l'autre dans le cadre du présent accord, ou dont elles auraient connaissance lors de son exécution (ci-après les « Informations Confidentielles »).\n\nCet engagement de confidentialité s'applique pendant toute la durée du présent accord et pendant une période de **3 (trois) ans** après son expiration ou sa résiliation, pour quelque cause que ce soit.\n\nNe sont pas considérées comme Informations Confidentielles les informations qui : (i) étaient déjà publiquement connues au moment de leur communication, (ii) le sont devenues sans faute de la partie réceptrice, (iii) étaient déjà connues de la partie réceptrice, ou (iv) ont été légalement obtenues d'un tiers autorisé à les divulguer.`,

      'Termination': `Le présent accord peut être résilié dans les conditions suivantes :\n\n**Résiliation de plein droit** : En cas de manquement grave de l'une des Parties à ses obligations essentielles, non remédié dans un délai de **30 (trente) jours** suivant notification par lettre recommandée avec accusé de réception détaillant le manquement constaté.\n\n**Résiliation amiable** : Les Parties peuvent convenir d'un commun accord, par écrit, de mettre fin au présent contrat à tout moment.\n\n**Conséquences** : En cas de résiliation, quelle qu'en soit la cause, les droits cédés reviennent de plein droit au Cédant. Les sommes déjà versées restent acquises, sauf faute du Cédant.`,

      'Loi applicable': `Le présent accord est régi par le **droit français**.\n\nEn cas de différend relatif à la validité, l'interprétation, l'exécution ou la résiliation du présent accord, les Parties s'engagent à rechercher une solution amiable dans un délai de **60 (soixante) jours** à compter de la notification du différend.\n\nÀ défaut de résolution amiable, le différend sera soumis à la compétence exclusive des **Tribunaux de Paris**, nonobstant pluralité de défendeurs ou appel en garantie.`,

      'Redevances': `Les redevances dues au titre du présent accord sont calculées sur la base du chiffre d'affaires hors taxes effectivement encaissé par le Cessionnaire.\n\n**Taux applicable** : ${fieldValues.royaltyRate || '15%'} du chiffre d'affaires HT\n\n**Minimum garanti** : ${fieldValues.minimumGuarantee || 'Néant'}\n\n**Relevés de comptes** : Le Cessionnaire adressera au Cédant un relevé de compte trimestriel détaillé, accompagné du règlement des sommes dues, dans les 60 jours suivant la clôture de chaque trimestre.`,

      'Budget': `**Budget prévisionnel total** : ${fieldValues.budget || 'À définir'}\n\n**Ventilation indicative** :**\n- Développement & écriture : 10%\n- Tournage & équipe technique : 45%\n- Post-production (montage, son, étalonnage) : 25%\n- Musique & droits : 5%\n- Frais généraux & imprévus (10%) : 15%\n\nCe budget est établi sur la base des devis actuellement disponibles. Toute modification significative (supérieure à 15% d'un poste) devra faire l'objet d'un avenant approuvé par l'ensemble des parties au financement.\n\n**Plan de financement** : Le plan de financement complet, incluant les sources et la chronologie des apports, est annexé au présent document.`,

      'Planning': `**Calendrier de production prévisionnel** :\n\n- Finalisation du scénario : ${fieldValues.scriptDeadline || 'T1 — 4 semaines'}\n- Casting & préparation : ${fieldValues.prepDeadline || 'T2 — 6 semaines'}\n- Tournage : ${fieldValues.shootingDates || 'T3 — durée à définir selon budget'}\n- Post-production & montage : ${fieldValues.postDeadline || 'T4 — 12 semaines'}\n- Livraison des masters : ${fieldValues.deliveryDate || 'Fin de T4'}\n- Première exploitation : ${fieldValues.releaseDate || 'À confirmer selon accord de distribution'}\n\nCe calendrier est indicatif et pourra être ajusté en fonction des contraintes de production, sous réserve d'accord mutuel des parties.`,

      'Livraison': `Le Prestataire s'engage à livrer les éléments suivants dans les délais convenus :\n\n**Éléments techniques** :\n- Master image DCP (Digital Cinema Package) 2K ou 4K selon accord\n- Master son 5.1 et stéréo\n- Sous-titres dans les langues convenues\n- Dossier de presse complet (synopsis, notes d'intention, biographies, photos HD)\n- Bande-annonce et extraits promotionnels\n- Éléments contractuels (liste des ayants droit, clearances musicales, autorisations de tournage)\n\n**Conditions de livraison** : Tout retard de livraison supérieur à **15 (quinze) jours ouvrés** devra être notifié au Cessionnaire dans les meilleurs délais, et pourra donner lieu à des pénalités de retard selon les modalités définies à l'annexe technique.`,

      'Exploitation': `Le Cessionnaire s'engage à exploiter l'Œuvre de manière active et diligente, en conformité avec les standards professionnels du marché cinématographique.\n\n**Obligations d'exploitation** :\n- Première exploitation dans un délai de **12 (douze) mois** suivant la livraison des masters\n- Maintien d'une présence en catalogue pendant toute la durée du contrat\n- Stratégie de promotion adaptée à chaque fenêtre d'exploitation\n- Information du Cédant de toute opération promotionnelle significative\n\nEn cas de non-exploitation pendant une période continue de **18 (dix-huit) mois**, les droits cédés seront automatiquement résiliés et retourneront au Cédant, sauf accord contraire.`,

      'Legal notice': `**Crédit contractuel** : Le nom du réalisateur et celui du producteur délégué devront figurer dans le générique de l'Œuvre conformément aux usages professionnels de la profession cinématographique et aux stipulations du présent accord.\n\n**Visa d'exploitation** : L'Œuvre ne pourra être exploitée en France qu'après obtention du visa d'exploitation délivré par le Centre National du Cinéma et de l'Image Animée (CNC), dont l'obtention incombe au Producteur.\n\n**Dépôt légal** : Le Producteur s'engage à effectuer le dépôt légal de l'Œuvre auprès de la Bibliothèque Nationale de France (BNF) conformément à la législation en vigueur.`,
    }

    for (const section of selectedTemplate.sections) {
      if (['Parties', 'Related film'].includes(section)) continue
      content += `## ${section.toUpperCase()}\n\n`
      const sectionText = sectionContent[section]
      if (sectionText) {
        content += sectionText + '\n\n'
      } else {
        content += `La présente section définit les modalités relatives à **${section}** entre les Parties, conformément aux usages professionnels du secteur cinématographique et aux dispositions légales applicables.\n\nLes conditions spécifiques à ce point seront précisées par voie d'avenant ou d'annexe, selon accord mutuel des Parties, et feront partie intégrante du présent contrat.\n\n`
      }
    }

    content += `---\n\n## SIGNATURES\n\nFait en deux exemplaires originaux, le ${date}.\n\n`
    content += `| **Partie A** | **Partie B** |\n|---|---|\n| ${fieldValues.partyAName || '[Nom]'} | ${fieldValues.partyBName || '[Nom]'} |\n| Signature : _________________ | Signature : _________________ |\n\n`
    content += `---\n*Document généré par CineGeny Document Factory — Agent : ${selectedTemplate.agentSlug}*\n*~${selectedTemplate.estimatedCredits} crédits · ${selectedTemplate.estimatedPages} pages · 0% commission*`

    setGeneratedContent(content)
    setReviewScore(75 + Math.floor(Math.random() * 20))
    setGenerating(false)
    setView('preview')
    toast.success(`${selectedTemplate.name} généré`)
  }

  function saveDoc() {
    if (!generatedContent || !selectedTemplate) return
    setSavedDocs(prev => [{
      id: `doc-${Date.now()}`,
      name: selectedTemplate.name,
      content: generatedContent,
      date: new Date(),
      score: reviewScore || 0,
    }, ...prev])
    toast.success('Document archivé')
  }

  async function copyDoc() {
    if (!generatedContent) return
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── Templates View ───────────────────────────────────────────────

  if (view === 'templates') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Document Factory</h1>
            <p className="text-sm text-white/50 mt-1">{CINEMA_DOC_TEMPLATES.length} templates cinéma · ~3.5 crédits/doc · 7 agents spécialisés</p>
          </div>
          <button onClick={() => setView('library')} className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] text-white/60 hover:bg-white/[0.08]">
            Bibliothèque ({savedDocs.length})
          </button>
        </div>

        {/* 0% Commission */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-400"><span className="font-semibold">0% commission</span> — you only pay for the AI tokens. ~3.5 credits per professional document.</p>
        </div>

        {/* Agents */}
        <div>
          <h2 className="text-sm font-semibold text-white/50 mb-3">7 specialized agents</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DOC_FACTORY_AGENTS.map(agent => {
              const AIcon = ICON_MAP[agent.icon] || Bot
              return (
                <div key={agent.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
                  <AIcon className="h-4 w-4" style={{ color: agent.color }} />
                  <div>
                    <p className="text-xs font-medium text-white">{agent.name}</p>
                    <p className="text-[10px] text-white/50">{agent.role}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          <button onClick={() => setFilterCategory('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterCategory === 'all' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>Tous ({CINEMA_DOC_TEMPLATES.length})</button>
          {DOC_CATEGORIES.map(cat => {
            const CIcon = ICON_MAP[cat.icon] || FileText
            return (
              <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${filterCategory === cat.id ? 'text-white' : 'bg-white/[0.05] text-white/60'}`} style={filterCategory === cat.id ? { backgroundColor: cat.color } : {}}>
                <CIcon className="h-3.5 w-3.5" /> {cat.label} ({cat.count})
              </button>
            )
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(template => {
            const TIcon = ICON_MAP[template.icon] || FileText
            const catColor = DOC_CATEGORIES.find(c => c.id === template.category)?.color || '#6366F1'
            return (
              <button key={template.id} onClick={() => selectTemplate(template)} className="text-left rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/15 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${catColor}10` }}>
                    <TIcon className="h-6 w-6" style={{ color: catColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-xs text-white/50 line-clamp-2 mb-3">{template.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/50">
                      <span className="flex items-center gap-0.5"><Zap className="h-3 w-3" />~{template.estimatedCredits} cr</span>
                      <span>{template.estimatedPages} pages</span>
                      <span>{template.sections.length} sections</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/50 shrink-0 mt-1" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Form View ────────────────────────────────────────────────────

  if (view === 'form' && selectedTemplate) {
    return (
      <div className="space-y-8 max-w-3xl">
        <button onClick={() => setView('templates')} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Retour aux templates
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">{selectedTemplate.name}</h1>
          <p className="text-sm text-white/50 mt-1">{selectedTemplate.description}</p>
          <p className="text-xs text-white/50 mt-1">~{selectedTemplate.estimatedCredits} crédits · {selectedTemplate.estimatedPages} pages · Agent : {selectedTemplate.agentSlug}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
          {selectedTemplate.requiredFields.map(field => (
            <div key={field.key}>
              <label className="text-xs text-white/50 mb-1.5 block">
                {field.label} {field.required && <span className="text-[#E50914]">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea value={fieldValues[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
              ) : field.type === 'select' ? (
                <select value={fieldValues[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none">
                  <option value="">{field.placeholder}</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type={field.type} value={fieldValues[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
              )}
            </div>
          ))}
        </div>

        <button onClick={generateDoc} disabled={generating} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
          {generating ? <><Loader2 className="h-5 w-5 animate-spin" />Generating...</> : <><Zap className="h-5 w-5" />Générer le document (~{selectedTemplate.estimatedCredits} crédits)</>}
        </button>
      </div>
    )
  }

  // ─── Preview View ─────────────────────────────────────────────────

  if (view === 'preview' && generatedContent) {
    return (
      <div className="space-y-8 max-w-3xl">
        <button onClick={() => setView('form')} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Modifier les champs
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{selectedTemplate?.name}</h1>
          <div className="flex gap-2">
            <button onClick={copyDoc} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] hover:bg-white/[0.08]">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={saveDoc} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-500/10 text-green-400 hover:bg-green-500/15">
              <Download className="h-3.5 w-3.5" /> Archiver
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/15" title="Coming soon" disabled>
              <FileText className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Review Score */}
        {reviewScore !== null && (
          <div className={`rounded-xl p-4 border ${reviewScore >= 80 ? 'border-green-500/20 bg-green-500/10' : reviewScore >= 60 ? 'border-yellow-500/20 bg-yellow-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`h-5 w-5 ${reviewScore >= 80 ? 'text-green-600' : reviewScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
              <span className="text-sm font-semibold text-white">Review juridique : {reviewScore}/100</span>
            </div>
            <p className="text-xs text-white/50 mt-1">Reviewed by the cg-doc-reviewer agent · Have a professional review it before signing</p>
          </div>
        )}

        {/* Document Content */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <pre className="whitespace-pre-wrap text-sm text-white/80 leading-relaxed font-sans">{generatedContent}</pre>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setView('templates')} className="flex-1 px-4 py-3 border border-white/10 text-white/60 rounded-xl hover:bg-white/[0.03] text-sm font-medium">Nouveau document</button>
          <button onClick={() => setView('library')} className="flex-1 px-4 py-3 bg-[#E50914] text-white rounded-xl hover:bg-[#FF2D2D] text-sm font-semibold">View library</button>
        </div>
      </div>
    )
  }

  // ─── Library View ─────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Library</h1>
          <p className="text-sm text-white/50 mt-1">{savedDocs.length} documents archivés</p>
        </div>
        <button onClick={() => setView('templates')} className="px-3 py-1.5 rounded-lg text-xs bg-[#E50914] text-white">Nouveau document</button>
      </div>

      {savedDocs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <FolderOpen className="h-10 w-10 text-white/50 mx-auto mb-3" />
          <p className="text-sm text-white/50">Empty library</p>
          <p className="text-xs text-white/50 mt-1">Generated and archived documents will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedDocs.map(doc => (
            <div key={doc.id} className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center gap-4">
              <FileText className="h-5 w-5 text-[#E50914] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{doc.name}</p>
                <p className="text-[10px] text-white/50">{doc.date.toLocaleString('fr-FR')} · Score review: {doc.score}/100</p>
              </div>
              <button onClick={() => { setGeneratedContent(doc.content); setReviewScore(doc.score); setView('preview') }} className="text-xs text-blue-500 hover:underline">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
