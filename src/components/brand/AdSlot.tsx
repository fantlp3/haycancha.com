import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MONETIZATION } from "@/lib/monetization";

/**
 * AdSlot — Google AdSense slot wrapper (directorio: home / club detail /
 * search results). Distinct from the blog's `AdSlotMarker`.
 *
 * Gated by env var via `MONETIZATION.adsense`. When the publisher id isn't
 * configured, the slot is fully suppressed (`return null`) — no `<ins>` ever
 * mounts, no `window.adsbygoogle.push` ever fires, no request to
 * pagead2.googlesyndication.com is queued. This matches the "AdSense pending
 * approval" UX: don't show empty slots in production.
 *
 * When enabled:
 *   - renders `<ins class="adsbygoogle">` with the env-driven client id
 *   - pushes to adsbygoogle on mount
 *   - auto-hides if `data-ad-status="unfilled"` arrives (primary) or the
 *     timeout fires without a fill (fallback)
 */

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

const UNFILL_TIMEOUT_MS = 4000;
const FILLED_HEIGHT_PX = 10;

type AdStatus = "loading" | "filled" | "unfilled";

export type AdFormat =
  | "leaderboard"
  | "rectangle"
  | "infeed"
  | "in-article"
  | "sidebar";

interface AdSlotProps {
  slot: string;
  format: AdFormat;
  /** Future premium-subscription toggle. When true, render nothing. */
  hidden?: boolean;
  className?: string;
}

const FORMAT_META: Record<
  AdFormat,
  { minHeightClass: string; wrapperClass: string }
> = {
  leaderboard: {
    minHeightClass: "min-h-[100px] md:min-h-[90px]",
    wrapperClass: "w-full max-w-[1000px] mx-auto",
  },
  rectangle: {
    minHeightClass: "min-h-[250px]",
    wrapperClass: "w-full max-w-[336px] mx-auto",
  },
  infeed: {
    minHeightClass: "min-h-[280px]",
    wrapperClass: "w-full",
  },
  "in-article": {
    minHeightClass: "min-h-[250px]",
    wrapperClass: "w-full max-w-[600px] mx-auto",
  },
  sidebar: {
    minHeightClass: "min-h-[250px] md:min-h-[600px]",
    wrapperClass: "w-full max-w-[300px] mx-auto",
  },
};

export const AdSlot = ({ slot, format, hidden = false, className }: AdSlotProps) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const [status, setStatus] = useState<AdStatus>("loading");
  const enabled = MONETIZATION.adsense.enabled;
  const publisherId = MONETIZATION.adsense.publisherId;

  useEffect(() => {
    if (!enabled || !publisherId) return;
    if (typeof window === "undefined") return;
    const ins = insRef.current;
    if (!ins) return;

    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch (err) {
      // Push can throw if the script hasn't loaded yet — that's fine,
      // the script will process the queue once it boots.
      console.warn("[AdSlot] adsbygoogle.push failed:", err);
    }

    const readStatus = (): AdStatus | null => {
      const s = ins.getAttribute("data-ad-status");
      if (s === "filled") return "filled";
      if (s === "unfilled") return "unfilled";
      return null;
    };

    const observer = new MutationObserver(() => {
      const next = readStatus();
      if (next) setStatus(next);
    });
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

    const timer = window.setTimeout(() => {
      const next = readStatus();
      if (next) {
        setStatus(next);
        return;
      }
      // Fallback: AdSense never set the attribute (script blocked / never loaded).
      const h = ins.getBoundingClientRect().height;
      setStatus(h >= FILLED_HEIGHT_PX ? "filled" : "unfilled");
    }, UNFILL_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [enabled, publisherId]);

  if (hidden) return null;
  // Suppress entirely when AdSense isn't configured. No <ins>, no push,
  // no network requests to pagead2.googlesyndication.com.
  if (!enabled || !publisherId) return null;
  if (status === "unfilled") return null;

  const meta = FORMAT_META[format];

  return (
    <aside
      role="complementary"
      aria-label="Publicidad"
      data-ad-slot={slot}
      data-ad-format={format}
      className={cn(
        "block my-6 md:my-8",
        meta.wrapperClass,
        // Only reserve vertical space while loading — once filled, AdSense
        // controls the height; once unfilled, the component returns null.
        status === "loading" ? meta.minHeightClass : null,
        className
      )}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default AdSlot;
