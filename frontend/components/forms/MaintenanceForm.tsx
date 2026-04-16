"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { maintenanceApi, tenantApi } from "@/lib/api";

export function MaintenanceForm({ defaultAddress = "", propertyId }: { defaultAddress?: string; propertyId?: string }) {
  const { user } = useAuth();
  const [tenantName, setTenantName] = useState(user?.name ?? "");
  const [tenantEmail, setTenantEmail] = useState(user?.email ?? "");
  const [propertyAddressOrRef, setPropertyAddressOrRef] = useState(defaultAddress);
  const [issueCategory, setIssueCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("loading");
    try {
      if (propertyId && user?.role === "TENANT") {
        await tenantApi.submitMaintenanceRequest(propertyId, {
          issueCategory,
          description,
          urgency,
        });
      } else {
        await maintenanceApi.submit({
          tenantName: tenantName || (user?.name ?? ""),
          tenantEmail: tenantEmail || (user?.email ?? ""),
          propertyAddressOrRef: propertyId ? defaultAddress : propertyAddressOrRef,
          issueCategory,
          description,
          urgency,
          propertyId,
        });
      }
      setStatus("success");
      setTenantName(user?.name ?? ""); setTenantEmail(user?.email ?? ""); setPropertyAddressOrRef(defaultAddress); setIssueCategory(""); setDescription("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input
        type="text"
        placeholder="Your name *"
        value={tenantName}
        onChange={(e) => setTenantName(e.target.value)}
        required
        className="w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
      />
      <input
        type="email"
        placeholder="Your email *"
        value={tenantEmail}
        onChange={(e) => setTenantEmail(e.target.value)}
        required
        className="w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Property address or reference *"
        value={propertyAddressOrRef}
        onChange={(e) => setPropertyAddressOrRef(e.target.value)}
        required
        className="w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Issue category (e.g. Plumbing, Heating) *"
        value={issueCategory}
        onChange={(e) => setIssueCategory(e.target.value)}
        required
        className="w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
      />
      <textarea
        placeholder="Description *"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={3}
        className="w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
      />
      <select
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
        className="w-full appearance-none rounded-none border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      {status === "success" && <p className="text-sm text-green-400">Request submitted. We&apos;ll be in touch.</p>}
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      <button type="submit" disabled={status === "loading"} className="rounded bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light disabled:opacity-50">
        {status === "loading" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
