"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { landlordApi, areasApi, type Area } from "@/lib/api";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none [&>option]:bg-panel";
const selectClass =
  "mt-1 w-full appearance-none rounded-none border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel";

export default function NewPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    address: string;
    city: string;
    postCode: string;
    areaId: string;
    listingType: "RENTAL" | "HOLIDAY_LET";
    beds: number;
    baths: number;
    areaSqFt: number;
    pricePerMonth: number;
    description: string;
    imageUrls: string[];
  }>({
    title: "",
    address: "",
    city: "",
    postCode: "",
    areaId: "",
    listingType: "RENTAL",
    beds: 2,
    baths: 1,
    areaSqFt: 800,
    pricePerMonth: 1500,
    description: "",
    imageUrls: ["", "", "", "", ""],
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "LANDLORD") {
      router.replace("/portal");
      return;
    }
    areasApi.list().then(setAreas).catch(() => setAreas([]));
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const urls = form.imageUrls.filter((u) => u.trim());
    if (urls.length < 5 || urls.length > 10) {
      setError("Please add between 5 and 10 image URLs.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        areaId: form.areaId || null,
        imageUrls: urls,
      };
      const created = await landlordApi.createProperty(payload);
      router.push("/portal/properties/" + created.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create property");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/portal/properties" className="text-sm font-medium text-muted hover:text-white">
        ← My Properties
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-white">Add property</h1>
      <p className="mt-1 text-sm text-muted">New listings are created as draft. You can publish when ready.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-xl border border-white/10 bg-panel/50 p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">Title *</label>
          <input
            id="title"
            required
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Modern Two-Bed Apartment"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-white">Address *</label>
            <input
              id="address"
              required
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-white">City *</label>
            <input
              id="city"
              required
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label htmlFor="postCode" className="block text-sm font-medium text-white">Post code</label>
          <input
            id="postCode"
            className={inputClass}
            value={form.postCode}
            onChange={(e) => setForm((f) => ({ ...f, postCode: e.target.value }))}
            placeholder="e.g. SW1A 1AA"
          />
        </div>
        <div>
          <label htmlFor="areaId" className="block text-sm font-medium text-white">Area</label>
          <select
            id="areaId"
            className={selectClass}
            value={form.areaId}
            onChange={(e) => setForm((f) => ({ ...f, areaId: e.target.value }))}
          >
            <option value="">Select area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
          <textarea
            id="description"
            rows={3}
            className={inputClass}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="listingType" className="block text-sm font-medium text-white">Type</label>
            <select
              id="listingType"
              className={selectClass}
              value={form.listingType}
              onChange={(e) => setForm((f) => ({ ...f, listingType: e.target.value as "RENTAL" | "HOLIDAY_LET" }))}
            >
              <option value="RENTAL">Rental</option>
              <option value="HOLIDAY_LET">Holiday let</option>
            </select>
          </div>
          <div>
            <label htmlFor="beds" className="block text-sm font-medium text-white">Beds *</label>
            <input
              id="beds"
              type="number"
              min={0}
              className={inputClass}
              value={form.beds}
              onChange={(e) => setForm((f) => ({ ...f, beds: Number(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label htmlFor="baths" className="block text-sm font-medium text-white">Baths *</label>
            <input
              id="baths"
              type="number"
              min={0}
              className={inputClass}
              value={form.baths}
              onChange={(e) => setForm((f) => ({ ...f, baths: Number(e.target.value) || 0 }))}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="areaSqFt" className="block text-sm font-medium text-white">Sq ft *</label>
            <input
              id="areaSqFt"
              type="number"
              min={0}
              className={inputClass}
              value={form.areaSqFt}
              onChange={(e) => setForm((f) => ({ ...f, areaSqFt: Number(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label htmlFor="pricePerMonth" className="block text-sm font-medium text-white">Rent per month (£) *</label>
            <input
              id="pricePerMonth"
              type="number"
              min={0}
              step={50}
              className={inputClass}
              value={form.pricePerMonth}
              onChange={(e) => setForm((f) => ({ ...f, pricePerMonth: Number(e.target.value) || 0 }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Images (5–10 required) *</label>
          <p className="mt-0.5 text-xs text-muted">Add between 5 and 10 image URLs.</p>
          <div className="mt-2 space-y-2">
            {form.imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  className={inputClass}
                  value={url}
                  onChange={(e) => {
                    const next = [...form.imageUrls];
                    next[i] = e.target.value;
                    setForm((f) => ({ ...f, imageUrls: next }));
                  }}
                  placeholder={`Image ${i + 1} URL`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (form.imageUrls.length > 5) {
                      setForm((f) => ({
                        ...f,
                        imageUrls: form.imageUrls.filter((_, j) => j !== i),
                      }));
                    }
                  }}
                  disabled={form.imageUrls.length <= 5}
                  className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
            {form.imageUrls.length < 10 && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ""] }))}
                className="rounded-lg border border-dashed border-white/30 px-3 py-2 text-sm text-muted hover:border-white/50 hover:text-white"
              >
                + Add image
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create property"}
          </button>
          <Link
            href="/portal/properties"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
