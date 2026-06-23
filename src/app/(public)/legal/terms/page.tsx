import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for the CINEGENY platform — collaborative micro-tasks for AI film production.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-medium tracking-wider uppercase mb-6">
            Legal Document
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Terms of Service
          </h1>
          <p className="text-white/40 text-sm">
            Last updated: February 22, 2026
          </p>
        </div>

        {/* Content */}
        <div className="sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 md:p-12 space-y-10 shadow-2xl shadow-black/10">
          {/* Preamble */}
          <section>
            <p className="text-white/70 leading-relaxed">
              These Terms of Service (the &quot;Terms&quot;) govern access to and use of the{' '}
              <strong className="text-[#E50914]">CINEGENY</strong> platform (the &quot;Platform&quot;),
              operated by CINEGENY Studio, a company registered in Paris, France
              (registration number [to be completed]), with its registered office at
              [address to be completed], Paris, France.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              Any registration or use of the Platform implies unconditional acceptance of
              these Terms. If you do not accept them, please do not use the Platform.
            </p>
          </section>

          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 1 — Purpose of the service</h2>
            <p className="text-white/70 leading-relaxed">
              The CINEGENY Platform is an online collaborative micro-task service dedicated to
              the production of films generated with artificial intelligence. It connects
              contributors (artists, technicians, creatives) with film projects that require
              targeted, specialized human input.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">The services offered include, in particular:</p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li>Access to a catalog of films in production;</li>
              <li>Publishing and assigning creative micro-tasks (writing, storyboard, art direction, dubbing, etc.);</li>
              <li>A hybrid validation system (AI + human) for submissions;</li>
              <li>A compensation and gamification system for contributors;</li>
              <li>A viewing area for the films produced.</li>
            </ul>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 2 — Registration and user accounts</h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">2.1. Registration conditions</h3>
            <p className="text-white/70 leading-relaxed">
              Registration is open to any individual at least 16 years old, or to any duly
              incorporated legal entity. The user agrees to provide accurate, complete and
              up-to-date information when registering.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.2. Account capabilities</h3>
            <p className="text-white/70 leading-relaxed">
              Every account is a single, free account. Anyone can watch and vote, then unlock
              additional capabilities at any time — investing, paid missions, missions for
              shares, submitting a screenplay, acting, or producing a film. Administrators have
              dedicated permissions to operate the Platform.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.3. Progression levels</h3>
            <p className="text-white/70 leading-relaxed">
              Contributors progress through four levels: Rookie, Pro, Expert and VIP.
              Progression is automatic and based on points accumulated and tasks validated.
              Each level unlocks access to higher-difficulty tasks and offers specific benefits.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.4. Account security</h3>
            <p className="text-white/70 leading-relaxed">
              The user is solely responsible for keeping their login credentials confidential.
              Any activity carried out from their account is deemed performed by them. If they
              suspect fraudulent use, the user must notify CINEGENY without delay at{' '}
              <span className="text-[#E50914]">security@cinegeny.studio</span>.
            </p>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 3 — The &quot;Lumens&quot; credit system</h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">3.1. Definition</h3>
            <p className="text-white/70 leading-relaxed">
              The &quot;Lumen&quot; is the Platform&apos;s internal credit unit. One (1) Lumen equals
              one (1) US dollar. Lumens are used to pay for tasks and for transactions within
              the Platform.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.2. Nature of Lumens</h3>
            <p className="text-white/70 leading-relaxed">
              Lumens are non-speculative digital credits. They are not a virtual currency, a
              cryptocurrency or a financial instrument. Their value is fixed and pegged to the
              US dollar. Lumens cannot be exchanged between users, resold on third-party
              markets, or used for speculative purposes.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.3. Acquisition and use</h3>
            <p className="text-white/70 leading-relaxed">
              Lumens are credited automatically to the user&apos;s account when a task is
              validated. Users can buy Lumens through the accepted payment methods (bank card,
              transfer, and — where enabled — stablecoin or Bitcoin).
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.4. Refunds</h3>
            <p className="text-white/70 leading-relaxed">
              In accordance with applicable consumer-protection law, the user has a period of
              fourteen (14) days from the purchase of Lumens to exercise their right of
              withdrawal and obtain a full refund, provided the Lumens have not been used.
              Refund requests must be sent to{' '}
              <span className="text-[#E50914]">billing@cinegeny.studio</span>.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">3.5. Conversion to cash</h3>
            <p className="text-white/70 leading-relaxed">
              Contributors can request a withdrawal of the Lumens they have earned to their
              bank account, subject to a one-time identity verification and a minimum balance
              of 20 Lumens. Bank transfers are processed within 7 business days.
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 4 — Intellectual property</h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">4.1. Platform content</h3>
            <p className="text-white/70 leading-relaxed">
              All elements making up the Platform (design, code, text, logos, trademarks) are
              the exclusive property of CINEGENY Studio and are protected by French and
              international intellectual-property law.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">4.2. Contributor submissions</h3>
            <p className="text-white/70 leading-relaxed">
              By submitting content (text, image, video, audio or any other file) as part of a
              task, the contributor grants CINEGENY Studio a worldwide, non-exclusive,
              assignable and sublicensable license for 70 years, for the purpose of
              integrating it into the relevant film and commercially exploiting it on all media.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              The contributor retains the moral rights to their original creations and will be
              credited in the film&apos;s credits according to the terms defined for each project.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">4.3. Proof of priority and timestamping</h3>
            <p className="text-white/70 leading-relaxed">
              Every submission is automatically timestamped and associated with a SHA-256 hash
              of its content. This mechanism constitutes proof of priority, certifying the
              submission date and the integrity of the file. The contributor can check the
              digital fingerprint of their submissions from their personal area at any time.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">4.4. AI-generated content</h3>
            <p className="text-white/70 leading-relaxed">
              Content generated by artificial intelligence as part of film production is the
              property of CINEGENY Studio. A contributor who works on AI content (retouching,
              correction, adaptation) acquires a co-creation right over their specific
              contribution.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 5 — User obligations</h2>
            <p className="text-white/70 leading-relaxed">The user agrees to:</p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>Comply with these Terms and with applicable law;</li>
              <li>Not impersonate anyone or provide false information;</li>
              <li>Not submit unlawful, defamatory, discriminatory, pornographic content or content that infringes the rights of third parties;</li>
              <li>Not use bots, automated scripts or any other means to manipulate the task or rating system;</li>
              <li>Respect the deadlines set for completing tasks (48 hours by default);</li>
              <li>Submit original, high-quality work that follows the task instructions;</li>
              <li>Not attempt to bypass the AI or human validation system;</li>
              <li>Respect the confidentiality of projects in production.</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Any breach of these obligations may result in the suspension or deletion of the
              account, forfeiture of un-withdrawn Lumens and, where applicable, legal action.
            </p>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 6 — Platform liability</h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">6.1. Best-efforts obligation</h3>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio undertakes to use all reasonable means to ensure the proper
              operation and availability of the Platform. This is a best-efforts obligation,
              not an obligation of result.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">6.2. Limitations</h3>
            <p className="text-white/70 leading-relaxed">The Platform cannot be held liable for:</p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li>Temporary service interruptions for maintenance or updates;</li>
              <li>Direct or indirect damages resulting from the use of, or inability to use, the service;</li>
              <li>The quality of submissions made by contributors;</li>
              <li>Validation or rejection decisions made by the AI system, subject to the user&apos;s right to appeal;</li>
              <li>Any malfunction caused by a force majeure event.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">6.3. Moderation</h3>
            <p className="text-white/70 leading-relaxed">
              The Platform reserves the right to moderate, modify or remove any content that
              breaches these Terms or the law, without notice or compensation.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 7 — Payments and compensation</h2>
            <h3 className="text-lg font-semibold text-white/90 mb-2">7.1. Task compensation</h3>
            <p className="text-white/70 leading-relaxed">
              Each task published on the Platform states a compensation in Lumens. The amount
              is set by the film&apos;s producer and is only owed to the contributor after their
              submission has been finally validated.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">7.2. Accepted payment methods</h3>
            <p className="text-white/70 leading-relaxed">
              The Platform accepts payments by bank card (via Stripe), bank transfer and —
              where enabled — stablecoin (USDC) and Bitcoin. Any transaction fees are borne by
              the user.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">7.3. Taxes</h3>
            <p className="text-white/70 leading-relaxed">
              Income earned through the Platform is taxable in accordance with the tax law of
              the contributor&apos;s country of residence. CINEGENY Studio provides the necessary
              tax documents (annual summary) where required. The contributor remains solely
              responsible for their tax filings.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">7.4. Commission</h3>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio charges a 15% commission on each transaction between a producer
              and a contributor. This commission covers the Platform&apos;s running costs, the
              maintenance of the AI validation system and infrastructure costs.
            </p>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 8 — Personal data</h2>
            <p className="text-white/70 leading-relaxed">
              The Platform collects and processes personal data in compliance with the General
              Data Protection Regulation (GDPR) and applicable data-protection law. For full
              details of how your data is processed, please see our{' '}
              <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 9 — Changes to these Terms</h2>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio reserves the right to modify these Terms at any time. Users will
              be informed of any material change by email and/or by a notification on the
              Platform at least thirty (30) days before it takes effect.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Continued use of the Platform after the changes take effect constitutes
              acceptance of the new Terms. If they disagree, the user can delete their account
              and request the withdrawal of their remaining Lumens under the conditions set out
              in Article 3.
            </p>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 10 — Termination</h2>
            <p className="text-white/70 leading-relaxed">
              The user can close their account at any time from their personal area or by
              contacting support at{' '}
              <span className="text-[#E50914]">support@cinegeny.studio</span>. Closing an
              account leads to its deletion within 30 days, subject to the conversion of any
              remaining Lumens.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              CINEGENY Studio may suspend or terminate an account for breach of these Terms,
              after a formal notice that remains unaddressed for 15 days, except in the case of
              a serious breach justifying immediate suspension.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 11 — Governing law and jurisdiction</h2>
            <p className="text-white/70 leading-relaxed">
              These Terms are governed by French law. Any dispute relating to their
              interpretation or performance will be subject to the exclusive jurisdiction of
              the courts of Paris, France, subject to the mandatory rules of territorial
              jurisdiction applicable to consumers residing in the European Union.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              In accordance with applicable consumer law, where a dispute remains unresolved,
              the consumer may use the relevant consumer-mediation service free of charge. The
              mediator&apos;s contact details will be provided on request.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">Article 12 — Contact</h2>
            <p className="text-white/70 leading-relaxed">
              For any question about these Terms, you can contact us:
            </p>
            <ul className="text-white/70 leading-relaxed mt-3 space-y-1 ml-4">
              <li>By email: <span className="text-[#E50914]">legal@cinegeny.studio</span></li>
              <li>By mail: CINEGENY Studio — [address to be completed], 75000 Paris, France</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/[0.06]">
            <p className="text-white/25 text-xs leading-relaxed italic">
              This document is an indicative template and does not constitute legal advice.
              We recommend having these terms reviewed by a specialized lawyer before going to
              production.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors duration-300">
            Privacy Policy
          </Link>
          <span className="text-white/10">|</span>
          <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors duration-300">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
