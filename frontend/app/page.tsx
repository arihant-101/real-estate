import dynamic from "next/dynamic";
import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { HorizontalSearch } from "@/components/HorizontalSearch";
import {
  buildListingPool,
  pickSixDistinctNeighbourhoods,
  propertyListingsHrefForNeighbourhood,
  type HomeListingProperty,
} from "@/lib/home-properties";
import { getAreas, getFeaturedProperties, getProperties } from "@/lib/server-api";
import { STATIC_TESTIMONIALS } from "@/lib/testimonials";

/** Revalidate cached homepage data every 60s (ISR). */
export const revalidate = 60;

const EnquiryForm = dynamic(
  () => import("@/components/forms/EnquiryForm").then((mod) => ({ default: mod.EnquiryForm })),
  { ssr: true }
);

/** Default hero: Pexels #7578550, 1080p (same clip, smaller file than UHD). Override with NEXT_PUBLIC_HERO_BG_VIDEO_URL; `false` = static image. */
const PEXELS_HERO_BG_MP4 =
  "https://videos.pexels.com/video-files/7578550/7578550-hd_1920_1080_30fps.mp4";

const HERO_BG_VIDEO_URL = (() => {
  const env = process.env.NEXT_PUBLIC_HERO_BG_VIDEO_URL?.trim();
  if (env === "false" || env === "0") return "";
  return env || PEXELS_HERO_BG_MP4;
})();

/** Hero video poster (buffering) — same mood as "By the numbers" still */
const HERO_POSTER_IMAGE =
  "/images/home-hero-poster.jpg";

/** Original hero still when video is disabled (`NEXT_PUBLIC_HERO_BG_VIDEO_URL=false`) */
const HERO_STATIC_FALLBACK_IMAGE =
  "/images/home-hero-static-fallback.jpg";

/** Testimonials section — photo only */
const TESTIMONIALS_BG_IMAGE =
  "/images/home-testimonials-section-bg.jpg";

