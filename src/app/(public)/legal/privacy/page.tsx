import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Politique de confidentialité et protection des données personnelles de la plateforme CINEGENY — conforme au RGPD.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-medium tracking-wider uppercase mb-6">
            Protection des Données
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Politique de Confidentialité
          </h1>
          <p className="text-white/40 text-sm">
            Dernière mise à jour : 22 février 2026
          </p>
        </div>

        {/* Content */}
        <div className="sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 md:p-12 space-y-10 shadow-2xl shadow-black/10">
          {/* Introduction */}
          <section>
            <p className="text-white/70 leading-relaxed">
              La présente Politique de Confidentialité décrit comment la société
              CINEGENY Studio (ci-après « CINEGENY », « nous », « notre ») collecte,
              utilise, stocke et protège vos données personnelles dans le cadre de
              l&apos;utilisation de la plateforme <strong className="text-[#E50914]">CINEGENY</strong>{' '}
              (ci-après « la Plateforme »), conformément au Règlement (UE) 2016/679 du
              27 avril 2016 relatif à la protection des données (RGPD) et à la loi n° 78-17
              du 6 janvier 1978 modifiée (loi Informatique et Libertés).
            </p>
          </section>

          {/* Article 1 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              1. Responsable du traitement
            </h2>
            <p className="text-white/70 leading-relaxed">
              Le responsable du traitement des données personnelles est :
            </p>
            <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/70 leading-relaxed">
                <strong className="text-white/90">CINEGENY Studio</strong><br />
                SAS au capital de 10 000 &euro;<br />
                RCS Paris : [à compléter]<br />
                Siège social : [adresse à compléter], 75000 Paris, France<br />
                Email : <span className="text-[#E50914]">dpo@cinegeny.studio</span><br />
                Téléphone : [à compléter]
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              2. Données collectées
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Nous collectons les catégories de données personnelles suivantes :
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2">2.1. Données d&apos;identité et de contact</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Nom, prénom, pseudonyme ;</li>
              <li>Adresse email ;</li>
              <li>Mot de passe (hashé et salé, jamais stocké en clair) ;</li>
              <li>Photo de profil (optionnelle) ;</li>
              <li>Pays de résidence et langue préférée.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.2. Données professionnelles</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Rôle sur la plateforme (Contributeur, Artiste, Scénariste, etc.) ;</li>
              <li>Compétences déclarées (outils maîtrisés, spécialités) ;</li>
              <li>Portfolio et liens externes (site web, réseaux sociaux) ;</li>
              <li>Langues parlées.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.3. Données de soumission</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Fichiers soumis (images, textes, vidéos, audio) ;</li>
              <li>Notes et commentaires associés aux soumissions ;</li>
              <li>Hash SHA-256 des fichiers (preuve d&apos;antériorité) ;</li>
              <li>Historique des tâches réalisées et scores obtenus.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.4. Données financières</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Identifiant Stripe Connect (pour les versements) ;</li>
              <li>Adresse Bitcoin Lightning (optionnelle) ;</li>
              <li>Historique des transactions en Lumens ;</li>
              <li>Informations de facturation.</li>
            </ul>
            <p className="text-white/50 text-sm mt-2 ml-4 italic">
              Note : les données bancaires complètes (numéro de carte, IBAN) sont traitées
              directement par nos prestataires de paiement (Stripe, BTCPay Server) et ne sont
              jamais stockées sur nos serveurs.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.5. Données de navigation et techniques</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Adresse IP ;</li>
              <li>Type et version du navigateur ;</li>
              <li>Système d&apos;exploitation ;</li>
              <li>Pages visitées, durée de consultation ;</li>
              <li>Données de cookies (voir notre{' '}
                <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                  Politique Cookies
                </Link>).</li>
            </ul>
          </section>

          {/* Article 3 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              3. Bases légales du traitement
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Chaque traitement de données repose sur une base légale conforme à l&apos;article 6
              du RGPD :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Purpose</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Base légale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4">Création et gestion du compte</td>
                    <td className="py-3">Contract performance (Art. 6.1.b)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Attribution et validation des tâches</td>
                    <td className="py-3">Contract performance (Art. 6.1.b)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Paiements et facturation</td>
                    <td className="py-3">Exécution du contrat (Art. 6.1.b) / Obligation légale (Art. 6.1.c)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Amélioration de la Plateforme et analytique</td>
                    <td className="py-3">Legitimate interest (Art. 6.1.f)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Envoi de communications marketing</td>
                    <td className="py-3">Consentement (Art. 6.1.a)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Cookies non essentiels</td>
                    <td className="py-3">Consentement (Art. 6.1.a)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Preuve d&apos;antériorité (SHA-256)</td>
                    <td className="py-3">Legitimate interest (Art. 6.1.f)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Prévention de la fraude</td>
                    <td className="py-3">Legitimate interest (Art. 6.1.f)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              4. Finalités du traitement
            </h2>
            <p className="text-white/70 leading-relaxed">
              Vos données personnelles sont traitées pour les finalités suivantes :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>Créer et gérer votre compte utilisateur sur la Plateforme ;</li>
              <li>Vous permettre de postuler, réaliser et soumettre des tâches ;</li>
              <li>Valider les soumissions via notre système hybride IA/humain ;</li>
              <li>Traiter les paiements et virements de rémunération ;</li>
              <li>Assurer le fonctionnement du système de gamification (points, niveaux, classement) ;</li>
              <li>Horodater et certifier l&apos;intégrité des soumissions (hash SHA-256) ;</li>
              <li>Vous envoyer des notifications liées au service (tâches disponibles, validations, paiements) ;</li>
              <li>Vous envoyer des communications marketing (avec votre consentement) ;</li>
              <li>Améliorer la Plateforme par l&apos;analyse statistique des usages ;</li>
              <li>Prévenir la fraude et garantir la sécurité du service ;</li>
              <li>Respecter nos obligations légales et réglementaires.</li>
            </ul>
          </section>

          {/* Article 5 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              5. Destinataires des données
            </h2>
            <p className="text-white/70 leading-relaxed">
              Vos données personnelles peuvent être communiquées aux catégories de
              destinataires suivantes, dans la stricte limite de ce qui est nécessaire :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>
                <strong className="text-white/90">Personnel habilité</strong> de CINEGENY Studio
                Pictures (équipe technique, modération, support client) ;
              </li>
              <li>
                <strong className="text-white/90">Sous-traitants techniques</strong> :
                hébergement (Vercel/Hetzner), base de données (PostgreSQL managé),
                paiement (Stripe, BTCPay Server), email transactionnel (Resend),
                analytique (Plausible Analytics) ;
              </li>
              <li>
                <strong className="text-white/90">Prestataires IA</strong> : Anthropic (Claude API)
                pour la validation automatisée des soumissions — seuls les contenus soumis
                et les critères de validation sont transmis, jamais vos données d&apos;identité ;
              </li>
              <li>
                <strong className="text-white/90">Autorités publiques</strong>, sur demande
                légalement fondée (administration fiscale, autorités judiciaires).
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Nous ne vendons jamais vos données personnelles à des tiers. Nous ne partageons
              aucune donnée à des fins publicitaires.
            </p>
          </section>

          {/* Article 6 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              6. Durée de conservation
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Vos données sont conservées pour la durée strictement nécessaire aux finalités
              poursuivies :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Type de données</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4">Données du compte</td>
                    <td className="py-3">Durée du compte + 3 ans après suppression</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Soumissions et hash SHA-256</td>
                    <td className="py-3">70 ans (durée des droits d&apos;auteur)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Données de facturation</td>
                    <td className="py-3">10 ans (obligation comptable légale)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Données de navigation / logs</td>
                    <td className="py-3">13 mois maximum</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Cookies analytiques</td>
                    <td className="py-3">13 mois maximum</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Communications marketing</td>
                    <td className="py-3">Jusqu&apos;au retrait du consentement + 3 ans</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/70 leading-relaxed mt-4">
              À l&apos;expiration de ces durées, vos données sont supprimées ou anonymisées de
              manière irréversible.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              7. Vos droits (Articles 15 à 22 du RGPD)
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants sur vos données
              personnelles :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-3 ml-4">
              <li>
                <strong className="text-white/90">Droit d&apos;accès (Art. 15)</strong> — Obtenir
                la confirmation que vos données sont traitées et en recevoir une copie.
              </li>
              <li>
                <strong className="text-white/90">Droit de rectification (Art. 16)</strong> — Faire
                corriger des données inexactes ou compléter des données incomplètes.
              </li>
              <li>
                <strong className="text-white/90">Droit à l&apos;effacement (Art. 17)</strong> — Demander
                la suppression de vos données, sous réserve des obligations légales de conservation.
              </li>
              <li>
                <strong className="text-white/90">Droit à la limitation (Art. 18)</strong> — Obtenir
                la limitation du traitement dans les cas prévus par le RGPD.
              </li>
              <li>
                <strong className="text-white/90">Droit à la portabilité (Art. 20)</strong> — Recevoir
                vos données dans un format structuré, couramment utilisé et lisible par machine
                (JSON/CSV), et les transmettre à un autre responsable de traitement.
              </li>
              <li>
                <strong className="text-white/90">Droit d&apos;opposition (Art. 21)</strong> — Vous
                opposer au traitement de vos données fondé sur l&apos;intérêt légitime, y compris
                le profilage.
              </li>
              <li>
                <strong className="text-white/90">Droit de retirer votre consentement</strong> — Retirer
                à tout moment votre consentement pour les traitements qui en dépendent, sans
                affecter la licéité du traitement antérieur.
              </li>
              <li>
                <strong className="text-white/90">Droit de définir des directives post-mortem</strong> — Définir
                des directives relatives au sort de vos données après votre décès (loi
                Informatique et Libertés, Art. 85).
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl border border-[#E50914]/20 bg-[#E50914]/5">
              <p className="text-white/80 leading-relaxed">
                <strong className="text-[#E50914]">Comment exercer vos droits ?</strong><br />
                Envoyez votre demande accompagnée d&apos;un justificatif d&apos;identité à :<br />
                <span className="text-[#E50914]">dpo@cinegeny.studio</span><br />
                Nous nous engageons à répondre dans un délai de 30 jours.
              </p>
            </div>

            <p className="text-white/70 leading-relaxed mt-4">
              En cas de réponse insatisfaisante, vous avez le droit d&apos;introduire une
              réclamation auprès de la Commission Nationale de l&apos;Informatique et des
              Libertés (CNIL) :{' '}
              <span className="text-[#E50914]">www.cnil.fr</span>.
            </p>
          </section>

          {/* Article 8 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              8. Délégué à la Protection des Données (DPO)
            </h2>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio a désigné un Délégué à la Protection des Données que
              vous pouvez contacter pour toute question relative à la protection de vos données
              personnelles :
            </p>
            <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/70 leading-relaxed">
                <strong className="text-white/90">Délégué à la Protection des Données</strong><br />
                CINEGENY Studio<br />
                Email : <span className="text-[#E50914]">dpo@cinegeny.studio</span><br />
                Courrier : DPO — CINEGENY Studio, [adresse à compléter], 75000 Paris
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              9. Cookies
            </h2>
            <p className="text-white/70 leading-relaxed">
              La Plateforme utilise des cookies pour assurer son bon fonctionnement et
              améliorer votre expérience. Pour une information détaillée sur les cookies
              utilisés, leur finalité et la gestion de vos préférences, veuillez consulter
              notre{' '}
              <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Politique Cookies
              </Link>.
            </p>
          </section>

          {/* Article 10 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              10. Transferts de données hors Union européenne
            </h2>
            <p className="text-white/70 leading-relaxed">
              Certains de nos sous-traitants peuvent être situés en dehors de l&apos;Union
              européenne. Dans ce cas, nous nous assurons que le transfert de données est
              encadré par des garanties appropriées conformément au Chapitre V du RGPD :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>
                <strong className="text-white/90">Décision d&apos;adéquation</strong> : lorsque le pays
                de destination bénéficie d&apos;une décision d&apos;adéquation de la Commission
                européenne (ex. : EU-US Data Privacy Framework) ;
              </li>
              <li>
                <strong className="text-white/90">Clauses contractuelles types (CCT)</strong> : nous
                utilisons les clauses contractuelles types approuvées par la Commission
                européenne (Décision 2021/914) ;
              </li>
              <li>
                <strong className="text-white/90">Mesures supplémentaires</strong> : chiffrement des
                données en transit (TLS 1.3) et au repos (AES-256), minimisation des données
                transférées.
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Vous pouvez obtenir une copie des garanties mises en place en contactant notre
              DPO à l&apos;adresse <span className="text-[#E50914]">dpo@cinegeny.studio</span>.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              11. Sécurité des données
            </h2>
            <p className="text-white/70 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
              pour protéger vos données personnelles contre tout accès non autorisé,
              modification, divulgation ou destruction :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li>Chiffrement des données en transit (HTTPS / TLS 1.3) et au repos (AES-256) ;</li>
              <li>Hashage des mots de passe avec bcrypt (coût 12) ;</li>
              <li>Limitation d&apos;accès aux données selon le principe du moindre privilège ;</li>
              <li>Journalisation des accès aux données sensibles ;</li>
              <li>Sauvegardes chiffrées quotidiennes ;</li>
              <li>Tests de sécurité réguliers.</li>
            </ul>
          </section>

          {/* Article 12 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              12. Modification de la politique
            </h2>
            <p className="text-white/70 leading-relaxed">
              Nous nous réservons le droit de modifier la présente Politique de Confidentialité
              à tout moment. En cas de modification substantielle, nous vous en informerons par
              email et/ou par notification sur la Plateforme au moins trente (30) jours avant
              l&apos;entrée en vigueur des changements.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              La date de dernière mise à jour est indiquée en haut de ce document.
              Nous vous invitons à consulter régulièrement cette page.
            </p>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs leading-relaxed italic">
              Ce document est un modèle indicatif et ne constitue pas un conseil juridique.
              Il est recommandé de faire valider cette politique par un avocat spécialisé en
              protection des données avant toute mise en production.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/legal/terms" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Conditions Générales d&apos;Utilisation
          </Link>
          <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Politique Cookies
          </Link>
        </div>
      </div>
    </div>
  )
}
