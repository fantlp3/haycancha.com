import { cn } from "@/lib/utils";

/**
 * AdSlot — reusable Google AdSense placeholder.
 *
 * Renders a visual placeholder that reserves the exact ad dimensions to
 * guarantee CLS = 0. The real AdSense script is wired in once the
 * publisher account is approved.
 *
 * TODO: wire Google AdSense client_id once the account is approved.
 */

export type AdFormat =
  | "leaderboard"
  | "rectangle"
  | "infeed"
  | "in-article"
  | "sidebar";

interface AdSlotProps {
  slot: string;
  format: AdFormat;
  label?: string;
  /** Future premium-subscription toggle. When true, render nothing. */
  hidden?: boolean;
  className?: string;
}

const FORMAT_META: Record<
  AdFormat,
  { label: string; minHeightClass: string; wrapperClass: string }
> = {
  leaderboard: {
    label: "728×90 / 320×100",
    // 90px desktop, 100px mobile
    minHeightClass: "min-h-[100px] md:min-h-[90px]",
    wrapperClass: "w-full max-w-[1000px] mx-auto",
  },
  rectangle: {
    label: "300×250",
    minHeightClass: "min-h-[250px]",
    wrapperClass: "w-full max-w-[336px] mx-auto",
  },
  infeed: {
    label: "in-feed responsive",
    minHeightClass: "min-h-[280px]",
    wrapperClass: "w-full",
  },
  "in-article": {
    label: "in-article responsive",
    minHeightClass: "min-h-[250px]",
    wrapperClass: "w-full max-w-[600px] mx-auto",
  },
  sidebar: {
    label: "300×600",
    // On mobile collapses to a rectangle (250px); desktop reserves 600px.
    minHeightClass: "min-h-[250px] md:min-h-[600px]",
    wrapperClass: "w-full max-w-[300px] mx-auto",
  },
};

export const AdSlot = ({
  slot,
  format,
  label = "PUBLICIDAD",
  hidden = false,
  className,
}: AdSlotProps) => {
  if (hidden) return null;

  const meta = FORMAT_META[format];
  const isInfeed = format === "infeed";

  return (
    <aside
      role="complementary"
      aria-label="Publicidad"
      data-ad-slot={slot}
      data-ad-format={format}
      className={cn(
        "block bg-light rounded-md p-3",
        // Softer dashed border for in-feed so it differentiates from real cards
        isInfeed ? "border border-dashed border-border" : "border border-border",
        // Generous breathing room around the ad
        "my-6 md:my-8",
        meta.wrapperClass,
        className
      )}
    >
      <div className="text-center text-gray font-semibold text-[10px] tracking-[3px] mb-2 select-none">
        {label}
      </div>
      <div
        className={cn(
          "w-full flex items-center justify-center rounded bg-white/40",
          meta.minHeightClass
        )}
      >
        {/* TODO: wire Google AdSense client_id once the account is approved */}
        <span
          className="text-gray text-[12px] font-normal text-center px-2"
          // loading hint kept on a real <ins>/<img> when wired up
          data-loading="lazy"
        >
          Ad slot · {format} · {meta.label}
        </span>
      </div>
    </aside>
  );
};

export default AdSlot;
