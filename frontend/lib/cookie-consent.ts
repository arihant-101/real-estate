export const COOKIE_CONSENT_STORAGE_KEY = "asta_cookie_consent_v1";

export type CookiePreferences = {
  necessary: true;
  functional: boolean;
  analytical: boolean;
  marketing: boolean;
};

export type StoredConsent =
  | { version: 1; status: "accepted" }
  | { version: 1; status: "rejected" }
  | { version: 1; status: "custom"; preferences: CookiePreferences };

export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return null;
    const o = v as Record<string, unknown>;
    if (o.version !== 1 || typeof o.status !== "string") return null;
    if (o.status === "accepted" || o.status === "rejected") {
      return { version: 1, status: o.status };
    }
    if (o.status === "custom" && o.preferences && typeof o.preferences === "object") {
      const p = o.preferences as Record<string, unknown>;
      return {
        version: 1,
        status: "custom",
        preferences: {
          necessary: true,
          functional: Boolean(p.functional),
          analytical: Boolean(p.analytical),
          marketing: Boolean(p.marketing),
        },
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    return parseStoredConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeConsent(data: StoredConsent) {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
  try {
    window.dispatchEvent(new CustomEvent("asta-cookie-consent", { detail: data }));
  } catch {
    /* ignore */
  }
}

/** Which optional third-party scripts may run (never true until the user has stored a choice). */
export type ScriptPermissions = {
  analytical: boolean;
  marketing: boolean;
};

export function getScriptPermissions(consent: StoredConsent | null): ScriptPermissions {
  if (!consent) return { analytical: false, marketing: false };
  if (consent.status === "rejected") return { analytical: false, marketing: false };
  if (consent.status === "accepted") return { analytical: true, marketing: true };
  return {
    analytical: consent.preferences.analytical,
    marketing: consent.preferences.marketing,
  };
}
