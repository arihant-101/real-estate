import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Property Management Advice & Housing News",
  description:
    "Insights on UK housing law, landlord strategies, rental market trends, and property management advice.",
  path: "/blog",
});


// Curated images per slug for elegant card thumbnails
const BLOG_IMAGES: Record<string, string> = {
  "uk-housing-law-2025": "/images/blog-uk-housing-law-2025-card.jpg",
  "landlord-strategy-tips-2025": "/images/blog-landlord-strategy-tips-2025-hero.png",
  "tenant-expectations-2025": "/images/blog-tenant-expectations-2025-card.jpg",
  "financial-planning-rental-income-2025": "/images/blog-financial-planning-2025-hero.png",
  "holiday-let-licensing-uk-2025": "/images/blog-holiday-let-2025-card.jpg",
  "sustainable-rentals-2025": "/images/blog-sustainable-rentals-2025-hero.png",
  "uk-housing-law-changes-2026": "/images/blog-uk-housing-law-changes-2026-card.jpg",
  "energy-efficiency-rental-properties-2026": "/images/blog-energy-efficiency-2026-card.jpg",
  "property-management-technology-2026": "/images/blog-property-management-tech-2026-custom.png",
};
const DEFAULT_BLOG_IMAGE = "/images/blog-default-card.jpg";

// Static blog posts from PDF
const BLOG_POSTS = [
  {
    id: "1",
    slug: "uk-housing-law-2025",
    title: "Navigating UK Housing Law Changes: What Every Landlord Must Know in 2025",
    excerpt: "In 2025, the UK rental sector is undergoing its most transformative shift in decades. A series of legislative reforms are being introduced to improve housing quality, enhance tenant rights, and formalise the responsibilities of landlords.",
    publishedAt: "2025-10-08",
    author: "ASTA Property Management",
  },
  {
    id: "2",
    slug: "landlord-strategy-tips-2025",
    title: "Landlord Strategy Tips for 2025: Maximising Returns While Minimising Risk",
    excerpt: "Property investment has always offered attractive long-term returns, but in 2025, success belongs to landlords who treat it not just as an asset — but as a business.",
    publishedAt: "2025-09-15",
    author: "ASTA Property Management",
  },
  {
    id: "3",
    slug: "tenant-expectations-2025",
    title: "What Do Tenants Expect in 2025? The New Standards of Renting in London",
    excerpt: "Renting in 2025 is a vastly different experience from just a few years ago. Today's tenants are informed, empowered, and demand more than a place to live — they expect a complete lifestyle experience.",
    publishedAt: "2025-09-22",
    author: "ASTA Property Management",
  },
  {
    id: "4",
    slug: "financial-planning-rental-income-2025",
    title: "Financial Planning for Rental Income: A Landlord's Guide to Profit in 2025",
    excerpt: "Effective financial planning is the backbone of any successful property investment strategy. As the UK rental sector becomes more regulated and tenants more selective, landlords must move from passive income models to active financial management.",
    publishedAt: "2025-10-24",
    author: "ASTA Property Management",
  },
  {
    id: "5",
    slug: "holiday-let-licensing-uk-2025",
    title: "Holiday Let Licensing and Marketing: What You Need to Know in 2025",
    excerpt: "The holiday let market in the UK has grown exponentially in recent years. However, in 2025, holiday lets are under the spotlight. Stricter regulation, licensing schemes, and marketing demands mean landlords must now operate more professionally than ever.",
    publishedAt: "2025-10-16",
    author: "ASTA Property Management",
  },
  {
    id: "6",
    slug: "sustainable-rentals-2025",
    title: "Sustainability in Lettings: Why Eco-Friendly Rentals Are in High Demand in 2025",
    excerpt: "Environmental considerations are shaping renter preferences and regulatory requirements in 2025. For modern tenants—particularly younger professionals and families—the environmental footprint of a home matters nearly as much as its location or amenities.",
    publishedAt: "2025-09-08",
    author: "ASTA Property Management",
  },
  {
    id: "7",
    slug: "uk-housing-law-changes-2026",
    title: "Major UK Housing Law Changes Landlords Should Prepare for in 2026",
    excerpt: "The UK rental market continues to evolve, and 2026 is expected to bring some of the most significant housing policy developments seen in recent years.",
    publishedAt: "2026-01-10",
    author: "ASTA Property Management",
  },
  {
    id: "8",
    slug: "energy-efficiency-rental-properties-2026",
    title: "Energy Efficiency Regulations and Rental Properties: What 2026 May Bring",
    excerpt: "Energy efficiency has become one of the most important issues affecting the UK property sector, and landlords are increasingly expected to ensure that rental homes meet higher environmental standards.",
    publishedAt: "2026-01-15",
    author: "ASTA Property Management",
  },
  {
    id: "9",
    slug: "property-management-technology-2026",
    title: "How Technology Is Transforming Property Management in 2026",
    excerpt: "Technology is rapidly changing how rental properties are managed, and 2026 is expected to see further advancements in digital tools designed to streamline property management and improve tenant experiences.",
    publishedAt: "2026-01-20",
    author: "ASTA Property Management",
  },
];

function getPostImage(slug: string) {
  return BLOG_IMAGES[slug] ?? DEFAULT_BLOG_IMAGE;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const items = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative page-banner flex min-h-[40vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/blog-index-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:pb-20">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">Insights</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            We believe informed clients make better decisions. Explore insights on London’s rental
            market, regulatory change, and practical guidance for both landlords and tenants.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted">No posts yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/30 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-panel">
                    <img
                      src={getPostImage(post.slug)}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-white/90">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-primary sm:text-xl">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    )}
                    {post.author && (
                      <p className="mt-3 text-xs text-muted">By {post.author}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Read article
                      <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
