import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'Conditions générales d\'utilisation de la plateforme CINEGENY — micro-tâches collaboratives pour la production de films IA.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-medium tracking-wider uppercase mb-6">
            Document Juridique
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-white/40 text-sm">
            Dernière mise à jour : 22 février 2026
          </p>
        </div>

        {/* Content */}
        <div className="sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 md:p-12 space-y-10 shadow-2xl shadow-black/10">
          {/* Préambule */}
          <section>
            <p className="text-white/70 leading-relaxed">
              Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») régissent
              l&apos;accès et l&apos;utilisation de la plateforme <strong className="text-[#E50914]">CINEGENY</strong> (ci-après
              « la Plateforme »), éditée par la société CINEGENY Studio, SAS au capital
              de 10 000 €, immatriculée au RCS de Paris sous le numéro [à compléter], dont le
              siège social est situé à [adresse à compléter], Paris, France.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              Toute inscription ou utilisation de la Plateforme implique l&apos;acceptation sans
              réserve des présentes CGU. Si vous n&apos;acceptez pas ces conditions, veuillez ne
              pas utiliser la Plateforme.
            </p>
          </section>

          {/* Article 1 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 1 — Objet du service
            </h2>
            <p className="text-white/70 leading-relaxed">
              La Plateforme CINEGENY est un service en ligne de micro-tâches collaboratives
              dédié à la production de films générés par intelligence artificielle. Elle met en
              relation des contributeurs (artistes, techniciens, créatifs) avec des projets
              cinématographiques nécessitant des interventions humaines ponctuelles et
              spécialisées.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Les services proposés incluent notamment :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li>La mise à disposition d&apos;un catalogue de films en cours de production ;</li>
              <li>La publication et l&apos;attribution de micro-tâches créatives (écriture, storyboard, direction artistique, doublage, etc.) ;</li>
              <li>Un système de validation hybride (IA + humain) des soumissions ;</li>
              <li>Un système de rémunération et de gamification pour les contributeurs ;</li>
              <li>Un espace de visionnage pour les films produits.</li>
            </ul>
          </section>

          {/* Article 2 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 2 — Inscription et comptes utilisateurs
            </h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">2.1. Conditions d&apos;inscription</h3>
            <p className="text-white/70 leading-relaxed">
              L&apos;inscription est ouverte à toute personne physique âgée d&apos;au moins 16 ans ou
              à toute personne morale dûment constituée. L&apos;utilisateur s&apos;engage à fournir
              des informations exactes, complètes et à jour lors de son inscription.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.2. Types de comptes</h3>
            <p className="text-white/70 leading-relaxed">
              La Plateforme propose plusieurs rôles : Contributeur, Artiste, Cascadeur numérique,
              Scénariste, Spectateur et Administrateur. Le rôle détermine les permissions et
              fonctionnalités accessibles.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.3. Niveaux de progression</h3>
            <p className="text-white/70 leading-relaxed">
              Les contributeurs progressent à travers quatre niveaux : Rookie, Pro, Expert et VIP.
              La progression est automatique et basée sur le nombre de points accumulés et de
              tâches validées. Chaque niveau débloque l&apos;accès à des tâches de difficulté
              supérieure et offre des avantages spécifiques.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.4. Sécurité du compte</h3>
            <p className="text-white/70 leading-relaxed">
              L&apos;utilisateur est seul responsable de la confidentialité de ses identifiants de
              connexion. Toute activité réalisée depuis son compte est réputée effectuée par lui.
              En cas de suspicion d&apos;utilisation frauduleuse, l&apos;utilisateur doit en informer
              CINEGENY sans délai à l&apos;adresse{' '}
              <span className="text-[#E50914]">security@cinegeny.studio</span>.
            </p>
          </section>

          {/* Article 3 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 3 — Système de crédits « Lumens »
            </h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">3.1. Définition</h3>
            <p className="text-white/70 leading-relaxed">
              Le « Lumen » est l&apos;unité de crédit interne de la Plateforme. Un (1) Lumen
              équivaut à un (1) euro. Les Lumens sont utilisés pour la rémunération des tâches
              et les transactions internes à la Plateforme.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.2. Nature des Lumens</h3>
            <p className="text-white/70 leading-relaxed">
              Les Lumens sont des crédits numériques non spéculatifs. Ils ne constituent pas une
              monnaie virtuelle, une crypto-monnaie ou un instrument financier. Leur valeur est
              fixe et indexée sur l&apos;euro. Les Lumens ne peuvent pas être échangés entre
              utilisateurs, revendus sur des marchés tiers ou utilisés à des fins spéculatives.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.3. Acquisition et utilisation</h3>
            <p className="text-white/70 leading-relaxed">
              Les Lumens sont crédités automatiquement sur le compte de l&apos;utilisateur lors de
              la validation d&apos;une tâche. Les producteurs peuvent acheter des Lumens via les
              moyens de paiement acceptés (carte bancaire, virement, Bitcoin Lightning).
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.4. Remboursement</h3>
            <p className="text-white/70 leading-relaxed">
              Conformément aux articles L. 221-18 et suivants du Code de la consommation,
              l&apos;utilisateur dispose d&apos;un délai de quatorze (14) jours à compter de l&apos;achat
              de Lumens pour exercer son droit de rétractation et obtenir un remboursement
              intégral, à condition que les Lumens n&apos;aient pas été utilisés. La demande de
              remboursement doit être adressée à{' '}
              <span className="text-[#E50914]">billing@cinegeny.studio</span>.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.5. Conversion en euros</h3>
            <p className="text-white/70 leading-relaxed">
              Les contributeurs peuvent demander le retrait de leurs Lumens gagnés vers leur
              compte bancaire ou portefeuille Bitcoin Lightning, sous réserve d&apos;un solde
              minimum de 20 Lumens. Les transferts sont effectués dans un délai de 7 jours
              ouvrés pour les virements bancaires et quasi instantanément pour les paiements
              Lightning.
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 4 — Propriété intellectuelle
            </h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">4.1. Contenus de la Plateforme</h3>
            <p className="text-white/70 leading-relaxed">
              L&apos;ensemble des éléments constituant la Plateforme (design, code, textes, logos,
              marques) est la propriété exclusive de CINEGENY Studio et est protégé
              par le droit de la propriété intellectuelle français et international.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">4.2. Soumissions des contributeurs</h3>
            <p className="text-white/70 leading-relaxed">
              En soumettant un contenu (texte, image, vidéo, audio ou tout autre fichier) dans
              le cadre d&apos;une tâche, le contributeur concède à CINEGENY Studio une
              licence mondiale, non exclusive, cessible et sous-licenciable pour une durée de
              70 ans, aux fins d&apos;intégration dans le film concerné et de son exploitation
              commerciale sur tous supports.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Le contributeur conserve le droit moral sur ses créations originales et sera
              crédité au générique du film selon les modalités définies pour chaque projet.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">4.3. Preuve d&apos;antériorité et horodatage</h3>
            <p className="text-white/70 leading-relaxed">
              Chaque soumission est automatiquement horodatée et associée à un hash SHA-256
              de son contenu. Ce mécanisme constitue une preuve d&apos;antériorité permettant de
              certifier la date de dépôt et l&apos;intégrité du fichier soumis. Le contributeur
              peut à tout moment vérifier l&apos;empreinte numérique de ses soumissions depuis
              son espace personnel.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">4.4. Contenus générés par IA</h3>
            <p className="text-white/70 leading-relaxed">
              Les contenus générés par intelligence artificielle dans le cadre de la production
              des films sont la propriété de CINEGENY Studio. Le contributeur qui
              intervient sur un contenu IA (retouche, correction, adaptation) acquiert un droit
              de co-création sur sa contribution spécifique.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 5 — Obligations des utilisateurs
            </h2>
            <p className="text-white/70 leading-relaxed">
              L&apos;utilisateur s&apos;engage à :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>Respecter les présentes CGU ainsi que la législation française en vigueur ;</li>
              <li>Ne pas usurper l&apos;identité d&apos;un tiers ni fournir de fausses informations ;</li>
              <li>Ne pas soumettre de contenus illicites, diffamatoires, discriminatoires, pornographiques ou portant atteinte aux droits de tiers ;</li>
              <li>Ne pas utiliser de bots, scripts automatisés ou tout autre moyen visant à manipuler le système de tâches ou de notation ;</li>
              <li>Respecter les délais impartis pour la réalisation des tâches (48 heures par défaut) ;</li>
              <li>Soumettre un travail original et de qualité conforme aux instructions de la tâche ;</li>
              <li>Ne pas tenter de contourner le système de validation IA ou humain ;</li>
              <li>Respecter la confidentialité des projets en cours de production.</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Tout manquement à ces obligations peut entraîner la suspension ou la suppression
              du compte, la confiscation des Lumens non retirés et, le cas échéant, des
              poursuites judiciaires.
            </p>
          </section>

          {/* Article 6 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 6 — Responsabilité de la plateforme
            </h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">6.1. Obligation de moyens</h3>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio s&apos;engage à mettre en œuvre tous les moyens
              raisonnables pour assurer le bon fonctionnement et la disponibilité de la
              Plateforme. Cette obligation est une obligation de moyens et non de résultat.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">6.2. Limitations</h3>
            <p className="text-white/70 leading-relaxed">
              La Plateforme ne saurait être tenue responsable :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li>Des interruptions temporaires du service pour maintenance ou mise à jour ;</li>
              <li>Des dommages directs ou indirects résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le service ;</li>
              <li>De la qualité des soumissions effectuées par les contributeurs ;</li>
              <li>Des décisions de validation ou de rejet prises par le système IA, sous réserve du droit de contestation de l&apos;utilisateur ;</li>
              <li>De tout dysfonctionnement lié à un cas de force majeure.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">6.3. Modération</h3>
            <p className="text-white/70 leading-relaxed">
              La Plateforme se réserve le droit de modérer, modifier ou supprimer tout contenu
              contraire aux présentes CGU ou à la loi, sans préavis ni indemnité.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 7 — Paiements et rémunération
            </h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">7.1. Rémunération des tâches</h3>
            <p className="text-white/70 leading-relaxed">
              Chaque tâche publiée sur la Plateforme indique une rémunération en Lumens. Le
              montant est fixé par le producteur du film et n&apos;est dû au contributeur
              qu&apos;après validation définitive de sa soumission.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">7.2. Moyens de paiement acceptés</h3>
            <p className="text-white/70 leading-relaxed">
              La Plateforme accepte les paiements par carte bancaire (via Stripe), virement
              SEPA et Bitcoin via le réseau Lightning (via BTCPay Server). Les frais de
              transaction éventuels sont à la charge de l&apos;utilisateur.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">7.3. Fiscalité</h3>
            <p className="text-white/70 leading-relaxed">
              Les revenus perçus via la Plateforme sont imposables conformément à la
              législation fiscale applicable au pays de résidence du contributeur. CINEGENY
              Brothers Pictures délivre les documents fiscaux nécessaires (récapitulatif annuel)
              pour les contributeurs résidant en France. Le contributeur reste seul responsable
              de ses déclarations fiscales.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">7.4. Commission</h3>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio prélève une commission de 15 % sur chaque transaction
              entre producteur et contributeur. Cette commission couvre les frais de
              fonctionnement de la Plateforme, la maintenance du système de validation IA et
              les coûts d&apos;infrastructure.
            </p>
          </section>

          {/* Article 8 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 8 — Données personnelles
            </h2>
            <p className="text-white/70 leading-relaxed">
              La Plateforme collecte et traite des données personnelles dans le respect du
              Règlement Général sur la Protection des Données (RGPD) et de la loi Informatique
              et Libertés. Pour connaître en détail les conditions de traitement de vos données,
              veuillez consulter notre{' '}
              <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          {/* Article 9 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 9 — Modification des CGU
            </h2>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio se réserve le droit de modifier les présentes CGU à
              tout moment. Les utilisateurs seront informés de toute modification substantielle
              par email et/ou par notification sur la Plateforme au moins trente (30) jours avant
              leur entrée en vigueur.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              L&apos;utilisation continue de la Plateforme après l&apos;entrée en vigueur des
              modifications vaut acceptation des nouvelles CGU. En cas de désaccord,
              l&apos;utilisateur peut supprimer son compte et demander le retrait de ses Lumens
              restants dans les conditions prévues à l&apos;article 3.
            </p>
          </section>

          {/* Article 10 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 10 — Résiliation
            </h2>
            <p className="text-white/70 leading-relaxed">
              L&apos;utilisateur peut résilier son compte à tout moment depuis son espace
              personnel ou en contactant le support à{' '}
              <span className="text-[#E50914]">support@cinegeny.studio</span>. La résiliation
              entraîne la suppression du compte dans un délai de 30 jours, sous réserve de
              la conversion des Lumens restants.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              CINEGENY Studio peut suspendre ou résilier un compte en cas de
              manquement aux présentes CGU, après mise en demeure restée infructueuse pendant
              15 jours, sauf en cas de manquement grave justifiant une suspension immédiate.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 11 — Droit applicable et juridiction
            </h2>
            <p className="text-white/70 leading-relaxed">
              Les présentes CGU sont régies par le droit français. Tout litige relatif à leur
              interprétation ou leur exécution sera soumis à la compétence exclusive des
              tribunaux de Paris, France, sous réserve des règles impératives de compétence
              territoriale applicables aux consommateurs résidant dans l&apos;Union européenne.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Conformément aux articles L. 611-1 et suivants du Code de la consommation,
              en cas de litige non résolu, le consommateur peut recourir gratuitement au
              médiateur de la consommation dont relève CINEGENY Studio. Les
              coordonnées du médiateur seront communiquées sur demande.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              Article 12 — Contact
            </h2>
            <p className="text-white/70 leading-relaxed">
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
            </p>
            <ul className="text-white/70 leading-relaxed mt-3 space-y-1 ml-4">
              <li>Par email : <span className="text-[#E50914]">legal@cinegeny.studio</span></li>
              <li>Par courrier : CINEGENY Studio — [adresse à compléter], 75000 Paris, France</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/[0.06]">
            <p className="text-white/25 text-xs leading-relaxed italic">
              Ce document est un modèle indicatif et ne constitue pas un conseil juridique.
              Il est recommandé de faire valider ces conditions par un avocat spécialisé
              avant toute mise en production.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors duration-300">
            Politique de Confidentialité
          </Link>
          <span className="text-white/10">|</span>
          <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors duration-300">
            Politique Cookies
          </Link>
        </div>
      </div>
    </div>
  )
}
