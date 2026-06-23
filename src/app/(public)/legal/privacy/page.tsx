import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy and personal data protection for the CINEGENY platform — GDPR-compliant.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-medium tracking-wider uppercase mb-6">
            Data Protection
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">
            Last updated: February 22, 2026
          </p>
        </div>

        {/* Content */}
        <div className="sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 md:p-12 space-y-10 shadow-2xl shadow-black/10">
          {/* Introduction */}
          <section>
            <p className="text-white/70 leading-relaxed">
              This Privacy Policy describes how CINEGENY Studio (&quot;CINEGENY&quot;, &quot;we&quot;, &quot;our&quot;)
              collects, uses, stores and protects your personal data when you use the{' '}
              <strong className="text-[#E50914]">CINEGENY</strong> platform (the &quot;Platform&quot;),
              in accordance with Regulation (EU) 2016/679 of 27 April 2016 (GDPR) and applicable
              data-protection law.
            </p>
          </section>

          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">1. Data controller</h2>
            <p className="text-white/70 leading-relaxed">The controller of your personal data is:</p>
            <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/70 leading-relaxed">
                <strong className="text-white/90">CINEGENY Studio</strong><br />
                Registered company<br />
                Paris trade register: [to be completed]<br />
                Registered office: [address to be completed], 75000 Paris, France<br />
                Email: <span className="text-[#E50914]">dpo@cinegeny.studio</span><br />
                Phone: [to be completed]
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">2. Data we collect</h2>
            <p className="text-white/70 leading-relaxed mb-4">We collect the following categories of personal data:</p>

            <h3 className="text-lg font-semibold text-white/90 mb-2">2.1. Identity and contact data</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>First name, last name, username;</li>
              <li>Email address;</li>
              <li>Password (hashed and salted, never stored in plain text);</li>
              <li>Profile picture (optional);</li>
              <li>Country of residence and preferred language.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.2. Professional data</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Platform capabilities you use (investing, missions, screenwriting, etc.);</li>
              <li>Declared skills (tools mastered, specialties);</li>
              <li>Portfolio and external links (website, social media);</li>
              <li>Languages spoken.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.3. Submission data</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Submitted files (images, text, videos, audio);</li>
              <li>Notes and comments attached to submissions;</li>
              <li>SHA-256 hash of files (proof of priority);</li>
              <li>History of completed tasks and scores obtained.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.4. Financial data</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>Stripe Connect identifier (for payouts);</li>
              <li>Crypto wallet address (optional);</li>
              <li>History of Lumen transactions;</li>
              <li>Billing information.</li>
            </ul>
            <p className="text-white/50 text-sm mt-2 ml-4 italic">
              Note: full banking details (card number, IBAN) are processed directly by our
              payment providers (Stripe and, where enabled, crypto processors) and are never
              stored on our servers.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">2.5. Browsing and technical data</h3>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-1 ml-4">
              <li>IP address;</li>
              <li>Browser type and version;</li>
              <li>Operating system;</li>
              <li>Pages visited, time spent;</li>
              <li>Cookie data (see our{' '}
                <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                  Cookie Policy
                </Link>).</li>
            </ul>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">3. Legal bases for processing</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Each processing activity relies on a legal basis compliant with Article 6 GDPR:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Purpose</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Legal basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4">Account creation and management</td>
                    <td className="py-3">Contract performance (Art. 6.1.b)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Task assignment and validation</td>
                    <td className="py-3">Contract performance (Art. 6.1.b)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Payments and billing</td>
                    <td className="py-3">Contract performance (Art. 6.1.b) / Legal obligation (Art. 6.1.c)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Platform improvement and analytics</td>
                    <td className="py-3">Legitimate interest (Art. 6.1.f)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Sending marketing communications</td>
                    <td className="py-3">Consent (Art. 6.1.a)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Non-essential cookies</td>
                    <td className="py-3">Consent (Art. 6.1.a)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Proof of priority (SHA-256)</td>
                    <td className="py-3">Legitimate interest (Art. 6.1.f)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Fraud prevention</td>
                    <td className="py-3">Legitimate interest (Art. 6.1.f)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">4. Purposes of processing</h2>
            <p className="text-white/70 leading-relaxed">Your personal data is processed for the following purposes:</p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>Create and manage your user account on the Platform;</li>
              <li>Let you apply for, complete and submit tasks;</li>
              <li>Validate submissions through our hybrid AI/human system;</li>
              <li>Process payments and compensation transfers;</li>
              <li>Run the gamification system (points, levels, leaderboard);</li>
              <li>Timestamp and certify the integrity of submissions (SHA-256 hash);</li>
              <li>Send you service-related notifications (available tasks, validations, payments);</li>
              <li>Send you marketing communications (with your consent);</li>
              <li>Improve the Platform through statistical usage analysis;</li>
              <li>Prevent fraud and ensure the security of the service;</li>
              <li>Comply with our legal and regulatory obligations.</li>
            </ul>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">5. Data recipients</h2>
            <p className="text-white/70 leading-relaxed">
              Your personal data may be shared with the following categories of recipients,
              strictly limited to what is necessary:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>
                <strong className="text-white/90">Authorized staff</strong> of CINEGENY Studio
                (technical team, moderation, customer support);
              </li>
              <li>
                <strong className="text-white/90">Technical sub-processors</strong>:
                hosting (Vercel/Hetzner), database (managed PostgreSQL), payments (Stripe and,
                where enabled, crypto processors), transactional email (Resend),
                analytics (Plausible Analytics);
              </li>
              <li>
                <strong className="text-white/90">AI providers</strong>: Anthropic (Claude API)
                for automated validation of submissions — only the submitted content and the
                validation criteria are sent, never your identity data;
              </li>
              <li>
                <strong className="text-white/90">Public authorities</strong>, upon a legally
                grounded request (tax administration, judicial authorities).
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              We never sell your personal data to third parties. We never share any data for
              advertising purposes.
            </p>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">6. Retention period</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Your data is kept only for as long as necessary for the purposes pursued:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Data type</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Retention period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4">Account data</td>
                    <td className="py-3">Life of the account + 3 years after deletion</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Submissions and SHA-256 hashes</td>
                    <td className="py-3">70 years (copyright term)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Billing data</td>
                    <td className="py-3">10 years (legal accounting obligation)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Browsing data / logs</td>
                    <td className="py-3">13 months maximum</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Analytics cookies</td>
                    <td className="py-3">13 months maximum</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Marketing communications</td>
                    <td className="py-3">Until consent is withdrawn + 3 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/70 leading-relaxed mt-4">
              When these periods expire, your data is irreversibly deleted or anonymized.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">7. Your rights (Articles 15–22 GDPR)</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Under the GDPR, you have the following rights over your personal data:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-3 ml-4">
              <li>
                <strong className="text-white/90">Right of access (Art. 15)</strong> — Obtain
                confirmation that your data is processed and receive a copy of it.
              </li>
              <li>
                <strong className="text-white/90">Right to rectification (Art. 16)</strong> — Have
                inaccurate data corrected or incomplete data completed.
              </li>
              <li>
                <strong className="text-white/90">Right to erasure (Art. 17)</strong> — Request
                deletion of your data, subject to legal retention obligations.
              </li>
              <li>
                <strong className="text-white/90">Right to restriction (Art. 18)</strong> — Obtain
                restriction of processing in the cases provided for by the GDPR.
              </li>
              <li>
                <strong className="text-white/90">Right to portability (Art. 20)</strong> — Receive
                your data in a structured, commonly used, machine-readable format (JSON/CSV) and
                transmit it to another controller.
              </li>
              <li>
                <strong className="text-white/90">Right to object (Art. 21)</strong> — Object to
                processing based on legitimate interest, including profiling.
              </li>
              <li>
                <strong className="text-white/90">Right to withdraw consent</strong> — Withdraw
                your consent at any time for processing that relies on it, without affecting the
                lawfulness of prior processing.
              </li>
              <li>
                <strong className="text-white/90">Right to set post-mortem directives</strong> — Set
                directives on what happens to your data after your death.
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl border border-[#E50914]/20 bg-[#E50914]/5">
              <p className="text-white/80 leading-relaxed">
                <strong className="text-[#E50914]">How to exercise your rights</strong><br />
                Send your request, with proof of identity, to:<br />
                <span className="text-[#E50914]">dpo@cinegeny.studio</span><br />
                We are committed to responding within 30 days.
              </p>
            </div>

            <p className="text-white/70 leading-relaxed mt-4">
              If our response is unsatisfactory, you have the right to lodge a complaint with
              your local data-protection authority (in France, the CNIL):{' '}
              <span className="text-[#E50914]">www.cnil.fr</span>.
            </p>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">8. Data Protection Officer (DPO)</h2>
            <p className="text-white/70 leading-relaxed">
              CINEGENY Studio has appointed a Data Protection Officer whom you can contact for
              any question about the protection of your personal data:
            </p>
            <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/70 leading-relaxed">
                <strong className="text-white/90">Data Protection Officer</strong><br />
                CINEGENY Studio<br />
                Email: <span className="text-[#E50914]">dpo@cinegeny.studio</span><br />
                Mail: DPO — CINEGENY Studio, [address to be completed], 75000 Paris
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">9. Cookies</h2>
            <p className="text-white/70 leading-relaxed">
              The Platform uses cookies to operate correctly and improve your experience. For
              detailed information on the cookies used, their purpose and how to manage your
              preferences, please see our{' '}
              <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Cookie Policy
              </Link>.
            </p>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">10. Data transfers outside the European Union</h2>
            <p className="text-white/70 leading-relaxed">
              Some of our sub-processors may be located outside the European Union. In that
              case, we ensure the data transfer is governed by appropriate safeguards in
              accordance with Chapter V of the GDPR:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>
                <strong className="text-white/90">Adequacy decision</strong>: where the destination
                country benefits from an adequacy decision by the European Commission (e.g. the
                EU-US Data Privacy Framework);
              </li>
              <li>
                <strong className="text-white/90">Standard Contractual Clauses (SCCs)</strong>: we
                use the standard contractual clauses approved by the European Commission
                (Decision 2021/914);
              </li>
              <li>
                <strong className="text-white/90">Additional measures</strong>: encryption of data
                in transit (TLS 1.3) and at rest (AES-256), minimization of the data transferred.
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              You can obtain a copy of the safeguards in place by contacting our DPO at{' '}
              <span className="text-[#E50914]">dpo@cinegeny.studio</span>.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">11. Data security</h2>
            <p className="text-white/70 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              personal data against any unauthorized access, alteration, disclosure or
              destruction:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li>Encryption of data in transit (HTTPS / TLS 1.3) and at rest (AES-256);</li>
              <li>Password hashing with bcrypt (cost 12);</li>
              <li>Access to data limited under the principle of least privilege;</li>
              <li>Logging of access to sensitive data;</li>
              <li>Daily encrypted backups;</li>
              <li>Regular security testing.</li>
            </ul>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-bold text-[#E50914] mb-4">12. Changes to this policy</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify this Privacy Policy at any time. In the event of a
              material change, we will inform you by email and/or by a notification on the
              Platform at least thirty (30) days before the changes take effect.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              The last-updated date is shown at the top of this document. We encourage you to
              review this page regularly.
            </p>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs leading-relaxed italic">
              This document is an indicative template and does not constitute legal advice.
              We recommend having this policy reviewed by a data-protection lawyer before going
              to production.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/legal/terms" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/cookies" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
