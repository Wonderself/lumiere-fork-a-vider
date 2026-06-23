import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How the CINEGENY platform uses cookies — manage your preferences and learn about the trackers we use.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-medium tracking-wider uppercase mb-6">
            Cookies & Trackers
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Cookie Policy
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
              This Cookie Policy explains how the{' '}
              <strong className="text-[#E50914]">CINEGENY</strong> platform, operated by CINEGENY
              Studio, uses cookies and similar technologies when you browse our site. It
              complements our{' '}
              <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Privacy Policy
              </Link>{' '}
              and is consistent with GDPR and CNIL guidance.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              1. What is a cookie?
            </h2>
            <p className="text-white/70 leading-relaxed">
              A cookie is a small text file placed on your device (computer, tablet,
              smartphone) when you visit a website. It lets the site remember information
              about your visit (preferred language, session identifiers, display preferences,
              etc.) to make your future browsing easier.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              Cookies do not contain viruses and cannot access other data stored on your
              device. They are either &quot;first-party&quot; (set by our site) or &quot;third-party&quot;
              (set by our partners).
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              2. Strictly necessary cookies
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These cookies are essential for the platform to work. They cannot be disabled.
              They store no personally identifiable data and are exempt from consent under
              applicable e-privacy rules.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Purpose</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">next-auth.session-token</td>
                    <td className="py-3 pr-4">Authentication and keeping the user session active</td>
                    <td className="py-3">Session (30 days)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">next-auth.csrf-token</td>
                    <td className="py-3 pr-4">Protection against CSRF attacks</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">next-auth.callback-url</td>
                    <td className="py-3 pr-4">Redirect after authentication</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">cookie-consent</td>
                    <td className="py-3 pr-4">Remembering your cookie choices</td>
                    <td className="py-3">12 months</td>
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
              3. Analytics cookies
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These cookies let us measure the platform&apos;s audience and understand how users
              interact with our services. The data collected is anonymized and aggregated.
              These cookies are only set with your consent.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Provider</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Purpose</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">plausible_*</td>
                    <td className="py-3 pr-4">Plausible Analytics</td>
                    <td className="py-3 pr-4">Privacy-friendly audience measurement (no personal data)</td>
                    <td className="py-3">13 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/50 text-sm mt-3 italic">
              Note: We use Plausible Analytics, a privacy-friendly analytics tool that sets no
              cookies by default and does not track users across sites. Our use of analytics
              cookies is therefore minimal.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              4. Personalization cookies
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These cookies let us tailor the platform to your preferences and improve your
              experience. They are only set with your consent.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 pr-4 text-white/90 font-semibold">Purpose</th>
                    <th className="text-left py-3 text-white/90 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">locale</td>
                    <td className="py-3 pr-4">Remembering your chosen interface language</td>
                    <td className="py-3">12 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">theme</td>
                    <td className="py-3 pr-4">Visual theme preference (dark/light)</td>
                    <td className="py-3">12 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">task-filters</td>
                    <td className="py-3 pr-4">Remembering your task search filters</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[#E50914]">video-quality</td>
                    <td className="py-3 pr-4">Video quality preference for the player</td>
                    <td className="py-3">12 months</td>
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
              5. Managing your preferences
            </h2>
            <p className="text-white/70 leading-relaxed">
              You can change your cookie preferences at any time:
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">5.1. Via our cookie banner</h3>
            <p className="text-white/70 leading-relaxed">
              On your first visit, a banner lets you accept or decline non-essential cookies.
              You can change this choice at any time by deleting the{' '}
              <code className="text-[#E50914] text-xs bg-white/5 px-1.5 py-0.5 rounded">cookie-consent</code>{' '}
              cookie from your browser, which will show the banner again.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">5.2. Via your browser settings</h3>
            <p className="text-white/70 leading-relaxed">
              You can configure your browser to accept or refuse cookies. Here are links to
              instructions for the most common browsers:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-1 ml-4">
              <li><strong className="text-white/90">Chrome</strong>: Settings &gt; Privacy and security &gt; Cookies</li>
              <li><strong className="text-white/90">Firefox</strong>: Settings &gt; Privacy & Security &gt; Cookies</li>
              <li><strong className="text-white/90">Safari</strong>: Preferences &gt; Privacy &gt; Cookies</li>
              <li><strong className="text-white/90">Edge</strong>: Settings &gt; Cookies and site permissions</li>
            </ul>
            <p className="text-white/50 text-sm mt-3 italic">
              Note: disabling certain cookies may affect how the platform works, in particular
              authentication and navigation.
            </p>

            <h3 className="text-lg font-semibold text-white/90 mb-2 mt-4">5.3. Analytics opt-out</h3>
            <p className="text-white/70 leading-relaxed">
              You can disable analytics tracking by enabling the &quot;Do Not Track&quot; (DNT)
              feature in your browser. Plausible Analytics natively respects this signal.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="text-2xl font-bold text-[#E50914] mb-4"
            >
              6. How long cookies are kept
            </h2>
            <p className="text-white/70 leading-relaxed">
              In line with CNIL guidance, cookies and trackers have the following lifetimes:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed mt-2 space-y-2 ml-4">
              <li>
                <strong className="text-white/90">Session cookies</strong>: automatically deleted
                when you close your browser;
              </li>
              <li>
                <strong className="text-white/90">Persistent cookies</strong>: up to 12 months from
                when they are set;
              </li>
              <li>
                <strong className="text-white/90">Cookie consent</strong>: your choice is kept for
                12 months, after which you will be asked for consent again;
              </li>
              <li>
                <strong className="text-white/90">Analytics cookies</strong>: up to 13 months, in
                line with CNIL guidance.
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
              For any question about our use of cookies, you can contact our Data Protection
              Officer at{' '}
              <span className="text-[#E50914]">dpo@cinegeny.studio</span>.
            </p>
            <p className="text-white/70 leading-relaxed mt-3">
              To learn more about how we protect your personal data, see our{' '}
              <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs leading-relaxed italic">
              This document is an indicative template and does not constitute legal advice.
              We recommend having this policy reviewed by a professional before going to
              production.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/legal/terms" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/privacy" className="text-[#E50914] underline underline-offset-4 hover:text-[#FF2D2D] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
