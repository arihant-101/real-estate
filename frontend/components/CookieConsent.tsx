"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookiePreferences,
  type StoredConsent,
  parseStoredConsent,
  writeConsent,
} from "@/lib/cookie-consent";

const defaultCustomPrefs: CookiePreferences = {
  necessary: true,
  functional: true,
  analytical: false,
  marketing: false,
};

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(defaultCustomPrefs);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      const existing = parseStoredConsent(raw);
      if (!existing) setOpen(true);
      else if (existing.status === "custom") setPrefs(existing.preferences);
    } catch {
      setOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setCustomOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    const data: StoredConsent = { version: 1, status: "accepted" };
    writeConsent(data);
    close();
  }, [close]);

  const rejectAll = useCallback(() => {
    const data: StoredConsent = { version: 1, status: "rejected" };
    writeConsent(data);
    close();
  }, [close]);

  const saveCustom = useCallback(() => {
    const data: StoredConsent = {
      version: 1,
      status: "custom",
      preferences: { ...prefs, necessary: true },
    };
    writeConsent(data);
    close();
  }, [prefs, close]);

  if (!mounted || !open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="pointer-events-none fixed inset-0 bg-overlay/60 backdrop-blur-[2px]" aria-hidden />
      <div
        className="relative z-[101] w-full max-w-lg rounded-2xl border border-white/10 bg-panel px-5 py-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)] sm:max-w-2xl sm:px-8 sm:py-8"
        style={{ pointerEvents: "auto" }}
      >
        <h2
          id="cookie-consent-title"
          className="text-lg font-semibold tracking-tight text-white sm:text-xl"
        >
          We value your privacy
        </h2>
        <p id="cookie-consent-desc" className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          We use cookies on our website to give you the most relevant experience by remembering your
          preferences and repeat visits. By clicking &ldquo;Accept All&rdquo;, you consent to the use of
          all cookies. You may use{" "}
          <button
            type="button"
            onClick={() => setCustomOpen((v) => !v)}
            className="font-medium text-primary underline decoration-primary/50 underline-offset-2 transition hover:text-primary-light hover:decoration-primary-light"
          >
            Cookie Settings
          </button>{" "}
          to provide controlled consent, or read more in our{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary underline decoration-primary/50 underline-offset-2 transition hover:text-primary-light hover:decoration-primary-light"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {customOpen && (
          <div className="mt-6 space-y-4 rounded-xl border border-white/10 bg-surface/80 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              Cookie categories
            </p>
            <ToggleRow
              id="cookie-necessary"
              label="Strictly necessary"
              description="Required for the site to function. Always active."
              checked
              disabled
            />
            <ToggleRow
              id="cookie-functional"
              label="Functional"
              description="Remember choices such as region or form inputs."
              checked={prefs.functional}
              onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
            />
            <ToggleRow
              id="cookie-analytical"
              label="Analytical"
              description="Help us understand how visitors use the site."
              checked={prefs.analytical}
              onChange={(v) => setPrefs((p) => ({ ...p, analytical: v }))}
            />
            <ToggleRow
              id="cookie-marketing"
              label="Marketing"
              description="Used to deliver relevant ads or offers where applicable."
              checked={prefs.marketing}
              onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
            />
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={saveCustom}
                className="btn-primary rounded-full px-5 py-2 text-sm"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setCustomOpen(false)}
                className="inline-flex items-center justify-center rounded-full border-2 border-primary/70 bg-transparent px-5 py-2 text-sm font-medium text-white transition hover:border-primary hover:bg-primary/10"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => setCustomOpen((v) => !v)}
            className="order-3 inline-flex w-full items-center justify-center rounded-full border-2 border-primary/70 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition hover:border-primary hover:bg-primary/10 sm:order-1 sm:w-auto"
          >
            Customize
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="order-2 inline-flex w-full items-center justify-center rounded-full border-2 border-primary/70 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition hover:border-primary hover:bg-primary/10 sm:w-auto"
          >
            Reject All
          </button>
          <button type="button" onClick={acceptAll} className="btn-primary order-1 w-full sm:order-3 sm:w-auto">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className={`text-sm font-medium text-white ${disabled ? "" : "cursor-pointer"}`}>
          {label}
        </label>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full border-2 transition ${
          disabled
            ? "cursor-not-allowed border-white/20 bg-white/5 opacity-60"
            : checked
              ? "border-primary bg-primary/30"
              : "border-white/25 bg-white/5 hover:border-white/40"
        }`}
      >
        <span
          className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-0.5"
          } ${disabled ? "bg-muted" : ""}`}
        />
      </button>
    </div>
  );
}
