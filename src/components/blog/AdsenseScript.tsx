import { useEffect } from "react";
import { MONETIZATION } from "@/lib/monetization";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/**
 * Injects the AdSense `adsbygoogle.js` loader once, on first mount, only
 * when the publisher id is configured via env. Renders nothing.
 *
 * Self-deduplicates: if the script is already in the document (e.g. loaded
 * by GTM or by a previous mount), this is a no-op. That way coexisting
 * with the GTM-based loader from the cookie-consent wiring doesn't cause
 * a double-load.
 *
 * Async + non-blocking — does not gate hydration.
 */
export const AdsenseScript = () => {
  useEffect(() => {
    if (!MONETIZATION.adsense.enabled || !MONETIZATION.adsense.publisherId) return;
    if (typeof document === "undefined") return;
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.dataset.adsense = "1";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${MONETIZATION.adsense.publisherId}`;
    document.head.appendChild(s);
  }, []);

  return null;
};
