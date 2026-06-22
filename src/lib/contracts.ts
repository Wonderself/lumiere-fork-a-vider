/**
 * Auto-generated contracts for film creators & screenwriters
 * Markdown template with variable substitution
 */

export function generateFilmContract(params: {
  creatorName: string
  filmTitle: string
  revenueSharePct: number
  exclusivity: boolean
  exclusivityBonus: number
  signDate: string
}): string {
  const { creatorName, filmTitle, revenueSharePct, exclusivity, exclusivityBonus, signDate } = params
  const totalShare = exclusivity ? revenueSharePct + exclusivityBonus : revenueSharePct

  return `# CONTRAT DE DISTRIBUTION — CINEGENY STUDIO

**Date :** ${signDate}

---

## ENTRE LES PARTIES

**Le Créateur :** ${creatorName}

**La Plateforme :** CINEGENY Studio SAS (ci-après "LB")

---

## ARTICLE 1 — OBJET

Le présent contrat porte sur la distribution du film **"${filmTitle}"** (ci-après "l'Œuvre") sur la plateforme CINEGENY.

## ARTICLE 2 — DROITS CONCÉDÉS

Le Créateur accorde à LB le droit non-exclusif${exclusivity ? ' **EXCLUSIF**' : ''} de diffuser l'Œuvre sur sa plateforme de streaming pour une durée de **12 mois renouvelable**.

${exclusivity ? `> **Clause d'exclusivité active** : Le Créateur s'engage à ne pas diffuser l'Œuvre sur d'autres plateformes de streaming pendant la durée du contrat. En contrepartie, un bonus de +${exclusivityBonus}% est appliqué au partage de revenus.\n` : ''}

## ARTICLE 3 — RÉMUNÉRATION

- **Part du Créateur :** ${totalShare}% des revenus générés par les vues de l'Œuvre
${exclusivity ? `  - Part de base : ${revenueSharePct}% + Bonus exclusivité : ${exclusivityBonus}%\n` : ''}
- **Part Plateforme :** ${100 - totalShare}%
- **Calcul :** Ratio = (vues du film / vues totales plateforme) × pool mensuel de revenus
- **Paiement :** Virement mensuel, dans les 15 jours suivant la fin de chaque mois calendaire
- **Minimum :** Aucun paiement si le montant est inférieur à 10€ (reporté au mois suivant)

## ARTICLE 4 — PROMOTION

Le Créateur s'engage à :
- Partager le lien de l'Œuvre sur ses réseaux sociaux **au minimum 1 fois par mois**
- Mentionner "Disponible sur CINEGENY" dans ses communications relatives à l'Œuvre
- Ne pas dénigrer la plateforme publiquement

## ARTICLE 5 — GARANTIES DU CRÉATEUR

Le Créateur garantit :
- Être le titulaire légitime des droits sur l'Œuvre
- Que l'Œuvre ne viole aucun droit de tiers (droits d'auteur, droit à l'image, etc.)
- Que l'Œuvre ne contient aucun contenu illicite

## ARTICLE 6 — RÉSILIATION

- Résiliation par le Créateur : préavis de **30 jours**, l'Œuvre reste disponible pendant le préavis
- Résiliation par LB : en cas de violation du contrat, avec préavis de **15 jours**
- En cas de résiliation, les revenus dus restent payables

## ARTICLE 7 — DONNÉES & TRANSPARENCE

LB s'engage à fournir au Créateur un accès en temps réel à :
- Nombre de vues (total et par mois)
- Revenus générés et à venir
- Position dans le catalogue

## ARTICLE 8 — LOI APPLICABLE

Le présent contrat est régi par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.

---

**Signature électronique :** En cliquant "J'accepte", le Créateur reconnaît avoir lu et accepté l'ensemble des termes du présent contrat.

*Document généré automatiquement par CINEGENY Studio le ${signDate}.*
`
}

// ─── Screenplay Deals ───────────────────────────────────────

/**
 * Auto-generates a deal contract when a screenplay is accepted for production.
 * The deal covers revenue sharing, IP rights, credits, and modification terms.
 */
