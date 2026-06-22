/**
 * Invoice generation for contributor payments.
 *
 * Legal notes:
 * - As CINEGENY Studio SAS (France), we issue invoices for contractor payments
 * - Contributors are considered as independent contractors (auto-entrepreneurs or freelancers)
 * - Under €5000/year per contributor: simplified invoice (note d'honoraires)
 * - VAT: Platform is intermediary, reverse charge may apply for EU contributors
 * - Each invoice gets a unique sequential number for legal compliance
 */

export type InvoiceData = {
  invoiceNumber: string
  date: string
  // Platform (issuer)
  platformName: string
  platformAddress: string
  platformSiret: string
  platformVat: string
  // Contributor (recipient)
  contributorName: string
  contributorEmail: string
  contributorId: string
  // Payment details
  taskTitle: string
  filmTitle: string
  amount: number
  currency: string
  method: string
  // Status
  status: 'PENDING' | 'PAID'
  paidAt?: string
}

/**
 * Generates an invoice number in format: LB-YYYY-MMDD-XXXX
 */
export function generateInvoiceNumber(paymentId: string): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = paymentId.slice(-6).toUpperCase()
  return `LB-${y}-${m}${d}-${seq}`
}

/**
 * Generates a full invoice in Markdown format.
 * Can be converted to PDF via a rendering service or displayed as-is.
 */
export function generateInvoice(data: InvoiceData): string {
  return `# FACTURE / INVOICE

---

| | |
|---|---|
| **N° Facture** | ${data.invoiceNumber} |
| **Date d'émission** | ${data.date} |
| **Statut** | ${data.status === 'PAID' ? 'PAYÉE' : 'EN ATTENTE'} |
${data.paidAt ? `| **Date de paiement** | ${data.paidAt} |` : ''}

---

## ÉMETTEUR

**${data.platformName}**
${data.platformAddress}
SIRET : ${data.platformSiret}
TVA Intracommunautaire : ${data.platformVat}

---

## DESTINATAIRE

**${data.contributorName}**
Email : ${data.contributorEmail}
ID CINEGENY : ${data.contributorId}

---

## PRESTATION

| Description | Film | Montant HT |
|---|---|---|
| ${data.taskTitle} | ${data.filmTitle} | ${data.amount.toFixed(2)} ${data.currency} |

---

| | |
|---|---|
| **Sous-total HT** | ${data.amount.toFixed(2)} ${data.currency} |
| **TVA (0% — auto-liquidation)** | 0.00 ${data.currency} |
| **TOTAL TTC** | **${data.amount.toFixed(2)} ${data.currency}** |

> *TVA en auto-liquidation (article 283-2 du CGI pour les prestations de services intracommunautaires). Le prestataire est responsable de la déclaration de TVA dans son pays de résidence.*

---

## MODALITÉS DE PAIEMENT

- **Méthode** : ${data.method}
- **Délai** : Paiement à réception ou dans les 30 jours suivant la validation
- **Devise** : ${data.currency}

---

*Facture générée automatiquement par ${data.platformName}.*
*En cas de litige : contact@cinegeny.studio*
*Conditions générales disponibles sur cinegeny.studio/legal*
`
}

/**
 * Platform constants for invoice generation
 */
export const PLATFORM_INFO = {
  name: 'CINEGENY Studio SAS',
  address: 'Paris, France',
  siret: '000 000 000 00000', // À remplir avec le vrai SIRET
  vat: 'FR00000000000', // À remplir avec le vrai numéro TVA
}

/**
 * Creates invoice data from payment + user + task info.
 * Used by the API route and admin actions.
 */
export function buildInvoiceData(params: {
  paymentId: string
  contributorName: string
  contributorEmail: string
  contributorId: string
  taskTitle: string
  filmTitle: string
  amount: number
  method: string
  status: 'PENDING' | 'PAID'
  paidAt?: Date | null
}): InvoiceData {
  return {
    invoiceNumber: generateInvoiceNumber(params.paymentId),
    date: new Date().toISOString().split('T')[0],
    platformName: PLATFORM_INFO.name,
    platformAddress: PLATFORM_INFO.address,
    platformSiret: PLATFORM_INFO.siret,
    platformVat: PLATFORM_INFO.vat,
    contributorName: params.contributorName,
    contributorEmail: params.contributorEmail,
    contributorId: params.contributorId,
    taskTitle: params.taskTitle,
    filmTitle: params.filmTitle,
    amount: params.amount,
    currency: 'EUR',
    method: params.method,
    status: params.status,
    paidAt: params.paidAt ? params.paidAt.toISOString().split('T')[0] : undefined,
  }
}
