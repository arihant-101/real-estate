"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { tenantApi, type TenancyApplicationItem } from "@/lib/api";

export default function PortalApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<TenancyApplicationItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "TENANT") {
      router.replace("/portal");
      return;
    }
    tenantApi.listApplications()
      .then((res) => setItems(res.items))
      .catch(() => setError("Failed to load applications"));
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/portal" className="text-sm font-medium text-muted hover:text-white">
        ← Portal
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-white">My applications</h1>
      <p className="mt-1 text-sm text-muted">Track your property applications</p>

      <Link
        href="/property-listings"
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Browse properties →
      </Link>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 space-y-3">
        {items?.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-panel/50 p-8 text-center text-muted">
            No applications yet. <Link href="/property-listings" className="text-primary hover:underline">Browse properties</Link> to apply.
          </p>
        )}
        {items?.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-white/10 bg-panel/50 p-4"
          >
            <p className="font-medium text-white">{a.property?.title ?? "Property"}</p>
            <p className="text-sm text-muted">
              {a.property?.address}
              {a.property?.city && `, ${a.property.city}`}
            </p>
            <span
              className={`mt-2 inline-block rounded px-2 py-1 text-xs font-medium ${
                a.status === "APPROVED"
                  ? "bg-green-500/20 text-green-400"
                  : a.status === "REJECTED"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {a.status}
            </span>
            <p className="mt-2 text-xs text-muted">
              Applied {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
