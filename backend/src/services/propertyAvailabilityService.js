import { prisma } from "../lib/prisma.js";

export async function listByProperty(propertyId, landlordId = null) {
  const where = { propertyId };
  if (landlordId) {
    where.property = { landlordId };
  }
  return prisma.propertyAvailability.findMany({
    where,
    orderBy: { startDate: "asc" },
  });
}

export async function listAvailableForTenant(propertyId) {
  const [availability, tenancies] = await Promise.all([
    prisma.propertyAvailability.findMany({
      where: { propertyId },
      orderBy: { startDate: "asc" },
    }),
    prisma.tenancy.findMany({
      where: {
        propertyId,
        status: { in: ["ACTIVE", "NOTICE_GIVEN"] },
      },
      select: { startDate: true, endDate: true },
    }),
  ]);
  if (availability.length === 0) return [];
  const now = new Date();
  const blockedRanges = tenancies.map((t) => ({
    start: new Date(t.startDate),
    end: t.endDate ? new Date(t.endDate) : new Date(now.getFullYear() + 10, 0, 1),
  }));
  return availability
    .map((a) => ({
      id: a.id,
      startDate: a.startDate,
      endDate: a.endDate,
    }))
    .filter((a) => {
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      if (end < now) return false;
      const overlapsBlocked = blockedRanges.some(
        (b) => (start <= b.end && end >= b.start)
      );
      return !overlapsBlocked;
    });
}

export async function add(propertyId, landlordId, { startDate, endDate }) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
  });
  if (!property) {
    const err = new Error("Property not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) {
    const err = new Error("End date must be after start date");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  return prisma.propertyAvailability.create({
    data: { propertyId, startDate: start, endDate: end },
  });
}

export async function remove(id, landlordId) {
  const existing = await prisma.propertyAvailability.findFirst({
    where: { id, property: { landlordId } },
  });
  if (!existing) {
    const err = new Error("Availability block not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  return prisma.propertyAvailability.delete({ where: { id } });
}
