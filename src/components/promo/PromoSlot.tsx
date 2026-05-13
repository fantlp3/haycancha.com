import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PROMO_SLOTS, type PromoSlot as PromoSlotData } from "@/data/promo-slots";

type Variant = "rectangle" | "leaderboard" | "inline";

interface Props {
  variant?: Variant;
  exclude?: string[];
  className?: string;
}

const DEFAULT_ID = "explorar";

function pickSlot(exclude: string[] | undefined): PromoSlotData {
  const excluded = new Set(exclude ?? []);
  const pool = PROMO_SLOTS.filter((s) => !excluded.has(s.id) && !excluded.has(s.href));
  if (pool.length === 0) {
    return PROMO_SLOTS.find((s) => s.id === DEFAULT_ID) ?? PROMO_SLOTS[0];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export const PromoSlot = ({ variant = "rectangle", exclude, className }: Props) => {
  // Pick once at mount; useState initializer runs only on first render so the
  // chosen slot is stable across re-renders without locking it across navigations.
  const [slot] = useState<PromoSlotData>(() => pickSlot(exclude));

  const ariaLabel = `Promoción: ${slot.title}. ${slot.subtitle}`;

  const containerBase =
    "group block rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 " +
    "dark:from-orange-950 dark:to-orange-900 dark:border-orange-800 " +
    "transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.01] cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2";

  const titleClass = "font-bold text-dark dark:text-orange-50";
  const subtitleClass = "text-sm text-gray-600 dark:text-orange-100/70";
  const ctaClass =
    "inline-flex items-center justify-center bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 group-hover:brightness-95 transition";

  if (variant === "rectangle") {
    return (
      <Link to={slot.href} aria-label={ariaLabel} className={cn(containerBase, "p-6 md:p-8", className)}>
        <div className="flex flex-col h-full gap-3 text-center">
          <div className="text-3xl" aria-hidden>
            {slot.emoji}
          </div>
          <h3 className={cn(titleClass, "text-xl leading-tight")}>{slot.title}</h3>
          <p className={cn(subtitleClass, "mb-2")}>{slot.subtitle}</p>
          <div className="mt-auto">
            <span className={ctaClass}>{slot.cta}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "leaderboard") {
    return (
      <Link to={slot.href} aria-label={ariaLabel} className={cn(containerBase, "p-6", className)}>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="text-3xl md:text-2xl shrink-0" aria-hidden>
            {slot.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(titleClass, "text-lg")}>{slot.title}</h3>
            <p className={subtitleClass}>{slot.subtitle}</p>
          </div>
          <span className={ctaClass}>{slot.cta}</span>
        </div>
      </Link>
    );
  }

  // inline — fluid up to 600px, similar to leaderboard but centered
  return (
    <Link
      to={slot.href}
      aria-label={ariaLabel}
      className={cn(containerBase, "p-6 max-w-2xl mx-auto", className)}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
        <div className="text-3xl md:text-2xl shrink-0" aria-hidden>
          {slot.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(titleClass, "text-lg")}>{slot.title}</h3>
          <p className={subtitleClass}>{slot.subtitle}</p>
        </div>
        <span className={ctaClass}>{slot.cta}</span>
      </div>
    </Link>
  );
};

export default PromoSlot;
