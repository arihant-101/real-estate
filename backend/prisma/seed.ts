import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.property.createMany({
    data: [
      {
        title: "Luxury Mayfair Penthouse",
        slug: "luxury-mayfair-penthouse",
        type: "SALE",
        price: 4500000,
        address: "Mayfair, London W1K",
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 2200,
        description: "Stunning penthouse in the heart of Mayfair with panoramic views. Premium finishes throughout.",
        features: ["Concierge", "Gym", "Balcony", "Parking"],
        status: "AVAILABLE",
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        is_featured: true,
      },
      {
        title: "Modern Canary Wharf Apartment",
        slug: "modern-canary-wharf-apartment",
        type: "RENT",
        price: 2800,
        address: "Canary Wharf, London E14",
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1100,
        description: "Contemporary apartment with river views. Close to DLR and tube.",
        features: ["Gym", "Balcony", "Concierge"],
        status: "AVAILABLE",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        is_featured: false,
      },
      {
        title: "Cozy Notting Hill Studio",
        slug: "cozy-notting-hill-studio",
        type: "HOLIDAY",
        price: 150,
        address: "Notting Hill, London W11",
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 450,
        description: "Charming studio perfect for short stays. Walking distance to Portobello Road.",
        features: ["WiFi", "Kitchenette"],
        status: "AVAILABLE",
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        is_featured: false,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Seeded 3 London properties.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
