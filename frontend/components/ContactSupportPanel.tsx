import Link from "next/link";

type ContactSupportPanelProps = {
  className?: string;
};

export default function ContactSupportPanel({ className = "" }: ContactSupportPanelProps) {
  return (
    <section
      className={`mt-12 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-panel/70 to-secondary/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-8 ${className}`}
      aria-label="Support and contact details"
    >
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/90">Need support?</p>
      <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">We are here to help</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
        Reach out to our team for document guidance, maintenance help, portal access, or tenancy questions.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <a
          href="mailto:hello@astaone.co.uk"
          className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/90 transition hover:border-primary/40 hover:text-primary"
        >
          hello@astaone.co.uk
        </a>
        <a
          href="tel:07452766766"
          className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/90 transition hover:border-primary/40 hover:text-primary"
        >
          07452 766766
        </a>
        <p className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/75">
          Mon-Fri, 9:00 AM-5:30 PM
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/contact-us" className="btn-primary">
          Contact Support
        </Link>
        <Link
          href="/login-portal-help"
          className="inline-flex items-center rounded-md border-2 border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/10"
        >
          Portal Help & FAQ
        </Link>
      </div>
    </section>
  );
}
