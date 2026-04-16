import { prisma } from "../lib/prisma.js";
import { CHANNEL_REPAIRS_WIZARD } from "./maintenanceRequestService.js";

export async function getPropertyAnalytics(propertyId, landlordId) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
  });
  if (!property) {
    const err = new Error("Property not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    viewsLast7d,
    viewsLast30d,
    viewsAllTime,
    maintenanceOpen,
    maintenanceResolved,
    applicationsPending,
    applicationsApproved,
    applicationsRejected,
    favoritesCount,
  ] = await Promise.all([
    prisma.propertyView.count({
      where: { propertyId, viewedAt: { gte: sevenDaysAgo } },
    }),
    prisma.propertyView.count({
      where: { propertyId, viewedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.propertyView.count({ where: { propertyId } }),
    prisma.maintenanceRequest.count({
      where: {
        propertyId,
        status: { notIn: ["resolved"] },
        channel: { not: CHANNEL_REPAIRS_WIZARD },
      },
    }),
    prisma.maintenanceRequest.count({
      where: {
        propertyId,
        status: "resolved",
        channel: { not: CHANNEL_REPAIRS_WIZARD },
      },
    }),
    prisma.tenancyApplication.count({
      where: { propertyId, status: "PENDING" },
    }),
    prisma.tenancyApplication.count({
      where: { propertyId, status: "APPROVED" },
    }),
    prisma.tenancyApplication.count({
      where: { propertyId, status: "REJECTED" },
    }),
    prisma.favorite.count({ where: { propertyId } }),
  ]);

  return {
    views: { last7d: viewsLast7d, last30d: viewsLast30d, allTime: viewsAllTime },
    maintenance: { open: maintenanceOpen, resolved: maintenanceResolved },
    applications: {
      pending: applicationsPending,
      approved: applicationsApproved,
      rejected: applicationsRejected,
    },
    favoritesCount,
  };
}
