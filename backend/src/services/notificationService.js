import { prisma } from "../lib/prisma.js";
import { CHANNEL_REPAIRS_WIZARD } from "./maintenanceRequestService.js";

/**
 * Returns notifications for the current user based on role.
 * Tenants: their maintenance requests + applications
 * Landlords: maintenance + applications on their properties
 */
export async function getNotificationsForUser(userId, role, limit = 20) {
  const take = Math.min(Math.max(Number(limit) || 20, 1), 50);

  if (role === "LANDLORD") {
    const [maintenance, applications] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where: {
          property: { landlordId: userId },
          channel: { not: CHANNEL_REPAIRS_WIZARD },
        },
        orderBy: { updatedAt: "desc" },
        take,
        include: {
          property: { select: { id: true, title: true } },
        },
      }),
      prisma.tenancyApplication.findMany({
        where: { property: { landlordId: userId } },
        orderBy: { updatedAt: "desc" },
        take,
        include: {
          property: { select: { id: true, title: true } },
          applicant: { select: { name: true, email: true } },
        },
      }),
    ]);
    const items = [
      ...maintenance.map((m) => ({
        type: "maintenance",
        id: m.id,
        title: `Maintenance: ${m.issueCategory}`,
        message: `${m.tenantName || "Tenant"} · ${m.property?.title || "Property"} · ${m.status}`,
        link: m.propertyId ? `/portal/properties/${m.propertyId}` : "/portal",
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      ...applications.map((a) => ({
        type: "application",
        id: a.id,
        title: `Application: ${a.name}`,
        message: `${a.property?.title || "Property"} · ${a.status}`,
        link: a.propertyId ? `/portal/properties/${a.propertyId}` : "/portal",
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    ];
    items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return { items: items.slice(0, take) };
  }

  if (role === "TENANT") {
    const [maintenance, applications] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where: { tenantId: userId },
        orderBy: { updatedAt: "desc" },
        take,
        include: {
          property: { select: { id: true, title: true } },
        },
      }),
      prisma.tenancyApplication.findMany({
        where: { applicantId: userId },
        orderBy: { updatedAt: "desc" },
        take,
        include: {
          property: { select: { id: true, title: true } },
        },
      }),
    ]);
    const items = [
      ...maintenance.map((m) => ({
        type: "maintenance",
        id: m.id,
        title: `Maintenance: ${m.issueCategory}`,
        message: `${m.property?.title || "Property"} · ${m.status}`,
        link: "/portal/maintenance",
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      ...applications.map((a) => ({
        type: "application",
        id: a.id,
        title: `Application: ${a.property?.title || "Property"}`,
        message: `Status: ${a.status}`,
        link: "/portal/applications",
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    ];
    items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return { items: items.slice(0, take) };
  }

  return { items: [] };
}
