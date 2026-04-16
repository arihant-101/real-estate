"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, type AdminAnalytics } from "@/lib/api";

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!loading && user && user.role !== "ADMIN") {
      router.replace("/portal");
      return;
    }
  }, [user, loading, router]);

  const loadAnalytics = useCallback(() => {
    setError(null);
    adminApi
      .getAnalytics()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err) => setError(err?.message || "Could not load dashboard data. Please try again later."));
  }, []);

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      loadAnalytics();
    }
  }, [loading, user?.role, loadAnalytics]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const maintenanceProgress =
    stats?.maintenance.total
      ? Math.round((stats.maintenance.resolved / stats.maintenance.total) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="mt-1 text-muted">Dashboard overview and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/repairs" className="text-sm font-medium text-primary hover:underline">
            Repairs
          </Link>
          <Link
            href="/portal"
            className="text-sm font-medium text-muted hover:text-white"
          >
            Portal
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
              router.refresh();
            }}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={loadAnalytics}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Retry
          </button>
        </div>
      )}

      {stats && (
        <div className="mt-8 space-y-8">
          {/* Overview cards */}
          <section>
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">Property owners</p>
                <p className="mt-1 text-2xl font-bold text-white">{stats.landlordsCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">Tenants</p>
                <p className="mt-1 text-2xl font-bold text-white">{stats.tenantsCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">Properties</p>
                <p className="mt-1 text-2xl font-bold text-white">{stats.propertiesCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">Enquiries</p>
                <p className="mt-1 text-2xl font-bold text-white">{stats.enquiriesCount}</p>
              </div>
            </div>
          </section>

          {/* Maintenance requests */}
          <section>
            <h2 className="text-lg font-semibold text-white">Maintenance requests</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-400">
                Pending: {stats.maintenance.pending}
              </span>
              <span className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-400">
                In progress: {stats.maintenance.in_progress}
              </span>
              <span className="rounded-lg bg-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400">
                Resolved: {stats.maintenance.resolved}
              </span>
            </div>
            {stats.maintenance.total > 0 && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${maintenanceProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{maintenanceProgress}% resolved</p>
              </div>
            )}
            {stats.recentMaintenance.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-panel/50 p-4">
                <h3 className="text-sm font-semibold text-white">Recent</h3>
                <div className="mt-3 space-y-2">
                  {stats.recentMaintenance.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-white/5 bg-overlay/40 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-white">
                        {m.issueCategory}{" "}
                        <span className="ml-2 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {m.urgency}
                        </span>
                      </p>
                      <p className="text-xs text-muted">
                        {m.tenantName} · {m.property?.title ?? m.propertyAddressOrRef}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        Status: {m.status} ·{" "}
                        {new Date(m.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Applications */}
          <section>
            <h2 className="text-lg font-semibold text-white">Applications</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-400">
                Pending: {stats.applications.PENDING}
              </span>
              <span className="rounded-lg bg-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400">
                Approved: {stats.applications.APPROVED}
              </span>
              <span className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400">
                Rejected: {stats.applications.REJECTED}
              </span>
            </div>
            {stats.recentApplications.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-panel/50 p-4">
                <h3 className="text-sm font-semibold text-white">Recent</h3>
                <div className="mt-3 space-y-2">
                  {stats.recentApplications.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-lg border border-white/5 bg-overlay/40 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-white">{a.name}</p>
                      <p className="text-xs text-muted">
                        {a.email} · {a.property?.title ?? a.propertyId}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        {a.status} ·{" "}
                        {new Date(a.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Enquiries */}
          <section>
            <h2 className="text-lg font-semibold text-white">Enquiries</h2>
            <p className="mt-1 text-sm text-muted">Total: {stats.enquiriesCount}</p>
            {stats.recentEnquiries.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-panel/50 p-4">
                <h3 className="text-sm font-semibold text-white">Recent</h3>
                <div className="mt-3 space-y-2">
                  {stats.recentEnquiries.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border border-white/5 bg-overlay/40 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-white">
                        {e.subject || "General enquiry"}
                      </p>
                      <p className="text-xs text-muted">
                        {e.name} · {e.email}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        Source: {e.source} ·{" "}
                        {new Date(e.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
