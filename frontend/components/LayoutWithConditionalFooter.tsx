"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function LayoutWithConditionalFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {children}
      {!isHome && <Footer />}
    </>
  );
}
