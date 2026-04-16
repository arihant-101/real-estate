"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

/** Renders the sticky Header only when not on the home page. Home page renders its own header inside the scroll container. */
export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Header variant="sticky" />;
}
