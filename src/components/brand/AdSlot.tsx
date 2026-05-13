import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * AdSlot — Google AdSense slot wrapper.
 *
 * Renders an <ins class="adsbygoogle"> and pushes to adsbygoogle on mount.
 * If AdSense returns `data-ad-status="unfilled"` (or never responds within
 * UNFILL_TIMEOUT_MS), the whole slot is unmounted — no empty placeholder
 * is shown in production. While the AdSense account is in review this is
 * effectively always-hidden, which is the desired behavior.
 *
 * Detection technique:
 *   primary  → MutationObserver on data-ad-status (filled | unfilled)
 *   fallback → after timeout, check getBoundingClientRect().height < threshold
 *              (covers blocked scripts, adblockers, script-not-loaded races)
 *
 * Note on `slot` prop: AdSense expects a numeric publisher slot id
 * (e.g. "1234567890"), not a semantic string. Until those ids are created
 * in the AdSense dashboard and mapped here, the semantic strings cause
 * AdSense to return unfilled → slot stays hidden, which is fine.
 */

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

const ADSENSE_CLIENT = "ca-pub-2602781084435740";
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

  useEffect(() => {
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
  }, []);

  if (hidden) return null;
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
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default AdSlot;
