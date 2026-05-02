/**
 * Cookie consent storage + global event helpers.
 *
 * Persistence: localStorage key `haycancha:cookie-consent`.
 * Re-prompts the user if: no key, version mismatch, or older than 12 months.
 *
 * Conditional script loading:
 *  - GA4   → only if consent.analytics === true
 *  - AdSense → only if consent.advertising === true
 */

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "haycancha:cookie-consent";
export const CONSENT_MAX_AGE_MS = 12 * 30 * 24 * 60 * 60 * 1000; // ~12 months
export const CONSENT_EVENT = "cookieConsentChange";
export const OPEN_PREFERENCES_EVENT = "cookieConsentOpenPreferences";

export interface CookieConsentState {
  version: number;
  timestamp: string; // ISO
  essential: true;
  analytics: boolean;
  advertising: boolean;
}

export function readConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    const ts = Date.parse(parsed.timestamp);
    if (Number.isNaN(ts)) return null;
    if (Date.now() - ts > CONSENT_MAX_AGE_MS) return null;
    return { ...parsed, essential: true };
  } catch {
    return null;
  }
}

export function writeConsent(partial: { analytics: boolean; advertising: boolean }): CookieConsentState {
  const state: CookieConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    essential: true,
    analytics: partial.analytics,
    advertising: partial.advertising,
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<CookieConsentState>(CONSENT_EVENT, { detail: state }));
  return state;
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
