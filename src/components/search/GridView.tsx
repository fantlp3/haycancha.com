import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
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
  /**
   * Optional node inserted after the 6th card. Caller is responsible for
   * making it mobile-only (e.g. wrap with `md:hidden`); in desktop's 3-col
   * grid the node still takes a cell otherwise.
   */
  mobilePromo?: ReactNode;
}

export const GridView = ({ clubs, loading, onLoadMore, mobilePromo }: Props) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <GridCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clubs.map((c, i) => {
          const sports = clubSports(c.clubes_deportes);
          const primary = getPrimarySportSlug(c.clubes_deportes ?? []);
          const location = c.barrio?.nombre
            ? `${c.barrio.nombre} · ${c.ciudad.nombre}`
            : c.ciudad.nombre;
          return (
            <Fragment key={c.id}>
            <Link
              to={buildClubHref(c)}
              className={cn(
                "group block bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                c.es_premium
                  ? "border-l-[3px] border-l-orange shadow-[0_6px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
                  : "shadow-card hover:shadow-card-hover"
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                <ClubPhoto
                  clubName={c.nombre}
                  fileId={c.foto_portada?.id ?? null}
                  primarySportSlug={primary}
                  width={640}
                  height={400}
                  size="md"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {sports.map((s) => (
                    <SportBadge key={s} sport={s} />
                  ))}
                </div>
                {c.es_premium && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-orange text-white px-2 py-1 rounded text-[10px] font-semibold uppercase leading-none tracking-[1px] shadow-md">
                    <Star size={10} fill="currentColor" strokeWidth={0} />
                    Premium
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-body font-bold text-[16px] text-dark leading-tight">
                  {c.nombre}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[13px] text-gray">
                  <MapPin size={14} className="text-orange shrink-0" />
                  {location}
                </p>
              </div>
            </Link>
            {i === 5 && mobilePromo}
            </Fragment>
          );
        })}
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

const GridCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="aspect-[16/10] bg-muted animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
      <div className="h-8 w-full bg-muted animate-pulse rounded mt-3" />
    </div>
  </div>
);
