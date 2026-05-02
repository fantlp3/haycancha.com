import { ArrowRight, MapPin, Star } from "lucide-react";
import { SportBadge } from "@/components/brand/SportBadge";
import { cn } from "@/lib/utils";
import type { SearchCourt } from "@/data/courts";

interface Props {
  court: SearchCourt;
  active?: boolean;
  onClick?: () => void;
  onHover?: () => void;
}

export const ResultCard = ({ court, active, onClick, onHover }: Props) => (
  <button
    onClick={onClick}
    onMouseEnter={onHover}
    className={cn(
      "group w-full text-left flex gap-3 p-3 border-b border-border transition-colors relative",
      "hover:bg-light",
      active && "bg-light",
      court.premium
        ? "border-l-[3px] border-l-orange pl-[9px]"
        : "hover:border-l-[3px] hover:border-l-orange hover:pl-[9px]"
    )}
  >
    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
      <img src={court.thumb} alt={court.name} className="w-full h-full object-cover" loading="lazy" />
      {court.premium && (
        <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center">
          <Star size={11} fill="currentColor" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-[14px] text-dark leading-tight truncate">{court.name}</h3>
        {court.distanceKm !== undefined && (
          <span className="text-orange font-semibold text-[12px] shrink-0">
            {court.distanceKm.toFixed(1)} km
          </span>
        )}
      </div>
      <p className="flex items-center gap-1 text-[12px] text-gray">
        <MapPin size={11} className="text-orange shrink-0" />
        {court.neighborhood} · {court.city}
      </p>
      <div className="flex flex-wrap gap-1 pt-0.5">
        {court.sports.map((s) => (
          <SportBadge key={s} sport={s} />
        ))}
      </div>
    </div>
    <ArrowRight
      size={16}
      className="self-center text-gray group-hover:text-orange shrink-0 transition"
    />
  </button>
);

export const ResultCardSkeleton = () => (
  <div className="flex gap-3 p-3 border-b border-border">
    <div className="w-20 h-20 rounded-lg bg-muted animate-pulse shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
      <div className="flex gap-1.5">
        <div className="h-4 w-12 rounded bg-muted animate-pulse" />
        <div className="h-4 w-12 rounded bg-muted animate-pulse" />
      </div>
    </div>
  </div>
);
