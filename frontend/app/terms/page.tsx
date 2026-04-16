import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Property Management",
  description:
    "Contractual terms governing your use of our property management services and digital platforms.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row">
        <aside className="lg:w-64">
          <div className="rounded-xl border border-white/5 bg-background/60 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              On this page
            </h2>
            <nav className="mt-4 space-y-2 text-sm">
              <a href="#scope" className="block text-muted hover:text-primary">
                Scope
              </a>
              <a href="#services" className="block text-muted hover:text-primary">
                Services Provided
              </a>
              <a href="#obligations" className="block text-muted hover:text-primary">
                Client Obligations
              </a>
              <a href="#fees" className="block text-muted hover:text-primary">
                Fees & Payment
              </a>
              <a href="#liability" className="block text-muted hover:text-primary">
                Liability
              </a>
              <a href="#termination" className="block text-muted hover:text-primary">
                Termination
              </a>
              <a href="#disputes" className="block text-muted hover:text-primary">
                Dispute Resolution
              </a>
              <a href="#changes" className="block text-muted hover:text-primary">
                Changes to Terms
              </a>
              <a href="#contact-updates" className="block text-muted hover:text-primary">
                Contact & Updates
              </a>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <header className="relative mb-8 border-b border-white/5 pb-6">
            <HeroContactMini className="absolute right-0 top-0" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Legal & Compliance
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Terms of Service</h1>
            <p className="mt-4 text-muted">
              These Terms govern your use of ASTA Property Management services and the associated
              digital platforms, including portals and websites.
            </p>
          </header>

          <section id="scope" className="space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">1. Scope</h2>
            <p>
              These Terms govern your use of ASTA Property Management services and digital
              platforms. By engaging our services or accessing our portals and websites, you agree
              to be bound by these Terms in conjunction with your specific service agreement.
            </p>
          </section>

          <section id="services" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">2. Services Provided</h2>
            <p>
              ASTA offers tenancy management, property maintenance coordination, tenant placement,
              financial reporting, holiday let management, and related services as described in
              your service agreement. The exact scope of services may vary depending on the package
              or level of service agreed with you.
            </p>
          </section>

          <section id="obligations" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">3. Client Obligations</h2>
            <p>
              Clients agree to provide accurate and complete information, comply with all
              applicable laws and regulations, and cooperate fully in providing documentation
              required for tenancy management. You are responsible for promptly informing us of any
              changes to your circumstances that may affect service delivery.
            </p>
          </section>

          <section id="fees" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">4. Fees and Payment</h2>
            <p>
              Service fees will be outlined in your contract. All payments must be made promptly in
              accordance with the agreed schedule. Late payments may incur interest and may result
              in suspension of services until outstanding amounts are settled.
            </p>
          </section>

          <section id="liability" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">5. Liability</h2>
            <p>
              ASTA exercises reasonable skill and care in delivering services but excludes
              liability, to the fullest extent permitted by law, for indirect, incidental, or
              consequential damages. Our total liability in respect of any claim is limited to the
              fees paid for the service in question.
            </p>
          </section>

          <section id="termination" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">6. Termination</h2>
            <p>
              Either party may terminate the agreement with written notice in accordance with the
              terms specified in your contract. Upon termination, any outstanding fees remain
              payable, and access to digital platforms and portals will be revoked where
              applicable.
            </p>
          </section>

          <section id="disputes" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">7. Dispute Resolution</h2>
            <p>
              We encourage resolution of disputes through negotiation and mediation wherever
              possible. If a dispute cannot be resolved informally, it may be submitted to
              arbitration or to the courts with jurisdiction in England, in accordance with
              applicable law.
            </p>
          </section>

          <section id="changes" className="mt-10 space-y-4 text-muted">
            <h2 className="text-2xl font-semibold text-white">8. Changes to Terms</h2>
            <p>
              ASTA reserves the right to amend these Terms with reasonable notice to clients,
              either via email, through the client portal, or via updates on our website. Your
              continued use of our services after such changes constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section id="contact-updates" className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold text-white">Contact and Updates</h2>
            <p className="text-muted">
              For any questions about these Terms of Service, or how they apply to your specific
              agreement, please contact our team or refer to your service contract. For data
              privacy queries, please see our Privacy Policy page.
            </p>
            <p className="text-sm text-muted">
              We may update these Terms periodically. The latest version will always be available
              on our website.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
