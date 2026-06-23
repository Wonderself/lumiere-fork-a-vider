import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique Cookies',
  description: 'Politique d\'utilisation des cookies de la plateforme CINEGENY — gestion de vos préférences et informations sur les traceurs utilisés.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-medium tracking-wider uppercase mb-6">
            Cookies & Traceurs
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Politique Cookies
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
              La présente Politique Cookies explique comment la plateforme{' '}
              <strong className="text-[#E50914]">CINEGENY</strong>, éditée par CINEGENY
              Studio, utilise des cookies et technologies similaires lorsque vous naviguez
              sur notre site. Elle complète notre{' '}
              <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Politique de Confidentialité
              </Link>{' '}
              et est conforme aux recommandations de la CNIL et au RGPD.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              1. Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <p className="text-white/70 leading-relaxed">
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur,
              tablette, smartphone) lors de la consultation d&apos;un site web. Il permet au site
              de mémoriser des informations sur votre visite (langue préférée, identifiants
              de session, préférences d&apos;affichage, etc.) afin de faciliter votre navigation
              ultérieure.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Les cookies ne contiennent pas de virus et ne peuvent pas accéder aux autres
              données stockées sur votre terminal. Ils sont soit « propriétaires » (déposés
              par notre site), soit « tiers » (déposés par nos partenaires).
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              2. Cookies strictement nécessaires
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Ces cookies sont indispensables au fonctionnement de la Plateforme. Ils ne
              peuvent pas être désactivés. Ils ne stockent aucune donnée personnelle
              identifiable et sont exemptés de consentement conformément à l&apos;article 82
              de la loi Informatique et Libertés.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Finalité</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">next-auth.session-token</td>
                    <td className="py-3 pr-4">Authentification et maintien de la session utilisateur</td>
                    <td className="py-3">Session (30 jours)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">next-auth.csrf-token</td>
                    <td className="py-3 pr-4">Protection contre les attaques CSRF</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">next-auth.callback-url</td>
                    <td className="py-3 pr-4">Redirection après authentification</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">cookie-consent</td>
                    <td className="py-3 pr-4">Mémorisation de votre choix concernant les cookies</td>
                    <td className="py-3">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              3. Cookies analytiques
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Ces cookies nous permettent de mesurer l&apos;audience de la Plateforme et de
              comprendre comment les utilisateurs interagissent avec nos services. Les
              données collectées sont anonymisées et agrégées. Ces cookies ne sont déposés
              qu&apos;avec votre consentement.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Fournisseur</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Finalité</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">plausible_*</td>
                    <td className="py-3 pr-4">Plausible Analytics</td>
                    <td className="py-3 pr-4">Mesure d&apos;audience respectueuse de la vie privée (sans données personnelles)</td>
                    <td className="py-3">13 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/50 text-sm mt-3 italic">
              Note : Nous utilisons Plausible Analytics, un outil d&apos;analyse respectueux de
              la vie privée qui ne dépose pas de cookies par défaut et ne trace pas les
              utilisateurs entre les sites. L&apos;utilisation de cookies analytiques est donc
              minimale.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              4. Cookies de personnalisation
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Ces cookies permettent d&apos;adapter la Plateforme à vos préférences et
              d&apos;améliorer votre expérience utilisateur. Ils ne sont déposés qu&apos;avec votre
              consentement.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Finalité</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">locale</td>
                    <td className="py-3 pr-4">Mémorisation de la langue d&apos;interface choisie</td>
                    <td className="py-3">12 mois</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">theme</td>
                    <td className="py-3 pr-4">Préférence de thème visuel (sombre/clair)</td>
                    <td className="py-3">12 mois</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">task-filters</td>
                    <td className="py-3 pr-4">Mémorisation des filtres de recherche de tâches</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">video-quality</td>
                    <td className="py-3 pr-4">Préférence de qualité vidéo pour le lecteur</td>
                    <td className="py-3">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              5. Gestion de vos préférences
            </h2>
            <p className="text-white/70 leading-relaxed">
              Vous pouvez à tout moment modifier vos préférences en matière de cookies :
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">5.1. Via notre bannière cookies</h3>
            <p className="text-white/70 leading-relaxed">
              Lors de votre première visite, une bannière vous permet d&apos;accepter ou de
              refuser les cookies non essentiels. Vous pouvez modifier ce choix à tout moment
              en supprimant le cookie <code className="text-[#E50914] text-xs bg-white/5 px-1.5 py-0.5 rounded">cookie-consent</code>{' '}
              de votre navigateur, ce qui déclenchera un nouvel affichage de la bannière.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">5.2. Via les paramètres de votre navigateur</h3>
            <p className="text-white/70 leading-relaxed">
              Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies.
              Voici les liens vers les instructions des navigateurs les plus courants :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li><strong className="text-white/90">Chrome</strong> : Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
              <li><strong className="text-white/90">Firefox</strong> : Paramètres &gt; Vie privée et sécurité &gt; Cookies</li>
              <li><strong className="text-white/90">Safari</strong> : Préférences &gt; Confidentialité &gt; Cookies</li>
              <li><strong className="text-white/90">Edge</strong> : Paramètres &gt; Cookies et autorisations de site</li>
            </ul>
            <p className="text-white/50 text-sm mt-3 italic">
              Attention : la désactivation de certains cookies peut affecter le fonctionnement
              de la Plateforme, notamment l&apos;authentification et la navigation.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">5.3. Opt-out analytique</h3>
            <p className="text-white/70 leading-relaxed">
              Vous pouvez désactiver le suivi analytique en activant la fonctionnalité
              « Do Not Track » (DNT) de votre navigateur. Plausible Analytics respecte
              nativement ce signal.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              6. Durée de conservation des cookies
            </h2>
            <p className="text-white/70 leading-relaxed">
              Conformément aux recommandations de la CNIL, les cookies et traceurs ont les
              durées de vie suivantes :
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>
                <strong className="text-white/90">Cookies de session</strong> : supprimés
                automatiquement à la fermeture du navigateur ;
              </li>
              <li>
                <strong className="text-white/90">Cookies persistants</strong> : 12 mois maximum
                à compter de leur dépôt ;
              </li>
              <li>
                <strong className="text-white/90">Consentement cookies</strong> : votre choix est
                conservé pendant 12 mois, au-delà desquels une nouvelle demande de
                consentement vous sera présentée ;
              </li>
              <li>
                <strong className="text-white/90">Cookies analytiques</strong> : 13 mois maximum
                conformément aux recommandations de la CNIL.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              7. Contact
            </h2>
            <p className="text-white/70 leading-relaxed">
              Pour toute question relative à notre utilisation des cookies, vous pouvez
              contacter notre Délégué à la Protection des Données à l&apos;adresse{' '}
              <span className="text-[#E50914]">dpo@cinegeny.studio</span>.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Pour en savoir plus sur la protection de vos données personnelles, consultez
              notre{' '}
              <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs leading-relaxed italic">
              Ce document est un modèle indicatif et ne constitue pas un conseil juridique.
              Il est recommandé de faire valider cette politique par un professionnel
              avant toute mise en production.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/legal/terms" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Conditions Générales d&apos;Utilisation
          </Link>
          <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Politique de Confidentialité
          </Link>
        </div>
      </div>
    </div>
  )
}
