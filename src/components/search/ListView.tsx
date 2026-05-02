import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import { SportBadge } from "@/components/brand/SportBadge";
import { cn } from "@/lib/utils";
import type { SearchCourt } from "@/data/courts";
import { toSlug } from "@/lib/geo";

interface Props {
  courts: SearchCourt[];
  loading?: boolean;
  onLoadMore?: () => void;
}

export const ListView = ({ courts, loading, onLoadMore }: Props) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListRowSkeleton key={i} last={i === 7} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {courts.map((c, i) => (
          <ListRow key={c.id} court={c} last={i === courts.length - 1} />
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={onLoadMore}
          className="inline-flex items-center justify-center px-6 h-11 rounded-md bg-orange text-white text-[13px] font-semibold uppercase tracking-wider hover:brightness-90 transition"
        >
          Cargar más
        </button>
      </div>
    </>
  );
};

const ListRow = ({ court, last }: { court: SearchCourt; last: boolean }) => {
  const href = `/canchas/argentina/${toSlug(court.city)}/${toSlug(court.neighborhood)}/${toSlug(court.name)}`;
  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 transition-colors relative",
        !last && "border-b border-border",
        court.premium
          ? "bg-[rgba(232,99,42,0.04)] border-l-[3px] border-l-orange pl-[13px]"
          : "hover:bg-light hover:border-l-[3px] hover:border-l-orange hover:pl-[13px]"
      )}
    >
      {/* Row 1 (mobile) / Left+Center (desktop) */}
      <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
          <img src={court.thumb} alt={court.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[16px] text-dark leading-tight truncate">{court.name}</h3>
            {court.premium && (
              <span className="inline-flex items-center gap-1 bg-orange text-white px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase leading-none shrink-0">
                <Star size={10} fill="currentColor" strokeWidth={0} /> Premium
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-[13px] text-gray">
            <MapPin size={12} className="text-orange shrink-0" />
            {court.neighborhood} · {court.city}
          </p>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {court.sports.map((s) => (
              <SportBadge key={s} sport={s} />
            ))}
          </div>
          <p className="text-[12px] text-gray pt-0.5">
            {court.surface} · Iluminación · 4 canchas
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end gap-2 md:w-[200px] md:text-right shrink-0 pl-[92px] md:pl-0">
        {court.distanceKm !== undefined && (
          <span className="text-orange font-semibold text-[13px]">
            {court.distanceKm.toFixed(1)} km
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 h-8 rounded-md border border-orange text-orange text-[12px] font-semibold uppercase tracking-wider hover:bg-orange hover:text-white transition">
            Ver ficha <ArrowRight size={12} />
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "tel:+5491100000000";
            }}
            aria-label="Llamar al club"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-border text-dark hover:border-orange hover:text-orange transition"
          >
            <Phone size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

const ListRowSkeleton = ({ last }: { last: boolean }) => (
  <div className={cn("flex gap-4 p-4", !last && "border-b border-border")}>
    <div className="w-20 h-20 rounded-lg bg-muted animate-pulse shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
      <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
    </div>
    <div className="w-[120px] space-y-2 hidden md:block">
      <div className="h-3 w-16 bg-muted animate-pulse rounded ml-auto" />
      <div className="h-8 w-full bg-muted animate-pulse rounded" />
    </div>
  </div>
);
