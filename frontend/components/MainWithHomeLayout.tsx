"use client";

import { usePathname } from "next/navigation";

export default function MainWithHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      className={isHome ? "h-screen overflow-hidden" : "flex-1"}
    >
      {children}
    </main>
  );
}
