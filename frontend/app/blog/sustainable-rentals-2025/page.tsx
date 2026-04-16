import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sustainability in Lettings: Why Eco-Friendly Rentals Are in High Demand in 2025 | ASTA Property Management",
  description:
    "Environmental considerations are shaping renter preferences and regulatory requirements in 2025. For modern tenants—particularly younger professionals and families—the environmental footprint of a home matters nearly as much as its location or amenities.",
  keywords: "eco-friendly rentals, green lettings UK, sustainable property investment, EPC rating, carbon-neutral homes",
};

export default function SustainableRentals2025Page() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with cover image */}
      <section className="relative page-banner flex min-h-[50vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/blog-sustainable-rentals-2025-hero.png)" }}
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
            Sustainability in Lettings: Why Eco-Friendly Rentals Are in High Demand in 2025
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/70">
            <time dateTime="2025-09-08">8 September 2025</time>
            <span>By ASTA Property Management</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted prose-p:leading-relaxed prose-ul:text-muted prose-li:text-muted">
            <p className="text-lg leading-relaxed text-muted">
              Environmental considerations are shaping renter preferences and regulatory
              requirements in 2025. For modern tenants—particularly younger professionals and
              families—the environmental footprint of a home matters nearly as much as its
              location or amenities. Adopting sustainable practices is no longer optional. It is now
              essential for attracting quality tenants, complying with emerging legislation, and
              preserving long-term asset value.
            </p>
            <p>
              At ASTA Property Management, we guide landlords through this green shift. Here's
              why eco-friendly rentals are gaining traction and how you can benefit.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">1. Government Targets and EPC Obligations</h2>
            <p>
              The UK government plans to elevate the minimum Energy Performance Certificate
              (EPC) rating to 'C' by 2028, with initial deadlines already in effect. Homes rated D or
              below may require costly upgrades or face rental restrictions.
            </p>
            <p>
              Key areas of focus include:
            </p>
            <ul>
              <li>✔ Proper insulation (walls, roofs, and floors)</li>
              <li>✔ High-efficiency boilers or heat pumps</li>
              <li>✔ Double or triple glazing</li>
              <li>✔ Smart meters and thermostats</li>
            </ul>
            <p>
              ASTA facilitates upgrades by advising on cost-effective improvements, scheduling
              contractor work, and ensuring EPC compliance ahead of legislative deadlines.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">2. Lower Bills, Higher Appeal</h2>
            <p>
              Eco-friendly features are not just compliance tools—they drive demand and
              retention. Sustainable tenants often stay longer, cite lower utility costs, and are
              more likely to renew leases.
            </p>
            <p>
              Popular green features include:
            </p>
            <ul>
              <li>LED lighting throughout the property</li>
              <li>Water-saving taps and dual-flush toilets</li>
              <li>Electric vehicle charging readiness</li>
              <li>Solar panels or renewable energy systems</li>
            </ul>
            <p>
              By positioning your rental as "eco-friendly," ASTA can help secure premium rent and
              attract long-term, conscientious tenants.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">3. Marketing to Sustainability-Focused Tenants</h2>
            <p>
              Highlighting green credentials enhances listing visibility against more generic
              rentals. Effective marketing strategies might emphasise:
            </p>
            <ul>
              <li>"EPC rated C — low running costs"</li>
              <li>Smart thermostats and meter-readings</li>
              <li>Recycling and composting guidance</li>
              <li>Secure bike storage and EV charging</li>
            </ul>
            <p>
              We optimise listing descriptions, metadata, and tags to resonate with eco-
              conscious audiences and improve search ranking on platforms like Rightmove,
              Zoopla, and Google.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">4. Protecting Value Through Future-Proofing</h2>
            <p>
              Properties that adapt to regulatory trends appreciate more steadily—while older,
              inefficient homes risk decreasing in value. Sustainability-focused upgrades can
              yield strong ROI, particularly as energy costs continue to rise.
            </p>
            <p>
              ASTA audits client properties to create short- and long-term green investment
              plans: simple upgrades first, then major works spaced out to align with tenancy
              schedules and tax timing.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">5. Sustainability as a Brand Differentiator</h2>
            <p>
              As environmental concerns shape rental decisions, ASTA positions itself as a
              forward-thinking, responsible letting partner. We support sustainability through:
            </p>
            <ul>
              <li>Green tenancy clauses (e.g., recycling duties)</li>
              <li>Tenant education kits (energy efficiency tips)</li>
              <li>Annual advice updates on regulation and grants</li>
            </ul>
            <p>
              Our landlord clients then enjoy brand differentiation, appeal, and satisfaction
              among their tenants—all backed by robust documentation and legal compliance.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-white">Conclusion</h2>
            <p>
              In 2025's lettings market, sustainability is more than a buzzword—it's a smart
              investment strategy. From regulatory compliance and tenant attraction to asset
              value protection, green rentals deliver value at every level.
            </p>
            <p>
              ASTA Property Management offers a full-service solution: consulting, compliance,
              fingerprint energy savings, and marketing—all tailored to turn sustainability into
              success.
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