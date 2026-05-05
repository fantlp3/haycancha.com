import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { ClubPhoto } from "@/components/ClubPhoto";
import { SportBadge } from "@/components/brand/SportBadge";
import { cn } from "@/lib/utils";
import { getPrimarySportSlug } from "@/lib/queries";
import { buildClubHref, clubSports } from "@/lib/club-display";
import type { ClubCard } from "@/lib/directus-types";

interface Props {
  clubs: ClubCard[];
  loading?: boolean;
  onLoadMore?: () => void;
}

export const ListView = ({ clubs, loading, onLoadMore }: Props) => {
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
        {clubs.map((c, i) => (
          <ListRow key={c.id} club={c} last={i === clubs.length - 1} />
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

const ListRow = ({ club, last }: { club: ClubCard; last: boolean }) => {
  const sports = clubSports(club.clubes_deportes);
  const primary = getPrimarySportSlug(club.clubes_deportes ?? []);
  const location = club.barrio?.nombre
    ? `${club.barrio.nombre} · ${club.ciudad.nombre}`
    : club.ciudad.nombre;

  return (
    <Link
      to={buildClubHref(club)}
      className={cn(
        "group flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 transition-colors relative",
        !last && "border-b border-border",
        club.es_premium
          ? "bg-[rgba(232,99,42,0.04)] border-l-[3px] border-l-orange pl-[13px]"
          : "hover:bg-light hover:border-l-[3px] hover:border-l-orange hover:pl-[13px]"
      )}
    >
      <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
          <ClubPhoto
            clubName={club.nombre}
            fileId={club.foto_portada?.id ?? null}
            primarySportSlug={primary}
            width={160}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[16px] text-dark leading-tight truncate">
              {club.nombre}
            </h3>
            {club.es_premium && (
              <span className="inline-flex items-center gap-1 bg-orange text-white px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase leading-none shrink-0">
                <Star size={10} fill="currentColor" strokeWidth={0} /> Premium
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-[13px] text-gray">
            <MapPin size={12} className="text-orange shrink-0" />
            {location}
          </p>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {sports.map((s) => (
              <SportBadge key={s} sport={s} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end gap-2 md:w-[200px] md:text-right shrink-0 pl-[92px] md:pl-0">
        <span className="inline-flex items-center gap-1 px-3 h-8 rounded-md border border-orange text-orange text-[12px] font-semibold uppercase tracking-wider hover:bg-orange hover:text-white transition">
          Ver ficha <ArrowRight size={12} />
        </span>
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