export default async function HomePage() {
  // Make API calls fault-tolerant by ensuring they never throw
  let areas: any[] = [];
  let featuredList: HomeListingProperty[] = [];
  let allItems: HomeListingProperty[] = [];

  try {
    const [areasResult, featuredResult, allResult] = await Promise.allSettled([
      getAreas().catch(() => []),
      getFeaturedProperties().catch(() => ({ items: [] })),
      getProperties({ limit: "24" }).catch(() => ({ items: [] })),
    ]);

    if (areasResult.status === 'fulfilled') {
      areas = areasResult.value ?? [];
    }
    
    if (featuredResult.status === 'fulfilled') {
      featuredList = (featuredResult.value?.items ?? []) as HomeListingProperty[];
    }
    
    if (allResult.status === 'fulfilled') {
      allItems = (allResult.value?.items ?? []) as HomeListingProperty[];
    }
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    // Continue with empty arrays
  }

  const listingPool = buildListingPool(featuredList, allItems);
  const showcaseSix = pickSixDistinctNeighbourhoods(listingPool);
  const areaList = areas;

  const homeSection = "min-h-full flex-shrink-0";

  return (
    <div className="h-full overflow-y-auto">
      {/* 1. Hero — video (default) or static house image */}
      <section className={`relative page-banner ${homeSection} flex flex-col overflow-hidden bg-surface`}>
        {HERO_BG_VIDEO_URL ? (
          <video
            className="absolute inset-0 h-full min-h-full w-full min-w-full object-cover object-center opacity-[0.82] brightness-[1.12] contrast-[1.06] saturate-[1.05]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER_IMAGE}
            aria-hidden
          >
            <source src={HERO_BG_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.82] brightness-[1.08] contrast-[1.05]"
            style={{ backgroundImage: `url(${HERO_STATIC_FALLBACK_IMAGE})` }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/22 via-black/52 to-black/78" />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-14 sm:px-6 lg:py-20">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Full-service management
                <br />
                for landlords &amp; tenants
              </h1>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/property-listings" className="btn-hero">
                  View all listings
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/5 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:border-white hover:bg-white/10"
                >
                  View services
                </Link>
              </div>
              <div className="mt-20 w-full max-w-6xl mx-auto">
                <HorizontalSearch areas={areaList} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro copy – full text below the hero */}
      <section className={`${homeSection} relative flex flex-col overflow-hidden bg-surface`}>
        {/* Golden accent graphics */}
        <div className="absolute left-0 top-1/4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-40 w-40 rounded-full bg-gradient-to-tl from-secondary/15 to-primary/5 blur-3xl" />
        <div className="absolute left-1/3 top-0 h-24 w-24 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
        
        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:py-14">
          {/* Decorative golden line */}
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative space-y-6 text-sm leading-relaxed text-elegant-muted sm:text-base lg:text-lg">
              {/* Golden accent border */}
              <div className="absolute -left-4 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-secondary/20 to-transparent" />
              
              <p className="relative text-base font-medium text-elegant sm:text-lg lg:text-xl">
                <span className="absolute -left-6 top-2 h-2 w-2 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50" />
                Welcome to ASTA Property Management — a refined, full-service property management
                firm based in London, dedicated to elevating rental experiences for landlords,
                tenants, and investors alike. We combine operational excellence with personable,
                transparent service to deliver seamless tenancy management, strategic property
                marketing, and legally compliant oversight across short- and long-term rentals.
              </p>
              <p>
                Led by Director Theresia Petersen, and supported by an expert team of experienced
                professionals, ASTA is committed to setting a new standard in property
                management. Whether you own a single flat or a diverse portfolio, we provide
                tailored support with a focus on longevity, legal compliance, and rental return.
              </p>
              <p>
                Our team works across key London boroughs including Walthamstow, Islington,
                Hackney, East India Docks, Tower Hamlets, and West Mersea. From modern,
                well-appointed apartments to charming holiday lets, ASTA ensures every property is
                maintained to the highest standards — and every client receives bespoke,
                concierge-level service.
              </p>
            </div>
            
            <div className="relative space-y-6 text-sm leading-relaxed text-elegant-muted sm:text-base lg:text-lg">
              {/* Golden accent elements */}
              <div className="absolute -right-4 bottom-0 h-2/3 w-px bg-gradient-to-t from-primary/40 via-secondary/20 to-transparent" />
              
              <p className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 shadow-lg backdrop-blur-sm">
                <span className="absolute -top-2 right-4 h-4 w-4 rotate-45 bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/50" />
                Explore our current Property Listings, learn more About Us, or view our full
                suite of Services. Landlords can access tailored resources via our Owners Portal,
                while tenants benefit from dedicated support, application guidance, and responsive
                maintenance reporting through our Tenants Page.
              </p>
              <p className="relative">
                <span className="absolute -right-6 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-secondary to-primary shadow-lg shadow-secondary/50" />
                At ASTA, we believe that intelligent property management blends efficiency with
                empathy, compliance with communication, and results with relationships. Let us
                help you unlock the full potential of your rental investment — one detail at a
                time. Contact us today or visit our FAQ page to learn more.
              </p>
            </div>
          </div>
          
          {/* Bottom decorative golden line */}
          <div className="mx-auto mt-8 h-px w-32 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </div>
      </section>

      {/* 2. Six listings — content-height only (no min-h-full) so the marquee band isn't stretched in the layout */}
      <section className="flex shrink-0 flex-col bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 sm:px-6">
          <p className="section-label">Properties</p>
          <h2 className="section-heading mt-2">Across London neighbourhoods</h2>
          <p className="section-subheading">
            Six current homes from six different areas. Open a card to see every available listing
            in that neighbourhood — filter, compare, and shortlist on the next screen.
          </p>
          {showcaseSix.length > 0 ? (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {showcaseSix.map((p) => (
                  <PropertyCard
                    key={p.id}
                    href={propertyListingsHrefForNeighbourhood(p)}
                    id={p.id}
                    slug={p.slug}
                    title={p.title}
                    address={p.address}
                    city={p.city}
                    listingType={p.listingType}
                    pricePerMonth={p.pricePerMonth}
                    imageUrl={p.images?.[0]?.url}
                    isFeatured={p.isFeatured}
                    beds={p.beds}
                    baths={p.baths}
                    areaSqFt={p.areaSqFt}
                  />
                ))}
              </div>
              <div className="mt-5 text-center">
                <Link href="/property-listings" className="btn-primary">
                  View all properties
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-6 flex flex-1 flex-col justify-center rounded-2xl border border-white/10 bg-panel/50 p-8 text-center">
              <p className="text-elegant-muted">
                No properties loaded. API is now configured to use your backend.
              </p>
              <p className="mt-2 text-sm text-elegant-muted">
                Backend API: <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">
                  https://www.astapropertymanagement.co.uk/api
                </code>
              </p>
              <Link href="/property-listings" className="btn-primary mt-4 inline-flex">
                Browse properties
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Get In Touch */}
      <section className={`${homeSection} relative flex flex-col overflow-hidden bg-surface`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.92] contrast-[1.08] saturate-[0.95]"
          style={{
            backgroundImage:
              "url(/images/home-contact-section-bg.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/42 to-black/65" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="section-label text-[var(--color-text)] text-shadow-primary-soft">Contact</p>
              <h2 className="section-heading mt-2 text-shadow-primary-soft">Get in touch</h2>
              <p className="section-subheading text-[var(--color-text)] text-shadow-primary-soft">
                Send an enquiry and we&apos;ll respond shortly.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-panel/50 p-6 backdrop-blur-sm sm:p-8">
              <EnquiryForm variant="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Achievements – pure black with gold typography */}
      <section className={`${homeSection} relative flex flex-col overflow-hidden bg-black`}>
        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-center text-[10px] font-medium uppercase tracking-[0.35em] text-primary/70">
            The numbers
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-4 lg:gap-8">
            {[
              { value: "£100M+", label: "Active value" },
              { value: "£200M+", label: "Lifetime sales" },
              { value: "32k+", label: "Happy clients" },
              { value: "15+", label: "Years experience" },
            ].map(({ value, label }) => (
              <div key={label} className="group text-center">
                <p className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl lg:text-[2rem]">
                  {value}
                </p>
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary/55 transition group-hover:text-primary/80">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials — photo background only */}
      <section className={`${homeSection} relative flex flex-col overflow-hidden bg-surface`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.86] contrast-[1.08] saturate-[0.95]"
          style={{ backgroundImage: `url(${TESTIMONIALS_BG_IMAGE})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/22" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/32 via-black/46 to-black/68"
          aria-hidden
        />
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:py-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text)] text-shadow-primary-soft">
            Testimonials
          </p>
          <h2 className="section-heading mt-4 text-center text-[var(--color-text)] text-shadow-primary-soft">
            What clients say
          </h2>
          <p className="section-subheading mx-auto mt-3 max-w-2xl text-center text-[var(--color-text)] text-shadow-primary-soft">
            A few words from landlords and tenants. Tap a card to read more reviews.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {STATIC_TESTIMONIALS.slice(0, 3).map((t) => (
              <Link
                key={t.name}
                href="/testimonials"
                className="group flex flex-col rounded-2xl border border-white/15 bg-panel/55 p-6 text-left shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur-sm transition hover:border-primary/40 hover:bg-panel/75 hover:shadow-[0_22px_50px_rgba(0,0,0,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <p className="text-sm leading-relaxed text-elegant-muted line-clamp-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-white group-hover:text-primary">
                    {t.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/50">
                    {t.role}
                  </p>
                </footer>
                <span className="mt-4 text-xs font-medium text-primary opacity-90 transition group-hover:opacity-100">
                  View all testimonials →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shrink-0">
        <Footer />
      </section>
    </div>
  );
}