"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, landlordApi, tenantApi, type EnquirySummary, type MaintenanceSummary, type Testimonial } from "@/lib/api";

const PORTAL_URL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_PORTAL_URL : undefined;

export default function PortalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquirySummary[] | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceSummary[] | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[] | null>(null);
  const [financialSummary, setFinancialSummary] = useState<{ dueThisMonth: number; collected: number; overdue: number } | null>(null);
  const [tenantFinancials, setTenantFinancials] = useState<{ tenancy: unknown; entries: unknown[] } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      (async () => {
        try {
          setAdminError(null);
          const [enqRes, mrRes, testRes] = await Promise.all([
            adminApi.listEnquiries(5),
            adminApi.listMaintenanceRequests(5),
            adminApi.listPendingTestimonials(20).catch(() => ({ items: [] })),
          ]);
          setEnquiries(enqRes.items);
          setMaintenance(mrRes.items);
          setPendingTestimonials(testRes.items);
        } catch (err) {
          setAdminError("Could not load dashboard data. Please try again later.");
        }
      })();
    }
  }, [loading, user]);

  useEffect(() => {
    if (!loading && user?.role === "LANDLORD") {
      landlordApi.getFinancialSummary().then(setFinancialSummary).catch(() => setFinancialSummary(null));
    }
  }, [loading, user?.role]);

  useEffect(() => {
    if (!loading && user?.role === "TENANT") {
      tenantApi.getFinancials().then(setTenantFinancials).catch(() => setTenantFinancials(null));
    }
  }, [loading, user?.role]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleLabel = user.role === "LANDLORD" ? "Landlord" : user.role === "ADMIN" ? "Admin" : "Tenant";
  const isAdmin = user.role === "ADMIN";
  const isLandlord = user.role === "LANDLORD";
  const isTenant = user.role === "TENANT";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Portal</h1>
      <p className="mt-2 text-muted">
        Welcome back{user.name ? `, ${user.name}` : ""}. You are signed in as a {roleLabel}.
      </p>

      {/* Landlord dashboard */}
      {isLandlord && (
        <section className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Landlord dashboard</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financialSummary && (
              <>
                <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">Rent due this month</p>
                  <p className="mt-1 text-xl font-bold text-white">£{financialSummary.dueThisMonth.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">Collected</p>
                  <p className="mt-1 text-xl font-bold text-green-400">£{financialSummary.collected.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">Overdue</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">£{financialSummary.overdue.toLocaleString()}</p>
                </div>
              </>
            )}
            <Link
              href="/portal/properties"
              className="flex flex-col rounded-xl border border-white/10 bg-panel/50 p-5 transition hover:border-white/20 hover:bg-panel/70"
            >
              <span className="text-sm font-semibold text-white">My Properties</span>
              <span className="mt-1 text-sm text-muted">List and manage your properties</span>
              <span className="mt-2 text-sm font-medium text-primary">View properties →</span>
            </Link>
          </div>
        </section>
      )}

      {/* Tenant dashboard */}
      {isTenant && (
        <section className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Tenant dashboard</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tenantFinancials?.tenancy != null && (
              <div className="rounded-xl border border-white/10 bg-panel/50 p-5">
                <span className="text-sm font-semibold text-white">Your home</span>
                <p className="mt-1 text-sm text-muted">
                  {(tenantFinancials.tenancy as { property?: { title?: string } })?.property?.title ?? "Current tenancy"}
                </p>
                <p className="mt-1 text-sm text-white">
                  Rent: £{Number((tenantFinancials.tenancy as { rentAmount?: string | number })?.rentAmount ?? 0).toLocaleString()}/month
                </p>
              </div>
            )}
            {tenantFinancials?.entries != null && (tenantFinancials.entries as unknown[]).length > 0 && (
              <div className="rounded-xl border border-white/10 bg-panel/50 p-5">
                <span className="text-sm font-semibold text-white">Rent</span>
                <p className="mt-1 text-sm text-muted">Upcoming and recent rent entries</p>
                <p className="mt-2 text-sm text-muted">
                  {(tenantFinancials.entries as unknown[]).length} entries
                </p>
              </div>
            )}
            <Link
              href="/portal/maintenance"
              className="flex flex-col rounded-xl border border-white/10 bg-panel/50 p-5 transition hover:border-white/20 hover:bg-panel/70"
            >
              <span className="text-sm font-semibold text-white">Maintenance requests</span>
              <span className="mt-1 text-sm text-muted">Submit and track repair requests</span>
              <span className="mt-2 text-sm font-medium text-primary">View requests →</span>
            </Link>
            <Link
              href="/portal/applications"
              className="flex flex-col rounded-xl border border-white/10 bg-panel/50 p-5 transition hover:border-white/20 hover:bg-panel/70 sm:col-span-2"
            >
              <span className="text-sm font-semibold text-white">My applications</span>
              <span className="mt-1 text-sm text-muted">Track your property applications</span>
              <span className="mt-2 text-sm font-medium text-primary">View applications →</span>
            </Link>
          </div>
        </section>
      )}

      {/* Portal Information & Links */}
      <div className="mt-8 space-y-4 rounded-xl border border-white/10 bg-panel/50 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
          Portal Features & Support
        </h3>
        
        {PORTAL_URL ? (
          <>
            <p className="text-sm text-muted">
              Access comprehensive property management tools including documents, rent tracking, 
              maintenance updates, financial reports, and secure communication with our team.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light"
              >
                Open Full Portal
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Link
                href="/login-portal"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Portal Features
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">
              Your portal provides 24/7 access to property management tools, documents, 
              rent tracking, and secure communication. Contact us for full portal access.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login-portal"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light"
              >
                Learn About Portal Features
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Contact Support
              </Link>
            </div>
          </>
        )}

        {!isAdmin && (
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Quick links</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              <Link href="/property-listings" className="font-medium text-primary hover:underline">
                Browse properties
              </Link>
              <span className="text-muted">·</span>
              <Link href="/maintenance-request" className="font-medium text-primary hover:underline">
                Submit maintenance request
              </Link>
              <span className="text-muted">·</span>
              <Link href="/login-portal-help" className="font-medium text-primary hover:underline">
                Portal help & FAQ
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Admin dashboard */}
      {isAdmin && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">Management dashboard</h2>
          {adminError && <p className="text-sm text-red-400">{adminError}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-panel/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Recent enquiries</h3>
                <span className="text-xs text-muted">Latest 5</span>
              </div>
              <div className="mt-3 space-y-2">
                {enquiries && enquiries.length === 0 && (
                  <p className="text-sm text-muted">No enquiries yet.</p>
                )}
                {enquiries?.map((e) => (
                  <div key={e.id} className="rounded-lg border border-white/5 bg-overlay/40 px-3 py-2">
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
                {!enquiries && (
                  <p className="text-sm text-muted">Loading enquiries…</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-panel/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Recent maintenance requests</h3>
                <span className="text-xs text-muted">Latest 5</span>
              </div>
              <div className="mt-3 space-y-2">
                {maintenance && maintenance.length === 0 && (
                  <p className="text-sm text-muted">No maintenance requests yet.</p>
                )}
                {maintenance?.map((m) => (
                  <div key={m.id} className="rounded-lg border border-white/5 bg-overlay/40 px-3 py-2">
                    <p className="text-sm font-medium text-white">
                      {m.issueCategory}{" "}
                      <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        {m.urgency}
                      </span>
                    </p>
                    <p className="text-xs text-muted">
                      {m.tenantName} · {m.propertyAddressOrRef}
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
                {!maintenance && (
                  <p className="text-sm text-muted">Loading maintenance requests…</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-panel/60 p-5 md:col-span-2">
              <h3 className="text-sm font-semibold text-white">Pending testimonials</h3>
              {pendingTestimonials?.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No pending testimonials.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {pendingTestimonials?.map((t) => (
                    <div key={t.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-white/5 bg-overlay/40 px-3 py-2">
                      <div>
                        <p className="text-sm text-muted line-clamp-2">&ldquo;{t.content}&rdquo;</p>
                        <p className="mt-1 text-xs text-muted">{t.authorName} · {t.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await adminApi.updateTestimonialApproval(t.id, true);
                            setPendingTestimonials((prev) => prev?.filter((x) => x.id !== t.id) ?? []);
                          }}
                          className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await adminApi.updateTestimonialApproval(t.id, false);
                            setPendingTestimonials((prev) => prev?.filter((x) => x.id !== t.id) ?? []);
                          }}
                          className="rounded border border-white/20 px-2 py-1 text-xs font-medium text-white hover:bg-white/10"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
