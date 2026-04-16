import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Property Management Services for Landlords",
  description:
    "Dedicated property management services for landlords including tenant sourcing, compliance management, and rental income oversight.",
  path: "/owners",
});

export default function OwnersPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with interior image */}
      <section className="relative page-banner flex min-h-[40vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/images/owners-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/85 to-black" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-28 sm:px-6 lg:pb-20">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            Owners / landlords
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Owners / Landlords
          </h1>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/80">
            At ASTA Property Management, we understand that your property is more than a building —
            it’s a long-term investment and an important part of your financial future.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="space-y-8 text-sm text-muted sm:text-base">
            <p>
              Our dedicated landlord services are designed to protect your assets, increase your
              returns, and remove the day-to-day burdens of tenancy management.
            </p>
            <p>
              Whether you’re a first-time landlord with a single flat or a seasoned investor
              managing a growing portfolio, ASTA provides intelligent, hands-on support tailored to
              your objectives and obligations.
            </p>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Why Landlords Choose ASTA</h2>
              <ul className="mt-1 space-y-1">
                <li>✓ Complete Property Management – From marketing and tenant sourcing to inspections and financial reporting</li>
                <li>✓ Legal Compliance &amp; Risk Mitigation – We ensure your tenancy is always aligned with the latest UK and London-specific legislation</li>
                <li>✓ Maximised Rental Yield – With intelligent pricing, dynamic marketing, and rent reviews based on current market data</li>
                <li>✓ Transparent Financial Reporting – Full monthly breakdowns and annual statements, accessible through our secure online portal</li>
                <li>✓ Maintenance Oversight – Reliable, cost-effective service management from vetted contractors</li>
                <li>✓ Holiday Let and HMO Services – Licensing, turnover, and guest management included</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Compliance You Can Rely On</h2>
              <p>
                Navigating the modern legal landscape can be overwhelming. We manage:
              </p>
              <ul className="space-y-1">
                <li>• Right to Rent checks</li>
                <li>• Deposit protection and dispute resolution</li>
                <li>• Tenancy agreement preparation (including NRLA templates)</li>
                <li>• Licensing support (selective, additional, or HMO)</li>
                <li>• Energy and safety certification (EPC, EICR, gas safety)</li>
                <li>• Notices and enforcement support (including Section 8 and Section 21, where applicable)</li>
              </ul>
              <p>
                We are proud members of the National Residential Landlords Association (NRLA) and
                prioritise compliance at every stage of your lettings journey.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Marketing and Lettings</h2>
              <p>
                Your property is marketed with precision and purpose. Every listing includes:
              </p>
              <ul className="space-y-1">
                <li>• SEO-friendly descriptions written by property professionals</li>
                <li>• Beautiful high-resolution photography</li>
                <li>• Social media promotion</li>
                <li>• Syndicated listings across Rightmove, Zoopla, OnTheMarket and Airbnb (where applicable)</li>
                <li>• Strategic targeting for short-lets, professionals, families, and more</li>
              </ul>
              <p>
                Our goal is to secure you the best possible tenant, in the shortest possible time, at
                the optimal rate — while ensuring peace of mind.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Support, Strategy, Success</h2>
              <p>
                At ASTA, we build long-term relationships with our landlords. You’ll always work with a
                real person — someone who understands your goals, monitors your property, and keeps
                you fully informed.
              </p>
              <p>
                You’ll benefit from the insight of our team, including Director Theresia Petersen,
                senior property managers Misha and Mariia, and compliance specialist Anton Berg, all
                of whom are committed to your success.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Owners Portal
              </h2>
              <p className="mt-3 text-sm text-muted">
                Landlords can access tailored resources via our Owners Portal. Register or sign in to
                view your properties, maintenance requests, applications, and financial summaries —
                all in one place.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light"
                >
                  Register for portal access
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-lg border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  Sign in to portal
                </Link>
              </div>
            </div>

            <p className="text-sm text-muted">
              Prefer to talk through your portfolio?{" "}
              <Link href="/contact-us" className="text-primary hover:text-primary-light">
                Contact us
              </Link>{" "}
              to arrange a consultation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
