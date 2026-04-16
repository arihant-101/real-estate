export type HomeListingProperty = {
  id: string;
  slug?: string;
  title: string;
  address: string;
  city: string;
  listingType: string;
  pricePerMonth: string | number;
  isFeatured?: boolean;
  beds?: number;
  baths?: number;
  areaSqFt?: number;
  images?: { url: string }[];
  areaId?: string | null;
};

/** Opens listings filtered by area when possible, otherwise by city search. */
export function propertyListingsHrefForNeighbourhood(
  p: Pick<HomeListingProperty, "areaId" | "city">
): string {
  if (p.areaId) {
    return `/property-listings?${new URLSearchParams({ areaId: p.areaId }).toString()}`;
  }
  const q = p.city?.trim();
  if (q) {
    return `/property-listings?${new URLSearchParams({ search: q }).toString()}`;
  }
  return "/property-listings";
}

/** Up to six properties, each from a distinct neighbourhood (areaId or city). */
export function pickSixDistinctNeighbourhoods(
  items: HomeListingProperty[]
): HomeListingProperty[] {
  const seen = new Set<string>();
  const out: HomeListingProperty[] = [];
  for (const p of items) {
    const key =
      (p.areaId && String(p.areaId).trim()) ||
      (p.city && p.city.trim().toLowerCase()) ||
      "";
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= 6) break;
  }
  return out;
}

/** Featured items first, then the rest without duplicate ids. */
export function buildListingPool(
  featured: HomeListingProperty[],
  more: HomeListingProperty[]
): HomeListingProperty[] {
  const out = [...featured];
  const ids = new Set(featured.map((p) => p.id));
  for (const p of more) {
    if (ids.has(p.id)) continue;
    ids.add(p.id);
    out.push(p);
  }
  return out;
}
