"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { tenantApi } from "@/lib/api";
import { REPAIR_ICONS, type RepairIconKey } from "@/data/repairLucideIcons";
import {
  REPAIRS_TAXONOMY,
  requiresManualIssueDetail,
  requiresRepairPhotos,
  type RepairTaxonomyNode,
} from "@/data/repairsTaxonomy";
import { fileToRepairPhotoDataUrl } from "@/lib/repairPhotoUpload";

function RepairIcon({ name, className }: { name: RepairIconKey; className?: string }) {
  const Icon = REPAIR_ICONS[name];
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}

function filterNodes(nodes: RepairTaxonomyNode[], q: string): RepairTaxonomyNode[] {
  if (!q.trim()) return nodes;
  const lower = q.trim().toLowerCase();
  return nodes.filter((n) => n.label.toLowerCase().includes(lower));
}

const REPAIRS_WIZARD_STORAGE_KEY = "asta-repairs-wizard-saved-details";

type SavedRepairDetails = {
  buildingOrProperty?: string;
  fullAddress?: string;
  contactPhone?: string;
  roomOrFlat?: string;
  repairsAccessPreference?: "ABSENT_OK" | "TENANT_PRESENT";
  repairsAlarmInfo?: string;
  repairsParkingInfo?: string;
  repairsPetInfo?: string;
  repairsFurtherNotes?: string;
};

function VulnerableOccupierModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vulnerable-modal-title"
        className="relative z-[101] max-h-[min(90vh,32rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-white/15 bg-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="vulnerable-modal-title" className="text-lg font-semibold text-white">
            Vulnerable occupiers
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mt-4 space-y-3 text-sm text-muted">
          <p className="text-white/90">
            A <strong className="font-medium text-white">vulnerable occupier</strong> is someone who may need extra care
            or consideration when arranging access or repairs — for example due to age, disability, pregnancy, mental
            health needs, or other circumstances that could make them less able to protect their own interests.
          </p>
          <p>
            Telling us helps us plan visits safely and respectfully. We handle this information in line with our{" "}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-light">
              Privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function RepairsWizard() {
  const { user, loading: authLoading } = useAuth();
  const [phase, setPhase] = useState<"taxonomy" | "other-detail" | "building" | "submit">("taxonomy");
  const [stack, setStack] = useState<RepairTaxonomyNode[]>([]);
  const [leaf, setLeaf] = useState<RepairTaxonomyNode | null>(null);
  const [manualOtherText, setManualOtherText] = useState("");
  const [manualOtherError, setManualOtherError] = useState("");
  const [search, setSearch] = useState("");
  const [buildingOrProperty, setBuildingOrProperty] = useState("");
  const [roomOrFlat, setRoomOrFlat] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [extraDescription, setExtraDescription] = useState("");
  const [urgency, setUrgency] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
  const [photoAttachments, setPhotoAttachments] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [photoWorking, setPhotoWorking] = useState(false);
  const [repairsAccessPreference, setRepairsAccessPreference] = useState<"ABSENT_OK" | "TENANT_PRESENT">("ABSENT_OK");
  const [alarmInfo, setAlarmInfo] = useState("");
  const [parkingRestrictions, setParkingRestrictions] = useState("");
  const [petInfo, setPetInfo] = useState("");
  const [furtherNotes, setFurtherNotes] = useState("");
  const [vulnerableOccupier, setVulnerableOccupier] = useState(false);
  const [vulnerableModalOpen, setVulnerableModalOpen] = useState(false);
  const [rememberDetails, setRememberDetails] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const savedDetailsLoaded = useRef(false);

  const currentOptions = useMemo(() => {
    if (stack.length === 0) return REPAIRS_TAXONOMY;
    const last = stack[stack.length - 1];
    return last.children ?? [];
  }, [stack]);

  const filteredOptions = useMemo(() => filterNodes(currentOptions, search), [currentOptions, search]);

  const breadcrumbs = useMemo(() => {
    const parts = ["Home", ...stack.map((n) => n.label)];
    if (leaf) parts.push(leaf.label);
    return parts;
  }, [stack, leaf]);

  const taxonomyStepCount = stack.length + 1;

  /** 0% on first screen; gradual while drilling categories; then custom / building / submit. */
  const progressPercent = useMemo(() => {
    if (phase === "submit") return 100;
    if (phase === "building") return 66;
    if (phase === "other-detail") return 55;
    if (stack.length === 0) return 0;
    return Math.min(12 + stack.length * 11, 50);
  }, [phase, stack.length]);

  const leafNeedsManual = leaf ? requiresManualIssueDetail(leaf) : false;
  const leafPhotosRequired = leaf ? requiresRepairPhotos(leaf) : false;

  useEffect(() => {
    if (savedDetailsLoaded.current || typeof window === "undefined") return;
    savedDetailsLoaded.current = true;
    try {
      const raw = localStorage.getItem(REPAIRS_WIZARD_STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as SavedRepairDetails;
      if (s.buildingOrProperty) setBuildingOrProperty(s.buildingOrProperty);
      if (s.fullAddress) setFullAddress(s.fullAddress);
      if (s.contactPhone) setContactPhone(s.contactPhone);
      if (s.roomOrFlat) setRoomOrFlat(s.roomOrFlat);
      if (s.repairsAccessPreference) setRepairsAccessPreference(s.repairsAccessPreference);
      if (s.repairsAlarmInfo) setAlarmInfo(s.repairsAlarmInfo);
      if (s.repairsParkingInfo) setParkingRestrictions(s.repairsParkingInfo);
      if (s.repairsPetInfo) setPetInfo(s.repairsPetInfo);
      if (s.repairsFurtherNotes) setFurtherNotes(s.repairsFurtherNotes);
    } catch {
      /* ignore invalid JSON */
    }
  }, []);

  function selectNode(node: RepairTaxonomyNode) {
    setSearch("");
    if (node.children?.length) {
      setStack((s) => [...s, node]);
    } else {
      setLeaf(node);
      setPhotoAttachments([]);
      setPhotoError("");
      setManualOtherText("");
      setManualOtherError("");
      if (requiresManualIssueDetail(node)) {
        setPhase("other-detail");
      } else {
        setPhase("building");
      }
    }
  }

  function goBackTaxonomy() {
    setSearch("");
    if (stack.length > 0) {
      setStack((s) => s.slice(0, -1));
    }
  }

  function goBackFromBuilding() {
    if (leaf && requiresManualIssueDetail(leaf)) {
      setPhase("other-detail");
      return;
    }
    setLeaf(null);
    setManualOtherText("");
    setPhotoAttachments([]);
    setPhotoError("");
    setBuildingOrProperty("");
    setRoomOrFlat("");
    setFullAddress("");
    setContactPhone("");
    setRepairsAccessPreference("ABSENT_OK");
    setAlarmInfo("");
    setParkingRestrictions("");
    setPetInfo("");
    setFurtherNotes("");
    setVulnerableOccupier(false);
    setAgreedTerms(false);
    setTermsError("");
    setRememberDetails(false);
    setPhase("taxonomy");
  }

  function goBackFromOtherDetail() {
    setLeaf(null);
    setManualOtherText("");
    setManualOtherError("");
    setPhotoAttachments([]);
    setPhotoError("");
    setPhase("taxonomy");
  }

  function goNextFromOtherDetail() {
    const t = manualOtherText.trim();
    if (!t) {
      setManualOtherError("Please describe the issue.");
      return;
    }
    setManualOtherError("");
    setPhase("building");
  }

  const MIN_ADDRESS_LEN = 8;
  const MIN_PHONE_LEN = 6;
  const MIN_BUILDING_LEN = 2;

  function goToSubmit() {
    if (buildingOrProperty.trim().length < MIN_BUILDING_LEN || !roomOrFlat.trim()) return;
    if (fullAddress.trim().length < MIN_ADDRESS_LEN || contactPhone.trim().length < MIN_PHONE_LEN) return;
    setPhase("submit");
  }

  function goBackFromSubmit() {
    setPhase("building");
  }

  async function onRepairPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError("");
    const input = e.target;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;
    const cap = 4 - photoAttachments.length;
    if (cap <= 0) {
      setPhotoError("You can add at most 4 photos.");
      return;
    }
    setPhotoWorking(true);
    try {
      const next: string[] = [];
      for (const file of files.slice(0, cap)) {
        next.push(await fileToRepairPhotoDataUrl(file));
      }
      setPhotoAttachments((prev) => [...prev, ...next]);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not add photo.");
    } finally {
      setPhotoWorking(false);
    }
  }

  function removePhotoAt(index: number) {
    setPhotoAttachments((prev) => prev.filter((_, i) => i !== index));
    setPhotoError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leaf || buildingOrProperty.trim().length < MIN_BUILDING_LEN || !roomOrFlat.trim()) return;
    if (fullAddress.trim().length < MIN_ADDRESS_LEN || contactPhone.trim().length < MIN_PHONE_LEN) return;
    const manual = manualOtherText.trim();
    const needsManual = requiresManualIssueDetail(leaf);
    if (needsManual) {
      if (!manual) return;
    } else if (!extraDescription.trim()) {
      return;
    }
    if (leafPhotosRequired && photoAttachments.length < 1) return;
    if (user?.role !== "TENANT") return;
    if (!agreedTerms) {
      setTermsError("Please confirm you agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setTermsError("");
    setSubmitError("");
    setSubmitting(true);
    const issuePath = [...stack, leaf].map((n) => n.label);
    const pathJoined = issuePath.join(" › ");
    const issueCategory =
      needsManual && manual ? `${pathJoined} — Custom: ${manual}` : pathJoined;
    const description =
      needsManual && manual
        ? `Tenant-specified issue (Other / not listed):\n${manual}\n\nAdditional information:\n${extraDescription.trim() || "—"}`
        : extraDescription.trim();
    try {
      await tenantApi.submitRepairsWizardRequest({
        issueCategory,
        description,
        urgency,
        channel: "REPAIRS_WIZARD",
        buildingOrProperty: buildingOrProperty.trim(),
        roomOrFlat: roomOrFlat.trim(),
        fullAddress: fullAddress.trim(),
        contactPhone: contactPhone.trim(),
        repairsAccessPreference,
        repairsAlarmInfo: alarmInfo.trim() || undefined,
        repairsParkingInfo: parkingRestrictions.trim() || undefined,
        repairsPetInfo: petInfo.trim() || undefined,
        repairsFurtherNotes: furtherNotes.trim() || undefined,
        vulnerableOccupier,
        repairsConsentAccepted: true,
        issuePath,
        repairLeafId: leaf.id,
        ...(photoAttachments.length > 0 ? { photoAttachments } : {}),
      });
      if (rememberDetails && typeof window !== "undefined") {
        try {
          const payload: SavedRepairDetails = {
            buildingOrProperty: buildingOrProperty.trim(),
            fullAddress: fullAddress.trim(),
            contactPhone: contactPhone.trim(),
            roomOrFlat: roomOrFlat.trim(),
            repairsAccessPreference,
            repairsAlarmInfo: alarmInfo.trim() || undefined,
            repairsParkingInfo: parkingRestrictions.trim() || undefined,
            repairsPetInfo: petInfo.trim() || undefined,
            repairsFurtherNotes: furtherNotes.trim() || undefined,
          };
          localStorage.setItem(REPAIRS_WIZARD_STORAGE_KEY, JSON.stringify(payload));
        } catch {
          /* ignore quota */
        }
      }
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-white/10 bg-panel/60 p-8 text-center shadow-xl shadow-black/40">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-white">Report sent</h2>
        <p className="mt-2 text-sm text-muted">
          Your repair report has been submitted. Our team will review it and follow up as needed.
        </p>
        <Link
          href="/portal"
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light"
        >
          Back to portal
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel/60 p-6 shadow-xl shadow-black/40 sm:p-8">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white sm:text-2xl">What is the problem?</h2>
        {phase === "taxonomy" && (
          <p className="mt-1 text-sm text-muted">
            Step {taxonomyStepCount} — Select the option that best describes your issue
          </p>
        )}
        {phase === "other-detail" && (
          <p className="mt-1 text-sm text-muted">Describe your issue in your own words (required for this option)</p>
        )}
        {phase === "building" && (
          <p className="mt-1 text-sm text-muted">
            {leafNeedsManual ? "Next — Building & room" : "Step 2 — Building & room"}
          </p>
        )}
        {phase === "submit" && (
          <p className="mt-1 text-sm text-muted">
            {leafNeedsManual ? "Final step — Extra details & submit" : "Step 3 — Details & submit"}
          </p>
        )}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-primary/90">{breadcrumbs.join(" › ")}</p>
      </div>

      {phase === "taxonomy" && (
        <div className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your problem…"
              className="w-full rounded-lg border border-white/15 bg-overlay/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            />
          </div>
          <p className="mt-4 text-center text-xs text-muted">Please select the relevant option</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filteredOptions.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => selectNode(node)}
                className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-primary/40 hover:bg-white/[0.06]"
              >
                <RepairIcon name={node.icon} className="h-10 w-10 shrink-0 text-white" />
                <span className="mt-2 text-xs font-medium text-white sm:text-sm">{node.label}</span>
              </button>
            ))}
          </div>
          {filteredOptions.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted">No matches. Try another search.</p>
          )}
          {stack.length > 0 && (
            <div className="mt-8 flex justify-start border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={goBackTaxonomy}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "other-detail" && leaf && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">
            You chose <span className="font-medium text-white">{leaf.label}</span>. Please describe the problem so we can
            route it correctly.
          </p>
          <div>
            <label htmlFor="repairs-manual-other" className="block text-sm font-medium text-white">
              Describe the issue <span className="text-red-400">*</span>
            </label>
            <textarea
              id="repairs-manual-other"
              value={manualOtherText}
              onChange={(e) => {
                setManualOtherText(e.target.value);
                if (manualOtherError) setManualOtherError("");
              }}
              rows={5}
              required
              placeholder="Be specific: what is wrong, where in the property, and how long it has been an issue."
              className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            />
            {manualOtherError && <p className="mt-2 text-sm text-red-400">{manualOtherError}</p>}
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={goBackFromOtherDetail}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNextFromOtherDetail}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {phase === "building" && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="repairs-building" className="block text-sm font-medium text-white">
              Building or property
            </label>
            <p className="mt-0.5 text-xs text-muted">
              Name, development, or address — whatever helps us identify where the repair is needed.
            </p>
            <input
              id="repairs-building"
              value={buildingOrProperty}
              onChange={(e) => setBuildingOrProperty(e.target.value)}
              required
              minLength={MIN_BUILDING_LEN}
              placeholder="e.g. Riverside House, 10 Oak Street, or your block name"
              className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Room / flat number</label>
            <input
              value={roomOrFlat}
              onChange={(e) => setRoomOrFlat(e.target.value)}
              required
              placeholder="e.g. Flat 12B"
              className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="repairs-full-address" className="block text-sm font-medium text-white">
              Full address
            </label>
            <p className="mt-0.5 text-xs text-muted">
              Postal address for this tenancy or where we should attend (include postcode).
            </p>
            <textarea
              id="repairs-full-address"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              required
              rows={3}
              minLength={MIN_ADDRESS_LEN}
              placeholder="e.g. 42 Example Street, Flat 3, London, SW1A 1AA"
              className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="repairs-contact-phone" className="block text-sm font-medium text-white">
              Phone number
            </label>
            <p className="mt-0.5 text-xs text-muted">Best number to reach you about this repair.</p>
            <input
              id="repairs-contact-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
              minLength={MIN_PHONE_LEN}
              placeholder="e.g. 07123 456789"
              className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={goBackFromBuilding}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goToSubmit}
              disabled={
                buildingOrProperty.trim().length < MIN_BUILDING_LEN ||
                !roomOrFlat.trim() ||
                fullAddress.trim().length < MIN_ADDRESS_LEN ||
                contactPhone.trim().length < MIN_PHONE_LEN
              }
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {phase === "submit" && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {authLoading ? (
            <p className="text-sm text-muted">Checking account…</p>
          ) : user?.role !== "TENANT" ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              <p>You need a tenant account to submit a repair report.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/login?from=/repairs"
                  className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light"
                >
                  Log in
                </Link>
                <Link href="/register" className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10">
                  Register as tenant
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-white" htmlFor="repairs-describe-issue">
                  {leafNeedsManual ? (
                    "Anything else to add? (optional)"
                  ) : (
                    <>
                      Describe the issue <span className="text-red-400">*</span>
                    </>
                  )}
                </label>
                <textarea
                  id="repairs-describe-issue"
                  value={extraDescription}
                  onChange={(e) => setExtraDescription(e.target.value)}
                  required={!leafNeedsManual}
                  rows={4}
                  placeholder={
                    leafNeedsManual
                      ? "Optional: access instructions, preferred contact times…"
                      : "What happened? When did you notice it? Any safety concerns?"
                  }
                  className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  {leafPhotosRequired ? "Photos (required)" : "Photos (optional)"}
                </label>
                <p className="mt-1 text-xs text-muted">
                  {leafPhotosRequired
                    ? "At least one clear photo is required for this issue type. You can add up to 4 images (JPEG, PNG, or WebP; large files are resized automatically)."
                    : "Add photos if they help explain the issue — up to 4 images."}
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={photoWorking || photoAttachments.length >= 4}
                  onChange={onRepairPhotosChange}
                  className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-primary-light disabled:opacity-50"
                />
                {photoWorking && <p className="mt-2 text-xs text-muted">Processing images…</p>}
                {photoError && <p className="mt-2 text-sm text-red-400">{photoError}</p>}
                {photoAttachments.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {photoAttachments.map((src, i) => (
                      <li key={i} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="h-20 w-20 rounded-lg border border-white/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhotoAt(i)}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-500"
                          aria-label="Remove photo"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as typeof urgency)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-white">Access &amp; property information</h3>
                <p className="text-xs text-muted">Choose access below. Text fields are optional.</p>
                <fieldset className="space-y-3">
                  <legend className="sr-only">Access preference</legend>
                  <label className="flex cursor-pointer gap-3 rounded-lg border border-white/10 bg-overlay/30 p-3 text-sm text-white/90 has-[:checked]:border-primary/50">
                    <input
                      type="radio"
                      name="repairs-access"
                      checked={repairsAccessPreference === "ABSENT_OK"}
                      onChange={() => setRepairsAccessPreference("ABSENT_OK")}
                      className="mt-0.5 border-white/30 text-primary focus:ring-primary"
                    />
                    <span>I authorise access to my property for this repair without me being present (subject to any alarm / entry notes below).</span>
                  </label>
                  <label className="flex cursor-pointer gap-3 rounded-lg border border-white/10 bg-overlay/30 p-3 text-sm text-white/90 has-[:checked]:border-primary/50">
                    <input
                      type="radio"
                      name="repairs-access"
                      checked={repairsAccessPreference === "TENANT_PRESENT"}
                      onChange={() => setRepairsAccessPreference("TENANT_PRESENT")}
                      className="mt-0.5 border-white/30 text-primary focus:ring-primary"
                    />
                    <span>I want to be present when the work is carried out.</span>
                  </label>
                </fieldset>
                <div>
                  <label htmlFor="repairs-alarm" className="block text-sm font-medium text-white">
                    Alarm / entry information <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="repairs-alarm"
                    value={alarmInfo}
                    onChange={(e) => setAlarmInfo(e.target.value)}
                    placeholder="Codes, key safe, concierge…"
                    className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="repairs-parking" className="block text-sm font-medium text-white">
                    Parking restrictions <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="repairs-parking"
                    value={parkingRestrictions}
                    onChange={(e) => setParkingRestrictions(e.target.value)}
                    placeholder="Permits, loading bays, visitor rules…"
                    className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="repairs-pets" className="block text-sm font-medium text-white">
                    Pet information <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="repairs-pets"
                    value={petInfo}
                    onChange={(e) => setPetInfo(e.target.value)}
                    placeholder="e.g. Dog in flat — knock loudly"
                    className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="repairs-further-property" className="block text-sm font-medium text-white">
                    Further notes <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <textarea
                    id="repairs-further-property"
                    value={furtherNotes}
                    onChange={(e) => setFurtherNotes(e.target.value)}
                    rows={3}
                    placeholder="Anything else we should know before attending…"
                    className="mt-1 w-full rounded-lg border border-white/15 bg-overlay/40 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <input
                    id="repairs-vulnerable"
                    type="checkbox"
                    checked={vulnerableOccupier}
                    onChange={(e) => setVulnerableOccupier(e.target.checked)}
                    className="mt-1 rounded border-white/30 text-primary focus:ring-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <label htmlFor="repairs-vulnerable" className="text-sm text-white/90">
                      There is a vulnerable occupier at this property
                    </label>
                    <button
                      type="button"
                      onClick={() => setVulnerableModalOpen(true)}
                      className="mt-1 block text-left text-xs text-primary underline hover:text-primary-light"
                    >
                      What does this mean?
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <input
                  id="repairs-remember"
                  type="checkbox"
                  checked={rememberDetails}
                  onChange={(e) => setRememberDetails(e.target.checked)}
                  className="mt-1 rounded border-white/30 text-primary focus:ring-primary"
                />
                <label htmlFor="repairs-remember" className="text-sm text-white/90">
                  Remember my address, phone, and access details on this device for next time
                </label>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <input
                    id="repairs-consent"
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (e.target.checked) setTermsError("");
                    }}
                    className="mt-1 rounded border-white/30 text-primary focus:ring-primary"
                  />
                  <label htmlFor="repairs-consent" className="text-sm text-white/90">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-light"
                    >
                      Terms of service
                    </Link>
                    {" "}and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-light"
                    >
                      Privacy policy
                    </Link>
                    <span className="text-red-400"> *</span>
                  </label>
                </div>
                {termsError && <p className="mt-2 text-sm text-red-400">{termsError}</p>}
              </div>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}
              <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={goBackFromSubmit}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    photoWorking ||
                    (leafNeedsManual && !manualOtherText.trim()) ||
                    (!leafNeedsManual && !extraDescription.trim()) ||
                    (leafPhotosRequired && photoAttachments.length < 1) ||
                    !agreedTerms
                  }
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light disabled:opacity-40"
                >
                  {submitting ? "Submitting…" : "Submit report"}
                </button>
              </div>
            </>
          )}
          {user?.role !== "TENANT" && (
            <div className="flex justify-start border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={goBackFromSubmit}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Back
              </button>
            </div>
          )}
        </form>
      )}

      <VulnerableOccupierModal open={vulnerableModalOpen} onClose={() => setVulnerableModalOpen(false)} />
    </div>
  );
}
