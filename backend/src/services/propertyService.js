import { prisma } from "../lib/prisma.js";

export async function listProperties({
  page = 1,
  limit = 12,
  minPrice,
  maxPrice,
  beds,
  areaId,
  listingType,
  featured,
  search,
}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (minPrice != null || maxPrice != null) {
    where.pricePerMonth = {};
    if (minPrice != null) where.pricePerMonth.gte = Number(minPrice);
    if (maxPrice != null) where.pricePerMonth.lte = Number(maxPrice);
  }
  if (beds != null) where.beds = { gte: Number(beds) };
  if (areaId) where.areaId = areaId;
  if (listingType) where.listingType = listingType;
  if (featured === "true" || featured === true) where.isFeatured = true;
  where.status = "LIVE";
  if (search && search.trim()) {
    where.OR = [
      { title: { contains: search.trim(), mode: "insensitive" } },
      { description: { contains: search.trim(), mode: "insensitive" } },
      { address: { contains: search.trim(), mode: "insensitive" } },
      { city: { contains: search.trim(), mode: "insensitive" } },
    ];
  }
  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        area: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);
  return { items, total, page, limit };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPropertyById(idOrSlug, options = {}) {
  const { forPublic = true } = options;
  const isUuid = UUID_REGEX.test(idOrSlug);
  const where = isUuid ? { id: idOrSlug } : { slug: idOrSlug };
  if (forPublic) where.status = "LIVE";
  const property = await prisma.property.findFirst({
    where,
    include: {
      images: { orderBy: { order: "asc" } },
      area: true,
    },
  });
  if (!property) {
    const err = new Error("Property not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  return property;
}
