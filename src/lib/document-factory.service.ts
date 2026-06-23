/**
 * CineGeny Document Factory Service
 * Generates professional cinema documents with AI.
 */

import { prisma } from '@/lib/prisma'
import { CINEMA_DOC_TEMPLATES, DOC_FACTORY_AGENTS } from '@/data/cinema-documents'
import type { CinemaDocTemplate } from '@/data/cinema-documents'
import { creditsToMicro } from '@/lib/ai-pricing'

// ─── Types ──────────────────────────────────────────────────────────

export interface GenerateDocInput {
  templateId: string
  userId: string
  fieldValues: Record<string, string>
  language?: 'fr' | 'en'
}

export interface GeneratedDocument {
  id: string
  templateId: string
  templateName: string
  content: string
  reviewNotes: string[]
  reviewScore: number
  estimatedCredits: number
  language: string
  createdAt: Date
}

export interface DocumentReview {
  score: number               // 0-100
  passed: boolean
  issues: Array<{ type: string; severity: string; message: string }>
  suggestions: string[]
  missingClauses: string[]
}

// ─── Generation ─────────────────────────────────────────────────────

/**
 * Generate a cinema document from template + field values.
 * In production, this calls the appropriate agent (cg-doc-legal, cg-doc-finance, etc.)
 */
export async function generateDocument(input: GenerateDocInput): Promise<GeneratedDocument> {
  const template = CINEMA_DOC_TEMPLATES.find(t => t.id === input.templateId)
  if (!template) throw new Error(`Template not found: ${input.templateId}`)

  const agent = DOC_FACTORY_AGENTS.find(a => a.slug === template.agentSlug)

  // Build document content (simulated — in production, calls AI agent)
  const content = buildDocumentContent(template, input.fieldValues, input.language || 'fr')

  // Run legal review
  const review = await reviewDocument(content, template)

  // Calculate cost
  const costMicro = creditsToMicro(template.estimatedCredits)

  const doc: GeneratedDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    templateId: template.id,
    templateName: template.name,
    content,
    reviewNotes: review.suggestions,
    reviewScore: review.score,
    estimatedCredits: template.estimatedCredits,
    language: input.language || 'fr',
    createdAt: new Date(),
  }

  return doc
}

// ─── Content Builder ────────────────────────────────────────────────

