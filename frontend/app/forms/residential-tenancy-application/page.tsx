"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import {
  downloadResidentialTenancyApplicationPack,
  type ApplicantBlock,
  type TenancyApplicationFormData,
} from "@/lib/tenancy-application-pdf";

const emptyApplicant = (): ApplicantBlock => ({
  name: "",
  dob: "",
  phone: "",
  email: "",
  address: "",
  specialRequirements: "",
  pets: "",
  employmentStatus: "",
});

export default function ResidentialTenancyApplicationPage() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TenancyApplicationFormData>({
    holdingDepositReceiptDate: "",
    propertyAddress: "",
    rentAmountAndPeriod: "",
    proposedStartDate: "",
    totalOccupants: "",
    applicant1: emptyApplicant(),
    applicant2: emptyApplicant(),
    guarantorIfRequired: "",
    holdingDepositWeeksRentUnderstood: false,
    proceedImmediatelyIfSuccessful: "",
    declarationTrueAndComplete: false,
  });

  const setApplicant = (which: 1 | 2, field: keyof ApplicantBlock, value: string) => {
    const key = which === 1 ? "applicant1" : "applicant2";
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleDownload = async () => {
    setError(null);
    setDownloading(true);
    try {
      await downloadResidentialTenancyApplicationPack(form);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-2.5 text-sm text-white placeholder:text-elegant-muted/70 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-white";

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/forms"
            className="text-elegant-muted hover:text-primary mb-4 inline-flex items-center gap-2 text-sm transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </Link>

          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Image
                src="/asta-logo.png"
                alt="ASTA"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-lg object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Residential Tenancy Application</h1>
                <p className="text-elegant-muted mt-1 text-sm leading-relaxed">
                  NRLA-aligned application pack. Your completed application PDF includes the Holding Deposit Agreement
                  (England) and your ASTA logo on every page.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? "Building PDF…" : "Download PDF pack"}
            </button>
          </div>

          {error ? (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <p className="text-elegant-muted text-sm leading-relaxed">
            Please complete this form accurately and completely. All applications are subject to approval, background,
            and credit checks. Questions are numbered for clarity. We do not ask for a fixed lease term or break clause
            on this form — those are agreed in the tenancy agreement if you proceed.
          </p>
        </div>

        <div className="space-y-10 rounded-2xl border border-white/10 bg-panel/40 p-6 sm:p-8">
          <section>
            <h2 className="text-lg font-semibold text-white">Holding deposit acknowledgment</h2>
            <p className="text-elegant-muted mt-2 text-sm leading-relaxed">
              This agreement acknowledges the receipt of the Holding Deposit on the date below and your application to
              be considered for a tenancy at the Property below for the Rent.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Date holding deposit received (or to be received)</label>
                <input
                  type="text"
                  value={form.holdingDepositReceiptDate}
                  onChange={(e) => setForm((p) => ({ ...p, holdingDepositReceiptDate: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. 10/05/2026"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>1. Property address</label>
                <textarea
                  rows={2}
                  value={form.propertyAddress}
                  onChange={(e) => setForm((p) => ({ ...p, propertyAddress: e.target.value }))}
                  className={inputClass}
                  placeholder="Full address of the property"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>2. Rent (amount and period)</label>
                <input
                  type="text"
                  value={form.rentAmountAndPeriod}
                  onChange={(e) => setForm((p) => ({ ...p, rentAmountAndPeriod: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. £1,200 per calendar month"
                />
              </div>
              <div>
                <label className={labelClass}>3. Proposed tenancy start date</label>
                <input
                  type="text"
                  value={form.proposedStartDate}
                  onChange={(e) => setForm((p) => ({ ...p, proposedStartDate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>4. Total number of occupants (including children)</label>
                <input
                  type="text"
                  value={form.totalOccupants}
                  onChange={(e) => setForm((p) => ({ ...p, totalOccupants: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. 2 adults, 1 child"
                />
              </div>
            </div>
          </section>

          {[1, 2].map((n) => (
            <section key={n}>
              <h2 className="text-lg font-semibold text-white">Applicant {n === 1 ? "one" : "two"}</h2>
              {n === 2 ? (
                <p className="text-elegant-muted mt-1 text-xs">Leave blank if this is a single-applicant tenancy.</p>
              ) : null}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>{n === 1 ? "5" : "13"}. Full name</label>
                  <input
                    type="text"
                    value={n === 1 ? form.applicant1.name : form.applicant2.name}
                    onChange={(e) => setApplicant(n as 1 | 2, "name", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{n === 1 ? "6" : "14"}. Date of birth</label>
                  <input
                    type="text"
                    value={n === 1 ? form.applicant1.dob : form.applicant2.dob}
                    onChange={(e) => setApplicant(n as 1 | 2, "dob", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{n === 1 ? "7" : "15"}. Phone number</label>
                  <input
                    type="tel"
                    value={n === 1 ? form.applicant1.phone : form.applicant2.phone}
                    onChange={(e) => setApplicant(n as 1 | 2, "phone", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{n === 1 ? "8" : "16"}. Email address</label>
                  <input
                    type="email"
                    value={n === 1 ? form.applicant1.email : form.applicant2.email}
                    onChange={(e) => setApplicant(n as 1 | 2, "email", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{n === 1 ? "9" : "17"}. Current address</label>
                  <textarea
                    rows={2}
                    value={n === 1 ? form.applicant1.address : form.applicant2.address}
                    onChange={(e) => setApplicant(n as 1 | 2, "address", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{n === 1 ? "10" : "18"}. Any special requirements?</label>
                  <textarea
                    rows={2}
                    value={n === 1 ? form.applicant1.specialRequirements : form.applicant2.specialRequirements}
                    onChange={(e) => setApplicant(n as 1 | 2, "specialRequirements", e.target.value)}
                    className={inputClass}
                    placeholder="Accessibility, parking, etc."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{n === 1 ? "11" : "19"}. Pets</label>
                  <input
                    type="text"
                    value={n === 1 ? form.applicant1.pets : form.applicant2.pets}
                    onChange={(e) => setApplicant(n as 1 | 2, "pets", e.target.value)}
                    className={inputClass}
                    placeholder="State type/breed or &quot;None&quot;"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{n === 1 ? "12" : "20"}. Employment status</label>
                  <input
                    type="text"
                    value={n === 1 ? form.applicant1.employmentStatus : form.applicant2.employmentStatus}
                    onChange={(e) => setApplicant(n as 1 | 2, "employmentStatus", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Employed full-time, self-employed, student…"
                  />
                </div>
              </div>
            </section>
          ))}

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Guarantor &amp; holding deposit</h2>
            <div>
              <label className={labelClass}>21. Guarantor (if we reasonably require one)</label>
              <textarea
                rows={2}
                value={form.guarantorIfRequired}
                onChange={(e) => setForm((p) => ({ ...p, guarantorIfRequired: e.target.value }))}
                className={inputClass}
                placeholder="Yes — name and contact / No — explain if needed"
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-surface/30 p-4">
              <input
                type="checkbox"
                checked={form.holdingDepositWeeksRentUnderstood}
                onChange={(e) => setForm((p) => ({ ...p, holdingDepositWeeksRentUnderstood: e.target.checked }))}
                className="mt-1 h-4 w-4 shrink-0 rounded border-white/30"
              />
              <span className="text-sm text-elegant-muted leading-relaxed">
                <span className="font-medium text-white">22.</span> I understand the holding deposit must be no more
                than <span className="text-white">one week&apos;s rent</span> (1/52 of the annual rent) and agree to
                pay it to reserve the property, subject to the Holding Deposit Agreement included in the download pack.
              </span>
            </label>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Proceeding &amp; declaration</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>
                  23. If the application is successful, will you proceed to enter into the tenancy agreement immediately
                  upon satisfactory referencing?
                </label>
                <input
                  type="text"
                  value={form.proceedImmediatelyIfSuccessful}
                  onChange={(e) => setForm((p) => ({ ...p, proceedImmediatelyIfSuccessful: e.target.value }))}
                  className={inputClass}
                  placeholder="Yes / No — brief comment if needed"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-surface/30 p-4">
                <input
                  type="checkbox"
                  checked={form.declarationTrueAndComplete}
                  onChange={(e) => setForm((p) => ({ ...p, declarationTrueAndComplete: e.target.checked }))}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-white/30"
                />
                <span className="text-sm text-elegant-muted leading-relaxed">
                  <span className="font-medium text-white">24.</span> I/we confirm the information in this application
                  is true and complete to the best of my/our knowledge, and understand that false or misleading
                  information may affect whether a tenancy is offered or may continue.
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h2 className="text-sm font-semibold text-primary">Included when you download</h2>
            <ul className="text-elegant-muted mt-2 list-inside list-disc space-y-1 text-sm">
              <li>Numbered application (this page) as PDF with your entries</li>
              <li>Holding Deposit Agreement for England (Version 1.1HDA) — full terms as in the official-style form</li>
              <li>ASTA logo on every page of the combined PDF</li>
            </ul>
          </section>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF pack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
