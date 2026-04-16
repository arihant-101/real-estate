import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/server-api";

export const dynamic = "force-dynamic";

const BLOG_IMAGES: Record<string, string> = {
  "uk-housing-law-2025": "/images/blog-uk-housing-law-2025-hero.jpg",
  "landlord-strategy-tips-2025": "/images/blog-landlord-strategy-tips-2025-hero.png",
  "tenant-expectations-2025": "/images/blog-tenant-expectations-2025-hero.jpg",
  "financial-planning-rental-income-2025": "/images/blog-financial-planning-2025-hero.png",
  "holiday-let-licensing-uk-2025": "/images/blog-holiday-let-2025-hero.jpg",
  "sustainable-rentals-2025": "/images/blog-sustainable-rentals-2025-hero.png",
  "uk-housing-law-changes-2026": "/images/blog-uk-housing-law-changes-2026-hero.jpg",
  "energy-efficiency-rental-properties-2026": "/images/blog-energy-efficiency-2026-hero.jpg",
  "property-management-technology-2026": "/images/blog-property-management-tech-2026-custom.png",
};
const DEFAULT_BLOG_IMAGE = "/images/blog-default-hero.jpg";

function getPostImage(slug: string) {
  return BLOG_IMAGES[slug] ?? DEFAULT_BLOG_IMAGE;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Static blog posts data
const STATIC_BLOG_POSTS: Record<string, { title: string; excerpt: string; publishedAt: string; author: string; body: string }> = {
  "uk-housing-law-2025": {
    title: "Navigating UK Housing Law Changes: What Every Landlord Must Know in 2025",
    excerpt: "In 2025, the UK rental sector is undergoing its most transformative shift in decades. A series of legislative reforms are being introduced to improve housing quality, enhance tenant rights, and formalise the responsibilities of landlords.",
    publishedAt: "2025-10-08",
    author: "ASTA Property Management",
    body: "This blog post has been moved to a dedicated page. Please visit /blog/uk-housing-law-2025 for the full article."
  },
  // Add other posts as needed for fallback
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const staticPost = STATIC_BLOG_POSTS[params.slug];
  if (staticPost) {
    return {
      title: `${staticPost.title} | ASTA Property Management`,
      description: staticPost.excerpt,
    };
  }
  
  try {
    const post = await getBlogPost(params.slug);
    if (!post) return { title: "Blog | ASTA Property Management" };
    return {
      title: `${post.title} | ASTA Property Management`,
      description: post.excerpt ?? undefined,
    };
  } catch {
    return { title: "Blog | ASTA Property Management" };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Check if this is one of our new static blog posts
  const staticPost = STATIC_BLOG_POSTS[params.slug];
  if (staticPost) {
    // Redirect to the static page
    notFound(); // This will show 404, but the static pages exist at the correct URLs
  }
  
  try {
    const post = await getBlogPost(params.slug);
    if (!post) notFound();
  } catch {
    notFound();
  }
  
  const post = await getBlogPost(params.slug);

  const imageUrl = getPostImage(params.slug);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with cover image */}
      <section className="relative page-banner flex min-h-[50vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-12 pt-28 sm:px-6 lg:pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Blog
          </Link>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/70">
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
            {post.author && <span>By {post.author}</span>}
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="prose prose-invert max-w-none prose-p:text-muted prose-p:leading-relaxed prose-headings:text-white">
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted">
              {post.body}
            </p>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              ← All posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
