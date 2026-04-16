"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { landlordApi, type LandlordProperty } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";

export default function PortalPropertiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<{ items: LandlordProperty[]; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "LANDLORD") {
      router.replace("/portal");
      return;
    }
    (async () => {
      try {
        const res = await landlordApi.listProperties({ limit: 50 });
        setList({ items: res.items, total: res.total });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load properties");
      }
    })();
  }, [loading, user, router]);

  usePolling(
    async () => {
      try {
        const res = await landlordApi.listProperties({ limit: 50 });
        setList({ items: res.items, total: res.total });
      } catch {
        // ignore
      }
    },
    30000,
    !!user && user.role === "LANDLORD"
  );

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/portal" className="text-sm font-medium text-muted hover:text-white">
            ← Portal
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white">My Properties</h1>
        </div>
        <Link
          href="/portal/properties/new"
          className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light"
        >
          Add property
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 space-y-3">
        {list?.items.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-panel/50 p-8 text-center">
            <p className="text-muted">You have no properties yet.</p>
            <Link href="/portal/properties/new" className="btn-primary mt-4 inline-flex">
              Add your first property
            </Link>
          </div>
        )}
        {list?.items.map((p) => (
          <Link
            key={p.id}
            href={`/portal/properties/${p.id}`}
            className="block rounded-xl border border-white/10 bg-panel/50 p-4 transition hover:border-white/20 hover:bg-panel/70 sm:flex sm:items-center sm:justify-between"
          >
            <div className="flex gap-4">
              {p.images?.[0]?.url ? (
                <img
                  src={p.images[0].url}
                  alt=""
                  className="h-20 w-28 flex-shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-20 w-28 flex-shrink-0 rounded-lg bg-panel" />
              )}
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-sm text-muted">
                  {p.address}, {p.city}
                </p>
                <p className="mt-1 text-sm text-white">
                  £{Number(p.pricePerMonth).toLocaleString()}/mo · {p.beds} bed · {p.baths} bath
                </p>
                <span
                  className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    p.status === "LIVE"
                      ? "bg-green-500/20 text-green-400"
                      : p.status === "ARCHIVED"
                        ? "bg-muted/20 text-muted"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {p.status ?? "DRAFT"}
                </span>
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-sm text-muted sm:mt-0">
              <span>Maintenance: {(p as LandlordProperty).openMaintenanceCount ?? 0}</span>
              <span>Tenancies: {(p as LandlordProperty).activeTenanciesCount ?? 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
