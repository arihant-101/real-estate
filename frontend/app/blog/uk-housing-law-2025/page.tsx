import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Navigating UK Housing Law Changes: What Every Landlord Must Know in 2025 | ASTA Property Management",
  description:
    "In 2025, the UK rental sector is undergoing its most transformative shift in decades. A series of legislative reforms are being introduced to improve housing quality, enhance tenant rights, and formalise the responsibilities of landlords.",
  keywords: "UK housing law 2025, landlord compliance, renters reform bill, section 21 abolished, tenancy regulation",
};

export default function UKHousingLaw2025Page() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with cover image */}
      <section className="relative page-banner flex min-h-[50vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/blog-uk-housing-law-2025-hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-12 pt-28 sm:px-6 lg:pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Blog
          </Link>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Navigating UK Housing Law Changes: What Every Landlord Must Know in 2025
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/70">
            <time dateTime="2025-10-08">8 October 2025</time>
            <span>By ASTA Property Management</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted prose-p:leading-relaxed prose-ul:text-muted prose-li:text-muted">
            <p className="text-lg leading-relaxed text-muted">
              In 2025, the UK rental sector is undergoing its most transformative shift in decades. A
              series of legislative reforms — many years in the making — are being introduced to
              improve housing quality, enhance tenant rights, and formalise the responsibilities of
              landlords. As a property owner, letting agent, or investor, understanding and
              preparing for these changes is not just good practice — it is critical for legal
              compliance and long-term profitability.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">The End of "No-Fault" Evictions</h2>
            <p>
              One of the most widely discussed changes is the abolition of Section 21, commonly
              referred to as the "no-fault eviction." For years, this clause allowed landlords to
              regain possession of their property at the end of a fixed term without providing
              justification. While this offered flexibility, it has faced criticism for creating instability
              for tenants.
            </p>
            <p>
              From 2025, Section 8 will become the default mechanism for repossessing a
              property. Landlords must now provide valid legal grounds for eviction, such as:
            </p>
            <ul>
              <li>Significant rent arrears</li>
              <li>Anti-social behaviour</li>
              <li>Breach of tenancy terms</li>
              <li>The landlord's intention to sell or move into the property</li>
            </ul>
            <p>
              This shift necessitates clear documentation, regular communication, and the
              proper serving of legal notices. ASTA Property Management has updated all
              tenancy agreements to reflect these changes and provides clients with structured
              documentation and dispute resolution guidance.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">New Standardised Tenancy Agreements</h2>
            <p>
              The government will also introduce a single universal tenancy agreement for all
              residential lets. This aims to reduce confusion between fixed-term, periodic, and
              assured shorthold tenancies. The new standard agreement will:
            </p>
            <ul>
              <li>Be easier to understand for tenants and landlords alike</li>
              <li>Include integrated legal notices and obligations</li>
              <li>Be updated automatically to reflect future changes in legislation</li>
            </ul>
            <p>
              At ASTA, we already use NRLA-approved tenancy templates that are legally
              compliant and designed to integrate seamlessly with the new government
              standards.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">Mandatory Landlord Portal & Registration</h2>
            <p>
              In an effort to professionalise the private rented sector, all landlords in England will
              need to register via a national digital portal. This portal will:
            </p>
            <ul>
              <li>Hold landlord and property credentials</li>
              <li>Verify compliance with safety regulations (e.g. Gas Safety, EICR, EPC)</li>
              <li>Track deposits, licensing, and tenancy changes</li>
            </ul>
            <p>
              Failure to register could lead to fines and restriction of letting rights. ASTA Property
              Management offers full registration support as part of our onboarding process.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">Expanded Decent Homes Standard</h2>
            <p>
              Previously applied only to social housing, the Decent Homes Standard will now
              cover all private lets. To be considered "decent," a property must:
            </p>
            <ul>
              <li>Be free from Category 1 hazards (damp, mould, fire risk, etc.)</li>
              <li>Be in a reasonable state of repair</li>
              <li>Have modern facilities and efficient heating systems</li>
              <li>Provide a reasonable degree of thermal comfort</li>
            </ul>
            <p>
              We work proactively with landlords to audit and upgrade their properties, prioritising
              safety and sustainability while preserving profitability.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">Rent Increases & Notice Periods</h2>
            <p>
              The government is also tightening rules around rent increases. Landlords must now:
            </p>
            <ul>
              <li>Give a minimum of two months' notice before increasing rent</li>
              <li>Use a formal written notice, clearly stating the new rent</li>
              <li>Justify increases if challenged by the tenant</li>
            </ul>
            <p>
              This is part of a larger effort to create fairness in the marketplace and prevent
              exploitative practices, particularly in competitive urban areas.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">ASTA's Compliance Guarantee</h2>
            <p>
              In light of these sweeping changes, ASTA Property Management provides a
              compliance guarantee for all managed landlords. Our services include:
            </p>
            <ul>
              <li>Legally updated tenancy documents</li>
              <li>Scheduled safety checks and certifications</li>
              <li>Formal rent increase procedures</li>
              <li>Section 8 support and legal referral</li>
              <li>Licensing and portal registration assistance</li>
            </ul>
            <p>
              Our team, led by Theresia Petersen and supported by experienced agents Misha
              and Mariia, undergoes continuous legal training to ensure you stay compliant —
              without stress.
            </p>
          </div>
          
          <div className="mt-12 border-t border-white/10 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              ← All posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}