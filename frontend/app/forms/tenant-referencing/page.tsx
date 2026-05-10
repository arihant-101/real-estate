"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, ExternalLink, Loader2 } from "lucide-react";
import { TENANT_REFERENCING_FORM_URL } from "@/data/tenant-referencing";
import {
  EMPLOYMENT_OPTIONS,
  emptyTenantReferencingGoogleStyleForm,
  type TenantReferencingGoogleStyleForm,
} from "@/data/tenant-referencing-application-form";
import { downloadTenantReferencingApplicationPdf } from "@/lib/tenant-referencing-application-pdf";

const inputClass =
  "w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-2.5 text-sm text-white placeholder:text-elegant-muted/70 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
/** Native calendar picker: gold icon + dark popup (see `.date-input-gold` in globals.css). */
const dateInputClass = `${inputClass} date-input-gold`;
const labelClass = "mb-1.5 block text-sm font-medium text-white";
const req = " *";

function localIsoDateString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function RadioRow({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((o) => (
        <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm text-elegant-muted">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="h-4 w-4 border-white/30 text-primary focus:ring-primary/40"
          />
          <span className="text-white">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function TenantReferencingPage() {
  const [form, setForm] = useState<TenantReferencingGoogleStyleForm>(() => emptyTenantReferencingGoogleStyleForm());
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todayIso = localIsoDateString();

  const set = <K extends keyof TenantReferencingGoogleStyleForm>(key: K, v: TenantReferencingGoogleStyleForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const handleDownload = async () => {
    setError(null);
    setDownloading(true);
    try {
      await downloadTenantReferencingApplicationPdf(form);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

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
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Residential tenancy application</h1>
                <p className="text-elegant-muted mt-1 text-sm leading-relaxed">
                  Same fields as our{" "}
                  <a
                    href={TENANT_REFERENCING_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Google Form
                  </a>
                  . Complete here, download your answers as a PDF with the ASTA logo, then submit on Google when you are
                  ready.
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
              {downloading ? "Building PDF…" : "Download PDF"}
            </button>
          </div>

          {error ? (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <p className="text-elegant-muted text-sm leading-relaxed">
            Please complete this form accurately and completely. All applications are subject to approval, background,
            and credit checks. An asterisk ({req.trim()}) matches a required question on the Google Form — complete
            those before submitting there.
          </p>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <div>
              <label className={labelClass}>Email{req}</label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Property / listing context (optional)</label>
              <textarea
                rows={3}
                value={form.listingContext}
                onChange={(e) => set("listingContext", e.target.value)}
                className={inputClass}
                placeholder="e.g. property address you are applying for, viewing notes, or agent message"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Applicants</h2>
            <div>
              <label className={labelClass}>Applicant 1: full legal name{req}</label>
              <input
                type="text"
                value={form.applicant1LegalName}
                onChange={(e) => set("applicant1LegalName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Applicant 2: full legal name{req}{" "}
                <span className="font-normal text-elegant-muted">(if single applicant, enter N/A)</span>
              </label>
              <input
                type="text"
                value={form.applicant2LegalName}
                onChange={(e) => set("applicant2LegalName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Current residential address{req}</label>
              <textarea
                rows={2}
                value={form.currentResidentialAddress}
                onChange={(e) => set("currentResidentialAddress", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date of birth{req}</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
                className={dateInputClass}
                min="1900-01-01"
                max={todayIso}
              />
            </div>
            <div>
              <label className={labelClass}>Primary &amp; secondary phone number(s){req}</label>
              <input
                type="tel"
                value={form.phones}
                onChange={(e) => set("phones", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Email address{req}{" "}
                <span className="font-normal text-elegant-muted">
                  (include second applicant&apos;s email if you are two applicants)
                </span>
              </label>
              <input
                type="text"
                value={form.correspondenceEmails}
                onChange={(e) => set("correspondenceEmails", e.target.value)}
                className={inputClass}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Tenancy preferences</h2>
            <div>
              <label className={labelClass}>Proposed tenancy start date{req}</label>
              <input
                type="date"
                value={form.proposedTenancyStartDate}
                onChange={(e) => set("proposedTenancyStartDate", e.target.value)}
                className={dateInputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Desired lease term{req}</label>
              <select
                value={form.desiredLeaseTermMonths}
                onChange={(e) =>
                  set("desiredLeaseTermMonths", e.target.value as TenantReferencingGoogleStyleForm["desiredLeaseTermMonths"])
                }
                className={inputClass}
              >
                <option value="">Choose…</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>
            <div>
              <p className={labelClass}>Do you require a 6 month break clause?{req}</p>
              <RadioRow
                name="break"
                value={form.sixMonthBreakClause}
                onChange={(v) => set("sixMonthBreakClause", v as TenantReferencingGoogleStyleForm["sixMonthBreakClause"])}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
            <div>
              <label className={labelClass}>
                Special requirements regarding furniture or anything else{req}
              </label>
              <textarea
                rows={3}
                value={form.furnitureSpecialRequirements}
                onChange={(e) => set("furnitureSpecialRequirements", e.target.value)}
                className={inputClass}
                placeholder="Furnished, unfurnished, part-furnished — state any furniture to add or remove"
              />
            </div>
            <div>
              <label className={labelClass}>Total number of occupants (including applicant){req}</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.totalOccupants}
                onChange={(e) => set("totalOccupants", e.target.value)}
                className={inputClass}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Pets</h2>
            <div>
              <p className={labelClass}>Do you own any pets?{req}</p>
              <RadioRow
                name="pets"
                value={form.ownsPets}
                onChange={(v) => set("ownsPets", v as TenantReferencingGoogleStyleForm["ownsPets"])}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
            {form.ownsPets === "yes" ? (
              <div>
                <label className={labelClass}>If yes, describe pets (type, breed, weight, age)</label>
                <textarea
                  rows={2}
                  value={form.petsDescription}
                  onChange={(e) => set("petsDescription", e.target.value)}
                  className={inputClass}
                />
              </div>
            ) : null}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Applicant 1: current employment status{req}</label>
              <select
                value={form.applicant1Employment}
                onChange={(e) =>
                  set("applicant1Employment", e.target.value as TenantReferencingGoogleStyleForm["applicant1Employment"])
                }
                className={inputClass}
              >
                <option value="">Choose…</option>
                {EMPLOYMENT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Applicant 2: current employment status</label>
              <select
                value={form.applicant2Employment}
                onChange={(e) =>
                  set("applicant2Employment", e.target.value as TenantReferencingGoogleStyleForm["applicant2Employment"])
                }
                className={inputClass}
              >
                <option value="">Choose…</option>
                {EMPLOYMENT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <label className={labelClass}>Do you require a guarantor?</label>
            <p className="text-elegant-muted mb-2 text-xs">
              If so, provide their full legal name, contact number and email address.
            </p>
            <textarea
              rows={2}
              value={form.guarantorDetails}
              onChange={(e) => set("guarantorDetails", e.target.value)}
              className={inputClass}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">History</h2>
            <div>
              <p className={labelClass}>Have you ever been evicted or asked to move out of a rental property?{req}</p>
              <RadioRow
                name="evict"
                value={form.everEvicted}
                onChange={(v) => set("everEvicted", v as TenantReferencingGoogleStyleForm["everEvicted"])}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
            <div>
              <p className={labelClass}>Have you ever filed for bankruptcy?{req}</p>
              <RadioRow
                name="bank"
                value={form.everBankruptcy}
                onChange={(v) => set("everBankruptcy", v as TenantReferencingGoogleStyleForm["everBankruptcy"])}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
            <div>
              <p className={labelClass}>
                Are you in a position to proceed immediately if your application is successful?{req}
              </p>
              <RadioRow
                name="proceed"
                value={form.proceedImmediately}
                onChange={(v) => set("proceedImmediately", v as TenantReferencingGoogleStyleForm["proceedImmediately"])}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                  { value: "maybe", label: "Maybe" },
                ]}
              />
            </div>
            <div>
              <p className={labelClass}>
                Are you prepared to pay the holding deposit quoted for this property to secure it if selected?{req}
              </p>
              <p className="text-elegant-muted mb-2 text-xs">
                On the Google Form this may show a fixed amount for a specific listing; enter the amount you were quoted
                below if applicable.
              </p>
              <RadioRow
                name="holding"
                value={form.willingToPayHoldingDeposit}
                onChange={(v) =>
                  set("willingToPayHoldingDeposit", v as TenantReferencingGoogleStyleForm["willingToPayHoldingDeposit"])
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
            <div>
              <label className={labelClass}>Holding deposit amount (if quoted)</label>
              <input
                type="text"
                value={form.holdingDepositAmount}
                onChange={(e) => set("holdingDepositAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. £450 — as stated on the listing or by the agent"
              />
            </div>
          </section>

          <section>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-surface/30 p-4">
              <input
                type="checkbox"
                checked={form.authorizeChecks}
                onChange={(e) => set("authorizeChecks", e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-white/30"
              />
              <span className="text-sm text-elegant-muted leading-relaxed">
                I authorize the landlord/agent to conduct necessary background and credit checks as part of this
                application process. <span className="text-white">(I Agree)</span>
              </span>
            </label>
          </section>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </button>
            <a
              href={TENANT_REFERENCING_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition hover:border-primary/50 hover:text-primary"
            >
              Open Google Form to submit
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
