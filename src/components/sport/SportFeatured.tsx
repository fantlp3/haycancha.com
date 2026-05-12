import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SportBadge } from "@/components/brand/SportBadge";
import { ClubPhoto } from "@/components/ClubPhoto";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubesByDeporte } from "@/hooks/useClubes";
import { buildClubHref } from "@/lib/club-display";
import type { SportConfig } from "@/lib/sports";
import type { ClubCard } from "@/lib/directus-types";

interface Props {
  sport: SportConfig;
}

const SkeletonCard = () => (
  <article className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </article>
);

export const SportFeatured = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  const borderL = `border-l-${sport.color}`;
  const { data, isLoading, isError } = useClubesByDeporte(sport.key);

  const sortedClubs: ClubCard[] = (data ?? [])
    .slice()
    .sort((a, b) => {
      // premium first, then alphabetical (es)
      if (a.es_premium !== b.es_premium) return a.es_premium ? -1 : 1;
      return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    });
  const totalCount = sortedClubs.length;
  const clubs: ClubCard[] = sortedClubs.slice(0, 6);
  const countLabel =
    totalCount === 1
      ? `1 cancha de ${sport.ofName} encontrada`
      : `${totalCount} canchas de ${sport.ofName} encontradas`;

  return (
    <section className="bg-white py-16">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <div
          className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[3px]"
          style={{ color: sport.hex }}
        >
          <span className="flex-1 h-px" style={{ backgroundColor: sport.hex, opacity: 0.5 }} />
          <span>Canchas destacadas de {sport.ofName}</span>
          <span className="flex-1 h-px" style={{ backgroundColor: sport.hex, opacity: 0.5 }} />
        </div>

        {!isLoading && !isError && totalCount > 0 && (
          <p className="-mt-6 text-center text-[13px] text-gray">{countLabel}</p>
        )}

        {isError ? (
          <p className="text-center text-gray py-12">
            No pudimos cargar las canchas en este momento.
          </p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray">
              Aún no hay canchas de {sport.ofName} en nuestro directorio.
            </p>
            <Link
              to="/agregar-cancha"
              className={cn("inline-flex items-center gap-2 font-semibold hover:underline", text)}
            >
              Sé el primero en agregar una <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clubs.map((c) => {
              const fileId = c.foto_portada?.id ?? null;
              const location = c.barrio?.nombre
                ? `${c.barrio.nombre} · ${c.ciudad.nombre}`
                : c.ciudad.nombre;
              return (
                <Link
                  key={c.id}
                  to={buildClubHref(c)}
                  className={cn(
                    "group block bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover",
                    c.es_premium && cn("border-l-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.10)]", borderL)
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <ClubPhoto
                      clubName={c.nombre}
                      fileId={fileId}
                      primarySportSlug={sport.key}
                      width={640}
                      height={400}
                      size="lg"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <SportBadge sport={sport.key} />
                    </div>
                    {c.es_premium && (
                      <span
                        className="absolute top-3 right-3 inline-flex items-center gap-1 text-dark px-2 py-1 rounded text-[10px] font-bold uppercase tracking-[1px] shadow-md"
                        style={{ backgroundColor: sport.hex }}
                      >
                        <Star size={10} fill="currentColor" strokeWidth={0} />
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[16px] text-dark leading-tight">{c.nombre}</h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-gray">
                      <MapPin size={14} className="text-orange shrink-0" />
                      {location}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            to={`/canchas?deporte=${sport.key}`}
            className={cn(
              "inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider hover:underline",
              text
            )}
          >
            Ver todas las canchas de {sport.ofName} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
