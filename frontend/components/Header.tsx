"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { NotificationDropdown } from "./NotificationDropdown";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/property-listings", label: "Properties" },
  { href: "/about-us", label: "About" },
  {
    label: "Services",
    children: [
      { href: "/services", label: "Overview" },
      { href: "/services/tenant-placement-screening", label: "Tenant Placement" },
      { href: "/services/property-maintenance-inspections", label: "Maintenance & Inspections" },
      { href: "/services/financial-management", label: "Financial Management" },
    ],
  },
  {
    label: "Forms",
    children: [
      { href: "/forms", label: "All Forms" },
      { href: "/forms/how-to-rent", label: "How to Rent Guide" },
      { href: "/forms/nrla-checklist", label: "NRLA Checklist" },
      { href: "/forms/ast-room-only", label: "AST Room Only" },
      { href: "/forms/joint-ast-agreement", label: "Joint AST Agreement" },
    ],
  },
  {
    label: "Portal",
    children: [
      { href: "/login-portal", label: "Portal Overview" },
      { href: "/login", label: "Login" },
      { href: "/login-portal-help", label: "Help & FAQ" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/repairs", label: "Repairs" },
];

type HeaderProps = {
  /** When "static", header is in flow and scrolls with content (e.g. on home). When "sticky", stays at top. */
  variant?: "sticky" | "static";
};

export default function Header({ variant = "sticky" }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [formsOpen, setFormsOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const threshold = 32;
    if (pathname !== "/") {
      const onWin = () => setScrolled(window.scrollY > threshold);
      window.addEventListener("scroll", onWin, { passive: true });
      onWin();
      return () => window.removeEventListener("scroll", onWin);
    }

    setScrolled(false);
    let el: HTMLElement | null = null;
    let raf = 0;
    let attempts = 0;
    const maxAttempts = 150;

    const onInner = () => {
      if (el) setScrolled(el.scrollTop > threshold);
    };

    const findAndAttach = () => {
      el = document.querySelector(
        "main.h-screen.overflow-hidden > div.overflow-y-auto"
      ) as HTMLElement | null;
      if (el) {
        el.addEventListener("scroll", onInner, { passive: true });
        onInner();
        return true;
      }
      return false;
    };

    if (!findAndAttach()) {
      const tick = () => {
        attempts += 1;
        if (findAndAttach() || attempts >= maxAttempts) return;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("scroll", onInner);
    };
  }, [pathname]);

  const isStatic = variant === "static";
  const onHero = !isStatic && isHome && !scrolled;
  const headerBg = isStatic
    ? "bg-surface/95 border-white/5 backdrop-blur-md"
    : onHero
      ? "bg-black/35 backdrop-blur-lg border-white/10 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06)]"
      : "border-white/10 bg-surface/98 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl";
  const headerPosition = isStatic
    ? ""
    : isHome
      ? "fixed top-0 left-0 right-0 z-50"
      : "sticky top-0 z-50";

  const isActive = (href: string) => pathname === href;
  const isActiveParent = (item: { children?: { href: string }[] }) =>
    item.children?.some((c) => pathname === c.href);

  return (
    <header
      className={`${headerPosition} z-50 w-full shrink-0 border-b text-white transition-all duration-300 ${headerBg}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo + brand name – left */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 bg-transparent transition-opacity hover:opacity-90"
          aria-label="ASTA Property Management – Home"
        >
          <Image
            src="/asta-logo.png"
            alt=""
            width={160}
            height={48}
            className="h-12 w-auto object-contain object-left bg-transparent"
            style={{ background: "transparent" }}
            priority
            unoptimized
          />
          <div className="hidden flex-col sm:flex sm:flex-col gap-0.5">
            <Image
              src="/asta-text.png"
              alt="ASTA"
              width={80}
              height={24}
              className="h-7 w-auto object-contain object-left bg-transparent"
              unoptimized
            />
            <Image
              src="/asta-word.png"
              alt="Property Management"
              width={120}
              height={16}
              className="h-4 w-auto object-contain object-left bg-transparent"
              unoptimized
            />
          </div>
        </Link>

        {/* Centered nav – desktop */}
        <nav className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((item) =>
              "children" in item ? (
                <li key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.label === "Services") {
                        setServicesOpen((o) => !o);
                        setFormsOpen(false);
                        setPortalOpen(false);
                      } else if (item.label === "Forms") {
                        setFormsOpen((o) => !o);
                        setServicesOpen(false);
                        setPortalOpen(false);
                      } else if (item.label === "Portal") {
                        setPortalOpen((o) => !o);
                        setServicesOpen(false);
                        setFormsOpen(false);
                      }
                    }}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition hover:text-white ${
                      isActiveParent(item) ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.label}
                    <span className="text-[10px] opacity-80">▾</span>
                  </button>
                  {((item.label === "Services" && servicesOpen) || (item.label === "Forms" && formsOpen) || (item.label === "Portal" && portalOpen)) && item.children && (
                    <div className="absolute left-0 top-full pt-1">
                      <div className="min-w-[220px] rounded-none border border-white/10 bg-panel/95 py-2 shadow-xl shadow-black/40 backdrop-blur-xl">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={`block px-4 py-2.5 text-sm transition ${
                              pathname === c.href
                                ? "bg-primary/95 font-medium text-black"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => {
                              setServicesOpen(false);
                              setFormsOpen(false);
                              setPortalOpen(false);
                            }}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href!}
                    className={`relative block px-4 py-2 text-sm font-medium transition hover:text-white ${
                      isActive(item.href!) ? "text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href!) && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Right: auth */}
        <div className="flex shrink-0 items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  {(user.role === "TENANT" || user.role === "LANDLORD") && (
                    <NotificationDropdown />
                  )}
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/portal"}
                    className={`rounded border px-3 py-1.5 text-sm font-medium ${
                      (user.role === "ADMIN" && pathname === "/admin") ||
                      (user.role !== "ADMIN" && pathname === "/portal")
                        ? "border-primary bg-primary/20 text-white"
                        : "border-primary/70 text-white/90 hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {user.role === "ADMIN" ? "Admin" : "Portal"}
                  </Link>
                  <span className="hidden text-sm text-white/80 sm:inline">{user.email}</span>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded border border-primary/70 px-3 py-1.5 text-sm font-medium text-white/90 hover:border-primary hover:bg-primary/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded border border-primary/70 px-3 py-1.5 text-sm font-medium text-white/90 hover:border-primary hover:bg-primary/10"
                >
                  Login
                </Link>
              )}
            </>
          )}
          <button
            type="button"
            className="flex flex-col gap-1.5 rounded p-2 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-surface lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {user?.role === "ADMIN" && (
              <div className="mb-4 border-b border-white/10 pb-4">
                <Link
                  href="/admin"
                  className={`block py-2.5 text-sm font-medium ${pathname === "/admin" ? "text-white" : "text-white/80"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Portal
                </Link>
              </div>
            )}
            <ul className="space-y-1">
              {navLinks.map((item) =>
                "children" in item ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.label === "Services") {
                          setServicesOpen((o) => !o);
                          setFormsOpen(false);
                          setPortalOpen(false);
                        } else if (item.label === "Forms") {
                          setFormsOpen((o) => !o);
                          setServicesOpen(false);
                          setPortalOpen(false);
                        } else if (item.label === "Portal") {
                          setPortalOpen((o) => !o);
                          setServicesOpen(false);
                          setFormsOpen(false);
                        }
                      }}
                      className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-white/90"
                    >
                      {item.label} ▾
                    </button>
                    {((item.label === "Services" && servicesOpen) || (item.label === "Forms" && formsOpen) || (item.label === "Portal" && portalOpen)) && item.children && (
                      <ul className="border-l border-white/10 pl-4">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={`block py-2 text-sm ${
                                pathname === c.href
                                  ? "bg-primary/85 -ml-4 pl-4 font-medium text-black"
                                  : "text-white/80 hover:text-white"
                              }`}
                              onClick={() => setMobileOpen(false)}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href!}
                      className={`block py-2.5 text-sm font-medium ${pathname === item.href ? "text-white" : "text-white/80"}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
