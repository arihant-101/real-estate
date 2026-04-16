import { prisma } from "../lib/prisma.js";
import { CHANNEL_REPAIRS_WIZARD } from "./maintenanceRequestService.js";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function listByLandlord(landlordId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const where = { landlordId };
  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        area: { select: { id: true, name: true, slug: true } },
        _count: {
          select: {
            maintenanceRequests: { where: { channel: { not: CHANNEL_REPAIRS_WIZARD } } },
            tenancies: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);
  return {
    items: items.map(({ _count, ...p }) => ({
      ...p,
      openMaintenanceCount: _count.maintenanceRequests,
      activeTenanciesCount: _count.tenancies,
    })),
    total,
    page,
    limit,
  };
}

export async function getOneForLandlord(propertyId, landlordId) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
    include: {
      images: { orderBy: { order: "asc" } },
      area: true,
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

export async function create(landlordId, data) {
  const slug = data.slug?.trim() || slugify(data.title);
  const existing = await prisma.property.findUnique({ where: { slug } });
  if (existing) {
    const err = new Error("A property with this slug already exists");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  const { imageUrls, ...rest } = data;
  const images = Array.isArray(imageUrls) && imageUrls.length
    ? imageUrls.map((url, i) => ({ url: String(url).trim(), order: i })).filter((i) => i.url)
    : [];
  if (images.length === 0 && data.imageUrl) {
    images.push({ url: data.imageUrl, order: 0 });
  }
  if (images.length < 5 || images.length > 10) {
    const err = new Error("Property must have between 5 and 10 images");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  const property = await prisma.property.create({
    data: {
      ...rest,
      slug,
      landlordId,
      status: "DRAFT",
      images: images.length ? { create: images } : undefined,
    },
    include: {
      images: { orderBy: { order: "asc" } },
      area: true,
    },
  });
  return property;
}

export async function update(propertyId, landlordId, data) {
  const existing = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
    include: { images: true },
  });
  if (!existing) {
    const err = new Error("Property not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  const { imageUrls, imageUrl, ...rest } = data;
  const updates = { ...rest };
  if (imageUrls !== undefined) {
    const images = Array.isArray(imageUrls)
      ? imageUrls.map((url, i) => ({ url: String(url).trim(), order: i })).filter((i) => i.url)
      : [];
    const finalImages = images.length > 0 ? images : (imageUrl ? [{ url: imageUrl, order: 0 }] : []);
    if (finalImages.length > 0) {
      const minImages = existing.images?.length >= 5 ? 5 : 1;
      if (finalImages.length < minImages || finalImages.length > 10) {
        const err = new Error(`Property must have between ${minImages} and 10 images`);
        err.code = "VALIDATION_ERROR";
        err.status = 400;
        throw err;
      }
    }
    await prisma.propertyImage.deleteMany({ where: { propertyId } });
    if (finalImages.length > 0) {
      await prisma.propertyImage.createMany({
        data: finalImages.map((img, i) => ({ propertyId, url: img.url, order: i })),
      });
    }
  }
  const property = await prisma.property.update({
    where: { id: propertyId },
    data: updates,
    include: {
      images: { orderBy: { order: "asc" } },
      area: true,
    },
  });
  return property;
}
