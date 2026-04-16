import { prisma } from "../lib/prisma.js";

export async function createEnquiry(data) {
  return prisma.enquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject ?? null,
      message: data.message,
      consent: !!data.consent,
      source: data.source ?? "CONTACT_PAGE",
    },
  });
}

export async function listRecentEnquiries(limit = 5) {
  const take = Math.min(Math.max(Number(limit) || 5, 1), 50);
  return prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      source: true,
      createdAt: true,
    },
  });
}