export function generateScreenplayDeal(params: {
  writerName: string
  screenplayTitle: string
  genre: string
  revenueSharePct: number
  modificationTolerancePct: number
  signDate: string
  creditType?: 'sole' | 'co-written' | 'story-by'
}): string {
  const {
    writerName, screenplayTitle, genre, revenueSharePct,
    modificationTolerancePct, signDate, creditType = 'sole',
  } = params

  const creditLabel = creditType === 'sole'
    ? `Scénario de ${writerName}`
    : creditType === 'co-written'
      ? `Scénario co-écrit par ${writerName}`
      : `D'après une histoire de ${writerName}`

  return `# CONTRAT D'ACQUISITION DE SCÉNARIO — CINEGENY STUDIO

**Date :** ${signDate}
**Référence :** DEAL-${Date.now().toString(36).toUpperCase()}

---

## ENTRE LES PARTIES

**L'Auteur :** ${writerName}

**Le Producteur :** CINEGENY Studio SAS (ci-après "LB")

---

## ARTICLE 1 — OBJET

Le présent contrat porte sur l'acquisition des droits d'adaptation et de production du scénario **"${screenplayTitle}"** (genre : ${genre}), ci-après "le Scénario", en vue de sa production sous forme de film.

## ARTICLE 2 — DROITS CÉDÉS

L'Auteur cède à LB les droits suivants :
- **Droit d'adaptation cinématographique** : production d'un film basé sur le Scénario
- **Droit de distribution mondiale** : tous supports (salles, streaming, VOD, TV)
- **Droit de promotion** : utilisation du titre, synopsis, extraits
- **Durée** : 70 ans à compter de la date de signature (durée légale)

L'Auteur conserve :
- Le droit moral inaliénable sur son œuvre
- Le droit de publier le scénario sous forme littéraire après la sortie du film
- Le crédit au générique garanti

## ARTICLE 3 — RÉMUNÉRATION

### 3.1 — Part des revenus
- **Part Auteur :** ${revenueSharePct}% de tous les revenus nets du film
- **Sources couvertes :** Streaming, VOD, ventes physiques, licences TV, merchandising
- **Calcul :** (Revenus bruts − frais de distribution plateforme) × ${revenueSharePct}%

### 3.2 — Bonus éventuels
- **Bonus sélection festival** : +500€ si sélectionné dans un festival reconnu (Cannes, Berlin, Venice, Toronto, Sundance)
- **Bonus 100K vues** : +200€ si le film dépasse 100 000 vues sur la plateforme

### 3.3 — Paiement
- Paiement trimestriel, dans les 30 jours suivant la fin du trimestre
- Minimum de versement : 25€ (en dessous, reporté au trimestre suivant)
- Virement bancaire ou crypto (au choix de l'Auteur)

## ARTICLE 4 — CRÉDIT AU GÉNÉRIQUE

Le film portera la mention : **"${creditLabel}"**
- Visible au générique d'ouverture et/ou de fermeture
- Mentionné dans tout matériel promotionnel officiel
- Format minimum : même taille que le nom du réalisateur

## ARTICLE 5 — MODIFICATIONS DU SCÉNARIO

- LB est autorisé à modifier le Scénario dans la limite de **${modificationTolerancePct}%** du contenu original
- Au-delà de ce seuil, l'accord écrit de l'Auteur est requis
- L'Auteur sera consulté sur les modifications majeures (dénouement, personnages principaux)
- Si les modifications dépassent 50%, le crédit peut être changé en "D'après une histoire de"

## ARTICLE 6 — GARANTIES DE L'AUTEUR

L'Auteur garantit :
- Être l'unique auteur et titulaire des droits sur le Scénario
- Que le Scénario est une œuvre originale, ne violant aucun droit de tiers
- N'avoir cédé les droits d'adaptation à aucun autre producteur
- Que le Scénario ne contient aucun contenu diffamatoire ou illicite

## ARTICLE 7 — RÉSILIATION

- Si LB n'entre pas en production dans les **24 mois**, les droits reviennent à l'Auteur
- Résiliation pour faute : préavis de 30 jours, mise en demeure écrite
- En cas de résiliation, les revenus acquis restent dus à l'Auteur

## ARTICLE 8 — LOI APPLICABLE

Le présent contrat est régi par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.

---

**Signature électronique :** En acceptant ce deal, l'Auteur reconnaît avoir lu et accepté l'ensemble des termes du présent contrat.

*Contrat généré automatiquement par CINEGENY Studio le ${signDate}.*
`
}
