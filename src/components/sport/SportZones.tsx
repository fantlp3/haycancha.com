import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHomeStats } from "@/hooks/useClubes";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportZones = ({ sport }: Props) => {
  const { countsBySportByCountry, isLoading } = useHomeStats();
  const zones = countsBySportByCountry?.[sport.key] ?? [];

  return (
    <section className="bg-light py-16">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
          EXPLORÁ POR PAÍS
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[88px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : zones.length === 0 ? (
          <p className="text-gray text-[14px]">
            Aún no hay clubes de {sport.ofName} cargados en el directorio.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {zones.map((z) => (
              <a
                key={z.paisSlug}
                href={`/canchas/${z.paisSlug}?deporte=${sport.key}`}
                className={cn(
                  "group bg-white border border-border rounded-lg p-5 flex items-center justify-between gap-3 transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
                  `hover:border-${sport.color}`
                )}
                style={{ borderLeft: `3px solid ${sport.hex}` }}
              >
                <div>
                  <div className="font-semibold text-[14px] text-dark flex items-center gap-2">
                    {z.paisBandera && <span aria-hidden>{z.paisBandera}</span>}
                    {z.paisNombre}
                  </div>
                  <div className="text-[12px] text-gray mt-0.5">
                    {z.totalClubes} {z.totalClubes === 1 ? "club" : "clubes"}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  style={{ color: sport.hex }}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
