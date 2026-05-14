import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { SportBadge } from "@/components/brand/SportBadge";
import { ClubPhoto } from "@/components/ClubPhoto";
import { cn } from "@/lib/utils";
import { getPrimarySportSlug } from "@/lib/queries";
import { buildClubHref, clubSports } from "@/lib/club-display";
import type { ClubCard } from "@/lib/directus-types";

interface Props {
  club: ClubCard;
  active?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  /** When set, renders the distance pill beside the location row. */
  distanceKm?: number;
}

const fmtKm = (km: number): string =>
  km < 10
    ? `${km.toFixed(1).replace(".", ",")} km`
    : `${Math.round(km)} km`;

export const ResultCard = ({ club, active, onClick, onHover, distanceKm }: Props) => {
  const sports = clubSports(club.clubes_deportes);
  const primary = getPrimarySportSlug(club.clubes_deportes ?? []);
  const location = club.barrio?.nombre
    ? `${club.barrio.nombre} · ${club.ciudad.nombre}`
    : club.ciudad.nombre;

  return (
    <Link
      to={buildClubHref(club)}
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        "group w-full text-left flex gap-3 p-3 border-b border-border transition-colors relative",
        "hover:bg-light",
        active && "bg-light",
        club.es_premium
          ? "border-l-[3px] border-l-orange pl-[9px]"
          : "hover:border-l-[3px] hover:border-l-orange hover:pl-[9px]"
      )}
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
        <ClubPhoto
          clubName={club.nombre}
          fileId={club.foto_portada?.id ?? null}
          primarySportSlug={primary}
          width={160}
          height={160}
          size="sm"
          className="w-full h-full object-cover"
        />
        {club.es_premium && (
          <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center">
            <Star size={11} fill="currentColor" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-semibold text-[14px] text-dark leading-tight truncate">
          {club.nombre}
        </h3>
        <p className="flex items-center gap-1 text-[12px] text-gray">
          <MapPin size={11} className="text-orange shrink-0" />
          <span className="truncate">{location}</span>
          {distanceKm != null && (
            <span className="ml-1 shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full bg-orange/10 text-dark text-[11px] font-medium">
              a {fmtKm(distanceKm)}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-1 pt-0.5">
          {sports.map((s) => (
            <SportBadge key={s} sport={s} />
          ))}
        </div>
      </div>
      <ArrowRight
        size={16}
        className="self-center text-gray group-hover:text-orange shrink-0 transition"
      />
    </Link>
  );
};

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
