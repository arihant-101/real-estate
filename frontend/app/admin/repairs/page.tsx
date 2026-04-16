"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RepairReportDetails } from "@/components/admin/RepairReportDetails";
import { adminApi, type MaintenanceRequestDetail } from "@/lib/api";

function parseRepairPhotos(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw) as unknown;
    return Array.isArray(j) && j.every((x): x is string => typeof x === "string") ? j : [];
  } catch {
    return [];
  }
}

export default function AdminRepairsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<MaintenanceRequestDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportOpenId, setReportOpenId] = useState<string | null>(null);

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

  const load = useCallback(() => {
    setError(null);
    adminApi
      .listRepairsWizard(200)
      .then((r) => setItems(r.items))
      .catch((err) => {
        setError(err?.message || "Could not load repairs.");
        setItems([]);
      });
  }, []);

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") load();
  }, [loading, user?.role, load]);

  useEffect(() => {
    if (!reportOpenId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReportOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [reportOpenId]);

  const reportOpen = reportOpenId && items ? items.find((x) => x.id === reportOpenId) : undefined;

  useEffect(() => {
    if (reportOpenId && items && !items.some((x) => x.id === reportOpenId)) {
      setReportOpenId(null);
    }
  }, [items, reportOpenId]);

  async function updateStatus(id: string, status: "pending" | "in_progress" | "resolved") {
    try {
      await adminApi.updateRepairRequestStatus(id, status);
      setItems((prev) => (prev ? prev.map((x) => (x.id === id ? { ...x, status } : x)) : prev));
    } catch {
      load();
    }
  }

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

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Repairs (tenant reports)</h1>
          <p className="mt-1 text-muted">Submissions from the public Repairs wizard — not visible to landlords.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin" className="text-sm font-medium text-muted hover:text-white">
            Admin home
          </Link>
          <Link href="/portal" className="text-sm font-medium text-muted hover:text-white">
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
        <p className="mt-4 text-sm text-red-400">
          {error}{" "}
          <button type="button" onClick={load} className="underline">
            Retry
          </button>
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.04]">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">When</th>
              <th className="px-4 py-3 font-medium text-muted">Tenant</th>
              <th className="px-4 py-3 font-medium text-muted">Building</th>
              <th className="px-4 py-3 font-medium text-muted">Category</th>
              <th className="px-4 py-3 font-medium text-muted">Report</th>
              <th className="px-4 py-3 font-medium text-muted">Urgency</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items === null ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No repair reports yet.
                </td>
              </tr>
            ) : (
              items.map((m) => {
                const rowPhotos = parseRepairPhotos(m.photoAttachments);
                return (
                  <tr key={m.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-white">
                      <div>{m.tenant?.name || m.tenantName}</div>
                      <div className="text-xs text-muted">{m.tenant?.email ?? m.tenantEmail}</div>
                    </td>
                    <td className="max-w-[200px] px-4 py-3 text-muted">
                      {m.property ? `${m.property.title} — ${m.property.address}` : m.propertyAddressOrRef}
                    </td>
                    <td className="max-w-[220px] break-words px-4 py-3 text-white">{m.issueCategory}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setReportOpenId(m.id)}
                        className="text-sm font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-light hover:decoration-primary"
                      >
                        Open full report
                        {rowPhotos.length > 0 ? (
                          <span className="font-normal text-muted">
                            {" "}
                            ({rowPhotos.length} photo{rowPhotos.length === 1 ? "" : "s"})
                          </span>
                        ) : null}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{m.urgency}</td>
                    <td className="px-4 py-3">
                      <select
                        value={m.status}
                        onChange={(e) =>
                          updateStatus(m.id, e.target.value as "pending" | "in_progress" | "resolved")
                        }
                        className="rounded-lg border border-white/20 bg-overlay/40 px-2 py-1.5 text-xs text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel"
                      >
                        <option value="pending">pending</option>
                        <option value="in_progress">in_progress</option>
                        <option value="resolved">resolved</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {reportOpen && (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="repair-report-title"
        >
          <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-panel/95 px-4 py-4 backdrop-blur-sm sm:px-6">
            <div className="min-w-0 flex-1">
              <h2 id="repair-report-title" className="text-lg font-semibold text-white sm:text-xl">
                Repair report
              </h2>
              <p className="mt-1 text-sm text-muted">
                {new Date(reportOpen.createdAt).toLocaleString()} ·{" "}
                {reportOpen.tenant?.name || reportOpen.tenantName} ({reportOpen.tenant?.email ?? reportOpen.tenantEmail})
              </p>
              <p className="mt-2 text-sm text-white/90">
                <span className="text-muted">Building: </span>
                {reportOpen.property
                  ? `${reportOpen.property.title} — ${reportOpen.property.address}`
                  : reportOpen.propertyAddressOrRef}
              </p>
              <p className="mt-1 text-sm text-white/90">
                <span className="text-muted">Category: </span>
                {reportOpen.issueCategory}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted">Urgency</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-sm text-white">{reportOpen.urgency}</span>
                <span className="text-sm text-muted">Status</span>
                <select
                  value={reportOpen.status}
                  onChange={(e) =>
                    updateStatus(reportOpen.id, e.target.value as "pending" | "in_progress" | "resolved")
                  }
                  className="rounded-lg border border-white/20 bg-overlay/40 px-3 py-1.5 text-sm text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel"
                >
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReportOpenId(null)}
              className="shrink-0 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Close
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-3xl pb-24">
              <RepairReportDetails
                description={reportOpen.description ?? ""}
                photoUrls={parseRepairPhotos(reportOpen.photoAttachments)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
