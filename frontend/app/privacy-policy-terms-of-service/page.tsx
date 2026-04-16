import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy & Terms | Property Management",
  description:
    "Information about our privacy policy, data protection practices, and terms governing our property management services.",
  path: "/privacy-policy-terms-of-service",
});

export default function PrivacyPolicyTermsOfServiceRedirectPage() {
  redirect("/privacy");
}

