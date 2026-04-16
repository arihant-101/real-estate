import { prisma } from "../lib/prisma.js";

export async function createApplication(data) {
  return prisma.tenancyApplication.create({
    data: {
      propertyId: data.propertyId,
      applicantId: data.applicantId ?? undefined,
      name: data.name,
      email: data.email,
      phone: data.phone ?? undefined,
      employment: data.employment ?? undefined,
      references: data.references ?? undefined,
    },
    include: { property: { select: { id: true, title: true, address: true } } },
  });
}

export async function listByTenant(applicantId) {
  return prisma.tenancyApplication.findMany({
    where: { applicantId },
    orderBy: { createdAt: "desc" },
    include: { property: { select: { id: true, title: true, address: true, city: true } } },
  });
}

export async function listByProperty(propertyId, landlordId) {
  return prisma.tenancyApplication.findMany({
    where: { propertyId, property: { landlordId } },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { id: true, title: true, address: true } },
      applicant: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getOneForLandlord(applicationId, landlordId) {
  const app = await prisma.tenancyApplication.findFirst({
    where: { id: applicationId, property: { landlordId } },
    include: { property: true, applicant: { select: { id: true, email: true, name: true } } },
  });
  if (!app) {
    const err = new Error("Application not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  return app;
}

export async function approve(applicationId, landlordId) {
  const app = await getOneForLandlord(applicationId, landlordId);
  if (app.status !== "PENDING") {
    const err = new Error("Application is no longer pending");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  const applicantId = app.applicantId || app.applicant?.id;
  if (!applicantId) {
    const err = new Error("Application must have an associated user account to approve");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  await prisma.$transaction(async (tx) => {
    await tx.tenancy.updateMany({
      where: { propertyId: app.propertyId, tenantId: applicantId, status: "ACTIVE" },
      data: { status: "ENDED", updatedAt: new Date() },
    });
    const tenancy = await tx.tenancy.create({
      data: {
        propertyId: app.propertyId,
        tenantId: applicantId,
        startDate: new Date(),
        rentAmount: app.property.pricePerMonth,
        depositAmount: null,
        status: "ACTIVE",
      },
    });
    const now = new Date();
    await tx.rentLedgerEntry.create({
      data: {
        tenancyId: tenancy.id,
        dueDate: now,
        amount: app.property.pricePerMonth,
        type: "RENT",
        status: "DUE",
      },
    });
    await tx.tenancyApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED", updatedAt: now },
    });
  });
  return prisma.tenancyApplication.findUnique({
    where: { id: applicationId },
    include: { property: true },
  });
}

export async function reject(applicationId, landlordId) {
  const app = await getOneForLandlord(applicationId, landlordId);
  if (app.status !== "PENDING") {
    const err = new Error("Application is no longer pending");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  return prisma.tenancyApplication.update({
    where: { id: applicationId },
    data: { status: "REJECTED", updatedAt: new Date() },
  });
}
