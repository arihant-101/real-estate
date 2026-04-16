import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Tenant Services | London Rental Properties",
  description:
    "Resources and support for tenants including rental applications, maintenance reporting, and tenancy guidance.",
  path: "/tenants",
});

const APPLICATION_STEPS = [
  {
    step: 1,
    title: "Browse listings",
    text: "View our property listings, filter by area, price, and size, and shortlist properties you like.",
  },
  {
    step: 2,
    title: "Arrange a viewing",
    text: "Contact us to arrange a viewing. We'll show you around and answer any questions.",
  },
  {
    step: 3,
    title: "Apply & referencing",
    text: "Submit your application. We'll run referencing (identity, income, previous landlord) and keep you updated.",
  },
  {
    step: 4,
    title: "Agreement & move-in",
    text: "Sign the tenancy agreement, pay the deposit (into a protected scheme), and move in. We'll support you throughout.",
  },
];

export default function TenantsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with apartment interior */}
      <section className="relative page-banner flex min-h-[40vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/images/tenants-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/85 to-black" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-28 sm:px-6 lg:pb-20">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            For tenants
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tenants
          </h1>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/80">
            At ASTA Property Management, we believe that renting a home should be a smooth,
            transparent, and secure experience. Our tenant services are designed to ensure you feel
            supported, informed, and respected at every stage of your tenancy — from application to
            move-out.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="space-y-8 text-sm text-muted sm:text-base">
            <p>
              We manage a diverse range of properties across East London, Islington, Hackney,
              Walthamstow, Tower Hamlets, Canary Wharf, and West Mersea. Whether you're looking for
              a furnished apartment, a pet-friendly home, or a short-term coastal let, ASTA offers
              properties that meet your needs with professionalism and care.
            </p>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Why Rent with ASTA?</h2>
              <ul className="space-y-1">
                <li>✓ Modern, well-maintained homes — including furnished, unfurnished, pet-friendly, and “ready to move in” flats</li>
                <li>✓ Responsive maintenance — with a 24/7 request system and vetted contractors</li>
                <li>✓ Clear, compliant documentation — no hidden fees or confusing clauses</li>
                <li>✓ Digital tenancy management — apply, sign, pay, and renew online</li>
                <li>✓ Professional support team — including in-house managers and on-call assistance</li>
              </ul>
              <p>
                Our team — led by Theresia Petersen and supported by property managers Misha and
                Mariia — is known for being approachable, efficient, and genuinely helpful.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">How to Apply</h2>
              <p>
                The application process is simple and transparent. You will be asked to:
              </p>
              <ul className="space-y-1">
                <li>• Complete our digital Rental Application Form</li>
                <li>• Provide references and proof of ID/income</li>
                <li>• Undergo Right to Rent checks and affordability screening</li>
              </ul>
              <p>
                Once approved, you'll receive your Assured Shorthold Tenancy Agreement, deposit
                protection details, and move-in instructions.
              </p>
              <p>
                We pride ourselves on clear communication and fast turnarounds, so you're never left
                waiting or guessing.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">During Your Tenancy</h2>
              <p>We provide tenants with:</p>
              <ul className="space-y-1">
                <li>• A secure tenant portal for rent payments, documents, and communications</li>
                <li>• Online submission for maintenance requests (photos/videos required)</li>
                <li>• 24-hour support for urgent issues</li>
                <li>• Compliance-confirmed housing (EPC, EICR, gas safety, and fire safety)</li>
                <li>• Annual inspections with feedback and repair tracking</li>
                <li>• Respectful notice for property visits or work</li>
              </ul>
              <p>
                We aim to ensure your comfort and satisfaction throughout your tenancy. Our
                properties are professionally maintained and regularly inspected to maintain high
                standards.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Your Rights and Responsibilities</h2>
              <p>
                We’re committed to fair housing practices and support the rights of every tenant.
                You will receive:
              </p>
              <ul className="space-y-1">
                <li>• The latest How to Rent guide from the UK government</li>
                <li>• Full information on your deposit and how it’s protected</li>
                <li>• A copy of your tenancy agreement and certificates</li>
                <li>• Clear guidance on notice periods, renewals, and termination procedures</li>
              </ul>
              <p>
                We also make sure you know your responsibilities as a tenant — from reporting
                maintenance promptly to adhering to agreed house rules.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">FAQs and Tenant Resources</h2>
              <p>
                Our FAQs page includes answers to common questions about renting with ASTA — from
                how to report issues to how to prepare for your move-out inspection. You can also
                find links to official resources on tenant rights and responsibilities.
              </p>
              <p>
                Visit our{" "}
                <Link href="/faqs" className="text-primary hover:text-primary-light">
                  FAQs
                </Link>{" "}
                page or{" "}
                <Link href="/contact-us" className="text-primary hover:text-primary-light">
                  contact us
                </Link>{" "}
                if you need further guidance.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Tenant Portal
              </h2>
              <p className="mt-3 text-sm text-muted">
                Create an account to view rent, documents, and maintenance requests, or sign in if
                you already have access.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light"
                >
                  Create an account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-lg border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-panel/60 p-5">
              <h2 className="text-sm font-semibold text-white">Maintenance</h2>
              <p className="mt-2 text-sm text-muted">
                Use our{" "}
                <Link href="/maintenance-request" className="text-primary hover:text-primary-light">
                  maintenance request form
                </Link>{" "}
                to report issues. We&apos;ll coordinate repairs and keep you updated.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
