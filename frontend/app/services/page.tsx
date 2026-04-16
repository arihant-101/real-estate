import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Property Management Services in London",
  description:
    "Explore our London property management services including tenant placement, property maintenance, rent collection, and landlord support.",
  path: "/services",
});

const services = [
  {
    href: "/services/tenant-placement-screening",
    title: "Tenant Placement and Screening",
    desc: "Professional marketing, thorough vetting, and compliant onboarding to secure the right tenant for every tenancy.",
    image: "/images/service-tenant-placement-hero.png",
    icon: "◇",
    stats: ["500+", "Tenants Placed"],
  },
  {
    href: "/services/property-maintenance-inspections",
    title: "Property Maintenance and Inspections",
    desc: "Proactive and responsive maintenance, regular inspections, and digital logs that protect your asset.",
    image: "/images/services-maintenance-inspections-custom.png",
    icon: "◆",
    stats: ["24/7", "Support"],
  },
  {
    href: "/services/financial-management",
    title: "Financial Management and Reporting",
    desc: "Transparent rent collection, arrears tracking, and clear, export-ready financial reporting for your portfolio.",
    image: "/images/services-financial-management-custom.png",
    icon: "◈",
    stats: ["100%", "On-Time"],
  },
  {
    href: "/services/holiday-lettings",
    title: "Holiday Let Management",
    desc: "Licensing, dynamic pricing, guest experience, and compliance for holiday homes in West Mersea and beyond.",
    image: "/images/service-holiday-lettings-hero.png",
    icon: "❖",
    stats: ["5★", "Guest Focus"],
  },
  {
    href: "/services/client-services",
    title: "Client Services and Compliance",
    desc: "Licensing, legal documentation, and NRLA-aligned tenancy support to keep you ahead of regulation.",
    image: "/images/services-client-services-card.jpg",
    icon: "▣",
    stats: ["NRLA", "Aligned"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with background image */}
      <section className="relative page-banner flex min-h-[50vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/services-index-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:pb-24">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            What we do
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Property management,
            <br />
            tailored to every tenancy
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            At ASTA Property Management, we deliver an integrated suite of services — from tenant
            placement and day-to-day management to holiday lets and regulatory support — designed
            to make every tenancy smooth, compliant, and rewarding.
          </p>
        </div>
      </section>

      {/* Service cards with background images */}
      <section className="relative border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-8 lg:gap-12">
            {services.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex min-h-[280px] flex-col justify-between p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-12">
                  <div className="max-w-2xl">
                    <span className="inline-block text-2xl text-primary">{s.icon}</span>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-white/80 sm:text-lg">
                      {s.desc}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary transition-transform group-hover:translate-x-1">
                      Read more
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-8 flex items-center gap-6 lg:mt-0 lg:flex-col lg:items-end lg:gap-2">
                    <span className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                      {s.stats[0]}
                    </span>
                    <span className="text-sm font-medium uppercase tracking-widest text-white/60">
                      {s.stats[1]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Trust bar */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "2,000+", label: "Properties Managed" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url(/images/services-cta-background.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to simplify property management?
          </h2>
          <p className="mt-3 text-white/80">
            Get in touch and discover how we can help you maximise your investment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact-us" className="btn-hero">
              Get in touch
            </Link>
            <Link
              href="/property-listings"
              className="inline-flex items-center justify-center rounded-md border-2 border-white/40 bg-transparent px-6 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
            >
              View properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
