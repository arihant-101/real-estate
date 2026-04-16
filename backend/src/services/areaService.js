import { prisma } from "../lib/prisma.js";

export async function listAreas() {
  return prisma.area.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, imageUrl: true, description: true },
  });
}
