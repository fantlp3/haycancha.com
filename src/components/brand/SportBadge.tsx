import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type Sport = "tenis" | "padel" | "pickleball" | "gratuito" | "premium";

const styles: Record<Sport, string> = {
  tenis: "bg-sport-tenis-bg text-sport-tenis-fg border-yellow",
  padel: "bg-sport-padel-bg text-sport-padel-fg border-celeste",
  pickleball: "bg-sport-pickle-bg text-sport-pickle-fg border-sport-pickle-border",
  gratuito: "bg-sport-gratis-bg text-sport-gratis-fg border-[#BBF7D0]",
  premium: "bg-orange text-white border-orange",
};

const labels: Record<Sport, string> = {
  tenis: "Tenis",
  padel: "Pádel",
  pickleball: "Pickleball",
  gratuito: "Gratuito",
  premium: "Premium",
};

export const SportBadge = ({ sport, className }: { sport: Sport; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 border rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide leading-tight",
      styles[sport],
      className
    )}
  >
    {sport === "premium" && <Star size={11} fill="currentColor" />}
    {labels[sport]}
  </span>
);
