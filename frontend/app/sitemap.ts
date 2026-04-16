import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://asta-property.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about-us",
    "/property-listings",
    "/owners",
    "/tenants",
    "/testimonials",
    "/contact-us",
    "/login",
    "/login-portal",
    "/login-portal-help",
    "/register",
    "/portal",
    "/maintenance-request",
    "/repairs",
    "/blog",
    "/blog/uk-housing-law-2025",
    "/blog/landlord-strategy-tips-2025",
    "/blog/tenant-expectations-2025",
    "/blog/financial-planning-rental-income-2025",
    "/blog/holiday-let-licensing-uk-2025",
    "/blog/sustainable-rentals-2025",
    "/faqs",
    "/privacy",
    "/terms",
    "/slavery-and-human-trafficking-statement",
    "/services",
    "/services/financial-management",
    "/services/property-maintenance-inspections",
    "/services/tenant-placement-screening",
  ];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/property-listings" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/property-listings" ? 0.9 : 0.7,
  }));
}
