import type { Metadata } from "next";
import { DM_Sans, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MainWithHomeLayout from "@/components/MainWithHomeLayout";
import LayoutWithConditionalFooter from "@/components/LayoutWithConditionalFooter";
import CookieConsent from "@/components/CookieConsent";
import ConsentAwareScripts from "@/components/ConsentAwareScripts";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

/** Geometric grotesk for outlined home marquee (closer to Centrick-style display type than Montserrat). */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-marquee",
  display: "swap",
  weight: ["600", "700"],
});

/** Local dev default so metadataBase matches the origin (favicon / OG URLs resolve to this host). */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "ASTA Property Management",
  title: {
    default: "ASTA Property Management | London Property Management & Rentals",
    template: "%s | ASTA Property Management",
  },
  description:
    "Professional London property management services including tenancy management, landlord support, rental listings, and holiday lettings.",
  openGraph: {
    siteName: "ASTA Property Management",
    title: "ASTA Property Management | London Property Management & Rentals",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${montserrat.variable} ${spaceGrotesk.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          <Header />
          <LayoutWithConditionalFooter>
            <MainWithHomeLayout>{children}</MainWithHomeLayout>
          </LayoutWithConditionalFooter>
          <CookieConsent />
          <ConsentAwareScripts />
        </AuthProvider>
      </body>
    </html>
  );
}
