import { prisma } from "../lib/prisma.js";

export async function getLandlordFinancialSummary(landlordId) {
  const properties = await prisma.property.findMany({
    where: { landlordId },
    include: {
      tenancies: {
        where: { status: "ACTIVE" },
        include: {
          rentLedgerEntries: {
            where: {
              dueDate: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
              },
            },
          },
        },
      },
    },
  });
  let dueThisMonth = 0;
  let collected = 0;
  let overdue = 0;
  for (const p of properties) {
    for (const t of p.tenancies) {
      for (const e of t.rentLedgerEntries) {
        if (e.type === "RENT") {
          const amt = Number(e.amount);
          if (e.status === "PAID") collected += amt;
          else if (e.status === "OVERDUE") overdue += amt;
          else dueThisMonth += amt;
        }
      }
    }
  }
  return { dueThisMonth, collected, overdue };
}

export async function getLandlordPropertyFinancials(propertyId, landlordId) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
    include: {
      tenancies: {
        include: {
          tenant: { select: { id: true, name: true, email: true } },
          rentLedgerEntries: { orderBy: { dueDate: "desc" }, take: 24 },
        },
      },
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

export async function getTenantFinancials(tenantId) {
  const tenancy = await prisma.tenancy.findFirst({
    where: { tenantId, status: "ACTIVE" },
    include: {
      property: { select: { id: true, title: true, address: true } },
      rentLedgerEntries: { orderBy: { dueDate: "desc" }, take: 24 },
    },
  });
  if (!tenancy) return { tenancy: null, entries: [] };
  return {
    tenancy: {
      id: tenancy.id,
      property: tenancy.property,
      rentAmount: tenancy.rentAmount,
      startDate: tenancy.startDate,
    },
    entries: tenancy.rentLedgerEntries,
  };
}
