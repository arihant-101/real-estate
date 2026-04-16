"use client";

import { useState } from "react";
import { enquiriesApi } from "@/lib/api";

const inputClass = (dark: boolean) =>
  dark
    ? "w-full rounded border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
    : "w-full rounded border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none";

export function EnquiryForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("loading");
    try {
      await enquiriesApi.submit({ name, email, phone: phone || undefined, subject: subject || undefined, message, consent });
      setStatus("success");
      setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage(""); setConsent(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3">
      <input
        type="text"
        placeholder="Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputClass(dark)}
      />
      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass(dark)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={inputClass(dark)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className={inputClass(dark)}
      />
      <textarea
        placeholder="Message *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        className={`${inputClass(dark)} resize-none`}
      />
      <label className={`flex items-center gap-2 text-sm ${dark ? "text-white/80" : "text-neutral-500"}`}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="rounded border-neutral-300" />
        I consent to being contacted about my enquiry.
      </label>
      {status === "success" && <p className={`text-sm ${dark ? "text-emerald-300" : "text-emerald-600"}`}>Thank you. We&apos;ll be in touch soon.</p>}
      {status === "error" && <p className={`text-sm ${dark ? "text-red-300" : "text-red-600"}`}>{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className={dark ? "w-full rounded border-2 border-primary bg-primary py-2.5 text-sm font-medium text-black transition hover:bg-primary-light disabled:opacity-50" : "w-full rounded border-2 border-black bg-black py-2.5 text-sm font-medium text-white hover:bg-white hover:text-black disabled:opacity-50 focus:outline-none"}
      >
        {status === "loading" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
