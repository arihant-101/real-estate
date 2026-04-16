import { prisma } from "../lib/prisma.js";

export async function recordPropertyView(propertyId, userId = null) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, status: "LIVE" },
  });
  if (!property) return null;
  return prisma.propertyView.create({
    data: { propertyId, userId },
  });
}

export async function listByProperty(propertyId, landlordId, limit = 50) {
  const take = Math.min(Math.max(Number(limit) || 50, 1), 100);
  return prisma.propertyView.findMany({
    where: { propertyId, property: { landlordId } },
    orderBy: { viewedAt: "desc" },
    take,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}
