import Link from "next/link";
import Image from "next/image";

const ACCREDITATION_LOGOS = [
  {
    src: "/accreditations/safeagent.png",
    alt: "safeagent accredited",
    width: 132,
    height: 72,
  },
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
    src: "/accreditations/green-small-business.png",
    alt: "Green Small Business Certified",
    width: 108,
    height: 72,
  },
] as const;

const MARQUEE_LOGOS = [...ACCREDITATION_LOGOS, ...ACCREDITATION_LOGOS, ...ACCREDITATION_LOGOS] as const;

const BRAND_GOLD = "#CBA38C";

function AccreditationMarquee() {
  return (
    <div
      className="relative overflow-hidden bg-transparent"
      aria-label="Accreditations and memberships"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-20"
        aria-hidden
      />
      <div className="flex w-full overflow-hidden bg-transparent">
        <div className="flex w-max animate-footer-marquee will-change-transform bg-transparent">
          {[0, 1].map((set) => (
            <div
              key={set}
              className="flex shrink-0 items-center gap-6 bg-transparent px-3 sm:gap-8 sm:px-4 md:gap-10"
            >
              {MARQUEE_LOGOS.map((logo, index) => (
                <div
                  key={`${set}-${logo.src}-${index}`}
                  className="flex shrink-0 items-center bg-transparent"
                >
                  <span
                    role="img"
                    aria-label={logo.alt}
                    className="block"
                    style={
                      {
                        width: `${logo.width}px`,
                        height: `${logo.height}px`,
                        backgroundColor: BRAND_GOLD,
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
  return (
    <footer className="mt-auto border-t border-white/5 bg-black text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block bg-transparent">
              <Image
                src="/asta-logo.png"
                alt="ASTA Property Management"
                width={140}
                height={42}
                className="h-12 w-auto object-contain object-left bg-transparent"
                style={{ background: "transparent" }}
                unoptimized
              />
            </Link>
            <p className="mt-2 text-sm text-white/60">
              Curated properties. A seamless experience.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/owners" className="hover:text-white">For Owners</Link></li>
              <li><Link href="/tenants" className="hover:text-white">For Tenants</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
              <li><Link href="/property-listings" className="hover:text-white">Properties</Link></li>
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Support</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/faqs" className="block hover:text-white">FAQs</Link></li>
              <li><Link href="/maintenance-request" className="block hover:text-white">Maintenance Request</Link></li>
              <li><Link href="/login-portal" className="block hover:text-white">Client Portal</Link></li>
              <li><Link href="/login-portal-help" className="block hover:text-white">Portal Help</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/privacy" className="block hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="block hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <AccreditationMarquee />
        </div>
        <p className="mt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} ASTA Property Management
        </p>
      </div>
    </footer>
  );
}
