"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { tenanciesApi } from "@/lib/api";

export function ApplicationForm({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [employment, setEmployment] = useState("");
  const [references, setReferences] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("loading");
    try {
      await tenanciesApi.submitApplication({
        propertyId,
        name: name || (user?.name ?? ""),
        email: email || (user?.email ?? ""),
        phone: phone || undefined,
        employment: employment || undefined,
        references: references || undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass = "w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input
        type="text"
        placeholder="Your name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="email"
        placeholder="Your email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={inputClass}
      />
      <textarea
        placeholder="Employment details"
        value={employment}
        onChange={(e) => setEmployment(e.target.value)}
        rows={2}
        className={inputClass}
      />
      <textarea
        placeholder="References (previous landlord, etc.)"
        value={references}
        onChange={(e) => setReferences(e.target.value)}
        rows={2}
        className={inputClass}
      />
      {!user && (
        <p className="text-xs text-muted">
          <Link href="/login" className="text-primary hover:underline">Sign in</Link> to link your application to your account and track its status.
        </p>
      )}
      {status === "success" && <p className="text-sm text-green-400">Application submitted. We&apos;ll be in touch.</p>}
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black hover:bg-primary-light disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
