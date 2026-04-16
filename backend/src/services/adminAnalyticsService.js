import { prisma } from "../lib/prisma.js";

export async function getDashboardStats() {
  // Single transaction = one DB connection (avoids exhausting Aiven’s small connection cap when
  // combined with Promise.all fan-out and dev hot-reload creating extra Prisma clients).
  const [
    landlordsCount,
    tenantsCount,
    propertiesCount,
    enquiriesCount,
    maintenanceByStatus,
    applicationsByStatus,
    recentMaintenance,
    recentApplications,
    recentEnquiries,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: "LANDLORD" } }),
    prisma.user.count({ where: { role: "TENANT" } }),
    prisma.property.count(),
    prisma.enquiry.count(),
    prisma.maintenanceRequest.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.tenancyApplication.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.maintenanceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { property: { select: { id: true, title: true, address: true } } },
    }),
    prisma.tenancyApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { property: { select: { id: true, title: true } } },
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, subject: true, source: true, createdAt: true },
    }),
  ]);

  const maintenance = { total: 0, pending: 0, in_progress: 0, resolved: 0 };
  for (const row of maintenanceByStatus) {
    maintenance.total += row._count.status;
    maintenance[row.status] = row._count.status;
  }

  const applications = { total: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };
  for (const row of applicationsByStatus) {
    applications.total += row._count.status;
    applications[row.status] = row._count.status;
  }

  return {
    landlordsCount,
    tenantsCount,
    propertiesCount,
    enquiriesCount,
    maintenance,
    applications,
    recentMaintenance,
    recentApplications,
    recentEnquiries,
  };
}