"use client";

import { useState } from "react";
import { testimonialsApi } from "@/lib/api";

export function TestimonialForm() {
  const [authorName, setAuthorName] = useState("");
  const [role, setRole] = useState("Tenant");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | "">(5);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [includeNameLocation, setIncludeNameLocation] = useState(true);
  const [consent, setConsent] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("loading");
    try {
      await testimonialsApi.submit({
        authorName,
        role,
        content,
        rating: rating === "" ? undefined : Number(rating),
        emailForVerification: emailForVerification || undefined,
        includeNameLocation,
        consent,
        photoData: photoData ?? undefined,
      });
      setStatus("success");
      setAuthorName("");
      setContent("");
      setRating(5);
      setEmailForVerification("");
      setIncludeNameLocation(true);
      setConsent(false);
      setPhotoData(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mt-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="group">
          <label className="mb-2 block text-sm text-white/60">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="w-full rounded-xl border-0 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 ring-1 ring-white/5 transition-all focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Email */}
        <div className="group">
          <label className="mb-2 block text-sm text-white/60">
            Email Address
          </label>
          <input
            type="email"
            placeholder="For verification only (not published)"
            value={emailForVerification}
            onChange={(e) => setEmailForVerification(e.target.value)}
            className="w-full rounded-xl border-0 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 ring-1 ring-white/5 transition-all focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Client Type */}
        <div className="group">
          <label className="mb-2 block text-sm text-white/60">
            Client Type
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none rounded-xl border-0 bg-white/[0.03] px-4 py-3 pr-10 text-white ring-1 ring-white/5 transition-all focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30 [&>option]:bg-panel [&>option]:text-white"
            >
              <option value="Tenant">Tenant</option>
              <option value="Landlord">Landlord</option>
              <option value="Holiday Let Client">Holiday let client</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="group">
          <label className="mb-2 block text-sm text-white/60">
            Rating (Optional)
          </label>
          <div className="flex items-center gap-4 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5">
            <input
              type="range"
              min={1}
              max={5}
              value={rating === "" ? 5 : rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <div className="flex h-7 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-sm text-white">
              {rating === "" ? 5 : rating}
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="group">
          <label className="mb-2 block text-sm text-white/60">
            Your Testimonial <span className="text-primary">*</span>
          </label>
          <textarea
            placeholder="Share your experience with ASTA Property Management..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="w-full resize-none rounded-xl border-0 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 ring-1 ring-white/5 transition-all focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Include Name & Location */}
        <div className="group">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={includeNameLocation}
              onChange={(e) => setIncludeNameLocation(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/30"
            />
            <div>
              <span className="text-sm text-white">Include name & location</span>
              <p className="text-xs text-white/40">
                Allow us to display your first name and location with your testimonial
              </p>
            </div>
          </label>
        </div>

        {/* Photo Upload */}
        <div className="group">
          <label className="mb-2 block text-sm text-white/60">
            Photo (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <div className="flex h-12 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] transition-colors peer-hover:border-white/20 peer-hover:bg-white/[0.03]">
              {photoData ? (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Photo attached
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Click to add photo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="group">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/30"
            />
            <div>
              <span className="text-sm text-white">
                Publication Consent <span className="text-primary">*</span>
              </span>
              <p className="text-xs text-white/40 leading-relaxed">
                I agree that ASTA Property Management may publish this testimonial for promotional purposes. 
                I confirm the statements made are honest and reflect my personal experience.
              </p>
            </div>
          </label>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
            <p className="text-sm text-emerald-400">
              Thank you! Your testimonial has been submitted and will be reviewed before publishing.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl bg-red-500/10 p-3 ring-1 ring-red-500/20">
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-black transition-all hover:bg-primary-light disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Share My Testimonial"}
        </button>
      </form>
    </div>
  );
}
