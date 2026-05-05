import { ArrowRight } from "lucide-react";
import { useHomeStats } from "@/hooks/useClubes";
import { Skeleton } from "@/components/ui/skeleton";

const nfAR = new Intl.NumberFormat("es-AR");

const SkeletonCard = () => (
  <div className="bg-white border border-border rounded-lg p-5 flex items-center justify-between gap-3">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const ZoneSection = () => {
  const { countsByCountry, isLoading } = useHomeStats();
  const showSkeletons = isLoading || !countsByCountry;

  return (
    <section className="bg-light py-16 md:py-20">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
          EXPLORÁ POR PAÍS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {showSkeletons
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : countsByCountry!.map((c) => (
                <a
                  key={c.paisSlug}
                  href={`/canchas/${c.paisSlug}`}
                  className="group bg-white border border-border rounded-lg p-5 flex items-center justify-between gap-3 transition-all hover:bg-orange hover:border-orange hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div>
                    <div className="font-semibold text-[14px] text-dark group-hover:text-white">
                      {c.paisBandera ? `${c.paisBandera} ` : ""}{c.paisNombre}
                    </div>
                    <div className="text-[12px] text-gray group-hover:text-white/80 mt-0.5">
                      {nfAR.format(c.totalClubes)} canchas
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-orange group-hover:text-white transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              ))}
        </div>
      </div>
    </section>
  );
};
