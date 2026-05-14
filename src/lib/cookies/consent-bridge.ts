import { useEffect } from "react";
import { CONSENT_EVENT, type CookieConsentState } from "@/lib/cookie-consent";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

const pushConsent = (analytics: boolean, advertising: boolean) => {
  // Use window.gtag if present; otherwise push to dataLayer directly so the
  // GTM tag can still react. GTM's gtag wrapper is defined inline in
  // index.html, so this should always succeed in production.
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: advertising ? "granted" : "denied",
      ad_user_data: advertising ? "granted" : "denied",
      ad_personalization: advertising ? "granted" : "denied",
    });
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "consent_update",
      consent: {
        analytics_storage: analytics ? "granted" : "denied",
        ad_storage: advertising ? "granted" : "denied",
        ad_user_data: advertising ? "granted" : "denied",
        ad_personalization: advertising ? "granted" : "denied",
      },
    } as Record<string, unknown>);
  }
};

/**
 * Bridges the in-app cookie consent state to Google Consent Mode v2.
 *
 * Mount once globally (in App.tsx). Renders nothing. The CookieConsent
 * component re-emits `cookieConsentChange` on mount when a stored consent
 * exists, so we don't need to read localStorage here ourselves — listening
 * is enough.
 */
export function ConsentBridge() {
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentState>).detail;
      if (!detail) return;
      pushConsent(detail.analytics, detail.advertising);
    };
    window.addEventListener(CONSENT_EVENT, onChange as EventListener);
    return () => window.removeEventListener(CONSENT_EVENT, onChange as EventListener);
  }, []);
  return null;
}

export default ConsentBridge;
