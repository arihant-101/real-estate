"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { landlordApi, areasApi, type LandlordProperty, type Area, type MaintenanceRequestDetail, type TenancyApplicationItem } from "@/lib/api";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { usePolling } from "@/hooks/usePolling";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none [&>option]:bg-panel";
const selectClass =
  "mt-1 w-full appearance-none rounded-none border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel";

type Tab = "overview" | "activity" | "availability" | "analytics" | "tenants" | "maintenance" | "financials";

function ApplicationRow({
  item,
  onApprove,
  onReject,
}: {
  item: TenancyApplicationItem;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const pending = item.status === "PENDING";
  return (
    <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-white">{item.name}</p>
          <p className="text-sm text-muted">{item.email}</p>
          <p className="mt-1 text-xs text-muted">
            {new Date(item.createdAt).toLocaleString()} · {item.status}
          </p>
        </div>
        {pending && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  await onApprove();
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  await onReject();
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="rounded border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MaintenanceRow({
  item,
  onStatusChange,
}: {
  item: MaintenanceRequestDetail;
  onStatusChange: (status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  return (
    <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-white">{item.issueCategory}</p>
          <p className="text-sm text-muted">{item.tenantName} · {item.propertyAddressOrRef}</p>
          <p className="mt-1 text-sm text-muted line-clamp-2">{item.description}</p>
        </div>
        <select
          value={item.status}
          onChange={async (e) => {
            const v = e.target.value;
            setUpdating(true);
            try {
              await onStatusChange(v);
            } finally {
              setUpdating(false);
            }
          }}
          disabled={updating}
          className="appearance-none rounded-none border border-white/20 bg-white/5 px-2 py-1 text-sm text-white [&>option]:bg-panel"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <p className="mt-2 text-xs text-muted">
        {new Date(item.createdAt).toLocaleString()} · Urgency: {item.urgency}
      </p>
    </div>
  );
}

export default function PortalPropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [property, setProperty] = useState<LandlordProperty | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceRequestDetail[] | null>(null);
  const [applicationItems, setApplicationItems] = useState<TenancyApplicationItem[] | null>(null);
  const [activityData, setActivityData] = useState<{
    views: Array<{ id: string; viewedAt: string; user?: { id: string; name: string | null; email: string } }>;
    maintenanceRequests: MaintenanceRequestDetail[];
    applications: TenancyApplicationItem[];
  } | null>(null);
  const [analyticsData, setAnalyticsData] = useState<{
    views: { last7d: number; last30d: number; allTime: number };
    maintenance: { open: number; resolved: number };
    applications: { pending: number; approved: number; rejected: number };
    favoritesCount: number;
  } | null>(null);
  const [availabilityItems, setAvailabilityItems] = useState<Array<{ id: string; startDate: string; endDate: string }>>([]);
  const [financialsData, setFinancialsData] = useState<{
    tenancies: Array<{
      id: string;
      tenant: { name: string | null; email: string };
      rentLedgerEntries: Array<{ dueDate: string; amount: string | number; type: string; status: string }>;
    }>;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "LANDLORD") {
      router.replace("/portal");
      return;
    }
    if (tab === "maintenance" && property) {
      landlordApi.listPropertyMaintenance(property.id)
        .then((r) => setMaintenanceItems(r.items))
        .catch(() => setMaintenanceItems([]));
    }
    if (tab === "tenants" && property) {
      landlordApi.listApplications(property.id)
        .then((r) => setApplicationItems(r.items))
        .catch(() => setApplicationItems([]));
    }
    if (tab === "financials" && property) {
      landlordApi.getPropertyFinancials(property.id)
        .then((r) => setFinancialsData(r as typeof financialsData))
        .catch(() => setFinancialsData(null));
    }
    if (tab === "activity" && property) {
      landlordApi.getPropertyActivity(property.id)
        .then(setActivityData)
        .catch(() => setActivityData(null));
    }
    if (tab === "analytics" && property) {
      landlordApi.getPropertyAnalytics(property.id)
        .then(setAnalyticsData)
        .catch(() => setAnalyticsData(null));
    }
    if (tab === "availability" && property) {
      landlordApi.listPropertyAvailability(property.id)
        .then((r) => setAvailabilityItems(r.items))
        .catch(() => setAvailabilityItems([]));
    }
  }, [tab, property?.id]);

  usePolling(
    () => {
      if (!property) return;
      if (tab === "activity") {
        landlordApi.getPropertyActivity(property.id).then(setActivityData).catch(() => {});
      } else if (tab === "maintenance") {
        landlordApi.listPropertyMaintenance(property.id).then((r) => setMaintenanceItems(r.items)).catch(() => {});
      } else if (tab === "tenants") {
        landlordApi.listApplications(property.id).then((r) => setApplicationItems(r.items)).catch(() => {});
      } else if (tab === "analytics") {
        landlordApi.getPropertyAnalytics(property.id).then(setAnalyticsData).catch(() => {});
      } else if (tab === "availability") {
        landlordApi.listPropertyAvailability(property.id).then((r) => setAvailabilityItems(r.items)).catch(() => {});
      }
    },
    12000,
    !!property && ["activity", "maintenance", "tenants", "analytics", "availability"].includes(tab)
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "LANDLORD") {
      router.replace("/portal");
      return;
    }
    Promise.all([landlordApi.getProperty(id), areasApi.list()])
      .then(([p, a]) => {
        setProperty(p);
        setAreas(a);
        const urls = p.images?.map((i) => i.url) ?? [];
        while (urls.length < 5) urls.push("");
        setForm({
          title: p.title,
          address: p.address,
          city: p.city,
          postCode: p.postCode ?? "",
          areaId: p.area?.id ?? "",
          listingType: p.listingType,
          beds: p.beds,
          baths: p.baths,
          areaSqFt: p.areaSqFt,
          pricePerMonth: Number(p.pricePerMonth),
          description: p.description ?? "",
          status: p.status ?? "DRAFT",
          imageUrls: urls,
        });
      })
      .catch(() => setError("Property not found"));
  }, [id, loading, user, router]);

  async function handleSaveOverview(e: React.FormEvent) {
    e.preventDefault();
    if (!property) return;
    setError("");
    const urls = ((form.imageUrls as string[]) ?? []).filter((u) => typeof u === "string" && u.trim());
    if (urls.length > 0 && (urls.length < 5 || urls.length > 10)) {
      setError("Property must have between 5 and 10 images.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        areaId: (form.areaId as string) || null,
        imageUrls: urls.length > 0 ? urls : undefined,
      };
      const updated = await landlordApi.updateProperty(property.id, payload);
      setProperty(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-red-400">{error}</p>
        <Link href="/portal/properties" className="mt-4 inline-block text-primary hover:underline">
          ← Back to properties
        </Link>
      </div>
    );
  }

  if (!property) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "availability", label: "Availability" },
    { id: "analytics", label: "Analytics" },
    { id: "tenants", label: "Tenant placement" },
    { id: "maintenance", label: "Maintenance" },
    { id: "financials", label: "Financials" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/portal/properties" className="text-sm font-medium text-muted hover:text-white">
        ← My Properties
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-white">{property.title}</h1>
      <p className="text-sm text-muted">
        {property.address}, {property.city} {property.postCode && `· ${property.postCode}`}
      </p>

      <div className="mt-4 flex gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "border-white text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <form onSubmit={handleSaveOverview} className="mt-6 space-y-5 rounded-xl border border-white/10 bg-panel/50 p-6">
          <div>
            <label className="block text-sm font-medium text-white">Title *</label>
            <input
              required
              className={inputClass}
              value={(form.title as string) ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white">Address *</label>
              <input
                required
                className={inputClass}
                value={(form.address as string) ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">City *</label>
              <input
                required
                className={inputClass}
                value={(form.city as string) ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Post code</label>
            <input
              className={inputClass}
              value={(form.postCode as string) ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, postCode: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Area</label>
            <select
              className={selectClass}
              value={(form.areaId as string) ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, areaId: e.target.value }))}
            >
              <option value="">Select area</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Description</label>
            <textarea
              rows={3}
              className={inputClass}
              value={(form.description as string) ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-white">Type</label>
              <select
                className={selectClass}
                value={(form.listingType as string) ?? "RENTAL"}
                onChange={(e) => setForm((f) => ({ ...f, listingType: e.target.value }))}
              >
                <option value="RENTAL">Rental</option>
                <option value="HOLIDAY_LET">Holiday let</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Beds</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={(form.beds as number) ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, beds: Number(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Baths</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={(form.baths as number) ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, baths: Number(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Status</label>
              <select
                className={selectClass}
                value={(form.status as string) ?? "DRAFT"}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="DRAFT">Draft</option>
                <option value="LIVE">Live</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white">Sq ft</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={(form.areaSqFt as number) ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, areaSqFt: Number(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Rent per month (£)</label>
              <input
                type="number"
                min={0}
                step={50}
                className={inputClass}
                value={(form.pricePerMonth as number) ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, pricePerMonth: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Images (5–10 required) *</label>
            <div className="mt-2 space-y-2">
              {((form.imageUrls as string[]) ?? []).map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    className={inputClass}
                    value={url ?? ""}
                    onChange={(e) => {
                      const next = [...((form.imageUrls as string[]) ?? [])];
                      next[i] = e.target.value;
                      setForm((f) => ({ ...f, imageUrls: next }));
                    }}
                    placeholder={`Image ${i + 1} URL`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (form.imageUrls as string[]) ?? [];
                      if (arr.length > 5) {
                        setForm((f) => ({
                          ...f,
                          imageUrls: arr.filter((_, j) => j !== i),
                        }));
                      }
                    }}
                    disabled={((form.imageUrls as string[]) ?? []).length <= 5}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {((form.imageUrls as string[]) ?? []).length < 10 && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, imageUrls: [...((f.imageUrls as string[]) ?? []), ""] }))}
                  className="rounded-lg border border-dashed border-white/30 px-3 py-2 text-sm text-muted hover:border-white/50 hover:text-white"
                >
                  + Add image
                </button>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}

      {tab === "activity" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-panel/50 p-6">
          <h3 className="text-lg font-semibold text-white">Tenant activity</h3>
          <p className="mt-1 text-sm text-muted">Views, maintenance requests, and applications for this property.</p>
          {activityData === null ? (
            <p className="mt-4 text-muted">Loading…</p>
          ) : (
            <div className="mt-6 space-y-8">
              <div>
                <h4 className="text-sm font-medium text-muted uppercase tracking-wider">Recent views</h4>
                {activityData.views.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No views yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {activityData.views.map((v) => (
                      <li key={v.id} className="flex justify-between text-sm">
                        <span className="text-white">{v.user ? (v.user.name || v.user.email) : "Anonymous"}</span>
                        <span className="text-muted">{new Date(v.viewedAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted uppercase tracking-wider">Maintenance requests</h4>
                {activityData.maintenanceRequests.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No maintenance requests.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {activityData.maintenanceRequests.map((m) => (
                      <li key={m.id} className="flex justify-between text-sm">
                        <span className="text-white">{(m as MaintenanceRequestDetail & { tenant?: { name: string | null; email: string } }).tenant?.name ?? (m as MaintenanceRequestDetail & { tenant?: { name: string | null; email: string } }).tenant?.email ?? m.tenantName}</span>
                        <span className="text-muted">{m.issueCategory} · {new Date(m.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted uppercase tracking-wider">Applications</h4>
                {activityData.applications.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No applications.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {activityData.applications.map((a) => (
                      <li key={a.id} className="flex justify-between text-sm">
                        <span className="text-white">{(a as TenancyApplicationItem & { applicant?: { name: string | null; email: string } }).applicant?.name ?? (a as TenancyApplicationItem & { applicant?: { name: string | null; email: string } }).applicant?.email ?? a.name}</span>
                        <span className="text-muted">{a.status} · {new Date(a.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "availability" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-panel/50 p-6">
          <h3 className="text-lg font-semibold text-white">Availability</h3>
          <p className="mt-1 text-sm text-muted">Mark when your property is free for tenants to book.</p>
          <AvailabilityForm
            propertyId={property.id}
            items={availabilityItems}
            onAdd={() => { if (property) landlordApi.listPropertyAvailability(property.id).then((r) => setAvailabilityItems(r.items)); }}
            onRemove={() => { if (property) landlordApi.listPropertyAvailability(property.id).then((r) => setAvailabilityItems(r.items)); }}
          />
        </div>
      )}

      {tab === "analytics" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-panel/50 p-6">
          <h3 className="text-lg font-semibold text-white">Analytics</h3>
          <p className="mt-1 text-sm text-muted">Per-property overview.</p>
          {analyticsData === null ? (
            <p className="mt-4 text-muted">Loading…</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Views (7d)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.views.last7d}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Views (30d)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.views.last30d}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Views (all)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.views.allTime}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Favorites</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.favoritesCount}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Maintenance (open)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.maintenance.open}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Maintenance (resolved)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.maintenance.resolved}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Applications (pending)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.applications.pending}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Applications (approved)</p>
                <p className="mt-1 text-2xl font-bold text-white">{analyticsData.applications.approved}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "tenants" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-panel/50 p-6">
          <h3 className="text-lg font-semibold text-white">Tenant applications</h3>
          {applicationItems === null ? (
            <p className="mt-4 text-muted">Loading…</p>
          ) : applicationItems.length === 0 ? (
            <p className="mt-4 text-muted">No applications for this property.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {applicationItems.map((a) => (
                <ApplicationRow
                  key={a.id}
                  item={a}
                  onApprove={async () => {
                    await landlordApi.approveApplication(a.id);
                    setApplicationItems((prev) =>
                      prev?.map((x) => (x.id === a.id ? { ...x, status: "APPROVED" } : x)) ?? []
                    );
                  }}
                  onReject={async () => {
                    await landlordApi.rejectApplication(a.id);
                    setApplicationItems((prev) =>
                      prev?.map((x) => (x.id === a.id ? { ...x, status: "REJECTED" } : x)) ?? []
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "maintenance" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-panel/50 p-6">
          <h3 className="text-lg font-semibold text-white">Maintenance requests</h3>
          {maintenanceItems === null ? (
            <p className="mt-4 text-muted">Loading…</p>
          ) : maintenanceItems.length === 0 ? (
            <p className="mt-4 text-muted">No maintenance requests for this property.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {maintenanceItems.map((m) => (
                <MaintenanceRow
                  key={m.id}
                  item={m}
                  onStatusChange={async (status) => {
                    await landlordApi.updateMaintenanceStatus(m.id, status);
                    setMaintenanceItems((prev) =>
                      prev?.map((x) => (x.id === m.id ? { ...x, status } : x)) ?? []
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "financials" && (
        <div className="mt-6 rounded-xl border border-white/10 bg-panel/50 p-6">
          <h3 className="text-lg font-semibold text-white">Financials</h3>
          {financialsData === null ? (
            <p className="mt-4 text-muted">Loading…</p>
          ) : !financialsData.tenancies?.length ? (
            <p className="mt-4 text-muted">No active tenancies. Rent and ledger entries will appear here.</p>
          ) : (
            <div className="mt-4 space-y-6">
              {financialsData.tenancies.map((t) => (
                <div key={t.id} className="rounded-lg border border-white/5 bg-overlay/40 p-4">
                  <p className="font-medium text-white">{t.tenant?.name ?? t.tenant?.email ?? "Tenant"}</p>
                  <div className="mt-3 space-y-2">
                    {t.rentLedgerEntries?.map((e, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted">
                          {new Date(e.dueDate).toLocaleDateString()} · {e.type}
                        </span>
                        <span className={e.status === "PAID" ? "text-green-400" : "text-white"}>
                          £{Number(e.amount).toLocaleString()} · {e.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
