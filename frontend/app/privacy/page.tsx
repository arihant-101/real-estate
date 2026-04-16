import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy & Terms",
  description:
    "Information about our privacy policy, data protection practices, and terms governing our property management services.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row">
        <aside className="lg:w-64">
          <div className="rounded-xl border border-white/5 bg-background/60 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              On this page
            </h2>
            <nav className="mt-4 space-y-2 text-sm">
              <a href="#introduction" className="block text-muted hover:text-primary">
                Introduction
              </a>
              <a href="#privacy-policy" className="block text-muted hover:text-primary">
                Privacy Policy
              </a>
              <a href="#transparency" className="block text-muted hover:text-primary">
                Transparency
              </a>
              <a href="#contact-updates" className="block text-muted hover:text-primary">
                Contact & Updates
              </a>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-8 border-b border-white/5 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Legal & Compliance
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted">
              At ASTA Property Management, safeguarding your personal data is foundational to our
              commitment to trust, transparency, and compliance.
            </p>
          </header>

          <section id="introduction" className="space-y-4 text-muted">
            <p>
              This Privacy Policy explains how we collect, use, store, and protect your information
              when you interact with our property management services and digital platforms.
            </p>
          </section>

          <section id="privacy-policy" className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold text-white">Privacy Policy</h2>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">1. Introduction</h3>
              <p>
                ASTA Property Management (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) respects
                your privacy and is committed to protecting your personal data. This policy
                explains how we process information in accordance with the UK General Data
                Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">2. Data We Collect</h3>
              <p>We collect personal data necessary for property management, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Names, contact details, and identification documents</li>
                <li>Financial information for rent collection and reporting</li>
                <li>Employment and reference details for tenant vetting</li>
                <li>Maintenance request details and communications</li>
                <li>Digital data such as IP addresses and usage logs on our website and portal</li>
              </ul>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">3. How We Use Your Data</h3>
              <p>Your personal data is used to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and manage tenancy and landlord services</li>
                <li>Conduct credit and reference checks compliant with legal standards</li>
                <li>Communicate with you regarding your tenancy or property</li>
                <li>Comply with legal obligations such as anti-money laundering and taxation</li>
                <li>Improve our services and digital platforms</li>
              </ul>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">4. Data Sharing</h3>
              <p>We do not sell your data. We share information only with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Authorized third-party service providers (e.g., referencing agencies, maintenance
                  contractors) under strict confidentiality agreements
                </li>
                <li>Legal and regulatory authorities as required by law</li>
                <li>Our internal team strictly on a need-to-know basis</li>
              </ul>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">5. Data Retention</h3>
              <p>
                Personal data is retained for the duration of your tenancy or contract and for a
                statutory period thereafter (typically six years) to comply with legal and
                accounting requirements.
              </p>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">6. Your Rights</h3>
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal data</li>
                <li>Request correction or deletion of inaccurate data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Lodge a complaint with the Information Commissioner&apos;s Office (ICO)</li>
              </ul>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">7. Security Measures</h3>
              <p>
                We employ industry-standard security protocols including encryption, secure
                servers, access controls, and regular audits to protect your data from unauthorised
                access or loss.
              </p>
            </div>
          </section>

          <section id="transparency" className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold text-white">
              Transparency Regarding Data Privacy and Service Terms
            </h2>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">Data Privacy Transparency</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  We clearly explain what personal information we collect, why we need it, and how
                  it will be used before you provide it.
                </li>
                <li>
                  You are informed about your rights under the UK GDPR, including how to access,
                  correct, or delete your data.
                </li>
                <li>
                  Our data sharing practices are open; we disclose which third parties may receive
                  your information and under what circumstances.
                </li>
                <li>
                  We employ robust security measures to safeguard your data against unauthorised
                  access or breaches.
                </li>
                <li>
                  We retain your data only as long as necessary to fulfil our contractual and legal
                  obligations, and we commit to regularly reviewing these retention periods.
                </li>
                <li>
                  We provide easy channels for you to contact us regarding any data privacy
                  concerns or requests.
                </li>
              </ul>
            </div>

            <div className="space-y-3 text-muted">
              <h3 className="text-lg font-semibold text-white">Service Terms Transparency</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Our service agreements clearly outline the scope, fees, and obligations for both
                  ASTA and our clients.
                </li>
                <li>
                  We ensure all fees, payment terms, and any potential additional charges are
                  disclosed upfront — with no hidden costs.
                </li>
                <li>
                  Changes to service terms are communicated promptly and with reasonable notice,
                  allowing you to make informed decisions.
                </li>
                <li>
                  We clarify the limits of our liability, your responsibilities, and the procedures
                  for resolving disputes to avoid misunderstandings.
                </li>
                <li>
                  We maintain openness about how service delivery is conducted, including how and
                  when property inspections, maintenance, and financial reporting occur.
                </li>
              </ul>
            </div>

            <p className="text-muted">
              By maintaining this high level of transparency, ASTA Property Management aims to
              build lasting relationships based on honesty, professionalism, and mutual respect.
            </p>
          </section>

          <section id="contact-updates" className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold text-white">Contact and Updates</h2>
            <p className="text-muted">
              For any questions about this Privacy Policy or Terms of Service, or to exercise your
              data rights, please contact:
            </p>
            <div className="rounded-xl border border-white/5 bg-background/60 p-6 text-muted backdrop-blur">
              <p className="font-semibold text-white">Data Protection Officer</p>
              <p>ASTA Property Management</p>
              <p>
                Email:{" "}
                <a href="mailto:info@astapm.co.uk" className="text-primary hover:underline">
                  info@astapm.co.uk
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+447452766766" className="text-primary hover:underline">
                  07452 766766
                </a>
              </p>
            </div>
            <p className="text-sm text-muted">
              We may update this document periodically. The latest version will always be available
              on our website.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
