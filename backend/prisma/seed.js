import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const AREAS = [
  { name: "12 South", slug: "12-south", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", description: "Upscale Nashville community known for its vibrant atmosphere and modern homes." },
  { name: "Belle Meade", slug: "belle-meade", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", description: "Luxury estates with expansive grounds and resort-style living." },
  { name: "Brentwood", slug: "brentwood", imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", description: "Family-friendly neighborhoods with top schools and parks." },
  { name: "Central London", slug: "central-london", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", description: "Prime central London locations." },
  { name: "East London", slug: "east-london", imageUrl: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800", description: "Vibrant East London areas." },
  { name: "West London", slug: "west-london", imageUrl: "https://images.unsplash.com/photo-1486299261210-e2815bca1f6f?w=800", description: "West London neighbourhoods." },
];

const PROPERTIES = [
  { slug: "modern-two-bed-apartment", title: "Modern Two-Bed Apartment", address: "42 Example Street", city: "London", postCode: "SW1A 1AA", areaSlug: "central-london", listingType: "RENTAL", beds: 2, baths: 1, areaSqFt: 850, pricePerMonth: 1850, isFeatured: true, description: "Spacious apartment with open-plan living, close to transport.", imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800" },
  { slug: "luxury-penthouse-city-views", title: "Luxury Penthouse with City Views", address: "1 Riverside Tower", city: "London", postCode: "E14 5AB", areaSlug: "east-london", listingType: "RENTAL", beds: 3, baths: 2, areaSqFt: 1800, pricePerMonth: 4200, isFeatured: true, description: "Stunning penthouse with panoramic views. Premium finishes throughout.", imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" },
  { slug: "12-south-contemporary-home", title: "12 South Contemporary Home", address: "2500 12th Ave S", city: "Nashville", postCode: "37204", areaSlug: "12-south", listingType: "RENTAL", beds: 4, baths: 3, areaSqFt: 2800, pricePerMonth: 3500, isFeatured: true, description: "Multi-story home with stone facade, outdoor fire pit, and glass railings. Walking distance to dining and shops.", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" },
  { slug: "belle-meade-estate-pool", title: "Belle Meade Estate with Pool", address: "100 Belle Meade Blvd", city: "Nashville", postCode: "37205", areaSlug: "belle-meade", listingType: "RENTAL", beds: 5, baths: 4, areaSqFt: 4500, pricePerMonth: 8500, isFeatured: true, description: "Sleek modern residence with infinity pool, large glass windows, and outdoor seating. Resort-style living.", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
  { slug: "brentwood-family-home", title: "Brentwood Family Home", address: "500 Wilson Pike", city: "Brentwood", postCode: "37027", areaSlug: "brentwood", listingType: "RENTAL", beds: 4, baths: 3, areaSqFt: 3200, pricePerMonth: 4200, isFeatured: true, description: "Modern take on traditional architecture with dark siding, stone accents, and well-lit interiors.", imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" },
  { slug: "canary-wharf-river-view", title: "Canary Wharf River View", address: "20 Cabot Square", city: "London", postCode: "E14 4QW", areaSlug: "east-london", listingType: "RENTAL", beds: 2, baths: 2, areaSqFt: 1100, pricePerMonth: 2800, isFeatured: false, description: "Contemporary apartment with river views. Close to DLR and tube.", imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800" },
  { slug: "notting-hill-studio", title: "Notting Hill Studio", address: "15 Portobello Road", city: "London", postCode: "W11 3DY", areaSlug: "west-london", listingType: "HOLIDAY_LET", beds: 1, baths: 1, areaSqFt: 450, pricePerMonth: 3200, isFeatured: false, description: "Charming studio perfect for short stays. Walking distance to Portobello Road.", imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" },
  { slug: "nashville-glass-villa", title: "Nashville Glass Villa", address: "88 Modern Lane", city: "Nashville", postCode: "37215", areaSlug: "belle-meade", listingType: "RENTAL", beds: 4, baths: 3, areaSqFt: 3800, pricePerMonth: 6200, isFeatured: false, description: "Bright modern villa with extensive glass facades and infinity-edge pool. Lush landscaping.", imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6e3?w=800" },
  { slug: "kensington-garden-flat", title: "Kensington Garden Flat", address: "7 Kensington Gardens", city: "London", postCode: "W2 4EU", areaSlug: "west-london", listingType: "RENTAL", beds: 2, baths: 1, areaSqFt: 920, pricePerMonth: 2400, isFeatured: false, description: "Elegant period conversion with high ceilings and garden access.", imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800" },
];

async function main() {
  const areaMap = {};
  for (const a of AREAS) {
    const area = await prisma.area.upsert({
      where: { slug: a.slug },
      update: { name: a.name, imageUrl: a.imageUrl, description: a.description },
      create: { name: a.name, slug: a.slug, imageUrl: a.imageUrl, description: a.description },
    });
    areaMap[a.slug] = area.id;
  }

  for (const p of PROPERTIES) {
    const areaId = areaMap[p.areaSlug] || null;
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: { status: "LIVE" },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        address: p.address,
        city: p.city,
        postCode: p.postCode,
        areaId,
        listingType: p.listingType,
        beds: p.beds,
        baths: p.baths,
        areaSqFt: p.areaSqFt,
        pricePerMonth: p.pricePerMonth,
        isFeatured: p.isFeatured ?? false,
        status: "LIVE",
        images: { create: [{ url: p.imageUrl, order: 0 }] },
      },
    });
  }

  const BLOG_POSTS = [
    {
      slug: "welcome-to-our-blog",
      title: "Welcome to Our Blog",
      excerpt: "Property management insights and updates for landlords and tenants.",
      body: "We provide expert property management services across London and beyond. Our blog keeps you informed on regulatory changes, market insights, and best practices for landlords and tenants alike.",
      author: "Property Team",
    },
    {
      slug: "tenant-screening-best-practices",
      title: "Tenant Screening Best Practices in 2025",
      excerpt: "How to find and vet quality tenants while staying compliant with UK regulations.",
      body: "Tenant screening has evolved significantly. Modern referencing combines credit checks, employment verification, and right-to-rent compliance. We walk through our process and why thorough vetting protects your investment while giving tenants a fair assessment.",
      author: "ASTA Editorial",
    },
    {
      slug: "property-maintenance-tips",
      title: "Essential Property Maintenance Tips for Landlords",
      excerpt: "Proactive maintenance reduces costs and keeps tenants happy. Here's what to prioritise.",
      body: "Regular inspections, seasonal checks, and prompt repairs form the backbone of effective property maintenance. We share practical tips on scheduling, contractor relationships, and common issues to watch for in rental and holiday let properties.",
      author: "Property Team",
    },
    {
      slug: "rental-market-outlook-2025",
      title: "Rental Market Outlook for 2025",
      excerpt: "Key trends shaping the private rental sector and what they mean for landlords.",
      body: "The private rental sector continues to adapt to regulatory changes, interest rates, and demand patterns. We analyse current trends and offer our outlook for rental yields, tenant demand, and areas of growth across London and regional markets.",
      author: "ASTA Research",
    },
    {
      slug: "holiday-let-vs-long-term-rental",
      title: "Holiday Let vs Long-Term Rental: A Landlord's Guide",
      excerpt: "Weighing the pros and cons of each model for your property portfolio.",
      body: "Holiday lets offer flexibility and potentially higher nightly rates, but require more hands-on management. Long-term rentals provide steady income with less day-to-day involvement. We compare the two approaches to help you choose the right strategy.",
      author: "Property Team",
    },
    {
      slug: "deposit-protection-schemes",
      title: "Understanding Deposit Protection Schemes",
      excerpt: "Your obligations as a landlord and how to stay compliant with deposit regulations.",
      body: "Deposit protection is mandatory for assured shorthold tenancies in England and Wales. We explain the three government-approved schemes, registration timelines, and the prescribed information you must provide to tenants within the required timeframe.",
      author: "ASTA Legal",
    },
    {
      slug: "uk-housing-law-changes-2026",
      title: "Major UK Housing Law Changes Landlords Should Prepare for in 2026",
      excerpt: "The UK rental market continues to evolve, and 2026 is expected to bring some of the most significant housing policy developments seen in recent years.",
      body: "The UK rental market continues to evolve, and 2026 is expected to bring some of the most significant housing policy developments seen in recent years. With ongoing reforms aimed at improving tenant protections and modernising the private rental sector, landlords must remain informed to ensure compliance with changing regulations.\n\nOne of the most widely discussed developments is the continued progression of the Renters Reform Bill, which is expected to reshape how tenancies operate across England. A central element of these reforms is the proposed abolition of Section 21 \"no fault\" evictions, which historically allowed landlords to regain possession of a property without providing a specific reason. The intention behind the reform is to provide tenants with greater housing stability while ensuring landlords have clearer and more structured legal grounds when seeking possession of a property.\n\nThe reforms are also expected to strengthen Section 8 eviction grounds, allowing landlords to regain possession in circumstances such as persistent rent arrears, antisocial behaviour, or when the landlord intends to sell the property. While this change increases tenant protections, it also emphasises the importance of maintaining accurate tenancy documentation and adhering to proper legal procedures.\n\nAnother major change likely to impact landlords in 2026 is the introduction of a Private Rented Sector Ombudsman. This independent body will allow tenants to raise complaints about property management or landlord practices without needing to pursue costly legal proceedings. For landlords and property managers, this means maintaining clear communication, professional standards, and detailed record keeping will become increasingly important.\n\nAdditionally, the government is continuing to push for improvements in housing quality and property standards within the private rental sector. Issues such as damp, mould, and inadequate maintenance have received growing political attention, and landlords are expected to respond quickly to repair requests and ensure properties meet acceptable living standards.\n\nFor landlords, adapting to these changes will require careful attention to compliance, proactive property management, and professional support where needed. While the regulatory environment is becoming more complex, landlords who stay informed and maintain well-managed properties will continue to benefit from strong rental demand across the UK.",
      author: "ASTA Property Management",
    },
    {
      slug: "energy-efficiency-rental-properties-2026",
      title: "Energy Efficiency Regulations and Rental Properties: What 2026 May Bring",
      excerpt: "Energy efficiency has become one of the most important issues affecting the UK property sector, and landlords are increasingly expected to ensure that rental homes meet higher environmental standards.",
      body: "Energy efficiency has become one of the most important issues affecting the UK property sector, and landlords are increasingly expected to ensure that rental homes meet higher environmental standards. In 2026, further developments in energy efficiency regulations are expected to influence how rental properties are managed and upgraded.\n\nThe government has been gradually strengthening Minimum Energy Efficiency Standards (MEES), which currently require rental properties to achieve a minimum EPC rating of E before they can be legally let. However, there have been ongoing discussions about raising this threshold in the coming years to improve the environmental performance of residential buildings.\n\nWhile the exact timeline continues to evolve, many experts believe that higher EPC standards could become mandatory later in the decade. As a result, landlords who begin planning energy improvements now may be better positioned to meet future requirements.\n\nEnergy efficiency improvements can include measures such as upgrading insulation, installing energy-efficient heating systems, replacing outdated boilers, and improving window glazing. These improvements not only help reduce environmental impact but can also make properties more attractive to tenants.\n\nTenants are increasingly aware of energy costs and are actively seeking homes that are efficient to heat and maintain. In a time when energy prices remain a concern for many households, properties with better energy performance can stand out in the rental market.\n\nFor landlords, improving energy efficiency can also help protect long-term property value. Properties that meet modern environmental standards are likely to remain competitive in an evolving housing market.\n\nProperty management companies are often able to assist landlords by coordinating energy assessments, recommending improvements, and ensuring that properties remain compliant with changing regulations.\n\nAs sustainability continues to shape the future of the housing sector, energy-efficient homes are becoming a defining feature of the modern rental market.",
      author: "ASTA Property Management",
    },
    {
      slug: "property-management-technology-2026",
      title: "How Technology Is Transforming Property Management in 2026",
      excerpt: "Technology is rapidly changing how rental properties are managed, and 2026 is expected to see further advancements in digital tools designed to streamline property management and improve tenant experiences.",
      body: "Technology is rapidly changing how rental properties are managed, and 2026 is expected to see further advancements in digital tools designed to streamline property management and improve tenant experiences.\n\nAcross the property management industry, digital platforms are becoming an essential part of day-to-day operations. Landlords and property managers are increasingly adopting systems that allow tenants to submit maintenance requests online, track repairs, access tenancy documents, and communicate with management teams through secure portals.\n\nThese platforms reduce administrative workload while improving transparency and efficiency. Tenants benefit from faster responses and clearer communication, while landlords gain access to organised property records and financial reporting.\n\nOnline maintenance request systems are a particularly valuable development. Tenants can upload photos or videos of maintenance issues, allowing contractors to diagnose problems more quickly before attending the property. This can reduce repair delays and ensure that maintenance issues are addressed efficiently.\n\nDigital platforms also help streamline rent collection and financial management. Automated rent payment systems reduce late payments and allow landlords to monitor rental income more easily. Financial reports can be generated automatically, providing landlords with clear oversight of their property investments.\n\nAnother technological trend shaping the industry is the increasing use of digital tenancy agreements and electronic signatures. These tools allow tenancy agreements to be completed quickly and securely without requiring physical paperwork.\n\nAs rental markets become more competitive and regulations become more complex, technology is playing a crucial role in helping landlords maintain professional standards while simplifying property management.\n\nFor tenants, these innovations contribute to a smoother and more responsive rental experience. For landlords, they provide valuable tools that help protect investments and improve operational efficiency.\n\nIn 2026 and beyond, the integration of digital technology into property management is expected to continue expanding, transforming how rental properties are managed across the UK.",
      author: "ASTA Property Management",
    },
  ];

  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        author: post.author,
        publishedAt: new Date(),
      },
    });
  }

  const TESTIMONIALS = [
    {
      id: "seed-testimonial-1",
      authorName: "Jane Smith",
      role: "Landlord",
      content: "Professional service from start to finish. Highly recommend.",
      rating: 5,
    },
    {
      id: "seed-testimonial-2",
      authorName: "Michael O'Brien",
      role: "Tenant",
      content: "Smooth move-in process and quick response when we had a maintenance issue. The team really cares about tenants.",
      rating: 5,
    },
    {
      id: "seed-testimonial-3",
      authorName: "Priya Patel",
      role: "Landlord",
      content: "They manage three of my London properties. Clear reporting, reliable rent collection, and peace of mind on compliance.",
      rating: 5,
    },
  ];

  for (const t of TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        authorName: t.authorName,
        role: t.role,
        content: t.content,
        rating: t.rating,
        isApproved: true,
      },
    });
  }

  const adminHashedPassword = await bcrypt.hash("1234", SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: "admin" },
    update: { hashedPassword: adminHashedPassword, role: "ADMIN" },
    create: {
      email: "admin",
      hashedPassword: adminHashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Seed completed: areas, properties, blog posts, testimonials, admin user.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
