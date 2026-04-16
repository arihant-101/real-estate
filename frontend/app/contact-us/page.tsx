import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact Our London Property Management Team",
  description:
    "Contact our team for property management services, rental enquiries, and landlord support in London.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="max-w-2xl">
        <p className="section-label">Contact</p>
        <h1 className="section-heading mt-2">Contact us</h1>
        <p className="section-subheading mt-3">
          Whether you're a landlord ready to optimise your portfolio or a tenant seeking responsive
          support, we’re here to help. We usually respond within one working day.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        <section className="rounded-2xl border border-white/10 bg-panel/60 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.55)] sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Send an enquiry</h2>
              <p className="mt-1 text-sm text-elegant-muted">
                From full-service property management to holiday lets and tenant support, tell us
                what you need and we&apos;ll follow up with tailored options.
              </p>
            </div>
          </div>

          <EnquiryForm variant="dark" />

          <p className="mt-4 text-xs text-elegant-muted">
            By submitting, you agree to us contacting you about this enquiry. For more details, see
            our privacy policy.
          </p>
        </section>

        <aside className="space-y-5 lg:space-y-6">
          <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 sm:p-7">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Office
            </h2>
            <p className="mt-3 text-sm text-elegant-muted">
              ASTA Property Management
              <br />
              36 Northumberland Avenue
              <br />
              London, E12 5HD
              <br />
              United Kingdom
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Phone
                </dt>
                <dd>
                  <a
                    href="tel:+447452766766"
                    className="text-sm font-medium text-white hover:text-white/80"
                  >
                    07452 766766
                  </a>
                  <p className="text-xs text-elegant-muted">Monday – Friday: 9:00 – 17:30</p>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Email
                </dt>
                <dd>
                  <a
                    href="mailto:hello@astaone.co.uk"
                    className="text-sm font-medium text-white hover:text-white/80"
                  >
                    hello@astaone.co.uk
                  </a>
                  <p className="text-xs text-elegant-muted">
                    For legal or policy matters, email info@astapm.co.uk.
                  </p>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-dashed border-white/15 bg-panel/40 p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white">Best for quick questions</h3>
            <p className="mt-2 text-sm text-elegant-muted">
              Use the form for detailed enquiries such as:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-elegant-muted">
              <li>— Booking a viewing or valuation</li>
              <li>— Discussing property management options</li>
              <li>— Getting help with an existing tenancy</li>
              <li>— Anything else related to our properties</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

