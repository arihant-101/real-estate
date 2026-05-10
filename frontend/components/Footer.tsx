import Link from "next/link";
import Image from "next/image";

const ACCREDITATION_LOGOS = [
  {
    src: "/accreditations/tds.png",
    alt: "Tenancy Deposit Scheme member",
    width: 108,
    height: 72,
  },
  {
    src: "/accreditations/property-ombudsman.png",
    alt: "The Property Ombudsman",
    width: 156,
    height: 72,
  },
  {
    src: "/accreditations/nrla-mask.png",
    alt: "NRLA — National Residential Landlords Association",
    width: 140,
    height: 72,
  },
] as const;

const MARQUEE_LOGOS = [...ACCREDITATION_LOGOS, ...ACCREDITATION_LOGOS, ...ACCREDITATION_LOGOS] as const;

/** Muted taupe for accreditation marks (less bright than primary `text-primary` gold on dark). */
const ACCREDITATION_MARK_COLOR = "#8E7262";
const QUICK_LINKS = [
  { href: "/owners", label: "For Owners" },
  { href: "/tenants", label: "For Tenants" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/property-listings", label: "Properties" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact" },
] as const;

const SUPPORT_LINKS = [
  { href: "/faqs", label: "FAQs" },
  { href: "/maintenance-request", label: "Maintenance Request" },
  { href: "/login-portal", label: "Client Portal" },
  { href: "/login-portal-help", label: "Portal Help" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

function AccreditationMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden bg-transparent"
      aria-label="Accreditations and memberships"
    >
      <div className="flex w-full overflow-hidden bg-transparent">
        <div className="flex w-max animate-footer-marquee will-change-transform bg-transparent">
          {[0, 1].map((set) => (
            <div
              key={set}
              className="flex shrink-0 items-center gap-6 bg-transparent px-0 sm:gap-8 md:gap-10"
            >
              {MARQUEE_LOGOS.map((logo, index) => (
                <div
                  key={`${set}-${logo.src}-${index}`}
                  className="flex h-[72px] shrink-0 items-center bg-transparent"
                >
                  <span
                    role="img"
                    aria-label={logo.alt}
                    className="block opacity-[0.82]"
                    style={
                      {
                        width: `${logo.width}px`,
                        height: `${logo.height}px`,
                        backgroundColor: ACCREDITATION_MARK_COLOR,
                        WebkitMaskImage: `url(${logo.src})`,
                        maskImage: `url(${logo.src})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        maskMode: "luminance",
                        WebkitMaskMode: "luminance",
                      } as React.CSSProperties & { WebkitMaskMode?: "luminance" }
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const linkClass =
    "inline-block rounded-sm text-[15px] text-white/85 transition-all duration-300 ease-out hover:text-primary hover:translate-x-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
  const headingClass = "text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/90";

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-primary/35 bg-gradient-to-br from-[#121111] via-[#0f0e0e] to-[#080808] text-muted">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_20%_-15%,rgba(203,163,140,0.14),transparent_65%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_85%_120%,rgba(203,163,140,0.09),transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/65 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_0.9fr]">
          <div>
            <Link
              href="/"
              className="inline-block rounded-sm transition-opacity duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <Image
                src="/asta-logo.png"
                alt="ASTA Property Management"
                width={140}
                height={42}
                className="h-12 w-auto object-contain object-left"
                style={{ background: "transparent" }}
                unoptimized
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/72">
              Curated properties. A seamless experience.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary/85">Need assistance?</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Reach our team for landlord support, tenant guidance, and premium property management help.
              </p>
              <Link
                href="/contact-us"
                className="mt-4 inline-flex items-center rounded-md border border-primary/45 bg-primary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-primary hover:bg-primary/15"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <p className={headingClass}>Explore</p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headingClass}>Support</p>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headingClass}>Legal</p>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-y border-primary/20 bg-black/20 py-7 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.03),inset_0_-1px_0_0_rgba(255,255,255,0.03)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#0b0b0b] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#0b0b0b] to-transparent" aria-hidden />
        <AccreditationMarquee />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-7 sm:px-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/52">
          © {new Date().getFullYear()} ASTA Property Management
        </p>
      </div>
    </footer>
  );
}
