import { prisma } from "../lib/prisma.js";

export async function listFavorites(userId) {
  const rows = await prisma.favorite.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          area: { select: { name: true, slug: true } },
        },
      },
    },
  });
  return rows.map((r) => r.property);
}

export async function addFavorite(userId, propertyId) {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    const err = new Error("Property not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  await prisma.favorite.upsert({
    where: { userId_propertyId: { userId, propertyId } },
    create: { userId, propertyId },
    update: {},
  });
  return { added: true };
}

export async function removeFavorite(userId, propertyId) {
  await prisma.favorite.deleteMany({
    where: { userId, propertyId },
  });
  return { removed: true };
}
