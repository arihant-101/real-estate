import type { Metadata } from "next";

const SITE_NAME = "ASTA Property Management";

/**
 * Builds SEO-optimised metadata. Rendered in <head> only — never visible on the page.
 * Includes Open Graph and Twitter cards for social sharing.
 */
export function buildMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asta-property.example.com";
  const url = path ? `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}` : siteUrl;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: { index: true, follow: true },
  };
}
