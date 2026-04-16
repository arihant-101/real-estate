"use client";

import { useState } from "react";
import { landlordApi } from "@/lib/api";

export function AvailabilityForm({
  propertyId,
  items,
  onAdd,
  onRemove,
}: {
  propertyId: string;
  items: Array<{ id: string; startDate: string; endDate: string }>;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setError("End date must be after start date.");
      return;
    }
    setLoading(true);
    try {
      await landlordApi.addPropertyAvailability(propertyId, {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      setStartDate("");
      setEndDate("");
      onAdd();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add availability");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await landlordApi.removePropertyAvailability(propertyId, id);
      onRemove();
    } catch {
      // ignore
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none";

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-white">Start date</label>
          <input
            type="date"
            className={inputClass}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">End date</label>
          <input
            type="date"
            className={inputClass}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black hover:bg-primary-light disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add availability"}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div>
        <h4 className="text-sm font-medium text-muted">Current availability</h4>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No availability blocks. Add dates above.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-overlay/40 px-4 py-2">
                <span className="text-white">
                  {new Date(item.startDate).toLocaleDateString()} – {new Date(item.endDate).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
