import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Client Portal Login | Landlords & Tenants",
  description:
    "Secure login portal for landlords and tenants to manage documents, maintenance requests, and tenancy information.",
  path: "/login-portal",
});

export default function LoginPortalPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[50vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/images/login-portal-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:pb-20">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            Client Portal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Login Portal
            <br />
            <span className="text-primary">Owners / Tenants</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/80">
            ASTA Property Management's secure Login Portal provides landlords and tenants
            with 24/7 access to vital account information and property management tools.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="space-y-8 text-sm text-muted sm:text-base">
            <p>
              Designed for convenience and transparency, our portal empowers you to manage
              payments, review documents, submit requests, and track progress — all from your
              desktop or mobile device.
            </p>

            {/* Portal Access Cards */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Landlords Section */}
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <h2 className="text-xl font-semibold text-white">
                  For Landlords: Your Property at Your Fingertips
                </h2>
                <p className="mt-3 text-sm text-muted">
                  Our landlord portal offers comprehensive control and visibility over your property
                  portfolio:
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  <li>• Real-time rent payment tracking and history</li>
                  <li>• Access to financial reports and statements</li>
                  <li>• Downloadable tenancy agreements, safety certificates, and inspection reports</li>
                  <li>• Maintenance request overviews and contractor communication logs</li>
                  <li>• Online submission for compliance documentation</li>
                  <li>• Notifications and reminders for important dates (rent reviews, certifications expiry, etc.)</li>
                </ul>
                <p className="mt-4 text-sm text-muted">
                  This digital hub is designed to save you time and reduce administrative burdens,
                  while keeping you informed about your investment's performance.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-light"
                  >
                    Access Landlord Portal
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Tenants Section */}
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <h2 className="text-xl font-semibold text-white">
                  For Tenants: Simple, Transparent Tenancy Management
                </h2>
                <p className="mt-3 text-sm text-muted">
                  Tenants benefit from a dedicated portal that makes renting easier:
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  <li>• View and pay rent securely online</li>
                  <li>• Access tenancy agreements and legal documents</li>
                  <li>• Submit maintenance requests with photo/video uploads</li>
                  <li>• Track status updates and communicate directly with the management team</li>
                  <li>• Download payment receipts and statements</li>
                  <li>• Review move-in/move-out checklists and schedules</li>
                </ul>
                <p className="mt-4 text-sm text-muted">
                  Our portal is accessible anytime, anywhere — ensuring a hassle-free renting
                  experience backed by professional support.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-light"
                  >
                    Access Tenant Portal
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
              <h2 className="text-xl font-semibold text-white">Security and Privacy</h2>
              <p className="mt-3 text-sm text-muted">
                We prioritise the security of your personal and financial data. The portal uses
                industry-leading encryption and multi-factor authentication to protect access. ASTA
                complies fully with UK GDPR regulations, and no data is shared with third parties
                without explicit consent.
              </p>
            </div>

            {/* Getting Started Section */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
              <h2 className="text-xl font-semibold text-white">Getting Started</h2>
              <p className="mt-3 text-sm text-muted">
                To access the portal, please use the login credentials provided at tenancy or
                management agreement commencement. Forgotten your password? Use the
                secure password reset option on the login page or contact our support team for
                assistance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-light"
                >
                  Login to Portal
                </Link>
                <Link
                  href="/login-portal-help"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Portal Help & FAQ
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted">
                ASTA Property Management's Login Portal brings transparency, efficiency, and
                control to your fingertips — whether you're a landlord overseeing multiple properties
                or a tenant managing your home.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}