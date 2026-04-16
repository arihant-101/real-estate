import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Do Tenants Expect in 2025? The New Standards of Renting in London | ASTA Property Management",
  description:
    "Renting in 2025 is a vastly different experience from just a few years ago. Today's tenants are informed, empowered, and demand more than a place to live — they expect a complete lifestyle experience.",
  keywords: "tenant needs 2025, renting in London, ASTA tenant support, digital lettings UK, rental expectations",
};

export default function TenantExpectations2025Page() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with cover image */}
      <section className="relative page-banner flex min-h-[50vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/blog-tenant-expectations-2025-hero.jpg)" }}
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
            What Do Tenants Expect in 2025? The New Standards of Renting in London
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/70">
            <time dateTime="2025-09-22">22 September 2025</time>
            <span>By ASTA Property Management</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted prose-p:leading-relaxed prose-ul:text-muted prose-li:text-muted">
            <p className="text-lg leading-relaxed text-muted">
              Renting in 2025 is a vastly different experience from just a few years ago. Today's
              tenants are informed, empowered, and demand more than a place to live — they
              expect a complete lifestyle experience. At ASTA Property Management, we have our
              finger on the pulse of evolving tenant needs and work closely with landlords to
              meet and exceed these expectations.
            </p>
            <p>
              In a competitive London rental market, understanding what tenants truly value will
              directly affect your occupancy rates, rental income, and long-term property
              success.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">1. Digital-First Tenancy Experience</h2>
            <p>
              Tenants today expect seamless, mobile-friendly interactions at every stage:
            </p>
            <ul>
              <li>Online viewings and virtual tours</li>
              <li>Digital application submissions</li>
              <li>e-Signed tenancy agreements</li>
              <li>Online rent payments and document access</li>
              <li>Real-time maintenance reporting</li>
            </ul>
            <p>
              ASTA offers a fully digital platform that allows tenants to manage their tenancy from
              anywhere. From application to renewal, the process is transparent, fast, and secure.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">2. Fast, Professional Maintenance Responses</h2>
            <p>
              Gone are the days of ignored repair requests. Tenants expect issues to be resolved
              quickly, with updates along the way. According to recent surveys, response time is
              one of the most common deal-breakers for tenants when choosing to renew.
            </p>
            <p>
              Our dedicated maintenance portal allows tenants to submit detailed requests,
              including photos and videos. ASTA logs each request, provides contractor follow-up,
              and ensures that every issue is resolved promptly — often within 48 hours.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">3. Lifestyle-Driven Properties</h2>
            <p>
              Beyond layout and location, tenants now choose properties based on:
            </p>
            <ul>
              <li><strong>Remote work suitability</strong> (dedicated desk space, fast Wi-Fi, good lighting)</li>
              <li><strong>Pet-friendly policies</strong> (enclosed gardens, washable flooring)</li>
              <li><strong>Sustainable features</strong> (LED lighting, recycling facilities, energy-efficient heating)</li>
              <li><strong>Community access</strong> (near parks, public transport, high street amenities)</li>
            </ul>
            <p>
              We help landlords adapt properties to meet these growing demands — resulting in
              fewer voids and happier tenants.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">4. Full Legal Transparency</h2>
            <p>
              Tenants are now more aware of their rights than ever before. They expect clear,
              upfront documentation — not legal jargon or missing paperwork. ASTA ensures that
              every tenant receives:
            </p>
            <ul>
              <li>Deposit Protection Certificate</li>
              <li>EPC and EICR reports</li>
              <li>How to Rent Guide</li>
              <li>Gas Safety Certificate</li>
              <li>Emergency contact information</li>
            </ul>
            <p>
              Our onboarding experience is designed to build trust and ensure compliance from
              the start.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">5. Respectful, Responsive Communication</h2>
            <p>
              Perhaps most importantly, tenants want to feel respected. ASTA's team — led by
              Director Theresia Petersen and supported by the highly capable Misha, Mariia, and
              Anton — is known for their professionalism and empathy.
            </p>
            <p>
              We don't just "manage property." We cultivate positive, long-term relationships that
              benefit landlords and tenants alike.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">Conclusion</h2>
            <p>
              To retain great tenants in 2025, landlords must deliver more than accommodation
              — they must offer security, service, and simplicity. ASTA Property Management
              provides the infrastructure and human touch that today's renters not only expect —
              but demand.
            </p>
            <p>
              Happy tenants stay longer, pay reliably, and treat your property with care. That's
              why understanding their expectations isn't just good service. It's smart business.
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