function buildDocumentContent(
  template: CinemaDocTemplate,
  fields: Record<string, string>,
  language: string
): string {
  const date = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const lines: string[] = []

  lines.push(`# ${template.name}`)
  lines.push(`*${template.nameEn}*`)
  lines.push('')
  lines.push(`Date : ${date}`)
  lines.push(`Réf. : CG-${template.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Parties
  if (fields.partyAName) {
    lines.push('## ENTRE LES PARTIES')
    lines.push('')
    lines.push(`**Partie A** : ${fields.partyAName}`)
    if (fields.partyAAddress) lines.push(`Adresse : ${fields.partyAAddress}`)
    lines.push('')
    lines.push(`**Partie B** : ${fields.partyBName || '[À compléter]'}`)
    if (fields.partyBAddress) lines.push(`Adresse : ${fields.partyBAddress}`)
    lines.push('')
    lines.push('Ci-après dénommées collectivement « les Parties ».')
    lines.push('')
  }

  // Film info
  if (fields.filmTitle) {
    lines.push('## OBJET')
    lines.push('')
    lines.push(`Le présent accord porte sur l'œuvre cinématographique intitulée **"${fields.filmTitle}"**`)
    if (fields.filmGenre) lines.push(`Genre : ${fields.filmGenre}`)
    if (fields.filmDuration) lines.push(`Durée estimée : ${fields.filmDuration} minutes`)
    if (fields.filmSynopsis) lines.push(`\nSynopsis : ${fields.filmSynopsis}`)
    lines.push('')
  }

  // Sections
  for (const section of template.sections) {
    if (['Parties', 'Related film'].includes(section)) continue
    lines.push(`## ${section.toUpperCase()}`)
    lines.push('')

    // Generate section-specific content based on template and fields
    switch (section.toLowerCase()) {
      case 'étendue des droits':
      case 'objet de la cession':
        lines.push(`Les droits cédés comprennent : ${fields.rightsScope || 'tous droits d\'exploitation'}`)
        lines.push(`Territoire : ${fields.territory || 'Monde entier'}`)
        lines.push(`Durée : ${fields.duration || 'Durée légale de protection'}`)
        break
      case 'rémunération':
        lines.push(`Le cessionnaire s'engage à verser au cédant la somme de **${fields.compensation || '[montant]'} €** (${fields.compensation ? 'euros' : '[en lettres]'}).`)
        break
      case 'budget et financement':
      case 'résumé':
        lines.push(`Budget total du projet : **${fields.totalBudget || '[montant]'} €**`)
        if (fields.partyAShare) lines.push(`Part Partie A : ${fields.partyAShare}%`)
        if (fields.partyBShare) lines.push(`Part Partie B : ${fields.partyBShare}%`)
        break
      case 'minimum garanti':
        if (fields.minimumGuarantee) lines.push(`Minimum garanti : **${fields.minimumGuarantee} €**`)
        if (fields.distributorCommission) lines.push(`Commission distributeur : **${fields.distributorCommission}%**`)
        break
      default:
        lines.push(`[Section "${section}" — contenu professionnel généré par l'agent ${template.agentSlug}]`)
        lines.push('')
        lines.push('En production, cette section sera entièrement rédigée par l\'IA spécialisée cinéma,')
        lines.push('avec des clauses conformes au droit français et aux usages de l\'industrie.')
    }
    lines.push('')
  }

  // Signatures
  lines.push('---')
  lines.push('')
  lines.push('## SIGNATURES')
  lines.push('')
  lines.push(`Fait en deux exemplaires originaux, à __________, le ${date}.`)
  lines.push('')
  lines.push('| **Partie A** | **Partie B** |')
  lines.push('|---|---|')
  lines.push(`| ${fields.partyAName || '[Nom]'} | ${fields.partyBName || '[Nom]'} |`)
  lines.push('| Signature : _________________ | Signature : _________________ |')
  lines.push('')
  lines.push('---')
  lines.push(`*Document généré par CineGeny Document Factory — Agent : ${template.agentSlug}*`)
  lines.push('*Ce document est un modèle et doit être validé par un professionnel du droit avant signature.*')

  return lines.join('\n')
}

// ─── Review ─────────────────────────────────────────────────────────

/**
 * AI legal review of generated document.
 * In production, calls cg-doc-reviewer agent.
 */
export async function reviewDocument(
  content: string,
  template: CinemaDocTemplate
): Promise<DocumentReview> {
  const issues: Array<{ type: string; severity: string; message: string }> = []
  const suggestions: string[] = []
  const missingClauses: string[] = []

  // Check for required sections
  for (const section of template.sections) {
    if (!content.toLowerCase().includes(section.toLowerCase())) {
      missingClauses.push(section)
      issues.push({ type: 'missing_section', severity: 'warning', message: `Section manquante : ${section}` })
    }
  }

  // Check for placeholder text
  const placeholders = content.match(/\[.*?\]/g) || []
  if (placeholders.length > 3) {
    issues.push({ type: 'incomplete', severity: 'info', message: `${placeholders.length} champs à compléter détectés` })
  }

  // Check for signatures section
  if (!content.includes('SIGNATURES') && !content.includes('signatures')) {
    missingClauses.push('Bloc signatures')
    issues.push({ type: 'missing_section', severity: 'warning', message: 'Bloc signatures manquant' })
  }

  // Standard suggestions
  suggestions.push(
    'Faites relire ce document par un avocat spécialisé en droit du cinéma',
    'Vérifiez les montants et pourcentages avec votre comptable',
    'Assurez-vous que toutes les parties ont bien été identifiées',
  )

  if (template.category === 'legal') {
    suggestions.push('Vérifiez la conformité avec le Code de la propriété intellectuelle')
  }

  const errorCount = issues.filter(i => i.severity === 'error').length
  const warningCount = issues.filter(i => i.severity === 'warning').length
  const score = Math.max(0, 100 - errorCount * 25 - warningCount * 10)

  return {
    score,
    passed: errorCount === 0,
    issues,
    suggestions,
    missingClauses,
  }
}

/** Get all templates */
export function getTemplates() {
  return CINEMA_DOC_TEMPLATES
}

/** Get template by ID */
export function getTemplate(id: string) {
  return CINEMA_DOC_TEMPLATES.find(t => t.id === id)
}
