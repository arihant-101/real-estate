import Link from "next/link";

type PropertyCardProps = {
  /** When set, the card links here instead of the property detail page. */
  href?: string;
  id: string;
  slug?: string;
  title: string;
  address: string;
  city: string;
  listingType: string;
  pricePerMonth: string | number;
  imageUrl?: string | null;
  isFeatured?: boolean;
  beds?: number;
  baths?: number;
  areaSqFt?: number;
};

export function PropertyCard({
  href,
  id,
  slug,
  title,
  address,
  city,
  listingType,
  pricePerMonth,
  imageUrl,
  isFeatured,
  beds,
  baths,
  areaSqFt,
}: PropertyCardProps) {
  const typeLabel = listingType === "HOLIDAY_LET" ? "Holiday Let" : "Rental";
  const hrefSlug = slug ?? id;
  const to = href ?? `/properties/${hrefSlug}`;
  return (
    <Link
      href={to}
      className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-surface shadow-xl shadow-black/50 transition-all duration-300 hover:border-white/15 hover:shadow-2xl hover:shadow-black/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-panel">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            {/* Dark overlay so property pics match the black theme */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
              aria-hidden
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted text-sm">No image</div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isFeatured && (
            <span className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">
              Featured
            </span>
          )}
          <span className="rounded-md border border-white/20 bg-overlay/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            {typeLabel}
          </span>
        </div>
      </div>
      <div className="border-t border-white/[0.06] p-5">
        <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-white">{title}</h3>
        <p className="mt-1 text-sm text-muted">
          {address}, {city}
        </p>
        {(beds != null || baths != null || areaSqFt != null) && (
          <p className="mt-2 text-xs text-muted">
            {beds != null && `${beds} bed`}
            {baths != null && ` · ${baths} bath`}
            {areaSqFt != null && ` · ${areaSqFt.toLocaleString()} sq ft`}
          </p>
        )}
        <p className="mt-4 text-lg font-semibold text-white">
          £{Number(pricePerMonth).toLocaleString()}
          <span className="text-sm font-normal text-muted">/mo</span>
        </p>
      </div>
    </Link>
  );
}
