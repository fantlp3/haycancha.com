import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ClubPhoto } from "@/components/ClubPhoto";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubesPremium } from "@/hooks/useClubes";
import { buildClubHref } from "@/lib/club-display";
import { getPrimarySportSlug } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { ClubCard } from "@/lib/directus-types";

const SkeletonCard = () => (
  <article className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </article>
);

const PremiumCard = ({ club }: { club: ClubCard }) => {
  const fileId = club.foto_portada?.id ?? null;
  const primarySportSlug = getPrimarySportSlug((club.clubes_deportes ?? []) as any);
  const location = club.barrio?.nombre
    ? `${club.barrio.nombre} · ${club.ciudad.nombre}`
    : club.ciudad.nombre;

  return (
    <Link
      to={buildClubHref(club)}
      className={cn(
        "group block bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1",
        club.es_premium
          ? "border-l-[3px] border-l-orange shadow-[0_6px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
          : "shadow-card hover:shadow-card-hover"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
        <ClubPhoto
          clubName={club.nombre}
          fileId={fileId}
          primarySportSlug={primarySportSlug}
          width={640}
          height={400}
          size="lg"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {club.es_premium && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-orange text-white px-2 py-1 rounded text-[10px] font-semibold uppercase leading-none tracking-[1px] shadow-md">
            <Star size={10} fill="currentColor" strokeWidth={0} />
            Premium
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-body font-bold text-[16px] text-dark leading-tight">{club.nombre}</h3>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-gray">
          <MapPin size={14} className="text-orange shrink-0" />
          {location}
        </p>
      </div>
    </Link>
  );
};

export const FeaturedCourts = () => {
  const { data: clubs, isLoading, isError, error } = useClubesPremium(6);

  if (isError) {
    console.warn("[FeaturedCourts] failed to load premium clubs:", error);
    return null;
  }

  if (!isLoading && (!clubs || clubs.length === 0)) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
            CANCHAS DESTACADAS
          </h2>
          <Link
            to="/canchas"
            className="inline-flex items-center gap-1 text-orange font-medium text-[14px] hover:underline shrink-0"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : clubs!.map((club) => <PremiumCard key={club.id} club={club} />)}
        </div>
      </div>
    </section>
  );
};
