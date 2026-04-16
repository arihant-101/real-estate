import type { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "../faqs/FAQAccordion";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = {
  title: "Login Portal Instructions & FAQ | ASTA Property Management",
  description:
    "Step-by-step instructions and frequently asked questions for accessing and using ASTA Property Management's secure client portal.",
};

const faqs = [
  {
    question: "What can I do in the landlord portal?",
    answer:
      "You can view rent payments and financial statements, access tenancy and compliance documents, track maintenance requests, and receive notifications about inspections, rent reviews, and lease renewals.",
  },
  {
    question: "What can tenants manage through the portal?",
    answer:
      "Tenants can pay rent securely, submit and track maintenance requests with photos or videos, download tenancy agreements and receipts, and view move-in/move-out checklists.",
  },
  {
    question: "Is my personal and payment data safe?",
    answer:
      "Absolutely. The portal employs advanced encryption, two-factor authentication, and complies fully with UK GDPR requirements to protect your data.",
  },
  {
    question: "Can I access the portal on my mobile device?",
    answer:
      "Yes. The portal is fully responsive and works seamlessly on smartphones and tablets.",
  },
  {
    question: "How do I upload maintenance photos or videos?",
    answer:
      "When submitting a maintenance request, use the upload feature to attach files directly from your device. Clear photos, including close-ups and wider shots, help contractors assess and resolve issues efficiently.",
  },
  {
    question: "What if I notice an error in my financial statements?",
    answer:
      "Please contact our finance team immediately at hello@astaone.co.uk. We will investigate and correct any discrepancies promptly.",
  },
  {
    question: "Can I add multiple users (e.g., co-landlords or family members)?",
    answer:
      "At present, login credentials are individual. If you require additional access, please notify ASTA so we can discuss authorised user options.",
  },
  {
    question: "How often is portal information updated?",
    answer:
      "Data such as rent payments, maintenance status, and reports are updated in real-time or within 24 hours of processing.",
  },
];

export default function LoginPortalHelpPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[40vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/images/login-portal-help-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-28 sm:px-6 lg:pb-20">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            Support & Help
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Login Portal
            <br />
            <span className="text-primary">Instructions & FAQ</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/80">
            Step-by-step instructions and frequently asked questions for accessing and using
            ASTA Property Management's secure client portal.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-8">
              {/* Getting Started Section */}
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <h2 className="text-xl font-semibold text-white">
                  Getting Started: How to Access the Portal
                </h2>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      1. Initial Login Credentials
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      You will receive your unique username and temporary password via email
                      when your tenancy or management agreement is activated. Please check
                      your inbox (and spam folder) for this information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      2. First-Time Login
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      Visit the portal and enter your credentials. You will be
                      prompted to change your password to something secure and memorable.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      3. Password Reset
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      If you forget your password, click the "Forgot Password" link on the login page.
                      You will be asked to enter your registered email address to receive a secure
                      reset link. For further assistance, contact ASTA support at{" "}
                      <a href="mailto:hello@astaone.co.uk" className="text-primary hover:text-primary-light">
                        hello@astaone.co.uk
                      </a>{" "}
                      or call{" "}
                      <a href="tel:07452766766" className="text-primary hover:text-primary-light">
                        07452 766766
                      </a>.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-light"
                  >
                    Access Portal
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <h2 className="text-xl font-semibold text-white">Common Questions</h2>
                <FAQAccordion
                  className="mt-6"
                  items={faqs.map((f) => ({ q: f.question, a: f.answer }))}
                />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Quick Links */}
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Quick Links
                </h2>
                <nav className="mt-4 space-y-3">
                  <Link
                    href="/login"
                    className="block rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-light"
                  >
                    Login to Portal
                  </Link>
                  <Link
                    href="/login-portal"
                    className="block rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Portal Overview
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Register Account
                  </Link>
                </nav>
              </div>

              {/* Support Contact */}
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Need Further Help?
                </h2>
                <p className="mt-3 text-sm text-muted">
                  If you experience technical issues or require additional support, please contact
                  ASTA's dedicated client services team:
                </p>
                
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:hello@astaone.co.uk" className="text-white hover:text-primary">
                      hello@astaone.co.uk
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:07452766766" className="text-white hover:text-primary">
                      07452 766766
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-white">Office Hours:</p>
                      <p className="text-muted">Monday – Friday, 9:00 AM to 5:30 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}