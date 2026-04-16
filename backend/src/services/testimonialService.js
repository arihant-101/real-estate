import { prisma } from "../lib/prisma.js";

export async function listApproved() {
  return prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      authorName: true,
      role: true,
      content: true,
      rating: true,
      createdAt: true,
      includeNameLocation: true,
      photoData: true,
    },
  });
}

export async function createTestimonial(data) {
  return prisma.testimonial.create({
    data: {
      authorName: data.authorName,
      role: data.role,
      content: data.content,
      rating: data.rating ?? null,
       emailForVerification: data.emailForVerification ?? null,
       includeNameLocation: data.includeNameLocation,
       photoData: data.photoData ?? null,
       consent: data.consent,
      isApproved: false,
    },
  });
}

export async function listPending(limit = 50) {
  return prisma.testimonial.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: "desc" },
    take: Math.min(Number(limit) || 50, 100),
    select: {
      id: true,
      authorName: true,
      role: true,
      content: true,
      rating: true,
      createdAt: true,
      emailForVerification: true,
      includeNameLocation: true,
      photoData: true,
      consent: true,
    },
  });
}

export async function updateApproval(id, isApproved) {
  return prisma.testimonial.update({
    where: { id },
    data: { isApproved: !!isApproved },
    select: { id: true, isApproved: true },
  });
}
